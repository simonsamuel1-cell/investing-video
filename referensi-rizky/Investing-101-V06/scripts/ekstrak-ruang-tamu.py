#!/usr/bin/env python3
"""RUANG TAMU Scene 04 = berkas Simon `Ruang tamu.svg` (folder episode, 28 Okt: "ganti ruang tamunya dengan ini"; salinan 04_Asset/ruang-tamu_Simon.svg,
viewBox 1920 × 1080 = layar). Dipecah dua lapis supaya tokoh duduk DI ANTARA keduanya:
  public/flat/s04/ruang-belakang.svg = semua kecuali meja kopi (dinding, jendela, bingkai, lampu, tanaman, sofa merah, stool, karpet, lantai)
  public/flat/s04/ruang-depan.svg    = meja kopi + benda di atasnya (grup OBJECTS 0.0.8, kotak ±578–1341 × 651–966) — di DEPAN kaki tokoh
Warna & bentuk apa adanya (berkas Simon)."""
import re, xml.etree.ElementTree as ET
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')  # gambar raster tertanam memakai xlink:href (tanpa ini → awalan ns1 tak terdefinisi, SVG gagal dibaca)
SRC = '04_Asset/ruang-tamu_Simon.svg'
akar = ET.parse(SRC).getroot()
def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()
bg = [g for g in akar if g.get('id') == 'BACKGROUND'][0]
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
inti = list(list(ob)[0])  # anak grup 0 di OBJECTS (= 1.0.x di peta bbox)
MEJA = 8
belakang = teks(bg) + ''.join(teks(c) for i, c in enumerate(inti) if i != MEJA)
depan = teks(inti[MEJA])
# viewBox diperluas 100 px ke ATAS (latar Simon memang mulai y −100) supaya ruang bisa diturunkan tanpa celah kosong di tepi atas frame
kepala = f'<svg xmlns="{NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1180" viewBox="0 -100 1920 1180">'
open('public/flat/s04/ruang-belakang.svg', 'w').write(kepala + belakang + '</svg>')
open('public/flat/s04/ruang-depan.svg', 'w').write(kepala + depan + '</svg>')
print('anak', len(inti), 'meja', MEJA)
