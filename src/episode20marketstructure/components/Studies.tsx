/**
 * Studies.tsx — the indicator clutter SC02 piles on and then clears away.
 *
 * Every line here is computed from the same bars the candles are drawn from.
 * The scene's point is that real tools arrive before direction is read — not
 * that tools are noise — so drawing decorative squiggles would make the
 * argument dishonestly.
 *
 * Each path is mounted only once its own progress has started, so nothing can
 * flash a finished overlay on frame 0.
 */
import { theme } from "../theme";
import type { Rect } from "../helpers";
import type { Bar } from "../data/shape";
import { sma, bollinger } from "../data/studies";
import { barGrid } from "./CandleChart";

const line = (values: (number | null)[], x: (i: number) => number, y: (p: number) => number) => {
  const pts: string[] = [];
  values.forEach((v, i) => {
    if (v === null || v === undefined) return;
    pts.push(`${pts.length === 0 ? "M" : "L"}${x(i)},${y(v)}`);
  });
  return pts.join(" ");
};

export const Overlays = ({
  bars,
  box,
  fast = 0,
  slow = 0,
  envelope = 0,
}: {
  bars: Bar[];
  box: Rect;
  fast?: number;
  slow?: number;
  envelope?: number;
}) => {
  const g = barGrid(bars, box);
  const dFast = line(sma(bars, 20), g.x, g.scale);
  const dSlow = line(sma(bars, 50), g.x, g.scale);
  const bb = bollinger(bars, 20, 2);

  const top: string[] = [];
  const bottom: string[] = [];
  bars.forEach((_, i) => {
    const u = bb.upper[i];
    const l = bb.lower[i];
    if (u === null || l === null) return;
    top.push(`${g.x(i)},${g.scale(u)}`);
    bottom.unshift(`${g.x(i)},${g.scale(l)}`);
  });

  const dash = box.w * 2.4; // longer than any path, so one number trims all

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {envelope > 0.001 && top.length > 1 && <polygon points={top.concat(bottom).join(" ")} fill={theme.color.indigo} opacity={0.08 * envelope} />}
      {slow > 0.001 && dSlow && <path d={dSlow} fill="none" stroke={theme.color.cyan} strokeWidth={theme.shape.rule} strokeDasharray={dash} strokeDashoffset={dash * (1 - slow)} />}
      {fast > 0.001 && dFast && <path d={dFast} fill="none" stroke={theme.color.indigoLight} strokeWidth={theme.shape.rule} strokeDasharray={dash} strokeDashoffset={dash * (1 - fast)} />}
    </svg>
  );
};

/** One of the sub-panes that slides up over the price and buries it. */
export const SubPane = ({
  box,
  values,
  kind = "line",
  rise = 1,
  label,
  bounds,
}: {
  box: Rect;
  values: (number | null)[];
  kind?: "line" | "bars";
  rise?: number;
  label?: string;
  bounds?: [number, number];
}) => {
  if (rise <= 0.001) return null;
  const real = values.filter((v): v is number => v !== null && v !== undefined);
  if (real.length < 2) return null;
  const lo = bounds ? bounds[0] : Math.min(...real);
  const hi = bounds ? bounds[1] : Math.max(...real);
  const span = Math.max(1e-6, hi - lo);
  const x = (i: number) => box.x + (box.w * i) / Math.max(1, values.length - 1);
  const y = (v: number) => box.y + box.h - ((v - lo) / span) * box.h;
  const zero = y(Math.max(lo, Math.min(hi, 0)));
  const w = Math.max(1.5, (box.w / values.length) * 0.6);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `translateY(${(1 - rise) * 90}px)`, opacity: rise }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={theme.color.indigoWash} rx={theme.shape.chipRadius} />
      {kind === "line" ? (
        <path d={line(values, x, y)} fill="none" stroke={theme.color.indigoLight} strokeWidth={theme.shape.rule} />
      ) : (
        values.map((v, i) =>
          v === null || v === undefined ? null : (
            <rect key={i} x={x(i) - w / 2} y={Math.min(zero, y(v))} width={w} height={Math.max(1, Math.abs(y(v) - zero))} fill={theme.color.indigoLight} />
          ),
        )
      )}
      {label && (
        <text x={box.x + 4} y={box.y - 8} fontFamily={theme.text.family} fontSize={theme.text.axis.size} fontWeight={theme.text.axis.weight} fill={theme.color.slate}>
          {label}
        </text>
      )}
    </svg>
  );
};
