/**
 * Animation + formatting helpers for the Event-Driven episode. Re-exports the
 * shared frame-driven helpers and adds the ones this episode's spec names
 * (textReveal, fmtRp, mulberry32, tween, blink helpers). All are frame-driven
 * (interpolate/Easing) — no CSS transitions, which desync at render.
 */
import { interpolate, Easing } from "remotion";

export { fadeIn, fadeOut, ease, EASE } from "../util/anim";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Generic clamped, eased interpolate (alias kept explicit for scene readability). */
export const tween = (frame: number, range: [number, number], out: [number, number]) =>
  interpolate(frame, range, out, { ...CLAMP, easing: E });

/**
 * textReveal — the subtle fade + slight upward slide used for ALL type. Returns
 * an object spread onto a style ({ opacity, transform }). No pop/bounce on text.
 */
export const textReveal = (frame: number, start: number, dur = 16, dist = 14) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing: E }),
  transform: `translateY(${interpolate(frame, [start, start + dur], [dist, 0], { ...CLAMP, easing: E })}px)`,
});

/**
 * pop — springy scale 0→1 for UI elements only (chips, cursor pings, button
 * highlights). A small overshoot then settle; frame-driven, deterministic.
 */
export const pop = (frame: number, start: number, dur = 14) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP });
  const overshoot = Math.sin(t * Math.PI) * 0.08 * (1 - t);
  return { opacity: interpolate(frame, [start, start + dur * 0.6], [0, 1], { ...CLAMP, easing: E }), scale: t + overshoot };
};

/**
 * blinkTwice — two blinks in, then hold solid, then fade at the tail. Used for
 * highlight boxes that should draw the eye when they appear.
 */
export const blinkTwice = (frame: number, start: number, end: number) => {
  if (frame < start) return 0;
  if (frame >= end) return 0;
  const blinkSpan = 34; // two ~17f blinks
  if (frame < start + blinkSpan) {
    const p = (frame - start) / 17; // 0..2
    return Math.abs(Math.sin(p * Math.PI));
  }
  // hold, then fade out over the last 12f
  return interpolate(frame, [end - 12, end], [1, 0], { ...CLAMP, easing: E });
};

/** Rupiah formatter (id-ID grouping). */
export const fmtRp = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** Deterministic PRNG — seed once, never Math.random(). */
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
