#!/usr/bin/env python3
"""CANDLE RIIL SCENE 07 → src/data/lilinS07.gen.ts (Simon 30 Okt S07: "Ganti line chart ke candlestick (cek screenshootku, yang ingin aku ganti hanya
bagian itu)" = kartu "Harga turun · IHSG Jan–Mar 2020").

  IHSG_2020  ^JKSE candle HARIAN 2 Jan – 31 Mar 2020 (Yahoo, data-riil/yahoo/JKSE_harian_2007_2026.txt). TURUN_2020 = tutup terendah ÷ tutup tertinggi
             periode itu − 1 (dihitung dari candle yang sama yang tampil — dulu 33,7 % dari penutupan MINGGUAN garis lama).
"""
import os
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = []
for baris in open(os.path.join(AKAR, 'data-riil', 'yahoo', 'JKSE_harian_2007_2026.txt')):
    if not baris[:1].isdigit():
        continue
    t, o, h, l, c = baris.strip().split(',')
    if '2020-01-01' <= t <= '2020-03-31':
        rows.append((t, float(o), float(h), float(l), float(c)))
cMax = max(rows, key=lambda r: r[4]); cMin = min(rows, key=lambda r: r[4])
turun = (cMin[4] / cMax[4] - 1) * 100
isi = ',\n'.join(f"  {{ t: '{t}', o: {o:.2f}, h: {h:.2f}, l: {l:.2f}, c: {c:.2f} }}" for t, o, h, l, c in rows)
out = ['// DIBANGKITKAN scripts/gen-lilin-s07.py — jangan disunting tangan.', "import type { LilinRiil } from './lilinRiil.gen';", '',
       f'/** ^JKSE harian 2 Jan – 31 Mar 2020 ({len(rows)} candle) */', f'export const IHSG_2020: LilinRiil[] = [\n{isi},\n];',
       f'/** tutup tertinggi {cMax[0]} {cMax[4]:.2f} → tutup terendah {cMin[0]} {cMin[4]:.2f} */', f'export const TURUN_2020 = {turun:.2f};', '']
open(os.path.join(AKAR, 'src', 'data', 'lilinS07.gen.ts'), 'w').write('\n'.join(out))
print(len(rows), 'candle ·', cMax[0], cMax[4], '→', cMin[0], cMin[4], f'= {turun:.1f} %')
