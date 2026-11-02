#!/usr/bin/env python3
"""
BARIS SUBTITLE Video 05 → sync/SUBTITLE-BARIS.txt (dipakai gen-cues.py: 1 baris = 1 cue).
Naskah Simon ditulis per FRASA pendek ("bank,", "Pertama,") — 1 frasa = 1 cue akan berkedip ±0,5 dtk. Aturan di sini:
  · baris naskah dalam SATU KALIMAT digabung jadi satu cue selama masih muat satu baris layar (Bold 35, ≤ 1728 px);
  · kalimat yang lebih lebar dipotong HANYA di jeda baris naskah Simon — pecahan sesedikit mungkin, lalu yang paling rata;
  · tidak pernah melintasi scene. Baris naskah tunggal yang > 1728 px tetap utuh (gen-cues.py memotongnya di koma Simon).
Bila Simon mengirim pembagian baris sendiri, berkas ini diganti baris Simon (feedback_subtitle_baris_simon).
"""
import itertools, os, pathlib, re
from PIL import ImageFont
ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = ROOT.parent / "04_Asset" / "VO-Script-Video05.md"
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728
def lebar(t):
    l, _, r, _ = FONT.getbbox(t); return r - l - 0.35 * (len(t) - 1)
akhir = lambda l: bool(re.search(r"[.?!][”\"]?$", l))
scenes, cur = [], None
for line in MD.read_text(encoding="utf-8").splitlines():
    if line.startswith("## SCENE"): cur = []; scenes.append(cur); continue
    if cur is not None and line.strip(): cur.append(line.strip())
out = []
for sc in scenes:
    kal, buf = [], []
    for l in sc:
        buf.append(l)
        if akhir(l): kal.append(buf); buf = []
    if buf: kal.append(buf)
    for k in kal:
        if lebar(" ".join(k)) <= MAXW: out.append(" ".join(k)); continue
        best = None
        for n in range(1, len(k)):
            for cut in itertools.combinations(range(1, len(k)), n):
                parts = [" ".join(k[a:b]) for a, b in zip((0,) + cut, cut + (len(k),))]
                w = [lebar(p) for p in parts]
                if max(w) <= MAXW or all(len(k[a:b]) == 1 for a, b in zip((0,) + cut, cut + (len(k),)) if lebar(" ".join(k[a:b])) > MAXW):
                    if max(w) <= MAXW or n == len(k) - 1:
                        cand = (max(w) - min(w), parts)
                        best = cand if best is None or cand[0] < best[0] else best
            if best: break
        out += best[1]
(ROOT / "sync/SUBTITLE-BARIS.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
print(len(out), "baris subtitle dari", sum(len(s) for s in scenes), "baris naskah")
