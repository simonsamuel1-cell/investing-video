#!/usr/bin/env python3
"""
KAMERA PEMUSAT (22 Okt sore — Simon: "alignment bermasalah … hal yang sering aku protes": center diukur dari TINTA; target = tengah area di atas
subtitle (960, 497), keputusan revisi S01). Satu geser global (Babak) — bukan per scene — supaya serah-terima antarscene tetap tersambung.

Masukan : out/ukur-pindai/f*.png dari  JENDELA="0-<akhir>" LANGKAH=30 UKUR_TANPA_KAMERA=1 node scripts/ukur-pindai.mjs  (mode ukur TANPA kamera)
Keluaran: src/kamera.gen.ts — [frame transisi, ox, oy] per papan / per KEADAAN papan. Tiap keadaan diam (kotak tinta tetap ≥ 60 f) dipusatkan;
          keadaan berurutan yang bisa dilayani satu geser dengan simpangan ≤ 20 px digabung → kamera hanya bergerak saat isi berubah
          bermakna (kartu ke-2 datang, investor bergeser memberi ruang, dst.), 60 f dipusatkan di saat perubahannya. Frame ±30 dari batas papan
          dibuang (sedang transisi). Dijepit ke safe area L96 R1824 T54 · bawah ≤ 960 (di atas pita subtitle).
"""
import glob, json, re, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
W = json.loads(re.search(r"WORDS: \[string, number, number\]\[\] = (\[.*\]);", (ROOT / "src/words.gen.ts").read_text()).group(1))
TOTAL = int(re.search(r"TOTAL = (\d+)", (ROOT / "src/cues.ts").read_text()).group(1))
def kata(w, sesudah):
    for t, a, _ in W:
        if t == w and a >= sesudah: return a
    raise SystemExit(f"kata {w} sesudah f{sesudah} tidak ada")
k = lambda w, s, d=0: kata(w, s) + d
# BATAS PAPAN = pusat transisi (kata pemicu ± geser yang dipakai kodenya). Urut naik.
# v4 jeda (scripts/sisip-jeda.py): angka di blok ini sudah frame v4
B = sorted({
  k('sekarang', 0), k('masih', 0), k('banyak', 0), k('jadi', 3135, 40),                         # S01: pembuka · investor+awan · tipografi · peta · bab
  k('dana', 3953, -20),                                                                          # bab → S02 A
  k('karena', 4810), k('dibandingkan', 5840), k('dua', 6585), k('tiga', 7330, -10), k('jangan', 7860),
  k('karena', 8140), k('jadi', 8375), k('mengejar', 8540, -24), 9226,                            # S02 … G (disc naik) · masker → S03
  k('sekumpulan', 9435), k('indonesia', 9835), k('banyak', 9950), k('aturannya', 10665, 30), k('kenapa', 11710), k('kedua', 12340),
  k('bank', 12655, -24), k('artinya', 12955), k('menebak', 13170, 6), k('indeks', 13370), k('itulah', 13915), 14359,  # S03 … I → S04
  k('indeks', 14430), k('dikelola', 14630), k('ada', 14930), k('periode', 16045), k('naik', 16325), k('artinya', 16950), k('jadi', 17705), k('memilih', 17820), 18490,  # S04 ide 24 Okt (5 adegan)
  k('tempat', 18550, -24), k('pelajaran', 18750), k('melewati', 18965, -24), k('sebelum', 19265), k('dulu', 19480, -24), k('lihat', 19630),
  k('reaksi', 19895, -24), k('karena', 20800), k('satu', 21225, -24), k('indeks', 21320), 21637,                       # S05 … masker → S06
  k('urutannya', 21755, -60), k('tiga', 21920), k('setelah', 22100, -44), k('jadi', 25005), 25406,                     # S06 … E → S07
  k('jalur', 25435), k('langkah', 25635), k('sekarang', 27740),                                                         # S07 pembuka · kartu · peta
})
fr = {}
for p in sorted(glob.glob(str(ROOT / "out/ukur-pindai/f*.png"))):
    f = int(re.search(r"f(\d+)", p).group(1))
    a = np.asarray(Image.open(p).convert("RGB")).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    isi = ((g - np.maximum(r, b)) < 60) | (np.maximum(r, b) > 90)
    ys, xs = np.where(isi)
    if len(xs) >= 50: fr[f] = (xs.min(), xs.max() + 1, ys.min(), ys.max() + 1)
fs = sorted(fr)
sama = lambda u, v, t=10: all(abs(p - q) <= t for p, q in zip(u, v))
diam = lambda f: (f - 30) in fr and sama(fr[f], fr[f - 30])
tepi = lambda t: t[0] <= 2 or t[1] >= 1918 or t[2] <= 2 or t[3] >= 1078
def geser(x0, x1, y0, y1):
    ox, oy = 960 - (x0 + x1) / 2, 497 - (y0 + y1) / 2
    ox = max(96 - x0, min(1824 - x1, ox)) if x1 - x0 <= 1728 else ox          # jepit ke safe area
    oy = max(54 - y0, min(960 - y1, oy)) if y1 - y0 <= 906 else oy
    return (ox, oy)
SIMPANG = 20  # simpangan pusat yang masih diterima per keadaan; lebih dari itu → kamera ikut (memberi ruang). Di bawahnya: tanpa geser tanpa arti
# PAPAN BERGESER TETAP (tidak dihitung dari tinta): tipografi S01 "Masih ingat sungai yang kemarin?" — dipusatkan oleh tata letaknya sendiri
# (TIPO di Scene01, diukur), kamera 0 (Simon 23 Okt: "Typography nya tidak berada ditengah frame, dan itu sangat terlihat" — dulu mewarisi −96 px)
TETAP = {k('masih', 0): (0, 0),
         # papan aset S02 (24 Okt, Simon: "Kenapa ada animasi swipe keatas ketika 3 panel sudah muncul semua?" — dulu kamera naik 69 px sesudah kartu 3):
         # tata letak tiga kartu + lingkaran dipusatkan sendiri (S02_PUSAT y 497, kartu 287/497/707), kamera diam sepanjang papan
         k('dana', 3953, -20): (0, 0),
         # papan pendaratan G (panel grafik MORF jadi cakram + label "Investasi stabil" yang dipusatkan tata letaknya di 497) — dulu mewarisi +46 px
         k('jadi', 8375): (0, 0)}
seg = [0] + B + [TOTAL]
kam, prev = [], (0.0, 0.0)
print(f"{len(B)} batas papan · {len(fr)} frame ukur")
for i in range(len(seg) - 1):
    A_, B_ = seg[i], seg[i + 1]
    if A_ in TETAP:
        prev = TETAP[A_]; kam.append((A_, prev[0], prev[1])); print(f"  papan f{A_:5d}–{B_:5d}  TETAP → geser ({prev[0]:+d}, {prev[1]:+d})"); continue
    # KEADAAN papan = deret frame DIAM berurutan dengan kotak tinta sama (±10 px — gerak idle kecil masih satu keadaan; swipe/pop bergerak jauh
    # lebih dari itu per 30 f), tidak menyentuh tepi frame, ≥ 2 sampel (diam ≥ 60 f → keadaan tampil ≥ ±90 f; yang lebih pendek = transisi).
    # Papan progresif (kartu ke-2 datang, chip menyusul, dsb.) punya beberapa keadaan — tiap keadaan dipusatkan; kamera bergerak 60 f
    # dipusatkan di saat isi berubah (= "tengah dulu, lalu memberi ruang"), bukan satu union yang tak pernah benar di keadaan mana pun.
    runs = []
    for f in fs:
        if not (A_ + 30 <= f <= B_ - 30) or not diam(f) or tepi(fr[f]): continue
        if runs and runs[-1]["akhir"] == f - 30 and sama(runs[-1]["kotak"], fr[f]): runs[-1]["akhir"] = f
        else: runs.append({"awal": f, "akhir": f, "kotak": fr[f]})
    # papan pendek (±100–150 f) bisa hanya punya satu sampel diam — tetap dipusatkan, daripada mewarisi geser papan sebelumnya
    runs = [r for r in runs if r["akhir"] - r["awal"] >= 30] or runs
    for r in runs: r["o"] = geser(*r["kotak"]); r["n"] = (r["akhir"] - r["awal"]) // 30 + 1
    # kelompokkan keadaan berurutan selama SATU geser bisa melayani semuanya dengan simpangan ≤ SIMPANG (irisan selang [o−S, o+S] tak kosong)
    # → kamera bergerak sesedikit mungkin; geser kelompok = rata-rata berbobot durasi, dijepit ke irisan
    grup = []
    for r in runs:
        g = grup[-1] if grup else None
        sel = [(r["o"][k] - SIMPANG, r["o"][k] + SIMPANG) for k in (0, 1)]
        if g:
            iris = [(max(g["sel"][k][0], sel[k][0]), min(g["sel"][k][1], sel[k][1])) for k in (0, 1)]
            if all(lo <= hi for lo, hi in iris):
                n = g["n"] + r["n"]
                g["rata"] = tuple((g["rata"][k] * g["n"] + r["o"][k] * r["n"]) / n for k in (0, 1))
                g.update(n=n, sel=iris, akhir=r["akhir"], kotak=r["kotak"]); continue
        grup.append(dict(r, sel=sel, rata=r["o"]))
    for g in grup: g["o"] = tuple(min(max(g["rata"][k], g["sel"][k][0]), g["sel"][k][1]) for k in (0, 1))
    if not grup:
        # papan TRANSISI (tanpa sampel diam: morf, masker, serah-terima) → kamera tidak bergerak; union isi yang sedang bergerak menyesatkan
        # (terukur 9420–9510: union cakram + kartu yang sedang melebur → geser −300 lalu kembali dalam 90 f)
        kam.append((A_, round(prev[0]), round(prev[1]))); print(f"  papan f{A_:5d}–{B_:5d}  (transisi, tanpa keadaan diam — kamera tetap)"); continue
    for j, g in enumerate(grup):
        if j == 0: mulai = A_
        else:
            # saat isi berubah: sampel pertama sesudah keadaan sebelumnya yang kotaknya beda → perubahan terjadi di (c−30, c]; pusat 60 f ≈ c+15
            lalu = grup[j - 1]
            c = next(f for f in fs if f > lalu["akhir"] and not sama(fr[f], lalu["kotak"]))
            mulai = c + 15
        o = (round(g["o"][0]), round(g["o"][1]))
        print(f"  {'papan' if j == 0 else '  └ keadaan'} f{mulai:5d}–{B_:5d}  ({g['n']:2d} sampel) → geser ({o[0]:+d}, {o[1]:+d})")
        kam.append((mulai, o[0], o[1])); prev = o
rows = ",".join(f"[{a},{x},{y}]" for a, x, y in kam)
(ROOT / "src/kamera.gen.ts").write_text(
    "/* DIBANGKITKAN oleh scripts/gen-kamera.py — [frame batas papan, geser x, geser y] (px). Jangan diedit tangan. */\n"
    f"export const KAMERA: [number, number, number][] = [{rows}];\n", encoding="utf-8")
print("→ src/kamera.gen.ts")
