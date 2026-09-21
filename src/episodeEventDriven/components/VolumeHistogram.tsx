/**
 * VolumeHistogram — bar series with an "Expanded" vs "Thin" read. Bars are
 * indigo/cyan/neutral (NOT candle-coloured). Bars grow from the baseline from
 * `drawStart`; a caller may tint a run via `activeFrom` to mark expanded volume.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const c = theme.colors;

export const VolumeHistogram = ({
  x,
  y,
  w,
  h,
  bars,
  frame,
  drawStart,
  drawDur = 24,
  activeFrom,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  bars: number[]; // 0..1
  frame: number;
  drawStart: number;
  drawDur?: number;
  activeFrom?: number; // index where volume "expands"
  label?: string;
}) => {
  const n = bars.length;
  const slot = w / n;
  const bw = slot * 0.6;
  const grow = clamp01((frame - drawStart) / drawDur);

  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={w} height={h + 26} viewBox={`0 0 ${w} ${h + 26}`}>
      <line x1={0} x2={w} y1={h} y2={h} stroke={c.line} strokeWidth={2} />
      {bars.map((b, i) => {
        if (frame < drawStart) return null;
        const bh = b * h * grow;
        const active = activeFrom != null && i >= activeFrom;
        return (
          <rect
            key={i}
            x={i * slot + (slot - bw) / 2}
            y={h - bh}
            width={bw}
            height={bh}
            rx={2}
            fill={active ? c.indigo : c.greyLight}
          />
        );
      })}
      {label && (
        <text x={w} y={h + 20} textAnchor="end" fontSize={18} fontWeight={700} fill={c.grey} fontFamily={theme.font.family}>
          {label}
        </text>
      )}
    </svg>
  );
};
