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
   */
  distance: number;
  /** Blur at the fastest frame. This is what sells the swap; do not drop it. */
  blur: number;
};

export const CUTS: Record<string, Cut> = {
  /** SC01 → SC02: the chart hands over to the title. */
  toTitle: { at: 461, over: 24, distance: 80, blur: 9 },
  /**
   * Inside SC08: the principle hands over to the question about what comes
   * next. A cut rather than a dissolve because the two halves are arguing
   * different things — one states a rule, the other rejects a habit.
   */
  toGuess: { at: 3746, over: 24, distance: 80, blur: 9 },
  /**
   * SC08 → SC09, applied to X rather than Y: the frame slides LEFT and the new
   * scene arrives from the right. Sideways is the third case in a row of cases,
   * so moving along reads as "and the next one" — a rise would read as "and
   * now something bigger".
   */
  toSideways: { at: 3913, over: 24, distance: 110, blur: 9 },
  /**
   * SC10 → SC11, as a PUSH IN rather than a slide. The line straight after the
   * cut is "Tren juga punya ukuran dan kecepatan", and the previous scene has
   * just finished pulling back to show a whole cycle — so moving closer is the
   * sentence itself: you have seen the whole thing, now stand nearer to it.
   *
   * `distance` is unused here; the zoom carries the move.
   */
  toSize: { at: 5211, over: 24, distance: 0, blur: 9 },
};

/**
 * A dolly instead of a track. The camera keeps closing the whole way through:
 * the outgoing frame grows as the camera approaches it, and the incoming one
 * starts SMALLER than its rest size and grows into it. Scale is discontinuous
 * across the cut by design — that discontinuity is the cut, and it lands on the
 * frame where the move is fastest and the blur is deepest.
 */
export const cutPushOut = (global: number, c: Cut, amount: number) => 1 + amount * clamp01(curve(c)(global) * 2);
export const cutPushIn = (global: number, c: Cut, amount: number) => 1 - amount * clamp01(1 - (curve(c)(global) - 0.5) * 2);

const curve = (c: Cut) => (global: number) => progressInOut(global, c.at - c.over / 2, c.over);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** translateY for the OUTGOING scene: 0 → −distance, fully out ON the cut. */
export const cutOut = (global: number, c: Cut) => -c.distance * clamp01(curve(c)(global) * 2);

/** translateY for the INCOMING scene: +distance on the cut → 0 at rest. */
export const cutIn = (global: number, c: Cut) => c.distance * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** Blur from the move's own speed — zero at both ends, maximum on the cut. */
export const cutBlur = (global: number, c: Cut) => Math.sin(Math.PI * curve(c)(global)) * c.blur;
