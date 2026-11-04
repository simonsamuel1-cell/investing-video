#!/usr/bin/env python3
"""
Ikon STOK -> src/icons.gen.ts — path asli, tidak digambar ulang. Daftar ikon = src/ikon.ts (satu sumber).
Sumber: npm @iconify-json/* di _fondasi/icons (MingCute Apache-2.0 · keyline-icons MIT).

PEMUSATAN OPTIS (Simon 6 Okt: ikon "menceng"): tiap ikon dirender hitam 400 px di Chrome headless, kotak tinta diukur,
lalu selisih pusat tinta terhadap pusat viewBox disimpan sebagai dx/dy (pecahan ukuran). Komponen Icon menggeser
ikon sebesar itu sehingga TINTA-nya tepat di tengah kotak/lingkaran.
"""
import json, pathlib, re, subprocess, tempfile
from PIL import Image
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parents[2] / "_fondasi/icons/node_modules/@iconify-json"
ids = re.findall(r":\s*'([a-z0-9-]+:[a-z0-9-]+)'", (ROOT / "src/ikon.ts").read_text())
# ikon Flaticon & lokal = berkas Video 02 (satu sumber untuk seluruh seri Investing 101)
ASET_V02 = ROOT.parents[1] / "Video 02 - Investment Instruments/04_Asset"
assert len(ids) == len(set(ids)), "ikon kembar di src/ikon.ts"
sets, ikon = {}, {}
FLATICON = ASET_V02 / "ikon-flaticon"  # PNG asli (CDN Flaticon) + SVG hasil vektorisasi potrace (IoU ≥ 0,98)
for i in ids:
    p, n = i.split(":")
    if p == "lokal":  # ikon dibuat ulang dari acuan Simon (04_Asset/ikon-lokal/<n>.svg episode ini, kalau tidak ada: Video 02)
        sendiri = ROOT.parent / "04_Asset/ikon-lokal" / f"{n}.svg"
        svg = (sendiri if sendiri.exists() else ASET_V02 / "ikon-lokal" / f"{n}.svg").read_text()
        vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
        body = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
        body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
        ikon[i] = {"vb": vb, "body": body}
        continue
    if p == "flaticon":  # episode ini dulu (Simon 13 Okt: cari di internet lalu tracing — scripts/trace-flaticon.py), lalu Video 02
        sendiri = ROOT.parent / "04_Asset/ikon-flaticon" / f"{n}.svg"
        svg = (sendiri if sendiri.exists() else FLATICON / f"{n}.svg").read_text()
        vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
        body = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
        ikon[i] = {"vb": vb, "body": body}
        continue
    s = sets.setdefault(p, json.loads((SRC / p / "icons.json").read_text()))
    ic = s["icons"].get(n) or s["icons"][s["aliases"][n]["parent"]]
    w, h = ic.get("width", s.get("width", 24)), ic.get("height", s.get("height", 24))
    ikon[i] = {"vb": f"0 0 {w} {h}", "body": ic["body"]}

# ── ukur pusat tinta ──
S, PAD, COLS = 400, 40, 6
rows = (len(ids) + COLS - 1) // COLS
cells = "".join(f'<div style="position:absolute;left:{(k % COLS) * (S + PAD)}px;top:{(k // COLS) * (S + PAD)}px;width:{S}px;height:{S}px">'
                f'<svg viewBox="{ikon[i]["vb"]}" width="{S}" height="{S}" style="display:block;color:#000">{ikon[i]["body"]}</svg></div>'
                for k, i in enumerate(ids))
W, H = COLS * (S + PAD), rows * (S + PAD)
with tempfile.TemporaryDirectory() as td:
    html, png = pathlib.Path(td) / "i.html", pathlib.Path(td) / "i.png"
    html.write_text(f'<!doctype html><body style="margin:0;background:#fff">{cells}</body>')
    chrome = next((ROOT / "node_modules/.remotion/chrome-headless-shell").glob("*/chrome-headless-shell-*/chrome-headless-shell"))
    subprocess.run([str(chrome), "--headless", "--disable-gpu", "--hide-scrollbars", f"--window-size={W},{H}",
                    f"--screenshot={png}", f"file://{html}"], check=True, capture_output=True)
    img = np.asarray(Image.open(png).convert("L"))
for k, i in enumerate(ids):
    x0, y0 = (k % COLS) * (S + PAD), (k // COLS) * (S + PAD)
    ink = img[y0:y0 + S, x0:x0 + S] < 128
    ys, xs = np.where(ink)
    assert len(xs), f"{i} tidak bertinta"
    cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2
    ikon[i]["dx"], ikon[i]["dy"] = round((cx - S / 2) / S, 4), round((cy - S / 2) / S, 4)
    ikon[i]["isi"] = round(max(xs.max() - xs.min() + 1, ys.max() - ys.min() + 1) / S, 3)

out = ["/* DIBANGKITKAN oleh scripts/gen-icons.py — Flaticon juicy_fish Solid (vektorisasi PNG asli) · MingCute (Apache-2.0). Jangan diedit tangan.",
       " * dx/dy = selisih pusat TINTA terhadap pusat kotak; isi = sisi terpanjang tinta / kotak — Icon memusatkan & menyamakan ukuran. */",
       "export const ICON: Record<string, { vb: string; body: string; dx: number; dy: number; isi: number }> = {"]
for i in ids:
    v = ikon[i]
    out.append(f"  {json.dumps(i)}: {{ vb: {json.dumps(v['vb'])}, dx: {v['dx']}, dy: {v['dy']}, isi: {v['isi']}, body: {json.dumps(v['body'])} }},")
out.append("};")
(ROOT / "src/icons.gen.ts").write_text("\n".join(out) + "\n")
print(f"{len(ids)} ikon -> src/icons.gen.ts")
for i in ids:
    v = ikon[i]
    flag = "  ← digeser" if max(abs(v["dx"]), abs(v["dy"])) > 0.015 else ""
    print(f"  {i:38} pusat tinta dx {v['dx']:+.3f} dy {v['dy']:+.3f} · isi {v['isi']:.2f}{flag}")
