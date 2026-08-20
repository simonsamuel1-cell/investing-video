/**
 * series.ts — the ONE synthetic price generator for the whole episode.
 *
 * Every explainer chart comes out of here, generated at MODULE SCOPE so a
 * series is the same array on every frame and in every scene. A series built
 * inside a component is regenerated per frame and the chart boils.
 *
 * Seeded `mulberry32` only. These are illustrative by design and the episode
 * never presents them as a market. The one chart that IS a market — GGRM in
 * 12A/12B — comes from `data/ggrm.json` and refuses to draw while it is empty.
 */
import { mulberry32 } from "./helpers";

export type Bar = { o: number; h: number; l: number; c: number };
export type Shape = "drift" | "reversal" | "uptrend" | "flat";

export const makeSeries = ({
  seed,
  n,
  drift = 0,
  noise = 1,
  shape = "drift",
}: {
  seed: number;
  n: number;
  drift?: number;
  noise?: number;
  shape?: Shape;
}): number[] => {
  const rnd = mulberry32(seed);
  const out: number[] = [];
  let p = 5000;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let bias = drift * 40;
    /* one obvious turn at 60% across — Scene 04 needs a single moment where
       one line can visibly turn before the other */
    if (shape === "reversal") bias = t < 0.6 ? 26 : -34;
    /* a climb with real pullbacks in it, so price can come back down onto a
       rising average and bounce */
    else if (shape === "uptrend") bias = 22 + Math.sin(t * Math.PI * 3.2) * 30;
    else if (shape === "flat") bias = Math.sin(t * Math.PI * 5) * 16;
    p += bias + (rnd() - 0.5) * 2 * 34 * noise;
    out.push(p);
  }
  return out;
};

/**
 * Closes → candles. Each bar opens on the previous close, so a line through the
 * closes lands on the bodies and the two notations describe one series.
 *
 * WICKS ARE A FRACTION OF THE SERIES' OWN RANGE, never an absolute amount:
 * the same numbers draw hairlines on a chart running to 124.000 and spikes on
 * one running to 1.000, and this one function draws both.
 */
const WICK = { min: 0.003, vary: 0.009, spike: 0.08, stretch: 1.8 };

export const toBars = (closes: number[], seed: number): Bar[] => {
  const rnd = mulberry32(seed);
  const span = Math.max(1e-9, Math.max(...closes) - Math.min(...closes));
  const wick = () =>
    (WICK.min + rnd() * WICK.vary) * span * (rnd() < WICK.spike ? WICK.stretch : 1);
  return closes.map((c, i) => {
    const o = i === 0 ? c - (rnd() - 0.5) * span * 0.004 : closes[i - 1];
    return { o, c, h: Math.max(o, c) + wick(), l: Math.min(o, c) - wick() };
  });
};

/* ── the four series, locked ─────────────────────────────────────────────── */

/** Scenes 01, 02, 03, 08, 09, 13 — the default, noisy on purpose. */
export const SERIES = makeSeries({ seed: 2024, n: 140, drift: 0.35, noise: 1.0 });
/** Scene 04 — one clear turn, so SMA and EMA can disagree about when. */
export const SERIES_REVERSAL = makeSeries({ seed: 77, n: 120, shape: "reversal" });
/** Scenes 06, 10, 11 — a climb with pullbacks in it. */
export const SERIES_UPTREND = makeSeries({ seed: 91, n: 120, shape: "uptrend" });
/** Scene 05 state 3 — no opinion. */
export const SERIES_FLAT = makeSeries({ seed: 55, n: 120, shape: "flat" });

export const BARS = toBars(SERIES, 2101);
export const BARS_UPTREND = toBars(SERIES_UPTREND, 2106);

/** The price range a chart must cover to show these whole. */
export const domainOf = (
  values: (number | null)[],
  bars: Bar[] = [],
): [number, number] => {
  const lo: number[] = [];
  const hi: number[] = [];
  values.forEach((v) => {
    if (v !== null) {
      lo.push(v);
      hi.push(v);
    }
  });
  bars.forEach((b) => {
    lo.push(b.l);
    hi.push(b.h);
  });
  return [Math.min(...lo), Math.max(...hi)];
};
