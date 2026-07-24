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
  dockInline = false,
  dockLabel,
  chips = [],
  revealFrame,
  lineFrame,
  x = 96,
  y = 690,
  width = 1536,
  height = 190,
  opacity = 1,
  candleGap,
}: {
  data: OHLC[];
  refLine?: { price: number; label: string; position: "below" | "above" };
  dockCandles?: OHLC[];
  dockProgress?: number;
  dockInline?: boolean; // dock right after the last data candle (context width) instead of the far slot
  dockLabel?: { lines: string[]; startFrame: number; below?: boolean }; // multi-line indigo label (above the dock candle, or below when the dock sits high)
  chips?: { label: string; variant: ChipVariant; startFrame: number }[];
  revealFrame: number; // strip fade + candle wipe start
  lineFrame?: number; // reference line draw start
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  candleGap?: number; // when set → crowded: fixed gap between candles (packed from the left)
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
  // Crowded (candleGap set): fixed body width + fixed gap, packed from the left.
  // Otherwise: spread evenly across the candle area.
  const bw = candleGap !== undefined ? 26 : Math.min(26, (areaW / data.length) * 0.5);
  const slot = candleGap !== undefined ? bw + candleGap : areaW / data.length;
  const dockX = x + width - slotW - 24;
  // Dock candle horizontal position: inline (right after the last data candle) or centered in the far slot.
  const dockCandleX = (i: number) =>
    dockInline ? areaX + slot * (data.length + i + 0.5) : dockX + (slotW / (dockCandles.length + 1)) * (i + 1);
  const dockCandleW = dockInline ? bw : 30;

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
      {/* docking slot outline — only when docking into the far slot (not inline) */}
      {!dockInline && (
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
      )}
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
        {/* finished pattern candle(s) slide into place */}
        {dockProgress > 0.001 &&
          dockCandles.map((d, i) => {
            const cxI = dockCandleX(i);
            const dy = (1 - dockProgress) * -90;
            return (
              <g key={i} opacity={dockProgress} transform={`translate(0 ${dy})`}>
                <Candle x={cxI} width={dockCandleW} open={d.open} high={d.high} low={d.low} close={d.close} scale={scale} />
              </g>
            );
          })}
      </svg>

      {/* multi-line indigo label above the dock candle */}
      {dockLabel && dockCandles.length > 0 && f >= dockLabel.startFrame && (() => {
        const pop = interpolate(f, [dockLabel.startFrame, dockLabel.startFrame + 9], [0.82, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.motion.ease,
        });
        const op = interpolate(f, [dockLabel.startFrame, dockLabel.startFrame + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            style={{
              position: "absolute",
              left: (dockCandleX(0) + dockCandleX(dockCandles.length - 1)) / 2,
              top: dockLabel.below
                ? scale(Math.min(...dockCandles.map((d) => d.low))) + 24
                : scale(Math.max(...dockCandles.map((d) => d.high))) - 24,
              transform: `translate(-50%, ${dockLabel.below ? "0" : "-100%"}) scale(${pop})`,
              padding: "10px 22px",
              borderRadius: theme.radius.chip,
              background: theme.colors.neutralFill,
              border: `${theme.stroke.hairline}px solid ${theme.colors.indigo}`,
              boxShadow: `inset 0 0 0 1px ${theme.colors.indigo}`,
              fontSize: theme.type.label.size,
              fontWeight: theme.type.label.weight,
              lineHeight: 1.15,
              color: theme.colors.indigo,
              textAlign: "center",
              whiteSpace: "nowrap",
              opacity: op,
            }}
          >
            {dockLabel.lines.map((ln) => (
              <div key={ln}>{ln}</div>
            ))}
          </div>
        );
      })()}
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
