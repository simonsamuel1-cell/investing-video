/**
 * core/DashedBox.tsx — the dashed marquee, ported from Moving Average.
 *
 * The frame is a dashed rule with a solid block on each corner, sitting on a
 * card. Ported from 019's QuoteBox at Simon's instruction so the two episodes
 * cannot drift apart; what is left behind is that component's typewriter, which
 * belonged to the sentence rather than to the box. This one takes CHILDREN and
 * lets the caller animate them however the scene needs.
 *
 * ═══ HOW IT ARRIVES ═══
 *
 * The way a dialogue box opens in a game, in two beats that never overlap:
 *
 *   1. it RISES the last few pixels into place — from just below, never from
 *      off screen, so the eye does not have to travel to find it;
 *   2. the frame SNAPS OPEN sideways, from a 10px sliver to full width, at full
 *      height throughout. Fast: the box announcing itself, not an entrance.
 *
 * ⚠ NOTHING IS DRAWN INSIDE WHILE IT IS STILL GROWING. A line that reflows as
 * its container widens is the one thing that gives the trick away. `openAt`
 * tells a caller the frame its content may start on.
 *
 * ⚠ THE FRAME IS DRAWN, NOT BORDERED. CSS picks its own dash length off the
 * stroke weight, which at 2px gives a rhythm nothing like the reference — the
 * dashes have to land on known coordinates, which is also why the box is a
 * fixed size rather than one that measures its own text.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress, progressInOut } from "./helpers";

/** The two beats. Frames. */
export const DASH_IN = { rise: 8, riseBy: 26, open: 6, sliver: 10 } as const;
/** The frame its content may start on, given the frame the box starts on. */
export const dashOpenAt = (at: number) => at + DASH_IN.rise + DASH_IN.open;

export const DashedBox = ({
  x,
  y,
  w,
  h,
  at,
  dash = "16 11",
  block = 15,
  opacity = 1,
  solid = false,
  blocks = true,
  shadow,
  children,
}: {
  /** Top-left, in canvas pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  dash?: string;
  block?: number;
  opacity?: number;
  /** Draw the frame as an unbroken rule instead of a dashed one. */
  solid?: boolean;
  /** The corner blocks. They exist to give a DASH rhythm somewhere to start
   *  and stop; on a solid frame they are leftovers, so a solid box usually
   *  wants them off. */
  blocks?: boolean;
  /**
   * A HARD shadow — a second frame offset behind this one, no blur. Not a
   * drop shadow: this is a printed look, and a blur would turn it into
   * elevation, which says the box is floating rather than stamped.
   */
  shadow?: { x: number; y: number; color: string };
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (f < at || opacity <= 0.001) return null;

  const rise = progress(f, at, DASH_IN.rise);
  const open = progressInOut(f, at + DASH_IN.rise, DASH_IN.open);
  /** The frame's width right now — a sliver until the snap. */
  const wNow = DASH_IN.sliver + (w - DASH_IN.sliver) * open;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - rise) * DASH_IN.riseBy,
        width: wNow,
        height: h,
        opacity: rise * opacity,
      }}
    >
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: shadow.x,
            top: shadow.y,
            width: wNow,
            height: h,
            borderRadius: theme.shape.panelRadius,
            background: shadow.color,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.shape.panelRadius,
          background: c.cardBg,
        }}
      />
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={wNow}
        height={h}
      >
        <rect
          x={1}
          y={1}
          width={Math.max(1, wNow - 2)}
          height={h - 2}
          rx={theme.shape.panelRadius}
          fill="none"
          stroke={c.ink}
          strokeWidth={theme.shape.rule}
          strokeDasharray={solid ? undefined : dash}
        />
        {/* a solid block on each corner, so the dash rhythm has somewhere to
            start and stop rather than fraying into the curve */}
        {(blocks
          ? [
          [1, 1],
          [wNow - 1, 1],
          [1, h - 1],
          [wNow - 1, h - 1],
        ]
          : []
        ).map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx - block / 2}
            y={cy - block / 2}
            width={block}
            height={block}
            fill={c.ink}
          />
        ))}
      </svg>
      {/* clipped, so nothing can spill while the frame is still narrow */}
      {open >= 0.999 ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
