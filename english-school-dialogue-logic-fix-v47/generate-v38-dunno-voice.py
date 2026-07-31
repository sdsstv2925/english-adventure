#!/usr/bin/env python3
"""Generate a clean, young male neural voice exclusively for Dunno."""

from __future__ import annotations

import asyncio
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "client" / "audio" / "voice-dunno"
VOICE = "en-US-AndrewMultilingualNeural"
PHRASES = {
    "dunno-at-door": "It's me! I'm a little boy!",
    "dunno-name": "My name is Dunno! Nice to meet you too!",
    "dunno-age": "My name is Dunno! I am six!",
    "thank-you": "Thank you! Nice girls and boys!",
    "i-give-up": "One, two, three, five, six! I give up! I don't know!",
    "can-i-have-dog": "Can I have the dog, please?",
    "secret-guess": "It's a secret! Guess!",
    "yes-picture": "Yes, it is! It's a picture!",
    "yes-it-is": "Yes, it is!",
    "no-isnt": "No, it isn't!",
}


async def create(slug: str, text: str, temporary: Path) -> None:
    raw = temporary / f"{slug}.mp3"
    await edge_tts.Communicate(
        text, VOICE, rate="+8%", pitch="+10Hz", volume="+0%"
    ).save(str(raw))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(raw),
            "-af",
            "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-46dB:"
            "stop_periods=-1:stop_silence=0.09:stop_threshold=-46dB,"
            "highpass=f=80,lowpass=f=15500,"
            "acompressor=threshold=-21dB:ratio=1.8,"
            "loudnorm=I=-17:TP=-1.2:LRA=5",
            "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k",
            str(OUTPUT / f"{slug}.mp3"),
        ],
        check=True,
    )


async def main() -> None:
    with tempfile.TemporaryDirectory(prefix="english-school-v38-dunno-") as name:
        temporary = Path(name)
        await asyncio.gather(
            *(create(slug, text, temporary) for slug, text in PHRASES.items())
        )
    print(f"Generated {len(PHRASES)} clean Dunno lines with {VOICE}.")


if __name__ == "__main__":
    asyncio.run(main())
