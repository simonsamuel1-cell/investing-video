#!/bin/zsh
# vo-refresh.sh — after a VO revision, everything that follows the voice, in one go:
#   splice (data/vo-edits.json, if any) → word alignment against data/script.txt → word shifts (data/word-shifts.json, if any)
#   → SRT → subtitles.ts.
# Scene blocks need no step: data/timing.ts derives them from words.json.
#
#   scripts/vi/vo-refresh.sh src/episodes/in04-investasi-yang-cocok in04-investasi-yang-cocok IN04_InvestasiYangCocok_Sub
set -euo pipefail
cd "${0:A:h}/../.."
EP=$1 VO=public/vo/$2.mp3 SRT=assets/$3.srt
PY=~/.venvs/tuntun/bin/python
[[ -f $EP/data/vo-edits.json ]] && $PY scripts/vi/vo-splice.py $EP/data/vo-edits.json
$PY scripts/vi/align-words.py $VO $EP/data/words.json --script $EP/data/script.txt
[[ -f $EP/data/word-shifts.json ]] && $PY scripts/vi/word-shifts.py $EP/data/word-shifts.json $EP/data/words.json
$PY scripts/vi/words-to-srt.py $EP/data/words.json $SRT
node scripts/srt-to-cues.mjs $SRT 60 > $EP/subtitles.ts
sed -i '' 's/Do not edit by hand/Text = the script (scripts\/vi\/words-to-srt.py), timing = the VO. Do not edit by hand/' $EP/subtitles.ts
