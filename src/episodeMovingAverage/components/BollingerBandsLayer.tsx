/**
 * BollingerBandsLayer.tsx — middle band, two outer bands, and the channel.
 *
 * THE OUTER BANDS UNFOLD OUT OF THE MIDDLE ONE. `unfold` scales each band's
 * DISTANCE from the middle, from 0 to its real value, so at the start both
 * bands lie exactly on the average and they separate outward together. That is
 * the fact the scene is teaching — the bands are a distance from the mean, not
 * two lines that happen to sit either side of it.
 *
 * The middle band is dashed indigo because it IS a moving average, the same one
 * the first half of the episode spent five scenes on. Solid would make it look
 * like a third, different thing.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";
import { Layer } from "./Stage";
import { pathOf, type Grid } from "./plot";

export const BollingerBandsLayer = ({
  mid,
  upper,
  lower,
  grid,
  unfold = 1,
  opacity = 1,
  showMid = true,
  fillOpacity = 0.1,
}: {
  mid: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
  grid: Grid;
  /** 0 = both bands sit on the middle; 1 = their true distance. */
  unfold?: number;
  opacity?: number;
  showMid?: boolean;
  fillOpacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  const k = clamp01(unfold);
  const at = (band: (number | null)[], i: number) => {
    const m = mid[i];
    const b = band[i];
    return m === null || b === null ? null : m + (b - m) * k;
  };
  const up = upper.map((_, i) => at(upper, i));
  const dn = lower.map((_, i) => at(lower, i));

  /** The channel: down the upper band and back along the lower one. */
  const first = up.findIndex((v) => v !== null);
  let fill = "";
  if (first >= 0 && k > 0.001) {
    const fwd = pathOf(up, grid);
    const back: string[] = [];
    for (let i = dn.length - 1; i >= 0; i--) {
      const v = dn[i];
      if (v !== null) back.push(`L${grid.x(i).toFixed(1)},${grid.y(v).toFixed(1)}`);
    }
    fill = `${fwd} ${back.join(" ")} Z`;
  }

  return (
    <Layer opacity={opacity}>
      {fill !== "" && <path d={fill} fill={theme.color.cyan} fillOpacity={fillOpacity} stroke="none" />}
      {showMid && (
        <path
          d={pathOf(mid, grid)}
          fill="none"
          stroke={theme.color.indigo}
          strokeWidth={theme.shape.rule}
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
      )}
      {[up, dn].map((band, n) => (
        <path
          key={n}
          d={pathOf(band, grid)}
          fill="none"
          stroke={theme.color.cyan}
          strokeWidth={theme.shape.rule}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Layer>
  );
};
