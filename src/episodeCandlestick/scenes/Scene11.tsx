/**
 * Scene11 — Shooting Star case study (bearish). From frame 6057.
 * Uses the shared CaseStudyScene choreography (the "Hammer" design): the
 * shooting-star session plays, the long UPPER wick is measured + recolored red,
 * then the view collapses and a crowded uptrend ContextStrip opens beside the
 * shrunk candle panel — the star docks at resistance under "Sellers taking
 * control".
 */
import { CaseStudyScene } from "../components/CaseStudyScene";
import type { CaseStudyConfig } from "../components/CaseStudyScene";
import { theme } from "../theme";
import { mulberry32 } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

// Intraday shooting-star path → open 1252, high 1436, low 1244, close 1258
const STAR_PATH: SessionPoint[] = [
  { t: 0, price: 1252 },
  { t: 0.05, price: 1244 },
  { t: 0.16, price: 1298 },
  { t: 0.3, price: 1362 },
  { t: 0.45, price: 1436 },
  { t: 0.56, price: 1392 },
  { t: 0.72, price: 1330 },
  { t: 0.88, price: 1281 },
  { t: 1, price: 1258 },
];

// Dense uptrend context (crowded, 20px gaps) rising into resistance.
const CONTEXT_DATA: OHLC[] = (() => {
  const rnd = mulberry32(22);
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
  return out;
})();

const config: CaseStudyConfig = {
  path: STAR_PATH,
  pingT: 0.45, // ping at the high-of-day
  wickStroke: theme.colors.cyan,
  lateWickStroke: theme.colors.candleRed,
  highlight: { topPrice: 1436, lowPrice: 1258, label: "Long wick" }, // long UPPER wick
  contextData: CONTEXT_DATA,
  refLine: { price: 1416, label: "Resistance", position: "above" },
  dockCandles: [{ open: 1406, high: 1424, low: 1400, close: 1402 }], // star at resistance
  dockLabel: ["Sellers taking", "control"],
  T: {
    header: 0.0,
    svIn: 1.2,
    playFrom: 2.2,
    playDur: 6.0,
    close: 8.6,
    wickHi: 15.633,
    wickHiDraw: 0.6,
    collapse: 21.433,
    collapseDur: 0.6,
    ctxLine: 22.5,
    dock: 23.2,
    dockDur: 0.8,
    label: 25.533,
  },
};

export const Scene11 = () => <CaseStudyScene config={config} />;
