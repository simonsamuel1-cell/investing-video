/**
 * lib.mjs — the episode's maths, copied verbatim out of the Remotion source so
 * the Adobe build is generated from the SAME numbers rather than from a second
 * implementation that is free to drift.
 *
 * Nothing here imports React, Remotion or the theme module: theme.ts calls
 * loadFont() at module scope and would need a DOM. The constants below are the
 * same values, and this file is the one place they are duplicated.
 */

export const W = 1920, H = 1080, FPS = 30;
export const sec = (s) => Math.round(s * FPS);

export const MARGIN = { left: 96, right: 96, top: 54, bottom: 108 };
export const CAPTION_BAND = { top: H - MARGIN.bottom, height: MARGIN.bottom };
export const LOGO_ZONE = { width: 360, height: 150, maxX: W - 360 - 192 };

const active = { x: 96, y: 54, w: 1728, h: 918 };
export const STAGE = {
  active,
  chart: { x: 96, y: 170, w: 1728, h: 680 },
  captionY: 880,
  titleChip: { x: 96, y: 92 },
};
export const CHART = STAGE.chart;

export const C = {
  bg: "#F5F5F5", ink: "#000000", slate: "#626266",
  indigo: "#5F4DEE", cyan: "#5CC8E3",
  candleGreen: "#22B573", candleRed: "#E5475D", warn: "#E5475D",
  indigo90: "#7160F1", indigo40: "#CFC8FB", indigo12: "#EDEAFE",
  cyan70: "#8EDAEB", cyan40: "#C2ECF5", cyan12: "#E7F7FB",
  priceLine: "#3A3A3A", indigo70: "#9A8EF5",
  gridline: "#DDE0E5", border: "#D8DBE0", textMuted: "#6B7076",
  indigoPale: "#EFEDFE", indigoLight: "#8F82F4", cyanPale: "#EAFAFE",
  surface: "#FFFFFF", hairline: "#DEDEE0", faint: "#B9B9BD", onIndigo: "#FFFFFF",
};

/** THE type scale — four sizes, and only four. */
export const T = {
  family: "Plus Jakarta Sans",
  display: { size: 96, weight: 800 },
  title:   { size: 48, weight: 700 },
  body:    { size: 36, weight: 500 },
  chip:    { size: 36, weight: 600 },
  tag:     { size: 30, weight: 600 },
  axis:    { size: 30, weight: 500 },
};

export const S = {
  cardRadius: 24, panelRadius: 16, chipRadius: 16,
  hairline: 1, rule: 2, line: 3, ma: 3, band: 2, price: 2.5, wick: 1.5, heavy: 9,
};

export const M = { reveal: 12, fade: 10, pop: 10, pingF: 20 };

/* ── determinism ─────────────────────────────────────────────────────────── */
export const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* ── the one price generator ─────────────────────────────────────────────── */
export const makeSeries = ({ seed, n, drift = 0, noise = 1, shape = "drift" }) => {
  const rnd = seeded(seed); const out = []; let p = 5000;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); let bias = drift;
    if (shape === "reversal") bias = t < 0.6 ? 26 : -34;
    else if (shape === "uptrend") bias = 22 + Math.sin(t * Math.PI * 3.2) * 30;
    else if (shape === "downtrend") bias = -22 - Math.sin(t * Math.PI * 3.2) * 30;
    else if (shape === "flat") bias = Math.sin(t * Math.PI * 5) * 16;
    p += bias + (rnd() - 0.5) * 2 * 34 * noise;
    out.push(p);
  }
  return out;
};

/**
 * WICKS ARE A FRACTION OF THE SERIES' OWN RANGE, never an absolute amount —
 * the same rule as `series.ts`, and the reason is the same: the identical
 * numbers drew hairlines on a 124.000-level chart and spikes on an 1.000-level
 * one. Keep this in step with the episode's copy.
 */
const WICK = { min: 0.003, vary: 0.009, spike: 0.08, stretch: 1.8 };

export const toBars = (closes, seed) => {
  const rnd = seeded(seed);
  const span = Math.max(1e-9, Math.max(...closes) - Math.min(...closes));
  const wick = () => (WICK.min + rnd() * WICK.vary) * span * (rnd() < WICK.spike ? WICK.stretch : 1);
  return closes.map((c, i) => {
    const o = i === 0 ? c - (rnd() - 0.5) * span * 0.004 : closes[i - 1];
    return { o, c, h: Math.max(o, c) + wick(), l: Math.min(o, c) - wick() };
  });
};

export const SERIES          = makeSeries({ seed: 2024, n: 100, drift: 13, noise: 1.35 });
export const SERIES_CROSS    = makeSeries({ seed: 707, n: 110, shape: "reversal", noise: 0.9 });
export const SERIES_REVERSAL = makeSeries({ seed: 77, n: 120, shape: "reversal", noise: 0.75 });
export const SERIES_UPTREND  = makeSeries({ seed: 91, n: 70, shape: "uptrend", noise: 1.1 });
export const SERIES_FLAT     = makeSeries({ seed: 55, n: 120, shape: "flat", noise: 0.7 });
export const SERIES_UP       = makeSeries({ seed: 31, n: 120, drift: 26, noise: 0.6 });
export const SERIES_DOWN     = makeSeries({ seed: 32, n: 70, shape: "downtrend", noise: 1.1 });
export const SERIES_BREATH = (() => {
  const rnd = seeded(808); const out = []; let p = 5000;
  for (let i = 0; i < 150; i++) {
    const calm = i < 40 || (i >= 78 && i < 120);
    p += 4 + (rnd() - 0.5) * 2 * (calm ? 12 : 62);
    out.push(p);
  }
  return out;
})();

export const BARS          = toBars(SERIES, 2101);
export const BARS_CROSS    = toBars(SERIES_CROSS, 2107);
export const BARS_REVERSAL = toBars(SERIES_REVERSAL, 2104);
export const BARS_UPTREND  = toBars(SERIES_UPTREND, 2106);
export const BARS_DOWN     = toBars(SERIES_DOWN, 2102);
export const BARS_FLAT     = toBars(SERIES_FLAT, 2105);
export const BARS_UP       = toBars(SERIES_UP, 2103);
export const BARS_BREATH   = toBars(SERIES_BREATH, 2108);

export const domainOf = (bars, extra = []) => {
  const lows = bars.map((b) => b.l), highs = bars.map((b) => b.h);
  extra.forEach((s) => s.forEach((v) => { if (v !== null) { lows.push(v); highs.push(v); } }));
  return [Math.min(...lows), Math.max(...highs)];
};

/* ── indicators — null through the warm-up, never a number ───────────────── */
export const sma = (v, period) => v.map((_, i) => {
  if (i < period - 1) return null;
  let s = 0; for (let k = 0; k < period; k++) s += v[i - k];
  return s / period;
});

export const ema = (v, period) => {
  const k = 2 / (period + 1); const out = []; let prev = null;
  for (let i = 0; i < v.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    if (prev === null) { let s = 0; for (let j = 0; j < period; j++) s += v[i - j]; prev = s / period; }
    else prev = v[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
};

export const bollinger = (v, period = 20, mult = 2) => {
  const mid = sma(v, period); const upper = [], lower = [], width = [];
  for (let i = 0; i < v.length; i++) {
    const m = mid[i];
    if (m === null) { upper.push(null); lower.push(null); width.push(null); continue; }
    let sq = 0; for (let k = 0; k < period; k++) sq += (v[i - k] - m) ** 2;
    const sd = Math.sqrt(sq / period);
    upper.push(m + mult * sd); lower.push(m - mult * sd); width.push((2 * mult * sd) / m);
  }
  return { mid, upper, lower, width };
};

/* ── the shared coordinate space ─────────────────────────────────────────── */
export const gridOf = (values, domain, box = CHART, pad = 0.12, gutter = 0) => {
  const real = values.filter((v) => v !== null);
  const [lo, hi] = domain ?? [Math.min(...real), Math.max(...real)];
  const span = Math.max(1e-9, hi - lo);
  const n = Math.max(1, values.length);
  const padX = 18;
  const inner = box.w - padX * 2 - gutter;
  return {
    lo, hi, box, slot: inner / n,
    x: (i) => box.x + padX + (inner * i) / Math.max(1, n - 1),
    y: (v) => box.y + box.h * (1 - pad) - ((v - lo) / span) * box.h * (1 - pad * 2),
  };
};

/** Points of a series in canvas pixels, leading nulls dropped. */
export const ptsOf = (values, g) => {
  const out = [];
  values.forEach((v, i) => { if (v !== null) out.push([+g.x(i).toFixed(2), +g.y(v).toFixed(2)]); });
  return out;
};

export const clearAbove = (g, i, span, layers, bars) => {
  let top = Infinity;
  for (let k = Math.max(0, i - span); k <= i + span; k++) {
    layers.forEach((v) => { const val = v[k]; if (val !== undefined && val !== null) top = Math.min(top, g.y(val)); });
    const b = bars?.[k]; if (b) top = Math.min(top, g.y(b.h));
  }
  return Number.isFinite(top) ? top : g.y(g.hi);
};

export const clearBelow = (g, i, span, layers, bars) => {
  let bot = -Infinity;
  for (let k = Math.max(0, i - span); k <= i + span; k++) {
    layers.forEach((v) => { const val = v[k]; if (val !== undefined && val !== null) bot = Math.max(bot, g.y(val)); });
    const b = bars?.[k]; if (b) bot = Math.max(bot, g.y(b.l));
  }
  return Number.isFinite(bot) ? bot : g.y(g.lo);
};

export const priceFmt = (n) => Math.round(n).toLocaleString("de-DE");

/* ── the drawing vocabulary the .jsx interpreter understands ─────────────── */
export const card  = (box, o = {}) => ({ k: "card", ...box, r: S.cardRadius, fill: C.surface, stroke: C.hairline, sw: S.hairline, ...o });
export const line  = (x1, y1, x2, y2, o = {}) => ({ k: "line", x1, y1, x2, y2, stroke: C.gridline, sw: S.hairline, ...o });
export const poly  = (pts, o = {}) => ({ k: "poly", pts, stroke: C.indigo, sw: S.ma, ...o });
export const circle= (cx, cy, r, o = {}) => ({ k: "circle", cx, cy, r, ...o });
export const rect  = (x, y, w, h, o = {}) => ({ k: "rect", x, y, w, h, ...o });
export const text  = (s, x, y, o = {}) => ({ k: "text", s, x, y, size: T.tag.size, weight: T.tag.weight, color: C.indigo, align: "center", baseline: "middle", ...o });

/** The candle set of a grid, as one layer the builder wipes on. */
export const candles = (bars, g, o = {}) => ({
  k: "candles",
  w: Math.max(2, Math.min(20, g.slot * 0.62)),
  wick: S.wick, wickColor: C.priceLine,
  up: C.candleGreen, down: C.candleRed,
  bars: bars.map((b, i) => ({
    x: +g.x(i).toFixed(2),
    hi: +g.y(b.h).toFixed(2), lo: +g.y(b.l).toFixed(2),
    top: +Math.min(g.y(b.o), g.y(b.c)).toFixed(2),
    bh: +Math.max(1.5, Math.abs(g.y(b.c) - g.y(b.o))).toFixed(2),
    up: b.c >= b.o,
  })),
  ...o,
});

/** The gridlines + baseline a ChartFrame always draws. */
export const axis = (g, ticks, box = g.box, labels = true) => {
  const out = [];
  const inBox = (ticks ?? []).filter((p) => { const y = g.y(p); return y >= box.y && y <= box.y + box.h; });
  inBox.forEach((p) => out.push(line(box.x, +g.y(p).toFixed(2), box.x + box.w, +g.y(p).toFixed(2))));
  out.push(line(box.x, box.y + box.h, box.x + box.w, box.y + box.h));
  if (labels) inBox.forEach((p) => out.push(text(priceFmt(p), box.x + box.w - 8, +g.y(p).toFixed(2), {
    size: T.axis.size, weight: T.axis.weight, color: C.textMuted, align: "right", baseline: "middle",
  })));
  return out;
};
