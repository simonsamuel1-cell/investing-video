/**
 * Frame-driven animation helpers. Everything is computed from useCurrentFrame()
 * via interpolate/spring — NO CSS keyframes/transitions (they desync at render).
 */
import { interpolate, Easing, spring } from "remotion";

// Calm, expressive ease-out used across the piece.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opacity 0→1 starting at `start`, over `dur` frames. */
export const fadeIn = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing: EASE });

/** Opacity 1→0 starting at `start`, over `dur` frames. */
export const fadeOut = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [1, 0], { ...CLAMP, easing: EASE });

/** Opacity that eases in at the head and (optionally) out at the tail of a clip. */
export const fadeInOut = (
  frame: number,
  total: number,
  inDur = 10,
  outDur = 10,
) =>
  interpolate(
    frame,
    [0, inDur, Math.max(inDur, total - outDur), total],
    [0, 1, 1, 0],
    CLAMP,
  );

/** Content-level fade-in only (scene head). Cuts are masked by the next scene
 * materialising over the persistent silver background. */
export const sceneIn = (frame: number, dur = 8) =>
  interpolate(frame, [0, dur], [0, 1], { ...CLAMP, easing: EASE });

/** Vertical rise: returns a translateY (px) easing from `dist`→0. */
export const rise = (frame: number, start: number, dur: number, dist = 24) =>
  interpolate(frame, [start, start + dur], [dist, 0], {
    ...CLAMP,
    easing: EASE,
  });

/** Generic interpolate with clamping + project ease. */
export const ease = (
  frame: number,
  range: [number, number],
  out: [number, number],
) => interpolate(frame, range, out, { ...CLAMP, easing: EASE });

/** Spring 0→1 starting at `delay`. */
export const springUp = (
  frame: number,
  fps: number,
  delay = 0,
  damping = 200,
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.9, stiffness: 110 },
  });

/** Calm symmetric pulse in [lo,hi] driven by frame (for "moving together"). */
export const pulse = (frame: number, lo = 1, hi = 1.04, period = 60, phase = 0) => {
  const t = (Math.sin(((frame + phase) / period) * Math.PI * 2) + 1) / 2;
  return lo + (hi - lo) * t;
};
