#!/usr/bin/env python3
"""Lembar pratinjau Scene 04 -> 04_Asset/pratinjau-visual/S04_ide-visual.png (butuh still out/stills/Ide-S04_fNNNNN.png)."""
from PIL import Image, ImageDraw, ImageFont
F = "/System/Library/Fonts/Helvetica.ttc"
f1, f2, fh = ImageFont.truetype(F, 21), ImageFont.truetype(F, 20), ImageFont.truetype(F, 30)
AWAL = 6800
S = [(0, "Scene 03 keluar: anotasi, garis ilustrasi & judul memudar", "\"Lalu kenapa harga emas…\""),
     (170, "chart ambil DATA ASLI (mingguan sejak 2016, log)", "\"…dalam beberapa tahun terakhir…\""),
     (270, "judul TEXT + \"Naik ≈5,3× sejak 2016\"", "\"…bisa naik cukup kuat?\""),
     (400, "chart menyusut jadi kartu · tiga pendorong muncul", "\"…saat ketidakpastian di pasar meningkat,\""),
     (700, "investor lebih berhati-hati", "\"investor biasanya menjadi lebih berhati-hati\""),
     (820, "permintaan emas naik, harga emas naik", "\"dan permintaan terhadap emas ikut naik.\""),
     (1260, "investor + bank sentral mendorong permintaan", "\"…permintaan dari investor maupun bank sentral meningkat.\""),
     (1400, "arah sebaliknya: semua panah berbalik (oranye)", "\"Tapi arah sebaliknya juga tetap mungkin terjadi.\""),
     (1790, "kartu membesar lagi · penurunan asli disorot", "\"Kalau sentimen berubah, harga emas bisa turun lagi.\""),
     (1930, "judul TEXT baris 2", "\"Jadi logikanya tetap sama:\""),
     (2060, "Laba bisnis dicoret (gema Scene 03)", "\"emas tidak terus-menerus menghasilkan laba,\""),
     (2285, "penanda naik/turun di ayunan harga asli (akhir)", "\"…return-nya terutama berasal dari perubahan harga.\"")]
W, H, CAP, PAD, cols, rows = 760, 428, 92, 18, 3, 4
sheet = Image.new("RGB", (cols * W + (cols + 1) * PAD, 70 + rows * (H + CAP + PAD) + PAD), "white")
d = ImageDraw.Draw(sheet)
d.text((PAD, 18), "Scene 04 · Kenapa harga emas naik — ide visual   (Studio: komposisi Ide-S04, frame 0 = video 01:53.20)", fill=(22, 24, 27), font=fh)
tc = lambda f: f"{f // 3600:02d}:{f // 60 % 60:02d}.{f % 60:02d}"
for k, (fr, judul, vo) in enumerate(S):
    im = Image.open(f"out/stills/Ide-S04_f{fr:05d}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = PAD + (k % cols) * (W + PAD), 70 + (k // cols) * (H + CAP + PAD)
    sheet.paste(im, (x, y))
    d.text((x, y + H + 6), f"{k + 1}.  Ide-S04 {tc(fr)}   (video {tc(fr + AWAL)})", fill=(142, 142, 150), font=f1)
    d.text((x, y + H + 34), judul, fill=(22, 24, 27), font=f1)
    d.text((x, y + H + 62), vo, fill=(95, 77, 238), font=f2)
sheet.save("../04_Asset/pratinjau-visual/S04_ide-visual.png")
print("-> 04_Asset/pratinjau-visual/S04_ide-visual.png")
