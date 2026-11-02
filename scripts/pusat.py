#!/usr/bin/env python3
"""pusat kotak tinta ISI (bukan hijau kunci) di still mode ukur: python3 scripts/pusat.py Ide-S01 100 200 …"""
import sys
import numpy as np
from PIL import Image
comp, frames = sys.argv[1], [int(x) for x in sys.argv[2:]]
for f in frames:
    a = np.asarray(Image.open(f"out/ukur/{comp}_f{f:05d}.png").convert("RGB")).astype(int)
    hijau = (np.abs(a[:, :, 0] - 0) < 40) & (np.abs(a[:, :, 1] - 255) < 40) & (np.abs(a[:, :, 2] - 0) < 40)
    ys, xs = np.where(~hijau)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    print(f"f{f:5d}  tinta x {x0}–{x1}  y {y0}–{y1}  pusat ({(x0 + x1) / 2:.0f}, {(y0 + y1) / 2:.0f})  simpang ({(x0 + x1) / 2 - 960:+.0f}, {(y0 + y1) / 2 - 540:+.0f})")
