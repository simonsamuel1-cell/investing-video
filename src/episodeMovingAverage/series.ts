/**
 * series.ts — the ONE synthetic price generator for the whole episode.
 *
 * Every explainer chart comes out of here, generated at MODULE SCOPE so a
 * series is the same array on every frame and in every scene. A series built
 * inside a component is regenerated per frame and the chart boils.
 *
 * Seeded `mulberry32` only — never `Math.random()`. Renders must be
 * frame-deterministic.
 *
 * These are illustrative by design and the episode never presents them as a
 * market. The one chart that IS a market — GGRM in 12A/12B — comes from
 * `data/ggrm.json` and refuses to draw at all while that file is empty.
 */
import { seeded } from "./helpers";

export type Bar = { o: number; h: number; l: number; c: number };

export type Shape = "drift" | "reversal" | "uptrend" | "downtrend" | "flat";

/**
 * `drift` is the per-bar trend and `noise` scales the per-bar jitter. Scene 02
 * needs the noise HIGH — the whole scene is about a smooth line appearing
 * through it, and a tidy series would prove nothing.
 */
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
  const rnd = seeded(seed);
  const out: number[] = [];
  let p = 5000;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let bias = drift;
    if (shape === "reversal") {
      /* one obvious turn at 60% across — Scene 04 needs a single moment where
         one line can visibly turn before the other */
      bias = t < 0.6 ? 26 : -34;
    } else if (shape === "uptrend") {
      /* a climb with real pullbacks in it, so price can come back down onto a
         rising average and bounce */
      bias = 22 + Math.sin(t * Math.PI * 3.2) * 30;
    } else if (shape === "downtrend") {
      /* the mirror of `uptrend` — a fall with real rallies in it, so price can
         come back UP into a falling average and be turned away */
      bias = -22 - Math.sin(t * Math.PI * 3.2) * 30;
    } else if (shape === "flat") {
      bias = Math.sin(t * Math.PI * 5) * 16;
    }
    p += bias + (rnd() - 0.5) * 2 * 34 * noise;
    out.push(p);
  }
  return out;
};

/**
 * Closes → candles. Each bar opens on the previous close, so a line through the
 * closes lands on the bodies and the two notations describe one series.
 *
 * ═══ WICKS ARE A FRACTION OF THE CHART'S OWN RANGE ═══
 *
 * NEVER an absolute amount. This used to add six to twenty-two units to every
 * bar and multiply one in six of them by up to 4.4 — which is invisible on a
 * chart that runs from 76.000 to 124.000 and grotesque on one that runs from
 * 800 to 1.000. The same function drew both, so the same numbers produced
 * hairlines in one scene and spikes in the next.
 *
 * Sizing the wick off the series' own span makes it scale-free: a candle looks
 * like a candle whatever the instrument is priced at, and no scene has to know
 * what units it is working in.
 */
const WICK = {
  /** Shortest wick, as a fraction of the series' full range. */
  min: 0.003,
  /** Extra length on top of it, at random. */
  vary: 0.009,
  /** How often a bar gets a longer one, and how much longer. Kept modest —
      a spike that dwarfs the bodies stops reading as price and starts reading
      as an error. */
  spike: 0.08,
  stretch: 1.8,
};

export const toBars = (closes: number[], seed: number): Bar[] => {
  const rnd = seeded(seed);
  const span = Math.max(1e-9, Math.max(...closes) - Math.min(...closes));
  const wick = () => (WICK.min + rnd() * WICK.vary) * span * (rnd() < WICK.spike ? WICK.stretch : 1);
  return closes.map((c, i) => {
    const o = i === 0 ? c - (rnd() - 0.5) * span * 0.004 : closes[i - 1];
    return { o, c, h: Math.max(o, c) + wick(), l: Math.min(o, c) - wick() };
  });
};

/** The episode's default series — noisy on purpose. Scenes 01, 02, 03, 07, 13. */
/**
 * The episode's default series. 100 bars, because CANDLES are the default
 * notation and a body needs width: at 140 bars a body is 7px in a 1692px plot.
 */
export const SERIES = makeSeries({ seed: 2024, n: 100, drift: 13, noise: 1.35 });
/** Scene 07 — a rise then a fall, so both crossings are guaranteed to exist. */
export const SERIES_CROSS = makeSeries({ seed: 707, n: 110, shape: "reversal", noise: 0.9 });
/** Scene 04 — one clear turn, so SMA and EMA can disagree about when it happened. */
export const SERIES_REVERSAL = makeSeries({ seed: 77, n: 120, shape: "reversal", noise: 0.75 });
/** Scenes 06, 10, 11 — a climb with pullbacks in it. */
/**
 * The candle scenes get FEWER bars on purpose. At 120 bars a body is 9px in a
 * 1692px plot and the chart reads as a dotted line; at 70 it reads as candles.
 */
export const SERIES_UPTREND = makeSeries({ seed: 91, n: 70, shape: "uptrend", noise: 1.1 });
/** Scene 05 state 3 — no opinion. */
export const SERIES_FLAT = makeSeries({ seed: 55, n: 120, shape: "flat", noise: 0.7 });
/** Scene 05 states 1 and 2 — a clean climb and its mirror. */
export const SERIES_UP = makeSeries({ seed: 31, n: 120, drift: 26, noise: 0.6 });
export const SERIES_DOWN = makeSeries({ seed: 32, n: 70, shape: "downtrend", noise: 1.1 });
/**
 * Scenes 08/09 — volatility itself is what varies here, not direction. Calm,
 * then active, then a long tight stretch, then the release.
 */
export const SERIES_BREATH = (() => {
  const rnd = seeded(808);
  const out: number[] = [];
  let p = 5000;
  for (let i = 0; i < 150; i++) {
    const calm = i < 40 || (i >= 78 && i < 120);
    p += 4 + (rnd() - 0.5) * 2 * (calm ? 12 : 62);
    out.push(p);
  }
  return out;
})();

/**
 * ═══ CANDLES ═══
 *
 * Candlestick is the DEFAULT notation for this episode — a line chart is the
 * exception, used only where the scene is about the shape of an average rather
 * than about price itself. Every series therefore ships its bars alongside it,
 * generated once at module scope from the same closes, so the two notations
 * always describe one series.
 */
export const BARS = toBars(SERIES, 2101);
export const BARS_CROSS = toBars(SERIES_CROSS, 2107);
export const BARS_REVERSAL = toBars(SERIES_REVERSAL, 2104);
export const BARS_UPTREND = toBars(SERIES_UPTREND, 2106);
export const BARS_DOWN = toBars(SERIES_DOWN, 2102);
export const BARS_FLAT = toBars(SERIES_FLAT, 2105);
export const BARS_UP = toBars(SERIES_UP, 2103);
export const BARS_BREATH = toBars(SERIES_BREATH, 2108);

/** The price range a chart must cover to show these bars whole. */
export const domainOf = (bars: Bar[], extra: (number | null)[][] = []): [number, number] => {
  const lows = bars.map((b) => b.l);
  const highs = bars.map((b) => b.h);
  extra.forEach((series) =>
    series.forEach((v) => {
      if (v !== null) {
        lows.push(v);
        highs.push(v);
      }
    }),
  );
  return [Math.min(...lows), Math.max(...highs)];
};
