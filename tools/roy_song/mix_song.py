from __future__ import annotations

import math
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

WORK = Path("roy_song_work")
VOCAL_SOURCE = WORK / "roy_vocal.wav"
VOCAL_PCM = WORK / "roy_vocal_pcm.wav"
BACKING = WORK / "roy_backing.wav"
MIX_WAV = WORK / "roy-song-normal.wav"
MIX_MP3 = WORK / "roy-song-normal.mp3"
VOCAL_ONLY = WORK / "roy-song-vocal-only.wav"
SR = 48000
BPM = 108
BEAT = 60.0 / BPM


def run(command: list[str]) -> None:
    print("+", " ".join(command))
    subprocess.run(command, check=True)


def midi_hz(note: float) -> float:
    return 440.0 * (2.0 ** ((note - 69.0) / 12.0))


def add_tone(track: np.ndarray, start: float, duration: float, frequency: float, amplitude: float, pan: float, kind: str) -> None:
    first = max(0, int(start * SR))
    last = min(len(track), first + int(duration * SR))
    if last <= first:
        return

    time = np.arange(last - first, dtype=np.float64) / SR
    if kind == "pluck":
        wave = (
            np.sin(2 * np.pi * frequency * time)
            + 0.38 * np.sin(2 * np.pi * frequency * 2.01 * time)
            + 0.16 * np.sin(2 * np.pi * frequency * 3.02 * time)
        )
        envelope = np.exp(-7.0 * time / max(duration, 0.08))
    elif kind == "bell":
        wave = (
            np.sin(2 * np.pi * frequency * time)
            + 0.45 * np.sin(2 * np.pi * frequency * 2.005 * time)
            + 0.18 * np.sin(2 * np.pi * frequency * 4.01 * time)
        )
        envelope = np.minimum(1.0, time / 0.008) * np.exp(-4.5 * time / max(duration, 0.08))
    elif kind == "bass":
        wave = np.sin(2 * np.pi * frequency * time) + 0.18 * np.sin(2 * np.pi * frequency * 2 * time)
        envelope = np.minimum(1.0, time / 0.012) * np.exp(-2.8 * time / max(duration, 0.1))
    else:
        wave = np.sin(2 * np.pi * frequency * time)
        envelope = np.ones_like(time)

    signal = wave * envelope * amplitude
    left = math.cos(max(0.0, min(1.0, pan)) * math.pi / 2)
    right = math.sin(max(0.0, min(1.0, pan)) * math.pi / 2)
    track[first:last, 0] += signal * left
    track[first:last, 1] += signal * right


def make_backing(duration: float) -> np.ndarray:
    frames = int((duration + 0.35) * SR)
    track = np.zeros((frames, 2), dtype=np.float64)
    rng = np.random.default_rng(18)

    # C – G – Am – F, one bar per chord.
    progression = [
        ([60, 64, 67], 48),
        ([55, 59, 62], 43),
        ([57, 60, 64], 45),
        ([53, 57, 60], 41),
    ]
    bar_length = BEAT * 4
    bar_count = math.ceil(duration / bar_length)

    for bar_index in range(bar_count):
        chord, bass_note = progression[bar_index % len(progression)]
        bar_start = bar_index * bar_length

        # Ukulele-like quarter-note strums.
        for beat_index in range(4):
            start = bar_start + beat_index * BEAT
            for chord_index, note in enumerate(chord):
                add_tone(
                    track,
                    start + chord_index * 0.013,
                    0.38,
                    midi_hz(note + 12),
                    0.050,
                    0.24 + chord_index * 0.25,
                    "pluck",
                )

        # Bass notes on beats one and three.
        add_tone(track, bar_start, 0.55, midi_hz(bass_note), 0.095, 0.45, "bass")
        add_tone(track, bar_start + 2 * BEAT, 0.48, midi_hz(bass_note + 7), 0.070, 0.55, "bass")

        # Music-box arpeggio on eighth notes.
        arpeggio = [
            chord[0] + 24,
            chord[1] + 24,
            chord[2] + 24,
            chord[1] + 24,
            chord[0] + 24,
            chord[1] + 24,
            chord[2] + 24,
            chord[1] + 24,
        ]
        for index, note in enumerate(arpeggio):
            add_tone(
                track,
                bar_start + index * BEAT / 2,
                BEAT * 0.42,
                midi_hz(note),
                0.028,
                0.20 if index % 2 == 0 else 0.80,
                "bell",
            )

        # Gentle kick and claps.
        for beat_index in range(4):
            start = bar_start + beat_index * BEAT
            first = int(start * SR)
            length = int(0.13 * SR)
            last = min(frames, first + length)
            if last <= first:
                continue
            time = np.arange(last - first, dtype=np.float64) / SR
            kick = np.sin(2 * np.pi * (78 * np.exp(-12 * time) + 42) * time) * np.exp(-27 * time)
            track[first:last] += (0.043 * kick)[:, None]

            if beat_index in (1, 3):
                noise = rng.normal(0.0, 1.0, last - first)
                clap = np.concatenate([[0.0], np.diff(noise * np.exp(-34 * time))])
                track[first:last, 0] += 0.013 * clap
                track[first:last, 1] += 0.013 * clap

    # Short intro sparkle and closing chord.
    for index, note in enumerate([72, 76, 79, 84]):
        add_tone(track, 0.10 + index * 0.14, 0.50, midi_hz(note), 0.042, 0.25 + index * 0.16, "bell")
    end = max(0.0, duration - 0.8)
    for index, note in enumerate([60, 64, 67, 72]):
        add_tone(track, end + index * 0.025, 0.85, midi_hz(note + 12), 0.044, 0.2 + index * 0.2, "bell")

    return track


def delay(signal: np.ndarray, seconds: float, amount: float) -> np.ndarray:
    samples = int(seconds * SR)
    output = signal.copy()
    if 0 < samples < len(signal):
        output[samples:] += amount * signal[:-samples]
    return output


def main() -> None:
    if not VOCAL_SOURCE.exists():
        raise FileNotFoundError(VOCAL_SOURCE)
    WORK.mkdir(parents=True, exist_ok=True)

    # The web service may return WAV or MP3. Normalize it to stereo PCM first.
    run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(VOCAL_SOURCE),
        "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(VOCAL_PCM),
    ])

    vocal, sample_rate = sf.read(VOCAL_PCM, always_2d=True, dtype="float64")
    if sample_rate != SR:
        raise RuntimeError(f"Unexpected sample rate: {sample_rate}")
    if len(vocal) < SR * 5:
        raise RuntimeError("Generated vocal is unexpectedly short")

    duration = len(vocal) / SR
    backing = make_backing(duration)[: len(vocal)]
    sf.write(BACKING, backing.astype(np.float32), SR, subtype="PCM_16")
    sf.write(VOCAL_ONLY, vocal.astype(np.float32), SR, subtype="PCM_16")

    # Gentle stereo ambience, while keeping the sung words in front.
    vocal_fx = vocal.copy()
    vocal_fx[:, 0] = delay(vocal[:, 0], 0.082, 0.10)
    vocal_fx[:, 1] = delay(vocal[:, 1], 0.096, 0.12)

    mix = 0.93 * vocal_fx + 0.67 * backing
    fade_in = min(len(mix), int(0.20 * SR))
    fade_out = min(len(mix), int(0.65 * SR))
    mix[:fade_in] *= np.linspace(0.0, 1.0, fade_in)[:, None]
    mix[-fade_out:] *= np.linspace(1.0, 0.0, fade_out)[:, None]

    peak = float(np.max(np.abs(mix)))
    if peak > 0:
        mix = mix / peak * 0.91
    sf.write(MIX_WAV, mix.astype(np.float32), SR, subtype="PCM_16")

    run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(MIX_WAV),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=9",
        "-c:a", "libmp3lame", "-b:a", "192k", str(MIX_MP3),
    ])

    lyrics = """What's your name? What's your name?
What's your name, little boy?
My name is Roy.
How old are you? How old are you?
How old are you?
I am six, I am six, and you?
"""
    (WORK / "lyrics.txt").write_text(lyrics, encoding="utf-8")
    print(f"Created {MIX_MP3} ({MIX_MP3.stat().st_size} bytes, {duration:.2f}s)")


if __name__ == "__main__":
    main()
