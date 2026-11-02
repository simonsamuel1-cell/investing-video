#!/usr/bin/env python3
"""
CUE SUBTITLE Investing 101 · Video 05 Jalur Bertumbuh Seorang Investor (salinan Video 03) — dari sync/vo-words.json (forced alignment MMS) +
sync/SUBTITLE-BARIS.txt (Video 05: dibangkitkan scripts/gen-baris.py — baris naskah Simon digabung per kalimat selama muat 1 baris;
akan diganti baris Simon bila ia mengirimnya — aturan V02 6 Okt "pastikan tetap masih 1 line").

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
MD = ASSET / "VO-Script-Video05.md"
BARIS = ROOT / "sync/SUBTITLE-BARIS.txt"
EP = "Video 05 - Jalur Bertumbuh Seorang Investor"
FPS = 60
OFFSET = int(re.search(r'VO_OFFSET = (\d+)', (pathlib.Path(__file__).resolve().parent.parent / 'src/offset.ts').read_text()).group(1))  # src/offset.ts 
VO_PAGE = "../01_VO/Video05_VO_v4_jeda_isi+outro.wav"  # 22 Okt sore v3 (v2: Video05_VO_v2_isi+outro.wav · v1: MiniMax_2026-10-19_14_34_40)
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728  # safe area L96..R1824


def lebar(t):
    """lebar tinta pada Bold 35 + letterSpacing −0,01em (Subtitles.tsx); terkalibrasi ±2% ke render"""
    l, _, r, _ = FONT.getbbox(t)
    return r - l - 0.35 * (len(t) - 1)


# BAB = judul scene di naskah Simon (04_Asset/Naskah-Lengkap-Simon.md) — label timeline Studio + rona latar saja, tidak tampil di video.
BAB = {1: "Banyak Pilihan, tapi Kebanyakan Orang Cocok di Dua Jalur",
       2: "Jalan Kaki: Kenapa Investasi Stabil Itu Penting?",
       3: "Naik Feri: Kenapa Indeks Cocok untuk Banyak Orang?",
       4: "Profesional Selalu Lebih Hebat dari Indeks?",
       5: "Indeks Juga Tempat Belajar Menghadapi Volatilitas",
       6: "Kapan Boleh Mulai Memilih Saham Sendiri?",
       7: "Tiga Langkah: Kembali ke Sungai",  # naskah revisi 22 Okt sore (S07 + S08 lama dipadatkan)
       8: "Mutual Fund Feature (RESERVED — belum dibuat)"}

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
naskah = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8")
assert toks == naskah.split(), "NASKAH.txt != VO-Script md"

data = json.loads((ROOT / "sync/vo-words.json").read_text())
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
    # CADANGAN (V03 S11, baris tanpa koma 1.9k px): potong SEKALI di batas klausa — sebelum kata pembuka klausa,
    # tidak pernah sesudah kata fungsi — titik yang paling rata. Dilaporkan ke Simon (daftar PECAH).
    pilihan = [(abs(lebar(txt(idx[:j])) - lebar(txt(idx[j:]))), [idx[:j], idx[j:]]) for j in range(1, len(idx))
               if toks[idx[j]].lower() in PEMBUKA and max(lebar(txt(idx[:j])), lebar(txt(idx[j:]))) <= MAXW]
    if pilihan: return min(pilihan, key=lambda z: z[0])[1]
    raise SystemExit(f"baris tak bisa dipotong di koma / batas klausa: {txt(idx)}")


PEMBUKA = {"jangan", "yang", "untuk", "karena", "dengan", "tapi", "dan", "atau", "supaya", "agar", "sebelum", "setelah", "kalau"}


# POTONG MANUAL (Simon 13 Okt: "jika ada kalimat yang tidak muat dalam 1 baris, pisahkan saja, mungkin kamu juga bisa
# merapihkannya sedikit"). Pemecah otomatis (koma, paling rata) memotong DAFTAR / FRASA di tengahnya pada 3 baris ini;
# di sini dipotong di batas makna. Baris lebar lainnya tetap lewat pecah_baris().
POTONG = {}  # Video 05: belum ada potongan manual
units, i0, PECAH = [], 0, []
for ln, line in enumerate((l.strip() for l in BARIS.read_text(encoding="utf-8").splitlines()), 1):
    if not line: continue
    idx = list(range(i0, i0 + len(line.split()))); i0 += len(idx)
    assert txt(idx) == line, f"baris {ln} != naskah: {line!r} vs {txt(idx)!r}"
    if lebar(line) <= MAXW: units.append(idx)
    else:
        if line in POTONG:  # potongan manual: teks digabung == baris Simon, tiap bagian <= MAXW
            n = [len(q.split()) for q in POTONG[line]]
            parts = [idx[sum(n[:k]):sum(n[:k + 1])] for k in range(len(n))]
            assert [txt(q) for q in parts] == POTONG[line] and sum(n) == len(idx), f"POTONG != baris: {line!r}"
        else:
            parts = pecah_baris(idx)
        units += parts
        PECAH.append((line, [txt(q) for q in parts]))
assert i0 == len(toks), "baris Simon tidak memuat seluruh naskah"
assert all(scene_of[u[0]] == scene_of[u[-1]] for u in units), "satu cue melintasi dua scene"

cues = []
for j, u in enumerate(units):
    buka = j == 0 or akhir_kalimat(units[j - 1][-1])
    s0 = seg_of(A[u[0]], 0.10)
    a = min(A[u[0]], s0[0]) if buka and s0 else A[u[0]]
    # V05 (19 Okt): kalimat yang menyambung TANPA jeda napas berbagi segmen bersuara dengan kalimat sebelumnya → awal segmen
    # jatuh sebelum kata terakhir kalimat itu selesai dan memotong cue sebelumnya (QA: "terbang." f38821 > cue 155 f38761).
    # Awal cue pembuka tidak boleh mendahului ujung kata sebelumnya.
    if buka and j > 0: a = max(a, Bw[u[0] - 1])
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
EKOR = 30  # Simon 15 Okt: "tambahkan 30 frame diending video" — tahan frame akhir 30f sesudah VO habis
TOTAL = math.ceil(dur * FPS) + OFFSET + EKOR

# scene -> rentang frame (awal = awal cue pertamanya; akhir = awal scene berikutnya / TOTAL)
scenes = []
for s in sorted(set(c["sc"] for c in cues)):
    first = next(c for c in cues if c["sc"] == s)
    scenes.append({"n": s, "a": 0 if s == 1 else first["fa"], "bab": BAB[s]})
for x, y in zip(scenes, scenes[1:]): x["b"] = y["a"]
scenes[-1]["b"] = TOTAL

# ── src/cues.ts ──
ts = ["/* DIBANGKITKAN oleh scripts/gen-cues.py — jangan diedit tangan.",
      f" * VO: public/vo/inv05_vo_v4_isi.wav ({dur:.3f} dtk) · waktu = forced alignment MMS (sync/vo-words.json) */",
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
(ROOT / "src/cues.ts").write_text("\n".join(ts) + "\n", encoding="utf-8")


# ── OUTRO "Di video selanjutnya" (naskah revisi 21 Okt; scripts/gen-outro.py → sync/outro.json, frame LOKAL) — hanya SRT/JSON/cek page;
#    cues.ts tetap = isi (Subtitles.tsx menggabungkan OUTRO_CUES sendiri). Blok outro mulai di TOTAL (akhir isi termasuk ekor 30f). ──
BAB[9] = "Outro"
semua = list(cues)
OUTRO = ROOT / "sync/outro.json"
if OUTRO.exists():
    o = json.loads(OUTRO.read_text())
    assert o["outro_at"] == TOTAL, "sync/outro.json basi (TOTAL berubah) — jalankan ulang scripts/gen-outro.py"
    for j, c in enumerate(o["cues"]):
        semua.append({"n": len(cues) + j + 1, "k": kal_of[-1] + 1, "sc": 9, "t": c["t"], "fa": TOTAL + c["a"], "fb": TOTAL + c["b"], "soft": False})


# ── SRT (format V10: BOM + font color brand) ──
def srt_t(f):
    ms = round(f / FPS * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = []
for c in semua:
    srt += [str(c["n"]), f"{srt_t(c['fa'])} --> {srt_t(c['fb'])}", f"<font color=#5F4DEEFF>{c['t']}</font>", ""]
(ASSET / f"{EP}_ID.srt").write_text("﻿" + "\n".join(srt), encoding="utf-8")

(ASSET / f"{EP}_ID.json").write_text(json.dumps([{
    "index": c["n"], "scene": c["sc"], "kalimat": c["k"], "start": round(c["fa"] / FPS, 3), "end": round(c["fb"] / FPS, 3),
    "startFrame30": round(c["fa"] / 2), "endFrame30": round(c["fb"] / 2),
    "startFrame60": c["fa"], "endFrame60": c["fb"], "text": c["t"], "checkTiming": c["soft"]} for c in semua],
    ensure_ascii=False, indent=1), encoding="utf-8")

# ── cek-subtitle.html (templat V10/CTA) ──
tpl = (ROOT / "scripts/cek-subtitle.tpl.html").read_text(encoding="utf-8")
page = [{"n": c["n"], "a": round(c["fa"] / FPS, 3), "b": round(c["fb"] / FPS, 3), "t": c["t"], "soft": c["soft"],
         "sc": f"Scene {c['sc']:02d} · {BAB[c['sc']]}"} for c in semua]
m_, s_ = divmod(dur, 60)
html = (tpl.replace("CTA Chart Pro", "Investing 101 · Video 05 Jalur Bertumbuh Seorang Investor")
           .replace("{{CUES}}", json.dumps(page, ensure_ascii=False)).replace("{{N}}", str(len(semua)))
           .replace("{{DUR}}", f"{int(m_)}:{s_:05.2f}").replace("{{AUDIO}}", VO_PAGE)
           .replace("{{NSOFT}}", str(sum(c["soft"] for c in cues))))
(ASSET / "cek-subtitle.html").write_text(html, encoding="utf-8")

print(f"{len(cues)} cue · {kal_of[-1]} kalimat · TOTAL {TOTAL} frame ({TOTAL / FPS:.3f} dtk) · teks == naskah ✓")
for s in scenes: print(f"  SCENE {s['n']:02d}  f{s['a']:>5}–{s['b']:<5}  {s['bab']}")
for c in cues:
    print(f"{c['n']:>3} S{c['sc']:02d} {'~' if c['soft'] else ' '} f{c['fa']:>5}–{c['fb']:<5} ({lebar(c['t']):4.0f}px)  {c['t']}")
print(f"\nbaris Simon yang lebih lebar dari safe area ({MAXW}px) -> cue berurutan: {len(PECAH)}")
for line, parts in PECAH:
    print(f"  {lebar(line):.0f}px  {line}")
    for q in parts: print(f"      → {q}")
