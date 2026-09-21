/**
 * LineChart — indigo line/area for non-OHLC series (Scenes 4, 26 count line,
 * net-buy series). Gridlines, optional "Now" marker, optional step line, optional
 * tooltip on the last point. Path conditionally mounts (draws in by `progress`).
 */
import { theme } from "../theme";

const { colors, font, type } = theme;

export const LineChart = ({
  width,
  height,
  left,
  top,
  points,
  progress,
  area = false,
  step = false,
  nowX,
  tooltip,
  color = colors.indigo,
}: {
  width: number;
  height: number;
  left?: number;
  top?: number;
  points: { x: number; y: number }[];
  progress: number;
  area?: boolean;
  step?: boolean;
  nowX?: number;
  tooltip?: { x: number; y: number; label: string };
  color?: string;
}) => {
  const px = (p: { x: number; y: number }) => ({ x: p.x * width, y: (1 - p.y) * height });
  const d = points
    .map((p, i) => {
      const c = px(p);
      if (i === 0) return `M ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
      if (step) {
        const prev = px(points[i - 1]);
        return `L ${c.x.toFixed(1)} ${prev.y.toFixed(1)} L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
      }
      return `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    })
    .join(" ");
  const areaD = `${d} L ${width} ${height} L 0 ${height} Z`;
  const tip = tooltip ? px(tooltip) : null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: left !== undefined || top !== undefined ? "absolute" : undefined, left, top, overflow: "visible" }}>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} y1={(1 - g) * height} x2={width} y2={(1 - g) * height} stroke={colors.divider} strokeWidth={1} />
      ))}
      <line x1={0} y1={height} x2={width} y2={height} stroke={colors.slateFaint} strokeWidth={2} />

      {progress > 0 && area && <path d={areaD} fill={colors.indigoTint} opacity={0.5 * Math.min(1, progress)} />}
      {progress > 0 && (
        <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, progress)} />
      )}

      {nowX !== undefined && (
        <g>
          <line x1={nowX * width} y1={0} x2={nowX * width} y2={height} stroke={colors.slate} strokeWidth={2} strokeDasharray="8 8" />
          <text x={nowX * width} y={-12} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Now</text>
        </g>
      )}

      {tip && progress >= 0.98 && (
        <g>
          <circle cx={tip.x} cy={tip.y} r={9} fill={color} />
          <rect x={tip.x - 250} y={tip.y - 70} width={240} height={50} rx={8} fill={colors.cardWhite} stroke={colors.divider} strokeWidth={1} />
          <text x={tip.x - 130} y={tip.y - 38} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.medium} fontFamily={font.family}>{tooltip!.label}</text>
        </g>
      )}
    </svg>
  );
};
