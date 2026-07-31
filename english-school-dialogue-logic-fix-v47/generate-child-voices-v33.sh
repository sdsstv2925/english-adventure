#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
AUDIO_ROOT="$ROOT/client/audio"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/english-school-child-voices.XXXXXX")"
trap 'rm -rf "$TMP_ROOT"' EXIT

generate_profile() {
  local folder="$1"
  local voice="$2"
  local pitch="$3"
  local rate="$4"
  local output_dir="$AUDIO_ROOT/$folder"

  mkdir -p "$output_dir"
  echo "Generating $folder with $voice"

  while IFS=$'\t' read -r slug text; do
    [ -n "$slug" ] || continue
    local source_file="$TMP_ROOT/${folder}-${slug}.aiff"

    say -v "$voice" -r "$rate" -o "$source_file" "$text"

    ffmpeg -hide_banner -loglevel error -y \
      -i "$source_file" \
      -af "asetrate=22050*${pitch},aresample=44100,atempo=1/${pitch},highpass=f=80,lowpass=f=15000,loudnorm=I=-18:TP=-1.5:LRA=7" \
      -ar 44100 -ac 1 -c:a pcm_s16le \
      "$output_dir/$slug.wav"

    ffmpeg -hide_banner -loglevel error -y \
      -i "$output_dir/$slug.wav" \
      -ar 44100 -ac 1 -c:a libmp3lame -b:a 192k \
      "$output_dir/$slug.mp3"

    echo "  $slug"
  done <<'PHRASES'
hello	Hello!
hi	Hi!
good-morning	Good morning!
my-name-is	My name is...
one	One.
two	Two.
three	Three.
four	Four.
here-you-are	Here you are!
nice-frog	Nice frog!
dunno-at-door	It's me! I'm a little boy!
dunno-name	My name is Dunno! Nice to meet you too!
i-give-up	One, two, three, five, six! I give up! I don't know!
can-i-have-dog	Can I have the dog, please?
yes-i-do	Yes, I do! I like the bear. I don't like the frog!
secret-guess	It's a secret! Guess!
yes-picture	Yes, it is! It's a picture!
yes-it-is	Yes, it is!
no-isnt	No, it isn't!
roy-song	What's your name? What's your name? What's your name, little boy? My name is Roy. How old are you? How old are you? How old are you? I am six, I am six, I am six, and you?
PHRASES
}

# Four distinct youthful American-English profiles. Pitch/formant adjustment is
# deliberately moderate so pronunciation stays natural and easy for learners.
generate_profile "voice-girl" \
  "Flo (Английский (США))" "1.12" "176"
generate_profile "voice-girl-2" \
  "Sandy (Английский (США))" "1.08" "174"
generate_profile "voice-boy" \
  "Eddy (Английский (США))" "1.14" "174"
generate_profile "voice-boy-2" \
  "Rocko (Английский (США))" "1.10" "172"

echo "Child voices generated successfully."
