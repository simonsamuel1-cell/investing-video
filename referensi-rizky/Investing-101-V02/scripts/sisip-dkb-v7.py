#!/usr/bin/env python3
"""
VO v7 (16 Okt malam) — Simon mengirim `01_VO/MiniMax_2026-10-16_17_33_19_Compelling_Storyteller.mp3` = "Ada yang menghasilkan dividen, kupon,
atau bunga" (naskah revisi S09) → menggantikan "Ada yang menghasilkan cash flow," di VO v6.

Batas (selubung energi 10 ms, terukur):
  · v6 : "Ada" mulai 313,85 dtk (sebelumnya sunyi −68 dB) · "flow," habis 315,47 dtk (−57 dB), "ada yang mengandalkan" 315,745 dtk
  · klip (44,1 kHz → 48 kHz afconvert): bicara 0,14–3,72 dtk, sunyi/latar −59…−100 dB di kedua ujung
Sambungan: v6[… 313,80] + klip[0,10 … c1] + v6[315,52 …] — jeda sebelum kalimat (dari "jelas.") & sesudahnya (ke "ada yang mengandalkan")
SAMA dengan aslinya; c1 ±3,77 dtk dipilih supaya selisih panjang = TEPAT 117 frame (semua yang sesudahnya bergeser bulat +117 f).
Silang-pudar 5 ms di kedua sambungan (keduanya di sunyi). Gain klip +1,7 dB → RMS bicara aktif ±−20 dB = kalimat tetangga (−20,7 / −20,1 dB).
Waktu kata baru = MMS_FA pada klip (sync/_dkb-words.json, dibuat oleh .venv-align) dipetakan ke v7.
Masuk : public/vo/inv02_vo_v6.wav · klip 48 kHz · sync/vo-words.json (v6) · sync/_dkb-words.json
Keluar: public/vo/inv02_vo_v7.wav · ../01_VO/VO_Investment-Instruments_revisi-16okt-v7.wav · sync/vo-words.json (v7) + sync/vo-words-v7.json ·
        sync/sisip-v7.json · naskah/baris/md diganti
"""
import json, pathlib, shutil, sys, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
KLIP = pathlib.Path(sys.argv[1])  # klip 48 kHz mono 16-bit
T1, T2, C0 = 313.80, 315.52, 0.10
N_FRAME = 117
GAIN_DB = 1.7
LAMA, BARU = "Ada yang menghasilkan cash flow,", "Ada yang menghasilkan dividen, kupon, atau bunga,"
TID_LAMA = range(670, 675)

def baca(p):
    w = wave.open(str(p)); assert (w.getnchannels(), w.getsampwidth()) == (1, 2); sr = w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64), sr
v, sr = baca(ROOT / "public/vo/inv02_vo_v6.wav")
k, sr2 = baca(KLIP); assert sr == sr2 == 48000
s1, s2, k0 = round(T1 * sr), round(T2 * sr), round(C0 * sr)
fade = int(0.005 * sr); r = np.linspace(0, 1, fade, endpoint=False) + 0.5 / fade
# panjang klip terpakai → selisih tepat 117 frame; + 2 × fade karena tiap sambungan menumpuk 5 ms (silang-pudar)
k1 = k0 + (s2 - s1) + N_FRAME * sr // 60 + 2 * fade
assert k1 <= len(k), (k1, len(k))
g = 10 ** (GAIN_DB / 20)
klip = k[k0:k1] * g
a = v[:s1].copy(); b = v[s2:].copy()
klip[:fade] = a[-fade:] * (1 - r) + klip[:fade] * r; a = a[:-fade]
klip[-fade:] = klip[-fade:] * (1 - r) + b[:fade] * r; b = b[fade:]
y = np.concatenate([a, klip, b])
assert len(y) - len(v) == N_FRAME * sr // 60
assert np.abs(y).max() < 32767, np.abs(y).max()
out = ROOT / "public/vo/inv02_vo_v7.wav"
with wave.open(str(out), "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.round(y).astype(np.int16).tobytes())
shutil.copy(out, ROOT.parent / "01_VO/VO_Investment-Instruments_revisi-16okt-v7.wav")
d = N_FRAME / 60
print(f"v6[…{T1}] + klip[{C0}…{k1 / sr:.4f}] (+{GAIN_DB} dB) + v6[{T2}…] · +{N_FRAME} f · puncak {20 * np.log10(np.abs(y).max() / 32768):.2f} dBFS · {len(y) / sr:.3f} dtk")

# ── teks ──
p = ROOT / "sync/NASKAH.txt"; tok = p.read_text(encoding="utf-8").split()
assert " ".join(tok[TID_LAMA.start:TID_LAMA.stop]) == LAMA, tok[TID_LAMA.start:TID_LAMA.stop]
baru_tok = BARU.split(); tambah = len(baru_tok) - len(TID_LAMA)
p.write_text(" ".join(tok[:TID_LAMA.start] + baru_tok + tok[TID_LAMA.stop:]) + "\n", encoding="utf-8")
for p in (ROOT / "sync/SUBTITLE-BARIS.txt", ROOT.parent / "04_Asset/VO-Script-Investment-Instruments-Revisi-Lengkap.md"):
    t = p.read_text(encoding="utf-8"); assert t.count(LAMA) == 1, p; p.write_text(t.replace(LAMA, BARU), encoding="utf-8")

# ── waktu kata ──
W = json.loads((ROOT / "sync/vo-words.json").read_text())
KW = json.loads((ROOT / "sync/_dkb-words.json").read_text())  # [{w, a, b, score}] waktu di klip
assert [x["w"] for x in KW] == [t.strip(",").lower() for t in baru_tok], [x["w"] for x in KW]
peta = lambda t: round((s1 - fade) / sr + (t - C0), 3)  # waktu klip → waktu v7 (klip[C0] jatuh 5 ms sebelum T1: awal silang-pudar)
kata = []
for w in W["words"]:
    if w["tid"] < TID_LAMA.start: kata.append(w)
    elif w["tid"] == TID_LAMA.start:
        for i, (x, t) in enumerate(zip(KW, baru_tok)):
            kata.append({"w": t, "tid": TID_LAMA.start + i, "a": peta(x["a"]), "b": peta(x["b"]), "score": x["score"]})
    elif w["tid"] >= TID_LAMA.stop:
        w = {**w, "tid": w["tid"] + tambah, "a": round(w["a"] + d, 3), "b": round(w["b"] + d, 3)}
        if "f60" in w: w["f60"] += N_FRAME
        kata.append(w)
seg = [s for s in W["energi"]["voiced"] if s[1] <= T1] + [[peta(0.14), peta(3.72)]] + \
      [[round(a + d, 3), round(b + d, 3)] for a, b in W["energi"]["voiced"] if a >= T2]
W2 = {**W, "words": kata, "energi": {**W["energi"], "voiced": seg},
      "meta": {**W["meta"], "audio": "inv02_vo_v7.wav", "durasi_s": round(len(y) / sr, 3), "token": len(kata), "kata": len(kata),
               "v7": f"v6 + '{BARU}' menggantikan '{LAMA}' (sisip-dkb-v7.py, +{N_FRAME} f)"}}
for nama in ("sync/vo-words.json", "sync/vo-words-v7.json"):
    (ROOT / nama).write_text(json.dumps(W2, ensure_ascii=False, indent=1), encoding="utf-8")
(ROOT / "sync/sisip-v7.json").write_text(json.dumps({"v6_potong": [T1, T2], "klip": [C0, k1 / sr], "gain_db": GAIN_DB, "frame": N_FRAME,
                                                       "lama": LAMA, "baru": BARU, "klip_berkas": KLIP.name}, ensure_ascii=False, indent=1))
print(f"{len(kata)} kata · token +{tambah}")
