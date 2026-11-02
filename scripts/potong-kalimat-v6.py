#!/usr/bin/env python3
"""
VO v6 (16 Okt malam) — Simon: "ada perubahan script di scene 9 … seberapa sulit investasinya, (removed) … jadi hapus kesulitan di visual dan
di voicenya". Kalimat "seberapa sulit investasinya," dipotong dari VO v5 TANPA rekam ulang.

Titik potong (selubung energi 5 ms, terukur):
  · AWAL  322,940 dtk — di tengah jeda titik dua sesudah "melihat:" (−62,5 dB; jeda 322,55–322,94 dtk)
  · AKHIR 324,5233 dtk — lembah terendah (−55,5 dB) di antara ekor "investasinya," dan desis "s" dari "seberapa besar"
  · panjang = TEPAT 95 frame (1,58333 dtk = 76.000 sampel @48 kHz) → semua yang sesudahnya bergeser BULAT −95 frame (video tetap sinkron
    per frame). Jeda yang tersisa sebelum "seberapa besar" ±0,41 dtk = jeda titik dua aslinya.
  · sambungan = silang-pudar 5 ms (keduanya di sunyi/lembah → tanpa klik)
Juga: hapus 3 token dari sync/NASKAH.txt, baris dari sync/SUBTITLE-BARIS.txt & naskah md; waktu kata sync/vo-words.json (tid ≥ 695 → tid − 3,
a/b − 95/60 dtk, f60 − 95; segmen bersuara digeser/dipotong).
Masuk : public/vo/inv02_vo_v5.wav · sync/vo-words.json (v5 gabungan)
Keluar: public/vo/inv02_vo_v6.wav · ../01_VO/VO_Investment-Instruments_revisi-16okt-v6.wav · sync/vo-words.json (v6) + sync/vo-words-v6.json ·
        sync/potong-v6.json
"""
import json, pathlib, shutil, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
T_AKHIR = 324.5233
N_FRAME = 95
SR_HARAP = 48000
TID = (692, 693, 694)  # "seberapa sulit investasinya,"
KALIMAT = "seberapa sulit investasinya,"

w = wave.open(str(ROOT / "public/vo/inv02_vo_v5.wav")); sr, ch, sw, n = w.getframerate(), w.getnchannels(), w.getsampwidth(), w.getnframes()
assert (sr, ch, sw) == (SR_HARAP, 1, 2), (sr, ch, sw)
x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64)
L = N_FRAME * sr // 60  # 76.000 sampel, bulat
sb = round(T_AKHIR * sr); sa = sb - L
t_awal = sa / sr
fade = int(0.005 * sr)
r = np.linspace(0, 1, fade, endpoint=False) + 0.5 / fade
silang = x[sa - fade:sa] * (1 - r) + x[sb - fade:sb] * r
y = np.concatenate([x[:sa - fade], silang, x[sb:]])
assert len(y) == n - L
db = lambda s: 20 * np.log10(max(np.sqrt((s ** 2).mean()) / 32768, 1e-9))
print(f"potong {t_awal:.4f}–{T_AKHIR:.4f} dtk ({L} sampel = {N_FRAME} frame) · RMS ±10 ms: awal {db(x[sa - 480:sa + 480]):.1f} dB, akhir {db(x[sb - 480:sb + 480]):.1f} dB")
out = ROOT / "public/vo/inv02_vo_v6.wav"
with wave.open(str(out), "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.clip(np.round(y), -32768, 32767).astype(np.int16).tobytes())
shutil.copy(out, ROOT.parent / "01_VO/VO_Investment-Instruments_revisi-16okt-v6.wav")

# ── teks: naskah token, baris subtitle, naskah md ──
p = ROOT / "sync/NASKAH.txt"; tok = p.read_text(encoding="utf-8").split()
assert " ".join(tok[TID[0]:TID[-1] + 1]) == KALIMAT, tok[TID[0]:TID[-1] + 1]
p.write_text(" ".join(tok[:TID[0]] + tok[TID[-1] + 1:]) + "\n", encoding="utf-8")
for p in (ROOT / "sync/SUBTITLE-BARIS.txt", ROOT.parent / "04_Asset/VO-Script-Investment-Instruments-Revisi-Lengkap.md"):
    baris = p.read_text(encoding="utf-8").split("\n")
    assert sum(b.strip() == KALIMAT for b in baris) == 1, p
    p.write_text("\n".join(b for b in baris if b.strip() != KALIMAT), encoding="utf-8")

# ── waktu kata ──
W = json.loads((ROOT / "sync/vo-words.json").read_text())
d = N_FRAME / 60
kata = []
for k in W["words"]:
    if k["tid"] in TID: continue
    if k["tid"] > TID[-1]:
        k = {**k, "tid": k["tid"] - len(TID), "a": round(k["a"] - d, 3), "b": round(k["b"] - d, 3)}
        if "f60" in k: k["f60"] -= N_FRAME
        assert k["a"] >= T_AKHIR - d - 1e-6, k
    kata.append(k)
seg = []
for a, b in W["energi"]["voiced"]:
    if b <= t_awal: seg.append([a, b])
    elif a >= T_AKHIR: seg.append([round(a - d, 3), round(b - d, 3)])
    else:  # segmen yang menyentuh potongan: bagian sebelum + bagian sesudah (digeser)
        if a < t_awal: seg.append([a, round(t_awal, 3)])
        if b > T_AKHIR: seg.append([round(t_awal, 3), round(b - d, 3)])
W2 = {**W, "words": kata, "energi": {**W["energi"], "voiced": seg},
      "meta": {**W["meta"], "audio": "inv02_vo_v6.wav", "durasi_s": round(len(y) / sr, 3), "token": len(kata), "kata": len(kata),
               "v6": f"v5 minus '{KALIMAT}' ({t_awal:.4f}–{T_AKHIR} dtk, {N_FRAME} frame) — potong-kalimat-v6.py"}}
for nama in ("sync/vo-words.json", "sync/vo-words-v6.json"):
    (ROOT / nama).write_text(json.dumps(W2, ensure_ascii=False, indent=1), encoding="utf-8")
(ROOT / "sync/potong-v6.json").write_text(json.dumps({"awal_s": t_awal, "akhir_s": T_AKHIR, "frame": N_FRAME, "sampel": L, "tid": TID,
                                                       "kalimat": KALIMAT}, ensure_ascii=False, indent=1))
print(f"VO v6 {len(y) / sr:.3f} dtk · {len(kata)} kata · segmen bersuara {len(seg)}")
