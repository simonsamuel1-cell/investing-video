/**
 * core/chart/series.ts — everything that turns a price source into `Bar[]`.
 *
 * ── THREE SOURCES, ONE OUTPUT ──────────────────────────────────────────────
 * A chart in a Tuntun episode comes from one of three places, and all three are
 * legitimate:
 *
 *   1. REAL MARKET DATA — a TradingView export. `fromOHLC`.
 *   2. TRACED FROM A SCREENSHOT — anchors read off the image by eye and
 *      interpolated. The landmarks are in the right places and the levels are
 *      within a few tens of rupiah, but no individual bar is the bar that
 *      actually printed. `fromAnchors`.
 *   3. SYNTHETIC BY SHAPE — uptrend, downtrend, sideways, reversal, generated
 *      from a seed. `makeSeries`.
 *
 * What is unified is the OUTPUT, not the input: every source ends as `Bar[]`
 * and the chart component never learns which one it was. That is what lets a
 * scene swap a traced tape for a real export without touching the scene.
 *
 * ⚠ COMPLIANCE. Sources 2 and 3 are illustrative and MUST carry the
 * "Ilustrasi" tag on screen. Source 1 must not. `SourceKind` travels with the
 * series so a scene cannot silently lose the tag — see core/SourceTag.tsx.
 *
 * ── THREE RULES THAT ARE NOT NEGOTIABLE ────────────────────────────────────
 *
 * A. GENERATE AT MODULE SCOPE, never inside a component. A series built in a
 *    component is regenerated every frame and the chart boils.
 *
 * B. SEEDED PRNG ONLY. Remotion renders frames in parallel processes, so
 *    Math.random() would make two renders of the same frame differ.
 *
 * C. WICKS AND BODIES ARE FRACTIONS OF THE SERIES' OWN RANGE, never absolute
 *    amounts. The same numbers must draw hairlines on a chart running to
 *    124.000 and spikes on one running to 1.000.
 */
import { seeded } from "../helpers";

export type Bar = { o: number; h: number; l: number; c: number };

export type Shape = "drift" | "uptrend" | "downtrend" | "sideways" | "reversal";

/** Where a series came from. Drives the Ilustrasi tag; never cosmetic. */
export type SourceKind = "market" | "traced" | "synthetic";

export type Series = {
  closes: number[];
  bars: Bar[];
  kind: SourceKind;
  /** Ticker or a short description. Shown by SourceTag. */
  label?: string;
};

/* ── 3. SYNTHETIC ─────────────────────────────────────────────────────────── */

export const makeCloses = ({
  seed,
  n,
  drift = 0,
  noise = 1,
  shape = "drift",
  start = 5000,
}: {
  seed: number;
  n: number;
  drift?: number;
  noise?: number;
  shape?: Shape;
  start?: number;
}): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  let p = start;
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    let bias = drift * 40;
    /* one obvious turn at 60% across — for a scene that needs a single moment
       where one line can visibly turn before the other */
    if (shape === "reversal") bias = t < 0.6 ? 26 : -34;
    /* a climb with real pullbacks in it, so price can come back down onto a
       rising average and bounce */
    else if (shape === "uptrend") bias = 22 + Math.sin(t * Math.PI * 3.2) * 30;
    /* the mirror, so a downtrend has genuine relief rallies rather than a
       straight slide — a slide has no pullback to compare volume against */
    else if (shape === "downtrend") bias = -22 + Math.sin(t * Math.PI * 3.2) * 30;
    else if (shape === "sideways") bias = Math.sin(t * Math.PI * 5) * 16;
    p += bias + (rnd() - 0.5) * 2 * 34 * noise;
    out.push(p);
  }
  return out;
};

/* ── 2. TRACED FROM A SCREENSHOT ──────────────────────────────────────────── */

/** `[t, price]` with t running 0 → 1 across the chart's own window. */
export type Anchor = [number, number];

/**
 * Anchors → closes, by linear interpolation between them plus a small seeded
 * tremor so the tape does not read as a polyline. The tremor is a fraction of
 * the anchors' own range, and it is deliberately small: the whole point of a
 * traced series is that its turns land where the screenshot's turns land.
 */
export const fromAnchors = (
  anchors: Anchor[],
  n: number,
  seed: number,
  tremor = 0.004,
): number[] => {
  const rnd = seeded(seed);
  const pts = [...anchors].sort((a, b) => a[0] - b[0]);
  const span =
    Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]));
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    let k = 0;
    while (k < pts.length - 2 && pts[k + 1][0] < t) k++;
    const [t0, v0] = pts[k];
    const [t1, v1] = pts[Math.min(k + 1, pts.length - 1)];
    const u = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
    out.push(v0 + (v1 - v0) * u + (rnd() - 0.5) * 2 * span * tremor);
  }
  return out;
};

/* ── CLOSES → CANDLES ─────────────────────────────────────────────────────── */

const WICK = { min: 0.003, vary: 0.009, spike: 0.08, stretch: 1.8 };

/**
 * ═══ ⚠ NO DOJI, ANYWHERE ═══
 *
 * Opening on the previous close means a quiet bar has a body of almost nothing,
 * and a quiet stretch fills the tape with hairlines.
 *
 * So a body is opened out to at least this fraction of the series' range. It
 * holds one line: the OPEN moves and the CLOSE never does. Every average, every
 * crossing, every level a scene points at is computed from closes, so none of
 * them can shift. What does move is each bar's high or low, by however far its
 * own body grew past them.
 *
 * As a fraction of the range, 0.023–0.043 is about 12–22px on a full-height
 * chart. Spread rather than clamped flat, because bodies all the same size read
 * as a bar chart.
 */
const BODY = { min: 0.023, vary: 0.02 };

export const toBars = (
  closes: number[],
  seed: number,
  /** Multiplies wick lengths, for a tape meant to read CHUNKY rather than
   *  fine. Defaults to 1 so an existing chart is never redrawn by accident. */
  wickScale = 1,
): Bar[] => {
  const rnd = seeded(seed);
  /* A SECOND, INDEPENDENT STREAM for the body minimum. Taking it from `rnd`
     would advance that stream once per bar and redraw every wick — a
     chart-wide change to fix a body-height problem. */
  const body = seeded(seed ^ 0x9e3779b9);
  const span = Math.max(1e-9, Math.max(...closes) - Math.min(...closes));
  const wick = () =>
    (WICK.min + rnd() * WICK.vary) *
    span *
    wickScale *
    (rnd() < WICK.spike ? WICK.stretch : 1);
  return closes.map((c, i) => {
    const prev = i === 0 ? c - (rnd() - 0.5) * span * 0.004 : closes[i - 1];
    const want = (BODY.min + body() * BODY.vary) * span;
    /* the direction is whatever the move was; only its SIZE has a floor */
    const o = Math.abs(c - prev) >= want ? prev : c >= prev ? c - want : c + want;
    return { o, c, h: Math.max(o, c) + wick(), l: Math.min(o, c) - wick() };
  });
};

/* ── THE THREE CONSTRUCTORS ───────────────────────────────────────────────── */

/** 1. Real market data. Bars are used verbatim — never regenerated. */
export const fromOHLC = (
  rows: { open: number; high: number; low: number; close: number }[],
  label: string,
): Series => ({
  closes: rows.map((r) => r.close),
  bars: rows.map((r) => ({ o: r.open, h: r.high, l: r.low, c: r.close })),
  kind: "market",
  label,
});

/** 2. Traced off a screenshot. Illustrative — carries the tag. */
export const fromScreenshot = (
  anchors: Anchor[],
  {
    n,
    seed,
    label,
    wickScale,
    /**
     * How far each close may stray from the traced line, as a fraction of the
     * anchors' own range. The default keeps the turns exactly where the
     * screenshot's turns are; raise it when the reference reads CHUNKY — a
     * tape whose closes barely move draws bodies that are hairlines, however
     * right the overall shape is.
     */
    tremor,
  }: { n: number; seed: number; label?: string; wickScale?: number; tremor?: number },
): Series => {
  const closes = fromAnchors(anchors, n, seed, tremor);
  return { closes, bars: toBars(closes, seed ^ 0x5bf0, wickScale), kind: "traced", label };
};

/** 3. Synthetic by shape. Illustrative — carries the tag. */
export const fromShape = (
  opts: Parameters<typeof makeCloses>[0] & { label?: string; wickScale?: number },
): Series => {
  const closes = makeCloses(opts);
  return {
    closes,
    bars: toBars(closes, opts.seed ^ 0x2101, opts.wickScale),
    kind: "synthetic",
    label: opts.label,
  };
};

/* ── DOMAIN ───────────────────────────────────────────────────────────────── */

/**
 * The price range a chart must cover to show these whole.
 *
 * Pass EVERY series that will share the plot. Left to itself each one
 * normalises to its own range, which is how a chart quietly rigs the
 * comparison it is being asked to make.
 */
export const domainOf = (
  values: (number | null)[],
  bars: Bar[] = [],
): [number, number] => {
  const nums = values.filter((v): v is number => v !== null);
  const lows = bars.map((b) => b.l);
  const highs = bars.map((b) => b.h);
  const all = [...nums, ...lows, ...highs];
  if (!all.length) return [0, 1];
  return [Math.min(...all), Math.max(...all)];
};

/* ── INDICATOR MATHS ──────────────────────────────────────────────────────── */

/** Simple moving average. Leading warm-up is null, never zero — a zero would
 *  draw a line to the floor before the average exists. */
export const sma = (closes: number[], period: number): (number | null)[] =>
  closes.map((_, i) => {
    if (i < period - 1) return null;
    let s = 0;
    for (let k = i - period + 1; k <= i; k++) s += closes[k];
    return s / period;
  });

/** Exponential moving average, seeded on the first SMA so it starts where the
 *  SMA starts and the two can be compared from the same bar. */
export const ema = (closes: number[], period: number): (number | null)[] => {
  const k = 2 / (period + 1);
  const out: (number | null)[] = [];
  let prev: number | null = null;
  closes.forEach((c, i) => {
    if (i < period - 1) return out.push(null);
    if (prev === null) {
      let s = 0;
      for (let j = i - period + 1; j <= i; j++) s += closes[j];
      prev = s / period;
    } else prev = c * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
};

/** Bollinger bands: SMA ± mult × population standard deviation. */
export const bollinger = (
  closes: number[],
  period = 20,
  mult = 2,
): { mid: (number | null)[]; upper: (number | null)[]; lower: (number | null)[] } => {
  const mid = sma(closes, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  closes.forEach((_, i) => {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      return;
    }
    let v = 0;
    for (let k = i - period + 1; k <= i; k++) v += (closes[k] - m) ** 2;
    const sd = Math.sqrt(v / period);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
  });
  return { mid, upper, lower };
};

/** Volume that agrees with its candles: bigger on bigger bodies, with seeded
 *  variation. Illustrative only — a real export brings its own volume. */
export const volumeOf = (bars: Bar[], seed: number): number[] => {
  const rnd = seeded(seed);
  const span = Math.max(1e-9, Math.max(...bars.map((b) => b.h)) - Math.min(...bars.map((b) => b.l)));
  return bars.map((b) => {
    const body = Math.abs(b.c - b.o) / span;
    return 0.35 + body * 2.2 + rnd() * 0.5;
  });
};
