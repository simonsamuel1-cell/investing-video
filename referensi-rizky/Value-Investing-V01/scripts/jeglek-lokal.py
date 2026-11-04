#!/usr/bin/env python3
"""JEGLEK LOKAL (15 Okt) — lonjakan per WILAYAH, bukan rata-rata seluruh frame.
   Alasan: dompet Uang Stabil S07 hilang 1 frame di tengah masker (f8828) — rata-rata seluruh frame naik hanya 1,1× tetangganya (masker sedang
   bergerak besar), jadi scripts/jeglek.py (ambang 3× median, skala 0,5) melewatkannya. Di sini frame dibagi blok 64×64 (SKALA PENUH); tiap blok
   dibandingkan dengan blok yang SAMA di 4 frame sebelum & sesudahnya. Lonjakan = beda blok > 12 dan > 2,5× median tetangganya.
   python3 scripts/jeglek-lokal.py [folder=jlokal]"""
import sys, glob, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
KE = sys.argv[1] if len(sys.argv) > 1 else 'jlokal'
fs = sorted(glob.glob(str(ROOT / f"out/{KE}/f*.png")))
fr = [int(re.search(r"f(\d+)\.png", p).group(1)) for p in fs]
BL = 64
prev = None; D = {}
for p, f in zip(fs, fr):
    a = np.asarray(Image.open(p).convert("L")).astype(np.float32)
    a = a[: int(0.86 * a.shape[0])]  # tanpa pita subtitle
    if prev is not None and (f - 1) in D or prev is not None:
        d = np.abs(a - prev)
        H, W = d.shape[0] // BL, d.shape[1] // BL
        D[f] = d[: H * BL, : W * BL].reshape(H, BL, W, BL).mean(axis=(1, 3))
    prev = a
temuan = 0
for f, blk in D.items():
    tet = [D[g] for g in range(f - 4, f + 5) if g != f and g in D]
    if len(tet) < 5: continue
    med = np.median(np.stack(tet), axis=0)
    hit = (blk > 12) & (blk > 2.5 * np.maximum(med, 1.0))
    n = int(hit.sum())
    if n:
        ys, xs = np.where(hit)
        temuan += 1
        print(f"  LONJAKAN f{f}: {n} blok · wilayah x {xs.min() * BL}–{(xs.max() + 1) * BL} y {ys.min() * BL}–{(ys.max() + 1) * BL} · beda maks {blk[hit].max():.1f} vs median {med[hit].max():.1f}")
print(f"{KE}: {len(D)} pasang frame diuji (blok {BL} px gambar) · {temuan} frame berlonjakan")
