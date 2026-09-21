/**
 * ReferenceLine — dashed indigo 2px line (dash 12 10).
 * Standard mode: draws x1→x2 with drawProgress.
 * Construct mode (SC07): with constructFrom {xa, xb}, the line first appears
 * only BETWEEN the two touch points (constructProgress), then extends right to
 * x2 (extendProgress).
 */
import { theme } from "../theme";

export const ReferenceLine = ({
  y,
  x1,
  x2,
  label,
  anchor = "left",
  labelPosition = "below",
  drawProgress = 1,
  constructFrom,
  constructProgress = 0,
  extendProgress = 0,
  labelOpacity = 1,
  opacity = 1,
}: {
  y: number; // already-scaled y
  x1: number;
  x2: number;
  label?: string;
  anchor?: "left" | "right";
  labelPosition?: "below" | "above"; // 20px below the line (default) or above it
  drawProgress?: number;
  constructFrom?: { xa: number; xb: number };
  constructProgress?: number;
  extendProgress?: number;
  labelOpacity?: number;
  opacity?: number;
}) => {
  let segX1 = x1;
  let segX2 = x1 + (x2 - x1) * drawProgress;
  if (constructFrom) {
    segX1 = constructFrom.xa;
    segX2 = constructFrom.xa + (constructFrom.xb - constructFrom.xa) * constructProgress;
    if (extendProgress > 0) {
      segX2 = constructFrom.xb + (x2 - constructFrom.xb) * extendProgress; // extend right to x2
      segX1 = constructFrom.xa + (x1 - constructFrom.xa) * extendProgress; // extend left to x1
    }
  }
  if (segX2 <= segX1) return null;
  const labelX = anchor === "left" ? x1 : x2;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      <line x1={segX1} y1={y} x2={segX2} y2={y} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeDasharray="12 10" />
      {label && (
        <text
          x={labelX}
          y={labelPosition === "above" ? y - 24 : y + 46}
          textAnchor={anchor === "left" ? "start" : "end"}
          fontFamily={theme.type.family}
          fontSize={theme.type.label.size}
          fontWeight={theme.type.label.weight}
          fill={theme.colors.indigo}
          opacity={labelOpacity}
        >
          {label}
        </text>
      )}
    </svg>
  );
};
