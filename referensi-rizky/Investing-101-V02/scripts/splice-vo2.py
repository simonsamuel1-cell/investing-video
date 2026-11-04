#!/usr/bin/env python3
"""
SAMBUNG VO v4 — Scene 2–5 diganti rekaman baru (01_VO/Scene 2.mp3 … Scene 5.mp3, Simon 7 Okt 10:54–10:58).
Scene 1 (v3) & Scene 6 dst. (VO lama) TIDAK disentuh.

Celah sunyi antar-scene di v3 (G, diukur dari amplop energi = resep align-forced.py) DIPERTAHANKAN: S1→S2 (dasar arahan Simon
"mulai scene 2 di 00:00.49"), S2→S3, S3→S4, S4→S5, S5→S6. Tiap rekaman baru dipotong G/2 sebelum awal suaranya dan G/2 sesudah
ujung suaranya (diisi nol bila ekor berkas lebih pendek). Level tiap scene baru disamakan dengan median level bagian v3 yang
digantikannya (selisih ≤ 1,5 dB) supaya sambungan tidak terdengar turun/naik volume.

Masuk : public/vo/inv02_vo_v3.wav · sync/vo-words.json (alignment v3) · sync/_s{2..5}baru48k.wav (afconvert dari mp3)
Keluar: public/vo/<KELUAR> · ../01_VO/VO_Investment-Instruments_S1-S5-baru.wav (untuk Premiere) · sync/splice2.json
"""
import json, pathlib, re, shutil, wave
import numpy as np
ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
KELUAR = "inv02_vo_v4.wav"  # nama baru tiap ganti: Studio menyimpan audio lama di cache bila namanya sama

def baca(p):
    with wave.open(str(p)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64)

def tulis(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(np.round(x), -32768, 32767).astype("<i2").tobytes())

def bersuara(x):
    hop = SR // 100
    f = x[: len(x) // hop * hop].reshape(-1, hop) / 32768
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

def batasi(y, thr_db=-1.0):
    """pembatas puncak lembut: hanya puncak sesaat di atas thr_db dBFS diredam (jendela 2 ms, dihaluskan) — jumlah sampel dilaporkan"""
    thr = 10 ** (thr_db / 20) * 32768
    a = np.abs(y); need = np.minimum(1.0, thr / np.maximum(a, 1e-9))
    if need.min() >= 1: return y, 0
    w = 96
    from numpy.lib.stride_tricks import sliding_window_view as swv
    g = swv(np.pad(need, (w, w), constant_values=1), 2 * w + 1).min(axis=1)
    g = np.convolve(g, np.ones(w) / w, mode="same")
    return y * np.minimum(g, need), int((need < 1).sum())

def level(x):
    hop = 480; f = x[: len(x) // hop * hop].reshape(-1, hop) / 32768; r = np.sqrt((f ** 2).mean(1)); r = r[r > np.percentile(r, 40)]
    return 20 * np.log10(np.median(r) + 1e-12)

v3 = baca(ROOT / "public/vo/inv02_vo_v3.wav")
W = json.loads((ROOT / "sync/vo-words.json").read_text()); V = W["energi"]["voiced"]
byt = {w["tid"]: w for w in W["words"]}
md = (ROOT.parent / "04_Asset/VO-Script-Investment-Instruments.md").read_text(encoding="utf-8")
parts = re.split(r"## SCENE (\d\d)[^\n]*\n", md)
n = [len(parts[i + 1].replace("---", " ").split()) for i in range(1, len(parts), 2)]
st = np.cumsum([0] + n)
def kata_awal(k): return byt[min(t for t in byt if t >= st[k - 1])]["a"]
def kata_akhir(k): return byt[max(t for t in byt if t <= st[k] - 1)]["b"]
def ujung(k): return max(b for a, b in V if a <= kata_akhir(k) + 0.05)   # ujung segmen bersuara kata terakhir scene k
def mulai(k): return min(a for a, b in V if b >= kata_awal(k) - 0.05)    # awal segmen bersuara kata pertama scene k
G = {k: mulai(k + 1) - ujung(k) for k in range(1, 6)}                     # celah k→k+1 di v3
assert all(0.1 < g < 3 for g in G.values()), G
potong_a = ujung(1) + G[1] / 2           # v3 dipakai sampai sini (Scene 1 utuh + G/2)
potong_b = mulai(6) - G[5] / 2           # v3 dipakai lagi mulai sini (Scene 6 dst.)
out = [v3[: round(potong_a * SR)]]
info = {"G_v3": {f"S{k}->S{k+1}": round(G[k], 3) for k in G}, "potong_a": round(potong_a, 3), "potong_b": round(potong_b, 3), "scene": {}}
for k in [2, 3, 4, 5]:
    x = baca(ROOT / f"sync/_s{k}baru48k.wav")
    vb = bersuara(x); va, ve = vb[0][0], vb[-1][1]
    lv_lama = level(v3[round(mulai(k) * SR): round(ujung(k) * SR)]); lv_baru = level(x[round(va * SR): round(ve * SR)])
    gain = 10 ** ((lv_lama - lv_baru) / 20)
    a = va - G[k - 1] / 2; b = ve + G[k] / 2
    pre = np.zeros(max(0, round(-a * SR))); post = np.zeros(max(0, round((b - len(x) / SR) * SR)))
    piece, nbatas = batasi(np.concatenate([pre, x[max(0, round(a * SR)): min(len(x), round(b * SR))], post]) * gain)
    t0 = sum(len(p) for p in out) / SR
    info["scene"][f"S{k}"] = {"suara_berkas": [va, ve], "gain_dB": round(lv_lama - lv_baru, 2), "sampel_dibatasi": nbatas, "mulai_di_v4": round(t0 + G[k - 1] / 2, 3),
                              "durasi_suara": round(ve - va, 3), "durasi_suara_v3": round(ujung(k) - mulai(k), 3)}
    out.append(piece)
t_b = sum(len(p) for p in out) / SR
out.append(v3[round(potong_b * SR):])
gab = np.concatenate(out)
assert np.abs(gab).max() < 32767, "terpotong (clip)"
tulis(ROOT / f"public/vo/{KELUAR}", gab)
shutil.copyfile(ROOT / f"public/vo/{KELUAR}", ROOT.parent / "01_VO/VO_Investment-Instruments_S1-S5-baru.wav")
info.update({"delta_hilir_s": round(t_b - potong_b, 3), "delta_hilir_frame60": round((t_b - potong_b) * 60, 2),
             "durasi_v3": round(len(v3) / SR, 3), "durasi_v4": round(len(gab) / SR, 3), "keluar": KELUAR})
(ROOT / "sync/splice2.json").write_text(json.dumps(info, indent=1))
print(json.dumps(info, indent=1))
