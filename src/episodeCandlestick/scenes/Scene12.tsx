/**
 * Scene12 — Bearish Engulfing case study. From frame 6926.
 * Uses the shared CaseStudyScene choreography (the "Hammer" design): a two-day
 * session forms the engulfing pair (green day 1, red day 2), then the view
 * collapses and a crowded uptrend ContextStrip opens beside the shrunk candle
 * panel — the pair docks at resistance under "Sellers taking control".
 */
import { CaseStudyScene } from "../components/CaseStudyScene";
import type { CaseStudyConfig } from "../components/CaseStudyScene";
import { mulberry32 } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

const DAY1_PATH: SessionPoint[] = [
  { t: 0, price: 1296 },
  { t: 0.1, price: 1288 },
  { t: 0.3, price: 1322 },
  { t: 0.55, price: 1352 },
  { t: 0.8, price: 1376 },
  { t: 0.92, price: 1392 },
  { t: 1, price: 1384 },
];

const DAY2_PATH: SessionPoint[] = [
  { t: 0, price: 1402 },
  { t: 0.06, price: 1410 },
  { t: 0.2, price: 1378 },
  { t: 0.4, price: 1344 },
  { t: 0.6, price: 1312 },
  { t: 0.8, price: 1288 },
  { t: 0.9, price: 1272 },
  { t: 1, price: 1281 },
];

// Dense uptrend context (crowded, 20px gaps) rising into resistance.
const CONTEXT_DATA: OHLC[] = (() => {
  const rnd = mulberry32(23);
  const out: OHLC[] = [];
  const N = 18;
  let prev = 1100;
  for (let i = 0; i < N; i++) {
    const drift = 1100 + ((1400 - 1100) * i) / (N - 1);
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 22);
    const high = Math.round(Math.max(open, close) + 4 + rnd() * 12);
    const low = Math.round(Math.min(open, close) - (4 + rnd() * 12));
    out.push({ open, high, low, close });
    prev = close;
  }
  // Erase the 1 trend candle just left of the engulfing; the inline dock then
  // shifts left to sit against the shortened uptrend.
  return out.slice(0, 17);
})();

const config: CaseStudyConfig = {
  path: DAY1_PATH,
  day2Path: DAY2_PATH,
  contextData: CONTEXT_DATA,
  refLine: { price: 1416, label: "Resistance", position: "above" },
  dockCandles: [
    { open: 1372, high: 1408, low: 1366, close: 1404 }, // green day 1
    { open: 1410, high: 1416, low: 1364, close: 1370 }, // red day 2 engulfs it
  ],
  dockLabel: ["Sellers taking", "control"],
  T: {
    header: 0.0,
    svIn: 1.2,
    day1From: 1.2,
    day1Dur: 3.0,
    reset: 5.8,
    day2From: 5.8,
    day2Dur: 4.2,
    close: 10.0,
    collapse: 21.433,
    collapseDur: 0.6,
    ctxLine: 22.5,
    dock: 23.2,
    dockDur: 0.8,
    label: 25.533,
  },
};

export const Scene12 = () => <CaseStudyScene config={config} />;
