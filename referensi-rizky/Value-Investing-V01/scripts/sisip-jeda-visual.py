#!/usr/bin/env python3
"""
JEDA VISUAL VI V01 (Simon 30 Okt: "dalam beberapa scene ada voice yang diucapkan terlalu cepat, agar semua visualnya terbaca … tambahkan jeda
voicenya. aku ingin orang yang menonton punya space untuk melihat setiap elemen visual yang ada").
Resep = Investing 101 V05 `sisip-jeda.py` (disetujui 24 Okt): hening disisipkan di 10 ms TERSUNYI di celah antara kata terakhir sebuah cue dan kata
pertama cue berikutnya, lalu waktu kata digeser (+jeda per sisipan yang mendahului) — tanpa forced alignment ulang. Semua visual VI V01 dipicu
kata (`urut()` di tiap scene) → ikut bergeser otomatis lewat words.gen.ts / cues.ts / batas.ts.

KRITERIA (frame 60 fps, per nomor cue 1…201 = urutan SRT v1):
  K  akhir kalimat (. ? ! : atau kutipan tertutup)                      20 f
  D  koma antar-butir DAFTAR VISUAL (tiap butir memunculkan elemennya)   20 f
  V  akhir kalimat yang MENUNTASKAN satu komposisi, sebelum morf/transisi 30–40 f
  S  akhir scene (sebelum transisi ke scene berikutnya)                 45 f
  + ekor 60 f hening di akhir VO (pertanyaan penutup S08 sempat terbaca)

Masukan (selalu v1, aman dijalankan ulang): public/vo/vi01_vo.wav · sync/_v1_vo-words.json · sync/_v1_cues.json
Keluaran: public/vo/vi01_vo_v2_jeda.wav · sync/vo-words.json · sync/jeda-v2.json · ../01_VO/VI01_VO_v2_jeda.wav (Premiere) · src/vo.ts
Sesudahnya: python3 scripts/gen-words.py && python3 scripts/gen-cues.py && python3 scripts/gen-batas.py && python3 scripts/qa-cues.py
Jalankan dengan python ber-soundfile: _fondasi/.venv-align/bin/python scripts/sisip-jeda-visual.py
"""
import json, pathlib, re, shutil
import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 60
SRC_WAV = ROOT / "public/vo/vi01_vo.wav"
# 30 Okt malam: VO v1 kini dapat berisi scene yang DIGANTI rekaman baru (scripts/ganti-vo-scene.py, meta.ganti) → keluaran v3
VERSI = "v4"  # v4: S03 + S08 diganti rekaman baru (v3 = S03 saja)
OUT_WAV = ROOT / f"public/vo/vi01_vo_{VERSI}.wav"
W1 = ROOT / "sync/_v1_vo-words.json"
C1 = ROOT / "sync/_v1_cues.json"
if not W1.exists(): shutil.copy(ROOT / "sync/vo-words.json", W1)
if not C1.exists(): shutil.copy(ROOT.parent / "04_Asset/Video 01 - Apa Itu Value Investing_ID.json", C1)
data = json.loads(W1.read_text())
cues = json.loads(C1.read_text())
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
wd = {w["tid"]: w for w in data["words"]}

# ── tabel jeda per cue ──
KUTIP = ''.join(chr(c) for c in (0x27, 0x22, 0x201D, 0x2019, 0x29))  # ' " ” ’ )
AKHIR_KALIMAT = re.compile('[.?!:][' + re.escape(KUTIP) + ']*$|' + chr(0x201D) + '$')
DAFTAR = [5, 6, 7, 60, 61, 79, 80, 81, 85, 86, 87, 98, 99, 105, 106, 111, 112, 113, 114, 127, 128, 130, 131, 137, 138, 140, 141,
          149, 150, 151, 152, 153, 160, 171, 172, 173, 174, 182, 183, 184, 185, 192, 193]
VISUAL = {8: 30, 13: 30, 20: 30, 26: 30,                                   # S01 catatan · Ibu Sari → kota · harga · spekulasi → judul
          31: 30, 36: 30, 39: 30, 44: 30, 47: 30,                          # S02 Graham → kuil · tiap pilar mengerut
          52: 30, 54: 30, 56: 30, 58: 30, 62: 30, 64: 30,                  # S03 kartu Schloss · Buffett · barisan · ikon · pola · pita
          67: 30, 69: 30, 71: 30, 74: 30, 76: 40, 83: 30, 88: 40, 91: 30, 92: 30,  # S04 tiga lingkaran · Harga≠Bisnis · pasar · chart → cakram · sektor · sejarah → bilah
          95: 30, 100: 30, 102: 30, 107: 30, 108: 30, 115: 30, 120: 30,   # S05 timbangan · tiap panel sebelum mengerut
          125: 30, 126: 30, 129: 30, 132: 30, 134: 30, 136: 30, 139: 30, 142: 30, 143: 30,  # S06 awan · baris metode · tiap panel · syarat · tangga
          147: 30, 154: 40, 155: 30, 157: 30, 161: 30, 162: 30, 164: 30, 166: 30,           # S07 rumus · chart lengkap · ≠ · lama pulih · sabar · cepat kaya
          170: 30, 175: 30, 178: 30, 186: 30, 187: 30, 189: 30, 190: 30, 194: 30, 197: 30}  # S08 riset · Tuntun · laporan · AI · valuasi · fondasi
AKHIR_SCENE = {28: 45, 48: 45, 65: 45, 93: 45, 123: 45, 144: 45, 168: 45}
EKOR_F = 60
# titik potong manual (detik v1) — alignment MMS meleset: "risiko, dan" (cue 185) diucapkan tanpa napas; suara "risiko" berlanjut sampai ±557,65 dtk,
# celah energi terendah sebelum "dan" = 557,66 dtk (RMS 0,18 × rata-rata, bukan hening penuh → fade 5 ms di tiap potongan)
POTONG_MANUAL = {185: 557.66}
FADE_S = 0.005

jeda = {}
for c in cues:
    i = c["index"]
    if i == len(cues): continue
    t = c["text"].strip()
    if AKHIR_KALIMAT.search(t): jeda[i] = 20
    if i in DAFTAR: jeda[i] = 20
    if i in VISUAL: jeda[i] = VISUAL[i]
    if i in AKHIR_SCENE: jeda[i] = AKHIR_SCENE[i]

# cue → token terakhirnya (teks cue berurutan = token naskah)
akhir_tok, n = {}, 0
for c in cues:
    n += len(c["text"].split()); akhir_tok[c["index"]] = n - 1
assert n == len(toks), (n, len(toks))

u, sr = sf.read(SRC_WAV, dtype="int16", always_2d=True)
mono = u.astype(np.float64).mean(axis=1)
win = int(0.010 * sr)
sisip = []  # (detik v1, frame jeda, cue)
for ci, jf in sorted(jeda.items()):
    i = akhir_tok[ci]
    if i not in wd or (i + 1) not in wd: continue
    a0, a1 = wd[i]["b"] + 0.02, wd[i + 1]["a"] - 0.05
    if a1 - a0 < 0.02: s = (wd[i]["b"] + wd[i + 1]["a"]) / 2
    else:
        i0, i1 = int(a0 * sr), int(a1 * sr)
        best, s = None, (a0 + a1) / 2
        for k in range(i0, max(i0 + 1, i1 - win), win // 2):
            e = float(np.sqrt(np.mean(mono[k:k + win] ** 2)))
            if best is None or e < best: best, s = e, (k + win / 2) / sr
    # titik potong manual ditulis dalam detik v1 ASLI → geser Δ scene yang diganti sebelum titik itu (ganti-vo-scene.py)
    if ci in POTONG_MANUAL: s = POTONG_MANUAL[ci] + sum(m["delta_s"] for m in data["meta"].get("ganti", []) if m["potong_v1a_s"][1] <= POTONG_MANUAL[ci])
    sisip.append((round(s, 4), jf, ci))
sisip.sort()

# fade-out/in 5 ms di tepi tiap potongan (tak terdengar di titik hening; mencegah klik di titik berenergi rendah seperti cue 185)
uf = u.astype(np.float64)
nf = int(FADE_S * sr)
for s, _, _ in sisip:
    k = int(round(s * sr))
    uf[k - nf:k] *= np.linspace(1, 0, nf)[:, None]
    uf[k:k + nf] *= np.linspace(0, 1, nf)[:, None]
u = np.round(uf).astype(np.int16)
bagian, k0 = [], 0
for s, jf, _ in sisip:
    k = int(round(s * sr)); bagian += [u[k0:k], np.zeros((int(round(jf / FPS * sr)), u.shape[1]), dtype=u.dtype)]; k0 = k
bagian += [u[k0:], np.zeros((int(round(EKOR_F / FPS * sr)), u.shape[1]), dtype=u.dtype)]
v2 = np.concatenate(bagian)
sf.write(OUT_WAV, v2, sr, subtype="PCM_16")
vo_dir = ROOT.parent / "01_VO"
sf.write(vo_dir / f"VI01_VO_{VERSI}.wav", v2, sr, subtype="PCM_16")

geser = lambda x: x + sum(jf for s, jf, _ in sisip if s < x) / FPS
for w in data["words"]: w["a"], w["b"] = round(geser(w["a"]), 3), round(geser(w["b"]), 3)
data["energi"]["voiced"] = [[round(geser(a), 3), round(geser(b), 3)] for a, b in data["energi"]["voiced"]]
data["meta"].update(audio=OUT_WAV.name, durasi_s=round(len(v2) / sr, 3),
                    jeda=f"v2 30 Okt: {len(sisip)} jeda (+{sum(j for _, j, _ in sisip)} f) + ekor {EKOR_F} f (sisip-jeda-visual.py)")
(ROOT / "sync/vo-words.json").write_text(json.dumps(data, ensure_ascii=False))
(ROOT / "sync/jeda-v2.json").write_text(json.dumps({"ekor_f": EKOR_F, "sisip": [{"cue": c, "teks": next(x["text"] for x in cues if x["index"] == c),
    "detik_v1": s, "frame_v1": round(s * FPS, 1), "jeda_f": j} for s, j, c in sisip]}, ensure_ascii=False, indent=1), encoding="utf-8")

vo = (ROOT / "src/vo.ts").read_text(encoding="utf-8")
vo = re.sub(r"export const VO_UTUH = '[^']+';[^\n]*", f"export const VO_UTUH = 'vo/{OUT_WAV.name}'; // {VERSI}: VO v1 (+ scene diganti, ganti-vo-scene.py) + jeda visual (sisip-jeda-visual.py, sync/jeda-v2.json)", vo)
(ROOT / "src/vo.ts").write_text(vo, encoding="utf-8")
tot = sum(j for _, j, _ in sisip)
print(f"{len(sisip)} jeda · +{tot} f ({tot / FPS:.1f} dtk) + ekor {EKOR_F} f · VO {len(u) / sr:.3f} → {len(v2) / sr:.3f} dtk")
print("per jenis:", {k: sum(1 for _, j, _ in sisip if j == k) for k in sorted({j for _, j, _ in sisip})})
