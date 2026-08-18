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

/**
 * THE EPISODE'S CUTS — one entry per boundary, filled in as the scenes land.
 *
 * `at` is the GLOBAL frame the halves swap on; the move spans `over` frames
 * either side of it and the blur peaks on `at` itself. Both scenes read the
 * SAME entry — the outgoing one through `cutOut`, the incoming one through
 * `cutIn` — which is the only way a cut can be one move rather than two that
 * happen to meet.
 *
 * A cut needs content on BOTH sides. If the incoming scene is blank on `at`,
 * the outgoing move has to finish the job itself as a whip-out.
 */
export const CUTS: Record<string, Cut> = {};

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
