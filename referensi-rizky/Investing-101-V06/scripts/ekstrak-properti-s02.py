#!/usr/bin/env python3
"""PROPERTI SCENE 02 FLAT (27 Okt) — benda latar Simon `Hutan.svg` (public/flat/hutan.svg) dipotong jadi berkas svg mandiri untuk vignette
Scene 02 (dibesarkan sebagai properti latar depan): batu (anak g0 nomor 30, deretan batu kiri), semak berdaun (57 & 40 = rumpun besar),
semak bundar (56). Kotak = getBBox (tabel KOTAK ekstrak-hutan.py). Gradien ikut disalin (satu <defs>).
Hasil: public/flat/s02/{batu,semak-a,semak-b,semak-c}.svg — viewBox = kotak benda (satuan Hutan.svg)."""
import os
import re
import xml.etree.ElementTree as ET

SVG = 'public/flat/hutan.svg'
D = 'public/flat/s02'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse(SVG).getroot()
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
g0 = list(list(ob)[0])


def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()


gradien = [el for el in akar.iter() if el.tag.endswith('linearGradient') or el.tag.endswith('radialGradient')]
DEFS = ''.join(teks(g) for g in gradien)
BENDA = {  # nama: (indeks g0, x0, x1, y0, y1)
    'batu': (30, 1472, 1970, 538, 674),
    'semak-a': (57, 1765, 1961, 923, 1051),
    'semak-b': (40, 141, 326, 877, 998),
    'semak-c': (56, 145, 279, 630, 658),
}
os.makedirs(D, exist_ok=True)
for nama, (i, x0, x1, y0, y1) in BENDA.items():
    w, h = x1 - x0, y1 - y0
    with open(f'{D}/{nama}.svg', 'w') as fh:
        fh.write(f'<svg xmlns="{NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="{x0} {y0} {w} {h}">'
                 f'<defs>{DEFS}</defs>{teks(g0[i])}</svg>')
    print(nama, w, h)
