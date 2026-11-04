#!/usr/bin/env python3
"""EKSTRAK KEPALA LAIN (26 Okt) — kepala dari rig Freepik lain milik tim, supaya anggota kelompok tidak kembar dengan tokoh utama
(Simon 26 Okt: "Buat karakternya berbeda beda"). Badan tetap rig pria-biru (src/flat/rig.tsx), kepala diganti.
  wanita = Freepik 5504349 (rambut hitam berkonde)      · public/flat/wanita-34.svg (ekspor Illustrator)
  ikal   = Freepik 6208462 (rambut gelap berantakan)     · public/flat/pria-ikal.svg (ekspor Illustrator)
  keriting = "Budi.svg" Motion Academy (rambut keriting) · public/flat/budi-inline.svg (CSS kelas dijadikan atribut fill)
Keluaran src/flat/kepalaLain.gen.ts: markup + kotak (koordinat file) + warna kulit asli kepala itu."""
import re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
SUMBER = {
    # nama: (file, offset indeks, {ekspresi: (indeks, x0, y0, x1, y1)})
    'wanita': ('public/flat/wanita-34.svg', 0, {'netral': (8, 614, 138, 642, 172), 'kaget': (10, 614, 192, 642, 226)}),
    'ikal': ('public/flat/pria-ikal.svg', 0, {'netral': (31, 582, 26, 609, 58), 'kaget': (34, 582, 81, 609, 113)}),
    'keriting': ('public/flat/budi-inline.svg', 3, {'netral': (11, 554, 131, 617, 215), 'kaget': (8, 636, 33, 699, 117)}),
}


def teks(el):
    s = ''.join(ET.tostring(c, encoding='unicode') for c in el)
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    s = re.sub(r'\sclass="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def kulit(m):
    calon = {}
    for h in re.findall(r'fill="(#[0-9A-Fa-f]{6})"', m) + re.findall(r'fill:\s*(#[0-9A-Fa-f]{6})', m):
        r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
        if r > 225 and 150 <= g <= 205 and 120 <= b <= 185:
            calon[h.upper()] = calon.get(h.upper(), 0) + 1
    return max(calon, key=calon.get) if calon else '#FFAC9C'


out = {}
for nama, (berkas, geser, eks) in SUMBER.items():
    akar = ET.parse(berkas).getroot()
    ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
    K = list(ob)
    out[nama] = {}
    for e, (i, x0, y0, x1, y1) in eks.items():
        el = K[i + geser]
        if nama == 'wanita':
            # kerah blus putih di dasar kepala = bagian BAJU → DIHAPUS (26 Okt malam). Dulu diwarnai kulit → tersisa bentuk zig-zag di bawah dagu
            # (Simon: "apa ini, itu berada di dagu char wanita"); leher kini = leher tokoh utama di rigTegak. Mata/gigi putih di atasnya tak tersentuh.
            for induk in list(el.iter()):
                for pth in list(induk):
                    if not (pth.tag.endswith('path') or pth.tag.endswith('polygon')):
                        continue
                    mm = re.match(r'\s*M?\s*([-\d.]+)[,\s]+([-\d.]+)', pth.get('d', pth.get('points', '')))
                    if pth.get('fill', '').upper() == '#FFFFFF' and mm and float(mm.group(2)) > y0 + 26:
                        induk.remove(pth)
        m = teks(el)
        kl = kulit(m)
        out[nama][e] = (m.replace('KULIT', kl), (x0, y0, x1, y1), kl)

with open('src/flat/kepalaLain.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-kepala.py — jangan diedit tangan. */\n')
    fh.write('export const KEPALA_LAIN = {\n')
    for nama, eks in out.items():
        fh.write(f'  {nama}: {{\n')
        for e, (m, k, kl) in eks.items():
            fh.write(f'    {e}: {{ kotak: [{k[0]}, {k[1]}, {k[2]}, {k[3]}] as [number, number, number, number], kulit: \'{kl}\', markup: `{m}` }},\n')
        fh.write('  },\n')
    fh.write('} as const;\n')
    fh.write('export type NamaSetKepala = keyof typeof KEPALA_LAIN;\n')
print({n: {e: (len(v[0]), v[2]) for e, v in eks.items()} for n, eks in out.items()})
