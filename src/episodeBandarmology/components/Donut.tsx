/**
 * Donut — share-of-volume donut. Indigo shades + neutral only (no red/green).
 * Segments sweep in by `reveal` (0..1). Optional center label.
 */
import { theme } from "../theme";

const { colors, font, type } = theme;

export type Seg = { value: number; color: string; label?: string };

export const Donut = ({
  cx,
  cy,
  r,
  thickness = 56,
  segments,
  reveal,
  centerLabel,
}: {
  cx: number;
  cy: number;
  r: number;
  thickness?: number;
  segments: Seg[];
  reveal: number;
  centerLabel?: string;
}) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={(cx + r + 20) * 2} height={(cy + r + 20) * 2} viewBox={`0 0 ${(cx + r + 20) * 2} ${(cy + r + 20) * 2}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.divider} strokeWidth={thickness} />
      {segments.map((s, i) => {
        const frac = (s.value / total) * Math.min(1, reveal);
        const len = frac * C;
        const dash = `${len} ${C - len}`;
        const offset = -acc * C;
        acc += s.value / total;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={dash}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      {centerLabel && (
        <text x={cx} y={cy + 12} textAnchor="middle" fill={colors.text} fontSize={type.subhead} fontWeight={font.weights.extrabold} fontFamily={font.family}>
          {centerLabel}
        </text>
      )}
    </svg>
  );
};
