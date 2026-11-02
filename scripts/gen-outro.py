#!/usr/bin/env python3
"""
OUTRO "DI VIDEO SELANJUTNYA" Investing 101 · Video 06 (salinan metode Video 03 tiga-uang-episode/scripts/gen-outro.py) —
VO terpisah 01_VO/MiniMax_2026-10-23_15_39_24_Compelling_Storyteller.mp3 (Simon 23 Okt: "ini voice untuk outronya"), naskah (1 baris Simon):
    Di video selanjutnya, kita akan lihat bagaimana Tuntun membantu investor berpikir lebih jernih dan mengurangi kesalahan sebelum mengambil keputusan.
Barisnya 2.524 px (> safe area 1.728 px) → 2 cue, dipotong seperti gen-cues.pecah_baris: koma saja tidak cukup (sisa 2.173 px),
jadi satu potongan di batas klausa sebelum "dan" (paling rata, keduanya muat).

Langkah (satu jalan, tanpa tangan):
  1. mp3 → WAV 48 kHz (afconvert) → forced alignment MMS_FA per kata (penjaga: kata == naskah, skor ≥ 0,5)
  2. potong: 0,30 dtk sebelum kata pertama · 0,45 dtk sesudah kata terakhir (kurang → diisi hening), pudar tepi 8 ms
  3. kekerasan disamakan dengan 60 dtk terakhir VO utama (RMS bagian bersuara) → stereo 48 kHz
  4. blok outro mulai di OUTRO_AT = TOTAL isi (src/cues.ts, sudah termasuk ekor 30f); VO outro di frame lokal VO_AT = 28; N = VO_AT + klip + HOLD 33
  5. keluaran: public/vo/outro_selanjutnya.wav · 01_VO/Outro - Di video selanjutnya (V06).wav (salinan untuk Premiere) ·
     public/vo/inv06_vo_outro<frame>.wav + 01_VO/Video06_VO_isi+outro.wav (VO utama + outro, SATU berkas dari frame 0) ·
     src/outro/plan.gen.ts (frame LOKAL) · sync/outro.json (dipakai gen-cues.py untuk SRT/JSON)
Jalankan:  ../../../_fondasi/.venv-align/bin/python scripts/gen-outro.py   lalu   python3 scripts/gen-cues.py
"""
import json, math, pathlib, re, subprocess, tempfile, unicodedata
import numpy as np
import soundfile as sf
import torch, torchaudio
from torchaudio.functional import forced_align, merge_tokens

ROOT = pathlib.Path(__file__).resolve().parent.parent
EPS = ROOT.parent
MP3 = EPS / "01_VO/MiniMax_2026-10-23_15_39_24_Compelling_Storyteller.mp3"
VO_UTAMA = ROOT / "public/vo/inv06_vo.wav"
BARIS = ["Di video selanjutnya, kita akan lihat bagaimana Tuntun membantu investor berpikir lebih jernih",
         "dan mengurangi kesalahan sebelum mengambil keputusan."]
FPS, SR = 60, 48000
PRE, POST, FADE = 0.30, 0.45, 0.008
VO_AT, HOLD = 28, 33
OUTRO_AT = int(re.search(r"export const TOTAL = (\d+);", (ROOT / "src/cues.ts").read_text()).group(1))


def norm(w):
    w = unicodedata.normalize("NFKD", w)
    w = "".join(c for c in w if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z' ]", " ", w.replace("-", " ")).split()


# 1 · WAV + alignment
tmp = pathlib.Path(tempfile.mkdtemp())
subprocess.run(["/usr/bin/afconvert", "-f", "WAVE", "-d", f"LEI16@{SR}", "-c", "1", str(MP3), str(tmp / "o48.wav")], check=True)
subprocess.run(["/usr/bin/afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", str(MP3), str(tmp / "o16.wav")], check=True)
x, sr = sf.read(tmp / "o48.wav", dtype="float64")
assert sr == SR
w16, _ = torchaudio.load(str(tmp / "o16.wav"))
w16 = w16[0]
teks = " ".join(BARIS)
toks = [(raw, p) for raw in teks.split() for p in norm(raw)]
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
kata, i = [], 0
for raw, p in toks:
    n = len([c for c in p if c in LEX])
    g = spans[i:i + n]
    i += n
    kata.append({"w": raw, "a": g[0].start * ratio, "b": g[-1].end * ratio, "score": float(sum(s.score for s in g) / len(g))})
assert [k["w"] for k in kata] == teks.split(), "kata alignment != naskah"
assert min(k["score"] for k in kata) >= 0.5, "ada kata berskor rendah — periksa VO"

# 2 · potong + pudar tepi
a0, b0 = kata[0]["a"] - PRE, kata[-1]["b"] + POST
s0, s1 = max(0, round(a0 * SR)), min(len(x), round(b0 * SR))
seg = x[s0:s1].copy()
nf = int(FADE * SR)
ramp = np.linspace(0, 1, nf)
seg[:nf] *= ramp
seg[-nf:] *= ramp[::-1]
seg = np.concatenate([np.zeros(max(0, round(-a0 * SR))), seg, np.zeros(max(0, round(b0 * SR) - len(x)))])
t0 = a0  # detik sumber pada sampel 0 klip

# 3 · kekerasan disamakan dengan 60 dtk terakhir VO utama
u, usr = sf.read(VO_UTAMA, dtype="float64")
assert usr == SR
um = u.mean(1) if u.ndim > 1 else u
rms = lambda v: float(np.sqrt(np.mean(v[np.abs(v) > 1e-3] ** 2)))
ekor = um[-60 * SR:]
gain = rms(ekor) / rms(seg)
seg = np.clip(seg * gain, -1, 1)
klip = np.stack([seg, seg], 1)
(ROOT / "public/vo").mkdir(exist_ok=True)
sf.write(ROOT / "public/vo/outro_selanjutnya.wav", klip, SR, subtype="PCM_16")
sf.write(EPS / "01_VO/Outro - Di video selanjutnya (V06).wav", klip, SR, subtype="PCM_16")

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
# judul = ENDING BRIDGE naskah ("Bagaimana Tuntun Membantu Investor Mengurangi Kesalahan") — halaman outro V06 belum dibangun
beat = {
    "judul": [{"teks": "Bagaimana Tuntun Membantu", "at": round((on("bagaimana") + on("membantu")) / 2)},
              {"teks": "Investor Mengurangi Kesalahan", "at": round((on("investor") + on("kesalahan")) / 2)}],
    "putar": round(on("bagaimana")),
    "k": {w: round(on(w)) for w in ["selanjutnya", "lihat", "bagaimana", "tuntun", "membantu", "investor", "berpikir", "jernih", "mengurangi", "kesalahan", "keputusan"]},
}

ts = ["// DIBANGKITKAN scripts/gen-outro.py (outro 'Di video selanjutnya', Video 06 23 Okt) — jangan edit tangan.",
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

# 5 · VO utama + outro = satu berkas dari frame 0 (nama memuat frame mulai VO outro)
mulai = OUTRO_AT + VO_AT
uu = u if u.ndim > 1 else np.stack([u, u], 1)
pad = np.zeros((round(mulai / FPS * SR) - len(uu), 2))
assert len(pad) >= 0, "VO utama lebih panjang dari awal VO outro"
gab = np.concatenate([uu, pad, klip])
nama = f"vo/inv06_vo_outro{mulai}.wav"
sf.write(ROOT / "public" / nama, gab, SR, subtype="PCM_16")
sf.write(EPS / "01_VO/Video06_VO_isi+outro.wav", gab, SR, subtype="PCM_16")
# vo.ts menunjuk berkas gabungan ini (nama baru tiap TOTAL berubah — cache Studio)
vo = ROOT / "src/vo.ts"
vo.write_text(re.sub(r"export const VO_UTUH = '[^']*';", f"export const VO_UTUH = '{nama}';", vo.read_text()), encoding="utf-8")

print(f"OUTRO_AT {OUTRO_AT} · N {N} (VO_AT {VO_AT} + klip {klipF} + HOLD {HOLD}) · TOTAL video {OUTRO_AT + N} · gain {20 * np.log10(gain):+.2f} dB")
for k in lok:
    print(f"   f{k['a']:6.1f}–{k['b']:6.1f}  {k['w']}")
print("cue", cues)
print("beat", beat)
print("VO gabungan:", nama, f"({len(gab) / SR:.3f} dtk)")
