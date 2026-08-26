/**
 * BollingerBands.tsx — middle band, two outer bands, and the channel between.
 *
 * THE OUTER BANDS UNFOLD OUT OF THE MIDDLE ONE. `unfold` scales each band's
 * DISTANCE from the middle, 0 → its real value, so they start lying exactly on
 * the average and separate outward together. That is the definition the scene
 * teaches: a band is a distance from the mean, not a line that happens to sit
 * beside it.
 *
 * The middle band is dashed because it IS a moving average — the same one the
 * first half of the episode spent five scenes on. Solid would make it look
 * like a third, different thing.
 *
 * `midTone` steps the middle band back to `indigo70` on the GGRM chart only,
 * where a solid indigo SMA100 is on screen at the same time and the VO's
 * "garis ungu" has to stay unambiguous.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";
import { Layer, pathOf, lengthOf, type Grid } from "./ChartFrame";

export const BollingerBands = ({
  mid,
  upper,
  lower,
  grid,
  unfold = 1,
  bandsIn = 1,
  midTrace = 1,
  bandTrace = 1,
  fill: fillStrength,
  opacity = 1,
  midTone = theme.colors.indigo,
}: {
  mid: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
  grid: Grid;
  /** 0 = both bands on the middle line; 1 = their true distance. */
  unfold?: number;
  /**
   * How far the OUTER pair and their channel have arrived, separately from
   * `unfold`. They still emerge out of the average — that is the definition
   * the scene teaches — but a scene that gives the middle band its own beat
   * needs them absent until theirs, not sitting invisible on top of it.
   */
  bandsIn?: number;
  /** 0 → 1 traces the middle band in from the left, as every other average
      in the episode is drawn. 1 is simply there. */
  midTrace?: number;
  /**
   * 0 → 1 traces the OUTER pair and their channel in from the left, the same
   * way. It is an alternative to `unfold`, not a companion: a band can arrive
   * by growing out of the average or by travelling across the chart, and doing
   * both at once reads as neither.
   */
  bandTrace?: number;
  /**
   * Channel strength as a fraction of solid cyan. Left undefined, the channel
   * keeps the pale wash every other scene draws it with — so this is a
   * per-scene dial and not a change to all of them.
   */
  fill?: number;
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
      if (v !== null)
        back.push(`L${grid.x(i).toFixed(1)},${grid.y(v).toFixed(1)}`);
    }
    fill = `${pathOf(up, grid)} ${back.join(" ")} Z`;
  }

  const arrived = clamp01(bandsIn);
  const t = clamp01(midTrace);
  const bt = clamp01(bandTrace);
  /* the dashed middle band cannot use a trim path — its own dash pattern is
     the stroke's — so it is revealed by a clip that opens to the right */
  const midLen = lengthOf(mid, grid);

  return (
    <Layer opacity={opacity}>
      <defs>
        <clipPath id="bbMidWipe">
          <rect
            x={grid.box.x}
            y={grid.box.y - 40}
            width={grid.box.w * t}
            height={grid.box.h + 80}
          />
        </clipPath>
        <clipPath id="bbBandWipe">
          <rect
            x={grid.box.x}
            y={grid.box.y - 200}
            width={grid.box.w * bt}
            height={grid.box.h + 400}
          />
        </clipPath>
      </defs>

      {fill !== "" && arrived > 0.001 && bt > 0.001 && (
        <path
          d={fill}
          fill={
            fillStrength === undefined ? theme.colors.cyan12 : theme.colors.cyan
          }
          fillOpacity={(fillStrength ?? 0.6) * arrived}
          stroke="none"
          clipPath={bt < 0.999 ? "url(#bbBandWipe)" : undefined}
        />
      )}
      <path
        d={pathOf(mid, grid)}
        fill="none"
        stroke={midTone}
        strokeWidth={theme.layout.stroke.band}
        strokeDasharray="6 6"
        strokeLinecap="round"
        clipPath={t < 0.999 ? "url(#bbMidWipe)" : undefined}
        opacity={midLen > 0 ? 1 : 0}
      />
      {arrived > 0.001 &&
        bt > 0.001 &&
        [up, dn].map((band, n) => (
          <path
            key={n}
            d={pathOf(band, grid)}
            fill="none"
            stroke={theme.colors.cyan}
            strokeWidth={theme.layout.stroke.band}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={arrived}
            clipPath={bt < 0.999 ? "url(#bbBandWipe)" : undefined}
          />
        ))}
    </Layer>
  );
};
