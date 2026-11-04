#!/usr/bin/env python3
"""CANDLE RIIL SCENE 04 → src/data/lilinS04.gen.ts (Simon 30 Okt S04: "alih alih menggunakan linechart yang bergerak dengan cepat, ganti saja dengan
candlestick dengan volatilitas yang sama, animasikan candlenya dengan realistis seperti contoh yang sebelumnya aku kirim" · "Ganti linechart ke candlestick").
Sumber: ICBP harian Yahoo (data-riil/yahoo/ICBP.JK_1d_2y.json) — saham yang sama dengan Scene 01.

  ICBP_HARGA     4 Agu – 31 Okt 2025: kartu "Harga · tiap detik" — chart BERGULIR resep video TA (riwayat memenuhi jendela, candle baru tumbuh di kanan).
  ICBP_SENTIMEN  1 Des 2025 – 29 Jan 2026: tenang 7.900–8.450, lalu sentimen pasar berubah (minggu anjlok IHSG akhir Jan 2026) — ICBP 8.400
                 (tutup 26 Jan) → 7.225 (terendah 29 Jan) = −14,0 %.
"""
import datetime, json, os
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(AKAR, 'data-riil', 'yahoo', 'ICBP.JK_1d_2y.json')))
r = d['chart']['result'][0]; q = r['indicators']['quote'][0]
rows = []
for i, t in enumerate(r['timestamp']):
    o, h, l, c, v = q['open'][i], q['high'][i], q['low'][i], q['close'][i], q['volume'][i]
    if None in (o, h, l, c) or not v:
        continue
    rows.append((str(datetime.datetime.utcfromtimestamp(t + 25200).date()), o, h, l, c))
jendela = lambda a, b: [x for x in rows if a <= x[0] <= b]
harga = jendela('2025-08-04', '2025-10-31')
senti = jendela('2025-12-01', '2026-01-29')
turun = (min(x[3] for x in senti[-3:]) - senti[-4][4]) / senti[-4][4] * 100
assert senti[-4][0] == '2026-01-26' and round(turun, 1) == -14.0, (senti[-4], turun)


def ts(nama, data, ket):
    isi = ',\n'.join(f"  {{ t: '{t}', o: {o:g}, h: {h:g}, l: {l:g}, c: {c:g} }}" for t, o, h, l, c in data)
    return f'/** {ket} */\nexport const {nama}: LilinRiil[] = [\n{isi},\n];\n'


out = ['// DIBANGKITKAN scripts/gen-lilin-s04.py — jangan disunting tangan.', "import type { LilinRiil } from './lilinRiil.gen';", '',
       ts('ICBP_HARGA', harga, f'ICBP harian 4 Agu – 31 Okt 2025 ({len(harga)} candle) — kartu Harga tiap detik'),
       ts('ICBP_SENTIMEN', senti, f'ICBP harian 1 Des 2025 – 29 Jan 2026 ({len(senti)} candle); 26 Jan tutup 8.400 → 29 Jan terendah 7.225 = {turun:.1f} %'),
       f'export const ICBP_SENTIMEN_TURUN = {turun:.1f};\n']
open(os.path.join(AKAR, 'src', 'data', 'lilinS04.gen.ts'), 'w').write('\n'.join(out))
print('harga', len(harga), harga[0][0], harga[-1][0], '· sentimen', len(senti), senti[0][0], senti[-1][0], f'{turun:.1f} %')
