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
# V06: token dipisah di em dash, teks tanpa spasi sesudah "—" (sama dengan gen-cues.py)
tokens = lambda line: [x for t in line.split() for x in re.split(r"(?<=—)(?=\S)", t)]
def sambung(ts):
    out = ""
    for t in ts: out += ("" if not out or out.endswith("—") else " ") + t
    return out
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
    n = len(tokens(c["t"])); owner += [c] * n
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
srt = (ASSET / "Video 06 - Kesalahan yang Paling Sering Dilakukan Investor_ID.srt").read_text(encoding="utf-8-sig").strip().split("\n\n")
def fr(t):
    h, m, s = t.split(":"); s, ms = s.split(","); return round((int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000) * FPS)
for blk, c in zip(srt, cues):
    n, tc, tx = blk.split("\n")
    a, b = tc.split(" --> ")
    if (fr(a), fr(b)) != (c["a"], c["b"]) or re.sub(r"</?font[^>]*>", "", tx) != c["t"]: err.append(f"SRT {n} != cues.ts")
# V06: SRT = cue isi + cue outro (sync/outro.json, frame lokal + TOTAL) — dulu QA hanya dijalankan sebelum outro ada
ocues = []
if (ROOT / "sync/outro.json").exists():
    o = json.loads((ROOT / "sync/outro.json").read_text())
    TOT = int(re.search(r"TOTAL = (\d+)", src).group(1))
    if o["outro_at"] != TOT: err.append("sync/outro.json basi (TOTAL berubah) — jalankan ulang gen-outro.py")
    ocues = [dict(i=len(cues) + j + 1, a=TOT + c["a"], b=TOT + c["b"], t=c["t"]) for j, c in enumerate(o["cues"])]
for blk, c in zip(srt[len(cues):], ocues):
    n, tc, tx = blk.split("\n")
    a, b = tc.split(" --> ")
    if (fr(a), fr(b)) != (c["a"], c["b"]) or re.sub(r"</?font[^>]*>", "", tx) != c["t"]: err.append(f"SRT {n} (outro) != sync/outro.json")
if len(srt) != len(cues) + len(ocues): err.append("jumlah SRT != cues.ts + outro")
baris = [l.strip() for l in (ROOT / "sync/SUBTITLE-BARIS.txt").read_text(encoding="utf-8").splitlines() if l.strip()]
q, gabung = 0, 0
for ln, line in enumerate(baris, 1):
    acc = []
    while q < len(cues) and sambung(acc) != line and len(sambung(acc)) < len(line):
        acc.append(cues[q]["t"]); q += 1
    if sambung(acc) != line: err.append(f"baris Simon {ln} tidak tersusun dari cue: {line!r}"); break
    gabung += len(acc) > 1
    # V06: baris yang muat BOLEH dipecah hanya di akhir kalimat (satu cue = satu kalimat, Simon 23 Okt)
    if len(acc) > 1 and lebar(line) <= MAXW and not all(re.search(r"[.?!][”\"]?$", a) for a in acc[:-1]):
        err.append(f"baris Simon {ln} muat satu baris tapi dipecah jadi {len(acc)} cue di luar akhir kalimat")
for c in cues:  # SATU CUE = SATU KALIMAT: tak ada akhir kalimat di TENGAH cue (kutipan tanya di tengah kalimat dikecualikan: ?” diikuti huruf kecil)
    tk = tokens(c["t"])
    for a, b in zip(tk, tk[1:]):
        if re.search(r"[.!][”\"]?$", a) or (re.search(r"\?[”\"]?$", a) and b[:1].isupper()):
            err.append(f"cue {c['i']} memuat >1 kalimat: {c['t']!r}"); break
for c in cues:
    if lebar(c["t"]) > MAXW: err.append(f"cue {c['i']} {lebar(c['t']):.0f}px > safe area {MAXW}px")
if q != len(cues) and not err: err.append("cue tersisa sesudah baris Simon habis")
print(f"{len(cues)} cue · {len(baris)} baris Simon ({gabung} ditampilkan sbg cue berurutan) · {len(data['words'])} kata diuji · onset kata {min(late):.0f}…{max(late):.0f} frame sesudah awal cue-nya")
for e in err: print("  ✗", e)
print("BERSIH ✓" if not err else f"{len(err)} TEMUAN"); sys.exit(1 if err else 0)
