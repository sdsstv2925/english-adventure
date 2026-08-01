from __future__ import annotations

import base64
import re
import ssl
import sys
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright

APP_URL = "https://sinsy.sp.nitech.ac.jp/ja"
WORK = Path("roy_song_work")
SCORE = WORK / "roy_song.musicxml"
OUT = WORK / "roy_vocal.wav"


def fetch_app_html() -> str:
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    request = urllib.request.Request(
        APP_URL,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urllib.request.urlopen(request, context=context, timeout=90) as response:
        raw = response.read()
        if response.status != 200 or len(raw) < 20000:
            raise RuntimeError(f"Unexpected Sinsy response: {response.status}, {len(raw)} bytes")
        return raw.decode("utf-8", errors="replace")


def hidden_input_parent_combo(page, value_pattern: str):
    hidden_inputs = page.locator("input.MuiSelect-nativeInput")
    regex = re.compile(value_pattern, re.I)
    for index in range(hidden_inputs.count()):
        hidden = hidden_inputs.nth(index)
        value = hidden.input_value()
        if not regex.search(value):
            continue
        parent = hidden.locator("xpath=..")
        combo = parent.locator('[role="combobox"]')
        if combo.count():
            return combo.first
        combo = hidden.locator('xpath=preceding-sibling::*[@role="combobox"][1]')
        if combo.count():
            return combo.first
    return None


def choose_option(page, combo, patterns: list[str]) -> bool:
    if combo is None:
        return False
    combo.click(force=True)
    page.wait_for_timeout(350)
    options = page.locator('[role="option"]')
    snapshot = []
    for index in range(options.count()):
        option = options.nth(index)
        text = (option.inner_text() or "").strip()
        snapshot.append(text)
    print("OPEN OPTIONS", snapshot)
    for pattern in patterns:
        regex = re.compile(pattern, re.I)
        for index, text in enumerate(snapshot):
            if regex.search(text):
                options.nth(index).click(force=True)
                page.wait_for_timeout(900)
                print("CHOSEN OPTION", text)
                return True
    page.keyboard.press("Escape")
    return False


def configure_english_voice(page) -> None:
    print("HIDDEN SELECT VALUES", page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    ))

    # The language selector initially contains the value "japanese".
    language_combo = hidden_input_parent_combo(page, r"^(japanese|english)$")
    if not choose_option(page, language_combo, [r"^English$", r"英語", r"English"]):
        raise RuntimeError("Could not switch Sinsy to English")

    page.wait_for_timeout(1200)
    print("VALUES AFTER LANGUAGE", page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    ))

    # Prefer the male English bank for Roy. Fall back to the English DNN bank.
    voice_combo = hidden_input_parent_combo(page, r"(?:f|m)\d{5}[a-z]_")
    if voice_combo is None:
        # After changing language, locate the final combobox (voice selector).
        combos = page.locator('[role="combobox"]')
        if combos.count() >= 3:
            voice_combo = combos.nth(combos.count() - 1)
    if not choose_option(page, voice_combo, [r"Matsuo", r"m00003e", r"Xiang", r"f00002e", r"English"]):
        raise RuntimeError("Could not select an English singing voice")

    # ALP (voice character), VIB (vibrato), PIT (pitch shift).
    ranges = page.locator('input[type="range"]')
    for index in range(ranges.count()):
        slider = ranges.nth(index)
        minimum = slider.get_attribute("min") or ""
        maximum = slider.get_attribute("max") or ""
        if minimum == "0.45" and maximum == "0.65":
            value = "0.45"  # lighter/younger voice character
        elif minimum in {"0", "0.0"} and maximum in {"2", "2.0"}:
            value = "1.12"  # natural, audible vibrato
        elif minimum in {"-24", "-24.0"} and maximum in {"24", "24.0"}:
            value = "2"     # modest upward shift, not a chipmunk effect
        else:
            continue
        slider.evaluate(
            "(e,v)=>{e.value=v;e.setAttribute('value',v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",
            value,
        )
        print("SET RANGE", minimum, maximum, value)


def find_audio_candidates(page) -> list[str]:
    result: list[str] = []
    for selector, attribute in [
        ("audio", "src"),
        ("audio source", "src"),
        ("source[src]", "src"),
        ("a[href]", "href"),
    ]:
        locators = page.locator(selector)
        for index in range(locators.count()):
            value = locators.nth(index).get_attribute(attribute)
            if not value:
                continue
            if value.startswith("blob:") or re.search(r"\.(wav|mp3|ogg)(?:[?#]|$)", value, re.I) or "download" in value.lower():
                result.append(value)
    html = page.content()
    result.extend(re.findall(
        r"(?:https?://|/)[^\"'<>\s]+\.(?:wav|mp3|ogg)(?:\?[^\"'<>\s]*)?",
        html,
        flags=re.I,
    ))
    return list(dict.fromkeys(value.replace("&amp;", "&") for value in result))


def read_candidate(page, context, candidate: str) -> bytes | None:
    print("AUDIO CANDIDATE", candidate)
    if candidate.startswith("blob:"):
        encoded = page.evaluate(
            """async url => {
              const response = await fetch(url);
              if (!response.ok) throw new Error('HTTP '+response.status);
              const bytes = new Uint8Array(await response.arrayBuffer());
              let binary='';
              const chunk=0x8000;
              for(let i=0;i<bytes.length;i+=chunk){
                binary += String.fromCharCode(...bytes.subarray(i,i+chunk));
              }
              return btoa(binary);
            }""",
            candidate,
        )
        data = base64.b64decode(encoded)
        return data if len(data) > 10000 else None

    absolute = urljoin(page.url, candidate)
    response = context.request.get(absolute, timeout=180000, ignore_https_errors=True)
    if not response.ok:
        return None
    data = response.body()
    print("AUDIO RESPONSE", response.status, response.headers.get("content-type", ""), len(data))
    return data if len(data) > 10000 else None


def main() -> None:
    if not SCORE.exists():
        raise FileNotFoundError(SCORE)
    WORK.mkdir(parents=True, exist_ok=True)
    app_html = fetch_app_html()
    (WORK / "sinsy_injected_source.html").write_text(app_html, encoding="utf-8")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True, ignore_https_errors=True)
        page = context.new_page()
        downloaded: list[Path] = []
        captured_audio: list[bytes] = []

        def route_initial_document(route, request) -> None:
            if request.is_navigation_request() and request.resource_type == "document" and request.url.rstrip("/") == APP_URL.rstrip("/"):
                route.fulfill(status=200, content_type="text/html; charset=utf-8", body=app_html)
            else:
                route.continue_()

        def save_download(download) -> None:
            target = WORK / f"download_{len(downloaded)}_{download.suggested_filename}"
            download.save_as(target)
            downloaded.append(target)
            print("BROWSER DOWNLOAD", target, target.stat().st_size)

        def capture_response(response) -> None:
            content_type = (response.headers.get("content-type") or "").lower()
            if not content_type.startswith("audio/"):
                return
            try:
                data = response.body()
                if len(data) > 10000:
                    captured_audio.append(data)
                    print("CAPTURED AUDIO RESPONSE", response.url, content_type, len(data))
            except Exception as exc:
                print("AUDIO CAPTURE FAILED", exc)

        page.route("**/*", route_initial_document)
        page.on("download", save_download)
        page.on("response", capture_response)

        response = page.goto(APP_URL, wait_until="networkidle", timeout=180000)
        print("APP LOADED", page.url, response.status if response else None, page.title())
        page.wait_for_selector('input[type="file"]', state="attached", timeout=60000)
        page.wait_for_timeout(1800)

        configure_english_voice(page)

        file_input = page.locator('input[type="file"]').first
        file_input.set_input_files(str(SCORE.resolve()))
        page.wait_for_timeout(2200)

        button = page.get_by_role("button", name=re.compile(r"歌声を合成|synthesi[sz]e|synthesis", re.I)).first
        if button.count() == 0:
            raise RuntimeError("Sinsy synthesis button was not found")

        try:
            button.wait_for(state="visible", timeout=30000)
            page.wait_for_function(
                """() => {
                  const buttons=[...document.querySelectorAll('button')];
                  const button=buttons.find(b=>/歌声を合成|synthesi[sz]e|synthesis/i.test(b.textContent||''));
                  return !!button && !button.disabled;
                }""",
                timeout=45000,
            )
        except Exception:
            page.screenshot(path=str(WORK / "sinsy_score_rejected.png"), full_page=True)
            body = page.locator("body").inner_text()
            raise RuntimeError(f"MusicXML was not accepted by Sinsy. Page tail: {body[-900:]}")

        page.screenshot(path=str(WORK / "sinsy_before_submit.png"), full_page=True)
        print("CLICK SYNTHESIS")
        button.click(force=True)

        data = None
        deadline = time.time() + 420
        while time.time() < deadline:
            page.wait_for_timeout(1800)

            if captured_audio:
                data = max(captured_audio, key=len)
                break

            for path in downloaded:
                if path.exists() and path.stat().st_size > 10000:
                    raw = path.read_bytes()
                    if raw[:4] == b"RIFF" or raw[:3] == b"ID3" or raw[:4] == b"OggS":
                        data = raw
                        break
            if data is not None:
                break

            for candidate in find_audio_candidates(page):
                try:
                    data = read_candidate(page, context, candidate)
                except Exception as exc:
                    print("CANDIDATE FAILED", exc)
                if data is not None:
                    break
            if data is not None:
                break

            body = page.locator("body").inner_text(timeout=10000)
            print("WAITING", body[-500:].replace("\n", " | "))

        page.screenshot(path=str(WORK / "sinsy_after_submit.png"), full_page=True)
        (WORK / "sinsy_after_submit.html").write_text(page.content(), encoding="utf-8")
        browser.close()

    if data is None:
        raise RuntimeError("Sinsy did not return a singing audio file within seven minutes")

    OUT.write_bytes(data)
    print("SAVED VOCAL", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR", exc, file=sys.stderr)
        raise
