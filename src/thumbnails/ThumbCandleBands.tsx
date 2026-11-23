import type React from "react";
import { theme } from "../core";
import { GlassPane } from "./CutCard";

/**
 * TA07's thumbnail visual: Bollinger Bands round their candles, on a glass card, REDRAWN in the thumbnail's colours. The cut-out
 * still on glass kept its own colours and every candle came out with a pale rim (Simon 20 Nov: "warnanya aneh, ada border ya di
 * setiap candlestick? Hapus deh bordernya") — a still's soft edges cannot be peeled off its paper cleanly, so the chart is drawn.
 *
 * The tape is the video's own at f4650 (2:35), traced from the still: the right 60 percent of its candles ("hapus 40% dari jumlah
 * candles dari kiri"), spread 940 / 564 wider so they fill the same card ("naikin width candlesnya sampe sesuai dengan width
 * kartunya"). x is already spread (0–940); y is the still's own pixel row.
 *
 * A candle: [x, wick top, wick foot, body top, body foot, green?]. BAND_TOP / BAND_FOOT: the band's two edges. AVERAGE: the
 * moving average inside it.
 */
const CANDLES: readonly (readonly [
  number,
  number,
  number,
  number,
  number,
  boolean,
])[] = [
  [7.5, 452, 464, 453, 464, true],
  [30, 419, 452, 429, 450, true],
  [51.7, 414, 446, 428, 446, true],
  [74.2, 416, 447, 417, 429, false],
  [95.8, 428, 461, 431, 446, false],
  [117.5, 427, 464, 436, 452, true],
  [139.2, 430, 454, 434, 447, true],
  [160.8, 423, 449, 431, 449, true],
  [182.5, 411, 433, 412, 430, true],
  [205, 403, 430, 407, 421, false],
  [226.7, 406, 433, 406, 422, false],
  [249.2, 418, 439, 421, 439, true],
  [270.8, 405, 437, 406, 422, false],
  [292.5, 421, 474, 421, 436, false],
  [314.2, 438, 483, 455, 467, false],
  [335.8, 463, 485, 468, 485, true],
  [357.5, 434, 482, 466, 482, true],
  [379.2, 434, 465, 434, 449, true],
  [401.7, 434, 457, 440, 456, true],
  [423.3, 407, 458, 440, 458, true],
  [445.8, 392, 443, 393, 443, true],
  [467.5, 356, 408, 356, 408, true],
  [489.2, 347, 389, 356, 367, true],
  [510.8, 342, 367, 342, 356, false],
  [532.5, 309, 365, 350, 361, false],
  [554.2, 286, 359, 309, 359, true],
  [576.7, 281, 312, 286, 306, true],
  [598.3, 281, 329, 286, 311, false],
  [620, 297, 339, 312, 329, false],
  [642.5, 319, 338, 319, 331, false],
  [664.2, 311, 343, 326, 343, true],
  [685.8, 325, 359, 326, 347, false],
  [707.5, 343, 382, 349, 382, false],
  [729.2, 339, 384, 346, 382, true],
  [750.8, 344, 362, 344, 360, false],
  [773.3, 266, 363, 273, 360, true],
  [795, 269, 297, 269, 281, false],
  [817.5, 256, 295, 281, 295, true],
  [839.2, 279, 344, 281, 339, false],
  [860.8, 303, 347, 307, 339, true],
  [882.5, 299, 322, 306, 320, false],
];
const BAND_TOP: readonly (readonly [number, number])[] = [
  [0, 451],
  [13.3, 439],
  [40, 419],
  [53.3, 410],
  [66.7, 402],
  [80, 396],
  [93.3, 392],
  [106.7, 387],
  [120, 384],
  [133.3, 380],
  [146.7, 378],
  [160, 376],
  [173.3, 373],
  [186.7, 372],
  [200, 372],
  [213.3, 372],
  [226.7, 372],
  [240, 371],
  [253.3, 371],
  [266.7, 371],
  [280, 373],
  [293.3, 375],
  [306.7, 380],
  [320, 385],
  [333.3, 391],
  [346.7, 397],
  [360, 401],
  [373.3, 403],
  [386.7, 404],
  [400, 405],
  [413.3, 405],
  [426.7, 403],
  [453.3, 388],
  [480, 370],
  [493.3, 363],
  [506.7, 358],
  [520, 351],
  [533.3, 343],
  [546.7, 334],
  [560, 317],
  [573.3, 307],
  [586.7, 296],
  [613.3, 284],
  [626.7, 280],
  [640, 277],
  [653.3, 271],
  [666.7, 268],
  [680, 266],
  [693.3, 265],
  [706.7, 265],
  [720, 263],
  [733.3, 263],
  [746.7, 265],
  [760, 261],
  [773.3, 257],
  [786.7, 256],
  [800, 254],
  [813.3, 251],
  [826.7, 253],
  [840, 257],
  [853.3, 262],
  [866.7, 265],
  [880, 266],
];
const BAND_FOOT: readonly (readonly [number, number])[] = [
  [0, 663],
  [13.3, 664],
  [26.7, 664],
  [40, 662],
  [53.3, 659],
  [66.7, 657],
  [80, 654],
  [93.3, 650],
  [106.7, 644],
  [120, 637],
  [133.3, 630],
  [146.7, 622],
  [160, 613],
  [173.3, 605],
  [186.7, 595],
  [200, 585],
  [213.3, 575],
  [226.7, 567],
  [240, 560],
  [253.3, 553],
  [266.7, 545],
  [280, 537],
  [293.3, 528],
  [306.7, 518],
  [320, 509],
  [333.3, 499],
  [346.7, 490],
  [373.3, 477],
  [386.7, 473],
  [400, 471],
  [413.3, 469],
  [426.7, 469],
  [440, 470],
  [453.3, 475],
  [466.7, 481],
  [480, 484],
  [493.3, 487],
  [506.7, 489],
  [520, 490],
  [533.3, 491],
  [546.7, 496],
  [560, 501],
  [573.3, 506],
  [586.7, 506],
  [600, 507],
  [613.3, 507],
  [626.7, 506],
  [640, 505],
  [653.3, 503],
  [666.7, 501],
  [680, 499],
  [693.3, 497],
  [706.7, 495],
  [720, 491],
  [733.3, 486],
  [746.7, 477],
  [760, 470],
  [773.3, 463],
  [786.7, 453],
  [800, 444],
  [813.3, 438],
  [826.7, 429],
  [840, 419],
  [853.3, 407],
  [866.7, 397],
  [880, 391],
];
const AVERAGE: readonly (readonly [number, number])[] = [
  [6.7, 557.3],
  [20, 551.2],
  [33.3, 544.4],
  [46.7, 537.9],
  [60, 533.1],
  [73.3, 530],
  [86.7, 524.5],
  [100, 518.3],
  [113.3, 513],
  [126.7, 508.7],
  [140, 504.3],
  [153.3, 498.5],
  [166.7, 492],
  [180, 485.8],
  [193.3, 481.1],
  [206.7, 477.5],
  [220, 472.1],
  [233.3, 466.7],
  [246.7, 463.7],
  [260, 460.9],
  [273.3, 456.5],
  [286.7, 452.7],
  [300, 450.6],
  [313.3, 448.6],
  [326.7, 446.2],
  [340, 443.6],
  [353.3, 442.8],
  [366.7, 440.5],
  [393.3, 438.5],
  [406.7, 437.5],
  [420, 437.5],
  [433.3, 435.8],
  [460, 430.6],
  [473.3, 429.9],
  [486.7, 427],
  [500, 424.1],
  [513.3, 423],
  [526.7, 420.2],
  [540, 416.1],
  [553.3, 412.4],
  [566.7, 409.7],
  [580, 404.4],
  [593.3, 399.9],
  [606.7, 397.5],
  [620, 395.4],
  [633.3, 392],
  [646.7, 389],
  [660, 387.3],
  [673.3, 384.1],
  [686.7, 381.5],
  [700, 380.8],
  [713.3, 378.3],
  [740, 371.5],
  [753.3, 370.1],
  [766.7, 363.8],
  [780, 356],
  [793.3, 350.7],
  [806.7, 347.2],
  [820, 343.9],
  [833.3, 340.3],
  [846.7, 335],
  [873.3, 329.8],
];

const BOX = { w: 940, y: 216, h: 490 };
const BODY = 15;
const WICK = 4;
const EDGE = 4;
/** the band's inside: dark indigo (theme thumbBandFill) at this strength — it was a pale white wash */
const BAND_FILL = 0.6;
/**
 * Which of the two is dark (Simon 20 Nov). "band": a dark indigo band on the pale glass card. "card": the reverse he asked for
 * next ("kartunya yang dibuat gelap (tapi masih transparan), sedangkan area fill nya yang terang") — smoked glass, a pale band.
 */
const DARK = "card" as "band" | "card" | "none";
/**
 * Whether the band is filled at all. Off since 20 Nov ("coba kalo BB nya gaada area fill"); the pale card that came with that
 * was "jelek" and went back to the smoked one ("warna kartunya balikin"), the fill stayed off.
 */
const BAND_AREA: boolean = false;
/** 0.15 (was 0.2): Simon's "transparansi 15%" for card and band alike; first asked as "transparansi 20%" — in his scale 100 % is solid and 0 % is gone, so it is an OPACITY (20 Nov; I had read it the other way and made the band 80 % solid) */
const BAND_LIGHT = 0.15;
const AVG = { w: 4, dash: "14 10" };
/** the glass card behind the chart: false = the chart alone on the background (Simon 20 Nov: "kalo kartu glassmorph nya di hide, jadi apa?") — one word to bring it back */
const GLASS_CARD: boolean = true;
/** the card is 618 units tall — 504 px on the thumbnail, lesson 1's height (Simon 20 Nov: "jadi setinggi di lesson 1") — and the 490-row trace is stretched to fill it */
const CARD_H = 618;
/** the card blurs the background by 4 px on the thumbnail (Simon 20 Nov: about 20, then 8, then "kalo 4 px doang") — 4.9 in the card's units, which are drawn 766 / 940 as large */
const CARD_BLUR = 4.9;
/** the chart — band, average, candles — sits 50 px lower inside the card than the card's own frame (Simon 20 Nov: "BB dan chart (kecuali kartu) di geser turun 50 px") — 61 units */
const CHART_DROP = 61;
/** the border: light indigo at the top-left corner running to dark indigo at the bottom-right ("kanan bawah indigo gelap, kiri atas indigo terang"), 2 px heavier than the plain rim (Simon 20 Nov: "border kartunya di buat gradasi. Kanan bawah adalah indigo gelap, kanan atas adalah indigo terang. Lalu tebelin border +2 px") — 1.6 px + 2 px on the thumbnail = 4.5 units */
const CARD_RIM = 4.5;
/**
 * The band, its average and the candles fade in from the left (Simon 20 Nov: "ada gradasi transparansi. Paling kiri adalah 0%, dan
 * 100% di candle ke 20") — gone at the card's left edge, solid from the 20th candle on. The card itself does not fade.
 */
const FADE_TO = 20;
const FADE_IN = `linear-gradient(to right, transparent 0%, black ${((CANDLES[FADE_TO - 1][0] / BOX.w) * 100).toFixed(2)}%)`;
export const TA07_BANDS = { w: BOX.w, h: CARD_H } as const;

const line = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");

export const Ta07ThumbCandleBands: React.FC = () => {
  const c = theme.color;
  const area = `${line(BAND_TOP)} ${[...BAND_FOOT]
    .reverse()
    .map(([x, y]) => `L ${x} ${y}`)
    .join(" ")} Z`;
  const chart = (
    <svg
      width={BOX.w}
      height={CARD_H}
      preserveAspectRatio="none"
      viewBox={`0 ${BOX.y} ${BOX.w} ${BOX.h}`}
      style={{ position: "absolute", left: 0, top: CHART_DROP, maskImage: FADE_IN, WebkitMaskImage: FADE_IN }}
    >
      {BAND_AREA ? <path d={area} fill={DARK === "band" ? c.thumbBandFill : c.cardBg} opacity={DARK === "band" ? BAND_FILL : BAND_LIGHT} /> : null}
      <path
        d={line(BAND_TOP)}
        fill="none"
        stroke={c.cyan}
        strokeWidth={EDGE}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={line(BAND_FOOT)}
        fill="none"
        stroke={c.cyan}
        strokeWidth={EDGE}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={line(AVERAGE)}
        fill="none"
        stroke={c.gaugeAmber}
        strokeWidth={AVG.w}
        strokeDasharray={AVG.dash}
        strokeLinecap="round"
      />
      {/* the candles cast the same shadow as the bare candles of lessons 01, 03 and 09 (Simon 20 Nov: "candlesticknya juga kasih shadow") */}
      <g style={{ filter: theme.shape.thumbShadow }}>
      {CANDLES.map(([x, top, foot, bt, bb, up]) => {
        const col = up ? c.thumbCandleUp : c.thumbCandleDown;
        const h = Math.max(bb - bt, WICK);
        return (
          <g key={x}>
            <path
              d={`M ${x} ${top} V ${foot}`}
              stroke={col}
              strokeWidth={WICK}
              strokeLinecap="round"
            />
            <rect
              x={x - BODY / 2}
              y={bt}
              width={BODY}
              height={h}
              rx={Math.min(3, h / 2)}
              fill={col}
            />
          </g>
        );
      })}
      </g>
    </svg>
  );
  return GLASS_CARD ? (
    <GlassPane w={BOX.w} h={CARD_H} dark={DARK === "card"} shadow blur={CARD_BLUR} rim={{ from: c.thumbRimLight, to: c.thumbBandFill, width: CARD_RIM }}>
      {chart}
    </GlassPane>
  ) : (
    <div style={{ position: "relative", width: BOX.w, height: CARD_H }}>
      {chart}
    </div>
  );
};
