#!/usr/bin/env python3
"""
LUBANGI LAYAR aset tangan-HP (Simon 13 Okt: "masking hpnya kurang pas dan juga ada space putih disekitar nya").
Bidang layar putih aset dibuat TRANSPARAN supaya isi layar (homescreen/aplikasi/kalender) bisa diletakkan DI BELAKANG aset: bezel & dynamic
island asli yang membingkainya → tak ada tepi putih, tak ada island tiruan.
  1. isi-banjir dari tengah layar atas piksel terang (min RGB > 170) → lubang;
  2. pita 5 px di sekeliling lubang (tepi antialias putih→hitam): warna = hitam bezel, alfa = kegelapan aslinya → isi layar terlihat
     menembus tepi persis seperti layar sungguhan.
Masukan: ../Hand Holding Blank Smartphone Mockup.png (berkas Simon, tidak diubah) → public/hp/tangan-hp-bingkai.png + ukuran lubang (dicetak).
"""
import pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = ROOT.parent / "Hand Holding Blank Smartphone Mockup.png"
a = np.asarray(Image.open(src).convert("RGBA")).astype(float)
rgb, al = a[:, :, :3], a[:, :, 3]
terang = (rgb.min(2) > 170) & (al > 200)
# isi-banjir dari tengah layar (PIL): hanya piksel terang yang tersambung — island (hitam) & bezel tidak ikut
m = Image.fromarray((terang * 255).astype(np.uint8)).copy()  # .copy(): floodfill pada gambar berbagi-memori numpy tidak tertulis
ImageDraw.floodfill(m, (601, 578), 128)
lubang = np.asarray(m) == 128
dil = np.asarray(Image.fromarray((lubang * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11))) > 0  # radius 5 px
pita = dil & ~lubang
lum = rgb.mean(2)
BEZEL, PUTIH = 12.0, 238.0
gelap = np.clip((PUTIH - lum) / (PUTIH - BEZEL), 0, 1)
out = a.copy()
out[lubang, 3] = 0
out[pita, 0:3] = BEZEL
out[pita, 3] = np.minimum(al[pita], 255 * gelap[pita])
Image.fromarray(out.astype(np.uint8)).save(ROOT / "public/hp/tangan-hp-bingkai.png", optimize=True)
ys, xs = np.where(lubang)
print(f"lubang: x {xs.min()}–{xs.max()} · y {ys.min()}–{ys.max()} · {lubang.sum()} px")
for y in (200, 578, 950):
    r = np.where(lubang[y])[0]; print(f"  baris {y}: x {r.min()}–{r.max()}")
for x in (601,):
    c = np.where(lubang[:, x])[0]; print(f"  kolom {x}: y {c.min()}–{c.max()}")
