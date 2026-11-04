#!/usr/bin/env python3
"""
UANG KERTAS HIJAU (Simon 8 Okt): "pertahankan warna uang kertasnya (hijau) … sesuaikan agar memiliki tone warna hijau yang sama
… gunakan color code ini untuk warna uangnya #7EC151".
Sumber = public/uang/*.svg (sudah dibersihkan: latar, teks kredit). Semua uang kertas di sana memakai SATU keluarga 10 warna turkis.
Per aset: warna KERTAS (badan lembar) → #7EC151 persis; warna uang lain → rona & kroma hijau yang sama, terang OKLab = terang #7EC151
+ selisih terang aslinya terhadap kertas (kontras internal aset dipertahankan). Warna bukan-uang (kulit, lengan, karung, koin) tidak disentuh.
Keluaran: public/uang-hijau/ (aset lama di public/uang/ TIDAK diubah — scene lain menunggu brief Simon).
   python3 scripts/uang_hijau.py
"""
import re, json, math, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "public/uang", ROOT / "public/uang-hijau"
OUT.mkdir(exist_ok=True)
TARGET = "#7EC151"
TURKIS = {"#BEE9F4", "#90DAEC", "#90D9EC", "#8DD8EB", "#89D7EB", "#80D4E9", "#6DCEE6", "#65CBE5", "#54B4CC", "#4793A7"}
# warna KERTAS tiap aset (diperiksa di render Chrome: badan lembar)
KERTAS = {"lembar-tangan": "#90D9EC", "tangan-uang": "#90D9EC", "hujan-uang": "#89D7EB"}  # lainnya #BEE9F4

def lin(c): c /= 255; return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def gam(c): c = c * 12.92 if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055; return c * 255
def hex2lab(h):
    r, g, b = (lin(int(h[i:i + 2], 16)) for i in (1, 3, 5))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (x ** (1 / 3) for x in (l, m, s))
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)
def lab2rgb(L, a, b):
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3; m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
def lch2hex(L, C, H):
    for _ in range(60):  # potong kroma sampai masuk gamut sRGB
        rgb = lab2rgb(L, C * math.cos(H), C * math.sin(H))
        if all(-1e-4 <= v <= 1 + 1e-4 for v in rgb): break
        C *= 0.97
    return "#" + "".join(f"{round(min(255, max(0, gam(min(1, max(0, v)))))):02X}" for v in rgb)

Lt, at, bt = hex2lab(TARGET); Ct, Ht = math.hypot(at, bt), math.atan2(bt, at)
def hijau(c, kertas):
    if c.upper() == kertas: return TARGET
    dL = hex2lab(c)[0] - hex2lab(kertas)[0]
    L = min(0.97, max(0.25, Lt + dL))
    C = Ct * ((1 - L) / (1 - Lt) if L > Lt else (L / Lt) ** 0.5)
    return lch2hex(L, C, Ht)

def main():
    laporan = {}
    srcs = sorted(SRC.glob("*.svg")) + [SRC / "_lembar-tangan.svg"]
    for p in srcs:
        if not p.exists() or p.stem == "koin-tumpuk" or p.stem == "koin-lapis": continue
        nama = p.stem.lstrip("_")
        if p.stem == "lembar-tangan": continue  # sumber = _lembar-tangan.svg
        kertas = KERTAS.get(nama, "#BEE9F4")
        s = p.read_text()
        peta = {}
        def ganti(m):
            c = m.group(2).upper()
            if c not in TURKIS: return m.group(0)
            peta[c] = hijau(c, kertas)
            return m.group(1) + peta[c]
        if nama == "tangan-uang":
            # lengan kiri juga #4793A7 → hanya badan lembar (#90D9EC) + detail lembar (#4793A7 di dalam <g opacity="0.4">)
            s = re.sub(r'(fill=")(#90D9EC)', ganti, s, flags=re.I)
            s = re.sub(r'(<g opacity="0\.4">\s*<g>\s*<(?:path|ellipse)[^>]*?fill=")(#4793A7)', ganti, s, flags=re.I)
        else:
            s = re.sub(r'((?:fill|stroke)[=:]"?)(#[0-9A-Fa-f]{6})', ganti, s)
        (OUT / f"{nama}.svg").write_text(s)
        laporan[nama] = {"kertas": kertas, "peta": peta}
    (OUT / "_hijau.json").write_text(json.dumps(laporan, indent=1))
    for k, v in laporan.items(): print(k, v["kertas"], " ".join(f"{a}→{b}" for a, b in sorted(v["peta"].items())))

if __name__ == "__main__":
    main()
