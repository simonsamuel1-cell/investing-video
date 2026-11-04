#!/usr/bin/env python3
"""
AI TUNTUN — AI.mov Simon (qtrle 313x300, 60fps, 64 dtk) -> lembar sprite public/media/ai-tuntun/sprite.png
  python3 scripts/ai-tuntun-sprite.py "<…>/023…/Video 02 - Peluang & Ritme Trading/AI.mov"

1. Satu putaran bersih: frame 240..479 (periode 240; putaran pertama sedikit beda).
2. Alfa berkas PREMULTIPLIED ke hitam (warna/alfa konstan 58,200,218 = pendar toska) -> un-premultiply.
3. KANVAS DIPERBESAR (Simon 7 Okt: "bagian atas kepala icon ada bagian yang terpotong"): kanvas asli terlalu sempit untuk
   pantulan — pendar terpotong lurus di tepi atas (alfa s/d 81) & bawah (s/d 23); badan sendiri utuh (>= 3 px dari tepi).
   Pendar asli = blur Gaussian sigma 18 dari siluet badan x 1,07, tanpa geser (dipas di 3 frame, galat RMS 2% alfa) ->
   kanvas +48 atas / +24 bawah / +16 kiri-kanan, pendar dilengkapi model itu dekat tepi yang terpotong (maks dgn aslinya,
   jadi tak pernah dobel); di tengah kanvas piksel asli tidak diubah.
4. Sprite 16 kolom, sel 345x372 + jarak 2 px (tak ada bocor frame tetangga saat diperkecil).
"""
import sys, pathlib, importlib.util
import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('q', ROOT.parents[2] / '022. Technical Analysis/Video 06 - Chart Pattern/cp-episode/scripts/qtrle.py')
q = importlib.util.module_from_spec(spec); spec.loader.exec_module(q)

SRC = sys.argv[1]; OUT = ROOT / 'public/media/ai-tuntun/sprite.png'
A, B, W, H = 240, 480, 313, 300
PT, PB, PX = 48, 24, 16                      # perluasan kanvas
WN, HN = W + 2 * PX, H + PT + PB             # 345 x 372
COLS, PAD = 16, 2
SIGMA, K, TOSKA = 18, 1.07, np.array([58, 200, 218], np.float32)
ROWS = (B - A + COLS - 1) // COLS
sheet = np.zeros((ROWS * (HN + 2 * PAD), COLS * (WN + 2 * PAD), 4), np.uint8)

# bobot pemakaian model pendar: 1 di luar kanvas asli & di tepi yang terpotong, 0 di tengah kanvas asli
yy = np.arange(HN, dtype=np.float32)[:, None] - PT; xx = np.arange(WN, dtype=np.float32)[None, :] - PX
ss = lambda t: (lambda c: c * c * (3 - 2 * c))(np.clip(t, 0, 1))
bobot = 1 - ss(yy / 40.0) * ss((H - 1 - yy) / 8.0) * ss(xx / 12.0) * ss((W - 1 - xx) / 12.0)  # bawah 8 px saja: bayangan elips badan berakhir 33 px dari tepi (24 px membuat pita toska di bayangan)

def cb(n, rgba):
    if not (A <= n < B): return
    x = rgba.astype(np.float32); al = x[..., 3] / 255.0
    rgb = np.where(al[..., None] > 0, np.clip(x[..., :3] / np.maximum(al[..., None], 1 / 255), 0, 255), 0)
    pendar = (rgb[..., 1] - rgb[..., 0]) > 60
    # kanvas besar
    rgbN = np.zeros((HN, WN, 3), np.float32); aN = np.zeros((HN, WN), np.float32); gN = np.zeros((HN, WN), bool)
    rgbN[PT:PT + H, PX:PX + W] = rgb; aN[PT:PT + H, PX:PX + W] = al; gN[PT:PT + H, PX:PX + W] = pendar
    badan = np.where(gN, 0, aN)
    blur = np.asarray(Image.fromarray((badan * 255).round().astype(np.uint8)).filter(ImageFilter.GaussianBlur(SIGMA))).astype(np.float32) / 255
    S = np.clip(K * blur, 0, 1) * bobot                     # pendar model, hanya di tepi/luar kanvas asli
    kosong = aN <= 0
    # piksel pendar/kosong: alfa = maks(asli, model) — warna toska
    a0 = np.where(gN, aN, 0)
    ag = np.where(gN | kosong, np.maximum(a0, S), 0)
    # warna: piksel asli DIPERTAHANKAN; model hanya menambah alfa yang hilang (dengan toska) — campuran toska+bayangan tetap aslinya
    tambah = np.maximum(ag - a0, 0)
    warna_g = (rgbN * a0[..., None] + TOSKA * tambah[..., None]) / np.maximum(ag[..., None], 1e-6)
    out_rgb = np.where((gN | kosong)[..., None], warna_g, rgbN)
    out_a = np.where(gN | kosong, ag, aN)
    # piksel badan (termasuk tepi antialias): badan DI ATAS pendar model
    tb = ~(gN | kosong)
    ab = aN[tb]; sb = S[tb]
    oa = ab + sb * (1 - ab)
    out_rgb[tb] = (rgbN[tb] * ab[:, None] + TOSKA * (sb * (1 - ab))[:, None]) / np.maximum(oa[:, None], 1e-6)
    out_a[tb] = oa
    k = n - A; r, c = divmod(k, COLS)
    y0 = r * (HN + 2 * PAD) + PAD; x0 = c * (WN + 2 * PAD) + PAD
    sheet[y0:y0 + HN, x0:x0 + WN] = np.concatenate([out_rgb, out_a[..., None] * 255], axis=2).round().clip(0, 255).astype(np.uint8)

q.decode(SRC, cb)
OUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(sheet).save(OUT, optimize=True)
print(OUT, sheet.shape, f'sel {WN}x{HN}')
