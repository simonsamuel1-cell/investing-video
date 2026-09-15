/**
 * scenes/ArrowRight.tsx — the dashed arrow in the RIGHT window, on its own.
 *
 * ═══ HOW TO CHANGE IT ════════════════════════════════════════════════════
 *
 * Two points, each `[x, y]` in PIXELS from the top-left corner of the right
 * window. Same box as scenes/Analysis.tsx: 836 wide, 536 tall, y DOWN.
 *
 *   `a`  where the arrow starts — the bar the analyst is reading from.
 *   `b`  which way it goes. ⚠ ONLY THE DIRECTION OF `b` IS USED, NOT THE
 *        DISTANCE. Both windows' arrows are given the same reach (`REACH_PX` in
 *        TwinWindows) so neither reads as the more confident of the two; move
 *        `b` to change the ANGLE, not the length.
 *
 * Patokan inside the window: candles run x≈110 to x≈700 now that the last eight
 * are gone, the chart's top is y≈122 and its floor y≈514. Everything right of
 * the candles is white space, which is where this arrow lives.
 *
 * ⚠ IT MUST POINT DOWN, and the assertion below enforces it. y grows downward,
 * so "down" means `b`'s y is BIGGER than `a`'s. The left window's arrow points
 * up; the whole scene is those two disagreeing from the same bar, and an arrow
 * that quietly agreed with the other one would leave the scene saying nothing.
 */
import type { Seg } from "./Analysis";

// ═══ EDIT ═══════════════════════════════════════════════════════════════
export const RIGHT_ARROW: Seg = { a: [604.29, 216.76], b: [717.04, 518.8] };
// ═══════════════════════════════════════════════════════════════════════════

{
  if (RIGHT_ARROW.b[1] <= RIGHT_ARROW.a[1]) {
    throw new Error("022-ta-mistakes/ArrowRight: the right window's arrow must point DOWN");
  }
}
