/**
 * data/asii.ts — SC18's series. The ONE real instrument in the episode.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [NEEDS DATA] — EVERY BAR BELOW IS A PLACEHOLDER, NOT ASII.               │
 * │                                                                          │
 * │ Required: ASII daily OHLC, Jan 2025 – Aug 2026. TradingView export, ISO  │
 * │ dates, ADJ active. It drops straight into `ASII_BARS` — the scene is     │
 * │ written against the `Bar` interface and needs no other change.           │
 * │                                                                          │
 * │ The narration states four things as fact. All four have to be checked    │
 * │ against the real file before this scene ships:                           │
 * │   1. an early-2025 sideways range of roughly 4.400 – 5.000               │
 * │   2. a mid-2025 break above that range                                    │
 * │   3. a peak near 7.300 in early 2026                                      │
 * │   4. a failed retest of 7.300, then a decline back toward 4.400          │
 * │                                                                          │
 * │ If the data disagrees with any of them, STOP and raise it. The script    │
 * │ line is what gets revised — the chart is never bent to fit the words.    │
 * │                                                                          │
 * │ Do not delete this block until the CSV is in.                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
import { seeded } from "../helpers";
import type { Bar } from "./shape";

/**
 * The placeholder's skeleton: [bar index, close]. It is shaped to the four
 * claims above ONLY so the layout, the marker timing and the countdown can be
 * reviewed before the real file lands.
 */
const SKELETON: readonly (readonly [number, number])[] = [
  [0, 4600],
  [20, 4460],
  [40, 4950],
  [60, 4430],
  [80, 4980],
  [95, 4560], // the early-2025 range holds
  [110, 5010],
  [126, 5450], // the break above it
  [140, 5200],
  [160, 5900],
  [176, 5600],
  [196, 6400],
  [212, 6100],
  [236, 6950],
  [252, 6600],
  [268, 7300], // the peak, early 2026
  [286, 6900],
  [306, 7150], // the push that fails: short of 7.300
  [330, 6480], // the lower low, under the 6.900 trough
  [350, 6820],
  [372, 5700],
  [386, 5920],
  [404, 4820],
  [418, 4430], // back into the 4.400 area
] as const;

const alongSkeleton = (i: number) => {
  if (i <= SKELETON[0][0]) return SKELETON[0][1];
  for (let k = 1; k < SKELETON.length; k++) {
    const [xa, ya] = SKELETON[k - 1];
    const [xb, yb] = SKELETON[k];
    if (i <= xb) return ya + ((yb - ya) * (i - xa)) / Math.max(1, xb - xa);
  }
  return SKELETON[SKELETON.length - 1][1];
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Weekdays from 2025-01-02. Holidays are not modelled in the placeholder. */
const tradingDay = (bar: number) => {
  const d = new Date(Date.UTC(2025, 0, 2));
  let left = bar;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) left--;
  }
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
};

const COUNT = SKELETON[SKELETON.length - 1][0] + 1;

export const ASII_BARS: Bar[] = (() => {
  const rnd = seeded(2025);
  const out: Bar[] = [];
  for (let i = 0; i < COUNT; i++) {
    const close = alongSkeleton(i) + (rnd() - 0.5) * 90;
    const open = i === 0 ? close - 20 : out[i - 1].c;
    const wick = 25 + rnd() * 65;
    out.push({
      date: tradingDay(i),
      o: Math.round(open),
      c: Math.round(close),
      h: Math.round(Math.max(open, close) + wick),
      l: Math.round(Math.min(open, close) - wick),
    });
  }
  return out;
})();

/**
 * The bars the narration points at. Scenes use these names, never raw indices,
 * so swapping in the real CSV means re-deriving this block and nothing else.
 */
export const ASII = {
  ticker: "ASII · 1D",
  rangeLow: 4400,
  rangeHigh: 5000,
  peakPrice: 7300,
  rangeEndBar: 100,
  breakoutBar: 118,
  peakBar: 268,
  priorLowBar: 286,
  lowerHighBar: 306,
  lowerLowBar: 330,
  returnBar: 360,
  lastBar: COUNT - 1,
  /** The swings marked on the way up. */
  climb: [
    { bar: 160, peak: true },
    { bar: 176, peak: false },
    { bar: 196, peak: true },
    { bar: 212, peak: false },
    { bar: 236, peak: true },
    { bar: 252, peak: false },
  ],
} as const;

/** Round gridlines spanning the whole move. */
export const ASII_TICKS = [4500, 5500, 6500, 7500];
