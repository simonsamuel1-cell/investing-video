/**
 * core/chart/Chart.tsx — THE chart. There is one per continuity group; it lives
 * in the box the scene's layout hands it, and between scenes only the
 * annotation changes.
 *
 * It never arrives complete. `at` and `over` say when the tape starts building
 * and how long it takes; a line draws on with a trim path, candles arrive one
 * by one. Every scene needs at least one motion that EXPLAINS something.
 *
 * Gridlines and the price scale are chrome: indigo / cyan / neutral only.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, price as fmtPrice } from "../helpers";
import { Layer } from "../Stage";
import { Candles } from "./Candles";
import { drawPath, lengthOf, pathOf, ticksOf, type Grid } from "./grid";
import type { Series } from "./series";

export const Chart = ({
  series,
  grid,
  mode = "candle",
  at,
  over,
  opacity = 1,
  ticks,
  tickLabels = true,
  baseline = true,
  gridSpan,
}: {
  series: Series;
  grid: Grid;
  mode?: "candle" | "line";
  /** Frame the tape starts building on. Scene-local. */
  at: number;
  /** Frames it takes to build. Use useMotion().sec(...). */
  over: number;
  opacity?: number;
  /** Price levels for gridlines. Defaults to ticksOf(the grid's domain). */
  ticks?: number[];
  tickLabels?: boolean;
  /**
   * The rule along the bottom of the plot box. A floor for a chart that has one
   * — a tape sitting ON its axis. A chart whose price levels are already drawn
   * does not: the rule then sits below the lowest of them, level with nothing,
   * and reads as a stray line across the frame.
   */
  baseline?: boolean;
  /**
   * The rectangle the gridlines live in, when it is not the plot box. A tape
   * that runs on past the card leaves its new bars standing on empty white,
   * because the grid stops where the box stops. Pass the span the drawn tape
   * actually occupies: `x2` carries the lines across the new bars and `y1`
   * decides which price levels exist yet, so a level appears as the tape climbs
   * through it rather than all of them arriving at once.
   */
  gridSpan?: { x1: number; x2: number; y1: number; y2: number };
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001) return null;

  const box = grid.box;
  const shown = progress(f, at, Math.max(1, over));
  const span = gridSpan ?? { x1: box.x, x2: box.x + box.w, y1: box.y, y2: box.y + box.h };
  const levels = ticks ?? ticksOf([grid.lo, grid.hi]);
  /* only ticks the chart actually reaches — a gridline for a price outside the
     plot is meaningless, and its LABEL lands outside the box */
  const inBox = levels.filter((p) => {
    const y = grid.y(p);
    return y >= span.y1 && y <= span.y2;
  });

  return (
    <>
      <Layer opacity={opacity}>
        {inBox.map((p) => (
          <line
            key={p}
            x1={span.x1}
            y1={grid.y(p)}
            x2={span.x2}
            y2={grid.y(p)}
            stroke={c.border}
            strokeWidth={theme.shape.hairline}
          />
        ))}
        {baseline && (
          <line
            x1={span.x1}
            y1={box.y + box.h}
            x2={span.x2}
            y2={box.y + box.h}
            stroke={c.border}
            strokeWidth={theme.shape.hairline}
          />
        )}
      </Layer>

      {tickLabels &&
        inBox.map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: span.x2 - 8,
              top: grid.y(p),
              transform: "translate(-100%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.axis.size,
              fontWeight: theme.text.axis.weight,
              color: c.muted,
              opacity,
            }}
          >
            {fmtPrice(p)}
          </div>
        ))}

      {/* the guard every animated path needs: without it frame 0 shows the
          finished series for a single frame */}
      {f >= at &&
        (mode === "line" ? (
          <Layer opacity={opacity}>
            <path
              d={pathOf(series.closes, grid)}
              fill="none"
              stroke={c.indigo}
              strokeWidth={theme.shape.line}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...drawPath(shown, lengthOf(series.closes, grid))}
            />
          </Layer>
        ) : (
          <Candles bars={series.bars} grid={grid} shown={shown} opacity={opacity} />
        ))}
    </>
  );
};

/**
 * The dated timeline under a chart. Every chart shows a price scale and a
 * timeline; a tape with neither is a shape, not a chart.
 */
export const TimeAxis = ({
  labels,
  grid,
  at,
  opacity = 1,
}: {
  /** `[barIndex, "30 Jun"]`. Sparse by design — one per turn worth naming. */
  labels: [number, string][];
  grid: Grid;
  at: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  return (
    <>
      {labels.map(([i, text]) => (
        <div
          key={`${i}-${text}`}
          style={{
            position: "absolute",
            left: grid.x(i),
            top: grid.box.y + grid.box.h + 14,
            transform: "translateX(-50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.axis.size,
            fontWeight: theme.text.axis.weight,
            color: c.muted,
            opacity,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ))}
    </>
  );
};
