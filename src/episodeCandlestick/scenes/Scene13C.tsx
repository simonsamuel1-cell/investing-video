/**
 * Scene13C — from 8433, duration 401 (13.37s). Three Soldiers & Three Crows.
 * Mirrors Scene13B's layout (two stacked static reference cards) but the right
 * chart replicates a realistic price path (à la the reference screenshot) with
 * exactly one Three White Soldiers (reversal off the low) and one Three Black
 * Crows (reversal off the high): decline → Soldiers → rally → Crows → drift.
 * No left-card rings; boxes still highlight the two clusters. The candle build
 * finishes at frame 8591 (scene-local 158).
 */
import { PatternPairScene } from "../components/PatternPairScene";
import { mulberry32, type OHLC } from "../helpers";

// Reference cards — three candles each.
const SOLDIERS_REF: OHLC[] = [
  { open: 1240, high: 1312, low: 1234, close: 1304 },
  { open: 1268, high: 1372, low: 1262, close: 1364 },
  { open: 1330, high: 1436, low: 1324, close: 1428 },
];
const CROWS_REF: OHLC[] = [
  { open: 1436, high: 1442, low: 1364, close: 1372 },
  { open: 1408, high: 1414, low: 1304, close: 1312 },
  { open: 1346, high: 1352, low: 1240, close: 1248 },
];

// Realistic path: decline → Three White Soldiers (low) → rally → Three Black
// Crows (high) → small drift down.
const buildCombined = (): OHLC[] => {
  const rnd = mulberry32(151);
  const out: OHLC[] = [];
  const pad = (o: number, c: number): OHLC => ({
    open: o,
    high: Math.round(Math.max(o, c) + 3 + rnd() * 12),
    low: Math.round(Math.min(o, c) - (3 + rnd() * 12)),
    close: c,
  });
  let prev = 1548;
  // Decline from a high to a low (choppy, bearish bias).
  for (let i = 0; i < 8; i++) {
    const drift = 1548 + ((1444 - 1548) * (i + 1)) / 8;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 26);
    out.push(pad(o, c));
    prev = c;
  }
  // Three White Soldiers (reversal at the low): each opens inside the prior body.
  out.push({ open: prev, high: 1508, low: prev - 6, close: 1500 });
  out.push({ open: 1476, high: 1552, low: 1470, close: 1544 });
  out.push({ open: 1520, high: 1588, low: 1514, close: 1580 });
  prev = 1580;
  // Rally to a high (choppy, bullish bias).
  for (let i = 0; i < 8; i++) {
    const drift = 1580 + ((1664 - 1580) * (i + 1)) / 8;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 24);
    out.push(pad(o, c));
    prev = c;
  }
  // Three Black Crows (reversal at the high): each opens inside the prior body.
  out.push({ open: prev, high: prev + 8, low: 1592, close: 1600 });
  out.push({ open: 1632, high: 1638, low: 1552, close: 1560 });
  out.push({ open: 1592, high: 1598, low: 1516, close: 1524 });
  prev = 1524;
  // Small drift down to finish.
  for (let i = 0; i < 4; i++) {
    const drift = 1524 + ((1508 - 1524) * (i + 1)) / 4;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 18);
    out.push(pad(o, c));
    prev = c;
  }
  return out;
};

const DEMO = buildCombined();

// Build must finish at frame 8591 (scene-local 158). DemoChart buildDur = 10.
const CHART_FINISH = 158;
const BUILD_FROM = 10;
const BUILD_STAGGER = (CHART_FINISH - 10 - BUILD_FROM) / (DEMO.length - 1);

export const Scene13C = () => (
  <PatternPairScene
    topCandles={SOLDIERS_REF}
    topCaption="Three White Soldiers"
    botCandles={CROWS_REF}
    botCaption="Three Black Crows"
    data={DEMO}
    boxes={[
      { cluster: [8, 10], from: 160, arrow: "up" }, // Three White Soldiers — bullish (8593)
      { cluster: [19, 21], from: 258, arrow: "down" }, // Three Black Crows — bearish (8691)
    ]}
    showRings={false}
    buildFrom={BUILD_FROM}
    buildStagger={BUILD_STAGGER}
  />
);
