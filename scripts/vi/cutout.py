#!/usr/bin/env python3
"""
cutout.py — make any picture safe to drop into an episode: a REAL transparent PNG, trimmed, not oversized.

  ~/.venvs/tuntun/bin/python scripts/vi/cutout.py IN.png [IN2.jpg …] --out public/art/vi02 [--max 2000] [--force]

· ChatGPT's "transparent background" is often a painted checkerboard or plain white. A picture whose alpha
  covers almost all of it (≥ 97% opaque) is treated as having NO cut-out and goes through rembg (local).
· The transparent margin is trimmed away (a little padding kept), so `ink` is the whole picture.
· The long side is held to --max: huge PNGs (4000–8000 px) made Remotion fail to decode during renders.
Prints, per file, what it did and the final size — the aspect to put in code.
"""
import argparse
import os

from PIL import Image

PAD = 8


def opaque_share(im):
    a = im.getchannel("A")
    hist = a.histogram()
    return sum(hist[250:]) / (im.width * im.height)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--max", type=int, default=2000)
    ap.add_argument("--force", action="store_true", help="always run rembg")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    session = None
    for f in a.files:
        im = Image.open(f).convert("RGBA")
        did = []
        if a.force or opaque_share(im) >= 0.97:
            from rembg import new_session, remove

            session = session or new_session("isnet-general-use")
            im = remove(im, session=session)
            did.append("rembg")
        bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if bbox:
            x0, y0, x1, y1 = bbox
            im = im.crop((max(0, x0 - PAD), max(0, y0 - PAD), min(im.width, x1 + PAD), min(im.height, y1 + PAD)))
            did.append("trim")
        if max(im.size) > a.max:
            k = a.max / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
            did.append("downscale")
        name = os.path.splitext(os.path.basename(f))[0].lower().replace(" ", "-") + ".png"
        dst = os.path.join(a.out, name)
        im.save(dst, optimize=True)
        print(f"{dst}  {im.width}x{im.height}  aspect {im.width}/{im.height}  [{', '.join(did) or 'as is'}]")


if __name__ == "__main__":
    main()
