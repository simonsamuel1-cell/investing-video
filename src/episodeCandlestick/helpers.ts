/**
 * helpers.ts — shared animation, path, and formatting utilities.
 * All easing pulls theme.motion.ease; no raw curves anywhere else.
 * Determinism: mulberry32 only — NEVER Math.random().
 */
import { interpolate } from "remotion";
import { theme } from "./theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = theme.motion.ease;

/** seconds → frames at the canvas fps. */
export const sec = (s: number) => Math.round(s * theme.canvas.fps);

/** Fade 0→1 over `dur` frames starting at scene-local `start`. */
export const fadeIn = (
  f: number,
  start: number,
  dur: number = theme.motion.fadeFrames,
) => interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Fade 1→0 over `dur` frames starting at scene-local `start`. */
export const fadeOut = (
  f: number,
  start: number,
  dur: number = theme.motion.fadeFrames,
) => interpolate(f, [start, start + dur], [1, 0], { ...CLAMP, easing: ease });

/**
 * textReveal — the ONLY entrance for type: fade + upward slide (no pop/bounce).
 * Returns { opacity, y }; `rise` = px the text travels up.
 */
export const textReveal = (
  f: number,
  start: number,
  dur: number = theme.motion.revealFrames,
  rise = 18,
) => ({
  opacity: interpolate(f, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: ease,
  }),
  y: interpolate(f, [start, start + dur], [rise, 0], {
    ...CLAMP,
    easing: ease,
  }),
});

/** Eased 0→1 progress over [start, start+dur] — trim paths, wipes, moves. */
export const progress = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Linear (un-eased) 0→1 — pings, session playback, strict-timing wipes. */
export const linear = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], CLAMP);

/** Session/playback progress 0→1 over [start, start+dur], clamped, un-eased. */
export const clampProgress = (f: number, start: number, dur: number) =>
  Math.min(1, Math.max(0, (f - start) / Math.max(1, dur)));

/** Rp currency label, e.g. 1305 → "Rp 1,305". */
export const fmtRp = (n: number) =>
  `Rp ${Math.round(n).toLocaleString("en-US")}`;

/** Deterministic seeded PRNG — renders must be frame-stable. */
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

export type OHLC = { open: number; high: number; low: number; close: number };

export type SessionPoint = { t: number; price: number }; // t 0–1 across the session

/**
 * Monotone cubic slopes (Fritsch–Carlson) for points with increasing x. The
 * curve through them is smooth yet never overshoots: every peak and trough
 * stays exactly at a point, so a line drawn with it keeps the high and low the
 * candles beside it are built from.
 */
const monotoneSlopes = (xs: number[], ys: number[]) => {
  const n = xs.length;
  const d = xs
    .slice(1)
    .map((x, i) => (ys[i + 1] - ys[i]) / Math.max(1e-9, x - xs[i]));
  const m = xs.map((_, i) =>
    i === 0
      ? d[0]
      : i === n - 1
        ? d[n - 2]
        : d[i - 1] * d[i] <= 0
          ? 0
          : (d[i - 1] + d[i]) / 2,
  );
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  return m;
};

/**
 * ⚠ SMOOTH IN THE INDONESIAN CUT — Simon: "semua line chart, coba buat lebih
 * smooth, jangan bersudut". The SVG path through points with increasing x, as
 * monotone cubic Béziers; the English cut keeps its straight segments.
 */
export const smoothLineD = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return "";
  const m = monotoneSlopes(
    pts.map((p) => p.x),
    pts.map((p) => p.y),
  );
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const h = (b.x - a.x) / 3;
    d += ` C${(a.x + h).toFixed(2)},${(a.y + m[i] * h).toFixed(2)} ${(b.x - h).toFixed(2)},${(b.y - m[i + 1] * h).toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
  }
  return d;
};

/**
 * Price along an intraday path at session-time t: linear between points, or —
 * `smooth`, the Indonesian cut — on the monotone cubic through them.
 */
export const pathPriceAt = (
  path: SessionPoint[],
  t: number,
  smooth = false,
) => {
  if (t <= path[0].t) return path[0].price;
  if (smooth && path.length > 2) {
    const i = Math.max(0, path.findIndex((p) => p.t >= t) - 1);
    if (path[i + 1] === undefined) return path[path.length - 1].price;
    const m = monotoneSlopes(
      path.map((p) => p.t),
      path.map((p) => p.price),
    );
    const a = path[i];
    const b = path[i + 1];
    const h = Math.max(1e-6, b.t - a.t);
    const s = (t - a.t) / h;
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * a.price +
      (s3 - 2 * s2 + s) * h * m[i] +
      (-2 * s3 + 3 * s2) * b.price +
      (s3 - s2) * h * m[i + 1]
    );
  }
  for (let i = 1; i < path.length; i++) {
    if (t <= path[i].t) {
      const a = path[i - 1];
      const b = path[i];
      const q = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return a.price + (b.price - a.price) * q;
    }
  }
  return path[path.length - 1].price;
};

/**
 * Live OHLC derived from the path up to session-time t — the LiveCandle contract.
 * open fixed at path[0]; high/low/close update live. Never duplicated by hand.
 */
export const pathOHLC = (
  path: SessionPoint[],
  t: number,
  smooth = false,
): OHLC => {
  const open = path[0].price;
  const close = pathPriceAt(path, t, smooth);
  let high = Math.max(open, close);
  let low = Math.min(open, close);
  for (const p of path) {
    if (p.t <= t) {
      high = Math.max(high, p.price);
      low = Math.min(low, p.price);
    }
  }
  return { open, high, low, close };
};

/**
 * priceScale — price→y mapping for a chart box (higher price → smaller y),
 * padded by `pad` fraction so extremes don't touch the panel edges.
 */
export const priceScale = (
  min: number,
  max: number,
  top: number,
  bottom: number,
  pad = 0.06,
) => {
  const span = Math.max(1, max - min);
  const lo = min - span * pad;
  const hi = max + span * pad;
  return (price: number) => interpolate(price, [lo, hi], [bottom, top], CLAMP);
};
