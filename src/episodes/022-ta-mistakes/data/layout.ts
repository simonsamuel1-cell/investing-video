/**
 * data/layout.ts — every box this episode draws in, derived from `theme.stage`.
 *
 * ⚠ NOTHING HERE IS A TYPED COORDINATE. Move a margin in the theme and every
 * scene in this episode follows. A number that appears twice in a scene file
 * belongs here instead.
 */
import { GRID_PAD_X, candleWidth, domainOf, gridOf, splitRects, theme, columns, inset } from "../../../core";
import SHOT from "./admr-chart.json";
import type { Grid, Rect } from "../../../core";
import { CARD_LIST, CUT15 } from "./timing";
import { FLAG, FLAG_BARS, FLAG_DOWN, FLAG_LINES, SETUP_FAILS, SETUP_TRADE, SETUP_WORKS } from "./series";

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

/**
 * ═══ CG-B · THE ADMR EXPORT, REPRODUCED ═══
 *
 * ⚠ THIS IS THE ONE PICTURE IN THE EPISODE THAT IS NOT DRAWN IN THE HOUSE
 * STYLE, and the reason is the brief: "duplikat aja semuanya". So it is not
 * laid out at all — `data/admr-chart.json` carries the export's own 2720×1370
 * rectangle and everything inside it in the export's own pixels, and all this
 * box does is decide where that rectangle lands and how big it is. One uniform
 * scale, which is what keeps the candle bodies, the wicks, the volume bars and
 * the histogram bars in the proportions the screenshot has.
 *
 * ⚠ HEIGHT DECIDES IT, NOT WIDTH. The export is 1.985:1 and the active area is
 * 1.882:1, so filling the width would be 870px tall and would have to start at
 * y102 to clear the captions — which puts the top-right corner of a chart that
 * reaches x1824 inside the logo zone. Hanging it from below the logo zone
 * instead costs 108px of width and costs nothing else.
 */
export const ADMR_SHOT = (() => {
  const top = theme.logoZone.height + 2;
  const bottom = theme.captionBand.top - 4;
  const tall = bottom - top;
  const wide = (tall * SHOT.frame.w) / SHOT.frame.h;
  return {
    x: (theme.canvas.width - wide) / 2,
    y: top,
    w: wide,
    h: tall,
    /** Source px → canvas px. Nothing in the scene may use any other. */
    scale: wide / SHOT.frame.w,
  };
})();

/**
 * ⚠ THE INK WIDTHS FOR THE ADMR WINDOW, DIVIDED BACK OUT OF THE SCALE.
 * Everything inside that window is in the export's own pixels and the whole
 * thing is drawn at `ADMR_SHOT.scale`, so a stroke written as `rule` there
 * would land at 0.6 of a pixel on the canvas. These are the theme's own
 * weights, pre-divided, so the rule and the dashes are the same thickness as
 * every other rule in the episode.
 */
export const ADMR_INK = {
  /** The two trendlines that make the triangle. */
  tri: theme.shape.line / ADMR_SHOT.scale,
  /** The question set beside the tape, and the air around it. */
  ask: {
    size: theme.text.title.size / ADMR_SHOT.scale,
    lead: 1.24,
    gap: 40 / ADMR_SHOT.scale,
  },
  /** Simon's arrow: heavy, dashed, round-capped, with a solid head. */
  arc: {
    width: 6 / ADMR_SHOT.scale,
    dash: `${12 / ADMR_SHOT.scale} ${14 / ADMR_SHOT.scale}`,
    head: 22 / ADMR_SHOT.scale,
  },
  /**
   * ⚠ EVERY BAR IN THE WINDOW HAS ROUNDED ENDS. Simon, 2026-09-17. In canvas
   * pixels and divided back out like every other width here — 2px on an 8.3px
   * body reads; 2px written raw would be 1.2 and would not. SVG clamps `rx` to
   * half the box, so a one-pixel doji becomes a lozenge instead of an error.
   */
  round: {
    bar: 2 / ADMR_SHOT.scale,
    wick: 1 / ADMR_SHOT.scale,
  },
  /**
   * The projected bars: hollow, no wick, and NOT dashed any more — Simon asked
   * what they would look like solid. What still says they are not data is that
   * they are hollow when every real bar is filled, that they blink, and that
   * they carry no number and name no level. Restoring the dashes is one
   * `strokeDasharray` back.
   */
  ghost: {
    width: theme.shape.rule / ADMR_SHOT.scale,
    /**
     * ⚠ HOW FAR EACH ONE STEPS UP, AS A FRACTION OF ITS OWN BODY — and it is a
     * half, not a whole. Stacked end to end, ten bars each closing exactly at
     * the high of the one before is a vertical staircase that reaches +21% and
     * reads as a fantasy nobody would have. Overlapping by half is what a run
     * of green days actually looks like, and the sentence only works if the
     * rebound it describes is one somebody could believe.
     */
    rise: 0.5,
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
    ADMR_SHOT,
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


/** The margin above a column's name and below its last separator. ⚠ ONE
 *  NUMBER FOR BOTH, which is what makes the column balanced rather than
 *  bottom-heavy. */
const PLAN_COL_PAD = 24;

/**
 * ⚠ THE SHARED OBJECT IS A LINE OF TYPE, NOT A CARD. Simon: "window 'Same
 * Stock' nya hapus, ganti dengan langsung text aja". The card, its chip and its
 * decorative candle strip are all gone with it — and the strip going is a small
 * relief, because it was the one drawn thing in the scene that had to be capped
 * at 45% opacity to stop it reading as analysable.
 *
 * ⚠ `half` AND `inkDown` ARE MEASURED, NOT GUESSED. At 48px bold the line's ink
 * runs x792..1127 and y219..264 — 168 either side of the centre and 24 below
 * it. `half` is where the two connectors start, 14 clear of the last letter;
 * `inkDown` is what the 50px of air below the line is measured FROM, because a
 * gap measured from a type box is a gap you cannot see.
 */
const PLAN_TICKER = {
  y: 240,
  size: theme.text.title.size,
  half: 168 + 14,
  inkDown: 24,
  /** Simon's 50: "jarak antar text ABCD dan windows jadi 50 px". */
  air: 50,
} as const;

/**
 * The column's own name row: an avatar and a name beside it, on ONE line.
 *
 * ⚠ ONE LINE IS WHAT SET THE COLUMN'S WIDTH. "windownya panjangin lagi sampe
 * muat buat namanya jadi 1 text line" — measured off a render, "Trader" is 94px
 * and "profesional" 164 at this size, so the name is about 267. With 24 of
 * padding either side and 58 for the avatar and its gap, the column cannot be
 * under 373; 420 gives it 47 to spare and both columns are cut to the same
 * width by construction.
 */
const PLAN_NAME = {
  /**
   * ⚠ BIGGER THAN THE VALUES UNDER IT, AND IT WAS NOT. Simon: "Kayaknya Daily
   * Weekly 1.240 7% punya font size yang lebih besar dari Trader profesional
   * dan Kamu ya?" — he was right, 30 against 32. A column's name is its
   * subject and the values are what it says about it, so the name goes to the
   * body size and the values stay where they are.
   */
  size: theme.text.body.size,
  avatar: 44,
  gap: 14,
  lead: 1.25,
} as const;
const PLAN_NAME_H = PLAN_NAME.size * PLAN_NAME.lead;
/** ⚠ "Trader profesional" MEASURED AT 30px AND SCALED. 94 for "Trader" and 164
 *  for "profesional" plus a space, read off a render — so the width follows the
 *  size instead of having to be re-measured every time the size moves. */
const PLAN_NAME_W = 267 * (PLAN_NAME.size / 30);

/**
 * The closing line's box. `w` is MEASURED — "Saham sama ≠ trade sama" sets 394
 * of ink at 32px/700, read off the frame — plus 38 either side. `block` is
 * core/DashedBox's own corner size, repeated here because the box's edges have
 * to be solved with half of it hanging outside the rect.
 *
 * ⚠ `air` IS SIMON'S 50, MEASURED TO THE CORNER BLOCKS. It used to be 12 and it
 * used to mean something else — the clearance the box kept above the subtitle
 * band, back when it hung off the bottom of the canvas. When the box was
 * re-anchored under the cards the 12 came with it and quietly became a 12px
 * gap where the direction asked for 50.
 */
const PLAN_CLOSE = { w: 394 + 38 * 2, h: 92, size: 32, block: 15, air: 50 } as const;

/** ⚠ THE BAND'S TOP IS THE TICKER'S INK PLUS SIMON'S 50, and everything below
 *  hangs off it — the name, the first row, the last separator and the band's
 *  own height. Moving the line moves the table. */
const PLAN_BAND_Y = PLAN_TICKER.y + PLAN_TICKER.inkDown + PLAN_TICKER.air;
const PLAN_NAME_Y = PLAN_BAND_Y + PLAN_COL_PAD + PLAN_NAME_H / 2;
/** The air between the name's baseline box and the first value's centre. */
const PLAN_NAME_GAP = 34;
const PLAN_VALUE = 32;

/** The four rows, as one pitch rather than four tops. */
const PLAN_ROW = {
  /** ⚠ DERIVED FROM THE NAME, NOT TYPED. It was 530, then 545 when the name
   *  wrapped to two lines, and it would have had to move again now that it does
   *  not. Hanging it off the name row means it follows on its own. */
  y0: PLAN_NAME_Y + PLAN_NAME_H / 2 + PLAN_NAME_GAP + PLAN_VALUE / 2,
  pitch: 80,
  /** The separator, below the row's centre-line and clear of a descender. */
  rule: 30,
  labelSize: 22,
  valueSize: PLAN_VALUE,
  /** ⚠ 40% — a separator as strong as the border around the column divides it
   *  into four cards instead of ruling four rows. */
  ruleAlpha: 0.4,
  /** How far a value rises into place. Shorter than the default: four of these
   *  arrive in twelve seconds and a long rise reads as drift. */
  rise: 8,
} as const;

const PLAN_LAST_RULE = PLAN_ROW.y0 + PLAN_ROW.pitch * 3 + PLAN_ROW.rule;

/** The band the two columns are cut from. Centred on the frame, so the
 *  divider and the header's centre are the same x by construction. */
/** ⚠ 350 — HALF WHAT IT WAS. Simon: "window kiri dan kanan kecilin widthnya
 *  50% masing masing". The COLUMN is the number chosen now and the band follows
 *  from it, which is the opposite of how this was written; with the band fixed,
 *  halving a column would have had to move the gap as well. */
/** ⚠ 440 — WIDE ENOUGH FOR THE NAME ON ONE LINE AT THE BODY SIZE, and that is
 *  the whole reason for the number. See PLAN_NAME. Both columns are cut from
 *  one band, so they cannot differ. */
const PLAN_COL_W = 440;
const PLAN_GAP = 200;
const PLAN_BAND: Rect = (() => {
  const w = PLAN_COL_W * 2 + PLAN_GAP;
  return {
    x: (PLAN_W - w) / 2,
    y: PLAN_BAND_Y,
    w,
    h: PLAN_LAST_RULE + PLAN_COL_PAD - PLAN_BAND_Y,
  };
})();
const [PLAN_LEFT, PLAN_RIGHT] = splitRects(PLAN_GAP, PLAN_BAND);



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
 * A connector that leaves the ticker SIDEWAYS and turns down into a column.
 *
 * ⚠ ONE ELBOW NOW, NOT TWO. It used to drop out of the card's bottom edge and
 * elbow twice at the midpoint; the start point is the side of a line of type
 * now, so it runs out horizontally, turns once, and falls. Same rounded corner,
 * one fewer of them.
 *
 * ⚠ IT STILL RETURNS ITS OWN LENGTH. A trim-path draw needs the number, and a
 * dash length measured by hand stops being right the first time the columns
 * move. A quarter-circle plus two straights is exact.
 */
const PLAN_ELBOW = 12;
const wireOf = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const r = PLAN_ELBOW;
  const dir = to.x < from.x ? -1 : 1;
  const d =
    `M${from.x},${from.y} L${to.x - dir * r},${from.y} ` +
    `Q${to.x},${from.y} ${to.x},${from.y + r} L${to.x},${to.y}`;
  const arc = (Math.PI * r) / 2;
  const len = Math.abs(to.x - from.x) - r + arc + (to.y - from.y - r);
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

  ticker: PLAN_TICKER,
  name: { ...PLAN_NAME, h: PLAN_NAME_H },

  band: PLAN_BAND,
  cols: [PLAN_LEFT, PLAN_RIGHT] as [Rect, Rect],

  /** Both columns are read with the same insets — that is the comparison. */
  col: {
    /** ⚠ 24, DOWN FROM 40. Even at 420 a column cannot spend 80 of itself on
     *  air and still hold an avatar, a name and a value on one line. */
    pad: 24,
    nameY: PLAN_NAME_Y,
    /** How far a column slides up as it arrives. */
    rise: 10,
  },

  row: PLAN_ROW,

  wires: [
    wireOf({ x: PLAN_W / 2 - PLAN_TICKER.half, y: PLAN_TICKER.y }, { x: PLAN_LEFT.x + PLAN_LEFT.w / 2, y: PLAN_BAND.y }),
    wireOf({ x: PLAN_W / 2 + PLAN_TICKER.half, y: PLAN_TICKER.y }, { x: PLAN_RIGHT.x + PLAN_RIGHT.w / 2, y: PLAN_BAND.y }),
  ],

  /**
   * ═══ THE CLOSING LINE, IN A DASHED BOX ═══
   * Simon: "Text boxnya juga ubah jadi text box putus putus." It was a pill;
   * it is the episode's marquee now, the same one SC06 and SC11 close on.
   *
   * ⚠ ITS WIDTH IS MEASURED, NOT COMPUTED — the same rule every other dashed
   * box in this episode follows. core/DashedBox is a FIXED size on purpose (it
   * has to land its dashes on known coordinates), so the sentence is rendered,
   * its ink is read off the frame, and the box is that plus its padding.
   *
   * ⚠ AND THE CORNER BLOCKS OVERHANG. They sit centred on the corner, so half a
   * block stands outside the rect on every side — which is exactly how SC11's
   * note ended up 5px inside the subtitle band before anyone noticed. The
   * bottom edge below is solved with that half block in it.
   */
  close: (() => {
    const w = PLAN_CLOSE.w;
    const h = PLAN_CLOSE.h;
    return {
      x: (PLAN_W - w) / 2,
      /** ⚠ 50 BELOW THE CARDS, AND THE 50 IS TO THE CORNER BLOCKS. Simon:
       *  "geser naik sampe berjarak 50 px dari window". Half a block hangs
       *  above the rect, so the rect starts half a block further down than the
       *  gap does — the same overhang that decides the bottom edge. */
      y: PLAN_BAND.y + PLAN_BAND.h + PLAN_CLOSE.air + PLAN_CLOSE.block / 2,
      w,
      h,
      block: PLAN_CLOSE.block,
      size: PLAN_CLOSE.size,
    };
  })(),

  /**
   * ═══ B4 · THE THREE QUESTIONS ═══
   *
   * A stack in the room the right column leaves behind, standing where that
   * column stood — so the scene reads as the right-hand plan being replaced by
   * what you should have asked about it rather than as a new list appearing
   * somewhere else.
   *
   * ⚠ THE FIRST ONE IS LEVEL WITH THE COLUMN'S NAME, which is what ties the two
   * halves together: a person on the left, the questions about them on the
   * right, both starting on the same line.
   *
   * ⚠ LEFT-ALIGNED, NOT CENTRED. Simon, 2026-09-17 — "3 3nya align-left aja".
   * Three questions of three different lengths centred on one axis is a shape,
   * and the eye reads the shape before it reads the words; flush left they are
   * a list, which is what they are. `x` is the column's own left edge, so the
   * stack still stands exactly where the right-hand plan stood.
   */
  ask: {
    x: PLAN_RIGHT.x,
    y0: PLAN_NAME_Y,
    pitch: 120,
    size: theme.text.body.size,
    /**
     * ⚠ NOT THE SOLID PILL'S 800. A filled pill defaults to the heaviest weight
     * in the scale because it is normally a one-word stamp; these are
     * sentences, and at 800 three of them stacked shout. Body weight — the same
     * one the names and the rows are set in.
     */
    weight: theme.text.body.weight,
    /** "kasih 20 px padding atas bawah tiap text" — taller than the type asks
     *  for, which is what turns three pills into a stack with air in it. */
    padY: 20,
  },

  /** How far the ticker travels to sit over the left column alone. */
  slide: PLAN_LEFT.x + PLAN_LEFT.w / 2 - PLAN_W / 2,

  /**
   * ═══ B5 · THE VERDICT ═══
   *
   * ⚠ CENTRED ON WHAT IT COVERS, NOT ON THE CANVAS. "di tengah (horizontal dan
   * vertikal) semua visual" — by 13711 what is on screen is the ticker, the left
   * column and the three questions, and their bounding box runs from the
   * ticker's ink down to the column's floor. The canvas's own middle is 540 and
   * theirs is nearer 470, and the difference is visible.
   *
   * ⚠ AND IT IS BIGGER THAN THE OTHER ONE. "Ukurannya harus lebih besar
   * dibanding biasanya" — the closing box is 470×92 at 32px; this is 1100×150
   * at 48. The width is MEASURED like every other dashed box here: the sentence
   * sets 1008 of ink at 48px/700, read off a render with the box deliberately
   * oversized so nothing was clipped, plus 46 either side.
   */
  verdict: (() => {
    const w = 1008 + 46 * 2;
    const h = 150;
    const top = PLAN_TICKER.y - PLAN_TICKER.inkDown - 21;
    const bottom = PLAN_BAND.y + PLAN_BAND.h;
    return {
      x: (PLAN_W - w) / 2,
      y: (top + bottom) / 2 - h / 2,
      w,
      h,
      block: 22,
      size: theme.text.title.size,
    };
  })(),
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
  if (P.ticker.y < theme.logoZone.height) fail(`SC15's ticker line is at ${P.ticker.y}, inside the logo zone`);
  if (P.band.x + P.band.w / 2 !== mid) fail("SC15's column band is not centred on the frame");
  if (P.cols[0].w !== P.cols[1].w) fail(`SC15's columns are ${P.cols[0].w} and ${P.cols[1].w} wide`);
  if (P.cols[0].x + P.cols[0].w >= mid || P.cols[1].x <= mid) fail("SC15's columns cross their own divider");
  /**
   * ⚠ THE CONNECTORS HAVE TO TRAVEL OUTWARD, and that is the thing to check.
   * Each one leaves a side of the ticker and lands on a column's centre-line,
   * so the ticker's half-width has to be SHORTER than the distance from the
   * frame's middle to that centre-line — otherwise the left wire starts to the
   * right of where it is going and the elbow turns back on itself.
   */
  const reach = mid - (P.cols[0].x + P.cols[0].w / 2);
  if (P.ticker.half >= reach - PLAN_ELBOW) {
    fail(`SC15's connectors start ${P.ticker.half} out and only reach ${Math.round(reach)}`);
  }
  /** ⚠ AND THE NAME HAS TO FIT BESIDE ITS AVATAR ON ONE LINE. "Trader
   *  profesional" measures 267 at 30px — read off a render, not estimated, and
   *  scaled with the size — so the room left after the padding, the avatar and
   *  its gap has to beat it or the name wraps and the columns stop being
   *  level. */
  const inner = P.cols[0].w - P.col.pad * 2 - P.name.avatar - P.name.gap;
  if (inner < PLAN_NAME_W) {
    fail(`SC15's column name has ${Math.round(inner)}px and needs ${Math.round(PLAN_NAME_W)}`);
  }
  /** ⚠ AND THE NAME HAS TO BEAT THE VALUES UNDER IT. The column's subject
   *  cannot be set smaller than what the column says about it. */
  if (P.name.size <= P.row.valueSize) {
    fail(`SC15's column name is ${P.name.size} against values at ${P.row.valueSize}`);
  }
  /**
   * ⚠ THE COLUMN IS BALANCED, and this is the assertion that keeps it so. The
   * margin above the name and the margin below the last separator are one
   * number; if the band's height ever stops following the rows, they part.
   */
  const above = P.col.nameY - P.name.h / 2 - P.band.y;
  const below = P.band.y + P.band.h - PLAN_LAST_RULE;
  if (Math.abs(above - below) > 0.5) fail(`SC15's columns hold ${above} above and ${below} below`);
  /** ⚠ AND FOUR ROWS HAVE TO FIT UNDER THE NAME. */
  const firstTop = P.row.y0 - P.row.valueSize / 2;
  if (firstTop <= P.col.nameY + P.name.h / 2) fail("SC15's first row starts inside the column's own name");
  if (PLAN_LAST_RULE > P.band.y + P.band.h) fail(`SC15's last separator is at ${PLAN_LAST_RULE}, below the column floor`);
  /** ⚠ THE TIGHTEST POINT IN THE SCENE — the closing box's bottom edge WITH ITS
   *  corner blocks, which stand half outside the rect. */
  const boxLow = P.close.y + P.close.h + P.close.block / 2;
  if (boxLow > theme.captionBand.top) {
    fail(`SC15's closing box reaches ${Math.round(boxLow)}, inside the subtitle band at ${theme.captionBand.top}`);
  }
  if (P.close.y < PLAN_LAST_RULE) fail("SC15's closing box overlaps the table above it");
  /** ⚠ AND THE VERDICT HAS TO COVER WHAT IT IS COVERING, without leaving the
   *  safe area on either side or reaching a reserve. */
  if (P.verdict.x - P.verdict.block / 2 < PLAN_A.x) fail("SC15's verdict reaches outside the safe area");
  if (P.verdict.y - P.verdict.block / 2 < theme.logoZone.height) fail("SC15's verdict is inside the logo zone");
  if (P.verdict.y + P.verdict.h + P.verdict.block / 2 > theme.captionBand.top) {
    fail("SC15's verdict reaches the subtitle band");
  }
  /** ⚠ THE QUESTIONS STACK INSIDE THE FRAME, three of them at one pitch. */
  const lastAsk = P.ask.y0 + P.ask.pitch * 2 + pillH(P.ask.size) / 2;
  if (lastAsk > theme.captionBand.top) fail(`SC15's last question reaches ${Math.round(lastAsk)}`);
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

/* ═══ SC11 · THE BIG WINDOW SHIFTS, AND A SMALL ONE JOINS IT ═════════════
 *
 * ⚠ Simon: "setelah animasinya selesai, windownya geser kiri, lalu muncul
 * window baru di sebelah kanan yang ukurannya 2x lipat lebih kecil."
 *
 * ⚠ THE PAIR IS CENTRED, WHICH IS WHAT DECIDES HOW FAR LEFT. "Geser kiri" does
 * not name a destination, and the two that would: hard against the left margin,
 * which leaves 418px of dead air on the right, or the group balanced on the
 * frame. Simon has asked for balanced margins every time the question has come
 * up, so the window slides exactly far enough for the pair to sit centred —
 * 542 → 305, with 209px of margin either side of the two of them.
 *
 * ⚠ AND "2x LEBIH KECIL" IS HALF IN BOTH DIRECTIONS — 418×320 against 836×640.
 * Vertically it centres on the big window's own middle, so the two share a
 * centre-line rather than a top or a bottom edge.
 *
 * ⚠ THE BIG WINDOW'S SIZE STILL COMES FROM `halves()`, even though nothing is
 * halved any more. That is where 836×640 came from when the scene briefly had
 * two windows, and deriving it keeps it a size rather than a number somebody
 * typed. The W11_COUNT lever that went with that arrangement is gone: it
 * described two EQUAL windows, and this is not that.
 */
const W11_BOUNDS: Rect = { x: theme.stage.active.x, y: 230, w: theme.stage.active.w, h: 640 };
const W11_SHAPE = halves(W11_BOUNDS)[0];

/** ⚠ THE EPISODE'S OWN GAP, the one SC08 and SC09 put between a pair. */
const W11_GAP = GAP;
const W11_SMALL_SHAPE = { w: W11_SHAPE.w / 2, h: W11_SHAPE.h / 2 };
const W11_ROW_W = W11_SHAPE.w + W11_GAP + W11_SMALL_SHAPE.w;
const W11_ROW_X = (theme.canvas.width - W11_ROW_W) / 2;

/** Where the big window stands before the shift, and where it lands. */
const W11_FROM_X = (theme.canvas.width - W11_SHAPE.w) / 2;
const W11_TO_X = W11_ROW_X;

const W11_SMALL: Rect = {
  x: W11_ROW_X + W11_SHAPE.w + W11_GAP,
  y: W11_SHAPE.y + (W11_SHAPE.h - W11_SMALL_SHAPE.h) / 2,
  ...W11_SMALL_SHAPE,
};

/**
 * ⚠ THE VERTICAL INSET IS DEEPER THAN THE HORIZONTAL ONE, and the difference is
 * exactly where the pattern's name used to stand. Simon: "hapus semua kata
 * Flag". The drawing keeps the size it was approved at — so the candle group is
 * still the width that was solved for and the scale of the bars has not moved —
 * and the band the caption occupied is now split evenly above and below it. A
 * window holding only a drawing centres the drawing; a window that lost its
 * caption and left the drawing riding high is a window with a hole in it.
 */
const W11_PAD = 56;
const W11_TYPE = theme.text.chip.size;
/** ⚠ HALF THE INSET, BUT THE BAND STILL FOLLOWS ITS OWN TYPE. The small window
 *  never fitted 18px type; the theme's smallest is what set its band, and that
 *  is still what sets how much shorter than its box the drawing is. */
const W11_SMALL_PAD = W11_PAD / 2;
const W11_SMALL_TYPE = theme.text.axis.size;

const plotOf = (card: Rect, pad: number, type: number): Rect => {
  const h = card.h - pad * 2 - type * 2;
  return { x: card.x + pad, y: card.y + (card.h - h) / 2, w: card.w - pad * 2, h };
};

/**
 * ⚠ THE THREE HIDDEN BARS COME BACK AS OUTLINES — Simon: "muncul 3 candlestick
 * yang tadi di hide dengan style garis putus-putus no fill".
 *
 * ⚠ "16 11" IS THE EPISODE'S DASH AND IT IS THE WRONG ONE HERE. A candle body
 * is about 28px wide, so that rhythm puts one and a half dashes along a side
 * and the thing reads as a broken rectangle rather than a dashed one. This is
 * the same rhythm scaled to the object it is drawn on — and lengthened once
 * since, on Simon's "putus putusnya panjangin": 10 and 6 still gives a narrow
 * side nearly two whole periods, which is the floor below which a dashed
 * rectangle stops reading as dashed.
 *
 * ⚠ THE WICK IS SOLID — Simon: "wicknya ga perlu putus putus". It is one or two
 * pixels wide, so a dash on it is not a dash, it is a line with pieces missing.
 * The body carries the "this has not happened" and the wick just measures.
 *
 * ⚠ AND THEY ARE NEITHER GREEN NOR RED. The candle colours belong to
 * core/Candles — scripts/audit.mjs enforces it — and they would be wrong here
 * anyway: a bar that has not happened yet has no direction to have closed in.
 */
const W11_GHOST = { dash: "10 6", width: theme.shape.line } as const;

/**
 * ⚠ THE FALLING FAN IS DRAWN 20px LOWER THAN ITS PRICES PUT IT — Simon:
 * "turunin posisinya 20 px".
 *
 * ⚠ AND IT IS A DRAWING OFFSET, NOT A PRICE ONE, which is the whole reason it
 * lives here and not in data/series.ts. Both fans leave from the same close, so
 * their first bars met at that price and read as one long candle rather than
 * two — the gap separates them. Moving the PRICES down instead would make the
 * falling move a different size from the rising one, and the mirror exists
 * precisely so that it cannot be.
 */
const W11_DOWN_DROP = 20;

/** The same grid, drawn lower. `x` and the scale are untouched, so the fan
 *  stays in its own columns and every bar keeps its height. */
export const droppedBy = (g: Grid, px: number): Grid => ({ ...g, y: (v) => g.y(v) + px });

/** The grid's vertical head-room, shared so the scene and the solve below
 *  cannot build two different grids for one box. */
export const W11_PLOT_PAD = 0.08;

/**
 * ⚠ 20px OFF THE CANDLES, NOT OFF THE BOX — Simon: "bayangin semua candlestick
 * kamu grup, baru kurangin 20 px". Those are two different numbers. `gridOf`
 * keeps GRID_PAD_X inside the box and `candleWidth` takes a fraction of the
 * slot, so a box narrowed by 20 narrows the DRAWN group by rather more than 20.
 * What he asked for is the group, so the group is what is solved for.
 *
 * ⚠ SOLVED WITH TWO PROBES RATHER THAN WITH core's OWN CONSTANTS. The group's
 * width is linear in the box's, so measuring it at two widths gives the slope
 * exactly — and it keeps working the day `candleWidth`'s fraction or GRID_PAD_X
 * changes, which writing 0.68 and 18 into this file would not.
 *
 * ⚠ AND IT IS THE CANDLE WINDOW'S ONLY. The small window holds a line, which
 * has no bodies to be too wide.
 */
const W11_SHRINK = 20;
const FLAG_DOMAIN = domainOf(FLAG.closes, FLAG_BARS);
const flagGroupW = (box: Rect) => {
  const g = gridOf(FLAG.closes, FLAG_DOMAIN, box, W11_PLOT_PAD);
  return g.x(FLAG.closes.length - 1) - g.x(0) + candleWidth(g);
};
const narrowed = (box: Rect): Rect => {
  const probe = 100;
  const slope = (flagGroupW(box) - flagGroupW({ ...box, w: box.w - probe })) / probe;
  const dw = W11_SHRINK / slope;
  return { ...box, x: box.x + dw / 2, w: box.w - dw };
};

/**
 * The big window at a point in its shift — 0 where it starts, 1 where it lands.
 *
 * ⚠ A FUNCTION, NOT TWO RECTS, because everything inside it has to travel: the
 * plot, the grid solved from the plot, the candles on the grid and the wedge
 * solved from the grid. Written as two states, the scene would have to slide a
 * finished picture with a CSS transform — and this project's rule is that a
 * chart's geometry belongs to the box it is in, not to a transform laid over it.
 */
export const bigAt = (t: number) => {
  const card: Rect = { ...W11_SHAPE, x: W11_FROM_X + (W11_TO_X - W11_FROM_X) * t };
  return {
    card,
    plot: narrowed(plotOf(card, W11_PAD, W11_TYPE)),
  };
};

/**
 * SC11's closing note — Simon, 9805.
 *
 * ⚠ IT STRADDLES THE WINDOW'S BOTTOM EDGE — Simon: "text boxnya muncul di
 * bawah, overlap dengan tepi window bawah, align-center secara x-axis". So its
 * own middle IS that edge: half of it is stamped on the card and half hangs
 * below it. Derived from the card rather than typed, so the note cannot come
 * off the edge it is pinned to if the windows ever move.
 *
 * ⚠ AND DOWN HERE IT CAN BE ONE LINE. Up in the headline band its width was
 * capped by theme.logoZone.maxX and the sentence had to break in two; at y815
 * there is no such limit, so 1200 holds all sixty-one characters on one line
 * with room to spare. The text is centred again for the same reason — one line
 * nearly filling its box reads centred, and left-aligning it would leave the
 * slack all on one side.
 *
 * ⚠ IT COVERS NOTHING. The big window's plot ends at y778 and its lowest bar at
 * 736; the box starts at 815, so the 55px it overlaps is the card's own empty
 * foot. Asserted, because that clearance is the whole reason this position is
 * available at all.
 *
 * ⚠ THE CORNER BLOCKS COUNT, ON EVERY SIDE. core/DashedBox centres a solid
 * block on each corner, so the ink reaches half a block past the rectangle all
 * round. That overhang put the box five pixels above the safe area at its last
 * position without anything saying so; it is in the arithmetic now, and down
 * here it is what the subtitle band is measured against.
 */
const W11_BLOCK = 15;
const W11_NOTE = (() => {
  const w = 1200;
  const h = 110;
  /** The edge it is pinned to: the big window's floor, wherever that is. */
  const edge = W11_SHAPE.y + W11_SHAPE.h;
  return {
    x: (theme.canvas.width - w) / 2,
    y: edge - h / 2,
    w,
    h,
    pad: 36,
    block: W11_BLOCK,
  };
})();

export const WIN11 = {
  /** The box the window's size was cut out of — kept because the size derives. */
  bounds: W11_BOUNDS,
  /** ⚠ THE SMALL WINDOW DOES NOT MOVE. It arrives where it belongs. */
  small: {
    card: W11_SMALL,
    plot: plotOf(W11_SMALL, W11_SMALL_PAD, W11_SMALL_TYPE),
  },
  ghost: W11_GHOST,
  downDrop: W11_DOWN_DROP,
  note: W11_NOTE,
  plotPad: W11_PLOT_PAD,
  /**
   * ⚠ THREE BARS OFF THE RIGHT OF THE BIG WINDOW, HIDDEN AND NOT REMOVED —
   * Simon: "hide 3 candlestick dari kanan". The three are the breakout, and the
   * distinction matters twice over: the thirteen that remain keep the positions
   * they had, and the price scale still reserves the room the hidden three need,
   * so nothing moves when they come back.
   *
   * ⚠ AND THE SMALL WINDOW SHOWS ALL SIXTEEN — Simon: "termasuk 3 candlestick
   * paling kanan". That difference is the only one between the two drawings
   * besides the shape of the ink, and it is the whole point of showing both.
   */
  hidden: 3,
  wedge: {
    /** ⚠ FIVE DEGREES WIDER THAN THE BARS ASK FOR — Simon: "gedein sudutnya 5
     *  derajat". Split evenly about the apex, so the point does not move and
     *  the mouth opens symmetrically. */
    deg: 5,
    /** ⚠ ALREADY 3px, AND NAMED HERE SO IT IS ONE NUMBER. Simon asked for 3
     *  and `theme.shape.line` is 3; measured across the drawn diagonals it
     *  renders 3–4px, the 4 being antialiasing. */
    width: theme.shape.line,
  },
};

/**
 * The two lines of the flag, in a grid's own pixels, opened by `wedge.deg`.
 *
 * ⚠ THE APEX IS THE PIVOT. Both arms keep the x they had — the mouth is still
 * at the bar the triangle opens on — and only their height changes, so the
 * point the two converge to does not move. Rotating about the mouth instead
 * would slide the apex along the chart, which is the one part of this shape
 * that means something.
 *
 * ⚠ AND THE WIDENING LIVES HERE, NOT IN data/series.ts. Degrees are a SCREEN
 * measurement and that file has no pixels in it. What it asserts is that no bar
 * breaks the un-widened wedge — which is the stronger claim, because opening
 * the wedge can only put more room around the bars, never less.
 */
export const flagWedge = (g: Grid) => {
  const F = FLAG_LINES;
  const ax = g.x(F.apex.i);
  const ay = g.y(F.apex.p);
  const mx = g.x(F.from);
  const run = ax - mx;
  const half = ((WIN11.wedge.deg / 2) * Math.PI) / 180;
  const arm = (price: number, sign: 1 | -1) => {
    const rise = sign * (ay - g.y(price));
    return ay - sign * run * Math.tan(Math.atan2(rise, run) + half);
  };
  return [
    { x1: mx, y1: arm(F.upAt(F.from), 1), x2: ax, y2: ay },
    { x1: mx, y1: arm(F.loAt(F.from), -1), x2: ax, y2: ay },
  ];
};

{
  const W = WIN11;
  const A = theme.stage.active;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  const start = bigAt(0);
  const end = bigAt(1);
  /** ⚠ IT SLIDES, IT DOES NOT TRAVEL. Same size at both ends, and only x moves
   *  — the one thing a later edit to either position could break silently. */
  if (start.card.w !== end.card.w || start.card.h !== end.card.h) fail("SC11's window changes size as it shifts");
  if (start.card.y !== end.card.y) fail("SC11's window drifts vertically as it shifts");
  if (end.card.x >= start.card.x) fail(`SC11's window shifts to ${end.card.x}, which is not left of ${start.card.x}`);
  /** ⚠ AND IT STARTS ON THE FRAME'S CENTRE-LINE, where it has been standing. */
  if (start.card.x + start.card.w / 2 !== theme.canvas.width / 2) fail("SC11's window does not start centred");
  /** ⚠ THE PAIR IS BALANCED — this is what decided how far left it goes, so it
   *  is the thing to assert rather than the distance. */
  const leftAir = end.card.x - A.x;
  const rightAir = A.x + A.w - (W.small.card.x + W.small.card.w);
  if (Math.abs(leftAir - rightAir) > 0.5) fail(`SC11's pair leaves ${leftAir} left and ${rightAir} right`);
  if (W.small.card.x - (end.card.x + end.card.w) !== W11_GAP) fail("SC11's pair is not split on the episode's own gap");
  /** ⚠ HALF IN BOTH DIRECTIONS, and sharing the big window's centre-line. */
  if (W.small.card.w * 2 !== end.card.w || W.small.card.h * 2 !== end.card.h) {
    fail(`SC11's small window is ${W.small.card.w}×${W.small.card.h}, not half of ${end.card.w}×${end.card.h}`);
  }
  const mid = (r: Rect) => r.y + r.h / 2;
  if (mid(W.small.card) !== mid(end.card)) fail("SC11's two windows do not share a centre-line");
  /** ⚠ BOTH STAY INSIDE THE FRAME'S MARGINS. */
  [end.card, W.small.card].forEach((r, i) => {
    if (r.x < A.x || r.x + r.w > A.x + A.w) fail(`SC11's window ${i + 1} reaches outside the safe area`);
    if (r.y < A.y) fail(`SC11's window ${i + 1} starts above the safe area`);
    if (r.y + r.h > theme.captionBand.top) fail(`SC11's window ${i + 1} reaches into the subtitle band`);
    if (r.y < theme.logoZone.height) fail(`SC11's window ${i + 1} reaches into the logo zone`);
  });
  /** ⚠ EVERY DRAWING IS CENTRED IN ITS OWN WINDOW, which is the whole of what
   *  removing the name changed — the boxes did not resize, they moved. */
  ([[start, "big"], [end, "big, shifted"], [{ ...W.small }, "small"]] as const).forEach(([w, n]) => {
    if (w.plot.x < w.card.x || w.plot.x + w.plot.w > w.card.x + w.card.w) fail(`SC11's ${n} window draws wider than itself`);
    const above = w.plot.y - w.card.y;
    const below = w.card.y + w.card.h - (w.plot.y + w.plot.h);
    if (Math.abs(above - below) > 0.5) fail(`SC11's ${n} window holds ${above} above its drawing and ${below} below`);
  });
  /** ⚠ THE GROUP REALLY IS 20px NARROWER, at both ends of the shift — the
   *  shrink is solved, not typed, so a wrong solve would look plausible. */
  [start, end].forEach((w) => {
    const want = flagGroupW(plotOf(w.card, W11_PAD, W11_TYPE)) - W11_SHRINK;
    if (Math.abs(flagGroupW(w.plot) - want) > 0.01) {
      fail(`SC11's candle group is ${flagGroupW(w.plot).toFixed(1)}px, not the ${want.toFixed(1)} asked for`);
    }
    const bare = plotOf(w.card, W11_PAD, W11_TYPE);
    if (Math.abs(w.plot.x + w.plot.w / 2 - (bare.x + bare.w / 2)) > 0.01) fail("SC11 took its 20px off one side");
  });
  /** ⚠ AND THE WIDENED WEDGE STAYS IN ITS OWN PLOT, in both windows. */
  [end.plot, W.small.plot].forEach((p, i) => {
    const g = gridOf(FLAG.closes, FLAG_DOMAIN, p, W11_PLOT_PAD);
    flagWedge(g).forEach((seg) => {
      if (seg.y1 < p.y || seg.y1 > p.y + p.h) {
        fail(`SC11's wedge opens to ${Math.round(seg.y1)} in window ${i + 1}, outside its plot`);
      }
    });
  });
  if (W.hidden < 0 || W.hidden >= FLAG_LINES.last) fail(`SC11 hides ${W.hidden} bars, which is not a reading of the flag`);
  /** ⚠ THE NOTE CLEARS THE LOGO AND CLEARS THE WINDOWS. It is the one thing in
   *  this scene drawn in the top 150px, so it is the one thing that can walk
   *  into the logo zone — and the band it sits in is only 176px tall, so it is
   *  also the one thing that can land on the windows. */
  const n = W.note;
  /** ⚠ MEASURED TO THE INK, NOT TO THE RECTANGLE. The corner blocks reach half
   *  a block past every edge, and that overhang has already put this box five
   *  pixels outside the safe area once, at its old position, with nothing
   *  saying so. */
  const over = n.block / 2;
  const edge = end.card.y + end.card.h;
  /** ⚠ IT REALLY DOES STRADDLE THE EDGE, half above and half below — the one
   *  thing "overlap dengan tepi window bawah" actually asks for, and the one
   *  thing a later nudge to y would quietly undo. */
  if (Math.abs(n.y + n.h / 2 - edge) > 0.5) fail(`SC11's note is centred on ${n.y + n.h / 2}, not on the window's floor at ${edge}`);
  if (n.x + n.w / 2 !== theme.canvas.width / 2) fail("SC11's note is not centred on the frame");
  /** ⚠ AND IT STAYS OUT OF THE SUBTITLE BAND AND OFF THE DRAWING. */
  if (n.y + n.h + over > theme.captionBand.top) {
    fail(`SC11's note reaches ${n.y + n.h + over}, inside the subtitle band at ${theme.captionBand.top}`);
  }
  if (n.x - over < A.x || n.x + n.w + over > A.x + A.w) fail("SC11's note reaches outside the safe area");
  if (n.y - over <= end.plot.y + end.plot.h) {
    fail(`SC11's note starts at ${n.y - over}, on top of the drawing which ends at ${end.plot.y + end.plot.h}`);
  }
  /** ⚠ AND THE DROPPED FAN STILL HAS TO LAND INSIDE THE PLOT. 20px is a
   *  drawing offset, so nothing about the scale knows it is happening — the
   *  lowest bar could be pushed through the floor and the chart would simply
   *  draw it there. */
  [end.plot, W.small.plot].forEach((p, i) => {
    const g = droppedBy(gridOf(FLAG.closes, FLAG_DOMAIN, p, W11_PLOT_PAD), W.downDrop);
    const low = Math.max(...FLAG_DOWN.map((b) => g.y(b.l)));
    if (low > p.y + p.h) fail(`SC11's falling fan reaches ${Math.round(low)} in window ${i + 1}, below its plot`);
  });
}

/* ═══ SC16 · SEBELUM ENTRY ════════════════════════════════════════════════
 *
 * Two lines at the top of the frame and five app screens in the middle of it.
 *
 * ⚠ THE TWO LINES LIVE IN THE TITLE STRIP, AND THAT IS WHY THEY ARE 48px.
 * Simon asked for "Sebelum entry," at the top with "space 1 text line di
 * bawahnya" held for the second one — so the block is two lines from the
 * start, not one line that later grows. `theme.stage` gives the strip 136px
 * between the safe top and the card, and two 48px lines at a 1.25 lead are
 * exactly 120 of it. At the display size they would be 240 and would have to
 * push the tiles out of the middle of the screen, which is where he put them.
 *
 * ⚠ AND THE STRIP HEIGHT IS DERIVED, NOT TYPED. `theme` does not export
 * TITLE_H, but the card's top minus the safe top IS that number, so moving a
 * margin in the theme still moves this.
 */
const PREP_STRIP = theme.stage.card.y - theme.stage.active.y;
const PREP_SIZE = theme.text.title.size;
const PREP_LEADING = PREP_SIZE * 1.25;
const PREP_TOP = theme.stage.active.y + (PREP_STRIP - PREP_LEADING * 2) / 2;

/**
 * ═══ THE FIVE SCREENS ═══
 *
 * ⚠ EVERY BOX IS ITS OWN PICTURE'S SHAPE, which is the whole reason these
 * ratios are here. The five files are Tuntun app screens and no two of them
 * are alike: 01 and 02 are cropped phone screens at 0.68, 03 and 05 are wide
 * panels at 1.69 and 1.77, 04 is a table at 0.80. A common box would have
 * letterboxed four of them — "jangan di stretch" cuts both ways, and a picture
 * floating inside a frame two sizes too wide is the other half of that rule.
 *
 * ⚠ THE RATIOS ARE THE EXPORT'S OWN, WITH NOTHING TRIMMED, and that is a fix
 * rather than a default. They were first copied in through `convert -trim`,
 * which strips a uniform border matching the corner pixel: on 04 and 05 it ate
 * 151px of white from the LEFT ONLY and on 03 161px from the top, because
 * those were the only sides uniform enough to match. The panels inside then sat
 * hard against one edge of their card with their own margin gone — which is
 * what Simon saw as "ke-crop" on 05 and 04. All five are now the export as
 * shot, downscaled and nothing else, so each keeps the margin it was drawn
 * with. NEVER TRIM THESE: the five come off one 4084px-wide screen and their
 * margins are only consistent while they are all untouched.
 *
 * ⚠ 03 AND 05 ARE THE SAME WIDTH — Simon, "widthnya samain dengan 03". They
 * come off the same 4084px capture, so equal width IS equal zoom: two panels
 * from one screen shown at one scale. Their HEIGHTS differ, because their
 * aspects do, and the column's width is solved so that the two of them plus the
 * gap come to exactly the height of the pair beside them.
 *
 * ⚠ AND THE LAYOUT IS SOLVED FROM ONE HEIGHT. `PREP_H` is the tall column's
 * height; everything else falls out of it, so the arrangement cannot drift out
 * of proportion when it moves. 580 is what the WIDTH allows: the left column's
 * outer edge lands on 120 against the safe area's 96, and 04's on 1791 against
 * 1824. It is not the height that is tight.
 *
 * ⚠ THE MIDDLE PAIR IS CENTRED ON THE FRAME, NOT THE GROUP. "01 Day dan 02
 * Week bersebelahan di tengah layar" — so the pair is placed on 960 first and
 * the two side columns hang off it. The whole group is therefore slightly left
 * of centre, because the left column is wider than the right; that is the
 * direction, and it is the pair that was named.
 */
const PREP_ART = {
  /**
   * ⚠ 01 AND 02 ARE CROPPED, AND BY EXACTLY THE SAME AMOUNT — Simon: "berapapun
   * yang kamu crop di image 01, crop juga dengan jumlah yang sama di 02". The
   * two screens are the same app view at two timeframes, so any difference in
   * framing between them would read as a difference in the DATA. Both lose the
   * bottom 1446 of their 7417: the Company Quality strip and the action bar
   * under it, cut on the white gap above that strip's own card border so no
   * edge is sliced. Their card boundaries were checked to be on the same row
   * first — 1291 in both — which is what makes one cut line honest for both.
   *
   * ⚠ IT ALSO TAKES THE "Buy" BUTTON OFF, which was the one thing in this scene
   * that sat against rule 7. That is a consequence, not the reason.
   */
  "01": { name: "01 Day", src: "art/prep/01-day.png", ratio: 1094 / 1600 },
  "02": { name: "02 Week", src: "art/prep/02-week.png", ratio: 1094 / 1600 },
  "03": { name: "03 Trend", src: "art/prep/03-trend.png", ratio: 1600 / 949 },
  "04": { name: "04 Setup", src: "art/prep/04-setup.png", ratio: 1279 / 1600 },
  "05": { name: "05 Level", src: "art/prep/05-level.png", ratio: 1600 / 906 },
} as const;

/**
 * ⚠ TWO HEIGHTS NOW, NOT ONE — "2 image di tengah gedein lagi, 3 image lainnya
 * boleh dibuat agak lebih kecil". The pair is the thing being read and the
 * other three are what it is read against, so they no longer share a height.
 *
 * ⚠ AND THE PAIR'S IS SOLVED FROM THE FRAME, TOP AND BOTTOM. Its size is not a
 * taste: the type's ink ends at 182 and the subtitle band starts at 972, so
 * what the pair can have is what is left after the air under the type, the air
 * above the question box, and the box's own 92 plus its corner blocks. 220 and
 * 812 are those two edges, and 592 is the distance between them.
 *
 * ⚠ ITS CENTRE THEREFORE LANDS ON 516, NOT ON 540. Simon asked for the pair "di
 * tengah layar secara vertikal" before the question box existed; pinned to the
 * canvas's own middle with the box below it, the pair can only be 550 and
 * leaves 83px of dead white under the type. 516 is the middle of what the pair
 * actually sits in, and it is worth 11% of its size.
 */
const PREP_ROW_TOP = 220;
const PREP_ROW_BOTTOM = 812;
const PREP_HP = PREP_ROW_BOTTOM - PREP_ROW_TOP;
/**
 * ⚠ THE OTHER THREE ARE A DECISION, NOT A SOLVE — "boleh dibuat agak lebih
 * kecil". 470 is a fifth under the pair, which reads as a difference without
 * reading as a mistake, and it clears both edges: the left column's outer edge
 * lands on 129 against the safe area's 96, and 04's on 1789 against 1824.
 */
const PREP_HS = 470;
const PREP_GAP = 32;
/**
 * The left column's width, solved so its two panels stack to exactly PREP_HS.
 * At one width W the two heights are W/r03 and W/r05, so
 *   W (1/r03 + 1/r05) + gap = H.
 */
const PREP_COL_W =
  (PREP_HS - PREP_GAP) / (1 / PREP_ART["03"].ratio + 1 / PREP_ART["05"].ratio);
const PREP_WIDE = (key: "03" | "05") => ({
  w: PREP_COL_W,
  h: PREP_COL_W / PREP_ART[key].ratio,
});
const PREP_TALL = (key: "01" | "02" | "04") =>
  PREP_ART[key].ratio * (key === "04" ? PREP_HS : PREP_HP);

/** The middle pair, placed on the frame's centre-line first. */
const PREP_PAIR = PREP_TALL("01") + PREP_GAP + PREP_TALL("02");
const PREP_MID_X = theme.canvas.width / 2 - PREP_PAIR / 2;
const PREP_COL_X = PREP_MID_X - PREP_GAP - PREP_COL_W;
const PREP_ROW_Y = PREP_ROW_TOP;
/** ⚠ THE SHORTER THREE HANG ON THE PAIR'S OWN MIDDLE, not on the canvas's and
 *  not on its top edge: a row of unequal heights reads as a row only while its
 *  centres agree. */
const PREP_SIDE_Y = PREP_ROW_TOP + PREP_HP / 2 - PREP_HS / 2;

/**
 * ⚠ WHERE 01 STANDS BEFORE 02 EXISTS — "posisinya dari tengah dulu secara
 * horizontal". On the frame's centre-line, not on the pair's: for nine seconds
 * it is the only chart on screen and the middle is where a single thing goes.
 * At 14475 it travels from here to `PREP_BOX("01")` and 02 lands in the space
 * it leaves.
 */
const PREP_SOLO_X = theme.canvas.width / 2 - PREP_TALL("01") / 2;

/**
 * ⚠ THE VOLUME BARS INSIDE 01, AS FRACTIONS OF THE PICTURE. Measured off
 * public/art/prep/01-day.png itself — the coloured pixels run x39..1036 and
 * y1255..1442 of its 1094×1600 — so the mark follows the screenshot rather
 * than a typed rect. It was re-measured when the crop moved it, which is
 * exactly the change a typed rect would have survived silently.
 *
 * ⚠ ITS WIDTH IS THE PICTURE'S, PLUS 25 EITHER SIDE — Simon: "buat widthnya
 * sama dengan image terus ditambah 25 px di kiri 25 px di kanan", which is the
 * same rule the highlight over a phone follows elsewhere. So only the two Y
 * fractions are read off the file now; the bars' own x31..1036 no longer decide
 * anything, because a mark that stands proud of what it marks has to be
 * symmetric on the THING and not on the bars inside it.
 */
const PREP_VOL = {
  y1: 1255 / 1600,
  y2: 1442 / 1600,
  /** How far the mark stands proud of the picture, left and right. Simon's 25. */
  out: 25,
  /** And how far above and below the bars it sits. */
  pad: 8,
} as const;

const PREP_BOX = (key: keyof typeof PREP_ART): Rect => {
  if (key === "01") return { x: PREP_MID_X, y: PREP_ROW_Y, w: PREP_TALL("01"), h: PREP_HP };
  if (key === "02") {
    return { x: PREP_MID_X + PREP_TALL("01") + PREP_GAP, y: PREP_ROW_Y, w: PREP_TALL("02"), h: PREP_HP };
  }
  if (key === "04") {
    return { x: PREP_MID_X + PREP_PAIR + PREP_GAP, y: PREP_SIDE_Y, w: PREP_TALL("04"), h: PREP_HS };
  }
  const { w, h } = PREP_WIDE(key);
  return {
    x: PREP_COL_X,
    y: key === "03" ? PREP_SIDE_Y : PREP_SIDE_Y + PREP_HS - h,
    w,
    h,
  };
};

export const PREP_SHOT = {
  size: PREP_SIZE,
  /** "Sebelum entry," — black. */
  lead: { x: theme.canvas.width / 2, y: PREP_TOP + PREP_LEADING / 2 },
  /** "apply semua yang sudah dipelajari" — indigo, one line below. */
  apply: { x: theme.canvas.width / 2, y: PREP_TOP + PREP_LEADING * 1.5 },
  /** ⚠ IN READING ORDER, NOT IN NUMBER ORDER — left column, middle pair, then
   *  the right. A list that draws itself the way the eye crosses the frame is
   *  one fewer thing to hold in your head, now that the five have their own
   *  beats. */
  tiles: (["03", "01", "02", "04", "05"] as const).map((key) => ({
    key,
    name: PREP_ART[key].name,
    src: PREP_ART[key].src,
    rect: PREP_BOX(key),
  })),
  /** 01's two x positions: alone in the middle, then beside 02. */
  solo: PREP_SOLO_X,
  /** The volume mark, given 01's CURRENT left edge — it travels with the
   *  picture, so the scene hands it where 01 is rather than where it ends up. */
  vol: (x: number) => {
    const r = PREP_BOX("01");
    return {
      x1: x - PREP_VOL.out,
      x2: x + r.w + PREP_VOL.out,
      y1: r.y + PREP_VOL.y1 * r.h - PREP_VOL.pad,
      y2: r.y + PREP_VOL.y2 * r.h + PREP_VOL.pad,
    };
  },
  /**
   * ⚠ "Apa invalidation-nya?" IN THE EPISODE'S MARQUEE, 50 BELOW THE SCREENS —
   * the same dashed frame and the same 50 that SC15's closing line uses, so the
   * two closings are one shape. `w` is MEASURED: the sentence sets 339 of ink
   * at 32px/700, read off a render, plus 38 either side. The 50 is to the CORNER BLOCKS, half of which hang above the
   * rect — the same overhang that decides SC15's.
   */
  ask: (() => {
    const w = 339 + 38 * 2;
    const h = 92;
    const block = 15;
    const air = 45;
    return {
      x: (theme.canvas.width - w) / 2,
      y: PREP_ROW_BOTTOM + air + block / 2,
      w,
      h,
      block,
      size: 32,
    };
  })(),
} as const;

{
  const S = PREP_SHOT;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/layout: ${m}`);
  };
  const A = theme.stage.active;
  /**
   * ⚠ BOTH LINES SIT IN THE LOGO ZONE'S BAND, so their INK has to stop short of
   * it. Measured off a render at 48px/700 rather than estimated: "Sebelum
   * entry," is 349 of ink and "apply semua yang sudah dipelajari" is 791, which
   * puts the wider one's right edge at 1355 against the zone's 1368.
   *
   * ⚠ THAT IS THIRTEEN PIXELS OF MARGIN, AND THE ASSERTION IS THE POINT. The
   * second line is one word away from crossing into a reserve that has to stay
   * empty; when the wording changes, this fails at module load instead of in a
   * render nobody checks.
   */
  const INK = { lead: 349, apply: 791 } as const;
  const widest = Math.max(INK.lead, INK.apply) * (S.size / theme.text.title.size);
  if (S.lead.x + widest / 2 > theme.logoZone.maxX) {
    fail(`SC16's lines reach ${Math.round(S.lead.x + widest / 2)}, past the logo zone at ${theme.logoZone.maxX}`);
  }
  /**
   * ⚠ AND THE CUT CARRIES THEM FURTHER RIGHT THAN THAT. The scene arrives on
   * CUT15's incoming half, which starts the whole picture `distance` px to the
   * right of where it lands — so for twenty frames the second line reaches
   * 1475. That clears the reserve ITSELF (which starts at 1560), which is why
   * this checks the zone rather than the content margin: the rest position is
   * held to the margin above, and the travel only has to stay out of the box.
   * Raise the cut's distance past 206 and this is what says so.
   */
  const zone = theme.canvas.width - theme.logoZone.width;
  if (S.lead.x + widest / 2 + CUT15.distance > zone) {
    fail(`SC16's lines reach ${Math.round(S.lead.x + widest / 2 + CUT15.distance)} on the cut, inside the logo zone at ${zone}`);
  }
  /** ⚠ AND THE SCREENS MUST CLEAR THE TYPE ABOVE AND THE BAND BELOW. */
  const top = Math.min(...S.tiles.map((t) => t.rect.y));
  const bottom = Math.max(...S.tiles.map((t) => t.rect.y + t.rect.h));
  if (top <= S.apply.y + S.size / 2) fail(`SC16's screens start at ${top}, under the second line`);
  if (bottom > theme.captionBand.top) {
    fail(`SC16's screens reach ${bottom}, inside the subtitle band at ${theme.captionBand.top}`);
  }
  const left = Math.min(...S.tiles.map((t) => t.rect.x));
  const right = Math.max(...S.tiles.map((t) => t.rect.x + t.rect.w));
  if (left < A.x || right > A.x + A.w) {
    fail(`SC16's screens run ${Math.round(left)}..${Math.round(right)}, outside the safe area`);
  }
  /** ⚠ EVERY BOX IS ITS PICTURE'S OWN SHAPE. This is the assertion that keeps
   *  the five from being letterboxed the next time one of them is re-exported
   *  at a different size. */
  S.tiles.forEach((t) => {
    const want = PREP_ART[t.key].ratio;
    if (Math.abs(t.rect.w / t.rect.h - want) > 0.001) {
      fail(`SC16's ${t.name} is boxed at ${(t.rect.w / t.rect.h).toFixed(3)}, not at its own ${want.toFixed(3)}`);
    }
  });
  /** ⚠ THE PAIR IS ON THE FRAME'S CENTRE-LINE — the one thing the direction is
   *  explicit about, and the first thing a change to PREP_H would break. */
  const pair = S.tiles.filter((t) => t.key === "01" || t.key === "02");
  const mid = (Math.min(...pair.map((t) => t.rect.x)) + Math.max(...pair.map((t) => t.rect.x + t.rect.w))) / 2;
  if (Math.abs(mid - theme.canvas.width / 2) > 0.001) {
    fail(`SC16's 01 and 02 are centred on ${mid}, not on the frame at ${theme.canvas.width / 2}`);
  }
  /**
   * ⚠ THE PAIR IS THE BIGGEST THING ON SCREEN — "2 image di tengah gedein lagi,
   * 3 image lainnya boleh dibuat agak lebih kecil". It used to be checked
   * against the canvas's own middle instead; that check is gone, because the
   * pair is now centred in the space between the type and the question box
   * rather than on the frame, which is what buying it its size cost. What is
   * worth asserting is the relationship Simon asked for, not the coordinate it
   * happened to produce.
   */
  const pairH = pair[0].rect.h;
  const sideH = Math.max(...S.tiles.filter((t) => t.key === "04").map((t) => t.rect.h));
  if (pairH <= sideH) fail(`SC16's pair is ${pairH} tall against the others' ${sideH}; it has to be bigger`);
  /** ⚠ AND ALL FIVE SIT IN ONE ROW, on one centre-line, however tall each is. */
  const centres = S.tiles.map((t) => t.rect.y + t.rect.h / 2);
  const rowMid = pair[0].rect.y + pairH / 2;
  S.tiles.forEach((t, i) => {
    if (t.key === "03" || t.key === "05") return;
    if (Math.abs(centres[i] - rowMid) > 0.001) fail(`SC16's ${t.name} is not on the row's centre-line`);
  });
  /** ⚠ 03 AND 05 ARE THE SAME WIDTH, ON THE SAME LEFT EDGE, and their two
   *  heights plus the gap fill exactly the pair's height beside them. */
  const col = S.tiles.filter((t) => t.key === "03" || t.key === "05");
  if (Math.abs(col[0].rect.w - col[1].rect.w) > 0.001) {
    fail(`SC16's 03 is ${col[0].rect.w} wide and 05 is ${col[1].rect.w}; they have to match`);
  }
  if (Math.abs(col[0].rect.x - col[1].rect.x) > 0.001) fail("SC16's 03 and 05 are not on one left edge");
  const colH = Math.max(...col.map((t) => t.rect.y + t.rect.h)) - Math.min(...col.map((t) => t.rect.y));
  if (Math.abs(colH - PREP_HS) > 0.001) fail(`SC16's left column is ${colH} tall, not the ${PREP_HS} it shares with 04`);
  const inner = Math.min(...col.map((t) => t.rect.y + t.rect.h)) === col[0].rect.y + col[0].rect.h
    ? col[1].rect.y - (col[0].rect.y + col[0].rect.h)
    : col[0].rect.y - (col[1].rect.y + col[1].rect.h);
  if (Math.abs(inner - PREP_GAP) > 0.001) fail(`SC16's left column has a ${inner}px gap, not ${PREP_GAP}`);
  /** ⚠ 01 STARTS ON THE FRAME'S CENTRE-LINE AND ENDS LEFT OF IT. If the slide
   *  ever came out zero the beat would still play and nobody would see it. */
  const one = S.tiles.find((t) => t.key === "01")!.rect;
  if (Math.abs(S.solo + one.w / 2 - theme.canvas.width / 2) > 0.001) {
    fail("SC16's 01 does not start on the frame's centre-line");
  }
  if (S.solo <= one.x) fail(`SC16's 01 starts at ${S.solo} and ends at ${one.x}; it would travel the wrong way`);
  /** ⚠ THE VOLUME MARK HAS TO LAND ON THE PICTURE, not beside it. */
  const v = S.vol(one.x);
  if (v.y1 < one.y || v.y2 > one.y + one.h) fail("SC16's volume mark runs off 01 vertically");
  if (Math.abs(v.x1 - (one.x - 25)) > 0.001 || Math.abs(v.x2 - (one.x + one.w + 25)) > 0.001) {
    fail("SC16's volume mark is not 25px proud of 01 on both sides");
  }
  /** ⚠ AND ITS OVERHANG MUST NOT REACH THE COLUMN BESIDE IT. The mark is wider
   *  than the picture, so the gap between 01 and 03/05 has to be wider still. */
  const colRight = Math.max(...col.map((t) => t.rect.x + t.rect.w));
  if (v.x1 <= colRight) fail(`SC16's volume mark reaches ${v.x1}, over the column that ends at ${colRight}`);
  /** ⚠ AND THE QUESTION BOX CLEARS THE SCREENS AND THE BAND, corner blocks and
   *  all. This is the check the note box in SC11 did not have. */
  const q = S.ask;
  if (q.y - q.block / 2 <= bottom) fail(`SC16's question box starts at ${q.y - q.block / 2}, on top of the screens`);
  if (q.y + q.h + q.block / 2 > theme.captionBand.top) {
    fail(`SC16's question box reaches ${q.y + q.h + q.block / 2}, inside the subtitle band at ${theme.captionBand.top}`);
  }
  if (q.x + q.w / 2 !== theme.canvas.width / 2) fail("SC16's question box is not centred on the frame");
}
