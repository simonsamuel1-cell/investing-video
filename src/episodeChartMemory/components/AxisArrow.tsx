/**
 * AxisArrow — thickened axis rail with an arrowhead that sweeps along it, plus
 * a Title Case label. Used by SC05 for the two-axes beat (X = Waktu, Y = Harga).
 * Descriptive only — this is never an entry/exit or directional trade marker.
 */
import { theme } from "../theme";

export const AxisArrow = ({
  orientation,
  x1,
  y1,
  x2,
  y2,
  progress,
  color,
  label,
  labelOffset = 46,
  labelDx = 0,
  labelDy = 0,
  labelAtTip = false,
  labelSize = theme.type.header.size,
  labelOpacity = 1,
}: {
  orientation: "x" | "y";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number; // 0–1 sweep
  color: string;
  label: string;
  labelOffset?: number;
  /** Nudges the label only, leaving the rail and arrowhead untouched. */
  labelDx?: number;
  labelDy?: number;
  /** Set the label just past the arrowhead, centred on the rail — keeps it
   *  inside the chart's paper instead of hanging below or above it. */
  labelAtTip?: boolean;
  labelSize?: number;
  labelOpacity?: number;
}) => {
  const hx = x1 + (x2 - x1) * progress;
  const hy = y1 + (y2 - y1) * progress;
  const H = 16;
  const head =
    orientation === "x"
      ? `${hx + H},${hy} ${hx - 2},${hy - 9} ${hx - 2},${hy + 9}`
      : `${hx},${hy - H} ${hx - 9},${hy + 2} ${hx + 9},${hy + 2}`;

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={theme.stroke.rule} opacity={0.35} />
        <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={theme.stroke.rule} />
        <polygon points={head} fill={color} />
      </svg>
      {/* The Y label sits ABOVE the arrow tip, not left of the rail — placing it
          outside the rail pushes it past the safe-left margin. */}
      <div
        style={{
          position: "absolute",
          left: labelAtTip ? (orientation === "x" ? x2 + H + 14 : x1 + 22) + labelDx : (orientation === "x" ? x2 : x1 + 18) + labelDx,
          top: labelAtTip
            ? (orientation === "x" ? y1 : y2 - H / 2) + labelDy
            : (orientation === "x" ? y1 + labelOffset : y2 - labelOffset) + labelDy,
          transform: labelAtTip ? "translate(0, -50%)" : orientation === "x" ? "translate(-100%, 0)" : "translate(0, -100%)",
          fontFamily: theme.type.family,
          fontSize: labelSize,
          fontWeight: theme.type.header.weight,
          color,
          opacity: progress * labelOpacity,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </>
  );
};
