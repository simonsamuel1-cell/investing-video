/**
 * Scene13B — from 8015, duration 418 (13.93s). Morning & Evening Star.
 * Left: two stacked static reference cards — Morning Star (top) and Evening Star
 * (bottom). Right: ONE combined round-trip chart — mid → sell-off → Morning Star
 * → rally → Evening Star → mid. Rings step through each card's candles, then
 * boxes highlight the two star clusters (see PatternPairScene).
 */
import { PatternPairScene } from "../components/PatternPairScene";
import { mulberry32, type OHLC } from "../helpers";

// Reference cards — three candles each. Leftmost body is smaller than the
// rightmost (the reversal candle is the strong one); thicker middle body.
const MORNING_REF: OHLC[] = [
  { open: 1358, high: 1366, low: 1312, close: 1320 }, // small red
  { open: 1304, high: 1316, low: 1276, close: 1284 }, // indecision (thicker body)
  { open: 1300, high: 1400, low: 1294, close: 1392 }, // big green
];
const EVENING_REF: OHLC[] = [
  { open: 1320, high: 1368, low: 1312, close: 1360 }, // small green
  { open: 1380, high: 1414, low: 1374, close: 1402 }, // indecision (thicker body)
  { open: 1392, high: 1400, low: 1300, close: 1308 }, // big red
];

// Combined round-trip: mid → sell-off → Morning Star → rally → Evening Star → mid.
const buildCombined = (): OHLC[] => {
  const rnd = mulberry32(137);
  const out: OHLC[] = [];
  const pad = (o: number, c: number): OHLC => ({
    open: o,
    high: Math.round(Math.max(o, c) + 4 + rnd() * 10),
    low: Math.round(Math.min(o, c) - (4 + rnd() * 10)),
    close: c,
  });
  let prev = 1450;
  // Sell-off from the middle to the low.
  for (let i = 0; i < 6; i++) {
    const drift = 1450 + ((1332 - 1450) * (i + 1)) / 6;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 16);
    out.push(pad(o, c));
    prev = c;
  }
  // Morning Star at the low: big red, thicker indecision, big green.
  out.push({ open: prev, high: prev + 6, low: 1306, close: 1310 });
  out.push({ open: 1306, high: 1316, low: 1284, close: 1288 });
  out.push({ open: 1304, high: 1388, low: 1298, close: 1380 });
  prev = 1380;
  // Rally from the low to the high.
  for (let i = 0; i < 7; i++) {
    const drift = 1380 + ((1544 - 1380) * (i + 1)) / 7;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 16);
    out.push(pad(o, c));
    prev = c;
  }
  // Evening Star at the high: small green, thicker indecision, big red (leftmost < rightmost).
  out.push({ open: prev, high: prev + 54, low: prev - 6, close: prev + 46 });
  out.push({ open: 1600, high: 1646, low: 1594, close: 1624 });
  out.push({ open: 1614, high: 1622, low: 1532, close: 1540 });
  prev = 1540;
  // Fall back to the middle.
  for (let i = 0; i < 5; i++) {
    const drift = 1550 + ((1452 - 1550) * (i + 1)) / 5;
    const o = prev;
    const c = Math.round(drift + (rnd() - 0.5) * 14);
    out.push(pad(o, c));
    prev = c;
  }
  return out;
};

const DEMO = buildCombined();

export const Scene13B = () => (
  <PatternPairScene
    topCandles={MORNING_REF}
    topCaption="Morning Star"
    botCandles={EVENING_REF}
    botCaption="Evening Star"
    data={DEMO}
    boxes={[{ cluster: [6, 8] }, { cluster: [16, 18] }]}
  />
);
