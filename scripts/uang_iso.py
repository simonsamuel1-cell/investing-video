#!/usr/bin/env python3
"""BUNDEL UANG ISOMETRIK (Simon 8 Okt, feedback keseluruhan: "tumpukan uang seharusnya menggunakan style yang isometric dari asset yang aku
kirimkan, dan juga bayangan juga harus menggunakan style isometric"): satu bundel = bundel teratas tumpukan kanan di stok Freepik
`stacked-money` (04_Asset/stok-uang/svg/uang-tumpuk.svg, elemen DOM 209–230: 14 lapis sisi bergaris, muka atas, oval, pita krem) —
kotak tiap elemen diukur Chrome (scripts/_pisah_gedung.mjs AKAR='#Objects' → svg/tumpuk_el.json). Diwarnai ke HIJAU #7EC151 (warna uang
Simon). Geometri isometrik ikut dikeluarkan: tapak (alas) jajaran genjang, tebal bundel, langkah tumpuk (dari dua bundel bertumpuk di stok).
Keluaran: src/parts/uang-iso.gen.ts.   python3 scripts/uang_iso.py"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
els = json.loads((ROOT.parent / '04_Asset/stok-uang/svg/tumpuk_el.json').read_text())
bundel = [e for e in els[209:231] if e['fill'] not in (None, 'none')]
WARNA = {'#BAE19D': '#A6D884', '#9FC45C': '#7EC151', '#779B40': '#5E9A39'}  # terang · dasar (= uang Simon) · gelap; pita krem tetap (Simon: yang dimaksud bentuk TUMPUKAN, bukan warna)
x0 = min(e['x'] for e in bundel); y0 = min(e['y'] for e in bundel)
x1 = max(e['x'] + e['w'] for e in bundel); y1 = max(e['y'] + e['h'] for e in bundel)
body = ''.join(e['html'] for e in bundel)
for a, b in WARNA.items(): body = re.sub(a, b, body, flags=re.I)
body = re.sub(r'\s+', ' ', body)
# muka atas (elemen 223) sudut: kiri (420.6,412.3) · atas (518.8,345.8) · kanan (715.3,461.9) · bawah (628.8,544.7); tebal 39,5; langkah 52
muka = [(420.6, 412.3), (518.8, 345.8), (715.3, 461.9), (628.8, 544.7)]
TEBAL, LANGKAH = 39.5, 52.2
alas = [(x, y + TEBAL) for x, y in muka]
rel = lambda pts: [[round(x - x0, 1), round(y - y0, 1)] for x, y in pts]
out = {'vb': f'{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}', 'w': round(x1 - x0, 1), 'h': round(y1 - y0, 1), 'svg': body,
       'alas': rel(alas), 'tebal': TEBAL, 'langkah': LANGKAH,
       # siluet sisi bergaris (elemen 209) — bayangan tipis antar-bundel seperti di stok (lapisan #191C18 bergeser 2 px)
       'siluet': re.search(r' d="([^"]+)"', els[209]['html']).group(1)}
# LEMBAR TERGELETAK (Simon 9 Okt: tumpukan seperti acuan — ada lembar uang tergeletak di depan): muka bundel + 3 lapis sisi teratas,
# TANPA pita & TANPA simbol mata uang di oval (elemen 220–225, 229–230; 226 = simbol); kotak = kotak bundel (posisi muka sama), dipakai dengan geser ke bawah sejauh tebal bundel − 3 lapis
lembar = [e for i, e in enumerate(els) if i in (220, 221, 222, 223, 224, 225, 229, 230) and e['fill'] not in (None, 'none')]
lb = ''.join(e['html'] for e in lembar)
for a_, b_ in WARNA.items(): lb = re.sub(a_, b_, lb, flags=re.I)
out['lembar'] = re.sub(r'\s+', ' ', lb)
out['tebalLembar'] = round(TEBAL * 3 / 14, 1)
(ROOT / 'src/parts/uang-iso.gen.ts').write_text('/* DIBANGKITKAN oleh scripts/uang_iso.py — jangan diedit tangan. Stok Freepik stacked-money, hijau #7EC151. */\n'
    'export const BUNDEL_ISO = ' + json.dumps(out, ensure_ascii=False) + ' as const;\n')
print(out['vb'], len(bundel), 'elemen')
