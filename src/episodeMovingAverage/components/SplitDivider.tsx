/**
 * SplitDivider.tsx — the one vertical rule in the episode, Scene 01 only.
 *
 * Scene 01 is the single place the chart box is split, because its whole
 * argument is a side-by-side: four laboured marks on the left, one instant line
 * on the right. Every other scene uses the shared box whole.
 */
import { theme } from "../theme";
import { progress } from "../helpers";
import { Layer, CHART } from "./ChartFrame";

export const SplitDivider = ({ f, at = 0 }: { f: number; at?: number }) => {
  if (f < at) return null;
  return (
    <Layer opacity={progress(f, at, 14)}>
      <line
        x1={theme.canvas.width / 2}
        y1={CHART.y}
        x2={theme.canvas.width / 2}
        y2={CHART.y + CHART.h}
        stroke={theme.color.border}
        strokeWidth={theme.shape.hairline}
      />
    </Layer>
  );
};
