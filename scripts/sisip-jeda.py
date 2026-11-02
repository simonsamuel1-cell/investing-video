#!/usr/bin/env python3
"""
JEDA KALIMAT (Simon 24 Okt, revisi seluruh video: "Tambahkan jeda tiap kalimat berhenti (ketika ada tanda '.' pada scriptnya) … tambahkan sekitar
10 - 20 frame untuk jeda"). Menyisipkan JEDA_F frame hening sesudah SETIAP kalimat bertitik di VO isi, lalu menggeser semua waktu turunannya —
tanpa forced alignment ulang (hening disisipkan di titik paling sunyi di antara kata terakhir kalimat dan kata pertama kalimat berikutnya,
jadi pergeserannya pasti: +JEDA_F per sisipan yang mendahului).

Masukan : public/vo/inv05_vo_v3_isi.wav · sync/_v3_vo-words.json (salinan v3; dibuat otomatis saat jalan pertama) · sync/NASKAH.txt
Keluaran: public/vo/inv05_vo_v4_isi.wav · sync/vo-words.json (waktu v4) · sync/jeda-v4.json (titik sisip, frame v3 → peta frame lama → baru)
          src/batas.ts (angka literal digeser) · src/outro/plan.gen.ts + sync/outro.json (OUTRO_AT baru) · public/vo/inv05_vo_v4_outro<f>.wav
          (isi + outro, satu berkas dari frame 0) + salinan 01_VO/Video05_VO_v4_jeda_isi+outro.wav (Premiere) · src/vo.ts (VO_UTUH)
          scripts/gen-kamera.py (batas & ambang literal digeser)
Sesudahnya:  python3 scripts/gen-words.py && python3 scripts/gen-cues.py && python3 scripts/potong-vo.py
"""
import json, math, pathlib, re, shutil
import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
EPS = ROOT.parent
FPS, JEDA_F = 60, 15
SRC_WAV = ROOT / "public/vo/inv05_vo_v3_isi.wav"
OUT_WAV = ROOT / "public/vo/inv05_vo_v4_isi.wav"
W3 = ROOT / "sync/_v3_vo-words.json"
if not W3.exists(): shutil.copy(ROOT / "sync/vo-words.json", W3)
data = json.loads(W3.read_text())
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
wd = {w["tid"]: w for w in data["words"]}
TITIK = re.compile("\\.[\u0027\u0022\u201d\u2019)]*$")

u, sr = sf.read(SRC_WAV, dtype="int16", always_2d=True)
mono = u.astype(np.float64).mean(axis=1)
win = int(0.010 * sr)

# 1 · titik sisip: 10 ms tersunyi di celah [akhir kata bertitik + 20 ms, onset kata berikutnya − 50 ms] (tidak pernah dalam 3 frame sebelum onset
#     → batas scene = onset − 3 f tetap di sisi yang benar)
sisip = []
for i, t in enumerate(toks[:-1]):
    if not TITIK.search(t) or i not in wd or (i + 1) not in wd: continue
    a0, a1 = wd[i]["b"] + 0.02, wd[i + 1]["a"] - 0.05
    if a1 - a0 < 0.02: s = (wd[i]["b"] + wd[i + 1]["a"]) / 2
    else:
        i0, i1 = int(a0 * sr), int(a1 * sr)
        best, s = None, (a0 + a1) / 2
        for k in range(i0, max(i0 + 1, i1 - win), win // 2):
            e = float(np.sqrt(np.mean(mono[k:k + win] ** 2)))
            if best is None or e < best: best, s = e, (k + win / 2) / sr
    sisip.append(round(s, 4))
sisip.sort()

# 2 · audio: hening JEDA_F frame tepat di tiap titik sisip (sampel nol — titik tersunyi di celah napas TTS)
n_sisip = int(JEDA_F / FPS * sr)
bagian, k0 = [], 0
for s in sisip:
    k = int(round(s * sr)); bagian += [u[k0:k], np.zeros((n_sisip, u.shape[1]), dtype=u.dtype)]; k0 = k
bagian.append(u[k0:])
v4 = np.concatenate(bagian)
sf.write(OUT_WAV, v4, sr, subtype="PCM_16")

geser = lambda x: x + JEDA_F / FPS * sum(1 for s in sisip if s < x)
for w in data["words"]: w["a"], w["b"] = round(geser(w["a"]), 3), round(geser(w["b"]), 3)
data["energi"]["voiced"] = [[round(geser(a), 3), round(geser(b), 3)] for a, b in data["energi"]["voiced"]]
data["meta"].update(audio=OUT_WAV.name, durasi_s=round(len(v4) / sr, 3), jeda=f"+{JEDA_F} f sesudah {len(sisip)} kalimat bertitik (sisip-jeda.py)")
(ROOT / "sync/vo-words.json").write_text(json.dumps(data, ensure_ascii=False))
sisip_f = [round(s * FPS, 2) for s in sisip]
(ROOT / "sync/jeda-v4.json").write_text(json.dumps({"jeda_f": JEDA_F, "sisip_s_v3": sisip, "sisip_f_v3": sisip_f}, indent=1))
peta = lambda f: f + JEDA_F * sum(1 for s in sisip_f if s < f)  # frame v3 → frame v4

# 3 · batas scene (literal) & kamera (literal + ambang kata) digeser
bt = (ROOT / "src/batas.ts").read_text(encoding="utf-8")
if "v4 24 Okt" not in bt:
    bt = re.sub(r"(O \+ )(\d+)(, // suara \S+ mulai f)(\d+)", lambda m: f"{m.group(1)}{peta(int(m.group(2)))}{m.group(3)}{peta(int(m.group(4)))}", bt)
    bt = bt.replace(" * src/cues.ts dari gen-cues.py).", " * src/cues.ts dari gen-cues.py). v4 24 Okt: + jeda 15 f sesudah tiap kalimat bertitik (scripts/sisip-jeda.py).")
    (ROOT / "src/batas.ts").write_text(bt, encoding="utf-8")
gk = (ROOT / "scripts/gen-kamera.py").read_text(encoding="utf-8")
if "# v4 jeda" not in gk:
    a = gk.index("B = sorted({"); b = gk.index("})", a)
    blok = gk[a:b]
    blok = re.sub(r"k\('([^']+)', (\d+)", lambda m: f"k('{m.group(1)}', {peta(int(m.group(2)))}", blok)
    blok = re.sub(r"(?<=[ ,])(\d{4,5})(?=,)", lambda m: str(peta(int(m.group(1)))), blok)
    gk = gk[:a] + "# v4 jeda (scripts/sisip-jeda.py): angka di blok ini sudah frame v4\n" + blok + gk[b:]
    (ROOT / "scripts/gen-kamera.py").write_text(gk, encoding="utf-8")

# 4 · outro: blok mulai di TOTAL isi baru (ceil(durasi) + ekor 30 f — rumus gen-cues.py); klip outro tidak berubah
TOTAL = math.ceil(len(v4) / sr * FPS) + 30
pl = (ROOT / "src/outro/plan.gen.ts").read_text(encoding="utf-8")
pl = re.sub(r"export const OUTRO_AT = \d+;", f"export const OUTRO_AT = {TOTAL};", pl)
(ROOT / "src/outro/plan.gen.ts").write_text(pl, encoding="utf-8")
oj = json.loads((ROOT / "sync/outro.json").read_text()); oj["outro_at"] = TOTAL
(ROOT / "sync/outro.json").write_text(json.dumps(oj, ensure_ascii=False, indent=1), encoding="utf-8")
VO_AT = oj["vo_at"]
klip, sr2 = sf.read(ROOT / "public/vo/outro_selanjutnya.wav", dtype="int16", always_2d=True)
assert sr2 == sr
mulai = TOTAL + VO_AT
pad = np.zeros((round(mulai / FPS * sr) - len(v4), v4.shape[1]), dtype=v4.dtype)
assert len(pad) >= 0
gab = np.concatenate([v4, pad, klip])
nama = f"vo/inv05_vo_v4_outro{mulai}.wav"
sf.write(ROOT / "public" / nama, gab, sr, subtype="PCM_16")
sf.write(EPS / "01_VO/Video05_VO_v4_jeda_isi+outro.wav", gab, sr, subtype="PCM_16")
vo = (ROOT / "src/vo.ts").read_text(encoding="utf-8")
vo = re.sub(r"export const VO_UTUH = '[^']+';[^\n]*", f"export const VO_UTUH = '{nama}'; // v4 (24 Okt): + jeda 15 f sesudah tiap kalimat bertitik (scripts/sisip-jeda.py)", vo)
vo = vo.replace("`vo/ide-v3/${scene}.wav`", "`vo/ide-v4/${scene}.wav`")
(ROOT / "src/vo.ts").write_text(vo, encoding="utf-8")

print(f"{len(sisip)} jeda × {JEDA_F} f = +{len(sisip) * JEDA_F} f · VO isi {len(u) / sr:.3f} → {len(v4) / sr:.3f} dtk · TOTAL isi {TOTAL} · VO outro mulai f{mulai}")
print("batas:", re.findall(r"(s\w+): O \+ (\d+)", (ROOT / "src/batas.ts").read_text()))
