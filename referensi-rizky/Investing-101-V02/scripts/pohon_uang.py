#!/usr/bin/env python3
"""
POHON UANG (Simon 8 Okt: "ganti coin itu dengan pohon (Bunga.svg)") → src/s02/pohon.gen.ts
Sumber: 04_Asset/stok-uang/finance-revenue-financial-growth-concept/Bunga.svg (ekspor Simon, Freepik 7372).
Anak tingkat-atas SVG dipisah sesuai urutan dokumen (urutan lapis dipertahankan):
  - 'koin'   = grup ber-#F4A640 (9 koin) · simbol $ (path #FFF9FF opacity .5) DIHAPUS
  - 'lembar' = grup #8FD0D6+#CBEFEF (8 lembar) · simbol $ (path #8FD0D6 di lingkaran) DIHAPUS · warna → hijau #7EC151 (uang_hijau.hijau)
  - 'dasar'  = daun, batang, pot (bagian berurutan digabung)
Aturan Simon 8 Okt pagi: uang kertas satu tone hijau + "hapus tanda dolarnya".
Pusat tiap koin/lembar diukur di Chrome (kotak batas), untuk poros skala pop.
   python3 scripts/pohon_uang.py
"""
import json, re, subprocess, tempfile, pathlib, html
import xml.etree.ElementTree as ET
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "04_Asset/stok-uang/finance-revenue-financial-growth-concept/Bunga.svg"
import sys; sys.path.insert(0, str(ROOT / "scripts"))
from uang_hijau import hijau
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS); ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

raw = SRC.read_text()
# kotak batas tiap anak tingkat-atas (koordinat viewBox, transform ikut dihitung)
js = """<script>
const svg=document.querySelector('svg');const m=svg.getScreenCTM().inverse();
const box=e=>{const r=e.getBoundingClientRect();const p1=svg.createSVGPoint();p1.x=r.left;p1.y=r.top;const a=p1.matrixTransform(m);const p2=svg.createSVGPoint();p2.x=r.right;p2.y=r.bottom;const b=p2.matrixTransform(m);return [a.x,a.y,b.x,b.y]};
document.body.setAttribute('data-r',JSON.stringify([...svg.children].map(box)));
</script>"""
with tempfile.TemporaryDirectory() as td:
    h = pathlib.Path(td) / "b.html"
    h.write_text("<html><body style='margin:0'>" + raw[raw.index("<svg"):].replace("<svg ", '<svg width="1125" height="1000" ', 1) + js + "</body></html>")
    dom = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--dump-dom", f"file://{h}"], capture_output=True, text=True).stdout
kotak = json.loads(html.unescape(re.search(r'data-r="([^"]*)"', dom).group(1)))

akar = ET.fromstring(raw)
anak = list(akar)
assert len(anak) == len(kotak), (len(anak), len(kotak))
def isi(e):
    return {(x.get("fill") or "").upper() for x in e.iter()}
def teks(e):
    s = ET.tostring(e, encoding="unicode")
    s = re.sub(r'\s+xmlns(:\w+)?="[^"]+"', "", s)
    return re.sub(r"\s+", " ", s)
bagian = []
LEMBAR_PETA = {"#8FD0D6": hijau("#8FD0D6", "#8FD0D6"), "#CBEFEF": hijau("#CBEFEF", "#8FD0D6")}
for e, b in zip(anak, kotak):
    f = isi(e)
    if len(list(e.iter())) == 1 and e.tag.endswith("g"): continue  # grup kosong
    jenis = "koin" if "#F4A640" in f else "lembar" if {"#8FD0D6", "#CBEFEF"} <= f else "dasar"
    if jenis == "koin":
        for par in e.iter():
            for x in list(par):
                if (x.get("fill") or "").upper() == "#FFF9FF" and x.get("opacity") == "0.5": par.remove(x)
    if jenis == "lembar":
        for par in e.iter():
            for x in list(par):
                if x.tag.endswith("path") and (x.get("fill") or "").upper() == "#8FD0D6": par.remove(x)
        for x in e.iter():
            c = (x.get("fill") or "").upper()
            if c in LEMBAR_PETA: x.set("fill", LEMBAR_PETA[c])
    s = teks(e)
    cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    if jenis == "dasar" and bagian and bagian[-1]["jenis"] == "dasar":
        bagian[-1]["svg"] += s
    else:
        bagian.append({"jenis": jenis, "cx": round(cx, 1), "cy": round(cy, 1), "svg": s})
n = {j: sum(1 for x in bagian if x["jenis"] == j) for j in ("koin", "lembar", "dasar")}
out = ROOT / "src/s02/pohon.gen.ts"
out.write_text("/* DIBANGKITKAN oleh scripts/pohon_uang.py — jangan diedit tangan. Sumber: Bunga.svg (Simon 8 Okt). */\n"
               "export type BagianPohon = { jenis: 'dasar' | 'koin' | 'lembar'; cx: number; cy: number; svg: string };\n"
               f"/** {n['koin']} koin + {n['lembar']} lembar (tanpa $; lembar hijau #7EC151) + {n['dasar']} lapis dasar, urutan lapis asli */\n"
               f"export const POHON: BagianPohon[] = {json.dumps(bagian, ensure_ascii=False)};\n")
# berkas pratinjau (pohon utuh hasil olahan)
(ROOT / "public/uang-hijau/pohon-uang.svg").write_text(f'<svg xmlns="{NS}" viewBox="455 12 1403 1972">' + "".join(x["svg"] for x in bagian) + "</svg>")
print(n, "lembar:", LEMBAR_PETA, "→", out)
for i, x in enumerate(bagian): print(i, x["jenis"], x["cx"], x["cy"], len(x["svg"]))
