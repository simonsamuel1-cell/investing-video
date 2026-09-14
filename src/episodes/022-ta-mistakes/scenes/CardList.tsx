/**
 * SCENE TRANSISI · THE CARD LIST.  `from 1994 · dur 180`
 *
 * Simon's reference: `VIDEO 22 - TA Mistakes/card list.mp4`. Six cards in a
 * row, a pointer that picks one, and the picked card floods with colour.
 *
 * ═══ WHAT THE REFERENCE ACTUALLY DOES ═══  (read off a 30fps burst, not
 * watched)
 *
 * The flood does NOT rise like a waterline. It starts as a soft blob AT THE
 * POINT THE CURSOR TOUCHES — the card's lower right — and spreads up and across
 * it, heavily blurred, so what the eye reads is ink soaking into paper. Copying
 * it as a rising bar would be the same colour doing a different thing.
 *
 * ⚠ THE HUE IS OURS. The reference floods orange; this floods indigo, because
 * a warm flood would be the only warm thing in the video. See `liquid` in
 * core/theme.ts.
 *
 * ⚠ IT IS AN OVERLAY, MOUNTED LAST — Simon: "layer ini harus yang paling atas
 * jika overlapping dengan scene lain". It runs over the opening of SC04 until
 * the recording has room made in it.
 *
 * ⚠ THE SIXTH CARD IS CUT IN HALF BY THE FRAME, on purpose, and the gap is
 * solved for rather than typed — see CARD_ROW in data/layout.ts. A row that
 * ends neatly says "six things"; a row that runs off the edge says "and there
 * are more of these", which is what a list of mistakes should say.
 *
 * ⚠ AND IT LEAVES BY MOVING — Simon's continuous join into SC04. The five
 * un-picked cards slide off to the right; the picked one goes as far as the
 * middle and opens out. See `exit` in data/timing.ts for why that is not a
 * fade.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import {
  BUBBLE_TIP, Candles, Chip, Cursor, DashedBox, Level, Line, PositionTool,
  SpeechBubble, candleWidth, dashOpenAt, extendGrid, gridOf, lerpBox, lerpGrid,
  progress, progressInOut, ramp, textReveal, theme, useMotion, usePalette,
} from "../../../core";
import type { Grid } from "../../../core";
import { BLOCK, CARD_LIST } from "../data/timing";
import { BUBBLE, CARD_GROWN, CARD_OPEN, CARD_ROW, CARD_ZOOM } from "../data/layout";
import { MistakeCard, TOUCH } from "./MistakeCard";
import {
  CARD_ALL, CARD_ENTRY, CARD_FULL, CARD_HEAD_N, CARD_SUPPORT, CARD_TAPE,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = CARD_LIST;
const R = CARD_ROW;
// ═══════════════════════════════════════════════════════════════════════════

/** The same point in canvas pixels, for the pointer, which lives outside any card. */
const LAND = {
  x: R.x(V.cursor.card) + R.w * TOUCH.fx,
  y: R.y + R.h * TOUCH.fy,
};

/**
 * ⚠ THE SWEEP IS SOLVED, NOT TYPED: far enough that the LEFTMOST of the leaving
 * cards clears the right edge, which puts all five of them off frame. Typed as
 * a round number it would be wrong the moment the row's geometry moved.
 */
const SWEEP = theme.canvas.width - R.x(1);
/** ⚠ FAR ENOUGH THAT THE GROWN CARD'S RIGHT EDGE CLEARS THE LEFT OF THE FRAME.
 *  Solved from the widest thing that travels, so nothing can be left hanging at
 *  the edge however the card is re-sized. */
const AWAY = CARD_GROWN.x + CARD_GROWN.w + 40;
/** Where the picked card lands, and the box it becomes — see CARD_OPEN. */
const O = CARD_OPEN;

/**
 * ⚠ THE TAPE'S GRID HAS NO PRICE IN IT. `pad: 0` and the domain [0, 1] make the
 * vertical axis the CARD ITSELF: 0 is its bottom edge, 1 its top. That is what
 * lets a bar's low land exactly on the line between two of Simon's bands
 * instead of near it — with the grid's usual 12% breathing room the tape would
 * float somewhere close to the level and nothing would rest on anything.
 */
/**
 * ⚠ BOTH GRIDS ARE EXTENDED, NOT REBUILT. The chart has sixteen bars of history
 * that the small card never showed; adding them to the SERIES a `gridOf` is
 * built from would change the pitch and the candle width and quietly redraw
 * everything Simon has already approved. `extendGrid` keeps the scale each grid
 * solved and only moves the origin, so bar CARD_HEAD_N lands exactly where bar
 * 0 used to. Asserted at the bottom of this file, both scales.
 */
const TAPE_GRID = extendGrid(
  gridOf(
    CARD_TAPE.map((b) => b.c),
    [0, 1],
    O.plot,
    0,
  ),
  CARD_HEAD_N,
);
/**
 * ⚠ THE LEVEL IS A CLAIM ABOUT THE WHOLE CARD, not only about the bars drawn so
 * far. Same vertical scale as the tape — same box.y, box.h and the same pad: 0,
 * so y(0.25) is the same pixel — on a box that runs the card's full inner
 * width, so the line carries on past the last candle the way a level on a chart
 * does. The tape stops 250px short because Simon wants that room; the level
 * crossing it is what the room is for.
 */
/**
 * ⚠ THE ZOOMED-OUT GRID IS A DIFFERENT GRID, NOT A SCALED PICTURE. It holds all
 * twenty-four bars where the first holds ten — which is what zooming a chart
 * out IS — so the fall has somewhere to happen. Between the two, `lerpGrid`
 * blends the mappings; nothing drawn on the chart is scaled, so strokes, corner
 * radii and type keep their own weight all the way through the move.
 */
const ZOOM_GRID = extendGrid(
  gridOf(
    CARD_FULL.map((b) => b.c),
    [0, 1],
    CARD_ZOOM.plot,
    0,
  ),
  CARD_HEAD_N,
);
/** The bar the trade was taken on, in the extended series. */
const BUY_I = CARD_HEAD_N + CARD_TAPE.length - 1;
/** The stretch of the tape the small card can show — everything else is behind
 *  the window until it opens. */
const SEEN_FROM = CARD_HEAD_N;
const SEEN_TO = CARD_HEAD_N + CARD_TAPE.length + V.seen - 1;
/**
 * ═══ THE TWO SENTENCES, PINNED TO THE BARS THEY LAND ON ═══  (Simon)
 *
 * ⚠ THE BAR IS FIXED — Simon: "lock posisi". It used to be found from the
 * frame, which was right while the reveal's schedule was still moving; frozen,
 * these two words stay where he has seen them however the reveal is re-timed.
 * The heights below are still solved, because those depend on the tape and not
 * on the clock.
 *
 * ⚠ AND THE PILL CLEARS EVERY BAR IT SPANS, not just the one it names. A pill
 * is 300–420px wide and the tape keeps moving under it until 3663; hugging only
 * its own candle, the second one would have three later bars growing through
 * it. "Below the candle" is still true of a pill below all of them, and it is
 * the only version of it that stays true.
 *
 * ⚠ SOLVED AT THE ZOOMED SCALE ONCE, because by 3294 the zoom is 570 frames
 * done and the grid cannot move again inside this window.
 */
/** ⚠ SIMON'S: four smaller than the chip scale, and medium rather than bold.
 *  The pill's padding and corner come off `size`, so this one number resizes
 *  the whole object. */
const SAID_TYPE = { size: theme.text.chip.size - 4, weight: 500 };
/**
 * The verdict's type, and the gap under it.
 *
 * ⚠ `up` IS THE GAP YOU CAN SEE, not the gap in the maths. A line box is taller
 * than the letters in it, so a text centred `up` above the edge leaves a
 * smaller gap than `up` — 11px, measured, for this face at this size. `ink` is
 * the distance from the centre of the box to the bottom of the letters, read
 * off the render, and subtracting it makes Simon's 30 the one on screen.
 */
const INVALID = { size: theme.text.chip.size + 10, up: 30, ink: 0.39 };
const PILL = { h: SAID_TYPE.size * 1.8, gap: 10 };
/** Rough, and it only has to be generous: it decides how many bars the pill is
 *  checked against, so over-estimating costs nothing and under-estimating is
 *  caught by the assertion at the bottom of this file. */
const pillWidth = (s: string) => s.length * SAID_TYPE.size * 0.5 + SAID_TYPE.size * 1.24;

/** How many bars sit BELOW the level and behind the window — the ones the
 *  reveal has to hand over one at a time. The history is above it and is not
 *  part of this. */
const HIDDEN = CARD_ALL.length - 1 - SEEN_TO;

/**
 * ═══ THE LONG POSITION TOOL ═══  (Simon's screenshot)
 *
 * ⚠ ITS HALF-HEIGHT IS STILL THE ENTRY-TO-SUPPORT DISTANCE, DOUBLED. Simon
 * asked for twice the height, and doubling is the only honest way to give it to
 * him: the one distance in this picture that means anything is from the entry
 * down to the level the trade was taken on, so the tool is built from that and
 * a multiplier rather than from two new prices. At ×2 the stop sits the same
 * distance BELOW the level instead of on it — which is what a stop usually is,
 * but it is a different sentence from the one the ×1 version said.
 *
 * ⚠ AND THE UPPER HALF IS THE LOWER HALF MIRRORED. Any other target would be a
 * claim about how far this goes; the same distance up is a shape, and it is
 * what Simon's reference shows.
 *
 * ⚠ IT STARTS ON THE BAR THAT WAS BOUGHT and runs to the edge of the window —
 * a position tool is drawn forward from the entry, over the ground the trade
 * has yet to cover.
 */
/**
 * ═══ THE NOTE'S BOX ═══  Simon: "overlap aja dengan chart bagian bawah (bagian
 * yang masih banyak white space)".
 *
 * ⚠ THE WHITE SPACE IS SOLVED, NOT EYEBALLED. It is white until the twelve bars
 * fall back into it, and by the end of that fall the rightmost one reaches
 * 713px — a box placed on the paper it sees at 3896 would be sitting on three
 * candles by 4004. So the top is taken from the LOWEST thing the card will ever
 * hold and the bottom from the card's own floor, and what is left in between is
 * the box. It cannot cover anything, and it does not have to be re-checked when
 * the tape changes.
 *
 * ⚠ THIS BOX CANNOT LIVE IN data/layout.ts, and that is the reason: it is
 * derived from the TAPE, and layout does not know about series.
 */
const CARD_NOTE = (() => {
  const gap = 14;
  const floor = Math.max(
    ...CARD_ALL.slice(SEEN_FROM, SEEN_TO + 1).map((b) => ZOOM_GRID.y(b.l)),
    ZOOM_GRID.y(CARD_ENTRY - (CARD_ENTRY - CARD_SUPPORT) * 2),
  );
  /**
   * ⚠ ONE LINE, AND THE BOX IS SIZED TO IT RATHER THAN THE OTHER WAY ROUND —
   * Simon: "jangan dibuat 2 text line … ukuran text box ga harus di dalam
   * chart". The sentence does not fit the card's width at this size, so the box
   * leaves the card on both sides. A note stuck ACROSS a chart is still a note
   * on it; a sentence broken in half to fit inside one is a sentence that lost
   * an argument with a box.
   *
   * ⚠ THE WIDTH IS MEASURED, NOT COMPUTED. Nothing in code can measure a
   * string, so this is the one number here that has to be re-checked if the
   * wording or the type size changes — the render shows it immediately.
   */
  const w = 840;
  const h = 104;
  const band = { top: floor + gap, bot: CARD_OPEN.y + CARD_OPEN.h - gap };
  return {
    x: (theme.canvas.width - w) / 2,
    y: (band.top + band.bot) / 2 - h / 2,
    w,
    h,
  };
})();

const TOOL = (() => {
  /** ⚠ SIMON'S "+100%". One number, and both halves follow it. */
  const reach = (CARD_ENTRY - CARD_SUPPORT) * 2;
  return {
    entry: CARD_ENTRY,
    stop: CARD_ENTRY - reach,
    target: CARD_ENTRY + reach,
    x1: ZOOM_GRID.x(BUY_I),
  };
})();

const SAID = V.hopes.said.map((q) => {
  const x = ZOOM_GRID.x(q.bar);
  const half = pillWidth(q.text) / 2;
  const near = CARD_ALL.filter((_, k) => Math.abs(ZOOM_GRID.x(k) - x) <= half);
  const y = q.above
    ? Math.min(...near.map((b) => ZOOM_GRID.y(b.h))) - PILL.gap - PILL.h / 2
    : Math.max(...near.map((b) => ZOOM_GRID.y(b.l))) + PILL.gap + PILL.h / 2;
  return { ...q, x, y, half };
});

/**
 * ⚠ THE BUBBLE IS PLACED BY ITS TIP, NOT BY ITS BOX. The tip is the only part
 * of it that means anything — it is what says WHICH bar the trade was taken on
 * — so the anchor is solved from the tip backwards through the tail's own
 * fractions, and the box lands wherever that puts it.
 *
 * ⚠ AND IT SPEAKS ABOUT THE LAST BAR, in the room to the right of the tape that
 * Simon's 250px left empty. The trade is taken because the level held; the last
 * bar is the one that held it.
 */
const BUY_AT = (() => {
  const last = CARD_TAPE.length - 1;
  const tip = { x: TAPE_GRID.x(BUY_I) + 14, y: TAPE_GRID.y(CARD_TAPE[last].h) - 12 };
  return { x: tip.x - BUBBLE.w * BUBBLE_TIP.x, y: tip.y - BUBBLE.h * BUBBLE_TIP.y };
})();

/**
 * ═══ THE SMALL CARD'S WINDOW ═══  Simon: "candlestick yang muncul (di bawah
 * garis support) hanya 6 saja".
 *
 * ⚠ THE SIX IS A MASK, NOT A TAPE. The fall and the grind keep the schedule
 * they were locked at; what changes is how much of the card is window. Cutting
 * the series to six instead would have thrown away the chart that the card
 * opening at 3083 exists to reveal.
 *
 * ⚠ AND IT IS SOLVED PER FRAME, because the grid moves under it. The zoom-out
 * at 2676 happens while the card is still 640 wide, so a window worked out once
 * at the small scale would be in the wrong place for the rest of the scene.
 *
 * ⚠ BOTH EDGES LAND IN A GAP BETWEEN TWO BARS, never through one. Three things
 * want to cut this window — the history has to stay hidden, the card has an
 * edge, and Simon's six is a cap — and any of them landing mid-candle would
 * show half a bar, which reads as a rendering fault rather than as a window.
 */
const windowOf = (g: Grid, box: { x: number; y: number; w: number; h: number }) => {
  const half = candleWidth(g) / 2;
  /** The clear air between bar i and bar i+1. */
  const gap = (i: number) => (g.x(i) + half + (g.x(i + 1) - half)) / 2;
  const first = CARD_HEAD_N;
  const capped = CARD_HEAD_N + CARD_TAPE.length + V.seen - 1;

  /** ⚠ THE HISTORY IS HIDDEN, AND SO IS ANYTHING PAST THE CARD'S OWN EDGE. */
  let lo = first - 1;
  while (lo < capped - 1 && gap(lo) < box.x) lo++;
  let hi = capped;
  while (hi > lo + 1 && gap(hi) > box.x + box.w) hi--;

  return { x: gap(lo), y: box.y, w: gap(hi) - gap(lo), h: box.h };
};

const Card = ({ i, title }: { i: number; title: string }) => {
  const f = useCurrentFrame();
  const r = textReveal(f, V.deal.at + i * V.deal.step, V.deal.over, 34);
  if (r.opacity <= 0.001) return null;

  const picked = i === V.cursor.card;
  const wet = picked ? progress(f, V.hover.at, V.hover.over) : 0;

  /**
   * ═══ THE EXIT ═══  Two different motions, because the two groups are doing
   * two different things.
   *
   * ⚠ THE UN-PICKED FIVE LEAVE AS ONE ROW — one distance, one curve, so what
   * goes is "the list" and not five cards that happen to agree. Carried on the
   * transform, which is what a rigid move is.
   *
   * ⚠ THE PICKED ONE CHANGES ITS BOX, and that is deliberate: a CSS scale would
   * take the type, the corner radius and the shadow with it, and what has to
   * grow here is the CARD, not the picture of the card.
   *
   * ⚠ EASE-IN-OUT ON BOTH — Simon's standing note on movement. `progress` eases
   * out only, which for something leaving the frame reads as a card that gives
   * up halfway.
   */
  /**
   * ⚠ THE FIVE THAT LEFT DO NOT COME BACK WITH THE GROUP. They sit off the
   * right edge on a transform, which is invisible and free — until 4046, when
   * the wrapper takes a second transform 1864px to the LEFT and would drag them
   * across the frame again. Adding the same amount here cancels it exactly, so
   * they stay where they went and every frame before 4046 renders unchanged.
   * Unmounting them instead cost a box-shadow that was bleeding in from off
   * frame, which is 5486 pixels of a picture Simon has already signed off.
   */
  const travel = progressInOut(f, V.away.at, V.away.over) * AWAY;
  const sweep = picked ? 0 : progressInOut(f, V.exit.at, V.exit.row) * SWEEP + travel;
  const open = picked ? progressInOut(f, V.exit.at + V.exit.lead, V.exit.one) : 0;
  /** ⚠ AND THEN A THIRD SIZE — Simon: the preview grows to the size of the
   *  chart at 286, which is the ordinary card every other scene draws in. Two
   *  blends rather than one number, so each stage keeps its own curve. */
  const grown = picked
    ? progressInOut(f, V.grow.at, V.grow.over) -
      progressInOut(f, V.rev.card.at, V.rev.card.over)
    : 0;
  const box = lerpBox(
    lerpBox({ x: R.x(i), y: R.y, w: R.w, h: R.h }, { x: O.x, y: O.y, w: O.w, h: O.h }, open),
    CARD_GROWN,
    grown,
  );

  /**
   * ⚠ THE CARD EMPTIES AS IT OPENS — Simon. Title, number and the ink itself
   * all leave on the SAME curve as the width, so what the eye reads is one
   * event: a card clearing itself out to become a white space.
   */
  return (
    <MistakeCard
      n={i + 1}
      title={title}
      box={box}
      wet={wet}
      drain={1 - open}
      opacity={r.opacity}
      dx={sweep}
      dy={r.dy}
    />
  );
};

/**
 * ⚠ THE SENTENCE IS SIMON'S, VERBATIM. It is the point of the whole stretch:
 * not that the tool predicts anything, but that it tells you when what you
 * expected has stopped happening.
 */
const NOTE = "Jadi tahu kapan tidak sesuai rencana";

const Note = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  /** ⚠ THE TYPING WAITS FOR THE FRAME TO SNAP OPEN. `dashOpenAt` is the one
   *  answer to "when may my content start"; guessed, it arrives while the box
   *  is still a sliver. */
  const open = dashOpenAt(V.note.at, m);
  const shown = NOTE.slice(0, Math.floor(ramp(f, open, NOTE.length * V.note.perChar) * NOTE.length));
  return (
    <DashedBox x={CARD_NOTE.x} y={CARD_NOTE.y} w={CARD_NOTE.w} h={CARD_NOTE.h} at={V.note.at}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: 800,
          lineHeight: 1.25,
          color: c.ink,
          /** ⚠ IT MAY NOT WRAP. The box is sized to the sentence; a wrap here
           *  would mean the measurement is stale, and a silent second line is
           *  exactly what Simon asked not to have. */
          whiteSpace: "nowrap",
        }}
      >
        {shown}
      </div>
    </DashedBox>
  );
};

/**
 * ═══ THE SECOND ROUND ═══  Simon, from 4046.
 *
 * ⚠ THE SAME SIX CARDS, NOT A SECOND LIST. Same component, same row geometry,
 * same pointer — what has changed is which one is being picked and that the
 * first one is finished. Drawn fresh rather than reusing round one's `Card`
 * because the two rounds do genuinely different things with them: the first
 * dealt them and took one away to become a chart, this one brings the row back
 * and marks one off.
 */
const Row2 = () => {
  const f = useCurrentFrame();
  const V2 = V.row2;
  if (f < V2.at) return null;
  /**
   * ⚠ THEY START OUTSIDE THE FRAME AND FAR APART — Simon, twice over.
   *
   * The first card begins just past the right edge, so nothing pops into
   * existence; the rest begin at four times the resting gap behind it, so the
   * row arrives as a loose pack and closes up on the way in. Six different
   * distances on ONE curve — the difference between them is the gathering, and
   * nothing has to be animated twice to produce it.
   */
  const t = progressInOut(f, V2.at, V2.over);
  const wide = R.w + R.gap * V2.spread;
  const from0 = theme.canvas.width + 40;
  const startX = (i: number) => from0 + i * wide;
  /**
   * ⚠ AND OUT THE SAME WAY, FANNING — Simon. One curve again; the extra that
   * each card further right takes is what opens the row up as it leaves. The
   * distance is solved from the FIRST card, because it is the one with the
   * whole frame still to cross.
   */
  const leave = progressInOut(f, V2.out.at, V2.out.over);
  const outX = (i: number) => leave * (AWAY + i * R.gap * V2.out.spread);

  /** The pointer's target on the card it picks — the same spot on the card that
   *  round one used, so the two picks read as the same gesture. */
  const land = {
    x: R.x(V2.cursor.card) + R.w * TOUCH.fx,
    y: R.y + R.h * TOUCH.fy,
  };
  const walk = progressInOut(f, V2.cursor.at, V2.cursor.over);
  const from = { x: theme.canvas.width + 60, y: theme.canvas.height + 60 };

  return (
    <>
      {V.titles.map((title, i) => (
        <MistakeCard
          key={title}
          n={i + 1}
          title={title}
          box={{
            x: startX(i) + (R.x(i) - startX(i)) * t + outX(i),
            y: R.y,
            w: R.w,
            h: R.h,
          }}
          /** ⚠ A DONE CARD IS FULLY FLOODED AND IN THE OTHER TONE. It does not
           *  animate: it arrives already finished, which is what "done" looks
           *  like. */
          done={(V2.done as readonly number[]).includes(i)}
          wet={i === V2.cursor.card ? progress(f, V2.hover.at, V2.hover.over) : 0}
        />
      ))}
      {/** ⚠ THE POINTER GOES WHEN THE ROW DOES. It picked one; there is nothing
        *  for it to be doing while the list leaves. */}
      <Cursor
        x={from.x + (land.x - from.x) * walk}
        y={from.y + (land.y - from.y) * walk}
        opacity={walk > 0.001 ? 1 - leave : 0}
      />
    </>
  );
};

export const CardList = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  /** ⚠ IT OWNS THE FRAME. Transparent, the scene underneath shows between the
   *  cards and the transition reads as a row of cards dropped onto a chart.
   *
   *  ⚠ AND IT NEVER FADES BACK OUT — Simon wants the opened card to stand to
   *  3075, so the layer holds and the window's end cuts it. See `out`. */
  const ground = progress(f, V.ground.at, V.ground.over);

  /**
   * ⚠ THE REWIND IS A SUBTRACTION, NOT A SECOND ANIMATION — Simon, from 3517.
   * The card's width is its growth MINUS its shrinking, so the two cannot
   * disagree about where it is and the end state is the start state exactly.
   */
  const grown =
    progressInOut(f, V.grow.at, V.grow.over) -
    progressInOut(f, V.rev.card.at, V.rev.card.over);
  /** ⚠ RIGHT TO LEFT, which is the only order a rewind has. */
  const gone = (i: number) =>
    1 - progressInOut(f, V.rev.at + (CARD_ALL.length - 1 - i) * V.rev.step, V.rev.over);
  /**
   * ⚠ THE CARD'S LIVE BOX, AND EVERY ANNOTATION SPANS IT. A level drawn across
   * "the card" while the card is growing has to be told what the card currently
   * IS, or it spends the move pointing at where the card used to be.
   */
  const card = lerpBox({ x: O.x, y: O.y, w: O.w, h: O.h }, CARD_GROWN, grown);
  const inner: [number, number] = [card.x + O.pad, card.x + card.w - O.pad];
  /** The chart's own scale, mid-zoom. See ZOOM_GRID for why this is a blend of
   *  two grids and not a transform. */
  const grid = lerpGrid(TAPE_GRID, ZOOM_GRID, progressInOut(f, V.zoom.at, V.zoom.over));
  /**
   * ⚠ THE WINDOW THE TAPE IS SEEN THROUGH — Simon: the extra candles exist from
   * the start and are simply masked until the preview opens out. It is solved
   * against the LIVE grid, because the zoom moves the bars under it long before
   * the card opens; widened to the grown card, it stops hiding what was always
   * laid out rather than adding anything.
   */
  const mask = lerpBox(windowOf(grid, { x: O.x, y: O.y, w: O.w, h: O.h }), CARD_GROWN, grown);

  /**
   * ⚠ THREE FLASHES AS THE LEVEL GOES — Simon, from 2751. A half-sine per beat,
   * so each one swells and falls back rather than switching on: a level that
   * snaps to red and snaps back reads as a bulb, not as a line under pressure.
   *
   * ⚠ COLOUR, WEIGHT AND GLOW ALL RIDE THE SAME `k`. Given separate curves they
   * would be three effects that happen near each other; on one they are one
   * line doing one thing.
   */
  const beat = (f - V.blink.at) / V.blink.over;
  const k = beat < 0 || beat >= V.blink.times ? 0 : Math.sin(Math.PI * (beat % 1));
  const hot = {
    ink: interpolateColors(k, [0, 1], [c.indigo, theme.color.warn]),
    /** ⚠ +3, NOT →3 — see `blink` in data/timing.ts. */
    width: theme.shape.line + theme.shape.line * k,
    glow: k * 16,
  };

  const walk = progress(f, V.cursor.at, V.cursor.over);
  const from = { x: theme.canvas.width + 60, y: theme.canvas.height + 60 };
  const cursor = {
    x: from.x + (LAND.x - from.x) * walk,
    y: from.y + (LAND.y - from.y) * walk,
  };
  /** ⚠ AND IT LEAVES BEFORE THE CARD IT PICKED MOVES. Its job was the choosing;
   *  left standing while the card opens out it would read as still choosing. */
  const put = 1 - progress(f, V.exit.at, V.exit.row);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: ground }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />

      {/* ⚠ EVERYTHING BUT THE GROUND TRAVELS — Simon, from 4046. One transform
          on one wrapper, so the chart, the note, the tool and the tape leave as
          the single object they have become rather than as eight things that
          agree about where they are going. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-progressInOut(f, V.away.at, V.away.over) * AWAY}px)`,
        }}
      >
      {V.titles.map((title, i) => (
        <Card key={title} i={i} title={title} />
      ))}
      <Cursor x={cursor.x} y={cursor.y} opacity={walk > 0.001 ? put : 0} />

      {/* ═══ THE TAPE ═══  Simon, 2261 → 2372.
          ⚠ NOT CLIPPED, AND IT DOES NOT NEED TO BE: the plot box is solved to
          sit inside the opened card, so nothing drawn against it can reach the
          card's edge. A clip here would only be hiding a geometry bug.
          ⚠ AND THE SUPPORT IS STILL NOT DRAWN — Simon's "jangan digambarkan
          dulu". The tape resting on it three times is what puts it there. */}
      <Candles
        bars={CARD_ALL}
        grid={grid}
        clip={mask}
        /** ⚠ ONE SERIES, TWO SCHEDULES. The fall is the same tape continuing —
         *  drawn from one grid so the join cannot land a bar in the wrong
         *  place — but it arrives on its own beat, long after the first ten. */
        wipe={(i) => {
          /**
           * ⚠ TWO SCHEDULES, AND WHICH ONE A BAR IS ON IS DECIDED BY THE
           * WINDOW. Everything the small card can show arrives while it is
           * small, on the beats it was locked to. Everything it cannot show
           * waits for the card to open and then comes out one at a time —
           * Simon: "tidak langsung muncul semua".
           */
          /** ⚠ THE HISTORY DOES NOT ARRIVE, IT IS UNCOVERED — Simon: the one
           *  at a time is for what is below the level. Nothing happened to
           *  these bars; they were out of frame, and the card opening is the
           *  whole of their story. */
          if (i < SEEN_FROM) return progressInOut(f, V.tape.at, V.tape.over);
          const k = i - SEEN_FROM;
          /** ⚠ THE TEN BARS OF THE SETUP NEVER LEAVE. They are what the rewind
           *  is rewinding TO, so nothing that happens after 3517 touches them. */
          if (k < CARD_TAPE.length) {
            return progressInOut(f, V.tape.at + k * V.tape.step, V.tape.over);
          }
          const arrive =
            i <= SEEN_TO
              ? progressInOut(f, V.fall.at + (k - CARD_TAPE.length) * V.fall.step, V.fall.over)
              : /** ⚠ WHAT IS BELOW THE LEVEL ARRIVES IN ORDER, left to right,
                 *  because it is the trade going wrong and that is worth
                 *  watching happen. */
                progressInOut(f, V.reveal.at + (i - SEEN_TO - 1) * V.reveal.step, V.reveal.over);
          /**
           * ⚠ AND THE TWELVE COME BACK — Simon, from 3832. `max` rather than a
           * branch: the rewind has taken this bar to nothing by then, so
           * whichever of the two runs is showing more of it IS the bar, and
           * neither run has to know about the other.
           */
          const again =
            i <= SEEN_TO
              ? progressInOut(
                  f,
                  V.again.at + (k - CARD_TAPE.length) * V.again.step,
                  V.again.over,
                )
              : 0;
          return Math.max(arrive * gone(i), again);
        }}
      />

      {/* ⚠ NOW IT MAY BE DRAWN. Held back until the tape had finished, so the
          line arrives as the confirmation of something already watched rather
          than as an instruction about what to watch. Indigo and 3px, the same
          weight every other level in this episode is drawn at. */}
      <Level
        value={CARD_SUPPORT}
        grid={grid}
        span={inner}
        at={V.support.at}
        over={V.support.over}
        ink={hot.ink}
        glow={hot.glow}
        label="Support"
        /**
         * ⚠ BACK ON THE LEFT, AND IT HAS TO BE. The right-hand end is where the
         * break happens: once the fall arrives the label is standing in the six
         * bars Simon wants seen. The left end is clear at BOTH scales — the
         * small card's leftmost bars are the tape's high ones and the grown
         * card's are ss02's quiet range, and neither comes near a level this
         * far below them.
         */
        labelSide="left"
        labelAt="below"
        width={hot.width}
      />

      {/* ⚠ THE ENTRY, AS A DASHED LINE FROM THE BUY BAR — Simon. Dashed rather
          than solid because it is not a level the market knows about: it is one
          person's price, and the whole scene is about what happens to it. It
          starts ON the bar that was bought and runs to the card's edge, so
          everything that comes after is read against it. */}
      <Level
        value={CARD_ENTRY}
        grid={grid}
        span={[grid.x(BUY_I), inner[1]]}
        at={V.entry.at}
        over={V.entry.over}
        dashed
        /** ⚠ IT DOES NOT COME BACK WITH THE CARD — Simon: the rewind stops at
         *  2721 "tanpa garis putus putus indigo". It leaves when the card
         *  shrinks, and the position tool marks the same price properly. */
        opacity={1 - progress(f, V.rev.card.at, V.rev.card.over)}
      />

      {/* ═══ THE NOTE ═══  Simon, over the card's empty lower half.
          ⚠ TYPED, like the other dashed note in this episode — he asked for
          that treatment the last time this object appeared, and a frame that
          snaps open onto finished text reads as a caption rather than as
          something being written down. */}
      <Note />

      {/* ═══ THE TOOL ═══  Simon's screenshot, after the rewind.
          ⚠ IT IS THE ANSWER TO THE MISTAKE, not decoration. Everything before
          this has been a trade taken without a line saying when it was wrong;
          this is that line, drawn where the reason for the trade lives. */}
      <PositionTool
        grid={grid}
        entry={TOOL.entry}
        target={TOOL.target}
        stop={TOOL.stop}
        x1={TOOL.x1}
        x2={inner[1]}
        at={V.tool.at}
        over={V.tool.over}
      />

      {/* ═══ WHAT THE POSITION SAYS TO ITSELF ═══  Simon, 3294 and 3367.
          ⚠ INDIGO, NOT RED. These are not the mistake being named — they are
          the reasoning that keeps it going, and reasoning gets the colour
          everything else in this video thinks in. The red is saved for the word
          that judges it.

          ⚠ FILLED, NOT OUTLINED — Simon. An outlined pill over a chart is an
          annotation ON the chart; these are not about the candles behind them,
          they are somebody talking over the top of them, and a solid block of
          the brand colour is what says that. */}
      {SAID.map(
        (q) =>
          f >= q.at &&
          f < V.hopes.out && (
            <div key={q.text} style={{ opacity: 1 - progress(f, V.hopes.out - m.fade, m.fade) }}>
              <Chip
                label={q.text}
                x={q.x}
                y={q.y}
                at={q.at}
                tone="indigo"
                pill
                solid
                size={SAID_TYPE.size}
                weight={SAID_TYPE.weight}
              />
            </div>
          ),
      )}

      {/* ═══ THE VERDICT ═══  Simon, 2966 → 3102.
          ⚠ INSIDE THE CARD NOW, 30px off its bottom edge — and it rides the
          card's LIVE box, because the card grows out from under it at 3083.
          Pinned to where the small card's floor was, it would be left hanging
          in the middle of the big one.

          ⚠ THE WORD ITSELF, NO PILL — Simon. Red type, and that is allowed and
          is the reason `warn` exists: this episode's one red outside a candle
          body, for WORDS that name a mistake. "Invalid" is the mistake being
          named.

          ⚠ AND IT IS A `Line`, NOT A PILL-LESS `Chip`. Chip's weight belongs to
          its own type scale; this word is bold because Simon asked for bold,
          and Line is the component that takes a weight. It also enters the way
          every word in this project enters — fade and rise, never a pop. */}
      {f >= V.invalid.at && f < V.invalid.out && (
        /** ⚠ IT FADES OUT, like the Buy bubble did once Simon saw that one pop.
         *  The fade LANDS on his frame rather than starting there, so 3102 is
         *  still the frame the word is gone on. */
        <div style={{ opacity: 1 - progress(f, V.invalid.out - m.fade, m.fade) }}>
          <Line
            text="Invalid"
            x={theme.canvas.width / 2}
            y={card.y + card.h - INVALID.up - INVALID.size * INVALID.ink}
            at={V.invalid.at}
            size={INVALID.size}
            weight={800}
            color={theme.color.warn}
          />
        </div>
      )}

      {/* ⚠ THE SAME BUBBLE, NOT A NEW ONE — Simon's "copy and paste". Same
          component, same size, same tone as SC01's, because this is the same
          act being made a second time and a different picture of it would read
          as a different mistake. */}
      {f >= V.buy && f < V.buyGone && (
        <SpeechBubble
          label="BUY"
          x={BUY_AT.x}
          y={BUY_AT.y}
          w={BUBBLE.w}
          h={BUBBLE.h}
          at={V.buy}
          /** ⚠ IT FADES OUT — Simon. The fade LANDS on his frame rather than
           *  starting there, so 2644 is still the frame the bubble is gone on
           *  and not the frame it begins leaving. */
          opacity={1 - progress(f, V.buyGone - m.fade, m.fade)}
        />
      )}
      </div>

      {/* ⚠ ON TOP, AND OUTSIDE THE TRAVELLING GROUP. The new row is arriving
          while the old picture is still leaving; inside the wrapper it would
          be leaving with it. */}
      <Row2 />
    </div>
  );
};

/** Kept honest: the pointer has to have landed before the card it is picking
 *  starts to flood, or the card responds to nothing. */
{
  if (CARD_LIST.hover.at < CARD_LIST.cursor.at + CARD_LIST.cursor.over - 4) {
    throw new Error("022-ta-mistakes/CardList: the flood starts before the pointer arrives");
  }
  if (CARD_LIST.hover.at + CARD_LIST.hover.over > CARD_LIST.exit.at) {
    throw new Error("022-ta-mistakes/CardList: the row starts leaving while the flood is still spreading");
  }
  /** And the window has to outlast the exit, or the card would be cut off
   *  mid-move — which is the one thing a continuous join may not do. */
  const settled = CARD_LIST.exit.at + CARD_LIST.exit.lead + CARD_LIST.exit.one;
  if (settled > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the picked card is still moving when the window ends");
  }
  /** ⚠ THE ONE ASSERTION THAT TIES THE TWO FILES TOGETHER. series.ts says the
   *  tape rests on 0.25 of the card; layout.ts says the support is the line
   *  between the two lowest bands. Nothing but this check makes those the same
   *  place, and if they drift the tape will rest on nothing. */
  if (Math.abs(TAPE_GRID.y(CARD_SUPPORT) - CARD_OPEN.support) > 0.5) {
    throw new Error(
      `022-ta-mistakes/CardList: the tape's support lands at ${TAPE_GRID.y(CARD_SUPPORT).toFixed(1)}, not on the band line at ${CARD_OPEN.support}`,
    );
  }
  /** The tape has to be drawn in a card that has finished moving — bars wiping
   *  on while the card is still opening would be two motions arguing. */
  if (CARD_LIST.tape.at < settled) {
    throw new Error("022-ta-mistakes/CardList: the tape starts before the card has settled");
  }
  const lastBar = CARD_LIST.tape.at + (CARD_TAPE.length - 1) * CARD_LIST.tape.step + CARD_LIST.tape.over;
  if (lastBar > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the last bar is still wiping on when the window ends");
  }
  /** ⚠ SIMON'S ORDER, ENFORCED. The level is a confirmation of what the tape
   *  did; drawn while the tape is still building it becomes an instruction. */
  if (CARD_LIST.support.at < lastBar) {
    throw new Error("022-ta-mistakes/CardList: the support is drawn while the tape is still building");
  }
  if (CARD_LIST.support.at + CARD_LIST.support.over > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the support is still drawing when the window ends");
  }
  if (CARD_LIST.grow.at < CARD_LIST.buyGone) {
    throw new Error("022-ta-mistakes/CardList: the card starts growing before the Buy bubble has gone");
  }
  const lastFall =
    CARD_LIST.fall.at + (CARD_FULL.length - CARD_TAPE.length - 1) * CARD_LIST.fall.step + CARD_LIST.fall.over;
  if (lastFall > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the fall is still running when the window ends");
  }
  const lastReveal = CARD_LIST.reveal.at + (HIDDEN - 1) * CARD_LIST.reveal.step + CARD_LIST.reveal.over;
  if (lastReveal > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the reveal is still running when the window ends");
  }
  /** ⚠ NOTHING MAY BE REVEALED BEFORE THERE IS ROOM FOR IT. The bars the window
   *  was hiding can only start arriving once the window has started opening. */
  if (CARD_LIST.reveal.at < CARD_LIST.grow.at) {
    throw new Error("022-ta-mistakes/CardList: hidden bars arrive before the card opens");
  }
  /** ⚠ AND THE REVEAL IS EXACTLY WHAT IS BELOW THE LEVEL. Simon's rule is about
   *  the level, not about the window, so the split has to be checked against
   *  the tape rather than trusted to line up. */
  for (let i = SEEN_TO + 1; i < CARD_ALL.length; i++) {
    if (CARD_ALL[i].h > CARD_SUPPORT) {
      throw new Error(`022-ta-mistakes/CardList: bar ${i} arrives one at a time but is not below the support`);
    }
  }
  /** ⚠ THE TOOL HAS TO FIT THE CARD IT IS DRAWN IN — the small one, since the
   *  rewind has closed the card by the time it appears. */
  {
    const box = { y: CARD_OPEN.y, h: CARD_OPEN.h };
    const top = ZOOM_GRID.y(TOOL.target);
    const bot = ZOOM_GRID.y(TOOL.stop);
    if (top < box.y || bot > box.y + box.h) {
      throw new Error(
        `022-ta-mistakes/CardList: the position tool runs ${top.toFixed(0)}..${bot.toFixed(0)}, outside the card`,
      );
    }
  }
  /** ⚠ NEITHER PILL MAY SIT ON A CANDLE OR LEAVE THE CARD. Both are solved
   *  against an ESTIMATED text width, so this is the check that the estimate
   *  was wide enough and the solve landed somewhere a pill can be. */
  for (const q of SAID) {
    const top = q.y - PILL.h / 2;
    const bot = q.y + PILL.h / 2;
    if (top < CARD_GROWN.y || bot > CARD_GROWN.y + CARD_GROWN.h) {
      throw new Error(`022-ta-mistakes/CardList: the pill "${q.text}" leaves the card`);
    }
    CARD_ALL.forEach((b, k) => {
      if (Math.abs(ZOOM_GRID.x(k) - q.x) > q.half) return;
      if (ZOOM_GRID.y(b.h) < bot && ZOOM_GRID.y(b.l) > top) {
        throw new Error(`022-ta-mistakes/CardList: the pill "${q.text}" sits on bar ${k}`);
      }
    });
  }
  for (let i = 0; i < SEEN_FROM; i++) {
    if (CARD_ALL[i].l < CARD_SUPPORT) {
      throw new Error(`022-ta-mistakes/CardList: history bar ${i} is below the support but is only uncovered`);
    }
  }
  /** ⚠ NO BAR MAY LAND WHILE THE GRID IS MOVING. Where the zoom sits relative
   *  to the tape is Simon's to choose — it used to be after it and is now
   *  before it — but it may never be DURING it, because a bar that arrives
   *  mid-zoom arrives somewhere that does not exist a frame later. */
  const zoomStart = CARD_LIST.zoom.at;
  const zoomEnd = zoomStart + CARD_LIST.zoom.over;
  const tapeEnd = CARD_LIST.tape.at + (CARD_TAPE.length - 1) * CARD_LIST.tape.step + CARD_LIST.tape.over;
  if (tapeEnd > zoomStart) {
    throw new Error("022-ta-mistakes/CardList: the tape is still building when the chart starts zooming");
  }
  if (CARD_LIST.fall.at < zoomEnd) {
    throw new Error("022-ta-mistakes/CardList: the fall starts while the chart is still zooming");
  }
  /** ⚠ AND THE SIX HAVE TO BE SIX, AT BOTH SCALES THE SMALL CARD EVER HOLDS.
   *  The window is solved per frame, so what is checked here is that the solve
   *  lands where it is supposed to: inside the card, cutting between bars, and
   *  never showing a seventh bar below the support. */
  for (const [name, g] of [["before the zoom", TAPE_GRID], ["after it", ZOOM_GRID]] as const) {
    const box = { x: CARD_OPEN.x, y: CARD_OPEN.y, w: CARD_OPEN.w, h: CARD_OPEN.h };
    const win = windowOf(g, box);
    const half = candleWidth(g) / 2;
    const right = win.x + win.w;
    if (win.x < box.x - 0.5 || right > box.x + box.w + 0.5) {
      throw new Error(`022-ta-mistakes/CardList: the window ${name} leaves the small card`);
    }
    const seventh = CARD_HEAD_N + CARD_TAPE.length + CARD_LIST.seen;
    if (g.x(seventh) - half < right) {
      throw new Error(`022-ta-mistakes/CardList: a seventh bar below the support shows ${name}`);
    }
    if (g.x(CARD_HEAD_N - 1) + half > win.x) {
      throw new Error(`022-ta-mistakes/CardList: the history shows ${name}`);
    }
  }
  /** And it has to fit the card it grinds along the bottom of. */
  {
    const right = ZOOM_GRID.x(CARD_ALL.length - 1) + ZOOM_GRID.slot / 2;
    if (right > CARD_GROWN.x + CARD_GROWN.w - CARD_OPEN.pad) {
      throw new Error(`022-ta-mistakes/CardList: the tail ends at ${right.toFixed(0)}, off the right of the card`);
    }
    const low = ZOOM_GRID.y(Math.min(...CARD_ALL.map((b) => b.l)));
    const high = ZOOM_GRID.y(Math.max(...CARD_ALL.map((b) => b.h)));
    if (high < CARD_GROWN.y || low > CARD_GROWN.y + CARD_GROWN.h) {
      throw new Error(`022-ta-mistakes/CardList: the tape runs ${high.toFixed(0)}..${low.toFixed(0)}, outside the card`);
    }
  }
  /**
   * ⚠ THE LOCK. Simon: "lock semua timing dan ukuran, jangan ada yang berubah".
   * Adding sixteen bars of history must move NOTHING that was already drawn, at
   * either scale — so both grids are checked against a grid built the old way,
   * bar for bar and slot for slot.
   */
  for (const [name, box, bars, ext] of [
    ["small", CARD_OPEN.plot, CARD_TAPE, TAPE_GRID],
    ["zoomed", CARD_ZOOM.plot, CARD_FULL, ZOOM_GRID],
  ] as const) {
    const was = gridOf(bars.map((b) => b.c), [0, 1], box, 0);
    if (Math.abs(was.slot - ext.slot) > 1e-9) {
      throw new Error(`022-ta-mistakes/CardList: the ${name} candles changed width when history was added`);
    }
    for (let i = 0; i < bars.length; i++) {
      if (Math.abs(was.x(i) - ext.x(CARD_HEAD_N + i)) > 1e-9) {
        throw new Error(`022-ta-mistakes/CardList: ${name} bar ${i} moved when history was added`);
      }
    }
  }
  /** And the history has to be OUT of the small card's window, or it would be
   *  half-visible at the edge instead of masked. */
  {
    const edge = TAPE_GRID.x(CARD_HEAD_N - 1) + TAPE_GRID.slot / 2;
    if (edge > CARD_OPEN.plot.x) {
      throw new Error("022-ta-mistakes/CardList: the newest history bar pokes into the small card");
    }
    const left = ZOOM_GRID.x(0) - ZOOM_GRID.slot / 2;
    if (left < CARD_GROWN.x + CARD_OPEN.pad) {
      throw new Error("022-ta-mistakes/CardList: the oldest history bar runs off the left of the grown card");
    }
  }
  /** ⚠ AND IT ENDS EXACTLY ON THE NEXT SCENE'S FIRST FRAME. One frame short and
   *  a scene nobody has seen flashes; one frame long and it eats SC05's open. */
  /** ⚠ THE WINDOW HAS TO OUTLAST THE SECOND ROUND. It used to end exactly on
   *  SC06; it now runs past it, because the transition INTO mistake 02 belongs
   *  to this layer too. */
  const round2 = CARD_LIST.row2.hover.at + CARD_LIST.row2.hover.over;
  if (round2 > CARD_LIST.row2.out.at) {
    throw new Error("022-ta-mistakes/CardList: the row starts leaving while its flood is still spreading");
  }
  if (CARD_LIST.row2.out.at + CARD_LIST.row2.out.over > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the row is still leaving when the window ends");
  }
  if (CARD_LIST.away.at < CARD_LIST.note.at) {
    throw new Error("022-ta-mistakes/CardList: the picture leaves before its own note has been written");
  }
  if (CARD_LIST.at + CARD_LIST.away.at < BLOCK.SC06 - 4) {
    throw new Error("022-ta-mistakes/CardList: the second transition starts well before SC06 — check the join");
  }
}
