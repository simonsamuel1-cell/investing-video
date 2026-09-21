/**
 * Candle — SVG candle primitives; render INSIDE a parent <svg> element.
 * Body candleGreen when close >= open, else candleRed; wick defaults to body
 * color. Flat fill, no gradients. buildProgress grows the body open→close;
 * wickProgress extends the wicks from the body toward high/low.
 */
import { theme } from "../theme";

export type CandleProps = {
  x: number; // center x
  width: number;
  open: number;
  high: number;
  low: number;
  close: number;
  scale: (price: number) => number;
  buildProgress?: number; // 0–1 body growth open→close
  wickProgress?: number; // 0–1 wick extension
  dim?: boolean; // reduced opacity
  wickStroke?: string; // cyan highlight override (theme color only)
  opacity?: number;
};

export const Candle = ({
  x,
  width,
  open,
  high,
  low,
  close,
  scale,
  buildProgress = 1,
  wickProgress = 1,
  dim = false,
  wickStroke,
  opacity = 1,
}: CandleProps) => {
  const liveClose = open + (close - open) * buildProgress;
  const up = liveClose >= open;
  const color = up ? theme.colors.candleGreen : theme.colors.candleRed;

  const yOpen = scale(open);
  const yClose = scale(liveClose);
  const bodyTop = Math.min(yOpen, yClose);
  const bodyH = Math.max(2, Math.abs(yClose - yOpen));

  // wicks extend from body extremes toward high / low
  const hiPrice = Math.max(open, liveClose);
  const loPrice = Math.min(open, liveClose);
  const yHi = scale(hiPrice + (Math.max(high, hiPrice) - hiPrice) * wickProgress);
  const yLo = scale(loPrice - (loPrice - Math.min(low, loPrice)) * wickProgress);

  const wickW = Math.max(2, width * 0.12);
  return (
    <g opacity={opacity * (dim ? 0.25 : 1)}>
      <line
        x1={x}
        y1={yHi}
        x2={x}
        y2={yLo}
        stroke={wickStroke ?? color}
        strokeWidth={wickStroke ? 4 : wickW}
        strokeLinecap="round"
      />
      <rect x={x - width / 2} y={bodyTop} width={width} height={bodyH} rx={2} fill={color} />
    </g>
  );
};
