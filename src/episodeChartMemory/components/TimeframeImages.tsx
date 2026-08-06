/**
 * TimeframeImages — the three BBCA timeframe screenshots and the geometry both
 * SC06 and SC07 place them with.
 *
 * The layout lives here, not in a scene, because SC06's last frame and SC07's
 * first frame must draw the SAME picture. SC07 opens by reading `rowSlot()` —
 * exactly where SC06 left the images — and eases from there into its own two-up
 * framing. Change a number here and both sides move together; hard-code it in
 * one scene and the boundary at 3719/3720 will show a jump.
 *
 * Source files: 980 × 1406 portrait JPGs, copied verbatim from
 * "VIDEO 18 - Chart" into public/bbca/.
 */
import { Img, staticFile } from "remotion";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const BBCA = ["bbca/timeframe-1.jpg", "bbca/timeframe-2.jpg", "bbca/timeframe-3.jpg"];

/** Portrait, 980 × 1406. Every slot below sets a height; width follows. */
export const ASPECT = 980 / 1406;

/**
 * The row of three (global 3008 → 3720).
 *
 * `h` is capped so that a 5% grow still clears the margins: the row sits on the
 * canvas centre-line between the 150px logo band and the 108px subtitle band,
 * and at 1.05 the outer images stop well inside the safe left/right edges.
 */
export const ROW = { h: 470, gap: 56, cy: 561 };

/**
 * The two-up framing in SC07 (global 3720 → 4471). Taller than a row slot, so
 * the carried image reads as growing when it takes the left position. Bounded
 * by the header chips above (centre-y 200) and the caption chips below
 * (centre-y 792).
 */
export const PANE = { h: 520, cy: 495, cx: [522, 1398] };
// ═══════════════════════════════════════════════════════════════════════════

export type Slot = { cx: number; cy: number; h: number };

const ROW_W = ROW.h * ASPECT;
const ROW_LEFT = (1920 - (ROW_W * 3 + ROW.gap * 2)) / 2;

/** Centre of image `i` in the row of three. */
export const rowSlot = (i: number): Slot => ({
  cx: ROW_LEFT + ROW_W / 2 + i * (ROW_W + ROW.gap),
  cy: ROW.cy,
  h: ROW.h,
});

/** Centre of the left (0) or right (1) pane in SC07. */
export const paneSlot = (i: number): Slot => ({ cx: PANE.cx[i], cy: PANE.cy, h: PANE.h });

export const lerpSlot = (a: Slot, b: Slot, t: number): Slot => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  h: a.h + (b.h - a.h) * t,
});

/**
 * One screenshot, placed by its centre. `scale` is the highlight grow — it is a
 * transform, so it never changes the layout the other images are packed against.
 */
export const BbcaImage = ({
  index,
  slot,
  opacity = 1,
  scale = 1,
  blur = 0,
}: {
  index: number;
  slot: Slot;
  opacity?: number;
  scale?: number;
  blur?: number;
}) => {
  if (opacity <= 0.001) return null;
  const w = slot.h * ASPECT;
  return (
    <Img
      src={staticFile(BBCA[index])}
      style={{
        position: "absolute",
        left: slot.cx - w / 2,
        top: slot.cy - slot.h / 2,
        width: w,
        height: slot.h,
        opacity,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    />
  );
};
