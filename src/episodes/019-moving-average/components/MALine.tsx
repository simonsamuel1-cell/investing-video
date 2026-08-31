/**
 * MALine.tsx — one moving average, traced.
 *
 * THE COLOUR BINDING IS FIXED FOR THE WHOLE EPISODE and must never swap: the
 * SLOW average is indigo, the FAST one is cyan. Scene 12A's voice-over calls
 * the slow line "garis ungu" — the purple line — so at that point the binding
 * is not a style choice, it is a caption the viewer is asked to follow.
 *
 * `color` overrides it, and exists for the ONE case the binding does not
 * cover: a scene showing a SINGLE average, with no fast/slow pair to tell
 * apart and no caption naming its colour. There it is orange, at Simon's
 * direction, so the line reads off the wash it is drawn on. Never use it to
 * recolour one half of a pair.
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
  color,
}: {
  values: (number | null)[];
  grid: Grid;
  f: number;
  drawFrom: number;
  drawDur: number;
  variant: "fast" | "slow";
  opacity?: number;
  width?: number;
  color?: string;
}) => {
  /* the guard every animated path needs — see §2.8 */
  if (f < drawFrom || opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={color ?? (variant === "fast" ? theme.colors.cyan : theme.colors.indigo)}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawPath(f, drawFrom, drawDur, lengthOf(values, grid))}
      />
    </Layer>
  );
};
