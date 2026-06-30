/**
 * SchematicChart — SVG line-chart primitive for the schematic price lines
 * (Scenes 14, 19, 28, 30 and the Wyckoff curve). 2px indigo stroke, optional
 * dashed reference lines (avg-cost), optional slate volume histogram (achromatic,
 * never green/red), optional indigo-tint highlight bands.
 *
 * Coordinates are NORMALISED: x,y in [0,1], origin bottom-left (y up). The path
 * only mounts once `progress > 0` so there is no ghost end-state flash on frame 0
 * (§2 SVG conditional-mount rule).
 */
import { theme } from "../theme";

const { colors, font, type } = theme;

type Pt = { x: number; y: number };

export const SchematicChart = ({
  width,
  height,
  points,
  progress,
  color = colors.indigo,
  strokeWidth = 3,
  refLines = [],
  bands = [],
  volume = [],
  left,
  top,
}: {
  width: number;
  height: number;
  points: Pt[];
  progress: number; // 0..1 draw-in
  color?: string;
  strokeWidth?: number;
  refLines?: { y: number; label?: string; color?: string }[];
  bands?: { x0: number; x1: number; label?: string }[];
  volume?: number[]; // bar heights 0..1
  left?: number;
  top?: number;
}) => {
  const px = (p: Pt) => ({ x: p.x * width, y: (1 - p.y) * height });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p).x.toFixed(1)} ${px(p).y.toFixed(1)}`).join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: left !== undefined || top !== undefined ? "absolute" : undefined, left, top, overflow: "visible" }}
    >
      {/* highlight bands (indigo tint) */}
      {bands.map((b, i) => (
        <rect
          key={`band-${i}`}
          x={b.x0 * width}
          y={0}
          width={(b.x1 - b.x0) * width}
          height={height}
          fill={colors.indigoTint}
          opacity={0.7}
        />
      ))}

      {/* volume histogram (slate bars along the bottom) */}
      {volume.map((h, i) => {
        const bw = (width / volume.length) * 0.62;
        const cx = (i + 0.5) * (width / volume.length);
        const bh = h * height * 0.28;
        return (
          <rect
            key={`vol-${i}`}
            x={cx - bw / 2}
            y={height - bh}
            width={bw}
            height={bh}
            rx={2}
            fill={colors.slateFaint}
          />
        );
      })}

      {/* dashed reference lines */}
      {refLines.map((r, i) => (
        <g key={`ref-${i}`}>
          <line
            x1={0}
            x2={width}
            y1={(1 - r.y) * height}
            y2={(1 - r.y) * height}
            stroke={r.color ?? colors.indigoDeep}
            strokeWidth={2}
            strokeDasharray="10 8"
            opacity={0.8}
          />
          {r.label && (
            <text
              x={8}
              y={(1 - r.y) * height - 10}
              fill={r.color ?? colors.indigoDeep}
              fontSize={type.chip}
              fontWeight={font.weights.bold}
              fontFamily={font.family}
            >
              {r.label}
            </text>
          )}
        </g>
      ))}

      {/* price line — conditionally mounted, draws in via normalised pathLength */}
      {progress > 0 && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.min(1, progress)}
        />
      )}
    </svg>
  );
};
