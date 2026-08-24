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
   * 90px is the episode's ceiling for a VERTICAL cut. The panel's lower edge
   * sits at 900 and the subtitle band starts at 972 — a longer throw would
   * push it into a band that must never be entered. A horizontal cut has no
   * such neighbour and can afford more.
   */
  distance: number;
  /** Blur at the fastest frame. This is what sells the swap; do not drop it. */
  blur: number;
  /** Which way the camera travels. "y" rises, "x" tracks left. */
  axis: "x" | "y";
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
  toAverage: { at: 607, over: 24, distance: 90, blur: 9, axis: "y" },
  /**
   * CG-A → SC04, on the 1764/1765 boundary. Moving averages are done and the
   * two KINDS of them begin, so the camera TRACKS LEFT rather than rising:
   * a sideways move says "next, along the same subject", where a rise says
   * "and now something else".
   */
  toTypes: { at: 1765, over: 24, distance: 140, blur: 9, axis: "x" },
  /**
   * SC04 → SC05, on the 2323/2324 boundary. What a moving average IS is
   * finished and how to READ one begins — a new instruction, not the next step
   * along the same one — so the camera RISES rather than tracking sideways.
   * It is also where the heading changes, and the cut is what carries it out.
   */
  toReading: { at: 2324, over: 24, distance: 90, blur: 9, axis: "y" },
  /**
   * SC05 → SC07, on the 3489/3490 boundary. Reading one average is finished
   * and two averages crossing begins — a new mechanism, not the next step in
   * the same one — so the camera RISES.
   */
  toCross: { at: 3490, over: 24, distance: 90, blur: 9, axis: "y" },
} as const satisfies Record<string, Cut>;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const curve = (c: Cut) => (global: number) => progressInOut(global, c.at - c.over / 2, c.over);

/** translateY for the OUTGOING scene: 0 → −distance, fully out ON the cut. */
export const cutOut = (global: number, c: Cut) => -c.distance * clamp01(curve(c)(global) * 2);

/** translateY for the INCOMING scene: +distance on the cut → 0 at rest. */
export const cutIn = (global: number, c: Cut) => c.distance * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** Blur from the move's own speed — zero at both ends, maximum on the cut. */
export const cutBlur = (global: number, c: Cut) => Math.sin(Math.PI * curve(c)(global)) * c.blur;

/**
 * The style a scene puts on its root. Both halves of a cut ask for one of
 * these, so neither has to know which axis the cut travels on — get that wrong
 * in one of them and the two halves move at right angles to each other.
 */
const styleOf = (d: number, blur: number, axis: Cut["axis"]) => ({
  transform: axis === "x" ? `translateX(${d.toFixed(1)}px)` : `translateY(${d.toFixed(1)}px)`,
  filter: blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : undefined,
});

/** For the scene the cut takes AWAY. Pass the GLOBAL frame. */
export const cutOutStyle = (global: number, c: Cut) =>
  styleOf(cutOut(global, c), cutBlur(global, c), c.axis);

/** For the scene the cut BRINGS IN. Pass the GLOBAL frame. */
export const cutInStyle = (global: number, c: Cut) =>
  styleOf(cutIn(global, c), cutBlur(global, c), c.axis);
