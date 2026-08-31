/**
 * data/series.ts — every tape this episode draws, generated ONCE at MODULE
 * SCOPE.
 *
 * ⚠ A SERIES BUILT INSIDE A COMPONENT IS REGENERATED EVERY FRAME AND THE CHART
 * BOILS. And Remotion renders frames in parallel processes, so Math.random()
 * would make two renders of the same frame differ — `seeded` is the only
 * randomness anywhere in here.
 *
 * ⚠ ALL OF IT IS ILLUSTRATIVE. Each Series carries `kind: "synthetic"`, so
 * <SourceTag kind={s.kind} /> prints "Ilustrasi" without a scene having to
 * remember. Swap a constructor for `fromOHLC` and the tag comes off by itself —
 * the only way it is allowed to come off.
 *
 * ═══ THE LEVELS ARE FOUND, NOT PLACED ═══
 *
 * MAIN is a drift, and its resistance is SEARCHED FOR in the closes rather
 * than chosen and then drawn over them. If the seed changes, the level moves
 * with the data instead of the chart quietly disagreeing with the line on it.
 * The search and its constraints are written down below, and the result is
 * asserted at the bottom of the file.
 */
import {
  fromShape, volumeOf, domainOf, seeded, type Series, type Bar,
} from "../../../core";

/* ══ 1. MAIN — SC01, SC02, SC11, SC12, SC13 ═══════════════════════════════
 *
 * ONE tape carried across five scenes and three chapters. SC11's narration is
 * "kita kembali ke breakout tadi", so it had better be the same chart — and it
 * is: one constant, one domain, imported everywhere.
 */
/* ══ CHART1 — SC01 opening, TRACED from Simon's Chart1.png ════════════════
 *
 * ⚠ REAL OHLC READ OFF THE IMAGE, not regenerated. Each of the 125 candles is
 * its own body and wicks, traced pixel-for-pixel from public/art/chart1.png by
 * scripts/trace-chart1 — so it can be ANIMATED (drawn candle by candle) instead
 * of shown as a flat picture, which is the whole reason it was traced.
 *
 * ⚠ ILLUSTRATIVE — kind "traced", so <SourceTag> prints "Ilustrasi". The
 * SHAPE is real (it is that image's shape) but no bar is a bar that printed on
 * a market, and there is no price axis in the source, so the values are pixel
 * heights, not rupiah. A `fromOHLC` swap with a real export drops the tag.
 */
import CHART1_BARS from "./chart1.json";
export const CHART1: Series = {
  closes: (CHART1_BARS as Bar[]).map((x) => x.c),
  bars: CHART1_BARS as Bar[],
  kind: "traced",
  label: "Chart 1",
};
export const CHART1_DOMAIN = domainOf(CHART1.closes, CHART1.bars);

/**
 * ⚠ THE RESISTANCE Simon asks for is PLACED, not found — Chart1.png has no
 * price axis, so there is no data to search. It sits just under the tape's
 * right-side tops (the levels it kept "mentok" against) as a band the new
 * candle then blows through. Pixel-price units, like the rest of this series.
 */
export const CHART1_RES = { hi: 384, lo: 358 };
/**
 * ⚠ THE BREAKOUT CANDLE — a 126th bar, green, that closes far above the
 * resistance. Added only after the zoom, at Simon's step 5. Its `open` is the
 * last traced close, so it grows straight out of the tape rather than floating.
 */
export const CHART1_BREAK: Bar = { o: CHART1.closes[CHART1.closes.length - 1], c: 425, h: 438, l: 339 };
export const CHART1_ALL: Bar[] = [...CHART1.bars, CHART1_BREAK];
/** The domain must already hold the breakout, or its wick clips the plot top. */
export const CHART1_DOMAIN2 = domainOf(CHART1_ALL.map((b) => b.c), CHART1_ALL);

export const MAIN: Series = fromShape({
  seed: 2024, n: 120, shape: "drift", drift: 0.35, label: "Breakout",
});

/**
 * RESISTANCE — the highest close in the first 70% of the tape, which is the
 * plainest reading of "a level that held price down repeatedly". The breakout
 * is then the FIRST bar after it that closes above it.
 *
 * ⚠ SEARCHED, WITH THE CONSTRAINT WRITTEN DOWN: only the first 70% may set the
 * level, because a level defined over the whole tape would include the
 * breakout itself and could never be broken.
 */
const LOOKBACK = Math.floor(MAIN.closes.length * 0.7);
export const RESISTANCE = Math.max(...MAIN.closes.slice(0, LOOKBACK));
export const BREAK_AT = MAIN.closes.findIndex((c, i) => i > LOOKBACK && c > RESISTANCE);
/** The three highest approaches before the break — the "berkali-kali menahan". */
export const TESTS = MAIN.closes
  .slice(0, LOOKBACK)
  .map((c, i) => ({ i, c }))
  .sort((a, b) => b.c - a.c)
  /* spread them out: a "test" three bars from another is the same test */
  .reduce<number[]>((keep, p) => {
    if (keep.every((k) => Math.abs(k - p.i) > 8) && keep.length < 3) keep.push(p.i);
    return keep;
  }, [])
  .sort((a, b) => a - b);

/**
 * ⚠ TWO VOLUME READINGS, ONE PRICE SERIES. This is the episode's thesis made
 * literal — "dua breakout yang kelihatannya sama bisa punya kekuatan yang
 * sangat berbeda". SC02 shows them side by side and SC12/SC13 are the same
 * candle read twice. Nothing about the price differs between them, and the
 * viewer can SEE that, because it is the same tape.
 */
const MAIN_VOL = volumeOf(MAIN.bars, 0x2024);
const lift = (v: number[], marks: Record<number, number>) =>
  v.map((x, i) => x * (marks[i] ?? 1));
/** The breakout arrives on far more activity than the tape has been running. */
export const VOL_HIGH = lift(MAIN_VOL, { [BREAK_AT]: 3.1, [BREAK_AT + 1]: 2.2, [BREAK_AT + 2]: 1.7 });
/** The identical breakout on ordinary activity — weaker confirmation, and NOT
 *  a failed breakout. That distinction is the whole of SC13. */
export const VOL_AVG = lift(MAIN_VOL, { [BREAK_AT]: 1.05, [BREAK_AT + 1]: 0.95, [BREAK_AT + 2]: 1.02 });

export const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const MAIN_DOMAIN = domainOf(MAIN.closes, MAIN.bars);

/* ══ 2. PAIR — SC03: one candle and one volume bar ════════════════════════ */
export const PAIR: Series = fromShape({ seed: 88, n: 40, label: "1 candle = 1 volume bar" });
export const PAIR_VOL = volumeOf(PAIR.bars, 0x88);
/** The bar SC03 singles out — mid-tape, so it has neighbours on both sides. */
export const PAIR_AT = 24;

/* ══ 3. STOCK A / STOCK B — SC05: the same 10 juta, two histories ═════════
 *
 * ⚠ THE VOLUME FIGURES ARE THE SCENE. They are read out and compared, so they
 * are written here rather than generated: both stocks trade 10 today, and only
 * the history says whether that is remarkable.
 *
 * ⚠ AND THE TWO HISTOGRAMS MUST SHARE A Y-SCALE. Left to itself each
 * normalises to its own peak and both draw an identical tallest bar — which
 * would make this scene argue the exact opposite of its narration. `VOL_PEAK`
 * is passed to both.
 */
export const STOCK_A: Series = fromShape({ seed: 31, n: 5, start: 4200, label: "Saham A" });
export const STOCK_B: Series = fromShape({ seed: 32, n: 5, start: 4200, label: "Saham B" });
export const VOL_A = [2, 3, 2, 4, 10];
export const VOL_B = [12, 9, 14, 11, 10];
export const VOL_PEAK = Math.max(...VOL_A, ...VOL_B);
export const TODAY = 4;
export const AVG_A = mean(VOL_A.slice(0, TODAY));
export const AVG_B = mean(VOL_B.slice(0, TODAY));

/* ══ 4. UP / DOWN — SC07–SC10, SC14, SC16, SC17 ══════════════════════════ */
export const UP: Series = fromShape({ shape: "uptrend", seed: 91, n: 60, start: 4000, label: "Harga naik" });
export const DOWN: Series = fromShape({ shape: "downtrend", seed: 12, n: 60, start: 4800, label: "Harga turun" });

/**
 * Volume that RAMPS rather than jumping: the four combinations are claims
 * about participation rising or fading across a stretch, not about one loud
 * bar. Built from each tape's own bars so the histogram still sits under its
 * candles.
 */
const ramp = (bars: Bar[], from: number, to: number, seed: number) => {
  const rnd = seeded(seed);
  return bars.map((_, i) => {
    const t = i / Math.max(1, bars.length - 1);
    return (from + (to - from) * t) * (0.86 + rnd() * 0.28);
  });
};
export const COMBO = {
  upUp: { series: UP, vol: ramp(UP.bars, 0.6, 1.9, 0x71) },
  upDown: { series: UP, vol: ramp(UP.bars, 1.9, 0.55, 0x72) },
  downUp: { series: DOWN, vol: ramp(DOWN.bars, 0.6, 1.9, 0x73) },
  downDown: { series: DOWN, vol: ramp(DOWN.bars, 1.9, 0.55, 0x74) },
};
export const UP_DOMAIN = domainOf(UP.closes, UP.bars);
export const DOWN_DOMAIN = domainOf(DOWN.closes, DOWN.bars);
/** SC14's two breakdowns: one tape, heavy volume against thin. */
export const SUPPORT = Math.min(...DOWN.closes.slice(0, Math.floor(DOWN.closes.length * 0.7)));
export const BREAK_DOWN_AT = DOWN.closes.findIndex(
  (c, i) => i > DOWN.closes.length * 0.7 && c < SUPPORT,
);
const DOWN_VOL = volumeOf(DOWN.bars, 0x12);
export const VOL_HEAVY = lift(DOWN_VOL, { [BREAK_DOWN_AT]: 3.0, [BREAK_DOWN_AT + 1]: 2.1 });
export const VOL_THIN = lift(DOWN_VOL, { [BREAK_DOWN_AT]: 0.72, [BREAK_DOWN_AT + 1]: 0.8 });

/* ══ 5. SC16 — a healthy uptrend ══════════════════════════════════════════
 * Volume DERIVED FROM THE PRICE, not designed: a bar that closed up gets rally
 * volume, one that closed down gets pullback volume. That is the claim SC16
 * makes, so letting the data make it is stronger than asserting it. */
export const HEALTHY_VOL = (() => {
  const rnd = seeded(0x9110);
  return UP.bars.map((b, i) => {
    const up = i === 0 ? true : b.c >= UP.bars[i - 1].c;
    return (up ? 1.55 : 0.6) * (0.85 + rnd() * 0.3);
  });
})();

/* ══ 6. SC17 — one spike, three contexts ═════════════════════════════════
 * ⚠ ONE ARRAY, USED THREE TIMES. "Satu spike yang sama ditampilkan dalam tiga
 * konteks" — if each context got its own volume the scene would be showing
 * three spikes and calling them one. */
export const SPIKE_AT = 41;
export const SPIKE_VOL = lift(volumeOf(UP.bars, 0x5717), { [SPIKE_AT]: 4.6, [SPIKE_AT + 1]: 1.6 });

/* ══ 7. SC18 — colour follows the candle ═════════════════════════════════ */
export const COLOUR: Series = fromShape({ seed: 618, n: 14, shape: "sideways", start: 4200, label: "Warna mengikuti candle" });
export const COLOUR_VOL = volumeOf(COLOUR.bars, 0x618);

/* ══ 8. BRPT — SC15A and SC15B ═══════════════════════════════════════════
 *
 * ⚠⚠ [NEEDS DATA: BRPT daily OHLCV + volume, TradingView CSV, 30 Jun – 1 Jul
 * 2026 through the recovery to ~1.750]. THIS IS NOT BRPT. It is a downtrend
 * shape with the seed the brief specifies, and it renders with the Ilustrasi
 * tag beside the ticker so the frame says so.
 *
 * ⚠ THE 142M / 189M VOLUME FIGURES IN THE SCRIPT ARE PLACEHOLDERS and are NOT
 * printed anywhere. `StatStrip` in SC15A shows the two bars' RELATIVE
 * comparison instead — which is the only thing the narration actually claims
 * and the only thing this data can honestly support.
 *
 * Nothing in the scene types a price either: the "~1.750" the VO names is read
 * out of PEAK below, so replacing this data changes the caption with it rather
 * than leaving a lie behind.
 */
export const BRPT: Series = fromShape({ shape: "downtrend", seed: 601, n: 45, start: 1700, label: "BRPT" });
/** The two bars the whole question turns on: the low, and the bar after it. */
export const BRPT_BREAK = BRPT.closes.indexOf(Math.min(...BRPT.closes.slice(0, 36)));
export const BRPT_REBOUND = BRPT_BREAK + 1;
/** Everything from here is masked until the answer. */
export const BRPT_ASK = BRPT_REBOUND + 1;
export const BRPT_SUPPORT = Math.min(...BRPT.closes.slice(0, BRPT_BREAK));
export const BRPT_PEAK = Math.max(...BRPT.closes.slice(BRPT_ASK));
export const BRPT_DOMAIN = domainOf(BRPT.closes, BRPT.bars);
/**
 * ⚠ THE TWO COMPARISONS THE ANSWER RESTS ON, and the reason this volume is not
 * left to `volumeOf`:
 *   breakdown volume  <  the busiest earlier days   (weak confirmation)
 *   rebound volume    >  breakdown volume           (a response)
 * Both are asserted at the bottom of this file.
 */
export const BRPT_VOL = lift(volumeOf(BRPT.bars, 0x601), {
  11: 2.6, 19: 2.9, 26: 2.4,
  [BRPT_BREAK]: 1.75,
  [BRPT_REBOUND]: 2.1,
});

/* ══ CHECKS ══════════════════════════════════════════════════════════════
 * The scenes make claims ABOUT this data. These assert the data still makes
 * them. They run once per render process; the alternative is a chart that
 * says the opposite of the voice-over with nothing on screen admitting it. */
const must = (ok: boolean, why: string) => {
  if (!ok) throw new Error(`020-volume/data: ${why}`);
};
must(BREAK_AT > 0, "MAIN never closes above its own resistance — there is no breakout to show");
must(TESTS.length === 3, `expected three approaches to resistance, found ${TESTS.length}`);
must(TESTS.every((i) => MAIN.closes[i] <= RESISTANCE), "a test closed above resistance");
must(VOL_HIGH[BREAK_AT] > mean(VOL_HIGH) * 2, "the high-volume breakout is not actually high");
must(
  Math.abs(VOL_AVG[BREAK_AT] - mean(VOL_AVG)) < mean(VOL_AVG) * 0.35,
  "the ordinary-volume breakout is not actually ordinary",
);
must(BREAK_DOWN_AT > 0, "DOWN never closes below its own support");
must(VOL_A[TODAY] === VOL_B[TODAY], "SC05's two stocks do not trade the same amount today");
must(AVG_A * 2 < AVG_B, "SC05's two histories are not different enough to make the point");
must(BRPT_REBOUND < BRPT.closes.length, "BRPT has no bar after its low");
must(
  BRPT_VOL[BRPT_BREAK] < Math.max(...BRPT_VOL.slice(0, BRPT_BREAK)),
  "breakdown volume is not smaller than the busiest earlier day — the answer's first clue is gone",
);
must(
  BRPT_VOL[BRPT_REBOUND] > BRPT_VOL[BRPT_BREAK],
  "rebound volume is not bigger than the breakdown's — the answer's second clue is gone",
);
/* ⚠ AGAINST THE OTHER BARS, not against the whole array. "Jauh lebih tinggi
   dari biasanya" means higher than the bars around it, and a mean that
   INCLUDES the spike is dragged up by the very thing being measured — the
   bigger the spike, the harder it becomes to prove there is one. */
export const SPIKE_BASE = mean(SPIKE_VOL.filter((_, i) => i !== SPIKE_AT));
must(
  SPIKE_VOL[SPIKE_AT] > SPIKE_BASE * 2.2,
  `the volume spike is not far above its own tape (${(SPIKE_VOL[SPIKE_AT] / SPIKE_BASE).toFixed(2)}x)`,
);
