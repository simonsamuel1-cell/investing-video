#!/usr/bin/env python3
"""EKSTRAK RIG tokoh flat (26 Okt) — public/flat/pria-biru.svg (ekspor Illustrator dari paket Freepik 5505147 "ready animation male character",
04_Asset/karakter-flat/) → src/flat/priaBiru.gen.ts: markup tiap bagian tubuh lembar "structure" (koordinat asli file, satuan Freepik).

Warna asli diganti TOKEN supaya kostum bisa diwarnai ulang (rig.tsx):
  #000004 kulit · #000005 baju (torso + lengan baju) · #000006 celana · #000003 rambut/mata · #000002 kilau rambut · #000001 kerah
  #000007/#000008/#000009 sepatu · #00000A/#00000B/#00000C ponsel
Indeks bagian = urutan anak <g id="OBJECTS"> (dipetakan lewat getBBox di Studio 26 Okt)."""
import re
import xml.etree.ElementTree as ET

SVG = 'public/flat/pria-biru.svg'
KE = 'src/flat/priaBiru.gen.ts'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

BAGIAN = {
    'torso': ([12], 'badan'),
    'lenganAtasDekat': ([26], 'badan'), 'lenganBawahDekat': ([28], 'kulit'), 'tanganDekat': ([29], 'kulit'),
    'lenganAtasJauh': ([10], 'badan'), 'lenganBawahJauh': ([9], 'kulit'), 'tanganJauh': ([27], 'kulit'),
    'pahaDekat': ([8], 'celana'), 'betisDekat': ([7], 'celana'), 'pahaJauh': ([6], 'celana'), 'betisJauh': ([5], 'celana'),
    'kaki': ([1], 'sepatu'),  # potongan 4 = ujung sepatu cadangan (menekuk jari) — tidak dipakai
    'ponsel': ([45], 'ponsel'),
    # Simon 27 Okt: "dichar lengkap ada tangan yang lebih pas untuk adegan kota" — tangan menggenggam hp (grup 35 = tangan + hp tampak samping
    # figur "main hp") & tangan menunjuk (grup 67, lembar tangan baris bawah kanan)
    'tanganHp': ([35], 'ponsel'), 'tanganTunjuk': ([67], 'kulit'),
}
KEPALA = {'netral': 44, 'lihat': 50, 'sedih': 51, 'kaget': 52, 'cemas': 54, 'senyum': 57}
KEPALA_KOTAK = {44: (460.1, 32.1), 50: (503.5, 32.1), 51: (547.0, 32.1), 52: (587.5, 32.1), 54: (547.0, 76.0), 57: (503.5, 76.0)}

akar = ET.parse(SVG).getroot()
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
K = list(ob)


def teks(el):
    s = ''.join(ET.tostring(c, encoding='unicode') for c in el)
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def token_umum(s, jenis):
    s = s.replace('#FFAC9C', '#000004')
    if jenis == 'badan':
        s = s.replace('#2743AB', '#000005')
    if jenis == 'celana':
        s = s.replace('#000E1B', '#000006')
    if jenis == 'sepatu':
        s = s.replace('#70D4FF', '#000007').replace('#BCEBFF', '#000008').replace('#FFFFFF', '#000009')
    if jenis == 'ponsel':
        s = s.replace('#000E1B', '#00000A').replace('#1A7DFB', '#00000B').replace('#2E3944', '#00000C')
    return s


out = {}
for nama, (idx, jenis) in BAGIAN.items():
    out[nama] = token_umum(''.join(teks(K[i]) for i in idx), jenis)

kepala = {}
for nama, i in KEPALA.items():
    x0, y0 = KEPALA_KOTAK[i]
    el = K[i]
    # kerah = path putih yang titik awalnya di bawah y0+24 (mulut kaget di +19…+22) (tinggi kepala 34,7)
    for p in el.iter(f'{{{NS}}}path'):
        if p.get('fill') == '#FFFFFF':
            m = re.match(r'\s*M\s*([-\d.]+)[,\s]+([-\d.]+)', p.get('d', ''))
            if m and float(m.group(2)) > y0 + 24:
                p.set('fill', '#000001')
    s = teks(el).replace('#2743AB', '#000002').replace('#000E1B', '#000003')
    kepala[nama] = {'markup': token_umum(s, 'kepala'), 'leher': (round(x0 + 9.45, 2), round(y0 + 34.7 - 3, 2))}

# KEPALA FIGUR "berdiri main hp" (Simon 27 Okt: "buat kepala di adegan kota jadi seperti ini" — screenshot = kepala figur utuh paket ini:
# mata bulat, alis melengkung, senyum). Figur = anak OBJECTS 32 (kiri bawah lembar); kepala = bentuk daun ke-25…37 (leher, bayang rahang,
# wajah, mata, alis, mulut, hidung, rambut, telinga, kerah, kilau rambut) — kotak kepala 76,4–97,1 × 256,1–290,9 (sama ukuran kepala lembar).
DAUN = ('path', 'polygon', 'rect', 'circle', 'ellipse', 'polyline', 'line')
daun = [e for e in K[32].iter() if e.tag.split('}')[1] in DAUN][25:38]
x0, y0 = 76.4, 256.1
for p in daun:
    if p.tag.endswith('path') and p.get('fill') == '#FFFFFF':
        m = re.match(r'\s*M\s*([-\d.]+)[,\s]+([-\d.]+)', p.get('d', ''))
        if m and float(m.group(2)) > y0 + 24:
            p.set('fill', '#000001')
s = re.sub(r'\s+', ' ', ''.join(re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', ET.tostring(e, encoding='unicode')) for e in daun)).strip()
s = s.replace('#2743AB', '#000002').replace('#000E1B', '#000003')
kepala['mainHp'] = {'markup': token_umum(s, 'kepala'), 'leher': (round(x0 + 9.45, 2), round(y0 + 34.7 - 3, 2))}

with open(KE, 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-rig.py dari public/flat/pria-biru.svg (Freepik 5505147) — jangan diedit tangan. */\n')
    fh.write('export const BAGIAN = {\n')
    for k, v in out.items():
        fh.write(f'  {k}: `{v}`,\n')
    fh.write('} as const;\n')
    fh.write('export const KEPALA = {\n')
    for k, v in kepala.items():
        m = v['markup']
        fh.write(f"  {k}: {{ leher: [{v['leher'][0]}, {v['leher'][1]}] as [number, number], markup: `{m}` }},\n")
    fh.write('} as const;\n')
    fh.write('export type NamaKepala = keyof typeof KEPALA;\n')
print(KE, {k: len(v) for k, v in out.items()}, {k: len(v['markup']) for k, v in kepala.items()})
