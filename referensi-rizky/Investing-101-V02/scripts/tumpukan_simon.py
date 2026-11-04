#!/usr/bin/env python3
"""TUMPUKAN UANG SIMON (9 Okt: "gunakan ini saja, kamu tinggal menyesuaikan untuk kebutuhan animasi, tapi jangan sampai kamu ubah
layoutnya" + "samakan warnanya, dengan apa yang sudah ada divideo"): 04_Asset/stok-uang/stacked-money/12694-NOC9KI.ai (susunan Simon,
22 bundel dalam 6 tumpukan + elips bayangan). Alur:
  1. Illustrator: ekspor SVG dokumen itu (presentation attributes, presisi 2) → 04_Asset/stok-uang/svg/tumpukan-simon.svg
  2. node scripts/_peta_unit.mjs <svg> <png> 04_Asset/stok-uang/svg/tumpukan-simon_unit.json   (kotak tiap bundel, Chrome getBBox)
  3. python3 scripts/tumpukan_simon.py → src/parts/tumpukan-simon.gen.ts
Tata letak & URUTAN GAMBAR = persis berkas Simon (tidak diubah). Yang disesuaikan untuk animasi: tiap bundel jadi satu unit (muncul/pergi
sendiri-sendiri); warna dipetakan ke hijau uang video (sama dengan scripts/uang_iso.py; pita krem tetap); efek drop-shadow Illustrator
(filter SVG: geser 2, #191C18 27 %) diganti salinan siluet bundel yang sama — filter SVG membuat Studio tersendat (terukur proyek lain)."""
import json, re, pathlib, xml.dom.minidom as md
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / '04_Asset/stok-uang/svg/tumpukan-simon.svg'
KOTAK = json.loads((ROOT.parent / '04_Asset/stok-uang/svg/tumpukan-simon_unit.json').read_text())
WARNA = {'#BAE19D': '#A6D884', '#9FC45C': '#7EC151', '#779B40': '#5E9A39'}
doc = md.parse(str(SRC)); root = doc.documentElement
el = lambda n: [c for c in n.childNodes if c.nodeType == 1]
warnai = lambda s: re.sub('|'.join(WARNA), lambda m: WARNA[m.group(0).upper()], s, flags=re.I)
rapat = lambda s: re.sub(r'>\s+<', '><', re.sub(r'\s+', ' ', s)).strip()
elips = [c for c in el(root) if c.tagName == 'ellipse']
assert len(elips) == 1
top = [c for c in el(root) if c.tagName == 'g'][0]
unit = []
kotak = {(k['si'], k['ui']): k for k in KOTAK}
t = 0
for si, st in enumerate(el(top)):
    if st.tagName != 'g': continue  # path tunggal tanpa luas (0 × 0) — bukan bundel
    for ui, u in enumerate(el(st)):
        bayang = bool(u.getAttribute('filter'))
        isi = rapat(''.join(c.toxml() for c in el(u)))
        k = kotak[(si, ui)]
        siluet = re.sub(r'fill="#[0-9a-fA-F]{3,6}"', 'fill="#191C18"', isi) if bayang else ''
        unit.append({'t': t, 'l': ui, 'x': round(k['x'], 1), 'y': round(k['y'], 1), 'w': round(k['w'], 1), 'h': round(k['h'], 1),
                     'svg': warnai(isi), 'bayang': siluet})
    t += 1
x0 = min(u['x'] for u in unit); y0 = min(u['y'] for u in unit); x1 = max(u['x'] + u['w'] for u in unit); y1 = max(u['y'] + u['h'] for u in unit)
out = {'vb': [0, 0, 800, 800], 'kotak': [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)], 'elips': rapat(elips[0].toxml()), 'unit': unit}
(ROOT / 'src/parts/tumpukan-simon.gen.ts').write_text('/* DIBANGKITKAN oleh scripts/tumpukan_simon.py — jangan diedit tangan. Susunan Simon (12694-NOC9KI.ai), hijau video. */\n'
    'export const TUMPUKAN_SIMON = ' + json.dumps(out, ensure_ascii=False) + ' as const;\n')
print(len(unit), 'unit ·', t, 'tumpukan · kotak', out['kotak'], '· elips', out['elips'][:90])
