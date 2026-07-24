/**
 * SessionView — THE governing device of the episode.
 * Left panel replays an intraday price path on an IDX session clock; right
 * panel shows the daily candle forming LIVE from that same path. Both panels
 * share one vertical price scale, so any level lines up across the split.
 *
 * Extras beyond the base contract (all optional):
 *  - two-day mode (SC10/SC12): day2Path + day2Progress + resetFrame — the clock
 *    playhead wipes back to 09:00 and the right panel ACCUMULATES day 1's
 *    finished candle while day 2's live candle forms beside it (no remount).
 *  - wickStroke highlight of the finished candle from wickStrokeFrame.
 *  - exported IntradayPanel: the intraday half alone (SC05 composes it beside
 *    its own daily panel).
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import type { SessionPoint } from "../helpers";
import { fmtRp, pathPriceAt, priceScale, progress as easedProgress } from "../helpers";
import { SessionClockAxis } from "./SessionClockAxis";
import { LiveCandle } from "./LiveCandle";
import { Ping } from "./Ping";
import { Chip } from "./Chip";

export type SessionViewProps = {
  path: SessionPoint[];
  progress: number; // 0–1 session playback (day 1)
  x: number;
  y: number;
  width: number;
  height: number;
  splitRatio?: number; // default 0.62 — left intraday : right candle
  pingT?: number; // session-time of the cyan ping (fires on BOTH panels)
  pingStartFrame?: number; // scene-local frame the ping fires
  dimIntradayAfterClose?: boolean; // default true
  closeFrame?: number; // scene-local frame the (last) session closes
  markerPrice?: number; // dashed line across both panels
  markerChipLabel?: string;
  markerStartFrame?: number;
  candleWidth?: number;
  wickStroke?: string; // highlight the finished candle's wick (e.g. cyan)
  wickStrokeFrame?: number;
  // ── two-day mode ──
  day2Path?: SessionPoint[];
  day2Progress?: number; // 0–1 for day 2
  resetFrame?: number; // clock playhead wipe (0.4s) begins here
  day1DimStrength?: number; // 0–1 → day-1 candle fades toward 30% ("Erased")
  extraScalePrices?: number[]; // extend the shared scale domain
  opacity?: number;
  // ── benchmark layout (SC03 reference) ──
  centered?: boolean; // horizontally center the whole group (both panels + price labels) on the canvas
  centerNudge?: number; // extra px added to the centered offset (+ = right)
  panelGap?: number; // visible gap between the two panel rects (px); default keeps legacy spacing
  timeFontSize?: number; // clock-label size (09:00 / 12:00 / 15:50)
};

const RESET_FRAMES = 12; // 0.4s playhead wipe

/** Build the shared price scale for a session view box. */
export const sessionScale = (
  paths: SessionPoint[][],
  top: number,
  bottom: number,
  extras: number[] = [],
) => {
  const prices = [...paths.flat().map((p) => p.price), ...extras];
  return priceScale(Math.min(...prices), Math.max(...prices), top, bottom, 0.1);
};

/**
 * sessionGeom — the horizontal layout of a SessionView. Exported so scenes can
 * place overlays (candle chips, ghosts) that must track the panels exactly,
 * including the centered-group offset. Single source of truth for the geometry.
 *   panelGap = visible gap between the two panel rects (px); omit for legacy 28px gridline gap.
 *   centered = shift the whole group (panels + price labels) onto the canvas center.
 */
export const sessionGeom = ({
  x,
  width,
  splitRatio = 0.62,
  panelGap,
  centered = false,
  centerNudge = 0,
}: {
  x: number;
  width: number;
  splitRatio?: number;
  panelGap?: number;
  centered?: boolean;
  centerNudge?: number;
}) => {
  const axisW = 120; // right gutter reserved (within width) for the price labels
  const RECT_PAD = 20; // each panel rect extends this far past its gridlines
  const gap = panelGap !== undefined ? panelGap + 2 * RECT_PAD : 28;
  const innerW = width - axisW - gap;
  const leftW = innerW * splitRatio;
  const rightX = x + leftW + gap;
  const rightW = innerW - leftW;
  const LABEL_GUTTER = 116; // ≈ width of "Rp X,XXX" at the price-label size
  const groupLeft = x - RECT_PAD;
  const groupRight = rightX + rightW + RECT_PAD + 20 + LABEL_GUTTER;
  const centerOffset = centered ? theme.canvas.width / 2 - (groupLeft + groupRight) / 2 + centerNudge : 0;
  return { axisW, gap, innerW, leftW, rightX, rightW, centerOffset };
};

/**
 * IntradayPanel — the left half alone: white panel, grid, indigo trace drawn
 * up to `progress`, session clock beneath. Scale supplied by the caller so it
 * can be shared with an external daily panel (SC05).
 */
export const IntradayPanel = ({
  path,
  progress,
  x,
  y,
  width,
  height, // includes the 60px clock strip at the bottom
  scale,
  opacity = 1,
  traceOpacity = 1,
  showPanel = true,
  clockProgress,
  timeFontSize,
}: {
  path: SessionPoint[];
  progress: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: (price: number) => number;
  opacity?: number;
  traceOpacity?: number;
  showPanel?: boolean;
  clockProgress?: number; // override (two-day playhead choreography)
  timeFontSize?: number; // clock-label size
}) => {
  const clockY = y + height - 52;
  const pts: string[] = [];
  const n = 64;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.min(1, Math.max(0, progress));
    pts.push(`${x + width * t},${scale(pathPriceAt(path, t))}`);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      {showPanel && (
        <div
          style={{
            position: "absolute",
            left: x - 20,
            top: y - 20,
            width: width + 40,
            height: height + 40,
            background: theme.colors.neutralFill,
            border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
            borderRadius: theme.radius.panel,
          }}
        />
      )}
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {[0.25, 0.5, 0.75].map((q) => (
          <line
            key={q}
            x1={x}
            y1={y + (height - 72) * q}
            x2={x + width}
            y2={y + (height - 72) * q}
            stroke={theme.colors.neutralLine}
            strokeWidth={theme.stroke.hairline}
          />
        ))}
        {progress > 0.001 && (
          <polyline
            points={pts.join(" ")}
            fill="none"
            stroke={theme.colors.indigo}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={traceOpacity}
          />
        )}
      </svg>
      <SessionClockAxis x={x} y={clockY} width={width} progress={clockProgress ?? progress} fontSize={timeFontSize} />
    </div>
  );
};

export const SessionView = ({
  path,
  progress,
  x,
  y,
  width,
  height,
  splitRatio = 0.62,
  pingT,
  pingStartFrame,
  dimIntradayAfterClose = true,
  closeFrame,
  markerPrice,
  markerChipLabel,
  markerStartFrame,
  candleWidth = 64,
  wickStroke,
  wickStrokeFrame,
  day2Path,
  day2Progress = 0,
  resetFrame,
  day1DimStrength = 0,
  extraScalePrices = [],
  opacity = 1,
  centered = false,
  centerNudge = 0,
  panelGap,
  timeFontSize,
}: SessionViewProps) => {
  const f = useCurrentFrame();
  // Horizontal geometry (incl. the centered-group offset) from the shared helper.
  const { axisW, leftW, rightX, rightW, centerOffset } = sessionGeom({ x, width, splitRatio, panelGap, centered, centerNudge });

  const twoDay = !!day2Path;
  const inDay2 = twoDay && resetFrame !== undefined && f >= resetFrame;

  const scale = sessionScale(
    twoDay ? [path, day2Path] : [path],
    y,
    y + height - 72,
    markerPrice !== undefined ? [markerPrice, ...extraScalePrices] : extraScalePrices,
  );

  // intraday panel shows the ACTIVE day's trace; day-1 trace fades on reset
  const activePath = inDay2 ? day2Path : path;
  const activeProgress = inDay2 ? day2Progress : progress;

  // clock playhead: day-1 progress → quick wipe back to 09:00 → day-2 progress
  let clockProgress = progress;
  if (twoDay && resetFrame !== undefined && f >= resetFrame) {
    const wipe = interpolate(f, [resetFrame, resetFrame + RESET_FRAMES], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: theme.motion.ease,
    });
    clockProgress = f < resetFrame + RESET_FRAMES ? wipe : day2Progress;
  }
  const traceOpacity =
    inDay2 && resetFrame !== undefined
      ? interpolate(f, [resetFrame, resetFrame + RESET_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;

  // dim the intraday half after the final close
  const lastDone = twoDay ? day2Progress >= 1 : progress >= 1;
  const dimOp =
    dimIntradayAfterClose && lastDone && closeFrame !== undefined
      ? interpolate(f, [closeFrame, closeFrame + 14], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.motion.ease })
      : 1;

  // right-panel candle centers
  const c1x = twoDay ? rightX + rightW * 0.34 : rightX + rightW * 0.5;
  const c2x = rightX + rightW * 0.7;

  // ping fires at pingT's price on BOTH panels simultaneously
  const pingPrice = pingT !== undefined ? pathPriceAt(inDay2 ? day2Path : path, pingT) : 0;
  const pingLeftX = x + leftW * (pingT ?? 0);
  const pingCandleX = inDay2 ? c2x : c1x;

  // marker draw
  const markerDraw = markerStartFrame !== undefined ? easedProgress(f, markerStartFrame, 18) : 1;

  // axis tick labels from the scale domain
  const allPrices = [...path.map((p) => p.price), ...(day2Path ?? []).map((p) => p.price)];
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const tickPrices = [0.15, 0.5, 0.85].map((q) => Math.round(minP + (maxP - minP) * q));

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity, transform: `translateX(${centerOffset}px)` }}>
      <IntradayPanel
        path={activePath!}
        progress={activeProgress}
        x={x}
        y={y}
        width={leftW}
        height={height}
        scale={scale}
        opacity={dimOp}
        traceOpacity={traceOpacity}
        clockProgress={clockProgress}
        timeFontSize={timeFontSize}
      />

      {/* right panel — the live daily candle(s) */}
      <div
        style={{
          position: "absolute",
          left: rightX - 20,
          top: y - 20,
          width: rightW + 40,
          height: height + 40,
          background: theme.colors.neutralFill,
          border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
          borderRadius: theme.radius.panel,
        }}
      />
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {[0.25, 0.5, 0.75].map((q) => (
          <line
            key={q}
            x1={rightX}
            y1={y + (height - 72) * q}
            x2={rightX + rightW}
            y2={y + (height - 72) * q}
            stroke={theme.colors.neutralLine}
            strokeWidth={theme.stroke.hairline}
          />
        ))}
        {/* day 1 candle (live during day 1; persists — possibly dimmed — in day 2) */}
        {progress > 0.001 && (
          <LiveCandle
            path={path}
            progress={progress}
            x={c1x}
            width={candleWidth}
            scale={scale}
            opacity={1 - 0.7 * day1DimStrength}
            wickStroke={!twoDay && wickStroke && wickStrokeFrame !== undefined && f >= wickStrokeFrame ? wickStroke : undefined}
          />
        )}
        {/* day 2 candle forms beside it */}
        {twoDay && inDay2 && day2Progress > 0.001 && (
          <LiveCandle path={day2Path!} progress={day2Progress} x={c2x} width={candleWidth} scale={scale} />
        )}
        {/* shared Rp axis at the far right of the whole component */}
        {tickPrices.map((p) => (
          <text
            key={p}
            x={rightX + rightW + 40} // 20px past the right panel's edge (rightX+rightW+20)
            y={scale(p) + 8}
            fontFamily={theme.type.family}
            fontSize={24}
            fontWeight={500}
            fill={theme.colors.slate}
          >
            {fmtRp(p)}
          </text>
        ))}
        {/* dashed marker line across BOTH panels — lands at identical y (shared scale) */}
        {markerPrice !== undefined && markerStartFrame !== undefined && f >= markerStartFrame && (
          <line
            x1={x}
            y1={scale(markerPrice)}
            x2={x + (width - axisW) * markerDraw}
            y2={scale(markerPrice)}
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.standard}
            strokeDasharray="12 10"
          />
        )}
      </svg>

      {markerPrice !== undefined && markerChipLabel && markerStartFrame !== undefined && (
        <Chip label={markerChipLabel} x={x + 8} y={scale(markerPrice) - 74} variant="indigo" startFrame={markerStartFrame + 8} anchor="left" />
      )}

      {/* ping fires simultaneously at the same price on both panels */}
      {pingT !== undefined && pingStartFrame !== undefined && (
        <>
          <Ping cx={pingLeftX} cy={scale(pingPrice)} startFrame={pingStartFrame} />
          <Ping cx={pingCandleX} cy={scale(pingPrice)} startFrame={pingStartFrame} />
        </>
      )}
    </div>
  );
};
