#!/usr/bin/env python3
"""CANDLE RIIL SCENE 05 → src/data/lilinS05.gen.ts (Simon 30 Okt S05: "Buat line chartnya jadi candlestick realistis. Tambahkan juga garis support dan
resistance."). Panel "Hasilnya bisa terasa lambat": harga tetap rendah berbulan-bulan.

  IHSG_S05  ^JKSE candle MINGGUAN (Senin–Jumat, dari OHLC harian Yahoo data-riil/yahoo/JKSE_harian_2007_2026.txt) 1 Des 2022 – 30 Nov 2023: setahun
            menyamping. SUPPORT = rata-rata 4 titik terendah mingguan, RESISTANCE = rata-rata 4 titik tertinggi mingguan (dibulatkan 10). Chart tanpa nama.
"""
import datetime, os
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mg = {}
for baris in open(os.path.join(AKAR, 'data-riil', 'yahoo', 'JKSE_harian_2007_2026.txt')):
    if not baris[:1].isdigit():
        continue
    t, o, h, l, c = baris.strip().split(',')
    if not ('2022-12-01' <= t <= '2023-11-30'):
        continue
    d = datetime.date.fromisoformat(t)
    mg.setdefault((d - datetime.timedelta(days=d.weekday())).isoformat(), []).append(tuple(map(float, (o, h, l, c))))
w = [(k, v[0][0], max(x[1] for x in v), min(x[2] for x in v), v[-1][3]) for k, v in sorted(mg.items())]
sup = round(sum(sorted(x[3] for x in w)[:4]) / 4, -1)
res = round(sum(sorted((x[2] for x in w), reverse=True)[:4]) / 4, -1)
isi = ',\n'.join(f"  {{ t: '{t}', o: {o:.2f}, h: {h:.2f}, l: {l:.2f}, c: {c:.2f} }}" for t, o, h, l, c in w)
out = ['// DIBANGKITKAN scripts/gen-lilin-s05.py — jangan disunting tangan.', "import type { LilinRiil } from './lilinRiil.gen';", '',
       f'/** ^JKSE mingguan 1 Des 2022 – 30 Nov 2023 ({len(w)} candle): menyamping setahun */', f'export const IHSG_S05: LilinRiil[] = [\n{isi},\n];',
       f'/** support = rata-rata 4 terendah mingguan · resistance = rata-rata 4 tertinggi mingguan */', f'export const SUPPORT_S05 = {sup:g};', f'export const RESISTANCE_S05 = {res:g};', '']
open(os.path.join(AKAR, 'src', 'data', 'lilinS05.gen.ts'), 'w').write('\n'.join(out))
print(len(w), 'candle · support', sup, '· resistance', res)
