#!/usr/bin/env python3
"""RUANG TAMU (adegan investor S01) = berkas Simon `Ruang tamu.svg` dari Investing 101 V06 (salinan ../04_Asset/ruang-tamu_Simon.svg, viewBox 1920 × 1080
= layar). Dipecah EMPAT lapis, urutan tumpuk sama dengan berkas asli, supaya tokoh duduk di antara perabot & meja dan lampu gantung bisa digeser sendiri:
  public/flat/ruang/ruang-belakang.svg = latar + dinding/lantai + jendela (grup inti 0–1)
  public/flat/ruang/ruang-lampu.svg    = tiga lampu gantung: tali, kap, sorot cahaya (grup inti 2, x 548–1372 · y −101…292)
  public/flat/ruang/ruang-perabot.svg  = tanaman, sofa, lampu lantai, bingkai, karpet/stool (grup inti 3–7)
  public/flat/ruang/ruang-depan.svg    = meja kopi + benda di atasnya (grup inti 8) — di DEPAN kaki tokoh
31 Okt (Simon: "perkecil adegan ruang tamu saat split screen" + "agar warna lampu dan watermark tidak bertabrakan"): lampu jadi lapis sendiri supaya di
layar terbelah bisa bergeser ±50 px keluar dari kolom chip di atas kepala investor. Warna & bentuk apa adanya (berkas Simon). Tiap grup memuat
gradiennya sendiri (dicek: tak ada rujukan url(#…) lintas grup)."""
import re, xml.etree.ElementTree as ET
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')  # gambar raster tertanam memakai xlink:href (tanpa ini → awalan ns1 tak terdefinisi, SVG gagal dibaca)
SRC = '../04_Asset/ruang-tamu_Simon.svg'
akar = ET.parse(SRC).getroot()
def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()
bg = [g for g in akar if g.get('id') == 'BACKGROUND'][0]
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
inti = list(list(ob)[0])  # anak grup 0 di OBJECTS (anak OBJECTS 1–6 kosong)
LAPIS = {'belakang': [0, 1], 'lampu': [2], 'perabot': [3, 4, 5, 6, 7], 'depan': [8]}
assert sorted(sum(LAPIS.values(), [])) == list(range(len(inti)))
# viewBox diperluas 100 px ke ATAS (latar Simon memang mulai y −100) supaya ruang bisa diturunkan tanpa celah kosong di tepi atas frame
kepala = f'<svg xmlns="{NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1180" viewBox="0 -100 1920 1180">'
for nama, idx in LAPIS.items():
    isi = (teks(bg) if nama == 'belakang' else '') + ''.join(teks(inti[i]) for i in idx)
    open(f'public/flat/ruang/ruang-{nama}.svg', 'w').write(kepala + isi + '</svg>')
    print(nama, idx)
# 2 Nov (Simon: "kamu membangun paralaxnya salah" + contoh `Contoh paralax 1.mp4`): LAMPU LANTAI ungu (grup inti 5, anak 0) disalin jadi berkas sendiri =
# pembatas latar depan transisi paralaks toko → ruang tamu (versi diperbesar 1,5× dari lampu yang sama di ruang). viewBox longgar x 180–510 · y 60–820;
# tiang di x 282,95, ujung atas tiang y 137 (dipakai flat/transisi.tsx LAMPU_LANTAI).
lampu = list(inti[5])[0]
# satu rujukan gradien (kilau kap) didefinisikan di luar anak ini → salin definisinya ikut
gradien = ''.join(teks(g) for g in akar.iter() if g.tag.endswith('Gradient') and g.get('id') and f"url(#{g.get('id')})" in teks(lampu))
open('public/flat/ruang/lampu-lantai.svg', 'w').write(f'<svg xmlns="{NS}" width="330" height="760" viewBox="180 60 330 760">' + gradien + teks(lampu) + '</svg>')
print('lampu-lantai', len(gradien))
