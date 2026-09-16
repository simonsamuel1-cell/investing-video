/**
 * SCENE 01 — Manual is slow, indicators are fast. `from 0 · dur 607`
 *
 * One broker window, open for the whole scene, with a watchlist extension down
 * its right side. The scene is a session at that window: three charts are
 * opened in turn, the first two are read BY HAND — the market structure traced
 * out swing by swing, which takes seconds — and the third is handed to two
 * indicators, which answer across the whole series the moment they are
 * switched on.
 *
 * The panel is FLAT AND AT REST throughout: no tilt on any axis, no camera
 * travel, no dolly, and the candles are simply there when the scene opens.
 *
 * [PLACEHOLDER] Every QUOTE is read off one of Simon's own screenshots. Every
 * CANDLE is traced by eye from those screenshots (see `data/shots.ts`), which
 * is why the panel carries a visible "Ilustrasi" tag. The tag comes off when
 * real OHLC exports land; nothing else in the scene has to change.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ReadingCard, READING_BOX } from "../components/ReadingCard";
import { theme } from "../theme";
import {
  progress,
  progressInOut,
  clamp01,
  drawPath,
  fmtRp,
  sma,
  bollinger,
  mulberry32,
} from "../helpers";
import { toBars } from "../series";
/**
 * ⚠ THE THREE STUDIES' MATHS COMES FROM core, not from this episode's helpers.
 * They are arithmetic on a list of numbers with no opinion about this video —
 * Wilder's smoothing, a range position, a difference of two averages — and the
 * one thing that must not happen is two copies of them drifting apart. 019's
 * own sma/ema/bollinger stay where they are; nothing already drawn moves.
 */
import { macd, rsi, stochastic, swingsOf } from "../../../core";
import {
  BBCA_1D,
  BBRI_1D,
  BMRI_1D,
  fromAnchors,
  type Anchor,
} from "../data/shots";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * ═══ THE TIMELINE ═══ (VO in the margin)
 *
 *   0        the window is already open on BBCA — flat, still, every candle
 *            drawn                             "Membaca candlestick dan chart
 *                                               pattern memang powerful."
 *   2 – 86   BBCA's structure is traced onto it, labelled LH · LL · HH · HL as
 *            the line reaches each swing. IT DOES NOT LEAVE — it stays on the
 *            chart it belongs to, and goes when that chart does.
 * 128       the plot gives up 400px and the watchlist opens beside it. It is
 *            open for the REST OF THE SCENE.
 *                                              "Tapi kalau harus cek saham
 *                                               satu per satu,"
 * 155       BBRI is selected and its chart takes the window
 * 170 – 228   BBRI's own structure is traced — the second hand-read, and the
 *            reason the move to BMRI waits
 *                                              "prosesnya bisa cukup lama dan
 *                                               butuh mata yang terlatih."
 * 245       BMRI is selected, in the last seconds of the run
 * 261       two indicator buttons appear under the timeframes, both OFF
 *                                              "Di sinilah indikator membantu."
 * 301       MOVING AVERAGE switches on: the button lights indigo and an orange
 *            average draws from the LEFT EDGE
 *                                              "Indikator mengolah data harga
 *                                               yang sudah ada …"
 * 435       BOLLINGER BANDS switches on: tosca bands unfold, also from the
 *            left edge                         "Bukan menggantikan analisismu,
 *                                               tapi membantu menyaring …"
 */
const T = {
  /** BBCA's structure. `dur` is the draw; the labels ride it. */
  zig: { from: 2, dur: 82 },
  /** The watchlist opens and never closes. */
  list: { in: 128, over: 20, step: 4 },
  /** When each chart takes the window, and how long the cross-fade runs. */
  bbri: 155,
  bmri: 245,
  swapOver: 12,
  /** BBRI's structure, drawn in the window it owns. */
  zigBbri: { from: 170, dur: 58 },
  buttons: 261,
  ma: 301,
  bb: 435,
  /**
   * THE ROADMAP. The window shrinks into the first card and the other three
   * open beside it. This IS the transition out of the intro — Simon's note:
   * "visual yang mengecil ini sudah termasuk transisi".
   */
  map: 530,
  mapDur: 70,
  /** Each of the other three cards, once the shrink is well under way. */
  cards: [555, 570, 585],
  cardDur: 15,
  /** The Moving Average card is called out, then the camera pushes into it. */
  glow: 600,
  glowOver: 25,
  /**
   * THE PUSH INTO THE CARD, THEN THE DISSOLVE OFF IT. The push runs 626 → 660
   * and the fade follows it, 660 → 680 — Simon's call, and it separates the
   * two beats: the camera arrives at the card, holds on it for the frame the
   * fade begins, and only then lets go. A fade that starts mid-push overlaps
   * the two and the arrival never quite registers.
   *
   * This replaced a camera CUT at 715. A cut has to land on a shot that
   * already exists; a dissolve is free to land on an empty card and let the
   * chart draw into it, which is what it does here.
   */
  push: 626,
  pushOver: 34,
  fade: 660,
  fadeOver: 20,
  /** How long each indicator takes to draw across the series. */
  drawOver: 40,
};
/** How far the push closes on the card before the dissolve takes over. */
const PUSH_AMOUNT = 0.55;

/**
 * ⚠ EXPORTED. CG-C draws GGRM in this same window — Simon: "duplikat saja".
 * Sharing the numbers is the only way the two panels can stay the same panel;
 * a second set of constants that started out equal would not end that way.
 */
export const PANEL = { x: 96, y: 150, w: 1728, h: 750 };
export const PLOT = {
  x: PANEL.x + 150,
  y: PANEL.y + 200,
  w: PANEL.w - 150 - 56,
  h: 490,
};
const N = 105;
const MA_PERIOD = 20;
const SLOW_PERIOD = 50;
/** Bars of pre-history the three studies are seeded on — see `study` in
 *  makeChart. Longer than any of their own periods, so all three exist on the
 *  first bar the chart actually shows. */
const STUDY_WARM = 40;

/**
 * ═══ THE THREE STUDIES ═══  (VIDEO 22, `studies` on BrokerPanel)
 *
 * ⚠ ONE OBJECT, BECAUSE THE THREE NUMBERS CANNOT BE CHOSEN SEPARATELY. Opening
 * three panes under the price makes the panel taller AND the price plot
 * shorter, and a caller allowed to set those independently is a caller who can
 * ask for a chart that does not fit its own window. The panel's height is the
 * SUM of what is in it, so it cannot disagree with the stack.
 *
 * ⚠ AND ONE TIME AXIS FOR ALL FOUR, at the foot. The months belong to the
 * tape, not to the price pane; repeated under each study they would be three
 * more rows of type in the tightest part of the picture.
 *
 * `foot` keeps the panel 20px clear of VIDEO 22's subtitle band at 972.
 */
export const STUDY = (() => {
  /**
   * ⚠ THE STACK IS MEASURED FROM THE BOTTOM UP, and the price plot is what is
   * left. The window's floor is fixed — it has to clear VIDEO 22's subtitle
   * band — so every pane that grows has to be paid for by the chart above it,
   * and that is the only direction this can be solved in without a second
   * number that has to agree with the first.
   */
  const height = 802;
  const pane = 78;
  const gap = 12;
  const lead = 20;
  const tail = 8;
  const axis = 30;
  const foot = 14;
  /**
   * ⚠ THE NAME SITS INSIDE ITS PANE NOW, in a row of its own across the top,
   * and the line is drawn UNDER it. It used to live in a gutter to the left of
   * the tape — which was the right answer while there was a price axis there to
   * share the column with. Simon has balanced the chart's white space since
   * ("chartnya perlu di stretch ke kiri"), so there is no gutter left to sit
   * in: a name outside the plot now means the plot is not centred.
   */
  const labelH = 22;
  const inset = 7;
  const axisY = height - foot;
  const at = axisY - axis - tail - (pane * 3 + gap * 2);
  return {
    height,
    pane,
    gap,
    lead,
    labelH,
    inset,
    at,
    axisY,
    /** The price plot's height in each of the two modes it is asked for. */
    plotH: at - lead - 200,
    bareH: at - lead,
    names: ["RSI", "Stoch", "MACD"],
  };
})();

{
  /** ⚠ THE PANEL MAY NOT REACH VIDEO 22'S SUBTITLE BAND. This panel is drawn at
   *  PANEL.y in both episodes, and 22 keeps the bottom 108px of every frame
   *  empty for burned-in captions. */
  if (PANEL.y + STUDY.height > 1080 - 108) {
    throw new Error(
      `019/Scene01: the studies make the panel reach ${PANEL.y + STUDY.height}, inside the subtitle band at 972`,
    );
  }
}

/**
 * ═══ THE WATCHLIST ═══
 *
 * Six names. The selected row is whichever chart is in the window, so the list
 * and the chart can never disagree about what is being looked at.
 *
 * Five of the six are quoted off Simon's own screenshots — BBCA, BBRI and BMRI
 * from the daily charts these candles are traced from, TLKM and ASII from the
 * 1H shots. The percentages on BBRI and BMRI are read off the last candle of
 * their screenshots and are approximate; BBCA's is exact, from its header.
 *
 * [PLACEHOLDER] ANTM alone is ILLUSTRATIVE — a real ticker with an invented
 * level, there to make six.
 */
const WATCH = [
  { t: "BBCA", p: 6325, c: "+0,40%", up: true },
  { t: "BBRI", p: 3220, c: "+3,20%", up: true },
  { t: "BMRI", p: 4210, c: "+0,70%", up: true },
  { t: "TLKM", p: 2590, c: "−0,38%", up: false },
  { t: "ASII", p: 4770, c: "+0,42%", up: true },
  { t: "ANTM", p: 1585, c: "+1,28%", up: true },
];
/**
 * The list is an EXTENSION of the chart window, not a window of its own: flush
 * to the panel's right edge, the panel's full height, set off by a single rule
 * down its left side. `take` is the width the plot gives up for it, and it is
 * the same as `w` — there is no gap to leave, because the two share an edge.
 */
const LIST = {
  take: 400,
  w: 400,
  x: PANEL.w - 400,
  pad: 24,
  headTop: 36,
  rowTop: 108,
  rowH: 88,
  avatar: 36,
  /** Every glyph in the extension. Smaller than the panel's own chrome — it is
      a dense list, not a readout. */
  size: 24,
};

/**
 * What the PORTFOLIO variant moves — see `portfolio` on BrokerPanel.
 *
 * ⚠ THE DROP IS THE WHOLE POINT OF IT — Simon: "beri jarak antara Portfolio
 * dengan semua text dan elemen di bawahnya". A watchlist's title sits straight
 * on its rows because there is nothing between them; a portfolio has a column
 * heading in there, and a title, a heading and a first row stacked at a
 * watchlist's spacing read as three rows of a list rather than as a title over
 * a table.
 */
const PF = { drop: 34, head: 38, weight: 400 };

export const FRAMES = ["5m", "15m", "1H", "1D", "1W"];
/** Every screenshot is a DAILY chart, so 1D is the live pill throughout. */
export const ACTIVE = "1D";
/** A daily chart's axis is dates, not session hours. */
const AXIS = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];
/**
 * ═══ THE PANEL'S OWN TYPE ═══
 *
 * NOT the episode's four sizes. This is a reproduction of a broker's UI and
 * these are its readouts — chrome, not headings, sentences or in-chart labels
 * — so they are named here, in the one scene that needs them.
 */
export const UI = { size: 30, weight: 600, axis: 500, name: 36, price: 70 };
export const HEAD = { x: 40, avatar: 52, gap: 16 };

/**
 * ═══ THE PANEL WITH ITS WALLS DOWN ═══  (VIDEO 22, `bare` on BrokerPanel)
 *
 * ⚠ IT KNOWS ABOUT 022'S LOGO, AND IT HAS TO. Simon: "geser naik hingga
 * align-top pada logo". The thing the header is being aligned to is not on this
 * panel and never will be — it is the Tuntun mark in the frame the panel is
 * borrowed into — so the number is measured off a render and named here rather
 * than left as a guess inside a scene. 45 is where that mark's ink starts.
 *
 * ⚠ AND THE PRICE ROW IS NOT LIFTED, IT IS GONE — Simon: "harga 4210 yang besar
 * juga hapus aja dan 0.70% juga hapus". So there is one row left and one number
 * to place it by.
 */
export const BARE = (() => {
  /** Measured off a render of 022: where the Tuntun mark's ink starts and ends. */
  const logo = { top: 45, bottom: 141 };
  /**
   * ⚠ ALIGN-BOTTOM NOW, AND THE ROW'S HEIGHT IS THE AVATAR'S. The header is a
   * flex row whose tallest child is the 52px circle, so its ink runs from the
   * row's own top to one pixel short of `top + avatar` — which is why the
   * bottom edge is `avatar - 1` rather than `avatar`. (Align-TOP, which this
   * replaces, needed no such allowance, and I wrongly made one: the ticker sat
   * a pixel above the mark until it was measured.)
   */
  const headTop = logo.bottom - (HEAD.avatar - 1) - PANEL.y;
  /**
   * ⚠ THE CHART'S OWN WINDOW IS THE PANEL'S BOX — Simon: "berikan window putih
   * untuk chartnya sebagai background". The header has moved out above it, so
   * what is left inside is only the chart, and the white card can come back
   * around exactly that.
   *
   * ⚠ AND THE CHART FILLS IT — "stretch fill pada windownya". Two things were
   * paying for something that is gone: 200px at the top held a header that is
   * now outside, and a 150px gutter held price numbers Simon has deleted. The
   * plot takes both back, which puts it at 490 — the height it has in 019 —
   * WITH the three studies still under it.
   *
   * ⚠ THE GUTTER DOES NOT GO TO ZERO. The study names still live in it, and a
   * name is the one thing on this picture that cannot move with the tape. 110
   * leaves "Stoch" 38px clear of its own first value; measured, not guessed.
   */
  /**
   * ⚠ ONE MARGIN, BOTH SIDES — Simon: "aku mau white space kiri dan kanan itu
   * balance, jadi chartnya perlu di stretch ke kiri". The left used to carry a
   * 110px gutter for the study names on top of this margin, so the tape sat
   * 124px from the window's left edge and 43 from its right. With the names
   * moved inside their own panes there is nothing left to reserve, and the tape
   * is centred by construction: `plotW = PANEL.w - 2 × pad` is the only width
   * that can balance, so it is derived rather than tuned.
   */
  const pad = 30;
  const plotTop = pad;
  return { headTop, pad, plotTop, plotW: PANEL.w - pad * 2 };
})();
/**
 * The price column's centre line. The axis labels and the last-price pill are
 * BOTH centred on it — right-aligning them lined up their right edges but left
 * their middles apart, because the pill carries padding the labels do not.
 */
export const AXIS_CX = 84;
/**
 * ═══ THE ROADMAP ═══
 *
 * Four cards from Simon's sketch: one on top, three in a row under it, each
 * captioned. 16:9 so a chart thumbnail sits in one without letterboxing.
 *
 * The row is the full safe width with two gaps, and the top card is the same
 * size centred — the sketch draws them equal, and equal cards say the four
 * chapters weigh the same.
 */
export const CARD = { w: 536, h: 302, gap: 60, label: 44 };
const MAP = {
  top: { x: 960 - CARD.w / 2, y: 126 },
  row: 570,
};
export const CARDS = [
  { x: MAP.top.x, y: MAP.top.y, text: "Introduction" },
  { x: 96, y: MAP.row, text: "Moving Average" },
  { x: 96 + CARD.w + CARD.gap, y: MAP.row, text: "Bollinger Bands" },
  { x: 96 + (CARD.w + CARD.gap) * 2, y: MAP.row, text: "Cara Pakai Indikator" },
];
/**
 * The graph-paper ground the roadmap sits on, from Simon's reference: a faint
 * grid on near-white, strongest in the middle and gone at the edges.
 *
 * It DRIFTS exactly one cell over `loop` frames, which is what makes the loop
 * seamless — at the end of the period the pattern is identical to its start,
 * so there is no frame where it jumps back.
 */
/**
 * ⚠ IT WAS A 1px RULE AT #E2E2E2, AND THAT WAS THE WHOLE BUG.
 *
 * Eight levels of grey on a one-pixel line every 84px. It rendered the entire
 * time — measured at (234,234,234) against white — and it survived nothing: a
 * 1px line averaged with its white neighbours the moment anything scaled the
 * frame down, so at any preview size, and at 720p, and on a phone, it was
 * literally the same colour as the paper. That is why it looked as though it
 * "appeared" late: `cardPush` magnifying the frame was the only thing that
 * ever made it wide enough to survive.
 *
 * A darker tone alone does not fix that — a 1px line still averages away. It
 * needs WIDTH. 2px at #C7CCD6 comes through a 50% downscale still reading as
 * graph paper, which is the test that matters: nobody watches this at 1:1.
 */
const GRID = {
  cell: 84,
  loop: 150,
  line: "#C7CCD6",
  /** ⚠ 2px, not 1. See the note above. */
  w: 2,
  paper: "#FAFAFA",
};

/**
 * The indicator buttons, floating under the timeframe row.
 *
 * 20px — smaller than every other readout in the panel, and deliberately: this
 * is a second row of controls under the first, and at the panel's own 30px the
 * pair ran from the price group all the way to the extension and sat on the
 * chart's wash. The padding is cut with the type so the chip stays a chip.
 */
export const BTN = { top: 108, gap: 10, padX: 16, padY: 8, size: 20 };
// ═══════════════════════════════════════════════════════════════════════════

const font = theme.type.family;
const C = theme.colors;

/**
 * The plot's width is LIVE — it shrinks once, to make room for the extension —
 * so every horizontal position is a function of it. Only the price axis is
 * fixed, and it is fixed PER CHART.
 */
const lx = (i: number, w: number) =>
  PLOT.x - PANEL.x + 14 + ((w - 28) * i) / (N - 1);
const bodyW = (w: number) => ((w - 28) / N) * 0.6;

/**
 * `period` closes BEFORE the first one on screen, walked backwards from it.
 *
 * Without these the average has no value until its twentieth bar and the line
 * starts a fifth of the way across — which would say this chart began the day
 * it was opened. The window is a SLICE of a series that was already running.
 */
const priorOf = (first: number, count: number, seed: number) => {
  const rnd = mulberry32(seed);
  const out: number[] = [];
  let v = first;
  for (let i = 0; i < count; i++) {
    v = v * (1 + (rnd() - 0.5) * 0.014);
    out.unshift(v);
  }
  return out;
};

type Pivot = { i: number; high: boolean; label?: string };

const makeChart = (sh: {
  t: string;
  name: string;
  price: number;
  change: string;
  up: boolean;
  anchors: Anchor[];
  seed: number;
  at: number;
  pivots: Pivot[];
}) => {
  const closes = fromAnchors(sh.anchors, N, sh.seed);
  const bars = toBars(closes, sh.seed + 1);
  const lo = Math.min(...bars.map((b) => b.l));
  const hi = Math.max(...bars.map((b) => b.h));
  /* Gridlines on a round step CHOSEN from the range: a fixed 200 gives four
     lines on a 900-point chart and eleven on a 2.000-point one. */
  const step = (() => {
    const want = (hi - lo) / 5;
    return [50, 100, 200, 250, 500, 1000, 2000].find((n) => n >= want) ?? 2000;
  })();
  const levels: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) levels.push(v);
  /**
   * ⚠ THE PLOT'S HEIGHT IS A PARAMETER NOW, and `y` is this function at the
   * panel's own height. VIDEO 22 stacks three study panes under this chart and
   * the price has to give them the room; a `y` closed over the constant could
   * only be squashed by scaling the drawing, which takes the type, the stroke
   * widths and the candle corners with it.
   *
   * ⚠ NOTHING IN THIS EPISODE PASSES A HEIGHT, so `y` is the same function it
   * has always been — proven pixel-identical across six frames of 019 after the
   * change, not assumed.
   *
   * 0.80, not 0.88: a LL label hangs UNDER its low, and at 0.88 the lowest bar
   * left no room for a chip above the month row.
   */
  const yAt = (
    v: number,
    h: number,
    top = PLOT.y - PANEL.y,
    span = 0.8,
    lead = 0.06,
  ) => top + h * (1 - (v - lo) / (hi - lo)) * span + h * lead;
  const y = (v: number) => yAt(v, PLOT.h);

  /**
   * ⚠ THE STUDIES ARE WARMED UP THE WAY THE AVERAGE IS. MACD does not exist
   * until its 26th bar and its signal for nine more after that; read off the
   * visible window alone, the line would start a third of the way across a
   * chart that is a SLICE of a series already running. 40 covers the longest of
   * the three with room to spare.
   *
   * ⚠ AND THE STOCHASTIC NEEDS BARS, NOT CLOSES, so the warm-up gets bars too.
   * Fed closes-as-flat-bars it would read 100 or 0 on every one of its first
   * thirteen values, which is a spike at the left edge of a picture whose whole
   * point is what the indicators say.
   */
  const warm = priorOf(closes[0], STUDY_WARM, sh.seed + 4);
  const warmFull = [...warm, ...closes];
  const warmBars = [...toBars(warm, sh.seed + 5), ...bars];
  const st = stochastic(warmBars, 14, 3);
  const mc = macd(warmFull, 12, 26, 9);
  const study = {
    rsi: rsi(warmFull, 14).slice(STUDY_WARM),
    k: st.k.slice(STUDY_WARM),
    d: st.d.slice(STUDY_WARM),
    macd: mc.line.slice(STUDY_WARM),
    signal: mc.signal.slice(STUDY_WARM),
    hist: mc.hist.slice(STUDY_WARM),
  };

  const prior = priorOf(closes[0], MA_PERIOD, sh.seed + 2);
  const full = [...prior, ...closes];
  const ma = sma(full, MA_PERIOD).slice(MA_PERIOD);
  const bbFull = bollinger(full, MA_PERIOD, 2);
  const bb = {
    upper: bbFull.upper.slice(MA_PERIOD),
    lower: bbFull.lower.slice(MA_PERIOD),
  };
  /* a second, slower average — only the roadmap's MOVING AVERAGE card uses it,
     and it needs its own longer prior history to start at that card's left */
  const slowPrior = priorOf(closes[0], SLOW_PERIOD, sh.seed + 3);
  const maSlow = sma([...slowPrior, ...closes], SLOW_PERIOD).slice(SLOW_PERIOD);

  /**
   * Swing points: highs on the bar's high, lows on its low. A swing marked at
   * the close floats inside the candle it names.
   *
   * ⚠ A CHART WITH NO PIVOTS TRACED GETS ITS OWN, FOUND. BBCA's and BBRI's were
   * read off Simon's screenshots by hand and stay that way; BMRI never had any,
   * because 019 never draws its structure — and VIDEO 22 asks for exactly that
   * line on exactly that chart. Typing a third list by eye would be a fourth
   * thing to keep in step with a tape that is generated; `swingsOf` follows it.
   *
   * ⚠ AND IT CHANGES NOTHING ALREADY DRAWN. The two hand-traced charts keep
   * their own lists, and 019 has no frame on which BMRI's structure is shown.
   */
  const pivots: Pivot[] = sh.pivots.length ? sh.pivots : swingsOf(bars, 6);
  const pt = pivots.map((p: Pivot) => ({
    ...p,
    y: y(p.high ? bars[p.i].h : bars[p.i].l),
  }));
  const zigAt = [0];
  for (let i = 1; i < pt.length; i++) {
    const dx = lx(pt[i].i, PLOT.w) - lx(pt[i - 1].i, PLOT.w);
    zigAt.push(zigAt[i - 1] + Math.hypot(dx, pt[i].y - pt[i - 1].y));
  }

  return {
    ...sh,
    pivots,
    closes,
    bars,
    lo,
    hi,
    levels,
    y,
    yAt,
    study,
    ma,
    maSlow,
    bb,
    pt,
    zigAt,
    zigLen: zigAt[zigAt.length - 1],
  };
};

/**
 * ═══ THE MARKET STRUCTURE ═══
 *
 * Every point is a SWING in the series its candles are drawn from, and every
 * label is checked against the swing of its own kind before it. The unlabelled
 * points are there because the line has to pass through them for the labelled
 * ones to be true — an LH is only a lower high next to the high before it.
 *
 *   BBCA   LH 6.800@10 < 6.900@0 · LL 5.900@24 < 6.450@6 · LH 6.300@30 <
 *          6.800@10 · LL 4.850@41 < 5.900@24 · HH 6.500@49 > 6.300@30 (the
 *          turn) · HL 5.650@60 > 4.850@41 · HH 6.550@76 > 6.500@49 ·
 *          HL 6.200@82 > 5.650@60. The 88–104 tail is a range, not a trend:
 *          a lower high AND a higher low, so it is left unnamed.
 *
 *   BBRI   LH 3.500@18 < 3.600@2 · LL 3.120@29 < 3.180@14 · LH 3.200@43 <
 *          3.300@32 · LL 2.500@49 < 3.050@38 · HL 2.650@66 > 2.500@49 ·
 *          HH 3.150@90 > 3.100@77.
 *
 * BMRI carries none. By the time it is in the window the reading is being done
 * by the indicators, and that is the whole comparison.
 */
const BBCA_PIVOTS: Pivot[] = [
  { i: 0, high: true },
  { i: 6, high: false },
  { i: 10, high: true, label: "LH" },
  { i: 24, high: false, label: "LL" },
  { i: 30, high: true, label: "LH" },
  { i: 41, high: false, label: "LL" },
  { i: 49, high: true, label: "HH" },
  { i: 60, high: false, label: "HL" },
  { i: 76, high: true, label: "HH" },
  { i: 82, high: false, label: "HL" },
  { i: 88, high: true },
  { i: 96, high: false },
  { i: 104, high: true },
];
const BBRI_PIVOTS: Pivot[] = [
  { i: 2, high: true },
  { i: 14, high: false },
  { i: 18, high: true, label: "LH" },
  { i: 29, high: false, label: "LL" },
  { i: 32, high: true },
  { i: 38, high: false },
  { i: 43, high: true, label: "LH" },
  { i: 49, high: false, label: "LL" },
  { i: 55, high: true },
  { i: 66, high: false, label: "HL" },
  { i: 77, high: true },
  { i: 82, high: false },
  { i: 90, high: true, label: "HH" },
  { i: 94, high: false },
  { i: 104, high: true },
];

const CHARTS = [
  makeChart({
    t: "BBCA",
    name: "Bank Central Asia",
    price: 6325,
    change: "+0,40%",
    up: true,
    anchors: BBCA_1D,
    seed: 4041,
    at: 0,
    pivots: BBCA_PIVOTS,
  }),
  makeChart({
    t: "BBRI",
    name: "Bank Rakyat Indonesia",
    price: 3220,
    change: "+3,20%",
    up: true,
    anchors: BBRI_1D,
    seed: 5150,
    at: T.bbri,
    pivots: BBRI_PIVOTS,
  }),
  makeChart({
    t: "BMRI",
    name: "Bank Mandiri",
    price: 4210,
    change: "+0,70%",
    up: true,
    anchors: BMRI_1D,
    seed: 6260,
    at: T.bmri,
    pivots: [],
  }),
];
/**
 * SC01's BMRI tape — the third chart in the broker session, and the one the
 * roadmap's fourth card carries.
 *
 * SC11 draws its reading on THIS, not on a series of its own: the scene argues
 * that indicators sit on top of what you already read on the chart, and it
 * lands harder on a chart the viewer has already watched for half a minute
 * than on a fourth synthetic tape they have never seen.
 */
export const BMRI_TAPE = {
  closes: CHARTS[2].closes,
  bars: CHARTS[2].bars,
  /**
   * ⚠ AND ITS INDICATORS, computed HERE with an invented warm-up history so
   * they have a value on bar 0. SC11 needs them to start at the chart's left
   * edge — "anggap saja ada chart lagi di luar chart yang ini" — and a 20-bar
   * average computed from this window alone is null until bar 19, which draws
   * as a line that begins a fifth of the way in.
   *
   * `MA_PERIOD` here is 20, the same period SC11 wants, so these are its
   * indicators and not merely similar ones.
   */
  ma: CHARTS[2].ma,
  bb: CHARTS[2].bb,
};

/** Each chart's own structure timing. BMRI has none. */
const ZIG = [T.zig, T.zigBbri, null];
/**
 * Labels lead the line slightly. Keyed to the raw fraction the LAST one sits
 * at exactly 1.0, which the draw only reaches on its final frame — so it never
 * appeared at all.
 */
const ZIG_LEAD = 0.9;

type Chart = (typeof CHARTS)[number];

/** ⚠ THEY TAKE THE CHART'S OWN x, not a width to re-derive it from. The plot's
 *  left edge moves in bare mode, so a second copy of that arithmetic in here is
 *  a second copy that can disagree with the tape's. */
const pathOf = (
  v: (number | null)[],
  x: (i: number) => number,
  y: (n: number) => number,
) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${x(i).toFixed(1)},${y(n).toFixed(1)} `;
  });
  return d.trim();
};
const lenOf = (
  v: (number | null)[],
  x: (i: number) => number,
  y: (n: number) => number,
) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  v.forEach((n, i) => {
    if (n === null) return;
    const q = { x: x(i), y: y(n) };
    if (prev) len += Math.hypot(q.x - prev.x, q.y - prev.y);
    prev = q;
  });
  return len;
};

/**
 * ═══ THE CARD THUMBNAILS ═══
 *
 * Each is drawn from a chart THIS SCENE ALREADY HOLDS, not from a new series:
 * the roadmap is a contents page for the episode, and a contents page whose
 * pictures are of something else is a decoration.
 *
 * Their own tiny coordinate space — the panel's `y` is bound to the panel's
 * geometry and cannot be reused at a tenth of the size.
 */
const pad = 18;
type Box = { x: number; y: number };
const mx = (i: number, n: number, c: Box) =>
  c.x + pad + ((CARD.w - pad * 2) * i) / (n - 1);
const my = (v: number, lo: number, hi: number, c: Box) =>
  c.y +
  CARD.h -
  pad -
  ((v - lo) / Math.max(1e-9, hi - lo)) * (CARD.h - pad * 2);
/** A series as a path in one card's space, skipping a warm-up's leading nulls. */
const thumbPath = (v: (number | null)[], lo: number, hi: number, c: Box) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${mx(i, v.length, c).toFixed(1)},${my(n, lo, hi, c).toFixed(1)} `;
  });
  return d.trim();
};
/** The range a card has to hold — every series it draws, and its own bars. */
const spanOf = (
  parts: (number | null)[][],
  bars: { h: number; l: number }[] = [],
) => {
  const all: number[] = [];
  parts.forEach((p) => p.forEach((n) => n !== null && all.push(n)));
  bars.forEach((b) => all.push(b.h, b.l));
  return [Math.min(...all), Math.max(...all)] as const;
};

/**
 * ═══ THE BROKER PANEL ═══
 *
 * The session SC01 opens on, and the picture that lands in the roadmap's
 * INTRODUCTION card. It is a component rather than markup inside SC01 because
 * the CLOSING roadmap has to draw that same card, and hand-drawing a likeness
 * of a panel this dense is how two pictures quietly stop matching.
 *
 * Every local it needs comes from `f`, so a caller that wants it FROZEN — the
 * closing roadmap does — simply passes a constant frame.
 */
export const BrokerPanel = ({
  f,
  shrink = 1,
  structure = true,
  portfolio = false,
  chart,
  marks,
  pnl,
  alpha: alphaOf,
  zig,
  levels,
  extension = true,
  studies,
  bare = false,
}: {
  f: number;
  /**
   * How far the panel has closed into a card. Only its own outline uses it:
   * the border fades as the roadmap card's takes over, otherwise it rides the
   * shrink as a second, nested card border. A caller drawing the panel already
   * LANDED — the closing roadmap — leaves it at 1 and has no outline of its own.
   */
  shrink?: number;
  /**
   * ⚠ OFF HIDES THE ZIGZAG AND ITS HL/HH/LH/LL LABELS. Added for VIDEO 22,
   * which borrows this panel for a frame where the market structure is not what
   * is being talked about. Defaults to on, so nothing in this episode changes.
   */
  structure?: boolean;
  /**
   * ⚠ TURNS THE RIGHT-HAND EXTENSION FROM A WATCHLIST INTO A PORTFOLIO. Added
   * for VIDEO 22, where the panel is showing what somebody OWNS rather than
   * what they are following — so the prices come off (a holding's last price
   * says nothing about the holding) and the two remaining columns get named.
   * Defaults to off, so nothing in this episode changes.
   */
  portfolio?: boolean;
  /**
   * ⚠ FORCES WHICH NAME IS IN THE WINDOW, instead of letting the frame decide.
   * Added for VIDEO 22, which holds this panel on one frame: the frame that has
   * the list open and settled is not the frame BBCA is up on, so without this
   * the two could never both be had.
   */
  chart?: string;
  /**
   * ⚠ A BADGE ON EVERY SWING OF THE CHART IN THE WINDOW. Added for VIDEO 22's
   * overtrading scene, where the point is that somebody acted at all of them —
   * so the same pivots the structure is traced from get a label each, and the
   * caller owns the timing: `shown(k)` is that badge's own 0→1, the way
   * core's Candles takes a `wipe`.
   */
  marks?: { text: string; shown: (k: number, t: string) => number };
  /**
   * ⚠ REPLACES THE RIGHT-HAND COLUMN'S NUMBER, ticker by ticker. A watchlist's
   * number is the market's move and belongs to the ticker; a portfolio's is the
   * holder's own and cannot be derived from anything on this panel — so it is
   * handed in. The sign decides the colour, so a caller cannot state a loss in
   * green.
   */
  pnl?: Record<string, string>;
  /**
   * ⚠ OVERRIDES WHICH CHART IS ON SCREEN, per ticker, 0→1. `chart` says which
   * one the HEADER and the selected row are about; this says what is drawn, so
   * a caller holding one frame can still cross-fade between two of them.
   */
  alpha?: (t: string) => number;
  /**
   * ⚠ DRAWS THE ACTIVE CHART'S STRUCTURE ON THE CALLER'S OWN CURVE. `drawn` is
   * the 0→1 the line and its rings ride; `labels` is off by default, because the
   * episode that borrows this usually wants the shape without the naming.
   */
  zig?: { drawn: number; labels?: boolean; opacity?: number };
  /**
   * ⚠ THE ACTIVE CHART'S OWN EXTREMES, as two lines. Nothing is chosen: the
   * support is its lowest low and the resistance its highest high, so neither
   * can be a level this panel does not actually show.
   */
  levels?: { shown: number; opacity?: number };
  /**
   * ⚠ OFF REMOVES THE RIGHT-HAND COLUMN ENTIRELY, watchlist and portfolio
   * alike, and gives the 400px back to the chart. Added for VIDEO 22 — Simon:
   * "jangan include watchlist ya di sebelah kanan ya" — which holds this panel
   * on a frame where the column is long since open, so hiding it by choosing an
   * earlier frame was never available. Defaults to on, so 019 is untouched.
   */
  extension?: boolean;
  /**
   * ⚠ THREE PANES UNDER THE PRICE — RSI, stochastic and MACD, in that order —
   * AND THE PRICE PLOT SHRINKS TO PAY FOR THEM. See `STUDY`: the panel gets
   * taller, the chart gets shorter, and the month row moves to the foot of the
   * stack, because three studies wedged into the room the price already had is
   * the collision Simon ruled out rather than the crowding the scene is about.
   *
   * `shown(i)` is each pane's own 0→1, so the caller owns the timing — the same
   * shape as `marks`.
   */
  studies?: { shown: (i: number) => number };
  /**
   * ⚠ THE PANEL TAKEN APART INTO A HEADER AND A CHART — VIDEO 22, over three of
   * Simon's turns. The ticker group lifts OUT of the window and aligns to the
   * logo; the window stays, white, around what is left, which is only the
   * chart. The clip has to go even though the card does not: the header now
   * stands above this panel's own top edge and a panel that still clipped would
   * cut it off.
   *
   * ⚠ IT ALSO TAKES THE CHROME AND THE READOUTS, each asked for by name: the
   * timeframe pills, the two indicator buttons, the dashed last-price line, the
   * price chip on the axis, the big price with its change, and the numbers down
   * the price axis. A broker's UI rather than the chart.
   *
   * ⚠ AND THE CHART THEN FILLS THE WINDOW. Two things were paying for
   * something that has gone — 200px of header room and a 150px price-number
   * gutter — so the plot takes both back. See BARE.
   */
  bare?: boolean;
}) => {
  /**
   * The extension opens once and stays. The plot's width is derived from it,
   * so the candles, the structure and the indicator lines all narrow together
   * rather than being scaled — text on a scaled group is text that stretches.
   */
  const open = extension ? progressInOut(f, T.list.in, T.list.over) : 0;
  /** ⚠ THE PANEL IS AS TALL AS WHAT IS IN IT. With the studies open that is
   *  STUDY.height, which is a sum of the stack rather than a second number that
   *  has to agree with it. */
  const panelH = studies ? STUDY.height : PANEL.h;
  /**
   * ⚠ WITH THE WALLS DOWN THE PLOT TAKES BACK WHAT IT WAS PAYING FOR. The 200px
   * that held a header now standing outside the window, and the 150px gutter
   * that held price numbers Simon has deleted — see BARE. Everything below is
   * then a function of those three, so no position here is typed twice.
   */
  const plotTop = bare ? BARE.plotTop : PLOT.y - PANEL.y;
  const plotH = studies ? (bare ? STUDY.bareH - BARE.plotTop : STUDY.plotH) : PLOT.h;
  const px0 = bare ? BARE.pad : PLOT.x - PANEL.x;
  const plotW = bare ? BARE.plotW : PLOT.w - LIST.take * open;
  /** ⚠ A FULLER SPAN WHEN THERE IS A WINDOW TO FILL, and still enough slack for
   *  the two level labels — "Resistance" hangs 12 above its line and "Support"
   *  30 below its own. At 0.84/0.06 of a 490px plot that is 29 above and 49
   *  below. */
  const plotSpan = bare ? 0.84 : 0.8;


  /** Which chart the window is on, and therefore which row is selected. */
  const pick = chart ? CHARTS.findIndex((c) => c.t === chart) : -1;
  const active = pick < 0 ? CHARTS.reduce((k, c, i) => (f >= c.at ? i : k), 0) : pick;
  /**
   * A chart is up from its own frame until the next one takes over — unless a
   * caller has NAMED one, in which case there is no cross-fade to be in the
   * middle of and the answer is simply yes or no.
   */
  const alpha = (i: number) => {
    if (alphaOf) return alphaOf(CHARTS[i].t);
    if (pick >= 0) return i === pick ? 1 : 0;
    const inA = i === 0 ? 1 : progress(f, CHARTS[i].at, T.swapOver);
    const next = CHARTS[i + 1];
    return inA * (next ? 1 - progress(f, next.at, T.swapOver) : 1);
  };

  const maOn = f >= T.ma;
  const bbOn = f >= T.bb;

  return (
    <>
      {/* ── the panel ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: panelH,
          borderRadius: theme.layout.radius.lg,
          /** ⚠ THE CARD IS BACK IN BARE MODE, and it is a different card. It
           *  used to be the whole panel's, header and chrome inside it; the
           *  header now stands above it and the chrome is gone, so what it
           *  encloses is only the chart — which is what Simon asked for:
           *  "berikan window putih untuk chartnya sebagai background". */
          background: C.surface,
          /* the panel's own outline fades as the mask takes over — otherwise
         it rides the shrink as a second, nested card border. C.border is
         #D8DBE0; the alpha is what animates */
          border: bare
            ? "none"
            : `${theme.layout.border.thin}px solid rgba(216, 219, 224, ${(1 - shrink).toFixed(3)})`,
          /** ⚠ AND THE CLIP GOES WITH THE CARD. The header lifts to the logo's
           *  line, which is above this panel's own top edge. */
          overflow: bare ? "visible" : "hidden",
        }}
      >
        {/* the chart's own ground — a wash, hue-locked to the palette */}
        {!bare && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 168,
            width: PANEL.w,
            height: panelH - 168,
            background: `linear-gradient(180deg, ${C.indigo12} 0%, ${C.cyan12} 46%, ${C.surface} 100%)`,
          }}
        />
        )}

        {/* ── header: it belongs to whichever chart is up ── */}
        {CHARTS.map((ch, i) => {
          const o = alpha(i);
          if (o <= 0.001) return null;
          return (
            <div key={ch.t} style={{ opacity: o }}>
              <div
                style={{
                  position: "absolute",
                  left: HEAD.x,
                  top: bare ? BARE.headTop : 36,
                  display: "flex",
                  alignItems: "center",
                  gap: HEAD.gap,
                }}
              >
                <div
                  style={{
                    width: HEAD.avatar,
                    height: HEAD.avatar,
                    borderRadius: HEAD.avatar / 2,
                    background: C.indigo,
                    color: C.surface,
                    fontFamily: font,
                    fontSize: UI.size,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ch.t[0]}
                </div>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: UI.name,
                    fontWeight: UI.weight,
                    color: C.text,
                  }}
                >
                  {ch.t}
                </span>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: UI.size,
                    fontWeight: UI.weight,
                    color: C.textMuted,
                  }}
                >
                  {ch.name}
                </span>
                {/* real ticker, traced candles — see the header note */}
                <span
                  style={{
                    fontFamily: font,
                    fontSize: UI.size,
                    fontWeight: UI.weight,
                    color: C.textMuted,
                    border: `${theme.layout.border.thin}px solid ${C.border}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: "4px 14px",
                  }}
                >
                  Ilustrasi
                </span>
              </div>

              {/* left edge on the ticker, not on the avatar beside it */}
              {!bare && (
              <div
                style={{
                  position: "absolute",
                  left: HEAD.x + HEAD.avatar + HEAD.gap,
                  top: 92,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: font,
                    fontSize: UI.price,
                    fontWeight: 800,
                    color: C.text,
                    lineHeight: 1,
                  }}
                >
                  {fmtRp(ch.price)}
                </span>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: UI.size,
                    fontWeight: UI.weight,
                    color: ch.up ? C.candleGreen : C.candleRed,
                    background: ch.up
                      ? "rgba(34, 181, 115, 0.12)"
                      : "rgba(229, 71, 93, 0.12)",
                    borderRadius: theme.layout.radius.sm,
                    padding: "6px 16px",
                  }}
                >
                  {ch.change}
                </span>
              </div>
              )}
            </div>
          );
        })}

        {/* Timeframe pills. They belong to the CHART WINDOW, not to the
        panel, so they travel left with its right edge when the extension
        opens: without that the chart appears to shrink under its own
        controls instead of making room beside them. */}
        {!bare && (
        <div
          style={{
            position: "absolute",
            right: 40 + LIST.take * open,
            top: 40,
            display: "flex",
            gap: 8,
          }}
        >
          {FRAMES.map((t) => {
            const live = t === ACTIVE;
            return (
              <span
                key={t}
                style={{
                  fontFamily: font,
                  fontSize: UI.size,
                  fontWeight: UI.weight,
                  color: live ? C.surface : C.textMuted,
                  background: live ? C.indigo : C.indigo12,
                  borderRadius: theme.layout.radius.sm,
                  padding: "8px 20px",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
        )}

        {/* ── the two indicator buttons, under the timeframes ── */}
        {!bare && f >= T.buttons && (
          <div
            style={{
              position: "absolute",
              right: 40 + LIST.take * open,
              top: BTN.top,
              display: "flex",
              gap: BTN.gap,
              opacity: progress(f, T.buttons, theme.motion.revealF),
            }}
          >
            {[
              { label: "Moving Average", on: maOn, at: T.ma },
              { label: "Bollinger Bands", on: bbOn, at: T.bb },
            ].map((b) => {
              /* the switch is a cross-fade between the two skins, so fill,
             border and label arrive together instead of snapping */
              const sel = b.on ? progress(f, b.at, 10) : 0;
              const pick = (off: string, onC: string) =>
                sel > 0.5 ? onC : off;
              return (
                <span
                  key={b.label}
                  style={{
                    fontFamily: font,
                    fontSize: BTN.size,
                    fontWeight: UI.weight,
                    color: pick(C.textMuted, C.surface),
                    background: pick(C.surface, C.indigo),
                    border: `${theme.layout.border.thin}px solid ${pick(C.border, C.indigo)}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: `${BTN.padY}px ${BTN.padX}px`,
                  }}
                >
                  {b.label}
                </span>
              );
            })}
          </div>
        )}

        {/* ── the charts ── */}
        {CHARTS.map((ch: Chart, n) => {
          const o = alpha(n);
          if (o <= 0.001) return null;
          const zt = ZIG[n];
          /** ⚠ THE CALLER'S CURVE WINS. `zig` hands the draw in, which is the
           *  only way a panel held on one frame can have a line arrive on it. */
          const own = structure && zt && f >= zt.from;
          const drawn = zig ? zig.drawn : zt ? progressInOut(f, zt.from, zt.dur) : 0;
          const zigOn = zig ? n === active && zig.drawn > 0.001 : own;
          const zigLabels = zig ? !!zig.labels : true;
          const isBmri = n === 2;
          /**
           * ⚠ EVERY PRICE ON THIS CHART GOES THROUGH `Y`, not through `ch.y`.
           * The two are the same function whenever no studies are open — same
           * object is not guaranteed, same VALUE is — so 019 draws what it
           * always drew, and the studies case squashes the MAPPING rather than
           * the drawing.
           */
          const Y = (v: number) => ch.yAt(v, plotH, plotTop, plotSpan);
          /** ⚠ AND EVERY x GOES THROUGH `X`, not through the module's `lx`. The
           *  plot's LEFT EDGE moves in bare mode — the price numbers it used to
           *  leave room for are gone — so an origin baked into `lx` would put
           *  the tape and the studies in different places. */
          const X = (i: number) => px0 + 14 + ((plotW - 28) * i) / (N - 1);
          /**
           * The swings, and the length the zigzag draws along, at this mapping.
           * Recomputed rather than scaled: the line's length is not a linear
           * function of the plot's height, because its x-run does not move.
           *
           * ⚠ ALWAYS RECOMPUTED, NEVER SHORT-CIRCUITED. This read `plotH ===
           * PLOT.h ? ch.pt : …` and that was a test of ONE of the four things
           * the mapping is made of. Bare mode happens to land on 490 — the same
           * height — with a different top and a different span, so the shortcut
           * fired and drew the structure of a chart that was not on screen: the
           * zigzag ran a third of the way down into the study panes. `Y` is
           * `ch.y` exactly when nothing has been overridden, so there is
           * nothing to save here anyway.
           */
          const pts = ch.pivots.map((pv) => ({
            ...pv,
            y: Y(pv.high ? ch.bars[pv.i].h : ch.bars[pv.i].l),
          }));
          const zAt = [0];
          for (let i = 1; i < pts.length; i++) {
            const dx = X(pts[i].i) - X(pts[i - 1].i);
            zAt.push(zAt[i - 1] + Math.hypot(dx, pts[i].y - pts[i - 1].y));
          }
          const zLen = zAt[zAt.length - 1];
          return (
            <svg
              key={ch.t}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                overflow: "visible",
              }}
              width={PANEL.w}
              height={panelH}
              opacity={o}
            >
              {ch.levels.map((v) => (
                <g key={v}>
                  <line
                    x1={px0}
                    y1={Y(v)}
                    x2={px0 + plotW}
                    y2={Y(v)}
                    stroke={C.gridline}
                    strokeWidth={theme.layout.border.thin}
                    strokeDasharray="2 8"
                  />
                  {/* ⚠ NO PRICE NUMBERS WITH THE WALLS DOWN — Simon: "hapus
                      angka harga". The gridlines stay: they are how a wick is
                      read against the one before it, and they say nothing the
                      numbers were saying. */}
                  {!bare && (
                  <text
                    x={AXIS_CX}
                    y={Y(v) + 10}
                    textAnchor="middle"
                    fontFamily={font}
                    fontSize={UI.size}
                    fontWeight={UI.axis}
                    fill={C.textMuted}
                  >
                    {fmtRp(v)}
                  </text>
                  )}
                </g>
              ))}

              {/* the tape is simply THERE — no entrance */}
              {ch.bars.map((b, i) => {
                const x = X(i);
                const top = Math.min(Y(b.o), Y(b.c));
                const h = Math.max(2, Math.abs(Y(b.c) - Y(b.o)));
                const up = b.c >= b.o;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={Y(b.h)}
                      x2={x}
                      y2={Y(b.l)}
                      stroke={up ? C.candleGreen : C.candleRed}
                      strokeWidth={theme.layout.stroke.wick}
                    />
                    <rect
                      x={x - bodyW(plotW) / 2}
                      y={top}
                      width={bodyW(plotW)}
                      height={h}
                      rx={2}
                      fill={up ? C.candleGreen : C.candleRed}
                    />
                  </g>
                );
              })}

              {/* ── the market structure, traced by hand ── */}
              {zigOn && (
                <g opacity={zig?.opacity ?? 1}>
                  <path
                    d={pts
                      .map(
                        (p, i) =>
                          `${i === 0 ? "M" : "L"}${X(p.i).toFixed(1)},${p.y.toFixed(1)}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke={C.indigo}
                    strokeWidth={theme.layout.stroke.ma}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={zLen}
                    strokeDashoffset={zLen * (1 - drawn)}
                  />
                  {pts.map((pv, k) => {
                    /* a point waits for the LINE to reach it, not for a frame
                   number guessed off the easing curve */
                    const a = clamp01(
                      (drawn - (zAt[k] / zLen) * ZIG_LEAD) * 9,
                    );
                    if (a <= 0.001) return null;
                    const w = 74;
                    const cx = X(pv.i);
                    const cy = pv.high ? pv.y - 18 : pv.y + 18;
                    return (
                      <g key={pv.i} opacity={a}>
                        {/* a NAMED swing gets a ring; a turn the line merely
                        passes through gets a dot */}
                        <circle
                          cx={cx}
                          cy={pv.y}
                          r={pv.label ? 9 : 5}
                          fill={pv.label ? C.surface : C.indigo}
                          stroke={C.indigo}
                          strokeWidth={theme.layout.border.thick}
                        />
                        {zigLabels && pv.label && (
                          <>
                            <rect
                              x={cx - w / 2}
                              y={pv.high ? cy - 46 : cy}
                              width={w}
                              height={46}
                              rx={theme.layout.radius.sm}
                              fill={C.indigo12}
                              stroke={C.indigo}
                              strokeWidth={theme.layout.border.thin}
                            />
                            <text
                              x={cx}
                              y={(pv.high ? cy - 46 : cy) + 33}
                              textAnchor="middle"
                              fontFamily={font}
                              fontSize={UI.size}
                              fontWeight={700}
                              fill={C.indigo}
                            >
                              {pv.label}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ── the chart's own extremes, as two lines ──
                  ⚠ NOTHING IS CHOSEN HERE. The support is this chart's lowest
                  low and the resistance its highest high, read off the same
                  bars it is drawn from — so neither can be a level the panel
                  does not actually show. */}
              {levels && n === active && levels.shown > 0.001 && (
                <g opacity={levels.opacity ?? 1}>
                  {[
                    { v: ch.hi, text: "Resistance", above: true },
                    { v: ch.lo, text: "Support", above: false },
                  ].map((L) => (
                    <g key={L.text}>
                      {/* ⚠ FROM THE FIRST CANDLE TO THE LAST — Simon. A level
                          drawn to the plot's edges claims to hold over ground
                          the chart does not show; drawn between the bars, it
                          says only what those bars say. */}
                      <line
                        x1={X(0)}
                        y1={Y(L.v)}
                        x2={X(0) + (X(N - 1) - X(0)) * levels.shown}
                        y2={Y(L.v)}
                        stroke={C.indigo}
                        strokeWidth={theme.layout.stroke.ma}
                        strokeLinecap="round"
                      />
                      <text
                        x={X(0)}
                        y={Y(L.v) + (L.above ? -12 : 30)}
                        fontFamily={font}
                        fontSize={22}
                        fontWeight={600}
                        fill={C.indigo}
                      >
                        {L.text}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* ── a badge on every swing ──
                  ⚠ IT IS THE SAME LIST OF POINTS THE STRUCTURE IS TRACED FROM,
                  which is the whole reason this belongs here and not in the
                  scene above: the swings are known in this closure and nowhere
                  else. Above a high and below a low, like the structure labels
                  were, so a badge never sits on the bar it is about. */}
              {marks &&
                pts.map((pv, k) => {
                  const a = marks.shown(k, ch.t);
                  if (a <= 0.001) return null;
                  const bw = 62;
                  const bh = 32;
                  const cx = X(pv.i);
                  const by = pv.high ? pv.y - 14 - bh : pv.y + 14;
                  return (
                    <g key={`mk${pv.i}`} opacity={a}>
                      <rect
                        x={cx - bw / 2}
                        y={by}
                        width={bw}
                        height={bh}
                        rx={theme.layout.radius.sm}
                        fill={C.candleGreen}
                      />
                      <text
                        x={cx}
                        y={by + 23}
                        textAnchor="middle"
                        fontFamily={font}
                        fontSize={20}
                        fontWeight={700}
                        fill={C.surface}
                      >
                        {marks.text}
                      </text>
                    </g>
                  );
                })}

              {/* ── the bands, under the average ── */}
              {isBmri && bbOn && (
                <g opacity={progress(f, T.bb, theme.motion.revealF)}>
                  <path
                    d={`${pathOf(ch.bb.upper, X, Y)} ${ch.bb.lower
                      .map((v, i) =>
                        v === null
                          ? ""
                          : `L${X(i).toFixed(1)},${Y(v).toFixed(1)}`,
                      )
                      .reverse()
                      .join(" ")} Z`}
                    fill={C.bbTosca}
                    fillOpacity={0.1}
                    stroke="none"
                  />
                  {[ch.bb.upper, ch.bb.lower].map((band, k) => (
                    <path
                      key={k}
                      d={pathOf(band, X, Y)}
                      fill="none"
                      stroke={C.bbTosca}
                      strokeWidth={theme.layout.stroke.band}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...drawPath(
                        f,
                        T.bb,
                        T.drawOver,
                        lenOf(band, X, Y),
                      )}
                    />
                  ))}
                </g>
              )}

              {/* ── the average ── */}
              {isBmri && maOn && (
                <path
                  d={pathOf(ch.ma, X, Y)}
                  fill="none"
                  stroke={C.maOrange}
                  strokeWidth={theme.layout.stroke.ma}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...drawPath(f, T.ma, T.drawOver, lenOf(ch.ma, X, Y))}
                />
              )}

              {/* the last-price line, and nothing else on it — the readout it
              carries is the pill on the axis */}
              {!bare && (
                <line
                  x1={px0}
                  y1={Y(ch.price)}
                  x2={px0 + plotW}
                  y2={Y(ch.price)}
                  stroke={C.text}
                  strokeWidth={theme.layout.border.thin}
                  strokeDasharray="8 8"
                />
              )}

              {/* ═══ THE THREE STUDIES, UNDER THE PRICE ═══  (VIDEO 22)

                  ⚠ EVERY LINE IN HERE IS INDIGO OR CYAN. The green and red on
                  this panel belong to candle bodies and to nothing else, and a
                  histogram coloured by sign is exactly the place that rule gets
                  broken by accident — so the MACD's bars read indigo above zero
                  and cyan below, which is a hue pair rather than a verdict.

                  ⚠ THE NAME SITS IN THE PRICE AXIS'S GUTTER, left of where the
                  first candle starts, so it cannot land on the line it names.
                  Simon: "jangan ada yang bertabrakan". */}
              {studies &&
                STUDY.names.map((label, k) => {
                  const on = studies.shown(k);
                  if (on <= 0.001) return null;
                  const top = STUDY.at + k * (STUDY.pane + STUDY.gap);
                  const x0 = X(0);
                  const x1 = X(N - 1);
                  /**
                   * 0→1 up the pane, from its own floor — and the top of that
                   * travel stops BELOW the name's row, so no line can ever
                   * reach the words. That is the whole reason the panes grew
                   * from 62 to 78: the label came inside when the gutter went,
                   * and the line kept its own height rather than paying for it.
                   */
                  const py = (t: number) =>
                    top +
                    STUDY.pane -
                    STUDY.inset -
                    t * (STUDY.pane - STUDY.labelH - STUDY.inset * 2);
                  const path = (vs: (number | null)[], t: (v: number) => number) =>
                    vs
                      .map((v, i) => (v === null ? "" : `${i === 0 || vs[i - 1] === null ? "M" : "L"}${X(i).toFixed(1)},${py(t(v)).toFixed(1)}`))
                      .join(" ");
                  const band = (t: number) => (
                    <line
                      key={t}
                      x1={x0}
                      y1={py(t)}
                      x2={x1}
                      y2={py(t)}
                      stroke={C.gridline}
                      strokeWidth={theme.layout.border.thin}
                      strokeDasharray="2 8"
                    />
                  );
                  const pct = (v: number) => v / 100;
                  /**
                   * ⚠ MACD HAS NO 0→100, so it is scaled to its OWN range with
                   * zero forced into it — and zero lands wherever it actually
                   * falls rather than in the middle. Centred instead, a series
                   * that is mostly one side of zero spends half the pane empty.
                   *
                   * ⚠ AND THE RANGE IS THE HISTOGRAM'S ALONE — Simon: "buat macd
                   * nya tanpa garis". With the two lines gone, scaling to their
                   * spread would leave the only thing still drawn squeezed into
                   * the middle of its own pane by series nobody can see. On this
                   * tape that is the difference between ±213 and −56…+74.
                   */
                  const vals = [...ch.study.hist, 0].filter((v): v is number => v !== null);
                  const mLo = Math.min(...vals);
                  const mHi = Math.max(...vals);
                  const sig = (v: number) => (v - mLo) / Math.max(1e-9, mHi - mLo);
                  return (
                    <g key={label} opacity={on}>
                      {/* ⚠ THE PANE IS THE TAPE'S OWN COLUMN. It starts and
                          ends where the plot does, so the three studies and the
                          chart above them share one left edge and one right
                          edge — which is what makes them read as panes of one
                          picture rather than three boxes near it. */}
                      <rect
                        x={px0}
                        y={top}
                        width={plotW}
                        height={STUDY.pane}
                        rx={theme.layout.radius.sm}
                        fill={C.surface}
                        fillOpacity={0.62}
                      />
                      <text
                        x={x0}
                        y={top + STUDY.labelH}
                        fontFamily={font}
                        fontSize={20}
                        fontWeight={UI.weight}
                        fill={C.textMuted}
                        letterSpacing={1}
                      >
                        {label}
                      </text>
                      {k === 0 && (
                        <>
                          {[30, 70].map((v) => band(pct(v)))}
                          <path d={path(ch.study.rsi, pct)} fill="none" stroke={C.indigo} strokeWidth={theme.layout.stroke.ma} strokeLinejoin="round" strokeLinecap="round" />
                        </>
                      )}
                      {k === 1 && (
                        <>
                          {[20, 80].map((v) => band(pct(v)))}
                          <path d={path(ch.study.k, pct)} fill="none" stroke={C.indigo} strokeWidth={theme.layout.stroke.ma} strokeLinejoin="round" strokeLinecap="round" />
                          <path d={path(ch.study.d, pct)} fill="none" stroke={C.cyan} strokeWidth={theme.layout.stroke.ma} strokeLinejoin="round" strokeLinecap="round" />
                        </>
                      )}
                      {k === 2 && (
                        <>
                          {band(sig(0))}
                          {ch.study.hist.map((v, i) =>
                            v === null ? null : (
                              <rect
                                key={i}
                                x={X(i) - bodyW(plotW) / 2}
                                y={Math.min(py(sig(0)), py(sig(v)))}
                                width={bodyW(plotW)}
                                height={Math.max(1, Math.abs(py(sig(v)) - py(sig(0))))}
                                fill={v >= 0 ? C.indigo : C.cyan}
                                /** ⚠ FULL STRENGTH NOW. The bars were a wash
                                 *  behind two lines; with the lines gone they
                                 *  are the pane, and a pane drawn at a third of
                                 *  its own ink reads as something switched
                                 *  off. */
                                fillOpacity={0.9}
                              />
                            ),
                          )}
                        </>
                      )}
                    </g>
                  );
                })}

              {AXIS.map((t, i) => (
                <text
                  key={t}
                  x={
                    px0 + 14 + ((plotW - 28) * i) / (AXIS.length - 1)
                  }
                  /* the panel clips: a baseline below its height is a label
                 cut in half */
                  y={studies ? STUDY.axisY : plotTop + plotH + 34}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={UI.size}
                  fontWeight={UI.axis}
                  fill={C.textMuted}
                >
                  {t}
                </text>
              ))}
            </svg>
          );
        })}

        {/* the price the crosshair sits on, on the axis */}
        {!bare &&
        CHARTS.map((ch, i) => {
          const o = alpha(i);
          if (o <= 0.001) return null;
          return (
            <div
              key={ch.t}
              style={{
                position: "absolute",
                left: AXIS_CX,
                transform: "translateX(-50%)",
                top: ch.yAt(ch.price, plotH, plotTop, plotSpan) - 22,
                opacity: o,
                background: C.text,
                color: C.surface,
                fontFamily: font,
                fontSize: UI.size,
                fontWeight: UI.weight,
                borderRadius: theme.layout.radius.sm,
                padding: "6px 16px",
              }}
            >
              {fmtRp(ch.price)}
            </div>
          );
        })}

        {/* ── the watchlist, an extension of this same window ── */}
        {open > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: LIST.x,
              top: 0,
              width: LIST.w,
              height: panelH,
              background: C.surface,
              borderLeft: `${theme.layout.border.thin}px solid ${C.border}`,
              /* A DRAWER, not a fade: it starts its full width outside the
             panel — which clips — and slides in opaque. Fading it in
             showed the chart THROUGH it, and a pill behind it, for the
             twenty frames it took to arrive. */
              transform: `translateX(${((1 - open) * LIST.w).toFixed(1)}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: LIST.pad,
                top: LIST.headTop,
                fontFamily: font,
                fontSize: LIST.size,
                fontWeight: UI.weight,
                color: C.textMuted,
              }}
            >
              {portfolio ? "Portfolio" : "Watchlist"}
            </div>
            {/* ⚠ THE COLUMN NAMES, AND THEY ARE PLACED BY THE ROWS' OWN MATHS —
                Simon: "Stock" level with the codes, "P&L" level with the
                percentages. `pad + avatar + 14` is exactly where a row's ticker
                starts and `pad` is exactly where its right column ends, so the
                heading cannot drift off the column it names. */}
            {portfolio && (
              <div
                style={{
                  position: "absolute",
                  /* ⚠ "Stock" IS LEFT-ALIGNED TO THE LIST, NOT TO THE CODES —
                     Simon. The column it names starts at the avatar, and the
                     avatar starts here. */
                  left: LIST.pad,
                  right: LIST.pad,
                  top: LIST.rowTop + PF.drop - PF.head,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: font,
                  fontSize: LIST.size - 2,
                  /* ⚠ THIN — Simon. A column heading that weighs the same as
                     the rows under it is another row. */
                  fontWeight: PF.weight,
                  color: C.textMuted,
                }}
              >
                <span>Stock</span>
                <span>P&amp;L</span>
              </div>
            )}
            {WATCH.map((w, i) => {
              /* the selected row IS the chart in the window — one source of
             truth, so the two can never disagree */
              const on = w.t === CHARTS[active].t;
              return (
                <div
                  key={w.t}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: LIST.rowTop + (portfolio ? PF.drop : 0) + i * LIST.rowH,
                    width: LIST.w,
                    height: LIST.rowH,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: LIST.pad - (on ? 4 : 0),
                    paddingRight: LIST.pad,
                    borderTop: `${theme.layout.border.thin}px solid ${C.border}`,
                    /* filled, and carrying a bar on the edge it shares with
                   the chart — it has to hold its own against everything
                   to its left */
                    background: on ? C.indigo12 : "transparent",
                    borderLeft: on ? `4px solid ${C.indigo}` : undefined,
                    fontFamily: font,
                    /* one row at a time, so the list reads as a list being
                   gone through rather than a block that appears */
                    opacity: progress(
                      f,
                      T.list.in + i * T.list.step,
                      theme.motion.revealF,
                    ),
                  }}
                >
                  <div
                    style={{
                      width: LIST.avatar,
                      height: LIST.avatar,
                      borderRadius: LIST.avatar / 2,
                      flexShrink: 0,
                      background: on ? C.indigo : C.indigo12,
                      color: on ? C.surface : C.indigo,
                      fontSize: 18,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {w.t[0]}
                  </div>
                  <span
                    style={{
                      flex: 1,
                      marginLeft: 14,
                      fontSize: LIST.size,
                      fontWeight: 700,
                      color: on ? C.indigo : C.text,
                    }}
                  >
                    {w.t}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* ⚠ NO PRICE IN A PORTFOLIO — Simon. What a holding is
                        worth per share is not what the row is about; the
                        number that matters is the one under it. */}
                    {!portfolio && (
                      <span
                        style={{
                          fontSize: LIST.size,
                          fontWeight: UI.axis,
                          color: C.price,
                          lineHeight: 1.2,
                        }}
                      >
                        {fmtRp(w.p)}
                      </span>
                    )}
                    {(() => {
                      const v = pnl?.[w.t] ?? w.c;
                      /* ⚠ THE SIGN IS READ, NOT TRUSTED. `up` describes the
                         market's move; a P&L handed in has its own direction,
                         and the two need not agree. */
                      const down = pnl ? /^[−-]/.test(v) : !w.up;
                      return (
                        <span
                          style={{
                            fontSize: LIST.size,
                            fontWeight: UI.weight,
                            lineHeight: 1.2,
                            color: down ? C.candleRed : C.candleGreen,
                          }}
                        >
                          {v}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

/**
 * THE PANEL, LANDED IN A CARD — exactly the geometry SC01's shrink arrives at:
 * fill the card by width less 10px a side, centre what is left over, and clip
 * to the card's own rounded rect.
 *
 * Frozen at 624, the frame Simon reads the opening roadmap on, so the two
 * INTRODUCTION cards are the same picture rather than merely similar ones.
 */
const PANEL_SETTLED = 624;
export const PanelInCard = ({ card }: { card: number }) => {
  const s0 = (CARD.w - 20) / PANEL.w;
  const c = CARDS[card];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath:
          `inset(${c.y}px ${theme.layout.width - c.x - CARD.w}px ` +
          `${theme.layout.height - c.y - CARD.h}px ${c.x}px ` +
          `round ${theme.layout.radius.md}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${PANEL.x}px ${PANEL.y}px`,
          transform:
            `translate(${(c.x + (CARD.w - PANEL.w * s0) / 2 - PANEL.x).toFixed(1)}px, ` +
            `${(c.y + (CARD.h - PANEL.h * s0) / 2 - PANEL.y).toFixed(1)}px) ` +
            `scale(${s0.toFixed(4)})`,
        }}
      >
        <BrokerPanel f={PANEL_SETTLED} />
      </div>
    </div>
  );
};

/**
 * THE READING CHART, LANDED IN A CARD — the same geometry `PanelInCard` uses,
 * and for the same reason.
 *
 * ⚠ THIS IS WHAT THE MOVING AVERAGE CARD SHOWS. It used to draw two bare
 * average lines, no candles, stretched to the two lines' OWN range so their
 * wobble filled the card — the only one of the four that did not look like a
 * chart, and nothing like what the card actually holds at 4205 when the
 * closing roadmap shrinks SC05 into it. Simon pointed at that frame; this is
 * that frame's content, drawn from the same component.
 *
 * A card that names a chapter has to show the chapter, and a moving average
 * drawn without the price it averages leaves out the thing being taught.
 */
export const ReadingInCard = ({ card, f }: { card: number; f: number }) => {
  const s0 = (CARD.w - 20) / READING_BOX.w;
  const c = CARDS[card];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath:
          `inset(${c.y}px ${theme.layout.width - c.x - CARD.w}px ` +
          `${theme.layout.height - c.y - CARD.h}px ${c.x}px ` +
          `round ${theme.layout.radius.md}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${READING_BOX.x}px ${READING_BOX.y}px`,
          transform:
            `translate(${(c.x + (CARD.w - READING_BOX.w * s0) / 2 - READING_BOX.x).toFixed(1)}px, ` +
            `${(c.y + (CARD.h - READING_BOX.h * s0) / 2 - READING_BOX.y).toFixed(1)}px) ` +
            `scale(${s0.toFixed(4)})`,
        }}
      >
        <ReadingCard f={f} />
      </div>
    </div>
  );
};

/**
 * ═══ THE PUSH ONTO ONE CARD ═══
 *
 * It is a DOLLY, not a zoom: the card grows AND travels to the middle of the
 * frame, and the two are the same number so they cannot come apart.
 *
 * A plain scale about the card's own centre was wrong, and visibly so. The
 * Moving Average card sits at x=364, 596px left of centre, so scaling about it
 * grows it straight off the left edge — at 1.55 the card's left side lands at
 * −51 and the frame closes on something already half out of shot. Carrying the
 * centre to the middle as it grows fixes it for every card at once, and it is
 * also what a camera actually does when it approaches a subject.
 *
 * At `amount` 0.55 the card ends 831 × 468 in the middle of a 1920 × 1080
 * frame — with room to spare on all four sides, whichever of the four it is.
 */
export const cardPush = (p: number, card: number, amount: number) => {
  const cx = CARDS[card].x + CARD.w / 2;
  const cy = CARDS[card].y + CARD.h / 2;
  const tx = (theme.layout.width / 2 - cx) * p;
  const ty = (theme.layout.height / 2 - cy) * p;
  return {
    transform:
      `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) ` +
      `scale(${(1 + amount * p).toFixed(4)})`,
    transformOrigin: `${cx}px ${cy}px`,
  };
};

/**
 * ═══ THE ROADMAP, AS TWO PIECES ═══
 *
 * SC01 shrinks the broker panel into the FIRST card; the closing scene shrinks
 * the reading chart into the SECOND. Same ground, same four cards, same
 * captions — only which card catches the shrink differs, so it is a parameter
 * and not a second copy of two hundred lines.
 *
 * The card that catches the shrink draws NO thumbnail of its own: the thing
 * arriving in it IS the picture. Every other card draws the one bound to its
 * own meaning — card 1 is Moving Average and gets the two averages, whichever
 * scene is showing the roadmap.
 *
 * ── the white ground the roadmap sits on ──
 * Full strength as soon as the shrink begins, not fading in with it: a partial
 * fade let SafeArea's own ground show through underneath, so the screen behind
 * the roadmap was grey, not the flat white of Simon's reference.
 *
 * ⚠ AND SO IS THE GRID, now. It used to fade in over the shrink and Simon
 * caught it at 644, 4173 and 6077 — the background arriving late.
 *
 * It was late by construction: the shrinking picture COVERS the whole frame at
 * `reveal = 0`, so nothing of this ground is visible until the clip starts
 * closing, and the first sliver it uncovers is the frame's own edge. A grid
 * ramping up over the same move means that sliver shows a half-drawn ground.
 * There is nothing for a fade to ease in FROM.
 */
/**
 * ⚠ IT MOUNTS ON THE TRANSITION'S FIRST FRAME. The guard used to be
 * `reveal <= 0.001`, and `reveal` is an ease-in-out curve — dead flat at its
 * start, so it does not clear 0.001 until fourteen frames in. The ground was
 * therefore absent at 531, 4160 and 6040 and arrived a beat after the move it
 * belongs to had already begun. Simon caught all three.
 *
 * `> 0` is the right test: the ground is the transition's own floor, so it is
 * there for every frame the transition exists and no frames before it.
 */
export const RoadmapGround = ({
  f,
  reveal,
  vignette = true,
  tone,
}: {
  f: number;
  reveal: number;
  /**
   * The radial mask that keeps the grid strongest in the middle and gone at
   * the edges. Right for the ROADMAP, where four cards sit spread across the
   * frame and the ground shows between them.
   *
   * ⚠ WRONG for SC13, and invisibly so: that scene is one card in the middle,
   * which covers exactly the part of the grid the mask keeps. The ground was
   * there and drew nothing anyone could see. Off, the grid is even across the
   * frame and reads around the card, which is what Simon asked for.
   */
  vignette?: boolean;
  /**
   * The grid's own line colour, when the default is too quiet for the scene.
   *
   * ⚠ THE DEFAULT IS NEARLY INVISIBLE, and that is deliberate here: on the
   * roadmap the grid is a texture under four cards, and anything stronger
   * competes with them. On SC13 there is one card and a lot of empty paper, so
   * the same tone reads as nothing at all — measured at (235,235,235) against
   * white, which is eight levels of grey on a 1px line every 84px.
   */
  tone?: string;
}) => {
  /** One cell of drift per loop — see GRID. */
  const drift = ((f % GRID.loop) / GRID.loop) * GRID.cell;
  const shrink = reveal;
  if (shrink <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          /* NOT `shrink` — see the note above */
          opacity: 1,
          backgroundImage:
            `linear-gradient(${tone ?? GRID.line} ${GRID.w}px, transparent ${GRID.w}px),` +
            `linear-gradient(90deg, ${tone ?? GRID.line} ${GRID.w}px, transparent ${GRID.w}px)`,
          backgroundSize: `${GRID.cell}px ${GRID.cell}px`,
          backgroundPosition: `${drift.toFixed(2)}px ${drift.toFixed(2)}px`,
          /* strongest in the middle, gone at the edges, as in the
               reference — the grid is a ground, not a subject */
          ...(vignette
            ? {
                maskImage:
                  "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
              }
            : null),
        }}
      />
    </div>
  );
};

/** The four cards, their captions and their thumbnails. */
export const RoadmapCards = ({
  f,
  reveal,
  cardsAt,
  cardDur,
  landing,
  glow = 0,
  glowOn = 1,
}: {
  f: number;
  reveal: number;
  /** One frame per card that is NOT the landing one, in card order. */
  cardsAt: readonly number[];
  cardDur: number;
  landing: number;
  glow?: number;
  /**
   * Which card the extra border and glow belong to. SC01 calls out the card it
   * is about to push into — Moving Average — and the closing roadmap calls out
   * the one it hands the episode to, Bollinger Bands. Same gesture, so the
   * card is a parameter rather than a second block.
   */
  glowOn?: number;
}) => {
  const shrink = reveal;
  if (shrink <= 0.001) return null;
  /** The cards that open on their own, in the order they open. */
  const others = CARDS.map((_, i) => i).filter((i) => i !== landing);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {CARDS.map((c, n) => {
        /* the LANDING card is the picture itself arriving, so its frame
             and caption ride the shrink; the rest open one after another */
        const a =
          n === landing
            ? shrink
            : progress(f, cardsAt[others.indexOf(n)], cardDur);
        if (a <= 0.001) return null;
        const ch = CHARTS[n === 0 ? 0 : n - 1];
        return (
          <div key={c.text} style={{ opacity: a }}>
            <div
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                width: CARD.w,
                height: CARD.h,
                borderRadius: theme.layout.radius.md,
                /* white on every card, including the first: the panel
                     lands letterboxed inside it, and the strips above and
                     below it are part of the card, not a hole in it */
                background: C.surface,
                border: `${theme.layout.border.thin}px solid ${C.border}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: c.x,
                top: c.y + CARD.h + 14,
                width: CARD.w,
                textAlign: "center",
                fontFamily: font,
                /* 6px under the episode's smallest role — this label
                     names a card, it does not compete with what is on it */
                fontSize: 30,
                fontWeight: 700,
                color: C.ink,
                letterSpacing: 0.5,
              }}
            >
              {c.text}
            </div>

            {/* INTRODUCTION — the broker session itself, landed in its card
                exactly as SC01's shrink leaves it. HTML, not SVG, so it sits
                BESIDE the thumbnail layer rather than inside it. Only ever
                drawn when this card is NOT the landing one; in SC01 the live
                panel arrives here instead. */}
            {n === 0 && n !== landing && <PanelInCard card={0} />}
            {n === 1 && n !== landing && <ReadingInCard card={1} f={f} />}

            {n !== landing && (
              <svg
                style={{ position: "absolute", left: 0, top: 0 }}
                width={theme.layout.width}
                height={theme.layout.height}
              >
                {/* MOVING AVERAGE is drawn OUTSIDE this svg — see
                    ReadingInCard above. It is SC05's own picture, which is
                    HTML and SVG both, so it cannot live in here. */}

                {/* BOLLINGER BANDS — the envelope and its middle */}
                {n === 2 &&
                  (() => {
                    const [lo, hi] = spanOf([ch.bb.upper, ch.bb.lower, ch.ma]);
                    const back = ch.bb.lower
                      .map((v, i) =>
                        v === null
                          ? ""
                          : `L${mx(i, ch.bb.lower.length, c).toFixed(1)},${my(v, lo, hi, c).toFixed(1)}`,
                      )
                      .reverse()
                      .join(" ");
                    return (
                      <>
                        <path
                          d={`${thumbPath(ch.bb.upper, lo, hi, c)} ${back} Z`}
                          fill={C.bbTosca}
                          fillOpacity={0.12}
                          stroke="none"
                        />
                        {[ch.bb.upper, ch.bb.lower].map((band, k) => (
                          <path
                            key={k}
                            d={thumbPath(band, lo, hi, c)}
                            fill="none"
                            stroke={C.bbTosca}
                            strokeWidth={theme.layout.stroke.band}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ))}
                        <path
                          d={thumbPath(ch.ma, lo, hi, c)}
                          fill="none"
                          stroke={C.bbTosca}
                          strokeWidth={theme.layout.border.thin}
                          strokeDasharray="5 5"
                        />
                      </>
                    );
                  })()}

                {/* CARA PAKAI INDIKATOR — all three at once */}
                {n === 3 &&
                  (() => {
                    const [lo, hi] = spanOf(
                      [ch.bb.upper, ch.bb.lower, ch.ma],
                      ch.bars,
                    );
                    const w = Math.max(
                      1.5,
                      ((CARD.w - pad * 2) / ch.bars.length) * 0.6,
                    );
                    const back = ch.bb.lower
                      .map((v, i) =>
                        v === null
                          ? ""
                          : `L${mx(i, ch.bb.lower.length, c).toFixed(1)},${my(v, lo, hi, c).toFixed(1)}`,
                      )
                      .reverse()
                      .join(" ");
                    return (
                      <>
                        <path
                          d={`${thumbPath(ch.bb.upper, lo, hi, c)} ${back} Z`}
                          fill={C.bbTosca}
                          fillOpacity={0.12}
                          stroke="none"
                        />
                        {ch.bars.map((b, i) => {
                          const x = mx(i, ch.bars.length, c);
                          const top = Math.min(
                            my(b.o, lo, hi, c),
                            my(b.c, lo, hi, c),
                          );
                          const h = Math.max(
                            1,
                            Math.abs(my(b.c, lo, hi, c) - my(b.o, lo, hi, c)),
                          );
                          const up = b.c >= b.o;
                          return (
                            <rect
                              key={i}
                              x={x - w / 2}
                              y={top}
                              width={w}
                              height={h}
                              fill={up ? C.candleGreen : C.candleRed}
                            />
                          );
                        })}
                        {[ch.bb.upper, ch.bb.lower].map((band, k) => (
                          <path
                            key={k}
                            d={thumbPath(band, lo, hi, c)}
                            fill="none"
                            stroke={C.bbTosca}
                            strokeWidth={theme.layout.border.thin}
                            strokeLinecap="round"
                          />
                        ))}
                        <path
                          d={thumbPath(ch.ma, lo, hi, c)}
                          fill="none"
                          stroke={C.maOrange}
                          strokeWidth={theme.layout.stroke.band}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
              </svg>
            )}
          </div>
        );
      })}

      {/* ── the called-out card's extra border + glow ── */}
      {glow > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: CARDS[glowOn].x - 3,
            top: CARDS[glowOn].y - 3,
            width: CARD.w + 6,
            height: CARD.h + 6,
            borderRadius: theme.layout.radius.md + 3,
            border: `${theme.layout.border.thick}px solid ${C.indigo}`,
            boxShadow: `0 0 ${(28 * glow).toFixed(0)}px ${(6 * glow).toFixed(0)}px rgba(95, 77, 238, ${(0.55 * glow).toFixed(2)})`,
            opacity: glow,
          }}
        />
      )}
    </div>
  );
};

export const Scene01 = () => {
  const f = useCurrentFrame();

  /**
   * TWO MOVES ON ONE POINT. SC01 starts at global 0, so its local frame IS the
   * global one and nothing has to be added back here — every other scene in
   * the episode has to add its own `from`.
   *
   * The first move is the PUSH: 610 → 630, fast, closing on the MOVING AVERAGE
   * card, and then it holds. `glow` reveals that same card's extra border over
   * the same beat, so the eye is told where the push is going before it
   * starts. The second is the CUT at 715, which pushes a little further and
   * hands off to CG-A mid-travel.
   *
   * They MULTIPLY, and share one `transformOrigin`. Two scales about the same
   * point compose into one scale about that point — give them separate origins
   * and the hold would drift between the two moves.
   */
  const push = progressInOut(f, T.push, T.pushOver);
  const cut = {
    background: C.bg,
    ...cardPush(push, 1, PUSH_AMOUNT),
    opacity: 1 - progress(f, T.fade, T.fadeOver),
  };
  /** The card's own extra border+glow: reveals over `glowOver`, then holds. */
  const glow = progress(f, T.glow, T.glowOver);

  /**
   * The shrink. `transformOrigin` is the panel's own top-left corner, so the
   * scale keeps that corner still and the translate then carries it to the
   * card — one move rather than a scale that also drifts.
   */
  const shrink = progressInOut(f, T.map, T.mapDur);
  /**
   * FILL BY WIDTH, less 10px. The panel's width lands 20px short of the
   * card's own, so there is a sliver of the card's white on each side rather
   * than the panel running edge to edge with it — nothing is cropped left or
   * right, the header, watchlist and chart all stay whole. The panel is
   * proportionally taller than the card too, so a strip opens above and below
   * as well; both strips are the card's own white, not a hole, because the
   * mask below closes down to the card's rect regardless of what fills it.
   */
  const s0 = (CARD.w - 20) / PANEL.w;
  const scale = 1 - (1 - s0) * shrink;
  const land = {
    x: CARDS[0].x + (CARD.w - PANEL.w * s0) / 2,
    y: CARDS[0].y + (CARD.h - PANEL.h * s0) / 2,
  };
  const mapX = (land.x - PANEL.x) * shrink;
  const mapY = (land.y - PANEL.y) * shrink;
  /**
   * THE MASK. A screen-space window that closes from the whole frame down to
   * the first card's rounded rect as the shrink completes — so the panel is
   * clipped INTO the card rather than merely parked on it. It lives on an
   * OUTER, untransformed element; a clip-path on the scaling wrapper would
   * scale along with it and never match the card.
   */
  const lerp = (a: number, b: number) => a + (b - a) * shrink;
  const clip =
    shrink <= 0.001
      ? undefined
      : `inset(${lerp(0, CARDS[0].y).toFixed(1)}px ` +
        `${lerp(0, theme.layout.width - CARDS[0].x - CARD.w).toFixed(1)}px ` +
        `${lerp(0, theme.layout.height - CARDS[0].y - CARD.h).toFixed(1)}px ` +
        `${lerp(0, CARDS[0].x).toFixed(1)}px round ${(theme.layout.radius.md * shrink).toFixed(1)}px)`;
  return (
    /*
     * A TRANSPARENT fill, NOT SafeArea. The white ground belongs to the wrapper
     * that FADES; on an outer element that does not fade, the dissolve would
     * have nothing to reveal and CG-A would stay hidden behind a white sheet.
     * The composition's own root is white, so nothing shows through early.
     */
    <AbsoluteFill style={{ fontFamily: font, color: C.text }}>
      {/*
        EVERYTHING below — ground, cards, panel, watchlist — is one unit for
        the push-in AND the dissolve: one transform and one opacity on this
        wrapper is what makes the whole frame close on the Moving Average card
        and fade away as one picture, rather than the card growing inside a
        frame that stays still.
      */}
      <div style={{ position: "absolute", inset: 0, ...cut }}>
        <RoadmapGround f={f} reveal={shrink} />

        <RoadmapCards
          f={f}
          reveal={shrink}
          cardsAt={T.cards}
          cardDur={T.cardDur}
          landing={0}
          glow={glow}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {/* the mask that closes the panel into the roadmap's first card */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: clip,
              WebkitClipPath: clip,
            }}
          >
            {/* the panel, and after 530 the first card of the roadmap */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: `${PANEL.x}px ${PANEL.y}px`,
                transform: `translate(${mapX.toFixed(1)}px, ${mapY.toFixed(1)}px) scale(${scale.toFixed(4)})`,
              }}
            >
              <BrokerPanel f={f} shrink={shrink} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
