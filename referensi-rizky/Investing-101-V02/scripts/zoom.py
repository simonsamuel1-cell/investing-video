#!/usr/bin/env python3
"""
ZOOM KAMERA per scene (Simon 8 Okt, feedback keseluruhan video: "perbesar lagi visualnya … masih jauh dari safe marginnya").
  1. SC=S07 COMP=Ide-S07 LANGKAH=10 node scripts/ukur-pusat-cepat.mjs   (isi saja, latar hijau, tanpa kamera — kotak tinta per sampel)
  2. python3 scripts/zoom.py S07 10 [--lapor]                             → tulis/ganti entri S07 di src/zoom.gen.ts
Tiap RENTANG DIAM (pusat stabil ±3 px, ≥ 30f) → kotak tinta digeser kamera pusat (src/kamera.gen.ts) → zoom terbesar yang masih
memuat kotak itu di WILAYAH AMAN: tepi kiri/kanan ±850 px dari tengah, atas ≥ 150 (ruang judul TEXT), bawah ≤ 950 (pita subtitle),
dan tidak masuk zona logo (x > 1464 & y < 204). Dibatasi ZMAX (bawaan 1,45) dan ≥ 1. Zoom berporos di (960, 540) SETELAH geser kamera
(ruang dunia) → pusat yang sudah dipusatkan tetap di tengah. Beda < DZ (bawaan 0,06) = ditahan (tanpa gerak kecil). Transisi = sepanjang
jeda antar rentang, min 60f, inOut cubic (kamera.ts).
"""
import sys, re, glob, json, os, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
SC, STEP = sys.argv[1], int(sys.argv[2]); LAPOR = "--lapor" in sys.argv
ZMAX = float(os.environ.get("ZMAX", 1.45)); DZ = float(os.environ.get("DZ", 0.06))
OFS = int(re.search(r"VO_OFFSET = (\d+)", (ROOT / "src/offset.ts").read_text()).group(1))
bt = {k: eval(v, {"O": OFS}) for k, v in re.findall(r"^\s*(\w+):\s*([0-9 *+O]+),", (ROOT / "src/batas.ts").read_text(), re.M)}
n = int(SC[1:]); AWAL = 0 if n == 1 else bt[f"s{n}"]
kam = json.loads(re.search(r"= (\{.*\});", (ROOT / "src/kamera.gen.ts").read_text(), re.S).group(1)).get(SC, [[AWAL, AWAL, 0, 0]])
def io(t): return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2
def geser(f):
    x, y = kam[0][2], kam[0][3]
    for a, b, dx, dy in kam[1:]:
        if f <= a: break
        t = 1 if b <= a else io(max(0, min(1, (f - a) / (b - a)))); x += (dx - x) * t; y += (dy - y) * t
        if f < b: break
    return x, y
fs = sorted(glob.glob(str(ROOT / f"out/pusat/{SC}/f*.png")))
smp = []
for p in fs:
    a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
    m = ((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60) | (np.maximum(a[..., 0], a[..., 2]) > 90)
    lok = int(re.search(r"f(\d+)\.png", p).group(1))
    kol = np.nonzero(m.sum(axis=0) >= 3)[0]; bar = np.nonzero(m.sum(axis=1) >= 3)[0]
    if len(kol) < 4 or len(bar) < 4: smp.append((lok, None)); continue
    dx, dy = geser(lok + AWAL)
    # ZONA LOGO per PIKSEL isi (dulu sudut kotak pembatas — sering kosong: S07 zoom 1,35 → 1,03 karena sudut kanan-atas kotak, padahal
    # isinya di tengah): zoom terkecil yang membawa satu piksel isi ke x > 1464 DAN y < 204 = max(504/(x−960), 336/(540−y))
    yy, xx = np.nonzero(m[::4, ::4]); xx = xx * 4 + dx; yy = yy * 4 + dy
    sel = (xx > 960) & (yy < 540)
    zl = float(np.min(np.maximum(504 / (xx[sel] - 960), 336 / (540 - yy[sel])))) if sel.any() else 99.0
    isi = float(m[bar[0]:bar[-1] + 1, kol[0]:kol[-1] + 1].mean())  # kepadatan kotak: masker/latar sisipan yang tumbuh ≈ padat (> 0,6)
    smp.append((lok, (kol[0] + dx, kol[-1] + 1 + dx, bar[0] + dy, bar[-1] + 1 + dy, zl, isi)))
def zmaks(b):
    x0, x1, y0, y1, zl = b[:5]
    z = ZMAX
    for jarak, batas in ((960 - x0, 850), (x1 - 960, 850), (540 - y0, 390), (y1 - 540, 410)):
        if jarak > 1: z = min(z, batas / jarak)
    z = min(z, zl - 0.01)  # zona logo (per piksel)
    return float(max(1.0, np.floor(z * 100) / 100))
cen = [None if b is None else ((b[0] + b[1]) / 2, (b[2] + b[3]) / 2) for _, b in smp]
diam = [False] * len(smp)
for i in range(1, len(smp) - 1):
    if cen[i] and cen[i - 1] and cen[i + 1]:
        diam[i] = max(abs(cen[i][0] - cen[i - 1][0]), abs(cen[i][1] - cen[i - 1][1]), abs(cen[i + 1][0] - cen[i][0]), abs(cen[i + 1][1] - cen[i][1])) <= 3
runs, i = [], 0
while i < len(smp):
    if diam[i]:
        j = i
        while j + 1 < len(smp) and diam[j + 1]: j += 1
        if (j - i + 1) * STEP >= 30: runs.append((i, j))
        i = j + 1
    else: i += 1
# sampel MASKER sisipan (lingkaran latar tumbuh konsentris → pusatnya tetap, ikut terhitung "diam") bukan isi: dulu menjatuhkan zoom
# rentang diagram rekap S06 ke 1,0 (terukur 9 Okt) → dilewati
def bukanMasker(b):
    # kotak (sudah digeser kamera) — masker/latar sisipan yang besar menyentuh ≥ 2 tepi layar atau > 1700 × 950. BUKAN kepadatan:
    # kartu/simpul padat (S02 panel, S13 simpul) sempat ikut tersaring → zoom jatuh ke 1,0 (terukur 9 Okt)
    tepi = (b[0] <= 3) + (b[1] >= 1917) + (b[2] <= 3) + (b[3] >= 1077)
    return not (tepi >= 2 or (b[1] - b[0]) > 1700 or (b[3] - b[2]) > 950)
zr = [min([zmaks(smp[k][1]) for k in range(i, j + 1) if bukanMasker(smp[k][1])] or [1.0]) for i, j in runs]
# SUSUNAN SESAAT (< PENDEK f, bawaan 90): tidak diberi zoom sendiri — ikut yang lebih kecil dari zoom-nya dan zoom rentang berikutnya
# (tanpa dorong-masuk 0,6 dtk lalu tarik-keluar)
PENDEK = int(os.environ.get("PENDEK", 90))
zr0 = list(zr)  # nilai ASLI — tanpa rambatan (rantai rentang pendek dulu jatuh semua ke zoom terkecil rantai: S05 1,0 selama 30 dtk)
for r in range(len(runs) - 1):
    i, j = runs[r]
    if (smp[j][0] - smp[i][0] + STEP) < PENDEK: zr[r] = min(zr0[r], zr0[r + 1])
# SAMBUNG (sama dengan kamera.py): scene yang mengambil alih benda scene sebelumnya mulai di zoom akhir scene itu (tanpa loncat)
SAMBUNG = {"S02", "S04", "S09"}
data0 = json.loads(re.search(r"= (\{.*\});", (ROOT / "src/zoom.gen.ts").read_text(), re.S).group(1)) if (ROOT / "src/zoom.gen.ts").exists() else {}
prev = f"S{n - 1:02d}"
awalZ = (data0[prev][-1][2] if data0.get(prev) else 1.0) if SC in SAMBUNG else None
keys, nilai, akhir = [], None, None
for r, (i, j) in enumerate(runs):
    z = zr[r]; a_run, b_run = smp[i][0] + AWAL, smp[j][0] + AWAL
    if nilai is None:
        if awalZ is None or abs(z - awalZ) < DZ: keys.append([AWAL, AWAL, z if awalZ is None else awalZ]); nilai = keys[-1][2]
        else: keys.append([AWAL, AWAL, awalZ]); b = max(a_run, AWAL + 60); keys.append([b - 60, b, z]); nilai = z
        akhir = b_run; continue
    if abs(z - nilai) < DZ and z >= nilai: akhir = b_run; continue  # sedikit lebih besar: ditahan
    if abs(z - nilai) < DZ and z < nilai:  # sedikit lebih kecil: WAJIB turun (isi tak boleh keluar wilayah aman) — turunkan kunci sebelumnya
        keys[-1][2] = z; nilai = z; akhir = b_run; continue
    a, b = akhir, a_run
    if b - a < 60: mid = (a + b) / 2; a, b = round(mid - 30), round(mid + 30)
    keys.append([a, b, z]); nilai = z; akhir = b_run
if not keys: keys = [[AWAL, AWAL, 1.0]]
# SEMUA SAMPEL (Simon 9 Okt "perbesar" × wilayah aman): zoom tiap segmen tahan [selesai kunci k … mulai kunci k+1] diturunkan sampai
# benda yang BERGERAK di segmen itu (ikon terangkat keluar keranjang, uang terbang) juga tetap di wilayah aman — dulu hanya rentang diam
# yang diperiksa (S07: ikon naik ke y 94 pada zoom 1,35). Sampel masker/latar penuh sisipan (kotak > 1700 × 950) bukan isi → dilewati.
if os.environ.get("SEMUA", "1") == "1":
    for k in range(len(keys)):
        a0 = keys[k][1]; a1 = keys[k + 1][0] if k + 1 < len(keys) else 10 ** 9
        zs = [zmaks(b) for lok, b in smp if b is not None and a0 <= lok + AWAL <= a1 and bukanMasker(b)]
        if zs and min(zs) < keys[k][2] - 0.005:
            print(f"  turun: kunci {keys[k][:2]} {keys[k][2]} → {min(zs)} (benda bergerak)"); keys[k][2] = min(zs)
    # TANPA DENYUT ZOOM: dorong-masuk yang ditarik-keluar lagi < 3 dtk kemudian (S09: 1,11 → 1,35 → 1,19 dalam 2 dtk) ditahan di nilai
    # tetangga yang lebih besar — kamera tidak maju-mundur
    for k in range(1, len(keys) - 1):
        if keys[k][2] > keys[k - 1][2] and keys[k + 1][2] < keys[k][2] and keys[k + 1][0] - keys[k][1] < 180:
            print(f"  tahan: kunci {keys[k][:2]} {keys[k][2]} → {max(keys[k - 1][2], keys[k + 1][2])} (denyut zoom)"); keys[k][2] = max(keys[k - 1][2], keys[k + 1][2])
    # kunci berurutan yang kini bernilai (hampir) sama → gabung (tanpa gerak zoom kecil)
    rap = [keys[0]]
    for kk in keys[1:]:
        if abs(kk[2] - rap[-1][2]) < DZ / 2: continue
        rap.append(kk)
    keys = rap
if os.environ.get("KUNCI"): keys = json.loads(os.environ["KUNCI"])
gen = ROOT / "src/zoom.gen.ts"
data = json.loads(re.search(r"= (\{.*\});", gen.read_text(), re.S).group(1)) if gen.exists() else {}
# TRANSISI MAKS 60f (Simon 9 Okt: "masih ada animasi yang tidak diperlukan (idle)"): transisi sepanjang SELURUH jeda antar susunan
# (terukur sampai 270f = 4,5 dtk) membuat isi merayap pelan tanpa sebab. Standar animasi Simon = 60f → kunci [a, b] dipendekkan jadi
# [b − 60, b]: kamera bergerak BERSAMA elemen baru yang pop, selesai saat susunan baru mendarat. Berlaku juga untuk KUNCI tangan.
MAKS = int(os.environ.get("MAKS_TRANSISI", 60))
keys = [[max(k[0], k[1] - MAKS) if k[1] > k[0] else k[0], *k[1:]] for k in keys]
data[SC] = keys
body = ",\n".join(f'  "{k}": {json.dumps(v)}' for k, v in sorted(data.items()))
gen.write_text("/* DIBANGKITKAN oleh scripts/zoom.py — [mulai, selesai, zoom] per scene (frame global). Jangan diedit tangan. */\n"
               f"export const ZOOM: Record<string, [number, number, number][]> = {{\n{body}\n}};\n")
print(f"{SC}: {len(runs)} rentang diam · {len(keys)} kunci zoom")
if LAPOR:
    for r, (i, j) in enumerate(runs): b = smp[i][1]; print(f"  diam {smp[i][0]/60:5.1f}–{smp[j][0]/60:5.1f} dtk · kotak x {b[0]:.0f}–{b[1]:.0f} y {b[2]:.0f}–{b[3]:.0f} · zoom maks {zr[r]}")
    for k in keys: print("  kunci", k)
