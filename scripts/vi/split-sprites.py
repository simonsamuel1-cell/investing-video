#!/usr/bin/env python3
"""
split-sprites.py — one transparent PNG holding several objects side by side (ChatGPT draws several at once)
→ one PNG per object, cut along the empty columns between them, each then trimmed by cutout rules.

  ~/.venvs/tuntun/bin/python scripts/vi/split-sprites.py IN.png name1 name2 … --out public/art/vi03
"""
import argparse
import os

import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("names", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--max", type=int, default=1200)
    a = ap.parse_args()
    im = Image.open(a.src).convert("RGBA")
    alpha = np.array(im.getchannel("A")) > 16
    cols = alpha.any(axis=0)
    runs, inside = [], False
    for x, v in enumerate(cols):
        if v and not inside:
            start, inside = x, True
        elif not v and inside:
            runs.append((start, x))
            inside = False
    if inside:
        runs.append((start, len(cols)))
    # merge slivers (a stray pixel column) into their neighbour
    runs = [r for r in runs if r[1] - r[0] > 20]
    if len(runs) != len(a.names):
        raise SystemExit(f"found {len(runs)} objects, expected {len(a.names)}: {runs}")
    os.makedirs(a.out, exist_ok=True)
    for (x0, x1), name in zip(runs, a.names):
        part = im.crop((x0, 0, x1, im.height))
        bbox = part.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox()
        part = part.crop((max(0, bbox[0] - 8), max(0, bbox[1] - 8), min(part.width, bbox[2] + 8), min(part.height, bbox[3] + 8)))
        if max(part.size) > a.max:
            k = a.max / max(part.size)
            part = part.resize((round(part.width * k), round(part.height * k)), Image.LANCZOS)
        dst = os.path.join(a.out, f"{name}.png")
        part.save(dst, optimize=True)
        print(f"{dst}  {part.width}x{part.height}")


if __name__ == "__main__":
    main()
