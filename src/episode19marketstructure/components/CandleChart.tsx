/**
 * CandleChart — OHLC plotting with a progressive, frame-driven reveal.
 *
 * candleGreen / candleRed appear HERE and nowhere else in the episode: bodies
 * and wicks only. Axes, gridlines and tick labels are neutral.
 *
 * The price scale is computed from the FULL window, not from the revealed part,
 * so a chart that is still plotting never rescales under the viewer. That also
 * lets a scene pin markers with `candleGeom` before the candles reach them —
 * which is how SC18 can place its 7.300 reference before the push arrives.
 *
 * `tickValues` exists because evenly-spaced ticks inside a data range land on
 * numbers like 5.175. A price axis should read in steps a viewer recognises.
 */
import { theme } from "../theme";
import { priceScale, fmtPrice, type Box } from "../helpers";
import type { OHLC } from "../data/series";

export const candleGeom = (data: OHLC[], win: [number, number], box: Box, pad = 0.08) => {
  const aF = Math.max(0, win[0]);
  const bF = Math.min(data.length - 1, win[1]);
  const a = Math.max(0, Math.ceil(aF));
  const b = Math.min(data.length - 1, Math.floor(bF));
  const slice = data.slice(a, b + 1);
  const min = Math.min(...slice.map((d) => d.l));
  const max = Math.max(...slice.map((d) => d.h));
  const scale = priceScale(min, max, box.y, box.y + box.h, pad);
  const n = Math.max(1, bF - aF + 1);
  const slot = box.w / n;
  const cx = (globalIdx: number) => box.x + slot * (globalIdx - aF + 0.5);
  const bodyW = Math.max(1.2, Math.min(28, slot * 0.62));
  return { a, b, slice, scale, slot, cx, bodyW, min, max };
};

export const CandleChart = ({
  data,
  window: win,
  box,
  showAxes = true,
  axesOpacity = 1,
  opacity = 1,
  reveal = 1,
  pad = 0.08,
  ticks = 4,
  tickValues,
}: {
  data: OHLC[];
  window: [number, number];
  box: Box;
  showAxes?: boolean;
  /** Fades gridlines and price labels WITHOUT touching the candles. */
  axesOpacity?: number;
  opacity?: number;
  /** 0→1 left→right plot. Hold it constant to freeze the series (SC18). */
  reveal?: number;
  pad?: number;
  ticks?: number;
  tickValues?: number[];
}) => {
  const g = candleGeom(data, win, box, pad);
  const shown = Math.ceil(g.slice.length * Math.max(0, Math.min(1, reveal)));
  if (shown < 1 && axesOpacity <= 0.001) return null;
  const tickPrices = tickValues ?? Array.from({ length: ticks }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / ticks);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      {showAxes && axesOpacity > 0.001 && (
        <g opacity={axesOpacity}>
          {tickPrices.map((p) => (
            <g key={p}>
              <line x1={box.x} y1={g.scale(p)} x2={box.x + box.w} y2={g.scale(p)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
              <text
                x={box.x + box.w + 14}
                y={g.scale(p) + 8}
                fontFamily={theme.type.family}
                fontSize={theme.type.axis.size}
                fontWeight={theme.type.axis.weight}
                fill={theme.colors.slate}
              >
                {fmtPrice(p)}
              </text>
            </g>
          ))}
          <line x1={box.x} y1={box.y + box.h} x2={box.x + box.w} y2={box.y + box.h} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
        </g>
      )}
      {g.slice.slice(0, shown).map((d, i) => {
        const gi = g.a + i;
        const x = g.cx(gi);
        const up = d.c >= d.o;
        const color = up ? theme.colors.candleGreen : theme.colors.candleRed;
        const top = Math.min(g.scale(d.o), g.scale(d.c));
        const h = Math.max(1.5, Math.abs(g.scale(d.c) - g.scale(d.o)));
        return (
          <g key={gi}>
            <line x1={x} y1={g.scale(d.h)} x2={x} y2={g.scale(d.l)} stroke={color} strokeWidth={Math.max(1, g.bodyW * 0.14)} />
            <rect x={x - g.bodyW / 2} y={top} width={g.bodyW} height={h} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};
