/**
 * data/series.ts — every tape this episode draws, and the claims each one has
 * to keep.
 *
 * ⚠ ONE REAL DATASET IS OUTSTANDING. SC12–SC13 are a worked example on ADMR,
 * and the ADMR export has not arrived — see `ADMR` below. Everything else in
 * this episode is illustration by design, built from core's own constructors
 * so `kind` travels with the series and nothing has to remember to say so.
 *
 * ⚠ THE ASSERTIONS AT THE BOTTOM ARE THE POINT. A tape whose support stops
 * being tested, or whose breakout stops closing above the level a scene draws,
 * turns a sentence in the narration into a lie the viewer cannot catch. They
 * run at module load, so the build fails rather than the video.
 */
import { domainOf, fromAnchors, seeded, sma, toBars, volumeOf } from "../../../core";
import type { Anchor, Bar, Series } from "../../../core";
import SS01 from "./ss01.json";

/** Anchors → a synthetic tape. Core has `fromShape` for a shape and
 *  `fromScreenshot` for a trace; this is neither — the turns are DESIGNED to
 *  land where the narration says they do, and the tape is honest about being
 *  generated. */
const designed = (anchors: Anchor[], n: number, seed: number, label?: string): Series => {
  const closes = fromAnchors(anchors, n, seed);
  return { closes, bars: toBars(closes, seed ^ 0x5bf0), kind: "synthetic", label };
};

/* ═══ CG-A · SC01 · SC02 · SC04 · SC05 ═══════════════════════════════════
 *
 * ONE tape for the whole opening argument. SC01 builds it to the breakout,
 * SC02 carries it through the reversal, SC04 carries it the rest of the way
 * through support — `Candles` takes `from`, so the later scenes EXTEND it
 * rather than mounting a second chart. The cold open's failure IS the worked
 * example of Mistake 01; two charts would make that a different story.
 */
/**
 * ⚠ THE FIRST 63 BARS ARE TRACED FROM SIMON'S `ss01.png`, not designed — his
 * call, and `scripts/trace-ss01.mjs` is the trace. 170 candles in the picture
 * are aggregated into 63 bars (open of the first, close of the last, the
 * extremes of all — what a higher timeframe IS), and the pixel scale is solved
 * from TWO points: the level the tape breaks is 120, the floor it holds is
 * 104. Every other price on this chart therefore follows from the picture
 * rather than being chosen.
 *
 * ⚠ THE LAST 15 BARS ARE NOT IN THE PICTURE, AND CANNOT BE. ss01 ends on its
 * high — that is the breakout the cold open needs. What the story needs next
 * is the reversal that makes the trade fail, and no screenshot of a successful
 * chart contains it. So the tail is designed, it starts on the traced tape's
 * own last close, and it is the only part of this tape anybody chose.
 */
const HEAD: Bar[] = SS01.bars;
const TAIL_N = 15;
const TAIL_CLOSES = fromAnchors(
  [
    [0, HEAD[HEAD.length - 1].c],
    /* one more push, so the reversal is a failure rather than a stall */
    [0.2, 129.5],
    [0.45, 121],
    [0.7, 112],
    [0.9, 103],
    [1, 95],
  ],
  TAIL_N + 1,
  0x2201,
).slice(1);
export const SETUP: Series = {
  closes: [...HEAD.map((b) => b.c), ...TAIL_CLOSES],
  bars: [...HEAD, ...toBars(TAIL_CLOSES, 0x2201 ^ 0x5bf0)],
  /* ⚠ `synthetic`, THOUGH MOST OF IT IS TRACED. The tag on screen is the same
     either way, and the honest label for a tape whose ending was written is
     not "traced". */
  kind: "synthetic",
  label: "ss01 + reversal",
};
/**
 * ⚠ SHAPED, NOT JUST GENERATED. `volumeOf` sizes each bar by its own body, and
 * on this tape that came out flat — but SC01's third beat is the words "volume
 * menguat" and the histogram has to be doing that when they are said. The
 * ramp runs from the last support test into the breakout, which is the stretch
 * the sentence is about. Illustration, and the series says so.
 */
export const SETUP_VOL = volumeOf(SETUP.bars, 0x2202).map((v, i) => {
  /* ⚠ THE RAMP FOLLOWS THE TRACED TAPE'S OWN BREAKOUT (bar 59), not the frame
     numbers it used to be fitted to. It runs from the consolidation into the
     thrust, which is the stretch "volume menguat" is spoken over. */
  const t = Math.max(0, Math.min(1, (i - 50) / (SS01.breakout - 50)));
  return v * (1 + t * 1.5);
});
/** The two levels the narration names. Typed here, once, and read by SC01,
 *  SC02 and SC04 — a level re-typed in a scene is a level that drifts. */
export const SETUP_LEVELS = SS01.levels;
/** ⚠ THE BAR THE FLOOR WAS FORMED ON. Drawn from bar 0 the support line runs
 *  under half a tape that had not reached it yet, which says price was holding
 *  a level that did not exist. A level starts where it was made. */
export const SETUP_SUPPORT_FROM = SS01.levels.supportFrom;

/** How far the tape is drawn in each scene. ⚠ BAR INDICES, NOT FRAMES. */
export const SETUP_STEPS = { open: 62, reverse: 72, breakdown: 77 } as const;
/**
 * ⚠ THE BAR THE BREAKOUT STARTS ON, AND THE ONLY THING SC01 WITHHOLDS — Simon:
 * "dari awal, coba hide 4 candlestick paling kanan … lalu 441, 4 candlesticknya
 * muncul satu per satu". It is DERIVED from the trace rather than counted off
 * the picture: it is the first bar that closes above the level, so "the four
 * that are hidden" and "the run that breaks resistance" cannot drift apart if
 * the tape is ever re-traced.
 */
export const SETUP_BREAK_FROM: number = SS01.breakout;
/** ⚠ ONE DOMAIN FOR THE WHOLE TAPE, and it lives with the tape. Two components
 *  now place things against this chart — the scene that draws it and the layer
 *  that carries a line of type across the cut — and a scale computed twice is a
 *  scale that will disagree with itself. */
export const SETUP_DOMAIN = domainOf(SETUP.closes, SETUP.bars);

/**
 * ═══ THE TREND LINE UNDER THE LOWS ═══  (Simon, f236)
 *
 * Two lows, and both are chosen rather than eyeballed: the FURTHEST BACK one —
 * "tarik dari low paling belakang", which is the tape's own lowest bar — and
 * the low the horizontal support is drawn at, so the second point the line
 * touches IS that level ("tambah 1 garis support di low kedua"). The two marks
 * are one reading of the tape rather than two levels that happen to be near
 * each other.
 *
 * ⚠ IT IS ALLOWED TO CUT THROUGH CANDLES — Simon: "kalo ada candlestick yg
 * kelewatan garis trend ini, gapapa". It was fitted to the lows' convex hull
 * before, which guarantees nothing crosses it but forces the line to start
 * halfway along the tape. Anchored at the real low it reads as the trend of
 * the whole move, and the bars it clips are the pullbacks inside that move.
 */
export const SETUP_TREND = (() => {
  const bars = SETUP.bars.slice(0, SETUP_STEPS.open + 1);
  const lows = bars.map((b) => b.l);
  const from = lows.indexOf(Math.min(...lows));
  const to = SETUP_SUPPORT_FROM;
  if (from >= to) throw new Error("022-ta-mistakes/series: the tape's lowest bar is not before its support");
  const slope = (bars[to].l - bars[from].l) / (to - from);
  /** Extended to the last bar SC01 draws — a trend line stops being one the
   *  moment it stops being ahead of the price it is under. */
  const end = SETUP_STEPS.open;
  return { from, to: end, v0: bars[from].l, v1: bars[from].l + slope * (end - from), touch: to };
})();

/**
 * ═══ CG-A's DASHBOARD ═══  (Simon's `Chart Dashboard.jpeg`)
 *
 * The instrument the cold open is about, and the strip of others beside it.
 *
 * ⚠ THREE-LETTER CODES, DELIBERATELY. Every IDX ticker is FOUR letters, so a
 * three-letter code cannot be read as a real stock however dashboard-like the
 * frame looks — which is what lets an invented price sit on screen at all. The
 * active one is `XYZ`, the same placeholder identity SC14's two trade cards
 * use, so the episode has one fictional stock rather than several.
 *
 * ⚠ AND THE ACTIVE TILE'S NUMBERS ARE NOT HERE. They are read off the tape as
 * it builds, in scenes/SetupGroup.tsx — the readout counts with the data, the
 * reference folder's second model of continuous motion.
 */
export const XYZ = { name: "Saham ABCD", sub: "ABCD · Ilustrasi", unit: "1D" } as const;
const strip = seeded(0x2209);
export const TICKERS = ["ABCD", "ARV", "BLN", "CMT", "DRA", "ELP", "FST"].map((symbol, i) => ({
  symbol,
  /* the neighbours sit in the same range as the tape, so the strip reads as
     one market rather than as seven unrelated numbers */
  price: 96 + strip() * 44,
  pct: (strip() - 0.42) * 6,
  i,
}));

/** The time axis, in RELATIVE labels. ⚠ NOT DATES — a made-up date on an
 *  illustrative tape is a fabricated fact, and this tape is not a calendar. */
export const SETUP_AXIS: [number, string][] = [
  [0, "−3 bln"],
  [26, "−2 bln"],
  [52, "−1 bln"],
  /* ⚠ 74, NOT THE LAST BAR. Centred on bar 77 the word runs past the card's
     right edge — the axis label is centred on its bar, and the last bar IS the
     edge. */
  [74, "Sekarang"],
];

/* ═══ SC08 · confirmation bias ═══════════════════════════════════════════ */
/** Choppy and genuinely ambiguous — the scene's claim is that the same tape
 *  supports two readings, so a tape with an obvious direction would settle the
 *  argument before the scene makes it. */
export const BIAS = designed(
  [
    [0, 100], [0.12, 108], [0.22, 101], [0.34, 110], [0.44, 103], [0.56, 112],
    [0.66, 104], [0.78, 111], [0.88, 105], [1, 109],
  ],
  60,
  0x2211,
);

/* ═══ SC09 · konteks market ══════════════════════════════════════════════ */
/**
 * ⚠ THE TWO WINDOWS SHARE THEIR FIRST 60%, EXACTLY. Same anchors, same seed,
 * same length — so the tremor stream is the same and the setup in the left
 * window is not merely similar to the one in the right, it is identical. That
 * identity is the whole scene: "setup-nya bisa sama, tapi konteksnya berbeda".
 */
const CTX_HEAD: Anchor[] = [
  [0, 100], [0.10, 106], [0.20, 101], [0.32, 109], [0.42, 103], [0.52, 111], [0.60, 106],
];
const CTX_N = 56;
/** Bars 0…CTX_SHARED-1 are the setup both windows are showing. */
export const CTX_SHARED = 34;
/**
 * ⚠ THE HEAD IS COPIED, NOT RE-GENERATED. Feeding the same head anchors to
 * `fromAnchors` twice does NOT give the same numbers: the tremor is scaled by
 * the anchors' own range, and the two tails have different ranges — so the
 * "identical" setup came out visibly different in the two windows. Building
 * one tape and pasting its head over the other's is the only way the identity
 * the scene claims is actually true. `toBars` then agrees by construction,
 * because it walks the closes in order from the same seed.
 */
const ctx = (tail: Anchor[], seed: number, head?: Series): Series => {
  const closes = fromAnchors([...CTX_HEAD, ...tail], CTX_N, seed);
  if (head) for (let i = 0; i < CTX_SHARED; i++) closes[i] = head.closes[i];
  return { closes, bars: toBars(closes, seed ^ 0x5bf0), kind: "synthetic" };
};
export const CTX_WORKS = ctx([[0.72, 118], [0.86, 126], [1, 133]], 0x2221);
export const CTX_FAILS = ctx([[0.72, 112], [0.86, 101], [1, 94]], 0x2221, CTX_WORKS);
/** The wider market each one happened inside — drawn as a line, not candles:
 *  it is the room, not the subject. */
export const MKT_UP = fromAnchors([[0, 100], [0.4, 112], [0.7, 118], [1, 128]], 56, 0x2222);
export const MKT_FLAT = fromAnchors([[0, 116], [0.35, 118], [0.6, 114], [1, 100]], 56, 0x2223);

/* ═══ SC10 · indicator overload ══════════════════════════════════════════ */
export const OVER_TAPE = designed(
  [[0, 100], [0.18, 109], [0.34, 103], [0.5, 112], [0.66, 105], [0.82, 114], [1, 108]],
  64,
  0x2231,
);
/**
 * Five panes. ⚠ THREE OF THEM ARE THE SAME MESSAGE — that is not a shortcut,
 * it is the scene's argument, and it has to be true of the numbers rather than
 * merely asserted by a label. 1, 2 and 4 are all distance-from-a-mean on the
 * same closes; only the window and the scaling differ, which is exactly what
 * "pesan yang sama dalam bentuk berbeda" means.
 */
const dev = (period: number, scale: number) => {
  const m = sma(OVER_TAPE.closes, period);
  return OVER_TAPE.closes.map((c, i) => (m[i] === null ? null : (c - (m[i] as number)) * scale));
};
export const OVER_PANES: { name: string; values: (number | null)[] }[] = [
  { name: "VOLUME", values: OVER_TAPE.bars.map((b) => Math.abs(b.c - b.o) + 0.6) },
  { name: "MOMENTUM A", values: dev(8, 1) },
  { name: "MOMENTUM B", values: dev(10, 1.4) },
  { name: "RANGE", values: OVER_TAPE.bars.map((b) => b.h - b.l) },
  { name: "MOMENTUM C", values: dev(12, 1.8) },
];

/* ═══ SC11 · hindsight bias ══════════════════════════════════════════════ */
/** Flat and unreadable for two thirds, then a move that looks inevitable once
 *  it has happened. The mask closes at `HIND_MASK`, which is the last bar the
 *  viewer would actually have had. */
export const HIND = designed(
  [[0, 100], [0.16, 105], [0.30, 99], [0.44, 104], [0.56, 100], [0.68, 108], [0.84, 119], [1, 128]],
  70,
  0x2241,
);
export const HIND_MASK = 39;

/* ═══ CG-B · SC12 + SC13 · the ADMR case ═════════════════════════════════
 *
 * ⚠⚠ [NEEDS DATA: ADMR daily OHLCV + volume, ~Jan–Jun 2026] ⚠⚠
 *
 * THIS IS A PLACEHOLDER, AND THE SCENE SAYS SO ON SCREEN. It is shaped to the
 * narration — a long uptrend, a descending triangle, the MA100 break, a failed
 * retest, then the triangle's support going — so the scene can be built,
 * timed and reviewed now. It is NOT ADMR.
 *
 * TO SWAP IN THE REAL EXPORT: replace this with
 *     export const ADMR = fromOHLC(rows, "ADMR · 1D · IDX");
 * and nothing else changes. `kind` becomes "market", SourceTag prints the
 * credit by itself, and the "data belum masuk" chip in scenes/AdmrGroup.tsx
 * disappears because it keys off `ADMR.kind`. The three event indices below
 * must then be re-derived FROM THE DATES, not kept.
 */
export const ADMR = designed(
  [
    [0, 940], [0.08, 1060], [0.16, 1020], [0.26, 1210], [0.36, 1430], [0.44, 1780],
    /* the descending triangle: lower highs onto a flat support */
    [0.50, 1462], [0.56, 1700], [0.62, 1460], [0.68, 1648], [0.74, 1458], [0.80, 1600],
    /* the scenario turning over */
    [0.84, 1534], [0.858, 1494], [0.872, 1466], [0.888, 1498], [0.905, 1470],
    [0.93, 1462], [0.945, 1436], [0.965, 1392], [1, 1326],
  ],
  150,
  0x22a1,
  "ADMR · 1D",
);
export const ADMR_VOL = volumeOf(ADMR.bars, 0x22a2);
export const ADMR_MA100 = sma(ADMR.closes, 100);
/** The descending triangle's flat support, and the three lower highs it hangs
 *  under. ⚠ BAR INDICES — re-derive them from the dates when the real export
 *  lands; they are not portable. */
export const ADMR_SHAPE = {
  support: 1456,
  highs: [66, 83, 101, 119],
  lows: [75, 92, 110],
} as const;
/** The three events SC13 lands, as bar indices. */
export const ADMR_EVENTS = { breakMa: 129, retest: 132, breakSupport: 140 } as const;

/**
 * The two trendlines SC12 draws, as VALUE ARRAYS on the price grid rather than
 * as free-floating geometry.
 *
 * ⚠ THIS IS WHY THEY CANNOT DRIFT. A sloping line placed by pixel stops
 * touching its own highs the moment the box, the domain or a bar index moves;
 * a line built from the bars it connects is anchored to them by construction,
 * and core's IndicatorLine already draws exactly this — nulls and all.
 */
const through = (a: number, b: number, n: number, va: number, vb: number): (number | null)[] =>
  Array.from({ length: n }, (_, i) =>
    i < a || i > b ? null : va + ((vb - va) * (i - a)) / (b - a),
  );
const HI = ADMR_SHAPE.highs;
export const ADMR_TRIANGLE = through(
  HI[0], HI[HI.length - 1], ADMR.closes.length,
  ADMR.closes[HI[0]], ADMR.closes[HI[HI.length - 1]],
);
/** The long uptrend, from the first bar to the descending triangle's first high. */
export const ADMR_UPTREND = through(2, HI[0], ADMR.closes.length, ADMR.closes[2], ADMR.closes[HI[0]]);
/** A MACD-shaped histogram off the same closes. ⚠ ILLUSTRATIVE, like the tape
 *  — when the real export lands this becomes ema(12) − ema(26) − its signal. */
export const ADMR_MACD = ADMR.closes.map((c, i) => {
  const fast = sma(ADMR.closes, 12)[i];
  const slow = sma(ADMR.closes, 26)[i];
  return fast === null || slow === null ? null : fast - slow;
});

/* ── the claims, asserted ───────────────────────────────────────────────── */
(() => {
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/series: ${m}`);
  };
  const { resistance, support } = SETUP_LEVELS;
  const c = SETUP.closes;

  /* the withheld run IS the breakout: every bar of it closes above the level,
     and nothing before it does */
  for (let i = SETUP_BREAK_FROM; i <= SETUP_STEPS.open; i++) {
    if (c[i] <= resistance) fail(`bar ${i} is withheld as part of the breakout but does not close above resistance`);
  }
  if (c.slice(0, SETUP_BREAK_FROM).some((v) => v > resistance))
    fail("SETUP closes above resistance before the run SC01 withholds");

  /* CG-A — the setup has to fail at resistance before it breaks it */
  const rejects = c.slice(0, SETUP_STEPS.open - 8).filter((v) => v > resistance).length;
  if (rejects) fail(`SETUP closes above resistance ${rejects}× before the breakout`);
  if (c[SETUP_STEPS.open] <= resistance) fail("SETUP never closes above resistance");
  if (c[SETUP_STEPS.reverse] >= resistance)
    fail("SETUP has not come back below resistance by the end of SC02");
  if (c[SETUP_STEPS.breakdown] >= support) fail("SETUP never closes below support");
  const touches = c.slice(0, SETUP_STEPS.open).filter((v) => v < support + 3).length;
  if (touches < 2) fail(`SETUP only approaches support ${touches}× — the story needs it tested`);

  /* ⚠ THE LINE MAY CLIP CANDLES — Simon allowed that. What still has to hold
     is that both its ends are real lows of this tape and that the second one
     is the level the support line is drawn at, or the two marks stop being one
     reading. */
  {
    const { from, v0, touch } = SETUP_TREND;
    if (Math.abs(SETUP.bars[from].l - v0) > 1e-6) fail("the trend line does not start on a low");
    if (Math.abs(SETUP.bars[touch].l - support) > 1e-6)
      fail("the trend line's second low is not the level the support line is drawn at");
    if (SETUP.bars.slice(0, SETUP_STEPS.open + 1).some((b) => b.l < v0 - 1e-6))
      fail("the trend line does not start on the LOWEST low");
  }

  /* SC09 — the two windows must be identical where they claim to be */
  const shared = CTX_SHARED;
  for (let i = 0; i < shared; i++) {
    if (CTX_WORKS.closes[i] !== CTX_FAILS.closes[i])
      fail(`CTX windows differ at bar ${i} — the shared setup is not shared`);
  }
  if (CTX_WORKS.closes[CTX_N - 1] <= CTX_WORKS.closes[shared]) fail("CTX_WORKS does not work");
  if (CTX_FAILS.closes[CTX_N - 1] >= CTX_FAILS.closes[shared]) fail("CTX_FAILS does not fail");

  /* SC10 — the three "same message" panes must actually correlate */
  const corr = (a: (number | null)[], b: (number | null)[]) => {
    const p = a.map((v, i) => [v, b[i]]).filter(([x, y]) => x !== null && y !== null) as number[][];
    const mx = p.reduce((s, [x]) => s + x, 0) / p.length;
    const my = p.reduce((s, [, y]) => s + y, 0) / p.length;
    const cov = p.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0);
    const sx = Math.sqrt(p.reduce((s, [x]) => s + (x - mx) ** 2, 0));
    const sy = Math.sqrt(p.reduce((s, [, y]) => s + (y - my) ** 2, 0));
    return cov / (sx * sy);
  };
  for (const [a, b] of [[1, 2], [1, 4], [2, 4]] as const) {
    const r = corr(OVER_PANES[a].values, OVER_PANES[b].values);
    if (r < 0.9) fail(`OVER_PANES ${a} and ${b} correlate only ${r.toFixed(2)} — not one message`);
  }

  /* CG-B — the three events have to be where the scene points at them */
  const a = ADMR.closes;
  const ma = ADMR_MA100;
  const { breakMa, retest, breakSupport } = ADMR_EVENTS;
  if (!(a[breakMa] < (ma[breakMa] as number))) fail("ADMR does not close below MA100 at breakMa");
  if (!(a[breakMa - 2] > (ma[breakMa - 2] as number))) fail("ADMR was already below MA100 before the break");
  if (!(a[retest] < (ma[retest] as number))) fail("ADMR's retest gets back above MA100 — it must fail");
  if (!(a[breakSupport] < ADMR_SHAPE.support)) fail("ADMR never breaks the triangle support");
  if (!(a[breakSupport - 4] > ADMR_SHAPE.support)) fail("ADMR was already below support before 18 Mei");
  for (let i = 1; i < ADMR_SHAPE.highs.length; i++) {
    if (a[ADMR_SHAPE.highs[i]] >= a[ADMR_SHAPE.highs[i - 1]])
      fail(`ADMR high ${i} is not lower than the one before it — that is not a descending triangle`);
  }
})();
