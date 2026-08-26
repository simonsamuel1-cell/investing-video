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

const PANEL = { x: 96, y: 150, w: 1728, h: 750 };
const PLOT = {
  x: PANEL.x + 150,
  y: PANEL.y + 200,
  w: PANEL.w - 150 - 56,
  h: 490,
};
const N = 105;
const MA_PERIOD = 20;
const SLOW_PERIOD = 50;

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

const FRAMES = ["5m", "15m", "1H", "1D", "1W"];
/** Every screenshot is a DAILY chart, so 1D is the live pill throughout. */
const ACTIVE = "1D";
/** A daily chart's axis is dates, not session hours. */
const AXIS = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];
/**
 * ═══ THE PANEL'S OWN TYPE ═══
 *
 * NOT the episode's four sizes. This is a reproduction of a broker's UI and
 * these are its readouts — chrome, not headings, sentences or in-chart labels
 * — so they are named here, in the one scene that needs them.
 */
const UI = { size: 30, weight: 600, axis: 500, name: 36, price: 70 };
const HEAD = { x: 40, avatar: 52, gap: 16 };
/**
 * The price column's centre line. The axis labels and the last-price pill are
 * BOTH centred on it — right-aligning them lined up their right edges but left
 * their middles apart, because the pill carries padding the labels do not.
 */
const AXIS_CX = 84;
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
const GRID = { cell: 84, loop: 150, line: "#E2E2E2", paper: "#FAFAFA" };

/**
 * The indicator buttons, floating under the timeframe row.
 *
 * 20px — smaller than every other readout in the panel, and deliberately: this
 * is a second row of controls under the first, and at the panel's own 30px the
 * pair ran from the price group all the way to the extension and sat on the
 * chart's wash. The padding is cut with the type so the chip stays a chip.
 */
const BTN = { top: 108, gap: 10, padX: 16, padY: 8, size: 20 };
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
  /* 0.80, not 0.88: a LL label hangs UNDER its low, and at 0.88 the lowest bar
     left no room for a chip above the month row. */
  const y = (v: number) =>
    PLOT.y -
    PANEL.y +
    PLOT.h * (1 - (v - lo) / (hi - lo)) * 0.8 +
    PLOT.h * 0.06;

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

  /* Swing points: highs on the bar's high, lows on its low. A swing marked at
     the close floats inside the candle it names. */
  const pt = sh.pivots.map((p) => ({
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
    closes,
    bars,
    lo,
    hi,
    levels,
    y,
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
/** Each chart's own structure timing. BMRI has none. */
const ZIG = [T.zig, T.zigBbri, null];
/**
 * Labels lead the line slightly. Keyed to the raw fraction the LAST one sits
 * at exactly 1.0, which the draw only reaches on its final frame — so it never
 * appeared at all.
 */
const ZIG_LEAD = 0.9;

type Chart = (typeof CHARTS)[number];

const pathOf = (v: (number | null)[], w: number, y: (n: number) => number) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${lx(i, w).toFixed(1)},${y(n).toFixed(1)} `;
  });
  return d.trim();
};
const lenOf = (v: (number | null)[], w: number, y: (n: number) => number) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  v.forEach((n, i) => {
    if (n === null) return;
    const q = { x: lx(i, w), y: y(n) };
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
}: {
  f: number;
  /**
   * How far the panel has closed into a card. Only its own outline uses it:
   * the border fades as the roadmap card's takes over, otherwise it rides the
   * shrink as a second, nested card border. A caller drawing the panel already
   * LANDED — the closing roadmap — leaves it at 1 and has no outline of its own.
   */
  shrink?: number;
}) => {
  /**
   * The extension opens once and stays. The plot's width is derived from it,
   * so the candles, the structure and the indicator lines all narrow together
   * rather than being scaled — text on a scaled group is text that stretches.
   */
  const open = progressInOut(f, T.list.in, T.list.over);
  const plotW = PLOT.w - LIST.take * open;

  /** Which chart the window is on, and therefore which row is selected. */
  const active = CHARTS.reduce((k, c, i) => (f >= c.at ? i : k), 0);
  /** A chart is up from its own frame until the next one takes over. */
  const alpha = (i: number) => {
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
          height: PANEL.h,
          borderRadius: theme.layout.radius.lg,
          background: C.surface,
          /* the panel's own outline fades as the mask takes over — otherwise
         it rides the shrink as a second, nested card border. C.border is
         #D8DBE0; the alpha is what animates */
          border: `${theme.layout.border.thin}px solid rgba(216, 219, 224, ${(1 - shrink).toFixed(3)})`,
          overflow: "hidden",
        }}
      >
        {/* the chart's own ground — a wash, hue-locked to the palette */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 168,
            width: PANEL.w,
            height: PANEL.h - 168,
            background: `linear-gradient(180deg, ${C.indigo12} 0%, ${C.cyan12} 46%, ${C.surface} 100%)`,
          }}
        />

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
                  top: 36,
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
            </div>
          );
        })}

        {/* Timeframe pills. They belong to the CHART WINDOW, not to the
        panel, so they travel left with its right edge when the extension
        opens: without that the chart appears to shrink under its own
        controls instead of making room beside them. */}
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

        {/* ── the two indicator buttons, under the timeframes ── */}
        {f >= T.buttons && (
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
          const drawn = zt ? progressInOut(f, zt.from, zt.dur) : 0;
          const isBmri = n === 2;
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
              height={PANEL.h}
              opacity={o}
            >
              {ch.levels.map((v) => (
                <g key={v}>
                  <line
                    x1={PLOT.x - PANEL.x}
                    y1={ch.y(v)}
                    x2={PLOT.x - PANEL.x + plotW}
                    y2={ch.y(v)}
                    stroke={C.gridline}
                    strokeWidth={theme.layout.border.thin}
                    strokeDasharray="2 8"
                  />
                  <text
                    x={AXIS_CX}
                    y={ch.y(v) + 10}
                    textAnchor="middle"
                    fontFamily={font}
                    fontSize={UI.size}
                    fontWeight={UI.axis}
                    fill={C.textMuted}
                  >
                    {fmtRp(v)}
                  </text>
                </g>
              ))}

              {/* the tape is simply THERE — no entrance */}
              {ch.bars.map((b, i) => {
                const x = lx(i, plotW);
                const top = Math.min(ch.y(b.o), ch.y(b.c));
                const h = Math.max(2, Math.abs(ch.y(b.c) - ch.y(b.o)));
                const up = b.c >= b.o;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={ch.y(b.h)}
                      x2={x}
                      y2={ch.y(b.l)}
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
              {zt && f >= zt.from && (
                <g>
                  <path
                    d={ch.pt
                      .map(
                        (p, i) =>
                          `${i === 0 ? "M" : "L"}${lx(p.i, plotW).toFixed(1)},${p.y.toFixed(1)}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke={C.indigo}
                    strokeWidth={theme.layout.stroke.ma}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={ch.zigLen}
                    strokeDashoffset={ch.zigLen * (1 - drawn)}
                  />
                  {ch.pt.map((pv, k) => {
                    /* a point waits for the LINE to reach it, not for a frame
                   number guessed off the easing curve */
                    const a = clamp01(
                      (drawn - (ch.zigAt[k] / ch.zigLen) * ZIG_LEAD) * 9,
                    );
                    if (a <= 0.001) return null;
                    const w = 74;
                    const cx = lx(pv.i, plotW);
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
                        {pv.label && (
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

              {/* ── the bands, under the average ── */}
              {isBmri && bbOn && (
                <g opacity={progress(f, T.bb, theme.motion.revealF)}>
                  <path
                    d={`${pathOf(ch.bb.upper, plotW, ch.y)} ${ch.bb.lower
                      .map((v, i) =>
                        v === null
                          ? ""
                          : `L${lx(i, plotW).toFixed(1)},${ch.y(v).toFixed(1)}`,
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
                      d={pathOf(band, plotW, ch.y)}
                      fill="none"
                      stroke={C.bbTosca}
                      strokeWidth={theme.layout.stroke.band}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...drawPath(
                        f,
                        T.bb,
                        T.drawOver,
                        lenOf(band, plotW, ch.y),
                      )}
                    />
                  ))}
                </g>
              )}

              {/* ── the average ── */}
              {isBmri && maOn && (
                <path
                  d={pathOf(ch.ma, plotW, ch.y)}
                  fill="none"
                  stroke={C.maOrange}
                  strokeWidth={theme.layout.stroke.ma}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...drawPath(f, T.ma, T.drawOver, lenOf(ch.ma, plotW, ch.y))}
                />
              )}

              {/* the last-price line, and nothing else on it — the readout it
              carries is the pill on the axis */}
              <line
                x1={PLOT.x - PANEL.x}
                y1={ch.y(ch.price)}
                x2={PLOT.x - PANEL.x + plotW}
                y2={ch.y(ch.price)}
                stroke={C.text}
                strokeWidth={theme.layout.border.thin}
                strokeDasharray="8 8"
              />

              {AXIS.map((t, i) => (
                <text
                  key={t}
                  x={
                    PLOT.x -
                    PANEL.x +
                    14 +
                    ((plotW - 28) * i) / (AXIS.length - 1)
                  }
                  /* the panel clips: a baseline below its height is a label
                 cut in half */
                  y={PLOT.y + PLOT.h - PANEL.y + 34}
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
        {CHARTS.map((ch, i) => {
          const o = alpha(i);
          if (o <= 0.001) return null;
          return (
            <div
              key={ch.t}
              style={{
                position: "absolute",
                left: AXIS_CX,
                transform: "translateX(-50%)",
                top: ch.y(ch.price) - 22,
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
              height: PANEL.h,
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
              Watchlist
            </div>
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
                    top: LIST.rowTop + i * LIST.rowH,
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
                    <span
                      style={{
                        fontSize: LIST.size,
                        fontWeight: UI.weight,
                        lineHeight: 1.2,
                        color: w.up ? C.candleGreen : C.candleRed,
                      }}
                    >
                      {w.c}
                    </span>
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
 * fade let SafeArea's own #F5F5F5 show through underneath, so the screen
 * behind the roadmap was grey, not the flat white of Simon's reference. Only
 * the GRID on top of it still fades in.
 */
export const RoadmapGround = ({ f, reveal }: { f: number; reveal: number }) => {
  /** One cell of drift per loop — see GRID. */
  const drift = ((f % GRID.loop) / GRID.loop) * GRID.cell;
  const shrink = reveal;
  if (shrink <= 0.001) return null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: shrink,
          backgroundImage:
            `linear-gradient(${GRID.line} 1px, transparent 1px),` +
            `linear-gradient(90deg, ${GRID.line} 1px, transparent 1px)`,
          backgroundSize: `${GRID.cell}px ${GRID.cell}px`,
          backgroundPosition: `${drift.toFixed(2)}px ${drift.toFixed(2)}px`,
          /* strongest in the middle, gone at the edges, as in the
               reference — the grid is a ground, not a subject */
          maskImage:
            "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 48%, #000 34%, transparent 82%)",
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
