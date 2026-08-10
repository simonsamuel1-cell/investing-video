/**
 * CandleChart.tsx — OHLC plotting with a frame-driven progressive reveal.
 *
 * candleGreen and candleRed appear HERE and nowhere else in the episode, on
 * bodies and wicks only. Axes, gridlines and tick labels stay neutral.
 *
 * The price scale is computed from the FULL window, never from the revealed
 * part, so a chart that is still plotting does not rescale under the viewer.
 * That also lets a scene pin a marker before the candles reach it — which is
 * how SC18 can extend its 7.300 reference before the failed push arrives.
 *
 * Freezing is just holding `reveal` still. There is no separate freeze mode,
 * because a freeze should be the absence of change, not a different animation.
 */
import { theme } from "../theme";
import { price as fmt, type Rect } from "../helpers";
import type { Bar } from "../data/shape";

/**
 * Where each bar lands. Exported so a scene can place a marker on bar N
 * without knowing how the chart is drawn.
 */
export const barGrid = (bars: Bar[], box: Rect, pad = 0.08) => {
  const lows = bars.map((b) => b.l);
  const highs = bars.map((b) => b.h);
  const lo = Math.min(...lows);
  const hi = Math.max(...highs);
  const span = Math.max(1, hi - lo);
  const scale = (p: number) => box.y + box.h * (1 - pad) - ((p - lo) / span) * box.h * (1 - pad * 2);
  const slot = box.w / bars.length;
  return {
    lo,
    hi,
    slot,
    scale,
    x: (i: number) => box.x + slot * (i + 0.5),
    body: Math.max(1.2, Math.min(28, slot * 0.62)),
  };
};

export const CandleChart = ({
  bars,
  box,
  reveal = 1,
  axis = true,
  axisOpacity = 1,
  opacity = 1,
  ticks,
  tickLabels = true,
  pad = 0.08,
}: {
  bars: Bar[];
  box: Rect;
  /** 0→1 left-to-right plot. Hold it still to freeze the series. */
  reveal?: number;
  axis?: boolean;
  axisOpacity?: number;
  opacity?: number;
  /** Explicit gridline prices — an axis should read in round numbers. */
  ticks?: number[];
  /** Draw the gridlines without their prices. */
  tickLabels?: boolean;
  pad?: number;
}) => {
  const g = barGrid(bars, box, pad);
  const shown = Math.ceil(bars.length * Math.max(0, Math.min(1, reveal)));
  const lines = ticks ?? [];

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }} width={theme.canvas.width} height={theme.canvas.height}>
      {axis && axisOpacity > 0.001 && (
        <g opacity={axisOpacity}>
          {lines.map((p) => (
            <g key={p}>
              <line x1={box.x} y1={g.scale(p)} x2={box.x + box.w} y2={g.scale(p)} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
              {tickLabels && (
                <text
                  x={box.x + box.w + 16}
                  y={g.scale(p) + 8}
                  fontFamily={theme.text.family}
                  fontSize={theme.text.axis.size}
                  fontWeight={theme.text.axis.weight}
                  fill={theme.color.slate}
                >
                  {fmt(p)}
                </text>
              )}
            </g>
          ))}
          <line x1={box.x} y1={box.y + box.h} x2={box.x + box.w} y2={box.y + box.h} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
        </g>
      )}
      {bars.slice(0, shown).map((b, i) => {
        const x = g.x(i);
        const color = b.c >= b.o ? theme.color.candleGreen : theme.color.candleRed;
        const top = Math.min(g.scale(b.o), g.scale(b.c));
        const h = Math.max(1.5, Math.abs(g.scale(b.c) - g.scale(b.o)));
        return (
          <g key={i}>
            <line x1={x} y1={g.scale(b.h)} x2={x} y2={g.scale(b.l)} stroke={color} strokeWidth={Math.max(1, g.body * 0.14)} />
            <rect x={x - g.body / 2} y={top} width={g.body} height={h} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};
