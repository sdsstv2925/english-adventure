from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

URL = "https://sinsy.sp.nitech.ac.jp/index.php"
context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

request = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(request, context=context, timeout=60) as response:
    raw = response.read()
    html = raw.decode("utf-8", errors="replace")
    print("STATUS", response.status, "URL", response.geturl(), "BYTES", len(raw))

Path("roy_song_work").mkdir(exist_ok=True)
Path("roy_song_work/sinsy_raw.html").write_text(html, encoding="utf-8")

for pattern in [
    r"<form\b[^>]*>",
    r"<input\b[^>]*>",
    r"<select\b[^>]*>",
    r"<option\b[^>]*>.*?</option>",
    r"<button\b[^>]*>.*?</button>",
    r"<iframe\b[^>]*>",
]:
    print("\nPATTERN", pattern)
    matches = re.findall(pattern, html, flags=re.I | re.S)
    print("COUNT", len(matches))
    for match in matches[:100]:
        print(re.sub(r"\s+", " ", match)[:500])
