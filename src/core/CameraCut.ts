/**
 * core/CameraCut.ts — a cut that lands in the MIDDLE of a move.
 *
 * One ease-in-out curve spans the boundary and the content swaps at its exact
 * midpoint, where the camera is travelling fastest. Because the motion never
 * stops across that frame, the swap reads as a continuous camera move rather
 * than a cut — and the blur, which peaks at the same midpoint, is what sells
 * it: the eye cannot resolve detail at that speed anyway.
 *
 * ⚠ BOTH HALVES MUST EVALUATE THE SAME `Cut`, FROM GLOBAL FRAMES. The outgoing
 * scene through `cutOutStyle`, the incoming one through `cutInStyle`. Two
 * hand-tuned moves that happen to meet is not a cut. A scene inside a Sequence
 * sees rebased frames, so it has to add its own `from` back before calling in
 * here — that is the number one bug in this pipeline.
 *
 * ⚠ THE BLUR IS NOT DECORATION. Drop it and the move reads as a slide.
 *
 * Ported verbatim from episodeMovingAverage, where the curve was tuned and
 * approved. The episode kept a CUTS table of its own boundaries; that stays
 * per-episode — this file is only the mechanism.
 */
import { progressInOut, clamp01 } from "./helpers";

export type Cut =
  | {
      /** The GLOBAL frame the cut lands on — the midpoint of the move. */
      at: number;
      /** Frames the whole move takes, half before the cut and half after. */
      over: number;
      /**
       * How far the camera travels, in px. Keep it SHORT: the blur and the
       * timing do the work, and a long throw reads as a slide.
       *
       * ⚠ A VERTICAL cut has a hard ceiling. The subtitle band starts at
       * `theme.captionBand.top`, and a throw longer than the gap between the
       * card's lower edge and that line pushes content into a band that must
       * never be entered — for the standard card that is 90px. A horizontal
       * cut has no such neighbour.
       */
      distance: number;
      /** Blur at the fastest frame. */
      blur: number;
      /** Which way the camera travels. */
      axis: "x" | "y";
    }
  | {
      /** A PUSH IN toward a fixed point, rather than a slide. */
      at: number;
      over: number;
      blur: number;
      axis: "zoom";
      /** The point the camera closes on, in canvas px. */
      origin: { x: number; y: number };
      /** How far past 1.0 the scale reaches at the cut itself. */
      amount: number;
    };

const curve = (c: Cut) => (global: number) =>
  progressInOut(global, c.at - c.over / 2, c.over);

/** translate for the OUTGOING half: 0 → −distance, fully out ON the cut. */
export const cutOut = (global: number, c: Extract<Cut, { axis: "x" | "y" }>) =>
  -c.distance * clamp01(curve(c)(global) * 2);

/** translate for the INCOMING half: +distance on the cut → 0 at rest. */
export const cutIn = (global: number, c: Extract<Cut, { axis: "x" | "y" }>) =>
  c.distance * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** scale for the OUTGOING half: 1 → 1+amount, at its widest ON the cut. */
export const zoomOut = (global: number, c: Extract<Cut, { axis: "zoom" }>) =>
  1 + c.amount * clamp01(curve(c)(global) * 2);

/** scale for the INCOMING half: 1+amount on the cut → 1 as it settles. */
export const zoomIn = (global: number, c: Extract<Cut, { axis: "zoom" }>) =>
  1 + c.amount * clamp01(1 - (curve(c)(global) - 0.5) * 2);

/** Blur from the move's own speed — zero at both ends, maximum on the cut. */
export const cutBlur = (global: number, c: Cut) =>
  Math.sin(Math.PI * curve(c)(global)) * c.blur;

const filterOf = (blur: number) => (blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : undefined);

/**
 * The style a scene puts on its root. Both halves ask for one of these, so
 * neither has to know which axis the cut travels on — get that wrong in one of
 * them and the two halves move at odds with each other.
 */
export const cutOutStyle = (global: number, c: Cut) => {
  const filter = filterOf(cutBlur(global, c));
  if (c.axis === "zoom") {
    return {
      transform: `scale(${zoomOut(global, c).toFixed(4)})`,
      transformOrigin: `${c.origin.x}px ${c.origin.y}px`,
      filter,
    };
  }
  const d = cutOut(global, c);
  return {
    transform: c.axis === "x" ? `translateX(${d.toFixed(1)}px)` : `translateY(${d.toFixed(1)}px)`,
    filter,
  };
};

/** For the half the cut BRINGS IN. Pass the GLOBAL frame. */
export const cutInStyle = (global: number, c: Cut) => {
  const filter = filterOf(cutBlur(global, c));
  if (c.axis === "zoom") {
    return {
      transform: `scale(${zoomIn(global, c).toFixed(4)})`,
      transformOrigin: `${c.origin.x}px ${c.origin.y}px`,
      filter,
    };
  }
  const d = cutIn(global, c);
  return {
    transform: c.axis === "x" ? `translateX(${d.toFixed(1)}px)` : `translateY(${d.toFixed(1)}px)`,
    filter,
  };
};
