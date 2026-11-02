#!/usr/bin/env python3
"""QA subtitle vs VO (dijalankan sesudah gen-cues.py). Gagal = keluar 1.
 1. tiap kata (onset & ujung MMS) jatuh di dalam jendela cue MILIKNYA (teks cue memuat kata itu)
 2. tidak ada suara (segmen bersuara ≥ 0,25 dtk) yang tidak tertutup cue mana pun
 3. SRT == src/cues.ts (frame & teks) — penjaga data basi
 4. cues.ts lebih baru dari vo-words.json, naskah & SUBTITLE-BARIS.txt
 5. baris Simon (sync/SUBTITLE-BARIS.txt) tersusun ulang PERSIS dari cue berurutan — tiap batas baris = batas cue;
    satu baris boleh jadi >1 cue HANYA bila lebih lebar dari safe area; tiap cue ≤ 1728 px"""
import json, os, pathlib, re, sys
from PIL import ImageFont
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728
def lebar(t):
    l, _, r, _ = FONT.getbbox(t); return r - l - 0.35 * (len(t) - 1)
ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSET = ROOT.parent / "04_Asset"
FPS = 60
OFS = int(re.search(r"VO_OFFSET = (\d+)", (pathlib.Path(__file__).resolve().parent.parent / "src/offset.ts").read_text()).group(1))  # cue = frame VIDEO; VO mulai di OFS
err = []
src = (ROOT / "src/cues.ts").read_text(encoding="utf-8")
cues = [dict(i=int(m[0]), a=int(m[1]), b=int(m[2]), t=json.loads(m[3])) for m in
        re.findall(r"\{ i: (\d+), k: \d+, sc: \d+, a: (\d+), b: (\d+), t: (\".*?\") \}", src)]
for dep in ["sync/vo-words.json", "sync/NASKAH.txt", "sync/SUBTITLE-BARIS.txt"]:
    if (ROOT / dep).stat().st_mtime > (ROOT / "src/cues.ts").stat().st_mtime: err.append(f"cues.ts lebih tua dari {dep} — jalankan gen-cues.py")
data = json.loads((ROOT / "sync/vo-words.json").read_text())
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
# token -> cue (urutan)
owner, k = [], 0
for c in cues:
    n = len(c["t"].split()); owner += [c] * n
assert len(owner) == len(toks), (len(owner), len(toks))
late = []
for w in data["words"]:
    c = owner[w["tid"]]
    fa, fb = w["a"] * FPS + OFS, w["b"] * FPS + OFS
    if fa < c["a"] - 0.5: err.append(f"kata '{w['w']}' {fa:.0f} sebelum cue {c['i']} mulai ({c['a']})")
    if fb > c["b"] + 0.5: err.append(f"kata '{w['w']}' berakhir {fb:.0f} sesudah cue {c['i']} selesai ({c['b']})")
    late.append(fa - c["a"])
for a, b in data["energi"]["voiced"]:
    if b - a < 0.25: continue
    fa, fb = a * FPS + OFS, b * FPS + OFS
    cov = sum(max(0, min(fb, c["b"]) - max(fa, c["a"])) for c in cues)
    if cov < (fb - fa) - 6: err.append(f"suara {a:.2f}–{b:.2f}s tertutup cue hanya {cov:.0f}/{fb - fa:.0f} frame")
srt = (ASSET / "Video 02 - Investment Instruments_ID.srt").read_text(encoding="utf-8-sig").strip().split("\n\n")
def fr(t):
    h, m, s = t.split(":"); s, ms = s.split(","); return round((int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000) * FPS)
for blk, c in zip(srt, cues):
    n, tc, tx = blk.split("\n")
    a, b = tc.split(" --> ")
    if (fr(a), fr(b)) != (c["a"], c["b"]) or re.sub(r"</?font[^>]*>", "", tx) != c["t"]: err.append(f"SRT {n} != cues.ts")
if len(srt) != len(cues): err.append("jumlah SRT != cues.ts")
baris = [l.strip() for l in (ROOT / "sync/SUBTITLE-BARIS.txt").read_text(encoding="utf-8").splitlines() if l.strip()]
q, gabung = 0, 0
for ln, line in enumerate(baris, 1):
    acc = []
    while q < len(cues) and " ".join(acc) != line and len(" ".join(acc)) < len(line):
        acc.append(cues[q]["t"]); q += 1
    if " ".join(acc) != line: err.append(f"baris Simon {ln} tidak tersusun dari cue: {line!r}"); break
    gabung += len(acc) > 1
    if len(acc) > 1 and lebar(line) <= MAXW: err.append(f"baris Simon {ln} muat satu baris tapi dipecah jadi {len(acc)} cue")
for c in cues:
    if lebar(c["t"]) > MAXW: err.append(f"cue {c['i']} {lebar(c['t']):.0f}px > safe area {MAXW}px")
if q != len(cues) and not err: err.append("cue tersisa sesudah baris Simon habis")
print(f"{len(cues)} cue · {len(baris)} baris Simon ({gabung} ditampilkan sbg cue berurutan) · {len(data['words'])} kata diuji · onset kata {min(late):.0f}…{max(late):.0f} frame sesudah awal cue-nya")
for e in err: print("  ✗", e)
print("BERSIH ✓" if not err else f"{len(err)} TEMUAN"); sys.exit(1 if err else 0)
