/**
 * HighlightBox.tsx — marks a region of the chart, indigo at 12%.
 *
 * It opens by GROWING FROM ITS LEFT EDGE and closes the same way in reverse, so
 * the edge that anchors the reading never moves. A box that faded in place
 * would leave the viewer unsure which edge was the claim.
 *
 * `pulse` breathes the fill between 0.12 and 0.20 — used once, in Scene 09,
 * where the content of the beat is that nothing is happening and the box has to
 * stay alive without anything else moving.
 */
import { theme } from "../theme";
import { progressInOut, clamp01 } from "../helpers";
import { Layer } from "./ChartFrame";

export const HighlightBox = ({
  x1,
  x2,
  y1,
  y2,
  f,
  at,
  over = 16,
  gone,
  pulse = false,
  opacity = 1,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  f: number;
  at: number;
  over?: number;
  /** The frame it has FINISHED closing — the close begins at `gone − over`. */
  gone?: number;
  pulse?: boolean;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const open = progressInOut(f, at, over);
  const shut = gone === undefined ? 0 : f >= gone - over ? progressInOut(f, gone - over, over) : 0;
  const grow = clamp01(open * (1 - shut));
  if (grow <= 0.001) return null;
  const fillOpacity = pulse ? 0.12 + 0.08 * (0.5 + 0.5 * Math.sin((f - at) / 15)) : 0.12;
  return (
    <Layer opacity={opacity}>
      <rect
        x={x1}
        y={y1}
        width={(x2 - x1) * grow}
        height={y2 - y1}
        fill={theme.color.indigo}
        fillOpacity={fillOpacity}
        rx={12}
      />
    </Layer>
  );
};
