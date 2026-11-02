#!/usr/bin/env python3
"""
CUE SUBTITLE Investing 101 · Video 02 — dari sync/vo-words.json (forced alignment MMS) +
sync/SUBTITLE-BARIS.txt (pembagian baris dari Simon, 6 Okt: "ikuti penulisan yang di script yang aku lampirkan,
dan pastikan tetap masih 1 line").

Aturan:
  · SATU baris Simon = SATU cue, teksnya persis baris itu.
  · Satu baris di layar (Plus Jakarta Sans Bold 35, ATURAN §2). Baris yang LEBIH LEBAR dari safe area
    (L96–R1824 = 1728 px, diukur dengan berkas fon aslinya) tidak mungkin satu baris pada 35 px -> ditampilkan
    sebagai cue BERURUTAN, dipotong HANYA di koma Simon sendiri (pecahan sesedikit mungkin, lalu paling rata).
  · AWAL cue yang membuka kalimat = awal segmen bersuara yang memuat onset kata pertama; AKHIR cue yang menutup
    kalimat = ujung segmen bersuara yang memuat ujung kata terakhir (MMS memotong ekor vokal).
  · cue di dalam satu kalimat BERSAMBUNG: ganti tepat di onset kata pertama cue berikutnya.
  · token tanpa huruf (panah "→") tidak punya waktu sendiri; ikut tetangganya.
Penjaga: kata baris == naskah (urutan & ejaan), teks cue digabung == naskah, kalau tidak -> berhenti.

Keluaran: src/cues.ts · ../04_Asset/<EP>_ID.srt · <EP>_ID.json · cek-subtitle.html
"""
import itertools, json, math, os, pathlib, re
from PIL import ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSET = ROOT.parent / "04_Asset"
MD = pathlib.Path(os.environ.get("GC_MD", ASSET / "VO-Script-Investment-Instruments-Revisi-Lengkap.md"))  # v4 lama: VO-Script-Investment-Instruments.md
BARIS = pathlib.Path(os.environ.get("GC_BARIS", ROOT / "sync/SUBTITLE-BARIS.txt"))
# penimpaan lewat env untuk versi VO lain (v5 = naskah revisi 16 Okt): GC_MD, GC_BARIS, GC_NASKAH, GC_WORDS, GC_TS, GC_FILE,
# GC_HTML, GC_VO, GC_VO_PAGE, GC_BAB (json {scene: bab})
NASKAH_P = pathlib.Path(os.environ.get("GC_NASKAH", ROOT / "sync/NASKAH.txt"))
WORDS_P = pathlib.Path(os.environ.get("GC_WORDS", ROOT / "sync/vo-words.json"))
TS_P = pathlib.Path(os.environ.get("GC_TS", ROOT / "src/cues.ts"))
VO_NAMA = os.environ.get("GC_VO", "inv02_vo_v5.wav")
EP = "Video 02 - Investment Instruments"
FPS = 60
OFFSET = int(re.search(r'VO_OFFSET = (\d+)', (pathlib.Path(__file__).resolve().parent.parent / 'src/offset.ts').read_text()).group(1))  # src/offset.ts (Simon 7 Okt: VO mulai 00:00.31)
VO_PAGE = os.environ.get("GC_VO_PAGE", "../01_VO/VO_Investment-Instruments_revisi-16okt.wav")  # VO v5 (splice-vo3.py)
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728  # safe area L96..R1824


def lebar(t):
    """lebar tinta pada Bold 35 + letterSpacing −0,01em (Subtitles.tsx); terkalibrasi ±2% ke render"""
    l, _, r, _ = FONT.getbbox(t)
    return r - l - 0.35 * (len(t) - 1)


# BAB = judul bagian di naskah Simon (01 — Tabungan & Deposito, dst.). Scene 12–13 tanpa judul bab di
# naskah; dikelompokkan sebagai "Penutup" (label timeline + rona latar saja, tidak tampil di video).
# naskah REVISI 16 Okt (10 scene). Rangkuman = bab sendiri (rona latar biru) → Penutup tetap krim seperti v4.
BAB = {1: "Pembuka", 2: "01 — Tabungan & Deposito", 3: "02 — Emas", 4: "03 — Properti", 5: "04 — Obligasi Pemerintah",
       6: "05 — Reksa Dana", 7: "06 — Saham", 8: "06 — Saham", 9: "Rangkuman", 10: "Penutup"}
if os.environ.get("GC_BAB"): BAB = {int(k): v for k, v in json.loads(os.environ["GC_BAB"]).items()}

# ── naskah: token + baris + scene ──
toks, scene_of, line_of = [], [], []
sc, ln = 0, 0
for line in MD.read_text(encoding="utf-8").splitlines():
    m = re.match(r"## SCENE (\d+)", line)
    if m: sc = int(m.group(1)); continue
    if not line.strip() or line.startswith("#") or line.startswith("---") or line.startswith("Narasi saja"): continue
    ln += 1
    for t in line.split():
        toks.append(t); scene_of.append(sc); line_of.append(ln)
naskah = NASKAH_P.read_text(encoding="utf-8")
assert toks == naskah.split(), "NASKAH.txt != VO-Script md"

data = json.loads(WORDS_P.read_text())
V = data["energi"]["voiced"]
dur = data["meta"]["durasi_s"]
A, Bw = [None] * len(toks), [None] * len(toks)
for w in data["words"]:
    assert toks[w["tid"]] == w["w"], f"token {w['tid']} {w['w']!r} != naskah {toks[w['tid']]!r}"
    A[w["tid"]], Bw[w["tid"]] = w["a"], w["b"]
for i in range(len(toks)):  # token tanpa waktu (panah) -> celah di antara tetangganya
    if A[i] is None:
        p = next(j for j in range(i - 1, -1, -1) if Bw[j] is not None)
        n = next(j for j in range(i + 1, len(toks)) if A[j] is not None)
        A[i], Bw[i] = Bw[p], A[n]
assert all(A[i] <= A[i + 1] for i in range(len(toks) - 1)), "onset kata tidak monoton"


def seg_of(t, tol):
    for a, b in V:
        if a - tol <= t <= b + tol: return a, b
    return None


txt = lambda idx: " ".join(toks[i] for i in idx)
akhir_kalimat = lambda i: bool(re.search(r"[.?!][”\"]?$", toks[i]))
kal_of, k = [], 1
for i in range(len(toks)):
    kal_of.append(k)
    if akhir_kalimat(i): k += 1


def pecah_baris(idx):
    """baris > MAXW -> dipotong di koma Simon: pecahan sesedikit mungkin, lalu yang paling rata"""
    koma = [j for j in range(1, len(idx)) if re.search(r",$", toks[idx[j - 1]])]
    for n in range(1, len(koma) + 1):
        pilihan = []
        for cut in itertools.combinations(koma, n):
            parts = [idx[x:y] for x, y in zip((0,) + cut, cut + (len(idx),))]
            w = [lebar(txt(q)) for q in parts]
            if max(w) <= MAXW: pilihan.append((max(w) - min(w), parts))
        if pilihan: return min(pilihan, key=lambda z: z[0])[1]
    raise SystemExit(f"baris tak bisa dipotong di koma: {txt(idx)}")


units, i0, PECAH = [], 0, []
for ln, line in enumerate((l.strip() for l in BARIS.read_text(encoding="utf-8").splitlines()), 1):
    if not line: continue
    idx = list(range(i0, i0 + len(line.split()))); i0 += len(idx)
    assert txt(idx) == line, f"baris {ln} != naskah: {line!r} vs {txt(idx)!r}"
    if lebar(line) <= MAXW: units.append(idx)
    else:
        parts = pecah_baris(idx); units += parts
        PECAH.append((line, [txt(q) for q in parts]))
assert i0 == len(toks), "baris Simon tidak memuat seluruh naskah"
assert all(scene_of[u[0]] == scene_of[u[-1]] for u in units), "satu cue melintasi dua scene"

cues = []
for j, u in enumerate(units):
    buka = j == 0 or akhir_kalimat(units[j - 1][-1])
    s0 = seg_of(A[u[0]], 0.10)
    a = min(A[u[0]], s0[0]) if buka and s0 else A[u[0]]
    cues.append({"n": j + 1, "k": kal_of[u[0]], "sc": scene_of[u[0]], "t": txt(u), "a": a, "u": u,
                 "soft": not buka and (A[u[0]] - Bw[u[0] - 1]) < 0.15})  # batas tanpa jeda napas (tanda ~ V10)
for j, c in enumerate(cues):
    u, nxt = c.pop("u"), cues[j + 1] if j + 1 < len(cues) else None
    if akhir_kalimat(u[-1]) or nxt is None:
        s1 = seg_of(Bw[u[-1]], 0.05)
        c["b"] = max(Bw[u[-1]], s1[1]) if s1 else Bw[u[-1]]
        if nxt: c["b"] = min(c["b"], nxt["a"])
    else:
        c["b"] = nxt["a"]

assert " ".join(c["t"] for c in cues) == " ".join(naskah.split()), "TEKS CUE != NASKAH"
assert all(lebar(c["t"]) <= MAXW for c in cues), "ada cue lebih lebar dari safe area"
for c in cues:
    c["fa"], c["fb"] = round(c["a"] * FPS) + OFFSET, round(c["b"] * FPS) + OFFSET  # frame VIDEO
for x, y in zip(cues, cues[1:]):
    assert x["fb"] <= y["fa"], f"cue {x['n']} menimpa {y['n']}"
TOTAL = math.ceil(dur * FPS) + OFFSET

# scene -> rentang frame (awal = awal cue pertamanya; akhir = awal scene berikutnya / TOTAL)
scenes = []
for s in sorted(set(c["sc"] for c in cues)):
    first = next(c for c in cues if c["sc"] == s)
    scenes.append({"n": s, "a": 0 if s == 1 else first["fa"], "bab": BAB[s]})
for x, y in zip(scenes, scenes[1:]): x["b"] = y["a"]
scenes[-1]["b"] = TOTAL

# ── src/cues.ts ──
ts = ["/* DIBANGKITKAN oleh scripts/gen-cues.py — jangan diedit tangan.",
      f" * VO: public/vo/{VO_NAMA} ({dur:.3f} dtk) · waktu = forced alignment MMS ({WORDS_P.relative_to(ROOT)}) */",
      "export type Cue = { i: number; k: number; sc: number; a: number; b: number; t: string };",
      "export type Scene = { n: number; a: number; b: number; bab: string };",
      f"export const TOTAL = {TOTAL};",
      "export const SCENES: Scene[] = ["]
for s in scenes:
    ts.append(f"  {{ n: {s['n']}, a: {s['a']}, b: {s['b']}, bab: {json.dumps(s['bab'], ensure_ascii=False)} }},")
ts += ["];", "export const CUES: Cue[] = ["]
for c in cues:
    ts.append(f"  {{ i: {c['n']}, k: {c['k']}, sc: {c['sc']}, a: {c['fa']}, b: {c['fb']}, t: {json.dumps(c['t'], ensure_ascii=False)} }},")
ts.append("];")
TS_P.write_text("\n".join(ts) + "\n", encoding="utf-8")


# ── SRT (format V10: BOM + font color brand) ──
def srt_t(f):
    ms = round(f / FPS * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = []
for c in cues:
    srt += [str(c["n"]), f"{srt_t(c['fa'])} --> {srt_t(c['fb'])}", f"<font color=#5F4DEEFF>{c['t']}</font>", ""]
(ASSET / f"{os.environ.get('GC_FILE', EP + '_ID')}.srt").write_text("﻿" + "\n".join(srt), encoding="utf-8")

(ASSET / f"{os.environ.get('GC_FILE', EP + '_ID')}.json").write_text(json.dumps([{
    "index": c["n"], "scene": c["sc"], "kalimat": c["k"], "start": round(c["fa"] / FPS, 3), "end": round(c["fb"] / FPS, 3),
    "startFrame30": round(c["fa"] / 2), "endFrame30": round(c["fb"] / 2),
    "startFrame60": c["fa"], "endFrame60": c["fb"], "text": c["t"], "checkTiming": c["soft"]} for c in cues],
    ensure_ascii=False, indent=1), encoding="utf-8")

# ── cek-subtitle.html (templat V10/CTA) ──
tpl = (ROOT / "scripts/cek-subtitle.tpl.html").read_text(encoding="utf-8")
page = [{"n": c["n"], "a": round(c["fa"] / FPS, 3), "b": round(c["fb"] / FPS, 3), "t": c["t"], "soft": c["soft"],
         "sc": f"Scene {c['sc']:02d} · {BAB[c['sc']]}"} for c in cues]
m_, s_ = divmod(dur, 60)
html = (tpl.replace("CTA Chart Pro", "Investing 101 · Video 02 Investment Instruments")
           .replace("{{CUES}}", json.dumps(page, ensure_ascii=False)).replace("{{N}}", str(len(cues)))
           .replace("{{DUR}}", f"{int(m_)}:{s_:05.2f}").replace("{{AUDIO}}", VO_PAGE)
           .replace("{{NSOFT}}", str(sum(c["soft"] for c in cues))))
(ASSET / os.environ.get("GC_HTML", "cek-subtitle.html")).write_text(html, encoding="utf-8")

print(f"{len(cues)} cue · {kal_of[-1]} kalimat · TOTAL {TOTAL} frame ({TOTAL / FPS:.3f} dtk) · teks == naskah ✓")
for s in scenes: print(f"  SCENE {s['n']:02d}  f{s['a']:>5}–{s['b']:<5}  {s['bab']}")
for c in cues:
    print(f"{c['n']:>3} S{c['sc']:02d} {'~' if c['soft'] else ' '} f{c['fa']:>5}–{c['fb']:<5} ({lebar(c['t']):4.0f}px)  {c['t']}")
print(f"\nbaris Simon yang lebih lebar dari safe area ({MAXW}px) -> cue berurutan: {len(PECAH)}")
for line, parts in PECAH:
    print(f"  {lebar(line):.0f}px  {line}")
    for q in parts: print(f"      → {q}")
