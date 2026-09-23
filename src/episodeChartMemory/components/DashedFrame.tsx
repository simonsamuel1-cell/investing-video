/**
 * DashedFrame — the marquee box, matched to VIDEO 20's.
 *
 * Simon: "Text boxnya harus liat dari video lain. Cek Volume020 di 14385.
 * Stylenya kayak gitu. Textnya box nya aja ya yang diambil referensinya."
 *
 * ⚠ IT IS A COPY OF core/DashedBox's LOOK, NOT AN IMPORT OF IT. This episode
 * owns its folder and its own theme; core belongs to the 60fps episodes and
 * reads their palette and their `useMotion`. What is reproduced here is the
 * drawing — the same dash rhythm, the same corner blocks, the same two-beat
 * entrance — so the two cannot drift apart by eye even though they share no
 * code. Only the box was the reference; the sentence inside it is this
 * episode's own.
 *
 * ⚠ THE FRAME IS DRAWN, NOT BORDERED. CSS picks its own dash length off the
 * stroke weight, which at 2px gives a rhythm nothing like the reference — the
 * dashes have to land on known coordinates. That is also why the box is a
 * FIXED size rather than one that measures its own text: a dash pattern that
 * restarts every time a word changes is not a style, it is a coincidence.
 *
 * ═══ HOW IT ARRIVES ═══
 *
 *   1. it RISES the last 26px into place — from just below, never from off
 *      screen, so the eye does not have to travel to find it;
 *   2. the frame SNAPS OPEN sideways from a 10px sliver, at full height
 *      throughout. Fast: the box announcing itself, not an entrance.
 *
 * ⚠ NOTHING MAY BE DRAWN INSIDE WHILE IT IS STILL GROWING — a line that
 * reflows as its container widens is the one thing that gives the trick away.
 * `dashOpenAt` is the frame a caller's content may start on.
 *
 * ⚠ AND IT OPENS FROM ITS MIDDLE. VIDEO 20 opens these from the left, but
 * VIDEO 22 was re-cut so that every dashed box grows both ways off its centre
 * ("semua text box garis putus putus buat munculnya dari tengah manjang ke
 * kanan kiri"), and this box is pinned to the middle of the frame, where
 * opening from an edge reads as the box sliding into position.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, progressInOut } from "../helpers";

/**
 * ⚠ SLOWER THAN VIDEO 20'S. Its numbers are 4 and 3 frames here, and Simon
 * could not see the move at all: "cepet banget soalnya jadi ga keliatan
 * pergerakannya. Take your time." Thirty frames total — a second — is enough
 * for the rise and the snap to read as two separate events, which is the
 * whole point of there being two.
 *
 * ⚠ AND THE RULE IS 3px, NOT THE THEME'S 2. Simon asked directly. It is a
 * literal rather than theme.stroke.rule because this frame is a reproduction
 * of a specific drawing, not a member of the episode's rule family — the dash
 * length is a literal for the same reason.
 */
const RISE = 12;
const OPEN = 18;
const RULE = 3;
const RISE_BY = 26;
const SLIVER = 10;
const DASH = "16 11";
const BLOCK = 15;

/** The frame this box's content may start on. */
export const dashOpenAt = (at: number) => at + RISE + OPEN;

export const DashedFrame = ({
  x, y, w, h, at, opacity = 1, children,
}: {
  x: number; y: number; w: number; h: number; at: number;
  opacity?: number; children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const pal = usePalette();
  if (f < at || opacity <= 0.001) return null;

  const rise = progress(f, at, RISE);
  const open = progressInOut(f, at + RISE, OPEN);
  /** A sliver until the snap. */
  const wNow = SLIVER + (w - SLIVER) * open;
  /** Half of what is missing, so the box's middle never moves. */
  const left = x + (w - wNow) / 2;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: y + (1 - rise) * RISE_BY,
        width: wNow,
        height: h,
        opacity: rise * opacity,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: theme.radius.card, background: pal.cardBg }} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={wNow} height={h}>
        <rect
          x={1}
          y={1}
          width={Math.max(1, wNow - 2)}
          height={h - 2}
          rx={theme.radius.card}
          fill="none"
          stroke={pal.ink}
          strokeWidth={RULE}
          strokeDasharray={DASH}
        />
        {/* a solid block on each corner, so the dash rhythm has somewhere to
            start and stop rather than fraying into the curve */}
        {[
          [1, 1],
          [wNow - 1, 1],
          [1, h - 1],
          [wNow - 1, h - 1],
        ].map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx - BLOCK / 2}
            y={cy - BLOCK / 2}
            width={BLOCK}
            height={BLOCK}
            fill={pal.ink}
          />
        ))}
      </svg>
      {/* the content sits inside the FULL width, not the growing one — it is
          only ever mounted once the snap has finished */}
      <div style={{ position: "absolute", left: (wNow - w) / 2, top: 0, width: w, height: h }}>
        {children}
      </div>
    </div>
  );
};
