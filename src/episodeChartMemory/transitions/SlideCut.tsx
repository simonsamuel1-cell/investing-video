/**
 * SlideCut — a CameraCut whose move is a lateral pan instead of a push in.
 *
 * Same principle as transitions/CardExpand: ONE ease-in-out curve spans the
 * scene boundary, and the content swaps at its exact midpoint, where the move
 * is fastest. The motion never stops across that frame, so the swap reads as a
 * continuous camera move rather than a cut.
 *
 * The difference is what moves. CardExpand grows one card into another, which
 * only works when both sides are the same object. These two boundaries no
 * longer are — 3008 goes from a candle series to three screenshots, and 4472
 * from a screenshot back to a chart — so there is nothing to grow. A pan does
 * not need the two sides to match: the outgoing frame slides off, the incoming
 * frame is already displaced and rides the same curve home.
 *
 * Both scenes import from here and evaluate the SAME curve from GLOBAL frames.
 * That is the whole trick — each scene only ever sees its own local frame.
 */
import { progressInOut, velocityBlur } from "../helpers";

export type Slide = { cut: number; dur: number; distance: number };

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SLIDES: Record<string, Slide> = {
  /** SC05 → SC06: the chart hands over to the three BBCA screenshots. */
  toImages: { cut: 3008, dur: 24, distance: 240 },
  /** SC07 → SC08: the weekly screenshot hands back to the daily series. */
  toSupport: { cut: 4472, dur: 24, distance: 240 },
};
/** Blur at the fastest frame. This is what sells the swap; do not drop it. */
const BLUR_MAX = 8;
// ═══════════════════════════════════════════════════════════════════════════

/** 0 at the start of the move, 0.5 exactly on the cut, 1 at rest. */
const curveOf = (s: Slide) => (x: number) => progressInOut(x, s.cut - s.dur / 2, s.dur);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** translateX for the OUTGOING scene: 0 → −distance, reaching −distance at the cut. */
export const slideOut = (g: number, s: Slide) => -s.distance * clamp01(curveOf(s)(g) * 2);

/** translateX for the INCOMING scene: +distance on the cut → 0 at rest. */
export const slideIn = (g: number, s: Slide) => s.distance * clamp01(1 - (curveOf(s)(g) - 0.5) * 2);

/** Blur from the pan's own speed — zero at both ends, maximum on the cut. */
export const slideBlur = (g: number, s: Slide) => velocityBlur(curveOf(s), g, s.cut - s.dur / 2, s.dur, BLUR_MAX);
