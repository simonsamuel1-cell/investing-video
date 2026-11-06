#!/usr/bin/env python3
"""
simplify-harbour-map.py — the traced harbour map redrawn simple (Simon, 2 Nov 2026: "lurusin garis-garis yang zigzag
gajelas … pathways yang putus … Pokoknya intinya adalah simplify aja mapnya, buat lebih smooth. Tidak ada tekanan harus
sama persis, karna ini hanya ilustrasi").

  ~/.venvs/tuntun/bin/python -I scripts/vi/simplify-harbour-map.py

Only the ground is kept — land, water, roads — plus the little waves. From the reference with every object painted
out (trace-harbour-map.py's clear_objects), each pixel is land, road or water; then
  · water: specks and holes dropped, spikes opened off, notches closed, blurred and re-thresholded, its outline
    simplified and drawn as one smooth shape;
  · roads: debris and the jagged bits along the shore opened off, short breaks closed, thinned to centre lines, those
    lines followed into a network (spurs pruned, a road through a two-way junction kept as one, dead ends bridged to
    the road they were heading for, ends at the edge run off the canvas), smoothed, and stroked at one width;
  · and no road runs straight into the river, only a bridge (coast_roads): coast roads along the west bank and the
    east arm's north bank take the roads that met the shore, and a short dead end at the shore goes.
Writes public/art/in04/harbour-map-simple.svg in the traced map's own coordinates (components/HarbourMap.tsx).
"""
import importlib.util
import json
import os
import re

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
from scipy.spatial import cKDTree
from skimage.draw import polygon
from skimage.measure import approximate_polygon, find_contours
from skimage.morphology import binary_closing, binary_opening, disk, remove_small_holes, remove_small_objects, skeletonize

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("trace_harbour_map", os.path.join(HERE, "trace-harbour-map.py"))
thm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(thm)
W, H = thm.W, thm.H
OUT = os.path.join(thm.ROOT, "public/art/in04/harbour-map-simple.svg")
TRACED = os.path.join(thm.ROOT, "public/art/in04/harbour-map.svg")
# Simon's own shore (2 Nov: "Edge yang sekarang, dibuat garis smooth banget. Se-smooth yang aku coret garis merah"):
# when it is there, the water is the band between his two lines, not the smoothed trace
SHORE = os.path.join(thm.ROOT, "docs/vi-style/refs/starry-harbour-shore.json")
# bridges Simon took off (a point on each, map px): they end at the shore like any other road
NO_BRIDGE = [np.array([1232, 2731])]  # 2 Nov: "remove jembatan yang kanan" — the one down the middle

# the west bank (Simon 2 Nov, circled on docs/vi-style/refs/starry-harbour-left-bank-simon.png: "bagian yang aku
# lingkarin, tolong dibenerin, jangan nyentuh tepi pantai"): above where the river turns east, the road bits squeezed
# against the shore go, ONE coast road runs COAST_GAP in from it instead, and the roads and the bridge that met the
# shore there run on to it — the shore itself is left as it is
COAST_GAP = 64  # the coast road's centre line from the shore, map px (its edge 50 px off)
COAST_REACH = 200  # road closer than this to that bank is the coast road's
COAST_TURN = 1950  # map x (down the turned drawing) where the west bank turns east and its coast road ends
ARM_FROM = 1400  # map x past which the north bank is the arm that turns east (its coast road)
TRIM = 12  # points (6 px apart) taken off a road's end before it is bent on to another

LAND, ROAD, WATER = "#F2EDE2", "#E8E4D3", "#BECBD2"
# the finished drawing is turned this many degrees clockwise (Simon 2 Nov: "sekarang rotate 90 derajat ke kanan");
# all the work above happens in the reference's own upright coordinates
ROTATE = 90
ROAD_W = 28  # the roads' median width in the reference, at 2x
EDGE = 40  # an end this close to the canvas edge runs off it


def classes():
    img = Image.open(thm.SRC).convert("RGB").resize((W, H), Image.LANCZOS).filter(ImageFilter.MedianFilter(3))
    a = np.asarray(thm.clear_objects(img)).astype(np.float32)
    G = np.array(thm.GROUND, np.float32)
    return ((a[..., None, :] - G) ** 2).sum(-1).argmin(-1)


def catmull(pts, closed):
    """Points (x, y) → a smooth cubic path through all of them."""
    p = np.asarray(pts, float)
    n = len(p)
    if n < 2:
        return ""
    if n == 2:
        return f"M{p[0,0]:.1f} {p[0,1]:.1f}L{p[1,0]:.1f} {p[1,1]:.1f}"
    get = (lambda i: p[i % n]) if closed else (lambda i: p[min(max(i, 0), n - 1)])
    d = [f"M{p[0,0]:.1f} {p[0,1]:.1f}"]
    for i in range(n if closed else n - 1):
        p0, p1, p2, p3 = get(i - 1), get(i), get(i + 1), get(i + 2)
        c1, c2 = p1 + (p2 - p0) / 6, p2 - (p3 - p1) / 6
        d.append(f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}")
    return "".join(d) + ("Z" if closed else "")


def water_path(cls):
    """
    One smooth water shape. Light morphology takes off specks and the thinnest spits; then the outline ITSELF is
    smoothed along its length, so every bay and pier rounds off alike while a channel stays (its two banks are far
    apart along the outline). The mask is extended past the canvas first, so the smoothing pulls nothing in from it.
    """
    m = cls == 2
    # the water runs on under a road that crosses it (water on both sides within a road's width) — not under a road
    # along the shore, which has water on one side only. Those roads are the bridges.
    bridges = binary_closing(m, disk(ROAD_W // 2 + 4)) & (cls == 1)
    m = m | bridges
    m = remove_small_objects(m, max_size=20000)
    m = remove_small_holes(m, max_size=20000)
    m = binary_closing(binary_opening(m, disk(10)), disk(10))
    m = remove_small_holes(remove_small_objects(m, max_size=20000), max_size=20000)
    P = 160
    f = np.pad(np.pad(m, P, mode="edge"), 1).astype(float)
    d = []
    for c in find_contours(f, 0.5):
        c = c - 1 - P
        area = 0.5 * abs(np.dot(c[:, 0], np.roll(c[:, 1], 1)) - np.dot(c[:, 1], np.roll(c[:, 0], 1)))
        if area < 20000:
            continue
        c = resample(np.vstack([c, c[:1]]), 4)[:-1]
        c = np.c_[ndi.gaussian_filter1d(c[:, 0], 14, mode="wrap"), ndi.gaussian_filter1d(c[:, 1], 14, mode="wrap")]
        c = approximate_polygon(c, tolerance=1.5)
        d.append(catmull(c[:, ::-1], closed=True))
    return "".join(d), m, bridges


# ---------------------------------------------------------------- roads
N8 = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]  # clockwise from N


def road_mask(cls):
    m = remove_small_objects(cls == 1, max_size=400)
    m = binary_opening(m, disk(5))
    m = remove_small_objects(m, max_size=1500)
    m = binary_closing(m, disk(9))
    # a little loop of road (a fork that rejoins, a lens along the shore) is filled, so it thins to one line
    return remove_small_holes(m, max_size=40000)


def crossing(sk):
    """The crossing number of each skeleton pixel: 1 an end, 2 a line, 3+ a junction (corners don't count)."""
    p = np.pad(sk, 1)
    ring = [p[1 + dy:p.shape[0] - 1 + dy, 1 + dx:p.shape[1] - 1 + dx] for dy, dx in N8]
    cn = sum((~ring[i]) & ring[(i + 1) % 8] for i in range(8)).astype(int)
    cn[~sk] = 0
    return cn


def network(sk):
    """Skeleton → edges (lists of (y, x)) between nodes; junction clusters become one node at their centroid."""
    cn = crossing(sk)
    junction = sk & (cn >= 3)
    jl, nj = ndi.label(junction, structure=np.ones((3, 3)))
    centroid = {i + 1: c for i, c in enumerate(ndi.center_of_mass(junction, jl, range(1, nj + 1)))}
    end = sk & (cn == 1)
    node = junction | end
    seen = np.zeros_like(sk)
    h, w = sk.shape

    def nbrs(y, x):
        for dy, dx in sorted(N8, key=lambda d: abs(d[0]) + abs(d[1])):  # 4-neighbours first
            yy, xx = y + dy, x + dx
            if 0 <= yy < h and 0 <= xx < w and sk[yy, xx]:
                yield yy, xx

    def node_id(y, x):
        return ("j", jl[y, x]) if jl[y, x] else ("e", y, x)

    edges = []
    for y, x in zip(*np.nonzero(node)):
        for ny, nx in nbrs(y, x):
            if node[ny, nx] or seen[ny, nx]:
                continue
            path, prev, cur = [(y, x)], (y, x), (ny, nx)
            while True:
                path.append(cur)
                if node[cur]:
                    break
                seen[cur] = True
                nxt = [q for q in nbrs(*cur) if q != prev and not seen[q] and q not in path[-3:]]
                if not nxt:
                    nodes_near = [q for q in nbrs(*cur) if node[q] and q != path[0]]
                    if nodes_near:
                        path.append(nodes_near[0])
                    break
                prev, cur = cur, nxt[0]
            edges.append({"pts": path, "a": node_id(*path[0]), "b": node_id(*path[-1]) if node[path[-1]] else ("e",) + path[-1]})
    return edges, centroid


def prune_and_merge(edges):
    def degree():
        deg = {}
        for e in edges:
            for k in (e["a"], e["b"]):
                deg[k] = deg.get(k, 0) + 1
        return deg

    for _ in range(3):  # spurs: a short edge to a dead end off a junction
        deg = degree()
        edges = [e for e in edges if not (len(e["pts"]) < 120 and ((deg[e["a"]] == 1 and deg[e["b"]] > 2) or (deg[e["b"]] == 1 and deg[e["a"]] > 2)))]
    edges = [e for e in edges if len(e["pts"]) >= 120 or (e["a"][0] == "j" and e["b"][0] == "j")]
    # two roads between the same two junctions (a lens along the shore) are one road: keep the shorter
    best = {}
    for e in edges:
        if e["a"][0] == "j" and e["b"][0] == "j" and e["a"] != e["b"]:
            k = tuple(sorted([e["a"], e["b"]]))
            if k not in best or len(e["pts"]) < len(best[k]["pts"]):
                best[k] = e
    edges = [e for e in edges if not (e["a"][0] == "j" and e["b"][0] == "j" and e["a"] != e["b"]) or best[tuple(sorted([e["a"], e["b"]]))] is e]
    while True:  # a road through a two-way node is one road
        deg = degree()
        two = next((k for k, v in deg.items() if v == 2 and k[0] == "j"), None)
        if two is None:
            break
        pair = [e for e in edges if two in (e["a"], e["b"])]
        if len(pair) != 2 or pair[0] is pair[1]:
            break
        e1, e2 = pair
        p1 = e1["pts"] if e1["b"] == two else e1["pts"][::-1]
        p2 = e2["pts"] if e2["a"] == two else e2["pts"][::-1]
        a = e1["a"] if e1["b"] == two else e1["b"]
        b = e2["b"] if e2["a"] == two else e2["a"]
        edges = [e for e in edges if e is not e1 and e is not e2] + [{"pts": p1 + p2[1:], "a": a, "b": b}]
    return edges


def resample(p, step):
    p = np.asarray(p, float)
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    if seg[-1] < step:
        return p[[0, -1]]
    t = np.linspace(0, seg[-1], max(2, int(seg[-1] / step) + 1))
    return np.c_[np.interp(t, seg, p[:, 0]), np.interp(t, seg, p[:, 1])]


def shore_water():
    """The band between Simon's north and south shore lines (both run on past the canvas), and its mask."""
    j = json.load(open(SHORE))
    north, south = np.array(j["north"]), np.array(j["south"])[::-1]
    d = catmull(approximate_polygon(north, tolerance=0.5), closed=False) + "L" + catmull(approximate_polygon(south, tolerance=0.5), closed=False)[1:] + "Z"
    ring = np.vstack([north, south])
    mask = np.zeros((H, W), bool)
    mask[polygon(ring[:, 1], ring[:, 0], shape=(H, W))] = True
    return d, mask


def draw(ps):
    return "".join(catmull(approximate_polygon(p, tolerance=0.8), closed=False) for p in ps)


def roads_path(cls, water=None, was_water=None):
    edges, centroid = network(skeletonize(road_mask(cls)))
    edges = prune_and_merge(edges)
    lines = []
    for e in edges:
        p = np.array([(x, y) for y, x in e["pts"]], float)
        if e["a"][0] == "j":
            p[0] = centroid[e["a"][1]][::-1]
        if e["b"][0] == "j":
            p[-1] = centroid[e["b"][1]][::-1]
        lines.append({"p": resample(p, 6), "ends": [e["a"][0] != "j", e["b"][0] != "j"]})
    # dead ends: run off the canvas when near its edge, or bridge to the road they were heading for
    pts = np.concatenate([l["p"] for l in lines])
    owner = np.concatenate([[i] * len(l["p"]) for i, l in enumerate(lines)])
    tree = cKDTree(pts)
    for i, l in enumerate(lines):
        for k, is_end in enumerate(l["ends"]):
            if not is_end:
                continue
            p = l["p"] if k == 1 else l["p"][::-1]
            tip, back = p[-1], p[max(0, len(p) - 6)]
            t = tip - back
            t = t / (np.hypot(*t) or 1)
            if min(tip[0], tip[1], W - tip[0], H - tip[1]) < EDGE:
                ext = tip + t * 80
            else:
                ext = None
                for j in sorted(tree.query_ball_point(tip, 90), key=lambda j: np.hypot(*(pts[j] - tip))):
                    if owner[j] == i:
                        continue
                    v = pts[j] - tip
                    dist = np.hypot(*v)
                    if dist > 4 and np.dot(t, v / dist) > 0.5:
                        ext = pts[j]
                        break
            if ext is not None:
                p = np.vstack([p, ext])
                l["p"] = p if k == 1 else p[::-1]
    smooth = []
    for l in lines:
        p = l["p"]
        if len(p) > 8:
            s = np.c_[ndi.gaussian_filter1d(p[:, 0], 8, mode="nearest"), ndi.gaussian_filter1d(p[:, 1], 8, mode="nearest")]
            k = min(8, len(p) // 3)
            wgt = np.clip(np.minimum(np.arange(len(p)), np.arange(len(p))[::-1]) / k, 0, 1)[:, None]
            p = wgt * s + (1 - wgt) * p  # ends stay where the junction is
        smooth.append(p)
    if water is None:
        return draw(smooth), "", len(smooth)
    on = lambda q: water[int(np.clip(q[1], 0, H - 1)), int(np.clip(q[0], 0, W - 1))]
    pieces, bridges = [], []
    for l, p in zip(lines, smooth):
        xi = np.clip(p[:, 0].round().astype(int), 0, W - 1)
        yi = np.clip(p[:, 1].round().astype(int), 0, H - 1)
        wet = water[yi, xi]
        dropped = any(np.hypot(*(p - nb).T).min() < 80 for nb in NO_BRIDGE)
        if wet.mean() > 0.3 and was_water[yi, xi][wet].mean() > 0.5 and not dropped:
            bridges.append(p)
            continue
        # any other road the new shore put under water goes there, split where it went; a short piece that no longer
        # reaches a junction goes too — cut loose, or left as a stub running off the canvas (Simon 2 Nov: "hapus ujung
        # jalan pendek di tepi kanan")
        edges = np.flatnonzero(np.diff(np.r_[0, (~wet).astype(int), 0]))
        junction = [not l["ends"][0], not l["ends"][1]]
        pieces += [p[a:b] for a, b in zip(edges[::2], edges[1::2]) if b - a >= 60 or (b - a >= 4 and ((a == 0 and junction[0]) or (b == len(p) and junction[1])))]
    # the roads' free ends (no other road within reach) on land, each with the way it points out
    pts = np.concatenate(pieces + bridges)
    owner = np.concatenate([[i] * len(q) for i, q in enumerate(pieces + bridges)])
    tree = cKDTree(pts)
    free = []
    for i, q in enumerate(pieces):
        for tip, back in ((q[0], q[min(10, len(q) - 1)]), (q[-1], q[max(0, len(q) - 11)])):
            if all(owner[j] == i for j in tree.query_ball_point(tip, 30)) and not on(tip):
                t = tip - back
                free.append((tip, t / (np.hypot(*t) or 1)))
    # a bridge's end left out in the water: on to a road's free end ahead of it (Simon 2 Nov: "sambungin jembatan
    # diagonal ke jalan buntunya"), along a curve that leaves the bridge and enters the road on their own lines;
    # with no road ahead, straight on to the shore
    for b, p in enumerate(bridges):
        for k in (0, 1):
            q = p if k == 1 else p[::-1]
            if not on(q[-1]):
                continue
            q = q[:-8]  # the old end curls a little where the old shore was; the new line takes over before it
            tip = q[-1]
            t = q[-1] - q[max(0, len(q) - 20)]
            t = t / (np.hypot(*t) or 1)
            ahead = [(np.hypot(*(c - tip)), c, tc) for c, tc in free if 0 < np.hypot(*(c - tip)) < 450 and np.dot(t, (c - tip) / np.hypot(*(c - tip))) > 0.3]
            if ahead:
                L, c, tc = min(ahead, key=lambda a: a[0])
                u = np.linspace(0, 1, 24)[1:, None]
                P0, P1, P2, P3 = tip, tip + t * L / 3, c + tc * L / 3, c
                q = np.vstack([q, (1 - u) ** 3 * P0 + 3 * (1 - u) ** 2 * u * P1 + 3 * (1 - u) * u ** 2 * P2 + u ** 3 * P3])
            else:
                for step in range(8, 600, 8):
                    e = tip + t * step
                    if not (0 <= e[0] < W and 0 <= e[1] < H) or not on(e):
                        q = np.vstack([q, tip + t * (step + ROAD_W)])
                        break
            p = q if k == 1 else q[::-1]
        bridges[b] = p
    coast, pieces, bridges = coast_roads(pieces, bridges, water)
    return draw(pieces + coast), draw(bridges), len(pieces) + len(bridges) + len(coast)


def bezier(P0, P1, P2, P3, n=24):
    u = np.linspace(0, 1, n)[:, None]
    return (1 - u) ** 3 * P0 + 3 * (1 - u) ** 2 * u * P1 + 3 * (1 - u) * u ** 2 * P2 + u ** 3 * P3


def coast_road(pieces, bridges, water, wd, bank, other, within):
    """
    One coast road COAST_GAP in from `bank` (a shore line) along the stretch where `within` holds: the road bits closer
    than COAST_REACH to that bank there go, and what is left of a road that went there — and a bridge that landed
    there — runs on to it. An end of it inside the canvas stops at the last road that joins it, which carries on from it.
    """
    near_b, near_o = cKDTree(resample(bank, 4)), cKDTree(resample(other, 4))
    def claimed(p):
        xi = np.clip(p[:, 0].round().astype(int), 0, W - 1)
        yi = np.clip(p[:, 1].round().astype(int), 0, H - 1)
        return (wd[yi, xi] < COAST_REACH) & within(p) & (near_b.query(p)[0] < near_o.query(p)[0]) & ~water[yi, xi]
    # the road itself: the bank, offset onto the land
    line = resample(bank[within(bank)], 6)
    t = np.gradient(line, axis=0)
    t /= np.hypot(*t.T)[:, None]
    n = np.c_[-t[:, 1], t[:, 0]]
    probe = line[len(line) // 2] + n[len(line) // 2] * 40
    if water[int(np.clip(probe[1], 0, H - 1)), int(np.clip(probe[0], 0, W - 1))]:
        n = -n
    road = line + n * COAST_GAP
    road = np.c_[ndi.gaussian_filter1d(road[:, 0], 4, mode="nearest"), ndi.gaussian_filter1d(road[:, 1], 4, mode="nearest")]
    on_road = cKDTree(road)
    # every other road there goes; what is left of one keeps its cut end, the way it was heading, and where it meets
    kept, ends = [], []
    for p in pieces:
        out = ~claimed(p)
        if out.all():
            kept.append(p)
            continue
        edges = np.flatnonzero(np.diff(np.r_[0, out.astype(int), 0]))
        for a, b in zip(edges[::2], edges[1::2]):
            if b - a < 20:
                continue
            q = p[a:b]
            # its last stretch was still heading into the river: off with it, so it bends into the coast road instead
            if len(q) > 40:
                q = q[TRIM if a > 0 else 0 : len(q) - (TRIM if b < len(p) else 0)]
            kept.append(q)
            for at_start, cut in ((True, a > 0), (False, b < len(p))):
                if cut:
                    tip, back = (q[0], q[min(10, len(q) - 1)]) if at_start else (q[-1], q[max(0, len(q) - 11)])
                    d = tip - back
                    ends.append((tip, d / (np.hypot(*d) or 1), on_road.query(tip)[1]))
    # an end inside the canvas stops where the last road joins it, a little short, so that road bends into it
    inside = lambda q: 0 <= q[0] < W and 0 <= q[1] < H
    first = min(e[2] for e in ends) if ends and inside(road[0]) else None
    last = max(e[2] for e in ends) if ends and inside(road[-1]) else None
    lo = max(0, first + 15) if first is not None else 0
    hi = min(len(road), last - 15 + 1) if last is not None else len(road)
    road = road[lo:hi]
    links = []
    for tip, d, i in ends:
        if i == first or i == last:  # the road it was heading for carries on from it
            at = road[0] if i == first else road[-1]
            tc = (road[0] - road[7]) if i == first else (road[-1] - road[-8])
            tc /= np.hypot(*tc)
            L = np.hypot(*(tip - at))
            links.append(bezier(at, at + tc * L / 3, tip + d * L / 3, tip))
        else:  # a T: in square to it
            c = road[min(max(i - lo, 0), len(road) - 1)]
            L = np.hypot(*(tip - c))
            nc = (tip - c) / (L or 1)
            links.append(bezier(tip, tip + d * L / 3, c + nc * L / 3, c))
    # a bridge that landed on that bank runs on, straight, to the coast road
    on_road = cKDTree(road)
    for b, p in enumerate(bridges):
        for k in (0, 1):
            q = p if k == 1 else p[::-1]
            tip = q[-1]
            if not (within(tip[None])[0] and near_b.query(tip)[0] < near_o.query(tip)[0] and on_road.query(tip)[0] < COAST_GAP + 60):
                continue
            d = q[-1] - q[max(0, len(q) - 11)]
            d /= np.hypot(*d) or 1
            for step in range(4, 400, 4):
                if on_road.query(tip + d * step)[0] < 4:
                    q = np.vstack([q, tip + d * step])
                    break
            p = q if k == 1 else q[::-1]
        bridges[b] = p
    return [road] + links, kept, bridges


def coast_roads(pieces, bridges, water):
    """
    No road runs straight into the river — only a bridge crosses it (Simon 2 Nov: "intinya jangan ada jalanan yang
    mengarah langsung ke sungai, kecuali jembatan"). Along the west bank and along the north bank of the arm that
    turns east, the roads that met the shore run on to a coast road (coast_road); a short road anywhere else that
    still ends at the shore is dropped.
    """
    j = json.load(open(SHORE))
    south, north = np.array(j["south"], float), np.array(j["north"], float)
    wd = ndi.distance_transform_edt(~water)
    west = lambda p: (p[:, 0] > -200) & (p[:, 0] < COAST_TURN) & (p[:, 1] > H / 2)
    arm = lambda p: (p[:, 0] > ARM_FROM) & (p[:, 1] < H / 2)
    coast = []
    for bank, other, within in ((south, north, west), (north, south, arm)):
        c, pieces, bridges = coast_road(pieces, bridges, water, wd, bank, other, within)
        coast += c
    at_shore = lambda q: wd[int(np.clip(q[1], 0, H - 1)), int(np.clip(q[0], 0, W - 1))] < 40
    kept, dropped = [], []
    for p in pieces:
        if at_shore(p[0]) or at_shore(p[-1]):
            L = np.hypot(*np.diff(p, axis=0).T).sum()
            print(f"  road ending at the shore near {p[0].round()} .. {p[-1].round()}, {L:.0f} px: " + ("dropped" if L < 400 else "KEPT"))
            if L < 400:
                dropped.append(p)
                continue
        kept.append(p)
    # a road that ended on a dropped one, now left loose, runs on to the nearest road instead
    if dropped:
        gone = cKDTree(np.concatenate(dropped))
        pts = np.concatenate(kept + coast)
        owner = np.concatenate([[i] * len(q) for i, q in enumerate(kept + coast)])
        tree = cKDTree(pts)
        for i, p in enumerate(kept):
            for at_start in (True, False):
                tip = p[0] if at_start else p[-1]
                if gone.query(tip)[0] > 40 or any(owner[j] != i for j in tree.query_ball_point(tip, 30)):
                    continue
                if len(p) > 40:  # its last stretch curled toward the dropped road: off with it
                    p = p[TRIM:] if at_start else p[:-TRIM]
                    kept[i] = p
                tip, back = (p[0], p[min(10, len(p) - 1)]) if at_start else (p[-1], p[max(0, len(p) - 11)])
                cand = [j for j in tree.query_ball_point(tip, 200) if owner[j] != i]
                if not cand:
                    continue
                c = pts[min(cand, key=lambda j: np.hypot(*(pts[j] - tip)))]
                d = tip - back
                d /= np.hypot(*d) or 1
                L = np.hypot(*(c - tip))
                coast.append(bezier(tip, tip + d * L / 3, c + (tip - c) / L * L / 3, c))
    return coast, kept, bridges


def main():
    cls = classes()
    water, wet, bridges = water_path(cls)
    shore = was = None
    if os.path.exists(SHORE):
        water, shore = shore_water()
        was = ndi.binary_dilation(bridges, disk(10))
        wet = shore
    roads, bridges, n = roads_path(cls, shore, was)
    # the waves that are still well inside the water (it shrank where it was smoothed)
    deep = ndi.binary_erosion(wet, disk(24))
    waves = []
    for w in re.findall(r'<path data-g="waves"[^>]*/>', open(TRACED).read()):
        d, tx, ty = re.search(r' d="([^"]+)".*translate\(([-\d.]+),([-\d.]+)\)', w).groups()
        n_ = list(map(float, re.findall(r"-?\d+(?:\.\d+)?", d)))
        xs, ys = np.array(n_[0::2]) + float(tx), np.array(n_[1::2]) + float(ty)
        cx, cy = int(np.clip(xs.mean(), 0, W - 1)), int(np.clip(ys.mean(), 0, H - 1))
        if deep[cy, cx] and xs.max() - xs.min() > 40:  # a whole wave, not a crumb of one
            # turned back on its own spot when the map is turned, so a wave still lies flat
            waves.append(f'<g transform="rotate(-90 {xs.mean():.1f} {ys.mean():.1f})">{w}</g>' if ROTATE == 90 else w)
    waves = "".join(waves)
    # 90° clockwise: (x, y) → (H − y, x), so the drawing is H wide and W tall
    view, turn = ((H, W), f'<g transform="matrix(0 1 -1 0 {H} 0)">') if ROTATE == 90 else ((W, H), "<g>")
    open(OUT, "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view[0]} {view[1]}" width="100%" height="100%">{turn}'
        f'<path data-g="land" d="M0 0H{W}V{H}H0Z" fill="{LAND}"/>'
        f'<path data-g="water" d="{water}" fill="{WATER}" fill-rule="evenodd"/>'
        # every road but a bridge is cut at the shore — not one end or edge over the water (Simon 2 Nov: "ada
        # jalanan2 yang melebihi tepi pantai, hapus"): clipped to the land, the canvas less the water
        f'<defs><clipPath id="harbour-land"><path d="M0 0H{W}V{H}H0Z{water}" clip-rule="evenodd"/></clipPath></defs>'
        f'<path data-g="road" d="{roads}" fill="none" stroke="{ROAD}" stroke-width="{ROAD_W}" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#harbour-land)"/>'
        f'<path data-g="bridge" d="{bridges}" fill="none" stroke="{ROAD}" stroke-width="{ROAD_W}" stroke-linecap="round" stroke-linejoin="round"/>'
        f"{waves}</g></svg>"
    )
    print(f"{n} roads, {water.count('M')} water shapes, {waves.count('<path')} wave paths -> {os.path.relpath(OUT, thm.ROOT)}")


if __name__ == "__main__":
    main()
