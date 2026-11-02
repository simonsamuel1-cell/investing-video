#!/usr/bin/env python3
"""Lonjakan antar-frame (tanda patah-patah/loncat): beda rata-rata |f − f−1| (tanpa pita subtitle) dibanding median 6 tetangga.
   python3 scripts/jeglek.py Ide-S05"""
import sys, glob, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
fs = sorted(glob.glob(str(ROOT / f"out/jeglek/{sys.argv[1]}/f*.png")))
fr = [int(re.search(r"f(\d+)\.png", p).group(1)) for p in fs]
A = []
for p in fs:
    a = np.asarray(Image.open(p).convert("L")).astype(np.float32); a[int(0.86 * a.shape[0]):, :] = 0; A.append(a)
d = {}
for i in range(1, len(A)):
    if fr[i] == fr[i - 1] + 1: d[fr[i]] = float(np.abs(A[i] - A[i - 1]).mean())
temuan = 0
for f, v in d.items():
    tet = [d[g] for g in range(f - 3, f + 4) if g != f and g in d]
    if len(tet) >= 4:
        m = float(np.median(tet))
        if v > 0.6 and v > 3.0 * max(m, 0.08):
            temuan += 1; print(f"  LONJAKAN f{f}: beda {v:.2f} vs median tetangga {m:.2f}")
print(f"{sys.argv[1]}: {len(d)} pasang frame diuji · {temuan} lonjakan")
