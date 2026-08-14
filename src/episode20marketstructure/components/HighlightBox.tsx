/**
 * HighlightBox.tsx — the box that points at part of a screen recording.
 *
 * A wash and a hairline, the same pair SC16 uses on its own chart, so a
 * highlight means the same thing whether the picture underneath was drawn here
 * or filmed. It is deliberately WIDER than the footage it sits on: a box
 * inside the frame reads as part of the app's own interface, and the whole
 * point is that this mark is ours and the screen is theirs.
 *
 * Given in canvas pixels, because what it points at is a place on a recording
 * and there is nothing else to measure it against.
 */
import { theme } from "../theme";
import { Layer } from "./Stage";

export type HLRect = { x1: number; y1: number; x2: number; y2: number };

export const HighlightBox = ({
  rect,
  opacity = 1,
  grow = 1,
  collapse = 1,
  radius = 14,
}: {
  rect: HLRect;
  opacity?: number;
  /**
   * 0 → 1 of the box's width, always measured from its LEFT edge. So it opens
   * rightwards and closes back the way it came, and the left edge — which is
   * where the thing being pointed at starts — never moves.
   */
  grow?: number;
  /**
   * 0 → 1 of the box's height, measured from its own CENTRE. Width closes from
   * an edge because the edge is the claim; height has no such edge, so it shuts
   * like a lid and the thing inside stays in the middle of it while it goes.
   */
  collapse?: number;
  radius?: number;
}) => {
  const width = (rect.x2 - rect.x1) * Math.max(0, Math.min(1, grow));
  const height = (rect.y2 - rect.y1) * Math.max(0, Math.min(1, collapse));
  if (opacity <= 0.001 || width < 1 || height < 1) return null;
  return (
    <Layer opacity={opacity}>
      <rect
        x={rect.x1}
        y={(rect.y1 + rect.y2) / 2 - height / 2}
        width={width}
        height={height}
        rx={Math.min(radius, height / 2)}
        fill={theme.color.indigoWash}
        stroke={theme.color.indigo}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

/**
 * The same mark, drawn round. For a thing on a chart that has no width worth
 * bracketing — a single peak — where a box would imply a range it does not
 * mean. It lands rather than opens: a ring cannot draw sideways out of an
 * edge, so it settles in from slightly large instead.
 */
export const HighlightCircle = ({
  cx,
  cy,
  r,
  opacity = 1,
  settle = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
  /** 0 → 1. Below 1 the ring is oversized, so it closes onto its target. */
  settle?: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      <circle
        cx={cx}
        cy={cy}
        r={r * (1.18 - 0.18 * Math.max(0, Math.min(1, settle)))}
        fill={theme.color.indigoWash}
        stroke={theme.color.indigo}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

/**
 * Two flashes, then solid. `step` is how long ONE rise or fall takes, so the
 * whole thing is three of them: up, down, up and stay.
 *
 * The curve is a cosine, not a switch. A hard on/off strobes — at 30fps the
 * eye reads it as a glitch in the render rather than as emphasis — where an
 * eased pulse reads as the mark insisting on itself. Used where a mark has to
 * be NOTICED rather than merely appear, under a voice already talking about
 * something else.
 */
export const blink = (f: number, at: number, step: number) => {
  const t = f - at;
  if (t < 0) return 0;
  if (t >= step * 3) return 1;
  return 0.5 - 0.5 * Math.cos((t / step) * Math.PI);
};
