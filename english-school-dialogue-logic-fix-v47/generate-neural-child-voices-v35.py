#!/usr/bin/env python3
"""Generate the lesson's four child profiles from true neural child voices."""

from __future__ import annotations

import asyncio
import subprocess
import tempfile
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parent
AUDIO_ROOT = ROOT / "client" / "audio"

PHRASES = {
    "hello": "Hello!",
    "hi": "Hi!",
    "hey": "Hey!",
    "good-morning": "Good morning!",
    "my-name-is": "My name is...",
    "one": "One.",
    "two": "Two.",
    "three": "Three.",
    "four": "Four.",
    "here-you-are": "Here you are!",
    "nice-frog": "Nice frog!",
    "dunno-at-door": "It's me! I'm a little boy!",
    "dunno-name": "My name is Dunno! Nice to meet you too!",
    "i-give-up": "One, two, three, five, six! I give up! I don't know!",
    "can-i-have-dog": "Can I have the dog, please?",
    "yes-i-do": "Yes, I do! I like the bear. I don't like the frog!",
    "secret-guess": "It's a secret! Guess!",
    "yes-picture": "Yes, it is! It's a picture!",
    "yes-it-is": "Yes, it is!",
    "no-isnt": "No, it isn't!",
    "roy-song": (
        "What's your name? What's your name? What's your name, little boy? "
        "My name is Roy. How old are you? How old are you? How old are you? "
        "I am six, I am six, I am six, and you?"
    ),
}

# Ana and Maisie are explicitly classified as Child voices by Microsoft.
# The two boy profiles start from Ana's child timbre and use a lower neural pitch.
PROFILES = {
    "voice-girl": {
        "voice": "en-US-AnaNeural",
        "rate": "-7%",
        "pitch": "+2Hz",
    },
    "voice-girl-2": {
        "voice": "en-GB-MaisieNeural",
        "rate": "-5%",
        "pitch": "+0Hz",
    },
    "voice-boy": {
        "voice": "en-US-AnaNeural",
        "rate": "-4%",
        "pitch": "-18Hz",
    },
    "voice-boy-2": {
        "voice": "en-US-AnaNeural",
        "rate": "-1%",
        "pitch": "-28Hz",
    },
}


async def synthesize(
    semaphore: asyncio.Semaphore,
    temp_root: Path,
    folder: str,
    slug: str,
    text: str,
) -> None:
    profile = PROFILES[folder]
    output_dir = AUDIO_ROOT / folder
    output_dir.mkdir(parents=True, exist_ok=True)
    source = temp_root / f"{folder}-{slug}.mp3"

    async with semaphore:
        speech = edge_tts.Communicate(
            text,
            profile["voice"],
            rate=profile["rate"],
            pitch=profile["pitch"],
            volume="+0%",
        )
        await speech.save(str(source))

    common_filter = (
        "silenceremove=start_periods=1:start_silence=0.04:"
        "start_threshold=-45dB:stop_periods=-1:stop_silence=0.12:"
        "stop_threshold=-45dB,"
        "highpass=f=75,lowpass=f=15500,"
        "loudnorm=I=-18:TP=-1.5:LRA=6"
    )
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-af",
            common_filter,
            "-ar",
            "48000",
            "-ac",
            "1",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "192k",
            str(output_dir / f"{slug}.mp3"),
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-af",
            common_filter,
            "-ar",
            "48000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(output_dir / f"{slug}.wav"),
        ],
        check=True,
    )
    print(f"{folder}/{slug}")


async def main() -> None:
    semaphore = asyncio.Semaphore(4)
    with tempfile.TemporaryDirectory(prefix="english-school-v35-") as temp:
        temp_root = Path(temp)
        tasks = [
            synthesize(semaphore, temp_root, folder, slug, text)
            for folder in PROFILES
            for slug, text in PHRASES.items()
        ]
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
