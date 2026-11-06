#!/usr/bin/env python3
"""
harbour-routes.py — the three ways from Kamu to the house on the simple harbour map (Simon, 2 Nov 2026: "berikan
highlight ke 3 jalur ini. Gambar 1 (jembatan), gambar 2 (kapal), Gambar 3 (PEsawat). Gambar 4 adalah lokasi
rumahnya"; his four sketches are docs/vi-style/refs/starry-harbour-route-3{1,2,3,4}-simon.png).

  ~/.venvs/tuntun/bin/python -I scripts/vi/harbour-routes.py

  1 jembatan — on foot, ON the roads: the shortest way along the road network through the stops his sketch goes by
               (over the bridge, up to the top, down the long road, along the coast road), then up to the house;
  2 kapal    — along his road to the west bank, then by water, his curve smoothed, and up the pier to the house;
  3 pesawat  — one straight line.
Reads public/art/in04/harbour-map-simple.svg (run simplify-harbour-map.py first) and writes
src/episodes/in04-investasi-yang-cocok/data/harbour-routes.json, in the drawing's own units as it is shown (turned:
3598 × 2398), with Kamu's spot and the house's (and its door, where the routes end).
"""
import json
import os
import re

import numpy as np
from scipy import ndimage as ndi
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra
from scipy.spatial import cKDTree

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.."))
SVG = os.path.join(ROOT, "public/art/in04/harbour-map-simple.svg")
OUT = os.path.join(ROOT, "src/episodes/in04-investasi-yang-cocok/data/harbour-routes.json")
W, H = 3598, 2398  # the drawing as shown (turned 90° clockwise from the trace)
SKETCH = (1782, 1192)  # Simon's sketches: the shown drawing, whole, at this size

KAMU = (222, 1188)  # where Kamu stands, on the far-left road (drawing units); TemplateMap.tsx and RouteMap.tsx read it back
HOUSE = (1436, 750)  # his red box in sketch 4 (sketch px): its middle, raised so the footprint ends at its foot
DOOR = (1415, 800)  # the house's foot, where routes 1 and 2 end (sketch 2's pier comes up to it)
# where each route's disc sits (sketch px; the route's nearest point): 1 on the bridge, 2 on the water, 3 midway
DISC = {1: (506, 193), 2: (880, 855), 3: (748, 690)}


def sk(*pts):
    """Sketch px → drawing units."""
    return [(x * W / SKETCH[0], y * H / SKETCH[1]) for x, y in pts]


def subpaths(d):
    """An M/C/L path → its subpaths, each sampled every few units, turned to the drawing as shown."""
    out, cur, pos = [], [], None
    for cmd, args in re.findall(r"([MCL])([^MCLZ]*)", d):
        v = list(map(float, re.findall(r"-?\d+(?:\.\d+)?", args)))
        if cmd == "M":
            if len(cur) > 1:
                out.append(np.array(cur))
            pos = np.array(v[:2])
            cur = [pos]
        elif cmd == "L":
            for i in range(0, len(v), 2):
                q = np.array(v[i : i + 2])
                n = max(2, int(np.hypot(*(q - pos)) / 4))
                cur += list(pos + (q - pos) * np.linspace(0, 1, n)[1:, None])
                pos = q
        else:
            for i in range(0, len(v), 6):
                c1, c2, q = np.array(v[i : i + 2]), np.array(v[i + 2 : i + 4]), np.array(v[i + 4 : i + 6])
                n = max(2, int((np.hypot(*(c1 - pos)) + np.hypot(*(c2 - c1)) + np.hypot(*(q - c2))) / 4))
                u = np.linspace(0, 1, n)[1:, None]
                cur += list((1 - u) ** 3 * pos + 3 * (1 - u) ** 2 * u * c1 + 3 * (1 - u) * u ** 2 * c2 + u ** 3 * q)
                pos = q
    if len(cur) > 1:
        out.append(np.array(cur))
    # matrix(0 1 -1 0 H 0) on the trace's (x, y): shown = (W − y, x)
    return [np.c_[W - p[:, 1], p[:, 0]] for p in out]


def network():
    svg = open(SVG).read()
    paths = []
    for g in ("road", "bridge"):
        paths += subpaths(re.search(rf'data-g="{g}" d="([^"]+)"', svg).group(1))
    pts = np.concatenate(paths)
    owner = np.concatenate([[i] * len(p) for i, p in enumerate(paths)])
    rows, cols, w = [], [], []
    base = 0
    for p in paths:  # along each road
        n = len(p)
        rows += list(range(base, base + n - 1))
        cols += list(range(base + 1, base + n))
        w += list(np.hypot(*np.diff(p, axis=0).T))
        base += n
    # where two roads meet (a T ends on the other road's line, within a few units of one of its points)
    for a, b in cKDTree(pts).query_pairs(12):
        if owner[a] != owner[b]:
            rows.append(a), cols.append(b), w.append(np.hypot(*(pts[a] - pts[b])) + 0.01)
    g = coo_matrix((w, (rows, cols)), shape=(len(pts), len(pts))).tocsr()
    return pts, g + g.T


def along_roads(pts, g, stops):
    """The shortest way along the roads through each stop in turn."""
    tree = cKDTree(pts)
    idx = [tree.query(s)[1] for s in stops]
    way = [idx[0]]
    for a, b in zip(idx, idx[1:]):
        _, pred = dijkstra(g, indices=a, return_predecessors=True)
        leg = [b]
        while leg[-1] != a:
            leg.append(pred[leg[-1]])
        way += leg[::-1][1:]
    return pts[way]


def resample(p, step):
    p = np.asarray(p, float)
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    t = np.linspace(0, seg[-1], max(2, int(seg[-1] / step) + 1))
    return np.c_[np.interp(t, seg, p[:, 0]), np.interp(t, seg, p[:, 1])]


def smooth(p, s):
    """Gaussian along the line; the ends stay put."""
    q = np.c_[ndi.gaussian_filter1d(p[:, 0], s, mode="nearest"), ndi.gaussian_filter1d(p[:, 1], s, mode="nearest")]
    q[0], q[-1] = p[0], p[-1]
    return q


def catmull(pts, n=16):
    p = np.asarray(pts, float)
    out = [p[0]]
    for i in range(len(p) - 1):
        p0, p1, p2, p3 = p[max(i - 1, 0)], p[i], p[i + 1], p[min(i + 2, len(p) - 1)]
        u = np.linspace(0, 1, n)[1:, None]
        out += list(0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u ** 2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u ** 3))
    return np.array(out)


def main():
    pts, g = network()
    house = sk(HOUSE)[0]
    # every way ends AT the house (Simon, 3 Nov: "tiap ujung end jalur, harus berhenti di rumah"): the foot of the house,
    # where the pier comes up
    door = sk(DOOR)[0]
    # 1 — his sketch 1's stops: the bridge, the top, the long road down, the coast road to below the house; then up to it
    walk = along_roads(pts, g, [KAMU, *sk((480, 180), (1100, 32), (1215, 320), (1265, 580), (1240, 840), (DOOR[0], 840))])
    walk = smooth(resample(walk, 6), 3)
    walk = np.vstack([walk, resample([walk[-1], door], 6)[1:]])
    # 2 — on foot to the west bank (sketch 2), then his curve over the water, then up the pier
    to_bank = along_roads(pts, g, [KAMU, sk((230, 570))[0]])
    water = catmull([to_bank[-1], *sk((420, 680), (600, 780), (900, 860), (1200, 895), (1415, 900))])
    pier = np.array([water[-1], door])
    boat = np.vstack([resample(to_bank, 6), smooth(resample(water, 6), 4)[1:], resample(pier, 6)[1:]])
    # 3 — straight from Kamu to the house (sketch 3 ends at its left foot)
    plane = resample([KAMU, sk((1385, 790))[0]], 6)
    r = lambda p: [[round(x, 1), round(y, 1)] for x, y in p]
    json.dump(
        {
            "_": "Written by scripts/vi/harbour-routes.py — the three ways from Kamu to the house on the simple harbour map, in its own units as shown (3598 × 2398).",
            "kamu": list(KAMU),
            "house": [round(house[0], 1), round(house[1], 1)],
            "door": [round(door[0], 1), round(door[1], 1)],
            "routes": [
                {"n": n, "way": way, "disc": r([p[cKDTree(p).query(sk(DISC[n])[0])[1]]])[0], "pts": r(p)}
                for n, way, p in ((1, "jembatan", walk), (2, "kapal", boat), (3, "pesawat", plane))
            ],
        },
        open(OUT, "w"),
    )
    L = lambda p: np.hypot(*np.diff(p, axis=0).T).sum()
    print(f"jembatan {L(walk):.0f}, kapal {L(boat):.0f}, pesawat {L(plane):.0f} -> {os.path.relpath(OUT, ROOT)}")


if __name__ == "__main__":
    main()
