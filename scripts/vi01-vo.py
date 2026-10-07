#!/usr/bin/env python3
"""
vi01-vo.py — builds public/vo/passive-income.mp3 from Simon's original
`INV01 - Main VO.MP3`, with every pad in src/episodes/vi01-passive-income/
data/pads.json spliced in as silence, on samples (44.1 kHz / 60 fps = 735).

The original is never touched; every pad is re-applied from it each run, so
pads never compound. Frames in pads.json are frames of the ORIGINAL VO.

RETAKES (data/retakes.json) replace a stretch of the original, [from, to) in
original frames, with a re-recorded file, whole. A retake shorter than the
stretch is followed by silence to fill it; a longer one pushes everything
after it later by the difference — "Kalo durasinya ngga muat untuk replace,
geser vo aslinya, buat gap tambahan." scripts/vi01-align.py reads the same file.

Usage: python3 scripts/vi01-vo.py
"""
import json
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = Path("/Users/samuelsurja/Documents/01 Academy/INV01 - Passive Income/INV01 - Main VO.MP3")
OUT = ROOT / "public" / "vo" / "passive-income.mp3"
PADS = json.loads((ROOT / "src/episodes/vi01-passive-income/data/pads.json").read_text())
RETAKES = json.loads((ROOT / "src/episodes/vi01-passive-income/data/retakes.json").read_text())
SR, SPF = 44100, 735


def pcm(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(SRC), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
events = [("pad", p["at"], p) for p in PADS] + [("retake", r["from"], r) for r in RETAKES]
parts, last, added = [], 0, 0
for kind, at, e in sorted(events, key=lambda x: x[1]):
    cut = at * SPF
    assert cut >= last, f"{kind} at {at} overlaps the one before it"
    parts.append(a[last:cut])
    if kind == "pad":
        parts.append(np.zeros((e["frames"] * SPF, 2), np.float32))
        added += e["frames"]
        last = cut
    else:
        take = pcm(e["file"])
        room = (e["to"] - e["from"]) * SPF
        # whole frames, so every later beat stays on the frame grid
        take = take[: (len(take) // SPF) * SPF]
        parts.append(take)
        if len(take) < room:
            parts.append(np.zeros((room - len(take), 2), np.float32))
        else:
            added += (len(take) - room) // SPF
        print(f"  retake {Path(e['file']).name}: {len(take) // SPF} f into {e['to'] - e['from']} f")
        last = e["to"] * SPF
parts.append(a[last:])
out = np.concatenate(parts)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                "-c:a", "libmp3lame", "-b:a", "192k", str(OUT)], input=out.tobytes(), check=True)
print(f"{OUT.name}: {len(a) / SR:.3f}s -> {len(out) / SR:.3f}s, +{added} frames")
