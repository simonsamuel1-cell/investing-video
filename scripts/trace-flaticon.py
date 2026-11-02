#!/usr/bin/env python3
"""
IKON FLATICON (juicy_fish Solid) → SVG satu warna. Simon 13 Okt: "untuk icon iconnya pastikan kamu mencari diinternet terlebih dahulu, lalu
tracing" — ikon dicari di flaticon.com (gaya juicy_fish Solid, sama dengan Video 02 yang sudah disetujui), PNG 512 diunduh dari CDN, lalu
divektorkan dengan potracer (venv _fondasi/.venv-trace). Hasil: 04_Asset/ikon-flaticon/<id>.png + <id>.svg (currentColor, evenodd) + IoU.
Pakai: _fondasi/.venv-trace/bin/python scripts/trace-flaticon.py 11823560 5951167 …
"""
import pathlib, subprocess, sys, time
import numpy as np
from PIL import Image, ImageDraw
import potrace

ASET = pathlib.Path(__file__).resolve().parents[2] / "04_Asset/ikon-flaticon"
ASET.mkdir(parents=True, exist_ok=True)

def unduh(i: int) -> pathlib.Path:
    p = ASET / f"{i}.png"
    if not p.exists():
        subprocess.run(["curl", "-s", "-f", "-o", str(p), f"https://cdn-icons-png.flaticon.com/512/{i // 1000}/{i}.png"], check=True)
        time.sleep(0.3)
    return p

def jejak(i: int):
    im = Image.open(unduh(i)).convert("RGBA")
    a = np.asarray(im).astype(float)
    tinta = (a[..., 3] > 127) & (a[..., :3].mean(-1) < 128)
    W, H = im.size
    bm = potrace.Bitmap(~tinta)  # potracer: False = tinta (catatan Video 02)
    plist = bm.trace(turdsize=4, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for c in plist:
        s = c.start_point
        d.append(f"M{s.x:.2f} {s.y:.2f}")
        for seg in c.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.2f} {seg.c.y:.2f}L{seg.end_point.x:.2f} {seg.end_point.y:.2f}")
            else:
                d.append(f"C{seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}")
        d.append("Z")
    path = "".join(d)
    (ASET / f"{i}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><path fill="currentColor" fill-rule="evenodd" d="{path}"/></svg>\n')
    # IoU: rasterkan ulang jalur (poligon kurva dicuplik) — perkiraan kasar via cairo-less sampling
    return W, H, tinta, plist

def iou(W, H, tinta, plist):
    S = 2
    cv = Image.new("L", (W * S, H * S), 0)
    dr = ImageDraw.Draw(cv)
    for c in plist:
        pts = [(c.start_point.x * S, c.start_point.y * S)]
        p0 = c.start_point
        for seg in c.segments:
            if seg.is_corner:
                pts += [(seg.c.x * S, seg.c.y * S), (seg.end_point.x * S, seg.end_point.y * S)]
            else:
                for t in np.linspace(0.1, 1, 10):
                    u = 1 - t
                    x = u**3 * p0.x + 3 * u * u * t * seg.c1.x + 3 * u * t * t * seg.c2.x + t**3 * seg.end_point.x
                    y = u**3 * p0.y + 3 * u * u * t * seg.c1.y + 3 * u * t * t * seg.c2.y + t**3 * seg.end_point.y
                    pts.append((x * S, y * S))
            p0 = seg.end_point
        # evenodd: XOR tiap kontur
        m = Image.new("L", cv.size, 0); ImageDraw.Draw(m).polygon(pts, fill=255)
        cv = Image.fromarray(np.bitwise_xor(np.asarray(cv), np.asarray(m)))
    r = np.asarray(cv.resize((W, H), Image.BOX)) > 127
    return (r & tinta).sum() / max(1, (r | tinta).sum())

for arg in sys.argv[1:]:
    i = int(arg)
    W, H, t, pl = jejak(i)
    print(f"{i}: {W}×{H} · kontur {len(pl)} · IoU {iou(W, H, t, pl):.4f}")
