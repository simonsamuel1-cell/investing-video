"""sticker.py — give a transparent PNG a solid white sticker border (the paper-standee edge).

  python scripts/vi/sticker.py in.png out.png [--border 14] [--crop x0,y0,x1,y1] [--max 1400]

The alpha is grown by `border` px (round, via repeated 3x3 max filters on a blurred mask), filled white, and
the original art is laid on top. Optional crop first (in source pixels), then trim and size cap.
"""
import argparse
from PIL import Image, ImageFilter

p = argparse.ArgumentParser()
p.add_argument("src"); p.add_argument("out")
p.add_argument("--border", type=int, default=14)
p.add_argument("--crop", default=None)
p.add_argument("--max", type=int, default=1400)
a = p.parse_args()

im = Image.open(a.src).convert("RGBA")
if a.crop:
    im = im.crop(tuple(int(v) for v in a.crop.split(",")))
bb = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
im = im.crop(bb)
pad = a.border + 4
canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
canvas.paste(im, (pad, pad), im)
alpha = canvas.getchannel("A").point(lambda v: 255 if v > 20 else 0)
grown = alpha.filter(ImageFilter.GaussianBlur(a.border / 2)).point(lambda v: 255 if v > 8 else 0)
grown = grown.filter(ImageFilter.GaussianBlur(1.2))
white = Image.new("RGBA", canvas.size, (255, 255, 255, 255))
white.putalpha(grown)
out = Image.alpha_composite(white, canvas)
if max(out.size) > a.max:
    out.thumbnail((a.max, a.max), Image.LANCZOS)
out.save(a.out)
print(a.out, out.size)
