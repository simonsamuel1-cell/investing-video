#!/usr/bin/env python3
"""
SAMBUNG VO v5 — naskah REVISI 16 Okt (10 scene). Simon: "ini voice barunya … gabungkan dengan voice yang sudah ada
berdasarkan script yang baru".

Urutan naskah revisi → sumber audio:
  S01 + S02  = VO v4 Scene 01–02        (narasi identik kata per kata)
  S03 Emas   = 01_VO/VO baru.mp3, kalimat 1–8
  S04        = VO v4 Scene 05 Properti   (identik)
  S05        = VO baru, Obligasi
  S06        = VO v4 Scene 07 Reksa Dana (identik)
  S07–S09    = VO baru, Saham · Bisnis vs harga · Rangkuman (berurutan di berkas baru, celah aslinya dipertahankan)
  S10        = VO v4 Scene 13 Penutup    (identik)
VO v4 Scene 03–04, 06, 08–12 tidak dipakai lagi.

Batas suara tiap blok = segmen bersuara (amplop energi, resep align-forced.py) yang memuat kata pertama/terakhir blok,
dari alignment masing-masing berkas (sync/vo-words.json = v4, sync/vobaru16okt-words.json = VO baru).
Celah sunyi di tiap SAMBUNGAN = CELAH (median celah antar-scene VO v4 = 0,31–0,36 dtk); blok dipotong CELAH/2 sebelum
awal & sesudah ujung suaranya (di dalam sunyi), dengan pudar 3 ms supaya tidak ada klik.
Level: tiap blok VO baru disamakan dengan median level blok VO v4 yang dipakai (pembatas puncak lembut −1 dBFS).

Masuk : public/vo/inv02_vo_v4.wav · sync/vo-words.json · sync/_vobaru16okt48k.wav · sync/vobaru16okt-words.json
Keluar: public/vo/inv02_vo_v5.wav · ../01_VO/VO_Investment-Instruments_revisi-16okt.wav · sync/splice3.json
"""
import json, pathlib, re, shutil, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
KELUAR = "inv02_vo_v5.wav"
CELAH = 0.32


def baca(p):
    with wave.open(str(p)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64)


def tulis(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.clip(np.round(x), -32768, 32767).astype("<i2").tobytes())


def level(x):
    hop = 480; f = x[: len(x) // hop * hop].reshape(-1, hop) / 32768; r = np.sqrt((f ** 2).mean(1)); r = r[r > np.percentile(r, 40)]
    return 20 * np.log10(np.median(r) + 1e-12)


def batasi(y, thr_db=-1.0):
    thr = 10 ** (thr_db / 20) * 32768
    a = np.abs(y); need = np.minimum(1.0, thr / np.maximum(a, 1e-9))
    if need.min() >= 1: return y, 0
    w = 96
    from numpy.lib.stride_tricks import sliding_window_view as swv
    g = swv(np.pad(need, (w, w), constant_values=1), 2 * w + 1).min(axis=1)
    g = np.convolve(g, np.ones(w) / w, mode="same")
    return y * np.minimum(g, need), int((need < 1).sum())


def pudar(y, ms=3):
    n = int(SR * ms / 1000); r = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, n))
    y = y.copy(); y[:n] *= r; y[-n:] *= r[::-1]; return y


def jangkauan(words_json, n_per_scene):
    """[(awal_suara, ujung_suara)] per scene, dari alignment + segmen bersuara"""
    W = json.loads(words_json.read_text()); V = W["energi"]["voiced"]; byt = {w["tid"]: w for w in W["words"]}
    st = np.cumsum([0] + n_per_scene); out = []
    for k in range(len(n_per_scene)):
        a = byt[min(t for t in byt if t >= st[k])]["a"]; b = byt[max(t for t in byt if t <= st[k + 1] - 1)]["b"]
        out.append((min(s for s, e in V if e >= a - 0.05), max(e for s, e in V if s <= b + 0.05)))
    return out


def jumlah_kata(md, judul=r"## SCENE (\d\d)[^\n]*\n"):
    parts = re.split(judul, md)
    return [len(parts[i + 1].replace("---", " ").split()) for i in range(1, len(parts), 2)]


ASSET = ROOT.parent / "04_Asset"
lama = baca(ROOT / "public/vo/inv02_vo_v4.wav")
baru = baca(ROOT / "sync/_vobaru16okt48k.wav")
J_LAMA = jangkauan(ROOT / "sync/vo-words.json", jumlah_kata((ASSET / "VO-Script-Investment-Instruments.md").read_text(encoding="utf-8")))
assert len(J_LAMA) == 13
n_baru = [len(" ".join(l for l in blk.splitlines() if l.strip() and not l.startswith("_") and l.strip() != "---").split()) for blk in
          re.split(r"\n## SCENE \d\d[^\n]*\n", (ASSET / "VO-baru-revisi-16okt.md").read_text(encoding="utf-8"))[1:]]
assert n_baru == [88, 80, 57, 97, 55], n_baru
J_BARU = jangkauan(ROOT / "sync/vobaru16okt-words.json", n_baru)

# blok: (nama, sumber, awal_suara, ujung_suara, scene_naskah_baru)
BLOK = [
    ("S01–S02 (v4 S01–S02)", "lama", 0.0, J_LAMA[1][1], [1, 2]),
    ("S03 Emas (baru)", "baru", J_BARU[0][0], J_BARU[0][1], [3]),
    ("S04 Properti (v4 S05)", "lama", J_LAMA[4][0], J_LAMA[4][1], [4]),
    ("S05 Obligasi (baru)", "baru", J_BARU[1][0], J_BARU[1][1], [5]),
    ("S06 Reksa Dana (v4 S07)", "lama", J_LAMA[6][0], J_LAMA[6][1], [6]),
    ("S07–S09 (baru)", "baru", J_BARU[2][0], J_BARU[4][1], [7, 8, 9]),
    ("S10 Penutup (v4 S13)", "lama", J_LAMA[12][0], len(lama) / SR, [10]),
]
lv_lama = np.median([level(lama[round(a * SR): round(b * SR)]) for _, s, a, b, _ in BLOK if s == "lama" and a > 0] +
                    [level(lama[round(J_LAMA[0][0] * SR): round(J_LAMA[1][1] * SR)])])

out, info = [], {"celah_sambungan_s": CELAH, "level_lama_dB": round(float(lv_lama), 2), "blok": []}
for i, (nama, src, va, ve, scs) in enumerate(BLOK):
    x = lama if src == "lama" else baru
    a = va if i == 0 else va - CELAH / 2                       # blok pertama: awal berkas v4 apa adanya (VO_OFFSET, Scene 01)
    b = ve if i == len(BLOK) - 1 else ve + CELAH / 2           # blok terakhir: ekor berkas v4 apa adanya
    pre = np.zeros(max(0, round(-a * SR))); post = np.zeros(max(0, round((b - len(x) / SR) * SR)))
    piece = np.concatenate([pre, x[max(0, round(a * SR)): min(len(x), round(b * SR))], post])
    gain_db, nbat = 0.0, 0
    if src == "baru":
        gain_db = float(lv_lama - level(x[round(va * SR): round(ve * SR)]))
        piece, nbat = batasi(piece * 10 ** (gain_db / 20))
    piece = pudar(piece)
    t0 = sum(len(p) for p in out) / SR
    info["blok"].append({"nama": nama, "sumber": src, "scene_baru": scs, "potong_sumber_s": [round(a, 3), round(b, 3)],
                         "suara_sumber_s": [round(va, 3), round(ve, 3)], "mulai_di_v5_s": round(t0, 3),
                         "geser_s": round(t0 - a, 3), "gain_dB": round(gain_db, 2), "sampel_dibatasi": nbat})
    out.append(piece)
gab = np.concatenate(out)
assert np.abs(gab).max() < 32767, "terpotong (clip)"
tulis(ROOT / f"public/vo/{KELUAR}", gab)
shutil.copyfile(ROOT / f"public/vo/{KELUAR}", ROOT.parent / "01_VO/VO_Investment-Instruments_revisi-16okt.wav")
info.update({"durasi_v4_s": round(len(lama) / SR, 3), "durasi_v5_s": round(len(gab) / SR, 3), "keluar": KELUAR})
(ROOT / "sync/splice3.json").write_text(json.dumps(info, indent=1, ensure_ascii=False))
print(json.dumps(info, indent=1, ensure_ascii=False))
