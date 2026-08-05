/**
 * LineChart — closes-only polyline drawn with a trim-path (strokeDashoffset)
 * progress prop. Conditionally mounted by the caller so no ghost end-state
 * flashes on frame 0.
 */
import { theme } from "../theme";

export const LineChart = ({
  points,
  progress = 1,
  color = theme.colors.indigo,
  width = theme.stroke.rule,
  opacity = 1,
  showDots = false,
  dotRadius = 5,
}: {
  points: { x: number; y: number }[];
  progress?: number; // 0–1 trim path
  color?: string;
  width?: number;
  opacity?: number;
  showDots?: boolean;
  dotRadius?: number;
}) => {
  if (points.length < 2) return null;
  // Path length approximation drives the dash offset.
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const p = Math.max(0, Math.min(1, progress));
  const d = points.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const shownDots = Math.round(points.length * p);

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={opacity}
      />
      {showDots &&
        points.slice(0, shownDots).map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r={dotRadius} fill={color} opacity={opacity} />)}
    </svg>
  );
};
