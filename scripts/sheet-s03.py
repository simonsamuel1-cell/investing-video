#!/usr/bin/env python3
"""Lembar pratinjau Scene 03 -> 04_Asset/pratinjau-visual/S03_ide-visual.png (butuh still out/stills/Ide-S03_fNNNNN.png).
Render dulu: COMP=Ide-S03 node scripts/stills.mjs 40 130 230 420 480 690 880 1110 1380 1640 1810 2109"""
from PIL import Image, ImageDraw, ImageFont
F = "/System/Library/Fonts/Helvetica.ttc"
f1, f2, fh = ImageFont.truetype(F, 21), ImageFont.truetype(F, 20), ImageFont.truetype(F, 30)
AWAL = 4690
S = [(40, "Scene 02 keluar (mengecil + pudar)", "\"Sekarang kita masuk…\""),
     (130, "slot bab 02 \"?\"", "\"…aset yang karakternya sangat berbeda:\""),
     (230, "slot terisi: bab 02 Emas", "\"emas.\""),
     (420, "emas ke garis waktu · Hari ini · 1 gram", "\"Kalau hari ini kita membeli satu gram emas,\""),
     (480, "emas menempuh 10 tahun, jejaknya tertinggal", "\"sepuluh tahun lagi,\""),
     (690, "1 gram = 1 gram", "\"secara fisik emas itu tetap satu gram.\""),
     (880, "Bunga rutin dicoret", "\"Emas tidak membayar bunga secara rutin,\""),
     (1110, "Laba bisnis dicoret · judul (TEXT naskah)", "\"…bisnis yang menghasilkan laba.\""),
     (1380, "emas jadi lencana · chart harga × waktu (tahun)", "\"Jadi sumber return … perubahan harga.\""),
     (1640, "Beli di lembah, Jual di puncak", "\"Kalau kita beli di harga lebih rendah lalu menjualnya…\""),
     (1810, "selisih naik = Untung", "\"…di harga lebih tinggi, kita untung.\""),
     (2109, "Beli di puncak, harga turun = Rugi (akhir)", "\"Sebaliknya, kalau harganya turun, kita juga bisa rugi.\"")]
W, H, CAP, PAD, cols, rows = 760, 428, 92, 18, 3, 4
sheet = Image.new("RGB", (cols * W + (cols + 1) * PAD, 70 + rows * (H + CAP + PAD) + PAD), "white")
d = ImageDraw.Draw(sheet)
d.text((PAD, 18), "Scene 03 · Emas — ide visual   (Studio: komposisi Ide-S03, frame 0 = video 01:18.10)", fill=(22, 24, 27), font=fh)
tc = lambda f: f"{f // 3600:02d}:{f // 60 % 60:02d}.{f % 60:02d}"
for k, (fr, judul, vo) in enumerate(S):
    im = Image.open(f"out/stills/Ide-S03_f{fr:05d}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = PAD + (k % cols) * (W + PAD), 70 + (k // cols) * (H + CAP + PAD)
    sheet.paste(im, (x, y))
    d.text((x, y + H + 6), f"{k + 1}.  Ide-S03 {tc(fr)}   (video {tc(fr + AWAL)})", fill=(142, 142, 150), font=f1)
    d.text((x, y + H + 34), judul, fill=(22, 24, 27), font=f1)
    d.text((x, y + H + 62), vo, fill=(95, 77, 238), font=f2)
sheet.save("../04_Asset/pratinjau-visual/S03_ide-visual.png")
print("-> 04_Asset/pratinjau-visual/S03_ide-visual.png")
