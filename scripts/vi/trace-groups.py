#!/usr/bin/env python3
"""
trace-groups.py — a black line-art PNG into editable vector groups: potrace, one group per region.

  python3 scripts/vi/trace-groups.py art.png regions.json out.json [--threshold 140]

regions.json: {"groups": [{"id": "lampu-atas-1", "label": "Lampu atas 1", "rects": [[x0, y0, x1, y1], …]}, …], "claims": […]},
in the PNG's own pixels, in priority order: a dark pixel belongs to the first group whose rect holds it; whatever no rect claims
goes to the group with "rest": true; a group with "drop": true is cut out of the drawing (its rects turn white). "claims" come first: {"id", "rows": [y0, y1], "cols": [x0, x1] (optional), "minRun": n} gives
that group every dark pixel in those rows that is part of a horizontal run at least n long — a floor line or a pipe passing
behind the things standing on it stays whole, and the things keep only their own lines. Each group is traced on its own (potrace -t 4 -a 1 -O 0.4), so it can be shown, hidden, moved or
recoloured in code; each part also gets its own white inside ("fill"), and "draw": [ids] sets the order they are drawn in,
back to front. out.json: {"w", "h", "ink" (the lines' bounding box), "transform", "groups": [{"id", "label", "d": [path, …]}]} — the paths in potrace's
units, drawn inside <g transform={transform}>.

Simon 18 Nov (VI03 SC07): "Bisa ga kamu buat ulang gambar ini? Trace gambarnya dengan code?" — the ChatGPT office drawing was a
flat PNG that could not be changed.
"""
import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("png")
    ap.add_argument("regions")
    ap.add_argument("out")
    ap.add_argument("--threshold", type=int, default=140)
    a = ap.parse_args()
    im = Image.open(a.png).convert("L")
    w, h = im.size
    px = im.load()
    doc = json.loads(Path(a.regions).read_text())
    spec = doc["groups"]
    owner = {}
    rest = next(g["id"] for g in spec if g.get("rest"))
    # groups marked "drop" are cut out of the drawing altogether (their pixels turn white before anything else)
    for g in spec:
        if g.get("drop"):
            for x0, y0, x1, y1 in g["rects"]:
                for y in range(max(0, y0), min(h, y1)):
                    for x in range(max(0, x0), min(w, x1)):
                        px[x, y] = 255
    spec = [g for g in spec if not g.get("drop")]
    dark = [(x, y) for y in range(h) for x in range(w) if px[x, y] < a.threshold]
    claimed = {}
    healed = {}

    def long_runs(y, x0, x1, n):
        runs = []
        x = x0
        while x < x1:
            if px[x, y] < a.threshold:
                s0 = x
                while x < x1 and px[x, y] < a.threshold:
                    x += 1
                if x - s0 >= n:
                    runs.append((s0, x))
            else:
                x += 1
        return runs

    for c in doc.get("claims", []):
        x0, x1 = c.get("cols", [0, w])
        rows = range(c["rows"][0], c["rows"][1] + 1)
        if not c.get("heal"):
            for y in rows:
                for s0, e0 in long_runs(y, x0, x1, c["minRun"]):
                    for xx in range(s0, e0):
                        claimed.setdefault((xx, y), c["id"])
            continue
        # "heal": a straight line the drawing breaks where something stands in front of it (a floor behind feet) is redrawn
        # whole and even, so its group can be shown alone: only its core rows — those its long runs cover for at least 60 % of
        # its length — each filled solid from its first run to its last; the rows at its edges (where legs cross) stay with the
        # things standing on it
        runs = {y: long_runs(y, x0, x1, c["minRun"]) for y in rows}
        span = [r for rr in runs.values() for r in rr]
        if not span:
            continue
        lo, hi = min(r[0] for r in span), max(r[1] for r in span)
        for y, rr in runs.items():
            if rr and sum(e - s0 for s0, e in rr) >= 0.6 * (hi - lo):
                for xx in range(rr[0][0], rr[-1][1]):
                    if px[xx, y] < a.threshold:
                        claimed[(xx, y)] = c["id"]
                    else:
                        healed[(xx, y)] = c["id"]
    for x, y in dark:
        if (x, y) in claimed:
            owner.setdefault(claimed[(x, y)], []).append((x, y))
            continue
        gid = rest
        for g in spec:
            if any(x0 <= x < x1 and y0 <= y < y1 for x0, y0, x1, y1 in g.get("rects", [])):
                gid = g["id"]
                break
        owner.setdefault(gid, []).append((x, y))
    for (x, y), gid in healed.items():
        owner.setdefault(gid, []).append((x, y))
    # the drawing's white inside: every pixel the outside cannot reach without crossing a line — traced as "latar", drawn first
    # in the page colour, so the drawing stays opaque (as the PNG was) on any background
    flood = Image.new("L", (w, h), 255)
    fp = flood.load()
    for x, y in dark:
        fp[x, y] = 0
    pad = Image.new("L", (w + 2, h + 2), 255)
    pad.paste(flood, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)
    pp = pad.load()
    owner["latar"] = [(x, y) for y in range(h) for x in range(w) if pp[x + 1, y + 1] != 128]
    spec = [{"id": "latar", "label": "Latar putih (isi gambar)", "base": True}] + spec
    groups = []
    transform = None
    with tempfile.TemporaryDirectory() as tmp:
        for g in spec:
            pts = owner.get(g["id"], [])
            if not pts:
                continue
            bm = Image.new("1", (w, h), 1)
            bp = bm.load()
            for x, y in pts:
                bp[x, y] = 0
            if not g.get("base"):
                # grow 2 px into the dark pixels around it (only those): where two parts meet inside a black area — a floor line
                # behind a leg — they overlap instead of leaving an anti-aliased hairline between them; outer edges stay put
                grown = Image.new("L", (w, h), 0)
                gp = grown.load()
                for x, y in pts:
                    gp[x, y] = 255
                grown = grown.filter(ImageFilter.MaxFilter(5)).load()
                for x, y in dark:
                    if grown[x, y]:
                        bp[x, y] = 0
            def trace(img, name, alpha="1", opt="0.4"):
                pbm = Path(tmp) / f"{name}.pbm"
                svg = Path(tmp) / f"{name}.svg"
                img.save(pbm)
                subprocess.run(["potrace", str(pbm), "-s", "-o", str(svg), "-t", "4", "-a", alpha, "-O", opt], check=True)
                text = svg.read_text()
                return re.search(r'<g transform="([^"]+)"', text).group(1), [re.sub(r"\s+", " ", d).strip() for d in re.findall(r'<path d="([^"]+)"', text)]

            if g.get("smooth"):
                # a person: the bitmap softened and re-thresholded before tracing, and potrace told to round more — jagged
                # edges and pixel steps go, the shapes stay (Simon 18 Nov: "smoothen garis2 nya")
                soft = bm.convert("L").filter(ImageFilter.GaussianBlur(1.4)).point(lambda v: 0 if v < 128 else 255).convert("1")
                transform, paths = trace(soft, g["id"], "1.25", "0.8")
                bm = soft
            else:
                transform, paths = trace(bm, g["id"])
            fill = []
            if not g.get("base") and not g.get("rest"):
                # the part's own white inside (its lines plus what they enclose), drawn under its lines, so a part covers
                # whatever stands behind it — as in the PNG — whether or not the others are showing
                sil = Image.new("L", (w + 2, h + 2), 255)
                sil.paste(bm.convert("L"), (1, 1))
                ImageDraw.floodfill(sil, (0, 0), 128)
                sil = sil.point(lambda v: 255 if v == 128 else 0).crop((1, 1, w + 1, h + 1)).convert("1")
                _, fill = trace(sil, g["id"] + "-fill")
            groups.append({"id": g["id"], "label": g.get("label", g["id"]), "base": bool(g.get("base")), "fill": fill, "d": paths})
            print(f"{g['id']:24s} {len(pts):7d} px  {len(paths):3d} paths")
    order = doc.get("draw")
    if order:
        groups.sort(key=lambda g: order.index(g["id"]) if g["id"] in order else len(order))
    xs = [x for x, _ in dark]
    ys = [y for _, y in dark]
    ink = [min(xs), min(ys), max(xs) + 1, max(ys) + 1]
    Path(a.out).write_text(json.dumps({"w": w, "h": h, "ink": ink, "transform": transform, "groups": groups}, ensure_ascii=False))
    print(f"→ {a.out}  {Path(a.out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
