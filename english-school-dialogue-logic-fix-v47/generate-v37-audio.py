#!/usr/bin/env python3
"""Generate neural name lines and a pitch-melodic child vocal for VERSION 37."""

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
AUDIO = ROOT / "client" / "audio"
VOICE = "en-US-AnaNeural"

BOY_NAMES = {
    "dima": "Dima", "alex": "Alex", "misha": "Misha", "max": "Max",
    "ivan": "Ivan", "nikita": "Nikita", "artem": "Artem", "daniel": "Daniel",
}
GIRL_NAMES = {
    "anna": "Anna", "maria": "Maria", "sofia": "Sofia", "alina": "Alina",
    "diana": "Diana", "emma": "Emma", "eva": "Eva",
}


async def neural(text: str, output: Path, *, rate: str, pitch: str) -> None:
    await edge_tts.Communicate(
        text, VOICE, rate=rate, pitch=pitch, volume="+0%"
    ).save(str(output))


def probe_duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def normalize(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
         "-af", "silenceremove=start_periods=1:start_silence=0.02:start_threshold=-46dB:"
                "stop_periods=-1:stop_silence=0.08:stop_threshold=-46dB,"
                "highpass=f=80,lowpass=f=15500,loudnorm=I=-17:TP=-1.2:LRA=5",
         "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k",
         str(target)],
        check=True,
    )


def make_backing(path: Path, seconds: float) -> None:
    rate = 48_000
    beat = 60 / 116
    frames = bytearray()
    chords = [(261.63, 329.63, 392.0), (196.0, 246.94, 392.0),
              (220.0, 261.63, 329.63), (174.61, 220.0, 349.23)]
    for index in range(int(seconds * rate)):
        time = index / rate
        phase = (time % beat) / beat
        step = int(time / beat)
        chord = chords[(step // 4) % len(chords)]
        pad = sum(math.sin(2 * math.pi * f * time) for f in chord) / 3
        pad *= .105
        bell = math.sin(2 * math.pi * [523.25, 659.25, 783.99, 659.25][step % 4] * time)
        bell *= .15 * math.exp(-7 * phase)
        kick = math.sin(2 * math.pi * 68 * time) * .17 * math.exp(-24 * (time % beat))
        value = max(-.9, min(.9, pad + bell + kick))
        sample = int(value * 32767)
        frames.extend(struct.pack("<hh", sample, sample))
    with wave.open(str(path), "wb") as target:
        target.setnchannels(2)
        target.setsampwidth(2)
        target.setframerate(rate)
        target.writeframes(frames)


async def main() -> None:
    with tempfile.TemporaryDirectory(prefix="english-school-v37-") as temp_name:
        temp = Path(temp_name)
        jobs = []
        name_outputs: list[tuple[Path, Path]] = []
        for gender, names, pitch in (
            ("boy", BOY_NAMES, "-15Hz"), ("girl", GIRL_NAMES, "+5Hz")
        ):
            directory = AUDIO / f"name-{gender}"
            for slug, display in names.items():
                raw = temp / f"{gender}-{slug}.mp3"
                jobs.append(neural(
                    f"My name is {display}. Nice to meet you!",
                    raw, rate="-8%", pitch=pitch,
                ))
                name_outputs.append((raw, directory / f"{slug}.mp3"))
            raw = temp / f"{gender}-generic.mp3"
            jobs.append(neural(
                "Hello! Nice to meet you! Let's be friends!",
                raw, rate="-8%", pitch=pitch,
            ))
            name_outputs.append((raw, directory / "generic.mp3"))

        # Short sung units are independently pitched onto a simple major melody.
        lyric_units = [
            "What's your name?", "What's your name?", "What's your name, little boy?",
            "My name is Roy!", "How old are you?", "How old are you?",
            "How old are you?", "I am six!", "I am six!", "I am six!", "And you?",
        ]
        raw_units = [temp / f"song-{i:02}.mp3" for i in range(len(lyric_units))]
        jobs.extend(
            neural(text, path, rate="-18%", pitch="-8Hz")
            for text, path in zip(lyric_units, raw_units)
        )
        await asyncio.gather(*jobs)

        for raw, target in name_outputs:
            normalize(raw, target)

        beat = 60 / 116
        starts = [1, 3, 5, 8, 11, 13, 15, 18, 20, 22, 24]
        semitones = [0, 2, 4, 7, 0, 2, 4, 7, 5, 4, 2]
        song_seconds = 27.5
        backing = temp / "backing.wav"
        make_backing(backing, song_seconds)
        inputs: list[str] = []
        for unit in raw_units:
            inputs += ["-i", str(unit)]
        inputs += ["-i", str(backing)]
        filters: list[str] = []
        labels: list[str] = []
        for index, (start_beat, semitone) in enumerate(zip(starts, semitones)):
            ratio = 2 ** (semitone / 12)
            compensate = 1 / ratio
            delay = round(start_beat * beat * 1000)
            label = f"v{index}"
            filters.append(
                f"[{index}:a]asetrate=48000*{ratio:.6f},aresample=48000,"
                f"atempo={compensate:.6f},adelay={delay}|{delay},"
                f"highpass=f=90,acompressor=threshold=-22dB:ratio=2.2,"
                f"aecho=.8:.22:70:.14[{label}]"
            )
            labels.append(f"[{label}]")
        music_index = len(raw_units)
        filters.append(f"[{music_index}:a]volume=.28[music]")
        filters.append(
            f"{''.join(labels)}[music]amix=inputs={len(labels)+1}:"
            "duration=longest:normalize=0,loudnorm=I=-16:TP=-1.2:LRA=6[out]"
        )
        output = AUDIO / "voice-boy" / "roy-song.mp3"
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs,
             "-filter_complex", ";".join(filters), "-map", "[out]",
             "-t", str(song_seconds), "-ar", "48000", "-ac", "2",
             "-c:a", "libmp3lame", "-b:a", "192k", str(output)],
            check=True,
        )
        print(f"Generated {len(name_outputs)} neural name lines and "
              f"{probe_duration(output):.1f}s melodic Roy vocal.")


if __name__ == "__main__":
    asyncio.run(main())
