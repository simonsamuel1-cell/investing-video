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
/**
 * ═══ POP IN ═══ — fade on, and grow from small to size with ONE overshoot.
 *
 * The thing arrives, goes a little past its size, and settles. One overshoot,
 * never a wobble: a repeated bounce reads as a toy, while a single overshoot
 * reads as something landing with weight behind it.
 *
 * ⚠ THE SCALE AND THE FADE RUN ON DIFFERENT CURVES ON PURPOSE. The fade is
 * plain and finishes early, so the thing is solid while it is still settling;
 * putting the overshoot on the opacity too would flash it brighter than
 * finished and read as a flicker.
 *
 * `back` is how far past 1 it goes at the peak — 1.10 is a tenth over size.
 */
export const popIn = (
  f: number,
  at: number,
  over: number,
  { from = 0.7, back = 1.1 }: { from?: number; back?: number } = {},
) => {
  const t = clamp01((f - at) / Math.max(1, over));
  /**
   * ease-out-back: one crossing above 1, then home.
   *
   * ⚠ `back` IS THE PEAK SCALE, NOT THE CURVE'S CONSTANT. The textbook 1.70158
   * overshoots by a tenth of the DISTANCE TRAVELLED — growing from 0.7 that is
   * a tenth of 0.3, so it peaks at 1.03 and the bounce is invisible. The
   * constant is solved back from the peak instead, so `back: 1.1` really does
   * reach 1.1 whatever size it started from.
   *
   * The curve's peak works out to 4s³ / 27(s+1)² above 1, which does not invert
   * in closed form; thirty halvings pin it to more decimals than a pixel can
   * show, and unlike Newton they cannot wander off to a negative root.
   */
  const want = (back - 1) / (1 - from);
  let lo = 0;
  let hi = 60;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if ((4 * mid ** 3) / (27 * (mid + 1) ** 2) < want) lo = mid;
    else hi = mid;
  }
  const s = (lo + hi) / 2;
  const u = t - 1;
  const eased = 1 + (s + 1) * u * u * u + s * u * u;
  return {
    opacity: clamp01((f - at) / Math.max(1, over * 0.55)),
    scale: from + (1 - from) * eased,
  };
};

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
