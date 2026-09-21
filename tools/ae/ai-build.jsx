/**
 * ai-build.jsx — the same episode, as editable Illustrator artwork.
 *
 * It reads the SAME `ma-ae.json` After Effects is built from, so a shape here
 * and the shape on the timeline cannot disagree: both come out of the episode's
 * own maths. Illustrator gets the still form — one artboard per scene, drawn at
 * its finished state — plus a system artboard holding the palette, the type
 * scale and the six annotation elements.
 *
 * Canvas (0,0) is the top-left of each artboard. Illustrator measures y upward,
 * so every point is mapped once, in `P`, and nowhere else.
 */
#target illustrator

(function () {
  var LOG = [];

  function readJSON(path) {
    var f = new File(path);
    if (!f.exists) throw new Error("missing " + path);
    f.open("r"); var raw = f.read(); f.close();
    return eval("(" + raw + ")");
  }

  var J = readJSON("/Users/samuelsurja/adobe-scripts/ma/ma-ae.json");
  var W = J.w, H = J.h;
  var GAP = 160;

  function rgbOf(hex) {
    hex = String(hex).replace("#", "");
    var c = new RGBColor();
    c.red = parseInt(hex.substr(0, 2), 16);
    c.green = parseInt(hex.substr(2, 2), 16);
    c.blue = parseInt(hex.substr(4, 2), 16);
    return c;
  }

  var doc = app.documents.add(DocumentColorSpace.RGB, W, H);
  doc.rulerOrigin = [0, H];

  /**
   * Artboard n's origin, and the point mapper for it.
   *
   * Laid out in a GRID, not a row: Illustrator's canvas is 227 inches square,
   * and twelve 1920px artboards side by side is 346 inches — the add() call
   * fails outright rather than clamping.
   */
  var COLS = 4;
  function board(i, name) {
    var ox = (i % COLS) * (W + GAP);
    var oy = -Math.floor(i / COLS) * (H + GAP);
    if (i > 0) doc.artboards.add([ox, oy, ox + W, oy - H]);
    doc.artboards[i].name = name.substr(0, 60);
    doc.artboards[i].artboardRect = [ox, oy, ox + W, oy - H];
    return {
      ox: ox, oy: oy,
      P: function (x, y) { return [ox + x, oy - y]; },
      layer: doc.layers.add(),
    };
  }

  /** A shallow copy carrying the frame's opacity, so the source stays clean. */
  function cloneWith(o, live) {
    var c = {};
    for (var k in o) if (o.hasOwnProperty(k)) c[k] = o[k];
    c.opacity = (o.opacity === undefined ? 1 : o.opacity) * (live / (o.opacity === undefined ? 1 : o.opacity)) * (o.opacity === undefined ? 1 : 1);
    c.opacity = live;
    return c;
  }

  function style(item, o) {
    /* the two opacities MULTIPLY: a 10% channel fill inside a layer that is
       itself at 50% is 5% on the page, exactly as it is on the timeline */
    var alpha = (o.opacity === undefined ? 1 : o.opacity) * (o.fillOpacity === undefined ? 1 : o.fillOpacity);
    if (o.fill) {
      item.filled = true;
      item.fillColor = rgbOf(o.fill);
    } else item.filled = false;
    if (o.stroke) {
      item.stroked = true;
      item.strokeColor = rgbOf(o.stroke);
      item.strokeWidth = o.sw || 1;
      if (o.dash) item.strokeDashes = o.dash;
      item.strokeCap = o.cap === "round" ? StrokeCap.ROUNDENDCAP : StrokeCap.BUTTENDCAP;
      item.strokeJoin = StrokeJoin.ROUNDENDJOIN;
    } else item.stroked = false;
    item.opacity = Math.max(0, Math.min(1, alpha)) * 100;
  }


  /* ── what is on screen at one frame ───────────────────────────────────── */

  /** A layer's opacity track, read at `f`. Linear between keys is enough for a still. */
  function opAt(o, f) {
    if (o.op && o.op.length) {
      var k = o.op;
      if (f <= k[0][0]) return k[0][1] / 100;
      for (var i = 1; i < k.length; i++) {
        if (f <= k[i][0]) {
          var span = k[i][0] - k[i - 1][0];
          var t = span <= 0 ? 1 : (f - k[i - 1][0]) / span;
          return (k[i - 1][1] + (k[i][1] - k[i - 1][1]) * t) / 100;
        }
      }
      return k[k.length - 1][1] / 100;
    }
    return o.opacity === undefined ? 1 : o.opacity;
  }

  /**
   * Illustrator gets STILLS, so a layer is drawn only if it is actually on
   * screen at the artboard's frame — otherwise every label the scene ever
   * shows stacks on top of every other one, and the two titles of a continuity
   * group print over each other.
   */
  function liveAt(o, f) {
    if (o.at !== undefined && f < o.at) return 0;
    if (o.gone !== undefined && f >= o.gone) return 0;
    if (o.trim && f < o.trim[0]) return 0;
    if (o.growX && f < o.growX[0]) return 0;
    if (o.grow && f < o.grow[0]) return 0;
    return opAt(o, f);
  }

  /** The finished shape of an unfolding band at this frame. */
  function ptsAt(o, f) {
    if (!o.pathKeys || !o.pathKeys.length) return o.pts;
    var best = o.pathKeys[0];
    for (var i = 0; i < o.pathKeys.length; i++) if (f >= o.pathKeys[i][0]) best = o.pathKeys[i];
    return best[1];
  }

  /* ── the vocabulary, drawn ────────────────────────────────────────────── */
  function drawOne(b, o, f) {
    var g = b.layer, it, p;
    if (f !== undefined) {
      var live = liveAt(o, f);
      if (live <= 0.02) return;
      o = cloneWith(o, live);
      if (o.k === "poly") o.pts = ptsAt(o, f);
    }
    if (o.k === "card" || o.k === "rect") {
      p = b.P(o.x, o.y);
      it = o.r ? g.pathItems.roundedRectangle(p[1], p[0], o.w, o.h, o.r, o.r)
               : g.pathItems.rectangle(p[1], p[0], o.w, o.h);
      style(it, o);
    } else if (o.k === "line") {
      it = g.pathItems.add();
      it.setEntirePath([b.P(o.x1, o.y1), b.P(o.x2, o.y2)]);
      style(it, o);
    } else if (o.k === "poly") {
      if (!o.pts || o.pts.length < 2) return;
      it = g.pathItems.add();
      var pts = [];
      for (var i = 0; i < o.pts.length; i++) pts.push(b.P(o.pts[i][0], o.pts[i][1]));
      it.setEntirePath(pts);
      it.closed = !!o.closed;
      style(it, o);
    } else if (o.k === "circle") {
      p = b.P(o.cx - o.r, o.cy - o.r);
      it = g.pathItems.ellipse(p[1], p[0], o.r * 2, o.r * 2);
      style(it, o);
    } else if (o.k === "candles") {
      drawCandles(b, o);
    } else if (o.k === "text") {
      drawText(b, o);
    }
  }

  /** Wicks in one group, bodies split by direction — the only red and green. */
  function drawCandles(b, o) {
    var g = b.layer, i, q, p, it;
    for (i = 0; i < o.bars.length; i++) {
      q = o.bars[i];
      it = g.pathItems.add();
      it.setEntirePath([b.P(q.x, q.hi), b.P(q.x, q.lo)]);
      style(it, { stroke: o.wickColor, sw: o.wick });
    }
    for (i = 0; i < o.bars.length; i++) {
      q = o.bars[i];
      p = b.P(q.x - o.w / 2, q.top);
      it = g.pathItems.rectangle(p[1], p[0], o.w, Math.max(1, q.bh));
      style(it, { fill: q.up ? o.up : o.down });
    }
  }

  var FACE = { 800: "PlusJakartaSans-ExtraBold", 700: "PlusJakartaSans-Bold", 600: "PlusJakartaSans-SemiBold", 500: "PlusJakartaSans-Medium", 400: "PlusJakartaSans-Regular" };
  function drawText(b, o) {
    var t = b.layer.textFrames.add();
    t.contents = o.s;
    var r = t.textRange;
    try { r.characterAttributes.textFont = app.textFonts.getByName(FACE[o.weight] || FACE[500]); } catch (e) { LOG.push("font?" + o.weight); }
    r.characterAttributes.size = o.size;
    r.characterAttributes.fillColor = rgbOf(o.color);
    r.paragraphAttributes.justification =
      o.align === "right" ? Justification.RIGHT : o.align === "center" ? Justification.CENTER : Justification.LEFT;
    /* measured and then placed, the same way the AE build does it */
    var wdt = t.width, hgt = t.height;
    var x = o.x - (o.align === "center" ? wdt / 2 : o.align === "right" ? wdt : 0);
    var y = o.y - (o.baseline === "middle" ? hgt / 2 : o.baseline === "bottom" ? hgt : 0);
    var p = b.P(x, y);
    t.position = [p[0], p[1]];
    if (o.opacity !== undefined) t.opacity = o.opacity * 100;
  }

  /* ── the system sheet ─────────────────────────────────────────────────── */
  function systemBoard() {
    var b = board(0, "00 system");
    b.layer.name = "system";
    drawOne(b, { k: "rect", x: 0, y: 0, w: W, h: H, fill: J.bg });
    drawText(b, { s: "Moving Average & Bollinger Bands", x: 96, y: 92, size: 48, weight: 700, color: "#5F4DEE", align: "left", baseline: "middle" });
    drawText(b, { s: "One chart. One idea. One label.", x: 96, y: 150, size: 36, weight: 500, color: "#6B7076", align: "left", baseline: "middle" });

    var sw = [
      ["indigo", "#5F4DEE"], ["cyan", "#5CC8E3"], ["indigo70", "#9A8EF5"], ["indigo12", "#EDEAFE"],
      ["candleGreen", "#22B573"], ["candleRed", "#E5475D"], ["priceLine", "#3A3A3A"], ["gridline", "#DDE0E5"],
      ["textMuted", "#6B7076"], ["surface", "#FFFFFF"], ["bg", "#F5F5F5"], ["ink", "#000000"]
    ];
    for (var i = 0; i < sw.length; i++) {
      var x = 96 + (i % 6) * 280, y = 230 + Math.floor(i / 6) * 180;
      drawOne(b, { k: "rect", x: x, y: y, w: 240, h: 96, r: 16, fill: sw[i][1], stroke: "#D8DBE0", sw: 1 });
      drawText(b, { s: sw[i][0], x: x, y: y + 126, size: 30, weight: 600, color: "#000000", align: "left", baseline: "middle" });
      drawText(b, { s: sw[i][1], x: x, y: y + 164, size: 30, weight: 500, color: "#6B7076", align: "left", baseline: "middle" });
    }

    /* the four sizes, and only four */
    var scale = [[96, 800, "96 — judul"], [48, 700, "48 — sub-judul"], [36, 500, "36 — kalimat"], [30, 600, "30 — label chart"]];
    var yy = 640;
    for (var k = 0; k < scale.length; k++) {
      drawText(b, { s: scale[k][2], x: 96, y: yy, size: scale[k][0], weight: scale[k][1], color: "#000000", align: "left", baseline: "middle" });
      yy += scale[k][0] + 34;
    }

    /* the six annotation elements */
    var ax = 1100;
    drawText(b, { s: "Annotation vocabulary", x: ax, y: 620, size: 36, weight: 600, color: "#6B7076", align: "left", baseline: "middle" });
    drawOne(b, { k: "rect", x: ax, y: 660, w: 300, h: 120, r: 12, fill: "#5F4DEE", fillOpacity: 0.12 });
    drawText(b, { s: "HighlightBox", x: ax + 320, y: 720, size: 30, weight: 600, color: "#5F4DEE", align: "left", baseline: "middle" });
    drawOne(b, { k: "circle", cx: ax + 60, cy: 850, r: 34, stroke: "#5CC8E3", sw: 2 });
    drawText(b, { s: "Ping", x: ax + 120, y: 850, size: 30, weight: 600, color: "#5CC8E3", align: "left", baseline: "middle" });
    drawOne(b, { k: "line", x1: ax + 260, y1: 850, x2: ax + 440, y2: 790, stroke: "#5F4DEE", sw: 3, cap: "round" });
    drawText(b, { s: "Arrow", x: ax + 470, y: 810, size: 30, weight: 600, color: "#5F4DEE", align: "left", baseline: "middle" });
    return b;
  }

  /* ── run ──────────────────────────────────────────────────────────────── */
  systemBoard();
  var made = 0, n = 1;
  for (var i = 0; i < J.scenes.length; i++) {
    var s = J.scenes[i];
    var frames = s.stills && s.stills.length ? s.stills : [Math.round(s.dur * 0.7)];
    for (var v = 0; v < frames.length; v++) {
      var f = frames[v];
      var b = board(n, n + " " + s.name + " f" + f);
      b.layer.name = s.name + " f" + f;
      drawOne(b, { k: "rect", x: 0, y: 0, w: W, h: H, fill: J.bg });
      for (var k = 0; k < s.layers.length; k++) drawOne(b, s.layers[k], f);
      n++; made++;
    }
  }

  var out = new File("/Users/samuelsurja/adobe-scripts/ma/MovingAverage-visuals.ai");
  doc.saveAs(out);
  "artboards:" + (made + 1) + " saved:" + out.fsName + " " + LOG.join(",");
})();
