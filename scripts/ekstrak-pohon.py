#!/usr/bin/env python3
"""POHON AKASIA untuk transisi paralaks Scene 02 → 03 (Simon 27 Okt sore: "gunakan transisi paralax seperti yang ada di scene 1. Bedanya pada transisi
ini gunakan pohon dari scene 3"). Pohon = anak g0[37] `public/flat/hutan.svg` (pohon akasia cakrawala yang tampak di adegan Scene 03, kotak getBBox
237–591 × 281–673, lihat KOTAK di ekstrak-hutan.py) → berkas mandiri public/flat/s03/pohon.svg (viewBox = kotaknya; diraster sekali, digeser GPU)."""
import os, re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('public/flat/hutan.svg').getroot()
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
g0 = list(list(ob)[0])
def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()
gradien = [el for el in akar.iter() if el.tag.endswith('linearGradient') or el.tag.endswith('radialGradient')]
DEFS = ''.join(teks(g) for g in gradien)
x0, x1, y0, y1 = 237, 591, 281, 673
os.makedirs('public/flat/s03', exist_ok=True)
open('public/flat/s03/pohon.svg', 'w').write(
    f'<svg xmlns="{NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="{x1 - x0}" height="{y1 - y0}" viewBox="{x0} {y0} {x1 - x0} {y1 - y0}">'
    f'<defs>{DEFS}</defs>{teks(g0[37])}</svg>')
print('pohon', x1 - x0, y1 - y0)
