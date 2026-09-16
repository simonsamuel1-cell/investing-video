/**
 * data/layout.ts — every box this episode draws in, derived from `theme.stage`.
 *
 * ⚠ NOTHING HERE IS A TYPED COORDINATE. Move a margin in the theme and every
 * scene in this episode follows. A number that appears twice in a scene file
 * belongs here instead.
 */
import { GRID_PAD_X, candleWidth, gridOf, splitRects, theme, columns, inset } from "../../../core";
import type { Rect } from "../../../core";
import { CARD_LIST } from "./timing";
import { SETUP_FAILS, SETUP_TRADE, SETUP_WORKS } from "./series";

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
/**
 * ⚠ `VISIBLE` IS A WINDOW, NOT A COUNT. Simon's rule fixes how much of the row
 * the frame shows — five whole cards and half of the next — and that is
 * independent of how long the list actually is. It was written here as a `5.5`
 * and a `5` back when the list happened to be six long; those two numbers
 * looked like the list's length and were not, which is why adding the two
 * missing mistakes appeared to be a layout problem. It is not: the row is
 * unchanged, and the list is now longer than the window.
 */
export const VISIBLE = 6;

export const CARD_ROW = (() => {
  const w = 280;
  const h = 640;
  const left = theme.margin.left;
  const gap = (theme.canvas.width - left - (VISIBLE - 0.5) * w) / (VISIBLE - 1);
  return {
    w,
    h,
    gap,
    y: (theme.canvas.height - h) / 2,
    x: (i: number) => left + i * (w + gap),
  };
})();

{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  const c = CARD_ROW;
  /** Kept honest: the last card of the WINDOW must be cut exactly in half by
   *  the frame — the thing Simon asked for, stated against the window rather
   *  than against the list. */
  const half = c.x(VISIBLE - 1) + c.w / 2;
  if (Math.abs(half - theme.canvas.width) > 0.5) {
    fail(`card ${VISIBLE} is cut at ${half.toFixed(1)}, not at the frame's edge`);
  }
  /**
   * ⚠ ON THE RECORD, AND UNRESOLVED: the list is longer than the window. With
   * eight mistakes and a six-card window, cards 7 and 8 sit entirely off the
   * right edge and are never seen. That is what Simon's two rules add up to —
   * "only five and a half fit" and "there are eight" — and the way out is a
   * decision he has to make, not one to be taken here by quietly narrowing the
   * cards and restyling four transitions that are already approved. This does
   * not throw; it is a note in the one place anybody would look.
   */
  if (CARD_LIST.titles.length > VISIBLE) {
    const off = CARD_LIST.titles.length - VISIBLE;
    if (c.x(VISIBLE) < theme.canvas.width) {
      fail(`card ${VISIBLE + 1} is partly on screen, so the window rule is not what it says (${off} cards past it)`);
    }
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
 * ⚠ TWO LINES, BOTH KEPT — Simon: "buat 2 text line aja, gabung dengan 'Tidak
 * ada setup = jangan trade'". The second sentence used to REPLACE the first and
 * it read as rushed, because the eye had barely finished the first one. Stacked
 * instead, the box is an argument with two halves rather than a sign that
 * changed its mind.
 *
 * ⚠ THE HEIGHT IS DERIVED FROM THE TYPE, and `pad` is the same 30 the one-line
 * note at 3832 works out to. So this box is that box with a second line in it,
 * not a second box that happens to look similar.
 *
 * ⚠ THE WIDTH IS STILL MEASURED, NOT COMPUTED — same rule as CARD_NOTE, and
 * measured against the LONGER of the two sentences, since they now share a
 * frame rather than take turns in one.
 */
export const REVENGE_NOTE = (() => {
  const gap = 40;
  const w = 920;
  const line = Math.round(theme.text.body.size * 1.25);
  const h = line * 2 + 30 * 2;
  const group = CARD_OPEN.h + gap + h;
  const { y: ay, h: ah } = theme.stage.active;
  const top = ay + (ah - group) / 2;
  return {
    /** How far the whole chart group rises. */
    up: CARD_OPEN.y - top,
    box: { x: (theme.canvas.width - w) / 2, y: top + CARD_OPEN.h + gap, w, h },
    /** One text row, so the scene stacks its two lines on the same rhythm the
     *  box was sized by. */
    line,
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

/**
 * ═══ SC08's CLOSING GROUP ═══  Simon, 6594: the two windows shrink toward the
 * middle and a question box appears under them — and then, on seeing it,
 * "semua visual di geser naik, karna secara design, bagian atas dan bawah tidak
 * balance".
 *
 * ⚠ THE LIFT IS SOLVED, NOT TYPED. The windows and the box are one object once
 * the box is up, and that object is centred in the safe area. What is left over
 * is how far everything rises. Typed, it would be right for this box and wrong
 * the moment the box gained a line.
 *
 * ⚠ AND IT IS SOLVED FOR THE TALLER BOX. The second question arrives at 6787
 * and stays, so the two-line state is the one the eye lives with; balanced for
 * one line it would sink 22px low the moment the second turned up.
 *
 * ⚠ THE WINDOW GEOMETRY IS RESTATED HERE, and that is the price of the box
 * knowing where the windows end. It was wrong before: this block used window 1's
 * UNGROWN foot and so put the box 22px too high, leaving 26px of air under the
 * windows where 48 was asked for. The grow is now part of the solve, and the
 * assertion below re-derives the same floor a second way.
 */
export const PROVE_BOX = (() => {
  const C = theme.canvas.height / 2;
  /** Window 1's own box, before anything happens to it. */
  const win = { top: 265, bottom: 801 };
  /** ⚠ THE TWO TRANSFORMS THE SCENE APPLIES, in the order it applies them. */
  const GROW = 1.1;
  const SHRINK = 0.7;
  const mid = (win.top + win.bottom) / 2;
  const grownTop = mid - ((win.bottom - win.top) * GROW) / 2;
  const grownBottom = mid + ((win.bottom - win.top) * GROW) / 2;
  const top = C + (grownTop - C) * SHRINK;
  const floor = C + (grownBottom - C) * SHRINK;

  const line = Math.round(theme.text.body.size * 1.25);
  const pad = 30;
  const w = 720;
  const gap = 48;
  const two = line * 2 + pad * 2;
  const boxY = floor + gap;

  /** Centre the whole thing — windows and the taller box — in the safe area. */
  const A = theme.stage.active;
  const height = boxY + two - top;
  const up = top - (A.y + (A.h - height) / 2);

  return {
    up: Math.round(up),
    x: (theme.canvas.width - w) / 2,
    y: Math.round(boxY - up),
    w,
    line,
    pad,
    one: line + pad * 2,
    two,
    /** Kept for the assertion below, and for anything that needs to know where
     *  the windows come to rest. */
    windows: { top: top - up, floor: floor - up },
  };
})();

{
  const b = PROVE_BOX;
  const A = theme.stage.active;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  /** ⚠ EVEN AT ITS TALLER HEIGHT IT MAY NOT ENTER THE SUBTITLE BAND. The box
   *  grows after it has arrived, so the check that matters is the second one. */
  if (b.y + b.two > theme.captionBand.top) {
    fail(`the closing question ends at ${b.y + b.two}, inside the subtitle band`);
  }
  if (b.two <= b.one) fail("the box's two-line height is not taller than its one-line height");
  if (b.windows.top < A.y) fail("the lift takes the windows above the safe area");
  /** ⚠ AND THE AIR ABOVE AND BELOW HAS TO MATCH, which is the whole point of
   *  the lift. Within a pixel, since the lift is rounded to one. */
  const above = b.windows.top - A.y;
  const below = A.y + A.h - (b.y + b.two);
  if (Math.abs(above - below) > 1.5) {
    fail(`the closing group is not balanced: ${above.toFixed(1)} above, ${below.toFixed(1)} below`);
  }
}

/**
 * ═══ SC09 · ONE SETUP, TWO MARKETS ═══  Simon's sketch: a bracket across the
 * top naming the setup, two columns under it for the two markets, a chart in
 * each, and a verdict under each chart.
 *
 * ⚠ THE BRACKET SPANS BOTH COLUMNS, and that is the drawing's argument. A title
 * over each chart would say "here are two setups"; one title over both says
 * "here is one setup, twice" — which is the only reason the two outcomes mean
 * anything.
 *
 * ⚠ THE WHOLE STACK IS CENTRED, not hung from the top. Its height is the sum of
 * its parts, so a taller chart or a bigger gap re-centres everything instead of
 * pushing the verdicts toward the subtitle band.
 */
export const BREAKOUT_BOX = (() => {
  const [left, right] = halves();
  /**
   * ⚠ NO HEADING ROW ANY MORE — Simon: "taro di dalem windownya aja, taro pojok
   * kiri atas". The names moved inside their own cards, so the 78px that held
   * them above the boxes is gone and the stack is that much shorter. It
   * re-centres on its own, because its height was always a sum rather than a
   * set of typed tops.
   */
  const toBox = 86;
  const toVerdict = 48;
  /**
   * ⚠ THE CHART'S OWN HEIGHT, AND IT DOES NOT MOVE. Simon lengthened the
   * WINDOW — "panjangin height kedua windows hingga sell dan loss 20% di window
   * kanan muat" — so the room comes out of the card, not out of the two tapes
   * he has already approved the shape of. 301 is what both plots have been
   * since ss06 and ss07 were traced.
   */
  const plotH = 301;
  /** The inset a plot keeps from a card edge when nothing is asking for more. */
  const rim = 34;
  /**
   * And from the top edge, where the window's own name sits. 76 is the measured
   * number: at this inset a heading's ink ends 14px above the first candle, and
   * nothing is drawn behind the words.
   */
  const headroom = 76;
  /** Half the type that sits above the rule and below the verdict row. */
  const half = 24;
  /**
   * ⚠ THE MARKS' OWN METRICS, AND THE CARDS' INSETS ARE SOLVED FROM THEM.
   *
   * Simon: "kasih jarak antara dot dengan label buy 30 px". A gap stated
   * border-to-border is only true if everything it is measured between has a
   * KNOWN size, so the dot, the pill and the note are all fixed here rather
   * than left to the text inside them — a pill that sizes itself to its own
   * line box is a pill whose 30px is whatever the font decided.
   *
   * `pill` 48 and `note` 38 are the heights those two already render at (the
   * pill measured off frame 7900 before this change, so the badge does not
   * move); they are typed as the contract now, not as a description.
   */
  const mark = {
    /** ⚠ 9, AND THE CARD FOLLOWS IT. Simon grew the dot by 2; because the 30 is
     *  measured from its EDGE, every label drops 2px with it, every mark reaches
     *  2px deeper, and both windows are 2px taller for it. That chain is the
     *  reason this is one number and not four. */
    dot: 9,
    gap: 30,
    pill: 48,
    note: 38,
    /** Between the "Sell" pill and the line under it. */
    stack: 8,
    /** A label group's width, so it can be centred and clamped deterministically. */
    group: 180,
    /** How close a group may come to its card's side. */
    edge: 24,
    /** And how close the lowest mark may come to the card's floor. */
    floor: 10,
  };
  /**
   * ⚠ THE BOTTOM INSET IS THE "Buy" MARK'S OWN HEIGHT, NOT A NUMBER.
   *
   * The left card's entry hangs under the LOWEST bar of its tape — which, with
   * a zero-pad grid, is the plot's own floor — so everything below that line
   * has to be paid for out of the card: the dot, Simon's 30, the pill, and a
   * clearance so the pill is not welded to the card's edge. It was 76 when the
   * mark was a bare badge sitting 22px under the low; the 30 makes it 95, and
   * deriving it is the only way the two numbers cannot drift apart.
   */
  /**
   * ═══ AND THE CARD IS AS TALL AS ITS DEEPEST MARK NEEDS ═══
   *
   * ⚠ THIS IS WHY THE WINDOWS GREW. Every mark now hangs BELOW its bar's low,
   * and the sideways exit is on a bar 81% of the way down its own plot — so its
   * label reaches 73px past the floor of the chart, where the trending entry
   * (on the lowest wick there is, and therefore ON the floor) reaches 85. A card
   * that only had `rim` under its chart could hold neither.
   *
   * ⚠ AND IT IS SOLVED, NOT TRIED. The reach depends on where the bar sits in
   * the plot, which depends on the plot's height, which is what the card is
   * being sized around — get it by eye and it is right until a tape is
   * re-traced. Both cards then take the taller of the two, because they must
   * stay the same size, and each spends its own leftover on the inset above.
   */
  const tapes = [SETUP_WORKS, SETUP_FAILS];
  const bottom = tapes.map((t, i) => {
    const lo = Math.min(...t.map((b) => b.l));
    const hi = Math.max(...t.map((b) => b.h));
    /** 0 at the top of the plot, 1 on its floor. */
    const down = (v: number) => (hi - v) / (hi - lo);
    const reach = [
      { bar: SETUP_TRADE.buy[i], h: mark.dot + mark.gap + mark.pill },
      { bar: SETUP_TRADE.sell[i], h: mark.dot + mark.gap + mark.pill + mark.stack + mark.note },
    ].map((m) => m.h - plotH * (1 - down(t[m.bar].l)));
    return Math.max(rim, Math.max(...reach) + mark.floor);
  });
  const chartH = Math.ceil(plotH + headroom + Math.max(...bottom));
  /** ⚠ THE TOP INSET IS THE REMAINDER, so both plots are exactly `plotH` tall
   *  however the rounding falls. Rounding the two insets independently would
   *  leave the charts a pixel apart in height, which is the one thing about
   *  this pair that has to hold. */
  const padTop = bottom.map((b) => Math.round(chartH - plotH - b));
  const height = toBox + chartH + toVerdict + half * 2;
  const A = theme.stage.active;
  const rule = A.y + (A.h - height) / 2 + half;
  return {
    /**
     * ⚠ TWO ARROWS, NOT A BRACKET — Simon: "itu adalah panah yang menunjuk ke
     * kedua windows. Jadi titik end dari setiap panah harusnya mengarah ke
     * tengah width windows". Each runs out from the title and turns down onto
     * its own window's CENTRE, so the title is pointing at two things rather
     * than fencing off a region.
     */
    rule: {
      y: Math.round(rule),
      to: [left.x + left.w / 2, right.x + right.w / 2],
      drop: 46,
    },
    /** Where a window's own name sits, from its top-left corner. */
    head: { x: 34, y: 44 },
    boxes: [
      { x: left.x, y: Math.round(rule + toBox), w: left.w, h: chartH },
      { x: right.x, y: Math.round(rule + toBox), w: right.w, h: chartH },
    ],
    verdict: { y: Math.round(rule + toBox + chartH + toVerdict) },
    mark,
    /**
     * ⚠ THE TWO PLOTS SIT DIFFERENTLY IN THEIR CARDS, AND ARE THE SAME HEIGHT.
     * I wrote the opposite here once ("two plots inset differently inside boxes
     * of the same size are two charts drawn to look like a pair") and Simon
     * overruled it. The rule that survives is the one that matters — the two
     * charts are the SAME SIZE, so nothing about their shapes is being compared
     * unfairly. What differs is only where that size sits inside its card, and
     * that is now decided by each card's own deepest mark rather than chosen.
     *
     * ⚠ AND THE TOP CLEARANCE IS NO LONGER LUCK. It used to be: the left plot
     * started ABOVE its heading's ink and was clear only because ss06 opens low.
     * Every card now gets at least `headroom` over its chart, so re-tracing
     * either tape cannot put a candle behind a heading.
     */
    pad: padTop.map((t) => ({ x: rim, top: t, bottom: chartH - plotH - t })),
  };
})();

{
  const b = BREAKOUT_BOX;
  const A = theme.stage.active;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  if (b.rule.y - 24 < A.y) fail("the setup title is above the safe area");
  /** ⚠ AND EACH ARROW HAS TO LAND ON ITS OWN WINDOW'S MIDDLE. Typed once, the
   *  two would stay right until a window moved; derived, they cannot come
   *  apart from the boxes they point at. */
  b.rule.to.forEach((x, i) => {
    const mid = b.boxes[i].x + b.boxes[i].w / 2;
    if (Math.abs(x - mid) > 0.5) fail(`arrow ${i + 1} points at ${x}, not window ${i + 1}'s centre ${mid}`);
  });
  if (b.rule.y + b.rule.drop >= b.boxes[0].y) fail("the arrows reach into the chart cards");
  /** ⚠ THE TWO PLOTS MUST BE THE SAME HEIGHT even though they sit differently
   *  in their cards — that is the half of the pairing that has to hold, and it
   *  is the half an edit to either inset could break without anything looking
   *  wrong. */
  const h = b.pad.map((q, i) => b.boxes[i].h - q.top - q.bottom);
  if (h[0] !== h[1]) fail(`the two plots are ${h[0]} and ${h[1]} tall`);
  /** ⚠ AND BOTH HAVE TO CLEAR THEIR OWN HEADING, not just the one that once
   *  did not. The ink of a tag centred on `head.y` ends about 16px below it. */
  b.pad.forEach((q, i) => {
    if (q.top <= b.head.y + 16) fail(`chart ${i + 1} starts inside its heading`);
  });
  if (b.verdict.y + 24 > theme.captionBand.top) {
    fail(`the verdicts sit at ${b.verdict.y}, inside the subtitle band`);
  }
  /** ⚠ AND THE STACK IS CENTRED, which is the whole reason its height is a sum
   *  rather than a set of typed tops. */
  const above = b.rule.y - 24 - A.y;
  const below = A.y + A.h - (b.verdict.y + 24);
  if (Math.abs(above - below) > 1.5) {
    fail(`the setup stack is not balanced: ${above} above, ${below} below`);
  }
  if (b.boxes[0].w !== b.boxes[1].w) fail("the two chart boxes are different widths");
  /** ⚠ A LABEL GROUP HAS TO FIT BETWEEN ITS CARD'S MARGINS, or the clamp that
   *  keeps it inside would have nowhere to put it. */
  if (b.mark.group + b.mark.edge * 2 > b.boxes[0].w) {
    fail(`a ${b.mark.group}px label group does not fit inside a ${b.boxes[0].w}px card`);
  }
}

/* ═══ SC15 · SATU SAHAM, DUA RENCANA ═════════════════════════════════════
 *
 * ⚠ THE ARGUMENT IS THE LAYOUT. One header at the top, two columns beneath
 * it, and by the end one chip up there is outnumbered by eight values down
 * here. Nothing on screen says "the ticker is the small part" — the geometry
 * says it, which is why every number below is solved rather than chosen.
 *
 * ⚠ THE HEADER'S TOP EDGE IS THE LOGO ZONE'S FLOOR, derived and not typed.
 * The one object everything else hangs from is as high as this episode is
 * allowed to put it, so the two columns get the most room the frame has.
 *
 * ⚠ AND THE TWO COLUMNS COME FROM `splitRects`, not from two rects. A
 * comparison whose halves are placed independently is a comparison that can
 * quietly stop being symmetrical; asking core for the halves means it cannot.
 */
const PLAN_W = theme.canvas.width;
const PLAN_A = theme.stage.active;

/**
 * A core/Chip pill's height, from the type it is built out of.
 *
 * ⚠ SOLVED, NOT OBSERVED. Chip pads by 0.3 of the size above and below and
 * carries a 2px rule, and the face's own line box is 1.26 of the size. Every
 * gap in this scene that sits above or below a chip is measured from this, so
 * changing a chip's size moves what is around it instead of colliding with it.
 */
const pillH = (size: number) => size * 1.26 + Math.round(size * 0.3) * 2 + theme.shape.rule * 2;

/**
 * ⚠ THE THEME'S SMALLEST TYPE, WHICH IS THE FLOOR THIS PROJECT HAS ALREADY
 * SET. The build prompt sized these three pills by their boxes — 220×40 and
 * 180×40 — which works out at about 20px, below anything else in the library.
 * 26 is the nearest size the episode already trusts to be read, and the pill it
 * builds is 53 tall rather than 40.
 */
const PLAN_CHIP = theme.text.axis.size;

/** The four rows, as one pitch rather than four tops. */
const PLAN_ROW = {
  y0: 530,
  pitch: 80,
  /** The separator, below the row's centre-line and clear of a descender. */
  rule: 30,
  labelSize: 22,
  valueSize: 32,
  /** ⚠ 40% — a separator as strong as the border around the column divides it
   *  into four cards instead of ruling four rows. */
  ruleAlpha: 0.4,
  /** How far a value rises into place. Shorter than the default: four of these
   *  arrive in twelve seconds and a long rise reads as drift. */
  rise: 8,
} as const;

/** The margin above a column's name and below its last separator. ⚠ ONE
 *  NUMBER FOR BOTH, which is what makes the column balanced rather than
 *  bottom-heavy — the build prompt's 440 left 24 above and 60 below. */
const PLAN_COL_PAD = 24;
const PLAN_LAST_RULE = PLAN_ROW.y0 + PLAN_ROW.pitch * 3 + PLAN_ROW.rule;

/** The band the two columns are cut from. Centred on the frame, so the
 *  divider and the header's centre are the same x by construction. */
const PLAN_BAND: Rect = (() => {
  const w = 1600;
  const y = 420;
  return { x: (PLAN_W - w) / 2, y, w, h: PLAN_LAST_RULE + PLAN_COL_PAD - y };
})();

/** ⚠ 200, WHICH IS WHAT MAKES THE COLUMNS 700 WIDE. The gap is the number
 *  chosen; the column width follows from it and from the band. */
const PLAN_GAP = 200;
const [PLAN_LEFT, PLAN_RIGHT] = splitRects(PLAN_GAP, PLAN_BAND);

/** The header card, centred and sitting on the logo zone's floor. */
const PLAN_HEAD: Rect = (() => {
  const w = 400;
  return { x: (PLAN_W - w) / 2, y: theme.logoZone.height, w, h: 180 };
})();

/** Its two insets: the margin all round, and the air between chip and strip. */
const HEAD_PAD = 18;
const HEAD_GAP = 16;

/**
 * ⚠ B1'S STACK IS SPACED FROM THE INK, NOT FROM THE BOXES, and that is the
 * whole reason these three numbers are derived. Measured off a render: a 96px
 * display line's ink ends 122px below the block's own top, and a 36px line's
 * runs 13 above its centre to 21 below. The build prompt's y372 and y444 were
 * spaced from the type's boxes and left THREE pixels between the headline's
 * descenders and the sub's ascenders.
 */
const B1_GAP = 28;
const B1_HEAD_Y = 252;
const B1_INK = { head: 122, subUp: 13, subDown: 21 } as const;

/**
 * A connector from the header's bottom edge to the top of a column, elbowed
 * at the midpoint with a rounded corner.
 *
 * ⚠ IT RETURNS ITS OWN LENGTH. A trim-path draw needs the number, and a path
 * whose dash length is measured by hand stops being right the first time the
 * columns move. Two quarter-circles plus three straights is exact.
 */
const PLAN_ELBOW = 12;
const wireOf = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const r = PLAN_ELBOW;
  const my = (from.y + to.y) / 2;
  const dir = to.x < from.x ? -1 : 1;
  const d =
    `M${from.x},${from.y} L${from.x},${my - r} ` +
    `Q${from.x},${my} ${from.x + dir * r},${my} ` +
    `L${to.x - dir * r},${my} ` +
    `Q${to.x},${my} ${to.x},${my + r} L${to.x},${to.y}`;
  const arc = (Math.PI * r) / 2;
  const len = my - r - from.y + arc + (Math.abs(to.x - from.x) - r * 2) + arc + (to.y - my - r);
  return { d, len };
};

export const PLAN = {
  /** B1 — the card that names the mistake, and then gets out of the way. `x`
   *  is a left edge; `headY` is a TOP, because a display line is anchored by
   *  its first line rather than by its middle, and the two `y` under it are
   *  centre-lines, which is what core/Line and core/Chip anchor on. */
  b1: {
    x: PLAN_A.x,
    chipY: 202,
    /** ⚠ THE BUILD PROMPT'S OWN 20px. It is a badge under a 96px headline, not
     *  a label that has to be read on its own, which is why it is the one chip
     *  here allowed under the theme's smallest size. */
    chipSize: 20,
    headY: B1_HEAD_Y,
    subY: B1_HEAD_Y + B1_INK.head + B1_GAP + B1_INK.subUp,
    rule: { y: B1_HEAD_Y + B1_INK.head + B1_GAP * 2 + B1_INK.subUp + B1_INK.subDown, w: 420 },
    /** How far the whole card travels up as it leaves. */
    lift: 24,
  },

  head: {
    rect: PLAN_HEAD,
    chipSize: PLAN_CHIP,
    chipY: PLAN_HEAD.y + HEAD_PAD + pillH(PLAN_CHIP) / 2,
    /**
     * ⚠ DECORATIVE, AND SIZED TO SAY SO. What is left of a 400×180 card once
     * the chip and the margins have had theirs — there is no room in it for an
     * axis, which is the point.
     */
    tape: {
      x: PLAN_HEAD.x + 40,
      y: PLAN_HEAD.y + HEAD_PAD + pillH(PLAN_CHIP) + HEAD_GAP,
      w: 320,
      h: PLAN_HEAD.h - HEAD_PAD * 2 - pillH(PLAN_CHIP) - HEAD_GAP,
    },
    /** ⚠ CAPPED AT 45% — the strip must never read as something analysable. */
    tapeAlpha: 0.45,
    /** ⚠ TIGHTER THAN THE CHART DEFAULT. 12% of head-room top and bottom on a
     *  75px strip is 18px spent on nothing; the bars need it more than the
     *  margin does. */
    tapePad: 0.08,
  },

  band: PLAN_BAND,
  cols: [PLAN_LEFT, PLAN_RIGHT] as [Rect, Rect],

  /** Both columns are read with the same insets — that is the comparison. */
  col: {
    pad: 40,
    chipSize: PLAN_CHIP,
    chipY: PLAN_BAND.y + PLAN_COL_PAD + pillH(PLAN_CHIP) / 2,
    /** How far a column slides up as it arrives. */
    rise: 10,
  },

  row: PLAN_ROW,

  wires: [
    wireOf({ x: PLAN_W / 2, y: PLAN_HEAD.y + PLAN_HEAD.h }, { x: PLAN_LEFT.x + PLAN_LEFT.w / 2, y: PLAN_BAND.y }),
    wireOf({ x: PLAN_W / 2, y: PLAN_HEAD.y + PLAN_HEAD.h }, { x: PLAN_RIGHT.x + PLAN_RIGHT.w / 2, y: PLAN_BAND.y }),
  ],

  /** ⚠ THE EPISODE'S OWN CAPTION LINE, not a typed y. It is 924, four pixels
   *  above where the build prompt put it, and the four pixels are clearance
   *  the scene's tightest point can use. */
  close: { x: PLAN_W / 2, y: theme.stage.caption.y, size: 32 },
} as const;

{
  const P = PLAN;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  /** ⚠ THE HEADER IS THE ONE OBJECT THE WHOLE SCENE HANGS FROM, so it has to
   *  be on the frame's centre-line and the columns have to be either side of
   *  that same line. Typed, the three would agree until one of them moved. */
  const mid = PLAN_W / 2;
  if (P.head.rect.x + P.head.rect.w / 2 !== mid) fail("SC15's header card is not centred on the frame");
  if (P.band.x + P.band.w / 2 !== mid) fail("SC15's column band is not centred on the frame");
  if (P.cols[0].w !== P.cols[1].w) fail(`SC15's columns are ${P.cols[0].w} and ${P.cols[1].w} wide`);
  if (P.cols[0].x + P.cols[0].w >= mid || P.cols[1].x <= mid) fail("SC15's columns cross their own divider");
  /** ⚠ THE HEADER SITS ON THE LOGO ZONE, NOT IN IT. */
  if (P.head.rect.y < theme.logoZone.height) fail(`SC15's header card starts at ${P.head.rect.y}, inside the logo zone`);
  /** ⚠ AND THE CARD HOLDS ITS TWO THINGS WITH EQUAL AIR ROUND THEM — the one
   *  assertion that catches a chip-size change, which would otherwise push the
   *  strip out of the bottom of the card without anything else complaining. */
  const t = P.head.tape;
  if (t.x < P.head.rect.x || t.x + t.w > P.head.rect.x + P.head.rect.w) fail("SC15's candle strip is wider than its card");
  if (Math.abs(t.y + t.h - (P.head.rect.y + P.head.rect.h - HEAD_PAD)) > 0.5) {
    fail(`SC15's candle strip ends at ${t.y + t.h}, not ${HEAD_PAD}px above the card's floor`);
  }
  if (t.h < pillH(P.head.chipSize)) fail(`SC15's strip is ${Math.round(t.h)}px tall, less than the chip above it`);
  /**
   * ⚠ THE COLUMN IS BALANCED, and this is the assertion that keeps it so. The
   * margin above the name and the margin below the last separator are one
   * number; if the band's height ever stops following the rows, they part.
   */
  const above = P.col.chipY - pillH(P.col.chipSize) / 2 - P.band.y;
  const below = P.band.y + P.band.h - PLAN_LAST_RULE;
  if (Math.abs(above - below) > 0.5) fail(`SC15's columns hold ${above} above and ${below} below`);
  /** ⚠ AND FOUR ROWS HAVE TO FIT UNDER THE NAME. */
  const firstTop = P.row.y0 - P.row.valueSize / 2;
  if (firstTop <= P.col.chipY + pillH(P.col.chipSize) / 2) fail("SC15's first row starts inside the column's own name");
  if (PLAN_LAST_RULE > P.band.y + P.band.h) fail(`SC15's last separator is at ${PLAN_LAST_RULE}, below the column floor`);
  /** ⚠ THE TIGHTEST POINT IN THE SCENE — the closing line's bottom edge, which
   *  is solvable rather than observable because the pill is built from type. */
  const chipLow = P.close.y + pillH(P.close.size) / 2;
  if (chipLow > theme.captionBand.top) {
    fail(`SC15's closing chip reaches ${Math.round(chipLow)}, inside the subtitle band at ${theme.captionBand.top}`);
  }
  /** ⚠ AND NOTHING LEAVES THE SAFE AREA ON EITHER SIDE. */
  if (P.cols[0].x < PLAN_A.x || P.cols[1].x + P.cols[1].w > PLAN_A.x + PLAN_A.w) {
    fail("SC15's columns reach outside the safe area");
  }
  /** ⚠ B1 IS CHECKED AGAINST THE FRAME, NOT AGAINST THE TABLE BELOW IT. Its
   *  rule sits inside the column band — and that is fine, because the title
   *  card is gone on the frame the header arrives and the two never share a
   *  pixel. An assertion comparing them would guard a collision that cannot
   *  happen, and would fail on a correct build. */
  if (P.b1.rule.y >= theme.captionBand.top) fail("SC15's title card rule is in the subtitle band");
  if (P.b1.x + P.b1.rule.w > PLAN_A.x + PLAN_A.w) fail("SC15's title card rule runs past the safe area");
  if (P.b1.chipY - pillH(P.b1.chipSize) / 2 < PLAN_A.y) fail("SC15's mistake chip is above the safe area");
}

/* ═══ SC11 · ONE WINDOW, CENTRED ═════════════════════════════════════════
 *
 * ⚠ A SHIFT, NOT A RESIZE — Simon: "remove 1 window, lalu geser window 1 nya
 * lagi ke tengah". The window that is left is still exactly the size it was as
 * the left half of the pair; only its x moved. That is why the size is taken
 * from `halves()` and then re-centred rather than written out: "the same window
 * moved" is a claim, and the claim is asserted below.
 *
 * ⚠ AND IT IS A LIST OF ONE, ON PURPOSE. Simon is still deciding — this scene
 * has been one window, then two, then one again. `COUNT` is the whole
 * difference; everything downstream maps over the list and does not care how
 * long it is.
 *
 * ⚠ THE OUTER BOUNDS STAY AS THEY WERE, unused by the drawing but kept as the
 * thing the size is derived FROM. Delete it and 836 becomes a number somebody
 * typed.
 */
const W11_BOUNDS: Rect = { x: theme.stage.active.x, y: 230, w: theme.stage.active.w, h: 640 };

/**
 * How many windows the scene draws. 1 or 2 — nothing else is laid out.
 *
 * ⚠ TYPED `number`, NOT `1 | 2`, AND THAT IS NOT LAZINESS. A literal type here
 * narrows to whatever it currently is, and TypeScript then calls the branch for
 * the other value unreachable — so the assertions that guard the arrangement
 * Simon is not using would refuse to compile, and flipping this back would mean
 * editing the checks as well as the number. The point of this constant is that
 * it is the ONLY thing that changes.
 */
const W11_COUNT: number = 1;

/**
 * ⚠ THE INSET IS THE SAME ON THREE SIDES, and the bottom is deeper by exactly
 * the name's own band. A pattern drawing centred in its window with its name
 * under it is the reference's own arrangement; taking the name's room off the
 * plot rather than out of the margin is what keeps the drawing centred in what
 * is left instead of sitting low in the card.
 */
const W11_PAD = 56;
const W11_NAME = 72;

const plotOf = (card: Rect): Rect => ({
  x: card.x + W11_PAD,
  y: card.y + W11_PAD,
  w: card.w - W11_PAD * 2,
  h: card.h - W11_PAD * 2 - W11_NAME,
});

/** ⚠ THE PAIR IS STILL WHAT DECIDES THE SIZE, even when only one is drawn. */
const W11_PAIR = halves(W11_BOUNDS);
const W11_CARDS: Rect[] =
  W11_COUNT === 2
    ? W11_PAIR
    : [{ ...W11_PAIR[0], x: (theme.canvas.width - W11_PAIR[0].w) / 2 }];

export const WIN11 = {
  /** The box the window was cut out of — kept because the size derives from it. */
  bounds: W11_BOUNDS,
  count: W11_COUNT,
  cards: W11_CARDS,
  /** Where the pattern is drawn inside each window. */
  plots: W11_CARDS.map(plotOf),
  /** Centre of the pattern's name, under each plot. */
  names: W11_CARDS.map((r) => ({
    x: r.x + r.w / 2,
    y: r.y + r.h - W11_PAD - W11_NAME / 2,
  })),
};

{
  const W = WIN11;
  const A = theme.stage.active;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  if (W.cards.length !== W.count) fail(`SC11 lays out ${W.cards.length} windows but says it draws ${W.count}`);
  /**
   * ⚠ THE WINDOW IS THE SAME SIZE IT WAS AS HALF OF A PAIR. This is the whole
   * of "geser, bukan resize", and it is the one thing a later edit could break
   * without anything looking wrong — a window nudged to the middle by hand
   * would almost certainly also be given a rounder width.
   */
  W.cards.forEach((r, i) => {
    if (r.w !== W11_PAIR[0].w || r.h !== W11_PAIR[0].h) {
      fail(`SC11's window ${i + 1} is ${r.w}×${r.h}, not the ${W11_PAIR[0].w}×${W11_PAIR[0].h} a half is`);
    }
    if (r.x < A.x || r.x + r.w > A.x + A.w) fail(`SC11's window ${i + 1} reaches outside the safe area`);
  });
  /** ⚠ AND WITH ONE OF THEM, IT IS ON THE FRAME'S CENTRE-LINE. */
  if (W.count === 1) {
    const mid = W.cards[0].x + W.cards[0].w / 2;
    if (mid !== theme.canvas.width / 2) fail(`SC11's window is centred on ${mid}, not on ${theme.canvas.width / 2}`);
  }
  /** ⚠ AND WITH TWO, THE PAIR FILLS THE BOX IT WAS CUT FROM, edge to edge. */
  if (W.count === 2) {
    const right = W.cards[1].x + W.cards[1].w;
    if (W.cards[0].x !== W.bounds.x || right !== W.bounds.x + W.bounds.w) {
      fail("SC11's pair does not fill the box it was cut from");
    }
  }
  /** ⚠ THE PAIR STAYS INSIDE THE FRAME'S MARGINS, top and bottom. */
  if (W.bounds.y < A.y) fail("SC11's window starts above the safe area");
  if (W.bounds.y + W.bounds.h > theme.captionBand.top) {
    fail(`SC11's window reaches ${W.bounds.y + W.bounds.h}, inside the subtitle band`);
  }
  if (W.bounds.y < theme.logoZone.height) fail("SC11's window reaches into the logo zone");
  /** ⚠ THE DRAWING AND ITS NAME MAY NOT TOUCH. The plot's floor and the top of
   *  the name's own band are the same line by construction, so what is checked
   *  is that a line of type centred on that band still clears the floor. */
  W.plots.forEach((p, i) => {
    const n = W.names[i];
    if (p.y + p.h > n.y - theme.text.chip.size / 2) {
      fail(`SC11's window ${i + 1} draws its pattern into its own name`);
    }
    if (n.y + theme.text.chip.size / 2 > W.cards[i].y + W.cards[i].h) {
      fail(`SC11's window ${i + 1} hangs its name past the bottom of the card`);
    }
    if (p.x < W.cards[i].x || p.x + p.w > W.cards[i].x + W.cards[i].w) {
      fail(`SC11's window ${i + 1} draws wider than itself`);
    }
  });
}
