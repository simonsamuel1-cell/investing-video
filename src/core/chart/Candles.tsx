/**
 * core/chart/Candles.tsx — the candles themselves, and nothing else.
 *
 * ═══ THE ONE PLACE GREEN AND RED APPEAR ═══
 *
 * Body AND wick take the candle's colour — one bar, one colour. The wick used
 * to be drawn in the price ink, which made a tall wick read as a separate mark
 * crossing its own candle.
 *
 * Everything OUTSIDE a candle stays indigo / cyan / neutral: axes, gridlines,
 * bands, reference lines, annotations, chrome. That is the rule that actually
 * matters, and it is why this file is separate — it is the only file in core
 * allowed to name candleGreen or candleRed, and the audit enforces that by
 * filename.
 *
 * BARS ARRIVE ONE BY ONE. `shown` is an eased 0→1 from the caller; the tape
 * builds with the voice-over instead of appearing complete. A chart that simply
 * appears is a failed scene.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";
import { Layer } from "../Stage";
import { candleWidth, type Grid } from "./grid";
import type { Bar } from "./series";

export const Candles = ({
  bars,
  grid,
  shown = 1,
  opacity = 1,
  /** Draw only from this index — for a tape that continues an earlier scene's. */
  from = 0,
}: {
  bars: Bar[];
  grid: Grid;
  /** Eased 0→1. The fraction of the tape that exists yet. */
  shown?: number;
  opacity?: number;
  from?: number;
}) => {
  const c = usePalette();
  if (opacity <= 0.001) return null;
  const upto = Math.ceil(bars.length * Math.max(0, Math.min(1, shown)));
  const w = candleWidth(grid);

  return (
    <Layer opacity={opacity}>
      {bars.slice(from, upto).map((b, k) => {
        const i = from + k;
        const x = grid.x(i);
        const top = Math.min(grid.y(b.o), grid.y(b.c));
        const h = Math.max(1.5, Math.abs(grid.y(b.c) - grid.y(b.o)));
        const fill = b.c >= b.o ? c.candleGreen : c.candleRed;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={grid.y(b.h)}
              x2={x}
              y2={grid.y(b.l)}
              stroke={fill}
              strokeWidth={theme.shape.rule}
            />
            <rect x={x - w / 2} y={top} width={w} height={h} fill={fill} />
          </g>
        );
      })}
    </Layer>
  );
};

/**
 * A volume histogram under the price panel.
 *
 * ⚠ THE COLOUR FOLLOWS THE CANDLE — it does not mean buying or selling. Every
 * trade has a buyer and a seller. This is the one place outside the candles
 * where green and red are correct, precisely because the bar IS its candle
 * restated.
 */
export const VolumeBars = ({
  bars,
  volume,
  grid,
  box,
  shown = 1,
  opacity = 1,
  peak: peakIn,
}: {
  bars: Bar[];
  /** Relative heights, 0→~3. See volumeOf in series.ts. */
  volume: number[];
  /** The PRICE grid — used only for x, so bars line up with their candles. */
  grid: Grid;
  /** The band the histogram occupies, in canvas pixels. */
  box: { x: number; y: number; w: number; h: number };
  shown?: number;
  opacity?: number;
  /**
   * The value that reaches the top of the band. Defaults to this array's own
   * maximum.
   *
   * ⚠ PASS IT WHENEVER TWO HISTOGRAMS ARE COMPARED. Left to itself each one
   * normalises to its OWN peak, so a stock trading 4 million and a stock
   * trading 14 million draw identical tallest bars — which is exactly the
   * misreading the episode about volume exists to correct. It is the same
   * trap as an unshared price domain, one axis down.
   */
  peak?: number;
}) => {
  const c = usePalette();
  if (opacity <= 0.001) return null;
  const upto = Math.ceil(bars.length * Math.max(0, Math.min(1, shown)));
  const w = candleWidth(grid);
  const peak = peakIn ?? Math.max(1e-9, ...volume);

  return (
    <Layer opacity={opacity}>
      {bars.slice(0, upto).map((b, i) => {
        const h = (volume[i] / peak) * box.h;
        const fill = b.c >= b.o ? c.candleGreen : c.candleRed;
        return (
          <rect
            key={i}
            x={grid.x(i) - w / 2}
            y={box.y + box.h - h}
            width={w}
            height={Math.max(1, h)}
            fill={fill}
            opacity={0.72}
          />
        );
      })}
    </Layer>
  );
};
