#!/usr/bin/env python3
"""
GANTI VO SATU SCENE di VO v1 (Simon 30 Okt: "Aku memperbarui voice dari scene 3, aku lampirkan dichat" → 01_VO/MiniMax_2026-10-30_13_51_33).

Sumber selalu VO v1 ASLI (cadangan sync/_v1a_vo.wav + sync/_v1a_vo-words.json, dibuat sekali) → aman dijalankan ulang. Untuk tiap scene di GANTI:
  1. titik potong = 10 ms TERSUNYI di celah sebelum kata pertama scene dan sebelum kata pertama scene berikutnya (resep sisip-jeda-visual.py);
  2. rekaman baru dipotong di onset/ujung suaranya (amplop energi) dan diberi hening awal/akhir SAMA dengan bagian lama → jarak antarkalimat di
     sambungan tidak berubah; sambungan diberi fade 5 ms;
  3. kata scene itu DIJAJARKAN ULANG (torchaudio MMS_FA, aturan ejaan bunyi align-forced.py) pada rekaman baru, kata sesudahnya digeser Δ;
  4. amplop bersuara dihitung ulang untuk VO baru.
Keluaran: public/vo/vi01_vo.wav (VO v1 baru) · sync/_v1_vo-words.json · meta.ganti (Δ per scene, dipakai sisip-jeda-visual.py untuk titik potong manual).
Sesudahnya: sisip-jeda-visual.py → gen-words.py → gen-cues.py → gen-batas.py → qa-cues.py.
Jalankan: "../../../_fondasi/.venv-align/bin/python" scripts/ganti-vo-scene.py
"""
import importlib.util, json, pathlib, shutil, subprocess, tempfile
import numpy as np
import soundfile as sf
import torch, torchaudio
from torchaudio.functional import forced_align, merge_tokens

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO_DIR = ROOT.parent / "01_VO"
V1_WAV, V1_WORDS = ROOT / "public/vo/vi01_vo.wav", ROOT / "sync/_v1_vo-words.json"
A_WAV, A_WORDS = ROOT / "sync/_v1a_vo.wav", ROOT / "sync/_v1a_vo-words.json"
# scene → rekaman baru + rentang tid (token NASKAH.txt) yang diucapkannya
GANTI = {
    "s03": {"klip": VO_DIR / "MiniMax_2026-10-30_13_51_33_Compelling_Storyteller.mp3", "tid": (290, 395)},
    # Simon 30 Okt malam: "Aku perbarui voice untuk scene 8" — teks sama dengan naskah S08 ("Masalahnya, …" sampai akhir; transkrip whisper dicek)
    "s08": {"klip": VO_DIR / "MiniMax_2026-10-30_15_30_06_Compelling_Storyteller.mp3", "tid": (956, 1123)},
}
FADE_S = 0.005

spec = importlib.util.spec_from_file_location("af", ROOT / "scripts/align-forced.py")
af = importlib.util.module_from_spec(spec); spec.loader.exec_module(af)

if not A_WAV.exists(): shutil.copy(V1_WAV, A_WAV)
if not A_WORDS.exists(): shutil.copy(V1_WORDS, A_WORDS)
u, sr = sf.read(A_WAV, dtype="float64", always_2d=True)
data = json.loads(A_WORDS.read_text())
wd = {w["tid"]: w for w in data["words"]}
toks_all = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()


def sunyi(x, a, b):
    """detik dengan RMS 10 ms terendah di [a, b]"""
    mono, win = x.mean(axis=1), int(0.010 * sr)
    i0, i1 = int(a * sr), int(b * sr)
    best, s = None, (a + b) / 2
    for k in range(i0, max(i0 + 1, i1 - win), win // 2):
        e = float(np.sqrt(np.mean(mono[k:k + win] ** 2)))
        if best is None or e < best: best, s = e, (k + win / 2) / sr
    return s


def batas_suara(x):
    """onset & ujung suara (detik) dari amplop RMS 10 ms (ambang 3 % puncak, sama dengan voiced_segments)"""
    mono, hop = x.mean(axis=1), int(0.010 * sr)
    rms = np.sqrt(np.mean(mono[: len(mono) // hop * hop].reshape(-1, hop) ** 2, axis=1))
    sm = np.convolve(rms, np.ones(5) / 5, mode="same")
    on = np.nonzero(sm > 0.03 * np.percentile(sm, 99))[0]
    return on[0] * hop / sr, (on[-1] + 1) * hop / sr


def baca_mp3(p):
    with tempfile.TemporaryDirectory() as d:
        out = pathlib.Path(d) / "k.wav"
        subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{int(sr)}", "-c", str(u.shape[1]), str(p), str(out)], check=True)
        x, r = sf.read(out, dtype="float64", always_2d=True)
    assert r == sr
    return x


bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False); model.eval()
LEX = bundle.get_dict(star=None)
tok_ids = lambda w: [LEX[c] for c in w if c in LEX]


def jajarkan(x, t0, t1):
    """MMS_FA token t0…t1 pada potongan audio x (detik lokal)"""
    w16 = torchaudio.functional.resample(torch.from_numpy(x.mean(axis=1).astype(np.float32)), int(sr), af.SR)
    kata = []
    for tid in range(t0, t1 + 1):
        tok = toks_all[tid]
        for piece in (af.RAW[tok] if tok in af.RAW else af.norm(tok)).split():
            if tok_ids(piece): kata.append({"raw": tok, "norm": piece, "tid": tid})
    with torch.inference_mode():
        em, _ = model(w16.unsqueeze(0))
    tgt = torch.tensor([[t for w in kata for t in tok_ids(w["norm"])]], dtype=torch.int32)
    ali, sc = forced_align(em, tgt, blank=0)
    spans = merge_tokens(ali[0], sc[0].exp())
    ratio = w16.shape[0] / em.shape[1] / af.SR
    hasil, k = [], 0
    for w in kata:
        n = len(tok_ids(w["norm"])); g = spans[k:k + n]; k += n
        a, b, s = g[0].start * ratio, g[-1].end * ratio, float(sum(z.score for z in g) / len(g))
        if hasil and hasil[-1]["tid"] == w["tid"]:
            h = hasil[-1]; h["b"] = b; h["score"] = (h["score"] + s) / 2
        else:
            hasil.append({"w": w["raw"], "tid": w["tid"], "a": a, "b": b, "score": s})
    return hasil


bagian, kata_baru, ganti_meta, k0, geser = [], [], [], 0, 0.0
for nama, g in sorted(GANTI.items(), key=lambda kv: kv[1]["tid"][0]):
    t0, t1 = g["tid"]
    c0 = sunyi(u, wd[t0 - 1]["b"] + 0.02, wd[t0]["a"] - 0.05)
    # scene TERAKHIR: tidak ada kata sesudahnya → potong di ujung VO (hening ekor bagian lama dipertahankan lewat `ekor`)
    c1 = sunyi(u, wd[t1]["b"] + 0.02, wd[t1 + 1]["a"] - 0.05) if (t1 + 1) in wd else len(u) / sr
    lama = u[int(c0 * sr):int(c1 * sr)]
    on_l, off_l = batas_suara(lama)
    klip = baca_mp3(g["klip"])
    on_k, off_k = batas_suara(klip)
    awal, ekor = on_l, (c1 - c0) - off_l  # hening awal & akhir bagian lama dipertahankan
    seg = np.concatenate([np.zeros((int(round(awal * sr)), u.shape[1])), klip[int(on_k * sr):int(off_k * sr)], np.zeros((int(round(ekor * sr)), u.shape[1]))])
    nf = int(FADE_S * sr)
    seg[:nf] *= np.linspace(0, 1, nf)[:, None]; seg[-nf:] *= np.linspace(1, 0, nf)[:, None]
    i0 = int(c0 * sr)
    bagian += [u[k0:i0], seg]; k0 = int(c1 * sr)
    delta = len(seg) / sr - (c1 - c0)
    jj = jajarkan(seg, t0, t1)
    for w in jj: w["a"], w["b"] = w["a"] + c0 + geser, w["b"] + c0 + geser
    kata_baru += jj
    ganti_meta.append({"scene": nama, "klip": g["klip"].name, "tid": [t0, t1], "potong_v1a_s": [round(c0, 4), round(c1, 4)],
                       "lama_s": round(c1 - c0, 3), "baru_s": round(len(seg) / sr, 3), "delta_s": round(delta, 4)})
    print(f"{nama}: potong {c0:.3f}–{c1:.3f} dtk ({c1 - c0:.2f} dtk) → klip {off_k - on_k:.2f} dtk suara + hening {awal:.2f}/{ekor:.2f} → Δ {delta:+.3f} dtk ({delta * 60:+.0f} f)")
    rendah = [w for w in jj if w["score"] < 0.5]
    print(f"   {len(jj)} kata dijajarkan ulang · skor rendah (<0,50): {len(rendah)} " + " ".join(f"{w['w']}({w['score']:.2f})" for w in rendah))
    geser += delta
bagian.append(u[k0:])
v1 = np.concatenate(bagian)

ganti_tid = {t for g in GANTI.values() for t in range(g["tid"][0], g["tid"][1] + 1)}
def geser_v1a(t):
    return t + sum(m["delta_s"] for m in ganti_meta if m["potong_v1a_s"][1] <= t)
kata = [dict(w, a=round(geser_v1a(w["a"]), 3), b=round(geser_v1a(w["b"]), 3)) for w in data["words"] if w["tid"] not in ganti_tid]
kata += [dict(w, a=round(w["a"], 3), b=round(w["b"], 3), score=round(w["score"], 3)) for w in kata_baru]
kata.sort(key=lambda w: w["tid"])
assert all(kata[i]["a"] <= kata[i + 1]["a"] for i in range(len(kata) - 1)), "waktu kata tidak monoton"

w16 = torchaudio.functional.resample(torch.from_numpy(v1.mean(axis=1).astype(np.float32)), int(sr), af.SR)
voiced = af.voiced_segments(w16)
sf.write(V1_WAV, np.clip(v1, -1, 1), int(sr), subtype="PCM_16")
data["words"] = kata
data["energi"] = {"voiced": voiced}
data["meta"].update(durasi_s=round(len(v1) / sr, 3), ganti=ganti_meta)
V1_WORDS.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"VO v1: {len(u) / sr:.3f} → {len(v1) / sr:.3f} dtk · {len(kata)} kata → {V1_WORDS.name}")
