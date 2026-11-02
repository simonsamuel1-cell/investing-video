#!/usr/bin/env python3
"""GEDUNG KANTOR (Simon 8 Okt: "ganti juga 3 bangunan ini dengan gedung"): stok koleksi gedung kantor Freepik yang SUDAH ada di template
Tuntun (Desktop/001. Motion Tuntun/007. Tamplate Design/Building.ai) → diekspor Illustrator ke SVG (04_Asset/stok-gedung/Building_ekspor.svg)
→ kotak tiap elemen diukur Chrome (scripts/_pisah_gedung.mjs → gedung_el.json) → dipecah per kuadran jadi gedung terpisah, judul
"OFFICE BUILDING COLLECTION" dibuang, diwarnai ulang ke warna brand (rona ungu brand + abu brand; pohon → turkis).
Keluaran: src/parts/gedung.gen.ts.   python3 scripts/gedung.py"""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
els = json.loads((ROOT.parent / '04_Asset/stok-gedung/gedung_el.json').read_text())
WARNA = {  # gelap → ungu brand, menengah → ungu muda, terang → rona ungu pucat (abu-abu/hitam asli terlalu dominan, diuji 8 Okt)
    '#233C45': '#5F4DEE', '#2C2C2C': '#5F4DEE', '#4F4F4F': '#5F4DEE', '#666666': '#5F4DEE', '#315A6A': '#5F4DEE',
    '#46849B': '#8F83F4', '#3F798F': '#8F83F4', '#AAAAAA': '#8F83F4',
    '#66B2C9': '#B4ACF8', '#64AECE': '#B4ACF8', '#79B0BC': '#B4ACF8', '#ACB7C6': '#C9C3FA',
    '#C5F3FB': '#EFEDFE', '#E3E2E4': '#E9E6FC', '#CBCCCE': '#C9C3FA',
    '#AD634D': '#E49C2C', '#5CA17A': '#5CC8E3', '#77B257': '#9BDDEE',
}
def judul(e):
    cx = e['x'] + e['w'] / 2
    return e['y'] < 70 and e['h'] < 30 and 110 < cx < 390 and e['fill'] in ('#3C1F4E', '#ACB7C6', 'none', None)
kel = {}
for e in els:
    if judul(e) or e['fill'] in ('none', None): continue
    cx, cy = e['x'] + e['w'] / 2, e['y'] + e['h'] / 2
    if cy > 440: continue  # kredit
    k = ('T' if cy < 255 else 'B') + ('L' if cx < 250 else 'R')
    kel.setdefault(k, []).append(e)
out = {}
for k, es in kel.items():
    x0 = min(e['x'] for e in es); y0 = min(e['y'] for e in es); x1 = max(e['x'] + e['w'] for e in es); y1 = max(e['y'] + e['h'] for e in es)
    body = ''.join(e['html'] for e in es)
    for a, b in WARNA.items(): body = re.sub(a, b, body, flags=re.I)
    body = re.sub(r'\s+', ' ', body)
    out[k] = {'vb': f'{x0 - 1:.1f} {y0 - 1:.1f} {x1 - x0 + 2:.1f} {y1 - y0 + 2:.1f}', 'w': round(x1 - x0 + 2, 1), 'h': round(y1 - y0 + 2, 1), 'svg': body}
    print(k, len(es), out[k]['vb'])
(ROOT / 'src/parts/gedung.gen.ts').write_text('/* DIBANGKITKAN oleh scripts/gedung.py — jangan diedit tangan. Stok gedung kantor Freepik (template Tuntun Building.ai), warna brand. */\n'
    'export const GEDUNG: Record<string, { vb: string; w: number; h: number; svg: string }> = ' + json.dumps(out, ensure_ascii=False) + ';\n')
