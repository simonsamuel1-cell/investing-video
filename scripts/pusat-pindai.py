#!/usr/bin/env python3
"""pusat tinta ISI tiap still out/ukur-pindai/f*.png (mode ukur, latar #00FF00). Isi = G−max(R,B) < 60 ATAU max(R,B) > 90
   (bayangan kaca di atas hijau tetap hijau → tidak dihitung). Cetak simpangan dari (960,540); tanda ! bila |dx| atau |dy| > AMBANG."""
import sys, glob, re
import numpy as np
from PIL import Image
AMBANG = int(sys.argv[1]) if len(sys.argv) > 1 else 25
for p in sorted(glob.glob('out/ukur-pindai/f*.png')):
    f = int(re.search(r'f(\d+)', p).group(1))
    a = np.asarray(Image.open(p).convert('RGB')).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    isi = ((g - np.maximum(r, b)) < 60) | (np.maximum(r, b) > 90)
    ys, xs = np.where(isi)
    if len(xs) < 50: print(f'f{f:5d}  (kosong)'); continue
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    dx, dy = (x0 + x1) / 2 - 960, (y0 + y1) / 2 - 540
    tanda = ' !' if abs(dx) > AMBANG or abs(dy) > AMBANG else ''
    print(f'f{f:5d}  x {x0:4d}–{x1:4d}  y {y0:4d}–{y1:4d}  simpang ({dx:+4.0f}, {dy:+4.0f}){tanda}')
