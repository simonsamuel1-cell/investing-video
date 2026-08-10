/**
 * data/studies.ts — the indicator maths SC02 needs.
 *
 * These are real studies computed on the real series the candles are drawn
 * from. SC02's point is that tools arrive before direction is read, not that
 * tools are noise — drawing decorative squiggles would make the argument
 * dishonestly.
 */
import type { Bar } from "./shape";

export const sma = (bars: Bar[], period: number): (number | null)[] =>
  bars.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = i - period + 1; k <= i; k++) sum += bars[k].c;
    return sum / period;
  });

export const bollinger = (bars: Bar[], period = 20, mult = 2) => {
  const mid = sma(bars, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  bars.forEach((_, i) => {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      return;
    }
    let acc = 0;
    for (let k = i - period + 1; k <= i; k++) acc += (bars[k].c - m) ** 2;
    const sd = Math.sqrt(acc / period);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
  });
  return { mid, upper, lower };
};

/** Wilder's RSI — the first sub-pane that slides up over the price. */
export const rsi = (bars: Bar[], period = 14): (number | null)[] => {
  const out: (number | null)[] = [null];
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < bars.length; i++) {
    const d = bars[i].c - bars[i - 1].c;
    const up = Math.max(0, d);
    const down = Math.max(0, -d);
    if (i <= period) {
      gain += up;
      loss += down;
      out.push(i < period ? null : 100 - 100 / (1 + gain / Math.max(1e-9, loss)));
      continue;
    }
    gain = (gain * (period - 1) + up) / period;
    loss = (loss * (period - 1) + down) / period;
    out.push(100 - 100 / (1 + gain / Math.max(1e-9, loss)));
  }
  return out;
};

/** MACD histogram — the second sub-pane. */
export const macdHistogram = (bars: Bar[], fast = 12, slow = 26, signal = 9): number[] => {
  const ema = (period: number) => {
    const k = 2 / (period + 1);
    let prev = bars[0].c;
    return bars.map((b, i) => (i === 0 ? prev : (prev = b.c * k + prev * (1 - k))));
  };
  const fastLine = ema(fast);
  const slowLine = ema(slow);
  const line = fastLine.map((v, i) => v - slowLine[i]);
  const k = 2 / (signal + 1);
  let prev = line[0];
  const sig = line.map((v, i) => (i === 0 ? prev : (prev = v * k + prev * (1 - k))));
  return line.map((v, i) => v - sig[i]);
};
