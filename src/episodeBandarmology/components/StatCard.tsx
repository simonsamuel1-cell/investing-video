/**
 * StatCard — label + value (+ optional sub + mini sparkline). White card,
 * radius 16–24, 1–2px border. Indigo/neutral only.
 */
import { theme } from "../theme";

const { colors, font, type, radius, border } = theme;

export const StatCard = ({
  left,
  top,
  width,
  height = 200,
  label,
  value,
  sub,
  spark,
  op = 1,
}: {
  left: number;
  top: number;
  width: number;
  height?: number;
  label: string;
  value: string;
  sub?: string;
  spark?: number[];
  op?: number;
}) => {
  return (
    <div style={{ position: "absolute", left, top, width, height, opacity: op, background: colors.cardWhite, border: `${border.regular}px solid ${colors.divider}`, borderRadius: radius.lg, padding: 26, boxSizing: "border-box", transform: `translateY(${(1 - op) * 12}px)` }}>
      <div style={{ fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slateMute }}>{label}</div>
      <div style={{ fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: type.chip, fontWeight: font.weights.medium, color: colors.slate, marginTop: 6 }}>{sub}</div>}
      {spark && spark.length > 1 && (
        <svg width={width - 52} height={44} viewBox={`0 0 ${width - 52} 44`} style={{ marginTop: 12, overflow: "visible" }}>
          <path
            d={spark
              .map((v, i) => {
                const x = (i / (spark.length - 1)) * (width - 52);
                const y = (1 - v) * 44;
                return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
              })
              .join(" ")}
            fill="none"
            stroke={colors.cyan}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};
