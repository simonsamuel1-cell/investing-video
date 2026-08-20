/**
 * helpers.ts — the shared timing, easing, layout and indicator utilities.
 *
 * DETERMINISM. `mulberry32` is the only source of randomness in the episode.
 * Remotion renders frames in parallel processes, so Math.random() would make
 * two renders of the same frame differ.
 */
import { interpolate } from "remotion";
import { theme } from "./theme";

const HOLD = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const { ease, easeInOut, revealF, slidePx } = theme.motion;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Seconds → frames. Every sub-timing in the build prompt is in seconds. */
export const sec = (s: number) => Math.round(s * theme.layout.fps);

export const fadeIn = (f: number, start: number, dur = revealF) =>
  interpolate(f, [start, start + dur], [0, 1], { ...HOLD, easing: ease });
export const fadeOut = (f: number, start: number, dur = revealF) =>
  1 - interpolate(f, [start, start + dur], [0, 1], { ...HOLD, easing: ease });

/** Eased 0→1. The workhorse for draws, wipes and moves. */
export const progress = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: ease });
/** Eased 0→1 on a symmetric curve — fastest exactly at its midpoint. */
export const progressInOut = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: easeInOut });

/**
 * textReveal — the ONLY entrance for words: they fade and rise 12px. Never a
 * pop, never a bounce, never a scale.
 */
export const textReveal = (f: number, start: number) => ({
  opacity: fadeIn(f, start),
  transform: `translateY(${interpolate(f, [start, start + revealF], [slidePx, 0], {
    ...HOLD,
    easing: ease,
  }).toFixed(2)}px)`,
});

/** IDX convention: dot thousands. 20350 → "20.350". */
export const fmtRp = (n: number) => Math.round(n).toLocaleString("de-DE");

/** mulberry32. The episode's only PRNG. */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A trim path, as the two attributes an SVG needs. */
export const drawPath = (f: number, start: number, dur: number, pathLength: number) => {
  const p = progress(f, start, dur);
  return { strokeDasharray: pathLength, strokeDashoffset: pathLength * (1 - p) };
};

/** An eased playhead between two x positions — for scrubbing a chart. */
export const scrub = (f: number, start: number, dur: number, fromX: number, toX: number) =>
  fromX + (toX - fromX) * progressInOut(f, start, dur);

/* ── layout modes ─────────────────────────────────────────────────────────── */

export type Mode = "A" | "B" | "C";
export type ChartBox = { x: number; y: number; w: number; h: number; dim: number };

/**
 * The chart box at this frame, interpolated between mode stops.
 *
 * The build prompt writes this as `(f, switchAt, from, to)`, which covers a
 * single switch. Scene 12B moves A → B → C, so it takes a LIST of stops
 * instead — the same idea, one more stop. Modes never cut: every change is a
 * `modeTransitionF` ease, and the chart slides and scales through it.
 *
 * `dim` is the opacity the chart's own content should carry: 1 in A and B,
 * 0.35 in C, eased across the transition like everything else.
 */
export const layoutMode = (f: number, stops: { at: number; mode: Mode }[]): ChartBox => {
  const { chartA, chartB, modeTransitionF } = theme.layout;
  const boxOf = (m: Mode) => (m === "B" ? chartB : chartA);
  const dimOf = (m: Mode) => (m === "C" ? 0.35 : 1);

  let cur = stops[0];
  let next: { at: number; mode: Mode } | null = null;
  for (const s of stops) {
    if (f >= s.at) cur = s;
    else {
      next = next ?? s;
    }
  }
  /* between two stops, `t` is how far the transition has run */
  const t =
    next && f >= next.at - 0 ? 0 : next ? progressInOut(f, next.at, modeTransitionF) : 0;
  const to = next ?? cur;
  const a = boxOf(cur.mode);
  const b = boxOf(to.mode);
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    x: mix(a.x, b.x),
    y: mix(a.y, b.y),
    w: mix(a.w, b.w),
    h: mix(a.h, b.h),
    dim: mix(dimOf(cur.mode), dimOf(to.mode)),
  };
};

/* ── indicator maths ──────────────────────────────────────────────────────── */

/**
 * All three return `null` through the warm-up rather than a number. A moving
 * average that starts on day one is a lie about how much history it had, and a
 * chart that draws it makes the indicator look like it leads price.
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
    } else prev = v[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
};

export const bollinger = (v: number[], period = 20, mult = 2) => {
  const mid = sma(v, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < v.length; i++) {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    let sq = 0;
    for (let k = 0; k < period; k++) sq += (v[i - k] - m) ** 2;
    const sd = Math.sqrt(sq / period);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
  }
  return { mid, upper, lower };
};
