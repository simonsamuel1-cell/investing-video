/**
 * helpers.ts — the shared timing, easing and formatting utilities.
 *
 * The spec asks for these to come from `episode2new/helpers`; that module is
 * not on this branch, so they are defined here with the same names and this
 * file becomes the single re-export point when it lands.
 *
 * DETERMINISM. `seeded` is the only source of randomness in the episode.
 * Remotion renders frames in parallel processes, so Math.random() would make
 * two renders of the same frame differ.
 */
import { interpolate } from "remotion";
import { theme } from "./theme";

const HOLD = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const settle = theme.motion.settle;

/** Seconds → frames. */
export const sec = (s: number) => Math.round(s * theme.canvas.fps);

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Eased 0→1 across [at, at+over]. The workhorse for draws, wipes and moves. */
export const progress = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: settle });

/** Eased 0→1 with a symmetric curve — fastest exactly at its midpoint. */
export const progressInOut = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: theme.motion.inOut });

/** Un-eased 0→1. Use where a frame must map to a position exactly. */
export const ramp = (f: number, at: number, over: number) => interpolate(f, [at, at + over], [0, 1], HOLD);

export const fadeIn = (f: number, at: number, over: number = theme.motion.fade) => progress(f, at, over);
export const fadeOut = (f: number, at: number, over: number = theme.motion.fade) => 1 - progress(f, at, over);

/**
 * textReveal — the ONLY entrance for words: they fade and rise. Never a pop,
 * never a bounce, never a rotation.
 */
export const textReveal = (f: number, at: number, over: number = theme.motion.reveal, rise = 18) => ({
  opacity: progress(f, at, over),
  dy: interpolate(f, [at, at + over], [rise, 0], { ...HOLD, easing: settle }),
});

/** One half-sine, 0→1→0. Emphasis on a UI element; never on type. */
export const beat = (f: number, at: number, over: number) => (f >= at && f < at + over ? Math.sin(((f - at) / over) * Math.PI) : 0);

/**
 * hold — a value that steps between keyframes and STAYS PUT in between.
 *
 * This is what a freeze is built from: give it two keyframes with the same
 * value and the picture genuinely stops rather than creeping.
 */
export const hold = (f: number, keys: number[], vals: number[]) =>
  interpolate(f, keys, vals, { ...HOLD, easing: settle });

/** IDX price format — dot thousands, e.g. 4400 → "4.400". */
export const price = (n: number) => Math.round(n).toLocaleString("de-DE");

/** Rupiah, e.g. 40000 → "Rp40.000". */
export const fmtRp = (n: number) => `Rp${price(n)}`;

/** Percent with a comma decimal, e.g. 2.7 → "+2,7%". */
export const pct = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1).replace(".", ",")}%`;

/** mulberry32. The episode's only PRNG. */
export const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type Rect = { x: number; y: number; w: number; h: number };

/** Shrink a rect by equal insets — used to place a plot inside a panel. */
export const inset = (r: Rect, dx: number, dy = dx): Rect => ({ x: r.x + dx, y: r.y + dy, w: r.w - dx * 2, h: r.h - dy * 2 });

/** Split a rect into `n` columns with a gap between them. */
export const columns = (r: Rect, n: number, gap: number): Rect[] => {
  const w = (r.w - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ x: r.x + i * (w + gap), y: r.y, w, h: r.h }));
};

/**
 * ═══ INDICATOR MATHS ═══
 *
 * All three take and return plain arrays, and all three return `null` for the
 * warm-up bars rather than a number. A moving average that starts on day 1 is
 * not a moving average — it is a lie about how much history it had, and a chart
 * that draws it makes the indicator look like it leads price.
 */
export const sma = (v: number[], period: number): (number | null)[] =>
  v.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = 0; k < period; k++) sum += v[i - k];
    return sum / period;
  });

/** Seeded by the SMA of its first window, so it does not start from thin air. */
export const ema = (v: number[], period: number): (number | null)[] => {
  const k = 2 / (period + 1);
  const out: (number | null)[] = [];
  let prev: number | null = null;
  for (let i = 0; i < v.length; i++) {
    if (i < period - 1) {
      out.push(null);
      continue;
    }
    if (prev === null) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += v[i - j];
      prev = sum / period;
    } else {
      prev = v[i] * k + prev * (1 - k);
    }
    out.push(prev);
  }
  return out;
};

/** Middle, upper, lower — and the width, which is what a squeeze is measured in. */
export const bollinger = (v: number[], period = 20, mult = 2) => {
  const mid = sma(v, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  const width: (number | null)[] = [];
  for (let i = 0; i < v.length; i++) {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      width.push(null);
      continue;
    }
    let sq = 0;
    for (let k = 0; k < period; k++) sq += (v[i - k] - m) ** 2;
    const sd = Math.sqrt(sq / period);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
    /** Normalised, so a squeeze is comparable across price levels. */
    width.push((2 * mult * sd) / m);
  }
  return { mid, upper, lower, width };
};

/**
 * ═══ FORMATTING ═══
 * IDX convention throughout: dot thousands, comma decimals. `fmtRp` is above,
 * with `price`.
 */
export const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1).replace(".", ",")}%`;
export const fmtVol = (n: number) =>
  n >= 1e9
    ? `${(n / 1e9).toFixed(1).replace(".", ",")} B`
    : `${(n / 1e6).toFixed(1).replace(".", ",")} M`;

/**
 * A trim path, as the two attributes an SVG needs. `length` is the path's own
 * measured length — pass a straight-line approximation only for lines.
 */
export const drawPath = (f: number, at: number, over: number, length: number) => {
  const p = progress(f, at, over);
  return { strokeDasharray: length, strokeDashoffset: length * (1 - p) };
};

/** An eased playhead between two x positions — for scrubbing a chart. */
export const scrub = (f: number, at: number, over: number, fromX: number, toX: number) =>
  fromX + (toX - fromX) * progressInOut(f, at, over);
