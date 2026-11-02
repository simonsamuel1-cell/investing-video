# Verifikasi data chart vs TradingView (27 Okt 2026)

Screenshot dari Simon (TradingView, candle harian) dicocokkan dengan data Yahoo Finance yang dipakai di video
(`data-riil/yahoo/` → `scripts/gen-lilin-riil.py` → `src/data/lilinRiil.gen.ts`; IHSG mingguan S08 di `src/data/ihsgMingguan2020.gen.ts`).
Angka screenshot dibaca dari skala harga di gambar (±10–20).

## KAEF — Scene 10 (`KAEF-harian-Agu2020-Agu2021-tradingview.png`)

| Titik | TradingView | Video (Yahoo) |
|---|---|---|
| Puncak 12 Jan 2021 (ujung sumbu atas) | ±7.570 | 7.575 |
| Tutup 12 Jan 2021 | ±6.970 | 6.975 |
| 13 Jan 2021 buka → tutup (ARB ke-1) | ±7.000 → ±6.500 | 7.000 → 6.500 |
| 14 · 15 · 18 Jan 2021 (ARB) | ±6.050 · ±5.650 · ±5.275 | 6.050 · 5.650 · 5.275 |
| Lonjakan Des 2020 (ujung sumbu) | ±5.450 | 5.450 (8 Des) |

Chart TradingView berlabel **ADJ** (disesuaikan dividen); untuk Jan 2021 angkanya sama dengan data Yahoo yang dipakai.

## IHSG — Scene 08 (`IHSG-harian-2020-tradingview.png`)

| Titik | TradingView | Video |
|---|---|---|
| Puncak awal 2020 | ±6.335 | 6.337–6.349 (mingguan) |
| Titik terendah Maret 2020 (garis putus bawah) | ±3.911 | 3.912 (24 Mar 2020) |
| Akhir Des 2020 | ±5.980 | 5.979 |

S08 memakai candle **mingguan** dari data yang sama: 1 tahun harian ≈ 250 candle → ±3–4 px per candle di chart video (< aturan slot ≥ 7 px).

**Kesimpulan:** cocok — tidak ada data yang diganti. Bila ingin angka resmi TradingView, ekspor CSV (menu ••• → "Ekspor data chart…") ke `data-riil/`
lalu jalankan ulang `python3 scripts/gen-lilin-riil.py`.
