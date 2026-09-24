/**
 * sahamReference — the saham chart SC02's right window grows into and SC03
 * is read off.
 *
 * ⚠ TRACED, NOT GENERATED. Simon supplied two screenshots of the same chart:
 * a wide one (619×402, 101 candles) and a close-up (358×257, 37 candles).
 * The close-up is candles 4–40 of the wide one — all 37 colours line up in
 * order — so this file holds ONE series, traced from the wide screenshot,
 * and the close-up is simply a window onto it. That is what lets the right
 * window grow and then zoom out without a single candle changing identity.
 *
 * Each row is one candle read off the image column by column — body from the
 * body's edge column, high/low from its wick column — as PIXEL ROWS measured
 * from the image's top. It is an ILLUSTRATION: no ticker, no dates, no
 * prices, and nothing on screen labels it with a figure.
 */
import type { OHLC } from "./bmri";
import { bmriDaily, WIN } from "./bmri";
import type { Box } from "../helpers";

/** Height of the wide screenshot, in pixels. */
const REF_H = 402;

/** [open, close, high, low] as pixel rows from the top of the wide screenshot. */
const ROWS: [number, number, number, number][] = [
  [219, 240, 217, 240],
  [245, 238, 225, 261],
  [245, 238, 234, 248],
  [230, 228, 210, 233],
  [217, 208, 198, 220],
  [185, 204, 178, 204],
  [204, 187, 178, 207],
  [172, 208, 159, 208],
  [210, 238, 198, 238],
  [245, 230, 219, 245],
  [234, 266, 230, 266],
  [260, 270, 249, 272],
  [281, 296, 277, 297],
  [298, 303, 281, 317],
  [292, 311, 283, 312],
  [292, 270, 264, 297],
  [264, 288, 258, 288],
  [277, 298, 277, 298],
  [288, 277, 277, 299],
  [279, 309, 277, 309],
  [309, 298, 292, 314],
  [303, 311, 290, 311],
  [311, 309, 307, 317],
  [298, 318, 294, 319],
  [320, 345, 315, 347],
  [363, 363, 333, 364],
  [356, 326, 326, 356],
  [324, 290, 279, 327],
  [290, 298, 275, 298],
  [315, 303, 298, 323],
  [300, 305, 292, 308],
  [296, 285, 277, 302],
  [258, 255, 247, 259],
  [249, 249, 240, 263],
  [253, 262, 249, 262],
  [249, 255, 247, 263],
  [238, 215, 206, 242],
  [202, 213, 198, 214],
  [213, 223, 206, 224],
  [217, 198, 185, 222],
  [198, 202, 187, 203],
  [189, 204, 187, 204],
  [176, 191, 174, 194],
  [187, 208, 185, 209],
  [208, 228, 204, 228],
  [223, 221, 210, 229],
  [221, 193, 193, 222],
  [198, 191, 189, 201],
  [187, 189, 183, 194],
  [191, 215, 189, 216],
  [219, 217, 213, 220],
  [221, 234, 221, 242],
  [221, 221, 210, 224],
  [213, 217, 213, 220],
  [230, 240, 225, 240],
  [245, 240, 232, 245],
  [232, 223, 223, 235],
  [228, 232, 223, 235],
  [243, 270, 240, 274],
  [266, 255, 245, 272],
  [247, 251, 247, 257],
  [255, 243, 236, 257],
  [234, 240, 228, 240],
  [230, 238, 230, 244],
  [234, 230, 223, 235],
  [219, 208, 204, 220],
  [202, 206, 198, 214],
  [202, 206, 198, 206],
  [208, 208, 208, 222],
  [200, 180, 180, 203],
  [172, 148, 148, 173],
  [143, 159, 138, 163],
  [138, 138, 127, 142],
  [127, 106, 100, 127],
  [116, 132, 111, 147],
  [148, 138, 132, 163],
  [143, 143, 132, 147],
  [132, 138, 132, 142],
  [138, 132, 122, 138],
  [122, 132, 116, 137],
  [148, 148, 132, 148],
  [143, 138, 138, 153],
  [127, 122, 116, 137],
  [111, 132, 106, 137],
  [127, 116, 116, 142],
  [122, 132, 116, 142],
  [132, 132, 122, 137],
  [127, 106, 106, 131],
  [95, 106, 95, 115],
  [95, 95, 89, 99],
  [79, 84, 63, 84],
  [84, 89, 73, 89],
  [95, 63, 63, 95],
  [52, 57, 47, 57],
  [84, 100, 79, 126],
  [138, 159, 127, 163],
  [159, 148, 138, 169],
  [159, 180, 159, 180],
  [176, 154, 154, 176],
  [170, 183, 154, 190],
  [191, 187, 178, 199],
];

/** Rows → prices: a row nearer the top is a higher price. */
export const SAHAM_CANDLES: OHLC[] = ROWS.map(([o, c, h, l], k) => ({
  date: `ref${k}`,
  o: REF_H - o,
  c: REF_H - c,
  h: REF_H - h,
  l: REF_H - l,
}));

/** The close-up (Simon's first screenshot) and the whole series. */
export const SAHAM_CLOSE: [number, number] = [4, 40];
export const SAHAM_ALL: [number, number] = [0, SAHAM_CANDLES.length - 1];

/**
 * How much empty space each screenshot leaves above the highest high and
 * below the lowest low, as fractions of its height — measured, not chosen.
 * Close-up: 34px over and 43px under, of 257. Wide: 47 over, 38 under, of 402.
 */
export const FRAME_CLOSE = { top: 34 / 257, bottom: 43 / 257 };
export const FRAME_ALL = { top: 47 / 402, bottom: 38 / 402 };

/** Highest high and lowest low over a window. */
export const rangeOf = ([a, b]: [number, number]) => {
  const s = SAHAM_CANDLES.slice(a, b + 1);
  return { hi: Math.max(...s.map((d) => d.h)), lo: Math.min(...s.map((d) => d.l)) };
};

/**
 * Price → screen row: `hi` lands `top` of the way down the box, `lo` lands
 * `bottom` of the way up from its foot — the way a charting app autofits.
 */
export const sahamScale =
  (box: Box, hi: number, lo: number, frame: { top: number; bottom: number }) => (p: number) =>
    box.y + box.h * (frame.top + (1 - frame.top - frame.bottom) * ((hi - p) / (hi - lo)));

/**
 * ⚠ THE SAME CANDLES, GIVEN A PRICE AXIS — for SC04 and SC05. Simon, at
 * 1981: "sebaiknya continuous aja dari 1980, gunakan candlesticks yang sama
 * aja." Those scenes label prices and dates (SC05 is about the two axes), so
 * the traced series is mapped LINEARLY onto the price band and the trading
 * dates the BMRI placeholder used there. A linear map changes no shape: drawn
 * with the same framing, every candle lands on the same pixel it had in SC03.
 *
 * TODO [NEEDS DATA]: these figures are placeholders exactly as the BMRI
 * series they replace is (see data/bmri.ts) — layout values, not quotes.
 */

export const SAHAM_PRICED: OHLC[] = (() => {
  const [a, b] = WIN.sc03;
  const band = bmriDaily.slice(a, b + 1);
  const pLo = Math.min(...band.map((d) => d.l));
  const pHi = Math.max(...band.map((d) => d.h));
  const { lo, hi } = rangeOf(SAHAM_ALL);
  const toPrice = (v: number) => pLo + ((v - lo) / (hi - lo)) * (pHi - pLo);
  const dates = bmriDaily.slice(bmriDaily.length - SAHAM_CANDLES.length).map((d) => d.date);
  return SAHAM_CANDLES.map((d, k) => ({
    date: dates[k],
    o: toPrice(d.o),
    c: toPrice(d.c),
    h: toPrice(d.h),
    l: toPrice(d.l),
  }));
})();
