/**
 * helpers.ts — shared animation, scale, and formatting utilities.
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

/** Linear (un-eased) 0→1 — pings, playback, strict-timing wipes. */
export const linear = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], CLAMP);

/** Clamped 0→1 with no easing. */
export const clampProgress = (f: number, start: number, dur: number) =>
  Math.min(1, Math.max(0, (f - start) / Math.max(1, dur)));

/** IDX price format — dot thousands separator, e.g. 4570 → "4.570". */
export const fmtPrice = (n: number) => Math.round(n).toLocaleString("de-DE");

/** Rupiah label, e.g. 40000 → "Rp40.000". */
export const fmtRp = (n: number) => `Rp${fmtPrice(n)}`;

/** Percentage with comma decimal, e.g. 2.7 → "+2,7%". */
export const fmtPct = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1).replace(".", ",")}%`;

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

/** Chart box rectangle used by every chart component. */
export type Box = { x: number; y: number; w: number; h: number };
