#!/usr/bin/env python3
"""
sub-check.py — hears both sides of every tight subtitle boundary: the slice before one should end on the cue's last word,
the slice after it should open on the next cue's first. Reading word times against the loudness alone can't do this, because
a sentence's split rarely sits on a pause. One line per boundary, read by eye.

  ~/.venvs/tuntun/bin/python -I scripts/vi/sub-check.py public/vo/<ep>.mp3 src/episodes/<ep>/subtitles.ts
"""
import re
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

SR = 16000
SIDE = 80  # frames heard on each side
TIGHT = 25  # a wider gap between two cues is a real pause: nothing to check

x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout, np.float32)
cues = [(int(a), int(b), t) for a, b, t in re.findall(r'start: (\d+), end: (\d+), text: "(.*?)" }', open(sys.argv[2]).read())]
model = WhisperModel("small", device="cpu", compute_type="int8")


def hear(a, b):
    segs, _ = model.transcribe(x[int(a / 60 * SR) : int(b / 60 * SR)], language="id", vad_filter=False, condition_on_previous_text=False)
    return " ".join(s.text.strip() for s in segs)


for i, (c, d) in enumerate(zip(cues, cues[1:])):
    if d[0] - c[1] <= TIGHT:
        print(f"{i:3d} f{d[0]} …{c[2][-26:]} | {d[2][:24]} || heard: {hear(d[0] - SIDE, d[0])[-30:]} | {hear(d[0], d[0] + SIDE)[:30]}", flush=True)
