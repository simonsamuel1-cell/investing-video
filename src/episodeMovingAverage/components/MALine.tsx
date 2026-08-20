/**
 * MALine.tsx — one moving average, traced.
 *
 * THE COLOUR BINDING IS FIXED FOR THE WHOLE EPISODE and must never swap: the
 * SLOW average is indigo, the FAST one is cyan. Scene 12A's voice-over calls
 * the slow line "garis ungu" — the purple line — so at that point the binding
 * is not a style choice, it is a caption the viewer is asked to follow.
 */
import { theme } from "../theme";
import { drawPath } from "../helpers";
import { Layer, pathOf, lengthOf, type Grid } from "./ChartFrame";

export const MALine = ({
  values,
  grid,
  f,
  drawFrom,
  drawDur,
  variant,
  opacity = 1,
  width = theme.layout.stroke.ma,
}: {
  values: (number | null)[];
  grid: Grid;
  f: number;
  drawFrom: number;
  drawDur: number;
  variant: "fast" | "slow";
  opacity?: number;
  width?: number;
}) => {
  /* the guard every animated path needs — see §2.8 */
  if (f < drawFrom || opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={variant === "fast" ? theme.colors.cyan : theme.colors.indigo}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawPath(f, drawFrom, drawDur, lengthOf(values, grid))}
      />
    </Layer>
  );
};
