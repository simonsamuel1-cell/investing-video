#!/usr/bin/env python3
"""
VO v8 (21 Okt) — Simon: "aku lampirkan voice baru untuk scene 8 … yang merah itu dihapus" →
`01_VO/MiniMax_2026-10-21_10_26_35_Compelling_Storyteller.mp3` (49,61 dtk) = SELURUH Scene 08 naskah baru (tambah kalimat dividen;
"potensi return bisa datang dari dua hal: hasil yang dihasilkan bisnis," → "potensi return bisa datang dari dividen yang dibagikan perusahaan").

Batas (selubung energi 10 ms, terukur):
  · v7 : "waktu." (akhir S07) habis 267,07 dtk → sunyi digital 267,08–267,17 → "Kalau" (S08) mulai 267,32 dtk;
         "pasar." (akhir S08) habis 306,99 dtk, ekor −46…−54 dB s.d. 307,20 → sunyi digital 307,21–307,31 → "Kalau" (S09) 307,45 dtk
  · klip (44,1 kHz → 48 kHz afconvert): bicara 0,14–49,42 dtk, sunyi digital mulai 49,56 dtk, berkas habis 49,6065 dtk
Sambungan: v7[… 267,30] + klip[0,10 … habis] (+0,3 dB = RMS bicara S08 lama −21,35 dB) + sunyi digital + v7[307,21 …].
  · jeda sebelum S08 = aslinya ("Kalau" baru jatuh di 267,32 dtk, sama persis); jeda sesudah S08 (ke "Kalau" S09) 0,467 dtk ≈ aslinya 0,46
  · panjang sunyi digital dipilih supaya selisih = TEPAT +577 frame → S09 & S10 bergeser bulat, isinya identik
  · silang-pudar 5 ms di sambungan 1 (−68 dB); sambungan 2 = sunyi digital ↔ sunyi digital
Teks: token S08 (tid 561–657) diganti 106 token naskah baru; baris subtitle & naskah md S08 diganti (baris Simon 21 Okt).
Waktu kata baru = MMS_FA klip (scripts/align-klip.py → sync/_s08baru-words.json).
Keluar: public/vo/inv02_vo_v8.wav · ../01_VO/VO_Investment-Instruments_revisi-21okt-v8.wav · sync/vo-words.json (v8) + vo-words-v8.json · sync/ganti-v8.json
"""
import json, pathlib, shutil, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
T1, T2, C0 = 267.30, 307.21, 0.10  # T1 267,30 (bukan 267,28): "Kalau" baru jatuh di frame 16071 = PERSIS "Kalau" lama → ekor S07 identik piksel
N_FRAME = 577
GAIN_DB = 0.3
TID = range(561, 658)  # token S08 lama
LAMA = """Kalau perusahaan terus berkembang,
pendapatan dan labanya juga bisa ikut tumbuh.
Sebagian laba itu bisa digunakan kembali
untuk memperbesar bisnis,
mengembangkan produk,
atau masuk ke pasar baru.
Inilah yang membuat sebuah bisnis
bisa terus menciptakan nilai dari waktu ke waktu.
Tapi perlu diingat,
pertumbuhan bisnis dan pergerakan harga saham adalah dua hal yang berbeda.
Harga saham tidak harus bergerak sama persis
dengan laba perusahaan setiap hari.
Karena harga juga dipengaruhi oleh
bagaimana pasar menilai perusahaan tersebut.
Jadi bagi investor saham,
potensi return bisa datang dari dua hal:
hasil yang dihasilkan bisnis,
dan perubahan harga saham di pasar."""
BARU = (ROOT / "sync/S08-naskah-21okt.txt").read_text(encoding="utf-8").strip()

def baca(p):
    w = wave.open(str(p)); assert (w.getnchannels(), w.getsampwidth()) == (1, 2); sr = w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64), sr
v, sr = baca(ROOT / "public/vo/inv02_vo_v7.wav")
k, sr2 = baca(ROOT / "sync/_s08baru48k.wav"); assert sr == sr2 == 48000
s1, s2, k0 = round(T1 * sr), round(T2 * sr), round(C0 * sr)
klip = k[k0:] * 10 ** (GAIN_DB / 20)
fade = int(0.005 * sr); r = np.linspace(0, 1, fade, endpoint=False) + 0.5 / fade
a = v[:s1].copy(); b = v[s2:]
klip[:fade] = a[-fade:] * (1 - r) + klip[:fade] * r; a = a[:-fade]
pad = (len(v) + N_FRAME * sr // 60) - (len(a) + len(klip) + len(b))
assert 0 <= pad < 0.1 * sr, pad
y = np.concatenate([a, klip, np.zeros(pad), b])
assert len(y) - len(v) == N_FRAME * sr // 60 and np.abs(y).max() < 32767
out = ROOT / "public/vo/inv02_vo_v8.wav"
with wave.open(str(out), "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.round(y).astype(np.int16).tobytes())
shutil.copy(out, ROOT.parent / "01_VO/VO_Investment-Instruments_revisi-21okt-v8.wav")
d = N_FRAME / 60
t_klip0 = (s1 - fade) / sr  # klip[C0] jatuh di sini
peta = lambda t: round(t_klip0 + (t - C0), 3)
print(f"v7[…{T1}] + klip[{C0}…{len(k) / sr:.4f}] (+{GAIN_DB} dB) + sunyi {pad / sr * 1000:.1f} ms + v7[{T2}…] · +{N_FRAME} f · {len(y) / sr:.3f} dtk")

# ── teks ──
p = ROOT / "sync/NASKAH.txt"; tok = p.read_text(encoding="utf-8").split()
assert " ".join(tok[TID.start:TID.stop]) == " ".join(LAMA.split()), "token S08 lama tidak cocok"
baru_tok = BARU.split(); tambah = len(baru_tok) - len(TID)
p.write_text(" ".join(tok[:TID.start] + baru_tok + tok[TID.stop:]) + "\n", encoding="utf-8")
for p in (ROOT / "sync/SUBTITLE-BARIS.txt", ROOT.parent / "04_Asset/VO-Script-Investment-Instruments-Revisi-Lengkap.md"):
    t = p.read_text(encoding="utf-8"); assert t.count(LAMA) == 1, p; p.write_text(t.replace(LAMA, BARU), encoding="utf-8")

# ── waktu kata ──
W = json.loads((ROOT / "sync/vo-words.json").read_text())
KW = json.loads((ROOT / "sync/_s08baru-words.json").read_text())
assert [x["w"] for x in KW] == baru_tok
kata = []
for w in W["words"]:
    if w["tid"] < TID.start: kata.append(w)
    elif w["tid"] == TID.start:
        kata += [{"w": x["w"], "tid": TID.start + i, "a": peta(x["a"]), "b": peta(x["b"]), "score": x["score"]} for i, x in enumerate(KW)]
    elif w["tid"] >= TID.stop:
        w = {**w, "tid": w["tid"] + tambah, "a": round(w["a"] + d, 3), "b": round(w["b"] + d, 3)}
        if "f60" in w: w["f60"] += N_FRAME
        kata.append(w)
# segmen bersuara klip (energi 20 ms > −40 dB, celah ≥ 0,2 dtk memisah)
win = int(0.02 * sr); e = np.array([np.sqrt((k[i:i + win] ** 2).mean()) / 32768 for i in range(k0, len(k) - win, win)])
on = 20 * np.log10(np.maximum(e, 1e-9)) > -40
seg_k, mulai, sunyi = [], None, 0
for i, x in enumerate(on):
    t = C0 + i * 0.02
    if x:
        if mulai is None: mulai = t
        sunyi = 0; akhir = t + 0.02
    elif mulai is not None:
        sunyi += 1
        if sunyi >= 10: seg_k.append([peta(mulai), peta(akhir)]); mulai = None
if mulai is not None: seg_k.append([peta(mulai), peta(akhir)])
seg = [s for s in W["energi"]["voiced"] if s[1] <= T1] + seg_k + [[round(a_ + d, 3), round(b_ + d, 3)] for a_, b_ in W["energi"]["voiced"] if a_ >= T2]
W2 = {**W, "words": kata, "energi": {**W["energi"], "voiced": seg},
      "meta": {**W["meta"], "audio": "inv02_vo_v8.wav", "durasi_s": round(len(y) / sr, 3), "token": len(kata), "kata": len(kata),
               "v8": f"v7 + S08 rekaman baru 21 Okt (ganti-s08-v8.py, +{N_FRAME} f)"}}
for nama in ("sync/vo-words.json", "sync/vo-words-v8.json"):
    (ROOT / nama).write_text(json.dumps(W2, ensure_ascii=False, indent=1), encoding="utf-8")
(ROOT / "sync/ganti-v8.json").write_text(json.dumps({"v7_potong": [T1, T2], "klip_mulai": C0, "gain_db": GAIN_DB, "frame": N_FRAME,
    "sunyi_ms": pad / sr * 1000, "token_lama": [TID.start, TID.stop - 1], "token_baru": len(baru_tok)}, ensure_ascii=False, indent=1))
print(f"{len(kata)} kata · token {tambah:+d} · segmen klip {len(seg_k)}")
