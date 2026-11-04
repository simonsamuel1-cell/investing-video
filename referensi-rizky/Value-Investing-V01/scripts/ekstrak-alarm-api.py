#!/usr/bin/env python3
"""Aset Scene 06 dari berkas Simon (28 Okt: "Cari icon/ilustrasi alarm agar animasinya lebih jelas/gunakan yang aku kirimkan" · "Dalam file yang
kirimkan juga ada apinya"). Sumber: 04_Asset/alarm-api-Simon/{sirene/sirene.svg, pemadam/pemadam.svg} (EPS → SVG via scripts/ekspor-svg.jsx).

  public/flat/s06/sirene-badan.svg  sirene merah bertanda "!" (grup 1.2–1.5) tanpa latar putih
  public/flat/s06/sirene-sinar.svg  enam garis sinar (grup 1.0 & 1.1) — viewBox SAMA dengan badan supaya bisa ditumpuk & dikedipkan
  public/flat/s06/api.svg           tiga lidah api di atas gedung terbakar (grup 5.0 paket pemadam)
"""
import copy, os, xml.etree.ElementTree as ET

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASET = os.path.join(AKAR, '04_Asset', 'alarm-api-Simon')
KE = os.path.join(AKAR, 'public', 'flat', 's06')
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')


def anak(el):
    return [c for c in list(el) if isinstance(c.tag, str)]


def tulis(nama, isi, vb):
    svg = ET.Element(f'{{{NS}}}svg', {'viewBox': vb, 'width': vb.split()[2], 'height': vb.split()[3]})
    for c in isi:
        svg.append(copy.deepcopy(c))
    ET.ElementTree(svg).write(os.path.join(KE, nama), encoding='utf-8', xml_declaration=False)
    print('tulis', nama, vb)


os.makedirs(KE, exist_ok=True)
# — sirene —
akar = ET.parse(os.path.join(ASET, 'sirene', 'sirene.svg')).getroot()
top = anak(akar)
assert top[0].tag.endswith('rect') and top[1].tag.endswith('g'), [t.tag for t in top]
g = anak(top[1])
assert len(g) == 6, len(g)
VB_S = '140 115 220 270'  # x 140–360 · y 115–385 (badan 147–352 × 166–376, sinar 150–349 × 123–175)
tulis('sirene-sinar.svg', g[0:2], VB_S)
tulis('sirene-badan.svg', g[2:], VB_S)
# — api (grup 5.0 paket pemadam) —
akar = ET.parse(os.path.join(ASET, 'pemadam', 'pemadam.svg')).getroot()
top = anak(akar)
gedung = [t for t in top if t.tag.endswith('g')]
api = anak(gedung[5])[0]
tulis('api.svg', [api], '190 136 70 84')
