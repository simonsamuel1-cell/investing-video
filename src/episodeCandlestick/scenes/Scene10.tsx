/**
 * Scene10 — Bullish Engulfing case study. From frame 5079.
 * Uses the shared CaseStudyScene choreography (the "Hammer" design): a two-day
 * session forms the engulfing pair (red day 1, green day 2), then the view
 * collapses and a crowded downtrend ContextStrip opens beside the shrunk candle
 * panel — the pair docks at support under "Buyers taking control".
 */
import { CaseStudyScene } from "../components/CaseStudyScene";
import type { CaseStudyConfig } from "../components/CaseStudyScene";
import { mulberry32 } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

const DAY1_PATH: SessionPoint[] = [
  { t: 0, price: 1386 },
  { t: 0.1, price: 1394 },
  { t: 0.3, price: 1362 },
  { t: 0.55, price: 1334 },
  { t: 0.8, price: 1312 },
  { t: 0.9, price: 1298 },
  { t: 1, price: 1306 },
];

const DAY2_PATH: SessionPoint[] = [
  { t: 0, price: 1288 },
  { t: 0.08, price: 1281 },
  { t: 0.2, price: 1304 },
  { t: 0.4, price: 1338 },
  { t: 0.6, price: 1366 },
  { t: 0.8, price: 1390 },
  { t: 0.94, price: 1412 },
  { t: 1, price: 1402 },
];

// Dense downtrend context (crowded, 20px gaps) falling into support.
const CONTEXT_DATA: OHLC[] = (() => {
  const rnd = mulberry32(21);
  const out: OHLC[] = [];
  const N = 18;
  let prev = 1600;
  for (let i = 0; i < N; i++) {
    const drift = 1600 + ((1300 - 1600) * i) / (N - 1);
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 22);
    const high = Math.round(Math.max(open, close) + 4 + rnd() * 12);
    const low = Math.round(Math.min(open, close) - (4 + rnd() * 12));
    out.push({ open, high, low, close });
    prev = close;
  }
  return out;
})();

const config: CaseStudyConfig = {
  path: DAY1_PATH,
  day2Path: DAY2_PATH,
  contextData: CONTEXT_DATA,
  refLine: { price: 1284, label: "Support", position: "below" },
  dockCandles: [
    { open: 1330, high: 1336, low: 1292, close: 1298 }, // red day 1
    { open: 1294, high: 1352, low: 1286, close: 1346 }, // green day 2 engulfs it
  ],
  dockLabel: ["Buyers taking", "control"],
  T: {
    header: 0.0,
    svIn: 1.2,
    day1From: 1.2,
    day1Dur: 3.2,
    reset: 6.5,
    day2From: 6.5,
    day2Dur: 4.5,
    close: 11.0,
    collapse: 21.433,
    collapseDur: 0.6,
    ctxLine: 22.5,
    dock: 23.2,
    dockDur: 0.8,
    label: 25.533,
  },
};

export const Scene10 = () => <CaseStudyScene config={config} />;
