/**
 * CandleSeries — a daily chart: PricePanel chrome + candles that wipe in
 * bottom-up with a stagger. highlightIndices brighten, dimIndices fade.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import type { OHLC } from "../helpers";
import { priceScale } from "../helpers";
import { Candle } from "./Candle";
import { PricePanel } from "./PricePanel";

export const CandleSeries = ({
  data,
  x,
  y,
  width,
  height,
  revealFrom,
  revealStagger = 2,
  revealDur = 10,
  highlightIndices = [],
  dimIndices = [],
  showPanel = true,
  opacity = 1,
  bodyRatio = 0.56,
  scaleOverride,
}: {
  data: OHLC[];
  x: number;
  y: number;
  width: number;
  height: number;
  revealFrom?: number; // scene-local frame; omit = pre-formed
  revealStagger?: number; // frames between candles
  revealDur?: number;
  highlightIndices?: number[];
  dimIndices?: number[];
  showPanel?: boolean;
  opacity?: number;
  bodyRatio?: number;
  scaleOverride?: (price: number) => number;
}) => {
  const f = useCurrentFrame();
  const min = Math.min(...data.map((d) => d.low));
  const max = Math.max(...data.map((d) => d.high));
  const scale = scaleOverride ?? priceScale(min, max, y, y + height, 0.05);
  const slot = width / data.length;
  const bw = Math.min(34, slot * bodyRatio);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <PricePanel x={x} y={y} width={width} height={height} min={min} max={max} scale={scale} showPanel={showPanel} />
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {data.map((d, i) => {
          const start = revealFrom === undefined ? -1000 : revealFrom + i * revealStagger;
          if (f < start) return null;
          const q = interpolate(f, [start, start + revealDur], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: theme.motion.ease,
          });
          const cx = x + slot * (i + 0.5);
          const yLo = scale(d.low);
          const dim = dimIndices.includes(i) && !highlightIndices.includes(i);
          return (
            <g key={i} opacity={q} transform={`translate(${cx} ${yLo}) scale(1 ${q}) translate(${-cx} ${-yLo})`}>
              <Candle x={cx} width={bw} open={d.open} high={d.high} low={d.low} close={d.close} scale={scale} dim={dim} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
