#!/usr/bin/env python3
"""
transcribe-align.py — hear a VO ONCE and keep both results: what was actually said (heard.json, whisper's own words
with their times) and the script's words placed on those times (words.json, the same output and scene tags as
align-words.py --script). Use it when the VO may not follow the script: heard.json is what a VO-vs-script comparison
reads, words.json is what the episode is timed by.

  ~/.venvs/tuntun/bin/python scripts/vi/transcribe-align.py VO.mp3 script.txt heard.json words.json [--model M]
"""
import argparse
import importlib.util
import json
import os

spec = importlib.util.spec_from_file_location("align_words", os.path.join(os.path.dirname(__file__), "align-words.py"))
aw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(aw)

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("script")
ap.add_argument("heard_out")
ap.add_argument("words_out")
ap.add_argument("--model", default="mobiuslabsgmbh/faster-whisper-large-v3-turbo")
ap.add_argument("--language", default="id")
a = ap.parse_args()

heard = aw.hear(a.audio, a.model, a.language)
json.dump({"model": a.model, "words": heard}, open(a.heard_out, "w"), ensure_ascii=False, indent=1)
print(f"heard {len(heard)} words -> {a.heard_out}", flush=True)

# the script's words with their scenes, exactly as align-words.py --script reads them
import re

script_words, scenes, scene = [], [], None
for line in open(a.script):
    m = re.match(r"\s*\[SCENE (\d+)[^\]]*\](.*)", line)
    if m:
        scene = int(m.group(1))
        line = "" if re.match(r"\s*[—,]", m.group(2)) or "—" in m.group(2) else m.group(2)
    if line.strip() in ("NARRATION", "NARASI"):
        continue
    for t in re.sub(r"\[[^\]]*\]", " ", line).split():
        script_words.append(t)
        scenes.append(scene)
words = aw.snap_to_pauses(aw.onto_script(heard, script_words), aw.silences(a.audio))
for w, s in zip(words, scenes):
    w["scene"] = s
json.dump(aw.finish(words), open(a.words_out, "w"), ensure_ascii=False, indent=1)
print(f"{len(words)} script words -> {a.words_out}; matched {sum(w['heard'] for w in words)}", flush=True)
