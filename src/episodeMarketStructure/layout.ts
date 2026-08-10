/**
 * layout.ts — the one chart frame every scene draws inside.
 *
 * The episode is a single argument repeated at different zooms, so almost every
 * scene shows the same card in the same place. Keeping the box here (instead of
 * per scene) is what lets SC05 hand its staircase to SC06, and SC12 to SC13,
 * without the picture shifting on the boundary frame.
 *
 * Everything below respects the fixed margins: 96 / 96 / 54 / 108.
 *   · CARD.y 168 clears the 150px top-right logo zone outright, so nothing in
 *     the card can ever collide with the mark.
 *   · CARD bottom is 852 and the subtitle band starts at 972 — CAPTION_Y 900
 *     puts one row of chips in between.
 *   · PLOT insets the card by 56px, with an extra 96px on the right for price
 *     labels, which are the only thing allowed outside the plot.
 */
export const CARD = { x: 96, y: 168, w: 1728, h: 684 };

/** The drawable area inside the card. Charts, bands and markers live here. */
export const PLOT = { x: CARD.x + 56, y: CARD.y + 56, w: CARD.w - 56 - 96 - 56, h: CARD.h - 112 };

/** Scene header — left aligned, inside the top band, well clear of x ≤ 1368. */
export const HEADER = { x: 96, y: 100 };

/** Centre-y for the single row of chips that sits under the card. */
export const CAPTION_Y = 900;

/** Two side-by-side panes (SC11 comparison, SC17 app panel, SC19 has three). */
export const paneBox = (i: number, n = 2, gap = 48) => {
  const w = (CARD.w - gap * (n - 1)) / n;
  return { x: CARD.x + i * (w + gap), y: CARD.y, w, h: CARD.h };
};
