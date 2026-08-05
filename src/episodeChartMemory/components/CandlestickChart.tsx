/**
 * CandlestickChart — SVG candlestick renderer over a [startIdx, endIdx] window
 * of an OHLC series. Candle bodies + wicks are the ONLY green/red on screen;
 * axes, gridlines and tick labels stay neutral/slate.
 *
 * `chartGeom` is exported so scenes can pin pings, chips and zone bands to real
 * candles instead of hand-guessed coordinates.
 */
import { theme } from "../theme";
import { priceScale, fmtPrice, type Box } from "../helpers";
import type { OHLC } from "../data/bmri";

/**
 * chartGeom — window bounds may be FRACTIONAL so a zoom-out (SC10) can move
 * continuously instead of snapping candle-by-candle. `a`/`b` are the integer
 * slice bounds actually drawn; `aF` is the fractional origin the x-mapping uses.
 */
export const chartGeom = (data: OHLC[], win: [number, number], box: Box, pad = 0.08) => {
  const aF = Math.max(0, win[0]);
  const bF = Math.min(data.length - 1, win[1]);
  const a = Math.max(0, Math.ceil(aF));
  const b = Math.min(data.length - 1, Math.floor(bF));
  const slice = data.slice(a, b + 1);
  const min = Math.min(...slice.map((d) => d.l));
  const max = Math.max(...slice.map((d) => d.h));
  const scale = priceScale(min, max, box.y, box.y + box.h, pad);
  const n = Math.max(1, bF - aF + 1); // fractional count → smooth slot width
  const slot = box.w / n;
  const cx = (globalIdx: number) => box.x + slot * (globalIdx - aF + 0.5);
  const bodyW = Math.max(1.2, Math.min(28, slot * 0.62));
  return { a, b, aF, bF, slice, scale, slot, cx, bodyW, min, max };
};

export const CandlestickChart = ({
  data,
  window: win,
  box,
  showAxes = true,
  axesOpacity = 1,
  dimOpacity = 1,
  revealProgress = 1,
  pad = 0.08,
  scaleOverride,
  ticks = 4,
}: {
  data: OHLC[];
  window: [number, number];
  box: Box;
  showAxes?: boolean;
  /** Fades gridlines + price labels WITHOUT touching the candles. */
  axesOpacity?: number;
  dimOpacity?: number;
  revealProgress?: number; // 0–1 left→right reveal of the candle series
  pad?: number;
  scaleOverride?: (p: number) => number;
  ticks?: number;
}) => {
  const g = chartGeom(data, win, box, pad);
  const scale = scaleOverride ?? g.scale;
  const shown = Math.ceil(g.slice.length * Math.max(0, Math.min(1, revealProgress)));
  const tickPrices = Array.from({ length: ticks }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / ticks);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: dimOpacity }}
      width={theme.canvas.width}
      height={theme.canvas.height}
    >
      {showAxes && axesOpacity > 0.001 && (
        <g opacity={axesOpacity}>
          {tickPrices.map((p) => (
            <g key={p}>
              <line x1={box.x} y1={scale(p)} x2={box.x + box.w} y2={scale(p)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
              <text
                x={box.x + box.w + 14}
                y={scale(p) + 8}
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
        const yO = scale(d.o);
        const yC = scale(d.c);
        const top = Math.min(yO, yC);
        const h = Math.max(1.5, Math.abs(yC - yO));
        return (
          <g key={gi}>
            <line x1={x} y1={scale(d.h)} x2={x} y2={scale(d.l)} stroke={color} strokeWidth={Math.max(1, g.bodyW * 0.14)} />
            <rect x={x - g.bodyW / 2} y={top} width={g.bodyW} height={h} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};
