#!/usr/bin/env python3
"""VI02 SC07: Simon's Freepik truck (DeliveryTruck.ai, through `pdftocairo -svg`) split into layers on one frame, recoloured to
natural truck colours (Simon: not the brand), plus the see-through box and its goods.

    python scripts/vi/vi02-truck-layers.py truck.svg public/art/vi02/truck

under  the far wheels, the chassis, the box's frame       glass  the box's see-through walls, shelf and floor
good-N one product each                                    sheen  the light across the glass
solid  the box's closed walls                              over   the arches, near wheels and cab
"""
import re, sys
from pathlib import Path

VIEW = "90 80 590 355"
BOX, BOX_MID, BOX_DEEP, BOX_DARK = "#F1E7D3", "#E6D9BF", "#D4C3A2", "#A08C69"
CAB, CAB_LIT, CAB_SHADE = "#C4513D", "#D96C55", "#A63F2F"
SKY, SKY_PALE = "#BFD3DD", "#E3EDF2"
GLASS_SIDE, GLASS_FRONT = "#F3F6F8", "#EAF0F3"
STEEL, STEEL_DEEP, CHARCOAL, TYRE = "#6A6E76", "#4A4D54", "#26282C", "#17181B"
RED, RED_DARK, YELLOW, YELLOW_DARK, SOY = "#D6453A", "#A8302A", "#F0B03F", "#C98A1F", "#7A4A2E"
CARTON, CARTON_DARK, WALL, GOLD = "#E7BE8B", "#CDA06B", "#FBF7EF", "#FFD27A"

RECOLOUR = {
    "#FF8C00": CAB, "#FFB300": CAB_LIT, "#FC6400": CAB_SHADE,
    "#0D3F59": "#34363B", "#36596C": STEEL_DEEP, "#062339": CHARCOAL, "#00101E": TYRE, "#0C3143": CHARCOAL, "#437B95": STEEL, "#3D697E": STEEL,
    "#A8F3FF": SKY_PALE, "#77D4E6": SKY, "#009CAC": BOX_DEEP, "#00686E": BOX_DARK, "#55BCCB": BOX_DEEP,
}
# shapes whose colour depends on what they are, not on what they were
BY_INDEX = {7: BOX_DEEP, 8: BOX, 9: BOX_DARK, 10: BOX_MID, 11: BOX_MID, 12: BOX_MID, 13: BOX_DEEP, 14: BOX_DEEP, 64: BOX, 34: STEEL_DEEP, 35: STEEL_DEEP, 94: "#E9B54F", 95: GOLD}

def hexof(m):
    return "#%02X%02X%02X" % tuple(round(float(v) * 2.55) for v in m.groups())

def recolour(i, p):
    def swap(m):
        return f'{m.group(1)}="{BY_INDEX.get(i) or RECOLOUR.get(hexof(re.match(r"rgb.([\d.]+)%, ([\d.]+)%, ([\d.]+)%", m.group(2))), m.group(2))}"'
    return re.sub(r'(fill|stroke)="(rgb\([^"]+\))"', swap, p)

def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEW}">{body}</svg>\n'

def carton(x, y, w, h):
    l, t = x - w / 2, y - h
    return (f'<rect x="{l}" y="{t}" width="{w}" height="{h}" rx="5" fill="{CARTON}"/><rect x="{l + w - 12}" y="{t}" width="12" height="{h}" rx="5" fill="{CARTON_DARK}"/>'
            f'<rect x="{x - 8}" y="{t}" width="14" height="{h * 0.34}" fill="{CARTON_DARK}"/><rect x="{l + 9}" y="{y - h * 0.36}" width="{w * 0.36}" height="{h * 0.2}" rx="3" fill="{WALL}"/>')

def pack(x, y, w, h, tone, edge):
    l, t = x - w / 2, y - h
    return (f'<rect x="{l}" y="{t}" width="{w}" height="{h}" rx="7" fill="{tone}"/><rect x="{l}" y="{t}" width="{w}" height="9" rx="4" fill="{edge}"/><rect x="{l}" y="{y - 9}" width="{w}" height="9" rx="4" fill="{edge}"/>'
            f'<rect x="{l + 6}" y="{t + h * 0.3}" width="{w - 12}" height="{h * 0.4}" rx="5" fill="{WALL}"/><circle cx="{x}" cy="{t + h * 0.5}" r="{h * 0.1}" fill="{GOLD}"/>')

def bottle(x, y, w, h, tone):
    l, t = x - w / 2, y - h
    neck = w * 0.42
    return (f'<rect x="{x - neck / 2 - 1}" y="{t}" width="{neck + 2}" height="9" rx="3" fill="{RED_DARK}"/><rect x="{x - neck / 2}" y="{t + 8}" width="{neck}" height="{h * 0.2}" fill="{tone}"/>'
            f'<rect x="{l}" y="{t + h * 0.22}" width="{w}" height="{h * 0.78}" rx="10" fill="{tone}"/><rect x="{l + 4}" y="{t + h * 0.5}" width="{w - 8}" height="{h * 0.28}" rx="3" fill="{WALL}"/><rect x="{l + 5}" y="{t + h * 0.28}" width="4" height="{h * 0.16}" rx="2" fill="{CARTON}"/>')

def cup(x, y, w, h, tone):
    t = y - h
    return (f'<path d="M {x - w / 2} {t + 8} L {x + w / 2} {t + 8} L {x + w * 0.38} {y - 3} Q {x + w * 0.37} {y} {x + w * 0.33} {y} L {x - w * 0.33} {y} Q {x - w * 0.37} {y} {x - w * 0.38} {y - 3} Z" fill="{tone}"/>'
            f'<rect x="{x - w * 0.27}" y="{t + h * 0.36}" width="{w * 0.54}" height="{h * 0.34}" rx="4" fill="{WALL}"/><rect x="{x - w / 2 - 3}" y="{t}" width="{w + 6}" height="10" rx="4" fill="{GOLD}"/>')

FLOOR, SHELF = 321, 219
GOODS = [
    carton(148, FLOOR, 74, 84), pack(214, FLOOR, 46, 80, RED, RED_DARK), bottle(258, FLOOR, 32, 92, SOY), bottle(296, FLOOR, 32, 92, SOY), carton(343, FLOOR, 50, 62),
    pack(132, SHELF, 44, 76, YELLOW, YELLOW_DARK), pack(180, SHELF, 44, 76, YELLOW, YELLOW_DARK), cup(228, SHELF, 42, 62, RED), cup(274, SHELF, 42, 62, RED), carton(331, SHELF, 74, 82),
]

def main(src, out):
    text = Path(src).read_text()
    paths = [recolour(i, p) for i, p in enumerate(re.findall(r"<path[^>]*?/>", text))]
    d = lambda i: re.search(r' d="([^"]+)"', paths[i]).group(1)
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "under.svg").write_text(svg("".join(paths[3:7]) + f'<path fill-rule="evenodd" d="{d(7)} {d(8)}" fill="{BOX_DEEP}"/><path fill-rule="evenodd" d="{d(9)} {d(10)}" fill="{BOX_DARK}"/>'))
    floor = f'<path d="M 103.67 {FLOOR} H 373.6 V 368.22 H 105.72 Q 103.67 368.22 103.67 366.17 Z" fill="{BOX_DEEP}"/>'
    (out / "glass.svg").write_text(svg(f'<path d="{d(8)}" fill="{GLASS_FRONT}" fill-opacity="0.7"/><path d="{d(10)}" fill="{GLASS_SIDE}" fill-opacity="0.55"/><rect x="103.67" y="{SHELF}" width="270" height="5" fill="{BOX_DARK}"/>{floor}'))
    for i, good in enumerate(GOODS):
        (out / f"good-{i}.svg").write_text(svg(good))
    (out / "sheen.svg").write_text(svg(f'<clipPath id="c"><rect x="103.67" y="115.5" width="270" height="{FLOOR - 115.5}"/></clipPath><g clip-path="url(#c)" fill="#FFFFFF" fill-opacity="0.16"><path d="M 190 110 L 250 110 L 150 330 L 90 330 Z"/><path d="M 268 110 L 290 110 L 190 330 L 168 330 Z"/></g>'))
    (out / "solid.svg").write_text(svg("".join(paths[8:9] + paths[10:15])))
    (out / "over.svg").write_text(svg("".join(paths[15:])))

if __name__ == "__main__":
    main(*sys.argv[1:3])
