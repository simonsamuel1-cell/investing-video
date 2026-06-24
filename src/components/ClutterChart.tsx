/**
 * ClutterChart — the composite "everything at once" chart: schematic price line
 * + MA5/MA20/MA200 overlays + Parabolic-SAR dots + RSI & MACD sub-panels.
 * `reveal` opacities let indicators ACCRETE (S1) or strip away (S2); used full
 * size for the hero and tiled small in the 3×3 grid (the workload). Pure shapes.
 */
import { useMemo } from "react";
import { COLORS, RADII, BORDER } from "../theme";
import { genSeries, polyPoints } from "../helpers";
import { MAOverlay, SARDots, SubPanel, type Rect } from "./IndicatorOverlays";

export interface Reveal {
  ma5?: number;
  ma20?: number;
  ma200?: number;
  sar?: number;
  rsi?: number;
  macd?: number;
}

export const ClutterChart = ({
  seed,
  w,
  h,
  priceProgress = 1,
  reveal = {},
  compact = false,
  panel = true,
}: {
  seed: number;
  w: number;
  h: number;
  priceProgress?: number;
  reveal?: Reveal;
  compact?: boolean;
  panel?: boolean;
}) => {
  const series = useMemo(() => genSeries(46, seed, { drift: -0.4, vol: 0.09 }), [seed]);
  const pad = compact ? 8 : 16;
  const sw = compact ? 2.5 : 4;

  const mainRect: Rect = { x: 0, y: 0, w, h: h * 0.5 };
  const rsiRect: Rect = { x: 0, y: h * 0.55, w, h: h * 0.19 };
  const macdRect: Rect = { x: 0, y: h * 0.78, w, h: h * 0.19 };

  const r = reveal;
  const pricePts = polyPoints(series, mainRect.w, mainRect.h, pad);

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: compact ? RADII.md : RADII.card,
        background: panel ? COLORS.surface : "transparent",
        border: panel ? `${BORDER.thin}px solid ${COLORS.hairline}` : "none",
        boxShadow: panel ? "0 12px 30px rgba(27,29,34,0.06)" : "none",
        overflow: "hidden",
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {/* main price line */}
        <g transform={`translate(${mainRect.x} ${mainRect.y})`}>
          <polyline
            points={pricePts}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={sw}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - Math.max(0, Math.min(1, priceProgress))}
          />
        </g>

        {r.ma5 ? (
          <MAOverlay series={series} window={5} rect={mainRect} color={COLORS.secondary} opacity={r.ma5} strokeWidth={compact ? 1.8 : 3} pad={pad} />
        ) : null}
        {r.ma20 ? (
          <MAOverlay series={series} window={20} rect={mainRect} color={COLORS.primaryLight} opacity={r.ma20} strokeWidth={compact ? 1.8 : 3} pad={pad} />
        ) : null}
        {r.ma200 ? (
          <MAOverlay series={series} window={34} rect={mainRect} color={COLORS.primaryDark} opacity={r.ma200} strokeWidth={compact ? 1.6 : 2.6} pad={pad} />
        ) : null}
        {r.sar ? (
          <SARDots series={series} rect={mainRect} opacity={r.sar} step={compact ? 4 : 3} pad={pad} r={compact ? 2 : 3} />
        ) : null}

        {r.rsi ? (
          <SubPanel seed={seed + 11} rect={rsiRect} color={COLORS.secondary} opacity={r.rsi} pad={compact ? 6 : 10} />
        ) : null}
        {r.macd ? (
          <SubPanel seed={seed + 23} rect={macdRect} color={COLORS.primary} opacity={r.macd} bars pad={compact ? 6 : 10} />
        ) : null}
      </svg>
    </div>
  );
};
