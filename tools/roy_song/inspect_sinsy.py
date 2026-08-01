from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

URLS = [
    "https://sinsy.sp.nitech.ac.jp/ja",
    "https://sinsy.sp.nitech.ac.jp/en",
    "https://sinsy.sp.nitech.ac.jp/",
]
context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

raw = None
final_url = None
last_error = None
for url in URLS:
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, context=context, timeout=60) as response:
            raw = response.read()
            final_url = response.geturl()
            print("STATUS", response.status, "URL", final_url, "BYTES", len(raw))
            break
    except Exception as exc:
        last_error = exc
        print("FAILED", url, repr(exc))

if raw is None:
    raise RuntimeError(f"Could not fetch current Sinsy page: {last_error}")

html = raw.decode("utf-8", errors="replace")
Path("roy_song_work").mkdir(exist_ok=True)
Path("roy_song_work/sinsy_raw.html").write_text(html, encoding="utf-8")

for pattern in [
    r"<form\b[^>]*>",
    r"<input\b[^>]*>",
    r"<select\b[^>]*>",
    r"<option\b[^>]*>.*?</option>",
    r"<button\b[^>]*>.*?</button>",
    r"<iframe\b[^>]*>",
    r"<script\b[^>]*src=[\"'][^\"']+[\"'][^>]*>",
]:
    print("\nPATTERN", pattern)
    matches = re.findall(pattern, html, flags=re.I | re.S)
    print("COUNT", len(matches))
    for match in matches[:100]:
        print(re.sub(r"\s+", " ", match)[:700])
