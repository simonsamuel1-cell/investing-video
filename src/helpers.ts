/**
 * Frame-driven animation + deterministic-data helpers. Everything is computed
 * from useCurrentFrame() via interpolate/spring — NO CSS keyframes (they desync
 * at render). No Math.random — schematic data is seeded via mulberry32.
 */
import { interpolate, spring } from "remotion";
import { EASE } from "./theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opacity 0→1 starting at `start`, over `dur` frames. */
export const fadeIn = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing: EASE });

/** Opacity 1→0 starting at `start`, over `dur` frames. */
export const fadeOut = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [1, 0], { ...CLAMP, easing: EASE });

/** Opacity that eases in at the head and out at the tail of a clip. */
export const fadeInOut = (frame: number, total: number, inDur = 10, outDur = 10) =>
  interpolate(
    frame,
    [0, inDur, Math.max(inDur, total - outDur), total],
    [0, 1, 1, 0],
    CLAMP,
  );

/** Content-level fade-in only (scene head). */
export const sceneIn = (frame: number, dur = 8) =>
  interpolate(frame, [0, dur], [0, 1], { ...CLAMP, easing: EASE });

/** Vertical rise: translateY (px) easing from `dist`→0. */
export const rise = (frame: number, start: number, dur: number, dist = 24) =>
  interpolate(frame, [start, start + dur], [dist, 0], { ...CLAMP, easing: EASE });

/** Generic clamped interpolate with the project ease. */
export const ease = (
  frame: number,
  range: [number, number],
  out: [number, number],
) => interpolate(frame, range, out, { ...CLAMP, easing: EASE });

/** Linear clamped interpolate (no ease) — for stroke draws / progress. */
export const lin = (
  frame: number,
  range: [number, number],
  out: [number, number],
) => interpolate(frame, range, out, CLAMP);

/** Spring 0→1 starting at `delay`. */
export const springUp = (frame: number, fps: number, delay = 0, damping = 200) =>
  spring({ frame: frame - delay, fps, config: { damping, mass: 0.9, stiffness: 110 } });

/**
 * popIn — scale 0 → 1.05 → 1.0 over ~16f, with opacity. Use for every
 * badge/callout/chip entrance. Sequential rule: a prior element's popOut must
 * reach 0 before the next popIn begins.
 */
export const popIn = (frame: number, start: number) => {
  const scale = interpolate(
    frame,
    [start, start + 9, start + 16],
    [0.0, 1.05, 1.0],
    { ...CLAMP, easing: EASE },
  );
  const opacity = fadeIn(frame, start, 8);
  return { scale, opacity };
};

/** popOut — scale 1.0 → 1.05 → 0 over ~14f, with opacity fade. */
export const popOut = (frame: number, start: number) => {
  const scale = interpolate(
    frame,
    [start, start + 6, start + 14],
    [1.0, 1.05, 0.0],
    { ...CLAMP, easing: EASE },
  );
  const opacity = fadeOut(frame, start, 12);
  return { scale, opacity };
};

/** Scalar-only aliases (when you just need the multiplier). */
export const popInScale = (frame: number, start: number) => popIn(frame, start).scale;
export const popOutScale = (frame: number, start: number) => popOut(frame, start).scale;

/**
 * popLife — the full lifecycle of a pop element: hidden before `inAt`, pops in,
 * holds, then (if `outAt` given) pops out to 0. Returns {scale, opacity}. The
 * single source of truth for every badge/highlight/callout that appears then
 * leaves, so the in/out timing is declared by frame, not hand-rolled.
 */
export const popLife = (frame: number, inAt: number, outAt?: number) =>
  outAt !== undefined && frame >= outAt ? popOut(frame, outAt) : popIn(frame, inAt);

/**
 * textReveal / textHide / textLife — the SUBTLE typography reveal system, kept
 * deliberately separate from pop (no scale, no bounce): opacity fade + a small
 * upward slide. UI highlights use pop; text uses this. Returns {opacity, ty}.
 */
export const textReveal = (frame: number, start: number, dur = 18, slide = 16) => ({
  opacity: fadeIn(frame, start, dur),
  ty: ease(frame, [start, start + dur], [slide, 0]),
});

export const textHide = (frame: number, start: number, dur = 14, slide = 16) => ({
  opacity: fadeOut(frame, start, dur),
  ty: ease(frame, [start, start + dur], [0, -slide]),
});

/** Full lifecycle: reveal in, hold, (optionally) hide out — fade + slide only. */
export const textLife = (
  frame: number,
  inAt: number,
  outAt?: number,
  dur = 18,
  slide = 16,
) =>
  outAt !== undefined && frame >= outAt
    ? textHide(frame, outAt, Math.min(dur, 14), slide)
    : textReveal(frame, inAt, dur, slide);

/** Calm symmetric pulse in [lo,hi] driven by frame. */
export const pulse = (frame: number, lo = 1, hi = 1.04, period = 60, phase = 0) => {
  const t = (Math.sin(((frame + phase) / period) * Math.PI * 2) + 1) / 2;
  return lo + (hi - lo) * t;
};

/** Format an integer rupiah amount with thousands separators (no symbol). */
export const fmtRp = (n: number) =>
  n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

/** Deterministic PRNG (mulberry32) — seeded, so placements are stable. */
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
 * genSeries — a deterministic schematic price path (normalised 0..1). Pure shape,
 * NOT real data: no axes, numbers or prices are ever shown. `drift` biases the
 * overall slope; `vol` the jitter; `seed` makes it stable.
 */
export const genSeries = (
  n: number,
  seed: number,
  { drift = 0, vol = 0.08 }: { drift?: number; vol?: number } = {},
): number[] => {
  const rnd = mulberry32(seed);
  const raw: number[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += drift / n + (rnd() - 0.5) * vol;
    raw.push(v);
  }
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const span = max - min || 1;
  return raw.map((x) => (x - min) / span);
};

/** Trailing simple moving average of a normalised series (same length). */
export const movingAvg = (series: number[], window: number): number[] =>
  series.map((_, i) => {
    const a = Math.max(0, i - window + 1);
    const slice = series.slice(a, i + 1);
    return slice.reduce((s, x) => s + x, 0) / slice.length;
  });

/** Build an SVG polyline points string from a normalised series. */
export const polyPoints = (
  series: number[],
  w: number,
  h: number,
  pad = 0,
): string =>
  series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - v) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
