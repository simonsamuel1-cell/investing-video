/**
 * data/layout.ts — every box this episode draws in, derived from `theme.stage`.
 *
 * ⚠ NOTHING HERE IS A TYPED COORDINATE. Move a margin in the theme and every
 * scene in this episode follows. A number that appears twice in a scene file
 * belongs here instead.
 */
import { GRID_PAD_X, candleWidth, gridOf, theme, columns, inset } from "../../../core";
import type { Rect } from "../../../core";

const PLOT = theme.stage.plot;
const CARD = theme.stage.card;

/**
 * ═══ CG-A · THE DASHBOARD ═══  (Simon's `Chart Dashboard.jpeg`)
 *
 * The reference stacks its bands vertically inside a squarish card: ticker
 * strip, instrument header, chart, volume, time axis, then a 3×2 grid of stat
 * tiles at the bottom.
 *
 * ⚠ THE STACK IS SPLIT FOR 16:9, AND THAT IS THE ONLY DEPARTURE. Kept whole,
 * six bands inside a 1728×686 card leave the plot 200px tall and 1600 wide —
 * an 8:1 ribbon, where the reference's chart is nearer 2:1. So the two bands
 * that do not need the width move BESIDE the chart: the tiles become a 2×3
 * column on the right and the plot gets 1180×250. Same information, same
 * reading order, and the chart keeps a shape a candle can be seen in.
 *
 * ⚠ AND THE RIGHT COLUMN STARTS BELOW y=460, so it never enters the logo zone
 * even though it reaches x=1792.
 */
const DPAD = 32;
const DINNER = { x: CARD.x + DPAD, w: CARD.w - DPAD * 2 };
export const DASH = {
  /** The ticker tiles. Laid out past the right edge and clipped — the
   *  reference's own way of saying the strip runs on. */
  /** ⚠ 108 TALL, NOT 88. A tile carries three lines — symbol, price, change —
   *  and at 88 the change line was clipped off the bottom of every tile. */
  strip: { ...DINNER, y: CARD.y + 24, h: 108 },
  rule1: CARD.y + 150,
  header: { ...DINNER, y: CARD.y + 166, h: 88 },
  rule2: CARD.y + 272,
  /** The chart column. */
  plot: { x: DINNER.x, y: CARD.y + 290, w: 1180, h: 236 },
  vol: { x: DINNER.x, y: CARD.y + 540, w: 1180, h: 58 },
  /** ⚠ THE AXIS GETS ITS OWN BAND, BELOW THE HISTOGRAM. core/TimeAxis hangs
   *  its labels 14px under the grid box it is given, so handed the price grid
   *  it printed them straight across the volume bars. The scene builds a
   *  second grid whose box bottom is `axis.y − 14`. */
  axis: { x: DINNER.x, y: CARD.y + 616, w: 1180, h: 28 },
  /** The stat tiles, beside the chart rather than under it. */
  tiles: { x: DINNER.x + 1220, y: CARD.y + 290, w: DINNER.w - 1220, h: 354 },
  /** Room on the right of the plot for the price scale. */
  gutter: 96,
} as const;

/**
 * ═══ CG-A · THE OTHER CHART ═══  (VIDEO 19's GGRM panel)
 *
 * The alternative Simon asked to try. Where the dashboard surrounds the plot
 * with readouts, this one CLEARS everything away from it: one identity line at
 * the top, indicator pills opposite it, and then nothing but chart — with the
 * price scale in a column down the LEFT and the time labels along the bottom.
 *
 * ⚠ THE LEFT COLUMN IS WHY THE PLOT STARTS AT x+150. A left-hand scale is not
 * a gutter inside the plot; the labels are drawn OUTSIDE the box, so the box
 * has to begin clear of them. `gutter` is 0 here for the same reason.
 *
 * ⚠ AND IT KEEPS A VOLUME PANE, WHICH 019's GGRM PANEL HAS NOT. SC01's third
 * beat is the words "volume menguat" — a design that drops the histogram would
 * leave that sentence with nothing on screen. The chrome is 019's; the panes
 * are this episode's.
 */
/**
 * ⚠ NOW THE ORDINARY INSET, NOT A PRICE COLUMN — Simon: "tulisan label harganya
 * hapus aja". The 150px was room for the scale; with the scale gone it was an
 * empty margin that pushed the tape off the card's own left edge. 40 is the
 * inset the instrument name above it already uses, so the tape starts where
 * the title does.
 */
const MA_AXIS_COL = 40;
export const MA = {
  /** Centre-y of the identity line and of the pills opposite it. */
  headY: CARD.y + 62,
  pillsRight: CARD.x + CARD.w - 40,
  headX: CARD.x + 40,
  /** ⚠ FLUSH TO THE CARD'S RIGHT EDGE — Simon: "chartnya mentok ke kanan".
   *  `gridOf` still leaves GRID_PAD_X inside the box, so the newest candle
   *  stands clear of the corner without a second inset doing it. */
  plot: { x: CARD.x + MA_AXIS_COL, y: CARD.y + 120, w: CARD.w - MA_AXIS_COL, h: 400 },
  vol: { x: CARD.x + MA_AXIS_COL, y: CARD.y + 536, w: CARD.w - MA_AXIS_COL, h: 72 },
  axis: { x: CARD.x + MA_AXIS_COL, y: CARD.y + 622, w: CARD.w - MA_AXIS_COL, h: 28 },
  /** ⚠ ZERO — the scale is outside the box, not reserved inside it. */
  gutter: 0,
  /** Bigger than a gutter label. The size is part of the look. */
  tickSize: 34,
} as const;

/**
 * The BUY bubble's box. Sized to the word rather than to the card: a bubble as
 * wide as a panel stops reading as something somebody said.
 */
export const BUBBLE = { w: 188, h: 96 } as const;

/**
 * SC03's two readings, as one centred pair.
 *
 * ⚠ A GAP, NOT TWO POSITIONS — Simon: "jarak antara probabilitas dengan
 * kepastian buat jadi 150 px aja". Placed independently in two half-card
 * columns, the distance between the WORDS depends on how long they are, which
 * is not a number anyone can set. One centred row with a gap between its
 * children is, and the sentence under each reading travels with it.
 */
export const READINGS = { gap: 150, noteW: 430 } as const;

/**
 * SC03's dashed note, stamped over the top of the chart.
 *
 * ⚠ CENTRED ON THE FRAME AND HIGH IN THE CARD — Simon: "di tengah chart bagian
 * atas". That band is the one part of this tape with nothing in it: the price
 * spends the whole window well below its own high, so the box lands on paper
 * rather than on candles.
 */
export const NOTE_BOX = (() => {
  /**
   * ⚠ ITS TOP EDGE IS THE LOGO BAND'S FLOOR, and that is what buys the type its
   * size. Nothing may enter the first 150px of the canvas to the right of
   * `logoZone.maxX`, so a box that pokes above that line is capped at 816px
   * wide — and at 816px this sentence cannot be set larger than 30px. Sitting
   * ON the line instead, the width is free and the type can be read.
   *
   * ⚠ THE TRADE: it is no longer exactly half in and half out (Simon's first
   * instruction) — 40px of it stands above the card and 100px inside. It still
   * straddles the card's edge, which is what makes it read as a note stuck onto
   * the chart rather than a panel inside it. The alternative is 30px type.
   */
  /**
   * ⚠ TUNED TO THE SENTENCE, MEASURED OFF A RENDER. The longest line sets 992px
   * at 40px type, and this leaves ~44px of air each side — Simon asked for it
   * tighter, then for 10px back on each side. Nothing in code can measure a
   * string's width, so this number is the one thing here that has to be
   * re-checked if the wording or the type size changes; the render will show it
   * immediately.
   */
  const w = 1080;
  const h = 140;
  return { x: (theme.canvas.width - w) / 2, y: theme.logoZone.height, w, h };
})();

/* ── charts with a histogram under them ─────────────────────────────────── */
/** Same 70 / 6 / 24 split VIDEO 20 settled on: the histogram is a companion to
 *  price, and a pane given equal height stops being one. */
const SPLIT = { price: 0.7, gap: 0.06, volume: 0.24 };

export const PRICE: Rect = { x: PLOT.x, y: PLOT.y, w: PLOT.w, h: PLOT.h * SPLIT.price };
export const VOL: Rect = {
  x: PLOT.x,
  y: PLOT.y + PLOT.h * (SPLIT.price + SPLIT.gap),
  w: PLOT.w,
  h: PLOT.h * SPLIT.volume,
};
/** The whole plot, for a scene with no histogram. */
export const FULL: Rect = PLOT;

/**
 * ═══ CG-B · THE ADMR CASE NEEDS THREE PANES ═══
 *
 * Price, volume AND a MACD histogram — the narration names all three as the
 * evidence that made the setup look like a rebound, so all three have to be
 * on screen when it says so.
 *
 * ⚠ THE PRICE PANE GIVES UP THE HEIGHT, and it still has to hold a 150-bar
 * tape with an MA100 through it. 56 / 18 / 18 with two gaps is the shallowest
 * the two lower panes can be and still be read as histograms.
 */
const ADMR_SPLIT = { price: 0.55, gap: 0.055, vol: 0.17, macd: 0.17 };
export const ADMR_PANES = {
  price: { x: PLOT.x, y: PLOT.y, w: PLOT.w, h: PLOT.h * ADMR_SPLIT.price },
  vol: {
    x: PLOT.x,
    y: PLOT.y + PLOT.h * (ADMR_SPLIT.price + ADMR_SPLIT.gap),
    w: PLOT.w,
    h: PLOT.h * ADMR_SPLIT.vol,
  },
  macd: {
    x: PLOT.x,
    y: PLOT.y + PLOT.h * (ADMR_SPLIT.price + ADMR_SPLIT.gap * 2 + ADMR_SPLIT.vol),
    w: PLOT.w,
    h: PLOT.h * ADMR_SPLIT.macd,
  },
} as const;

/* ── the mistake counter (CG-E) ─────────────────────────────────────────── */
/**
 * Top-left, level with the title strip.
 *
 * ⚠ LEFT, NOT RIGHT. The top-right 360×150 belongs to the logo, and this chip
 * is on screen for eight scenes — parking it there would collide for most of
 * the episode rather than in one frame someone would notice.
 */
export const COUNTER_AT = { x: theme.stage.active.x, y: theme.stage.active.y + 18 };

/* ── comparisons ────────────────────────────────────────────────────────── */
export const GAP = 56;
export const halves = (rect: Rect = CARD): [Rect, Rect] => {
  const [a, b] = columns(rect, 2, GAP);
  return [a, b];
};

/**
 * A comparison window's own panes: a strip along the top for the wider market,
 * the setup's price pane under it.
 *
 * ⚠ THE CONTEXT STRIP IS ABOVE THE SETUP, not beside it. SC09's claim is that
 * the strip is the thing the setup is being read INSIDE; putting them
 * side-by-side would make them two readings rather than one nested in the
 * other.
 */
export const contextPanes = (half: Rect) => {
  const pad = half.w * 0.07;
  const box = { x: half.x + pad, w: half.w - pad * 2 };
  const top = half.y + half.h * 0.17;
  const stripH = half.h * 0.17;
  return {
    strip: { ...box, y: top, h: stripH },
    price: { ...box, y: top + stripH + half.h * 0.09, h: half.h * 0.48 },
  };
};

/* ── SC10's indicator stack ─────────────────────────────────────────────── */
/**
 * A price pane that SHRINKS as panes are added under it, five of them, until
 * the chart is squeezed. The crowding is the argument, so the geometry has to
 * actually crowd.
 *
 * ⚠ AND IT NEVER LEAVES THE PLOT. When five panes will not fit, the panes get
 * shorter — the stack does not grow downward into the caption band.
 */
export const OVERLOAD_PANES = 5;
export const overloadStack = (added: number) => {
  const gap = 14;
  const paneH = added === 0 ? 0 : (PLOT.h * 0.46 - gap * (added - 1)) / added;
  const priceH = PLOT.h - (added === 0 ? 0 : PLOT.h * 0.46 + gap);
  const price: Rect = { x: PLOT.x, y: PLOT.y, w: PLOT.w, h: priceH };
  const panes: Rect[] = [];
  for (let i = 0; i < added; i++) {
    panes.push({ x: PLOT.x, y: PLOT.y + priceH + gap + i * (paneH + gap), w: PLOT.w, h: paneH });
  }
  return { price, panes };
};

/* ── SC14's two trade cards ─────────────────────────────────────────────── */
export const tradeCards = (): [Rect, Rect] => {
  const [a, b] = halves(inset(CARD, 0, CARD.h * 0.06));
  return [a, b];
};

/* ── rails and lists ────────────────────────────────────────────────────── */
/** SC16's process rail, centred in the card. */
export const RAIL: Rect = {
  x: CARD.x + CARD.w * 0.16,
  y: CARD.y + CARD.h * 0.05,
  w: CARD.w * 0.68,
  h: CARD.h * 0.9,
};
/** Where that same rail sits once SC17 shrinks it to the left. (CG-C) */
export const RAIL_LEFT: Rect = {
  x: CARD.x,
  y: CARD.y + CARD.h * 0.1,
  w: CARD.w * 0.4,
  h: CARD.h * 0.8,
};
/** SC17's self-check panel, in the space the rail vacates. */
export const SELF_PANEL: Rect = {
  x: CARD.x + CARD.w * 0.46,
  y: CARD.y + CARD.h * 0.1,
  w: CARD.w * 0.54,
  h: CARD.h * 0.8,
};

/* ── SC18's rule rows ───────────────────────────────────────────────────── */
export const RULES: Rect = {
  x: CARD.x + CARD.w * 0.1,
  y: CARD.y + CARD.h * 0.16,
  w: CARD.w * 0.8,
  h: CARD.h * 0.68,
};

/* ── the closing quote card ─────────────────────────────────────────────── */
/** ⚠ CENTRED IN THE BAND BETWEEN THE TWO RESERVES, not in the canvas: the
 *  logo zone owns the top 150 and the captions own the bottom 108, so the
 *  middle of the *canvas* is not the middle of what the viewer sees. */
export const QUOTE_BAND = (theme.logoZone.height + theme.captionBand.top) / 2;
/** ⚠ ONE LINE'S WORTH OF CARD. At 258 it was a panel with a sentence
 *  lying at the top of it. */
export const QUOTE_CARD = { w: CARD.w * 0.62, h: 196, lead: 62, size: 44, markH: 132, gap: 28 };

/* ── the claim that nothing lands in a reserve, asserted ────────────────── */
(() => {
  const boxes: Record<string, Rect> = {
    PRICE, VOL, FULL, RAIL, RAIL_LEFT, SELF_PANEL, RULES,
    ADMR_PRICE: ADMR_PANES.price, ADMR_VOL: ADMR_PANES.vol, ADMR_MACD: ADMR_PANES.macd,
    DASH_STRIP: DASH.strip, DASH_HEADER: DASH.header, DASH_PLOT: DASH.plot,
    DASH_VOL: DASH.vol, DASH_AXIS: DASH.axis, DASH_TILES: DASH.tiles,
  };
  for (const [name, r] of Object.entries(boxes)) {
    if (r.y + r.h > theme.captionBand.top)
      throw new Error(`022-ta-mistakes/layout: ${name} runs into the caption band`);
    if (r.y < theme.logoZone.height && r.x + r.w > theme.logoZone.maxX)
      throw new Error(`022-ta-mistakes/layout: ${name} is inside the logo zone`);
    if (r.x < theme.margin.left || r.x + r.w > theme.canvas.width - theme.margin.right)
      throw new Error(`022-ta-mistakes/layout: ${name} is past a side margin`);
  }
  /* the deepest the indicator stack ever reaches */
  const deep = overloadStack(OVERLOAD_PANES).panes[OVERLOAD_PANES - 1];
  if (deep.y + deep.h > theme.captionBand.top)
    throw new Error("022-ta-mistakes/layout: the indicator stack reaches the caption band");
  /* the dashboard's bands must stack inside the card, in order and without
     overlapping — six numbers typed by hand is six chances to be 4px out */
  for (const [name, bands] of [
    ["dashboard", [DASH.strip, DASH.header, DASH.plot, DASH.vol, DASH.axis]],
    ["ma", [MA.plot, MA.vol, MA.axis]],
  ] as const) {
    for (let i = 1; i < bands.length; i++) {
      if (bands[i].y < bands[i - 1].y + bands[i - 1].h)
        throw new Error(`022-ta-mistakes/layout: ${name} band ${i} overlaps the one above it`);
    }
    const last = bands[bands.length - 1];
    if (last.y + last.h > CARD.y + CARD.h)
      throw new Error(`022-ta-mistakes/layout: the ${name} chart runs past the bottom of its card`);
  }
  if (DASH.plot.x + DASH.plot.w > DASH.tiles.x)
    throw new Error("022-ta-mistakes/layout: the chart column runs into the stat tiles");
  /* ⚠ THE PRICE COLUMN CHECK IS GONE WITH THE PRICE COLUMN. It guarded a scale
     drawn OUTSIDE the plot; the scale was removed (Simon: "tulisan label
     harganya hapus aja"), so what is left is an ordinary inset. What matters
     now is the other edge — the tape is meant to reach the card's. */
  if (MA.plot.x + MA.plot.w !== CARD.x + CARD.w)
    throw new Error("022-ta-mistakes/layout: the MA plot no longer ends on the card's right edge");
})();

/**
 * ═══ THE CARD LIST'S ROW ═══
 *
 * ⚠ THE GAP IS SOLVED FOR, NOT CHOSEN — Simon: "yang bisa terlihat penuh di
 * layar hanya 5, card yang ke 6 harusnya hanya terlihat setengah, jadi jaraknya
 * tolong disesuaikan". Five cards and half of a sixth have to reach exactly the
 * right edge of the frame, which fixes the gap once the card's width is picked:
 *
 *     left + 5·(w + gap) + w/2 = canvas.width
 *
 * Type a gap instead and the sixth card is cut at whatever fraction falls out.
 */
export const CARD_ROW = (() => {
  const w = 280;
  const h = 640;
  const left = theme.margin.left;
  const gap = (theme.canvas.width - left - 5.5 * w) / 5;
  return {
    w,
    h,
    gap,
    y: (theme.canvas.height - h) / 2,
    x: (i: number) => left + i * (w + gap),
  };
})();

{
  /** Kept honest: the sixth card must be cut exactly in half by the frame. */
  const c = CARD_ROW;
  const half = c.x(5) + c.w / 2;
  if (Math.abs(half - theme.canvas.width) > 0.5) {
    throw new Error(`022-ta-mistakes/layout: the sixth card is cut at ${half}, not at the frame's edge`);
  }
}

/**
 * ═══ THE OPENED TRANSITION CARD ═══  (Simon)
 *
 * The one card the list hands to the middle at 2229, and the box everything
 * after it is drawn inside.
 *
 * ⚠ FOUR EQUAL BANDS, IMAGINED AND NEVER DRAWN. Simon places the contents of
 * this card against a card cut into four equal rows; `support` is the line
 * between the two lowest of them. Held here rather than in the scene because
 * more than one thing is about to be placed against it, and two scenes that
 * each work out "a quarter of the way up" for themselves will eventually
 * disagree by a pixel.
 *
 * ⚠ THE PLOT'S WIDTH IS SOLVED, NOT TYPED. Simon's rule is about the CANDLE:
 * the last one must stop 80px short of the card's right edge. A box whose own
 * edge is 80px short would put the last candle at 80 + the grid's padding +
 * half a body, i.e. somewhere else. So the box is solved backwards from where
 * the candle has to end, using the real grid and the real candle width — and
 * asserted, because a solve nobody checks is a guess with arithmetic in it.
 */
export const CARD_OPEN = (() => {
  const w = 640;
  const x = (theme.canvas.width - w) / 2;
  const { y, h } = CARD_ROW;
  const band = h / 4;
  const support = y + band * 3;

  /** Simon's: where the candles must stop, measured from the card's right edge. */
  const padR = 250;
  const bars = 10;
  const endOf = (bw: number) => {
    const g = gridOf(new Array(bars).fill(0), [0, 1], { x: x + DPAD, y, w: bw, h }, 0);
    return g.x(bars - 1) + candleWidth(g) / 2;
  };
  /** ⚠ TWO PROBES ARE ENOUGH BECAUSE THE END IS LINEAR IN THE WIDTH. Newton on
   *  a straight line lands exactly; the assertion below proves it did. */
  const target = x + w - padR;
  const [a, b] = [400, 600];
  const plotW = a + ((target - endOf(a)) * (b - a)) / (endOf(b) - endOf(a));
  const plot = { x: x + DPAD, y, w: plotW, h };

  return { x, y, w, h, band, support, bars, pad: DPAD, padR, plot };
})();

{
  const o = CARD_OPEN;
  const g = gridOf(new Array(o.bars).fill(0), [0, 1], o.plot, 0);
  const end = g.x(o.bars - 1) + candleWidth(g) / 2;
  if (Math.abs(end - (o.x + o.w - o.padR)) > 0.5) {
    throw new Error(
      `022-ta-mistakes/layout: the last candle ends at ${end.toFixed(1)}, not ${o.padR}px from the card's right edge`,
    );
  }
  /** And the support has to be a band line, not near one. */
  if (Math.abs(o.support - (o.y + o.h * 0.75)) > 1e-9) {
    throw new Error("022-ta-mistakes/layout: the card's support is not the line between its two lowest bands");
  }
}

/**
 * ═══ THE CARD GROWN, AND THE CHART ZOOMED OUT INSIDE IT ═══  (Simon)
 *
 * ⚠ THE CARD BECOMES THE ORDINARY ONE. "Sebesar chart di 286" is `theme.stage.
 * card` — the window every other scene in this episode draws in. Held as that
 * rather than as its measurements, so the transition lands on the same box the
 * rest of the video uses instead of on a copy of it that will drift.
 *
 * ⚠ AND THE CHART SHRINKS WHILE THE CARD GROWS, which is the move: zooming a
 * chart OUT is how room appears at the right for bars that have not happened
 * yet. Simon's numbers are `dx`, `dy` and the two scales; everything else is
 * solved from them.
 *
 * ⚠ ANCHORED ON WHAT THE EYE IS WATCHING, not on a corner. The shift is applied
 * to the CENTRE of the ten bars already drawn and to the middle of the prices
 * they cover, so "150 left and 100 up" is 150 and 100 for the thing on screen.
 * Anchored top-left, the same numbers would move the tape by some other amount
 * entirely, because the box also shrank.
 */
export const CARD_GROWN = theme.stage.card;

export const CARD_ZOOM = (() => {
  /** ⚠ SIMON'S NUMBERS — except `dx`, which is now solved. See below. */
  const kx = 0.75;
  const ky = 0.62;
  const dy = -100;
  /**
   * ⚠ THE LEFT SHIFT IS BOUNDED BY THE CARD IT HAPPENS IN. Simon asked for 150
   * and then, once the zoom moved back to 2676, for the three red bars on the
   * left to survive it — and those two cannot both be had. At 150 the zoom-out
   * pushes the tape's first three bars out of a card that is still 640 wide.
   *
   * So the shift is taken as far as it can go and no further: the last gap
   * before the tape's first bar must still land inside the card's left edge.
   * `WANT` records what was asked for, because the day this happens in a wider
   * card the answer is 150 again and nobody should have to re-derive that.
   */
  const WANT = -150;
  const MARGIN = 6;

  /** 10 drawn + 14 that fall. The count is what a zoom-out is FOR. */
  const bars = CARD_OPEN.bars + 14;
  /** The middle of the prices the ten bars cover — the anchor for `dy`. */
  const MID = 0.6;

  const a = gridOf(new Array(CARD_OPEN.bars).fill(0), [0, 1], CARD_OPEN.plot, 0);
  const pitchA = a.x(1) - a.x(0);
  const pitchB = pitchA * kx;
  const half = (CARD_OPEN.bars - 1) / 2;

  const w = pitchB * (bars - 1) + GRID_PAD_X * 2;
  const h = CARD_OPEN.plot.h * ky;
  /** The first bar of the tape, at the zoomed scale, before any shift. */
  const rest = a.x(0) + half * (pitchA - pitchB);
  const floor = CARD_OPEN.x + MARGIN + pitchB / 2 - rest;
  const dx = Math.max(WANT, floor);
  const x = rest + dx - GRID_PAD_X;
  const y = a.y(MID) + dy - h * (1 - MID);

  return { bars, kx, ky, dx, dy, want: WANT, plot: { x, y, w, h } };
})();

{
  const o = CARD_OPEN;
  const z = CARD_ZOOM;
  const a = gridOf(new Array(o.bars).fill(0), [0, 1], o.plot, 0);
  const b = gridOf(new Array(z.bars).fill(0), [0, 1], z.plot, 0);
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  /** Simon's shift, measured on the thing that moved rather than on its box. */
  const centre = (g: { x: (i: number) => number }) => (g.x(0) + g.x(o.bars - 1)) / 2;
  if (Math.abs(centre(b) - centre(a) - z.dx) > 0.5) fail("the zoom does not move the tape left by dx");
  /** ⚠ AND THE THREE RED BARS SURVIVE IT — Simon. The gap in front of the
   *  tape's first bar has to land inside the small card, or the zoom-out pushes
   *  the start of the tape out of the card it happens in. */
  const lead = b.x(0) - (b.x(1) - b.x(0)) / 2;
  if (lead < CARD_OPEN.x) fail(`the zoom pushes the tape past the card's left edge, to ${lead.toFixed(0)}`);
  if (Math.abs(b.y(0.6) - a.y(0.6) - z.dy) > 0.5) fail("the zoom does not move the tape up by dy");
  /** And everything it draws has to still be inside the grown card. */
  const lowest = b.y(-0.33);
  if (b.y(0.95) < CARD_GROWN.y || lowest > CARD_GROWN.y + CARD_GROWN.h)
    fail(`the zoomed chart runs from ${b.y(0.95).toFixed(0)} to ${lowest.toFixed(0)}, outside the grown card`);
  if (b.x(z.bars - 1) > CARD_GROWN.x + CARD_GROWN.w - o.pad)
    fail("the fall runs off the right of the grown card");
}

/**
 * ═══ THE REVENGE TRADE'S CLOSING NOTE ═══  Simon, at 5721: "geser naik chart
 * untuk memberi ruang pada text box garis putus putus, lalu tambahkan text box
 * garis putus putus di bawah chart".
 *
 * ⚠ THE LIFT IS NOT A CHOSEN DISTANCE — it is what is left over once the card
 * and its note are treated as ONE object and that object is centred in the safe
 * area. Typed, the card would be "about right" until a margin moved; solved,
 * the air above the card and the air below the box are the same number by
 * construction, and the box can never end up in the subtitle band.
 *
 * ⚠ AND THE BOX IS BELOW THE CARD, NOT OVER IT. The note at 3832 overlaps its
 * chart because Simon asked for that — there was white space to sit in. Here
 * the card is full of the trade that just failed, so the room has to be made
 * rather than found. That is the whole reason the chart moves at all.
 *
 * ⚠ THE WIDTH IS MEASURED, NOT COMPUTED — same rule as CARD_NOTE, and measured
 * against the LONGER of the two sentences the box has to hold, because the
 * second one replaces the first inside the same frame.
 */
export const REVENGE_NOTE = (() => {
  const gap = 40;
  const w = 920;
  const h = 104;
  const group = CARD_OPEN.h + gap + h;
  const { y: ay, h: ah } = theme.stage.active;
  const top = ay + (ah - group) / 2;
  return {
    /** How far the whole chart group rises. */
    up: CARD_OPEN.y - top,
    box: { x: (theme.canvas.width - w) / 2, y: top + CARD_OPEN.h + gap, w, h },
  };
})();

{
  const n = REVENGE_NOTE;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  if (n.up <= 0) fail("the revenge note leaves no room to lift the chart into");
  /** ⚠ THE BOX MAY NOT ENTER THE SUBTITLE BAND. It is the one rule in this
   *  episode that no scene is allowed to negotiate. */
  if (n.box.y + n.box.h > theme.captionBand.top) {
    fail(`the revenge note ends at ${(n.box.y + n.box.h).toFixed(0)}, inside the subtitle band`);
  }
  /** And the lifted card may not climb out of the top of the safe area. */
  if (CARD_OPEN.y - n.up < theme.stage.active.y) {
    fail("lifting the chart takes it above the safe area");
  }
  /** The air above the card and below the box is the same by construction —
   *  assert it, so a later edit to `gap` cannot quietly make it a typed offset. */
  const above = CARD_OPEN.y - n.up - theme.stage.active.y;
  const below = theme.stage.active.y + theme.stage.active.h - (n.box.y + n.box.h);
  if (Math.abs(above - below) > 0.5) {
    fail(`the group is not centred: ${above.toFixed(1)} above, ${below.toFixed(1)} below`);
  }
}
