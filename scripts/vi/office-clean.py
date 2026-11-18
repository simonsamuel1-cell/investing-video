#!/usr/bin/env python3
"""
office-clean.py — the two-floor office (VI03 SC07) redrawn as clean geometry, from measurements of the ChatGPT PNG's pixels.

Simon 18 Nov: "audit lagi gambar ini, dan smoothen garis2 nya … garisnya buat jadi lurus, misal ada yang bengkok, kamu lurusin;
ada yang garisnya dari tebal lalu mengerucut tipis, kamu samain ketebalannya; ada kotak-kotak yang beda-beda bentuknya, kamu samain
semua kotak normal … Baca tiap pixel nya."

Everything but the people is redrawn here as rects, lines, circles and a few curves, in the PNG's own pixel space (1752 × 897),
each number read off the PNG with scripts/vi/office_measure.py (the measured outer edges are noted beside each shape; the
geometry is the stroke's centre line). Rules applied:
  - one stroke weight per kind of line: the building's frame 12, its floors 9, the roof 10, objects 7, pipes 6, inner details 5;
  - every straight line exactly straight (horizontal or vertical), every rounded box one radius;
  - things that repeat are made the same: the 3 × 3 grid squares, the slots, the dots, the four vents (spaced evenly), the six
    lamps (one shape; the lower ones under the upper ones), the four clocks (true circles, evenly spaced), the two documents;
  - where something stands in front of something else, its white inside covers it (a lamp over the pipe, a clock over a lamp).
The people (and the scientist's boxes, the woman's tablet, the guest's briefcase) stay traced from the PNG — smoothed — from the
trace-groups.py output given as `people`.

  python3 scripts/vi/office-clean.py people.json out.json [preview.svg]
"""
import json
import sys

B, F, R, O, P, Dt = 12, 9, 10, 7, 6, 5  # building, floors, roof, objects, pipes, details

groups = {}


def g(gid):
    return groups.setdefault(gid, [])


def rect(gid, x, y, w, h, rx=0, sw=O, fill="white"):
    g(gid).append({"t": "rect", "x": x, "y": y, "w": w, "h": h, "rx": rx, "sw": sw, "fill": fill})


def frect(gid, x, y, w, h, rx=0):
    g(gid).append({"t": "rect", "x": x, "y": y, "w": w, "h": h, "rx": rx, "sw": 0, "fill": "ink"})


def wrect(gid, x, y, w, h, rx=0):
    g(gid).append({"t": "rect", "x": x, "y": y, "w": w, "h": h, "rx": rx, "sw": 0, "fill": "white"})


def line(gid, x1, y1, x2, y2, sw=O, cap="round", color="ink"):
    g(gid).append({"t": "line", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "sw": sw, "cap": cap, "color": color})


def circle(gid, cx, cy, r, sw=O, fill="white"):
    g(gid).append({"t": "circle", "cx": cx, "cy": cy, "r": r, "sw": sw, "fill": fill})


def fcircle(gid, cx, cy, r):
    g(gid).append({"t": "circle", "cx": cx, "cy": cy, "r": r, "sw": 0, "fill": "ink"})


def ellipse(gid, cx, cy, rx, ry, sw=O, fill="white"):
    g(gid).append({"t": "ellipse", "cx": cx, "cy": cy, "rx": rx, "ry": ry, "sw": sw, "fill": fill})


def path(gid, d, sw=O, fill="none", color="ink", cap="round"):
    g(gid).append({"t": "path", "d": d, "sw": sw, "fill": fill, "color": color, "cap": cap})


# ── the building ─────────────────────────────────────────────────────────────────────────────────────────────────────────
WL, WR = 333.5, 1679.5  # walls: x 328–339, 1673–1686
ROOF = (295, 48, 1409, 35)  # outer 290–1709 × 43–88
FLOOR_UP, SLAB, FLOOR_LO, BOTTOM = 484, 524.5, 831.5, 872.5  # 479–489, 518–531, 828–835, 867–878
wrect("latar", WL, ROOF[1] + ROOF[3], WR - WL, BOTTOM - ROOF[1] - ROOF[3])
rect("gedung", *ROOF, rx=12, sw=R)
line("gedung", WL, ROOF[1] + ROOF[3] + R / 2, WL, BOTTOM, sw=B, cap="square")
line("gedung", WR, ROOF[1] + ROOF[3] + R / 2, WR, BOTTOM, sw=B, cap="square")
line("gedung", WL, BOTTOM, WR, BOTTOM, sw=B, cap="square")
line("gedung", WL, SLAB, WR, SLAB, sw=B, cap="butt")
line("gedung", WL, FLOOR_UP, WR, FLOOR_UP, sw=F, cap="butt")
line("gedung", WL, FLOOR_LO, WR, FLOOR_LO, sw=F, cap="butt")

# vents: top bars 13–22, slats 7 wide down to the roof (43); vent widths 195–217 and spacing 355–388 in the PNG → one vent, 212
# wide, nine slats every 22, the four spread evenly between the first (centre 440) and the last (1552)
for i in range(4):
    cx = 440 + i * (1552 - 440) / 3
    x0 = cx - 106
    frect("ventilasi", x0, 13, 212, 9.5, rx=4.75)
    for k in range(9):
        line("ventilasi", x0 + 18 + k * 22, 21, x0 + 18 + k * 22, ROOF[1], sw=O, cap="butt")

# ── the upper floor's machinery ──────────────────────────────────────────────────────────────────────────────────────────
M = "mesin"
# the long pipe from the left column to the right one: lines 150–155 and 162–167 → centres 152.5 / 164.5
line(M, 461, 158.5, 1541, 158.5, sw=12 + P, cap="butt", color="white")
line(M, 461, 152.5, 1541, 152.5, sw=P, cap="butt")
line(M, 461, 164.5, 1541, 164.5, sw=P, cap="butt")
# left column: cap 411–475 × 100–126; tube walls 421–428 / 457–464 down to box 1 (243); four slots 22 × 10, evenly 25 apart
line(M, 424.5, 120, 424.5, 246, sw=O, cap="butt")
line(M, 460.5, 120, 460.5, 246, sw=O, cap="butt")
wrect(M, 428, 122, 29, 124)
rect(M, 414.5, 103.5, 57, 19, rx=6)
for cy in (140, 165, 190, 215):
    frect(M, 433, cy - 5, 22, 10, rx=5)
# box 1: 377–518 × 242–305, its inner window 412–483 × 262–285
rect(M, 380.5, 245.5, 134, 56, rx=10)
rect(M, 414.5, 264.5, 66, 18, rx=3, sw=Dt)
# pipe box 1 → box 2: lines 261–266 / 272–278
wrect(M, 518, 263.5, 44, 12)
line(M, 518, 263.5, 562, 263.5, sw=P, cap="butt")
line(M, 518, 275.5, 562, 275.5, sw=P, cap="butt")
# box 2: 562–700 × 222–305; three rings, outer 23–25 across → r 9.5 + 5 stroke, 33.5 apart
rect(M, 565.5, 225.5, 131, 76, rx=10)
for cx in (600, 633.5, 667):
    circle(M, cx, 267.5, 9.5, sw=Dt)
# the ring bar box 2 → box 3: 245–251 / 288–294, four rings 38.5 apart
wrect(M, 700, 248, 169, 43)
line(M, 700, 248, 869, 248, sw=O, cap="butt")
line(M, 700, 291, 869, 291, sw=O, cap="butt")
for cx in (728, 766.5, 805, 843.5):
    circle(M, cx, 269.5, 9, sw=Dt)
# box 3 (the grid): 869–1057 × 218–396; squares 29–30 × 25 → all 29 × 25, columns 45.5 apart, rows at 245 / 280 / 345
rect(M, 872.5, 221.5, 181, 171, rx=14)
for x in (906, 951.5, 997):
    for y in (245, 280, 345):
        frect(M, x, y, 29, 25, rx=4)
# the wide coupling box 3 → box 4: 296–304 / 326–335
wrect(M, 1057, 300, 37, 30.5)
line(M, 1057, 300, 1094, 300, sw=O, cap="butt")
line(M, 1057, 330.5, 1094, 330.5, sw=O, cap="butt")
# box 4: cap 1127–1222 × 142–174 (over the long pipe), neck walls 1144–1151 / 1198–1205, four dots, box 1094–1260 × 226–390,
# screen 1119–1236 × 249–367 with four lines (1138–1219) and two blocks 30 × 22
line(M, 1147.5, 172, 1147.5, 229, sw=O, cap="butt")
line(M, 1201.5, 172, 1201.5, 229, sw=O, cap="butt")
wrect(M, 1151, 172, 47, 57)
rect(M, 1130.5, 145.5, 88, 25, rx=7)
for cx in (1165.5, 1185.5):
    for cy in (190, 210):
        fcircle(M, cx, cy, 6.5)
rect(M, 1097.5, 229.5, 159, 157, rx=14)
rect(M, 1122, 252, 111, 112, rx=8, sw=P)
for k in range(4):
    line(M, 1140.5, 270.5 + k * 14.67, 1216.5, 270.5 + k * 14.67, sw=Dt)
frect(M, 1141, 328, 30, 22, rx=3)
frect(M, 1184, 328, 30, 22, rx=3)
# rod box 4 → box 5: 319–327
line(M, 1260, 323, 1291, 323, sw=O, cap="butt")
# box 5 (the panel): 1291–1475 × 266–370; three bars 39–43 wide → 40 × 20, 12 apart; three dots r 7, 15 apart
rect(M, 1294.5, 269.5, 177, 97, rx=10)
for x in (1312, 1364, 1416):
    frect(M, x, 283, 40, 20, rx=3)
for cy in (315, 330, 345):
    fcircle(M, 1320.5, cy, 7)
# the elbow from box 5 up and across into the right column: verticals 1378–1384 / 1394–1400, horizontals 204–209 / 217–222 →
# one pipe 13 wide with concentric bends
path(M, "M 1388.5 266 V 222 A 9 9 0 0 1 1397.5 213 H 1541", sw=13, color="white", cap="butt")
path(M, "M 1382 266 V 222 A 15.5 15.5 0 0 1 1397.5 206.5 H 1541", sw=P, cap="butt")
path(M, "M 1395 266 V 222 A 2.5 2.5 0 0 1 1397.5 219.5 H 1541", sw=P, cap="butt")
# the right column: cap 1528–1597 × 100–126, tube walls 1538–1545 / 1580–1587; its bubbles in two even columns
line(M, 1541.5, 120, 1541.5, 249, sw=O, cap="butt")
line(M, 1583.5, 120, 1583.5, 249, sw=O, cap="butt")
wrect(M, 1545, 122, 35, 127)
rect(M, 1531.5, 103.5, 62, 19, rx=6)
for k in range(5):
    fcircle(M, 1558, 138 + k * 18.5, 4.5)
for k in range(4):
    fcircle(M, 1571.5, 147.25 + k * 18.5, 3.5)
# box 6: 1496–1637 × 243–386, its ring (1543–1592 × 271–314) and dot, its window 1521–1612 × 332–362, two legs to the floor
for x in (1517.5, 1593.5):
    rect(M, x, 389, 21, 108.5, rx=3)
rect(M, 1499.5, 246.5, 134, 136, rx=12)
circle(M, 1567.5, 292.5, 19)
fcircle(M, 1567.5, 292.5, 6)
rect(M, 1524, 335, 85, 24, rx=4, sw=P)
# the stub into the right wall: 267–272 / 278–283, its flange 1662–1668 × 260–289
wrect(M, 1637, 269.5, 25, 11)
line(M, 1637, 269.5, 1663, 269.5, sw=P, cap="butt")
line(M, 1637, 280.5, 1663, 280.5, sw=P, cap="butt")
frect(M, 1662, 260, 7, 29, rx=2)
# the low elbow from box 5 down onto the belt and across into box 6, in front of box 5: 13 wide like the upper one
path(M, "M 1403.5 395 V 333 A 8.5 8.5 0 0 1 1412 324.5 H 1499.5", sw=13, color="white", cap="butt")
path(M, "M 1397 395 V 333 A 15 15 0 0 1 1412 318 H 1499.5", sw=P, cap="butt")
path(M, "M 1410 395 V 333 A 2 2 0 0 1 1412 331 H 1499.5", sw=P, cap="butt")
# feet on the belt (their tops 394–397): box 3's, box 4's two, box 5's, and the elbow's
for x0 in (1033, 1143, 1230, 1317, 1390):
    rect(M, x0 + 3, 397, 24, 10, rx=3, sw=P)

# ── the conveyor: board 691–1467 × 404–434 (its top sloped 404 → 408; levelled), belt line 458–463, wheels at both ends,
# legs 698–723 / 1436–1461 down to the floor ────────────────────────────────────────────────────────────────────────────
C = "konveyor"
for x in (701.5, 1439.5):
    rect(C, x, 431, 18, 70, rx=3, sw=P)
rect(C, 694.5, 407.5, 769, 23, rx=11.5)
line(C, 752, 460.5, 1407, 460.5, sw=P, cap="butt")
for cx in (735.5, 1423.5):
    fcircle_halo = {"t": "circle", "cx": cx, "cy": 445, "r": 21, "sw": 0, "fill": "white"}
    g(C).append(fcircle_halo)
    circle(C, cx, 445, 13.5, sw=P)

# ── lamps: one shape (measured on the upper left one: cord 661–668, knob 652–678 × 120–136, shade to the rim 609–723 ×
# 165–186), at x 662 / 1003 / 1341 on both floors (their cords were at 660–665, 1000–1005, 1340–1342), the lower ones 420 lower
# ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
def lamp(gid, cx, dy, top):
    line(gid, cx, top, cx, 126 + dy, sw=O, cap="butt")
    path(gid, f"M {cx - 53} {171 + dy} C {cx - 49} {152 + dy} {cx - 30} {138 + dy} {cx} {137.5 + dy} C {cx + 30} {138 + dy} {cx + 49} {152 + dy} {cx + 53} {171 + dy} Z", sw=O, fill="white")
    path(gid, f"M {cx - 13} {137 + dy} C {cx - 13} {127 + dy} {cx - 7} {122 + dy} {cx} {122 + dy} C {cx + 7} {122 + dy} {cx + 13} {127 + dy} {cx + 13} {137 + dy} Z", sw=0, fill="ink")
    ellipse(gid, cx, 175.5 + dy, 54, 7.5, sw=P)


for i, cx in enumerate((662, 1003, 1341)):
    lamp(f"lampu-atas-{i + 1}", cx, 0, ROOF[1] + ROOF[3])
    lamp(f"lampu-bawah-{i + 1}", cx, 420, SLAB + B / 2)

# ── the upper desk and its laptop: lid 400–495 × 340–394, screen 411–485 × 350–388, top 372–534 × 391–414, stem 437–464,
# base 398–505 × 492–498 ─────────────────────────────────────────────────────────────────────────────────────────────────
T = "meja-laptop"
rect(T, 440, 410, 20.5, 82, rx=2, sw=P)
line(T, 401.5, 495, 501.5, 495, sw=O)
rect(T, 403.5, 343.5, 88, 50, rx=5)
frect(T, 411, 350, 74, 38, rx=2)
rect(T, 375.5, 394.5, 155, 16, rx=6)

# ── clocks: rings 59–60 × 52 across (ellipses in the PNG) → true circles r 24 + 6 stroke, 73.67 apart; hands to 12 and 3. In
# the PNG the middle lamp hung half hidden behind them; with the six lamps one shape its rim ran between the middle two like a
# pair of glasses — so the four step aside: two each side of that lamp, clear of its rim (57 + 27 + 4 from its cord)
LAMP_MID = 1003
CLOCKS = [LAMP_MID - 88 - 73.67, LAMP_MID - 88, LAMP_MID + 88, LAMP_MID + 88 + 73.67]
for cx in CLOCKS:
    circle("jam", cx, 607, 24, sw=P)
    line("jam", cx, 607, cx, 594, sw=4)
    line("jam", cx, 607, cx + 7, 607, sw=4)

# ── the board: 773–1208 × 642–783; its left text (five lines, the last two shorter); two documents the same size (86 and 97
# wide in the PNG → both 90), lines and dots on one rhythm ─────────────────────────────────────────────────────────────────
Bd = "papan"
rect(Bd, 776.5, 645.5, 428, 134, rx=6)
for y, x2 in zip((668, 682, 695.5, 709, 723), (833, 833, 833, 824, 813)):
    line(Bd, 795, y, x2, y, sw=P)
doc_rows = [683.5 + k * 13.75 for k in range(5)]
rect(Bd, 975, 667, 84, 89, rx=4, sw=P)
for y in doc_rows:
    line(Bd, 994, y, 1040, y, sw=Dt)
rect(Bd, 1098, 667, 84, 89, rx=4, sw=P)
for cx in (1117, 1140, 1163):
    fcircle(Bd, cx, 691, 8)
for y in doc_rows[2:]:
    line(Bd, 1112, y, 1168, y, sw=Dt)

# ── the door: frame 1516–1638 × 618–836; its panels were 87 and 80 tall (637–724, 737–817) → both 83.5, 12 from the frame and
# 13 apart, split at 1577; the knob between them ───────────────────────────────────────────────────────────────────────
Dr = "pintu"
rect(Dr, 1519.5, 621.5, 115, 210, rx=4)
for y0 in (639.5, 736):
    rect(Dr, 1539.5, y0, 75, 78.5, rx=2, sw=Dt)
    line(Dr, 1577, y0 + 2, 1577, y0 + 76.5, sw=Dt, cap="butt")
fcircle(Dr, 1530, 727, 4.5)

# ── the lower desk and laptop, over the traced worker: top 380–611 × 747–771, legs 386–411 / 574–599 to the floor, laptop lid
# leaning (top edge 521–582 at 705, foot 506–576 at 750), its base 474–504 at 745–750, logo dot ───────────────────────────
LD = "meja-bawah"
for x in (389.5, 577.5):
    rect(LD, x, 768, 18.5, 82, rx=2, sw=P)  # down to 850, in front of the floor line, like the people's feet
rect(LD, 383.5, 750.5, 224, 18, rx=6)
path(LD, "M 524.5 708.5 L 581.5 708.5 L 573 747 L 509.5 747 Z", sw=O, fill="white")
fcircle(LD, 545.5, 728, 5)
line(LD, 476, 747.5, 512, 747.5, sw=P)


def main():
    people_src, out = sys.argv[1], sys.argv[2]
    people = {pg["id"]: pg for pg in json.load(open(people_src))["groups"]}
    transform = json.load(open(people_src))["transform"]
    traced = ["ilmuwan", "pekerja-meja", "wanita-tablet", "presenter", "tamu"]
    order = ["latar", "gedung", "ventilasi", "mesin", "konveyor", "lampu-atas-1", "lampu-atas-2", "lampu-atas-3", "meja-laptop",
             "lampu-bawah-1", "lampu-bawah-2", "lampu-bawah-3", "jam", "papan", "pintu", "ilmuwan", "pekerja-meja",
             "wanita-tablet", "presenter", "tamu"]
    labels = {"latar": "Isi putih gedung", "gedung": "Gedung (atap, dinding, lantai)", "ventilasi": "Ventilasi atap",
              "mesin": "Mesin dan pipa (atas)", "konveyor": "Konveyor", "meja-laptop": "Meja laptop (atas)", "jam": "Jam dinding",
              "papan": "Papan presentasi", "pintu": "Pintu", "ilmuwan": "Ilmuwan + kotak", "pekerja-meja": "Pekerja di meja",
              "wanita-tablet": "Wanita dengan tablet", "presenter": "Presenter", "tamu": "Tiga orang berjas"}
    for i in range(1, 4):
        labels[f"lampu-atas-{i}"] = f"Lampu atas {i}"
        labels[f"lampu-bawah-{i}"] = f"Lampu bawah {i}"
    out_groups = []
    for gid in order:
        entry = {"id": gid, "label": labels[gid], "shapes": groups.get(gid, []), "fill": [], "d": [], "over": []}
        if gid in traced:
            entry["fill"] = people[gid]["fill"]
            entry["d"] = people[gid]["d"]
        if gid == "pekerja-meja":
            entry["over"] = groups["meja-bawah"]
        out_groups.append(entry)
    doc = {"w": 1752, "h": 897, "ink": [290, 13, 1710, 879], "transform": transform, "groups": out_groups}
    json.dump(doc, open(out, "w"), ensure_ascii=False)
    print(f"→ {out}")
    if len(sys.argv) > 3:
        svg = to_svg(doc, overlay=sys.argv[4] if len(sys.argv) > 4 else None)
        open(sys.argv[3], "w").write(svg)
        print(f"→ {sys.argv[3]}")


def shape_svg(s, ink="#111"):
    col = lambda v: ink if v == "ink" else ("#fff" if v == "white" else v)
    if s["t"] == "rect":
        st = f' stroke="{ink}" stroke-width="{s["sw"]}"' if s["sw"] else ""
        return f'<rect x="{s["x"]}" y="{s["y"]}" width="{s["w"]}" height="{s["h"]}" rx="{s["rx"]}" fill="{col(s["fill"])}"{st}/>'
    if s["t"] == "line":
        return f'<line x1="{s["x1"]}" y1="{s["y1"]}" x2="{s["x2"]}" y2="{s["y2"]}" stroke="{col(s["color"])}" stroke-width="{s["sw"]}" stroke-linecap="{s["cap"]}"/>'
    if s["t"] == "circle":
        st = f' stroke="{ink}" stroke-width="{s["sw"]}"' if s["sw"] else ""
        return f'<circle cx="{s["cx"]}" cy="{s["cy"]}" r="{s["r"]}" fill="{col(s["fill"])}"{st}/>'
    if s["t"] == "ellipse":
        return f'<ellipse cx="{s["cx"]}" cy="{s["cy"]}" rx="{s["rx"]}" ry="{s["ry"]}" fill="{col(s["fill"])}" stroke="{ink}" stroke-width="{s["sw"]}"/>'
    if s["t"] == "path":
        st = f' stroke="{col(s["color"])}" stroke-width="{s["sw"]}" stroke-linecap="{s["cap"]}" stroke-linejoin="round"' if s["sw"] else ""
        return f'<path d="{s["d"]}" fill="{col(s["fill"]) if s["fill"] != "none" else "none"}"{st}/>'
    raise ValueError(s)


def to_svg(doc, overlay=None):
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{doc["w"]}" height="{doc["h"]}" viewBox="0 0 {doc["w"]} {doc["h"]}">',
             '<rect width="100%" height="100%" fill="#fff"/>']
    for gg in doc["groups"]:
        parts += [shape_svg(s) for s in gg["shapes"]]
        if gg["fill"]:
            parts.append(f'<g transform="{doc["transform"]}" fill="#fff">' + "".join(f'<path d="{d}"/>' for d in gg["fill"]) + "</g>")
        if gg["d"]:
            parts.append(f'<g transform="{doc["transform"]}" fill="#111">' + "".join(f'<path d="{d}"/>' for d in gg["d"]) + "</g>")
        parts += [shape_svg(s) for s in gg["over"]]
    if overlay:
        parts.append(f'<image href="{overlay}" x="0" y="0" width="{doc["w"]}" height="{doc["h"]}" opacity="0.35" style="mix-blend-mode:multiply"/>')
    parts.append("</svg>")
    return "\n".join(parts)


if __name__ == "__main__":
    main()
