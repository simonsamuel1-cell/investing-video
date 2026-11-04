#!/usr/bin/env python3
"""
SAMBUNG VO — Scene 1 diganti rekaman baru (01_VO/Scene 1.mp3, Simon 6 Okt), Scene 2 dst. tetap VO lama.

Celah sunyi antara kata terakhir Scene 1 dan kata pertama Scene 2 di VO lama (G) dipertahankan: potong VO lama
di tengah celah itu, potong rekaman baru G/2 sesudah ujung suaranya. Ujung suara = segmen bersuara terakhir dari
amplop energi (ambang sama dengan align-forced.py), bukan durasi berkas (MiniMax menambah ekor sunyi).

Masuk : public/vo/inv02_vo.wav (VO lama 48k mono) · sync/vo-words.json (alignment VO lama) · sync/_s1baru48k.wav
Keluar: public/vo/<KELUAR> · ../01_VO/VO_Investment-Instruments_S1-baru.wav (salinan untuk Premiere)
        sync/splice.json (titik potong + geseran Δ untuk kata hilir)
"""
import json, pathlib, shutil, wave
import numpy as np
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
# nama berkas BARU tiap kali Scene 1 diganti — Studio menyimpan audio lama di cache bila namanya sama
# v2 = Scene 1.mp3 16:08 (41,95 dtk) · v3 = Scene 1.mp3 16:24 (47,21 dtk)
KELUAR = "inv02_vo_v3.wav"

def baca(p):
    with wave.open(str(p)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").copy()

def tulis(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x.astype("<i2").tobytes())

def bersuara(x):
    """segmen bersuara (detik) — resep align-forced.py, dihitung di 48k dengan hop 10 ms"""
    hop = SR // 100
    f = x[: len(x) // hop * hop].astype(np.float32).reshape(-1, hop) / 32768
    sm = np.convolve(np.sqrt((f ** 2).mean(1)), np.ones(5) / 5, mode="same")
    peak = float(np.percentile(sm, 99)); hi, lo = 0.035 * peak, 0.012 * peak
    on, seg, st = False, [], 0
    for i, v in enumerate(sm):
        if not on and v > hi:
            j = i
            while j > 0 and sm[j - 1] > lo: j -= 1
            on, st = True, j
        elif on and v < lo:
            on = False; seg.append([st, i])
    if on: seg.append([st, len(sm)])
    return [[a / 100, b / 100] for a, b in seg if b - a >= 8]

lama = baca(ROOT / "public/vo/inv02_vo.wav")
baru = baca(ROOT / "sync/_s1baru48k.wav")
W = json.loads((ROOT / "sync/vo-words.v1.json").read_text())  # alignment VO LAMA (batas S1→S2 diukur di VO lama)
V = W["energi"]["voiced"]
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
md = (ROOT.parent / "04_Asset/VO-Script-Investment-Instruments.md").read_text(encoding="utf-8")
n_s1 = len(md.split("## SCENE 01")[1].split("## SCENE 02")[0].replace("---", " ").split())
assert toks[n_s1 - 1] == "investasi." and toks[n_s1] == "Kita", (toks[n_s1 - 1], toks[n_s1])
akhir1 = next(w for w in W["words"] if w["tid"] == n_s1 - 1)["b"]
awal2 = next(w for w in W["words"] if w["tid"] == n_s1)["a"]
e1 = max(b for a, b in V if a <= akhir1 + 0.05)          # ujung segmen bersuara kata terakhir S1
s2 = min(a for a, b in V if b >= awal2 - 0.05)            # awal segmen bersuara kata pertama S2
G = s2 - e1
assert 0.1 < G < 3, G
cut_lama = e1 + G / 2
Vb = bersuara(baru)
e1b = Vb[-1][1]
cut_baru = e1b + G / 2
assert cut_baru <= len(baru) / SR + 1e-3, "ekor rekaman baru lebih pendek dari G/2"
gab = np.concatenate([baru[: round(cut_baru * SR)], lama[round(cut_lama * SR):]])
tulis(ROOT / f"public/vo/{KELUAR}", gab)
shutil.copyfile(ROOT / f"public/vo/{KELUAR}", ROOT.parent / "01_VO/VO_Investment-Instruments_S1-baru.wav")
d = cut_baru - cut_lama
info = {"n_s1_token": n_s1, "celah_G": round(G, 3), "potong_lama": round(cut_lama, 3), "potong_baru": round(cut_baru, 3),
        "delta_s": round(d, 3), "delta_frame60": round(d * 60, 2), "durasi_lama": round(len(lama) / SR, 3), "durasi_baru": round(len(gab) / SR, 3),
        "ujung_suara_s1_lama": e1, "ujung_suara_s1_baru": e1b, "awal_suara_s1_baru": Vb[0][0]}
(ROOT / "sync/splice.json").write_text(json.dumps(info, indent=1))
print(json.dumps(info, indent=1))
