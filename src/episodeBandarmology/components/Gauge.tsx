/**
 * Gauge — horizontal probability gauge: indigo fill on a cyan track, with a
 * `cap` marker so it never reads as a certainty meter (§ compliance). Label
 * above, "capped" note at the cap tick.
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export const Gauge = ({
  left,
  top,
  width,
  value,
  cap = 0.7,
  label,
  capLabel = "Capped — never certainty",
  op = 1,
}: {
  left: number;
  top: number;
  width: number;
  value: number; // 0..1
  cap?: number; // 0..1
  label: string;
  capLabel?: string;
  op?: number;
}) => {
  const v = Math.min(value, cap);
  const trackH = 48;
  return (
    <div style={{ position: "absolute", left, top, width, opacity: op }}>
      <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, marginBottom: 16 }}>{label}</div>
      <div style={{ position: "relative", width: "100%", height: trackH, borderRadius: radius.pill, background: colors.cyanTint, overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: colors.indigo, borderRadius: radius.pill }} />
      </div>
      {/* cap marker */}
      <div style={{ position: "absolute", left: `${cap * 100}%`, top: 38, width: 2, height: trackH + 16, background: colors.indigoDeep }} />
      <div style={{ position: "absolute", left: `${cap * 100}%`, top: trackH + 60, transform: "translateX(-50%)", fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate, whiteSpace: "nowrap" }}>{capLabel}</div>
    </div>
  );
};
