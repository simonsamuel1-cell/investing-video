/**
 * MovingAverageLine.tsx — one moving average, traced.
 *
 * THE COLOUR BINDING IS FIXED FOR THE WHOLE EPISODE and must never swap: the
 * SLOW average is indigo, the FAST one is cyan. Scene 12A's voice-over says
 * "garis ungu" — the purple line — about the slow MA, so the binding is not a
 * style choice at that point, it is a caption the viewer is asked to follow.
 */
import { theme } from "../theme";
import { drawPath } from "../helpers";
import { Layer } from "./Stage";
import { pathOf, lengthOf, type Grid } from "./plot";

export type MaVariant = "fast" | "slow";

export const maColor = (variant: MaVariant) =>
  variant === "fast" ? theme.color.cyan : theme.color.indigo;

export const MovingAverageLine = ({
  values,
  grid,
  f,
  at,
  over,
  variant,
  opacity = 1,
  width = theme.shape.line,
}: {
  values: (number | null)[];
  grid: Grid;
  f: number;
  at: number;
  over: number;
  variant: MaVariant;
  opacity?: number;
  width?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={maColor(variant)}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawPath(f, at, over, lengthOf(values, grid))}
      />
    </Layer>
  );
};
