/**
 * NodeCluster — a company node linked to a sector cluster; a highlight
 * propagates from the company outward to neighbours. Drives Scene 7 card 3
 * (company vs sector) and Scene 18 (signal spreading). Node layout is
 * deterministic (seeded PRNG). `spreadStart` gates the propagation; `litCount`
 * grows one node at a time so callers can read "how far the signal reached".
 */
import { theme } from "../theme";
import { clamp01, mulberry32 } from "../helpers";

const c = theme.colors;

export const NodeCluster = ({
  x,
  y,
  w,
  h,
  frame,
  companyStart,
  spreadStart,
  spreadStep = 8,
  count = 7,
  seed = 71,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  frame: number;
  companyStart: number;
  spreadStart: number;
  spreadStep?: number;
  count?: number;
  seed?: number;
}) => {
  const rnd = mulberry32(seed);
  const cx = w * 0.22;
  const cy = h * 0.5;
  const nodes = new Array(count).fill(0).map((_, i) => {
    const ang = (i / count) * Math.PI * 2;
    const rad = 0.26 + rnd() * 0.12;
    return { x: w * 0.62 + Math.cos(ang) * w * rad * 0.5, y: h * 0.5 + Math.sin(ang) * h * rad };
  });

  const companyOp = clamp01((frame - companyStart) / 14);
  const litUpTo = frame < spreadStart ? -1 : Math.floor((frame - spreadStart) / spreadStep);

  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* edges */}
      {nodes.map((n, i) => {
        const lit = i <= litUpTo;
        return <line key={`e${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={lit ? c.indigo : c.hairline} strokeWidth={lit ? 2.5 : 1.5} opacity={frame >= companyStart ? 1 : 0} />;
      })}
      {/* sector nodes */}
      {nodes.map((n, i) => {
        const lit = i <= litUpTo;
        const op = clamp01((frame - companyStart) / 14);
        return <circle key={`n${i}`} cx={n.x} cy={n.y} r={lit ? 15 : 12} fill={lit ? c.indigo : c.white} stroke={lit ? c.indigo : c.greyLight} strokeWidth={2} opacity={op} />;
      })}
      {/* company node */}
      {frame >= companyStart && (
        <>
          <circle cx={cx} cy={cy} r={26} fill={c.cyan} opacity={companyOp} />
          <text x={cx} y={cy + 46} textAnchor="middle" fontSize={18} fontWeight={700} fill={c.grey} fontFamily={theme.font.family} opacity={companyOp}>Company</text>
        </>
      )}
    </svg>
  );
};
