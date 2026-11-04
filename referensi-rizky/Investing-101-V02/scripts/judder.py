#!/usr/bin/env python3
"""Analisis satu potongan PNG skala penuh: per PETAK 60×60, PERSEN piksel yang berubah ≥ 16 level antar frame berturutan
(langkah warna latar ±1 diabaikan; pudar 60f berubah ≤ 6/frame — ambang 6 menghasilkan derau, terukur 8 Okt; lompatan 1 px di tepi
benda berubah puluhan level). Pita subtitle diabaikan.
Tulis baris JSON per pasangan frame: {f, petak:[[i,j,persen],...]} hanya petak > 0,1 %.
   python3 scripts/judder.py DIR f_awal keluaran.jsonl   ·   ringkasan: python3 scripts/judder.py --lapor keluaran.jsonl"""
import sys, glob, json, re
import numpy as np
from PIL import Image
P = 60
if sys.argv[1] == '--lapor':
    rows = [json.loads(l) for l in open(sys.argv[2])]
    seq = {}
    for r in rows:
        for i, j, d in r['petak']: seq.setdefault((i, j), {})[r['f']] = d
    temuan = []
    for (i, j), s in seq.items():
        for f, d in s.items():
            tet = [s.get(g, 0.0) for g in (f - 2, f - 1, f + 1, f + 2)]
            # langkah terisolasi: petak berubah, tetangga (±2) nyaris diam → pembulatan piksel / loncatan
            if d >= 1.0 and max(tet) < d / 3.5:
                temuan.append((f, i, j, round(d, 2), round(max(tet), 2)))
    temuan.sort()
    frames = sorted({t[0] for t in temuan})
    print(f'{len(temuan)} petak-langkah terisolasi di {len(frames)} frame')
    for t in temuan[:80]: print('  f%d petak(%d,%d) x%d-%d y%d-%d %.2f%% tetangga %.2f%%' % (t[0], t[1], t[2], t[2]*P, t[2]*P+P, t[1]*P, t[1]*P+P, t[3], t[4]))
    sys.exit()
d, a0, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
fs = sorted(glob.glob(f'{d}/*.png'), key=lambda p: int(re.search(r'(\d+)\.png$', p).group(1)))
prev = None
with open(out, 'a') as o:
    for k, p in enumerate(fs):
        x = np.asarray(Image.open(p).convert('L'), dtype=np.float32)[:960]  # buang pita subtitle (y ≥ 960)
        if prev is not None:
            g = (np.abs(x - prev) >= 16).reshape(960 // P, P, 1920 // P, P).mean(axis=(1, 3)) * 100
            idx = np.argwhere(g > 0.1)
            o.write(json.dumps({'f': a0 + k, 'petak': [[int(i), int(j), round(float(g[i, j]), 3)] for i, j in idx]}) + '\n')
        prev = x
