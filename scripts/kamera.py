#!/usr/bin/env python3
"""
JALUR KAMERA PUSAT per scene (Simon 7 Okt: "semua visual tidak pada center point frame").
  1. SC=S01 COMP=Ide-S01 LANGKAH=10 node scripts/ukur-pusat.mjs      (render isi saja, latar putih, tanpa kamera)
  2. python3 scripts/kamera.py S01 10 [--lapor]                         → tulis/ganti entri S01 di src/kamera.gen.ts
Pusat = pusat kotak tinta ISI (mode ukur: judul TEXT, watermark, subtitle tidak dirender). Rentang DIAM (pusat stabil ±3 px, >= 30 f) → target geser
ke (960, 540), dibatasi supaya isi tetap di wilayah aman (x 100–1820, y 165–950). Antar target: transisi inOut cubic
sepanjang jeda antar rentang (min 40 f). Kunci pertama = nilai akhir scene sebelumnya HANYA untuk scene di SAMBUNG.
"""
import sys, re, glob, json, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SC, STEP = sys.argv[1], int(sys.argv[2]); LAPOR = "--lapor" in sys.argv
# DEADBAND: geser pemusatan sekecil ini TIDAK dijalankan (kamera ditahan). Simon 8 Okt S02 "animasi patah-patah": geser 3–9 px yang
# lambat (±0,03 px/frame) membuat SELURUH isi diam merayap sub-piksel → tepi garis meloncat 1 px sepotong-sepotong (terukur). Bawaan 3.
import os; DB = int(os.environ.get("DEADBAND", 3))
SKALA = 1
OFS = int(re.search(r"VO_OFFSET = (\d+)", (ROOT / "src/offset.ts").read_text()).group(1))
bt = {k: eval(v, {"O": OFS}) for k, v in re.findall(r"^\s*(\w+):\s*([0-9 *+O]+),", (ROOT / "src/batas.ts").read_text(), re.M)}
n = int(SC[1:]); AWAL = 0 if n == 1 else bt[f"s{n}"]

fs = sorted(glob.glob(str(ROOT / f"out/pusat/{SC}/f*.png")))
pusat = []
for p in fs:
    a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
    m = ((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60) | (np.maximum(a[..., 0], a[..., 2]) > 90)  # isi padat ATAU elemen redup (putih/warna transparan) — bayangan (gelap+transparan) tidak
    # mode ukur: judul TEXT, watermark & subtitle TIDAK dirender (MODE_UKUR) → seluruh frame = isi
    lok = int(re.search(r"f(\d+)\.png", p).group(1))
    kol = np.nonzero(m.sum(axis=0) >= 3)[0]; bar = np.nonzero(m.sum(axis=1) >= 3)[0]  # latar kunci bersih → batas sebenarnya (bukan persentil: memangkas glyph kecil)
    if len(kol) < 4 or len(bar) < 4: pusat.append((lok, None)); continue
    x0, x1 = kol[0] * SKALA, (kol[-1] + 1) * SKALA; y0, y1 = bar[0] * SKALA, (bar[-1] + 1) * SKALA
    pusat.append((lok, (x0, x1, y0, y1)))

def target(b):
    x0, x1, y0, y1 = b
    dx, dy = 960 - (x0 + x1) / 2, 540 - (y0 + y1) / 2
    dx = min(max(dx, 100 - x0), 1820 - x1); dy = min(max(dy, 165 - y0), 950 - y1)
    return dx, dy

# rentang diam
cen = [None if b is None else ((b[0] + b[1]) / 2, (b[2] + b[3]) / 2) for _, b in pusat]
diam = [False] * len(pusat)
for i in range(1, len(pusat) - 1):
    if cen[i] and cen[i - 1] and cen[i + 1]:
        diam[i] = max(abs(cen[i][0] - cen[i - 1][0]), abs(cen[i][1] - cen[i - 1][1]), abs(cen[i + 1][0] - cen[i][0]), abs(cen[i + 1][1] - cen[i][1])) <= 3
runs, i = [], 0
while i < len(pusat):
    if diam[i]:
        j = i
        while j + 1 < len(pusat) and diam[j + 1]: j += 1
        if (j - i + 1) * STEP >= 30: runs.append((i, j))
        i = j + 1
    else: i += 1
# PENDEK (env, bawaan 0 = mati): rentang diam yang lebih singkat dari ini (frame) TIDAK menggerakkan kamera — susunan sesaat (mis. uang
# terbang melintas 0,5 dtk) membuat kamera bolak-balik 120 px dalam 3 dtk (S09 9 Okt, terukur)
PENDEK = int(os.environ.get("PENDEK", 0))
if PENDEK: runs = [(i, j) for (i, j) in runs if (pusat[j][0] - pusat[i][0] + STEP) >= PENDEK]

gen = ROOT / "src/kamera.gen.ts"
src = gen.read_text()
data = json.loads(re.search(r"= (\{.*\});", src, re.S).group(1)) if "= {" in src else {}
# SAMBUNG = scene yang MENGAMBIL ALIH benda scene sebelumnya → kamera mulai dari nilai akhir scene itu (tanpa loncat).
# Scene lain mulai langsung di targetnya sendiri (scene lama keluar sendiri; tak ada benda bersama yang bisa meloncat).
SAMBUNG = {"S02": "bab 01 dari peta Scene 01", "S04": "chart emas Scene 03", "S09": "Saham (naskah revisi S07→S08 satu dunia, src/s08/Scene08.tsx)"}
# (S08 dulu SAMBUNG; sejak 7 Okt masuk lewat peta bab — ikon Saham terbang di koordinat LAYAR dengan kamera kedua scene)
sebelum = None
if n > 1 and SC in SAMBUNG:
    prev = f"S{n - 1:02d}"
    if prev in data and data[prev]: sebelum = data[prev][-1][2:]

# target tiap rentang; SUSUNAN BERTAMBAH (kotak rentang berikutnya memuat kotak ini, jeda < 3 dtk) → pakai target susunan
# akhirnya sejak awal: kamera tidak bolak-balik selama satu susunan dibangun (mis. simpul peta lalu labelnya)
def kotak(i, j): return pusat[j][1]
def memuat(b, a, tol=8): return b[0] <= a[0] + tol and b[1] >= a[1] - tol and b[2] <= a[2] + tol and b[3] >= a[3] - tol
tgt = [None] * len(runs)
for r in range(len(runs) - 1, -1, -1):
    i, j = runs[r]
    ts = [target(pusat[k][1]) for k in range(i, j + 1)]
    tgt[r] = (round(float(np.mean([t[0] for t in ts]))), round(float(np.mean([t[1] for t in ts]))))
    if r + 1 < len(runs):
        i2, j2 = runs[r + 1]
        # hanya susunan ANTARA yang singkat (< 3 dtk dari awalnya sampai susunan berikutnya) — bukan rantai panjang
        # … dan BUKAN panel adegan tambahan (Vinyet 240–1680 × 190–910): panel MENGGANTIKAN diagram, bukan menumbuhkannya
        panel = lambda b: abs(b[0] - 240) <= 4 and abs(b[1] - 1680) <= 4 and abs(b[2] - 190) <= 4 and abs(b[3] - 910) <= 4
        # … dan selisih targetnya kecil (< 40 px): susunan antara yang bergeser jauh (mis. siklus dibangun searah jarum jam, label kiri
        # belum ada → 90 px) diikuti kamera, bukan dibiarkan melenceng menunggu susunan akhir
        dekat = abs(tgt[r][0] - tgt[r + 1][0]) < 40 and abs(tgt[r][1] - tgt[r + 1][1]) < 40
        if memuat(kotak(i2, j2), kotak(i, j)) and (pusat[i2][0] - pusat[i][0]) < 180 and not panel(kotak(i2, j2)) and dekat: tgt[r] = tgt[r + 1]
keys, nilai = [], None
for r, (i, j) in enumerate(runs):
    v = tgt[r]
    a_run, b_run = pusat[i][0] + AWAL, pusat[j][0] + AWAL
    if r == 0:
        if sebelum is None:
            keys.append([AWAL, AWAL, *v]); nilai = v
        else:
            keys.append([AWAL, AWAL, *sebelum]); nilai = tuple(sebelum)
            if abs(v[0] - nilai[0]) > DB or abs(v[1] - nilai[1]) > DB:
                b = max(a_run, AWAL + 40); keys.append([b - max(40, b - AWAL), b, *v]); nilai = v
        akhir_lalu = b_run; continue
    if abs(v[0] - nilai[0]) <= DB and abs(v[1] - nilai[1]) <= DB:
        akhir_lalu = b_run; continue
    a, b = akhir_lalu, a_run
    if b - a < 40: m_ = (a + b) / 2; a, b = round(m_ - 20), round(m_ + 20)
    keys.append([a, b, *v]); nilai = v; akhir_lalu = b_run
if not keys: keys = [[AWAL, AWAL, 0, 0]] if sebelum is None else [[AWAL, AWAL, *sebelum]]
# RATA=1: semua target dalam DEADBAND dari rata-rata tertimbang (panjang rentang) → SATU kunci di rata-rata itu (kamera diam sepanjang scene,
# simpangan terbesar minimal). Hanya scene yang bukan SAMBUNG (yang SAMBUNG wajib mulai di nilai akhir scene sebelumnya).
# KUNCI='[[a,b,dx,dy],…]' (frame global): kunci ditulis langsung — kamera DIAM yang dirancang, bukan mengejar susunan setengah jadi
# (Simon 8 Okt S05: kamera menggeser simpul utama 300 px saat diagram baru separuh → "tidak center"). Pusat isi tiap susunan dibuat
# sama lewat geometri; laporan rentang di atas dipakai untuk memeriksanya.
if os.environ.get("KUNCI"):
    keys = json.loads(os.environ["KUNCI"])
if os.environ.get("RATA") == "1" and sebelum is None and runs and not os.environ.get("KUNCI"):
    w = [(pusat[j][0] - pusat[i][0] + STEP) for (i, j) in runs]
    mx = sum(t[0] * k for t, k in zip(tgt, w)) / sum(w); my = sum(t[1] * k for t, k in zip(tgt, w)) / sum(w)
    if all(abs(t[0] - mx) <= DB and abs(t[1] - my) <= DB for t in tgt):
        keys = [[AWAL, AWAL, round(mx), round(my)]]

# TRANSISI MAKS 60f (Simon 9 Okt: "masih ada animasi yang tidak diperlukan (idle)"): transisi sepanjang SELURUH jeda antar susunan
# (terukur sampai 270f = 4,5 dtk) membuat isi merayap pelan tanpa sebab. Standar animasi Simon = 60f → kunci [a, b] dipendekkan jadi
# [b − 60, b]: kamera bergerak BERSAMA elemen baru yang pop, selesai saat susunan baru mendarat. Berlaku juga untuk KUNCI tangan.
MAKS = int(os.environ.get("MAKS_TRANSISI", 60))
keys = [[max(k[0], k[1] - MAKS) if k[1] > k[0] else k[0], *k[1:]] for k in keys]
data[SC] = keys
body = ",\n".join(f'  "{k}": {json.dumps(v)}' for k, v in sorted(data.items()))
gen.write_text("/* DIBANGKITKAN oleh scripts/kamera.py — [mulai, selesai, dx, dy] per scene (frame global). Jangan diedit tangan. */\n"
               f"export const KAMERA: Record<string, [number, number, number, number][]> = {{\n{body}\n}};\n")
print(f"{SC}: {len(pusat)} sampel · {len(runs)} rentang diam · {len(keys)} kunci")
if LAPOR:
    for (i, j) in runs:
        b = pusat[i][1]; print(f"  diam {pusat[i][0]/60:5.1f}–{pusat[j][0]/60:5.1f} dtk · pusat ({(b[0]+b[1])/2:.0f}, {(b[2]+b[3])/2:.0f}) · kotak x {b[0]:.0f}–{b[1]:.0f} y {b[2]:.0f}–{b[3]:.0f}")
    for k in keys: print("  kunci", k)
