/**
 * core/Panel.tsx — the surfaces text sits on when it is not sitting on a chart.
 *
 * `Panel` is the generic box. `StatCard` is a single number with its caption —
 * the most credible thing a scene can show, because a number is checkable and a
 * shape is not. `KeyPoint` is the one-line principle a section closes on.
 *
 * ⚠ TEXT CARDS ARE RATIONED. They are the easiest thing to reach for and the
 * fastest way to turn a video into slides. If two consecutive scenes are both a
 * card, one of them is not doing its job.
 *
 * A card MAY pop on arrival — it is a UI element. Its TYPE never does: the
 * words inside always fade and rise, through core/Text.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette, useShadow } from "./palette";
import { progress, textReveal } from "./helpers";
import { useMotion } from "./useMotion";
import type { Rect } from "./helpers";

export const Panel = ({
  rect,
  at,
  children,
  opacity = 1,
  radius = theme.shape.panelRadius,
  tinted = false,
}: {
  rect: Rect;
  at: number;
  children?: React.ReactNode;
  opacity?: number;
  radius?: number;
  /** A wash instead of a solid card — for a panel that sits ON the card. */
  tinted?: boolean;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  if (opacity <= 0.001 || f < at) return null;
  const p = progress(f, at, m.pop);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          borderRadius: radius,
          background: tinted ? theme.color.indigoWash : c.cardBg,
          border: `${theme.shape.hairline}px solid ${c.border}`,
          boxShadow: tinted ? undefined : shadow.rest,
          opacity: opacity * p,
          transform: `scale(${0.97 + 0.03 * p})`,
          transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px`,
        }}
      />
      {children}
    </>
  );
};

/**
 * A single number with its caption. The number is the hero; the caption is
 * small and above it, so the eye lands on the figure first.
 */
export const StatCard = ({
  rect,
  at,
  value,
  caption,
  tone = "indigo",
}: {
  rect: Rect;
  at: number;
  value: string;
  caption: string;
  tone?: "indigo" | "cyan" | "slate";
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const ink = tone === "cyan" ? c.cyan : tone === "slate" ? c.slate : c.indigo;
  const cap = textReveal(f, at + m.pop, m.reveal);
  const num = textReveal(f, at + m.pop + Math.round(m.reveal / 2), m.reveal);
  return (
    <Panel rect={rect} at={at}>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: theme.text.family,
        }}
      >
        <div
          style={{
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            color: c.slate,
            opacity: cap.opacity,
            transform: `translateY(${cap.dy}px)`,
            textAlign: "center",
          }}
        >
          {caption}
        </div>
        <div
          style={{
            fontSize: theme.text.display.size,
            fontWeight: theme.text.display.weight,
            color: ink,
            opacity: num.opacity,
            transform: `translateY(${num.dy}px)`,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      </div>
    </Panel>
  );
};

/**
 * The principle a section closes on. Centred on the card, one line, large.
 * Word by word, because it is the sentence the viewer is meant to keep.
 */
export const KeyPoint = ({
  text,
  sub,
  at,
  rect = theme.stage.card,
}: {
  text: string;
  sub?: string;
  at: number;
  rect?: Rect;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const words = text.split(" ");
  const step = Math.max(1, Math.round(m.reveal / 4));
  const tail = textReveal(f, at + words.length * step, m.reveal);
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        fontFamily: theme.text.family,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: theme.text.display.size, fontWeight: theme.text.display.weight, color: c.ink, lineHeight: 1.15 }}>
        {words.map((w, i) => {
          const r = textReveal(f, at + i * step, m.reveal);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: r.opacity,
                transform: `translateY(${r.dy}px)`,
                marginRight: "0.3em",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {sub && (
        <div
          style={{
            fontSize: theme.text.body.size,
            fontWeight: theme.text.body.weight,
            color: c.slate,
            opacity: tail.opacity,
            transform: `translateY(${tail.dy}px)`,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};
