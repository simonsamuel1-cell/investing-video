#!/usr/bin/env python3
"""Analisis hasil pindai-diam.mjs: perubahan antar-sampel (skala 1/4, tanpa pita subtitle & watermark) dan isi tinta.
   python3 scripts/pindai-diam.py Ide-S05 15  -> daftar jendela diam/kosong + kalimat VO yang sedang diucapkan."""
import sys, glob, json, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
comp, step = sys.argv[1], int(sys.argv[2])
sc = int(re.search(r"S(\d+)", comp).group(1))
fs = sorted(glob.glob(str(ROOT / f"out/pindai/{comp}/f*.png")))
def muat(p):
    a = np.asarray(Image.open(p).convert("L")).astype(np.float32)
    a[int(0.86 * a.shape[0]):, :] = 0; a[: int(0.15 * a.shape[0]), int(0.75 * a.shape[1]):] = 0   # subtitle, watermark
    return a
A = [muat(p) for p in fs]
awal = int(re.search(r"s%d: O \+ (\d+)" % sc, (ROOT / "src/batas.ts").read_text()).group(1)) if sc > 1 else 0
OFS = int(re.search(r"VO_OFFSET = (\d+)", (ROOT / "src/offset.ts").read_text()).group(1))
awal = awal + OFS if sc > 1 else 0
cues = [dict(a=int(m[0]), b=int(m[1]), t=json.loads(m[2])) for m in re.findall(r"a: (\d+), b: (\d+), t: (\"(?:[^\"\\\\]|\\\\.)*\")", (ROOT / "src/cues.ts").read_text())]
def kalimat(g):
    for c in cues:
        if c["a"] <= g <= c["b"]: return c["t"]
    return "—"
ubah = [0.0] + [float(np.abs(A[i] - A[i - 1]).mean()) for i in range(1, len(A))]
tinta = [float((a < 200).mean() * 100) for a in A]   # % piksel bertinta (latar terang)
AMBANG = 0.25; MIN = max(1, round(60 / step))  # >= 1 dtk
jendela, i = [], 0
while i < len(A):
    if ubah[i] < AMBANG:
        j = i
        while j + 1 < len(A) and ubah[j + 1] < AMBANG: j += 1
        if j - i + 1 >= MIN: jendela.append((i, j))
        i = j + 1
    else: i += 1
print(f"{comp}: {len(A)} sampel tiap {step}f · awal global f{awal}")
for i, j in jendela:
    fa, fb = i * step, j * step
    print(f"  DIAM {fa/60:5.1f}–{fb/60:5.1f} dtk ({(fb-fa)/60:.1f} dtk) · tinta {min(tinta[i:j+1]):.1f}% · VO: {kalimat(awal + (fa + fb)//2)[:90]}")
kosong = [k for k in range(len(A)) if tinta[k] < 1.0]
if kosong: print("  KOSONG (tinta<1%):", ", ".join(f"{k*step/60:.1f}" for k in kosong))
