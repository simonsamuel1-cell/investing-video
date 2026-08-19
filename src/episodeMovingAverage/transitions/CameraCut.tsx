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
export const CUTS = {
  /**
   * SC01 → SC02. The screener is put down and the teaching starts: a rise.
   *
   * At 718, not 659: SC01 holds past the VO's "Kita mulai dari moving average"
   * so the two indicator pills can move to the middle of the frame and the
   * Moving Average one can light up ON that line. The cut comes after.
   */
  toAverage: { at: 718, over: 24, distance: 90, blur: 9 },
  /**
   * CG-A → SC04. NOT A CUT.
   *
   * The two scenes share a heading and a white card, and the run does not stop
   * at this boundary — so nothing is thrown and nothing is blurred. CG-A
   * simply fades its contents off the card, and SC04 draws the next ones onto
   * the same card. Distance and blur are zero so both sides read this entry
   * and neither moves.
   */
  toTypes: { at: 1839, over: 24, distance: 0, blur: 0 },
  /** SC04 → SC05. "Cara sederhana membacanya begini" — a new instruction. */
  toReading: { at: 2306, over: 24, distance: 90, blur: 9 },
  /** SC05 → SC06. Another property of the same line: sideways again. */
  toSupport: { at: 2882, over: 24, distance: 110, blur: 9 },
  /**
   * SC06 → SC07. A PUSH IN: the scene is about one specific event on one
   * chart, so the camera closes on it rather than travelling to it.
   */
  toCross: { at: 3444, over: 24, distance: 0, blur: 9 },
  /**
   * SC07 → CG-B. The episode's halfway hinge — moving averages are finished
   * and Bollinger Bands begin. It gets the longest DURATION rather than the
   * longest throw: 90px is the ceiling for any vertical cut in this episode,
   * because the card's bottom sits at 876 and the subtitle band starts at 972.
   * A 150px throw pushed the card 54px into a band that must never be entered.
   */
  toBands: { at: 4134, over: 30, distance: 90, blur: 10 },
  /** CG-B → SC10. From what the bands are to how they are misread. */
  toTrap: { at: 5439, over: 24, distance: 110, blur: 9 },
  /** SC10 → SC11. Out of the charts and into the process: a rise. */
  toProcess: { at: 6034, over: 24, distance: 90, blur: 9 },
  /** SC11 → CG-C. "Sekarang giliran kamu" — the camera closes on one chart. */
  toCase: { at: 6670, over: 24, distance: 0, blur: 9 },
  /**
   * CG-C → SC13. A PULL BACK, driven by a negative amount: the case study is
   * released and the episode widens out to its conclusion.
   */
  toClose: { at: 8318, over: 26, distance: 0, blur: 9 },
} as const satisfies Record<string, Cut>;

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
