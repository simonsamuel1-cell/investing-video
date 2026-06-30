/**
 * FootprintTrail — indigo footprints walking L→R, revealed sequentially, stopping
 * at a dashed "Now" line; beyond it the path dissolves into a faint "?" (NOT a
 * forecast line, no upward arrow). Reused by Scene 04 and Scene 34 (§5).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { fadeIn, tween } from "../helpers";

const { colors, font, type } = theme;

const Foot = ({ x, y, op, flip }: { x: number; y: number; op: number; flip: boolean }) => (
  <g opacity={op} transform={`translate(${x},${y}) ${flip ? "translate(0,26)" : ""}`}>
    <ellipse cx={0} cy={0} rx={14} ry={20} fill={colors.indigo} />
    <circle cx={-9} cy={-22} r={5} fill={colors.indigo} />
    <circle cx={-1} cy={-26} r={5} fill={colors.indigo} />
    <circle cx={8} cy={-24} r={5} fill={colors.indigo} />
  </g>
);

export const FootprintTrail = ({
  left = 200,
  top = 470,
  width = 1520,
  count = 9,
  nowIndex = 5,
  revealStart = 0,
  revealEnd = 160,
  showQuestion = true,
}: {
  left?: number;
  top?: number;
  width?: number;
  count?: number;
  nowIndex?: number;
  revealStart?: number;
  revealEnd?: number;
  showQuestion?: boolean;
}) => {
  const frame = useCurrentFrame();
  const step = width / (count - 1);
  const reveal = tween(frame, [revealStart, revealEnd], [0, count]);
  const nowX = nowIndex * step;

  return (
    <svg
      width={width}
      height={120}
      viewBox={`0 0 ${width} 120`}
      style={{ position: "absolute", left, top, overflow: "visible" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const past = i <= nowIndex;
        const op = Math.max(0, Math.min(1, reveal - i)) * (past ? 1 : 0.35);
        return <Foot key={i} x={i * step} y={60} op={op} flip={i % 2 === 1} />;
      })}

      {/* "Now" dashed line */}
      <line x1={nowX + step / 2} y1={-10} x2={nowX + step / 2} y2={110} stroke={colors.slate} strokeWidth={2} strokeDasharray="8 8" opacity={fadeIn(frame, revealStart + 40, 16)} />
      <text x={nowX + step / 2} y={-22} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family} opacity={fadeIn(frame, revealStart + 40, 16)}>
        Now
      </text>

      {/* faint "?" ahead — not a forecast */}
      {showQuestion && (
        <text x={(count - 1) * step} y={78} textAnchor="middle" fill={colors.slateFaint} fontSize={88} fontWeight={font.weights.extrabold} fontFamily={font.family} opacity={fadeIn(frame, revealEnd - 30, 24) * 0.7}>
          ?
        </text>
      )}
    </svg>
  );
};
