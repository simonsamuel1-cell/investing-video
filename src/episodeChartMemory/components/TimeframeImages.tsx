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
import { theme } from "../theme";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const BBCA = ["bbca/timeframe-1.jpg", "bbca/timeframe-2.jpg", "bbca/timeframe-3.jpg"];

/** Portrait, 980 × 1406. Every slot below sets a height; width follows. */
export const ASPECT = 980 / 1406;

/**
 * The row of three (global 3008 → 3720).
 *
 * Sized by WIDTH, not height: `total` is the width of the whole group, gaps
 * included, and each image's height follows from the aspect ratio. 1555 is the
 * full safe area (1728) less 10%.
 *
 * At this size the 5% highlight finally stays inside the margins — the outer
 * images reach x 170 and 1750 against a 96 / 1824 safe area, where at full
 * width they overshot by 13px.
 */
export const ROW = { total: 1555, gap: 50, cy: 561 };

/**
 * Which image file sits in each row slot, left to right.
 *
 * The ANIMATION is keyed to the slot, not the file — slot 0 always lights
 * first, slot 1 second, slot 2 third. Reordering here moves the pictures
 * without moving the timing.
 *
 * [2, 1, 0] puts Timeframe_3 (5-minute) on the left and Timeframe_1 (weekly)
 * on the right, so the row reads 5m → 1D → 1W, zooming out left to right.
 */
export const ROW_IMAGE = [2, 1, 0];

/** Corner rounding on each screenshot. */
export const IMG_RADIUS = 24;

/**
 * The small label above each image. Indexed by SLOT, like the timing — so it
 * describes the position, and reordering ROW_IMAGE keeps each label paired
 * with whatever now sits under it.
 */
export const ROW_LABEL = ["5m", "1D", "1W"];

/**
 * Labels do NOT scale with the highlight. They are parked above the image's
 * GROWN top rather than its resting top, so the gap closes to `gapAboveGrown`
 * when an image is lit instead of the label being pushed into it.
 *
 * That also keeps them out of the top-right logo zone: at the row's current
 * size the label box starts at y ≈ 148 and the ink at ≈ 153, and the rightmost
 * label ends near x 1509 against a watermark that begins at x 1538.
 */
export const LABEL = { size: 28, lineH: 34, gapAboveGrown: 14, grow: 1.05 };

/**
 * The two-up framing in SC07 (global 3720 → 4471). Taller than a row slot, so
 * the carried image reads as growing when it takes the left position. Bounded
 * by the header chips above (centre-y 200) and the caption chips below
 * (centre-y 792).
 */
export const PANE = { h: 520, cy: 495, cx: [522, 1398] };
// ═══════════════════════════════════════════════════════════════════════════

export type Slot = { cx: number; cy: number; h: number };

const ROW_W = (ROW.total - ROW.gap * 2) / 3;
const ROW_H = ROW_W / ASPECT;
const ROW_LEFT = (1920 - ROW.total) / 2;

/** Centre of image `i` in the row of three. */
export const rowSlot = (i: number): Slot => ({
  cx: ROW_LEFT + ROW_W / 2 + i * (ROW_W + ROW.gap),
  cy: ROW.cy,
  h: ROW_H,
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
        borderRadius: IMG_RADIUS,
        opacity,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    />
  );
};

/** The small timeframe label parked above an image. */
export const BbcaLabel = ({ text, slot, opacity = 1 }: { text: string; slot: Slot; opacity?: number }) => {
  if (opacity <= 0.001) return null;
  const top = slot.cy - (slot.h * LABEL.grow) / 2 - LABEL.gapAboveGrown - LABEL.lineH;
  return (
    <div
      style={{
        position: "absolute",
        left: slot.cx - 200,
        top,
        width: 400,
        textAlign: "center",
        fontFamily: theme.type.family,
        fontSize: LABEL.size,
        fontWeight: 600,
        lineHeight: `${LABEL.lineH}px`,
        color: theme.colors.slate,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
