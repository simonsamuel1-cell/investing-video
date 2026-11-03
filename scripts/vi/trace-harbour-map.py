#!/usr/bin/env python3
"""
trace-harbour-map.py — Simon's reference map (docs/vi-style/refs/starry-harbour-map.webp, 2 Nov 2026) to the tagged
vector the Stickman-Walk still uses (public/art/vi04/harbour-map.svg, components/HarbourMap.tsx).

  ~/.venvs/tuntun/bin/python -I scripts/vi/trace-harbour-map.py

Two traces of the picture at 2x, joined:
  · the GROUND (land, roads, water) from a copy flattened to 64 colours — the webp's roads are a faint gradient
    against the land, and traced as-is half of them merge into it;
  · every OBJECT from the picture as-is (fine layers), so trees, buildings, pins and type keep their colours.
Each path is tagged data-g="<object>" by the region boxes below (the picture's own pixels), in the trace's own
stacking order — hide one by its name in Stickman-Walk's HIDE.
"""
import json, os, re, sys, tempfile
import numpy as np
from PIL import Image, ImageFilter
import vtracer

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "docs/vi-style/refs/starry-harbour-map.webp")
OUT = os.path.join(ROOT, "public/art/vi04/harbour-map.svg")
TRACE = dict(colormode="color", hierarchical="stacked", mode="spline", corner_threshold=60, length_threshold=4.0,
             max_iterations=10, splice_threshold=45, path_precision=2)

def parse(svg):
    out = []
    for d, fill, tx, ty in re.findall(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"/>', open(svg).read()):
        nums = list(map(float, re.findall(r"-?\d+(?:\.\d+)?", d)))
        xs, ys, tx, ty = nums[0::2], nums[1::2], float(tx), float(ty)
        out.append({"d": d, "fill": fill.upper(), "tx": tx, "ty": ty, "bbox": [min(xs)+tx, min(ys)+ty, max(xs)+tx, max(ys)+ty]})
    return out

import colorsys
W, H = 2398, 3598
# regions in the ORIGINAL picture's pixels (1199 x 1799); traced coords are 2x
R = {
 "title-starry": (390,145,1065,240), "title-harbour-cruise": (375,270,1085,340), "title-chinese": (465,395,1005,495), "title-tagline": (465,508,995,545),
 "label-sham-shui-po": (140,722,302,778), "label-kowloon-city": (608,783,782,840), "label-mong-kok": (398,862,528,918),
 "label-kowloon-bay": (840,1165,1068,1225), "label-route-2": (368,1442,462,1478), "label-north-point": (848,1410,1002,1468),
 "label-central": (162,1535,268,1588), "label-causeway-bay": (648,1558,818,1612),
 "pin-s": (10,1040,85,1128), "pin-1": (300,1432,342,1492), "pin-2": (468,1455,508,1512), "pin-3": (1086,1032,1128,1088),
 "pin-4": (838,852,882,908), "pin-5": (610,1188,652,1243), "pin-6": (533,1222,575,1278), "pin-7": (474,1292,516,1348),
 "pin-8": (430,1292,470,1348), "pin-9": (238,1195,280,1250), "pin-10": (272,1158,314,1214), "pin-11": (296,1115,338,1170),
 "pin-19": (266,1555,308,1612), "pin-20": (252,1450,294,1504),
 "bld-m-plus": (338,1040,545,1172), "bld-k11-musea": (330,1175,530,1290), "bld-palace-museum": (560,1090,785,1190),
 "bld-kai-tak": (908,1050,1185,1160), "ship-cruise": (948,1240,1160,1312), "ship-yacht": (0,1115,70,1180),
 "bld-bauhinia": (475,1440,630,1568), "bld-ferris-wheel": (308,1480,458,1625), "compass": (938,1535,1148,1750),
}
TREES = [(35,190,165,300),(145,540,240,665),(525,625,560,705),(778,678,870,775),(318,730,395,860),(625,955,690,1040),(0,830,30,905),(100,1545,185,1650),(835,1505,940,1635)]
def inside(b, r, T):
    """Is bbox b (traced px) inside region r (picture px), with T picture px of slack?"""
    return b[0] >= 2*(r[0]-T) and b[1] >= 2*(r[1]-T) and b[2] <= 2*(r[2]+T) and b[3] <= 2*(r[3]+T)
order = sorted(R, key=lambda k: (R[k][2]-R[k][0])*(R[k][3]-R[k][1]))
def rgb(h): return tuple(int(h[i:i+2], 16)/255 for i in (1,3,5))

def assign(paths, T):
    names = []
    for p in paths:
        b = p["bbox"]; bw, bh = b[2]-b[0], b[3]-b[1]
        name = None
        if bw < W*0.9:
            for k in order:
                if inside(b, R[k], T): name = k; break
            if name is None and any(inside(b, t, T) for t in TREES): name = "trees"
        if name is None:
            r, g, bl = rgb(p["fill"]); h, l, s = colorsys.rgb_to_hls(r, g, bl)
            if 0.10 <= h <= 0.18 and s > 0.12 and 0.35 < l < 0.75 and max(bw, bh) > 16: name = "route"
            elif bl >= r and l > 0.82 and max(bw, bh) < 120 and s > 0.05: name = "waves"
            else: name = "base"
        names.append(name)
    return names


# land, road, water — the only colours the ground is made of (measured on the picture)
GROUND = [(242,237,226), (232,228,211), (190,203,210)]

def clear_objects(img):
    """
    The ground with every object taken off it. Inside each object's box, a pixel that is none of the ground colours is
    the object (dilated a few px for its soft edge); it is refilled from the nearest ground around it, so roads run on
    under a word and the shore under a building. Without this the flattened trace keeps each object's edge as a
    ground-coloured outline, merged into the road beside it, and it stays on the map as a ghost when the object goes.
    """
    a = np.asarray(img).astype(np.float32)
    G = np.array(GROUND, np.float32)
    nearest = lambda x: G[((x[..., None, :] - G) ** 2).sum(-1).argmin(-1)]
    def shift(m, dy, dx):
        o = np.zeros_like(m)
        o[max(dy, 0):m.shape[0] + min(dy, 0), max(dx, 0):m.shape[1] + min(dx, 0)] = m[max(-dy, 0):m.shape[0] + min(-dy, 0), max(-dx, 0):m.shape[1] + min(-dx, 0)]
        return o
    N4 = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for x1, y1, x2, y2 in list(R.values()) + TREES:
        X1, Y1, X2, Y2 = max(0, 2*x1 - 24), max(0, 2*y1 - 24), min(W, 2*x2 + 24), min(H, 2*y2 + 24)
        sub = a[Y1:Y2, X1:X2]
        m = (((sub[..., None, :] - G) ** 2).sum(-1).min(-1) ** 0.5) > 14
        inner = np.zeros_like(m); inner[max(0, 2*y1 - Y1):2*y2 - Y1, max(0, 2*x1 - X1):2*x2 - X1] = True
        m &= inner
        for _ in range(6):
            m = m | shift(m, 0, 1) | shift(m, 0, -1) | shift(m, 1, 0) | shift(m, -1, 0)
        out = nearest(sub)
        known = ~m
        while not known.all():
            grown = np.zeros_like(known)
            for dy, dx in N4:
                take = ~known & ~grown & shift(known, dy, dx)
                if take.any():
                    src = np.zeros_like(out); src[...] = 0
                    src[max(dy, 0):out.shape[0] + min(dy, 0), max(dx, 0):out.shape[1] + min(dx, 0)] = out[max(-dy, 0):out.shape[0] + min(-dy, 0), max(-dx, 0):out.shape[1] + min(-dx, 0)]
                    out[take] = src[take]
                    grown |= take
            if not grown.any(): break
            known |= grown
        sub[m] = out[m]
    return Image.fromarray(a.astype(np.uint8))

def main():
    tmp = tempfile.mkdtemp()
    big = Image.open(SRC).convert("RGB").resize((2398, 3598), Image.LANCZOS)
    big.save(f"{tmp}/x2.png")
    clear_objects(big.filter(ImageFilter.MedianFilter(3))).quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB").save(f"{tmp}/x2-flat.png")
    vtracer.convert_image_to_svg_py(f"{tmp}/x2.png", f"{tmp}/fine.svg", filter_speckle=6, color_precision=8, layer_difference=4, **TRACE)
    vtracer.convert_image_to_svg_py(f"{tmp}/x2-flat.png", f"{tmp}/flat.svg", filter_speckle=8, color_precision=8, layer_difference=1, **TRACE)
    fine = parse(f"{tmp}/fine.svg"); flat = parse(f"{tmp}/flat.svg")
    def rgb255(h): return tuple(int(h[i:i+2], 16) for i in (1,3,5))
    def ground(h): 
        c = rgb255(h); return min(sum((a-b)**2 for a, b in zip(c, g)) ** 0.5 for g in GROUND) < 10
    # the ground trace gives up everything near an object, with wide slack: its flattened palette turns an object's soft
    # edge into ground-coloured outlines that stay behind as ghosts when the object is hidden. In the stacked trace the
    # ground's own shapes (land, roads, water) are whole and large, so none of them fits inside an object's box.
    gf, gc = assign(fine, 6), assign(flat, 16)
    out = []
    for p, g in zip(flat, gc):
        if g == "base": out.append((g, p))
    # a numbered pin's figures are their own object, num-<n>, so the pin can stay without its number: every shape inside
    # its round head except the pin itself (the head's centre is the widest shape's width/2 down). Any colour: the
    # figures' soft edges are slate-ish too, and the pin under them is whole (the trace is stacked), so it stays clean.
    HEAD = {}
    for p, g in zip(fine, gf):
        if g.startswith("pin-"):
            b = p["bbox"]
            if g not in HEAD or b[2]-b[0] > HEAD[g][2]-HEAD[g][0]: HEAD[g] = b
    def is_figure(p, g):
        b, h = p["bbox"], HEAD[g]
        cx, cy, r = (h[0]+h[2])/2, h[1]+(h[2]-h[0])/2, (h[2]-h[0])/2
        if b == h: return False
        return b[0] >= cx - r and b[2] <= cx + r and b[1] >= cy - r and b[3] <= cy + r
    def cover(g, fill):
        """A disc in the pin's own colour over its head, drawn right after the pin: the slate under the figures comes in
        two tones that follow the figures' outline, and without the disc they stay as a faint number."""
        h = HEAD[g]; cx, cy, r = (h[0]+h[2])/2, h[1]+(h[2]-h[0])/2, 0.86*(h[2]-h[0])/2
        return {"d": f"M{cx-r:.2f} {cy:.2f} A{r:.2f} {r:.2f} 0 1 0 {cx+r:.2f} {cy:.2f} A{r:.2f} {r:.2f} 0 1 0 {cx-r:.2f} {cy:.2f} Z", "fill": fill, "tx": 0, "ty": 0}
    dropped = 0
    for p, g in zip(fine, gf):
        if g == "base": continue
        b = p["bbox"]
        if not g.startswith(("title-", "label-")) and ground(p["fill"]) and max(b[2]-b[0], b[3]-b[1]) > 40: dropped += 1; continue
        if g.startswith("pin-") and g != "pin-s" and is_figure(p, g): g = "num-" + g[4:]
        out.append((g, p))
        if g.startswith("pin-") and g != "pin-s" and p["bbox"] == HEAD[g]: out.append((g, cover(g, p["fill"])))
    body = "".join(f'<path data-g="{g}" d="{p["d"]}" fill="{p["fill"]}" transform="translate({p["tx"]:g},{p["ty"]:g})"/>' for g, p in out)
    open(OUT, "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" height="100%">{body}</svg>')
    from collections import Counter
    c = Counter(g for g, _ in out)
    print(len(out), "paths;", dropped, "ground patches dropped from the objects")
    for k, n in sorted(c.items(), key=lambda x: -x[1])[:8]: print(f"  {k:22s} {n}")
    missing = [k for k in list(R) + ["trees", "route", "waves", "base"] if k not in c]
    print("groups with nothing:", missing)


if __name__ == "__main__":
    main()
