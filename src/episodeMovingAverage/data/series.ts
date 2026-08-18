/**
 * series.ts — the synthetic price series the explainer scenes are drawn on.
 *
 * SYNTHETIC BY DESIGN, and only ever used where the episode is teaching a
 * mechanic rather than reporting a market. The one place real prices are
 * claimed — GGRM in Scenes 12A/12B — loads them from `ggrm.json` and refuses to
 * draw anything if that file is empty. See data/ggrm.ts.
 *
 * Every generator is seeded with `mulberry32` and generated at MODULE SCOPE, so
 * a series is the same array on every frame and every render. A series built
 * inside a component would be regenerated per frame and the chart would boil.
 */
import { seeded } from "../helpers";

export type Bar = { o: number; h: number; l: number; c: number; v: number };

/**
 * A random walk with a drift and a controllable amount of local noise.
 *
 * `noise` is what the moving-average scenes are ABOUT — it has to be high
 * enough that the raw line is genuinely hard to read, or smoothing it proves
 * nothing. `swing` adds slow multi-day waves on top, so the series has turns a
 * moving average can lag behind rather than pure jitter.
 */
export const walk = ({
  n,
  from,
  drift = 0,
  noise = 0.012,
  swing = 0,
  swingLen = 24,
  seed,
}: {
  n: number;
  from: number;
  drift?: number;
  noise?: number;
  swing?: number;
  swingLen?: number;
  seed: number;
}): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  let p = from;
  for (let i = 0; i < n; i++) {
    const wave = swing === 0 ? 0 : Math.sin((i / swingLen) * Math.PI * 2) * swing;
    p = p * (1 + drift + (rnd() - 0.5) * 2 * noise);
    out.push(p * (1 + wave));
  }
  return out;
};

/**
 * Closes → candles. Each bar opens on the previous close, so the series is one
 * series told two ways and a line drawn through the closes lands on the bodies.
 */
export const toBars = (closes: number[], seed: number): Bar[] => {
  const rnd = seeded(seed);
  const out: Bar[] = [];
  for (let i = 0; i < closes.length; i++) {
    const c = closes[i];
    const o = i === 0 ? c * (1 - (rnd() - 0.5) * 0.01) : closes[i - 1];
    /** One bar in six pushes a long wick — a real series is not uniform. */
    const stretch = rnd() < 0.16 ? 2.4 + rnd() * 2 : 1;
    const up = c * (0.002 + rnd() * 0.006) * stretch;
    const dn = c * (0.002 + rnd() * 0.006) * (rnd() < 0.16 ? 2.4 + rnd() * 2 : 1);
    out.push({
      o,
      c,
      h: Math.max(o, c) + up,
      l: Math.min(o, c) - dn,
      v: Math.round((0.6 + rnd()) * 1_000_000),
    });
  }
  return out;
};

/** Scene 02/03's series: 120 closes, up-drift, deliberately noisy. */
export const EXPLAINER = walk({ n: 120, from: 4200, drift: 0.0032, noise: 0.016, seed: 2024 });

/** Scene 04's series — SHARED by both cards, so SMA and EMA are compared fairly. */
export const WEIGHTS = walk({ n: 70, from: 5000, drift: 0.001, noise: 0.014, swing: 0.02, swingLen: 26, seed: 404 });

/** Scene 05's three readings: a climb, a fall, and a series with no opinion. */
export const RISING = walk({ n: 70, from: 4000, drift: 0.006, noise: 0.008, seed: 511 });
export const FALLING = walk({ n: 70, from: 6200, drift: -0.006, noise: 0.008, seed: 512 });
export const FLAT = walk({ n: 70, from: 5000, drift: 0, noise: 0.006, swing: 0.012, swingLen: 14, seed: 513 });

/** Scene 06: an uptrend that keeps coming back to the line, and its mirror. */
export const PULLBACKS = walk({ n: 90, from: 4200, drift: 0.005, noise: 0.007, swing: 0.022, swingLen: 26, seed: 601 });
export const REJECTIONS = walk({ n: 90, from: 6400, drift: -0.005, noise: 0.007, swing: 0.022, swingLen: 26, seed: 602 });

/** Scene 07: has to cross once up and once down, so it needs a full cycle. */
export const CROSSES = walk({ n: 200, from: 4600, drift: 0.0015, noise: 0.009, swing: 0.055, swingLen: 96, seed: 707 });

/** Scenes 08/09: calm, then active, then calm again — the bands' whole point. */
export const BREATHING = (() => {
  const rnd = seeded(808);
  const out: number[] = [];
  let p = 5000;
  for (let i = 0; i < 170; i++) {
    /** Volatility itself is what varies here, not the direction. */
    const calm = i < 45 || (i >= 95 && i < 135);
    const noise = calm ? 0.004 : 0.019;
    p = p * (1 + 0.0012 + (rnd() - 0.5) * 2 * noise);
    out.push(p);
  }
  return out;
})();

/** Scene 10: a strong trend that keeps its closes hard against the upper band. */
export const RIDING = (() => {
  const rnd = seeded(1010);
  const out: number[] = [];
  let p = 4400;
  for (let i = 0; i < 90; i++) {
    /** Positive-skewed noise: the drift does the work, the dips stay shallow. */
    p = p * (1 + 0.0075 + (rnd() - 0.35) * 0.012);
    out.push(p);
  }
  return out;
})();

/** Scene 13: the leader. The follower is this series' own moving average. */
export const LEADER = walk({ n: 110, from: 4800, drift: 0.002, noise: 0.01, swing: 0.03, swingLen: 40, seed: 1313 });
