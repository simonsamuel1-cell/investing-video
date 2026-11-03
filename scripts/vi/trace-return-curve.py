#!/usr/bin/env python3
"""
trace-return-curve.py — Simon's return charts → the three return paths of kit RETURNS (VI04 SC03), one per route,
each to src/episodes/vi04-investasi-yang-cocok/data/return-<name>.json, on kit RETURN_RANGE's scale (LO … HI).

  ~/.venvs/tuntun/bin/python -I scripts/vi/trace-return-curve.py

  jembatan — docs/vi-style/refs/vi04-jembatan-chart-simon.png (3 Nov 2026: "pake grafik ini buat 'Jembatan'"): a return
             comparison with two lines; the DARK one is taken (the one with the small dips — the light blue is nearly a
             ruler), followed column by column inside the plot so the axis labels never join it.
  kapal    — "Grafik Kinerja Reksa Dana vs Benchmark Sejak Peluncuran (Kumulatif)" (3 Nov: "pake ini buat kapal"): the
             fund's line, monthly, Jan 2020 – Feb 2023 — the 2020 fall, the long way back, ending up.
  pesawat  — "Return Performance" (3 Nov: "pake ini buat Pesawat, yang tadi ganti aja"): the green COMPOSITE line,
             11 Jun 2014 – 11 Jun 2015 — the dips, the climb, the fall after its peak; its last days are redrawn to end
             on a new high, the highest of the three. It replaced a candlestick screenshot (vi04-pesawat-chart-simon.png).
The last two reached this machine only as pictures in the chat, so their points are read off by eye (`points`: x
across, % up); the plane's daily zigzag comes back as a little seeded jitter.

Each path is resampled to SAMPLES points. `scale`: ("end", v) — from 0, its last at v (the bridge's small rise);
"peak" — from 0, its highest at HI; ("fit", lo, hi) — its own lowest at lo and highest at hi (the boat: a 30 % fall
that no shared percent scale could hold next to the others — Simon's three charts are of different years and funds,
so each keeps its own shape, not their numbers against each other; the small print on screen says it is ilustrasi).
"""
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.."))
REFS = os.path.join(ROOT, "docs/vi-style/refs")
DATA = os.path.join(ROOT, "src/episodes/vi04-investasi-yang-cocok/data")
SAMPLES = 161  # kit RETURN_N + 1
LO, HI = -0.3, 1.0  # kit RETURN_RANGE

TRACES = {
    "jembatan": {
        "src": "vi04-jembatan-chart-simon.png",
        "said": "pake grafik ini buat 'Jembatan'",
        "kind": "line",
        "plot": (18, 752, 80, 330),
        "smooth": 1.5,
        "scale": ("end", 0.32),
    },
    "kapal": {
        "src": "the Reksa Dana vs Benchmark chart (fund line, Jan 2020 – Feb 2023)",
        "said": "pake ini buat kapal",
        "kind": "points",
        # month by month from Jan 2020, % cumulative
        "points": list(enumerate([0, -4, -11, -30, -29.5, -28, -24, -17.5, -14.5, -24.5, -18, -11, -6.5, -7.5, -5, -10, -11, -12, -16.5, -17.5, -12.5, -9, -3, -4, -4, -2.5, 2, 3.5, 7, 5, -3, -1, 6.5, 9, 10.5, 12.8, 5.5, 6.5, 7.3])),
        "jitter": 0,
        "smooth": 0,
        "scale": ("fit", LO, 0.75),
    },
    "pesawat": {
        "src": "the Return Performance chart (COMPOSITE, Jun 2014 – Jun 2015)",
        "said": "pake ini buat Pesawat, yang tadi ganti aja",
        "kind": "points",
        # px across its 600-px picture, % return — to 520 as read off; then, where the chart fell to −1.5 %, it climbs
        # instead to a new high above its old one (Simon, 3 Nov: "buat ujungnya di atas higher high deh (skalian bikin
        # jadi paling tinggi)"), so its end is the highest point of all three paths
        "points": [
            (37, 0), (45, -1), (55, -2.5), (62, -2), (66, -2.6), (72, 0), (78, 2.5), (85, 2), (95, 4), (105, 3.5), (115, 4.5),
            (125, 3.8), (135, 5), (145, 5.5), (152, 4), (160, 5.2), (172, 3), (182, 2.8), (188, -0.5), (193, -1.2), (200, 1),
            (208, 2.5), (215, 2), (225, 1), (235, 1.5), (245, 3), (255, 2), (265, 3.5), (275, 3), (285, 4.5), (295, 3.5),
            (302, 2), (310, 4.5), (320, 5), (330, 4), (340, 6), (350, 5.5), (360, 7), (368, 8.5), (378, 9), (388, 10.5),
            (398, 8.5), (408, 10), (418, 9.5), (428, 9), (438, 11), (446, 9.5), (455, 10), (462, 8), (470, 4), (476, 2.5),
            (484, 3.5), (492, 5), (500, 6.5), (508, 8), (515, 7.5), (520, 9.5), (525, 11), (530, 12), (537, 13),
        ],
        "jitter": 0.15,
        "smooth": 0,
        "scale": "peak",
    },
}


def points(t):
    """The read-off points → (x, y down like a picture's) every unit across, with seeded jitter if asked."""
    xs = np.array([p[0] for p in t["points"]], float)
    ys = -np.array([p[1] for p in t["points"]], float)
    x = np.linspace(xs[0], xs[-1], int((xs[-1] - xs[0]) * (1 if xs[-1] - xs[0] > 100 else 20)) + 1)
    y = np.interp(x, xs, ys)
    if t["jitter"]:
        jit = np.random.default_rng(4).uniform(-1, 1, len(x)) * t["jitter"]
        jit[0] = jit[-1] = 0
        y = y + jit
    return x, y


def dark_line(a, t):
    x0, x1, y0, y1 = t["plot"]
    dark = a[..., :3].sum(-1) < 400
    xs, ys, prev = [], [], None
    for x in range(x0, x1):
        rows = np.nonzero(dark[y0:y1, x])[0] + y0
        if not len(rows):
            continue
        # the run of dark pixels nearest where the line was — a label or a stray pixel elsewhere is not it
        runs = np.split(rows, np.flatnonzero(np.diff(rows) > 1) + 1)
        mids = [r.mean() for r in runs]
        y = mids[int(np.argmax(mids))] if prev is None else min(mids, key=lambda m: abs(m - prev))
        if prev is not None and abs(y - prev) > 25:
            continue
        xs.append(x)
        ys.append(y)
        prev = y
    return np.array(xs, float), np.array(ys, float)


def main():
    for name, t in TRACES.items():
        if t["kind"] == "points":
            xs, ys = points(t)
        else:
            xs, ys = dark_line(np.asarray(Image.open(os.path.join(REFS, t["src"])).convert("RGB")).astype(int), t)
        grid = np.linspace(xs.min(), xs.max(), SAMPLES * 8)
        full = np.interp(grid, xs, ys)
        if t["smooth"]:
            full = ndi.gaussian_filter1d(full, t["smooth"] * len(grid) / (xs.max() - xs.min()), mode="nearest")
        y = np.interp(np.linspace(0, len(full) - 1, SAMPLES), np.arange(len(full)), full)
        rise = y[0] - y  # up is positive, the first 0
        s = t["scale"]
        if s == "peak":
            v = rise / rise.max() * HI
        elif s[0] == "end":
            v = rise / rise[-1] * s[1]
        else:
            v = s[1] + (rise - rise.min()) / (rise.max() - rise.min()) * (s[2] - s[1])
        out = os.path.join(DATA, f"return-{name}.json")
        json.dump(
            {
                "_": f"Written by scripts/vi/trace-return-curve.py from {t['src']} (Simon, 3 Nov 2026: \"{t['said']}\"), on kit RETURN_RANGE's scale.",
                "values": [round(float(q), 4) for q in v],
            },
            open(out, "w"),
        )
        print(f"{name}: {SAMPLES} samples; start {v[0]:.3f}, low {v.min():.3f}, high {v.max():.3f}, end {v[-1]:.3f} -> {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    main()
