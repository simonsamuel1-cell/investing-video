/**
 * IndicatorOverlays — the schematic indicator layers that accrete over a price
 * chart (S1) and strip away (S2). Each is an SVG <g> drawn into a rect, so
 * ClutterChart can stack them in one <svg>. All pure shapes — no numbers.
 */
import { COLORS } from "../theme";
import { genSeries, movingAvg, polyPoints } from "../helpers";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Moving-average line over the price area (smoothed series, same seed). */
export const MAOverlay = ({
  series,
  window,
  rect,
  color,
  opacity = 1,
  strokeWidth = 3,
  pad = 16,
}: {
  series: number[];
  window: number;
  rect: Rect;
  color: string;
  opacity?: number;
  strokeWidth?: number;
  pad?: number;
}) => {
  const ma = movingAvg(series, window);
  const pts = polyPoints(ma, rect.w, rect.h, pad);
  return (
    <g transform={`translate(${rect.x} ${rect.y})`} opacity={opacity}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={window > 30 ? "10 8" : undefined}
      />
    </g>
  );
};

/** Parabolic-SAR dots: small marks alternating above/below the price path. */
export const SARDots = ({
  series,
  rect,
  opacity = 1,
  step = 3,
  pad = 16,
  r = 3,
}: {
  series: number[];
  rect: Rect;
  opacity?: number;
  step?: number;
  pad?: number;
  r?: number;
}) => {
  const dots = series
    .map((v, i) => ({ v, i }))
    .filter((_, i) => i % step === 0)
    .map(({ v, i }) => {
      const x = pad + (i / (series.length - 1)) * (rect.w - pad * 2);
      const above = i % (step * 2) === 0;
      const y = pad + (1 - v) * (rect.h - pad * 2) + (above ? -14 : 14);
      return { x, y };
    });
  return (
    <g transform={`translate(${rect.x} ${rect.y})`} opacity={opacity}>
      {dots.map((d, k) => (
        <circle key={k} cx={d.x} cy={d.y} r={r} fill={COLORS.secondary} />
      ))}
    </g>
  );
};

/** A small oscillator sub-panel (RSI / MACD / Stochastic) below the chart. */
export const SubPanel = ({
  seed,
  rect,
  color,
  opacity = 1,
  progress = 1,
  bars = false,
  pad = 10,
}: {
  seed: number;
  rect: Rect;
  color: string;
  opacity?: number;
  progress?: number;
  bars?: boolean;
  pad?: number;
}) => {
  const series = genSeries(46, seed, { drift: 0, vol: 0.16 });
  const midY = rect.h / 2;
  return (
    <g transform={`translate(${rect.x} ${rect.y})`} opacity={opacity}>
      <rect
        x={0}
        y={0}
        width={rect.w}
        height={rect.h}
        rx={10}
        fill="none"
        stroke={COLORS.hairline}
        strokeWidth={1}
      />
      <line
        x1={pad}
        y1={midY}
        x2={rect.w - pad}
        y2={midY}
        stroke={COLORS.hairline}
        strokeWidth={1}
        strokeDasharray="6 6"
      />
      {bars ? (
        series
          .filter((_, i) => i % 2 === 0)
          .map((v, k, arr) => {
            const x = pad + (k / (arr.length - 1)) * (rect.w - pad * 2);
            const top = pad + (1 - v) * (rect.h - pad * 2);
            const barH = Math.abs(midY - top) * Math.max(0, Math.min(1, progress));
            const y = v >= 0.5 ? midY - barH : midY;
            return <rect key={k} x={x - 3} y={y} width={6} height={barH} fill={color} rx={2} />;
          })
      ) : (
        <polyline
          points={polyPoints(series, rect.w, rect.h, pad)}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
        />
      )}
    </g>
  );
};
