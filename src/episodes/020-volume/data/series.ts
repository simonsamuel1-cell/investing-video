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
  fromShape, fromScreenshot, volumeOf, domainOf, seeded,
  type Series, type Bar, type Anchor,
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

/**
 * ═══ CHART1'S HISTOGRAM ═══  (Simon's description, SC11 from f9240)
 *
 * "Random tapi menanjak, lalu melonjak tinggi di beberapa candle terakhir."
 *
 * ⚠ GENERATED, NOT DRAWN, and one value per bar of CHART1_ALL. A hand-typed
 * array stops agreeing with the tape it sits under the moment either changes,
 * and there is nothing on screen that would show it had.
 *
 * ⚠ THE CLIMB AND THE BURST ARE SEPARATE FACTORS. Multiplying one ramp harder
 * at the end gives a curve that was always heading there; a distinct burst over
 * the last four bars is what reads as something happening rather than as a
 * trend continuing.
 */
/**
 * ⚠ ONE BASE, TWO READINGS. SC11 shows this tape's breakout twice — once with
 * the burst that confirms it and once without — so the two histograms have to
 * be the SAME bars with one thing changed. Generating them separately would let
 * the "weaker" version differ everywhere and prove nothing.
 */
const CHART1_VOL_BASE = (() => {
  const rnd = seeded(0x1101);
  const n = CHART1_ALL.length;
  return CHART1_ALL.map((_, i) => (0.45 + 0.75 * (i / Math.max(1, n - 1))) * (0.72 + rnd() * 0.56));
})();
/** ⚠ THE CLIMB AND THE BURST ARE SEPARATE FACTORS. One ramp pushed harder at
 *  the end reads as a trend that was always heading there; a distinct burst
 *  over the last four bars reads as something happening. */
export const CHART1_VOL = CHART1_VOL_BASE.map((v, i) =>
  i >= CHART1_VOL_BASE.length - 4 ? v * (1.9 + (i - (CHART1_VOL_BASE.length - 4)) * 0.4) : v,
);
/** The same tape with no burst at all, and 15% quieter throughout — Simon's
 *  numbers for the second reading. */
export const CHART1_VOL_WEAK = CHART1_VOL_BASE.map((v) => v * 0.85);

/**
 * ═══ THE BREAKDOWN TAPE ═══
 *
 * ⚠ TRACED PIXEL-FOR-PIXEL off Simon's image-1788513854855.png, not drawn from
 * anchors by eye. Every candle in that picture was found by colour-keying its
 * body, and its open, close, high and low read off the rows it occupies — 70
 * candles, 36 green and 34 red. The values are pixel heights, so they carry no
 * price meaning; nothing in the episode prints them.
 *
 * ⚠ ILLUSTRATIVE — kind "traced". The SHAPE is the reference's; no bar here
 * printed on a market.
 */
import BREAKDOWN_BARS from "./breakdown.json";
export const BREAKDOWN: Series = {
  closes: (BREAKDOWN_BARS as Bar[]).map((b) => b.c),
  bars: BREAKDOWN_BARS as Bar[],
  kind: "traced",
  label: "Breakdown",
};
export const BREAKDOWN_DOMAIN = domainOf(BREAKDOWN.closes, BREAKDOWN.bars);

/**
 * ⚠ THE SHELF IT LOSES, FOUND IN THE DATA. The lowest low of the tape's first
 * 55% is the floor the decline holds twice and then breaks; placing the line by
 * eye would make it a decoration rather than a level the picture supports.
 */
export const BREAKDOWN_SUPPORT = Math.min(
  ...BREAKDOWN.bars.slice(0, Math.floor(BREAKDOWN.bars.length * 0.55)).map((b) => b.l),
);

/**
 * ⚠ THE TWELVE BARS THE SCENE IS ABOUT — FOUND, NOT PLACED. They start at the
 * first close below the shelf after the tape's midpoint, which is the break
 * itself; counting back from the right instead would have landed on the bounce
 * at the end, which is the one stretch this reading is NOT about.
 */
export const BREAKDOWN_HL = (() => {
  const half = Math.floor(BREAKDOWN.closes.length * 0.5);
  const at = BREAKDOWN.closes.findIndex((c, i) => i >= half && c < BREAKDOWN_SUPPORT);
  /**
   * ⚠ FIVE BARS FURTHER RIGHT — Simon asked for 50px, and this run is measured
   * in BARS because the volume burst has to sit on the same columns the band
   * frames. In a half-width column the pitch is about 10.4px, so five bars is
   * the 50px he asked for and the band still starts on a candle rather than
   * halfway through one.
   */
  const shift = 5;
  return { from: (at < 0 ? half : at) + shift, count: 12 };
})();

/** ⚠ ONE BASE, TWO READINGS — the same construction as CHART1's histogram, so
 *  the loud and the quiet version differ in exactly one thing. */
const BREAKDOWN_VOL_BASE = (() => {
  const rnd = seeded(0xbd77);
  const n = BREAKDOWN.bars.length;
  return BREAKDOWN.bars.map((_, i) => (0.5 + 0.6 * (i / Math.max(1, n - 1))) * (0.74 + rnd() * 0.52));
})();
/** ⚠ THE BURST SITS ON THE HIGHLIGHTED RUN, not at the end of the tape. The
 *  band and the loud bars have to be the same twelve columns, or the picture
 *  points at one thing and the histogram at another. */
export const BREAKDOWN_VOL = BREAKDOWN_VOL_BASE.map((v, i) =>
  i >= BREAKDOWN_HL.from && i < BREAKDOWN_HL.from + BREAKDOWN_HL.count ? v * 2.1 : v,
);
export const BREAKDOWN_VOL_WEAK = BREAKDOWN_VOL_BASE.map((v) => v * 0.85);
/** The domain must already hold the breakout, or its wick clips the plot top. */
export const CHART1_DOMAIN2 = domainOf(CHART1_ALL.map((b) => b.c), CHART1_ALL);

/* ══ TWO BREAKOUTS — the side-by-side windows ═════════════════════════════
 *
 * ⚠ TRACED from Simon's "2 Breakout.png": 22 candles and their volume bars,
 * read pixel-for-pixel, so the pair can be ANIMATED and re-coloured by the
 * palette instead of pasted in as a picture. The two clipped part-candles at
 * the image's own edges are dropped — they are artefacts of the crop, not bars.
 *
 * ⚠ ONE TAPE, TWO HISTOGRAMS. Both windows draw the SAME candles: that is the
 * scene's whole claim — "dua breakout yang kelihatannya sama". If the right
 * window had its own price series the viewer could explain the difference away
 * as a different stock, which is exactly the misreading this is here to stop.
 */
import TWO_RAW from "./two-breakout.json";
const TWO_BARS = (TWO_RAW as { bars: Bar[]; vol: number[] }).bars;
const TWO_VOLS = (TWO_RAW as { bars: Bar[]; vol: number[] }).vol;
export const TWO: Series = {
  closes: TWO_BARS.map((x) => x.c),
  bars: TWO_BARS,
  kind: "traced",
  label: "2 Breakout",
};
export const TWO_DOMAIN = domainOf(TWO.closes, TWO.bars);
/** The left window: the traced volume, as it is. */
export const TWO_VOL_STRONG = TWO_VOLS;
/**
 * The right window: the same breakout on thinner participation — the whole tape
 * at 55%, and the LAST FIVE bars cut further still, so the move that matters
 * arrives on the quietest activity of all.
 */
export const TWO_VOL_WEAK = TWO_VOLS.map((v, i) =>
  v * 0.55 * (i >= TWO_VOLS.length - 5 ? 0.45 : 1),
);
/** ⚠ ONE PEAK FOR BOTH, or the two histograms normalise to themselves and the
 *  comparison the scene is asking for disappears. */
export const TWO_VOL_PEAK = Math.max(...TWO_VOL_STRONG);
/**
 * ⚠ THE BAND SIMON MARKED, in this tape's own units. It is PLACED, not found —
 * he drew it on a screenshot — but it is placed against real traced bars: the
 * tops of bars 9, 10, 13, 14 and 15 sit inside it and bars 16–17 break clear
 * above, which is what makes it read as a level that held and then failed.
 */
export const TWO_RES = { hi: 305, lo: 252 };

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
 * ═══ THE FOUR COMBINATIONS ═══
 *
 * ⚠ TRACED OFF SIMON'S OWN FOUR REFERENCES, not generated from a shape word.
 * Each combination is a specific PICTURE, and "uptrend" does not draw it: the
 * rising pair is a long base that breaks out, and the falling pair carries a
 * bounce in the middle. Generated tapes gave four charts that all had the same
 * texture, which is exactly what makes four slides look like one slide.
 *
 * ⚠ THEY NO LONGER SHARE UP AND DOWN. Those two are also SC14's, SC16's and
 * SC17's tape; changing them to fit this chapter would have redrawn three other
 * scenes that make their own claims about the same bars.
 *
 * ⚠ 42 BARS, NOT 60. At 60 across this window the candles are hairlines — the
 * references read as candles because each body is wide enough to have a colour
 * and a wick you can see.
 *
 * The anchors are [position across the chart, price]. Prices are arbitrary
 * units: nothing prints them, and each tape is scaled by its own domain.
 */
const CB = { n: 42, wick: 1.6, tremor: 0.055 } as const;

/** 1. Price up, and a base that breaks out — volume swells into the move. */
const A_UP_BASE: Anchor[] = [
  [0.00, 4105], [0.05, 4155], [0.10, 4170], [0.17, 4155], [0.22, 4125],
  [0.28, 4135], [0.32, 4165], [0.38, 4145], [0.44, 4100], [0.50, 4080],
  [0.55, 4120], [0.60, 4100], [0.65, 4065], [0.70, 4105], [0.75, 4125],
  [0.80, 4155], [0.85, 4165], [0.90, 4255], [0.95, 4355], [1.00, 4410],
];
/**
 * 2. Price up — but a STAIRCASE, with real pullbacks in it.
 *
 * ⚠ A TREND IS NOT A RAMP. Simon's reference climbs in steps: a push, a give-
 * back, a longer push. Anchors that only ever rise draw a ruler line, and four
 * charts drawn that way are the same chart four times however different their
 * volume is.
 */
const A_UP_STAIR: Anchor[] = [
  [0.00, 4025], [0.06, 4060], [0.11, 4038], [0.18, 4092], [0.24, 4118],
  [0.29, 4088], [0.35, 4146], [0.41, 4170], [0.47, 4128], [0.53, 4108],
  [0.59, 4162], [0.65, 4186], [0.71, 4158], [0.77, 4214], [0.83, 4252],
  [0.88, 4322], [0.94, 4390], [1.00, 4352],
];
/** 3. Price down, one bounce in the middle, then a steeper leg. */
const A_DOWN_BOUNCE: Anchor[] = [
  [0.00, 4820], [0.06, 4800], [0.12, 4765], [0.18, 4720], [0.24, 4685],
  [0.30, 4610], [0.35, 4630], [0.40, 4605], [0.45, 4602], [0.52, 4660],
  [0.58, 4705], [0.63, 4685], [0.70, 4630], [0.76, 4595], [0.82, 4550],
  [0.88, 4515], [0.94, 4470], [1.00, 4445],
];
/**
 * 4. Price down through chop — lower highs, but nothing about it is a straight
 *    line. Two real rallies fail inside it, which is what makes the drift down
 *    read as pressure rather than as a slope.
 */
const A_DOWN_CHOP: Anchor[] = [
  [0.00, 4800], [0.05, 4832], [0.11, 4744], [0.17, 4796], [0.23, 4712],
  [0.29, 4768], [0.35, 4688], [0.41, 4742], [0.47, 4664], [0.53, 4706],
  [0.60, 4636], [0.66, 4688], [0.73, 4612], [0.80, 4658], [0.87, 4596],
  [0.94, 4640], [1.00, 4584],
];

/**
 * ⚠ `tremor` IS WHY THESE READ AS CANDLES. A traced tape follows its anchors
 * so closely that consecutive closes barely differ, and a body is the distance
 * between two closes — the shape came out right and every bar was a hairline.
 * 0.055 of the range per bar is what the references actually show, and the
 * choppiness it brings is in them too.
 */
const traced = (a: Anchor[], seed: number, label: string) =>
  fromScreenshot(a, { n: CB.n, seed, label, wickScale: CB.wick, tremor: CB.tremor });

export const CUP_BASE = traced(A_UP_BASE, 0x7101, "Harga naik");
export const CUP_STAIR = traced(A_UP_STAIR, 0x7202, "Harga naik");
export const CDN_BOUNCE = traced(A_DOWN_BOUNCE, 0x7303, "Harga turun");
export const CDN_CHOP = traced(A_DOWN_CHOP, 0x7404, "Harga turun");

/**
 * Volume that RAMPS rather than jumping: the four combinations are claims
 * about participation rising or fading across a stretch, not about one loud
 * bar. Built from each tape's own bars so the histogram still sits under its
 * candles, then lifted where the reference shows a burst.
 */
const ramp = (bars: Bar[], from: number, to: number, seed: number) => {
  const rnd = seeded(seed);
  return bars.map((_, i) => {
    const t = i / Math.max(1, bars.length - 1);
    return (from + (to - from) * t) * (0.86 + rnd() * 0.28);
  });
};

export const COMBO = {
  upUp: {
    series: CUP_BASE,
    /** the swell arrives WITH the breakout, at bar 36 of 42 */
    vol: lift(ramp(CUP_BASE.bars, 0.75, 1.75, 0x71), { 22: 1.5, 35: 1.35, 36: 1.5, 40: 1.3 }),
  },
  upDown: {
    series: CUP_STAIR,
    /** ⚠ THE LAST BAR IS LIFTED AND THE TREND STILL FALLS. The reference ends
     *  on one loud bar under a long red candle; a fade that has no bars left
     *  in it reads as the stock going quiet, not as participation thinning. */
    vol: lift(ramp(CUP_STAIR.bars, 1.85, 0.5, 0x72), { 3: 1.35, 41: 2.2 }),
  },
  downUp: {
    series: CDN_BOUNCE,
    vol: lift(ramp(CDN_BOUNCE.bars, 0.7, 1.8, 0x73), { 33: 1.45, 41: 1.7 }),
  },
  downDown: {
    series: CDN_CHOP,
    vol: lift(ramp(CDN_CHOP.bars, 1.9, 0.55, 0x74), { 1: 1.2, 2: 1.15 }),
  },
};

/** One domain per combination — they no longer share a tape, so they cannot
 *  share a scale either. */
export const COMBO_DOMAIN = {
  upUp: domainOf(CUP_BASE.closes, CUP_BASE.bars),
  upDown: domainOf(CUP_STAIR.closes, CUP_STAIR.bars),
  downUp: domainOf(CDN_BOUNCE.closes, CDN_BOUNCE.bars),
  downDown: domainOf(CDN_CHOP.closes, CDN_CHOP.bars),
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


/* ══ 8. TIMEFRAME PAIR — SC03: the same stock at two zooms ════════════════
 *
 * ⚠ THE TWO HISTOGRAMS SHARE ONE PEAK, AND THAT IS THE WHOLE SCENE. A
 * five-minute bar counts what changed hands in five minutes; a daily bar counts
 * a whole session, so the daily bars MUST stand taller. Left to normalise
 * themselves the two would draw the SAME picture — the identical trap as an
 * unshared price domain, and here it would make the frame say the opposite of
 * the voice.
 *
 * ⚠ THE 5m WINDOW HAS MORE BARS AND THE 1D WINDOW FEWER, on purpose. Cutting a
 * day into five-minute slices produces many small readings; that is why the
 * left histogram is thin and low, and it is the same fact the heights show.
 */
export const TF5: Series = fromShape({ seed: 505, n: 34, label: "5m" });
export const TF1D: Series = fromShape({ seed: 1440, n: 18, label: "1D" });

/** The three busiest bars in each window. PLACED, spread apart so they read as
 *  three separate bursts rather than one block at the end. */
export const TF5_PEAKS = [7, 18, 28];
export const TF1D_PEAKS = [4, 10, 15];

/** Pull the bars toward their own mean, then scale the lot. `to` is how much of
 *  the original spread survives — this is what makes the 5m bars sit low and
 *  even instead of merely small. */
const flatten = (v: number[], to: number, at: number) => {
  const mu = mean(v);
  return v.map((x) => (mu + (x - mu) * to) * at);
};
const spike = (v: number[], at: number[], by: number) => {
  const s = new Set(at);
  return v.map((x, i) => (s.has(i) ? x * by : x));
};

export const TF5_VOL = spike(flatten(volumeOf(TF5.bars, 0x505), 0.45, 0.34), TF5_PEAKS, 2.9);
export const TF1D_VOL = spike(flatten(volumeOf(TF1D.bars, 0x1440), 0.32, 0.82), TF1D_PEAKS, 2.1);
/** ⚠ ONE PEAK FOR BOTH. See the header — do not let either normalise itself. */
export const TF_PEAK = Math.max(...TF5_VOL, ...TF1D_VOL);

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
/* ── CHART1's histogram: the two things Simon asked it to say ───────────── */
must(
  mean(CHART1_VOL.slice(CHART1_VOL.length / 2)) > mean(CHART1_VOL.slice(0, CHART1_VOL.length / 2)) * 1.3,
  "CHART1_VOL does not climb across the tape",
);
must(
  mean(CHART1_VOL.slice(-4)) > mean(CHART1_VOL.slice(0, -4)) * 2,
  "CHART1_VOL's last bars do not stand out as a burst",
);
/* ⚠ AGAINST ITS OWN NEIGHBOURS, not against the whole tape. The histogram
   CLIMBS by design, so the last bars are the tallest even with no burst in
   them; measured against the start of the tape a perfectly ordinary ending
   still looks like a spike, and the check would fail on correct data. */
const HL_RUN = (v: number[]) =>
  v.slice(BREAKDOWN_HL.from, BREAKDOWN_HL.from + BREAKDOWN_HL.count);
const HL_REST = (v: number[]) =>
  v.filter((_, i) => i < BREAKDOWN_HL.from || i >= BREAKDOWN_HL.from + BREAKDOWN_HL.count);
must(
  BREAKDOWN_HL.from + BREAKDOWN_HL.count <= BREAKDOWN.bars.length,
  "the highlighted run runs off the end of the breakdown tape",
);
must(
  mean(HL_RUN(BREAKDOWN_VOL)) > mean(HL_REST(BREAKDOWN_VOL)) * 1.6,
  "the loud breakdown's highlighted bars do not stand clear of the rest",
);
must(
  mean(HL_RUN(BREAKDOWN_VOL_WEAK)) < mean(HL_REST(BREAKDOWN_VOL_WEAK)) * 1.25,
  "the quiet breakdown's highlighted bars still stand out — the pair says the same thing twice",
);
must(
  BREAKDOWN.closes[BREAKDOWN.closes.length - 1] < BREAKDOWN.closes[0],
  "the traced breakdown does not end below where it started",
);
must(
  mean(CHART1_VOL_WEAK.slice(-4)) < mean(CHART1_VOL_WEAK.slice(-14, -4)) * 1.3,
  "CHART1_VOL_WEAK still has a burst in it — the second reading would say the same as the first",
);
must(
  mean(CHART1_VOL.slice(-4)) > mean(CHART1_VOL.slice(-14, -4)) * 1.8,
  "CHART1_VOL's burst does not stand clear of the bars just before it",
);
/* ── the four combinations: each one must actually BE its own combination ── */
const half = (v: number[]) => [mean(v.slice(0, v.length / 2)), mean(v.slice(v.length / 2))];
([
  ["upUp", COMBO.upUp, +1, +1],
  ["upDown", COMBO.upDown, +1, -1],
  ["downUp", COMBO.downUp, -1, +1],
  ["downDown", COMBO.downDown, -1, -1],
] as const).forEach(([name, combo, price, vol]) => {
  const c = combo.series.closes;
  const movedRight = (c[c.length - 1] - c[0]) * price > 0;
  const [a, b] = half(combo.vol);
  must(movedRight, `COMBO.${name}: the price does not end where its own label says it should`);
  /* ⚠ v3 TWEENS ONE HISTOGRAM INTO THE NEXT, bar for bar. Different lengths
     would silently drop or duplicate bars mid-move. */
  must(combo.vol.length === CB.n, `COMBO.${name}: its histogram is not ${CB.n} bars, so it cannot tween into the others`);
  must((b - a) * vol > 0, `COMBO.${name}: the volume does not ${vol > 0 ? "rise" : "fade"} across the tape`);
});
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

/* ── the timeframe pair: every claim the scene makes about it ────────────── */
const topThree = (v: number[]) =>
  v.map((x, i) => [x, i] as const).sort((a, b) => b[0] - a[0]).slice(0, 3).map(([, i]) => i).sort((a, b) => a - b);
must(
  mean(TF1D_VOL) > mean(TF5_VOL) * 1.5,
  `the 1D window is not meaningfully busier than the 5m one (${mean(TF1D_VOL).toFixed(2)} vs ${mean(TF5_VOL).toFixed(2)})`,
);
must(
  String(topThree(TF5_VOL)) === String([...TF5_PEAKS].sort((a, b) => a - b)),
  "the 5m window's three tallest bars are not the three it is supposed to single out",
);
must(
  String(topThree(TF1D_VOL)) === String([...TF1D_PEAKS].sort((a, b) => a - b)),
  "the 1D window's three tallest bars are not the three it is supposed to single out",
);
/* ⚠ THE SPIKES MUST STAND CLEAR of their own neighbours, or "3 yang paling
   tinggi" is only true by a hair and reads as noise. */
const others = (v: number[], at: number[]) => v.filter((_, i) => !at.includes(i));
must(
  Math.min(...TF5_PEAKS.map((i) => TF5_VOL[i])) > Math.max(...others(TF5_VOL, TF5_PEAKS)) * 1.4,
  "the 5m window's three peaks do not stand clear of the rest",
);
must(
  Math.min(...TF1D_PEAKS.map((i) => TF1D_VOL[i])) > Math.max(...others(TF1D_VOL, TF1D_PEAKS)) * 1.6,
  "the 1D window's three peaks do not stand clear of the rest",
);
