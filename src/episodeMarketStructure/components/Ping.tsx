/**
 * Ping — expanding ring marker used to tick a moment on the chart.
 * UI element, so the expand/fade pop is allowed. Never red/green.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

export const Ping = ({
  x,
  y,
  startFrame,
  variant = "indigo",
  r0 = 8,
  r1 = 34,
  dur = 26,
  holdDot = true,
}: {
  x: number;
  y: number;
  startFrame: number;
  variant?: "indigo" | "slate" | "cyan";
  r0?: number;
  r1?: number;
  dur?: number;
  holdDot?: boolean;
}) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  const color = variant === "indigo" ? pal.indigo : variant === "cyan" ? pal.cyan : pal.slate;
  const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const r = interpolate(f, [startFrame, startFrame + dur], [r0, r1], { ...CL, easing: theme.motion.ease });
  const ringOp = interpolate(f, [startFrame, startFrame + dur], [0.85, 0], CL);
  const dotOp = interpolate(f, [startFrame, startFrame + 8], [0, 1], { ...CL, easing: theme.motion.ease });

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={theme.stroke.rule} opacity={ringOp} />
      {holdDot && <circle cx={x} cy={y} r={7} fill={color} opacity={dotOp} />}
    </svg>
  );
};
