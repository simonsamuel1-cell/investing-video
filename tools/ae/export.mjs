/**
 * export.mjs — turns the episode into the JSON the Adobe builders interpret.
 *
 * Each scene below MIRRORS its .tsx one-for-one: same constants, same frames,
 * same grid, same series. The React file stays the authority; this file is the
 * translation of it into flat primitives, because After Effects has no notion
 * of a component that re-renders per frame.
 *
 * Frames are LOCAL to the scene, exactly as they are inside a Remotion
 * <Sequence>. The camera cut between scenes is carried on the scene's instance
 * in the main comp, where it belongs — it moves the whole scene, not a layer.
 */
import fs from "node:fs";
import {
  W, H, FPS, sec, CHART, STAGE, C, T, S, M, CAPTION_BAND, LOGO_ZONE,
  SERIES, SERIES_REVERSAL, SERIES_UP, SERIES_DOWN, SERIES_FLAT, SERIES_UPTREND,
  BARS_UP, BARS_DOWN, BARS_FLAT, BARS_UPTREND, SERIES_CROSS, BARS_CROSS, domainOf,
  SERIES_BREATH, BARS_BREATH, toBars, sma, ema, bollinger, gridOf, ptsOf, clearAbove, clearBelow,
  card, line, poly, circle, rect, text, candles, axis, priceFmt,
} from "./lib.mjs";

const OUT = "/Users/samuelsurja/adobe-scripts/ma/ma-ae.json";

/* ── the two text entrances, as key tracks ───────────────────────────────── */
const REVEAL = 12;
/** textReveal: fade up and rise 18px into place. The only entrance for words. */
const reveal = (at, opacity = 1) => ({
  at,
  op: [[at, 0], [at + REVEAL, opacity * 100]],
  rise: [at, at + REVEAL, 18],
});
const fadeTrack = (at, over, from, to) => [[at, from * 100], [at + over, to * 100]];

/** LabelChip, translated: anchor decides which side of (x,y) the words hang. */
const chip = (s, x, y, at, o = {}) => {
  const gap = o.gap ?? 22;
  const anchor = o.anchor ?? "above";
  const size = o.size ?? T.tag.size;
  const dx = anchor === "left" ? -gap : anchor === "right" ? gap : 0;
  const dy = anchor === "above" ? -gap : anchor === "below" ? gap : 0;
  const align = anchor === "left" ? "right" : anchor === "right" ? "left" : "center";
  const baseline = anchor === "above" ? "bottom" : anchor === "below" ? "top" : "middle";
  /* the same refusal the component makes: no label under the logo */
  const yy = x + dx > LOGO_ZONE.maxX && y + dy < LOGO_ZONE.height + size ? LOGO_ZONE.height + size : y + dy;
  const r = reveal(at);
  return {
    k: "text", s, x: x + dx, y: yy, size,
    weight: o.weight ?? T.tag.weight, color: o.tone ?? C.indigo,
    align, baseline, ...r,
    ...(o.op ? { op: o.op } : {}),
    ...(o.gone !== undefined ? { gone: o.gone } : {}),
  };
};

const title = (s, at = 0) => ({
  k: "text", s, x: STAGE.titleChip.x, y: STAGE.titleChip.y,
  size: T.title.size, weight: T.title.weight, color: C.indigo,
  align: "left", baseline: "middle", ...reveal(at),
});

/** A chart's surface + gridlines + candles, as the three layers they become. */
const chartLayers = (g, bars, box, drawFrom, drawDur, o = {}) => {
  const out = [];
  if (o.surface !== false) out.push(card(box));
  axis(g, o.ticks, box, o.tickLabels !== false).forEach((l) => out.push(l));
  out.push({
    ...candles(bars, g),
    name: "candles",
    at: drawFrom,
    reveal: [drawFrom, drawDur],
    x0: box.x, x1: box.x + box.w, yTop: box.y - 40, yBot: box.y + box.h + 40,
  });
  return out;
};


/* ── the rest of the annotation vocabulary ───────────────────────────────── */

/** HighlightBox — indigo at 12%, opening from its left edge. */
const box = (x1, x2, y1, y2, at, o = {}) => ({
  k: "rect", x: x1, y: y1, w: x2 - x1, h: y2 - y1, r: 12,
  fill: C.indigo, fillOpacity: 0.12, at, growX: [at, o.over ?? 16],
  ...(o.gone !== undefined ? { gone: o.gone } : {}),
});

/** Ping — a cyan ring at a touch point, 20 frames and gone. */
const ping = (x, y, at, r = 30) => ({
  k: "circle", cx: x, cy: y, r, stroke: C.cyan, sw: S.band,
  at, gone: at + M.pingF,
  grow: [at, at + M.pingF, r * 0.4, r * 1.3],
  op: [[at, 100], [at + M.pingF, 0]],
});

/**
 * Arrow — slope or direction only, and the episode's ONLY slope indicator.
 * The shaft draws, then the head fades up at its tip.
 */
const arrow = (from, to, at, o = {}) => {
  const over = o.over ?? 18;
  const tone = o.tone ?? C.indigo;
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const ux = (to.x - from.x) / len, uy = (to.y - from.y) / len;
  const head = 20;
  const shaft = { x: to.x - ux * head * 0.85, y: to.y - uy * head * 0.85 };
  const back = { x: -ux * head, y: -uy * head };
  const side = { x: -uy * 11, y: ux * 11 };
  const headAt = at + Math.round(over * 0.7);
  return [
    { k: "poly", pts: [[from.x, from.y], [shaft.x, shaft.y]], stroke: tone, sw: o.width ?? S.ma, cap: "round", at, trim: [at, over],
      ...(o.gone !== undefined ? { gone: o.gone } : {}) },
    { k: "poly", closed: true, fill: tone,
      pts: [[to.x, to.y], [to.x + back.x + side.x, to.y + back.y + side.y], [to.x + back.x - side.x, to.y + back.y - side.y]],
      at: headAt, op: [[headAt, 0], [headAt + 8, 100]],
      ...(o.gone !== undefined ? { gone: o.gone } : {}) },
  ];
};

/** A conclusion under the chart — one step down from the display size. */
const caption = (s, at, o = {}) => ({
  k: "text", s, x: W / 2, y: STAGE.captionY,
  size: o.size ?? T.title.size, weight: o.weight ?? T.title.weight,
  color: o.color ?? C.ink, align: "center", baseline: "middle", ...reveal(at),
});

/** A cross-fade track: in over `over`, and out again when the next state opens. */
const phase = (at, over, val, until) => {
  const k = [[at, 0], [at + over, val * 100]];
  if (until !== undefined) k.push([until, val * 100], [until + over, 0]);
  return k;
};


/**
 * BollingerBands — middle band, two outer bands, and the channel between.
 *
 * The outer bands UNFOLD out of the middle one: at `unfold` 0 they lie exactly
 * on the average and separate to their true distance. That is the definition
 * the scene teaches — a band is a distance from the mean, not a line that
 * happens to sit beside it — so it is animated as a change of SHAPE.
 */
const bands = (BB, g, o = {}) => {
  const at = o.at ?? 0;
  const fadeOver = o.fadeOver ?? 14;
  const midTone = o.midTone ?? C.indigo;
  const lerp = (band, k) => band.map((b, i) => {
    const m = BB.mid[i];
    return m === null || b === null ? null : m + (b - m) * k;
  });
  const up1 = ptsOf(BB.upper, g), dn1 = ptsOf(BB.lower, g);
  const up0 = ptsOf(lerp(BB.upper, 0), g), dn0 = ptsOf(lerp(BB.lower, 0), g);
  const chan = (u, d) => u.concat(d.slice().reverse());
  const op = o.op ?? [[at, 0], [at + fadeOver, 100]];
  const unfold = o.unfold; /* [at, over] — omitted means already unfolded */
  const keyed = (a, b) => (unfold ? { pathKeys: [[unfold[0], a], [unfold[0] + unfold[1], b]] } : {});
  const common = { at, op, ...(o.gone !== undefined ? { gone: o.gone } : {}) };
  return [
    { k: "poly", closed: true, pts: unfold ? chan(up0, dn0) : chan(up1, dn1),
      fill: C.cyan, fillOpacity: 0.1, ...keyed(chan(up0, dn0), chan(up1, dn1)), ...common },
    /* dashed, because it IS a moving average — solid would read as a third thing */
    { k: "poly", pts: ptsOf(BB.mid, g), stroke: midTone, sw: S.band, dash: [6, 6], cap: "round", ...common },
    { k: "poly", pts: unfold ? up0 : up1, stroke: C.cyan, sw: S.band, ...keyed(up0, up1), ...common },
    { k: "poly", pts: unfold ? dn0 : dn1, stroke: C.cyan, sw: S.band, ...keyed(dn0, dn1), ...common },
  ];
};

const SCENES = [];

/* ═══ SC01 — Manual is slow, indicators are fast (0, 659) ═══════════════════
 * The contrast IS the scene: four laboured marks on the left, one instant line
 * on the right, over identical price data.
 */
{
  const t = { left: sec(0.4), mark2: sec(2.9), mark3: sec(5.4), dim: sec(8.0), right: sec(14.0), label: sec(17.5) };
  const MARK_OVER = sec(0.7);
  const LEFT = { x: 96, y: CHART.y, w: 840, h: CHART.h };
  const RIGHT = { x: 984, y: CHART.y, w: 840, h: CHART.h };
  const PERIOD = 18;
  const CLOSES = SERIES.slice(0, 90);
  const BARS = toBars(CLOSES, 101);
  const DOMAIN = [Math.min(...BARS.map((b) => b.l)), Math.max(...BARS.map((b) => b.h))];
  const LG = gridOf(CLOSES, DOMAIN, LEFT);
  const RG = gridOf(CLOSES, DOMAIN, RIGHT);
  const MA = sma(CLOSES, PERIOD);
  const TREND = { a: 12, b: 62 };
  const RING_AT = 44;
  const LEVEL = CLOSES[70];
  /** The left half steps back once its slow reading is finished. */
  const dim = fadeTrack(t.dim, 14, 1, 0.35);

  const L = [];
  chartLayers(LG, BARS, LEFT, t.left, sec(1.6), { tickLabels: false }).forEach((l) => L.push({ ...l, op: dim, at: l.at ?? t.left }));
  /* the three hand marks — slow on purpose, that slowness is the argument */
  L.push(line(LG.x(TREND.a), LG.y(CLOSES[TREND.a]), LG.x(TREND.b), LG.y(CLOSES[TREND.b]),
    { stroke: C.indigo, sw: S.band, at: t.left + sec(1.6),
      op: [[t.left + sec(1.6), 0], [t.left + sec(1.6) + MARK_OVER, 100], ...dim] }));
  L.push(circle(LG.x(RING_AT), LG.y(CLOSES[RING_AT]), 34,
    { stroke: C.indigo, sw: S.band, at: t.mark2, op: [[t.mark2, 0], [t.mark2 + MARK_OVER, 100], ...dim] }));
  L.push(line(LEFT.x + 20, LG.y(LEVEL), LEFT.x + LEFT.w - 20, LG.y(LEVEL),
    { stroke: C.indigo, sw: S.band, dash: [10, 8], at: t.mark3, op: [[t.mark3, 0], [t.mark3 + MARK_OVER, 100], ...dim] }));

  /* the split rule — the one vertical line in the episode */
  L.push(line(W / 2, CHART.y, W / 2, CHART.y + CHART.h,
    { stroke: C.border, sw: S.hairline, at: t.left, op: [[t.left, 0], [t.left + 14, 100]] }));

  /* right: read by an indicator */
  chartLayers(RG, BARS, RIGHT, t.right, sec(1.2), { tickLabels: false }).forEach((l) => L.push({ ...l, at: l.at ?? t.right, op: [[t.right, 0], [t.right + 8, 100]] }));
  L.push(poly(ptsOf(MA, RG), { stroke: C.indigo, sw: S.ma, cap: "round", at: t.right + sec(1.2), trim: [t.right + sec(1.2), 30] }));

  /* the panel names, then the one label — never three at once */
  L.push(chip("Manual", LEFT.x, CHART.y - 16, t.left, {
    anchor: "right", tone: C.textMuted, size: T.body.size, weight: T.chip.weight,
    op: [[t.left, 0], [t.left + REVEAL, 100], [t.right, 100], [t.right + 12, 0]],
  }));
  L.push(chip("Indikator", RIGHT.x, CHART.y - 16, t.right, {
    anchor: "right", tone: C.textMuted, size: T.body.size, weight: T.chip.weight,
    op: [[t.right, 0], [t.right + REVEAL, 100], [t.label, 100], [t.label + 12, 0]],
  }));
  L.push(chip("Trend: Up", RG.x(CLOSES.length - 10), clearAbove(RG, CLOSES.length - 10, 8, [MA], BARS), t.label, { anchor: "above", gap: 30 }));

  SCENES.push({ name: "SC01 manual vs indikator", stills: [300, 620], from: 0, dur: 659, layers: L,
    cutOut: { at: 659, over: 24, distance: 90, blur: 9 } });
}


/* ═══ SC04 — SMA vs EMA (1839, 467) ════════════════════════════════════════
 * The SAME array, both averages. The method is the only variable, and the box
 * marks the bars where the two disagree about when the turn happened.
 */
{
  const t = { title: sec(0.2), price: sec(0.6), mas: sec(3.0), turn: sec(8.0), caption: sec(13.0) };
  const PERIOD = 16;
  const TICKS = [4600, 5000, 5400, 5800];
  const AXIS_GUTTER = 150;
  const BARS_R = toBars(SERIES_REVERSAL, 2104);
  const DOMAIN = domainOf(BARS_R);
  const G = gridOf(SERIES_REVERSAL, DOMAIN, CHART, 0.12, AXIS_GUTTER);
  const SMA = sma(SERIES_REVERSAL, PERIOD);
  const EMA = ema(SERIES_REVERSAL, PERIOD);
  const turnOf = (v) => {
    const from = Math.round(v.length * 0.55);
    for (let i = from; i < v.length - 1; i++) {
      const a = v[i], b = v[i + 1];
      if (a !== null && b !== null && b < a) return i;
    }
    return from;
  };
  const TURN = { ema: turnOf(EMA), sma: turnOf(SMA) };
  /** Where the two lines are furthest apart — the only place two labels fit. */
  const APART = (() => {
    let best = TURN.sma, gap = 0;
    for (let i = PERIOD; i < SERIES_REVERSAL.length; i++) {
      const a = SMA[i], b = EMA[i];
      if (a === null || b === null) continue;
      if (Math.abs(a - b) > gap) { gap = Math.abs(a - b); best = i; }
    }
    return best;
  })();

  const L = [];
  chartLayers(G, BARS_R, CHART, t.price, sec(2.4), { ticks: TICKS })
    .forEach((l) => L.push({ ...l, opacity: 0.45, at: l.at ?? 0 }));
  L.push(poly(ptsOf(SMA, G), { stroke: C.indigo, sw: S.ma, at: t.mas, trim: [t.mas, sec(4)] }));
  L.push(poly(ptsOf(EMA, G), { stroke: C.cyan, sw: S.ma, at: t.mas, trim: [t.mas, sec(4)] }));
  L.push(box(G.x(TURN.ema) - 40, G.x(TURN.sma) + 40, CHART.y + 40, CHART.y + CHART.h - 40, t.turn));
  L.push(title("SMA vs EMA", t.title));
  L.push(chip("SMA", G.x(APART), clearAbove(G, APART, 4, [SMA, EMA], BARS_R), t.mas + sec(2.6), { anchor: "above", gap: 28 }));
  L.push(chip("EMA", G.x(APART), clearBelow(G, APART, 4, [SMA, EMA], BARS_R), t.mas + sec(2.6), { anchor: "below", gap: 28, tone: C.cyan }));
  L.push(caption("EMA Faster, SMA Steadier", t.caption));

  SCENES.push({ name: "SC04 SMA vs EMA", stills: [430], from: 1839, dur: 467, layers: L,
    cutIn: { at: 1839, over: 24, distance: 110, blur: 9, axis: "x" },
    cutOut: { at: 2306, over: 24, distance: 90, blur: 9 } });
}

/* ═══ SC05 — Posisi & Slope (2306, 576) ════════════════════════════════════
 * Three states, each owning the frame outright. One arrow and one label sit in
 * the SAME place in all three, so the only thing that changes is the slope.
 */
{
  const STATES = [
    { at: sec(0.4), series: SERIES_UP, bars: BARS_UP, label: "Trend: Up", steep: -1 },
    { at: sec(6.0), series: SERIES_DOWN, bars: BARS_DOWN, label: "Trend: Down", steep: 1 },
    { at: sec(12.0), series: SERIES_FLAT, bars: BARS_FLAT, label: "No Trend", steep: 0 },
  ];
  const FADE = 15, PERIOD = 16;
  const ARROW = { x: CHART.x + 520, y: CHART.y + CHART.h / 2, run: 420, rise: 150 };
  const L = [];
  STATES.forEach((s, i) => {
    const grid = gridOf(s.series, domainOf(s.bars), CHART);
    const ma = sma(s.series, PERIOD);
    const next = STATES[i + 1];
    const until = next ? next.at : undefined;
    chartLayers(grid, s.bars, CHART, s.at, sec(2.2), { tickLabels: false })
      .forEach((l) => L.push({ ...l, at: s.at, op: phase(s.at, FADE, 0.5, until), gone: until ? until + FADE : undefined }));
    L.push(poly(ptsOf(ma, grid), { stroke: C.indigo, sw: S.ma, at: s.at, trim: [s.at, sec(2.2)],
      op: phase(s.at, FADE, 1, until), gone: until ? until + FADE : undefined }));
  });
  /* one arrow, one label, at the same place in every state */
  STATES.forEach((s, i) => {
    const next = STATES[i + 1];
    const gone = next ? next.at : undefined;
    const from = { x: ARROW.x, y: ARROW.y - s.steep * ARROW.rise * 0.5 };
    const to = { x: ARROW.x + ARROW.run * (s.steep === 0 ? 0.62 : 1), y: ARROW.y + s.steep * ARROW.rise * 0.5 };
    arrow(from, to, s.at + sec(1.6), { gone }).forEach((a) => L.push(a));
    L.push(chip(s.label, CHART.x + CHART.w / 2, CHART.y + CHART.h - 40, s.at + sec(2.2), { anchor: "above", gone }));
  });
  L.push(title("Posisi & Slope", sec(0.2)));

  SCENES.push({ name: "SC05 posisi & slope", stills: [150, 330, 520], from: 2306, dur: 576, layers: L,
    cutIn: { at: 2306, over: 24, distance: 90, blur: 9 },
    cutOut: { at: 2882, over: 24, distance: 110, blur: 9, axis: "x" } });
}

/* ═══ SC06 — Support & Resistance (2882, 562) ══════════════════════════════
 * Two phases of one idea: price comes back onto a rising average and holds,
 * then rallies INTO a falling one and is turned away.
 */
{
  const t = { title: sec(0.2), up: sec(0.6), down: sec(10.0) };
  const FADE = 20, PERIOD = 16;
  const TOUCH_UP = [26, 50], TOUCH_DOWN = [24, 48];
  const RIDE_AT = 60;
  const UD = [Math.min(...BARS_UPTREND.map((b) => b.l)), Math.max(...BARS_UPTREND.map((b) => b.h))];
  const DD = [Math.min(...BARS_DOWN.map((b) => b.l)), Math.max(...BARS_DOWN.map((b) => b.h))];
  const UG = gridOf(SERIES_UPTREND, UD, CHART);
  const DG = gridOf(SERIES_DOWN, DD, CHART);
  const UMA = sma(SERIES_UPTREND, PERIOD);
  /** Lifted just enough to sit ON the highs, so price rallies into it. */
  const DMA = sma(SERIES_DOWN, PERIOD).map((v) => (v === null ? null : v + 34));

  const L = [];
  const upOut = [[t.down, 100], [t.down + FADE, 0]];
  chartLayers(UG, BARS_UPTREND, CHART, t.up, sec(5), { tickLabels: false })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0, op: upOut, gone: t.down + FADE }));
  L.push(poly(ptsOf(UMA, UG), { stroke: C.indigo, sw: S.ma, at: t.up, trim: [t.up, sec(5)], op: upOut, gone: t.down + FADE }));
  TOUCH_UP.forEach((i, k) => L.push(ping(UG.x(i), UG.y(UMA[i] ?? SERIES_UPTREND[i]), t.up + sec(3.4) + k * sec(2.2))));
  L.push(chip("Support", UG.x(RIDE_AT), clearBelow(UG, RIDE_AT, 6, [UMA]), t.up + sec(4), { anchor: "below", gap: 30, gone: t.down + FADE }));

  const dnIn = [[t.down, 0], [t.down + FADE, 100]];
  chartLayers(DG, BARS_DOWN, CHART, t.down, sec(4), { tickLabels: false })
    .forEach((l) => L.push({ ...l, at: t.down, op: dnIn }));
  L.push(poly(ptsOf(DMA, DG), { stroke: C.indigo, sw: S.ma, at: t.down, trim: [t.down, sec(4)], op: dnIn }));
  TOUCH_DOWN.forEach((i, k) => L.push(ping(DG.x(i), DG.y(DMA[i] ?? SERIES_DOWN[i]), t.down + sec(2.6) + k * sec(1.8))));
  L.push(chip("Resistance", DG.x(RIDE_AT), clearAbove(DG, RIDE_AT, 6, [DMA]), t.down + sec(3), { anchor: "above", gap: 30 }));
  L.push(title("Support & Resistance", t.title));

  SCENES.push({ name: "SC06 support & resistance", stills: [250, 520], from: 2882, dur: 562, layers: L,
    cutIn: { at: 2882, over: 24, distance: 110, blur: 9, axis: "x" },
    cutOut: { at: 3444, over: 24, distance: 0, blur: 9, scale: 0.16 } });
}


/* ═══ CG-A — SC02 + SC03 as one spanning group (659, 1180) ═════════════════
 * The chart mounts once and never unmounts: the price line Scene 02 draws is
 * the same object Scene 03 keeps annotating. Scene 02 has NO arithmetic — a
 * smooth line appearing through the noise IS the idea.
 */
{
  const SC03 = 487;
  const t = {
    title: sec(0.2), price: sec(2.0), ma: sec(7.0), quiet: sec(12.0),
    clear: SC03 + sec(0.2), fast: SC03 + sec(4.0), slow: SC03 + sec(11.0), pulse: SC03 + sec(18.0),
  };
  const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
  const MID = 22, FAST = 20, SLOW = 70, AXIS_GUTTER = 150;
  const BARS_S = toBars(SERIES, 2101);
  const G = gridOf(SERIES, domainOf(BARS_S), CHART, 0.12, AXIS_GUTTER);
  const MA_MID = sma(SERIES, MID), MA_FAST = sma(SERIES, FAST), MA_SLOW = sma(SERIES, SLOW);
  const LABEL_AT = SERIES.length - 14;
  /** The price quietens in SC02 and STAYS quiet through SC03. */
  const priceOp = [[0, 100], [t.quiet, 100], [t.quiet + 24, 25], [t.clear, 40], [t.clear + 1, 40]];
  const midOut = [[t.ma, 100], [t.clear, 100], [t.clear + sec(1.4), 0]];
  /** Both lines thicken once, together — "banyak trader memakai keduanya". */
  const pulseW = [[t.pulse, S.ma], [t.pulse + 15, S.ma + 1.5], [t.pulse + 30, S.ma]];

  const L = [];
  chartLayers(G, BARS_S, CHART, t.price, sec(5), { ticks: TICKS })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0, op: priceOp }));
  L.push(poly(ptsOf(MA_MID, G), { stroke: C.indigo, sw: S.ma, at: t.ma, trim: [t.ma, 150], op: midOut, gone: t.clear + sec(1.4) }));
  L.push(poly(ptsOf(MA_FAST, G), { stroke: C.cyan, sw: S.ma, at: t.fast, trim: [t.fast, sec(5)], swKeys: pulseW }));
  L.push(poly(ptsOf(MA_SLOW, G), { stroke: C.indigo, sw: S.ma, at: t.slow, trim: [t.slow, sec(6)], swKeys: pulseW }));
  /* the direction the smoothing was for — Scene 02's only annotation.
     The far end is clamped INTO the series: the .tsx still points at bar 122
     of a 100-bar array, left behind when the series was shortened. */
  {
    const a = 78, b = Math.min(SERIES.length - 1, 122);
    arrow({ x: G.x(a), y: G.y(MA_MID[a] ?? SERIES[a]) },
          { x: G.x(b), y: G.y(MA_MID[b] ?? SERIES[b]) },
          t.quiet, { gone: t.clear }).forEach((x) => L.push(x));
  }
  L.push(title("Moving Average", t.title));
  L.push(chip("Short = Fast", G.x(LABEL_AT), clearAbove(G, LABEL_AT, 12, [MA_FAST, MA_SLOW], BARS_S), t.fast + sec(3),
    { anchor: "above", gap: 30, tone: C.cyan,
      op: [[t.fast + sec(3), 0], [t.fast + sec(3) + REVEAL, 100], [t.slow + sec(4), 100], [t.slow + sec(4) + 14, 0]] }));
  L.push(chip("Long = Big Picture", G.x(LABEL_AT), clearBelow(G, LABEL_AT, 12, [MA_FAST, MA_SLOW], BARS_S), t.slow + sec(5),
    { anchor: "below", gap: 30 }));

  SCENES.push({ name: "CG-A SC02+03 moving average", stills: [430, 1130], from: 659, dur: 1180, layers: L,
    cutIn: { at: 659, over: 24, distance: 90, blur: 9 },
    cutOut: { at: 1839, over: 24, distance: 110, blur: 9, axis: "x" } });
}

/* ═══ SC07 — Golden & Death Cross (3444, 690) ══════════════════════════════
 * Both crossings are FOUND in the data, never chosen by eye, and the box marks
 * the move that had already happened by the time the cross printed.
 */
{
  const t = { title: sec(0.2), chart: sec(0.4), golden: sec(4.0), death: sec(7.0), lag: sec(12.0), caption: sec(18.0) };
  const FAST = 16, SLOW = 52, AXIS_GUTTER = 150;
  const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
  const G = gridOf(SERIES_CROSS, domainOf(BARS_CROSS), CHART, 0.12, AXIS_GUTTER);
  const F = sma(SERIES_CROSS, FAST);
  const SL = sma(SERIES_CROSS, SLOW);
  const CROSS = (() => {
    let up = -1, down = -1;
    for (let i = 1; i < SERIES_CROSS.length; i++) {
      const a = F[i - 1], b = F[i], c = SL[i - 1], d = SL[i];
      if (a === null || b === null || c === null || d === null) continue;
      if (up < 0 && a <= c && b > d) up = i;
      else if (up > 0 && down < 0 && a >= c && b < d) down = i;
    }
    const n = SERIES_CROSS.length;
    return { up: up < 0 ? Math.round(n * 0.35) : up, down: down < 0 ? Math.round(n * 0.75) : down };
  })();
  const LOW = (() => {
    const from = Math.max(0, CROSS.up - 40);
    let best = from;
    for (let i = from; i < CROSS.up; i++) if (SERIES_CROSS[i] < SERIES_CROSS[best]) best = i;
    return best;
  })();

  const L = [];
  chartLayers(G, BARS_CROSS, CHART, t.chart, sec(3), { ticks: TICKS })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0, opacity: 0.4 }));
  L.push(poly(ptsOf(SL, G), { stroke: C.indigo, sw: S.ma, at: t.chart, trim: [t.chart, sec(3.4)] }));
  L.push(poly(ptsOf(F, G), { stroke: C.cyan, sw: S.ma, at: t.chart, trim: [t.chart, sec(3.4)] }));
  L.push(box(G.x(LOW), G.x(CROSS.up), CHART.y + 30, CHART.y + CHART.h - 30, t.lag));
  L.push(ping(G.x(CROSS.up), G.y(F[CROSS.up]), t.golden));  /* pings sit above the box */
  L.push(ping(G.x(CROSS.down), G.y(F[CROSS.down]), t.death));
  arrow({ x: G.x(LOW), y: G.y(SERIES_CROSS[LOW]) },
        { x: G.x(CROSS.up), y: G.y(SERIES_CROSS[CROSS.up]) },
        t.lag + sec(1), { width: S.band }).forEach((x) => L.push(x));
  L.push(title("Golden & Death Cross", t.title));
  L.push(chip("Golden Cross", G.x(CROSS.up), clearAbove(G, CROSS.up, 8, [F, SL], BARS_CROSS), t.golden + 8,
    { anchor: "above", gap: 28, op: [[t.golden + 8, 0], [t.golden + 8 + REVEAL, 100], [t.death, 100], [t.death + 12, 0]] }));
  L.push(chip("Death Cross", G.x(CROSS.down), clearBelow(G, CROSS.down, 8, [F, SL], BARS_CROSS), t.death + 8,
    { anchor: "below", gap: 28, op: [[t.death + 8, 0], [t.death + 8 + REVEAL, 100], [t.lag, 100], [t.lag + 12, 0]] }));
  L.push(caption("Confirmation, Not a Trigger", t.caption));

  SCENES.push({ name: "SC07 golden & death cross", stills: [620], from: 3444, dur: 690, layers: L,
    cutIn: { at: 3444, over: 24, distance: 0, blur: 9, scale: 0.16 },
    cutOut: { at: 4134, over: 30, distance: 90, blur: 10 } });
}


/* ═══ CG-B — SC08 + SC09 as one spanning group (4134, 1305) ════════════════
 * The bands keep breathing across the boundary: Scene 09's squeeze is a
 * stretch of Scene 08's own demonstration, not a new chart.
 *
 * ⚠ COMPLIANCE: the two arrows at the question are ONE set of numbers drawn
 * twice, mirrored about the same origin. They cannot differ in opacity, stroke
 * or length — any asymmetry would turn a volatility explainer into a call.
 */
{
  const SC09 = 604;
  const t = { title: sec(0.2), price: sec(0.6), mid: sec(3.0), bands: sec(7.0),
    squeeze: SC09 + sec(0.4), hold: SC09 + sec(8.0), ask: SC09 + sec(14.0), resolve: SC09 + sec(19.0) };
  const PERIOD = 20, AXIS_GUTTER = 150;
  const TICKS = [4600, 5000, 5400, 5800];
  const SQUEEZE = { from: 80, to: 118 };
  const ASK = { run: 230, rise: 130 };
  const BB = bollinger(SERIES_BREATH, PERIOD, 2);
  const G = gridOf(SERIES_BREATH, domainOf(BARS_BREATH, [BB.lower, BB.upper]), CHART, 0.12, AXIS_GUTTER);
  const MID_X = Math.round((SQUEEZE.from + SQUEEZE.to) / 2);
  /**
   * Lowered from the .tsx's `CHART.y + 96`. At that height the up-arrow's tip
   * landed at y = 136, x ≈ 1464 — inside the 360 x 150 logo zone, which is the
   * one region nothing may enter. LabelChip refuses that zone; Arrow has no
   * such guard, so the anchor is moved instead and the mirrored pair stays
   * symmetric about it.
   */
  const askAt = { x: G.x(MID_X), y: CHART.y + 156 };
  /** The chart steps back while the question owns the frame. */
  const back = [[0, 100], [t.ask, 100], [t.ask + sec(1), 65], [t.resolve, 65], [t.resolve + sec(1), 100]];

  const L = [];
  chartLayers(G, BARS_BREATH, CHART, t.price, sec(2.4), { ticks: TICKS })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0, op: back.map(([k, v]) => [k, v * 0.5]) }));
  bands(BB, G, { at: t.mid, fadeOver: sec(1.4), unfold: [t.bands, sec(4)], op: back })
    .forEach((b) => L.push(b));
  L.push({ ...box(G.x(SQUEEZE.from), G.x(SQUEEZE.to), CHART.y + 30, CHART.y + CHART.h - 30, t.squeeze), op: back });

  /* ONE arrow, drawn twice — the second is the sign-flipped mirror */
  const aFrom = { x: askAt.x + 96, y: askAt.y };
  [1, -1].forEach((sign) => {
    arrow(aFrom, { x: askAt.x + 96 + ASK.run, y: askAt.y - ASK.rise * sign }, t.ask,
      { gone: t.resolve + sec(1) }).forEach((a) => L.push({ ...a,
        op: [[t.ask, 0], [t.ask + sec(1), 40], [t.resolve, 40], [t.resolve + sec(1), 0]] }));
  });
  /* the question itself — a single glyph, so the count of text stays at two */
  L.push({ k: "text", s: "?", x: askAt.x - 110, y: askAt.y,
    size: T.display.size, weight: T.display.weight, color: C.indigo,
    align: "center", baseline: "middle", at: t.ask, gone: t.resolve + sec(1),
    op: [[t.ask, 0], [t.ask + sec(1), 100], [t.resolve, 100], [t.resolve + sec(1), 0]],
    rise: [t.ask, t.ask + REVEAL, 18] });

  L.push({ ...title("Bollinger Bands", t.title), gone: SC09, op: [[t.title, 0], [t.title + REVEAL, 100]] });
  L.push(title("Squeeze", SC09));
  L.push(chip("Middle = Moving Average", G.x(30), clearAbove(G, 30, 12, [BB.upper], BARS_BREATH), t.mid + sec(1),
    { anchor: "above", gap: 28, op: [[t.mid + sec(1), 0], [t.mid + sec(1) + REVEAL, 100], [t.bands, 100], [t.bands + 14, 0]] }));
  L.push(chip("Volatility", G.x(56), clearAbove(G, 56, 8, [BB.upper], BARS_BREATH), t.bands + sec(2),
    { anchor: "above", gap: 28, tone: C.cyan,
      op: [[t.bands + sec(2), 0], [t.bands + sec(2) + REVEAL, 100], [SC09 - sec(1), 100], [SC09 - sec(1) + 14, 0]] }));
  L.push(chip("Squeeze", G.x(MID_X), CHART.y + 40, t.squeeze + sec(1),
    { anchor: "below", op: [[t.squeeze + sec(1), 0], [t.squeeze + sec(1) + REVEAL, 100], [t.ask, 100], [t.ask + 14, 0]] }));

  SCENES.push({ name: "CG-B SC08+09 bollinger & squeeze", stills: [560, 1150], from: 4134, dur: 1305, layers: L,
    cutIn: { at: 4134, over: 30, distance: 90, blur: 10 },
    cutOut: { at: 5439, over: 24, distance: 110, blur: 9, axis: "x" } });
}

/* ═══ SC10 — Jebakan Pemula (5439, 595) ════════════════════════════════════
 * The `Sell?` chip is fixed at the touch it was made on and the price runs
 * away from it. The strike cancels the claim rather than deleting it: the
 * point is that it was made, and then failed.
 */
{
  const t = { title: sec(0.2), chart: sec(0.4), sell: sec(4.2), strike: sec(11.0), walk: sec(13.0) };
  const PERIOD = 20;
  const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
  const DOMAIN = [
    Math.min(...BB.lower.filter((v) => v !== null), ...BARS_UPTREND.map((b) => b.l)),
    Math.max(...BB.upper.filter((v) => v !== null), ...BARS_UPTREND.map((b) => b.h)),
  ];
  const G = gridOf(SERIES_UPTREND, DOMAIN, CHART);
  const FIRST_TOUCH = (() => {
    for (let i = PERIOD; i < SERIES_UPTREND.length; i++) {
      const u = BB.upper[i];
      if (u !== null && SERIES_UPTREND[i] >= u - 12) return i;
    }
    return PERIOD + 6;
  })();
  /** Two thirds across, NOT at the right end: this scene leaves on a 90px
      upward cut and a label on the last bars gets carried into the logo zone. */
  const WALK_AT = Math.min(SERIES_UPTREND.length - 18, FIRST_TOUCH + 26);

  const L = [];
  chartLayers(G, BARS_UPTREND, CHART, t.chart, sec(12), { tickLabels: false })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0 }));
  bands(BB, G, { at: t.chart + sec(1), fadeOver: sec(1.4) }).forEach((b) => L.push(b));
  L.push({ ...title("Jebakan Pemula", t.title),
    op: [[t.title, 0], [t.title + REVEAL, 100], [t.walk - 12, 100], [t.walk + 2, 0]] });
  L.push(chip("Sell?", G.x(FIRST_TOUCH), clearAbove(G, FIRST_TOUCH, 6, [BB.upper], BARS_UPTREND), t.sell,
    { anchor: "above", gap: 28, tone: C.textMuted, strike: [t.strike, 16] }));
  L.push(chip("Walking the Band", G.x(WALK_AT), clearAbove(G, WALK_AT, 10, [BB.upper], BARS_UPTREND), t.walk,
    { anchor: "above", gap: 28 }));

  SCENES.push({ name: "SC10 jebakan pemula", stills: [540], from: 5439, dur: 595, layers: L,
    cutIn: { at: 5439, over: 24, distance: 110, blur: 9, axis: "x" },
    cutOut: { at: 6034, over: 24, distance: 90, blur: 9 } });
}

/* ═══ SC11 — Your Analysis (6034, 636) ═════════════════════════════════════
 * Your own marks first, the indicators second — agreeing with what is already
 * on the chart. Each mark's label leaves as the next arrives.
 */
{
  const t = { title: sec(0.2), chart: sec(0.4), trend: sec(4.0), pattern: sec(6.3),
    level: sec(8.6), indicators: sec(11.0), caption: sec(17.5) };
  const PERIOD = 20;
  const TREND = { a: 6, b: 44 }, BREAK = 52, LEVEL_AT = 30;
  const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
  const DOMAIN = [
    Math.min(...BB.lower.filter((v) => v !== null), ...BARS_UPTREND.map((b) => b.l)),
    Math.max(...BB.upper.filter((v) => v !== null), ...BARS_UPTREND.map((b) => b.h)),
  ];
  const G = gridOf(SERIES_UPTREND, DOMAIN, CHART);
  const MA = sma(SERIES_UPTREND, PERIOD);
  const until = (at, next) => [[at, 0], [at + REVEAL, 100], [next, 100], [next + 12, 0]];

  const L = [];
  chartLayers(G, BARS_UPTREND, CHART, t.chart, sec(3.2), { tickLabels: false })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0 }));
  /* your marks, first */
  L.push(line(G.x(TREND.a), G.y(SERIES_UPTREND[TREND.a]), G.x(TREND.b), G.y(SERIES_UPTREND[TREND.b]),
    { stroke: C.indigo, sw: S.band, at: t.trend, op: [[t.trend, 0], [t.trend + 16, 100]] }));
  L.push(circle(G.x(BREAK), G.y(SERIES_UPTREND[BREAK]), 38,
    { stroke: C.indigo, sw: S.band, at: t.pattern, op: [[t.pattern, 0], [t.pattern + 16, 100]] }));
  L.push(line(CHART.x + 20, G.y(SERIES_UPTREND[LEVEL_AT]), CHART.x + CHART.w - 20, G.y(SERIES_UPTREND[LEVEL_AT]),
    { stroke: C.indigo, sw: S.band, dash: [10, 8], at: t.level, op: [[t.level, 0], [t.level + 16, 100]] }));
  /* the indicators, second */
  L.push(poly(ptsOf(MA, G), { stroke: C.indigo, sw: S.ma, at: t.indicators, trim: [t.indicators, sec(3)] }));
  bands(BB, G, { at: t.indicators + sec(1), fadeOver: sec(2),
    op: [[t.indicators + sec(1), 0], [t.indicators + sec(1) + sec(2), 90]] }).forEach((b) => L.push(b));

  L.push(title("Your Analysis", t.title));
  L.push(chip("Trend", G.x(TREND.b), clearAbove(G, TREND.b, 8, [], BARS_UPTREND), t.trend + 8, { anchor: "above", gap: 28, op: until(t.trend + 8, t.pattern) }));
  L.push(chip("Pattern", G.x(BREAK), clearAbove(G, BREAK, 8, [], BARS_UPTREND) - 34, t.pattern + 8, { anchor: "above", gap: 28, op: until(t.pattern + 8, t.level) }));
  L.push(chip("Level", G.x(6), clearBelow(G, 6, 8, [], BARS_UPTREND), t.level + 8, { anchor: "below", gap: 28, op: until(t.level + 8, t.indicators) }));
  L.push(chip("Trend: Up", G.x(SERIES_UPTREND.length - 11), clearAbove(G, SERIES_UPTREND.length - 11, 9, [BB.upper, MA], BARS_UPTREND),
    t.indicators + sec(2.4), { anchor: "above", gap: 28, op: until(t.indicators + sec(2.4), t.caption) }));
  L.push(caption("Second Opinion", t.caption));

  SCENES.push({ name: "SC11 your analysis", stills: [600], from: 6034, dur: 636, layers: L,
    cutIn: { at: 6034, over: 24, distance: 90, blur: 9 },
    cutOut: { at: 6670, over: 24, distance: 0, blur: 9, scale: 0.16 } });
}


/* ═══ CG-C — SC12A + SC12B as one spanning group (6670, 1648) ══════════════
 * The reveal mask lifts ACROSS the join: the question is asked on one side of
 * it and answered on the other, same chart, same scales, no re-fit.
 *
 * [NEEDS DATA] `data/ggrm.json` still ships with `bars: []`, so this builds the
 * documented placeholder — the frame, the axes and a visible "Menunggu data" —
 * and NOT a synthetic series. Every other chart in the episode illustrates a
 * mechanic; this one is named, dated and priced, and a generated candle
 * labelled GGRM would be a fabricated record.
 */
{
  const SC12B = 839;
  const t = { title: sec(0.2), chart: sec(3.0), bounce: sec(9.0), squeeze: sec(15.0), mask: sec(21.0),
    wipe: SC12B + sec(0.2), ticks: SC12B + sec(5.0), level: SC12B + sec(11.0), honest: SC12B + sec(19.0) };
  const SLOW_P = 100, BB_P = 20, HIDE_AT = 0.66;
  const GGRM = JSON.parse(fs.readFileSync(new URL("../../src/episodeMovingAverage/data/ggrm.json", import.meta.url), "utf8"));
  const READY = GGRM.bars.length > 0;
  const CLOSES = GGRM.bars.map((b) => b.c);
  const PEAK = READY ? Math.max(...GGRM.bars.map((b) => b.h)) : null;
  const DOMAIN = READY
    ? [Math.min(...GGRM.bars.map((b) => b.l)), Math.max(...GGRM.bars.map((b) => b.h))]
    : [0, 1];
  const G = gridOf(READY ? CLOSES : [0, 1], DOMAIN, CHART);
  const HIDE_FROM = READY ? Math.round(GGRM.bars.length * HIDE_AT) : 0;
  /** The chart steps back for the honesty beat and stays as a backdrop. */
  const back = [[0, 100], [t.honest, 100], [t.honest + sec(1), 50]];

  const L = [];
  L.push({ ...card(CHART), op: back });
  L.push({ ...line(CHART.x, CHART.y + CHART.h, CHART.x + CHART.w, CHART.y + CHART.h), op: back });

  if (READY) {
    const SLOW = sma(CLOSES, SLOW_P);
    const BB = bollinger(CLOSES, BB_P, 2);
    const BOUNCE = GGRM.bars.reduce((b, x, i) => (x.l < GGRM.bars[b].l ? i : b), 0);
    L.push({ ...candles(GGRM.bars, G), at: t.chart, op: back,
      reveal: [t.chart, sec(5)], x0: CHART.x, x1: CHART.x + CHART.w, yTop: CHART.y - 40, yBot: CHART.y + CHART.h + 40 });
    /* midTone steps back a tint: a solid indigo SMA100 is on screen at the
       same time and the VO's "garis ungu" has to stay unambiguous */
    bands(BB, G, { at: t.chart + sec(1), fadeOver: sec(2), midTone: C.indigo70, op: back }).forEach((b) => L.push(b));
    L.push(poly(ptsOf(SLOW, G), { stroke: C.indigo, sw: S.ma, at: t.chart, trim: [t.chart, sec(4)], op: back }));
    L.push(ping(G.x(BOUNCE), G.y(CLOSES[BOUNCE]), t.bounce, 38));
    L.push({ ...box(G.x(HIDE_FROM - 22), G.x(HIDE_FROM), CHART.y + 30, CHART.y + CHART.h - 30, t.squeeze), op: back });
    if (PEAK !== null) L.push(line(CHART.x, G.y(PEAK), CHART.x + CHART.w, G.y(PEAK),
      { stroke: C.indigo, sw: S.band, at: t.level, op: [[t.level, 0], [t.level + 14, 100]] }));
    /* the future, genuinely hidden — a solid fill, never a scrim */
    L.push({ k: "rect", x: G.x(HIDE_FROM), y: CHART.y - 40, w: CHART.x + CHART.w - G.x(HIDE_FROM) + 40, h: CHART.h + 80,
      fill: C.bg, at: t.mask, wipeX: [t.wipe, 150, G.x(HIDE_FROM), CHART.x + CHART.w] });
    L.push(line(G.x(HIDE_FROM), CHART.y - 40, G.x(HIDE_FROM), CHART.y + CHART.h + 40,
      { stroke: C.indigo, sw: S.band, at: t.mask, gone: t.wipe + 150 }));
    L.push(chip(t.ticks ? "Bounce" : "Bounce", G.x(BOUNCE), G.y(CLOSES[BOUNCE]), t.bounce + 10, { anchor: "below" }));
    L.push(chip("Squeeze", G.x(HIDE_FROM - 11), CHART.y + 40, t.squeeze + 10, { anchor: "below" }));
    if (PEAK !== null) L.push(chip(priceFmt(PEAK), CHART.x + CHART.w, G.y(PEAK), t.level + 10, { anchor: "left" }));
  } else {
    /* the placeholder yields the frame to the countdown and to the closing
       lines — otherwise three texts stack on one another */
    L.push({ k: "text", s: "Menunggu data", x: CHART.x + CHART.w / 2, y: CHART.y + CHART.h / 2,
      size: T.body.size, weight: T.body.weight, color: C.faint, align: "center", baseline: "middle",
      at: 0, gone: t.mask, op: [[0, 100], [t.mask, 100]] });
  }

  /* 3, 2, 1 — exactly one per second, the one type allowed to pop */
  for (let i = 0; i < 3; i++) {
    const at = t.mask + i * FPS;
    L.push({ k: "circle", cx: (G.x(HIDE_FROM) + CHART.x + CHART.w) / 2, cy: CHART.y + CHART.h / 2, r: 120,
      stroke: C.indigo, sw: S.ma, at, gone: Math.min(at + FPS, SC12B),
      grow: [at, at + FPS, 120, 120 * 0.68], op: [[at, 100], [at + FPS, 45]] });
    L.push({ k: "text", s: String(3 - i), x: (G.x(HIDE_FROM) + CHART.x + CHART.w) / 2, y: CHART.y + CHART.h / 2,
      size: T.display.size, weight: T.display.weight, color: C.indigo,
      align: "center", baseline: "middle", at, gone: Math.min(at + FPS, SC12B), opacity: 1 });
  }

  L.push({ ...title("Kuis", t.title), op: [[t.title, 0], [t.title + REVEAL, 100], [t.honest, 100], [t.honest + 14, 0]] });
  L.push(chip(`${GGRM.ticker} · Daily`, STAGE.titleChip.x, CHART.y - 22, t.title + 8,
    { anchor: "right", tone: C.textMuted,
      op: [[t.title + 8, 0], [t.title + 8 + REVEAL, 100], [t.honest, 100], [t.honest + 14, 0]] }));

  /* the honesty beat — two plain lines, the caveat set larger */
  L.push({ k: "text", s: "Bukan jaminan.", x: W / 2, y: 430, size: T.title.size, weight: T.title.weight,
    color: C.ink, align: "center", baseline: "middle", ...reveal(t.honest) });
  L.push({ k: "text", s: "Kali ini, sesuai.", x: W / 2, y: 540, size: T.body.size, weight: T.body.weight,
    color: C.textMuted, align: "center", baseline: "middle", ...reveal(t.honest + sec(3)) });

  SCENES.push({ name: "CG-C SC12A+12B kuis GGRM", stills: [700, 1560], from: 6670, dur: 1648, layers: L,
    cutIn: { at: 6670, over: 24, distance: 0, blur: 9, scale: 0.16 },
    cutOut: { at: 8318, over: 26, distance: 0, blur: 9 } });
}

/* ═══ SC13 — the close (8318, 582) ═════════════════════════════════════════
 * Three lines read ON the chart, which steps well back so a price line cannot
 * cross the type.
 */
{
  const t = { chart: sec(0.2), back: sec(4.4) };
  const LINES = [
    { text: "Confirm the Trend", at: sec(5.0) },
    { text: "Spot the Squeeze", at: sec(9.0) },
    { text: "Never Use It Alone", at: sec(13.0) },
  ];
  const PERIOD = 20;
  const STACK = { x: 96 + 56, lead: 96 };
  const BARS_S = toBars(SERIES, 2101);
  const MA = sma(SERIES, PERIOD);
  const BB = bollinger(SERIES, PERIOD, 2);
  const G = gridOf(SERIES, domainOf(BARS_S, [BB.lower, BB.upper]), CHART);
  const MID_Y = CHART.y + CHART.h / 2;
  const back = [[0, 100], [t.back, 100], [t.back + sec(1), 25]];

  const L = [];
  chartLayers(G, BARS_S, CHART, t.chart, sec(3.4), { tickLabels: false })
    .forEach((l) => L.push({ ...l, at: l.at ?? 0, op: back.map(([k, v]) => [k, v * 0.55]) }));
  L.push(poly(ptsOf(MA, G), { stroke: C.indigo, sw: S.ma, at: t.chart, trim: [t.chart, sec(3.4)], op: back }));
  bands(BB, G, { at: t.chart + sec(1), fadeOver: sec(2),
    op: [[t.chart + sec(1), 0], [t.chart + sec(1) + sec(2), 85], [t.back, 85], [t.back + sec(1), 21]] })
    .forEach((b) => L.push(b));
  LINES.forEach((l, i) => L.push({
    k: "text", s: l.text, x: STACK.x, y: MID_Y + (i - 1) * STACK.lead,
    size: T.title.size, weight: T.title.weight, color: i === 2 ? C.indigo : C.ink,
    align: "left", baseline: "middle", ...reveal(l.at),
  }));

  SCENES.push({ name: "SC13 penutup", stills: [520], from: 8318, dur: 582, layers: L,
    cutIn: { at: 8318, over: 26, distance: 0, blur: 9, scale: -0.14 } });
}

/**
 * The burned-in subtitles, parsed straight out of subtitles.ts so the cue list
 * cannot drift from the Remotion build. They live in the reserved bottom 108px
 * band, which every scene keeps clear — that reservation is what makes burning
 * them in safe.
 */
const CUES = (() => {
  const src = fs.readFileSync(new URL("../../src/episodeMovingAverage/subtitles.ts", import.meta.url), "utf8");
  const out = [];
  const re = /\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*text:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ start: +m[1], end: +m[2], text: m[3].replace(/\\"/g, '"') });
  }
  return out;
})();

const doc = {
  project: "MA — Tuntun Academy",
  name: "MovingAverageBollingerBands",
  w: W, h: H, fps: FPS, total: 8900, bg: C.bg,
  /** The episode's one voice, mounted once at the root. */
  audio: "/Users/samuelsurja/Documents/01 Academy/Claude/Educational video about investing_2/moving-average/public/vo/moving-average.mp3",
  watermark: {
    file: "/Users/samuelsurja/Documents/01 Academy/Claude/Educational video about investing_2/moving-average/public/watermark.png",
    fade: 12,
  },
  captions: {
    y: CAPTION_BAND.top + CAPTION_BAND.height / 2,
    size: T.body.size, weight: 500, color: C.indigo,
    cues: CUES,
  },
  scenes: SCENES,
};

fs.writeFileSync(OUT, JSON.stringify(doc, null, 1));
const n = SCENES.reduce((a, s) => a + s.layers.length, 0);
console.log(`wrote ${OUT}\nscenes ${SCENES.length}, layers ${n}, cues ${CUES.length}, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
