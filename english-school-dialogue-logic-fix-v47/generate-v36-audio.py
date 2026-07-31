#!/usr/bin/env python3
"""Generate VERSION 36 Dunno lines and a rhythmic child song with music."""

from __future__ import annotations

import asyncio
import math
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parent
BOY_DIR = ROOT / "client" / "audio" / "voice-boy"
VOICE = "en-US-AnaNeural"


async def edge_line(text: str, output: Path, rate: str = "-4%", pitch: str = "-18Hz") -> None:
    await edge_tts.Communicate(
        text,
        VOICE,
        rate=rate,
        pitch=pitch,
        volume="+0%",
    ).save(str(output))


def normalize(source: Path, target: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(source),
            "-af",
            "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-45dB:"
            "stop_periods=-1:stop_silence=0.1:stop_threshold=-45dB,"
            "highpass=f=75,lowpass=f=15500,loudnorm=I=-18:TP=-1.5:LRA=6",
            "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k",
            str(target),
        ],
        check=True,
    )


def duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def make_music(path: Path, seconds: float) -> None:
    sample_rate = 48_000
    total = int(seconds * sample_rate)
    beat = 60 / 112
    chords = [(261.63, 329.63, 392.00), (196.00, 246.94, 392.00),
              (220.00, 261.63, 329.63), (174.61, 220.00, 349.23)]
    melody = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 493.88]
    frames = bytearray()
    for index in range(total):
        time = index / sample_rate
        beat_index = int(time / beat)
        beat_phase = (time % beat) / beat
        chord = chords[(beat_index // 4) % len(chords)]
        pad = sum(math.sin(2 * math.pi * frequency * time) for frequency in chord) / 3
        pad *= 0.14 * (0.75 + 0.25 * math.sin(math.pi * beat_phase))
        note = melody[beat_index % len(melody)]
        bell_env = math.exp(-7.5 * beat_phase)
        bell = (
            math.sin(2 * math.pi * note * time)
            + 0.35 * math.sin(2 * math.pi * note * 2 * time)
        ) * 0.17 * bell_env
        kick_phase = time % beat
        kick = math.sin(2 * math.pi * (78 - 38 * min(kick_phase / 0.16, 1)) * time)
        kick *= 0.22 * math.exp(-25 * kick_phase) if beat_index % 2 == 0 else 0
        clap_phase = (time - beat) % (beat * 2)
        clap = 0.0
        if clap_phase < 0.07:
            noise = math.sin(index * 12.9898) * 43758.5453
            noise -= math.floor(noise)
            clap = (noise * 2 - 1) * 0.08 * math.exp(-45 * clap_phase)
        value = max(-0.92, min(0.92, pad + bell + kick + clap))
        sample = int(value * 32767)
        frames.extend(struct.pack("<hh", sample, sample))
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(frames)


async def main() -> None:
    BOY_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="english-school-v36-") as temp_name:
        temp = Path(temp_name)
        dunno_age = temp / "dunno-age.mp3"
        thank_you = temp / "thank-you.mp3"
        song_texts = [
            "What's your name? What's your name? What's your name, little boy?",
            "My name is Roy!",
            "How old are you? How old are you? How old are you?",
            "I am six! I am six! I am six! And you?",
        ]
        song_parts = [temp / f"song-{index}.mp3" for index in range(len(song_texts))]
        await asyncio.gather(
            edge_line("My name is Dunno! I am six!", dunno_age),
            edge_line("Thank you! Nice girls and boys!", thank_you),
            *(edge_line(text, path, rate="-10%", pitch="-16Hz")
              for text, path in zip(song_texts, song_parts)),
        )
        normalize(dunno_age, BOY_DIR / "dunno-age.mp3")
        normalize(thank_you, BOY_DIR / "thank-you.mp3")

        starts: list[float] = []
        cursor = 1.45
        for part in song_parts:
            starts.append(cursor)
            cursor += duration(part) + 0.38
        song_length = cursor + 1.3
        backing = temp / "roy-backing.wav"
        make_music(backing, song_length)

        inputs: list[str] = []
        for part in song_parts:
            inputs += ["-i", str(part)]
        inputs += ["-i", str(backing)]
        filters: list[str] = []
        labels: list[str] = []
        for index, start in enumerate(starts):
            delay = round(start * 1000)
            label = f"v{index}"
            filters.append(
                f"[{index}:a]adelay={delay}|{delay},"
                f"highpass=f=75,acompressor=threshold=-20dB:ratio=2.4,"
                f"aecho=0.8:0.18:85:0.16[{label}]"
            )
            labels.append(f"[{label}]")
        music_index = len(song_parts)
        filters.append(f"[{music_index}:a]volume=0.34[music]")
        mix_inputs = "".join(labels) + "[music]"
        filters.append(
            f"{mix_inputs}amix=inputs={len(labels) + 1}:duration=longest:normalize=0,"
            "loudnorm=I=-16:TP=-1.2:LRA=7[out]"
        )
        subprocess.run(
            [
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                *inputs,
                "-filter_complex", ";".join(filters),
                "-map", "[out]", "-t", f"{song_length:.3f}",
                "-ar", "48000", "-ac", "2", "-c:a", "libmp3lame", "-b:a", "192k",
                str(BOY_DIR / "roy-song.mp3"),
            ],
            check=True,
        )
        print(f"Generated two Dunno lines and {song_length:.1f}s Roy song.")


if __name__ == "__main__":
    asyncio.run(main())
