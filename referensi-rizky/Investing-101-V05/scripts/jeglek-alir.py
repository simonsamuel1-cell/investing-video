#!/usr/bin/env python3
"""JEGLEK versi MENGALIR (22 Okt, video 29,6 rb frame): logika = scripts/jeglek.py (beda rata-rata |f − f−1| tanpa pita subtitle 14 % bawah,
   lonjakan bila > 0,6 dan > 3× median 6 tetangga), tapi frame dibaca satu per satu — hanya selisih yang disimpan (memori kecil).
   python3 scripts/jeglek-alir.py [folder=jeglek]"""
import sys, glob, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
KE = sys.argv[1] if len(sys.argv) > 1 else 'jeglek'
fs = sorted(glob.glob(str(ROOT / f"out/{KE}/f*.png")))
fr = [int(re.search(r"f(\d+)\.png", p).group(1)) for p in fs]
def muat(p):
    a = np.asarray(Image.open(p).convert("L")).astype(np.float32); a[int(0.86 * a.shape[0]):, :] = 0; return a
d, prev = {}, None
for i, p in enumerate(fs):
    a = muat(p)
    if prev is not None and fr[i] == fr[i - 1] + 1: d[fr[i]] = float(np.abs(a - prev).mean())
    prev = a
temuan = 0
for f, v in d.items():
    tet = [d[g] for g in range(f - 3, f + 4) if g != f and g in d]
    if len(tet) >= 4:
        m = float(np.median(tet))
        if v > 0.6 and v > 3.0 * max(m, 0.08):
            temuan += 1; print(f"  LONJAKAN f{f}: beda {v:.2f} vs median tetangga {m:.2f}")
print(f"{KE}: {len(d)} pasang frame diuji · {temuan} lonjakan")
