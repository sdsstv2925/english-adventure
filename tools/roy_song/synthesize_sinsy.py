from __future__ import annotations

import base64
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright

START_URLS = [
    "https://sinsy.sp.nitech.ac.jp/index.php",
    "https://sinsy.sp.nitech.ac.jp/en",
]
WORK = Path("roy_song_work")
SCORE = WORK / "roy_song.musicxml"
OUT = WORK / "roy_vocal.wav"


def option_snapshot(select) -> list[dict[str, str]]:
    return select.locator("option").evaluate_all(
        "opts => opts.map(o => ({text:(o.textContent||'').trim(), value:o.value}))"
    )


def choose_option_containing(select, patterns: list[str]) -> bool:
    options = option_snapshot(select)
    for pattern in patterns:
        rx = re.compile(pattern, re.I)
        for option in options:
            if rx.search(option["text"]) or rx.search(option["value"]):
                select.select_option(option["value"])
                print(f"Selected option: {option}")
                return True
    return False


def set_numeric_controls(page) -> None:
    inputs = page.locator("input").all()
    for inp in inputs:
        try:
            meta = inp.evaluate(
                "e => ({type:e.type,name:e.name,id:e.id,min:e.min,max:e.max,value:e.value})"
            )
        except Exception:
            continue
        if meta["type"] not in {"number", "range", "text"}:
            continue

        name = f"{meta['name']} {meta['id']}".lower()
        minimum = meta["min"]
        maximum = meta["max"]
        target = None

        if any(key in name for key in ("synalpha", "gender", "alpha", "alp")):
            target = "-0.25"
        elif any(key in name for key in ("vib", "vibrato")):
            target = "1.05"
        elif any(key in name for key in ("f0", "pitch", "shift", "pit")):
            target = "3"
        elif minimum in {"-0.8", "-0.80"} and maximum in {"0.8", "0.80"}:
            target = "-0.25"
        elif minimum in {"0", "0.0", "0.00"} and maximum in {"2", "2.0", "2.00"}:
            target = "1.05"
        elif minimum in {"-24", "-24.0"} and maximum in {"24", "24.0"}:
            target = "3"

        if target is None:
            continue

        try:
            inp.evaluate(
                "(e, v) => { e.value=v; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); }",
                target,
            )
            print(f"Set control {meta} -> {target}")
        except Exception as exc:
            print(f"Could not set {meta}: {exc}")


def extract_audio(page, context) -> bytes | None:
    candidates: list[str] = []

    for selector, attr in [
        ("audio", "src"),
        ("audio source", "src"),
        ("a[href]", "href"),
        ("source[src]", "src"),
    ]:
        for locator in page.locator(selector).all():
            try:
                value = locator.get_attribute(attr)
            except Exception:
                value = None
            if not value:
                continue
            if value.startswith("blob:") or re.search(r"\.(wav|mp3)(?:[?#]|$)", value, re.I) or "download" in value.lower():
                candidates.append(value)

    html = page.content()
    for match in re.findall(r"(?:https?://|/)[^\"'<>\s]+\.(?:wav|mp3)(?:\?[^\"'<>\s]*)?", html, re.I):
        candidates.append(match.replace("&amp;", "&"))

    seen = set()
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        print(f"Trying audio candidate: {candidate}")

        if candidate.startswith("blob:"):
            try:
                encoded = page.evaluate(
                    """async url => {
                      const response = await fetch(url);
                      if (!response.ok) throw new Error('HTTP ' + response.status);
                      const bytes = new Uint8Array(await response.arrayBuffer());
                      let binary = '';
                      const chunk = 0x8000;
                      for (let i=0; i<bytes.length; i+=chunk) {
                        binary += String.fromCharCode(...bytes.subarray(i, i+chunk));
                      }
                      return btoa(binary);
                    }""",
                    candidate,
                )
                data = base64.b64decode(encoded)
                if len(data) > 10000:
                    return data
            except Exception as exc:
                print(f"Blob download failed: {exc}")
            continue

        absolute = urljoin(page.url, candidate)
        try:
            response = context.request.get(absolute, timeout=120000)
            if response.ok:
                data = response.body()
                content_type = response.headers.get("content-type", "")
                print(f"Candidate response: {response.status}, {content_type}, {len(data)} bytes")
                if len(data) > 10000 and (data[:4] == b"RIFF" or data[:3] == b"ID3" or "audio" in content_type):
                    return data
        except Exception as exc:
            print(f"URL download failed: {exc}")

    return None


def main() -> None:
    if not SCORE.exists():
        raise FileNotFoundError(SCORE)
    WORK.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        downloaded: list[Path] = []

        def on_download(download) -> None:
            target = WORK / f"browser_download_{len(downloaded)}_{download.suggested_filename}"
            try:
                download.save_as(target)
                downloaded.append(target)
                print(f"Browser downloaded: {target} ({target.stat().st_size} bytes)")
            except Exception as exc:
                print(f"Download callback failed: {exc}")

        page.on("download", on_download)

        last_error = None
        for url in START_URLS:
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=120000)
                page.wait_for_timeout(2500)
                if page.locator("input[type=file]").count():
                    print(f"Loaded Sinsy: {page.url} — {page.title()}")
                    break
            except Exception as exc:
                last_error = exc
                print(f"Could not load {url}: {exc}")
        else:
            raise RuntimeError(f"Sinsy page did not load: {last_error}")

        print("Select controls:")
        for index, select in enumerate(page.locator("select").all()):
            print(index, option_snapshot(select))

        # Language selection: choose the selector that contains English.
        for select in page.locator("select").all():
            options = option_snapshot(select)
            if any(re.search(r"english", f"{o['text']} {o['value']}", re.I) for o in options):
                choose_option_containing(select, [r"^english$", r"english"])
                page.wait_for_timeout(1200)
                break

        # Voice selection: prefer the male English bank. Use the newer DNN English bank if unavailable.
        for select in page.locator("select").all():
            options = option_snapshot(select)
            joined = " ".join(f"{o['text']} {o['value']}" for o in options)
            if re.search(r"m00003e|f00002e|xiang|matsuo", joined, re.I):
                if not choose_option_containing(select, [r"m00003e_beta", r"Matsuo", r"f00002e_dnn_beta5", r"Xiang"]):
                    print("English vocal select found but no preferred option selected")
                break

        set_numeric_controls(page)
        file_input = page.locator("input[type=file]").first
        file_input.set_input_files(str(SCORE.resolve()))
        page.screenshot(path=str(WORK / "sinsy_before_submit.png"), full_page=True)

        buttons = page.locator("button, input[type=submit]")
        print("Submit candidates:")
        for index, button in enumerate(buttons.all()):
            try:
                print(index, button.evaluate("e => ({tag:e.tagName,text:(e.textContent||'').trim(),value:e.value,name:e.name,id:e.id,type:e.type})"))
            except Exception:
                pass

        submit = None
        for button in buttons.all():
            try:
                label = button.evaluate("e => ((e.textContent||'')+' '+(e.value||'')+' '+(e.name||'')+' '+(e.id||'')).trim()")
            except Exception:
                continue
            if re.search(r"synth|send|歌声|合成", label, re.I):
                submit = button
                break
        if submit is None:
            submit = page.locator("input[type=submit], button[type=submit]").first
        if submit.count() == 0:
            raise RuntimeError("Sinsy submit button was not found")

        submit.click(force=True)
        print("Synthesis submitted")

        deadline = time.time() + 300
        data = None
        while time.time() < deadline:
            page.wait_for_timeout(2500)

            for downloaded_file in list(downloaded):
                if downloaded_file.exists() and downloaded_file.stat().st_size > 10000:
                    raw = downloaded_file.read_bytes()
                    if raw[:4] == b"RIFF" or raw[:3] == b"ID3":
                        data = raw
                        break
            if data:
                break

            data = extract_audio(page, context)
            if data:
                break

            body_text = page.locator("body").inner_text(timeout=10000)
            print(f"Waiting… URL={page.url}; body tail={body_text[-350:]!r}")

        page.screenshot(path=str(WORK / "sinsy_after_submit.png"), full_page=True)
        (WORK / "sinsy_after_submit.html").write_text(page.content(), encoding="utf-8")
        browser.close()

    if not data:
        raise RuntimeError("Sinsy did not produce a downloadable audio file within five minutes")

    OUT.write_bytes(data)
    print(f"Saved {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
