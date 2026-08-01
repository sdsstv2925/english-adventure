from __future__ import annotations

import base64
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright

START_URLS = [
    "https://sinsy.sp.nitech.ac.jp/ja",
    "https://sinsy.sp.nitech.ac.jp/en",
    "https://sinsy.sp.nitech.ac.jp/",
]
WORK = Path("roy_song_work")
SCORE = WORK / "roy_song.musicxml"
OUT = WORK / "roy_vocal.wav"


def dump_controls(page) -> None:
    print("PAGE", page.url, page.title())
    print("INPUTS")
    for index, locator in enumerate(page.locator("input").all()):
        try:
            print(index, locator.evaluate(
                "e => ({type:e.type,name:e.name,id:e.id,min:e.min,max:e.max,value:e.value,accept:e.accept,outer:e.outerHTML.slice(0,500)})"
            ))
        except Exception as exc:
            print(index, "ERROR", exc)

    print("SELECTS")
    for index, locator in enumerate(page.locator("select").all()):
        try:
            data = locator.evaluate(
                "e => ({name:e.name,id:e.id,value:e.value,outer:e.outerHTML.slice(0,800),options:[...e.options].map(o=>({text:(o.textContent||'').trim(),value:o.value}))})"
            )
            print(index, data)
        except Exception as exc:
            print(index, "ERROR", exc)

    print("BUTTONS")
    for index, locator in enumerate(page.locator("button").all()):
        try:
            print(index, locator.evaluate(
                "e => ({text:(e.textContent||'').trim(),name:e.name,id:e.id,type:e.type,disabled:e.disabled,outer:e.outerHTML.slice(0,500)})"
            ))
        except Exception as exc:
            print(index, "ERROR", exc)


def choose_matching_option(select, patterns: list[str]) -> bool:
    options = select.locator("option").evaluate_all(
        "opts => opts.map(o => ({text:(o.textContent||'').trim(),value:o.value}))"
    )
    for pattern in patterns:
        regex = re.compile(pattern, re.I)
        for option in options:
            if regex.search(option["text"]) or regex.search(option["value"]):
                select.select_option(option["value"])
                print("SELECTED", option)
                return True
    return False


def set_input_value(locator, value: str) -> None:
    locator.evaluate(
        "(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",
        value,
    )


def configure_controls(page) -> None:
    selects = page.locator("select").all()

    # Language selector.
    for select in selects:
        options = select.locator("option").evaluate_all(
            "opts => opts.map(o => ((o.textContent||'')+' '+o.value).trim())"
        )
        if any(re.search(r"english|英語", option, re.I) for option in options):
            choose_matching_option(select, [r"^English$", r"English", r"英語"])
            page.wait_for_timeout(1200)
            break

    # Vocal selector. Prefer the English male bank, otherwise DNN English.
    for select in page.locator("select").all():
        options = select.locator("option").evaluate_all(
            "opts => opts.map(o => ((o.textContent||'')+' '+o.value).trim())"
        )
        joined = " ".join(options)
        if re.search(r"m00003e|f00002e|Matsuo|Xiang", joined, re.I):
            choose_matching_option(select, [r"m00003e_beta", r"Matsuo", r"f00002e_dnn_beta5", r"Xiang", r"f00002e"])
            break

    # Use label text and numeric ranges to identify ALP/VIB/PIT controls.
    for locator in page.locator("input").all():
        try:
            meta = locator.evaluate(
                "e=>({type:e.type,name:e.name,id:e.id,min:e.min,max:e.max,value:e.value,aria:e.getAttribute('aria-label')||'',outer:e.outerHTML})"
            )
        except Exception:
            continue
        if meta["type"] not in {"number", "range", "text"}:
            continue

        identity = f"{meta['name']} {meta['id']} {meta['aria']} {meta['outer']}".lower()
        target = None
        if re.search(r"alp|gender|alpha", identity):
            # Current DNN range: smaller ALP sounds younger.
            target = "0.45"
        elif re.search(r"vib|vibrato", identity):
            target = "1.15"
        elif re.search(r"pit|pitch|shift", identity):
            target = "2"
        elif meta["min"] == "0.45" and meta["max"] == "0.65":
            target = "0.45"
        elif meta["min"] == "-0.8" and meta["max"] == "0.8":
            target = "-0.25"
        elif meta["min"] in {"0", "0.0"} and meta["max"] in {"2", "2.0"}:
            target = "1.15"
        elif meta["min"] in {"-24", "-24.0"} and meta["max"] in {"24", "24.0"}:
            target = "2"

        if target is not None:
            set_input_value(locator, target)
            print("SET", meta, "->", target)


def find_audio_candidates(page) -> list[str]:
    candidates: list[str] = []
    for selector, attribute in [
        ("audio", "src"),
        ("audio source", "src"),
        ("source[src]", "src"),
        ("a[href]", "href"),
    ]:
        for locator in page.locator(selector).all():
            try:
                value = locator.get_attribute(attribute)
            except Exception:
                value = None
            if not value:
                continue
            if value.startswith("blob:") or re.search(r"\.(wav|mp3|ogg)(?:[?#]|$)", value, re.I) or "download" in value.lower():
                candidates.append(value)

    html = page.content()
    candidates.extend(re.findall(
        r"(?:https?://|/)[^\"'<>\s]+\.(?:wav|mp3|ogg)(?:\?[^\"'<>\s]*)?",
        html,
        flags=re.I,
    ))
    return list(dict.fromkeys(candidate.replace("&amp;", "&") for candidate in candidates))


def download_candidate(page, context, candidate: str) -> bytes | None:
    print("AUDIO CANDIDATE", candidate)
    if candidate.startswith("blob:"):
        try:
            encoded = page.evaluate(
                """async url => {
                  const response = await fetch(url);
                  if (!response.ok) throw new Error('HTTP '+response.status);
                  const bytes = new Uint8Array(await response.arrayBuffer());
                  let binary='';
                  const chunk=0x8000;
                  for(let i=0;i<bytes.length;i+=chunk){binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));}
                  return btoa(binary);
                }""",
                candidate,
            )
            data = base64.b64decode(encoded)
            if len(data) > 10000:
                return data
        except Exception as exc:
            print("BLOB FAILED", exc)
        return None

    absolute = urljoin(page.url, candidate)
    try:
        response = context.request.get(absolute, timeout=120000, ignore_https_errors=True)
        if response.ok:
            data = response.body()
            print("AUDIO RESPONSE", response.status, response.headers.get("content-type", ""), len(data))
            if len(data) > 10000:
                return data
    except Exception as exc:
        print("URL FAILED", exc)
    return None


def main() -> None:
    if not SCORE.exists():
        raise FileNotFoundError(SCORE)
    WORK.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True, ignore_https_errors=True)
        page = context.new_page()
        downloaded: list[Path] = []

        def save_download(download) -> None:
            target = WORK / f"download_{len(downloaded)}_{download.suggested_filename}"
            try:
                download.save_as(target)
                downloaded.append(target)
                print("DOWNLOADED", target, target.stat().st_size)
            except Exception as exc:
                print("DOWNLOAD FAILED", exc)

        page.on("download", save_download)

        last_error = None
        for url in START_URLS:
            try:
                response = page.goto(url, wait_until="networkidle", timeout=120000)
                print("GOTO", url, "=>", page.url, response.status if response else None)
                page.wait_for_timeout(2500)
                if page.locator("input[type=file]").count() > 0:
                    break
                dump_controls(page)
            except Exception as exc:
                last_error = exc
                print("GOTO FAILED", url, repr(exc))
        else:
            page.screenshot(path=str(WORK / "sinsy_no_form.png"), full_page=True)
            (WORK / "sinsy_no_form.html").write_text(page.content(), encoding="utf-8")
            raise RuntimeError(f"Current Sinsy upload input was not found: {last_error}")

        dump_controls(page)
        configure_controls(page)

        file_input = page.locator("input[type=file]").first
        file_input.set_input_files(str(SCORE.resolve()))
        page.wait_for_timeout(1000)
        page.screenshot(path=str(WORK / "sinsy_before_submit.png"), full_page=True)

        submit = page.get_by_role("button", name=re.compile(r"歌声を合成|synthesi[sz]e|synthesis|send", re.I)).first
        if submit.count() == 0:
            submit = page.locator("button[type=submit], input[type=submit]").first
        if submit.count() == 0:
            raise RuntimeError("Current Sinsy synthesis button was not found")

        print("CLICKING", submit.evaluate("e=>e.outerHTML"))
        submit.click(force=True)

        data = None
        deadline = time.time() + 360
        while time.time() < deadline:
            page.wait_for_timeout(2000)

            for path in list(downloaded):
                if path.exists() and path.stat().st_size > 10000:
                    raw = path.read_bytes()
                    if raw[:4] == b"RIFF" or raw[:3] == b"ID3" or raw[:4] == b"OggS":
                        data = raw
                        break
            if data is not None:
                break

            for candidate in find_audio_candidates(page):
                data = download_candidate(page, context, candidate)
                if data is not None:
                    break
            if data is not None:
                break

            body = page.locator("body").inner_text(timeout=10000)
            print("WAITING", page.url, body[-500:].replace("\n", " | "))

        page.screenshot(path=str(WORK / "sinsy_after_submit.png"), full_page=True)
        (WORK / "sinsy_after_submit.html").write_text(page.content(), encoding="utf-8")
        browser.close()

    if data is None:
        raise RuntimeError("Sinsy did not provide a singing audio file within six minutes")

    OUT.write_bytes(data)
    print("SAVED", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR", exc, file=sys.stderr)
        raise
