from __future__ import annotations

import base64
import http.cookiejar
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

APP_URL = "https://sinsy.sp.nitech.ac.jp/ja"
HOST = "sinsy.sp.nitech.ac.jp"
WORK = Path("roy_song_work")
SCORE = WORK / "roy_song.musicxml"
OUT = WORK / "roy_vocal.wav"


def make_opener():
    tls = ssl.create_default_context()
    tls.check_hostname = False
    tls.verify_mode = ssl.CERT_NONE
    cookies = http.cookiejar.CookieJar()
    return urllib.request.build_opener(
        urllib.request.HTTPSHandler(context=tls),
        urllib.request.HTTPCookieProcessor(cookies),
    )


def forward_headers(playwright_headers: dict[str, str]) -> dict[str, str]:
    allowed = {
        "accept",
        "accept-language",
        "content-type",
        "origin",
        "referer",
        "user-agent",
        "x-nextjs-data",
        "next-action",
        "next-router-prefetch",
        "next-router-state-tree",
        "rsc",
    }
    result = {
        key: value
        for key, value in playwright_headers.items()
        if key.lower() in allowed
    }
    result["Accept-Encoding"] = "identity"
    result.setdefault(
        "User-Agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    )
    return result


def response_headers(headers) -> dict[str, str]:
    allowed = {
        "content-type",
        "content-disposition",
        "cache-control",
        "etag",
        "last-modified",
        "vary",
    }
    return {
        key: value
        for key, value in headers.items()
        if key.lower() in allowed
    }


def combo_for_value(page, pattern: str):
    regex = re.compile(pattern, re.I)
    inputs = page.locator("input.MuiSelect-nativeInput")
    for index in range(inputs.count()):
        hidden = inputs.nth(index)
        value = hidden.input_value()
        if not regex.search(value):
            continue
        parent = hidden.locator("xpath=..")
        combo = parent.locator('[role="combobox"]')
        if combo.count():
            return combo.first
    return None


def choose(page, combo, patterns: list[str]) -> str:
    if combo is None:
        raise RuntimeError("Required Sinsy combobox was not found")
    combo.scroll_into_view_if_needed()
    combo.click(force=True)
    page.wait_for_selector('[role="option"]', state="visible", timeout=15000)
    options = page.locator('[role="option"]')
    labels = [options.nth(i).inner_text().strip() for i in range(options.count())]
    print("OPTIONS", labels)
    for pattern in patterns:
        regex = re.compile(pattern, re.I)
        for index, label in enumerate(labels):
            if regex.search(label):
                options.nth(index).click(force=True)
                page.wait_for_timeout(1000)
                print("CHOSEN", label)
                return label
    page.keyboard.press("Escape")
    raise RuntimeError(f"No matching option among: {labels}")


def configure_voice(page) -> None:
    values = page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    )
    print("INITIAL SELECT VALUES", values)

    choose(
        page,
        combo_for_value(page, r"^(japanese|english)$"),
        [r"^English$", r"英語", r"English"],
    )

    page.wait_for_timeout(1200)
    values = page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    )
    print("ENGLISH SELECT VALUES", values)

    voice_combo = combo_for_value(page, r"^[fm]\d{5}[a-z]_.*")
    chosen_voice = choose(
        page,
        voice_combo,
        [r"Matsuo", r"m00003e", r"Xiang", r"f00002e", r"English"],
    )
    print("VOICE", chosen_voice)

    sliders = page.locator('input[type="range"]')
    for index in range(sliders.count()):
        slider = sliders.nth(index)
        minimum = slider.get_attribute("min") or ""
        maximum = slider.get_attribute("max") or ""
        if minimum == "0.45" and maximum == "0.65":
            value = "0.45"
        elif minimum in {"0", "0.0"} and maximum in {"2", "2.0"}:
            value = "1.12"
        elif minimum in {"-24", "-24.0"} and maximum in {"24", "24.0"}:
            value = "2"
        else:
            continue
        slider.focus()
        slider.evaluate(
            "(e,v)=>{const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(e,v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",
            value,
        )
        print("SLIDER", minimum, maximum, "=>", value)


def audio_from_page(page) -> bytes | None:
    sources = []
    for selector, attr in [("audio", "src"), ("audio source", "src"), ("a[href]", "href")]:
        locator = page.locator(selector)
        for index in range(locator.count()):
            value = locator.nth(index).get_attribute(attr)
            if value and (value.startswith("blob:") or re.search(r"\.(wav|mp3|ogg)(?:[?#]|$)", value, re.I)):
                sources.append(value)

    for source in dict.fromkeys(sources):
        print("AUDIO SOURCE", source)
        if source.startswith("blob:"):
            encoded = page.evaluate(
                """async url => {
                  const response=await fetch(url);
                  const bytes=new Uint8Array(await response.arrayBuffer());
                  let binary='';
                  for(let i=0;i<bytes.length;i+=0x8000){binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));}
                  return btoa(binary);
                }""",
                source,
            )
            data = base64.b64decode(encoded)
            if len(data) > 10000:
                return data
    return None


def main() -> None:
    if not SCORE.exists():
        raise FileNotFoundError(SCORE)
    WORK.mkdir(parents=True, exist_ok=True)
    opener = make_opener()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True, ignore_https_errors=True)
        page = context.new_page()
        downloads: list[Path] = []
        captured_audio: list[bytes] = []

        def proxy(route, request) -> None:
            parsed = urlparse(request.url)
            if parsed.hostname != HOST:
                route.continue_()
                return

            data = request.post_data_buffer if request.method not in {"GET", "HEAD"} else None
            upstream = urllib.request.Request(
                request.url,
                data=data,
                headers=forward_headers(request.headers),
                method=request.method,
            )
            try:
                with opener.open(upstream, timeout=300) as response:
                    body = b"" if request.method == "HEAD" else response.read()
                    headers = response_headers(response.headers)
                    content_type = headers.get("Content-Type", headers.get("content-type", ""))
                    if content_type.lower().startswith("audio/") and len(body) > 10000:
                        captured_audio.append(body)
                        print("CAPTURED PROXIED AUDIO", request.url, len(body))
                    route.fulfill(
                        status=response.status,
                        headers=headers,
                        body=body,
                    )
            except urllib.error.HTTPError as exc:
                body = exc.read()
                print("UPSTREAM HTTP", request.method, request.url, exc.code, len(body))
                route.fulfill(
                    status=exc.code,
                    headers=response_headers(exc.headers),
                    body=body,
                )
            except Exception as exc:
                print("UPSTREAM FAILURE", request.method, request.url, repr(exc))
                route.abort("failed")

        def save_download(download) -> None:
            target = WORK / f"download_{len(downloads)}_{download.suggested_filename}"
            download.save_as(target)
            downloads.append(target)
            print("DOWNLOAD", target, target.stat().st_size)

        page.route("**/*", proxy)
        page.on("download", save_download)

        response = page.goto(APP_URL, wait_until="networkidle", timeout=240000)
        print("LOADED", page.url, response.status if response else None, page.title())
        page.wait_for_selector('input[type="file"]', state="attached", timeout=60000)
        page.wait_for_function(
            "document.querySelectorAll('[role=combobox]').length >= 3",
            timeout=60000,
        )
        page.wait_for_timeout(1000)
        print("COMBOBOX COUNT", page.locator('[role="combobox"]').count())

        configure_voice(page)

        page.locator('input[type="file"]').first.set_input_files(str(SCORE.resolve()))
        page.wait_for_timeout(2500)
        synth = page.get_by_role("button", name=re.compile(r"歌声を合成|synthesi[sz]e|synthesis", re.I)).first
        synth.wait_for(state="visible", timeout=30000)
        page.wait_for_function(
            """() => [...document.querySelectorAll('button')].some(b => /歌声を合成|synthesi[sz]e|synthesis/i.test(b.textContent||'') && !b.disabled)""",
            timeout=60000,
        )
        page.screenshot(path=str(WORK / "sinsy_before_submit.png"), full_page=True)
        synth.click(force=True)
        print("SYNTHESIS STARTED")

        result = None
        deadline = time.time() + 480
        while time.time() < deadline:
            page.wait_for_timeout(2000)

            if captured_audio:
                result = max(captured_audio, key=len)
                break

            for path in downloads:
                if path.exists() and path.stat().st_size > 10000:
                    data = path.read_bytes()
                    if data[:4] in {b"RIFF", b"OggS"} or data[:3] == b"ID3":
                        result = data
                        break
            if result is not None:
                break

            try:
                result = audio_from_page(page)
            except Exception as exc:
                print("PAGE AUDIO READ FAILED", exc)
            if result is not None:
                break

            body = page.locator("body").inner_text(timeout=10000)
            print("WAITING", body[-500:].replace("\n", " | "))

        page.screenshot(path=str(WORK / "sinsy_after_submit.png"), full_page=True)
        (WORK / "sinsy_after_submit.html").write_text(page.content(), encoding="utf-8")
        browser.close()

    if result is None:
        raise RuntimeError("Sinsy did not produce a singing file within eight minutes")
    OUT.write_bytes(result)
    print("SAVED", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR", exc, file=sys.stderr)
        raise
