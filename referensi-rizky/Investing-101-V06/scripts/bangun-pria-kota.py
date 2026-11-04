#!/usr/bin/env python3
"""BANGUN TOKOH KOTA (pria-biru) BERDIRI TEGAK DI GUIDE (27 Okt) — Simon: "@Untitled-1.svg gunakan ini untuk char yang memegang hp", lalu Simon
MERAKIT SENDIRI file itu (16.09: kaki dipendekkan, lingkaran sendi paha/betis/pergelangan kaki disamakan, kepala & lengan disambung). Rakitan
Simon = acuan; salinan public/flat/pria-kota.svg (+ 04_Asset/karakter-flat/pria-kota_rakitan-Simon_27okt.svg). Urutan lapis file APA ADANYA.
Cara (sama dengan bangun-tegak.py): tiap ruas diputar di pusat lingkaran sendi atasnya sampai sumbunya TEGAK, lalu lingkaran atas itu ditaruh
tepat di pusat lingkaran bawah ruas induknya (SEPUSAT). Pusat lingkaran = pusat kotak lingkaran (getBBox Chrome, 27 Okt 16.10).
  · lingkaran sendi rakitan Simon sudah sama besar: bahu 23,2 · siku 23,2 · pergelangan tangan 17,1/16,9 · lutut 28,4/28,5 · pergelangan kaki 25,6;
    panjang kiri = kanan: lengan atas 104,8 · bawah 102,5 · paha 166,25 · betis 142,8.
  · SAMBUNGAN DIPASKAN SEPUSAT (selisih rakitan manual): lengan bawah kiri thd siku (2,5, −3,1) · telapak thd pergelangan kaki kiri 6,2, kanan 3,9 ·
    pinggul kanan 5 lebih rendah dari kiri → dua pinggul di rata-rata y 377,25 (kaki tegak sama panjang, kedua sol di satu tanah).
  · pinggul x = rakitan Simon (904,9 & 950,35) · kepala = posisi rakitan Simon (tidak digeser).
  · TELAPAK tidak diputar (sol datar) · TANGAN diputar sebesar lengan bawahnya.
Keluaran: 04_Asset/karakter-flat/pria-kota_tegak.svg (lapis bernama + guide), src/flat/priaKota.gen.ts (markup per bagian + titik sendi)."""
import math
import re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('public/flat/pria-kota.svg').getroot()
ob = [g for g in akar if g.get('id') == 'OBJECTS'][0]
K = list(ob)


def s(el):
    t = ''.join(ET.tostring(c, encoding='unicode') for c in ([el] if not el.tag.endswith('}g') else list(el)))
    t = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', t)
    t = re.sub(r'\sid="[^"]*"', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def arah(a, b):
    """sudut ruas a→b dari tegak ke bawah, + = searah jarum jam (sama dengan rotate SVG)"""
    return math.degrees(math.atan2(-(b[0] - a[0]), b[1] - a[1]))


def jarak(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def pasang(markup, T, rot, P):
    return f'<g transform="translate({P[0]:.3f} {P[1]:.3f}) rotate({rot:.4f}) translate({-T[0]:.3f} {-T[1]:.3f})">{markup}</g>'


pusat = lambda x0, y0, x1, y1: ((x0 + x1) / 2, (y0 + y1) / 2)
# pusat lingkaran sendi di file rakitan Simon (kotak getBBox)
BAHU = [pusat(846.2, 187.7, 892.6, 234.1), pusat(953.0, 187.7, 999.4, 234.1)]  # [kiri (dekat), kanan (jauh)]
LA = {'L': (pusat(846.4, 188.3, 892.8, 234.7), pusat(790.6, 277.1, 837.1, 323.5)), 'R': (pusat(956.6, 189.4, 1003.0, 235.8), pusat(1022.8, 270.6, 1069.2, 317.1))}
LB = {'L': (pusat(788.1, 280.0, 834.5, 326.4), pusat(728.1, 364.4, 761.9, 398.2)), 'R': (pusat(1023.9, 271.0, 1070.4, 317.5), pusat(1110.0, 341.6, 1143.9, 375.4))}
TG = {'L': pusat(725.5, 368.2, 759.7, 402.4), 'R': pusat(1107.7, 339.0, 1141.9, 373.2)}
PH = {'L': (pusat(873.0, 342.8, 936.8, 406.7), pusat(855.0, 511.2, 911.8, 568.0)), 'R': (pusat(918.4, 347.8, 982.3, 411.7), pusat(943.5, 516.2, 1000.2, 573.0))}
BT = {'L': (pusat(855.6, 513.3, 912.7, 570.3), pusat(848.8, 658.6, 900.0, 709.9)), 'R': (pusat(942.2, 515.6, 999.2, 572.7), pusat(954.9, 661.0, 1006.1, 712.2))}
TP = {'L': pusat(849.1, 664.9, 900.3, 716.1), 'R': pusat(955.3, 664.9, 1006.5, 716.1)}
PINGGUL = [(904.9, 377.25), (950.35, 377.25)]
KEPALA_GESER = (0.0, 0.0)
SOL_Y, SOL_X = 791.6, {'L': (849.8, 970.0), 'R': (956.0, 1076.3)}

SISI = {'L': 0, 'R': 1}
sendi = {k: [None, None] for k in ('bahu', 'siku', 'perg', 'pinggul', 'lutut', 'pkaki')}
bagian = {}
for sisi, i in SISI.items():
    sendi['bahu'][i] = BAHU[i]
    la = LA[sisi]; L1 = jarak(*la)
    sendi['siku'][i] = (BAHU[i][0], BAHU[i][1] + L1)
    lb = LB[sisi]; L2 = jarak(*lb)
    sendi['perg'][i] = (BAHU[i][0], BAHU[i][1] + L1 + L2)
    sendi['pinggul'][i] = PINGGUL[i]
    ph = PH[sisi]; L3 = jarak(*ph)
    sendi['lutut'][i] = (PINGGUL[i][0], PINGGUL[i][1] + L3)
    bt = BT[sisi]; L4 = jarak(*bt)
    sendi['pkaki'][i] = (PINGGUL[i][0], PINGGUL[i][1] + L3 + L4)
    print(sisi, 'lengan atas %.2f · bawah %.2f · paha %.2f · betis %.2f' % (L1, L2, L3, L4))

IDX = {'pahaL': 0, 'pahaR': 1, 'panggul': 2, 'kepala': 3, 'telapakR': 4, 'telapakL': 5, 'lenganAtasR': 6, 'badan': 8, 'lenganAtasL': 9,
       'lenganBawahL': 10, 'lenganBawahR': 11, 'tanganR': 12, 'tanganL': 13, 'betisR': 14, 'betisL': 15}
for nama, i in IDX.items():
    m = s(K[i])
    sisi = nama[-1] if nama[-1] in 'LR' else None
    j = SISI.get(sisi, None)
    if nama.startswith('lenganAtas'):
        P, D = LA[sisi]; m = pasang(m, P, -arah(P, D), sendi['bahu'][j])
    elif nama.startswith('lenganBawah'):
        P, D = LB[sisi]; m = pasang(m, P, -arah(P, D), sendi['siku'][j])
    elif nama.startswith('tangan'):
        P, D = LB[sisi]; m = pasang(m, TG[sisi], -arah(P, D), sendi['perg'][j])
    elif nama.startswith('paha'):
        P, D = PH[sisi]; m = pasang(m, P, -arah(P, D), sendi['pinggul'][j])
    elif nama.startswith('betis'):
        P, D = BT[sisi]; m = pasang(m, P, -arah(P, D), sendi['lutut'][j])
    elif nama.startswith('telapak'):
        m = pasang(m, TP[sisi], 0, sendi['pkaki'][j])
    bagian[nama] = m

LEHER = (926.3, 186.0)  # poros kepala: dasar leher di kerah
SOL = {k: [(SOL_X[k][0] - TP[k][0], SOL_Y - TP[k][1]), (SOL_X[k][1] - TP[k][0], SOL_Y - TP[k][1])] for k in 'LR'}  # tumit & ujung sol thd lingkaran telapak
ALAS = sendi['pkaki'][0][1] + SOL['L'][0][1]
PUNCAK = 77.0
print('alas (bawah sol) %.2f · puncak kepala %.2f · tinggi %.2f' % (ALAS, PUNCAK, ALAS - PUNCAK))

with open('src/flat/priaKota.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/bangun-pria-kota.py dari public/flat/pria-kota.svg (Untitled-1.svg Simon 27 Okt) — jangan diedit tangan. */\n')
    fh.write('/** bagian tokoh kota di POSE DASAR TEGAK, urutan lapis file Simon (bawah → atas) */\n')
    fh.write('export const KOTA = {\n')
    for k, v in bagian.items():
        fh.write(f'  {k}: `{v}`,\n')
    fh.write('} as const;\n')
    fh.write('type P2 = [number, number];\n')
    fh.write('/** titik sendi pose dasar [kiri/dekat, kanan/jauh] */\nexport const SENDI_KOTA = {\n')
    for k, v in sendi.items():
        fh.write(f'  {k}: [[{v[0][0]:.3f}, {v[0][1]:.3f}], [{v[1][0]:.3f}, {v[1][1]:.3f}]] as [P2, P2],\n')
    fh.write(f'  leher: [{LEHER[0]}, {LEHER[1]}] as P2,\n')
    fh.write('};\n')
    fh.write(f'export const UKUR_KOTA = {{ alas: {ALAS:.2f}, puncak: {PUNCAK:.2f}, pusatKepala: {(895.6 + 969.0) / 2:.2f}, '
             f'sol: [[{SOL["L"][0][0]:.2f}, {SOL["L"][0][1]:.2f}], [{SOL["L"][1][0]:.2f}, {SOL["L"][1][1]:.2f}]] as P2[], '
             f'lingkaran: {{ bahu: 23.2, siku: 23.2, perg: 17.0, pinggul: 31.9, lutut: 28.45, pkaki: 25.6 }} }};\n')
    fh.write('/** urutan lapis file Simon (bawah → atas) */\nexport const URUTAN_KOTA = ' + str(list(bagian.keys())).replace("'", '"') + ' as const;\n')

# lembar guide (aset untuk Simon)
x0, x1 = 700, 1160
garis = []
for x in range(x0, x1 + 1, 10):
    garis.append(f'<line x1="{x}" x2="{x}" y1="40" y2="{ALAS + 20:.0f}" stroke="{"#00AEEF" if x % 50 == 0 else "#BDE9F8"}" stroke-width="{0.9 if x % 50 == 0 else 0.4}"/>')
for y in range(40, int(ALAS) + 21, 10):
    garis.append(f'<line x1="{x0}" x2="{x1}" y1="{y}" y2="{y}" stroke="{"#00AEEF" if y % 50 == 0 else "#BDE9F8"}" stroke-width="{0.9 if y % 50 == 0 else 0.4}"/>')
nama_garis = {'bahu': 'bahu', 'siku': 'siku', 'perg': 'pergelangan tangan', 'pinggul': 'pinggul', 'lutut': 'lutut', 'pkaki': 'pergelangan kaki'}
for k, label in nama_garis.items():
    y = sendi[k][0][1]
    garis.append(f'<line x1="{x0}" x2="{x1}" y1="{y:.2f}" y2="{y:.2f}" stroke="#E5475D" stroke-width="1.2" stroke-dasharray="6 4"/>'
                 f'<text x="{x1 + 6}" y="{y + 4:.2f}" font-size="13" font-family="sans-serif" fill="#E5475D">{label} {y:.1f}</text>')
garis.append(f'<line x1="{x0}" x2="{x1}" y1="{ALAS:.2f}" y2="{ALAS:.2f}" stroke="#16181B" stroke-width="1.5"/><text x="{x1 + 6}" y="{ALAS + 4:.2f}" font-size="13" font-family="sans-serif">tanah {ALAS:.1f}</text>')
R_ = {'bahu': 23.2, 'siku': 23.2, 'perg': 17.0, 'pinggul': 31.9, 'lutut': 28.45, 'pkaki': 25.6}
for k, v in sendi.items():
    if k == 'leher':
        continue
    for p in v:
        garis.append(f'<circle cx="{p[0]:.2f}" cy="{p[1]:.2f}" r="{R_[k]}" fill="none" stroke="#00AEEF" stroke-width="1.4"/><circle cx="{p[0]:.2f}" cy="{p[1]:.2f}" r="2.4" fill="#00AEEF"/>')
isi = ''.join(f'<g id="{k}">{v}</g>' for k, v in bagian.items())
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - 20} 20 {x1 - x0 + 220} {ALAS + 10:.0f}" width="{(x1 - x0 + 220) * 1.4:.0f}" height="{(ALAS + 10) * 1.4:.0f}">'
       f'<rect x="{x0 - 20}" y="20" width="{x1 - x0 + 220}" height="{ALAS + 10:.0f}" fill="#fff"/><g id="guide">{"".join(garis[:-0] if False else garis[:len(garis)])}</g>{isi}'
       f'<g id="guide-sendi" opacity="0.9">{"".join(g for g in garis if g.startswith("<circle"))}</g></svg>')
open('../04_Asset/karakter-flat/pria-kota_tegak.svg', 'w').write(svg)
print('ok')
