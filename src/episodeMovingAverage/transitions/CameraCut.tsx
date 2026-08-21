/**
 * CameraCut — a cut that lands in the middle of a move.
 *
 * ONE ease-in-out curve spans the scene boundary, and the content swaps at its
 * exact midpoint, where the camera is travelling fastest. Because the motion
 * never stops across that frame, the swap reads as a continuous camera move
 * rather than a cut — and the blur, which peaks at the same midpoint, is what
 * sells it: the eye cannot resolve detail at that speed anyway.
 *
 * The trick only works if BOTH scenes evaluate the SAME curve from GLOBAL
 * frames. A scene inside a Sequence sees rebased frames, so each one has to add
 * its own `from` back before calling in here.
 */
import { progressInOut } from "../helpers";

export type Cut = {
  /** The GLOBAL frame the cut lands on — the midpoint of the move. */
  at: number;
  /** Frames the whole move takes, half before the cut and half after. */
  over: number;
  /**
   * How far the camera travels, in px. Short: the blur and the timing do the
   * work, and a long throw reads as a slide rather than a cut.
   *
   * 90px is the episode's ceiling for a vertical cut. The panel's lower edge
   * sits at 900 and the subtitle band starts at 972 — a longer throw would
   * push it into a band that must never be entered.
   */
  distance: number;
  /** Blur at the fastest frame. This is what sells the swap; do not drop it. */
  blur: number;
};

/**
 * THE EPISODE'S CUTS — one entry per boundary.
 *
 * Both scenes read the SAME entry — the outgoing one through `cutOut`, the
 * incoming one through `cutIn` — which is the only way a cut can be one move
 * rather than two that happen to meet.
 */
export const CUTS = {
  /**
   * SC01 → CG-A, on the 606/607 boundary. The broker window is put down and
   * the teaching starts, so the camera RISES: the panel is carried up out of
   * frame and the explainer comes up into it on the same curve.
   */
  toAverage: { at: 607, over: 24, distance: 90, blur: 9 },
} as const satisfies Record<string, Cut>;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const curve = (c: Cut) => (global: number) => progressInOut(global, c.at - c.over / 2, c.over);

/** translateY for the OUTGOING scene: 0 → −distance, fully out ON the cut. */
export const cutOut = (global: number, c: Cut) => -c.distance * clamp01(curve(c)(global) * 2);

/** translateY for the INCOMING scene: +distance on the cut → 0 at rest. */
export const cutIn = (global: number, c: Cut) => c.distance * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** Blur from the move's own speed — zero at both ends, maximum on the cut. */
export const cutBlur = (global: number, c: Cut) => Math.sin(Math.PI * curve(c)(global)) * c.blur;
