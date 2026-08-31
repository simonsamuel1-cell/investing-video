/**
 * core/StatStrip.tsx — a row of metrics under a chart or a panel.
 *
 * Small label ABOVE the value, thin divider between columns. The label is the
 * caption and the value is the subject, so the value gets the size and the
 * label gets the muted ink — the eye should land on the number.
 *
 * ⚠ TWO TO FIVE COLUMNS. Past five, each column is narrower than the numbers
 * in it and the strip stops being readable at a glance, which is the only
 * thing it is for. If a scene needs more facts than that, it needs a table.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";
import type { Rect } from "./helpers";
import type { Tone } from "./Chip";

export type Stat = {
  label: string;
  value: string;
  /** Colours the VALUE only; the label stays muted so the row reads as one. */
  tone?: Tone;
};

export const StatStrip = ({
  stats,
  rect,
  at,
  stagger,
  opacity = 1,
}: {
  stats: Stat[];
  rect: Rect;
  at: number;
  stagger?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001 || stats.length === 0) return null;

  const step = stagger ?? Math.max(1, Math.round(m.reveal / 3));
  const colW = rect.w / stats.length;
  const inkOf = (t?: Tone) =>
    t === "cyan" ? c.cyan : t === "slate" ? c.slate : t === "indigo" ? c.indigo : c.ink;

  return (
    <>
      {stats.map((s, i) => {
        const r = textReveal(f, at + i * step, m.reveal);
        if (r.opacity <= 0.001) return null;
        return (
          <div key={s.label}>
            {/* the divider belongs to the column on its right, so the first
                column never gets one and the strip cannot end with a stray */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: rect.x + i * colW,
                  top: rect.y + rect.h * 0.12,
                  width: theme.shape.hairline,
                  height: rect.h * 0.76,
                  background: c.border,
                  opacity: r.opacity * opacity,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: rect.x + i * colW,
                top: rect.y,
                width: colW,
                height: rect.h,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontFamily: theme.text.family,
                opacity: r.opacity * opacity,
                transform: `translateY(${r.dy}px)`,
              }}
            >
              <span
                style={{
                  fontSize: theme.text.axis.size,
                  fontWeight: theme.text.axis.weight,
                  color: c.slate,
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontSize: theme.text.title.size,
                  fontWeight: theme.text.title.weight,
                  color: inkOf(s.tone),
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {s.value}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};
