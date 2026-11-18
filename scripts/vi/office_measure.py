"""
office_measure.py — reading a black line-art PNG by its pixels, to redraw it as clean geometry (VI03 SC07 office, Simon 18 Nov:
"audit lagi gambar ini, dan smoothen garis2 nya … garisnya buat jadi lurus … samain ketebalannya … samain semua kotak normal …
Baca tiap pixel nya").

Every helper takes a window (x0, y0, x1, y1) in the PNG's pixels and returns what it finds there; nothing is guessed.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

THRESH = 140


def load(png):
    a = np.array(Image.open(png).convert("L"))
    return a < THRESH


def win(D, b):
    x0, y0, x1, y1 = b
    return D[y0:y1, x0:x1]


def runs(v, off=0):
    """dark runs along a 1-D array: [(start, end_inclusive)], offset by `off`"""
    out, s = [], None
    for i, d in enumerate(v):
        if d and s is None:
            s = i
        if not d and s is not None:
            out.append((s + off, i - 1 + off))
            s = None
    if s is not None:
        out.append((s + off, len(v) - 1 + off))
    return out


def row(D, y, x0, x1):
    return runs(D[y, x0:x1], x0)


def col(D, x, y0, y1):
    return runs(D[y0:y1, x], y0)


def bbox(D, b):
    w = win(D, b)
    ys, xs = np.nonzero(w)
    if not len(xs):
        return None
    return (b[0] + xs.min(), b[1] + ys.min(), b[0] + xs.max() + 1, b[1] + ys.max() + 1)


def blobs(D, b, min_area=20):
    """connected dark components inside the window: bbox, area, fill ratio, holes"""
    w = win(D, b)
    lab, n = ndimage.label(w)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab), start=1):
        m = lab[sl] == i
        area = int(m.sum())
        if area < min_area:
            continue
        y0, x0 = sl[0].start + b[1], sl[1].start + b[0]
        y1, x1 = sl[0].stop + b[1], sl[1].stop + b[0]
        holes = ndimage.label(ndimage.binary_fill_holes(m) & ~m)[1]
        out.append({"box": (x0, y0, x1, y1), "area": area, "fill": area / ((x1 - x0) * (y1 - y0)), "holes": holes})
    return out


def thickness_h(D, y, x0, x1):
    """widths of the dark runs on row y"""
    return [e - s + 1 for s, e in row(D, y, x0, x1)]


def thickness_v(D, x, y0, y1):
    return [e - s + 1 for s, e in col(D, x, y0, y1)]
