#!/usr/bin/env python3
"""
Ikon "Makan" = acuan Simon 13 Okt (04_Asset/ikon-lokal/makan_acuan_simon.png: garpu · piring · pisau) → SVG satu warna.
Tanpa potrace: piring = lingkaran eksak (r 85 / 64 / 47 terukur), garpu & pisau = tepi kiri/kanan per baris dengan
ketelitian sub-piksel (cakupan anti-alias), tiap gigi garpu = poligon sendiri (fill nonzero → gabungan).
Hasil: 04_Asset/ikon-lokal/makan.svg + IoU terhadap acuan (dicetak).
"""
import pathlib
import numpy as np
from PIL import Image, ImageDraw

ASET = pathlib.Path(__file__).resolve().parents[2] / "04_Asset/ikon-lokal"
im = Image.open(ASET / "makan_acuan_simon.png").convert("RGBA")
a = np.asarray(im).astype(float)
putih = 255 - (a[..., 3] / 255) * (255 - a[..., :3].mean(-1))  # komposit di atas putih
c = 1 - putih / 255  # cakupan tinta 0..1
ink = c > 0.5
H, W = ink.shape

def runs(y, x0, x1):
    out, s = [], None
    for x in range(x0, x1 + 1):
        if ink[y, x] and s is None: s = x
        if not ink[y, x] and s is not None: out.append((s, x - 1)); s = None
    if s is not None: out.append((s, x1))
    return out

def tepi(y, s, t):
    return s + 1 - c[y, s] - c[y, s - 1], t + c[y, t] + c[y, t + 1]

def poligon(baris):
    """baris = [(y, kiri, kanan)] berurutan → path tertutup (turun di kanan, naik di kiri); tutup atas/bawah memakai cakupan baris tepi"""
    y0, y1 = baris[0][0], baris[-1][0]
    ka = [(r, y + 0.5) for y, l, r in baris]
    ki = [(l, y + 0.5) for y, l, r in baris][::-1]
    atas = y0 + 1 - c[y0, int((baris[0][1] + baris[0][2]) / 2)] - c[y0 - 1, int((baris[0][1] + baris[0][2]) / 2)]
    bawah = y1 + c[y1, int((baris[-1][1] + baris[-1][2]) / 2)] + c[y1 + 1, int((baris[-1][1] + baris[-1][2]) / 2)]
    mx0, mx1 = (baris[0][1] + baris[0][2]) / 2, (baris[-1][1] + baris[-1][2]) / 2
    pts = [(mx0, atas)] + ka + [(mx1, bawah)] + ki
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"

paths = []
# garpu: 3 gigi (wilayah bercabang) + kepala/gagang (satu rentang)
gigi = [[], [], []]
gagang = []
for y in range(H):
    r = runs(y, 30, 84)
    if len(r) == 3:
        for k, (s, t) in enumerate(r): gigi[k].append((y, *tepi(y, s, t)))
    elif len(r) == 1 and y > 60:
        gagang.append((y, *tepi(y, *r[0])))
# sambungkan gigi ke kepala: perpanjang 2 baris ke dalam kepala
for g in gigi: paths.append(poligon(g))
paths.append(poligon(gagang))
# pisau
pisau = [(y, *tepi(y, *runs(y, 260, 300)[0])) for y in range(H) if len(runs(y, 260, 300)) == 1]
paths.append(poligon(pisau))
# piring: cincin + isi — pusat & tiga jari-jari dicocokkan dari 72 sinar sub-piksel (persilangan cakupan 0,5; sebaran terkecil)
def bil(x, y):
    x0, y0 = int(x), int(y); fx, fy = x - x0, y - y0
    return c[y0, x0] * (1 - fx) * (1 - fy) + c[y0, x0 + 1] * fx * (1 - fy) + c[y0 + 1, x0] * (1 - fx) * fy + c[y0 + 1, x0 + 1] * fx * fy
best = None
for cx in np.arange(169.0, 171.01, 0.25):
    for cy in np.arange(121.0, 123.01, 0.25):
        rs = [[], [], []]
        for ang in np.linspace(0, 2 * np.pi, 72, endpoint=False):
            prev, k = bil(cx - 0.5, cy - 0.5), 0
            for t in np.arange(0.1, 90, 0.1):
                v = bil(cx + np.cos(ang) * t - 0.5, cy + np.sin(ang) * t - 0.5)
                if (prev - 0.5) * (v - 0.5) < 0 and k < 3: rs[k].append(t); k += 1
                prev = v
        sd = sum(np.std(r) for r in rs)
        if best is None or sd < best[0]: best = (sd, cx, cy, [float(np.mean(r)) for r in rs])
_, cx, cy, (r_isi, r_dalam, r_luar) = best
def lingkaran(r, cw=True):
    s = 1 if cw else 0
    return f"M{cx - r:.2f} {cy:.2f} A{r:.2f} {r:.2f} 0 1 {s} {cx + r:.2f} {cy:.2f} A{r:.2f} {r:.2f} 0 1 {s} {cx - r:.2f} {cy:.2f} Z"
paths.append(lingkaran(r_luar) + " " + lingkaran(r_dalam, cw=False))  # cincin (arah berlawanan = lubang)
paths.append(lingkaran(r_isi))
print(f"piring pusat ({cx:.2f}, {cy:.2f}) r luar {r_luar:.2f} · dalam {r_dalam:.2f} · isi {r_isi:.2f}")

# viewBox: kotak tinta + 2 px
ys, xs = np.where(ink)
vb = f"{xs.min() - 2} {ys.min() - 2} {xs.max() - xs.min() + 5} {ys.max() - ys.min() + 5}"
body = "".join(f'<path fill="currentColor" d="{d}"/>' for d in paths)
(ASET / "makan.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{body}</svg>\n')

# IoU: rasterisasi poligon pada 4× lalu turunkan
S = 4
cv = Image.new("L", (W * S, H * S), 0); dr = ImageDraw.Draw(cv)
import re
for d in paths[:-2]:
    pts = [(float(x) * S, float(y) * S) for x, y in re.findall(r"([\d.]+) ([\d.]+)", d)]
    dr.polygon(pts, fill=255)
for r, f in ((r_luar, 255), (r_dalam, 0), (r_isi, 255)):
    dr.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=f)
m = np.asarray(cv.resize((W, H), Image.BOX)) > 127
iou = (m & ink).sum() / (m | ink).sum()
print(f"IoU terhadap acuan Simon: {iou:.4f}")
