/**
 * core/ColorKey.tsx — the legend for a notation the episode is introducing.
 *
 * A round swatch, the name, and the value itself, in two columns split by a
 * vertical rule.
 *
 * ⚠ IT PRINTS THE HEX ON PURPOSE. Everywhere else in this library a colour is
 * a slot and its value is nobody's business — that is what makes a palette
 * swap possible. This is the one place the value IS the subject: the scene is
 * teaching what green and red MEAN on a chart, and a legend that hid the
 * actual colour would be teaching nothing.
 *
 * ⚠ THE COLOURS STILL COME FROM THE PALETTE. Callers pass `usePalette()` slots,
 * never literals, so a legend cannot drift from the chart it is a legend for.
 * Under `gelap` the swatches and the printed values both change, together.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";
import type { Rect } from "./helpers";

export type KeyEntry = {
  name: string;
  /** A palette slot — `c.candleGreen`, never "#22B573". */
  color: string;
  /** Overrides the printed value. Defaults to `color` itself, upper-cased. */
  note?: string;
};

export const ColorKey = ({
  entries,
  rect,
  at,
  stagger,
  opacity = 1,
}: {
  entries: KeyEntry[];
  rect: Rect;
  at: number;
  /** Frames between one row arriving and the next. Defaults to a quarter reveal. */
  stagger?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;

  const step = stagger ?? Math.max(1, Math.round(m.reveal / 2));
  /* two columns, filled down the left one first — reading order, not
     alternating, so a two-entry key does not straddle the rule */
  const perCol = Math.ceil(entries.length / 2);
  const colW = (rect.w - theme.shape.rule) / 2;
  const rowH = rect.h / Math.max(1, perCol);
  const dot = Math.round(theme.text.chip.size * 0.72);

  return (
    <>
      {/* the rule between the columns — only when both are occupied */}
      {entries.length > perCol && (
        <div
          style={{
            position: "absolute",
            left: rect.x + colW,
            top: rect.y,
            width: theme.shape.hairline,
            height: rect.h,
            background: c.border,
            opacity,
          }}
        />
      )}
      {entries.map((e, i) => {
        const col = Math.floor(i / perCol);
        const row = i % perCol;
        const r = textReveal(f, at + i * step, m.reveal);
        if (r.opacity <= 0.001) return null;
        return (
          <div
            key={e.name}
            style={{
              position: "absolute",
              left: rect.x + col * (colW + theme.shape.rule) + (col ? theme.text.chip.size : 0),
              top: rect.y + row * rowH,
              width: colW,
              height: rowH,
              display: "flex",
              alignItems: "center",
              gap: theme.text.chip.size * 0.5,
              fontFamily: theme.text.family,
              opacity: r.opacity * opacity,
              transform: `translateY(${r.dy}px)`,
            }}
          >
            <span
              style={{
                width: dot,
                height: dot,
                borderRadius: 999,
                background: e.color,
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontSize: theme.text.chip.size,
                fontWeight: theme.text.chip.weight,
                color: c.ink,
                whiteSpace: "nowrap",
              }}
            >
              {e.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: theme.text.axis.size,
                fontWeight: theme.text.axis.weight,
                color: c.muted,
                whiteSpace: "nowrap",
              }}
            >
              {e.note ?? e.color.toUpperCase()}
            </span>
          </div>
        );
      })}
    </>
  );
};
