#!/usr/bin/env python3
"""Ukur kotak sorot judul (ungu #5F4DEE) dan jarak tinta teks putih di dalamnya ke tiap tepi kotak.
pakai: python3 scripts/ukur-sorot.py out/stills/<still>.png [...]"""
import sys
from PIL import Image
import numpy as np
for p in sys.argv[1:]:
    a = np.asarray(Image.open(p).convert("RGB")).astype(int)[30:170, :1450]
    blue = (abs(a[:, :, 0] - 0x5F) < 10) & (abs(a[:, :, 1] - 0x4D) < 10) & (abs(a[:, :, 2] - 0xEE) < 10)
    cols = np.where(blue.sum(axis=0) > 20)[0]; rows = np.where(blue.sum(axis=1) > 20)[0]
    x0, x1, y0, y1 = cols.min(), cols.max(), rows.min(), rows.max()
    box = a[y0:y1 + 1, x0:x1 + 1]; bm = blue[y0:y1 + 1, x0:x1 + 1]
    # piksel putih HANYA yang diapit ungu di baris & kolomnya (sudut membulat di luar kotak = latar, bukan tinta)
    inside = np.zeros_like(bm)
    for r in range(bm.shape[0]):
        c = np.where(bm[r])[0]
        if len(c): inside[r, c.min():c.max() + 1] = True
    for c in range(bm.shape[1]):
        r = np.where(bm[:, c])[0]
        col = np.zeros(bm.shape[0], bool)
        if len(r): col[r.min():r.max() + 1] = True
        inside[:, c] &= col
    wy, wx = np.where((box.min(axis=2) > 215) & inside)
    L, Rr, T, Bt = wx.min(), box.shape[1] - 1 - wx.max(), wy.min(), box.shape[0] - 1 - wy.max()
    print(f"{p.split('/')[-1]}: kotak {x1 - x0 + 1}x{y1 - y0 + 1} @x{x0} y{y0 + 30} · tinta→tepi kiri {L} kanan {Rr} atas {T} bawah {Bt} · pusat kotak x {(x0 + x1) / 2:.1f}")
