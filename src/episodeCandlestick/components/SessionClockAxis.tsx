/**
 * SessionClockAxis — IDX session time axis for the intraday panel.
 * Ticks 09:00 / 12:00 / 15:50 (slate 36px); a slim indigo playhead tick moves
 * with session progress.
 */
import { theme } from "../theme";

export const SessionClockAxis = ({
  x,
  y,
  width,
  progress,
  opacity = 1,
  fontSize = theme.type.label.size,
}: {
  x: number;
  y: number; // axis baseline
  width: number;
  progress: number; // 0–1 session playback
  opacity?: number;
  fontSize?: number; // time-label size (09:00 / 12:00 / 15:50)
}) => {
  const labels: { t: number; text: string }[] = [
    { t: 0, text: "09:00" },
    { t: 0.5, text: "12:00" },
    { t: 1, text: "15:50" },
  ];
  const px = x + width * Math.min(1, Math.max(0, progress));
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={theme.colors.neutralLine} strokeWidth={theme.stroke.hairline} />
      {labels.map((l) => (
        <g key={l.text}>
          <line x1={x + width * l.t} y1={y} x2={x + width * l.t} y2={y + 8} stroke={theme.colors.neutralLine} strokeWidth={theme.stroke.hairline} />
          <text
            x={x + width * l.t}
            y={y + 8 + fontSize}
            textAnchor={l.t === 0 ? "start" : l.t === 1 ? "end" : "middle"}
            fontFamily={theme.type.family}
            fontSize={fontSize}
            fontWeight={500}
            fill={theme.colors.slate}
          >
            {l.text}
          </text>
        </g>
      ))}
      {/* playhead */}
      <line x1={px} y1={y - 10} x2={px} y2={y + 10} stroke={theme.colors.indigo} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};
