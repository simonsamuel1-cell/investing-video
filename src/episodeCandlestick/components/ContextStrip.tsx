/**
 * ContextStrip — mini context chart (SC09–SC12): a supplied candle series, an
 * optional dashed reference line, a docking slot at the end where the finished
 * pattern candle(s) slide in, and up to two chips beneath.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import type { OHLC } from "../helpers";
import { priceScale, progress as easedProgress } from "../helpers";
import { Candle } from "./Candle";
import type { ChipVariant } from "./Chip";

const CHIP_STYLE: Record<ChipVariant, { border: string; text: string }> = {
  indigo: { border: theme.colors.indigo, text: theme.colors.indigo },
  cyan: { border: theme.colors.cyan, text: theme.colors.slate },
  neutral: { border: theme.colors.neutralLine, text: theme.colors.ink },
  muted: { border: theme.colors.neutralLine, text: theme.colors.neutralMuted },
};

export const ContextStrip = ({
  data,
  refLine,
  dockCandles = [],
  dockProgress = 0,
  chips = [],
  revealFrame,
  lineFrame,
  x = 96,
  y = 690,
  width = 1536,
  height = 190,
  opacity = 1,
}: {
  data: OHLC[];
  refLine?: { price: number; label: string; position: "below" | "above" };
  dockCandles?: OHLC[];
  dockProgress?: number;
  chips?: { label: string; variant: ChipVariant; startFrame: number }[];
  revealFrame: number; // strip fade + candle wipe start
  lineFrame?: number; // reference line draw start
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  if (f < revealFrame) return null;
  const stripIn = interpolate(f, [revealFrame, revealFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const prices = [
    ...data.flatMap((d) => [d.high, d.low]),
    ...dockCandles.flatMap((d) => [d.high, d.low]),
    ...(refLine ? [refLine.price] : []),
  ];
  const scale = priceScale(Math.min(...prices), Math.max(...prices), y + 20, y + height - 24, 0.06);

  const slotW = 150; // docking slot at the end
  const areaX = x + 34;
  const areaW = width - 34 - slotW - 60;
  const slot = areaW / data.length;
  const bw = Math.min(26, slot * 0.5);
  const dockX = x + width - slotW - 24;

  const lineDraw = lineFrame !== undefined && f >= lineFrame ? easedProgress(f, lineFrame, 16) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: opacity * stripIn }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          background: theme.colors.neutralFill,
          border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
          borderRadius: theme.radius.panel,
        }}
      />
      {/* docking slot outline */}
      <div
        style={{
          position: "absolute",
          left: dockX,
          top: y + 16,
          width: slotW,
          height: height - 32,
          border: `${theme.stroke.hairline}px dashed ${theme.colors.neutralLine}`,
          borderRadius: theme.radius.chip,
        }}
      />
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {/* context candles wipe in with stagger */}
        {data.map((d, i) => {
          const start = revealFrame + i * 4;
          if (f < start) return null;
          const q = interpolate(f, [start, start + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: theme.motion.ease,
          });
          const cxI = areaX + slot * (i + 0.5);
          const yLo = scale(d.low);
          return (
            <g key={i} opacity={q} transform={`translate(${cxI} ${yLo}) scale(1 ${q}) translate(${-cxI} ${-yLo})`}>
              <Candle x={cxI} width={bw} open={d.open} high={d.high} low={d.low} close={d.close} scale={scale} />
            </g>
          );
        })}
        {/* dashed reference line */}
        {refLine && lineDraw > 0 && (
          <>
            <line
              x1={areaX}
              y1={scale(refLine.price)}
              x2={areaX + (width - 68) * lineDraw}
              y2={scale(refLine.price)}
              stroke={theme.colors.indigo}
              strokeWidth={theme.stroke.standard}
              strokeDasharray="12 10"
            />
            <text
              x={areaX + 4}
              y={scale(refLine.price) + (refLine.position === "below" ? 40 : -16)}
              fontFamily={theme.type.family}
              fontSize={theme.type.label.size}
              fontWeight={theme.type.label.weight}
              fill={theme.colors.indigo}
              opacity={Math.min(1, lineDraw * 1.4)}
            >
              {refLine.label}
            </text>
          </>
        )}
        {/* finished pattern candle(s) slide into the docking slot */}
        {dockProgress > 0.001 &&
          dockCandles.map((d, i) => {
            const cxI = dockX + (slotW / (dockCandles.length + 1)) * (i + 1);
            const dy = (1 - dockProgress) * -90;
            return (
              <g key={i} opacity={dockProgress} transform={`translate(0 ${dy})`}>
                <Candle x={cxI} width={30} open={d.open} high={d.high} low={d.low} close={d.close} scale={scale} />
              </g>
            );
          })}
      </svg>
      {/* chips beneath the strip (still above the subtitle zone) */}
      <div style={{ position: "absolute", left: x + 20, top: y + height + 12, display: "flex", gap: 20 }}>
        {chips.map((c) => {
          if (f < c.startFrame) return null;
          const pop = interpolate(f, [c.startFrame, c.startFrame + 9], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: theme.motion.ease,
          });
          const op = interpolate(f, [c.startFrame, c.startFrame + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cs = CHIP_STYLE[c.variant];
          return (
            <div
              key={c.label}
              style={{
                padding: "8px 20px",
                borderRadius: theme.radius.chip,
                background: theme.colors.neutralFill,
                border: `${theme.stroke.hairline}px solid ${cs.border}`,
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: cs.text,
                opacity: op,
                transform: `scale(${pop})`,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
