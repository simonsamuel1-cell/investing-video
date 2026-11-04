#!/usr/bin/env python3
"""
RUMAH PETA SUNGAI (Simon 22 Okt): "Pakai salah satu rumah dari SVG ini untuk menggantikan rumah isometrik V04 di peta sungai (S01, S03, S08).
Pilih yang paling cocok, buang latar putih, dan ubah warnanya ke palet brand."
Sumber: `Video 05 - Jalur Bertumbuh /42163 [Converted].svg` (stok vektor "Isometric 3d private house …", 6 rumah, dikonversi Simon dari EPS).
Dipilih rumah ke-4 (kiri bawah, grup indeks 3): atap pelana + teras = bentuk paling dekat dengan rumah V04; DICERMINKAN supaya pelananya
menghadap kiri seperti rumah V04. Latar putih dibuang; alas rumput (tipis) diganti pijakan V04 (permukaan + dua sisi tebal 0,171 a, warna
sama dengan Pijakan investor di parts/v04.tsx); semua warna dipetakan ke palet brand (Neon Blue / Dark Turquoise / Dark Orange + tint terangnya).
Keluaran: public/media/v05/rumah-iso.svg + src/parts/rumahGeo.gen.ts (viewBox & pojok kiri pijakan, untuk RumahIso).
Jalankan: python3 scripts/gen-rumah-v05.py
"""
import copy, pathlib, re
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "42163 [Converted].svg"
NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)

GRUP = 3
# pijakan (warna = parts/v04.tsx Pijakan)
ATAS, KIRI, KANAN = "#F1EFFE", "#D3CEFA", "#BAB1F8"
# permukaan rumput asli (titik sudut diukur dari polygon #27ae60): kiri · atas · kanan · bawah
L, TOP, RGT, BOT = (21.45, 281.88), (95.33, 239.44), (169.22, 281.88), (95.34, 324.3)
A = (RGT[0] - L[0]) / 2
TEBAL = 0.171 * A
SUMBU = (L[0] + RGT[0]) / 2  # sumbu cermin

WARNA = {
    # atap (merah) → Neon Blue tint · tepi atap & lantai → Neon Blue
    "#c1382a": "#8F83F4", "#87201b": "#5F4DEE", "#991a17": "#5F4DEE",
    # dinding (abu) → tint Neon Blue (terang, sisi teduh sedikit lebih pekat)
    "#dbdbdb": "#E9E6FD", "#aab7b7": "#CBC5F9", "#bdc3c7": "#CBC5F9", "#eff3f3": "#FFFFFF", "#efefef": "#FFFFFF", "#fff": "#FFFFFF",
    # kaca jendela (slate) → Dark Turquoise
    "#566472": "#5CC8E3",
    # batang pohon (oranye tua) → Dark Orange
    "#d35400": "#E49C2C",
    # daun (hijau) → Dark Turquoise + tint terangnya
    "#396910": "#5CC8E3", "#43761c": "#5CC8E3", "#61913d": "#5CC8E3",
    "#7ba525": "#9BDDEE", "#9bbe23": "#9BDDEE", "#9bc04e": "#9BDDEE",
    "#bad950": "#C6ECF6", "#c3de59": "#C6ECF6", "#e4f991": "#EAF9FD",
}

t = ET.parse(SRC)
grup = [k for k in t.getroot() if k.tag.endswith("g")][GRUP]
g = copy.deepcopy(grup)
belum = set()


def warnai(e, parent=None):
    for k in list(e):
        f = k.attrib.get("fill", "").lower()
        if f in ("#27ae60", "#176637"):  # alas rumput → diganti pijakan
            e.remove(k)
            continue
        if f:
            if k.attrib.get("points", "").startswith("93.11 247.72"):  # lantai/fondasi di bawah rumah (merah) → Neon Blue
                k.set("fill", "#5F4DEE")
            elif f in WARNA:
                k.set("fill", WARNA[f])
            else:
                belum.add(f)
        warnai(k, e)


warnai(g)
assert not belum, f"warna belum dipetakan: {belum}"

svg = ET.Element(f"{{{NS}}}svg", {"version": "1.1"})
pij = ET.SubElement(svg, f"{{{NS}}}g", {"id": "pijakan"})
pt = lambda *p: " ".join(f"{x:.2f} {y:.2f}" for x, y in p)
ET.SubElement(pij, f"{{{NS}}}polygon", {"points": pt(L, BOT, (BOT[0], BOT[1] + TEBAL), (L[0], L[1] + TEBAL)), "fill": KIRI})
ET.SubElement(pij, f"{{{NS}}}polygon", {"points": pt(BOT, RGT, (RGT[0], RGT[1] + TEBAL), (BOT[0], BOT[1] + TEBAL)), "fill": KANAN})
ET.SubElement(pij, f"{{{NS}}}polygon", {"points": pt(L, TOP, RGT, BOT), "fill": ATAS})
rumah = ET.SubElement(svg, f"{{{NS}}}g", {"id": "rumah", "transform": f"matrix(-1 0 0 1 {2 * SUMBU:.2f} 0)"})
rumah.extend(list(g))

# viewBox: lebar = pijakan (pohon cermin tak melewati tepi pijakan — dicek di bawah), atas = puncak atap/daun − 2
VB = {"x": L[0] - 1, "y": 194.0, "w": RGT[0] - L[0] + 2, "h": BOT[1] + TEBAL + 1 - 194.0}
svg.set("viewBox", f"{VB['x']:.2f} {VB['y']:.2f} {VB['w']:.2f} {VB['h']:.2f}")
out = ROOT / "public/media/v05"
out.mkdir(parents=True, exist_ok=True)
ET.ElementTree(svg).write(out / "rumah-iso.svg", encoding="utf-8", xml_declaration=True)

(ROOT / "src/parts/rumahGeo.gen.ts").write_text(
    "// DIBANGKITKAN scripts/gen-rumah-v05.py — jangan edit tangan. Satuan = satuan viewBox public/media/v05/rumah-iso.svg.\n"
    f"export const RUMAH_VB = {{ x: {VB['x']:.2f}, y: {VB['y']:.2f}, w: {VB['w']:.2f}, h: {VB['h']:.2f} }};\n"
    f"/** pojok KIRI permukaan pijakan rumah (titik sambung jalur) */\nexport const RUMAH_POJOK = {{ x: {L[0]:.2f}, y: {L[1]:.2f} }};\n",
    encoding="utf-8")
print("ok", VB, "tebal", round(TEBAL, 2))
