/**
 * data/structures.ts — every price shape in the episode, defined by its PIVOTS.
 *
 * The whole video argues that a chart is peaks and troughs, so that is exactly
 * how the lines are authored here: a list of turning points, and a generator
 * that fills the space between them. Two consequences worth knowing:
 *
 *   · A label never has to be positioned by hand. "Higher High" is drawn at
 *     pivot 1 of UPTREND, so if the shape is edited the label follows it.
 *   · The wiggle between pivots is windowed to zero AT each pivot, so noise can
 *     never invent a peak higher than the peak, or a trough lower than the
 *     trough. The structure the narration describes is the structure on screen.
 *
 * These are ILLUSTRATIVE shapes — no ticker is attached to any of them, and
 * none is presented as a real instrument. The one real security in the episode
 * is ASII in SC18, which lives in data/asii.ts.
 */
import { mulberry32, type Box } from "../helpers";

/** A turning point: `t` 0→1 across the plot width, `p` in price units. */
export type Pivot = { t: number; p: number };
export type Pt = { x: number; y: number };

export type Structure = {
  pivots: Pivot[];
  /** Dense samples — `t` ascending 0→1. */
  pts: { t: number; p: number }[];
  min: number;
  max: number;
};

const smoothstep = (u: number) => u * u * (3 - 2 * u);

/**
 * Smooth 1-D value noise: random nodes, smoothstep between them. Deterministic
 * (mulberry32), because Remotion renders frames in parallel processes and a
 * series that differs per frame would strobe.
 */
const noiseField = (seed: number, nodes: number) => {
  const rnd = mulberry32(seed);
  const v = Array.from({ length: nodes + 1 }, () => rnd() * 2 - 1);
  return (u: number) => {
    const q = Math.max(0, Math.min(1, u)) * nodes;
    const i = Math.min(nodes - 1, Math.floor(q));
    return v[i] + (v[i + 1] - v[i]) * smoothstep(q - i);
  };
};

/**
 * Build the dense line through a pivot list.
 *
 * `wiggle` is a fraction of the FULL price range, and it is multiplied by
 * sin(π·u) inside each leg — full strength mid-leg, exactly zero at both
 * pivots. That is what keeps the pivots the true extremes.
 */
export const structure = (pivots: Pivot[], { n = 320, seed = 11, wiggle = 0.02 } = {}): Structure => {
  const prices = pivots.map((v) => v.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(1, max - min);
  const noise = noiseField(seed, Math.max(6, Math.round(n / 10)));

  const pts: { t: number; p: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let k = 0;
    while (k < pivots.length - 2 && t > pivots[k + 1].t) k++;
    const a = pivots[k];
    const b = pivots[k + 1];
    const u = Math.max(0, Math.min(1, (t - a.t) / Math.max(1e-6, b.t - a.t)));
    const base = a.p + (b.p - a.p) * smoothstep(u);
    pts.push({ t, p: base + noise(t) * range * wiggle * Math.sin(Math.PI * u) });
  }
  const lo = Math.min(min, ...pts.map((s) => s.p));
  const hi = Math.max(max, ...pts.map((s) => s.p));
  return { pivots, pts, min: lo, max: hi };
};

// ── geometry ────────────────────────────────────────────────────────────────

export type Geom = {
  x: (t: number) => number;
  y: (p: number) => number;
  /** Screen point of pivot `i`. */
  pivot: (i: number) => Pt;
  pts: Pt[];
  path: string;
  /** Polyline length — feeds strokeDasharray for a trim-path draw. */
  len: number;
  /** The point at parameter `t` — for parking a label somewhere along the line. */
  headAt: (t: number) => Pt;
  /**
   * The point at DRAW progress `p`, measured along the line's length.
   *
   * This is the one a head dot must use. A trim path advances by arc length, so
   * on a steep leg the parameter and the drawn end diverge — sampling by `t`
   * leaves the dot floating off the end of the line.
   */
  atArc: (p: number) => Pt;
  /**
   * The DRAW progress at which the trim path passes `t`.
   *
   * A trim path advances by arc length, not by t, so a steep leg is drawn
   * slower than a flat one of the same width. Scenes use this to land a label
   * the moment the line actually reaches its pivot — never before it.
   */
  arcAt: (t: number) => number;
};

/**
 * Map a structure into a box. `range` pins the price scale explicitly, which is
 * what lets two scenes (SC05/SC06, SC12/SC13, SC14/SC15) share one chart across
 * a boundary without the axis jumping.
 */
export const geom = (s: Structure, box: Box, { pad = 0.1, range }: { pad?: number; range?: [number, number] } = {}): Geom => {
  const lo = range ? range[0] : s.min;
  const hi = range ? range[1] : s.max;
  const span = Math.max(1, hi - lo);
  const x = (t: number) => box.x + box.w * Math.max(0, Math.min(1, t));
  const y = (p: number) => box.y + box.h * (1 - pad) - ((p - lo) / span) * box.h * (1 - pad * 2);
  const pts = s.pts.map((v) => ({ x: x(v.t), y: y(v.p) }));

  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const len = cum[cum.length - 1];

  const arcAt = (t: number) => {
    if (len <= 0) return 0;
    const q = Math.max(0, Math.min(1, t)) * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(q));
    return (cum[i] + (cum[i + 1] - cum[i]) * (q - i)) / len;
  };

  const headAt = (t: number) => {
    const q = Math.max(0, Math.min(1, t)) * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(q));
    const u = q - i;
    return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * u, y: pts[i].y + (pts[i + 1].y - pts[i].y) * u };
  };

  const atArc = (p: number) => {
    const target = Math.max(0, Math.min(1, p)) * len;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    const seg = cum[i] - cum[i - 1];
    const u = seg > 0 ? (target - cum[i - 1]) / seg : 0;
    return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u };
  };

  return {
    x,
    y,
    pivot: (i) => ({ x: x(s.pivots[i].t), y: y(s.pivots[i].p) }),
    pts,
    path: pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "),
    len,
    headAt,
    atArc,
    arcAt,
  };
};

// ── OHLC from a structure ───────────────────────────────────────────────────

/** `date` is only carried by the real series (SC18); drawn shapes omit it. */
export type OHLC = { o: number; h: number; l: number; c: number; date?: string };

/**
 * Candles whose CLOSES trace the structure exactly. SC03 cross-fades the SC01
 * candles into a line; because both come from here, that dissolve is a fact
 * about the same data rather than two drawings that happen to look alike.
 */
export const candlesFrom = (s: Structure, count: number, seed = 5): OHLC[] => {
  const rnd = mulberry32(seed);
  const range = s.max - s.min;
  const at = (i: number) => s.pts[Math.round((i / count) * (s.pts.length - 1))].p;
  const out: OHLC[] = [];
  for (let i = 0; i < count; i++) {
    const c = at(i + 1);
    const o = i === 0 ? at(0) : out[i - 1].c;
    const wick = range * (0.008 + rnd() * 0.018);
    out.push({ o, c, h: Math.max(o, c) + wick, l: Math.min(o, c) - wick });
  }
  return out;
};

// ═══ THE SHAPES ═════════════════════════════════════════════════════════════

/**
 * SC01 → SC03. Deliberately unreadable: three peaks at nearly the same height
 * and three troughs likewise, so "naik? turun? sideways?" has no easy answer.
 * SC03 then lands Puncak/Lembah markers on these exact pivots.
 */
export const AMBIGUOUS = structure(
  [
    { t: 0, p: 4820 },
    { t: 0.13, p: 5180 },
    { t: 0.26, p: 4790 },
    { t: 0.4, p: 5230 },
    { t: 0.53, p: 4760 },
    { t: 0.67, p: 5150 },
    { t: 0.8, p: 4820 },
    { t: 0.91, p: 5120 },
    { t: 1, p: 4950 },
  ],
  { seed: 31, wiggle: 0.03 },
);

export const AMBIGUOUS_CANDLES = candlesFrom(AMBIGUOUS, 46, 17);
/** Round gridlines for that chart — a price axis should read in familiar steps. */
export const AMBIGUOUS_TICKS = [4800, 5000, 5200];

/**
 * SC04 — why the shape forms. Rise, profit-taking pullback that stops ABOVE the
 * prior low, then the push to a new peak. Pivot 0 is the prior low the dashed
 * line marks; pivot 2 is the pullback that has to stay above it.
 */
export const MECHANISM = structure(
  [
    { t: 0, p: 4500 },
    { t: 0.36, p: 5400 },
    { t: 0.62, p: 5000 },
    { t: 1, p: 5900 },
  ],
  { seed: 7, wiggle: 0.016 },
);

/**
 * SC05 + SC06 — one staircase, two scenes. The prices ARE the narrated ones:
 * pivots 1–4 are 5.000 / 4.600 / 5.400 / 4.900, so SC06's tags are read off the
 * shape rather than typed next to it.
 */
export const UPTREND = structure(
  [
    { t: 0, p: 4300 },
    { t: 0.14, p: 5000 },
    { t: 0.28, p: 4600 },
    { t: 0.45, p: 5400 },
    { t: 0.59, p: 4900 },
    { t: 0.77, p: 5800 },
    { t: 0.89, p: 5300 },
    { t: 1, p: 5950 },
  ],
  { seed: 23, wiggle: 0.014 },
);
/** Indices into UPTREND.pivots — peaks are HH, troughs are HL. */
export const UP_PEAKS = [1, 3, 5];
export const UP_TROUGHS = [2, 4, 6];

/** SC07 — the same argument upside down. Peaks fall, troughs fall. */
export const DOWNTREND = structure(
  [
    { t: 0, p: 5900 },
    { t: 0.16, p: 5100 },
    { t: 0.3, p: 5500 },
    { t: 0.46, p: 4750 },
    { t: 0.6, p: 5150 },
    { t: 0.76, p: 4400 },
    { t: 0.88, p: 4750 },
    { t: 1, p: 4150 },
  ],
  { seed: 29, wiggle: 0.014 },
);
export const DOWN_PEAKS = [2, 4, 6];
export const DOWN_TROUGHS = [1, 3, 5];

/** SC08 — the background drift behind the principle card. Muted, unlabelled. */
export const DRIFT = structure(
  [
    { t: 0, p: 4600 },
    { t: 0.22, p: 5050 },
    { t: 0.36, p: 4880 },
    { t: 0.6, p: 5400 },
    { t: 0.74, p: 5200 },
    { t: 1, p: 5750 },
  ],
  { seed: 41, wiggle: 0.02 },
);

/** SC09 — peaks and troughs landing at the same two levels, over and over. */
export const SIDEWAYS = structure(
  [
    { t: 0, p: 4870 },
    { t: 0.12, p: 5180 },
    { t: 0.24, p: 4830 },
    { t: 0.36, p: 5200 },
    { t: 0.48, p: 4820 },
    { t: 0.6, p: 5170 },
    { t: 0.72, p: 4845 },
    { t: 0.84, p: 5190 },
    { t: 1, p: 4880 },
  ],
  { seed: 13, wiggle: 0.018 },
);
export const SIDEWAYS_PEAKS = [1, 3, 5, 7];
export const SIDEWAYS_TROUGHS = [0, 2, 4, 6, 8];
/** The channel the oscillation lives in — drawn as two dashed boundaries. */
export const SIDEWAYS_CHANNEL: [number, number] = [4820, 5200];

/**
 * SC10 — one curve through the whole cycle: markdown, base, markup, top,
 * markdown again. The two flat stretches are where the phase bands sit.
 */
export const CYCLE = structure(
  [
    { t: 0, p: 6300 },
    { t: 0.06, p: 5850 },
    { t: 0.1, p: 6000 },
    { t: 0.16, p: 5200 },
    { t: 0.21, p: 5450 },
    { t: 0.28, p: 4650 },
    { t: 0.33, p: 4820 },
    { t: 0.38, p: 4600 },
    { t: 0.43, p: 4830 },
    { t: 0.48, p: 4620 },
    { t: 0.54, p: 5300 },
    { t: 0.59, p: 5150 },
    { t: 0.65, p: 5800 },
    { t: 0.7, p: 5650 },
    { t: 0.755, p: 6350 },
    { t: 0.795, p: 6180 },
    { t: 0.835, p: 6420 },
    { t: 0.875, p: 6200 },
    { t: 0.915, p: 6400 },
    { t: 0.96, p: 5700 },
    { t: 1, p: 5300 },
  ],
  { seed: 3, wiggle: 0.012 },
);
/** Phase windows in `t`, in narration order. */
export const CYCLE_PHASES = {
  markdown: [0, 0.28] as [number, number],
  accumulation: [0.28, 0.5] as [number, number],
  markup: [0.5, 0.755] as [number, number],
  distribution: [0.755, 0.93] as [number, number],
  again: [0.93, 1] as [number, number],
};

/**
 * SC11 — a months-long climb. The minor swings are the wiggle itself, so the
 * "thin zigzag riding the trend" is literally the same series drawn twice: once
 * smoothed to the pivots, once with its swings.
 */
export const MAJOR = structure(
  [
    { t: 0, p: 4400 },
    { t: 0.12, p: 4950 },
    { t: 0.2, p: 4720 },
    { t: 0.33, p: 5350 },
    { t: 0.42, p: 5120 },
    { t: 0.56, p: 5850 },
    { t: 0.65, p: 5600 },
    { t: 0.79, p: 6350 },
    { t: 0.88, p: 6100 },
    { t: 1, p: 6700 },
  ],
  { seed: 19, wiggle: 0.045 },
);
/** The swing the zoom lens opens on — one red candle inside a rising trend. */
export const MAJOR_LENS: [number, number] = [0.4, 0.47];

/** SC11 module 2 — the same distance climbed at two speeds. */
export const GRADUAL = structure(
  [
    { t: 0, p: 4600 },
    { t: 0.3, p: 4950 },
    { t: 0.45, p: 4870 },
    { t: 0.72, p: 5300 },
    { t: 0.85, p: 5220 },
    { t: 1, p: 5600 },
  ],
  { seed: 37, wiggle: 0.016 },
);
export const VERTICAL = structure(
  [
    { t: 0, p: 4600 },
    { t: 0.55, p: 4700 },
    { t: 0.72, p: 4900 },
    { t: 0.86, p: 5250 },
    { t: 1, p: 5600 },
  ],
  { seed: 43, wiggle: 0.012 },
);

/**
 * SC12 — ceiling becomes floor. Two rejections at 5.200, a break through it,
 * then a retest that holds: pivot 6 is the higher low the narration names.
 */
export const BREAK_UP = structure(
  [
    { t: 0, p: 4800 },
    { t: 0.1, p: 5150 },
    { t: 0.2, p: 4900 },
    { t: 0.32, p: 5170 },
    { t: 0.44, p: 4860 },
    { t: 0.6, p: 5480 },
    { t: 0.7, p: 5240 },
    { t: 0.86, p: 5800 },
    { t: 0.94, p: 5620 },
    { t: 1, p: 5900 },
  ],
  { seed: 53, wiggle: 0.012 },
);
export const BREAK_UP_LEVEL = 5200;
/** Pivot index of the retest that becomes the higher low. */
export const BREAK_UP_HL = 6;

/** SC13 — the mirror. Pivot 6 is the rejection that becomes the lower high. */
export const BREAK_DOWN = structure(
  [
    { t: 0, p: 5400 },
    { t: 0.1, p: 5050 },
    { t: 0.2, p: 5300 },
    { t: 0.32, p: 5030 },
    { t: 0.44, p: 5250 },
    { t: 0.6, p: 4680 },
    { t: 0.7, p: 4960 },
    { t: 0.86, p: 4400 },
    { t: 0.94, p: 4580 },
    { t: 1, p: 4300 },
  ],
  { seed: 59, wiggle: 0.012 },
);
export const BREAK_DOWN_LEVEL = 5000;
export const BREAK_DOWN_LH = 6;

/**
 * SC14 + SC15 — one chart, two scenes. SC14 draws to the failed peak and stops
 * there; SC15 resumes from the same frame and breaks the prior trough.
 *
 *   pivot 3 (5.400) is the last real higher high — the dashed reference line
 *   pivot 4 (5.150) is the trough SC15 has to break
 *   pivot 5 (5.320) is the push that stalls BELOW the line
 *   pivot 6 (4.900) is the lower low that confirms it
 */
export const FAILURE = structure(
  [
    { t: 0, p: 4600 },
    { t: 0.1, p: 5100 },
    { t: 0.18, p: 4850 },
    { t: 0.32, p: 5400 },
    { t: 0.44, p: 5150 },
    { t: 0.58, p: 5320 },
    { t: 0.8, p: 4900 },
    { t: 0.9, p: 5120 },
    { t: 1, p: 4820 },
  ],
  { seed: 61, wiggle: 0.011 },
);
export const FAIL_LAST_HH = 3;
export const FAIL_PRIOR_LOW = 4;
export const FAIL_PEAK = 5;
export const FAIL_LL = 6;
/** How much of the line SC14 owns — it stops ON the failed peak (pivot 5). */
export const FAIL_SC14_END = 0.58;

/**
 * SC16 — ONE daily uptrend. The "5-minute chart" is not a different series, it
 * is this one magnified over TF_WINDOW: the trap is that the same move looks
 * like a collapse close up and like a higher low from further back.
 */
export const TIMEFRAME = structure(
  [
    { t: 0, p: 4500 },
    { t: 0.12, p: 4900 },
    { t: 0.2, p: 4720 },
    { t: 0.34, p: 5250 },
    { t: 0.45, p: 5050 },
    { t: 0.58, p: 5600 },
    { t: 0.68, p: 5400 },
    { t: 0.82, p: 5950 },
    { t: 0.9, p: 5750 },
    { t: 1, p: 6200 },
  ],
  { seed: 67, wiggle: 0.014 },
);
/** The stretch the 5-minute view is zoomed into. Its right edge is the HL. */
export const TF_WINDOW: [number, number] = [0.56, 0.71];
export const TF_HL = 6;

/** Cut a `t` window out of a structure and re-normalise it to 0→1. */
export const zoom = (s: Structure, win: [number, number]): Structure => {
  const [a, b] = win;
  const pts = s.pts.filter((v) => v.t >= a && v.t <= b).map((v) => ({ t: (v.t - a) / (b - a), p: v.p }));
  const pivots = s.pivots.filter((v) => v.t >= a && v.t <= b).map((v) => ({ t: (v.t - a) / (b - a), p: v.p }));
  const ps = pts.map((v) => v.p);
  return { pivots, pts, min: Math.min(...ps), max: Math.max(...ps) };
};
