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
 *
 * `range` overrides the price scale. Two charts shown side by side must be
 * measured against the SAME axis, or the comparison the viewer is asked to make
 * is one the picture has already rigged.
 */
export const barGrid = (bars: Bar[], box: Rect, pad = 0.08, range?: [number, number]) => {
  const lows = bars.map((b) => b.l);
  const highs = bars.map((b) => b.h);
  const [lo, hi] = range ?? [Math.min(...lows), Math.max(...highs)];
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
  range,
  hollowFrom,
  hollow = 0,
  view,
  focus,
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
  /** Force the price scale, so two panels can be read against one axis. */
  range?: [number, number];
  /**
   * HOLLOW BARS — bars from this index on may be drawn outlined instead of
   * filled. A hollow candle still has an open, a close and a direction, but it
   * has no candle colour, so it reads as price that has not been confirmed
   * rather than as price that happened. This is the ONE place the episode draws
   * a candle without its colour, and the outline is ink, never red or green.
   */
  hollowFrom?: number;
  /** 0→1 for those bars: 1 = white body, ink outline; 0 = candle colour. */
  hollow?: number;
  /**
   * A CAMERA on the chart: canvas point p is drawn at p·k + (dx, dy). The
   * grid is moved, never the picture — candle widths and wicks follow k, but
   * a gridline stays a hairline at any zoom. Absent, nothing moves.
   */
  view?: { k: number; dx: number; dy: number };
  /** Bars outside [from, to) drawn at `others` opacity — the rest of the chart arriving around a few. */
  focus?: { from: number; to: number; others: number };
}) => {
  const g = barGrid(bars, box, pad, range);
  const v = view ?? { k: 1, dx: 0, dy: 0 };
  const vx = (x: number) => x * v.k + v.dx;
  const vy = (y: number) => y * v.k + v.dy;
  const body = g.body * v.k;
  const shown = Math.ceil(bars.length * Math.max(0, Math.min(1, reveal)));
  const lines = ticks ?? [];

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }} width={theme.canvas.width} height={theme.canvas.height}>
      {axis && axisOpacity > 0.001 && (
        <g opacity={axisOpacity}>
          {lines.map((p) => (
            <g key={p}>
              <line x1={vx(box.x)} y1={vy(g.scale(p))} x2={vx(box.x + box.w)} y2={vy(g.scale(p))} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
              {tickLabels && (
                <text
                  x={vx(box.x + box.w) + 16}
                  y={vy(g.scale(p)) + 8}
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
          <line x1={vx(box.x)} y1={vy(box.y + box.h)} x2={vx(box.x + box.w)} y2={vy(box.y + box.h)} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
        </g>
      )}
      {bars.slice(0, shown).map((b, i) => {
        const x = vx(g.x(i));
        const color = b.c >= b.o ? theme.color.candleGreen : theme.color.candleRed;
        const top = vy(Math.min(g.scale(b.o), g.scale(b.c)));
        const h = Math.max(1.5, Math.abs(g.scale(b.c) - g.scale(b.o)) * v.k);
        const wick = Math.max(1, body * 0.14);
        const y = (p: number) => vy(g.scale(p));
        const seen = focus && (i < focus.from || i >= focus.to) ? focus.others : 1;
        if (seen <= 0.001) return null;
        /* The two versions are crossfaded rather than switched, so a bar can
           fill in over time without the body jumping. */
        const out = hollowFrom !== undefined && i >= hollowFrom ? hollow : 0;
        return (
          <g key={i} opacity={seen < 1 ? seen : undefined}>
            {out < 0.999 && (
              <g opacity={1 - out}>
                <line x1={x} y1={y(b.h)} x2={x} y2={y(b.l)} stroke={color} strokeWidth={wick} />
                <rect x={x - body / 2} y={top} width={body} height={h} fill={color} />
              </g>
            )}
            {out > 0.001 && (
              <g opacity={out}>
                <line x1={x} y1={y(b.h)} x2={x} y2={y(b.l)} stroke={theme.color.ink} strokeWidth={wick} />
                <rect
                  x={x - body / 2}
                  y={top}
                  width={body}
                  height={h}
                  fill={theme.color.surface}
                  stroke={theme.color.ink}
                  strokeWidth={theme.shape.rule}
                />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
