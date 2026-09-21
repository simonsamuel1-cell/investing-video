/**
 * QuizTitle.tsx — "Quiz Time", from the middle of the frame to the heading rail.
 *
 * It spans a SCENE BOUNDARY. SC11 ends on 6761 with the words big and centred;
 * CG-C opens on 6762 and walks them up to the top-left, where they stay as the
 * quiz's heading. The two sides have to be identical on that seam or the move
 * reads as a cut, so both render THIS and pass a different `t`.
 *
 * ⚠ ONE SIZE, SCALED — not two sizes interpolated. The words are laid out once
 * at the heading's own size and weight and then magnified by `BIG`. A big
 * state built from `display` (88 / 800) and a small one from `h2` (48 / 700)
 * would have to interpolate a font weight between them, which browsers do not
 * do smoothly on a static face; worse, the settled heading would not match the
 * other thirteen scenes' headings, and that is the state the viewer looks at
 * for the next fifty seconds.
 */
import React from "react";
import { theme } from "../theme";
import { textReveal } from "../helpers";

/** How much bigger the centred state is than the heading. 48 × 2.5 = 120. */
export const BIG = 2.5;
/** How far anything set beside the heading stands off it. */
const GAP = 30;

export const QuizTitle = ({
  f,
  at,
  t,
  opacity = 1,
  after,
}: {
  f: number;
  /** The frame the words first appear — their own reveal reads from it. */
  at: number;
  /** 0 = big and centred, 1 = settled in the heading rail. */
  t: number;
  opacity?: number;
  /**
   * Anything that belongs BESIDE the heading — CG-C hangs its question there.
   *
   * ⚠ IT GOES IN THE ROW, not at a measured offset. "Quiz Time" is whatever
   * width the browser makes of that string at that weight, so a left: value
   * chosen to sit 30px past it is a guess that stops being true the moment the
   * type changes.
   *
   * Adding it cannot move the heading: the settled state lands the ROW's
   * top-left on `titleChip` (see the percentage translate below), and that is
   * where the words are however wide the row gets.
   */
  after?: React.ReactNode;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  const L = theme.layout;
  const scale = BIG + (1 - BIG) * t;
  return (
    /**
     * ⚠ CENTRED BY LAYOUT, NOT BY ARITHMETIC. The words sit in a flex box the
     * size of the frame, so at `t = 0` they are exactly in the middle of it on
     * both axes — no number here has to agree with how wide "Quiz Time"
     * happens to render.
     *
     * The settle is then two translations and a scale:
     *
     *   the PIXEL one carries the centre from the frame's middle to the
     *     heading's own anchor, and
     *   the PERCENT one adds half the words' own width and height, which is
     *     what turns "centre at the anchor" into "top-left at the anchor" —
     *     and it does that without anyone measuring the text.
     *
     * At `t = 1` the result is exactly `titleChip`, the same place the other
     * thirteen headings start.
     */
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform:
            `translate(${((L.titleChip.x - L.width / 2) * t).toFixed(1)}px, ` +
            `${((L.titleChip.y - L.height / 2) * t).toFixed(1)}px) ` +
            `translate(${(50 * t).toFixed(2)}%, ${(50 * t).toFixed(2)}%) ` +
            `scale(${scale.toFixed(4)}) ${r.transform}`,
          fontFamily: theme.type.family,
          fontSize: theme.type.h2.size,
          fontWeight: theme.type.h2.weight,
          color: theme.colors.indigo,
          opacity: r.opacity * opacity,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "baseline",
          gap: GAP,
        }}
      >
        <span>Quiz Time</span>
        {after}
      </div>
    </div>
  );
};
