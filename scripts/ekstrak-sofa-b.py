#!/usr/bin/env python3
"""SOFA Scene 04 (Simon 27 Okt sore: "sofa warnanya menyatu dengan baju, dan ukuran tidak realistis, cari dari freepik … (stylenya 2D flat design)" →
pilih B, Kampus "Couple resting on sofa in living room", diunduh Simon 27 Okt). Sumber = ekspor Illustrator `04_Asset/sofa/B_kampus_ruang-tamu.svg`
(scripts/ekspor-svg.jsx). Sofa 3 dudukan = grup 0.1.2 TANPA tokoh wanita: anak 0–5, 7–12 (badan, sandaran, lengan, dudukan, kaki) + garis kilau putih
9 · 26 · 27 · 28 · 37 (indeks 6 = bayangan tubuh wanita di dudukan → dibuang). Warna asli (mauve, bukan brand) DIGANTI token supaya bisa diwarnai di kode:
#B08C98 → T1 (badan) · #84666E → T2 (sisi gelap) · #C19DAA → T3 (sisi terang lengan) · #997081 → T4 (dudukan depan).
Keluaran: public/flat/s04/sofa.svg (viewBox = kotak sofa) + src/s04flat/sofa.gen.ts (markup + kotak + tinggi dudukan)."""
import re, xml.etree.ElementTree as ET
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('04_Asset/sofa/B_kampus_ruang-tamu.svg').getroot()
sofa = list(list(list(akar)[0])[1])[2]
AMBIL = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 26, 27, 28, 37]
anak = list(sofa)
X0, Y0, X1, Y1 = 1066, 1002, 2112, 1434  # kotak sofa (titik kendali) + tepi 5
TOKEN = {'#B08C98': '#T1', '#84666E': '#T2', '#C19DAA': '#T3', '#997081': '#T4'}
def teks(el):
    s = ET.tostring(el, encoding='unicode')
    s = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', s)
    return re.sub(r'\s+', ' ', s).strip()
isi = ''.join(teks(anak[i]) for i in AMBIL)
for a, b in TOKEN.items():
    isi = isi.replace(f'fill="{a}"', f'fill="{b}"')
w, h = X1 - X0, Y1 - Y0
# dudukan: puncak bantal dudukan (anak 5, #997081 depan dudukan mulai y 1278) — tepi atas permukaan duduk
DUDUK = 1278 - Y0
open('src/s04flat/sofa.gen.ts', 'w').write(
    '/* DIBANGKITKAN scripts/ekstrak-sofa-b.py dari 04_Asset/sofa/B_kampus_ruang-tamu.svg (Freepik/Kampus, diunduh Simon 27 Okt) — jangan diedit tangan. */\n'
    f'export const SOFA_B = {{ x0: {X0}, y0: {Y0}, w: {w}, h: {h}, duduk: {DUDUK} }};\n'
    f'export const SOFA_B_MARKUP = `{isi}`;\n')
print('sofa', w, h, 'duduk', DUDUK, 'elemen', len(AMBIL))
