import { theme } from "../core";

/**
 * TA03's thumbnail visual: six candlestick patterns standing bare on the background — no card, no tiles, no names (Simon 20 Nov:
 * "terapkan warna dan shadow pada lesson 03. Kartu dan backgroundnya di remove, textnya juga"). The same six the cut-out showed
 * (the video's wall at 2:27, top-left 3 × 2): Hammer, Doji, Shooting Star / Evening Star, Bullish Engulfing, Harami — redrawn,
 * because a still cannot give up its tile and its label. Colours and shadow are TA01's (thumbCandleUp / thumbCandleDown,
 * theme.shape.thumbShadow).
 *
 * A pattern is a list of candles on a 0–100 price scale (o, h, l, c); green when it closes above its open.
 */
type Bar = { o: number; h: number; l: number; c: number };
const PATTERNS: readonly (readonly Bar[])[] = [
  // Hammer: a small body at the top, a long lower wick
  [{ o: 78, c: 92, h: 95, l: 14 }],
  // Doji: open = close, wicks both ways
  [{ o: 58, c: 59, h: 94, l: 16 }],
  // Shooting Star: a small body at the foot, a long upper wick
  [{ o: 10, c: 24, h: 94, l: 7 }],
  // Evening Star: a long green, a small star above it, a long red
  [
    { o: 18, c: 62, h: 67, l: 12 },
    // the star sits 40 px lower on the thumbnail than first drawn (Simon 20 Nov: 10 px, then 30 more): 40 px = 14.7 on this scale
    { o: 63.3, c: 73.3, h: 80.3, l: 58.3 },
    // the red one 7 px higher (Simon 20 Nov): 7 px = 2.6 on this scale
    { o: 72.6, c: 26.6, h: 77.6, l: 20.6 },
  ],
  // Bullish Engulfing: a small red, swallowed by the green after it
  [
    { o: 66, c: 36, h: 73, l: 29 },
    { o: 26, c: 86, h: 94, l: 18 },
  ],
  // Harami: a long red, a small green inside its body
  [
    { o: 88, c: 16, h: 95, l: 9 },
    { o: 42, c: 58, h: 65, l: 35 },
  ],
];

const COLS = 3;
const CELL = { w: 240, h: 300, gap: 40 };
/** pitch 57 = a 46-unit body + 11 units, which is the 10 px between two candles Simon asked for (20 Nov; it was 18 px) */
const CANDLE = { body: 46, pitch: 57, wick: 9, r: 8 };
const ROWS = Math.ceil(PATTERNS.length / COLS);
export const TA03_PATTERNS = { w: COLS * CELL.w + (COLS - 1) * CELL.gap, h: ROWS * CELL.h + (ROWS - 1) * CELL.gap } as const;

export const Ta03ThumbCandlePatterns = () => {
  const c = theme.color;
  return (
    <svg width={TA03_PATTERNS.w} height={TA03_PATTERNS.h} viewBox={`0 0 ${TA03_PATTERNS.w} ${TA03_PATTERNS.h}`} style={{ display: "block", overflow: "visible", filter: theme.shape.thumbShadow }}>
      {PATTERNS.map((bars, i) => {
        const x0 = (i % COLS) * (CELL.w + CELL.gap) + CELL.w / 2 - ((bars.length - 1) * CANDLE.pitch) / 2;
        const y0 = Math.floor(i / COLS) * (CELL.h + CELL.gap);
        const y = (p: number) => y0 + ((100 - p) / 100) * CELL.h;
        return (
          <g key={i}>
            {bars.map((b, j) => {
              const x = x0 + j * CANDLE.pitch;
              const col = b.c >= b.o ? c.thumbCandleUp : c.thumbCandleDown;
              const top = y(Math.max(b.o, b.c)),
                h = Math.max(y(Math.min(b.o, b.c)) - top, CANDLE.wick);
              return (
                <g key={j}>
                  <path d={`M ${x} ${y(b.h)} V ${y(b.l)}`} stroke={col} strokeWidth={CANDLE.wick} strokeLinecap="round" />
                  <rect x={x - CANDLE.body / 2} y={top} width={CANDLE.body} height={h} rx={Math.min(CANDLE.r, h / 2)} fill={col} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};
