/**
 * core/TabRow.tsx — a row of labels with one of them current, the way a set of
 * tabs works on a page, over a rule that runs the whole width of the row.
 *
 * ⚠ IT TAKES A FRAME PER TAB, NOT AN INDEX. An index can only jump: the label
 * would change size, weight and colour between one frame and the next, which is
 * the one thing Simon does not want. From frames the component can work out how
 * far ALONG the hand-over it is —
 *
 *     t(i) = progress(f, select[i]) − progress(f, select[i+1])
 *
 * — so tab i rises as its turn comes and falls again as the next one takes
 * over. Exactly one is ever near 1, and nothing is ever mid-jump.
 *
 * ⚠ WEIGHT CANNOT BE INTERPOLATED, so it is CROSS-FADED: each label is drawn
 * twice, at 400 and at 700, and the pair's opacities trade places. Animating
 * size and colour while the weight snapped was worse than not animating at all
 * — the snap became the only thing you saw.
 *
 * ⚠ `alignItems: flex-end` IS LOAD-BEARING. The current tab is taller than the
 * others; on a baseline or a centre alignment it would push the underline up
 * and down as the selection moves.
 *
 * ⚠ NOTHING MOVES WHEN THE SELECTION DOES. The row is laid out ONCE, at the
 * bold weight and the base size, by a hidden copy of each label; the visible
 * ones are taken out of the flow and SCALED rather than resized. A font-size
 * that grows is a font-size that pushes — every tab to its right slid along the
 * line each time the selection changed, which is exactly what Simon does not
 * want. A transform costs the layout nothing, and scaling about the label's own
 * bottom centre keeps its baseline and its underline where they were.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";

/**
 * How far under the labels the rule sits. The mark on the rule is placed off
 * the same number, so the two cannot drift apart.
 */
const RULE_DROP = 29;

export const TabRow = ({
  tabs,
  select,
  x,
  y,
  at = 0,
  over,
  size = 20,
  lift = 4,
  gap = 18,
  stepIn = 0,
  anchor = "center",
}: {
  tabs: string[];
  /** The frame each tab becomes the current one. Ascending. */
  select: number[];
  x: number;
  /** Top of the row. */
  y: number;
  at?: number;
  /** Frames one hand-over takes. Defaults to the theme's reveal. */
  over?: number;
  size?: number;
  /** How much bigger the current one is. */
  lift?: number;
  gap?: number;
  /**
   * Frames between one tab arriving and the next.
   *
   * ⚠ THEY FADE IN, THEY DO NOT MOUNT IN. The hidden copy that holds each box's
   * width is rendered from the first frame whatever this is set to — otherwise
   * every tab would shove the ones after it along as it appeared, which is the
   * movement the row is built to avoid.
   */
  stepIn?: number;
  anchor?: "left" | "center" | "right";
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at) return null;
  const span = over ?? m.reveal;
  /** 0 → 1 → 0 as each tab takes its turn and hands it on. */
  const on = tabs.map(
    (_, i) =>
      progress(f, select[i], span) -
      (i + 1 < select.length ? progress(f, select[i + 1], span) : 0),
  );
  const shift = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${shift})`,
        display: "inline-block",
        fontFamily: theme.text.family,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap }}>
        {tabs.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 ? (
              <span
                style={{
                  color: c.muted,
                  fontSize: size,
                  fontWeight: 400,
                  opacity: progress(f, at + i * stepIn, m.reveal),
                }}
              >
                |
              </span>
            ) : null}
            <span
              style={{
                position: "relative",
                display: "inline-block",
                fontSize: size,
                lineHeight: 1.2,
                color: c.muted,
              }}
            >
              {/* holds the box at its widest state — see the header */}
              <span style={{ visibility: "hidden", fontWeight: 700 }}>{t}</span>
              {[
                { w: 400, col: c.muted, op: 1 - on[i] },
                { w: 700, col: c.indigo, op: on[i] },
              ].map((v) => (
                <span
                  key={v.w}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    textAlign: "center",
                    fontWeight: v.w,
                    color: v.col,
                    opacity: v.op * progress(f, at + i * stepIn, m.reveal),
                    transform: `scale(${(1 + (lift / size) * on[i]).toFixed(4)})`,
                    transformOrigin: "50% 100%",
                  }}
                >
                  {t}
                </span>
              ))}
              {/* the mark on the rule, growing from the label's own middle */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -RULE_DROP,
                  height: theme.shape.rule,
                  background: c.indigo,
                  transform: `scaleX(${on[i].toFixed(3)})`,
                }}
              />
            </span>
          </React.Fragment>
        ))}
      </div>
      {/* ⚠ THE RULE RUNS THE WHOLE ROW, gaps and separators included — it is the
          track the mark slides along, not four separate underlines. */}
      <div
        style={{
          marginTop: RULE_DROP - 2,
          height: theme.shape.rule,
          width: "100%",
          background: c.border,
          /* the rule draws along with them, left to right */
          transform: `scaleX(${progress(f, at, m.reveal + stepIn * (tabs.length - 1)).toFixed(3)})`,
          transformOrigin: "0% 50%",
        }}
      />
    </div>
  );
};
