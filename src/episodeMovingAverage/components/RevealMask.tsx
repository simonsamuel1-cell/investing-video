/**
 * RevealMask.tsx — an OPAQUE cover over everything right of the playhead.
 *
 * Solid background fill, never a translucent scrim. Scene 12A asks the viewer
 * what happens next, and a future they can make out at 15% opacity is not a
 * question — it is a formality. The 2px indigo leading edge is the playhead
 * itself, so the frame says where "now" is.
 */
import { theme } from "../theme";
import { progressInOut } from "../helpers";
import { Layer } from "./ChartFrame";
import type { Box } from "./ChartFrame";

export const RevealMask = ({
  x,
  f,
  wipeFrom,
  wipeDur,
  box,
}: {
  x: number;
  f: number;
  wipeFrom: number;
  wipeDur: number;
  box: Box;
}) => {
  const wiped = f >= wipeFrom ? progressInOut(f, wipeFrom, wipeDur) : 0;
  const edge = x + (box.x + box.w - x) * wiped;
  if (edge >= box.x + box.w - 0.5) return null;
  /* the mask reaches past the chart's own top and bottom so a wick or a band
     cannot peek out above or below it */
  const pad = 40;
  return (
    <Layer>
      <rect
        x={edge}
        y={box.y - pad}
        width={box.x + box.w - edge + pad}
        height={box.h + pad * 2}
        fill={theme.colors.bg}
      />
      <line
        x1={edge}
        y1={box.y - pad}
        x2={edge}
        y2={box.y + box.h + pad}
        stroke={theme.colors.indigo}
        strokeWidth={theme.layout.stroke.band}
      />
    </Layer>
  );
};
