/**
 * CandlestickChart — SVG OHLC chart. Candle bodies + wicks carry candle
 * green/red (the ONE place red/green is allowed, §0.4); axes, gridlines,
 * reference lines, zone bands and the volume sub-panel stay brand/neutral.
 *
 * Coordinates are NORMALISED: o/h/l/c in [0,1] (price space, y up), x by index.
 * Candles draw in by `progress` (0..1); a candle only mounts once its index is
 * reached, so there is no ghost end-state flash on frame 0 (§2 conditional mount).
 */
import { theme } from "../theme";

const { colors, font, type } = theme;

export type Candle = { o: number; h: number; l: number; c: number };

export const CandlestickChart = ({
  width,
  height,
  left,
  top,
  candles,
  progress,
  refLines = [],
  bands = [],
  volume,
  volumeColors,
  grid = true,
}: {
  width: number;
  height: number;
  left?: number;
  top?: number;
  candles: Candle[];
  progress: number;
  refLines?: { y: number; label?: string; color?: string }[];
  bands?: { x0: number; x1: number; label?: string }[];
  volume?: number[];
  volumeColors?: ("green" | "red" | "slate")[];
  grid?: boolean;
}) => {
  const hasVol = volume && volume.length > 0;
  const priceH = hasVol ? height * 0.72 : height;
  const volTop = height * 0.78;
  const volH = height * 0.22;

  const N = candles.length;
  const step = width / N;
  const cw = step * 0.6;
  const py = (v: number) => (1 - v) * priceH;
  const shown = Math.ceil(progress * N);

  const volColor = (i: number) => {
    const m = volumeColors?.[i];
    if (m === "green") return colors.candleGreen;
    if (m === "red") return colors.candleRed;
    return colors.slateFaint;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: left !== undefined || top !== undefined ? "absolute" : undefined, left, top, overflow: "visible" }}
    >
      {/* zone bands */}
      {bands.map((b, i) => (
        <g key={`band-${i}`}>
          <rect x={b.x0 * width} y={0} width={(b.x1 - b.x0) * width} height={priceH} fill={colors.indigoTint} opacity={0.6} />
          <line x1={b.x0 * width} y1={0} x2={b.x0 * width} y2={priceH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="6 8" />
          <line x1={b.x1 * width} y1={0} x2={b.x1 * width} y2={priceH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="6 8" />
          {b.label && (
            <text x={(b.x0 + b.x1) / 2 * width} y={-12} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>
              {b.label}
            </text>
          )}
        </g>
      ))}

      {/* gridlines */}
      {grid &&
        [0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} y1={py(g)} x2={width} y2={py(g)} stroke={colors.divider} strokeWidth={1} />
        ))}
      <line x1={0} y1={priceH} x2={width} y2={priceH} stroke={colors.slateFaint} strokeWidth={2} />

      {/* reference / avg-cost lines */}
      {refLines.map((r, i) => (
        <g key={`ref-${i}`}>
          <line x1={0} y1={py(r.y)} x2={width} y2={py(r.y)} stroke={r.color ?? colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          {r.label && (
            <text x={8} y={py(r.y) - 10} fill={r.color ?? colors.indigoDeep} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>
              {r.label}
            </text>
          )}
        </g>
      ))}

      {/* candles (conditionally mounted up to `shown`) */}
      {candles.map((cd, i) => {
        if (i >= shown) return null;
        const cx = (i + 0.5) * step;
        const up = cd.c >= cd.o;
        const color = up ? colors.candleGreen : colors.candleRed;
        const bodyTop = py(Math.max(cd.o, cd.c));
        const bodyBot = py(Math.min(cd.o, cd.c));
        return (
          <g key={i}>
            <line x1={cx} y1={py(cd.h)} x2={cx} y2={py(cd.l)} stroke={color} strokeWidth={2} />
            <rect x={cx - cw / 2} y={bodyTop} width={cw} height={Math.max(2, bodyBot - bodyTop)} fill={color} rx={1} />
          </g>
        );
      })}

      {/* volume sub-panel */}
      {hasVol &&
        volume!.map((v, i) => {
          if (i >= shown) return null;
          const cx = (i + 0.5) * step;
          const bh = v * volH;
          return <rect key={`v-${i}`} x={cx - cw / 2} y={volTop + (volH - bh)} width={cw} height={bh} fill={volColor(i)} rx={1} />;
        })}
    </svg>
  );
};
