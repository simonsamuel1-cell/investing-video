#!/usr/bin/env python3
"""THUMBNAIL seri Technical Analysis (Lesson 02 / 06 / 08 / 10) — SVG 1920x1080.

Layout   : disalin dari contoh Simon `Thumbnail - Support & Resistance.svg` (pil seri, judul, garis bawah, logo, kartu chart).
Latar    : `1.jpg` kiriman Simon (diperkecil ke 1920x1080, ditanam base64).
Chart    : data candle RIIL episode masing-masing (MDKA / DEWA / ADMR). Lesson 02 = anatomi candle (ilustrasi).
Teks     : HIDUP (Plus Jakarta Sans) supaya bisa diedit di Illustrator.
Pakai    : python3 build_thumbs.py            -> menulis 4 SVG ke folder `022. Technical Analysis/`
"""
import base64, json, math, os, re, sys
from PIL import ImageFont

SINI = os.path.dirname(os.path.abspath(__file__))
TA = os.path.dirname(SINI)
CONTOH = f'{TA}/Thumbnail - Support & Resistance.svg'
FDIR = os.path.expanduser('~/Library/Fonts')
W, H = 1920, 1080
F_XB = "PlusJakartaSans-ExtraBold, 'Plus Jakarta Sans'"
F_B = "PlusJakartaSans-Bold, 'Plus Jakarta Sans'"
F_SB = "PlusJakartaSans-SemiBold, 'Plus Jakarta Sans'"
F_M = "PlusJakartaSans-Medium, 'Plus Jakarta Sans'"
BLUE, TURQ, UP, DOWN, ABU, ABU2 = '#5F4DEE', '#5CC8E3', '#22B573', '#E5475D', '#666B78', '#8E8E96'
BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agst', 'Sep', 'Okt', 'Nov', 'Des']

_f = {}
def lebar(teks, berkas, size):
    k = (berkas, round(size * 4))
    if k not in _f: _f[k] = ImageFont.truetype(f'{FDIR}/{berkas}', round(size * 4))
    return _f[k].getlength(teks) / (round(size * 4) / size)
def tinta(teks, berkas, size):
    """(kiri, kanan) tinta relatif terhadap x awal teks."""
    f = ImageFont.truetype(f'{FDIR}/{berkas}', round(size * 4)); b = f.getbbox(teks); s = round(size * 4) / size
    return b[0] / s, b[2] / s
ribu = lambda v: f'{int(round(v)):,}'.replace(',', '.')
esc = lambda t: t.replace('&', '&amp;')

# ── potongan dari contoh Simon (logo + pil) ─────────────────────────────────
src = open(CONTOH).read()
i_logo = src.index('<g id="logo'); i_teks = src.index('<g id="teks')
LOGO = src[i_logo: src.rindex('<g>', 0, i_teks)]
i_pil = src.index('<g>', i_teks); i_judul = src.index('<g enable-background', i_teks)
PIL_ = src[i_pil: i_judul]
for nama, pot in (('logo', LOGO), ('pil', PIL_)):
    assert len(re.findall(r'<g[\s>]', pot)) == pot.count('</g>'), f'potongan {nama} tidak seimbang'
LATAR = base64.b64encode(open(f'{SINI}/latar_1920.jpg', 'rb').read()).decode()

# ── geometri kartu (dari contoh) ────────────────────────────────────────────
PX0, PX1 = 945.5, 1702.5          # area plot
AX = 1720                         # label sumbu harga
KARTU_KI, KARTU_KA = 887.5, 1827.5

def kerangka(lesson, baris, chip, sub, isi, judul_svg):
    n = len(baris)
    size = 100.0                                       # Simon 20 Nov: judul 100 px di semua thumbnail
    assert max(tinta(b, 'PlusJakartaSans-ExtraBold.ttf', size)[1] for b in baris) + 97 <= 800
    lh = 140 * size / 132
    # blok teks (pil 44 + judul + garis) dipusatkan di y=540 seperti contoh (pil 344..388, garis ..738 untuk 2 baris)
    naik = (n - 2) * lh / 2 + (132 - size) * 0.35 * 0          # 3 baris: geser ke atas setengah baris
    tinggi_blok = 44 + (513.68 - 365.6) * size / 132 + (n - 1) * lh + 54 + 8
    y_pil = 540 - tinggi_blok / 2                      # atas pil
    base1 = y_pil + 44 + (513.68 - 365.6) * size / 132
    y_garis = base1 + (n - 1) * lh + 54
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<title>{esc(judul_svg)}</title>',
         f'<g id="latar"><image width="{W}" height="{H}" preserveAspectRatio="none" xlink:href="data:image/jpeg;base64,{LATAR}"/></g>',
         LOGO,
         f'<g id="teks">',
         f'<g id="pil-seri" transform="translate(0 {y_pil - 321.81:.2f})">', PIL_]
    t = f'Technical Analysis – Lesson {lesson}'
    o.append(f'<text x="325.3" y="353" text-anchor="middle" font-family="{F_B}" font-weight="700" font-size="27" fill="#FFFFFF">{t}</text></g>')
    o.append('<g id="judul">')
    for k, b in enumerate(baris):
        ki = tinta(b, 'PlusJakartaSans-ExtraBold.ttf', size)[0]
        o.append(f'<text x="{97 - ki:.1f}" y="{base1 + k * lh:.1f}" font-family="{F_XB}" font-weight="800" font-size="{size:.0f}" fill="#FFFFFF">{esc(b)}</text>')
    o.append('</g>')
    o.append(f'<rect id="garis-judul" x="98.5" y="{y_garis:.1f}" width="336" height="8" rx="4" fill="{TURQ}"/>')
    o.append('</g>')
    # kartu
    o.append('<g id="kartu-chart">')
    o.append('<rect x="897.5" y="227" width="920" height="650" rx="32" fill="#2A1C8F" fill-opacity="0.55"/>')
    o.append('<rect x="887.5" y="203" width="940" height="660" rx="32" fill="#FFFFFF"/>')
    wc = lebar(chip, 'PlusJakartaSans-ExtraBold.ttf', 26) + 58
    o.append(f'<rect x="927.5" y="243" width="{wc:.1f}" height="46" rx="23" fill="{BLUE}"/>')
    o.append(f'<text x="{927.5 + wc / 2:.1f}" y="275" text-anchor="middle" font-family="{F_XB}" font-weight="800" font-size="26" fill="#FFFFFF">{chip}</text>')
    o.append(f'<text x="{927.5 + wc + 19:.1f}" y="274" font-family="{F_M}" font-weight="500" font-size="23" fill="{ABU2}">{sub}</text>')
    o += isi
    o.append('</g></svg>')
    print(f'  judul {size:.0f}px, pil y={y_pil:.0f}, garis y={y_garis:.0f}, pusat blok={(y_pil + y_garis + 8) / 2:.1f}')
    return '\n'.join(o)

# ── alat chart ──────────────────────────────────────────────────────────────
def chip_svg(xl, yc, teks, warna, h=50, fs=26):
    w = lebar(teks, 'PlusJakartaSans-ExtraBold.ttf', fs) + h
    return (f'<rect x="{xl:.1f}" y="{yc - h / 2:.1f}" width="{w:.1f}" height="{h}" rx="{h / 2}" fill="{warna}"/>'
            f'<text x="{xl + w / 2:.1f}" y="{yc + fs * 0.35:.1f}" text-anchor="middle" font-family="{F_XB}" font-weight="800" font-size="{fs}" fill="#FFFFFF">{teks}</text>'), w
def panah(xc, ytip, warna, turun, L=46):
    """panah gaya contoh: batang 6 px + kepala 26x16. ytip = ujung runcing."""
    if turun:
        return (f'<rect x="{xc - 3:.1f}" y="{ytip - L:.1f}" width="6" height="{L - 15}" rx="3" fill="{warna}"/>'
                f'<path d="M{xc - 13:.1f} {ytip - 16:.1f}h26l-13 16z" fill="{warna}" stroke="{warna}" stroke-width="3" stroke-linejoin="round"/>')
    return (f'<rect x="{xc - 3:.1f}" y="{ytip + 15:.1f}" width="6" height="{L - 15}" rx="3" fill="{warna}"/>'
            f'<path d="M{xc - 13:.1f} {ytip + 16:.1f}h26l-13 -16z" fill="{warna}" stroke="{warna}" stroke-width="3" stroke-linejoin="round"/>')
def candles(bars, x, y, bw):
    o = []
    for i, b in enumerate(bars):
        w = UP if b['c'] >= b['o'] else DOWN
        o.append(f'<rect x="{x(i) - 0.9:.2f}" y="{y(b["h"]):.2f}" width="1.8" height="{max(1, y(b["l"]) - y(b["h"])):.2f}" fill="{w}"/>')
        yt, yb = y(max(b['o'], b['c'])), y(min(b['o'], b['c']))
        o.append(f'<rect x="{x(i) - bw / 2:.2f}" y="{yt:.2f}" width="{bw:.2f}" height="{max(1.5, yb - yt):.2f}" fill="{w}"/>')
    return o
def kisi_harga(nilai, y, x0=PX0, x1=PX1, label=True, fmt=ribu):
    o = []
    for v in nilai:
        o.append(f'<rect x="{x0}" y="{y(v) - 0.75:.1f}" width="{x1 - x0}" height="1.5" fill="#16181B" fill-opacity="0.1"/>')
        if label: o.append(f'<text x="{AX}" y="{y(v) + 8.5:.1f}" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{fmt(v)}</text>')
    return o
def sumbu_bulan(tgl, x, ybase=818, lewati=()):
    o, lalu = [], None
    for i, t in enumerate(tgl):
        m = t[:7]
        if m != lalu and (lalu is not None or t[8:10] <= '05'):
            if m not in lewati:
                o.append(f'<text x="{x(i):.1f}" y="{ybase}" text-anchor="middle" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{BULAN[int(m[5:7]) - 1]}</text>')
        lalu = m
    return o
def bebas(w, h, yc, kotak, x_dari, x_sampai, pad=12, arah=1):
    """x kiri pertama sehingga chip (w x h, pusat yc) tidak menyentuh kotak-kotak penghalang."""
    rng = range(int(x_dari), int(x_sampai - w)) if arah > 0 else range(int(x_sampai - w), int(x_dari), -1)
    for xl in rng:
        if all(bx1 < xl - pad or bx0 > xl + w + pad or by1 < yc - h / 2 - pad or by0 > yc + h / 2 + pad for bx0, by0, bx1, by1 in kotak):
            return xl
    return None

# ── data ────────────────────────────────────────────────────────────────────
def baca_ts(path, pola):
    s = open(path).read(); out = []
    for m in re.finditer(pola, s):
        t, o, h, l, c = m.group(1), *map(float, m.group(2, 3, 4, 5))
        out.append(dict(t=t, o=o, h=h, l=l, c=c))
    return out
V06 = f'{TA}/Video 06 - Chart Pattern'
V08 = f'{TA}/Video 08 - RSI, Stochastic, MACD & Other Oscillatr'
V10 = f'{TA}/Video 10 - Multi-Timeframe Analysis and Confluence/mtf-episode/src/episode10mtf/data'
P_ADMR = r"\{ t: '([^']+)', o: ([\d.]+), h: ([\d.]+), l: ([\d.]+), c: ([\d.]+)"

# ════ v3 (20 Nov): SEMUA chart diambil dari chart ILUSTRASI di video masing-masing, BUKAN data saham riil ═

def rsi_wilder(c, n=14):
    out = [None] * len(c); ag = al = 0.0
    for i in range(1, len(c)):
        ch = c[i] - c[i - 1]; g, l_ = max(ch, 0), max(-ch, 0)
        if i <= n:
            ag += g; al += l_
            if i == n: ag /= n; al /= n; out[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
        else:
            ag = (ag * (n - 1) + g) / n; al = (al * (n - 1) + l_) / n; out[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
    return out
def ema(v, n):
    k = 2 / (n + 1); e = None; out = []
    for a in v: e = a if e is None else a * k + e * (1 - k); out.append(e)
    return out
def sma(v, n): return [sum(v[max(0, i - n + 1): i + 1]) / len(v[max(0, i - n + 1): i + 1]) for i in range(len(v))]
def kisi_garis(nilai, y, x0=PX0, x1=PX1):
    return [f'<rect x="{x0}" y="{y(v) - 0.75:.1f}" width="{x1 - x0}" height="1.5" fill="#16181B" fill-opacity="0.1"/>' for v in nilai]
def label_kanan(yy, t, warna=ABU, font=None):
    return f'<text x="{AX}" y="{yy + 8.5:.1f}" font-family="{font or F_SB}" font-weight="600" font-size="24" fill="{warna}">{t}</text>'

# ════ Lesson 02 — chart pembuka video 02 (CONTEXT_CANDLES) + candle cerita video (O500 H550 L460 C510) ═
def isi_02():
    d = json.load(open(f'{SINI}/data_illus02.json'))
    cs, ax, st = d['candles'], d['axis'], d['story']
    PY0, PY1 = 318, 792
    y = lambda v: PY1 - (v - ax['min']) / (ax['max'] - ax['min']) * (PY1 - PY0)
    # panel candle cerita di kanan, lebarnya dihitung dari chip terlebar
    FS, CH, BW, JL = 20, 34, 54, 16
    kiri = [('High', st['h']), ('Open', st['o'])]; kanan = [('Close', st['c']), ('Low', st['l'])]
    wch = max(lebar(f'{a} {ribu(v)}', 'PlusJakartaSans-ExtraBold.ttf', FS) + CH for a, v in kiri + kanan)
    pw = 2 * (wch + JL + BW / 2) + 2 * 14
    P0 = PX1 - pw; X1c = P0 - 34                       # chart konteks berakhir 34 px sebelum panel
    n = len(cs); step = (X1c - PX0) / n
    x = lambda i: PX0 + (i + 0.5) * step
    o = ['<g id="sumbu-harga">'] + kisi_harga(range(ax['min'], ax['max'] + 1, ax['grid']), y) + ['</g>']
    o += ['<g id="candle-konteks">'] + candles(cs, x, y, step * 0.62) + ['</g>']
    o.append(f'<path id="panah-satu-candle" d="M{X1c + 17 - 7:.1f} {(PY0 + PY1) / 2 - 14:.1f}l14 14l-14 14" fill="none" stroke="{BLUE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')
    o.append('<g id="candle-cerita">')
    o.append(f'<rect x="{P0:.1f}" y="{PY0 - 10}" width="{pw:.1f}" height="{PY1 - PY0 + 20}" rx="18" fill="{BLUE}" fill-opacity="0.08"/>')
    xc = P0 + pw / 2; warna = UP if st['c'] >= st['o'] else DOWN
    o.append(f'<rect x="{xc - 4}" y="{y(st["h"]):.1f}" width="8" height="{y(st["l"]) - y(st["h"]):.1f}" rx="4" fill="{warna}"/>')
    o.append(f'<rect x="{xc - BW / 2}" y="{y(max(st["o"], st["c"])):.1f}" width="{BW}" height="{abs(y(st["o"]) - y(st["c"])):.1f}" rx="6" fill="{warna}"/>')
    for sisi, daftar in ((-1, kiri), (1, kanan)):
        for nama, v in daftar:
            teks = f'{nama} {ribu(v)}'; wr = TURQ if nama in ('High', 'Low') else BLUE
            w = lebar(teks, 'PlusJakartaSans-ExtraBold.ttf', FS) + CH
            ujung = 4 if nama in ('High', 'Low') else BW / 2
            xl = xc + ujung + JL if sisi > 0 else xc - ujung - JL - w
            xa, xb = (xc + ujung + 4, xl - 2) if sisi > 0 else (xl + w + 2, xc - ujung - 4)
            o.append(f'<line x1="{xa:.1f}" y1="{y(v):.1f}" x2="{xb:.1f}" y2="{y(v):.1f}" stroke="{wr}" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round"/>')
            o.append(chip_svg(xl, y(v), teks, wr, h=CH, fs=FS)[0])
    o.append('</g>')
    print(f'  V02 {n} candle konteks (step {step:.1f}) · panel {P0:.0f}-{PX1:.0f} ({pw:.0f}) · body cerita {abs(y(st["o"]) - y(st["c"])):.0f}px')
    return o

# ════ Lesson 06 — SC03 video 06: Ascending Triangle (vektor Illustrator, dipetakan ulang) ═══════
def isi_06():
    D = f'{V06}/cp-episode/public/art/SC03'
    sv = open(f'{D}/candle.svg').read()
    wick = [tuple(map(float, m)) for m in re.findall(r'x1="([\d.]+)" y1="([\d.]+)" x2="[\d.]+" y2="([\d.]+)"', sv)]
    body = [(float(a), float(b), float(c), float(e), f) for a, b, f, c, e in re.findall(r'<rect x="([\d.]+)" y="([\d.]+)" fill="(#[0-9A-F]+)" width="([\d.]+)" height="([\d.]+)"', sv)]
    assert len(wick) == len(body) == 96, (len(wick), len(body))
    sx0, sx1 = min(b[0] for b in body), max(b[0] + b[2] for b in body)
    sy0, sy1 = min(w[1] for w in wick), max(w[2] for w in wick)
    tx0, tx1, ty0, ty1 = PX0 + 4, PX1 - 4, 330, 776
    X = lambda v: tx0 + (v - sx0) / (sx1 - sx0) * (tx1 - tx0)
    Y = lambda v: ty0 + (v - sy0) / (sy1 - sy0) * (ty1 - ty0)
    k = (tx1 - tx0) / (sx1 - sx0)
    o = []
    # garis 100 (satu-satunya label harga di SC03)
    m = re.search(r'y1="([\d.]+)"', open(f'{D}/sumbu harga.svg').read()); y100 = Y(float(m.group(1)))
    o.append(f'<g id="sumbu-harga"><rect x="{PX0}" y="{y100 - 0.75:.1f}" width="{PX1 - PX0}" height="1.5" fill="#16181B" fill-opacity="0.1"/>{label_kanan(y100, "100")}</g>')
    poly = re.search(r'points="([^"]+)"', open(f'{D}/tint penyempitan.svg').read()).group(1).split()
    pts = ' '.join(f'{X(float(p.split(",")[0])):.1f},{Y(float(p.split(",")[1])):.1f}' for p in poly)
    # isi segitiga: dari garis lantai naik + resistance (bukan hanya tint penyempitan) supaya bentuk segitiga terbaca
    fl = re.search(r'x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"', open(f'{D}/garis lantai naik.svg').read()).groups()
    rs = re.search(r'x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"', open(f'{D}/garis resistance.svg').read()).groups()
    fl = [float(v) for v in fl]; rs = [float(v) for v in rs]
    ylantai = lambda sx: fl[1] + (fl[3] - fl[1]) / (fl[2] - fl[0]) * (sx - fl[0])
    o.append(f'<path id="isi-segitiga" d="M{X(rs[0]):.1f} {Y(rs[1]):.1f}L{X(rs[2]):.1f} {Y(rs[1]):.1f}L{X(fl[2]):.1f} {Y(fl[3]):.1f}L{X(rs[0]):.1f} {Y(ylantai(rs[0])):.1f}Z" fill="{BLUE}" fill-opacity="0.10"/>')
    o.append('<g id="candle">')
    for (wx, wy1, wy2), (bx, by, bw, bh, f) in zip(wick, body):
        wr = UP if f == '#16B37A' else DOWN
        o.append(f'<rect x="{X(wx) - 0.9:.2f}" y="{Y(wy1):.2f}" width="1.8" height="{Y(wy2) - Y(wy1):.2f}" fill="{wr}"/>')
        o.append(f'<rect x="{X(bx):.2f}" y="{Y(by):.2f}" width="{bw * k:.2f}" height="{max(1.5, bh * (ty1 - ty0) / (sy1 - sy0)):.2f}" fill="{wr}"/>')
    o.append('</g>')
    o.append('<g id="garis-pola" stroke-width="5" stroke-linecap="round">')
    o.append(f'<line x1="{X(rs[0]):.1f}" y1="{Y(rs[1]):.1f}" x2="{X(rs[2]):.1f}" y2="{Y(rs[3]):.1f}" stroke="{TURQ}"/>')
    o.append(f'<line x1="{X(fl[0]):.1f}" y1="{Y(fl[1]):.1f}" x2="{X(fl[2]):.1f}" y2="{Y(fl[3]):.1f}" stroke="{BLUE}"/>')
    o.append('</g>')
    kotak = [(X(bx) - 4, Y(wy1), X(bx) + bw * k + 4, Y(wy2)) for (wx, wy1, wy2), (bx, by, bw, bh, f) in zip(wick, body)]
    kotak += [(X(rs[0]), Y(rs[1]) - 4, X(rs[2]), Y(rs[1]) + 4)]
    kotak += [(X(fl[0] + (fl[2] - fl[0]) * t / 20) - 3, Y(ylantai(fl[0] + (fl[2] - fl[0]) * t / 20)) - 4, X(fl[0] + (fl[2] - fl[0]) * t / 20) + 3, Y(ylantai(fl[0] + (fl[2] - fl[0]) * t / 20)) + 4) for t in range(21)]
    o.append('<g id="chip">')
    # label video di posisi aslinya (SC03 geo: langit-langit tetap x478 y337-378 · lantai naik x987 y655-696), digeser bila menabrak
    for teks, wr, gx, gy in (('Langit-Langit Tetap', TURQ, 478, (337 + 378) / 2), ('Lantai Naik', BLUE, 987, (655 + 696) / 2)):
        svg, w = chip_svg(0, 0, teks, wr, h=36, fs=20)
        yc = Y(gy); xl_ = None
        for dy_ in (0, -6, 6, -12, 12, -18, 18):
            xl_ = bebas(w, 36, yc + dy_, kotak, X(gx) - 60, X(gx) + 260, pad=6)
            if xl_ is not None: yc += dy_; break
        assert xl_ is not None, teks
        print(f'  V06 chip {teks} x={xl_} (video {X(gx):.0f}) y={yc:.0f}')
        o.append(chip_svg(xl_, yc, teks, wr, h=36, fs=20)[0])
    # Breakout: candle pertama yang menutup di atas resistance sesudah ujung segitiga
    tembus = next(i for i, (bx, by, bw, bh, f) in enumerate(body) if bx > rs[2] - 20 and f == '#16B37A' and by < rs[1])
    xp = X(body[tembus][0]) + body[tembus][2] * k / 2
    svg, w = chip_svg(0, 0, 'Breakout', TURQ)
    # kandidat: kotak bebas terdekat ke ujung panah (di bawah candle penembus)
    ytip = Y(wick[tembus][2]) + 10
    calon = []
    for yk in range(int(ytip + 20), int(ytip + 200), 6):
        for arah in (1, -1):
            xbk = bebas(w, 50, yk, kotak + [(xp - 16, ytip, xp + 16, ytip + 46)], xp - w - 160, xp + 160 + w, pad=8, arah=arah)
            if xbk is not None: calon.append((abs(xbk + w / 2 - xp) + abs(yk - ytip - 60), xbk, yk))
    _, xbk, yk = min(calon)
    o.append(chip_svg(xbk, yk, 'Breakout', TURQ)[0])
    o.append('</g>')
    o.append('<g id="panah">' + panah(xp, Y(wick[tembus][2]) + 10, TURQ, False) + '</g>')
    print(f'  V06 breakout candle #{tembus} x={xp:.0f} · chip x={xbk}')
    return o

# ════ Lesson 08 — data ilustrasi video 08 (illus.ts, tanpa ticker) · harga + RSI + Stochastic + MACD ═
def isi_08():
    s = open(f'{V08}/oscillator-episode/src/episode08oscillator/data/illus.ts').read()
    raw = s[s.index('const RAW'): s.index('];', s.index('const RAW'))]
    semua = [dict(o=float(m[0]), h=float(m[1]), l=float(m[2]), c=float(m[3])) for m in re.findall(r'\[(\d+), (\d+), (\d+), (\d+), \d+\]', raw)]
    c = [b['c'] for b in semua]; N = len(c)
    rsi = rsi_wilder(c)
    mac = [a - b for a, b in zip(ema(c, 12), ema(c, 26))]; sig = ema(mac, 9); hist = [a - b for a, b in zip(mac, sig)]
    rw = []
    for i in range(N):
        hh = max(b['h'] for b in semua[max(0, i - 13): i + 1]); ll = min(b['l'] for b in semua[max(0, i - 13): i + 1])
        rw.append(50 if hh == ll else (c[i] - ll) / (hh - ll) * 100)
    sk = sma(rw, 3); sd = sma(sk, 3)
    A, B = 96, 216                                    # turun ke oversold (bar 123) lalu naik & 26 bar di atas 70 (160–185)
    cs = semua[A:B]; rsi, sk, sd, mac, sig, hist = (v[A:B] for v in (rsi, sk, sd, mac, sig, hist))
    n = len(cs); step = (PX1 - PX0) / n; x = lambda i: PX0 + (i + 0.5) * step
    lo, hi = min(b['l'] for b in cs), max(b['h'] for b in cs)
    P = [(306, 478), (500, 584), (604, 688), (708, 792)]  # harga, RSI, Stochastic, MACD
    yP = lambda v: P[0][1] - (v - lo) / (hi - lo) * (P[0][1] - P[0][0])
    o = ['<g id="sumbu-harga">']
    for v in [v for v in range(0, 10000, 500) if lo <= v <= hi]: o += kisi_harga([v], yP)
    o.append('</g>')
    o += ['<g id="candle">'] + candles(cs, x, yP, max(2, step * 0.62)) + ['</g>']
    def garis(v, yf, wr, lw=3):
        return f'<polyline points="{" ".join(f"{x(i):.1f},{yf(a):.1f}" for i, a in enumerate(v))}" fill="none" stroke="{wr}" stroke-width="{lw}" stroke-linejoin="round" stroke-linecap="round"/>'
    def zona(yf, a, b):
        return [f'<rect x="{PX0}" y="{yf(100):.1f}" width="{PX1 - PX0}" height="{yf(a) - yf(100):.1f}" fill="{TURQ}" fill-opacity="0.22"/>',
                f'<rect x="{PX0}" y="{yf(b):.1f}" width="{PX1 - PX0}" height="{yf(0) - yf(b):.1f}" fill="{BLUE}" fill-opacity="0.14"/>',
                f'<rect x="{PX0}" y="{yf(a) - 1:.1f}" width="{PX1 - PX0}" height="2" fill="{TURQ}"/>',
                f'<rect x="{PX0}" y="{yf(b) - 1:.1f}" width="{PX1 - PX0}" height="2" fill="{BLUE}"/>', label_kanan(yf(a), a), label_kanan(yf(b), b)]
    def nama(teks, kotak, y0, y1):
        w = lebar(teks, 'PlusJakartaSans-ExtraBold.ttf', 18) + 30
        for yc in (y0 + 19, y1 - 19):
            xl = bebas(w, 30, yc, kotak, PX0 + 8, PX1 - 8, pad=5)
            if xl is not None: return chip_svg(xl, yc, teks, BLUE, h=30, fs=18)[0]
        print(f'  ⚠ V08 chip {teks}: tidak ada tempat bebas'); return chip_svg(PX0 + 8, y0 + 19, teks, BLUE, h=30, fs=18)[0]
    box = lambda v, yf: [(x(i) - 3, yf(a) - 3, x(i) + 3, yf(a) + 3) for i, a in enumerate(v)]
    for k, (teks, y0, y1) in enumerate((('RSI (14)',) + P[1], ('Stochastic',) + P[2], ('MACD',) + P[3])):
        o.append(f'<rect x="{PX0}" y="{y0 - 11:.1f}" width="{PX1 - PX0}" height="1.5" fill="#16181B" fill-opacity="0.14"/>')
        if k < 2:
            f = lambda v, y0=y0, y1=y1: y1 - v / 100 * (y1 - y0)
            a, b = (70, 30) if k == 0 else (80, 20)
            o.append(f'<g id="panel-{teks.split()[0].lower()}">'); o += zona(f, a, b)
            if k == 0: o.append(garis(rsi, f, BLUE, 3.5)); kot = box(rsi, f)
            else: o.append(garis(sd, f, TURQ)); o.append(garis(sk, f, BLUE)); kot = box(sk, f) + box(sd, f)
        else:
            mm = max(max(map(abs, mac)), max(map(abs, sig))) * 1.1; f = lambda v, y0=y0, y1=y1: (y0 + y1) / 2 - v / mm * (y1 - y0) / 2
            o.append('<g id="panel-macd">'); o.append(f'<rect x="{PX0}" y="{f(0) - 0.75:.1f}" width="{PX1 - PX0}" height="1.5" fill="#16181B" fill-opacity="0.18"/>'); o.append(label_kanan(f(0), 0))
            kot = []
            for i, v in enumerate(hist):
                ya, yb = sorted((f(v), f(0)))
                o.append(f'<rect x="{x(i) - step * 0.31:.2f}" y="{ya:.2f}" width="{step * 0.62:.2f}" height="{max(1, yb - ya):.2f}" fill="{UP if v >= 0 else DOWN}" fill-opacity="0.75"/>'); kot.append((x(i) - 3, ya, x(i) + 3, yb))
            o.append(garis(mac, f, BLUE)); o.append(garis(sig, f, TURQ)); kot += box(mac, f) + box(sig, f)
        o.append(nama(teks, kot, y0, y1)); o.append('</g>')
    print(f'  V08 ilustrasi bar {A}-{B} harga {lo:.0f}-{hi:.0f} · RSI {min(rsi):.0f}-{max(rsi):.0f}')
    return o

# ════ Lesson 10 — seri ilustrasi video 10 (v10/illus.ts, tanpa ticker) · Weekly › Daily › 1 Hour ═
def isi_10():
    d = json.load(open(f'{SINI}/data_illus10.json'))['v10']
    NB = 30                                           # = 24 bar tangga Scene 03 + hanyutan
    wk, dy, h1 = d['w'][-NB:], d['d'][-NB:], d['h1'][-NB:]
    X0, X1, GAP = 927.5, 1787.5, 46
    pw = (X1 - X0 - 2 * GAP) / 3
    BY0, BY1 = 312, 826
    CY0, CY1 = 380, 742
    o = []
    zoom = (NB / 5, NB / 7, None)                     # 30 bar harian = 6 minggu; 30 bar 1 jam = 30/7 hari
    for k, (nm, job, bars) in enumerate((('Weekly', 'Arah', wk), ('Daily', 'Area', dy), ('1 Hour', 'Timing', h1))):
        x0 = X0 + k * (pw + GAP); n = len(bars); pad = 16; step = (pw - 2 * pad) / n
        x = lambda i, x0=x0, step=step, pad=pad: x0 + pad + (i + 0.5) * step
        lo, hi = min(b['l'] for b in bars), max(b['h'] for b in bars)
        y = lambda v, lo=lo, hi=hi: CY1 - (v - lo) / (hi - lo) * (CY1 - CY0)
        o.append(f'<g id="panel-{k + 1}-{nm.replace(" ", "")}">')
        o.append(f'<rect x="{x0:.1f}" y="{BY0}" width="{pw:.1f}" height="{BY1 - BY0}" rx="18" fill="#F3F1FE"/>')
        if zoom[k]:
            xz = x(n - zoom[k]) - step / 2 - 2
            o.append(f'<rect id="jendela-zoom-{k + 1}" x="{xz:.1f}" y="{CY0 - 14}" width="{x0 + pw - 8 - xz:.1f}" height="{CY1 - CY0 + 28}" rx="10" fill="{BLUE}" fill-opacity="0.10" stroke="{BLUE}" stroke-width="3" stroke-dasharray="10 14" stroke-linecap="round"/>')
        o += candles(bars, x, y, max(2, step * 0.62))
        svg, w = chip_svg(0, 0, nm, BLUE, h=40, fs=22)
        o.append(chip_svg(x0 + pw / 2 - w / 2, BY0 + 34, nm, BLUE, h=40, fs=22)[0])
        svg, w = chip_svg(0, 0, job, TURQ, h=40, fs=22)
        o.append(chip_svg(x0 + pw / 2 - w / 2, BY1 - 40, job, TURQ, h=40, fs=22)[0])
        o.append('</g>')
        if k < 2:
            xm = x0 + pw + GAP / 2; ym = (CY0 + CY1) / 2
            o.append(f'<path id="panah-zoom-{k + 1}" d="M{xm - 7:.1f} {ym - 14}l14 14l-14 14" fill="none" stroke="{BLUE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')
        print(f'  V10 {nm}: {n} bar {bars[0]["t"]}..{bars[-1]["t"]} · {bars[0]["o"]:.0f} -> {bars[-1]["c"]:.0f}')
    return o

JOB = {
    '02': (['Candlestick', 'Basics'], 'Grafik Harga', 'Open · High · Low · Close', isi_02, 'Thumbnail - Candlestick'),
    '06': (['Chart', 'Pattern'], 'Ascending Triangle', '', isi_06, 'Thumbnail - Chart Pattern'),
    '08': (['RSI, MACD', '& Stochastic'], 'Oscillator', 'Tiga Cara Membaca Momentum', isi_08, 'Thumbnail - Oscillator'),
    '10': (['Multi-', 'Timeframe', '& Confluence'], 'Top-Down', 'Arah · Area · Timing', isi_10, 'Thumbnail - Multi-Timeframe & Confluence'),
}
for les in (sys.argv[1:] or JOB):
    baris, chip, sub, fn, nama = JOB[les]
    print(f'Lesson {les}')
    svg = kerangka(les, baris, chip, sub, fn(), f'{nama} (Technical Analysis · Lesson {les})')
    open(f'{TA}/{nama}.svg', 'w').write(svg)
    print(f'  -> {nama}.svg ({len(svg) // 1024} KB)')
