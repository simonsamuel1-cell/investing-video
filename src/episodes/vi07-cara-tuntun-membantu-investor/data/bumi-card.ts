/**
 * BUMI_3's card (public/art/vi07/app/BUMI-kartu.png, 2160 × 752, the gauge's pointer painted out so it can be redrawn
 * and moved) — measured on the PNG. SC03 shows the whole card; so does SC07, border and all (Simon 29 Oct: "ganti jadi
 * screenshot fair price di scene sebelumnya", "skaligus 3 aja", "Termasuk Exclusive Research & guidancenya aja").
 */
export const BUMI_CARD = {
  src: "art/vi07/app/BUMI-kartu.png",
  w: 2160,
  card: { x: 93, y: 93, w: 1974, h: 608 },
  radius: 54,
  signals: { x0: 1484, x1: 2063, y0: 96, y1: 532 },
  /** The two columns' contents, and the gauge with its pointer (apex row 382, centre x 835 — 14% along, in the green). */
  cq: { x1: 130, y1: 154, x2: 617, y2: 469 },
  fv: { x1: 734, y1: 154, x2: 1425, y2: 471 },
  gauge: { x0: 737, x1: 1423, y: 382, at: (835 - 737) / (1423 - 737), red: 0.86 },
  pointer: { w: 23, h: 16 },
  /**
   * The whole card with its grey border (columns 93–96 and 2063–2065, rows 93–96 and 699–700) and a few pixels of the
   * PNG's white past it, so nothing of the border is cut; the white outside meets a white card.
   */
  framed: { x1: 88, y1: 88, x2: 2070, y2: 706 },
  /** Fair Value's "60% - 66% Undervalued" line — covered where the pointer is moved into the red, which it would contradict. */
  fvNote: { x1: 800, y1: 426, x2: 1360, y2: 488 },
} as const;
