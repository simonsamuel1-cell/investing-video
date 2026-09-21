/**
 * Chip / ChipRow — outlined pills with an optional leading dot. Title Case
 * labels. `tone` selects the accent; `active` fills the wash. Pop/bounce is
 * allowed on chips (UI), so callers may pass a `scale` from the pop() helper.
 */
import type { CSSProperties } from "react";
import { theme } from "../theme";

type Tone = "indigo" | "cyan" | "grey";

const toneColor = (t: Tone) =>
  t === "indigo" ? theme.colors.indigo : t === "cyan" ? theme.colors.cyan : theme.colors.grey;
const toneWash = (t: Tone) =>
  t === "indigo" ? theme.colors.indigoWash : t === "cyan" ? theme.colors.cyanWash : theme.colors.greyWash;

export const Chip = ({
  label,
  tone = "indigo",
  active = false,
  dot = false,
  op = 1,
  scale = 1,
  fontSize = 26,
  style,
}: {
  label: string;
  tone?: Tone;
  active?: boolean;
  dot?: boolean;
  op?: number;
  scale?: number;
  fontSize?: number;
  style?: CSSProperties;
}) =>
  op <= 0 ? null : (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: `${Math.round(fontSize * 0.42)}px ${Math.round(fontSize * 0.8)}px`,
        borderRadius: theme.radius.chip,
        border: `2px solid ${toneColor(tone)}`,
        background: active ? toneWash(tone) : theme.colors.white,
        color: theme.colors.text,
        fontSize,
        fontWeight: theme.font.weights.semibold,
        whiteSpace: "nowrap",
        opacity: op,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      {dot && <span style={{ width: fontSize * 0.4, height: fontSize * 0.4, borderRadius: "50%", background: toneColor(tone) }} />}
      {label}
    </div>
  );

export const ChipRow = ({
  x,
  y,
  gap = 20,
  children,
}: {
  x: number;
  y: number;
  gap?: number;
  children: React.ReactNode;
}) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap }}>{children}</div>
);
