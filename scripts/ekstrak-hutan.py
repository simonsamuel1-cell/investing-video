#!/usr/bin/env python3
"""EKSTRAK HUTAN (26 Okt) — latar Simon `Hutan.svg` (panorama 5500 × 1080) → src/flat/hutan.gen.ts, dipecah per lapisan supaya bisa digulir
layar penuh dengan paralaks tanpa kaki tokoh meluncur:
  LANGIT  = gradien latar (diam)
  JAUH    = tanah (persegi + poligon), awan, pohon, batu, semak di cakrawala (paralaks pelan)
  RUMPUT  = rumpun rumput di tanah, satu per satu + garis dasarnya (paralaks menurut kedalaman; diulang tiap PERIODE)
  SINGA   = singa (Simon 26 Okt: "untuk singanya tadi aku asal menempatkannya, sesuaikan dengan kebutuhan") → aktor terpisah
Versi file: v2 (26 Okt siang). Pemilahan per kotak getBBox (lihat KOTAK) — jalankan ulang pemetaan bila Simon mengubah Hutan.svg lagi.
grup 6 = grup 4 digeser 3852 → pola berulang tiap 3852."""
import re
import xml.etree.ElementTree as ET

SVG = 'public/flat/hutan.svg'
KE = 'src/flat/hutan.gen.ts'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse(SVG).getroot()
bg = [g for g in akar if g.get('id') == 'BACKGROUND'][0]
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
O = list(ob)
g0 = list(O[0])


def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()


# semua gradien (dipakai lintas lapisan) → satu <defs>
gradien = [el for el in akar.iter() if el.tag.endswith('linearGradient') or el.tag.endswith('radialGradient')]
DEFS = ''.join(teks(g) for g in gradien)

LANGIT = ''.join(teks(c) for c in bg if not c.tag.endswith('Gradient'))
# Hutan.svg v2 (Simon 26 Okt siang: batu tengah diperbesar; file diratakan jadi SATU grup) — anak grup tanah g0 dipilah dari getBBox
# (Studio 26 Okt): JAUH = tanah + benda cakrawala (atas < 680) urut dokumen · RUMPUT = rumpun (atas ≥ 680) dalam satu pola x < 3982
# (pola berulang tiap 3852; rumpun x ≥ 3982 = salinan pola pertama).
KOTAK = {  # indeks anak g0: (x0, x1, y0, y1)
  0: (316, 1645, 74, 505), 1: (2393, 3721, 74, 505), 2: (4169, 5497, 74, 505), 4: (5494, 5637, 482, 640), 5: (5557, 5804, 377, 651),
  7: (5761, 5873, 582, 658), 8: (5324, 5822, 538, 674), 10: (4726, 4896, 485, 674), 12: (4053, 4178, 528, 667), 13: (4090, 4443, 281, 673),
  15: (3711, 3836, 528, 667), 16: (3446, 3800, 281, 673), 18: (2993, 3164, 485, 674), 20: (2252, 2395, 482, 640), 21: (2085, 2332, 377, 651),
  22: (2068, 2566, 538, 674), 24: (2017, 2128, 582, 658), 26: (874, 1044, 485, 674), 28: (1642, 1785, 482, 640), 29: (1705, 1952, 377, 651),
  30: (1472, 1970, 538, 674), 32: (1909, 2021, 582, 658), 34: (201, 326, 528, 667), 36: (0, 5500, 658, 1080), 37: (237, 591, 281, 673),
  39: (0, 5500, 658, 974), 40: (141, 326, 877, 998), 41: (948, 1055, 771, 841), 42: (1230, 1337, 694, 764), 43: (1906, 1982, 662, 712),
  44: (1537, 1597, 1009, 1052), 45: (818, 878, 936, 978), 46: (854, 875, 763, 778), 47: (439, 460, 895, 910), 48: (130, 151, 747, 762),
  49: (1183, 1204, 811, 826), 50: (1984, 2005, 750, 765), 51: (734, 755, 841, 856), 52: (175, 196, 686, 701), 53: (335, 394, 1001, 1043),
  54: (1943, 2002, 929, 972), 56: (145, 279, 630, 658), 57: (1765, 1961, 923, 1051), 58: (3711, 3897, 877, 998), 59: (2982, 3089, 771, 841),
  60: (2700, 2807, 694, 764), 61: (2055, 2131, 662, 712), 62: (2441, 2500, 1009, 1052), 63: (3159, 3219, 936, 978), 64: (3162, 3183, 763, 778),
  65: (3577, 3598, 895, 910), 66: (3886, 3907, 747, 762), 67: (2833, 2854, 811, 826), 68: (2033, 2054, 750, 765), 69: (3282, 3303, 841, 856),
  70: (3841, 3862, 686, 701), 71: (3643, 3703, 1001, 1043), 72: (2035, 2095, 929, 972), 74: (3758, 3892, 630, 658), 75: (2077, 2272, 923, 1051),
  76: (3993, 4178, 877, 998), 77: (4800, 4907, 771, 841), 78: (5082, 5189, 694, 764), 79: (5758, 5834, 662, 712), 80: (5389, 5449, 1009, 1052),
  81: (4670, 4730, 936, 978), 82: (4706, 4727, 763, 778), 83: (4291, 4312, 895, 910), 84: (3982, 4003, 747, 762), 85: (5035, 5056, 811, 826),
  86: (5836, 5857, 750, 765), 87: (4586, 4607, 841, 856), 88: (4027, 4048, 686, 701), 89: (4187, 4246, 1001, 1043), 90: (5795, 5854, 929, 972),
  92: (3997, 4131, 630, 658), 93: (5617, 5813, 923, 1051)}
jauh = ''.join(teks(g0[i]) for i in sorted(KOTAK) if KOTAK[i][2] < 680)
tanah = ''
rumput = [(teks(g0[i]), x0, x1, y1) for i, (x0, x1, y0, y1) in sorted(KOTAK.items()) if y0 >= 680 and x0 < 3982]
SINGA = teks(O[1])

with open(KE, 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-hutan.py dari public/flat/hutan.svg (latar Simon, 26 Okt) — jangan diedit tangan. */\n')
    fh.write(f'export const DEFS = `{DEFS}`;\n')
    fh.write(f'export const LANGIT = `{LANGIT}`;\n')
    fh.write(f'export const JAUH = `{tanah}{jauh}`;\n')
    fh.write('export const RUMPUT: { m: string; x0: number; x1: number; yb: number }[] = [\n')
    for m, x0, x1, yb in rumput:
        fh.write(f'  {{ m: `{m}`, x0: {x0}, x1: {x1}, yb: {yb} }},\n')
    fh.write('];\n')
    fh.write('export const PERIODE = 3852;\n')
    fh.write('export const CAKRAWALA = 658;\n')
    fh.write(f'export const SINGA = {{ m: `{SINGA}`, x0: 511, x1: 926, y0: 534, y1: 894 }};\n')
# KINERJA STUDIO (terukur 26 Okt): lapisan SVG sebaris yang bergeser diraster ulang tiap frame → tiap lapisan juga ditulis sebagai BERKAS svg
# mandiri (public/flat/hutan/) untuk <Img>: diraster sekali, lalu hanya digeser GPU.
import os
D = 'public/flat/hutan'
os.makedirs(D, exist_ok=True)
def berkas(nama, isi, x0, y0, w, h):
    open(f'{D}/{nama}.svg', 'w').write(f'<svg xmlns="{NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="{x0} {y0} {w} {h}">'
                                        f'<defs>{DEFS}</defs>{isi}</svg>')
berkas('langit', LANGIT, 0, 0, 1920, 1080)
berkas('jauh', tanah + jauh, 0, 0, 5880, 1080)
for i, (m, x0, x1, yb) in enumerate(rumput):
    berkas(f'rumput-{i:02d}', m, x0 - 10, yb - 220, x1 - x0 + 20, 230)
berkas('singa', SINGA, 511, 534, 415, 360)
print(KE, len(DEFS), len(LANGIT), len(jauh), len(rumput), len(SINGA))
