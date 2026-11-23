import { seeded, theme } from "../core";

/**
 * TA01's thumbnail card: the "Pasar punya ingatan." chart of the video at 3:22, redrawn rather than cut from the still
 * (Simon 20 Nov: "chartnya dibuat lebih volatil dong, jangan lurus doang, lalu hapus Pembeli Masuk"). Same card, same price
 * scale, same zone touched three times — but the tape between the turns swings, with counter-candles and long wicks.
 * Everything is in the card's own units (the still's pixels: 1726 × 810); the thumbnail scales the whole card.
 * A generated tape, as the video's is: it names no stock and carries no source.
 */
export const TA01_CARD = { w: 1726, h: 810, r: 24 } as const;

/**
 * `words` = the headline, the prices and "pembeli masuk". Simon took them off (20 Nov: "Judul di chart hapus, pricenya juga
 * remove"), then put them back on both versions the same day; the bare card stays as a lever. Bare, the plot runs margin to
 * margin; with words it stops short of the price column, as in the video.
 */
const PLOT_BARE = { x0: 103, x1: 1623 };
const PLOT_WORDS = { x0: 103, x1: 1603, labelX: 1622 };
/** "pembeli masuk": the video's capsule under the first touch, on a short stem */
const BUYERS = { w: 302, h: 66, top: 660, stemTop: 628, size: 36, weight: 600 };
/** the four gridlines of the video's card, and the prices they carry */
const GRID = [
  { p: 5.186, y: 171 },
  { p: 4.997, y: 297 },
  { p: 4.808, y: 425 },
  { p: 4.619, y: 553 },
] as const;
const yOf = (p: number) => GRID[3].y - ((p - GRID[3].p) / (GRID[0].p - GRID[3].p)) * (GRID[3].y - GRID[0].y);
const ZONE = { top: 4.64, bottom: 4.53 };
/** the turns of the tape: [candle, close]; the three lows are the three touches of the zone */
const TURNS: readonly (readonly [number, number])[] = [
  [0, 4.84], [4, 4.96], [7, 4.87], [11, 5.0], [14, 4.9], [17, 4.78], [19, 4.85], [23, 4.6],
  [26, 4.78], [28, 4.7], [32, 4.95], [35, 4.84], [37, 4.9], [41, 4.59],
  [44, 4.8], [46, 4.72], [49, 4.9], [51, 4.78], [54, 4.58],
  [57, 4.84], [59, 4.76], [62, 5.02], [64, 4.94], [67, 5.24],
];
const TOUCH = [23, 41, 54];
const N = TURNS[TURNS.length - 1][0] + 1;

type Bar = { o: number; h: number; l: number; c: number };
const BARS: Bar[] = (() => {
  const rnd = seeded(101);
  const close: number[] = [];
  for (let k = 0; k < TURNS.length - 1; k++) {
    const [i0, p0] = TURNS[k],
      [i1, p1] = TURNS[k + 1];
    for (let i = i0; i < i1; i++) {
      const t = (i - i0) / (i1 - i0);
      // between two turns the close walks the line, shaken; a turn itself is exact
      close[i] = p0 + (p1 - p0) * t + (i === i0 ? 0 : (rnd() - 0.5) * 0.07);
    }
  }
  close[N - 1] = TURNS[TURNS.length - 1][1];
  return close.map((c, i) => {
    const o = i === 0 ? c - 0.03 : close[i - 1];
    const up = 0.012 + rnd() * 0.05,
      dn = 0.012 + rnd() * 0.05;
    const touch = TOUCH.includes(i);
    return { o, c, h: Math.max(o, c) + up, l: touch ? c - 0.035 : Math.max(Math.min(o, c) - dn, ZONE.top + 0.012) };
  });
})();

export const Ta01ThumbCandleChart = ({ words = false }: { words?: boolean }) => {
  const c = theme.color;
  const PLOT = words ? PLOT_WORDS : PLOT_BARE;
  const buyersX = PLOT.x0 + (TOUCH[0] + 0.5) * ((PLOT.x1 - PLOT.x0) / N);
  const pitch = (PLOT.x1 - PLOT.x0) / N;
  const bw = pitch * 0.58;
  return (
    <svg width={TA01_CARD.w} height={TA01_CARD.h} viewBox={`0 0 ${TA01_CARD.w} ${TA01_CARD.h}`} style={{ display: "block" }}>
      <rect width={TA01_CARD.w} height={TA01_CARD.h} rx={TA01_CARD.r} fill={c.cardBg} />
      {words ? (
        <text x={PLOT.x0} y={98} fontFamily={theme.text.family} fontSize={theme.text.title.size} fontWeight={theme.text.title.weight} fill={c.ink}>
          Pasar punya ingatan.
        </text>
      ) : null}
      {GRID.map((g) => (
        <g key={g.p}>
          <path d={`M ${PLOT.x0} ${g.y} H ${PLOT.x1}`} stroke={c.muted} strokeWidth={1} />
          {words ? (
            <text x={PLOT_WORDS.labelX} y={g.y + 9} fontFamily={theme.text.family} fontSize={theme.text.axis.size} fontWeight={theme.text.axis.weight} fill={c.ink}>
              {g.p.toFixed(3)}
            </text>
          ) : null}
        </g>
      ))}
      <rect x={PLOT.x0} y={yOf(ZONE.top)} width={PLOT.x1 - PLOT.x0} height={yOf(ZONE.bottom) - yOf(ZONE.top)} fill={c.indigoSoft} stroke={c.indigoTint2} strokeWidth={2} />
      {BARS.map((b, i) => {
        const x = PLOT.x0 + (i + 0.5) * pitch;
        const col = b.c >= b.o ? c.candleGreen : c.candleRed;
        const top = yOf(Math.max(b.o, b.c)),
          h = Math.max(yOf(Math.min(b.o, b.c)) - top, 4);
        return (
          <g key={i}>
            <path d={`M ${x} ${yOf(b.h)} V ${yOf(b.l)}`} stroke={col} strokeWidth={2.5} strokeLinecap="round" />
            <rect x={x - bw / 2} y={top} width={bw} height={h} rx={3} fill={col} />
          </g>
        );
      })}
      {TOUCH.map((i) => (
        <circle key={i} cx={PLOT.x0 + (i + 0.5) * pitch} cy={yOf(BARS[i].l) + 12} r={7} fill={c.cyan} />
      ))}
      {words ? (
        <g>
          <path d={`M ${buyersX} ${BUYERS.stemTop} V ${BUYERS.top}`} stroke={c.indigoTint2} strokeWidth={2} />
          <rect x={buyersX - BUYERS.w / 2} y={BUYERS.top} width={BUYERS.w} height={BUYERS.h} rx={BUYERS.h / 2} fill={c.indigo} />
          <text x={buyersX} y={BUYERS.top + BUYERS.h / 2 + BUYERS.size * 0.34} textAnchor="middle" fontFamily={theme.text.family} fontSize={BUYERS.size} fontWeight={BUYERS.weight} fill={c.cardBg}>
            pembeli masuk
          </text>
        </g>
      ) : null}
    </svg>
  );
};

/** the card with its words — what both TA01 thumbnails show */
export const Ta01ThumbCandleChartWords = () => <Ta01ThumbCandleChart words />;

/**
 * The candles alone (Simon 20 Nov: "candlesticknya aja tanpa background, tanpa text, tanpa area support, tanpa garis") — no card,
 * no words, no zone, no gridlines, no touch dots: the same tape, standing on the thumbnail's background. Its box is the tape's own
 * extent, so the visual area is filled by candles and nothing else.
 */
/**
 * 20 Nov, second pass: "hapus 20 candlesticks dari kiri lalu width candlestick sisanya di tebelin"; third pass: "hapus lagi 20,
 * lalu tebelin lagi width sisanya, dan naikin height keseluruhan chart nya. Lalu warnanya adjust lagi biar kontras terhadap
 * background". So: the first 40 candles go and the 28 left share the width (pitch 22 → 54 units), each body 70 % of its pitch
 * with a heavier wick; the tape gets its own price scale, BARE_H tall, instead of the card's; and the candles take
 * the theme's thumbnail pair (thumbCandleUp / thumbCandleDown), lighter than any palette's, because both palette pairs sink into the indigo.
 */
const BARE_SKIP = 40;
const BARE_BODY = 0.7;
const BARE_WICK = 6;
/** 939 units: with the 1520-unit width drawn 816 px wide, that is 504 px — the 766 × 454 visual grown 50 px to the left and 50 px in height (Simon 20 Nov, lesson 01 only) */
const BARE_H = 939;
const BARE_PAD = 8;
/** the candles cast a soft shadow (theme.shape.thumbShadow) — a white glow was tried and dropped the same minute (Simon 20 Nov: "jangan glow, tapi kasih shadow") */
const BARE_BARS = BARS.slice(BARE_SKIP);
const BARE_W = PLOT_BARE.x1 - PLOT_BARE.x0;
const BARE_HI = Math.max(...BARE_BARS.map((b) => b.h));
const BARE_LO = Math.min(...BARE_BARS.map((b) => b.l));
const bareY = (p: number) => BARE_PAD + ((BARE_HI - p) / (BARE_HI - BARE_LO)) * (BARE_H - 2 * BARE_PAD);
export const TA01_CANDLES = { w: BARE_W, h: BARE_H } as const;

export const Ta01ThumbCandlesOnly = () => {
  const c = theme.color;
  const pitch = BARE_W / BARE_BARS.length;
  const bw = pitch * BARE_BODY;
  return (
    <svg width={BARE_W} height={BARE_H} viewBox={`0 0 ${BARE_W} ${BARE_H}`} style={{ display: "block", overflow: "visible", filter: theme.shape.thumbShadow }}>
      {BARE_BARS.map((b, i) => {
        const x = (i + 0.5) * pitch;
        const col = b.c >= b.o ? c.thumbCandleUp : c.thumbCandleDown;
        const top = bareY(Math.max(b.o, b.c)),
          h = Math.max(bareY(Math.min(b.o, b.c)) - top, 8);
        return (
          <g key={i}>
            <path d={`M ${x} ${bareY(b.h)} V ${bareY(b.l)}`} stroke={col} strokeWidth={BARE_WICK} strokeLinecap="round" />
            <rect x={x - bw / 2} y={top} width={bw} height={h} rx={6} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};
