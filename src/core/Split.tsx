/**
 * core/Split.tsx — two things side by side, for a scene whose whole claim is a
 * comparison.
 *
 * ⚠ A COMPARISON IS ONLY HONEST IF BOTH SIDES SHARE A SCALE. When the two
 * panels hold charts, build ONE domain from BOTH series and pass it to both
 * grids — see domainOf. Left to itself each chart normalises to its own range,
 * which is how a split screen quietly rigs the question it is asking.
 *
 * The divider draws down from the top rather than fading, so the split reads as
 * something being made rather than something that was always there.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";
import { Layer } from "./Stage";
import { columns, type Rect } from "./helpers";

/** The two halves of the card, with a gap. Use these as each panel's rect. */
export const splitRects = (gap = 48, rect: Rect = theme.stage.card): [Rect, Rect] => {
  const [a, b] = columns(rect, 2, gap);
  return [a, b];
};

export const SplitDivider = ({
  at,
  over,
  rect = theme.stage.card,
  opacity = 1,
}: {
  at: number;
  over: number;
  rect?: Rect;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));
  const x = rect.x + rect.w / 2;
  return (
    <Layer opacity={opacity}>
      <line
        x1={x}
        y1={rect.y}
        x2={x}
        y2={rect.y + rect.h * p}
        stroke={c.border}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

/**
 * A caption above each half — what the side IS. Kept short and Title Case; the
 * reading of the comparison belongs in a Chip on the thing itself, not here.
 */
export const SplitLabels = ({
  left,
  right,
  at,
  rect = theme.stage.card,
  gap = 48,
}: {
  left: string;
  right: string;
  at: number;
  rect?: Rect;
  gap?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const [a, b] = splitRects(gap, rect);
  const p = progress(f, at, m.reveal);
  const style = (r: Rect): React.CSSProperties => ({
    position: "absolute",
    left: r.x + r.w / 2,
    top: r.y - 16,
    transform: "translate(-50%, -100%)",
    fontFamily: theme.text.family,
    fontSize: theme.text.chip.size,
    fontWeight: 700,
    color: c.slate,
    opacity: p,
    whiteSpace: "nowrap",
  });
  if (f < at) return null;
  return (
    <>
      <div style={style(a)}>{left}</div>
      <div style={style(b)}>{right}</div>
    </>
  );
};
