from pathlib import Path
TEMPO = 132
MEASURES = [
    [("C4", 1.0, "What's"), ("D4", 1.0, "your"), ("E4", 1.0, "name")],
    [("E4", 1.0, "I"), ("G4", 1.0, "am"), ("A4", 2.0, "six")],
    [("C5", 1.0, "and"), ("B4", 1.0, "you"), ("A4", 1.0, "you"), ("C5", 1.0, "you")],
]
def make_musicxml():
    root = Path(__file__).resolve().parents[2]
    out_dir = root / "roy_song_work"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "roy_song.musicxml"
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
  <part id="P1">
'''
    for i, measure in enumerate(MEASURES, start=1):
        xml += f' <measure number="{i}">\n'
        if i==1:
            xml += f' <attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>\n'
            xml += f' <direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>{TEMPO}</per-minute></metronome></direction-type></direction>\n'
        for pitch, dur, lyric in measure:
            step=pitch[0]; octave=pitch[-1]
            xml += f' <note><pitch><step>{step}</step><octave>{octave}</octave></pitch><duration>{dur}</duration><type>quarter</type><lyric><text>{lyric}</text></lyric></note>\n'
        xml += ' </measure>\n'
    xml += ' </part>\n</score-partwise>\n'
    out.write_text(xml, encoding="utf-8")
    print(f"Wrote {out} TEMPO={TEMPO} size={out.stat().st_size}")

if __name__ == "__main__":
    make_musicxml()
