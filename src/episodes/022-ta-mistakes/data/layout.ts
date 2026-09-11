/**
 * data/layout.ts — every box this episode draws in, derived from `theme.stage`.
 *
 * ⚠ NOTHING HERE IS A TYPED COORDINATE. Move a margin in the theme and every
 * scene in this episode follows. A number that appears twice in a scene file
 * belongs here instead.
 */
import { theme, columns, inset } from "../../../core";
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
