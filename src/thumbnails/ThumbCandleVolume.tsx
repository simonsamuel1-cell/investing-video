import { theme } from "../core";

/**
 * TA09's thumbnail visual: the candles over their volume bars, bare on the background in TA01's colours and shadow — no white
 * cards, no words (Simon 20 Nov: "terapkan warna dan shadow lagi ke lesson 09. Remove kartu putih dan text"). The tape is the
 * video's own at f4846 (1:21), TRACED from the still pixel by pixel rather than invented: every number below is a y in that
 * still (1920 × 1080), so the shape is the video's — the flat stretch, then the rally on the one tall volume bar.
 *
 * A candle: [wick top, wick foot, body top, body foot, green?]. Volume: the bar's top; every bar stands on VOL_BASE and takes
 * its candle's colour, as in the video. In the still the candles are 22.1 px apart from x 525.5.
 */
const CANDLES: readonly (readonly [number, number, number, number, boolean])[] = [
  [444, 521, 453, 506, true],
  [441, 460, 444, 453, true],
  [418, 446, 428, 443, true],
  [417, 436, 428, 433, false],
  [424, 439, 432, 433, true],
  [426, 433, 429, 431, true],
  [414, 429, 416, 428, true],
  [411, 434, 416, 430, false],
  [426, 453, 431, 448, false],
  [399, 454, 410, 448, true],
  [390, 412, 401, 410, true],
  [398, 427, 401, 419, false],
  [415, 422, 418, 419, true],
  [399, 421, 405, 417, true],
  [399, 424, 405, 416, false],
  [405, 425, 409, 416, true],
  [371, 415, 381, 408, true],
  [313, 388, 322, 379, true],
  [288, 331, 303, 321, true],
  [295, 309, 303, 304, false],
  [280, 306, 284, 304, true],
  [234, 285, 274, 283, true],
];
const VOLUME: readonly number[] = [685, 694, 694, 699, 697, 708, 705, 699, 699, 691, 694, 699, 707, 703, 698, 699, 689, 664, 670, 696, 695, 608];
const X0 = 525.5;
/** drawn 24.6 apart, not the still's 22.1: the visual is stretched sideways to fill the whole 766 px area (Simon 20 Nov: "width visualnya di panjangin lagi, anchor kanan") */
const PITCH = 24.6;
const VOL_BASE = 727;
/** without the two cards between them, the volume moves up to sit under the candles — 44, then 50 more ("deketin jarak antara keseluruhan candlesticks dengan keseluruhan volume") */
const VOL_LIFT = 94;
const BODY = 17;
const WICK = 3;
const PAD = 10;
const TOP = Math.min(...CANDLES.map((c) => c[0]));
const BOX = { x: X0 - BODY / 2 - PAD, y: TOP - PAD, w: (CANDLES.length - 1) * PITCH + BODY + 2 * PAD, h: VOL_BASE - VOL_LIFT - TOP + 2 * PAD };
export const TA09_VOLUME = { w: BOX.w, h: BOX.h } as const;

export const Ta09ThumbCandleVolume = () => {
  const c = theme.color;
  return (
    <svg width={BOX.w} height={BOX.h} viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} style={{ display: "block", overflow: "visible", filter: theme.shape.thumbShadow }}>
      {CANDLES.map(([top, foot, bt, bb, up], i) => {
        const x = X0 + i * PITCH;
        // candles and volume share one pair of colours (white / light-grey candles were tried and cancelled, Simon 20 Nov)
        const col = up ? c.thumbCandleUp : c.thumbCandleDown;
        const price = col;
        const h = Math.max(bb - bt, WICK);
        const vTop = VOLUME[i] - VOL_LIFT;
        return (
          <g key={i}>
            <path d={`M ${x} ${top} V ${foot}`} stroke={price} strokeWidth={WICK} strokeLinecap="round" />
            <rect x={x - BODY / 2} y={bt} width={BODY} height={h} rx={Math.min(3, h / 2)} fill={price} />
            <rect x={x - BODY / 2} y={vTop} width={BODY} height={VOL_BASE - VOL_LIFT - vTop} rx={3} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};
