/**
 * build.jsx — builds the Moving Average episode in After Effects from the JSON
 * the Node exporter writes.
 *
 * It is an INTERPRETER, not a scene. Every coordinate, colour and frame number
 * comes from `ma-ae.json`, which is generated from the same maths the Remotion
 * episode runs, so the two builds cannot drift apart. Re-running it rebuilds
 * only the comps named in the JSON and leaves everything else in the project
 * alone.
 *
 * Content coordinates are CANVAS coordinates: every layer is pinned to
 * position [0,0] with a [0,0] anchor, so an x in the JSON is an x on screen.
 */
#target aftereffects

var MA = (function () {
  var J = null, FPS = 30, LOG = [];
  function log(s) { LOG.push(s); }

  /* ── colour ─────────────────────────────────────────────────────────── */
  function rgb(hex) {
    if (!hex) return [0, 0, 0];
    hex = hex.replace("#", "");
    return [parseInt(hex.substr(0,2),16)/255, parseInt(hex.substr(2,2),16)/255, parseInt(hex.substr(4,2),16)/255];
  }
  function T(f) { return f / FPS; }

  /* ── project scaffolding ────────────────────────────────────────────── */
  function folder(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
      var it = app.project.item(i);
      if (it instanceof FolderItem && it.name === name) return it;
    }
    return app.project.items.addFolder(name);
  }
  function findComp(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
      var it = app.project.item(i);
      if (it instanceof CompItem && it.name === name) return it;
    }
    return null;
  }
  function comp(name, frames, parent) {
    var old = findComp(name);
    if (old) old.remove();
    var c = app.project.items.addComp(name, J.w, J.h, 1, Math.max(1, frames) / FPS, FPS);
    if (parent) c.parentFolder = parent;
    return c;
  }

  /* ── shape plumbing ─────────────────────────────────────────────────── */
  function shapeLayer(c, name) {
    var l = c.layers.addShape();
    l.name = name;
    l.property("Transform").property("Anchor Point").setValue([0, 0]);
    l.property("Transform").property("Position").setValue([0, 0]);
    return l;
  }
  /**
   * Renaming a vector group invalidates the reference AE just handed back, and
   * every addProperty after it throws "Object is invalid". The name is
   * cosmetic — the layer carries the meaning — so it is simply not set.
   */
  function group(l) {
    var g = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    return g.property("ADBE Vectors Group");
  }
  function stroke(gc, color, width, cap, dash, widthKeys) {
    var s = gc.addProperty("ADBE Vector Graphic - Stroke");
    s.property("ADBE Vector Stroke Color").setValue(rgb(color));
    if (widthKeys) key(s.property("ADBE Vector Stroke Width"), widthKeys);
    else s.property("ADBE Vector Stroke Width").setValue(width);
    s.property("ADBE Vector Stroke Line Cap").setValue(cap === "round" ? 2 : 1);
    s.property("ADBE Vector Stroke Line Join").setValue(2);
    if (dash) {
      var d = s.property("ADBE Vector Stroke Dashes");
      d.addProperty("ADBE Vector Stroke Dash 1").setValue(dash[0]);
      d.addProperty("ADBE Vector Stroke Gap 1").setValue(dash[1]);
    }
    return s;
  }
  function fill(gc, color, opacity) {
    var fl = gc.addProperty("ADBE Vector Graphic - Fill");
    fl.property("ADBE Vector Fill Color").setValue(rgb(color));
    if (opacity !== undefined) fl.property("ADBE Vector Fill Opacity").setValue(opacity * 100);
    return fl;
  }
  /** A path through canvas-space points. */
  function pathOf(gc, pts, closed) {
    var p = gc.addProperty("ADBE Vector Shape - Group");
    var sh = new Shape();
    sh.vertices = pts;
    sh.closed = !!closed;
    p.property("ADBE Vector Shape").setValue(sh);
    return p;
  }
  function rectIn(gc, x, y, w, h, round) {
    var r = gc.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue([w, h]);
    r.property("ADBE Vector Rect Position").setValue([x + w / 2, y + h / 2]);
    r.property("ADBE Vector Rect Roundness").setValue(round || 0);
    return r;
  }
  function ellipseIn(gc, cx, cy, r) {
    var e = gc.addProperty("ADBE Vector Shape - Ellipse");
    e.property("ADBE Vector Ellipse Size").setValue([r * 2, r * 2]);
    e.property("ADBE Vector Ellipse Position").setValue([cx, cy]);
    return e;
  }

  /* ── keyframes ──────────────────────────────────────────────────────── */
  function key(prop, keys) {
    if (!keys || !keys.length) return;
    for (var i = 0; i < keys.length; i++) prop.setValueAtTime(T(keys[i][0]), keys[i][1]);
    try {
      var dim = (prop.value instanceof Array) ? prop.value.length : 1;
      for (var n = 1; n <= prop.numKeys; n++) {
        var ein = [], eout = [];
        for (var d = 0; d < dim; d++) { ein.push(new KeyframeEase(0, 55)); eout.push(new KeyframeEase(0, 55)); }
        prop.setTemporalEaseAtKey(n, ein, eout);
      }
    } catch (e) {}
  }
  /** Every layer carries its own opacity track and its own in/out. */
  function timing(l, o) {
    if (o.at !== undefined) l.inPoint = T(o.at);
    if (o.gone !== undefined) l.outPoint = T(o.gone);
    var op = l.property("Transform").property("Opacity");
    if (o.op) key(op, o.op);
    else if (o.opacity !== undefined) op.setValue(o.opacity * 100);
  }

  /* ── text ───────────────────────────────────────────────────────────── */
  var FACE = { 800: "PlusJakartaSans-ExtraBold", 700: "PlusJakartaSans-Bold", 600: "PlusJakartaSans-SemiBold", 500: "PlusJakartaSans-Medium", 400: "PlusJakartaSans-Regular" };
  function textLayer(c, o) {
    var l = c.layers.addText(o.s);
    l.name = "txt " + o.s.substr(0, 28);
    var src = l.property("ADBE Text Properties").property("ADBE Text Document");
    var td = src.value;
    td.resetCharStyle();
    td.font = FACE[o.weight] || FACE[500];
    td.fontSize = o.size;
    td.fillColor = rgb(o.color);
    td.applyFill = true;
    td.applyStroke = false;
    td.justification = o.align === "right" ? ParagraphJustification.RIGHT_JUSTIFY
                     : o.align === "center" ? ParagraphJustification.CENTER_JUSTIFY
                     : ParagraphJustification.LEFT_JUSTIFY;
    src.setValue(td);
    /* measured, not guessed — AE anchors text on its baseline */
    var r = l.sourceRectAtTime(0, false);
    var dx = o.align === "right" ? -(r.left + r.width) : o.align === "center" ? -(r.left + r.width / 2) : -r.left;
    var dy = o.baseline === "middle" ? -(r.top + r.height / 2) : o.baseline === "bottom" ? -(r.top + r.height) : -r.top;
    l.property("Transform").property("Anchor Point").setValue([0, 0]);
    l.property("Transform").property("Position").setValue([o.x + dx, o.y + dy]);
    if (o.rise) {
      var pos = l.property("Transform").property("Position");
      key(pos, [[o.rise[0], [o.x + dx, o.y + dy + o.rise[2]]], [o.rise[1], [o.x + dx, o.y + dy]]]);
    }
    return l;
  }

  /* ── the drawing vocabulary ─────────────────────────────────────────── */
  function draw(c, o) {
    var l, gc;
    if (o.k === "text") {
      l = textLayer(c, o);
      timing(l, o);
      /* a Strike cancels a label the chart has disproved by sweeping a rule
         through it — the claim stays visible, which is the whole point. The
         rule is sized from AE's own measurement of the words, not guessed. */
      if (o.strike) {
        var r = l.sourceRectAtTime(0, false);
        var pos = l.property("Transform").property("Position").valueAtTime(0, false);
        var sx = pos[0] + r.left, sy = pos[1] + r.top + r.height * 0.52;
        var sl = shapeLayer(c, "strike");
        var sgc = group(sl);
        var srect = rectIn(sgc, sx, sy, r.width, 2, 0);
        key(srect.property("ADBE Vector Rect Size"), [[o.strike[0], [0, 2]], [o.strike[0] + o.strike[1], [r.width, 2]]]);
        key(srect.property("ADBE Vector Rect Position"), [[o.strike[0], [sx, sy + 1]], [o.strike[0] + o.strike[1], [sx + r.width / 2, sy + 1]]]);
        fill(sgc, o.color);
        sl.inPoint = T(o.strike[0]);
        if (o.gone !== undefined) sl.outPoint = T(o.gone);
      }
      return l;
    }

    l = shapeLayer(c, o.name || o.k);
    gc = group(l);

    if (o.k === "card" || o.k === "rect") {
      var rc = rectIn(gc, o.x, o.y, o.w, o.h, o.r || 0);
      /* keyed BEFORE anything else joins the group: adding a sibling
         invalidates the reference AE just returned for this rect */
      if (o.growX) {
        key(rc.property("ADBE Vector Rect Size"), [[o.growX[0], [0, o.h]], [o.growX[0] + o.growX[1], [o.w, o.h]]]);
        key(rc.property("ADBE Vector Rect Position"), [[o.growX[0], [o.x, o.y + o.h / 2]], [o.growX[0] + o.growX[1], [o.x + o.w / 2, o.y + o.h / 2]]]);
      }
      if (o.fill) fill(gc, o.fill, o.fillOpacity);
      if (o.stroke) stroke(gc, o.stroke, o.sw || 1);
    } else if (o.k === "line") {
      pathOf(gc, [[o.x1, o.y1], [o.x2, o.y2]], false);
      stroke(gc, o.stroke, o.sw, o.cap, o.dash);
    } else if (o.k === "poly") {
      var pg = pathOf(gc, o.pts, !!o.closed);
      /* an unfolding band changes SHAPE, not opacity: the two outer paths
         start lying exactly on the middle one and separate outward */
      if (o.pathKeys) {
        var sp = pg.property("ADBE Vector Shape");
        for (var pk = 0; pk < o.pathKeys.length; pk++) {
          var sh2 = new Shape();
          sh2.vertices = o.pathKeys[pk][1];
          sh2.closed = !!o.closed;
          sp.setValueAtTime(T(o.pathKeys[pk][0]), sh2);
        }
      }
      if (o.fill) fill(gc, o.fill, o.fillOpacity);
      if (o.stroke) stroke(gc, o.stroke, o.sw, o.cap || "round", o.dash, o.swKeys);
      /* the trim goes on LAST — it is the last thing in the group, and its own
         reference is used immediately */
      if (o.trim) {
        var tr = gc.addProperty("ADBE Vector Filter - Trim");
        key(tr.property("ADBE Vector Trim End"), [[o.trim[0], 0], [o.trim[0] + o.trim[1], 100]]);
      }
    } else if (o.k === "circle") {
      var el = ellipseIn(gc, o.cx, o.cy, o.r);
      if (o.grow) key(el.property("ADBE Vector Ellipse Size"),
        [[o.grow[0], [o.grow[2] * 2, o.grow[2] * 2]], [o.grow[1], [o.grow[3] * 2, o.grow[3] * 2]]]);
      if (o.fill) fill(gc, o.fill, o.fillOpacity);
      if (o.stroke) stroke(gc, o.stroke, o.sw || 2);
    } else if (o.k === "candles") {
      buildCandles(l, gc, o);
    }
    timing(l, o);
    return l;
  }

  /**
   * All of a chart's candles on ONE layer, revealed by a widening mask.
   *
   * The three groups are built one at a time and finished before the next is
   * added: adding a sibling group invalidates the reference AE handed back for
   * the previous one, and the next addProperty on it throws "Object is
   * invalid". Nothing is held across a group boundary here for that reason.
   */
  function buildCandles(l, gc, o) {
    var i, b;
    for (i = 0; i < o.bars.length; i++) {
      b = o.bars[i];
      pathOf(gc, [[b.x, b.hi], [b.x, b.lo]], false);
    }
    stroke(gc, o.wickColor, o.wick);

    var sides = [{ up: true, color: o.up }, { up: false, color: o.down }];
    for (var n = 0; n < sides.length; n++) {
      var any = false;
      var g = group(l);
      for (i = 0; i < o.bars.length; i++) {
        b = o.bars[i];
        if (b.up !== sides[n].up) continue;
        rectIn(g, b.x - o.w / 2, b.top, o.w, b.bh, 0);
        any = true;
      }
      if (any) fill(g, sides[n].color);
    }

    if (o.reveal) {
      var m = l.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
      var narrow = new Shape();
      narrow.vertices = [[o.x0, o.yTop], [o.x0 + 1, o.yTop], [o.x0 + 1, o.yBot], [o.x0, o.yBot]];
      narrow.closed = true;
      var wide = new Shape();
      wide.vertices = [[o.x0, o.yTop], [o.x1, o.yTop], [o.x1, o.yBot], [o.x0, o.yBot]];
      wide.closed = true;
      var ms = m.property("ADBE Mask Shape");
      ms.setValueAtTime(T(o.reveal[0]), narrow);
      ms.setValueAtTime(T(o.reveal[0] + o.reveal[1]), wide);
    }
  }


  /* ── import, once per path ──────────────────────────────────────────────── */
  function importFile(path) {
    var f = new File(path);
    if (!f.exists) return null;
    for (var i = 1; i <= app.project.numItems; i++) {
      var it = app.project.item(i);
      if (it instanceof FootageItem && it.mainSource && it.mainSource.file && it.mainSource.file.fsName === f.fsName) return it;
    }
    return app.project.importFile(new ImportOptions(f));
  }

  /**
   * THE CAMERA CUT, applied where it belongs — on the scene's instance.
   *
   * One ease-in-out curve spans the boundary and the content swaps at its
   * midpoint, where the blur peaks. The outgoing scene travels 0 → −distance
   * and the incoming one +distance → 0, so both are moving the same way and
   * the join reads as one camera move rather than as two scenes.
   */
  function applyCut(inst, s) {
    var mid = J.w / 2, midY = J.h / 2;
    var pos = inst.property("Transform").property("Position");
    var scl = inst.property("Transform").property("Scale");
    var posKeys = [], sclKeys = [], blurKeys = [];

    if (s.cutIn) {
      var ci = s.cutIn, half = ci.over / 2;
      var d = ci.distance || 0;
      if (d) posKeys.push([ci.at, ci.axis === "x" ? [mid + d, midY] : [mid, midY + d]],
                          [ci.at + half, [mid, midY]]);
      if (ci.scale) sclKeys.push([ci.at, [(1 - ci.scale) * 100, (1 - ci.scale) * 100]],
                                 [ci.at + half, [100, 100]]);
      if (ci.blur) blurKeys.push([ci.at, ci.blur], [ci.at + half, 0]);
    }
    if (s.cutOut) {
      var co = s.cutOut, halfO = co.over / 2;
      var dO = co.distance || 0;
      if (dO) posKeys.push([co.at - halfO, [mid, midY]],
                           [co.at, co.axis === "x" ? [mid - dO, midY] : [mid, midY - dO]]);
      if (co.scale) sclKeys.push([co.at - halfO, [100, 100]],
                                 [co.at, [(1 + co.scale) * 100, (1 + co.scale) * 100]]);
      if (co.blur) blurKeys.push([co.at - halfO, 0], [co.at, co.blur]);
    }
    if (posKeys.length) key(pos, posKeys);
    if (sclKeys.length) key(scl, sclKeys);
    if (blurKeys.length) {
      var fx = null;
      try { fx = inst.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2"); } catch (e) {}
      if (fx) {
        try { fx.property("ADBE Gaussian Blur 2-0001").setValue(0); } catch (e2) {}
        key(fx.property(1), blurKeys);
        try { fx.property("ADBE Gaussian Blur 2-0003").setValue(true); } catch (e3) {} /* repeat edge pixels */
      }
    }
  }

  /* ── the build ──────────────────────────────────────────────────────── */
  function run(jsonPath) {
    var f = new File(jsonPath);
    if (!f.exists) return "MISSING " + jsonPath;
    f.open("r"); var raw = f.read(); f.close();
    J = eval("(" + raw + ")");
    FPS = J.fps;

    app.beginUndoGroup("Build Moving Average");
    var root = folder(J.project);
    var scenesFolder = folder("scenes");
    scenesFolder.parentFolder = root;

    var main = comp(J.name, J.total, root);
    var bg = main.layers.addSolid(rgb(J.bg), "bg", J.w, J.h, 1);
    bg.moveToEnd();

    var built = 0, layers = 0;
    for (var i = 0; i < J.scenes.length; i++) {
      var s = J.scenes[i];
      var sc = comp(s.name, s.dur, scenesFolder);
      var sbg = sc.layers.addSolid(rgb(J.bg), "bg", J.w, J.h, 1);
      sbg.moveToEnd();
      for (var k = 0; k < s.layers.length; k++) { draw(sc, s.layers[k]); layers++; }
      var inst = main.layers.add(sc);
      inst.startTime = T(s.from);
      inst.name = s.name;
      applyCut(inst, s);
      built++;
    }

    /* the burned-in subtitles, in the reserved bottom band */
    if (J.captions) {
      var cues = J.captions.cues;
      for (var q = cues.length - 1; q >= 0; q--) {
        var cue = cues[q];
        var tl = textLayer(main, {
          s: cue.text, x: J.w / 2, y: J.captions.y,
          size: J.captions.size, weight: J.captions.weight, color: J.captions.color,
          align: "center", baseline: "middle"
        });
        tl.inPoint = T(cue.start);
        tl.outPoint = T(cue.end);
        tl.name = "cue " + cue.start;
      }
      log("cues:" + cues.length);
    }

    /* the mark, above everything, arriving with the first picture */
    if (J.watermark) {
      var wf = importFile(J.watermark.file);
      if (wf) {
        var wl = main.layers.add(wf);
        wl.name = "watermark";
        wl.moveToBeginning();
        key(wl.property("Transform").property("Opacity"), [
          [0, 0], [J.watermark.fade, 100],
          [J.total - J.watermark.fade, 100], [J.total, 0]
        ]);
        log("watermark:ok");
      } else log("watermark:MISSING");
    }

    /* ONE voice, mounted once at the root */
    if (J.audio) {
      var af = importFile(J.audio);
      if (af) { var al = main.layers.add(af); al.name = "VO"; al.startTime = 0; log("vo:ok"); }
      else log("vo:MISSING");
    }

    app.endUndoGroup();
    return "built comps:" + built + " layers:" + layers + " total:" + J.total + "f " + LOG.join(" ");
  }

  return { run: run };
})();

MA.run("/Users/samuelsurja/adobe-scripts/ma/ma-ae.json");
