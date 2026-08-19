/**
 * shots.ts — the shape of Simon's five TradingView screenshots, traced.
 *
 * ⚠ READ THIS BEFORE USING THESE ANYWHERE ELSE.
 *
 * These are NOT an export and NOT a record. Each series below is a set of
 * anchor points read OFF the screenshot BY EYE — the turns, the peaks, the
 * gaps and the closing level — and then interpolated. The landmarks are in the
 * right places and the levels are within a few tens of rupiah, but no
 * individual bar is the bar that actually printed.
 *
 * That is why Scene 01 keeps its "Ilustrasi" tag even though its quoted
 * numbers are real: the QUOTES come from the screenshots' own headers and are
 * exact, while the CANDLES are this. Swap in a real OHLC export and the tag
 * comes off — nothing else in the scene has to change.
 *
 * The quoted last price of each series is the one its screenshot's header
 * shows, so the drawn chart and the header cannot disagree about where it
 * closed.
 */
import { seeded } from "../helpers";

/** `[t, price]` with t running 0 → 1 across the chart's own window. */
export type Anchor = [number, number];

/** BBCA · 1D · IDX — Apr → Sep. The June crash and its recovery are the shape. */
export const BBCA_1D: Anchor[] = [
  [0.0, 6900], [0.03, 6800], [0.06, 6450], [0.1, 6800], [0.13, 6700],
  [0.16, 6350], [0.2, 6050], [0.23, 5900], [0.26, 6250], [0.29, 6300],
  [0.32, 6050], [0.35, 5800], [0.37, 5300], [0.39, 4850], [0.41, 5750],
  [0.44, 6200], [0.47, 6500], [0.5, 6300], [0.53, 6100], [0.56, 6250],
  [0.58, 5650], [0.6, 5800], [0.63, 6100], [0.66, 6300], [0.7, 6250],
  [0.73, 6550], [0.76, 6450], [0.79, 6200], [0.82, 6350], [0.85, 6450],
  [0.88, 6300], [0.92, 6250], [0.96, 6350], [1.0, 6325],
];

/** BBRI · 1H — the 17th step up, the 29th trough, the August range. */
export const BBRI_1H: Anchor[] = [
  [0.0, 2850], [0.05, 2870], [0.1, 2840], [0.14, 2870], [0.18, 3040],
  [0.22, 3080], [0.28, 3090], [0.33, 3060], [0.38, 2960], [0.44, 2930],
  [0.48, 2960], [0.52, 3000], [0.57, 2990], [0.62, 3030], [0.66, 3060],
  [0.7, 3120], [0.74, 3160], [0.78, 3100], [0.82, 3080], [0.86, 3110],
  [0.9, 3140], [0.94, 3120], [1.0, 3080],
];

/** TLKM · 1H — two pushes to 2.740/2.780, then back to 2.590. */
export const TLKM_1H: Anchor[] = [
  [0.0, 2530], [0.05, 2560], [0.09, 2510], [0.13, 2540], [0.17, 2660],
  [0.21, 2740], [0.25, 2700], [0.3, 2680], [0.35, 2600], [0.4, 2560],
  [0.45, 2620], [0.5, 2680], [0.55, 2740], [0.58, 2780], [0.62, 2720],
  [0.66, 2740], [0.7, 2700], [0.75, 2640], [0.8, 2600], [0.85, 2590],
  [0.9, 2620], [0.95, 2630], [1.0, 2590],
];

/** ASII · 1H — the 22nd spike, then a long slide into 4.770. */
export const ASII_1H: Anchor[] = [
  [0.0, 4830], [0.05, 4900], [0.1, 4880], [0.14, 5150], [0.18, 5130],
  [0.22, 5250], [0.26, 5100], [0.31, 4980], [0.36, 5010], [0.4, 4930],
  [0.45, 5150], [0.5, 5080], [0.55, 5100], [0.58, 5150], [0.62, 5100],
  [0.66, 5120], [0.7, 5000], [0.75, 4900], [0.8, 4850], [0.85, 4800],
  [0.9, 4790], [0.95, 4780], [1.0, 4770],
];

/** BMRI · 1H — the 17th jump to 4.480, the 24th drop, a flat August. */
export const BMRI_1H: Anchor[] = [
  [0.0, 4100], [0.04, 4180], [0.08, 4120], [0.12, 4460], [0.17, 4480],
  [0.22, 4470], [0.26, 4440], [0.3, 4340], [0.34, 4150], [0.38, 4120],
  [0.42, 4090], [0.46, 4130], [0.5, 4180], [0.54, 4230], [0.58, 4270],
  [0.62, 4230], [0.66, 4200], [0.7, 4130], [0.74, 4110], [0.78, 4130],
  [0.82, 4200], [0.86, 4180], [0.92, 4160], [1.0, 4150],
];

/**
 * Anchors → a series of `n` closes.
 *
 * Straight lines between anchors would read as a polyline, so a little seeded
 * jitter is added — enough to look like a tape, small enough that it cannot
 * move a level. The LAST value is forced back onto the final anchor, because
 * that one is the screenshot's quoted close and has to be exact.
 */
export const fromAnchors = (anchors: Anchor[], n: number, seed: number, jitter = 0.004): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let k = 0;
    while (k < anchors.length - 2 && anchors[k + 1][0] < t) k++;
    const [t0, v0] = anchors[k];
    const [t1, v1] = anchors[k + 1];
    const span = Math.max(1e-9, t1 - t0);
    const p = Math.max(0, Math.min(1, (t - t0) / span));
    /* smoothstep, so a turn is a turn and not a corner */
    const e = p * p * (3 - 2 * p);
    const base = v0 + (v1 - v0) * e;
    out.push(base * (1 + (rnd() - 0.5) * 2 * jitter));
  }
  out[out.length - 1] = anchors[anchors.length - 1][1];
  return out;
};
