#!/usr/bin/env python3
"""
heard-to-words.py — when the VO does not follow the script, time the episode by what it SAYS: heard.json (whisper's
words, scripts/vi/transcribe-align.py) → words.json in align-words.py's format, each word tagged with its scene by the
second the scene starts (given in order, SC01 first: "0 78.0 143.3 …").

  ~/.venvs/tuntun/bin/python scripts/vi/heard-to-words.py heard.json words.json 0 78.0 143.3 …
"""
import json
import re
import sys

FPS = 60
heard = json.load(open(sys.argv[1]))["words"]
starts = [float(x) for x in sys.argv[3:]]
words = []
for h in heard:
    w = dict(w=h["w"].strip(), start=h["start"], end=h["end"], heard=True)
    # whisper's "50 juta ya," and "berbulan -bulan": glue a hyphen tail back onto its word
    if words and re.match(r"^-\w", w["w"]):
        words[-1]["w"] += w["w"]
        words[-1]["end"] = w["end"]
        continue
    w["scene"] = max(i + 1 for i, s in enumerate(starts) if h["start"] >= s - 0.05)
    words.append(w)
for i, w in enumerate(words):
    w["i"], w["f0"], w["f1"] = i, round(w["start"] * FPS), round(w["end"] * FPS)
json.dump({"fps": FPS, "words": words}, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print(len(words), "words;", {s: sum(1 for w in words if w["scene"] == s) for s in range(1, len(starts) + 1)})
