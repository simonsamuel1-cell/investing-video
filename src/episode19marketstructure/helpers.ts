/**
 * helpers.ts — shared animation, scale and formatting utilities.
 *
 * The spec asks for these to be re-exported from `episode2new/helpers`; that
 * episode is not on this branch, so the same signatures are defined here and
 * this file is the one place to swap for a re-export when the shared module
 * lands. Every curve pulls theme.motion — no raw easing anywhere else.
 *
 * Determinism: mulberry32 ONLY. Remotion renders frames in parallel processes,
 * so Math.random() would make two renders differ.
 */
import { interpolate } from "remotion";
import { theme } from "./theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = theme.motion.ease;

/** Seconds → frames at the canvas fps. */
export const sec = (s: number) => Math.round(s * theme.canvas.fps);

/** Fade 0→1 over `dur` frames from scene-local `start`. */
export const fadeIn = (f: number, start: number, dur: number = theme.motion.fadeFrames) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Fade 1→0 over `dur` frames from scene-local `start`. */
export const fadeOut = (f: number, start: number, dur: number = theme.motion.fadeFrames) =>
  interpolate(f, [start, start + dur], [1, 0], { ...CLAMP, easing: ease });

/**
 * textReveal — the ONLY entrance for type: fade + upward slide. No pop, no
 * bounce, ever. Returns { opacity, y }; `rise` is the px the text travels.
 */
export const textReveal = (f: number, start: number, dur: number = theme.motion.revealFrames, rise = 18) => ({
  opacity: interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease }),
  y: interpolate(f, [start, start + dur], [rise, 0], { ...CLAMP, easing: ease }),
});

/** Eased 0→1 over [start, start+dur] — trim paths, wipes, moves. */
export const progress = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Eased 0→1 with a SYMMETRIC curve — fastest at the midpoint. */
export const progressInOut = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: theme.motion.easeInOut });

/** Linear (un-eased) 0→1 — strict-timing reveals where arc mapping must be exact. */
export const linear = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], CLAMP);

/** One half-sine pulse, 0→1→0, over `dur` frames. UI emphasis only. */
export const pulse = (f: number, start: number, dur: number) =>
  f >= start && f < start + dur ? Math.sin(((f - start) / dur) * Math.PI) : 0;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** IDX price format — dot thousands separator, e.g. 4400 → "4.400". */
export const fmtPrice = (n: number) => Math.round(n).toLocaleString("de-DE");

/** Rupiah label, e.g. 40000 → "Rp40.000". */
export const fmtRp = (n: number) => `Rp${fmtPrice(n)}`;

/** Percentage with a comma decimal, e.g. 2.7 → "+2,7%". */
export const fmtPct = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1).replace(".", ",")}%`;

/** Deterministic seeded PRNG — renders must be frame-stable and repeatable. */
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

/** price → y for a chart box (higher price → smaller y), padded at both ends. */
export const priceScale = (min: number, max: number, top: number, bottom: number, pad = 0.06) => {
  const span = Math.max(1, max - min);
  return (price: number) => interpolate(price, [min - span * pad, max + span * pad], [bottom, top], CLAMP);
};

/** The rectangle every chart primitive draws inside. */
export type Box = { x: number; y: number; w: number; h: number };
