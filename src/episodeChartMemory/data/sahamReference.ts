/**
 * sahamReference — the candles in SC02's right-hand ("Saham") window.
 *
 * ⚠ TRACED, NOT GENERATED. Simon supplied a 358×257 screenshot of a chart and
 * asked for it to be recreated: "Recreate pola candlestick ini dan ukurannya
 * dibuat sama tingginya dengan screenshot ini." Each row below is one candle
 * read off that image column by column — body from the body's edge column,
 * high/low from its wick column — as PIXEL ROWS measured from the image's top.
 * 37 candles: the one cut in half at the left edge is kept (its wick column is
 * whole), the 2px sliver at the right edge is not.
 *
 * Kept in pixel space on purpose: SC02 draws this at the screenshot's own
 * height, one screen pixel per traced pixel, so the shape is the shape Simon
 * picked rather than a re-fit of it. It is an ILLUSTRATION — no ticker, no
 * dates, no prices, and nothing on screen labels it with a figure.
 */
import type { OHLC } from "./bmri";

/** Height of the reference screenshot, in pixels. */
export const SAHAM_REF_H = 257;

/** [open, close, high, low] as pixel rows from the top of the screenshot. */
const ROWS: [number, number, number, number][] = [
  [85, 78, 68, 88],
  [57, 74, 51, 74],
  [74, 59, 51, 77],
  [45, 78, 34, 78],
  [79, 104, 68, 104],
  [110, 96, 87, 110],
  [100, 128, 96, 128],
  [123, 132, 113, 133],
  [142, 155, 138, 156],
  [157, 161, 142, 173],
  [151, 168, 144, 169],
  [151, 132, 127, 156],
  [127, 147, 121, 147],
  [138, 157, 138, 157],
  [147, 138, 138, 158],
  [140, 166, 138, 166],
  [166, 157, 151, 171],
  [161, 168, 149, 168],
  [168, 166, 164, 173],
  [157, 174, 153, 175],
  [176, 198, 172, 199],
  [213, 213, 187, 214],
  [208, 181, 181, 208],
  [179, 149, 140, 182],
  [149, 157, 136, 157],
  [172, 161, 157, 178],
  [159, 162, 151, 165],
  [155, 145, 138, 160],
  [121, 119, 112, 122],
  [113, 113, 106, 126],
  [117, 125, 113, 125],
  [113, 119, 112, 126],
  [104, 83, 76, 107],
  [72, 81, 68, 82],
  [81, 91, 76, 92],
  [85, 68, 57, 90],
  [68, 72, 59, 73],
];

/** Rows → prices: a row nearer the top is a higher price. */
export const SAHAM_CANDLES: OHLC[] = ROWS.map(([o, c, h, l], k) => ({
  date: `ref${k}`,
  o: SAHAM_REF_H - o,
  c: SAHAM_REF_H - c,
  h: SAHAM_REF_H - h,
  l: SAHAM_REF_H - l,
}));
