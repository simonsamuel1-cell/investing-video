/**
 * StatCard — a labelled card with value rows (Expected / Actual / Δ). Used by
 * the Rate-decision group; the outcome row can flip between a "flat" and a
 * "surprise" read. Value rows fade/slide in on their own onsets.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

const c = theme.colors;

export type StatRow = { label: string; value: string; tone?: "indigo" | "cyan" | "grey" | "text" };

const valColor = (t?: StatRow["tone"]) =>
  t === "indigo" ? c.indigo : t === "cyan" ? c.cyan : t === "grey" ? c.grey : c.text;

export const StatCard = ({
  x,
  y,
  w = 420,
  title,
  rows,
  frame,
  start = 0,
  rowStagger = 8,
}: {
  x: number;
  y: number;
  w?: number;
  title: string;
  rows: StatRow[];
  frame: number;
  start?: number;
  rowStagger?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: "22px 26px",
      background: c.cardBg,
      border: `1px solid ${c.cardBorder}`,
      borderRadius: theme.radius.stat,
      boxShadow: "0 12px 34px rgba(0,0,0,0.06)",
      ...textReveal(frame, start, 16),
    }}
  >
    <div style={{ fontSize: 22, fontWeight: theme.font.weights.bold, color: c.grey, marginBottom: 14, letterSpacing: 0.3 }}>{title}</div>
    {rows.map((r, i) => (
      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${c.hairline}`, ...textReveal(frame, start + 6 + i * rowStagger, 14) }}>
        <span style={{ fontSize: 26, fontWeight: theme.font.weights.medium, color: c.text }}>{r.label}</span>
        <span style={{ fontSize: 30, fontWeight: theme.font.weights.extrabold, color: valColor(r.tone) }}>{r.value}</span>
      </div>
    ))}
  </div>
);
