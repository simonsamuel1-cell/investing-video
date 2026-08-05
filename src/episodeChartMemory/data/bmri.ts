/**
 * data/bmri.ts — BMRI price series + derived indicators.
 *
 * TODO [NEEDS DATA]: replace ALL placeholder series with real BMRI CSVs when supplied:
 *  - bmriDaily:   daily OHLC, longest available history (min ~1yr; more preferred for SC10)
 *  - bmri5m:      one full session of 5-minute OHLC (SC06, SC07)
 *  - bmriWeekly:  weekly OHLC (derive from bmriDaily once real data lands)
 * Placeholders below are seeded (mulberry32) and shaped like plausible BMRI ranges
 * so layouts/motion are reviewable. They are NOT real data — the render is not
 * final until the CSVs replace them.
 */
import { mulberry32 } from "../helpers";

export type OHLC = { date: string; o: number; h: number; l: number; c: number };

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Deterministic date string N calendar days after 2024-01-02 (weekends skipped by caller). */
const dateAt = (dayOffset: number) => {
  const dt = new Date(Date.UTC(2024, 0, 2) + dayOffset * 86400000);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
};

/** Linear interpolation across an anchor path of [index, price] waypoints. */
const alongPath = (waypoints: readonly (readonly [number, number])[], i: number) => {
  if (i <= waypoints[0][0]) return waypoints[0][1];
  for (let k = 1; k < waypoints.length; k++) {
    const [xa, ya] = waypoints[k - 1];
    const [xb, yb] = waypoints[k];
    if (i <= xb) return ya + ((yb - ya) * (i - xa)) / Math.max(1, xb - xa);
  }
  return waypoints[waypoints.length - 1][1];
};

// ─── DAILY (placeholder) ────────────────────────────────────────────────────
// Anchor path engineered so the series carries genuine structure the scenes
// reference: a price area revisited three times (SC08) and clear swing pivots
// for the SC01 trendlines.
const DAILY_PATH = [
  [0, 4200], [18, 4340], [38, 4190], [60, 4460], [82, 4330],
  [105, 4620], [128, 4480], [152, 4780], [175, 4640], [196, 4900],
  [214, 4740], [240, 4980],
  [267, 4575], // ← zone touch 1
  [279, 4860],
  [291, 4585], // ← zone touch 2
  [297, 4790],
  [303, 4580], // ← zone touch 3
  [319, 5260],
] as const;

const DAILY_COUNT = 320;

const buildDaily = (): OHLC[] => {
  const rnd = mulberry32(20260731);
  const out: OHLC[] = [];
  let prevClose: number = DAILY_PATH[0][1];
  let dayOffset = 0;
  for (let i = 0; i < DAILY_COUNT; i++) {
    // skip weekends so dates read like real sessions
    let dow = new Date(Date.UTC(2024, 0, 2) + dayOffset * 86400000).getUTCDay();
    while (dow === 0 || dow === 6) {
      dayOffset += 1;
      dow = new Date(Date.UTC(2024, 0, 2) + dayOffset * 86400000).getUTCDay();
    }
    const target = alongPath(DAILY_PATH, i);
    const noise = (rnd() - 0.5) * 46;
    const c = Math.round((target + noise) / 5) * 5;
    const o = Math.round((prevClose + (rnd() - 0.5) * 24) / 5) * 5;
    const hi = Math.max(o, c) + Math.round((6 + rnd() * 34) / 5) * 5;
    const lo = Math.min(o, c) - Math.round((6 + rnd() * 34) / 5) * 5;
    out.push({ date: dateAt(dayOffset), o, h: hi, l: lo, c });
    prevClose = c;
    dayOffset += 1;
  }
  return out;
};

export const bmriDaily: OHLC[] = buildDaily();

// ─── 5-MINUTE (placeholder) — one session, 78 bars ──────────────────────────
const build5m = (): OHLC[] => {
  const rnd = mulberry32(5150731);
  const out: OHLC[] = [];
  const base = bmriDaily[bmriDaily.length - 1].c;
  // intraday shape: open drift, midday chop, late push — jittery on purpose
  const PATH = [
    [0, base - 60], [10, base - 10], [18, base - 70], [26, base - 30],
    [34, base - 90], [42, base - 40], [52, base + 10], [60, base - 20],
    [70, base + 50], [77, base + 30],
  ] as const;
  let prev = PATH[0][1];
  for (let i = 0; i < 78; i++) {
    const target = alongPath(PATH, i);
    const c = Math.round((target + (rnd() - 0.5) * 34) / 5) * 5;
    const o = prev;
    const hi = Math.max(o, c) + Math.round((2 + rnd() * 16) / 5) * 5;
    const lo = Math.min(o, c) - Math.round((2 + rnd() * 16) / 5) * 5;
    const mins = 9 * 60 + i * 5;
    out.push({ date: `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`, o, h: hi, l: lo, c });
    prev = c;
  }
  return out;
};

export const bmri5m: OHLC[] = build5m();

// ─── WEEKLY — derived from daily (5 sessions → 1 candle) ────────────────────
const toWeekly = (daily: OHLC[]): OHLC[] => {
  const out: OHLC[] = [];
  for (let i = 0; i < daily.length; i += 5) {
    const grp = daily.slice(i, i + 5);
    if (!grp.length) break;
    out.push({
      date: grp[0].date,
      o: grp[0].o,
      h: Math.max(...grp.map((d) => d.h)),
      l: Math.min(...grp.map((d) => d.l)),
      c: grp[grp.length - 1].c,
    });
  }
  return out;
};

export const bmriWeekly: OHLC[] = toWeekly(bmriDaily);

// ─── Windows the scenes reference ───────────────────────────────────────────
export const WIN = {
  sc01: [DAILY_COUNT - 60, DAILY_COUNT - 1] as [number, number], // ~60 sessions
  sc03: [DAILY_COUNT - 70, DAILY_COUNT - 1] as [number, number],
  // Holds all three zone touches; the SC08 playhead reveals them on their beats.
  sc08: [DAILY_COUNT - 95, DAILY_COUNT - 1] as [number, number],
  sc10Tight: [DAILY_COUNT - 20, DAILY_COUNT - 1] as [number, number],
  sc10Wide: [0, DAILY_COUNT - 1] as [number, number],
};

/**
 * The revisited price area used by SC08. Derived from the anchor path lows, so
 * it sits on genuine touches in the series rather than being drawn arbitrarily.
 * TODO [NEEDS DATA: confirm zone from BMRI daily CSV; widen window rather than
 * force a band]
 */
export const ZONE = { lo: 4530, hi: 4640 };

/** Indices in bmriDaily where price returned to the zone (the three touches). */
export const ZONE_TOUCH_IDX: number[] = [267, 291, 303];

// ─── Indicators (computed from the daily series — never arbitrary squiggles) ─
export const sma = (data: OHLC[], period: number): (number | null)[] =>
  data.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = i - period + 1; k <= i; k++) sum += data[k].c;
    return sum / period;
  });

export const bollinger = (data: OHLC[], period = 20, mult = 2) => {
  const mid = sma(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  data.forEach((_, i) => {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      return;
    }
    let acc = 0;
    for (let k = i - period + 1; k <= i; k++) acc += (data[k].c - m) ** 2;
    const sd = Math.sqrt(acc / period);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
  });
  return { mid, upper, lower };
};

export const rsi = (data: OHLC[], period = 14): (number | null)[] => {
  const out: (number | null)[] = [null];
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < data.length; i++) {
    const ch = data[i].c - data[i - 1].c;
    const g = Math.max(0, ch);
    const l = Math.max(0, -ch);
    if (i <= period) {
      gain += g;
      loss += l;
      out.push(i === period ? 100 - 100 / (1 + gain / period / Math.max(1e-6, loss / period)) : null);
    } else {
      gain = (gain * (period - 1) + g) / period;
      loss = (loss * (period - 1) + l) / period;
      out.push(100 - 100 / (1 + gain / Math.max(1e-6, loss)));
    }
  }
  return out;
};

const ema = (values: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0];
  values.forEach((v, i) => {
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
};

export const macd = (data: OHLC[], fast = 12, slow = 26, signal = 9) => {
  const closes = data.map((d) => d.c);
  const ef = ema(closes, fast);
  const es = ema(closes, slow);
  const line = ef.map((v, i) => v - es[i]);
  const sig = ema(line, signal);
  const hist = line.map((v, i) => v - sig[i]);
  return { line, signal: sig, hist };
};
