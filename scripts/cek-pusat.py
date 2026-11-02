#!/usr/bin/env python3
"""Verifikasi pusat isi DENGAN kamera (KAMERA=1 node scripts/ukur-pusat.mjs → out/pusat/SC-kamera): pusat kotak isi tiap
sampel yang diam; lapor simpangan dari (960, 540). python3 scripts/cek-pusat.py S01"""
import sys, glob, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
SC = sys.argv[1]; SKALA = 1
fs = sorted(glob.glob(str(ROOT / f"out/pusat/{SC}-kamera/f*.png")))
rows = []
for p in fs:
    a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
    m = ((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60) | (np.maximum(a[..., 0], a[..., 2]) > 90)  # isi padat ATAU elemen redup (putih/warna transparan) — bayangan (gelap+transparan) tidak
    kol = np.nonzero(m.sum(axis=0) >= 3)[0]; bar = np.nonzero(m.sum(axis=1) >= 3)[0]
    lok = int(re.search(r"f(\d+)\.png", p).group(1))
    if len(kol) < 4: rows.append((lok, None)); continue
    rows.append((lok, ((kol[0] + kol[-1] + 1) * SKALA / 2, (bar[0] + bar[-1] + 1) * SKALA / 2)))
dev = []
for k in range(1, len(rows) - 1):
    c0, c, c1 = rows[k - 1][1], rows[k][1], rows[k + 1][1]
    if c and c0 and c1 and max(abs(c[0] - c0[0]), abs(c[1] - c0[1]), abs(c1[0] - c[0]), abs(c1[1] - c[1])) <= 3:
        dev.append((rows[k][0], c[0] - 960, c[1] - 540))
dx = [abs(d[1]) for d in dev]; dy = [abs(d[2]) for d in dev]
print(f"{SC}: {len(dev)} sampel diam · simpangan x maks {max(dx):.0f} (median {np.median(dx):.0f}) · y maks {max(dy):.0f} (median {np.median(dy):.0f})")
buruk = [d for d in dev if abs(d[1]) > 10 or abs(d[2]) > 10]
for d in buruk[:20]: print(f"  {d[0]/60:5.1f} dtk  dx {d[1]:+.0f}  dy {d[2]:+.0f}")
