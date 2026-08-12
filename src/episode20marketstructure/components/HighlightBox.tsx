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
  radius?: number;
}) => {
  const width = (rect.x2 - rect.x1) * Math.max(0, Math.min(1, grow));
  if (opacity <= 0.001 || width < 1) return null;
  return (
    <Layer opacity={opacity}>
      <rect
        x={rect.x1}
        y={rect.y1}
        width={width}
        height={rect.y2 - rect.y1}
        rx={radius}
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
