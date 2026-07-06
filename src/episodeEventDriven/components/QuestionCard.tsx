/**
 * QuestionCard — a numbered outlined card. Starts as an empty state (index +
 * prompt) and exposes a `children` slot that scenes fill later (Scene 7). The
 * card and its fill animate independently so the "created → filled" beat reads.
 */
import type { ReactNode } from "react";
import { theme } from "../theme";
import { textReveal } from "../helpers";

const c = theme.colors;

export const QuestionCard = ({
  x,
  y,
  w,
  h,
  index,
  prompt,
  frame,
  cardStart,
  fillStart,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  index: number;
  prompt: string;
  frame: number;
  cardStart: number;
  fillStart?: number;
  children?: ReactNode;
}) => {
  if (frame < cardStart) return null;
  const filled = fillStart != null && frame >= fillStart;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        padding: "24px 26px",
        background: filled ? c.cardBg : "transparent",
        border: `2px solid ${filled ? c.indigo : c.cardBorder}`,
        borderRadius: theme.radius.card,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        ...textReveal(frame, cardStart, 16),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: "50%", background: filled ? c.indigo : c.indigoWash, color: filled ? c.white : c.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: theme.font.weights.extrabold }}>
          {index}
        </span>
        <span style={{ fontSize: 26, fontWeight: theme.font.weights.bold, color: c.text }}>{prompt}</span>
      </div>
      {fillStart != null && frame >= fillStart && (
        <div style={{ flex: 1, ...textReveal(frame, fillStart, 16) }}>{children}</div>
      )}
    </div>
  );
};
