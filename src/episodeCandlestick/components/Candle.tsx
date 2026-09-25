/**
 * Candle — SVG candle primitives; render INSIDE a parent <svg> element.
 * Body candleGreen when close >= open, else candleRed; wick defaults to body
 * color. Flat fill, no gradients. buildProgress grows the body open→close;
 * wickProgress extends the wicks from the body toward high/low.
 */
import { useContext } from "react";
import { theme } from "../theme";
import { Cut } from "../cut";

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
  const yHi = scale(
    hiPrice + (Math.max(high, hiPrice) - hiPrice) * wickProgress,
  );
  const yLo = scale(
    loPrice - (loPrice - Math.min(low, loPrice)) * wickProgress,
  );

  const wickW = Math.max(2, width * 0.12);
  /**
   * ⚠ ROUNDED IN THE INDONESIAN CUT — Simon: "style candlestick ubah semua
   * jadi rounded corner". TA01's rule, scaled for this film's wider range of
   * candle sizes: about a fifth of the body's width, capped at 8px so a big
   * candle keeps its corners crisp, and never more than half the body's height
   * so a doji stays a bar rather than a pill. The English cut keeps rx 2.
   */
  const rounded = useContext(Cut) === "indo";
  const r = rounded
    ? Math.min(width * theme.candle.round, bodyH / 2, theme.candle.roundMax)
    : 2;
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
      <rect
        x={x - width / 2}
        y={bodyTop}
        width={width}
        height={bodyH}
        rx={r}
        ry={r}
        fill={color}
      />
    </g>
  );
};
