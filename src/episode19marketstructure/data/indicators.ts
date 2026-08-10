/**
 * data/indicators.ts — the clutter SC02 piles onto the chart before wiping it
 * away. Every value is COMPUTED from the series it is drawn over; none of these
 * lines is a decorative squiggle.
 */
import type { OHLC } from "./series";

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

/** Wilder's RSI — feeds the sub-pane that slides up in SC02. */
export const rsi = (data: OHLC[], period = 14): (number | null)[] => {
  const out: (number | null)[] = [null];
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < data.length; i++) {
    const d = data[i].c - data[i - 1].c;
    const g = Math.max(0, d);
    const l = Math.max(0, -d);
    if (i <= period) {
      gain += g;
      loss += l;
      out.push(i < period ? null : 100 - 100 / (1 + gain / Math.max(1e-9, loss)));
      continue;
    }
    gain = (gain * (period - 1) + g) / period;
    loss = (loss * (period - 1) + l) / period;
    out.push(100 - 100 / (1 + gain / Math.max(1e-9, loss)));
  }
  return out;
};

/** MACD histogram — the second sub-pane in SC02. */
export const macd = (data: OHLC[], fast = 12, slow = 26, signal = 9) => {
  const ema = (period: number) => {
    const k = 2 / (period + 1);
    let prev = data[0].c;
    return data.map((d, i) => (i === 0 ? prev : (prev = d.c * k + prev * (1 - k))));
  };
  const line = ema(fast).map((v, i) => v - ema(slow)[i]);
  const k = 2 / (signal + 1);
  let prev = line[0];
  const sig = line.map((v, i) => (i === 0 ? prev : (prev = v * k + prev * (1 - k))));
  return { line, signal: sig, hist: line.map((v, i) => v - sig[i]) };
};
