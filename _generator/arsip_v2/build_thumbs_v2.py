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

# ════ Lesson 08 — Oscillator v2: tiga panel RSI / MACD / Stochastic (DEWA) ═══
def isi_08():
    s = open(f'{V08}/oscillator-episode/src/episode08oscillator/data/dewa.ts').read()
    semua = [dict(t=m[0], o=float(m[1]), h=float(m[2]), l=float(m[3]), c=float(m[4])) for m in re.findall(r"\['(\d{4}-\d\d-\d\d)', (\d+), (\d+), (\d+), (\d+),", s)]
    c = [b['c'] for b in semua]; N = len(c)
    # RSI Wilder(14) — sama dengan indicators.ts
    rsi = [None] * N; ag = al = 0.0
    for i in range(1, N):
        ch = c[i] - c[i - 1]; g, l_ = max(ch, 0), max(-ch, 0)
        if i <= 14:
            ag += g; al += l_
            if i == 14: ag /= 14; al /= 14; rsi[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
        else:
            ag = (ag * 13 + g) / 14; al = (al * 13 + l_) / 14; rsi[i] = 100 - 100 / (1 + (999 if al == 0 else ag / al))
    def ema(v, n):
        k = 2 / (n + 1); e = None; out = []
        for x_ in v: e = x_ if e is None else x_ * k + e * (1 - k); out.append(e)
        return out
    def sma(v, n): return [sum(v[max(0, i - n + 1): i + 1]) / len(v[max(0, i - n + 1): i + 1]) for i in range(len(v))]
    macd = [a - b for a, b in zip(ema(c, 12), ema(c, 26))]; sig = ema(macd, 9); hist = [a - b for a, b in zip(macd, sig)]
    raw = []
    for i in range(N):
        hh = max(b['h'] for b in semua[max(0, i - 13): i + 1]); ll = min(b['l'] for b in semua[max(0, i - 13): i + 1])
        raw.append(50 if hh == ll else (c[i] - ll) / (hh - ll) * 100)
    sk = sma(raw, 3); sd = sma(sk, 3)
    mulai = next(i for i, b in enumerate(semua) if b['t'] >= '2024-12-02')
    tgl = [b['t'] for b in semua[mulai:]]; n = len(tgl); step = (PX1 - PX0) / n
    x = lambda i: PX0 + (i + 0.5) * step
    rsi, macd, sig, hist, sk, sd = (v[mulai:] for v in (rsi, macd, sig, hist, sk, sd))
    TP, PH, GAP = 318, 136, 30                        # atas panel 1, tinggi panel, celah
    o = ['<g id="sumbu-waktu">'] + sumbu_bulan(tgl, x) + ['</g>']
    lab = lambda yy, t: f'<text x="{AX}" y="{yy + 8.5:.1f}" font-family="{F_SB}" font-weight="600" font-size="24" fill="{ABU}">{t}</text>'
    def garis(v, yf, wr, lw=3.5):
        pts = ' '.join(f'{x(i):.1f},{yf(a):.1f}' for i, a in enumerate(v))
        return f'<polyline points="{pts}" fill="none" stroke="{wr}" stroke-width="{lw}" stroke-linejoin="round" stroke-linecap="round"/>'
    def zona(yf, atas, bawah):
        return [f'<rect x="{PX0}" y="{yf(100):.1f}" width="{PX1 - PX0}" height="{yf(atas) - yf(100):.1f}" fill="{TURQ}" fill-opacity="0.24"/>',
                f'<rect x="{PX0}" y="{yf(bawah):.1f}" width="{PX1 - PX0}" height="{yf(0) - yf(bawah):.1f}" fill="{BLUE}" fill-opacity="0.18"/>',
                f'<rect x="{PX0}" y="{yf(atas) - 1.5:.1f}" width="{PX1 - PX0}" height="3" fill="{TURQ}"/>',
                f'<rect x="{PX0}" y="{yf(bawah) - 1.5:.1f}" width="{PX1 - PX0}" height="3" fill="{BLUE}"/>', lab(yf(atas), atas), lab(yf(bawah), bawah)]
    def nama(teks, kotak, y0, y1):
        svg, w = chip_svg(0, 0, teks, BLUE, h=36, fs=20)
        for yc in (y0 + 24, y1 - 24):
            xl = bebas(w, 36, yc, kotak, PX0 + 10, PX1 - 10, pad=7)
            if xl is not None:
                print(f'  V08 chip {teks} x={xl} y={yc:.0f}'); return chip_svg(xl, yc, teks, BLUE, h=36, fs=20)[0]
        print(f'  ⚠ V08 chip {teks}: tidak ada tempat bebas di dalam panel'); return chip_svg(PX0 + 10, y0 + 24, teks, BLUE, h=36, fs=20)[0]
    # panel 1 RSI
    y0 = TP; y1 = y0 + PH; f1 = lambda v: y1 - v / 100 * PH
    o.append('<g id="panel-rsi">'); o += zona(f1, 70, 30); o.append(garis(rsi, f1, BLUE))
    o.append(nama('RSI', [(x(i) - 3, f1(v) - 3, x(i) + 3, f1(v) + 3) for i, v in enumerate(rsi)], y0, y1)); o.append('</g>')
    # panel 2 MACD
    y0 = TP + PH + GAP; y1 = y0 + PH; m = max(max(map(abs, macd)), max(map(abs, sig))) * 1.08; f2 = lambda v: (y0 + y1) / 2 - v / m * PH / 2
    o.append('<g id="panel-macd">')
    o.append(f'<rect x="{PX0}" y="{f2(0) - 0.75:.1f}" width="{PX1 - PX0}" height="1.5" fill="#16181B" fill-opacity="0.18"/>'); o.append(lab(f2(0), 0))
    bw = max(2, step * 0.66); kot = []
    for i, v in enumerate(hist):
        v3 = v * 2.2                                   # histogram diperbesar agar terbaca (bentuk tetap)
        ya, yb = min(f2(v3), f2(0)), max(f2(v3), f2(0))
        o.append(f'<rect x="{x(i) - bw / 2:.2f}" y="{ya:.2f}" width="{bw:.2f}" height="{max(1, yb - ya):.2f}" fill="{UP if v >= 0 else DOWN}"/>'); kot.append((x(i) - 3, ya, x(i) + 3, yb))
    o.append(garis(macd, f2, BLUE, 3)); o.append(garis(sig, f2, TURQ, 3))
    kot += [(x(i) - 3, min(f2(a), f2(b)) - 3, x(i) + 3, max(f2(a), f2(b)) + 3) for i, (a, b) in enumerate(zip(macd, sig))]
    o.append(nama('MACD', kot, y0, y1)); o.append('</g>')
    # panel 3 Stochastic
    y0 = TP + 2 * (PH + GAP); y1 = y0 + PH; f3 = lambda v: y1 - v / 100 * PH
    o.append('<g id="panel-stochastic">'); o += zona(f3, 80, 20); o.append(garis(sd, f3, TURQ, 3)); o.append(garis(sk, f3, BLUE, 3))
    kot = [(x(i) - 3, min(f3(a), f3(b)) - 3, x(i) + 3, max(f3(a), f3(b)) + 3) for i, (a, b) in enumerate(zip(sk, sd))]
    o.append(nama('Stochastic', kot, y0, y1)); o.append('</g>')
    print(f'  V08 {n} bar {tgl[0]}..{tgl[-1]} RSI akhir {rsi[-1]:.1f}')
    return o

# ════ Lesson 10 — Multi-Timeframe v2: tiga panel bertingkat (zoom) + level 1.265 ═
def isi_10():
    wk = baca_ts(f'{V10}/admrWeekly.ts', P_ADMR)
    dy = baca_ts(f'{V10}/admrDaily.ts', P_ADMR)
    h1 = baca_ts(f'{V10}/admr1h.ts', P_ADMR)
    wk = [b for b in wk if b['t'] <= '2025-12-08']
    dy = [b for b in dy if b['t'] >= '2025-08-01']
    h1 = [b for b in h1 if b['t'] >= '2025-11-17']
    LV = 1265
    X0, X1, GAP = 927.5, 1787.5, 46                   # isi kartu (padding 40) ; celah berisi panah
    pw = (X1 - X0 - 2 * GAP) / 3
    BY0, BY1 = 314, 746                                # kotak panel
    CY0, CY1 = 388, 722                                # area candle di dalam kotak
    o = []
    seri = (('Mingguan', wk, dy[0]['t']), ('Harian', dy, h1[0]['t'][:10]), ('1 Jam', h1, None))
    for k, (nm, bars, zoom_dari) in enumerate(seri):
        x0 = X0 + k * (pw + GAP); n = len(bars); pad = 14; step = (pw - 2 * pad) / n
        x = lambda i, x0=x0, step=step, pad=pad: x0 + pad + (i + 0.5) * step
        lo, hi = min(min(b['l'] for b in bars), LV * 0.985), max(b['h'] for b in bars)
        y = lambda v, lo=lo, hi=hi: CY1 - (math.log(v) - math.log(lo)) / (math.log(hi) - math.log(lo)) * (CY1 - CY0)
        o.append(f'<g id="panel-{k + 1}-{nm.replace(" ", "")}">')
        o.append(f'<rect x="{x0:.1f}" y="{BY0}" width="{pw:.1f}" height="{BY1 - BY0}" rx="18" fill="#F3F1FE"/>')
        if zoom_dari:
            iz = next(i for i, b in enumerate(bars) if b['t'][:10] >= zoom_dari)
            xz = x(iz) - step / 2 - 2
            o.append(f'<rect id="jendela-zoom-{k + 1}" x="{xz:.1f}" y="{CY0 - 14}" width="{x0 + pw - 8 - xz:.1f}" height="{CY1 - CY0 + 28}" rx="10" fill="{BLUE}" fill-opacity="0.12" stroke="{BLUE}" stroke-width="3" stroke-dasharray="10 14" stroke-linecap="round"/>')
            print(f'  V10 jendela zoom {nm}: {n - iz} dari {n} bar')
        yl = y(LV)
        o.append(f'<rect x="{x0 + 8:.1f}" y="{yl - 8:.1f}" width="{pw - 16:.1f}" height="16" fill="{TURQ}" fill-opacity="0.30"/>')
        o.append(f'<rect x="{x0 + 8:.1f}" y="{yl - 9.5:.1f}" width="{pw - 16:.1f}" height="3" fill="{TURQ}"/><rect x="{x0 + 8:.1f}" y="{yl + 6.5:.1f}" width="{pw - 16:.1f}" height="3" fill="{TURQ}"/>')
        o += candles(bars, x, y, max(1.6, step * 0.66))
        svg, w = chip_svg(0, 0, nm, BLUE, h=40, fs=22)
        o.append(chip_svg(x0 + pw / 2 - w / 2, BY0 + 34, nm, BLUE, h=40, fs=22)[0])
        o.append('</g>')
        if k < 2:
            xm = x0 + pw + GAP / 2; ym = (BY0 + BY1) / 2
            o.append(f'<path id="panah-zoom-{k + 1}" d="M{xm - 7:.1f} {ym - 14}l14 14l-14 14" fill="none" stroke="{BLUE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')
    svg, w = chip_svg(0, 0, 'Confluence · 1.265', TURQ)
    o.append('<g id="chip-confluence">' + chip_svg((X0 + X1) / 2 - w / 2, 800, 'Confluence · 1.265', TURQ)[0] + '</g>')
    print(f'  V10 mingguan {len(wk)} | harian {len(dy)} | 1 jam {len(h1)} | lebar panel {pw:.1f}')
    return o

JOB = {
    '02': (['Candlestick', 'Basics'], 'OHLC', 'Open · High · Low · Close', isi_02, 'Thumbnail - Candlestick'),
    '06': (['Chart', 'Pattern'], 'MDKA', 'Harian · 2025', isi_06, 'Thumbnail - Chart Pattern'),
    '08': (['RSI, MACD', '& Stochastic'], 'DEWA', 'Harian · 2025', isi_08, 'Thumbnail - Oscillator'),
    '10': (['Multi-', 'Timeframe', '& Confluence'], 'ADMR', 'Feb – Des 2025', isi_10, 'Thumbnail - Multi-Timeframe & Confluence'),
}
for les in (sys.argv[1:] or JOB):
    baris, chip, sub, fn, nama = JOB[les]
    print(f'Lesson {les}')
    svg = kerangka(les, baris, chip, sub, fn(), f'{nama} (Technical Analysis · Lesson {les})')
    open(f'{TA}/{nama}.svg', 'w').write(svg)
    print(f'  -> {nama}.svg ({len(svg) // 1024} KB)')
