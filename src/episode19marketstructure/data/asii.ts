/**
 * data/asii.ts — the ONE real security in the episode (SC18).
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [NEEDS DATA] EVERY CANDLE BELOW IS A PLACEHOLDER.                        │
 * │                                                                          │
 * │ Required: ASII daily OHLC, Jan 2025 – Aug 2026 (TradingView export, ISO  │
 * │ dates, ADJ active). Drop it in and delete the generator.                 │
 * │                                                                          │
 * │ The narration states four figures as fact, so the CSV has to be checked  │
 * │ against all four before this scene can ship:                             │
 * │   1. an early-2025 sideways range of roughly 4.400 – 5.000               │
 * │   2. a mid-2025 break above that range                                   │
 * │   3. a peak near 7.300 in early 2026                                     │
 * │   4. a failed retest of 7.300, then a decline back toward 4.400          │
 * │ If the real data disagrees with any of them, the SCRIPT LINE needs        │
 * │ Simon's revision — the chart must not be bent to fit the words.          │
 * │                                                                          │
 * │ The placeholder is shaped to those four claims purely so the layout,     │
 * │ the marker timing and the countdown can be reviewed. It is NOT ASII.     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
import { mulberry32 } from "../helpers";
import type { OHLC } from "./series";

/** Anchor path: [bar index, close]. Straight lines between, noise on top. */
const PATH = [
  [0, 4600],
  [20, 4460],
  [40, 4950],
  [60, 4430],
  [80, 4980],
  [95, 4560], // ← early-2025 range holds: 4.400 – 5.000
  [110, 5010],
  [126, 5450], // ← break above the range
  [140, 5200], // HL
  [160, 5900], // HH
  [176, 5600], // HL
  [196, 6400], // HH
  [212, 6100], // HL
  [236, 6950], // HH
  [252, 6600], // HL
  [268, 7300], // ← the peak, early 2026
  [286, 6900], // HL
  [306, 7150], // ← the push that fails: below 7.300
  [330, 6480], // ← lower low, under the 6.900 trough
  [350, 6820], // LH
  [372, 5700],
  [386, 5920],
  [404, 4820],
  [418, 4430], // ← back into the 4.400 area
] as const;

const alongPath = (i: number) => {
  if (i <= PATH[0][0]) return PATH[0][1];
  for (let k = 1; k < PATH.length; k++) {
    const [xa, ya] = PATH[k - 1];
    const [xb, yb] = PATH[k];
    if (i <= xb) return ya + ((yb - ya) * (i - xa)) / Math.max(1, xb - xa);
  }
  return PATH[PATH.length - 1][1];
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Weekday-only dates from 2025-01-02 — placeholder holidays are not modelled. */
const tradingDate = (bar: number) => {
  const d = new Date(Date.UTC(2025, 0, 2));
  let left = bar;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) left--;
  }
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
};

const BARS = PATH[PATH.length - 1][0] + 1;

export const asiiDaily: OHLC[] = (() => {
  const rnd = mulberry32(2025);
  const out: OHLC[] = [];
  for (let i = 0; i < BARS; i++) {
    const drift = (rnd() - 0.5) * 90;
    const c = alongPath(i) + drift;
    const o = i === 0 ? c - 20 : out[i - 1].c;
    const wick = 25 + rnd() * 65;
    out.push({
      date: tradingDate(i),
      o: Math.round(o),
      c: Math.round(c),
      h: Math.round(Math.max(o, c) + wick),
      l: Math.round(Math.min(o, c) - wick),
    });
  }
  return out;
})();

/**
 * The bars the narration points at. Scenes reference these names, never raw
 * indices — when the real CSV lands, only this block is re-derived.
 */
export const ASII = {
  rangeLow: 4400,
  rangeHigh: 5000,
  peak: 7300,
  /** Bar index of each moment the script calls out. */
  rangeEnd: 100,
  breakout: 118,
  peakBar: 268,
  priorLow: 286,
  lowerHigh: 306,
  lowerLow: 330,
  lastBar: BARS - 1,
};

/** Round gridlines spanning the whole move, 4.500 → 7.500. */
export const ASII_TICKS = [4500, 5500, 6500, 7500];
