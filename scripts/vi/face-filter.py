#!/usr/bin/env python3
"""
face-filter.py — the "wide face, wide grin" phone filter (Simon's reference, VI07 SC07, 29 Oct 2026), done as a warp of
the picture itself: the face widened from its middle, the smile stretched and its corners pulled up, the eyes squeezed
a little. Nothing is drawn in; every pixel comes from the original.

  ~/.venvs/tuntun/bin/python scripts/vi/face-filter.py public/art/vi07/orang-1.png public/art/vi07/orang-1-filter.png

The face's landmarks are in that picture's pixels (measured on a 4x crop): change them for another picture.
"""
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

FACE = {"c": (160, 102), "r": (98, 86), "widen": 1.15}
MOUTH = {"c": (152, 121), "r": (46, 22), "widen": 1.7, "lift": 13}
EYES = [{"c": (145, 79)}, {"c": (182, 90)}]
EYE = {"r": (21, 12), "squeeze": 0.7}


def falloff(x, y, c, r):
    """1 at the centre, 0 at the ellipse's rim and outside it, smooth in between."""
    rho2 = ((x - c[0]) / r[0]) ** 2 + ((y - c[1]) / r[1]) ** 2
    return np.clip(1 - rho2, 0, 1) ** 2


def main(src, out):
    img = np.asarray(Image.open(src).convert("RGBA")).astype(np.float32)
    h, w = img.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)

    # each step maps an output position back to where it is taken from; they run from the last effect to the first
    sx, sy = x.copy(), y.copy()
    for e in EYES:
        k = falloff(sx, sy, e["c"], EYE["r"])
        sy = e["c"][1] + (sy - e["c"][1]) * (1 + EYE["squeeze"] * k)
    k = falloff(sx, sy, MOUTH["c"], MOUTH["r"])
    dx = (sx - MOUTH["c"][0]) / MOUTH["r"][0]
    sy = sy + MOUTH["lift"] * np.clip(dx, -1, 1) ** 2 * np.clip(1 - ((sy - MOUTH["c"][1]) / (MOUTH["r"][1] * 1.6)) ** 2, 0, 1)
    sx = MOUTH["c"][0] + (sx - MOUTH["c"][0]) / (1 + MOUTH["widen"] * k)
    k = falloff(sx, sy, FACE["c"], FACE["r"])
    sx = FACE["c"][0] + (sx - FACE["c"][0]) / (1 + FACE["widen"] * k)

    res = np.stack([map_coordinates(img[..., ch], [sy, sx], order=1, mode="nearest") for ch in range(4)], axis=-1)
    Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(out)
    print(f"{out}: {w}x{h}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
