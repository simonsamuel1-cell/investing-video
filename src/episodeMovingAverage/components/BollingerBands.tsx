/**
 * BollingerBands.tsx — middle band, two outer bands, and the channel between.
 *
 * THE OUTER BANDS UNFOLD OUT OF THE MIDDLE ONE. `unfold` scales each band's
 * DISTANCE from the middle, 0 → its real value, so they start lying exactly on
 * the average and separate outward together. That is the definition the scene
 * is teaching: a band is a distance from the mean, not a line that happens to
 * sit beside it.
 *
 * The middle band is dashed because it IS a moving average — the same one the
 * first half of the episode spent five scenes on. Solid would make it look like
 * a third, different thing.
 *
 * `midTone` steps the middle band back to `indigo70` on the GGRM chart only,
 * where a solid indigo SMA100 is on screen at the same time and the VO's
 * "garis ungu" has to stay unambiguous.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";
import { Layer, pathOf, type Grid } from "./ChartFrame";

export const BollingerBands = ({
  mid,
  upper,
  lower,
  grid,
  unfold = 1,
  opacity = 1,
  midTone = theme.color.indigo,
}: {
  mid: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
  grid: Grid;
  /** 0 = both bands on the middle line; 1 = their true distance. */
  unfold?: number;
  opacity?: number;
  midTone?: string;
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

  let fill = "";
  if (k > 0.001 && up.some((v) => v !== null)) {
    const back: string[] = [];
    for (let i = dn.length - 1; i >= 0; i--) {
      const v = dn[i];
      if (v !== null) back.push(`L${grid.x(i).toFixed(1)},${grid.y(v).toFixed(1)}`);
    }
    fill = `${pathOf(up, grid)} ${back.join(" ")} Z`;
  }

  return (
    <Layer opacity={opacity}>
      {fill !== "" && <path d={fill} fill={theme.color.cyan} fillOpacity={0.1} stroke="none" />}
      <path
        d={pathOf(mid, grid)}
        fill="none"
        stroke={midTone}
        strokeWidth={theme.shape.band}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      {[up, dn].map((band, n) => (
        <path
          key={n}
          d={pathOf(band, grid)}
          fill="none"
          stroke={theme.color.cyan}
          strokeWidth={theme.shape.band}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Layer>
  );
};
