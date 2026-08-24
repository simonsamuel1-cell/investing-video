/**
 * SCENE 05 — How to read it, the average as a moving level, and the tape the
 * CROSSING scene is read off. `from 2381 · dur 1816`
 *
 * IT RUNS THROUGH SC07. Simon: scene 4 to scene 5 is continuous — technically
 * no transition at all. So there is no cut at 3547 and no second chart: the
 * candles simply ZOOM OUT until the whole tape spans the card, and SC07 mounts
 * on top of them for its heading and its text. A chart that is replaced at a
 * boundary asks to be trusted again from scratch; this one is the same tape
 * the viewer has spent forty seconds learning to read, seen whole.
 *
 * SC06 used to start at 2903 with a chart of its own. It does not any more:
 * support and resistance are read off the SAME series this scene has been
 * scrolling, so at 2903 the window simply travels BACK to the uptrend it
 * opened on. Remounting a second chart there would have thrown away the one
 * thing the beat needs — that the viewer already knows this tape.
 *
 * ONE SERIES, THREE READINGS. A climb, the decline that follows it and the
 * range the decline settles into are joined end to end, and the WINDOW travels
 * along them — it is a window onto a chart that keeps running, not three
 * charts being swapped. Each seam is exact: every crop's last anchor is the
 * next one's first, so no gap bar prints at a join.
 *
 * The average is ONE line too. It is drawn once, across the first window —
 * that is the lesson — and after that it only ever lengthens, because it is
 * the same line continuing rather than a new one being introduced.
 *
 * [PLACEHOLDER] The candles are traced by eye from Simon's crops, see
 * `data/shots.ts`. None of those crops carries a symbol header or a price
 * axis, so this chart shows neither ticker nor price labels. The AVERAGE is
 * not traced: it is computed from these closes, because a hand-drawn curve
 * that merely looks like the mean of the bars under it is not one.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { QuoteBox } from "../components/QuoteBox";
import { theme } from "../theme";
import {
  sma,
  mulberry32,
  drawPath,
  progress,
  progressInOut,
  clamp01,
  textReveal,
} from "../helpers";
import { toBars, domainOf } from "../series";
import { READ_1, READ_2, READ_3, fromAnchors } from "../data/shots";
import { CUTS, cutInStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to read the cut from global frames. */
const FROM = 2381;
/** Global → local. Every beat below is quoted in Simon's global frames. */
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══
 *
 * 2324   the rise lands: white card and the first 60 sessions, already there
 * 2389 – 2487   the average is DRAWN through them — price above a rising line
 * 2489 – 2516   the window scrolls 54 sessions left; the climb runs off the
 *        left and the decline runs in from the right
 * 2516 – 2626   the average lengthens across them — price below a falling line
 * 2691 – 2716   the window scrolls 54 more; the range runs in
 * 2716 – 2754   the average lengthens across the range and FLATTENS — there is
 *        nowhere for it to slope
 * 2818   the closing summary opens at the top of the card
 * 2903   the summary and the chips clear, and the window travels BACK to the
 *        opening window — the uptrend, at its right-hand end
 * 3034   the bars that came back and touched the line are ringed, one at a
 *        time  "Dalam uptrend, harga sering pullback ke MA … lalu memantul"
 */
const T = {
  title: 0,
  ma: at(2446),
  maOver: at(2544) - at(2446),
  /** When the summary and the chips leave. */
  clear: at(2960),
  /** The rings on the bars that came back to the line. */
  ring: at(3091),
  ringStep: 16,
  /** The bounce path drawn through them — ring, high, ring, high, ring, high. */
  path: at(3147),
  pathDur: 100,
  /** The same reading, mirrored, on the decline. */
  ringDown: at(3312),
  pathDown: at(3357),
  /**
   * And then they go. The rings and the trend line have said what they had to
   * say by here, and the tape underneath is about to be handed to the crossing
   * scene — carrying four circles and a zigzag into it would have the next
   * beat annotating a chart that is still annotated for the last one.
   */
  ringsOut: at(3470),
  ringsOutOver: 30,
  /**
   * ═══ THE ZOOM OUT ═══
   *
   * The window has been sixty bars wide all scene. Here it opens by a fifth,
   * to about seventy-four, and travels back to the very start of the tape —
   * the crossings the next beat is about are not inside the sixty it has been
   * parked on.
   *
   * It rides the voice: "Saat moving average pendek" starts at 3514, so the
   * move is already under way as the sentence begins and settled well before
   * the crossing is named.
   */
  wide: at(3505),
  wideOver: 60,
  /**
   * THE TWO LONG AVERAGES, traced in from the LEFT edge — 3537 to 3597, over
   * "menembus moving average panjang dari bawah" (3560–3612). They arrive
   * AFTER the zoom out has settled, which is the only order that works: a line
   * drawn across a chart whose pitch is still closing would be redrawn under
   * itself every frame.
   */
  long: at(3537),
  longOver: 60,
  /**
   * The two crossings, each on the frame the voice names it: "ini disebut
   * golden cross" starts at 3619, "disebut death cross" at 3719. Both stay up
   * afterwards — they sit at opposite ends of the tape and never crowd each
   * other, and the next beat is about the gap BETWEEN them.
   */
  golden: at(3580),
  /**
   * THE CHASE. The window travels right to the SECOND crossing — it runs under
   * "Kalau menembus dari atas ke bawah," (3669–3714) and lands just before
   * "disebut death cross." (3719). 71 bars puts the crossing 56% across the
   * card, with the tail of the decline behind it and the start of the range
   * ahead, so it is read in context rather than arriving at an edge.
   *
   * It is its OWN travel, not another entry in `T.steps`. Those are unwound by
   * the zoom out — `shift * (1 - wide)` — which is right for the sixty-bar
   * window they belong to and would cancel this one to nothing.
   */
  chase: at(3675),
  chaseDur: 40,
  chaseBars: 71,
  death: at(3719),
  /**
   * AND THEN THE WHOLE TAPE. The pitch closes the rest of the way — every one
   * of the 189 bars across the card — and the travel unwinds to nothing, so
   * both crossings end up on screen together. It runs under "Tapi jangan
   * anggap crossing sebagai aba-aba entry atau exit" (3773–3866), which is the
   * one line in the scene that asks you to stop reading a point and look at
   * the whole run.
   */
  full: at(3780),
  fullOver: 85,
  /**
   * THE RINGS HAND OVER TO BOXES. A ring says "this point"; by here the point
   * is not the claim any more. "Saat crossing muncul, sebagian pergerakan
   * biasanya sudah terjadi" (3942–4043) is about the RUN either side of the
   * crossing, so the mark has to enclose the bars that made that run — the
   * ones sitting above the golden cross and below the death cross.
   */
  ringsGone: at(3938),
  box: at(3938),
  /**
   * The line the whole scene lands on, and it goes exactly where the voice
   * says it: "Gunakan sebagai konfirmasi trend," starts at 4061 and "bukan
   * untuk meramal" at 4118. The box rises, snaps open and types in about 25
   * frames, so it is finished well inside the first of those two lines.
   */
  quote: at(4061),
  /** Each scroll, and the growth that follows it. They never overlap. */
  steps: [
    { scroll: at(2546), scrollDur: 27, grow: at(2573), growDur: 110, bars: 54 },
    /**
     * 75. The range leg is fifteen bars LONGER than the window, and the scroll
     * travels the whole of it — so the window lands on the LAST sixty, not the
     * first. Those fifteen bars are why: a 20-period average needs twenty bars
     * to forget the decline behind it, and landing on the first sixty left the
     * line still falling steeply into the left edge. Fifteen bars deeper in,
     * the average has nothing but the range in it, and it is flat all the way
     * across.
     */
    { scroll: at(2748), scrollDur: 25, grow: at(2773), growDur: 38, bars: 75 },
    /**
     * BACK to the start, and no growth: the line is already drawn end to end,
     * so this step moves the window and nothing else. A negative travel is the
     * whole of it — 54 + 75 returned.
     */
    { scroll: at(2960), scrollDur: 34, bars: -(54 + 75) },
    /** Forward again to the decline — the window step 1 already framed. */
    { scroll: at(3270), scrollDur: 34, bars: 54 },
  ] as {
    scroll: number;
    scrollDur: number;
    bars: number;
    grow?: number;
    growDur?: number;
  }[],
};
const PERIOD = 20;
/**
 * The long pair the crossing beat is about. MA100 is the FAST one here — fast
 * and slow are relative, and against 200 a hundred sessions is the quick one —
 * so it takes cyan and MA200 takes indigo, the episode's binding everywhere.
 */
const MID_P = 100;
const SLOW_P = 200;
/** How far above the tape's open the invented history starts. See PRIOR. */
const LIFT = 0.22;
/**
 * ═══ THE SWITCH ═══
 *
 * MA100 on or off. It is ONE flag and not two, because hiding the line alone
 * would leave the two crossing marks pinned to a line nobody can see — a
 * "Golden Cross" label floating over a single unbroken MA200. So the flag
 * moves the CROSSING PAIR with it: with MA100 up, the crossings are MA100 ×
 * MA200; with it hidden, they are MA20 × MA200, the two lines actually on
 * screen. Either way the marks sit on a crossing the viewer can see.
 */
const SHOW_MID = false;
/**
 * The crossing mark: a ring on the crossing itself, and a pill 10px clear of
 * that ring — measured from the ring's EDGE, not its centre, so the gap is the
 * gap you actually see. Same radius as the bounce rings earlier in the scene,
 * because it is the same gesture: this bar, here, is the one to look at.
 *
 * Each pill picks its own vertical side (see CROSS_SET), and they are not
 * symmetric on purpose.
 */
const CROSS_MARK = { r: 38, gap: 10, size: 30, padX: 22, padY: 10 };
/**
 * The box that replaces the ring at 3938. `bars` either side of the crossing,
 * and it reaches from the crossing itself out to the FURTHEST candle in that
 * span — up at the golden cross, down at the death cross, because that is
 * where price is relative to the lines in each case. `pad` keeps the far edge
 * off the wicks so the box does not look like it is cutting them.
 *
 * `trimX` pulls BOTH vertical edges 15px inward and `overCross` pushes the
 * CROSS-side edge 15px further out — Simon's numbers, and they pull the same
 * way: a box that is narrower than its span and hangs a little past the
 * crossing reads as sitting behind the run rather than boxing it in.
 *
 * `overCross` is always measured from the crossing, so it goes DOWN at the
 * golden cross and UP at the death cross without needing a second constant.
 */
const CROSS_BOX = { bars: 9, pad: 14, fill: 0.3, trimX: 15, overCross: 15 };
/**
 * Two lines, so 118 tall — the same box CG-A leaves you with, and it rides the
 * card's bottom edge the same way. Its lower edge lands at 909; the subtitle
 * band starts at 972.
 */
const QUOTE = { w: 640, h: 118 };
/**
 * 60 bars in the window, not 100. The crops are chunky, low-count charts and
 * the count is what gives them that: across this card 60 bars are 28px apart,
 * so a body is 17px wide. At 100 they thin to 10px and stop looking like the
 * reference.
 */
const WINDOW = 60;
/** How long each leg is, in bars. Each scroll travels the NEXT leg's length. */
const LEGS = [60, 54, 75];
/**
 * The card sits DROP px below its layout box, matching CG-A and SC04 to the
 * pixel — the cut lifts the camera, it does not move the furniture. The chart
 * keeps its FULL WIDTH for the whole scene; nothing shrinks it.
 */
const DROP = 30;
const BOX = {
  x: theme.layout.chartA.x,
  y: theme.layout.chartA.y + DROP,
  w: theme.layout.chartA.w,
  h: theme.layout.chartA.h,
};
/**
 * The card is DIVIDED: the tape gets the top, and the bottom is a reserved
 * band the chips live in.
 *
 * The chips were under the card, half on the grey — which put text on a
 * background the chart does not own, and let them cross the candles on the way
 * there. Giving them a band INSIDE the card fixes both at once: they are on
 * white, they are part of the same surface, and the plot simply stops above
 * them so nothing can collide.
 */
const PLOT = { ...BOX, h: 520 };
// ═══════════════════════════════════════════════════════════════════════════

const CLOSES = [
  ...fromAnchors(READ_1, LEGS[0], 8801),
  ...fromAnchors(READ_2, LEGS[1], 8811),
  ...fromAnchors(READ_3, LEGS[2], 8821),
];
const BARS = toBars(CLOSES, 8802);

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY. The average is computed over the
 * visible closes PLUS a seeded run of prior ones and only the visible part is
 * drawn, so the line starts at the LEFT EDGE rather than a fifth of the way
 * across. The prior walk is flat, so it cannot drag the line out of the box.
 */
const PRIOR = (() => {
  const rnd = mulberry32(8803);
  const step = CLOSES[0] * 0.004;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < PERIOD + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  /**
   * ═══ DEEPER HISTORY — AND IT DECLINES INTO THE TAPE ═══
   *
   * This is what makes a GOLDEN CROSS exist at all, and it is worth spelling
   * out because it looks like an arbitrary knob and is not.
   *
   * A golden cross is the fast average coming UP through the slow one. For
   * that to happen inside the visible tape, the fast one has to start BELOW
   * the slow one — which means price must have been FALLING into bar 0. With a
   * flat prior history both averages start on top of each other and the climb
   * separates them on bar 5, before anyone can see it: technically a crossing,
   * visually the left-hand edge.
   *
   * So the invented history is a decline: LIFT above the tape's open, walked
   * down into it over 180 sessions. That is not a trick to manufacture a
   * signal — it is the setup a golden cross NEEDS. Price falls, bases, then
   * rallies; the slow average is still above the fast one when the rally
   * starts, and the rally is what pulls the fast one through it.
   *
   * LIFT is the one number that moves the crossing. 22% puts it at bar 36,
   * three fifths of the way up the climb, with price at 6446 against a peak of
   * 6971 — so most of the move had already happened when the cross printed,
   * which is exactly what this scene goes on to say.
   *
   * PREPENDED, never inserted. The thirty bars above are untouched and stay
   * nearest the tape, so MA20 comes out BIT-IDENTICAL to what it was before
   * any of this existed — a 20-period average can only see the last nineteen
   * of them. Checked by comparing the arrays, not assumed. The price DOMAIN is
   * unchanged too: both long averages land inside the range the candles
   * already set.
   */
  const anchor = out[0];
  const n = SLOW_P + 10 - (PERIOD + 10);
  const rnd2 = mulberry32(8804);
  let q = anchor;
  for (let i = 0; i < n; i++) {
    /* built backwards in time, so each OLDER bar sits a little higher */
    q += (anchor * LIFT) / n + (rnd2() - 0.5) * 2 * step * 0.5;
    out.unshift(q);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...CLOSES];
const maOf = (period: number) => sma(WITH_HISTORY, period).slice(PRIOR.length);
const MA = maOf(PERIOD);
/**
 * Neither of these carries a null: PRIOR is 210 deep, so even MA200 has its
 * two hundred sessions by the first visible bar. That is why they can start at
 * the LEFT EDGE — the chart did not begin the day it was opened.
 */
const MA_MID = maOf(MID_P);
const MA_SLOW = maOf(SLOW_P);

/**
 * ⚠ FOUND, NOT PLACED — the same rule the rings follow. The two crossings are
 * searched for in the arrays; nothing here says WHERE they should be. Change
 * LIFT and these move on their own, which is the point: a mark that has to be
 * kept in step with the data by hand will eventually drift off it.
 */
/** Whichever of the two is the FAST side of the crossing on screen. */
const MA_FAST = SHOW_MID ? MA_MID : MA;
const CROSS = (() => {
  let up = -1;
  let down = -1;
  for (let i = 1; i < CLOSES.length; i++) {
    const a = MA_FAST[i - 1];
    const b = MA_FAST[i];
    const c = MA_SLOW[i - 1];
    const d = MA_SLOW[i];
    if (a === null || b === null || c === null || d === null) continue;
    if (up < 0 && a <= c && b > d) up = i;
    else if (up > 0 && down < 0 && a >= c && b < d) down = i;
  }
  return { up, down };
})();

/**
 * ONE SCALE, FIXED, over the whole series.
 *
 * It was briefly refitted to each window, the way a real chart does when you
 * scroll it — and that was wrong here. Refitting magnifies the range leg into
 * the full height of the card, and a magnified range is a WAVY average: the
 * flatness the scene is about only exists relative to the trends before it.
 * Held on the trends' own scale, the line through the range is visibly, plainly
 * flat, which is the whole lesson. It also means nothing stretches mid-scroll.
 */
const DOMAIN = domainOf([...CLOSES, ...MA, ...MA_MID, ...MA_SLOW], BARS);

/**
 * The grid is built from the RESTING window — the first 60 bars across the
 * card. `x` is linear and unclamped, so bar 60 and up land off the right edge
 * at the same pitch, and the scroll brings them in.
 */
const G = gridOf(CLOSES.slice(0, WINDOW), DOMAIN, PLOT, 0.12, 0);
const PITCH = G.x(1) - G.x(0);
const BODY_W = Math.max(2, Math.min(20, PITCH * 0.62));
/**
 * How far the pitch closes at 3505–3565. NOT a fit-to-width: Simon's call is
 * that the bars only come in 20%, so the tape still runs off the right-hand
 * edge of the card and the window sits at the FAR LEFT of it. About 74 of the
 * 189 bars are in shot — the whole climb and the first dozen bars of the
 * decline after it.
 *
 * It was briefly a true fit (59/188, every bar in the card at once). That put
 * the entire tape on screen but at a fifth of the pitch, and candles that
 * narrow stop reading as candles.
 *
 * X ONLY. The vertical mapping does not change by a pixel, and it must not:
 * DOMAIN is already fitted over the WHOLE series, so every price is already in
 * its final place. A uniform scale would have shrunk the candles vertically
 * too and, worse, thinned every wick with them. Closing the pitch in code
 * instead leaves strokes alone — which is what a real chart does when you zoom
 * it out.
 */
const WIDE = 0.8;
/** And the rest of the way at 3780: every bar in the card at once. */
const FIT = (WINDOW - 1) / (CLOSES.length - 1);
const X0 = G.x(0);

/**
 * ═══ THE CHIPS ═══
 *
 * One reading per beat, in a row UNDER the card — they were inside it, at the
 * top-left, and there they simply sat on the chart they were describing.
 *
 * The row is CENTRED as a group at every count: the first chip arrives in the
 * middle of the frame, and each new one pushes the ones before it left so the
 * whole run stays centred. That is why the widths below are measured constants
 * rather than left to the browser — an absolutely-positioned row can be eased
 * into its new place, and a flex row can only jump to it.
 *
 * MEASURED from a render at this exact size and weight. Re-measure if the
 * text, the size, the padding or the font changes.
 *
 * Dark grey, not indigo: they comment ON the chart rather than being part of
 * it, and indigo is the colour of the average they are describing.
 */
/**
 * A 2 × 2 GRID, straddling the card's bottom border — at 30px the four of them
 * are 1.852px wide in one row, and only 1.728 fits inside the margins.
 *
 * Each ROW is centred on the chips that have arrived, so the entrance is
 * unchanged: the first lands in the middle and the next pushes it left. The
 * block's top is fixed, so the second row opens below the first rather than
 * shunting it upwards.
 */
/** The reserved band: two rows of 57 with 20 between, 8 clear of the card. */
const CHIP = { top: 738, gap: 20, rowStep: 77, size: 30, padX: 16, padY: 8 };
/** Which chips share a row. */
const ROWS = [
  [0, 1],
  [2, 3],
];
/**
 * The closing summary, in the empty top half of the card. It sits INSIDE the
 * chart because it is the answer to what the chart has been showing — the
 * heading outside the card names the lesson, this names the two things to do.
 */
const SUM = {
  at: at(2875),
  top: 250,
  gap: 20,
  size: 30,
  padX: 22,
  padY: 10,
  step: 8,
};
const CHIPS = [
  { at: at(2444), w: 419, text: "Harga di atas MA = uptrend" },
  { at: at(2552), w: 500, text: "Harga di bawah MA = downtrend" },
  { at: at(2651), w: 460, text: "Makin curam = trend menguat" },
  { at: at(2746), w: 413, text: "Datar = market belum jelas" },
];

/**
 * ═══ THE BARS THAT CAME BACK TO THE LINE ═══  ← EDIT THE CIRCLES HERE
 *
 * `rings` are the bars that get a circle. `line` is the trend line's own
 * vertices, in order — a swing zigzag through the candles, so a vertex sits on
 * the bar's HIGH at a peak and its LOW at a trough. The two lists are separate
 * on purpose: a circle marks where price met the average, and the trend line
 * traces the swings between those meetings. They are not obliged to share
 * every point.
 *
 * The alternation is fixed by direction. UP starts at a trough (price pulls
 * back DOWN to the line); DOWN starts at a peak (price rallies UP into it).
 * Both are BAR INDICES into the 189-bar series.
 *
 * Which window each set belongs to:
 *   UP    bars   0 – 59    the climb, framed from 2903
 *   DOWN  bars  54 – 113   the decline, framed from 3213
 * An index outside its own window sits off the edge of the card and is
 * clipped, so keep edits inside those ranges.
 *
 * ⚠ THESE WERE FOUND, NOT PLACED. The rule: a bar qualifies as a ring when its
 * own range CONTAINS the average — low at or under the line, high at or over
 * it — which is where price actually met the line. A circle is drawn centred
 * on the average, so moving one to a bar that does not reach the line still
 * draws a tidy circle ON the line, with no candle inside it. That reads as a
 * touch the tape never made. Check the bar before moving a number.
 *
 * The one deliberate exception is UP's first ring: at bar 1 price only comes
 * NEAR the line, and the run of bounces has to start where the tape starts.
 */
const UP = {
  up: true,
  rings: [1, 29, 47],
  pivots: [25, 45, 55],
};
const DOWN = {
  up: false,
  rings: [67, 85, 92, 101],
  pivots: [77, 89, 97, 113],
};

/** The path through one bounce set, in the grid's coordinates. */
type Bounce = { up: boolean; rings: number[]; pivots: number[] };
/**
 * A ring sits on the bar's own extremity in the direction it reached FOR the
 * line — its high on the way up into a falling average, its low on the way
 * down onto a rising one — not on the average itself.
 *
 * On a bar that genuinely touches, those are the same point, so the true
 * touches do not move. It matters on a bar that only rallies CLOSE: bar 85's
 * high is 6.492 against an average of 6.368, and pinned to the average the
 * vertex sat a third of the rally below the candle that made it.
 */
const ringY = (b: Bounce, i: number) => (b.up ? BARS[i].l : BARS[i].h);
const verticesOf = (b: Bounce, g: ReturnType<typeof gridOf>) =>
  b.rings.flatMap((r, n) => [
    { x: g.x(r), y: g.y(ringY(b, r)) },
    {
      x: g.x(b.pivots[n]),
      y: b.up ? g.y(BARS[b.pivots[n]].h) : g.y(BARS[b.pivots[n]].l),
    },
  ]);
const pathOfBounce = (b: Bounce, g: ReturnType<typeof gridOf>) =>
  verticesOf(b, g)
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
const lenOfBounce = (b: Bounce, g: ReturnType<typeof gridOf>) => {
  const v = verticesOf(b, g);
  let len = 0;
  for (let i = 1; i < v.length; i++)
    len += Math.hypot(v[i].x - v[i - 1].x, v[i].y - v[i - 1].y);
  return len;
};

/**
 * The two marks, in the order the voice names them. The RINGS are both indigo
 * — they are the same gesture, "this point here" — and only the pills are told
 * apart by colour, which is Simon's call and the right one: the ring says
 * where to look, the pill says what it is.
 */
const CROSS_SET = [
  {
    i: CROSS.up,
    at: T.golden,
    text: "Golden Cross",
    fill: theme.colors.indigo,
    /* below the ring: the crossing is heading UP out of it */
    above: false,
  },
  {
    i: CROSS.down,
    at: T.death,
    text: "Death Cross",
    fill: theme.colors.crossRed,
    /* above the ring: the crossing is heading DOWN out of it */
    above: true,
  },
];

export const Scene05 = () => {
  const f = useCurrentFrame();
  const g = f + FROM;
  /**
   * ONE cut, at the way in. CG-A rises this scene in at 2381 and it is read
   * from the GLOBAL frame, because the other half reads the same curve from
   * its own position. There is nothing at the way OUT: SC07 runs on this
   * chart, so the scene does not end, it opens up.
   */
  const cut = cutInStyle(g, CUTS.toReading);

  /** Every step contributes its own travel, and its own length of line. */
  const shift =
    PITCH *
    T.steps.reduce(
      (a, s) => a + s.bars * progressInOut(f, s.scroll, s.scrollDur),
      0,
    );
  const upto =
    WINDOW +
    Math.round(
      T.steps.reduce(
        (a, s) =>
          a +
          (s.grow === undefined
            ? 0
            : s.bars * clamp01((f - s.grow) / (s.growDur ?? 1))),
        0,
      ),
    );
  /** The dash only animates the FIRST draw; after that the line just grows. */
  const drawing = f < (T.steps[0].grow ?? 0);
  const line = MA.slice(0, upto);

  /**
   * THE ZOOM OUT. `spread` closes the pitch from a sixty-bar window to the
   * whole tape, and the travel unwinds to nothing over the same curve — the
   * window cannot both open to bar 0 and still be parked fifty-four bars along
   * it. `GZ` is the grid every mark on the chart is drawn through, so nothing
   * can be left behind at the old pitch.
   */
  const wide = progressInOut(f, T.wide, T.wideOver);
  const full = progressInOut(f, T.full, T.fullOver);
  /**
   * TWO STOPS, one number. 1 → WIDE at 3505, then WIDE → FIT at 3780. The
   * terms simply add because the windows never overlap: `wide` is finished at
   * 3565, long before `full` starts.
   */
  const spread = 1 + (WIDE - 1) * wide + (FIT - WIDE) * full;
  /**
   * The travel unwinds TWICE, for the same reason each time: a window cannot
   * both open to bar 0 and still be parked partway along the tape. `shift` is
   * the sixty-bar window's own travel, undone by the first zoom; the chase is
   * the run out to the death cross, undone by the second.
   */
  const shiftNow =
    shift * (1 - wide) +
    PITCH *
      spread *
      T.chaseBars *
      progressInOut(f, T.chase, T.chaseDur) *
      (1 - full);
  const GZ = { ...G, x: (i: number) => X0 + (G.x(i) - X0) * spread };
  const bodyW = Math.max(1.5, BODY_W * spread);
  /**
   * FULL STRENGTH THROUGHOUT. This used to dip twice, once under each of
   * SC07's text blocks. Both blocks are gone at Simon's direction, and a chart
   * that fades with nothing arriving over it reads as a fault.
   */
  const chartDim = 1;

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, ...cut }}>
        {/* the white card every chart in this episode is drawn on */}
        <div
          style={{
            position: "absolute",
            left: BOX.x,
            top: BOX.y,
            width: BOX.w,
            height: BOX.h,
            borderRadius: theme.layout.radius.lg,
            background: theme.colors.surface,
            border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
          }}
        />

        <Layer>
          <defs>
            {/* everything that scrolls is clipped to the card */}
            <clipPath id="sc05Card">
              <rect
                x={BOX.x}
                y={BOX.y}
                width={BOX.w}
                height={BOX.h}
                rx={theme.layout.radius.lg}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#sc05Card)" opacity={chartDim}>
            <g transform={`translate(${-shiftNow.toFixed(1)},0)`}>
              {/* the tape is simply THERE — the cut is its entrance */}
              {BARS.map((b, i) => {
                const x = GZ.x(i);
                const top = Math.min(G.y(b.o), G.y(b.c));
                const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
                /* candle bodies are the ONLY place green and red appear */
                const fill =
                  b.c >= b.o
                    ? theme.colors.candleGreen
                    : theme.colors.candleRed;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={G.y(b.h)}
                      x2={x}
                      y2={G.y(b.l)}
                      stroke={theme.colors.price}
                      strokeWidth={theme.layout.stroke.wick}
                    />
                    <rect
                      x={x - bodyW / 2}
                      y={top}
                      width={bodyW}
                      height={h}
                      fill={fill}
                    />
                  </g>
                );
              })}

              {/*
                Two readings of the same rule, one per window: on the climb the
                line is a floor price bounces off, on the decline a ceiling it
                is turned away from. The first set FADES as the window travels
                to the second — six of its bars stay in shot, and a leftover
                ring on them would be read as part of the new reading.
              */}
              {[
                { b: UP, ring: T.ring, path: T.path, fade: T.steps[3].scroll },
                {
                  b: DOWN,
                  ring: T.ringDown,
                  path: T.pathDown,
                  fade: T.ringsOut,
                },
              ].map((set, k) => {
                const o =
                  1 -
                  progress(
                    f,
                    set.fade,
                    set.fade === T.ringsOut
                      ? T.ringsOutOver
                      : theme.motion.revealF,
                  );
                if (f < set.ring || o <= 0.001) return null;
                return (
                  <g key={k} opacity={o}>
                    {f >= set.path && (
                      <path
                        d={pathOfBounce(set.b, GZ)}
                        fill="none"
                        stroke={theme.colors.indigo}
                        strokeWidth={theme.layout.stroke.ma}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...drawPath(
                          f,
                          set.path,
                          T.pathDur,
                          lenOfBounce(set.b, GZ),
                        )}
                      />
                    )}
                    {set.b.rings.map((i, n) => {
                      const a = progress(
                        f,
                        set.ring + n * T.ringStep,
                        theme.motion.revealF,
                      );
                      if (a <= 0.001) return null;
                      const cx = GZ.x(i);
                      /* the circle rides the same point the trend line does,
                         so the two can never come apart */
                      const cy = G.y(ringY(set.b, i));
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={38}
                          fill="none"
                          stroke={theme.colors.indigo}
                          strokeWidth={theme.layout.stroke.ma}
                          opacity={a}
                          transform={`translate(${cx} ${cy}) scale(${(0.6 + 0.4 * a).toFixed(3)}) translate(${-cx} ${-cy})`}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {f >= T.ma && (
                <path
                  d={pathOf(line, GZ)}
                  fill="none"
                  /* ONE average on screen, so it takes the orange — the
                     cyan/indigo binding is for a fast/slow PAIR, where the two
                     have to be told apart. */
                  stroke={theme.colors.maOrange}
                  strokeWidth={theme.layout.stroke.ma}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...(drawing
                    ? drawPath(f, T.ma, T.maOver, lengthOf(line, GZ))
                    : {})}
                />
              )}

              {/*
                ── THE LONG PAIR ──
                Traced in from the LEFT edge at 3537. Drawn AFTER the orange
                twenty so the slow lines sit over it: the crossing beat is
                about these two, and the line that has been the subject for the
                last forty seconds steps behind them.
              */}
              {f >= T.long &&
                [
                  { v: MA_SLOW, c: theme.colors.indigo },
                  ...(SHOW_MID ? [{ v: MA_MID, c: theme.colors.cyan }] : []),
                ].map((l) => (
                  <path
                    key={l.c}
                    d={pathOf(l.v, GZ)}
                    fill="none"
                    stroke={l.c}
                    strokeWidth={theme.layout.stroke.ma}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...drawPath(f, T.long, T.longOver, lengthOf(l.v, GZ))}
                  />
                ))}

              {/* the ring on each crossing — same reveal as the bounce rings:
                  it grows the last 40% of the way in as it fades up */}
              {CROSS_SET.map((c) => {
                const a =
                  progress(f, c.at, theme.motion.revealF) *
                  (1 - progress(f, T.ringsGone, theme.motion.revealF));
                if (a <= 0.001) return null;
                const cx = GZ.x(c.i);
                const cy = GZ.y(MA_FAST[c.i] as number);
                return (
                  <circle
                    key={c.text}
                    cx={cx}
                    cy={cy}
                    r={CROSS_MARK.r}
                    fill="none"
                    stroke={theme.colors.indigo}
                    strokeWidth={theme.layout.stroke.ma}
                    opacity={a}
                    transform={`translate(${cx} ${cy}) scale(${(0.6 + 0.4 * a).toFixed(3)}) translate(${-cx} ${-cy})`}
                  />
                );
              })}
            </g>
          </g>
        </Layer>

        {/* ── the closing summary, at the top of the chart ── */}
        {f >= SUM.at && f < T.clear + theme.motion.revealF && (
          <div
            style={{
              position: "absolute",
              opacity:
                f >= T.clear
                  ? 1 - progress(f, T.clear, theme.motion.revealF)
                  : 1,
              left: BOX.x,
              top: SUM.top,
              width: BOX.w,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              style={{
                ...textReveal(f, SUM.at),
                fontFamily: theme.type.family,
                fontSize: theme.type.h2.size,
                fontWeight: theme.type.h2.weight,
                color: theme.colors.indigo,
              }}
            >
              Perhatikan
            </div>
            <div style={{ display: "flex", gap: SUM.gap }}>
              {["Posisi harga", "Arah MA"].map((label, i) => (
                <span
                  key={label}
                  style={{
                    ...textReveal(f, SUM.at + (i + 1) * SUM.step),
                    background: theme.colors.indigo,
                    color: theme.colors.surface,
                    border: `${theme.layout.border.thin}px solid ${theme.colors.indigo}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: `${SUM.padY}px ${SUM.padX}px`,
                    fontFamily: theme.type.family,
                    fontSize: SUM.size,
                    fontWeight: theme.type.label.weight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── the readings, a 2 × 2 grid in the card's own bottom band ── */}
        {ROWS.map((row, r) =>
          row.map((i, col) => {
            const c = CHIPS[i];
            if (f < c.at) return null;
            /**
             * A chip counts as arriving OVER its own reveal, not the frame it
             * mounts — so the one beside it eases left instead of jumping.
             */
            const grown = row.map((k) =>
              f < CHIPS[k].at
                ? 0
                : progress(f, CHIPS[k].at, theme.motion.revealF),
            );
            const width = row.reduce(
              (a, k, n) =>
                a + grown[n] * (CHIPS[k].w + (n === 0 ? 0 : CHIP.gap)),
              0,
            );
            const before = row
              .slice(0, col)
              .reduce(
                (a, k, n) =>
                  a + grown[n] * (CHIPS[k].w + (n === 0 ? 0 : CHIP.gap)),
                0,
              );
            const left =
              (theme.layout.width - width) / 2 +
              before +
              (col === 0 ? 0 : CHIP.gap * grown[col]);
            const rv = textReveal(f, c.at);
            return (
              <div
                key={c.text}
                style={{
                  position: "absolute",
                  left,
                  top: CHIP.top + r * CHIP.rowStep,
                  width: c.w,
                  boxSizing: "border-box",
                  textAlign: "center",
                  opacity:
                    rv.opacity *
                    (f >= T.clear
                      ? 1 - progress(f, T.clear, theme.motion.revealF)
                      : 1),
                  background: theme.colors.surface,
                  border: `${theme.layout.border.thin}px solid ${theme.colors.ink}`,
                  borderRadius: theme.layout.radius.sm,
                  padding: `${CHIP.padY}px ${CHIP.padX}px`,
                  fontFamily: theme.type.family,
                  fontSize: CHIP.size,
                  fontStyle: "italic",
                  fontWeight: theme.type.label.weight,
                  color: theme.colors.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {c.text}
              </div>
            );
          }),
        )}

        {/*
          ── THE BOXES ──
          They take over from the rings at 3938. Found from the bars, not
          drawn by eye: the span is the crossing ± CROSS_BOX.bars, and the far
          edge is the highest high (or lowest low) inside it, so the box always
          contains the candles it is claiming and never merely floats near
          them. Drawn in canvas coordinates, which is safe here because the
          tape has finished travelling by 3865.
        */}
        {CROSS_SET.map((c) => {
          /* candles sit ABOVE the golden cross and BELOW the death cross —
             the opposite side to the pill, which is why the pill went there */
          const up = !c.above;
          const lo = Math.max(0, c.i - CROSS_BOX.bars);
          const hi = Math.min(BARS.length - 1, c.i + CROSS_BOX.bars);
          const yCross = GZ.y(MA_FAST[c.i] as number);
          let far = yCross;
          for (let i = lo; i <= hi; i++) {
            const v = up ? GZ.y(BARS[i].h) : GZ.y(BARS[i].l);
            far = up ? Math.min(far, v) : Math.max(far, v);
          }
          return (
            <HighlightBox
              key={c.text}
              x1={GZ.x(lo) - shiftNow - CROSS_BOX.pad + CROSS_BOX.trimX}
              x2={GZ.x(hi) - shiftNow + CROSS_BOX.pad - CROSS_BOX.trimX}
              y1={
                up
                  ? far - CROSS_BOX.pad
                  : yCross - CROSS_BOX.pad - CROSS_BOX.overCross
              }
              y2={
                up
                  ? yCross + CROSS_BOX.pad + CROSS_BOX.overCross
                  : far + CROSS_BOX.pad
              }
              f={f}
              at={T.box}
              fill={CROSS_BOX.fill}
            />
          );
        })}

        {/*
          ── THE TWO CROSSINGS ──
          The PILLS live out here, in canvas coordinates; the RINGS are drawn
          inside the clipped group with the tape (see above) so they are cut
          off with it rather than floating over the card's edge. Both read the
          same GZ.x, minus the tape's travel, so they cannot come apart.
        */}
        {CROSS_SET.map((c) => {
          const a = progress(f, c.at, theme.motion.revealF);
          if (a <= 0.001) return null;
          const rv = textReveal(f, c.at);
          return (
            <div
              key={c.text}
              style={{
                ...rv,
                /* ABOVE is done with translateY(-100%), not by guessing the
                   pill's height: it is one line of 30px type inside padding
                   the browser resolves, and a hard-coded height would drift
                   the moment any of that changes. */
                transform: `${rv.transform}${c.above ? " translateY(-100%)" : ""}`,
                position: "absolute",
                left: GZ.x(c.i) - shiftNow + CROSS_MARK.r + CROSS_MARK.gap,
                top:
                  GZ.y(MA_FAST[c.i] as number) +
                  (c.above
                    ? -CROSS_MARK.r - CROSS_MARK.gap
                    : CROSS_MARK.r + CROSS_MARK.gap),
                background: c.fill,
                color: theme.colors.surface,
                borderRadius: theme.layout.radius.sm,
                padding: `${CROSS_MARK.padY}px ${CROSS_MARK.padX}px`,
                fontFamily: theme.type.family,
                fontSize: CROSS_MARK.size,
                fontWeight: theme.type.label.weight,
                whiteSpace: "nowrap",
                opacity: rv.opacity * chartDim,
              }}
            >
              {c.text}
            </div>
          );
        })}

        {/* ── the line the scene leaves you with ── */}
        <QuoteBox
          f={f}
          at={T.quote}
          w={QUOTE.w}
          h={QUOTE.h}
          y={BOX.y + BOX.h - 30}
          /* Marked by CLAUSE, tint only, ink left dark — the treatment Simon
             settled on for SC03's quote. The comma stays INSIDE the mark: it
             belongs to the clause, and a comma stranded outside the band reads
             as a stray mark rather than punctuation. */
          lines={[
            {
              segments: [
                {
                  text: "Indikator untuk konfirmasi,",
                  tone: "indigo",
                  ink: true,
                },
              ],
            },
            { segments: [{ text: "bukan meramal" }] },
          ]}
        />

        {/* THE HEADING DOES NOT CHANGE. Simon: it stays "Cara Baca Moving
            Average" through the crossing beat too — reading a crossing is
            still reading a moving average, and a new heading there would say
            the subject had changed when it has not. */}
        <TitleChip text="Cara Baca Moving Average" f={f} at={T.title} />
      </div>
    </SafeArea>
  );
};
