#!/usr/bin/env python3
"""VI02: restyle a coloured isometric SVG into Template-iso-plant's look: flat white and one pale shade, thin grey lines.

    python scripts/vi/vi02-plant-restyle.py source.svg out.svg

Every shape keeps its geometry. Gradients, glows, smoke and blend modes go; a shape's new fill comes from how light it was: big
dark planes are roofs and go white, as they are in the plant, small dark ones go to the shade. The view is cropped to what's left.
"""
import re, sys, colorsys
import xml.etree.ElementTree as ET

SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)
WHITE, SHADE, DEEP, LINE = "#FFFFFF", "#E0E3EA", "#C9CED8", "#737B8A"
STROKE = 0.36
ROOF_AREA, HOLE_AREA, PAD = 4000, 340, 8
SHAPES = {"path", "polygon", "ellipse", "circle", "rect", "polyline", "line"}

def tag(e):
    return e.tag.split("}")[-1]

def css(root):
    rules = {}
    for st in root.iter(f"{{{SVG}}}style"):
        for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", st.text or ""):
            decl = dict((k.strip(), v.strip()) for k, v in (d.split(":", 1) for d in body.split(";") if ":" in d))
            for s in sel.split(","):
                rules.setdefault(s.strip().lstrip("."), {}).update(decl)
    return rules

def rgb(c):
    c = c.strip()
    if c.startswith("#"):
        c = c[1:]
        if len(c) == 3:
            c = "".join(x * 2 for x in c)
        return tuple(int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return None

def props(e, rules):
    out = {}
    for c in (e.get("class") or "").split():
        out.update(rules.get(c, {}))
    for k in ("fill", "opacity", "stop-color", "stop-opacity", "fill-opacity"):
        if e.get(k) is not None:
            out[k] = e.get(k)
    for d in (e.get("style") or "").split(";"):
        if ":" in d:
            k, v = d.split(":", 1)
            out[k.strip()] = v.strip()
    return out

def gradients(root, rules):
    found = {}
    for g in root.iter():
        if tag(g) in ("linearGradient", "radialGradient"):
            stops = []
            for s in g:
                p = props(s, rules)
                col = rgb(p.get("stop-color", "#000"))
                stops.append((col or (0, 0, 0), float(p.get("stop-opacity", 1))))
            found[g.get("id")] = {"stops": stops, "href": (g.get(f"{{{XLINK}}}href") or "").lstrip("#")}
    def stops(i, seen=()):
        g = found.get(i)
        if not g or i in seen:
            return []
        return g["stops"] or stops(g["href"], seen + (i,))
    return {i: stops(i) for i in found}

def paint(p, grads):
    """The shape's mean colour and mean alpha."""
    f = p.get("fill", "#000")
    alpha = float(p.get("fill-opacity", 1))
    m = re.match(r"url\(#(.+?)\)", f)
    if m:
        st = grads.get(m.group(1)) or [((0, 0, 0), 1)]
        col = tuple(sum(s[0][i] for s in st) / len(st) for i in range(3))
        return col, alpha * sum(s[1] for s in st) / len(st), True
    if f == "none":
        return None, 0, False
    return rgb(f) or (0, 0, 0), alpha, False

def nums(s):
    return [float(x) for x in re.findall(r"-?\d*\.?\d+(?:e-?\d+)?", s)]

def bbox(e):
    n = tag(e)
    if n in ("polygon", "polyline"):
        v = nums(e.get("points"))
        xs, ys = v[0::2], v[1::2]
    elif n in ("ellipse", "circle"):
        cx, cy = float(e.get("cx")), float(e.get("cy"))
        rx, ry = float(e.get("rx") or e.get("r")), float(e.get("ry") or e.get("r"))
        xs, ys = [cx - rx, cx + rx], [cy - ry, cy + ry]
    elif n == "path":
        x = y = sx = sy = 0.0
        xs, ys = [], []
        for c, a in re.findall(r"([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)", e.get("d")):
            big, rel = c.upper(), c.islower()
            if big == "Z":
                x, y = sx, sy
                continue
            v = nums(a)
            step = {"M": 2, "L": 2, "T": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "A": 7}[big]
            for i in range(0, len(v), step):
                q = v[i:i + step]
                if big == "H":
                    x = q[0] + (x if rel else 0)
                elif big == "V":
                    y = q[0] + (y if rel else 0)
                else:
                    x, y = q[-2] + (x if rel else 0), q[-1] + (y if rel else 0)
                xs.append(x)
                ys.append(y)
                if big == "M" and i == 0:
                    sx, sy = x, y
    else:
        return None
    return min(xs), min(ys), max(xs), max(ys)

def shade(col):
    h, l, s = colorsys.rgb_to_hls(*col)
    # the saturated stripes and glass read as shade, however light they are
    if s > 0.62 and l < 0.8:
        return SHADE
    if l > 0.8:
        return WHITE
    if l > 0.62:
        return SHADE
    return DEEP

def walk(e, rules, grads, alpha, stats, drop):
    for k in list(e):
        n = tag(k)
        if n in ("defs", "style"):
            e.remove(k)
            continue
        p = props(k, rules)
        a = alpha * float(p.get("opacity", 1))
        blend = p.get("mix-blend-mode", "normal")
        if n == "g":
            if blend != "normal":
                e.remove(k)
                continue
            for x in ("class", "style"):
                k.attrib.pop(x, None)
            k.attrib.pop("opacity", None)
            walk(k, rules, grads, a, stats, drop)
            if not len(k):
                e.remove(k)
        elif n in SHAPES:
            col, fa, grad = paint(p, grads)
            seen = a * fa
            if col is None or blend != "normal" or seen < drop:
                e.remove(k)
                stats["dropped"] += 1
                continue
            for x in ("class", "style", "opacity"):
                k.attrib.pop(x, None)
            box = bbox(k)
            area = (box[2] - box[0]) * (box[3] - box[1])
            stats["box"].append(box)
            fill = shade(col)
            if fill == DEEP:
                fill = WHITE if area >= ROOF_AREA else SHADE
            if n == "ellipse" and area < HOLE_AREA:
                fill = SHADE
            k.set("fill", fill)
            k.set("stroke", LINE)
            k.set("stroke-width", str(STROKE))
            k.set("stroke-linejoin", "round")
            stats[fill] = stats.get(fill, 0) + 1

def main(src, out, drop="0.45"):
    tree = ET.parse(src)
    root = tree.getroot()
    rules = css(root)
    grads = gradients(root, rules)
    stats = {"dropped": 0, "box": []}
    walk(root, rules, grads, 1.0, stats, float(drop))
    boxes = stats.pop("box")
    x0, y0 = min(b[0] for b in boxes) - PAD, min(b[1] for b in boxes) - PAD
    x1, y1 = max(b[2] for b in boxes) + PAD, max(b[3] for b in boxes) + PAD
    root.set("viewBox", f"{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}")
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(stats, root.get("viewBox"))

if __name__ == "__main__":
    main(*sys.argv[1:])
