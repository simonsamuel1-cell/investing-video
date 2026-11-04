#!/usr/bin/env python3
"""EKSTRAK SINGA (26 Okt malam) — `Singa.svg` baru dari Simon ("Aku melampirkan singa yang telah aku perbarui, mungkin bisa kamu riging juga agar
gerakannya terlihat lebih natural"; salinan public/flat/singa-simon.svg). Bagian & urutan lapis file APA ADANYA (bawah → atas):
  0 kaki belakang jauh · 1 badan · 2 kaki depan dekat · 3 kaki depan jauh · 4 ekor (+ jambul) · 5 surai + kepala · 6 kaki belakang dekat
Badan & kepala = markup utuh (kaku). Kaki, ekor & jambul = jalur ABSOLUT kubik (M/C/c/h/v/l/s/z → titik awal + kubik) supaya rig bisa
melenturkan titiknya (sendi lutut/hock & ekor berantai) tanpa memotong gambar. Keluaran src/flat/singa.gen.ts."""
import json
import re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('public/flat/singa-simon.svg').getroot()
L = {g.get('id'): g for g in akar if g.get('id')}
bag = list(L['OBJECTS']) + [c for c in L['Isolation_Mode'] if len(list(c))]


def s(el):
    t = ET.tostring(el, encoding='unicode')
    t = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def kubik(d):
    """d → [[x0, y0, c1x, c1y, c2x, c2y, x, y, …], …] + tutup per subjalur (garis → kubik sepertiga)"""
    tok = re.findall(r'[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?', d)
    i, cmd, sub, tutup, cur = 0, None, [], [], None
    x = y = sx = sy = 0.0
    lc = None  # kendali kedua terakhir (untuk s/S)

    def num():
        nonlocal i
        v = float(tok[i]); i += 1
        return v

    def garis(x1, y1):
        cur.extend([x + (x1 - x) / 3, y + (y1 - y) / 3, x + 2 * (x1 - x) / 3, y + 2 * (y1 - y) / 3, x1, y1])

    while i < len(tok):
        if re.match(r'[A-Za-z]', tok[i]):
            cmd = tok[i]; i += 1
        c = cmd
        if c in 'Zz':
            tutup[-1] = True
            x, y = sx, sy
            lc = None
            continue
        if c in 'Mm':
            x1, y1 = num(), num()
            if c == 'm': x1, y1 = x + x1, y + y1
            cur = [x1, y1]; sub.append(cur); tutup.append(False)
            x, y, sx, sy = x1, y1, x1, y1
            cmd = 'L' if c == 'M' else 'l'
            lc = None
            continue
        if c in 'Cc':
            v = [num() for _ in range(6)]
            if c == 'c': v = [v[0] + x, v[1] + y, v[2] + x, v[3] + y, v[4] + x, v[5] + y]
            cur.extend(v); lc = (v[2], v[3]); x, y = v[4], v[5]
        elif c in 'Ss':
            v = [num() for _ in range(4)]
            if c == 's': v = [v[0] + x, v[1] + y, v[2] + x, v[3] + y]
            c1 = (2 * x - lc[0], 2 * y - lc[1]) if lc else (x, y)
            cur.extend([c1[0], c1[1]] + v); lc = (v[0], v[1]); x, y = v[2], v[3]
        elif c in 'Ll':
            x1, y1 = num(), num()
            if c == 'l': x1, y1 = x + x1, y + y1
            garis(x1, y1); x, y = x1, y1; lc = None
        elif c in 'Hh':
            x1 = num(); x1 = x + x1 if c == 'h' else x1
            garis(x1, y); x = x1; lc = None
        elif c in 'Vv':
            y1 = num(); y1 = y + y1 if c == 'v' else y1
            garis(x, y1); y = y1; lc = None
        else:
            raise ValueError('perintah jalur tak dikenal: ' + c)
    return [[round(v, 2) for v in q] for q in sub], tutup


KAMEL = {'fill': 'fill', 'stroke': 'stroke', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
         'stroke-miterlimit': 'strokeMiterlimit'}


def jalur(el):
    out = []
    for e in el.iter():  # urutan dokumen = urutan lapis
        if not e.tag.endswith('path'):
            continue
        sub, tutup = kubik(e.get('d'))
        a = {KAMEL[k]: (float(v) if k in ('stroke-width', 'stroke-miterlimit') else v) for k, v in e.attrib.items() if k != 'd'}
        out.append({'a': a, 'd': sub, 'z': tutup})
    return out


ekor = list(bag[4])  # [batang ekor, jambul]
TETAP = {'badan': s(bag[1]), 'kepala': s(bag[5])}
LENTUR = {'kakiBelakangJauh': jalur(bag[0]), 'kakiDepanDekat': jalur(bag[2]), 'kakiDepanJauh': jalur(bag[3]), 'ekor': jalur(ekor[0]),
          'jambul': jalur(ekor[1]), 'kakiBelakangDekat': jalur(bag[6])}
with open('src/flat/singa.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-singa.py dari public/flat/singa-simon.svg (Singa.svg Simon 26 Okt malam) — jangan diedit tangan. */\n')
    fh.write('export type JalurSinga = { a: Record<string, string | number>; d: number[][]; z: boolean[] };\n')
    fh.write('/** badan & surai+kepala: markup utuh (kaku) */\nexport const SINGA_TETAP = {\n')
    for k, v in TETAP.items():
        fh.write(f'  {k}: `{v}`,\n')
    fh.write('} as const;\n')
    fh.write('/** kaki, ekor, jambul: subjalur absolut [x0, y0, (c1x, c1y, c2x, c2y, x, y)…] — dilenturkan rig */\n')
    fh.write('export const SINGA_LENTUR: Record<' + ' | '.join(f"'{k}'" for k in LENTUR) + ', JalurSinga[]> = {\n')
    for k, v in LENTUR.items():
        fh.write(f'  {k}: {json.dumps(v, separators=(",", ":"))},\n')
    fh.write('};\n')
print({k: sum(len(q) for j in v for q in j['d']) // 2 for k, v in LENTUR.items()})
