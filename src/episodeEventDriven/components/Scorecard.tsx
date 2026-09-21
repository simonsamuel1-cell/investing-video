/**
 * Scorecard — factor rows, each with a mini gauge or bar (Scene 15's
 * "Tuntun AI · Key Events"). Rows reveal one at a time on their onsets. The
 * last row can be a before/after mini-chart. Gauges/bars are indigo/cyan —
 * these are illustrative, never presented as a real fetched score.
 */
import { theme } from "../theme";
import { textReveal, clamp01 } from "../helpers";

const c = theme.colors;

export type ScoreRow = { label: string; kind: "gauge" | "bar" | "beforeafter"; value: number; before?: number; after?: number };

const Gauge = ({ v, op }: { v: number; op: number }) => (
  <svg width={120} height={40} viewBox="0 0 120 40">
    <rect x={0} y={26} width={120} height={8} rx={4} fill={c.hairline} />
    <rect x={0} y={26} width={120 * v * op} height={8} rx={4} fill={c.indigo} />
    <circle cx={120 * v * op} cy={30} r={7} fill={c.white} stroke={c.indigo} strokeWidth={3} />
  </svg>
);

const Bar = ({ v, op }: { v: number; op: number }) => (
  <svg width={120} height={40} viewBox="0 0 120 40">
    <rect x={0} y={14} width={120} height={16} rx={4} fill={c.hairline} />
    <rect x={0} y={14} width={120 * v * op} height={16} rx={4} fill={c.cyan} />
  </svg>
);

const BeforeAfter = ({ before, after, op }: { before: number; after: number; op: number }) => (
  <svg width={120} height={40} viewBox="0 0 120 40">
    <rect x={10} y={40 - before * 34} width={40} height={before * 34 * op} rx={3} fill={c.greyLight} />
    <rect x={70} y={40 - after * 34} width={40} height={after * 34 * op} rx={3} fill={c.indigo} />
  </svg>
);

export const Scorecard = ({
  x,
  y,
  w = 560,
  rows,
  frame,
  start,
  rowStagger = 12,
}: {
  x: number;
  y: number;
  w?: number;
  rows: ScoreRow[];
  frame: number;
  start: number;
  rowStagger?: number;
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    {rows.map((r, i) => {
      const rs = start + i * rowStagger;
      if (frame < rs) return null;
      const op = clamp01((frame - rs) / 16);
      return (
        <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", marginBottom: 12, background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: theme.radius.sm, ...textReveal(frame, rs, 14) }}>
          <span style={{ fontSize: 24, fontWeight: theme.font.weights.semibold, color: c.text }}>{r.label}</span>
          {r.kind === "gauge" && <Gauge v={r.value} op={op} />}
          {r.kind === "bar" && <Bar v={r.value} op={op} />}
          {r.kind === "beforeafter" && <BeforeAfter before={r.before ?? 0.5} after={r.after ?? 0.8} op={op} />}
        </div>
      );
    })}
  </div>
);
