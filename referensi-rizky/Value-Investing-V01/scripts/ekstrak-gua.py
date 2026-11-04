#!/usr/bin/env python3
"""EKSTRAK RIG GUA (26 Okt) — karakter utama hasil edit manual Simon (`tokoh-utama_baju-gua.svg`, salinan public/flat/gua-simon.svg):
Simon: "untuk charnya aku mau kamu membangunnya persis seperti char utama yang kamu kirimkan (sudah aku edit manual), dan rignya coba gunakan
yang aku kirimkan tadi" (CharacterRig.tsx). Bagian-bagiannya tersebar (tata letak "structure"); sendi = pusat lingkaran ujung tiap ruas
(dipetakan getBBox di Studio 26 Okt) → src/flat/rigGua.tsx. Keluaran src/flat/guaSimon.gen.ts: markup tiap bagian, transform grupnya ikut.
Anak akar: 0 lengan atas kanan-layar · 1 lengan bawah+tangan kanan · 2 badan · 3 lengan atas kiri · 4 lengan bawah+tangan kiri · 5 panggul ·
6/7 kaki kiri/kanan · 8 betis kiri · 9 paha kiri · 10 paha kanan · 11 betis kanan · 12 tunik + totol · 13 kepala."""
import re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('public/flat/gua-simon.svg').getroot()
A = [c for c in akar if not c.tag.endswith('defs')]


def s(el):
    t = ET.tostring(el, encoding='unicode')
    t = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def pecah(el, idx):
    """sebagian anak grup (jalur di dalam, termasuk sub-grup), transform grup dipertahankan"""
    anak = [c for c in el]
    isi = ''.join(s(anak[i]) for i in idx)
    tr = el.get('transform')
    return f'<g transform="{tr}">{isi}</g>' if tr else f'<g>{isi}</g>'


def token(m, kind):
    # warna kulit → token supaya bisa diganti per kostum/orang; telapak gelap tetap turunan kulit
    m = m.replace('#FFAC9C', '#000004').replace('#F8AB9C', '#000010').replace('#EC9785', '#00000D')  # dua nada kulit Simon dipertahankan
    if kind == 'tunik':
        m = m.replace('#F8B62A', '#00000E').replace('#4C3B2D', '#00000F')
    return m


P = {
    'lenganAtasR': token(s(A[0]), 'kulit'),
    'lenganBawahR': token(pecah(A[1], [0, 1, 2]), 'kulit'), 'tanganR': token(pecah(A[1], [3, 4]), 'kulit'),
    'badan': token(s(A[2]), 'kulit'),
    'lenganAtasL': token(s(A[3]), 'kulit'),
    'lenganBawahL': token(pecah(A[4], [0, 1, 2]), 'kulit'), 'tanganL': token(pecah(A[4], [3, 4]), 'kulit'),
    'panggul': token(s(A[5]), 'kulit'),
    'kakiL': token(s(A[6]), 'kulit'), 'kakiR': token(s(A[7]), 'kulit'),
    'betisL': token(s(A[8]), 'kulit'), 'pahaL': token(s(A[9]), 'kulit'), 'pahaR': token(s(A[10]), 'kulit'), 'betisR': token(s(A[11]), 'kulit'),
    'tunik': token(s(A[12]), 'tunik'),
    'kepala': s(A[13]),  # kepala apa adanya (kulit kepala tetap #F8AB9C asli Simon) — ditukar utuh untuk orang lain
}
# bagian kaki dipisah untuk kostum hari ini: pergelangan (0,1) / telapak (2) / alas (3)
for sisi, i in (('L', 6), ('R', 7)):
    P[f'kakiPergelangan{sisi}'] = token(pecah(A[i], [0, 1]), 'kulit')
    P[f'kakiTelapak{sisi}'] = token(pecah(A[i], [2]), 'kulit')
    P[f'kakiAlas{sisi}'] = token(pecah(A[i], [3]), 'kulit')

with open('src/flat/guaSimon.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-gua.py dari public/flat/gua-simon.svg (edit manual Simon 26 Okt) — jangan diedit tangan.\n'
             '* Token: #000004 kulit (badan/lengan) · #000010 kulit kedua (kaki) · #00000D alas kaki (kulit gelap) · #00000E tunik · #00000F totol. */\n')
    fh.write('export const GUA = {\n')
    for k, v in P.items():
        fh.write(f'  {k}: `{v}`,\n')
    fh.write('} as const;\n')
print({k: len(v) for k, v in P.items()})
