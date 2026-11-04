#!/usr/bin/env python3
"""
LATAR TOKO & KOTA KIRIMAN SIMON (30 Okt: "Aku kirimkan toko untuk mengganti background toko" + "ganti background kotanya agar lebih beragam").
Sumber (diekspor Illustrator lewat ekspor-svg.jsx, teks jadi garis): 04_Asset/stok-30okt/stores-closed-coronavirus-pandemic/toko.svg (750 × 500) dan
modern-city-buildings-flat-background/kota.svg (600 × 310).
TOKO → public/flat/toko/toko-dunia.svg: bukit, pohon & jalan DIUBIN 3× (x −750 … 1500) supaya latar bisa digeser (tengah dulu lalu memberi ruang) tanpa
tepi kosong; toko satu kali di tengah. DIBUANG: virus (1.4), latar langit (digambar CSS), papan "MINI STORE" (1.1.8 + teks 1.1.9 — teks layar Inggris,
dan terpotong tepi atas pada skala adegan), tanda "CLOSE" di pintu (1.1.3.1.3 — diganti tanda TUTUP → BUKA yang dianimasikan di Scene01).
KOTA → public/flat/kota-b/kota.svg: apa adanya tanpa persegi putih latar.
Indeks = urutan anak elemen (sama dengan scripts/bbox_svg.py).
"""
import copy, pathlib, xml.etree.ElementTree as ET
ROOT = pathlib.Path(__file__).resolve().parent.parent
STOK = ROOT.parent / "04_Asset/stok-30okt"
NS = "http://www.w3.org/2000/svg"; XL = "http://www.w3.org/1999/xlink"
ET.register_namespace("", NS); ET.register_namespace("xlink", XL)

def anak(e, jalur):
    for i in jalur: e = list(e)[i]
    return e
def buang(e, jalur):
    induk = anak(e, jalur[:-1]); induk.remove(list(induk)[jalur[-1]])

# ── TOKO ──
r = ET.parse(STOK / "stores-closed-coronavirus-pandemic/toko.svg").getroot()
obj = anak(r, [1])
for jalur in ([1, 1, 3, 1, 3], [1, 1, 9], [1, 1, 8]):  # urutan: indeks terbesar dulu di tiap induk
    buang(r, jalur)
bagian = {n: copy.deepcopy(list(obj)[i]) for n, i in (("bukit", 0), ("toko", 1), ("pohon", 2), ("jalan", 3), ("tutup", 5), ("garis", 6))}
out = ET.Element(f"{{{NS}}}svg", {"version": "1.1", "viewBox": "-750 0 2250 500", "width": "2250", "height": "500"})
def ubin(nama, g):
    g.set("id", nama); out.append(g)
    # ubin tumpang 1 satuan — ubin yang tepat bersentuhan meninggalkan garis 1 px di sambungan (Simon 30 Okt)
    for dx in (-749, 749): ET.SubElement(out, f"{{{NS}}}use", {f"{{{XL}}}href": f"#{nama}", "href": f"#{nama}", "x": str(dx)})
ubin("bukit", bagian["bukit"])
out.append(bagian["toko"]); out.append(bagian["garis"])
ubin("pohon", bagian["pohon"])
jl = ET.Element(f"{{{NS}}}g"); jl.append(bagian["jalan"]); jl.append(bagian["tutup"]); ubin("jalan", jl)
ET.ElementTree(out).write(ROOT / "public/flat/toko/toko-dunia.svg", xml_declaration=True, encoding="utf-8")

# ── KOTA ──
k = ET.parse(STOK / "modern-city-buildings-flat-background/kota.svg").getroot()
buang(k, [0])
k.set("width", "600"); k.set("height", "310")
ET.ElementTree(k).write(ROOT / "public/flat/kota-b/kota.svg", xml_declaration=True, encoding="utf-8")
print("ok")
