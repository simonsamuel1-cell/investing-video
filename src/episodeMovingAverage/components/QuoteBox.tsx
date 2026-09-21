/**
 * QuoteBox.tsx — the line a scene leaves you with, in a dashed marquee.
 *
 * It STRADDLES the chart card's bottom border, half on the white and half on
 * the ground. Sitting on the edge is what makes it read as laid over the chart
 * rather than as one more label inside it.
 *
 * ═══ HOW IT ARRIVES ═══
 *
 * The way a dialogue box opens in a game, in three beats that never overlap:
 *
 *   1. it RISES the last few pixels into place — from just below, never from
 *      off screen, so the eye does not have to travel to find it;
 *   2. the frame SNAPS OPEN sideways, from a 10px sliver to full width, at
 *      full height the whole time. Fast: this is the box announcing itself,
 *      not an entrance of its own;
 *   3. only then does the text TYPE ON, a few characters a frame.
 *
 * Nothing is typed while the box is still growing — a line that reflows as its
 * container widens is the one thing that would give the trick away.
 *
 * ═══ WHY IT IS A FIXED SIZE ═══
 *
 * The frame is a dashed rule with a solid block on each corner, and both the
 * dash rhythm and the blocks have to land on known coordinates. A box that
 * sized itself to its text could only be measured at render time, and the
 * dashes would re-space every time the sentence changed. Each caller passes
 * the size its own sentence needs.
 *
 * The frame is DRAWN rather than bordered: CSS picks its own dash length off
 * the stroke weight, which at 2px gives a rhythm nothing like the reference.
 */
import React from "react";
import { theme } from "../theme";
import { progress, progressInOut, clamp01 } from "../helpers";

/**
 * The quote's own size, and deliberately NOT one of the episode's four: this
 * box is an aside laid over the chart, neither a heading on it nor a label in
 * it. Simon settled on 30 after trying 36 and 24.
 */
const QUOTE_SIZE = 30;
/** The sentence's own grey. Not black — the box is an aside. */
const INK = theme.colors.ink;

/** The three beats. `type` is characters per frame. */
const IN = { rise: 8, riseBy: 26, open: 6, sliver: 10, type: 2.6 };

/** A marked run takes its hue's pale tint behind its hue's full strength. */
const TONE = {
  cyan: { bg: theme.colors.cyan12, fg: theme.colors.cyan },
  indigo: { bg: theme.colors.indigo12, fg: theme.colors.indigo },
} as const;

export type Segment = {
  text: string;
  tone?: keyof typeof TONE;
  /**
   * Keep the sentence's own dark ink and let the tint alone do the marking.
   *
   * A marked WORD takes its hue's text colour — that is what makes it read as
   * lifted out of the sentence around it. A marked SENTENCE has no sentence
   * around it to lift out of, and colouring every glyph just washes the whole
   * line out. Same highlight, different job.
   */
  ink?: boolean;
};
export type Line = { segments: Segment[] };

export const QuoteBox = ({
  f,
  at,
  w,
  h,
  y,
  lines,
  dash = "16 11",
  block = 15,
  opacity = 1,
}: {
  f: number;
  at: number;
  w: number;
  h: number;
  /** The line it rides — pass the chart card's bottom edge. */
  y: number;
  lines: Line[];
  dash?: string;
  block?: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;

  const rise = progress(f, at, IN.rise);
  const open = progressInOut(f, at + IN.rise, IN.open);
  /** The frame's width right now — a sliver until the snap. */
  const wNow = IN.sliver + (w - IN.sliver) * open;
  /** How many characters have been typed, counted across the whole box. */
  const shown = Math.floor(Math.max(0, f - (at + IN.rise + IN.open)) * IN.type);

  /* the typewriter counts through the segments in reading order */
  let cursor = 0;
  const typed = lines.map((line) => ({
    segments: line.segments.map((seg) => {
      const from = cursor;
      cursor += seg.text.length;
      return { ...seg, cut: clamp01((shown - from) / Math.max(1, seg.text.length)) };
    }),
  }));

  return (
    <div
      style={{
        position: "absolute",
        left: theme.layout.width / 2,
        top: y + (1 - rise) * IN.riseBy,
        transform: "translate(-50%, -50%)",
        opacity: rise * opacity,
        width: wNow,
        height: h,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.layout.radius.md,
          background: theme.colors.surface,
          /* the one shadow allowed on drawn content: the box is centred,
             nowhere near a safe margin for the blur to bleed past */
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
        }}
      />

      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={wNow} height={h}>
        <rect
          x={1}
          y={1}
          width={Math.max(1, wNow - 2)}
          height={h - 2}
          rx={theme.layout.radius.md}
          fill="none"
          stroke={INK}
          strokeWidth={theme.layout.border.thick}
          strokeDasharray={dash}
        />
        {[
          [1, 1],
          [wNow - 1, 1],
          [1, h - 1],
          [wNow - 1, h - 1],
        ].map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx - block / 2}
            y={cy - block / 2}
            width={block}
            height={block}
            fill={INK}
          />
        ))}
      </svg>

      {/* clipped, so nothing can spill while the frame is still narrow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: theme.type.family,
          fontSize: QUOTE_SIZE,
          fontWeight: theme.type.labelSm.weight,
          fontStyle: "italic",
          color: INK,
          whiteSpace: "nowrap",
          lineHeight: 1.25,
        }}
      >
        {typed.map((line, i) => (
          /**
           * The FULL line is rendered invisibly to hold the width, and the
           * typed part is laid over it from the left. Without that the line
           * would be centred on however much of it existed and every new
           * character would shove the sentence sideways.
           */
          <div key={i} style={{ position: "relative", display: "inline-block" }}>
            <span style={{ visibility: "hidden" }}>
              {line.segments.map((seg, k) => (
                <Piece key={k} tone={seg.tone} ink={seg.ink}>{seg.text}</Piece>
              ))}
            </span>
            <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
              {line.segments.map((seg, k) =>
                seg.cut <= 0 ? null : (
                  <Piece key={k} tone={seg.tone} ink={seg.ink}>
                    {seg.text.slice(0, Math.ceil(seg.text.length * seg.cut))}
                  </Piece>
                ),
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** A run of the sentence. With a tone it is marked; without, it is plain. */
const Piece = ({
  tone,
  ink,
  children,
}: {
  tone?: keyof typeof TONE;
  ink?: boolean;
  children: React.ReactNode;
}) =>
  tone ? (
    <span
      style={{
        background: TONE[tone].bg,
        color: ink ? INK : TONE[tone].fg,
        fontWeight: 700,
        borderRadius: 6,
        padding: "2px 10px",
      }}
    >
      {children}
    </span>
  ) : (
    <span>{children}</span>
  );
