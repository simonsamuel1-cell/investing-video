#!/usr/bin/env python3
"""
CUE SUBTITLE Value Investing · Video 01 Apa Itu Value Investing? (salinan Investing 101 Video 06/05/03) — dari sync/vo-words.json (forced alignment MMS) +
sync/SUBTITLE-BARIS.txt (Video 06, seperti Video 05: dibangkitkan scripts/gen-baris.py — baris naskah Simon digabung per kalimat selama muat 1 baris;
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
MD = ASSET / "VO-Script-Video01.md"
BARIS = ROOT / "sync/SUBTITLE-BARIS.txt"
EP = "Video 01 - Apa Itu Value Investing"
FPS = 60
OFFSET = int(re.search(r'VO_OFFSET = (\d+)', (pathlib.Path(__file__).resolve().parent.parent / 'src/offset.ts').read_text()).group(1))  # src/offset.ts 
VO_PAGE = "../01_VO/MiniMax_2026-10-29_16_30_58_Compelling_Storyteller.mp3"  # 29 Okt: VO utuh (penutup "Di video selanjutnya" = narasi S08, tanpa outro terpisah)
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728  # safe area L96..R1824


def lebar(t):
    """lebar tinta pada Bold 35 + letterSpacing −0,01em (Subtitles.tsx); terkalibrasi ±2% ke render"""
    l, _, r, _ = FONT.getbbox(t)
    return r - l - 0.35 * (len(t) - 1)


# V06 (23 Okt): token naskah DIPISAH DI EM DASH ("berhasil—semua" → "berhasil—" + "semua") supaya cue boleh berganti di em dash Simon;
# teks ditampilkan TANPA spasi sesudah "—" (gabung), jadi subtitle tetap = naskah persis.
def tokens(line):
    return [q for t in line.split() for q in re.split(r"(?<=—)(?=\S)", t)]


def gabung(ts):
    out = ""
    for t in ts:
        out += ("" if not out or out.endswith("—") else " ") + t
    return out


# BAB = judul scene di naskah Simon (04_Asset/Naskah-Lengkap-Simon.md) — label timeline Studio + rona latar saja, tidak tampil di video.
BAB = {1: "Investasi atau Cuma Menebak Harga?",
       2: "Empat Pilar Value Investing",
       3: "Bukan Cuma Satu Investor",
       4: "Kenapa Relevan untuk Investor Indonesia?",
       5: "Kelebihannya Jelas, Kekurangannya Juga Nyata",
       6: "Value Investing Cocok untuk Siapa?",
       7: "Benar Belum Tentu Cepat",
       8: "Apa Peran Tuntun?"}

# ── naskah: token + baris + scene ──
toks, scene_of, line_of = [], [], []
sc, ln = 0, 0
for line in MD.read_text(encoding="utf-8").splitlines():
    m = re.match(r"## SCENE (\d+)", line)
    if m: sc = int(m.group(1)); continue
    if not line.strip() or line.startswith("#") or line.startswith("---") or line.startswith("Narasi saja"): continue
    ln += 1
    for t in tokens(line):
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


txt = lambda idx: gabung(toks[i] for i in idx)
# VI V01 (29 Okt): kutipan tanpa titik penutup ("…juta ya”") yang disusul huruf besar = akhir kalimat (sama dengan gen-baris.py)
akhir_kalimat = lambda i: bool(re.search(r"[.?!][”\"]?$", toks[i])) or (toks[i].endswith("”") and i + 1 < len(toks) and toks[i + 1][:1].isupper())
kal_of, k = [], 1
for i in range(len(toks)):
    kal_of.append(k)
    if akhir_kalimat(i): k += 1


def pecah_baris(idx):
    """baris > MAXW -> cue berurutan. V06 (23 Okt): baris naskah Simon di episode ini berupa PARAGRAF (beberapa kalimat satu baris), jadi
    titik potong bertingkat: AKHIR KALIMAT (0) < koma/titik dua/em dash Simon (1) < sebelum kata pembuka klausa (2, cadangan V03).
    Pilih pecahan PALING SEDIKIT, lalu tingkat terendah, lalu paling rata. Satu pecahan yang memuat akhir kalimat di tengahnya harus
    terdiri dari kalimat UTUH (tidak pernah "…nyawa. Tapi kalau kamu")."""
    n = len(idx)
    cand = {}
    for j in range(1, n):
        prev, nxt = toks[idx[j - 1]], toks[idx[j]]
        if akhir_kalimat(idx[j - 1]): cand[j] = 0
        elif prev.endswith("—") or re.search(r"[,;:][”\"]?$", prev): cand[j] = 1
        elif nxt.lower() in PEMBUKA: cand[j] = 2
    akhir = {j for j in range(1, n) if akhir_kalimat(idx[j - 1])}
    def sah(a, b):
        if lebar(txt(idx[a:b])) > MAXW: return False
        if any(a < j < b for j in akhir):  # memuat akhir kalimat di tengah → harus kalimat utuh
            return (a == 0 or a in akhir) and (b == n or b in akhir)
        return True
    keys = sorted(cand)
    for k in range(1, len(keys) + 1):
        pilihan = []
        for cut in itertools.combinations(keys, k):
            bnd = (0,) + cut + (n,)
            if all(sah(a, b) for a, b in zip(bnd, bnd[1:])):
                w = [lebar(txt(idx[a:b])) for a, b in zip(bnd, bnd[1:])]
                pilihan.append((sum(cand[c] for c in cut), max(w) - min(w), [idx[a:b] for a, b in zip(bnd, bnd[1:])]))
        if pilihan: return min(pilihan, key=lambda z: (z[0], z[1]))[2]
    raise SystemExit(f"baris tak bisa dipotong: {txt(idx)}")


PEMBUKA = {"jangan", "yang", "untuk", "karena", "dengan", "tapi", "dan", "atau", "supaya", "agar", "sebelum", "setelah", "kalau"}


# POTONG MANUAL (Simon 13 Okt: "jika ada kalimat yang tidak muat dalam 1 baris, pisahkan saja, mungkin kamu juga bisa
# merapihkannya sedikit"). Pemecah otomatis (koma, paling rata) memotong DAFTAR / FRASA di tengahnya pada 3 baris ini;
# di sini dipotong di batas makna. Baris lebar lainnya tetap lewat pecah_baris().
# Video 06 (23 Okt): pemotong bertingkat memotong 3 baris di tempat yang salah — dipotong manual di batas makna:
#   · "Tapi orang | yang menjual…" (sisa 2 kata)  · "“kenapa dia menjual?”" = kutipan di TENGAH kalimat, bukan akhir kalimat
#   · daftar "berburu, | berpindah, dan berlayar" (aturan V03: jangan memotong daftar)
POTONG = {}  # Value Investing V01 (29 Okt): belum ada potongan manual
units, i0, PECAH = [], 0, []
for ln, line in enumerate((l.strip() for l in BARIS.read_text(encoding="utf-8").splitlines()), 1):
    if not line: continue
    idx = list(range(i0, i0 + len(tokens(line)))); i0 += len(idx)
    assert txt(idx) == line, f"baris {ln} != naskah: {line!r} vs {txt(idx)!r}"
    # SATU CUE = SATU KALIMAT (Simon 23 Okt: "jangan sampai ada 2 titik seperti ini untuk subtittlenya" — screenshot "Lalu ukuran posisi
    # diperbesar. Setelah itu, mulai memakai dana pinjaman."): baris yang memuat >1 kalimat SELALU dipotong di tiap akhir kalimat, walau muat.
    kal = [[]]
    for i in idx:
        kal[-1].append(i)
        if akhir_kalimat(i) and i != idx[-1]: kal.append([])
    if line not in POTONG and len(kal) > 1:
        parts = []
        for q in kal: parts += [q] if lebar(txt(q)) <= MAXW else pecah_baris(q)
        units += parts
        PECAH.append((line, [txt(q) for q in parts]))
    elif lebar(line) <= MAXW: units.append(idx)
    else:
        if line in POTONG:  # potongan manual: teks digabung == baris Simon, tiap bagian <= MAXW
            n = [len(tokens(q)) for q in POTONG[line]]
            parts = [idx[sum(n[:k]):sum(n[:k + 1])] for k in range(len(n))]
            assert [txt(q) for q in parts] == POTONG[line] and sum(n) == len(idx), f"POTONG != baris: {line!r}"
        else:
            parts = pecah_baris(idx)
        units += parts
        PECAH.append((line, [txt(q) for q in parts]))
assert i0 == len(toks), "baris Simon tidak memuat seluruh naskah"
# PISAH DI TANDA BACA (Simon 29 Okt, VI V01: "jika ada \",\" dan \".\" mungkin juga \"?\" pisahkan subtittle setelah tandanya"):
# tiap cue dipotong lagi sesudah token yang berakhir , . ? ! (boleh diikuti tanda kutip penutup) dan sesudah kutipan penutup akhir kalimat.
# Batas yang sudah ada (baris Simon, PISAH di gen-baris, potongan lebar) tetap; ini hanya MENAMBAH batas.
TANDA = lambda i: bool(re.search(r"[,.?!][”\"]?$", toks[i])) or akhir_kalimat(i)
_u = []
for u in units:
    cur = []
    for i in u:
        cur.append(i)
        if TANDA(i) and i != u[-1]: _u.append(cur); cur = []
    _u.append(cur)
units = _u
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

assert gabung(c["t"] for c in cues) == gabung(naskah.split()), "TEKS CUE != NASKAH"
assert all(lebar(c["t"]) <= MAXW for c in cues), "ada cue lebih lebar dari safe area"
for c in cues:
    c["fa"], c["fb"] = round(c["a"] * FPS) + OFFSET, round(c["b"] * FPS) + OFFSET  # frame VIDEO
# V06: cue satu-kalimat yang sangat pendek ("Beli.”" 14f) ditahan sampai MIN_CUE frame, mengambil hening sesudahnya (tak pernah menimpa cue berikut)
MIN_CUE = 40
for x, y in zip(cues, cues[1:] + [None]):
    if x["fb"] - x["fa"] < MIN_CUE:
        x["fb"] = min(x["fa"] + MIN_CUE, y["fa"]) if y else x["fa"] + MIN_CUE
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
      f" * VO: public/vo/vi01_vo.wav ({dur:.3f} dtk) · waktu = forced alignment MMS (sync/vo-words.json) */",
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
BAB[13] = "Outro"
semua = list(cues)
OUTRO = ROOT / "sync/outro.json"
if OUTRO.exists():
    o = json.loads(OUTRO.read_text())
    assert o["outro_at"] == TOTAL, "sync/outro.json basi (TOTAL berubah) — jalankan ulang scripts/gen-outro.py"
    for j, c in enumerate(o["cues"]):
        semua.append({"n": len(cues) + j + 1, "k": kal_of[-1] + 1, "sc": 13, "t": c["t"], "fa": TOTAL + c["a"], "fb": TOTAL + c["b"], "soft": False})


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
html = (tpl.replace("CTA Chart Pro", "Value Investing · Video 01 Apa Itu Value Investing?")
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
