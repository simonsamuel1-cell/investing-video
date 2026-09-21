/**
 * LineChart — generic line-series primitive (leader/laggard/followers,
 * already-ran, repricing, price watch). Each line reveals via stroke-dashoffset
 * from `drawStart` and mounts only once its onset passes (no frame-0 flash).
 * Optional dashed "ghost" ahead of a `nowX` marker (Scene 8).
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const c = theme.colors;

export type Line = {
  pts: Array<[number, number]>; // normalized 0..1 within the plot box
  tone?: "indigo" | "cyan" | "grey";
  dashed?: boolean;
  label?: string;
  start?: number; // per-line onset offset (frames after drawStart)
};

const stroke = (t?: "indigo" | "cyan" | "grey") => (t === "cyan" ? c.cyan : t === "grey" ? c.greyLight : c.indigo);

export const LineChart = ({
  x,
  y,
  w,
  h,
  lines,
  frame,
  drawStart,
  drawDur = 30,
  axis = true,
  nowX,
  nowLabel,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: Line[];
  frame: number;
  drawStart: number;
  drawDur?: number;
  axis?: boolean;
  nowX?: number; // 0..1 position of a "Now" divider
  nowLabel?: string;
}) => {
  const P = 6;
  const pw = w - P * 2;
  const ph = h - P * 2;
  const map = (p: [number, number]) => [P + p[0] * pw, P + (1 - p[1]) * ph] as const;

  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {axis && (
        <>
          <line x1={P} x2={P} y1={P} y2={h - P} stroke={c.line} strokeWidth={2} />
          <line x1={P} x2={w - P} y1={h - P} y2={h - P} stroke={c.line} strokeWidth={2} />
        </>
      )}

      {nowX != null && (
        <>
          <line x1={P + nowX * pw} x2={P + nowX * pw} y1={P} y2={h - P} stroke={c.grey} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
          {nowLabel && (
            <text x={P + nowX * pw} y={h - P - 8} textAnchor="middle" fontSize={18} fontWeight={700} fill={c.grey} fontFamily={theme.font.family}>
              {nowLabel}
            </text>
          )}
        </>
      )}

      {lines.map((ln, i) => {
        const s = drawStart + (ln.start ?? 0);
        if (frame < s) return null;
        const prog = clamp01((frame - s) / drawDur);
        const d = ln.pts.map((p, k) => {
          const m = map(p);
          return `${k === 0 ? "M" : "L"}${m[0]},${m[1]}`;
        }).join(" ");
        const last = map(ln.pts[ln.pts.length - 1]);
        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={stroke(ln.tone)}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ln.dashed ? "8 8" : "1"}
              pathLength={ln.dashed ? undefined : 1}
              strokeDashoffset={ln.dashed ? 0 : 1 - prog}
              opacity={ln.dashed ? 0.55 * prog : 1}
            />
            {ln.label && prog > 0.7 && (
              <text x={last[0] + 8} y={last[1] + 5} fontSize={19} fontWeight={700} fill={stroke(ln.tone)} fontFamily={theme.font.family}>
                {ln.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
