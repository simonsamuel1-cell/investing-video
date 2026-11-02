#!/usr/bin/env python3
"""
OUTRO "DI VIDEO SELANJUTNYA" Investing 101 · Video 05 (naskah revisi 21 Okt: OUTRO) — salinan metode Video 03 (tiga-uang-episode/scripts/gen-outro.py).
Bedanya: VO outro TIDAK direkam terpisah — ia ekor VO 22 Okt (01_VO/MiniMax_2026-10-22_09_38_26_Compelling_Storyteller.mp3) sesudah jeda
hening 484,62–485,06 dtk. VO dipotong di 484,84 dtk (scripts → public/vo/inv05_vo_v2_isi.wav = isi Scene 01–08); ekornya diambil di sini.
Naskah (2 baris Simon):
    Di video selanjutnya, kita akan bahas kesalahan-kesalahan apa saja
    yang sering bikin investor salah langkah.

Langkah (satu jalan, tanpa tangan):
  1. ekor VO (≥ 484,84 dtk) → forced alignment MMS_FA per kata (penjaga: kata == naskah, skor ≥ 0,5)
  2. potong: 0,30 dtk sebelum kata pertama · 0,45 dtk sesudah kata terakhir, pudar tepi 8 ms
  3. kekerasan disamakan dengan 60 dtk terakhir VO isi (RMS bagian bersuara) → stereo 48 kHz (rekaman sama, jadi ±0 dB)
  4. blok outro mulai di OUTRO_AT = TOTAL isi (src/cues.ts, termasuk ekor 30f); VO outro di frame lokal VO_AT = 28; N = VO_AT + klip + HOLD 33
  5. keluaran: public/vo/outro_selanjutnya.wav · 01_VO/Outro - Di video selanjutnya (V05).wav (salinan untuk Premiere) ·
     public/vo/inv05_vo_v2_outro<frame>.wav (VO isi + outro, SATU berkas dari frame 0) · src/outro/plan.gen.ts · sync/outro.json
Jalankan:  ../../../_fondasi/.venv-align/bin/python scripts/gen-outro.py   lalu   python3 scripts/gen-cues.py
"""
import json, math, pathlib, re, unicodedata
import numpy as np
import soundfile as sf
import torch, torchaudio
from torchaudio.functional import forced_align, merge_tokens

ROOT = pathlib.Path(__file__).resolve().parent.parent
EPS = ROOT.parent
VO_PENUH = ROOT / "public/vo/inv05_vo_v2.wav"   # VO 22 Okt utuh (48 kHz stereo)
CUT = 484.84                                      # dtk — tengah jeda hening sebelum "Di video selanjutnya"
VO_UTAMA = ROOT / "public/vo/inv05_vo_v3_isi.wav"  # 22 Okt sore v3 (isi s/d S07 baru); outro tetap diambil dari ekor VO_PENUH v2
BARIS = ["Di video selanjutnya, kita akan bahas kesalahan-kesalahan apa saja", "yang sering bikin investor salah langkah."]
FPS, SR = 60, 48000
PRE, POST, FADE = 0.30, 0.45, 0.008
VO_AT, HOLD = 28, 33
OUTRO_AT = int(re.search(r"export const TOTAL = (\d+);", (ROOT / "src/cues.ts").read_text()).group(1))


def norm(w):
    w = unicodedata.normalize("NFKD", w)
    w = "".join(c for c in w if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z' ]", " ", w.replace("-", " ")).split()


# 1 · ekor VO + alignment
penuh, sr = sf.read(VO_PENUH, dtype="float64")
assert sr == SR
x = penuh.mean(1) if penuh.ndim > 1 else penuh
x = x[round(CUT * SR):]
w16 = torchaudio.functional.resample(torch.tensor(x, dtype=torch.float32), SR, 16000)
teks = " ".join(BARIS)
raw_toks = teks.split()
toks = [(ri, p) for ri, raw in enumerate(raw_toks) for p in norm(raw)]
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False)
model.eval()
LEX = bundle.get_dict(star=None)
with torch.inference_mode():
    em, _ = model(w16.unsqueeze(0))
tgt = torch.tensor([[LEX[c] for _, p in toks for c in p if c in LEX]], dtype=torch.int32)
ali, sc = forced_align(em, tgt, blank=0)
spans = merge_tokens(ali[0], sc[0].exp())
ratio = w16.shape[0] / em.shape[1] / 16000
per = {}
i = 0
for ri, p in toks:  # potongan kata ("kesalahan-kesalahan" = 2 potongan) disatukan lagi per token naskah
    n = len([c for c in p if c in LEX])
    g = spans[i:i + n]
    i += n
    d = per.setdefault(ri, {"a": g[0].start * ratio, "b": 0, "s": []})
    d["b"] = g[-1].end * ratio
    d["s"] += [s.score for s in g]
kata = [{"w": raw_toks[ri], "a": per[ri]["a"], "b": per[ri]["b"], "score": float(np.mean(per[ri]["s"]))} for ri in range(len(raw_toks))]
assert [k["w"] for k in kata] == raw_toks, "kata alignment != naskah"
assert min(k["score"] for k in kata) >= 0.5, f"ada kata berskor rendah — periksa VO: {[(k['w'], round(k['score'], 2)) for k in kata]}"

# 2 · potong + pudar tepi
a0, b0 = kata[0]["a"] - PRE, kata[-1]["b"] + POST
s0, s1 = max(0, round(a0 * SR)), min(len(x), round(b0 * SR))
seg = x[s0:s1].copy()
nf = int(FADE * SR)
ramp = np.linspace(0, 1, nf)
seg[:nf] *= ramp
seg[-nf:] *= ramp[::-1]
seg = np.concatenate([np.zeros(max(0, round(-a0 * SR))), seg, np.zeros(max(0, round(b0 * SR) - len(x)))])
t0 = a0  # detik (relatif CUT) pada sampel 0 klip

# 3 · kekerasan disamakan dengan 60 dtk terakhir VO isi
u, usr = sf.read(VO_UTAMA, dtype="float64")
assert usr == SR
um = u.mean(1) if u.ndim > 1 else u
rms = lambda v: float(np.sqrt(np.mean(v[np.abs(v) > 1e-3] ** 2)))
gain = rms(um[-60 * SR:]) / rms(seg)
seg = np.clip(seg * gain, -1, 1)
klip = np.stack([seg, seg], 1)
sf.write(ROOT / "public/vo/outro_selanjutnya.wav", klip, SR, subtype="PCM_16")
sf.write(EPS / "01_VO/Outro - Di video selanjutnya (V05).wav", klip, SR, subtype="PCM_16")

# 4 · ketukan (frame LOKAL outro), cue, panjang blok
klipF = math.ceil(len(seg) / SR * FPS)
N = VO_AT + klipF + HOLD
lok = [{"w": k["w"], "a": round(VO_AT + (k["a"] - t0) * FPS, 1), "b": round(VO_AT + (k["b"] - t0) * FPS, 1)} for k in kata]
on = lambda w, n=1: [k for k in lok if k["w"].strip(",.").lower() == w][n - 1]["a"]
cues, j = [], 0
for t in BARIS:
    m = len(t.split())
    grp = lok[j:j + m]
    j += m
    cues.append({"a": math.floor(grp[0]["a"]) - 2, "b": math.ceil(grp[-1]["b"]), "t": t})
for c, d in zip(cues, cues[1:] + [None]):  # tahan sampai cue berikut (tanpa kedip); cue terakhir +20f
    c["b"] = d["a"] if d else min(N - 1, c["b"] + 20)
beat = {
    "judul": [{"teks": "Kesalahan yang Sering Bikin", "at": round((on("kesalahan-kesalahan") + on("saja")) / 2)},
              {"teks": "Investor Salah Langkah", "at": round((on("investor") + on("langkah")) / 2)}],
    "putar": round(on("kesalahan-kesalahan")),
    "k": {w: round(on(w)) for w in ["selanjutnya", "kesalahan-kesalahan", "apa", "sering", "bikin", "investor", "salah", "langkah"]},
}

ts = ["// DIBANGKITKAN scripts/gen-outro.py (outro 'Di video selanjutnya', naskah revisi V05 21 Okt) — jangan edit tangan.",
      "// Frame LOKAL outro (0 = awal blok = OUTRO_AT global); VO outro dipasang di frame lokal OUTRO_VO.at. Ketukan = onset kata MMS_FA.",
      f"export const OUTRO_AT = {OUTRO_AT};",
      f"export const OUTRO_N = {N};",
      f"export const OUTRO_VO = {json.dumps({'at': VO_AT, 'frames': klipF})} as const;",
      f"export const OUTRO_KATA: {{ w: string; a: number; b: number }}[] = {json.dumps(lok, ensure_ascii=False)};",
      "/** cue subtitle = baris Simon (1 baris = 1 cue), frame LOKAL; b inklusif seperti CUES */",
      f"export const OUTRO_CUES: {{ a: number; b: number; t: string }}[] = {json.dumps(cues, ensure_ascii=False)};",
      f"export const OUTRO_BEAT = {json.dumps(beat, ensure_ascii=False)};", ""]
(ROOT / "src/outro").mkdir(exist_ok=True)
(ROOT / "src/outro/plan.gen.ts").write_text("\n".join(ts), encoding="utf-8")
(ROOT / "sync/outro.json").write_text(json.dumps({"outro_at": OUTRO_AT, "n": N, "vo_at": VO_AT, "kata": lok, "cues": cues}, ensure_ascii=False, indent=1), encoding="utf-8")

# 5 · VO isi + outro = satu berkas dari frame 0 (nama memuat frame mulai VO outro)
mulai = OUTRO_AT + VO_AT
uu = u if u.ndim > 1 else np.stack([u, u], 1)
pad = np.zeros((round(mulai / FPS * SR) - len(uu), 2))
assert len(pad) >= 0, "VO isi lebih panjang dari awal VO outro"
gab = np.concatenate([uu, pad, klip])
nama = f"vo/inv05_vo_v3_outro{mulai}.wav"
sf.write(ROOT / "public" / nama, gab, SR, subtype="PCM_16")
sf.write(EPS / "01_VO/Video05_VO_v2_isi+outro.wav", gab, SR, subtype="PCM_16")

print(f"OUTRO_AT {OUTRO_AT} · N {N} (VO_AT {VO_AT} + klip {klipF} + HOLD {HOLD}) · TOTAL video {OUTRO_AT + N} · gain {20 * np.log10(gain):+.2f} dB")
for k in kata:
    print(f"   skor {k['score']:.2f}  {k['w']}")
for k in lok:
    print(f"   f{k['a']:6.1f}–{k['b']:6.1f}  {k['w']}")
print("cue", cues)
print("beat", beat)
print("VO gabungan:", nama, f"({len(gab) / SR:.3f} dtk)")
