/**
 * PriceLine.tsx — the raw price, drawn as a line and traced left to right.
 *
 * NEUTRAL, never coloured. The whole episode turns on the contrast between what
 * price does and what an indicator says about it, so price is the dark line and
 * the indicators own indigo and cyan. A coloured price line would put them on
 * the same footing.
 */
import { theme } from "../theme";
import { drawPath } from "../helpers";
import { Layer } from "./Stage";
import { pathOf, lengthOf, type Grid } from "./plot";

export const PriceLine = ({
  values,
  grid,
  f,
  at,
  over,
  opacity = 1,
  width = 2.5,
  color = theme.color.priceLine,
}: {
  values: (number | null)[];
  grid: Grid;
  f: number;
  at: number;
  over: number;
  opacity?: number;
  width?: number;
  color?: string;
}) => {
  /* the guard every animated path in this episode needs: without it frame 0
     renders the finished line for one frame before the trim takes over */
  if (f < at || opacity <= 0.001) return null;
  const len = lengthOf(values, grid);
  return (
    <Layer opacity={opacity}>
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawPath(f, at, over, len)}
      />
    </Layer>
  );
};
