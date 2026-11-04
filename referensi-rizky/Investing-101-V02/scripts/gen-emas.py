#!/usr/bin/env python3
"""
HARGA EMAS ASLI untuk Scene 04 -> src/s04/emas.gen.ts
Acuan Simon (7 Okt): TradingView "GOLD / INDONESIAN RUPIAH GRAM · 1W · ICE" — MINGGUAN, mulai Sen 07 Mar 2016, sumbu harga LOG.
Sumber yang bisa diambil mesin: Yahoo Finance chart API — GC=F (emas berjangka COMEX, USD/troy oz) × IDR=X (USD/IDR), HARIAN.
(Spot XAU tidak ada di Yahoo; stooq memakai verifikasi anti-bot → tidak dipakai.) Berjangka ≈0,5–1% di atas spot ICE:
bentuk sama, level sedikit lebih tinggi.
Mingguan = minggu Senin–Minggu (seperti TradingView), tutup = hari dagang terakhir minggu itu yang punya kedua data.
Rp/gram = USD/oz × IDR/USD ÷ 31,1035. Minggu berjalan ikut (seperti TradingView). Data mentah: sync/emas-*.json.
"""
import datetime as dt, json, pathlib, subprocess, time
ROOT = pathlib.Path(__file__).resolve().parent.parent
AWAL = dt.date(2016, 3, 7)  # Senin — tepi kiri tangkapan TradingView Simon
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
def ambil(t):
    p1 = int(dt.datetime(2016, 2, 1).timestamp())
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{t}?period1={p1}&period2={int(time.time())}&interval=1d"
    raw = subprocess.run(["curl", "-s", "-A", UA, url], capture_output=True, check=True).stdout
    (ROOT / f"sync/emas-{t.replace('=', '')}.json").write_bytes(raw)
    j = json.loads(raw)["chart"]["result"][0]
    return {dt.datetime.utcfromtimestamp(s + 25200).date(): c
            for s, c in zip(j["timestamp"], j["indicators"]["quote"][0]["close"]) if c is not None}
g, r = ambil("GC=F"), ambil("IDR=X")
minggu = {}
for d in sorted(g):
    if d in r and d >= AWAL:
        senin = d - dt.timedelta(days=d.weekday())
        minggu[senin] = (d, g[d], r[d])
ks = sorted(minggu)
hilang = [AWAL + dt.timedelta(weeks=k) for k in range((ks[-1] - AWAL).days // 7 + 1) if AWAL + dt.timedelta(weeks=k) not in minggu]
print("minggu tanpa data:", [str(x) for x in hilang])
rows = [(str(k), str(minggu[k][0]), round(minggu[k][1], 1), round(minggu[k][2]), round(minggu[k][1] * minggu[k][2] / 31.1035)) for k in ks]
out = ["/* DIBANGKITKAN oleh scripts/gen-emas.py — JANGAN diedit tangan.",
       f" * Harga emas dunia dalam Rupiah per gram, penutupan MINGGUAN {rows[0][0]}..{rows[-1][1]} (acuan: TradingView XAU/IDR gram 1W ICE).",
       f" * Sumber: Yahoo Finance GC=F × IDR=X ÷ 31,1035 (berjangka ≈0,5–1% di atas spot). Diambil {dt.date.today().isoformat()}. */",
       "export type MingguEmas = { m: string; tgl: string; usdOz: number; kurs: number; rpGram: number };",
       "export const EMAS: MingguEmas[] = ["]
out += [f"  {{ m: '{m}', tgl: '{d}', usdOz: {u}, kurs: {i}, rpGram: {rp} }}," for m, d, u, i, rp in rows]
out += ["];"]
(ROOT / "src/s04/emas.gen.ts").write_text("\n".join(out) + "\n")
lo = min(rows, key=lambda x: x[4]); hi = max(rows, key=lambda x: x[4])
print(f"{len(rows)} minggu · awal {rows[0][1]} Rp{rows[0][4]:,} · terendah {lo[1]} Rp{lo[4]:,} · tertinggi {hi[1]} Rp{hi[4]:,} · akhir {rows[-1][1]} Rp{rows[-1][4]:,}")
print(f"tertinggi/awal = {hi[4] / rows[0][4]:.2f}× · akhir/tertinggi = {(rows[-1][4] / hi[4] - 1) * 100:.1f}%")
