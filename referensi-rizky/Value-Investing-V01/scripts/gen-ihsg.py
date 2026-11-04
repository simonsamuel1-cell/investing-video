#!/usr/bin/env python3
"""IHSG (^JKSE) riil → src/data/ihsg.gen.ts (Scene 07 VI V01).
Sumber: data-riil/yahoo/JKSE_harian_2007_2026.txt (Yahoo chart API harian, diambil 30 Okt 2026 lewat browser bawaan — curl kena 429).
Keluaran: penutupan MINGGUAN (minggu mulai Senin, tutup = hari bursa terakhir minggu itu) + periode penurunan yang disebut naskah.
Aturan periode (satu aturan untuk semua): dasar = tutup harian terendah di jendela tahun itu; puncak = tutup harian tertinggi dalam 15 bulan
SEBELUM dasar; pulih = tutup harian pertama sesudah dasar yang ≥ puncak (None = belum pulih per data terakhir)."""
import datetime as dt, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
baris = [l.strip() for l in (ROOT / 'data-riil/yahoo/JKSE_harian_2007_2026.txt').read_text().splitlines() if l.strip() and not l.lstrip('d=').startswith('#')]
D = []
for l in baris:
    t, o, h, lo, c = l.split(',')
    D.append((dt.date.fromisoformat(t), float(c)))
# mingguan
W = {}
for d, c in D:
    mon = d - dt.timedelta(days=d.weekday())
    W[mon] = (d, c)  # urut menaik → yang terakhir = tutup minggu
minggu = sorted(W.items())
def tahun(d): return round(d.year + (d.timetuple().tm_yday - 1) / (366 if d.year % 4 == 0 else 365), 4)
JENDELA = {'2008': ('2008-01-01', '2008-12-31'), '2013': ('2013-05-01', '2013-12-31'), '2015': ('2015-03-01', '2015-12-31'),
           '2020': ('2020-01-01', '2020-12-31'), '2025': ('2025-01-01', '2025-06-30'), '2026': ('2026-01-01', '2026-10-31')}
per = []
for k, (a, b) in JENDELA.items():
    a, b = dt.date.fromisoformat(a), dt.date.fromisoformat(b)
    ti = min((i for i, (d, c) in enumerate(D) if a <= d <= b), key=lambda i: D[i][1])
    td = D[ti][0]
    batas = dt.date(td.year - (1 if td.month <= 3 else 0), (td.month - 3 - 1) % 12 + 1, 1) - dt.timedelta(days=365)  # ±15 bulan
    pi = max((i for i in range(ti) if D[i][0] >= batas), key=lambda i: D[i][1])
    ri = next((i for i in range(ti + 1, len(D)) if D[i][1] >= D[pi][1]), None)
    bulan = None if ri is None else round((D[ri][0] - td).days / 30.44)
    per.append({'tahun': k, 'puncak': D[pi][0].isoformat(), 'tPuncak': tahun(D[pi][0]), 'cPuncak': round(D[pi][1], 2),
                'dasar': td.isoformat(), 'tDasar': tahun(td), 'cDasar': round(D[ti][1], 2), 'turun': round((D[ti][1] / D[pi][1] - 1) * 100, 1),
                'pulih': None if ri is None else D[ri][0].isoformat(), 'tPulih': None if ri is None else tahun(D[ri][0]), 'bulan': bulan})
akhir = D[-1]
out = ["/* DIBANGKITKAN scripts/gen-ihsg.py dari data-riil/yahoo/JKSE_harian_2007_2026.txt — jangan diedit tangan. */",
       f"/** IHSG mingguan [tahun desimal, tutup] {minggu[0][1][0]} … {akhir[0]} ({len(minggu)} minggu) */",
       "export const IHSG_MINGGUAN: [number, number][] = " + json.dumps([[tahun(d), round(c, 1)] for _, (d, c) in minggu], separators=(',', ':')) + ";",
       "export type Periode = { tahun: string; puncak: string; tPuncak: number; cPuncak: number; dasar: string; tDasar: number; cDasar: number; turun: number;"
       " pulih: string | null; tPulih: number | null; bulan: number | null };",
       "export const PERIODE_TURUN: Periode[] = " + json.dumps(per, ensure_ascii=False) + ";",
       f"export const IHSG_TERAKHIR = {{ tanggal: '{akhir[0].isoformat()}', tutup: {round(akhir[1], 2)} }};"]
(ROOT / 'src/data/ihsg.gen.ts').write_text('\n'.join(out) + '\n')
for p in per: print(p['tahun'], p['puncak'], p['cPuncak'], '→', p['dasar'], p['cDasar'], f"{p['turun']}%", 'pulih', p['pulih'], p['bulan'], 'bln')
print(len(minggu), 'minggu')
