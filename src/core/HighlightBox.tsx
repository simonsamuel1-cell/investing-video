/**
 * core/HighlightBox.tsx — the mark that points at part of a chart or a screen
 * recording.
 *
 * A wash and a hairline, the same pair used on drawn charts, so a highlight
 * means the same thing whether the picture underneath was drawn or filmed. On
 * footage it sits deliberately WIDER than the thing it marks: a box inside the
 * frame reads as part of the app's own interface, and the point is that this
 * mark is ours and the screen is theirs.
 *
 * Given in canvas pixels, because what it points at is a place on a recording
 * and there is nothing else to measure it against.
 */
import { theme } from "./theme";
import { usePalette } from "./palette";
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
   * 0 → 1 of the box's width, always measured from its LEFT edge. It opens
   * rightwards and closes back the way it came, so the left edge — where the
   * thing being pointed at starts — never moves.
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
  const c = usePalette();
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
        stroke={c.indigo}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

/**
 * The same mark, drawn round. For a thing that has no width worth bracketing —
 * a single peak — where a box would imply a range it does not mean. It LANDS
 * rather than opens: a ring cannot draw sideways out of an edge, so it settles
 * in from slightly large instead.
 */
export const HighlightCircle = ({
  cx,
  cy,
  r,
  opacity = 1,
  land = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
  /** 0 → 1. At 0 the ring is 1.35× and invisible; at 1 it is at size. */
  land?: number;
}) => {
  const c = usePalette();
  const t = Math.max(0, Math.min(1, land));
  if (opacity <= 0.001 || t <= 0.001) return null;
  return (
    <Layer opacity={opacity * t}>
      <circle
        cx={cx}
        cy={cy}
        r={r * (1.35 - 0.35 * t)}
        fill={theme.color.indigoWash}
        stroke={c.indigo}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};
