#!/usr/bin/env python3
"""
word-shifts.py — corrections to align-words.py by ear, so a VO refresh keeps them. Whisper places a word up to a second
off when two run together (VI02 SC08 "…labanya, lalu buka": 50 frames late), and the subtitles and every W() anchor
follow it. scripts/vi/sub-check.py finds such a spot; the fix goes in data/word-shifts.json and vo-refresh.sh applies it.

  ~/.venvs/tuntun/bin/python scripts/vi/word-shifts.py src/episodes/<ep>/data/word-shifts.json src/episodes/<ep>/data/words.json

Each entry: {"scene": n, "at": "phrase", "shift": frames, "grow": frames}: the phrase's FIRST word moves by `shift`, and
its end by `grow` more. A shift is relative, so it survives a VO revision elsewhere. A line that is re-recorded needs its
entries measured again.
"""
import json
import re
import sys

FPS = 60


def norm(s):
    return re.sub(r"[^0-9a-z]", "", s.lower())


spec = json.load(open(sys.argv[1]))
data = json.load(open(sys.argv[2]))
words = data["words"]
for e in spec["shifts"]:
    q = [norm(t) for t in e["at"].split()]
    idx = [i for i, w in enumerate(words) if w.get("scene") == e["scene"]]
    hits = [i for i in idx if [norm(w["w"]) for w in words[i : i + len(q)]] == q]
    if not hits:
        raise SystemExit(f"SC{e['scene']}: {e['at']!r} is not in words.json")
    w = words[hits[e.get("nth", 0)]]
    w["start"] += e.get("shift", 0) / FPS
    w["end"] += (e.get("shift", 0) + e.get("grow", 0)) / FPS
    w["f0"], w["f1"] = round(w["start"] * FPS), round(w["end"] * FPS)
json.dump(data, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print(f"{len(spec['shifts'])} word shifts -> {sys.argv[2]}")
