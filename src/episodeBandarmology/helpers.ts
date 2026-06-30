/**
 * Bandarmology episode helpers. Frame-driven only (computed from
 * useCurrentFrame()) — NO CSS keyframes/transitions, which desync at render.
 *
 * The shared project keeps its helpers in ../util/anim with slightly different
 * names; this module is the single import surface for the episode so every
 * scene pulls the same signatures.
 */
import { interpolate, Easing, spring } from "remotion";

// Calm ease-out used across the episode (matches the shared EASE curve).
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opacity 0→1 starting at `start`, over `dur` frames. */
export const fadeIn = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing: ease });

/** Opacity 1→0 starting at `start`, over `dur` frames. */
export const fadeOut = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [1, 0], { ...CLAMP, easing: ease });

/** Ease in at the head and out at the tail of a clip of length `total`. */
export const fadeInOut = (frame: number, total: number, inDur = 12, outDur = 12) =>
  interpolate(
    frame,
    [0, inDur, Math.max(inDur, total - outDur), total],
    [0, 1, 1, 0],
    CLAMP,
  );

/** Generic clamped interpolate with the project ease. */
export const tween = (frame: number, range: [number, number], out: [number, number]) =>
  interpolate(frame, range, out, { ...CLAMP, easing: ease });

/**
 * textReveal — subtle fade + slight upward slide for type. NO pop/bounce.
 * Returns style props to spread onto the text element.
 */
export const textReveal = (frame: number, start: number, dur = 16) => {
  const opacity = fadeIn(frame, start, dur);
  const translateY = interpolate(frame, [start, start + dur], [10, 0], {
    ...CLAMP,
    easing: ease,
  });
  return { opacity, transform: `translateY(${translateY}px)` };
};

export const springCfg = { damping: 200, mass: 0.9, stiffness: 110 } as const;

/**
 * popIn — spring 0→1 for UI-highlight elements ONLY (chips/tokens/pings).
 * Never use on type (§0.6).
 */
export const popIn = (frame: number, fps: number, delay = 0, overshoot = false) =>
  spring({
    frame: frame - delay,
    fps,
    config: overshoot
      ? { damping: 12, mass: 0.8, stiffness: 140 }
      : springCfg,
  });

/** Rupiah formatting (only used if a real capture supplies real figures). */
export const fmtRp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

/** Deterministic PRNG — seed in, () => [0,1). Never use Math.random in renders. */
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
 * genCandles — deterministic OHLC series (normalised [0,1]) from a price path.
 * `levels[i]` is the target close for candle i; open = previous close, wicks and
 * body noise are seeded. Returns {o,h,l,c}[] for CandlestickChart.
 */
export const genCandles = (levels: number[], seed: number, wick = 0.04) => {
  const rng = mulberry32(seed);
  const clamp = (v: number) => Math.max(0.04, Math.min(0.96, v));
  let prev = levels[0];
  return levels.map((lvl) => {
    const o = clamp(prev + (rng() - 0.5) * 0.02);
    const c = clamp(lvl + (rng() - 0.5) * 0.02);
    const hi = clamp(Math.max(o, c) + rng() * wick);
    const lo = clamp(Math.min(o, c) - rng() * wick);
    prev = c;
    return { o, h: hi, l: lo, c };
  });
};
