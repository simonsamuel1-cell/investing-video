/**
 * Timeline — a horizontal axis with two markers contrasting a short vs long
 * horizon ("1 Day" cyan dot vs "Months" indigo bar). Used in Scene 7 card 2.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const c = theme.colors;

export const Timeline = ({
  x,
  y,
  w,
  frame,
  drawStart,
}: {
  x: number;
  y: number;
  w: number;
  frame: number;
  drawStart: number;
}) => {
  const prog = clamp01((frame - drawStart) / 22);
  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={w} height={90} viewBox={`0 0 ${w} 90`}>
      <line x1={0} x2={w * prog} y1={44} y2={44} stroke={c.line} strokeWidth={3} />
      {/* 1 Day — cyan dot near the start */}
      {frame >= drawStart && (
        <>
          <circle cx={w * 0.14} cy={44} r={9 * prog} fill={c.cyan} />
          <text x={w * 0.14} y={26} textAnchor="middle" fontSize={19} fontWeight={700} fill={c.cyan} fontFamily={theme.font.family}>1 Day</text>
          {/* Months — indigo bar spanning the tail */}
          <rect x={w * 0.4} y={38} width={w * 0.55 * prog} height={12} rx={6} fill={c.indigo} />
          <text x={w * 0.67} y={78} textAnchor="middle" fontSize={19} fontWeight={700} fill={c.indigo} fontFamily={theme.font.family}>Months</text>
        </>
      )}
    </svg>
  );
};
