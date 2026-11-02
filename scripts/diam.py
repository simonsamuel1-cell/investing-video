#!/usr/bin/env python3
"""Jendela DIAM (tanpa gerak) dari sampel pindai.mjs (LANGKAH > 1): piksel berubah > 8 level antar-sampel, tanpa pita subtitle (≥ 0,9 H)
   & logo (kanan-atas). Diam = < 25 piksel berubah. Laporkan jendela ≥ AMBANG frame.  python3 scripts/diam.py [folder] [ambang=36]"""
import sys, glob, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
KE = sys.argv[1] if len(sys.argv) > 1 else 'diam'; AMBANG = int(sys.argv[2]) if len(sys.argv) > 2 else 36
fs = sorted(glob.glob(str(ROOT / f"out/{KE}/f*.png")))
fr = [int(re.search(r"f(\d+)\.png", p).group(1)) for p in fs]
def muat(p):
    a = np.asarray(Image.open(p).convert("L")).astype(np.int16)
    h, w = a.shape; a[int(0.9 * h):, :] = 0; a[: int(0.15 * h), int(0.75 * w):] = 0
    return a
A = [muat(p) for p in fs]
diam = [False] + [int((np.abs(A[i] - A[i - 1]) > 8).sum()) < 25 for i in range(1, len(A))]
i = 0; n = 0
while i < len(A):
    if diam[i]:
        j = i
        while j + 1 < len(A) and diam[j + 1] and fr[j + 1] - fr[j] < 40: j += 1
        a, b = fr[i - 1], fr[j]
        if b - a >= AMBANG: n += 1; print(f"  DIAM f{a}–f{b} ({b - a}f)")
        i = j + 1
    else: i += 1
print(f"{KE}: {len(A)} sampel · {n} jendela diam ≥ {AMBANG}f")
