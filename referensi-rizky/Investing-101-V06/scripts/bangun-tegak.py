#!/usr/bin/env python3
"""BANGUN TOKOH GUA BERDIRI TEGAK DI ATAS GUIDE (26 Okt malam) — tips Simon: "1. buat charnya berdiri tegak. 2. Terapkan garis (guide)
acuan/grid dalam membangun charnya untuk setiap anggota tubuh. 3. Buat 1 char dulu sampai aku merasa itu benar".
Sumber = `tokoh gua.svg` Simon (salinan public/flat/gua-simon2.svg), lapis & bentuk apa adanya. Tiap ruas diputar di pusat lingkaran
sendi atasnya sampai sumbunya TEGAK, lalu lingkaran atas itu ditaruh tepat di titik guide; ruas berikutnya sepusat dengan lingkaran bawah
ruas sebelumnya. Pusat lingkaran diukur getBBox di Studio (26 Okt malam).
  · garis guide: bahu · siku · pergelangan tangan · pinggul · lutut · pergelangan kaki · tanah; sumbu tegak bahu & pinggul dekat/jauh
  · telapak diputar sampai alasnya datar
  · lengan atas dekat di file 60,4 px, jauh 71,1 px → sepanjang 71,1 agar siku dua lengan di satu garis guide
  · LINGKARAN SENDI SAMA BESAR (Simon 26 Okt malam: "seharusnya lingkaran yang jadi anchor point itu ukurannya sama, cek tangan satunya,
    atau anggota tubuh lain"). Di file: bahu badan r 15,7 vs lengan atas r 19,3/19,5 · siku lengan atas r 19,3/19,5 vs lengan bawah
    r 17,3 (dekat)/15,7 (jauh) · lutut paha r 18,4 vs betis r 20,2 · pergelangan tangan dekat r 12,6 vs jauh 11,5. Kini: ruas lurus
    (lengan atas, lengan bawah, betis — di file memang kapsul/kerucut bersisi lurus) dibangun ulang sebagai SELUBUNG dua lingkaran sendinya,
    jari-jari per sendi sama untuk dua ruas yang bertemu & sama kiri-kanan: bahu = siku = 15,7 (lingkaran bahu badan) · pergelangan tangan
    11,5 (tangan jauh; tangan dekat diskalakan 0,91 di pergelangan) · lutut 18,4 (paha, gambar Simon tetap) · pergelangan kaki 18,1 (telapak)
Keluaran: 04_Asset/karakter-flat/tokoh-gua_tegak.svg (lapis bernama + lapis guide), public/flat/gua-tegak.svg (tanpa guide),
src/flat/guaTegak.gen.ts (markup per bagian ber-token + titik sendi)."""
import math
import re
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
akar = ET.parse('public/flat/gua-simon2.svg').getroot()
L = {g.get('id'): g for g in akar if g.get('id')}


def s(el):
    t = ET.tostring(el, encoding='unicode')
    t = re.sub(r'\sxmlns(:\w+)?="[^"]*"', '', t)
    t = re.sub(r'\sid="[^"]*"', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def bungkus(induk, anak):
    tr = induk.get('transform')
    return f'<g transform="{tr}">{s(anak)}</g>' if tr else s(anak)


def arah(a, b):
    """sudut ruas a→b dari tegak ke bawah, + = searah jarum jam (sama dengan rotate SVG)"""
    return math.degrees(math.atan2(-(b[0] - a[0]), b[1] - a[1]))


def jarak(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def putar(p, d, c):
    r = math.radians(d)
    dx, dy = p[0] - c[0], p[1] - c[1]
    return (c[0] + dx * math.cos(r) - dy * math.sin(r), c[1] + dx * math.sin(r) + dy * math.cos(r))


def pasang(markup, T, rot, P):
    """putar bagian `rot`° di titik T lalu pindahkan T ke P"""
    return f'<g transform="translate({P[0]:.3f} {P[1]:.3f}) rotate({rot:.4f}) translate({-T[0]:.3f} {-T[1]:.3f})">{markup}</g>'


def peta(q, T, rot, P):
    x = putar(q, rot, T)
    return (x[0] - T[0] + P[0], x[1] - T[1] + P[1])


# ── pusat lingkaran sendi di file Simon (getBBox Studio) — [dekat, jauh]
BAHU_BADAN = [(141.10, 102.71), (215.08, 102.68)]          # lingkaran bahu di badan
LA = [((139.93, 103.07), (96.62, 145.10)), ((223.51, 103.36), (249.38, 169.55))]   # lengan atas: atas, bawah
LB = [((96.94, 145.72), (130.51, 206.51)), ((249.49, 169.77), (303.05, 213.94))]   # lengan bawah
TG = [(127.94, 200.44), (300.09, 211.55)]                  # lingkaran pergelangan di tangan
PH = [((163.44, 262.82), (129.50, 364.67)), ((199.92, 272.82), (261.37, 361.52))]  # paha
BT = [((129.37, 362.86), (50.76, 418.73)), ((260.44, 366.54), (278.62, 461.26))]   # betis
KK = [(52.16, 417.97), (279.02, 463.44)]                   # lingkaran atas kapsul pergelangan kaki
ALAS = [((6.85, 427.24), (50.41, 497.05)), ((263.0, 506.82), (345.29, 506.62))]    # sisi bawah alas: tumit → ujung
LEHER = (180.2, 96.0)


# ── garis guide
Y_BAHU = (BAHU_BADAN[0][1] + BAHU_BADAN[1][1]) / 2
P_LA = jarak(*LA[1])                       # 71,1 — lengan atas jauh (dekat dibangun ulang sepanjang ini)
P_LB = [jarak(*LB[0]), jarak(*LB[1])]
Y_PINGGUL = (PH[0][0][1] + PH[1][0][1]) / 2
X_BAHU = [BAHU_BADAN[0][0], BAHU_BADAN[1][0]]
X_PINGGUL = [PH[0][0][0], PH[1][0][0]]
bahu = [(X_BAHU[i], Y_BAHU) for i in (0, 1)]
siku = [(X_BAHU[i], Y_BAHU + P_LA) for i in (0, 1)]
perg = [(X_BAHU[i], siku[i][1] + P_LB[i]) for i in (0, 1)]
pinggul = [(X_PINGGUL[i], Y_PINGGUL) for i in (0, 1)]
lutut = [(X_PINGGUL[i], Y_PINGGUL + jarak(*PH[i])) for i in (0, 1)]
pkaki = [(X_PINGGUL[i], lutut[i][1] + jarak(*BT[i])) for i in (0, 1)]

# ── jari-jari sendi (satu nilai per sendi, kiri = kanan)
R_BAHU = R_SIKU = 15.74      # lingkaran bahu di badan Simon (31,49 / 2) = lebar kapsul lengan atas = siku lengan bawah jauh
R_PERG = 11.47               # lingkaran pergelangan tangan jauh (lengan bawah & tangan)
R_LUTUT = 18.43              # lingkaran bawah paha Simon (gambar paha tetap)
R_PINGGUL = 20.73            # lingkaran atas paha Simon
R_PKAKI = 18.105             # lingkaran atas kapsul pergelangan telapak
R_TANGAN_DEKAT = 12.61       # lingkaran pergelangan di tangan dekat → diskalakan ke R_PERG


def selubung(x, ya, ra, yb, rb, warna='#FFAC9C'):
    """ruas tegak = selubung (convex hull) lingkaran sendi atas (ya, ra) & bawah (yb, rb) + dua lingkaran sendinya sebagai titik jangkar"""
    sn = (ra - rb) / (yb - ya)
    cs = math.sqrt(1 - sn * sn)
    TL, TR = (x - ra * cs, ya + ra * sn), (x + ra * cs, ya + ra * sn)
    BL, BR = (x - rb * cs, yb + rb * sn), (x + rb * cs, yb + rb * sn)
    d = (f'M{TL[0]:.3f},{TL[1]:.3f} L{BL[0]:.3f},{BL[1]:.3f} A{rb:.3f},{rb:.3f} 0 0 0 {BR[0]:.3f},{BR[1]:.3f} '
         f'L{TR[0]:.3f},{TR[1]:.3f} A{ra:.3f},{ra:.3f} 0 1 0 {TL[0]:.3f},{TL[1]:.3f} Z')
    return (f'<g><path fill="{warna}" d="{d}"/><circle fill="{warna}" cx="{x:.3f}" cy="{yb:.3f}" r="{rb:.3f}"/>'
            f'<circle fill="{warna}" cx="{x:.3f}" cy="{ya:.3f}" r="{ra:.3f}"/></g>')


# ── bagian-bagian
lR = list(list(L['Layer_13'])[0])           # lengan jauh: [lengan atas (grup ber-transform), lengan bawah, tangan]
lL = list(L['Layer_2'])[0]                  # lengan bawah + tangan dekat (grup ber-transform)
lLa = list(lL)
bag = {}
rot_lb = [-arah(*LB[0]), -arah(*LB[1])]
for i, sisi in ((0, 'L'), (1, 'R')):
    bag[f'lenganAtas{sisi}'] = selubung(bahu[i][0], bahu[i][1], R_BAHU, siku[i][1], R_SIKU)
    bag[f'lenganBawah{sisi}'] = selubung(siku[i][0], siku[i][1], R_SIKU, perg[i][1], R_PERG)
bag['tanganR'] = pasang(s(lR[2]), TG[1], rot_lb[1], perg[1])           # tangan ikut sudut lengan bawah (relatif seperti di file)
k_tg = R_PERG / R_TANGAN_DEKAT
bag['tanganL'] = (f'<g transform="translate({perg[0][0]:.3f} {perg[0][1]:.3f}) scale({k_tg:.5f}) translate({-perg[0][0]:.3f} {-perg[0][1]:.3f})">'
                  + pasang(bungkus(lL, lLa[1]), TG[0], rot_lb[0], perg[0]) + '</g>')
for i, (lap_paha, lap_betis, lap_kaki, sisi) in enumerate((('Layer_8', 'Layer_6', 'Layer_9', 'L'), ('Layer_7', 'Layer_5', 'Layer_10', 'R'))):
    bag[f'paha{sisi}'] = pasang(s(L[lap_paha]), PH[i][0], -arah(*PH[i]), pinggul[i])
    bag[f'betis{sisi}'] = selubung(lutut[i][0], lutut[i][1], R_LUTUT, pkaki[i][1], R_PKAKI)
    a, b = ALAS[i]
    rk = -math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))           # alas datar
    anak = list(list(L[lap_kaki])[0])
    bag[f'pergelangan{sisi}'] = pasang(s(anak[0]), KK[i], rk, pkaki[i])
    bag[f'telapak{sisi}'] = pasang(s(anak[1]), KK[i], rk, pkaki[i])
    bag[f'alas{sisi}'] = pasang(s(anak[2]), KK[i], rk, pkaki[i])
    bag[f'kaki{sisi}'] = pasang(s(L[lap_kaki]), KK[i], rk, pkaki[i])
    bag[f'_alas{sisi}'] = [peta(q, KK[i], rk, pkaki[i]) for q in ALAS[i]]
bag['kepala'] = s(L['Layer_14'])
bag['badan'] = s(L['Layer_12'])
bag['panggul'] = s(L['Layer_11'])
bag['tunik'] = s(L['Layer_4'])
TANAH = max(q[1] for i in 'LR' for q in bag[f'_alas{i}'])

# ── urutan lapis file Simon (bawah → atas)
URUT = [('kepala', 'kepala'), ('lengan-jauh-atas', 'lenganAtasR'), ('lengan-jauh-bawah', 'lenganBawahR'), ('tangan-jauh', 'tanganR'),
        ('badan', 'badan'), ('panggul', 'panggul'), ('telapak-jauh', 'kakiR'), ('telapak-dekat', 'kakiL'), ('paha-dekat', 'pahaL'),
        ('paha-jauh', 'pahaR'), ('betis-dekat', 'betisL'), ('betis-jauh', 'betisR'), ('tunik', 'tunik'), ('lengan-dekat-atas', 'lenganAtasL'),
        ('lengan-dekat-bawah', 'lenganBawahL'), ('tangan-dekat', 'tanganL')]


# ── GUIDE DETAIL (Simon 26 Okt malam: "agar hasilnya lebih akurat dan bisa lebih detail lagi untuk char ini maupun char lainnya, mungkin kamu
# bisa menambahkan garis bantu (guide)/gridnya"). Batas bagian diukur dari bentuk sebenarnya (sampel garis tepi, Chrome) pada gua-tegak.svg.
UKUR = dict(puncak=17.6, mata=53.4, dagu=78.9, leherAtas=86.9, pinggang=210.7, ujungJari=279.8, ujungTunik=299.8,
            tepiBadan=(125.4, 230.8), pusatKepala=184.2)
GARIS_Y = [('puncak kepala', UKUR['puncak']), ('mata', UKUR['mata']), ('dagu', UKUR['dagu']), ('pangkal leher', UKUR['leherAtas']),
           ('bahu', Y_BAHU), ('siku', siku[0][1]), ('pinggang', UKUR['pinggang']), ('pergelangan tangan', perg[0][1]),
           ('pinggul', Y_PINGGUL), ('ujung jari', UKUR['ujungJari']), ('ujung tunik', UKUR['ujungTunik']), ('lutut', lutut[0][1]),
           ('pergelangan kaki', pkaki[0][1])]
GARIS_X = [('tepi badan', UKUR['tepiBadan'][0]), ('bahu dekat', X_BAHU[0]), ('tumit', None), ('pinggul dekat', X_PINGGUL[0]),
           ('sumbu leher', LEHER[0]), ('pusat kepala', UKUR['pusatKepala']), ('pinggul jauh', X_PINGGUL[1]), ('bahu jauh', X_BAHU[1]),
           ('tepi badan', UKUR['tepiBadan'][1]), ('ujung kaki', None)]


def guide():
    c, c2 = '#00AEEF', '#9ADDF5'
    g = ['<g id="grid" fill="none">']
    for v in range(0, 361, 10):
        g.append(f'<line x1="{v}" x2="{v}" y1="0" y2="640" stroke="{c2 if v % 50 else c}" stroke-width="{0.15 if v % 50 else 0.3}" opacity="{0.5 if v % 50 else 0.6}"/>')
    for v in range(0, 641, 10):
        g.append(f'<line x1="0" x2="360" y1="{v}" y2="{v}" stroke="{c2 if v % 50 else c}" stroke-width="{0.15 if v % 50 else 0.3}" opacity="{0.5 if v % 50 else 0.6}"/>')
    for v in range(0, 361, 50):
        g.append(f'<text x="{v + 1}" y="6" font-family="Arial" font-size="4" fill="{c}">{v}</text>')
    for v in range(50, 641, 50):
        g.append(f'<text x="1" y="{v - 1}" font-family="Arial" font-size="4" fill="{c}">{v}</text>')
    g.append('</g><g id="guide" fill="none" stroke="#00AEEF" stroke-width="0.5">')
    for nama, y in GARIS_Y + [('tanah', TANAH)]:
        g.append(f'<line x1="20" x2="340" y1="{y:.2f}" y2="{y:.2f}" stroke-dasharray="4 3"/>')
        g.append(f'<text x="338" y="{y - 1.5:.2f}" font-family="Arial" font-size="5.5" fill="{c}" stroke="none" text-anchor="end">{nama} {y:.1f}</text>')
    for nama, x in GARIS_X:
        if x is None:
            continue
        merah = nama in ('sumbu leher',)
        g.append(f'<line x1="{x:.2f}" x2="{x:.2f}" y1="10" y2="{TANAH + 10:.2f}" stroke="{"#E5475D" if merah else c}" stroke-dasharray="{"" if merah else "2 3"}" stroke-width="0.4"/>')
    # tumit & ujung kaki
    for q in (bag['_alasL'][0], bag['_alasR'][1]):
        g.append(f'<line x1="{q[0]:.2f}" x2="{q[0]:.2f}" y1="{TANAH - 30:.2f}" y2="{TANAH + 10:.2f}" stroke-dasharray="2 2" stroke-width="0.4"/>')
    # lingkaran sendi dengan jari-jari sebenarnya (sama besar di tiap sendi)
    for pts, r in ((bahu, R_BAHU), (siku, R_SIKU), (perg, R_PERG), (pinggul, R_PINGGUL), (lutut, R_LUTUT), (pkaki, R_PKAKI)):
        for p in pts:
            g.append(f'<circle cx="{p[0]:.2f}" cy="{p[1]:.2f}" r="{r:.2f}" stroke-dasharray="1.5 1.5" stroke-width="0.4"/>'
                     f'<line x1="{p[0] - 4:.2f}" x2="{p[0] + 4:.2f}" y1="{p[1]:.2f}" y2="{p[1]:.2f}"/><line x1="{p[0]:.2f}" x2="{p[0]:.2f}" y1="{p[1] - 4:.2f}" y2="{p[1] + 4:.2f}"/>')
    # penggaris proporsi: satuan tinggi kepala (puncak → dagu)
    hk = UKUR['dagu'] - UKUR['puncak']
    n = (TANAH - UKUR['puncak']) / hk
    g.append(f'<line x1="30" x2="30" y1="{UKUR["puncak"]:.2f}" y2="{TANAH:.2f}" stroke-width="0.6"/>')
    for k in range(int(n) + 1):
        y = UKUR['puncak'] + k * hk
        g.append(f'<line x1="26" x2="34" y1="{y:.2f}" y2="{y:.2f}" stroke-width="0.6"/><text x="36" y="{y + 2:.2f}" font-family="Arial" font-size="5" fill="{c}" stroke="none">{k}</text>')
    g.append(f'<text x="22" y="{TANAH + 9:.2f}" font-family="Arial" font-size="5" fill="{c}" stroke="none">tinggi {n:.2f} kepala</text>')
    g.append('</g>')
    return ''.join(g)


def svg(dengan_guide):
    isi = ''.join(f'<g id="{nama}">{bag[k]}</g>' for nama, k in URUT)
    return ('<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640">'
            + isi + (guide() if dengan_guide else '') + '</svg>\n')


open('../04_Asset/karakter-flat/tokoh-gua_tegak.svg', 'w').write(svg(True))
open('public/flat/gua-tegak.svg', 'w').write(svg(False))


def token(m, tunik=False):
    m = m.replace('#FFAC9C', '#000004').replace('#F8AB9C', '#000010').replace('#EC9785', '#00000D')
    return m.replace('#F8B62A', '#00000E').replace('#4C3B2D', '#00000F') if tunik else m


P2 = lambda p: f'[{p[0]:.3f}, {p[1]:.3f}]'
with open('src/flat/guaTegak.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/bangun-tegak.py dari public/flat/gua-simon2.svg ("tokoh gua.svg" Simon) — tokoh BERDIRI TEGAK di atas guide.\n'
             ' * Jangan diedit tangan. Token: #000004 kulit · #000010 kulit kedua · #00000D alas kaki · #00000E tunik · #00000F totol.\n'
             ' * Indeks sendi [0] = dekat (kiri layar), [1] = jauh. */\n')
    fh.write('export const TEGAK = {\n')
    for k, v in bag.items():
        if not k.startswith('_'):
            fh.write(f'  {k}: `{token(v, k == "tunik") if k != "kepala" else v}`,\n')
    fh.write('} as const;\n')
    fh.write('export const SENDI_TEGAK = {\n')
    for nama, arr in (('bahu', bahu), ('siku', siku), ('perg', perg), ('pinggul', pinggul), ('lutut', lutut), ('pkaki', pkaki)):
        fh.write(f'  {nama}: [{P2(arr[0])}, {P2(arr[1])}] as [[number, number], [number, number]],\n')
    fh.write(f'  alas: [[{P2(bag["_alasL"][0])}, {P2(bag["_alasL"][1])}], [{P2(bag["_alasR"][0])}, {P2(bag["_alasR"][1])}]] as [[number, number], [number, number]][],\n')
    fh.write(f'  leher: {P2(LEHER)} as [number, number], tanah: {TANAH:.3f},\n')
    fh.write('};\n')
    fh.write('/** guide detail: garis mendatar & tegak (satuan file), jari-jari lingkaran sendi, tinggi kepala (puncak → dagu) */\n')
    fh.write('export const GUIDE_TEGAK = {\n')
    fh.write('  y: [' + ', '.join(f"['{n}', {v:.2f}]" for n, v in GARIS_Y) + f", ['tanah', {TANAH:.2f}]] as [string, number][],\n")
    gx = [(n, v) for n, v in GARIS_X if v is not None] + [('tumit', bag['_alasL'][0][0]), ('ujung kaki', bag['_alasR'][1][0])]
    fh.write('  x: [' + ', '.join(f"['{n}', {v:.2f}]" for n, v in gx) + '] as [string, number][],\n')
    fh.write(f'  r: {{ bahu: {R_BAHU}, siku: {R_SIKU}, perg: {R_PERG}, pinggul: {R_PINGGUL}, lutut: {R_LUTUT}, pkaki: {R_PKAKI} }},\n')
    fh.write(f"  kepala: {UKUR['dagu'] - UKUR['puncak']:.2f}, puncak: {UKUR['puncak']},\n")
    fh.write('};\n')

print('bahu', [f'{p[0]:.1f},{p[1]:.1f}' for p in bahu], 'siku', [f'{p[1]:.2f}' for p in siku], 'perg', [f'{p[1]:.2f}' for p in perg])
print('pinggul', Y_PINGGUL, 'lutut', [f'{p[1]:.2f}' for p in lutut], 'pkaki', [f'{p[1]:.2f}' for p in pkaki], 'tanah', round(TANAH, 2),
      'alas', [[f'{q[0]:.1f},{q[1]:.1f}' for q in bag[f'_alas{i}']] for i in 'LR'])
print('jari-jari sendi: bahu', R_BAHU, 'siku', R_SIKU, 'pergelangan tangan', R_PERG, 'lutut', R_LUTUT, 'pergelangan kaki', R_PKAKI, '· tangan dekat ×', round(R_PERG / R_TANGAN_DEKAT, 4))
print('panjang: LA dekat (file)', round(jarak(*LA[0]), 2), 'jauh', round(P_LA, 2), '· LB', [round(x, 2) for x in P_LB],
      '· paha', [round(jarak(*PH[i]), 2) for i in (0, 1)], '· betis', [round(jarak(*BT[i]), 2) for i in (0, 1)])
print('sepusat di file (lingkaran bawah ruas vs atas ruas berikut):', 'lutut', [round(jarak(PH[i][1], BT[i][0]), 2) for i in (0, 1)],
      'pergelangan kaki', [round(jarak(BT[i][1], KK[i]), 2) for i in (0, 1)], 'siku', [round(jarak(LA[i][1], LB[i][0]), 2) for i in (0, 1)],
      'pergelangan tangan', [round(jarak(LB[i][1], TG[i]), 2) for i in (0, 1)], 'bahu', [round(jarak(BAHU_BADAN[i], LA[i][0]), 2) for i in (0, 1)])
