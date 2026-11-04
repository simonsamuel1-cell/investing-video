#!/usr/bin/env python3
"""EKSTRAK RIG GUA v2 (26 Okt sore) — `tokoh gua.svg` perbaikan Simon (salinan public/flat/gua-simon2.svg). Simon: "Aku mau kamu menerapkannya
persis seperti char yang aku kirimkan (dari segi layering, cara menyambung tiap anggota tubuh, dllnya)".
File ini = tokoh TERAKIT (pose melangkah): tiap sendi = lingkaran yang saling menumpuk (pusat lingkaran = titik putar, diukur getBBox Studio).
Urutan lapis file (bawah → atas) dipertahankan apa adanya:
  kepala · lengan kanan-layar (atas, bawah, tangan) · badan · panggul · telapak kanan · telapak kiri · paha kiri · paha kanan · betis kiri ·
  betis kanan · tunik · lengan atas kiri · lengan bawah kiri · tangan kiri
Keluaran src/flat/guaSimon2.gen.ts (markup per bagian; transform grup asli ikut)."""
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


def dalam(layer):
    """isi grup pertama sebuah layer"""
    return list(L[layer])[0]


def bungkus(induk, anak):
    tr = induk.get('transform')
    isi = s(anak)
    return f'<g transform="{tr}">{isi}</g>' if tr else isi


def token(m, jenis=''):
    m = m.replace('#FFAC9C', '#000004').replace('#F8AB9C', '#000010').replace('#EC9785', '#00000D')
    if jenis == 'tunik':
        m = m.replace('#F8B62A', '#00000E').replace('#4C3B2D', '#00000F')
    return m


lR = list(dalam('Layer_13'))           # [lengan atas (grup ber-transform), lengan bawah, tangan]
lL = dalam('Layer_2')                  # grup ber-transform: [lengan bawah, tangan]
lLa = list(lL)
kR, kL = list(dalam('Layer_10')), list(dalam('Layer_9'))  # [pergelangan (kapsul + 2 lingkaran), telapak, alas]
P = {
    'kepala': s(L['Layer_14']),
    'lenganAtasR': token(s(lR[0])), 'lenganBawahR': token(s(lR[1])), 'tanganR': token(s(lR[2])),
    'badan': token(s(L['Layer_12'])),
    'panggul': token(s(L['Layer_11'])),
    'kakiR': token(s(L['Layer_10'])), 'kakiL': token(s(L['Layer_9'])),
    'pergelanganR': token(s(kR[0])), 'telapakR': token(s(kR[1])), 'alasR': token(s(kR[2])),
    'pergelanganL': token(s(kL[0])), 'telapakL': token(s(kL[1])), 'alasL': token(s(kL[2])),
    'pahaL': token(s(L['Layer_8'])), 'pahaR': token(s(L['Layer_7'])),
    'betisL': token(s(L['Layer_6'])), 'betisR': token(s(L['Layer_5'])),
    'tunik': token(s(L['Layer_4']), 'tunik'),
    'lenganAtasL': token(s(L['Layer_3'])),
    'lenganBawahL': token(bungkus(lL, lLa[0])), 'tanganL': token(bungkus(lL, lLa[1])),
}
with open('src/flat/guaSimon2.gen.ts', 'w') as fh:
    fh.write('/* DIBANGKITKAN oleh scripts/ekstrak-gua2.py dari public/flat/gua-simon2.svg ("tokoh gua.svg" Simon 26 Okt sore) — jangan diedit tangan.\n'
             ' * Token: #000004 kulit · #000010 kulit kedua · #00000D alas kaki · #00000E tunik · #00000F totol. */\n')
    fh.write('export const GUA2 = {\n')
    for k, v in P.items():
        fh.write(f'  {k}: `{v}`,\n')
    fh.write('} as const;\n')
print({k: len(v) for k, v in P.items()})
