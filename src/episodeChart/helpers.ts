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
export const fadeIn = (f: number, start: number, dur: number = theme.motion.fadeFrames) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Fade 1→0 over `dur` frames starting at scene-local `start`. */
export const fadeOut = (f: number, start: number, dur: number = theme.motion.fadeFrames) =>
  interpolate(f, [start, start + dur], [1, 0], { ...CLAMP, easing: ease });

/**
 * textReveal — the ONLY entrance for type: fade + upward slide (no pop/bounce).
 * Returns { opacity, y }; `rise` = px the text travels up.
 */
export const textReveal = (f: number, start: number, dur: number = theme.motion.revealFrames, rise = 18) => ({
  opacity: interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease }),
  y: interpolate(f, [start, start + dur], [rise, 0], { ...CLAMP, easing: ease }),
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
export const fmtRp = (n: number) => `Rp ${Math.round(n).toLocaleString("en-US")}`;

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

/** Price along an intraday path at session-time t (linear between points). */
export const pathPriceAt = (path: SessionPoint[], t: number) => {
  if (t <= path[0].t) return path[0].price;
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
export const pathOHLC = (path: SessionPoint[], t: number): OHLC => {
  const open = path[0].price;
  const close = pathPriceAt(path, t);
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
export const priceScale = (min: number, max: number, top: number, bottom: number, pad = 0.06) => {
  const span = Math.max(1, max - min);
  const lo = min - span * pad;
  const hi = max + span * pad;
  return (price: number) => interpolate(price, [lo, hi], [bottom, top], CLAMP);
};
