/**
 * core/QuizTitle.tsx — a section name that arrives in the MIDDLE of the frame
 * and then walks up to the heading rail, where it stays.
 *
 * Ported from episode 019, where the move was built and approved. It is here
 * rather than in an episode because it is not about quizzes: it is the gesture
 * of a section announcing itself and then getting out of the way, and every
 * episode has one of those.
 *
 * ⚠ ONE SIZE, SCALED — not two sizes interpolated. The words are laid out once
 * at the HEADING's own size and weight and then magnified. A big state built
 * from a display size and a small one from the heading size would have to
 * interpolate a font weight between them, which browsers do not do smoothly on
 * a static face; worse, the settled state would not match the headings of the
 * scenes either side of it, and that is the state the viewer looks at for the
 * next minute.
 *
 * ⚠ CENTRED BY LAYOUT, NOT BY ARITHMETIC. The words sit in a flex box the size
 * of the frame, so at t = 0 they are exactly in its middle on both axes — no
 * number here has to agree with how wide the string happens to render.
 *
 * The settle is then two translations and a scale:
 *   · the PIXEL one carries the centre from the frame's middle to the heading's
 *     own anchor, and
 *   · the PERCENT one adds half the words' own width and height, which is what
 *     turns "centre at the anchor" into "top-left at the anchor" — and it does
 *     that without anyone measuring the text.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { textReveal, progressInOut } from "./helpers";
import { useMotion } from "./useMotion";

export const QuizTitle = ({
  text,
  at,
  hold,
  walk,
  x = theme.margin.left,
  y = 100,
  size = theme.text.title.size,
  color = theme.color.indigo,
  big = 2.5,
  opacity = 1,
  after,
}: {
  text: string;
  /** The frame the words appear, big and centred. */
  at: number;
  /** How long they stay there before they start moving. */
  hold: number;
  /** How long the walk to the heading rail takes. */
  walk: number;
  /** The heading rail's own anchor — the TOP-LEFT the words settle on. */
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  /** How much bigger the centred state is than the heading. */
  big?: number;
  opacity?: number;
  /**
   * Anything that belongs BESIDE the settled heading.
   *
   * ⚠ IT GOES IN THE ROW, not at a measured offset. The heading is whatever
   * width the browser makes of that string at that weight, so a `left:` chosen
   * to sit past it is a guess that stops being true the moment the type
   * changes. Adding it cannot move the heading either: the settled state lands
   * the ROW's top-left on the anchor, and that is where the words are however
   * wide the row gets.
   */
  after?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at, m.reveal);
  /** 0 = big and centred, 1 = settled in the rail. */
  const t = progressInOut(f, at + hold, walk);
  const scale = big + (1 - big) * t;
  return (
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
            `translate(${((x - theme.canvas.width / 2) * t).toFixed(1)}px, ` +
            `${((y - theme.canvas.height / 2) * t).toFixed(1)}px) ` +
            `translate(${(50 * t).toFixed(2)}%, ${(50 * t).toFixed(2)}%) ` +
            `scale(${scale.toFixed(4)}) translateY(${r.dy.toFixed(1)}px)`,
          fontFamily: theme.text.family,
          fontSize: size,
          fontWeight: theme.text.title.weight,
          color,
          opacity: r.opacity * opacity,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "baseline",
          gap: 30,
        }}
      >
        <span>{text}</span>
        {after}
      </div>
    </div>
  );
};
