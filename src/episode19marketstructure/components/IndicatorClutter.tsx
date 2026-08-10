/**
 * IndicatorClutter — the tools SC02 piles onto the chart before clearing them.
 *
 * Every value is COMPUTED from the same series the candles are drawn from
 * (data/indicators). Drawing decorative squiggles here would make the scene's
 * point dishonestly: the argument is that real tools arrive before direction is
 * read, not that tools are noise.
 *
 * Each path is conditionally mounted by its own progress, so nothing can flash
 * an end-state on frame 0.
 */
import { theme } from "../theme";
import type { Box } from "../helpers";
import type { OHLC } from "../data/series";
import { sma, bollinger } from "../data/indicators";

const pathOf = (vals: (number | null)[], a: number, b: number, cx: (i: number) => number, scale: (p: number) => number) => {
  const pts: string[] = [];
  for (let i = a; i <= b; i++) {
    const v = vals[i];
    if (v === null || v === undefined) continue;
    pts.push(`${pts.length === 0 ? "M" : "L"}${cx(i)},${scale(v)}`);
  }
  return pts.join(" ");
};

export const IndicatorClutter = ({
  data,
  window: win,
  box,
  cx,
  scale,
  maFast = 0,
  maSlow = 0,
  band = 0,
}: {
  data: OHLC[];
  window: [number, number];
  box: Box;
  cx: (i: number) => number;
  scale: (p: number) => number;
  maFast?: number;
  maSlow?: number;
  band?: number;
}) => {
  const [a, b] = win;
  const fast = pathOf(sma(data, 20), a, b, cx, scale);
  const slow = pathOf(sma(data, 50), a, b, cx, scale);
  const bb = bollinger(data, 20, 2);

  const up: string[] = [];
  const lo: string[] = [];
  for (let i = a; i <= b; i++) {
    const u = bb.upper[i];
    const l = bb.lower[i];
    if (u === null || l === null) continue;
    up.push(`${cx(i)},${scale(u)}`);
    lo.unshift(`${cx(i)},${scale(l)}`);
  }

  const LEN = box.w * 2.4; // dash comfortably longer than any path

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {band > 0.001 && up.length > 1 && <polygon points={up.concat(lo).join(" ")} fill={theme.colors.indigo} opacity={0.08 * band} />}
      {maSlow > 0.001 && slow && (
        <path d={slow} fill="none" stroke={theme.colors.cyan} strokeWidth={theme.stroke.rule} strokeDasharray={LEN} strokeDashoffset={LEN * (1 - maSlow)} />
      )}
      {maFast > 0.001 && fast && (
        <path d={fast} fill="none" stroke={theme.colors.indigoMA1} strokeWidth={theme.stroke.rule} strokeDasharray={LEN} strokeDashoffset={LEN * (1 - maFast)} />
      )}
    </svg>
  );
};

/** One of the sub-panes that slides up under the price and buries it. */
export const SubPane = ({
  box,
  values,
  window: win,
  kind = "line",
  rise = 1,
  label,
  bounds,
}: {
  box: Box;
  values: (number | null)[];
  window: [number, number];
  kind?: "line" | "hist";
  rise?: number;
  label?: string;
  bounds?: [number, number];
}) => {
  if (rise <= 0.001) return null;
  const [a, b] = win;
  const slice = values.slice(a, b + 1);
  const real = slice.filter((v): v is number => v !== null && v !== undefined);
  if (real.length < 2) return null;
  const lo = bounds ? bounds[0] : Math.min(...real);
  const hi = bounds ? bounds[1] : Math.max(...real);
  const span = Math.max(1e-6, hi - lo);
  const x = (i: number) => box.x + (box.w * (i - a)) / Math.max(1, b - a);
  const y = (v: number) => box.y + box.h - ((v - lo) / span) * box.h;
  const zero = y(Math.max(lo, Math.min(hi, 0)));
  const barW = Math.max(1.5, (box.w / Math.max(1, b - a)) * 0.6);

  const d = slice
    .map((v, i) => (v === null || v === undefined ? null : `${x(a + i)},${y(v)}`))
    .filter(Boolean)
    .map((s, i) => `${i === 0 ? "M" : "L"}${s}`)
    .join(" ");

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `translateY(${(1 - rise) * 90}px)`, opacity: rise }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={theme.colors.indigoTint8} rx={theme.radius.chip} />
      {kind === "line" ? (
        <path d={d} fill="none" stroke={theme.colors.indigoMA1} strokeWidth={theme.stroke.rule} />
      ) : (
        slice.map((v, i) =>
          v === null || v === undefined ? null : (
            <rect
              key={i}
              x={x(a + i) - barW / 2}
              y={Math.min(zero, y(v))}
              width={barW}
              height={Math.max(1, Math.abs(y(v) - zero))}
              fill={theme.colors.indigoMA1}
            />
          ),
        )
      )}
      {label && (
        <text x={box.x + 12} y={box.y + 24} fontFamily={theme.type.family} fontSize={theme.type.axis.size} fontWeight={theme.type.axis.weight} fill={theme.colors.slate}>
          {label}
        </text>
      )}
    </svg>
  );
};
