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
       rising average and bounce */ else if (shape === "uptrend")
      bias = 22 + Math.sin(t * Math.PI * 3.2) * 30;
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
/**
 * ═══ ⚠ NO DOJI, ANYWHERE ═══
 *
 * Opening on the previous close means a quiet bar has a body of almost nothing,
 * and a quiet stretch fills the tape with hairlines. Simon: "banyak candlestick
 * yang bodynya tipis (doji), harusnya tidak sama sekali."
 *
 * So a body is opened out to at least this fraction of the series' range — the
 * same correction the traced Bollinger tape got in `data/shots.ts`, and it
 * holds the same line: the OPEN moves and the CLOSE never does. Every average,
 * every crossing, every level this episode points at is computed from closes,
 * so none of them can shift. What does move is each bar's high or low, by
 * however far its own body grew past them.
 *
 * As a fraction of the range, 0.023–0.043 is about 12–22px on a full-height
 * chart. Spread rather than clamped flat, because bodies all the same size
 * read as a bar chart.
 */
const BODY = { min: 0.023, vary: 0.02 };

export const toBars = (
  closes: number[],
  seed: number,
  /**
   * Multiplies the wick lengths, for a tape whose bars are meant to read as
   * CHUNKY rather than fine. Defaults to 1, so every existing chart is
   * untouched: a global change here would re-draw the whole episode.
   */
  wickScale = 1,
): Bar[] => {
  const rnd = mulberry32(seed);
  /* A SECOND, INDEPENDENT STREAM for the body minimum. Taking it from `rnd`
     would advance that stream by one call per bar and redraw every wick in the
     episode — a chart-wide change to fix a body-height problem. */
  const body = mulberry32(seed ^ 0x9e3779b9);
  const span = Math.max(1e-9, Math.max(...closes) - Math.min(...closes));
  const wick = () =>
    (WICK.min + rnd() * WICK.vary) *
    span *
    wickScale *
    (rnd() < WICK.spike ? WICK.stretch : 1);
  return closes.map((c, i) => {
    const prev = i === 0 ? c - (rnd() - 0.5) * span * 0.004 : closes[i - 1];
    const want = (BODY.min + body() * BODY.vary) * span;
    /* the direction is whatever the move was; only its SIZE has a floor */
    const o =
      Math.abs(c - prev) >= want ? prev : c >= prev ? c - want : c + want;
    return { o, c, h: Math.max(o, c) + wick(), l: Math.min(o, c) - wick() };
  });
};

/* ── the four series, locked ─────────────────────────────────────────────── */

/** Scenes 01, 02, 03, 08, 09, 13 — the default, noisy on purpose. */
export const SERIES = makeSeries({
  seed: 2024,
  n: 140,
  drift: 0.35,
  noise: 1.0,
});
/** Scene 04 — one clear turn, so SMA and EMA can disagree about when. */
export const SERIES_REVERSAL = makeSeries({
  seed: 77,
  n: 120,
  shape: "reversal",
});
/** Scenes 06, 10, 11 — a climb with pullbacks in it. */
export const SERIES_UPTREND = makeSeries({
  seed: 91,
  n: 120,
  shape: "uptrend",
});
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
