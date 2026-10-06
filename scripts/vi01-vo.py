#!/usr/bin/env python3
"""
vi01-vo.py — builds public/vo/passive-income.mp3 from Simon's original
`INV01 - Main VO.MP3`, with every pad in src/episodes/vi01-passive-income/
data/pads.json spliced in as silence, on samples (44.1 kHz / 60 fps = 735).

The original is never touched; every pad is re-applied from it each run, so
pads never compound. Frames in pads.json are frames of the ORIGINAL VO.

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
SR, SPF = 44100, 735

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(SRC), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
parts, last = [], 0
for p in sorted(PADS, key=lambda p: p["at"]):
    cut = p["at"] * SPF
    parts += [a[last:cut], np.zeros((p["frames"] * SPF, 2), np.float32)]
    last = cut
parts.append(a[last:])
out = np.concatenate(parts)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                "-c:a", "libmp3lame", "-b:a", "192k", str(OUT)], input=out.tobytes(), check=True)
print(f"{OUT.name}: {len(a) / SR:.3f}s -> {len(out) / SR:.3f}s, +{sum(p['frames'] for p in PADS)} frames")
