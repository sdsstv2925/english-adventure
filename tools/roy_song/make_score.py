from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape

DIVISIONS = 4
TEMPO = 108

# Exact words from scene 18. "little" is split only into sung syllables.
MEASURES = [
    # A full opening rest is required by Sinsy.
    [(None, 16, None, None)],
    [("G", 4, 4, "What's"), ("A", 4, 4, "your"), ("C", 5, 8, "name")],
    [("G", 4, 4, "What's"), ("A", 4, 4, "your"), ("D", 5, 8, "name")],
    [
        ("G", 4, 2, "What's"), ("A", 4, 2, "your"), ("C", 5, 4, "name"),
        ("B", 4, 2, ("lit", "begin")), ("A", 4, 2, ("tle", "end")), ("G", 4, 4, "boy"),
    ],
    [("E", 4, 2, "My"), ("G", 4, 2, "name"), ("A", 4, 2, "is"), ("C", 5, 8, "Roy"), (None, 2, None, None)],
    [
        ("G", 4, 2, "How"), ("A", 4, 2, "old"), ("B", 4, 2, "are"), ("C", 5, 2, "you"),
        ("A", 4, 2, "How"), ("B", 4, 2, "old"), ("C", 5, 2, "are"), ("D", 5, 2, "you"),
    ],
    [("C", 5, 2, "How"), ("B", 4, 2, "old"), ("A", 4, 2, "are"), ("G", 4, 8, "you"), (None, 2, None, None)],
    [("C", 5, 2, "I"), ("A", 4, 2, "am"), ("G", 4, 4, "six"), ("C", 5, 2, "I"), ("A", 4, 2, "am"), ("G", 4, 4, "six")],
    [("E", 4, 4, "and"), ("C", 4, 8, "you"), (None, 4, None, None)],
]

STEP_TO_ALTER = {"C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "A": 0, "B": 0}


def note_type(duration: int) -> tuple[str, bool]:
    if duration == 16:
        return "whole", False
    if duration == 8:
        return "half", False
    if duration == 6:
        return "quarter", True
    if duration == 4:
        return "quarter", False
    if duration == 2:
        return "eighth", False
    if duration == 1:
        return "16th", False
    raise ValueError(f"Unsupported duration: {duration}")


def build_note(step: str | None, octave: int | None, duration: int, lyric) -> str:
    ntype, dotted = note_type(duration)
    if step is None:
        pitch_xml = "<rest/>"
    else:
        pitch_xml = (
            "<pitch>"
            f"<step>{escape(step)}</step>"
            f"<octave>{octave}</octave>"
            "</pitch>"
        )

    lyric_xml = ""
    if lyric is not None:
        syllabic = None
        text = lyric
        if isinstance(lyric, tuple):
            text, syllabic = lyric
        syllabic_xml = f"<syllabic>{syllabic}</syllabic>" if syllabic else "<syllabic>single</syllabic>"
        lyric_xml = f"<lyric number=\"1\">{syllabic_xml}<text>{escape(text)}</text></lyric>"

    dot_xml = "<dot/>" if dotted else ""
    return (
        "<note>"
        f"{pitch_xml}"
        f"<duration>{duration}</duration>"
        "<voice>1</voice>"
        f"<type>{ntype}</type>{dot_xml}"
        f"{lyric_xml}"
        "</note>"
    )


def build_score() -> str:
    measure_xml = []
    for number, events in enumerate(MEASURES, start=1):
        attrs = ""
        direction = ""
        if number == 1:
            attrs = (
                "<attributes>"
                f"<divisions>{DIVISIONS}</divisions>"
                "<key><fifths>0</fifths><mode>major</mode></key>"
                "<time><beats>4</beats><beat-type>4</beat-type></time>"
                "<clef><sign>G</sign><line>2</line></clef>"
                "</attributes>"
            )
            direction = (
                "<direction placement=\"above\">"
                "<direction-type><metronome><beat-unit>quarter</beat-unit>"
                f"<per-minute>{TEMPO}</per-minute></metronome></direction-type>"
                f"<sound tempo=\"{TEMPO}\"/>"
                "</direction>"
            )
        notes = "".join(build_note(*event) for event in events)
        measure_xml.append(f"<measure number=\"{number}\">{attrs}{direction}{notes}</measure>")

    return """<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>Roy Song</work-title></work>
  <identification><creator type="composer">English Adventure</creator></identification>
  <part-list>
    <score-part id="P1">
      <part-name>Roy</part-name>
      <score-instrument id="P1-I1"><instrument-name>Voice</instrument-name></score-instrument>
      <midi-instrument id="P1-I1"><midi-channel>1</midi-channel><midi-program>54</midi-program></midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
""" + "\n".join(measure_xml) + """
  </part>
</score-partwise>
"""


def main() -> None:
    out = Path("roy_song_work/roy_song.musicxml")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build_score(), encoding="utf-8")
    print(f"Wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
