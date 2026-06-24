/**
 * IndicatorChip — a small rounded card: indicator label + reading + a state word.
 * The state word is rendered in ink (NEUTRAL-coloured) with a small indigo accent
 * dot — never green/red — so no directional signal is implied on real data.
 */
import { COLORS, RADII, BORDER, STROKES, TYPE, WEIGHT } from "../theme";

export const IndicatorChip = ({
  label,
  reading,
  state,
  x,
  y,
  w = 300,
  opacity = 1,
  scale = 1,
}: {
  label: string;
  reading: string;
  state: string;
  x: number;
  y: number;
  w?: number;
  opacity?: number;
  scale?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      borderRadius: RADII.lg,
      border: `${BORDER.thin}px solid ${STROKES.chip}`,
      background: COLORS.surface,
      padding: "18px 22px",
      boxShadow: "0 10px 26px rgba(27,29,34,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div style={{ fontSize: TYPE.label, fontWeight: WEIGHT.medium, color: COLORS.slate }}>
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
      <span style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.bold, color: COLORS.text }}>
        {reading}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: COLORS.primary,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: TYPE.chip, fontWeight: WEIGHT.semibold, color: COLORS.text }}>
          {state}
        </span>
      </span>
    </div>
  </div>
);
