/**
 * core/chart/Indicators.tsx — lines and bands drawn OVER a chart.
 *
 * Indicators are the one drawn thing that may take a colour of their own,
 * because their whole job is to be distinguishable from price. They still stay
 * inside the palette: indigo and its two tints, cyan, never red or green.
 *
 * Every line DRAWS ON with a trim path. Never a slide, never an opacity fade.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress } from "../helpers";
import { Layer } from "../Stage";
import { drawPath, lengthOf, pathOf, type Grid } from "./grid";

export type LineTone = "primary" | "tint1" | "tint2" | "cyan";

const inkOf = (c: ReturnType<typeof usePalette>, t: LineTone) =>
  t === "cyan" ? c.cyan : t === "tint1" ? c.indigoTint1 : t === "tint2" ? c.indigoTint2 : c.indigo;

/**
 * A moving average, or any single derived line. Values with a leading warm-up
 * of nulls are handled: the path simply starts where the average starts, which
 * is the honest picture of when it becomes computable.
 */
export const IndicatorLine = ({
  values,
  grid,
  at,
  over,
  tone = "primary",
  opacity = 1,
  dashed = false,
}: {
  values: (number | null)[];
  grid: Grid;
  at: number;
  over: number;
  tone?: LineTone;
  opacity?: number;
  dashed?: boolean;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));
  const len = lengthOf(values, grid);
  return (
    <Layer opacity={opacity}>
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={inkOf(c, tone)}
        strokeWidth={theme.shape.line}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(dashed
          ? { strokeDasharray: "10 8", opacity: p }
          : drawPath(p, len))}
      />
    </Layer>
  );
};

/**
 * A band between two series — Bollinger, a channel, an envelope.
 *
 * The fill arrives by opacity and the edges draw on, because a band has no
 * direction to draw in: it is an area, and an area that wipes sideways reads as
 * a curtain rather than as a measurement.
 */
export const IndicatorBand = ({
  upper,
  lower,
  grid,
  at,
  over,
  opacity = 1,
  edges = true,
}: {
  upper: (number | null)[];
  lower: (number | null)[];
  grid: Grid;
  at: number;
  over: number;
  opacity?: number;
  edges?: boolean;
}) => {
  const f = useCurrentFrame();
  /* ⚠ NO usePalette HERE, deliberately. The fill is `theme.color.indigoWash`,
     which is an alpha wash rather than a palette slot, so this component has
     nothing to read from the palette — its EDGES do, through IndicatorLine.
     It used to call usePalette() and drop the result, which `noUnusedLocals`
     rejects. If the wash should follow a palette change, the fix is a wash
     slot in the palette, not a call whose value goes nowhere. */
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, Math.max(1, over));

  const top = upper
    .map((v, i) => (v === null ? null : { x: grid.x(i), y: grid.y(v) }))
    .filter((v): v is { x: number; y: number } => v !== null);
  const bot = lower
    .map((v, i) => (v === null ? null : { x: grid.x(i), y: grid.y(v) }))
    .filter((v): v is { x: number; y: number } => v !== null);
  if (!top.length || !bot.length) return null;

  const area =
    `M${top.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join("L")}` +
    `L${[...bot].reverse().map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join("L")}Z`;

  return (
    <>
      <Layer opacity={opacity * p}>
        <path d={area} fill={theme.color.indigoWash} stroke="none" />
      </Layer>
      {edges && (
        <>
          <IndicatorLine values={upper} grid={grid} at={at} over={over} tone="tint1" opacity={opacity} />
          <IndicatorLine values={lower} grid={grid} at={at} over={over} tone="tint1" opacity={opacity} />
        </>
      )}
    </>
  );
};

/**
 * A crossing marker — where two lines swap order. Given the index, not
 * detected here: which crossing matters is a scene's claim, not a computation.
 */
export const CrossMark = ({
  index,
  value,
  grid,
  at,
  label,
  tone = "primary",
}: {
  index: number;
  value: number;
  grid: Grid;
  at: number;
  label?: string;
  tone?: LineTone;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (f < at) return null;
  const p = progress(f, at, 10);
  const ink = inkOf(c, tone);
  return (
    <Layer>
      <circle
        cx={grid.x(index)}
        cy={grid.y(value)}
        r={10 * p}
        fill="none"
        stroke={ink}
        strokeWidth={theme.shape.rule}
      />
      {label && (
        <text
          x={grid.x(index)}
          y={grid.y(value) - 22}
          textAnchor="middle"
          fontFamily={theme.text.family}
          fontSize={theme.text.tag.size}
          fontWeight={theme.text.tag.weight}
          fill={ink}
          opacity={p}
        >
          {label}
        </text>
      )}
    </Layer>
  );
};
