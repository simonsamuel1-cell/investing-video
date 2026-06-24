/**
 * SchematicChart — a single deterministic price line on an optional card panel.
 * Pure SHAPE (genSeries, min/max normalised): NO axes, numbers or prices, and
 * never fabricated data. The line "draws on" via a normalised pathLength.
 */
import { useMemo } from "react";
import type { ReactNode } from "react";
import { COLORS, RADII, BORDER } from "../theme";
import { genSeries, polyPoints } from "../helpers";

export const SchematicChart = ({
  seed,
  w,
  h,
  drift = -0.4,
  vol = 0.08,
  progress = 1,
  stroke = COLORS.primary,
  strokeWidth = 4,
  panel = true,
  pad = 16,
  children,
}: {
  seed: number;
  w: number;
  h: number;
  drift?: number;
  vol?: number;
  progress?: number;
  stroke?: string;
  strokeWidth?: number;
  panel?: boolean;
  pad?: number;
  children?: ReactNode;
}) => {
  const series = useMemo(
    () => genSeries(46, seed, { drift, vol }),
    [seed, drift, vol],
  );
  const pts = useMemo(() => polyPoints(series, w, h, pad), [series, w, h, pad]);

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: RADII.card,
        background: panel ? COLORS.surface : "transparent",
        border: panel ? `${BORDER.thin}px solid ${COLORS.hairline}` : "none",
        boxShadow: panel ? "0 12px 30px rgba(27,29,34,0.06)" : "none",
        overflow: "hidden",
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {/* baseline hairline */}
        <line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke={COLORS.hairline}
          strokeWidth={1}
        />
        <polyline
          points={pts}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
        />
      </svg>
      {children}
    </div>
  );
};
