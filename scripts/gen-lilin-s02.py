#!/usr/bin/env python3
"""CANDLE RIIL SCENE 02 → src/data/lilinS02.gen.ts (Simon 30 Okt: "Ganti linechart dengan candlestick (buat candlenya realistis)" · "Adegan manfaatkan
market, buat line chartnya jadi candlestick (realistis seperti market saham asli)").

  DOW_1929   Dow Jones Industrial Average, candle BULANAN Sep 1929 – Jul 1932 (35 candle). Sumber: penutupan harian DJIA
             (data-riil/DJIA_harian_1929_1932.csv = paket R `stevedata::DJIA` — MeasuringWorth/Pinnacle Systems; OHLC harian 1929 tidak tersedia
             terbuka) → buka = penutupan akhir bulan sebelumnya, tertinggi/terendah = penutupan harian tertinggi/terendah bulan itu (termasuk buka),
             tutup = penutupan hari bursa terakhir. Puncak 3 Sep 1929 381,17 · dasar 8 Jul 1932 41,22 (−89,2 %).
  IHSG_S02   ^JKSE candle MINGGUAN (Senin–Jumat, dari OHLC harian Yahoo data-riil/yahoo/JKSE_harian_2007_2026.txt) 2 Sep 2024 – 13 Feb 2026 (75
             candle): ±7.700 → takut Apr 2025 (terendah 5.883) → optimistis Jan 2026 (tertinggi 9.174). Chart tanpa nama (ilustrasi pilar 03).
"""
import csv, datetime, os
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Dow Jones bulanan ──
harian = [(r['date'], float(r['value'])) for r in csv.DictReader(open(os.path.join(AKAR, 'data-riil', 'DJIA_harian_1929_1932.csv')))]
bulan = {}
for t, v in harian:
    bulan.setdefault(t[:7], []).append((t, v))
kunci = sorted(bulan)
dow = []
for i, k in enumerate(kunci):
    if not ('1929-09' <= k <= '1932-07'):
        continue
    o = bulan[kunci[i - 1]][-1][1]
    vs = [v for _, v in bulan[k]]
    dow.append((bulan[k][0][0], o, max([o] + vs), min([o] + vs), vs[-1]))
assert len(dow) == 35 and max(b[2] for b in dow) == 381.17 and min(b[3] for b in dow) == 41.22, (len(dow), max(b[2] for b in dow), min(b[3] for b in dow))

# ── IHSG mingguan ──
rows = []
for baris in open(os.path.join(AKAR, 'data-riil', 'yahoo', 'JKSE_harian_2007_2026.txt')):
    if not baris[:1].isdigit():
        continue
    t, o, h, l, c = baris.strip().split(',')
    rows.append((t, float(o), float(h), float(l), float(c)))
minggu = {}
for t, o, h, l, c in rows:
    if not ('2024-09-02' <= t <= '2026-02-13'):
        continue
    d = datetime.date.fromisoformat(t)
    senin = d - datetime.timedelta(days=d.weekday())
    minggu.setdefault(senin.isoformat(), []).append((o, h, l, c))
ihsg = [(k, v[0][0], max(x[1] for x in v), min(x[2] for x in v), v[-1][3]) for k, v in sorted(minggu.items())]
assert len(ihsg) == 75, len(ihsg)  # 75 minggu (minggu libur penuh Lebaran 2025 tak bercandle)


def ts(nama, data, ket):
    isi = ',\n'.join(f"  {{ t: '{t}', o: {o:.2f}, h: {h:.2f}, l: {l:.2f}, c: {c:.2f} }}" for t, o, h, l, c in data)
    return f'/** {ket} */\nexport const {nama}: LilinRiil[] = [\n{isi},\n];\n'


out = ['// DIBANGKITKAN scripts/gen-lilin-s02.py — jangan disunting tangan.', "import type { LilinRiil } from './lilinRiil.gen';", '',
       ts('DOW_1929', dow, 'Dow Jones bulanan Sep 1929 – Jul 1932 dari penutupan harian (MeasuringWorth/Pinnacle via stevedata); puncak 381,17 · dasar 41,22'),
       ts('IHSG_S02', ihsg, '^JKSE mingguan 2 Sep 2024 – 13 Feb 2026 (Yahoo harian): takut Apr 2025 (5.883) → optimistis Jan 2026 (9.174)')]
open(os.path.join(AKAR, 'src', 'data', 'lilinS02.gen.ts'), 'w').write('\n'.join(out))
print('DOW', len(dow), dow[0], dow[1], dow[-1])
print('IHSG', len(ihsg), ihsg[0], 'min', min(ihsg, key=lambda b: b[3])[:1], min(b[3] for b in ihsg), 'max', max(ihsg, key=lambda b: b[2])[:1], max(b[2] for b in ihsg))
