/**
 * core/helpers.ts — shared timing, easing, formatting and geometry.
 *
 * ⚠ EVERY `over` AND `at` ARGUMENT HERE IS IN FRAMES, and that is deliberate:
 * these are called from a component that already knows its own frame. What must
 * never happen is a component INVENTING a frame count. Get durations from
 * `useMotion()`, which converts theme.motion's seconds at the Composition's own
 * fps — see core/useMotion.ts.
 *
 * DETERMINISM. `seeded` is the only source of randomness. Remotion renders
 * frames in parallel processes, so Math.random() would make two renders of the
 * same frame differ.
 */
import { interpolate } from "remotion";
import { theme } from "./theme";

const HOLD = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const settle = theme.motion.settle;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Eased 0→1 across [at, at+over]. The workhorse for draws, wipes and moves. */
export const progress = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: settle });

/** Eased 0→1 with a symmetric curve — fastest exactly at its midpoint. */
export const progressInOut = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], { ...HOLD, easing: theme.motion.inOut });

/** Un-eased 0→1. Use where a frame must map to a position exactly. */
export const ramp = (f: number, at: number, over: number) =>
  interpolate(f, [at, at + over], [0, 1], HOLD);

export const fadeIn = (f: number, at: number, over: number) => progress(f, at, over);
export const fadeOut = (f: number, at: number, over: number) => 1 - progress(f, at, over);

/**
 * textReveal — the ONLY entrance for words: they fade and rise. Never a pop,
 * never a bounce, never a rotation.
 */
export const textReveal = (f: number, at: number, over: number, rise = 18) => ({
  opacity: progress(f, at, over),
  dy: interpolate(f, [at, at + over], [rise, 0], { ...HOLD, easing: settle }),
});

/** One half-sine, 0→1→0. Emphasis on a UI element; never on type. */
export const beat = (f: number, at: number, over: number) =>
  f >= at && f < at + over ? Math.sin(((f - at) / over) * Math.PI) : 0;

/**
 * hold — a value that steps between keyframes and STAYS PUT in between. Give it
 * two keyframes with the same value and the picture genuinely stops rather than
 * creeping.
 */
export const hold = (f: number, keys: number[], vals: number[]) =>
  interpolate(f, keys, vals, { ...HOLD, easing: settle });

/** IDX price format — dot thousands, e.g. 4400 → "4.400". */
export const price = (n: number) => Math.round(n).toLocaleString("de-DE");

/** Rupiah, e.g. 40000 → "Rp40.000". */
export const fmtRp = (n: number) => `Rp${price(n)}`;

/** Percent with a comma decimal, e.g. 2.7 → "+2,7%". */
export const pct = (n: number) =>
  `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1).replace(".", ",")}%`;

/** mulberry32. The only PRNG. */
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
export const inset = (r: Rect, dx: number, dy = dx): Rect => ({
  x: r.x + dx,
  y: r.y + dy,
  w: r.w - dx * 2,
  h: r.h - dy * 2,
});

/** Split a rect into `n` columns with a gap between them. */
export const columns = (r: Rect, n: number, gap: number): Rect[] => {
  const w = (r.w - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({
    x: r.x + i * (w + gap),
    y: r.y,
    w,
    h: r.h,
  }));
};
