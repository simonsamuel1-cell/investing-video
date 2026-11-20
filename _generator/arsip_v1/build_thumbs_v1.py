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
    # ukuran judul: seragam, paling besar 132, tinta kanan <= 800 (contoh: "Resistance" berakhir 797)
    size = 132.0
    while max(tinta(b, 'PlusJakartaSans-ExtraBold.ttf', size)[1] for b in baris) + 97 > 800: size -= 1
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

# ════ Lesson 02 — Candlestick: anatomi candle ═══════════════════════════════
def isi_02():
    o = ['<g id="anatomi">']
    def satu(xc, hi, top, bot, lo, warna, sisi, atas, bawah, nama):
        bw = 104
        o.append(f'<rect x="{xc - 4}" y="{hi}" width="8" height="{lo - hi}" rx="4" fill="{warna}"/>')
        o.append(f'<rect x="{xc - bw / 2}" y="{top}" width="{bw}" height="{bot - top}" rx="10" fill="{warna}"/>')
        for yv, teks, wr, ujung in ((hi, 'High', TURQ, 4), (top, atas, BLUE, bw / 2), (bot, bawah, BLUE, bw / 2), (lo, 'Low', TURQ, 4)):
            svg, w = chip_svg(0, yv, teks, wr, h=46, fs=24)
            xl = xc - sisi * 196 - (w if sisi > 0 else 0)
            xa, xb = (xl + w, xc - ujung - 10) if sisi > 0 else (xc + ujung + 10, xl)
            o.append(f'<line x1="{xa + 8 if sisi > 0 else xa:.1f}" y1="{yv}" x2="{xb if sisi > 0 else xb - 8:.1f}" y2="{yv}" stroke="{wr}" stroke-width="3" stroke-dasharray="10 14" stroke-linecap="round"/>')
            o.append(chip_svg(xl, yv, teks, wr, h=46, fs=24)[0])
        svg, w = chip_svg(0, 0, nama, warna, h=46, fs=24)
        o.append(chip_svg(xc - w / 2, 803, nama, warna, h=46, fs=24)[0])
    # pusat kartu x = 1357.5; dua candle simetris terhadapnya
    satu(1357.5 - 118, 330, 418, 652, 742, UP, +1, 'Close', 'Open', 'Bullish')
    satu(1357.5 + 118, 330, 418, 652, 742, DOWN, -1, 'Open', 'Close', 'Bearish')
    o.append('</g>')
    return o

# ════ Lesson 06 — Chart Pattern: MDKA symmetrical triangle + breakout ═══════
def isi_06():
    cs = json.load(open(f'{V06}/01_AI/_assets/mdka_ohlc.json'))['candles']
    cs = [dict(t=c['date'], o=c['o'], h=c['h'], l=c['l'], c=c['c']) for c in cs]
    n = len(cs); step = (PX1 - PX0) / n
    x = lambda i: PX0 + (i + 0.5) * step
    LO, HI = 1800, 3500; PY0, PY1 = 318, 790
    y = lambda v: PY1 - (math.log(v) - math.log(LO)) / (math.log(HI) - math.log(LO)) * (PY1 - PY0)
    idx = lambda t: next(i for i, c in enumerate(cs) if c['t'] >= t)
    # garis atas: dari puncak Jul-Agst, singgung puncak sesudahnya; garis bawah: dari dasar Jun-Jul, singgung dasar sesudahnya
    a = max(range(idx('2025-08-25'), idx('2025-09-20')), key=lambda i: cs[i]['h'])
    b0 = min(range(idx('2025-09-20'), idx('2025-10-06')), key=lambda i: cs[i]['l'])
    akhir = idx('2026-01-02')
    ya = lambda i: y(cs[i]['h']); yb = lambda i: y(cs[i]['l'])
    b = max(range(a + 15, akhir), key=lambda i: -(ya(i) - ya(a)) / (i - a))      # kemiringan layar paling landai ke atas
    d = max(range(b0 + 15, akhir), key=lambda i: (yb(i) - yb(b0)) / (i - b0))
    atas = lambda i: ya(a) + (ya(b) - ya(a)) / (b - a) * (i - a)
    bawah = lambda i: yb(b0) + (yb(d) - yb(b0)) / (d - b0) * (i - b0)
    tembus = next(i for i in range(b, n) if y(cs[i]['c']) < atas(i) - 4)
    print('  V06 puncak', cs[a]['t'], cs[a]['h'], '->', cs[b]['t'], cs[b]['h'], '| dasar', cs[b0]['t'], cs[b0]['l'], '->', cs[d]['t'], cs[d]['l'], '| tembus', cs[tembus]['t'], cs[tembus]['c'])
    o = ['<g id="sumbu-harga">'] + kisi_harga([2000, 2400, 2800, 3200], y) + ['</g>']
    o += ['<g id="sumbu-waktu">'] + sumbu_bulan([c['t'] for c in cs], x) + ['</g>']
    o.append(f'<clipPath id="plot"><rect x="{PX0}" y="283" width="{PX1 - PX0}" height="515"/></clipPath>')
    e = tembus + 1
    o.append(f'<path id="isi-segitiga" d="M{x(a):.1f} {atas(a):.1f}L{x(e):.1f} {atas(e):.1f}L{x(e):.1f} {bawah(e):.1f}L{x(b0):.1f} {bawah(b0):.1f}Z" fill="{BLUE}" fill-opacity="0.10"/>')
    o += ['<g id="candle" clip-path="url(#plot)">'] + candles(cs, x, y, max(2, step * 0.66)) + ['</g>']
    o.append('<g id="garis-pola" stroke-width="5" stroke-linecap="round">')
    o.append(f'<line x1="{x(a):.1f}" y1="{atas(a):.1f}" x2="{x(e):.1f}" y2="{atas(e):.1f}" stroke="{TURQ}"/>')
    o.append(f'<line x1="{x(b0):.1f}" y1="{bawah(b0):.1f}" x2="{x(e):.1f}" y2="{bawah(e):.1f}" stroke="{BLUE}"/>')
    o.append('</g>')
    kotak = [(x(i) - 3, y(c['h']), x(i) + 3, y(c['l'])) for i, c in enumerate(cs)]
    # chip nama pola: di bawah segitiga (area kosong), chip Breakout: kiri candle penembus
    o.append('<g id="chip">')
    svg, w = chip_svg(0, 0, 'Symmetrical Triangle', BLUE)
    xm = (x(a) + x(e)) / 2 - w / 2
    xs = bebas(w, 50, 742, kotak, PX0 + 6, PX1) ; xs = min([xx for xx in range(int(PX0 + 6), int(PX1 - w)) if bebas(w, 50, 742, kotak, xx, xx + w + 2) is not None] or [xs], key=lambda v: abs(v - xm))
    o.append(chip_svg(xs, 742, 'Symmetrical Triangle', BLUE)[0])
    # Breakout: panah turun ke titik tembus (tepat di kiri candle penembus), chip di atasnya rata kanan dengan panah
    svg, w2 = chip_svg(0, 0, 'Breakout', TURQ)
    xp = x(tembus) - 17
    ytip = atas(tembus) - 14
    yk = ytip - 46 - 12 - 25
    xbk = xp + 13 - w2
    o.append(chip_svg(xbk, yk, 'Breakout', TURQ)[0])
    o.append('</g>')
    o.append('<g id="panah">' + panah(xp, ytip, TURQ, True) + '</g>')
    tabrak = [c['t'] for i, c in enumerate(cs) if xbk - 8 < x(i) < xbk + w2 + 8 and y(c['h']) < yk + 25 + 8 and y(c['l']) > yk - 25 - 8]
    tabrak += [c['t'] for i, c in enumerate(cs) if xp - 16 < x(i) < xp + 16 and y(c['h']) < ytip and y(c['l']) > ytip - 46]
    print('  V06 tabrakan chip/panah Breakout:', tabrak)
    print(f'  V06 chip segitiga x={xs} w={w:.0f} | breakout x={xbk} y={yk:.0f}')
    return o

# ════ Lesson 08 — Oscillator: DEWA + RSI(14) ════════════════════════════════
def isi_08():
    s = open(f'{V08}/oscillator-episode/src/episode08oscillator/data/dewa.ts').read()
    semua = [dict(t=m[0], o=float(m[1]), h=float(m[2]), l=float(m[3]), c=float(m[4])) for m in re.findall(r"\['(\d{4}-\d\d-\d\d)', (\d+), (\d+), (\d+), (\d+),", s)]
    # RSI Wilder(14) atas seluruh deret (sama dengan indicators.ts), lalu potong jendela tampil
    c = [b['c'] for b in semua]; rsi = [None] * len(c); ag = al = 0.0
    for i in range(1, len(c)):
        ch = c[i] - c[i - 1]; g, l_ = max(ch, 0), max(-ch, 0)
        if i <= 14:
            ag += g; al += l_
            if i == 14: ag /= 14; al /= 14; rsi[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
        else:
            ag = (ag * 13 + g) / 14; al = (al * 13 + l_) / 14; rsi[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
    mulai = next(i for i, b in enumerate(semua) if b['t'] >= '2024-12-02')
    cs, rs = semua[mulai:], rsi[mulai:]
    n = len(cs); step = (PX1 - PX0) / n
    x = lambda i: PX0 + (i + 0.5) * step
    lo, hi = min(b['l'] for b in cs), max(b['h'] for b in cs)
    PY0, PY1 = 322, 566
    y = lambda v: PY1 - (v - lo) / (hi - lo) * (PY1 - PY0)
    RY0, RY1 = 622, 790                                   # panel RSI: 100 .. 0
    ry = lambda v: RY1 - v / 100 * (RY1 - RY0)
    print(f'  V08 {n} bar {cs[0]["t"]}..{cs[-1]["t"]} harga {lo:.0f}-{hi:.0f} RSI akhir {rs[-1]:.1f} maks {max(rs):.1f} min {min(rs):.1f}')
    kel = [v for v in (60, 100, 140, 180, 220, 260) if lo <= v <= hi]
    o = ['<g id="sumbu-harga">'] + kisi_harga(kel, y) + ['</g>']
    o += ['<g id="sumbu-waktu">'] + sumbu_bulan([b['t'] for b in cs], x) + ['</g>']
    o.append(f'<clipPath id="plot"><rect x="{PX0}" y="296" width="{PX1 - PX0}" height="290"/></clipPath>')
    o += ['<g id="candle" clip-path="url(#plot)">'] + candles(cs, x, y, max(2, step * 0.66)) + ['</g>']
    # panel RSI
    o.append('<g id="panel-rsi">')
    o.append(f'<rect x="{PX0}" y="{RY0 - 22}" width="{PX1 - PX0}" height="1.5" fill="#16181B" fill-opacity="0.18"/>')
    o.append(f'<rect id="zona-overbought" x="{PX0}" y="{ry(100):.1f}" width="{PX1 - PX0}" height="{ry(70) - ry(100):.1f}" fill="{TURQ}" fill-opacity="0.24"/>')
    o.append(f'<rect id="zona-oversold" x="{PX0}" y="{ry(30):.1f}" width="{PX1 - PX0}" height="{ry(0) - ry(30):.1f}" fill="{BLUE}" fill-opacity="0.18"/>')
    o.append(f'<rect x="{PX0}" y="{ry(70) - 1.5:.1f}" width="{PX1 - PX0}" height="3" fill="{TURQ}"/>')
    o.append(f'<rect x="{PX0}" y="{ry(30) - 1.5:.1f}" width="{PX1 - PX0}" height="3" fill="{BLUE}"/>')
    for v in (70, 30): o.append(f'<text x="{AX}" y="{ry(v) + 8.5:.1f}" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{v}</text>')
    pts = ' '.join(f'{x(i):.1f},{ry(v):.1f}' for i, v in enumerate(rs) if v is not None)
    o.append(f'<polyline id="garis-rsi" points="{pts}" fill="none" stroke="{BLUE}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>')
    o.append('</g>')
    # chip zona: cari tempat yang tidak dilewati garis RSI
    kotak = [(x(i) - 3, ry(v) - 3, x(i) + 3, ry(v) + 3) for i, v in enumerate(rs)]
    o.append('<g id="chip">')
    for teks, wr, yc in (('Overbought', TURQ, (ry(100) + ry(70)) / 2), ('Oversold', BLUE, (ry(30) + ry(0)) / 2)):
        svg, w = chip_svg(0, 0, teks, wr, h=40, fs=22)
        xl = bebas(w, 40, yc, kotak, PX0 + 10, PX1 - 10, pad=6, arah=-1)
        print(f'  V08 chip {teks} x={xl}')
        o.append(chip_svg(xl, yc, teks, wr, h=40, fs=22)[0])
    o.append('</g>')
    o.append(f'<text x="{PX0}" y="{RY0 - 34}" font-family="{F_SB}" font-weight="600" font-size="22" fill="{ABU2}" id="label-rsi" opacity="0">RSI (14)</text>')
    return o

# ════ Lesson 10 — Multi-Timeframe: ADMR Mingguan / Harian / 1 Jam, satu level ═
def isi_10():
    wk = baca_ts(f'{V10}/admrWeekly.ts', P_ADMR)
    dy = baca_ts(f'{V10}/admrDaily.ts', P_ADMR)
    h1 = baca_ts(f'{V10}/admr1h.ts', P_ADMR)
    wk = [b for b in wk if b['t'] <= '2025-12-08']
    dy = [b for b in dy if b['t'] >= '2025-08-01']
    h1 = [b for b in h1 if b['t'] >= '2025-11-17']
    LV = 1265
    semua = wk + dy + h1
    LO, HI = min(b['l'] for b in semua) * 0.97, max(b['h'] for b in semua) * 1.03
    PY0, PY1 = 352, 782
    y = lambda v: PY1 - (math.log(v) - math.log(LO)) / (math.log(HI) - math.log(LO)) * (PY1 - PY0)
    CEL = 22; pw = (PX1 - PX0 - 2 * CEL) / 3
    print(f'  V10 mingguan {len(wk)} | harian {len(dy)} | 1 jam {len(h1)} | skala {LO:.0f}-{HI:.0f} | lebar panel {pw:.1f}')
    o = ['<g id="sumbu-harga">'] + kisi_harga([800, 1000, 1265, 1600], y, label=False)
    for v in (800, 1000, 1600): o.append(f'<text x="{AX}" y="{y(v) + 8.5:.1f}" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{ribu(v)}</text>')
    o.append('</g>')
    # pita level bersama (menembus ketiga panel)
    yl = y(LV)
    o.append(f'<g id="zona-confluence"><rect x="{PX0}" y="{yl - 11:.1f}" width="{PX1 - PX0}" height="22" fill="{TURQ}" fill-opacity="0.28"/>'
             f'<rect x="{PX0}" y="{yl - 12.5:.1f}" width="{PX1 - PX0}" height="3" fill="{TURQ}"/><rect x="{PX0}" y="{yl + 9.5:.1f}" width="{PX1 - PX0}" height="3" fill="{TURQ}"/></g>')
    o.append(f'<text x="{AX}" y="{yl + 8.5:.1f}" font-family="{F_XB}" font-weight="800" font-size="24" fill="{TURQ}" id="label-level">{ribu(LV)}</text>')
    for k, (nama, bars) in enumerate((('Mingguan', wk), ('Harian', dy), ('1 Jam', h1))):
        x0 = PX0 + k * (pw + CEL); n = len(bars); step = pw / n
        x = lambda i, x0=x0, step=step: x0 + (i + 0.5) * step
        o.append(f'<g id="panel-{k + 1}">')
        if k: o.append(f'<rect x="{x0 - CEL / 2 - 0.75:.1f}" y="306" width="1.5" height="492" fill="#16181B" fill-opacity="0.14"/>')
        o += candles(bars, x, y, max(1.6, step * 0.66))
        o.append(f'<text x="{x0 + pw / 2:.1f}" y="818" text-anchor="middle" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{nama}</text>')
        if k == 2:
            # chip + panah ke pita, di kolom yang candle-nya paling rendah di atas pita
            svg, w = chip_svg(0, 0, 'Confluence', TURQ)
            xc = x0 + pw / 2
            dekat = [b for i, b in enumerate(bars) if abs(x(i) - xc) < 20]
            ytip = min(yl - 12.5, min(y(b['h']) for b in dekat)) - 12
            o.append('<g id="chip-confluence">' + panah(xc, ytip, TURQ, True) + chip_svg(xc - w / 2, ytip - 46 - 12 - 25, 'Confluence', TURQ)[0] + '</g>')
            atas_chip = ytip - 46 - 12 - 50
            tabrak = [b for i, b in enumerate(bars) if xc - w / 2 - 12 < x(i) < xc + w / 2 + 12 and y(b['h']) < ytip - 46 + 0]
            print(f'  V10 chip Confluence y={atas_chip:.0f}..{atas_chip + 50:.0f}, candle menabrak: {len(tabrak)}')
        o.append('</g>')
    return o

JOB = {
    '02': (['Candlestick', 'Basics'], 'OHLC', 'Open · High · Low · Close', isi_02, 'Thumbnail - Candlestick'),
    '06': (['Chart', 'Pattern'], 'MDKA', 'Harian · 2025', isi_06, 'Thumbnail - Chart Pattern'),
    '08': (['RSI, MACD', '& Stochastic'], 'DEWA', 'Harian · 2025', isi_08, 'Thumbnail - Oscillator'),
    '10': (['Multi-', 'Timeframe', '& Confluence'], 'ADMR', 'Mingguan · Harian · 1 Jam', isi_10, 'Thumbnail - Multi-Timeframe & Confluence'),
}
for les in (sys.argv[1:] or JOB):
    baris, chip, sub, fn, nama = JOB[les]
    print(f'Lesson {les}')
    svg = kerangka(les, baris, chip, sub, fn(), f'{nama} (Technical Analysis · Lesson {les})')
    open(f'{TA}/{nama}.svg', 'w').write(svg)
    print(f'  -> {nama}.svg ({len(svg) // 1024} KB)')
