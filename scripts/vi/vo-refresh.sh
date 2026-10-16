#!/bin/zsh
# vo-refresh.sh — after a VO revision, everything that follows the voice, in one go:
#   splice (data/vo-edits.json, if any) → word alignment against data/script.txt → SRT → subtitles.ts.
# Scene blocks need no step: data/timing.ts derives them from words.json.
#
#   scripts/vi/vo-refresh.sh src/episodes/vi04-investasi-yang-cocok vi04-investasi-yang-cocok VI04_InvestasiYangCocok_Sub
set -euo pipefail
cd "${0:A:h}/../.."
EP=$1 VO=public/vo/$2.mp3 SRT=assets/$3.srt
PY=~/.venvs/tuntun/bin/python
[[ -f $EP/data/vo-edits.json ]] && $PY scripts/vi/vo-splice.py $EP/data/vo-edits.json
$PY scripts/vi/align-words.py $VO $EP/data/words.json --script $EP/data/script.txt
$PY scripts/vi/words-to-srt.py $EP/data/words.json $SRT
node scripts/srt-to-cues.mjs $SRT 60 > $EP/subtitles.ts
sed -i '' 's/Do not edit by hand/Text = the script (scripts\/vi\/words-to-srt.py), timing = the VO. Do not edit by hand/' $EP/subtitles.ts
