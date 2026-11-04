#!/usr/bin/env python3
"""
JEDA KALIMAT TANYA (Simon 24 Okt sore, jawaban butir RAGU: "berikan jeda untuk itu juga") — lanjutan scripts/sisip-jeda.py (v4 = jeda 15 f sesudah
tiap kalimat bertitik). Di sini: +JEDA_F frame hening sesudah tiap kalimat yang berakhir "?" (13 kalimat), di titik paling sunyi celahnya, lalu SEMUA
waktu turunan digeser (v4 → v5) tanpa forced alignment ulang.

Masukan : public/vo/inv05_vo_v4_isi.wav · sync/_v4_vo-words.json (salinan v4; dibuat otomatis saat jalan pertama) · sync/NASKAH.txt
Keluaran: public/vo/inv05_vo_v5_isi.wav · sync/vo-words.json (waktu v5) · sync/jeda-v5.json (titik sisip, frame v4)
          src/batas.ts · scripts/gen-kamera.py (batas papan, ambang kata, TETAP, BEKU) · src/kamera.gen.ts (SEMUA baris digeser — baris S1–S2 yang
          dibekukan tetap sama isinya, hanya waktunya ikut jeda) · src/outro/plan.gen.ts + sync/outro.json · public/vo/inv05_vo_v5_outro<f>.wav +
          01_VO/Video05_VO_v5_jeda_isi+outro.wav · src/vo.ts (VO_UTUH, VO_IDE ide-v5) · scripts/gen-cues.py (VO_PAGE)
Sesudahnya:  python3 scripts/gen-words.py && python3 scripts/gen-cues.py && python3 scripts/potong-vo.py
"""
import json, math, pathlib, re, shutil
import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
EPS = ROOT.parent
FPS, JEDA_F = 60, 15
SRC_WAV = ROOT / "public/vo/inv05_vo_v4_isi.wav"
OUT_WAV = ROOT / "public/vo/inv05_vo_v5_isi.wav"
W4 = ROOT / "sync/_v4_vo-words.json"
if not W4.exists(): shutil.copy(ROOT / "sync/vo-words.json", W4)
data = json.loads(W4.read_text())
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
wd = {w["tid"]: w for w in data["words"]}
TANYA = re.compile("\\?[\u0027\u0022\u201d\u2019)]*$")

u, sr = sf.read(SRC_WAV, dtype="int16", always_2d=True)
mono = u.astype(np.float64).mean(axis=1)
win = int(0.010 * sr)

# 1 · titik sisip: 10 ms tersunyi di celah [akhir kata bertanda tanya + 20 ms, onset kata berikutnya − 50 ms]
sisip = []
for i, t in enumerate(toks[:-1]):
    if not TANYA.search(t) or i not in wd or (i + 1) not in wd: continue
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

# 2 · audio
n_sisip = int(JEDA_F / FPS * sr)
bagian, k0 = [], 0
for s in sisip:
    k = int(round(s * sr)); bagian += [u[k0:k], np.zeros((n_sisip, u.shape[1]), dtype=u.dtype)]; k0 = k
bagian.append(u[k0:])
v5 = np.concatenate(bagian)
sf.write(OUT_WAV, v5, sr, subtype="PCM_16")

geser = lambda x: x + JEDA_F / FPS * sum(1 for s in sisip if s < x)
for w in data["words"]: w["a"], w["b"] = round(geser(w["a"]), 3), round(geser(w["b"]), 3)
data["energi"]["voiced"] = [[round(geser(a), 3), round(geser(b), 3)] for a, b in data["energi"]["voiced"]]
data["meta"].update(audio=OUT_WAV.name, durasi_s=round(len(v5) / sr, 3),
                    jeda=data["meta"].get("jeda", "") + f" · +{JEDA_F} f sesudah {len(sisip)} kalimat bertanda tanya (sisip-jeda-tanya.py)")
(ROOT / "sync/vo-words.json").write_text(json.dumps(data, ensure_ascii=False))
sisip_f = [round(s * FPS, 2) for s in sisip]
(ROOT / "sync/jeda-v5.json").write_text(json.dumps({"jeda_f": JEDA_F, "sisip_s_v4": sisip, "sisip_f_v4": sisip_f}, indent=1))
peta = lambda f: f + JEDA_F * sum(1 for s in sisip_f if s < f)  # frame v4 → frame v5

# 3 · batas scene, kamera (generator + hasil), outro
bt = (ROOT / "src/batas.ts").read_text(encoding="utf-8")
if "v5 24 Okt" not in bt:
    bt = re.sub(r"(O \+ )(\d+)(, // suara \S+ mulai f)(\d+)", lambda m: f"{m.group(1)}{peta(int(m.group(2)))}{m.group(3)}{peta(int(m.group(4)))}", bt)
    bt = bt.replace("(scripts/sisip-jeda.py).", "(scripts/sisip-jeda.py). v5 24 Okt sore: + jeda 15 f sesudah tiap kalimat bertanda tanya (scripts/sisip-jeda-tanya.py).", 1)
    (ROOT / "src/batas.ts").write_text(bt, encoding="utf-8")
gk = (ROOT / "scripts/gen-kamera.py").read_text(encoding="utf-8")
if "# v5 jeda tanya" not in gk:
    a = gk.index("B = sorted({"); b = gk.index("seg = [0]", a)
    # satu lintasan: ambang k('kata', N) ATAU angka frame lepas (4–5 digit) — tiap angka dipetakan tepat sekali
    blok = re.sub(r"(k\('[^']+', )(\d+)|(?<![\w.'])(\d{4,5})(?![\w.])",
                  lambda m: f"{m.group(1)}{peta(int(m.group(2)))}" if m.group(1) else str(peta(int(m.group(3)))), gk[a:b])
    gk = gk[:a] + "# v5 jeda tanya (scripts/sisip-jeda-tanya.py): angka di blok ini sudah frame v5\n" + blok + gk[b:]
    gk = re.sub(r"BEKU = (\d+)", lambda m: f"BEKU = {peta(int(m.group(1)))}", gk)
    (ROOT / "scripts/gen-kamera.py").write_text(gk, encoding="utf-8")
kp = ROOT / "src/kamera.gen.ts"
kt = kp.read_text(encoding="utf-8")
rows = json.loads(re.search(r"KAMERA: \[number, number, number\]\[\] = (\[.*\]);", kt).group(1))
rows = [[peta(r[0]), r[1], r[2]] for r in rows]
kt = re.sub(r"(KAMERA: \[number, number, number\]\[\] = )(\[.*\]);", lambda m: m.group(1) + ",".join(f"[{a},{x},{y}]" for a, x, y in rows).join("[]") + ";", kt)
kp.write_text(kt, encoding="utf-8")

TOTAL = math.ceil(len(v5) / sr * FPS) + 30
pl = (ROOT / "src/outro/plan.gen.ts").read_text(encoding="utf-8")
pl = re.sub(r"export const OUTRO_AT = \d+;", f"export const OUTRO_AT = {TOTAL};", pl)
(ROOT / "src/outro/plan.gen.ts").write_text(pl, encoding="utf-8")
oj = json.loads((ROOT / "sync/outro.json").read_text()); oj["outro_at"] = TOTAL
(ROOT / "sync/outro.json").write_text(json.dumps(oj, ensure_ascii=False, indent=1), encoding="utf-8")
VO_AT = oj["vo_at"]
klip, sr2 = sf.read(ROOT / "public/vo/outro_selanjutnya.wav", dtype="int16", always_2d=True)
assert sr2 == sr
mulai = TOTAL + VO_AT
pad = np.zeros((round(mulai / FPS * sr) - len(v5), v5.shape[1]), dtype=v5.dtype)
assert len(pad) >= 0
gab = np.concatenate([v5, pad, klip])
nama = f"vo/inv05_vo_v5_outro{mulai}.wav"
sf.write(ROOT / "public" / nama, gab, sr, subtype="PCM_16")
sf.write(EPS / "01_VO/Video05_VO_v5_jeda_isi+outro.wav", gab, sr, subtype="PCM_16")
vo = (ROOT / "src/vo.ts").read_text(encoding="utf-8")
vo = re.sub(r"export const VO_UTUH = '[^']+';[^\n]*",
            f"export const VO_UTUH = '{nama}'; // v5 (24 Okt sore): v4 + jeda 15 f sesudah tiap kalimat bertanda tanya (scripts/sisip-jeda-tanya.py)", vo)
vo = vo.replace("`vo/ide-v4/${scene}.wav`", "`vo/ide-v5/${scene}.wav`")
(ROOT / "src/vo.ts").write_text(vo, encoding="utf-8")
gc = (ROOT / "scripts/gen-cues.py").read_text(encoding="utf-8")
gc = gc.replace('VO_PAGE = "../01_VO/Video05_VO_v4_jeda_isi+outro.wav"', 'VO_PAGE = "../01_VO/Video05_VO_v5_jeda_isi+outro.wav"')
gc = gc.replace("public/vo/inv05_vo_v4_isi.wav", "public/vo/inv05_vo_v5_isi.wav")
(ROOT / "scripts/gen-cues.py").write_text(gc, encoding="utf-8")

print(f"{len(sisip)} jeda tanya × {JEDA_F} f = +{len(sisip) * JEDA_F} f · VO isi {len(u) / sr:.3f} → {len(v5) / sr:.3f} dtk · TOTAL isi {TOTAL} · VO outro mulai f{mulai}")
print("sisip (frame v4):", sisip_f)
print("batas:", re.findall(r"(s\w+): O \+ (\d+)", (ROOT / "src/batas.ts").read_text()))
