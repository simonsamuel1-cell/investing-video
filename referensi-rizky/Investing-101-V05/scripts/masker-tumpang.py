#!/usr/bin/env python3
"""MASKER-TUMPANG (15 Okt) — Simon: "bug atau jeglek sering kali terjadi ketika transisi". Kasus S03 → S04 (00:55.20 – 00:56.30): label "Uang Aktif"
scene baru sudah tampil penuh DI BAWAH titik pendaratan, cakram masker yang melambat di ujung (berwarna pekat) melintas & memotongnya ±8 frame.
Data = out/dom/<KE>.jsonl (scripts/pindai-dom.mjs). Lingkaran masker tiap frame = `cc` milik isi scene lama (probe mencatat lingkaran potong). Dicari:
elemen scene LAIN (opasitas ≥ 0,3) yang SEBAGIAN tertutup lingkaran (10–90 % luasnya di dalam) saat jari-jari < 420 px (fase akhir, cakram pekat & lambat).
Pakai: python3 scripts/masker-tumpang.py <KE> [<KE> …]
"""
import json, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
LEWATI = {'Subtitle', 'Watermark', 'Backdrop', '?'}
hasil = {}
for KE in sys.argv[1:]:
    for l in open(ROOT / f'out/dom/{KE}.jsonl'):
        j = json.loads(l)
        f, items = j['f'], j['items']
        # lingkaran masker: cc yang dipakai paling banyak elemen satu lapisan
        hit = {}
        for it in items:
            if it.get('cc') and it['l'] not in LEWATI:
                k = (it['l'], tuple(it['cc']))
                hit[k] = hit.get(k, 0) + 1
        if not hit:
            continue
        (lapis, cc), n = max(hit.items(), key=lambda kv: kv[1])
        cx, cy, r = cc
        if n < 3 or r >= 420:
            continue
        for it in items:
            if it['l'] in LEWATI or it['l'] == lapis or it['o'] < 0.3 or it['k'] in ('bg',):
                continue
            b = it['b']
            w, h = b[2] - b[0], b[3] - b[1]
            if w * h < 200:
                continue
            N = 10
            dalam = sum(1 for u in range(N) for v in range(N)
                        if (b[0] + (u + 0.5) * w / N - cx) ** 2 + (b[1] + (v + 0.5) * h / N - cy) ** 2 <= r * r) / (N * N)
            if 0.1 <= dalam <= 0.9:
                kunci = (it['l'], it['k'], (it.get('t') or it.get('src') or '')[:28], lapis)
                hasil.setdefault(kunci, []).append((f, round(dalam, 2), r, b))
for (l, k, t, lapis), daftar in sorted(hasil.items(), key=lambda kv: kv[1][0][0]):
    fs = [d[0] for d in daftar]
    print(f"  f{fs[0]}–{fs[-1]} ({len(fs)} frame)  {l} {k} «{t}» terpotong cakram masker {lapis} · tertutup maks {max(d[1] for d in daftar):.0%} · r {daftar[0][2]}→{daftar[-1][2]} · kotak {daftar[0][3]}")
print(f"{len(hasil)} elemen terpotong cakram masker di fase akhir")
