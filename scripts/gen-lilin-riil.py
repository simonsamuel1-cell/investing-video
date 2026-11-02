#!/usr/bin/env python3
"""Candle HARIAN RIIL untuk chart Scene 04 / 07 / 10 / 12 → src/data/lilinRiil.gen.ts.

Sumber: Yahoo Finance chart API (interval 1d), disimpan mentah di data-riil/yahoo/ (diunduh 27 Okt 2026). Tanggal = WIB (timestamp + 7 jam).
Simon 27 Okt: "pastikan candlestick yang kamu gunakan realistis seperti candlestick asli" · "jika menggunakan atau menyebut data asli pastikan kamu
menggunakan data asli".

  KAEF_S10   KAEF 2 Nov 2020 – 15 Jan 2021, harga ASLI (VO S10: "Pada awal 2021, sejumlah saham populer terkena ARB selama beberapa hari").
             12 Jan tutup 6.975 → ARB 13/14/15 Jan 6.500 · 6.050 · 5.650 = −19,0 % ("hampir dua puluh persen"). Diverifikasi berita: Bisnis.com
             18 & 25 Jan 2021 (KAEF/INAF ARB, saham farmasi turun sejak 13 Jan).
  IHSG_S10   ^JKSE tutup harian, tanggal yang sama (kartu "Pasar (IHSG)": 5.115 → 6.396 per 12 Jan 2021 = seluruh pasar naik).
  ANTM_S07   ANTM 5 Nov – 18 Des 2020, harga ASLI (chart tanpa nama; 18 candle dasar + 13 candle reli: 10 hijau = 10 BELI, 3 merah terbentuk sendiri).
  ASII_S12   ASII 15 Apr – 18 Mei 2020, harga ASLI (chart tanpa nama; 14 dasar + 3 hijau · 3 merah · 2 hijau = tanda 1 / 2 / 3).
  UNVR_S02   UNVR 1 Sep – 15 Nov 2022, DISKALAKAN (tutup 17 Okt = Rp1.000; chart tanpa nama) — DIGANTI ACES_S02 27 Okt sore (tetap dibangkitkan).
  ACES_S02   ACES 20 Sep – 6 Nov 2023, DISKALAKAN (tutup 19 Okt = Rp1.000; chart tanpa nama). Simon 27 Okt sore: "Buat candel di scene 2 ini jadi lebih
             realistis lagi dan mengikut dengan scriptnya" → satu-satunya jendela (30 saham likuid 2019–2024, scripts cari di laporan) yang urutan
             ASLINYA = naskah: 21 candle tenang → HIJAU 20·23·24·25 Okt (+10,8 %, 4 BELI) → kecil 26 Okt → MERAH 27·30·31 Okt·1 Nov (−8,6 %, 4 JUAL)
             → kecil 2 Nov → HIJAU 3 & 6 Nov (BELI investor 1 & 2, "harga naik lagi").
  EMTK_S04   EMTK 11 Jan – 22 Feb 2022, DISKALAKAN (tutup ke-26 = Rp1.000, label harga ilustrasi Scene 04; dokumen S04: tanpa data perusahaan nyata)
             → 26 candle dasar + 4 hijau sesudah 4 BELI.
"""
import datetime, json, os

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YH = os.path.join(AKAR, 'data-riil', 'yahoo')


def muat(nama):
    d = json.load(open(os.path.join(YH, nama)))
    r = d['chart']['result'][0]
    q = r['indicators']['quote'][0]
    out = []
    for i, ts in enumerate(r['timestamp']):
        o, h, l, c, v = q['open'][i], q['high'][i], q['low'][i], q['close'][i], q['volume'][i]
        if None in (o, h, l, c) or not v:
            continue
        out.append((str(datetime.datetime.utcfromtimestamp(ts + 25200).date()), o, h, l, c))
    return out


def jendela(rows, a, b, skala=1.0):
    return [(t, round(o * skala, 1), round(h * skala, 1), round(l * skala, 1), round(c * skala, 1)) for t, o, h, l, c in rows if a <= t <= b]


def ts(nama, rows, ket):
    isi = ',\n'.join(f"  {{ t: '{t}', o: {o:g}, h: {h:g}, l: {l:g}, c: {c:g} }}" for t, o, h, l, c in rows)
    return f'/** {ket} */\nexport const {nama}: LilinRiil[] = [\n{isi},\n];\n'


# 29 Okt (Simon S10: "Gunakan candlestick KAEF dari yang kemarin aku kirimkan" → "candlestick KAEF belum sama seperti yang aku kirimkan"): chart S10 = rentang
# screenshot TradingView Simon mulai AGUSTUS 2020 (sideways Agu–Nov, lonjakan Des, puncak Jan, ARB) — chart melebar ke kanan seperti TradingView (zoom
# otomatis) sampai 15 Jan 2021; IHSG dari data harian V03, tanggal = irisan keduanya
kaef0 = jendela(muat('KAEF.JK.json'), '2020-08-03', '2021-01-15')
ihsg0 = [tuple(r) for r in json.load(open(os.path.join(YH, 'JKSE_harian_2019-12_2021-03_dariV03.json'))) if '2020-08-03' <= r[0] <= '2021-01-15']
_sama = sorted(set(r[0] for r in kaef0) & set(r[0] for r in ihsg0))
kaef = [r for r in kaef0 if r[0] in _sama]
ihsg = [r for r in ihsg0 if r[0] in _sama]
assert [r[0] for r in kaef] == [r[0] for r in ihsg], 'tanggal KAEF ≠ IHSG'
assert [r[4] for r in kaef[-4:]] == [6975, 6500, 6050, 5650], kaef[-4:]
# 30 Okt (Simon: "candlestick KAEF belum sama seperti yang aku kirimkan" — screenshot TradingView Agu 2020 → Agu 2021): KAEF diteruskan sampai 31 Agu 2021
# (penurunan panjang sesudah ARB). IHSG tetap sampai 15 Jan 2021 (panel IHSG sudah berganti isi sebelum candle sesudah 15 Jan tumbuh).
kaef += [r for r in jendela(muat('KAEF.JK.json'), '2021-01-18', '2021-08-31')]
# 28 Okt: chart S07 BERGULIR (resep video TA) → 14 hari bursa riwayat sebelum 5 Nov ikut dibangkitkan (jendela 32 slot penuh sejak muncul)
antm0 = muat('ANTM.JK.json')
i5 = [r[0] for r in antm0].index('2020-11-05')
antm = jendela(antm0, antm0[i5 - 14][0], '2020-12-18')
assert len(antm) == 45 and sum(r[4] > r[1] for r in antm[32:]) == 10, (len(antm), antm[32:])
# 29 Okt (S12 relayout): chart tanda BERGULIR (resep TA) → 10 hari bursa riwayat tambahan (31 Mar – 14 Apr 2020) supaya jendela penuh sejak chart muncul
asii = jendela(muat('ASII.JK.json'), '2020-03-31', '2020-05-18')
assert len(asii) == 32 and [int(r[4] > r[1]) for r in asii[24:]] == [1, 1, 1, 0, 0, 0, 1, 1], asii[24:]
emtk0 = jendela(muat('EMTK.JK.json'), '2022-01-11', '2022-02-22')
assert len(emtk0) == 30 and all(r[4] > r[1] for r in emtk0[26:]), emtk0[26:]
emtk = jendela(muat('EMTK.JK.json'), '2022-01-11', '2022-02-22', 1000 / emtk0[25][4])

aces0 = muat('ACES.JK.json')
ref_a = [r for r in aces0 if r[0] == '2023-10-19'][0][4]
# 28 Okt (Simon: "untuk animasi candlestick kamu bisa pelajari dari video TA"): chart Scene 02 kini BERGULIR (resep V08/V10) — jendela 33 slot
# harus sudah penuh riwayat saat panel muncul → 19 hari bursa SEBELUM 20 Sep ikut dibangkitkan (data asli, skala sama)
i20 = [r[0] for r in aces0].index('2023-09-20')
aces = jendela(aces0, aces0[i20 - 19][0], '2023-11-06', 1000 / ref_a)
assert len(aces) == 52, len(aces)
ia = [r[0] for r in aces].index('2023-10-20')
assert [int(r[4] > r[1]) for r in aces[ia:]] == [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1], [(r[0], r[4] > r[1]) for r in aces[ia:]]

# IHSG harian S08 (format [tgl, o, h, l, c] dari Video 03 04_Asset/data-pasar/ihsg_harian_yahoo.json)
ihsgh = [tuple(r) for r in json.load(open(os.path.join(YH, 'JKSE_harian_2019-12_2021-03_dariV03.json'))) if '2019-12-02' <= r[0] <= '2021-03-01']  # 30 Okt: sampai 1 Mar 2021 seperti screenshot Simon (dulu 30 Des 2020 demi slot ≥ 7 px)
lo = min(ihsgh, key=lambda r: r[3]); assert lo[0] == '2020-03-24' and round(lo[3]) == 3912, lo  # terendah 24 Mar 2020 = 3.912 (TradingView ±3.911)
unvr0 = muat('UNVR.JK.json')
ref = [r for r in unvr0 if r[0] == '2022-10-17'][0][4]
unvr = jendela(unvr0, '2022-09-01', '2022-11-15', 1000 / ref)
hijau = {r[0]: r[4] > r[1] for r in unvr}
assert all(hijau[t] for t in ['2022-10-18', '2022-10-19', '2022-10-20', '2022-11-04', '2022-11-07'])
assert not any(hijau[t] for t in ['2022-10-28', '2022-10-31', '2022-11-01', '2022-11-02'])

teks = ('// DIBANGKITKAN scripts/gen-lilin-riil.py — jangan disunting tangan. Sumber: Yahoo Finance (data-riil/yahoo/), tanggal WIB.\n'
        'export type LilinRiil = { t: string; o: number; h: number; l: number; c: number };\n\n'
        + ts('KAEF_S10', kaef, 'KAEF harian 3 Agu 2020 – 31 Agu 2021 seperti screenshot Simon (harga asli; 13–15 Jan = ARB tiga hari, −19,0 %)') + '\n'
        + ts('IHSG_S10', ihsg, '^JKSE harian, tanggal sama dengan KAEF_S10 (harga asli)') + '\n'
        + ts('ANTM_S07', antm, f'ANTM harian {antm[0][0]} – 18 Des 2020 (harga asli; 14 riwayat + 18 dasar + 13 reli)') + '\n'
        + ts('IHSG_HARIAN_S08', ihsgh, '^JKSE HARIAN 2 Des 2019 – 1 Mar 2021 (harga asli, Yahoo; salinan data Video 03) — Simon 28 Okt: "Ganti candle ihsg seperti ke screenshoot ihsg" (TradingView harian)') + '\n'
        + ts('ASII_S12', asii, 'ASII harian 31 Mar – 18 Mei 2020 (harga asli; 24 dasar + naik 3 · turun 3 · naik 2)') + '\n'
        + ts('UNVR_S02', unvr, f'UNVR harian 1 Sep – 15 Nov 2022, diskalakan ×{1000 / ref:.5f} (tutup 17 Okt = 1.000)') + '\n'
        + ts('EMTK_S04', emtk, f'EMTK harian 11 Jan – 22 Feb 2022, diskalakan ×{1000 / emtk0[25][4]:.5f} (tutup ke-26 = 1.000)') + '\n'
        + ts('ACES_S02', aces, f'ACES harian {aces[0][0]} – 6 Nov 2023 (19 hari riwayat + 20 Sep – 6 Nov), diskalakan ×{1000 / ref_a:.5f} (tutup 19 Okt = 1.000): tenang → 4 hijau → 4 merah → 2 hijau'))
open(os.path.join(AKAR, 'src', 'data', 'lilinRiil.gen.ts'), 'w').write(teks)
print('ACES', len(aces), 'UNVR', len(unvr), 'KAEF', len(kaef), 'ANTM', len(antm), 'ASII', len(asii), 'EMTK', len(emtk))
