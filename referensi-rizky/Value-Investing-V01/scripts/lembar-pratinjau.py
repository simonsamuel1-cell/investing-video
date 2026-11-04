#!/usr/bin/env python3
"""LEMBAR PRATINJAU revisi (2 Nov): python3 scripts/lembar-pratinjau.py keluar.jpg KOLOM "fNNNNN.png|keterangan" … (frame dari out/<folder>/)"""
import sys
from PIL import Image, ImageDraw, ImageFont
out, kol = sys.argv[1], int(sys.argv[2]); item = [a.split('|', 1) for a in sys.argv[3:]]
W, H, KET = 640, 360, 34
try: font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 20)
except Exception: font = ImageFont.load_default()
baris = (len(item) + kol - 1) // kol
c = Image.new('RGB', (W * kol, (H + KET) * baris), 'white'); d = ImageDraw.Draw(c)
for i, (p, ket) in enumerate(item):
    x, y = (i % kol) * W, (i // kol) * (H + KET)
    c.paste(Image.open(p).convert('RGB').resize((W, H)), (x, y + KET))
    d.text((x + 10, y + 7), ket, fill='black', font=font)
c.save(out, quality=88); print(out)
