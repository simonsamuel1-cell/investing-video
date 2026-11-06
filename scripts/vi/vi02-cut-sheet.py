#!/usr/bin/env python3
"""VI02: a ChatGPT sheet of separate objects on white, cut into one transparent PNG per object.

    python scripts/vi/vi02-cut-sheet.py sheet.png out-dir name1 name2 ...

Objects are found left to right as the columns the white background leaves between them. White is flood-filled in from the sheet's
edges, so a white highlight inside an object stays, and the edge is softened by a small blur of that mask.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

WHITE, GAP, PAD = 244, 6, 4

def main(src, out, *names):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(int)
    paper = a.min(axis=2) >= WHITE
    seen, _ = ndimage.label(paper)
    edge = set(seen[0, :]) | set(seen[-1, :]) | set(seen[:, 0]) | set(seen[:, -1])
    solid = ~np.isin(seen, [k for k in edge if k])
    cols = solid.sum(axis=0) > 0
    runs, start = [], None
    for x, on in enumerate(cols):
        if on and start is None:
            start = x
        if not on and start is not None:
            if x - start > GAP:
                runs.append((start, x))
            start = None
    if start is not None:
        runs.append((start, len(cols)))
    assert len(runs) == len(names), f"{len(runs)} objects for {len(names)} names: {runs}"
    rgba = im.copy()
    rgba.putalpha(Image.fromarray((solid * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.7)))
    Path(out).mkdir(parents=True, exist_ok=True)
    for name, (x0, x1) in zip(names, runs):
        rows = np.where(solid[:, x0:x1].sum(axis=1) > 0)[0]
        part = rgba.crop((max(0, x0 - PAD), max(0, rows[0] - PAD), min(im.width, x1 + PAD), min(im.height, rows[-1] + 1 + PAD)))
        part.save(Path(out) / f"{name}.png")
        print(name, part.size)

if __name__ == "__main__":
    main(*sys.argv[1:])
