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
 * The frame is drawn rather than bordered: CSS picks its own dash length off
 * the stroke weight, which at 2px gives a rhythm nothing like the reference.
 */
import React from "react";
import { theme } from "../theme";
import { progress, progressInOut, clamp01 } from "../helpers";
import { CHART } from "./ChartFrame";

/**
 * The quote's own size, and deliberately NOT one of the episode's four: this
 * box is an aside laid over the chart, neither a heading on it nor a label in
 * it. At 30px it also stays on the right side of the ~1/40-of-frame-height
 * that secondary type in video wants.
 */
const QUOTE_SIZE = 30;

/** The three beats. `type` is characters per frame. */
const IN = { rise: 8, riseBy: 26, open: 6, sliver: 10, type: 2.6 };

export type Segment = { text: string; tone?: string };
export type Line = { segments: Segment[] };

export const QuoteBox = ({
  f,
  at,
  w,
  h,
  lines,
  y = CHART.y + CHART.h,
  dash = "16 11",
  block = 15,
  opacity = 1,
}: {
  f: number;
  at: number;
  w: number;
  h: number;
  lines: Line[];
  /** The line it rides. Defaults to the chart card's bottom edge. */
  y?: number;
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
        left: theme.canvas.width / 2,
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
          borderRadius: theme.shape.panelRadius,
          background: theme.color.surface,
          /* the one shadow allowed on drawn content: the box is centred,
             nowhere near a safe margin for a 24px blur to bleed past */
          boxShadow: theme.shape.shadow,
        }}
      />

      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={wNow} height={h}>
        <rect
          x={1}
          y={1}
          width={Math.max(1, wNow - 2)}
          height={h - 2}
          rx={theme.shape.panelRadius}
          fill="none"
          stroke={theme.color.inkSoft}
          strokeWidth={theme.shape.rule}
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
            fill={theme.color.inkSoft}
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
          fontFamily: theme.text.family,
          fontSize: QUOTE_SIZE,
          fontWeight: theme.text.body.weight,
          fontStyle: "italic",
          color: theme.color.inkSoft,
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
                <Piece key={k} tone={seg.tone}>{seg.text}</Piece>
              ))}
            </span>
            <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
              {line.segments.map((seg, k) =>
                seg.cut <= 0 ? null : (
                  <Piece key={k} tone={seg.tone}>
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
const Piece = ({ tone, children }: { tone?: string; children: React.ReactNode }) =>
  tone ? (
    <span style={{ background: tone, fontWeight: 700, borderRadius: 6, padding: "2px 10px" }}>
      {children}
    </span>
  ) : (
    <span>{children}</span>
  );
