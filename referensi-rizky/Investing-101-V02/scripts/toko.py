#!/usr/bin/env python3
"""ILUSTRASI TOKO (bisnis berkembang, Simon 8 Okt): stok Flowbite Illustrations `store-discount-open.svg` (MIT, _fondasi/icons/
illustrations/flowbite) — diwarnai ulang ke ungu brand, teks Inggris "%" & "OPEN" dibuang (papan dibiarkan polos).
Keluaran: src/parts/toko.gen.ts (SVG langsung, bukan <Img>: tak ada muat/dekode di tengah pemutaran).  python3 scripts/toko.py"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path('/Users/rizkysuryapratama/Desktop/002. Januari 2026/_fondasi/icons/illustrations/flowbite/store-discount-open.svg')
s = SRC.read_text()
vb = re.search(r'viewBox="([^"]+)"', s).group(1)
body = s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
# buang: dua tanda "%" (#2563eb), papan OPEN (dua kotak #9ab7f6 di x 349–423, y 202–245) + huruf O-P-E-N (#d6e2fb, x 375–409)
def buang(b, cocok):
    return re.sub(r'<path\b[^>]*?/>', lambda m: '' if cocok(m.group(0)) else m.group(0), b, flags=re.S)
body = buang(body, lambda p: 'fill="#2563eb"' in p)
body = buang(body, lambda p: re.search(r' d="M(349 204C|421 204H)', p) is not None)
body = buang(body, lambda p: re.search(r' d="M(409\.001 218|387\.453 231|376\.496 231|375\.581 224)', p) is not None)
WARNA = {'#2563eb': '#5F4DEE', '#9ab7f6': '#5F4DEE', '#c8d8fa': '#8F83F4', '#d6e2fb': '#C9C3FA'}  # varian A: kontras di latar krim (diuji 8 Okt)
for a, b in WARNA.items():
    body = re.sub(a, b, body, flags=re.I)
body = re.sub(r'\s+', ' ', body).strip()
out = ROOT / 'src/parts/toko.gen.ts'
out.write_text('/* DIBANGKITKAN oleh scripts/toko.py — jangan diedit tangan. Stok Flowbite Illustrations (MIT), diwarnai ulang brand. */\n'
               f'export const TOKO = {{ vb: {vb!r}, svg: {body!r} }};\n'.replace("'", '"', 0))
print(out, len(body))
