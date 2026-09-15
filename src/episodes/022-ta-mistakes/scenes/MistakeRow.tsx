/**
 * scenes/MistakeRow.tsx — the row of six, arriving and leaving.
 *
 * ⚠ EXTRACTED, NOT REWRITTEN. This is exactly what CardList drew inline for the
 * second round, moved out so the third can be the same object rather than a
 * second one that looks like it. Two rows of cards that are nearly alike is the
 * one thing these transitions must not be.
 *
 * ⚠ IT TAKES ITS FRAME. Round two counts in CardList's window and round three
 * in its own, so the caller hands in both the clock and a table written on the
 * same clock — and neither round has to know what the other's numbers mean.
 */
import { Cursor, progress, progressInOut, theme } from "../../../core";
import { CARD_LIST } from "../data/timing";
import { CARD_ROW, VISIBLE } from "../data/layout";
import { MistakeCard, TOUCH } from "./MistakeCard";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const R = CARD_ROW;
const TITLES = CARD_LIST.titles;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ FAR ENOUGH THAT THE WIDEST THING TRAVELLING CLEARS THE FRAME. Solved rather
 * than typed, so nothing is left hanging at an edge however the row is re-sized.
 */
const AWAY = theme.stage.card.x + theme.stage.card.w + 40;

/**
 * ═══ HOW FAR ALONG THE LIST THE ROW RESTS ═══  Simon's choice, once the list
 * grew past the window.
 *
 * ⚠ THE PICK IS ALWAYS THE LAST CARD FULLY INSIDE THE WINDOW. Five cards fit
 * whole and the sixth is cut by the frame, so a pick at slot 4 is the furthest
 * one that can be read in full — and anything past it pulls the row along by
 * whole card-pitches until it sits there.
 *
 * ⚠ IT IS A RESTING PLACE, NOT A SCROLL. Every round brings the row in from off
 * the right anyway, so a later round simply arrives already further along.
 * Nothing slides on screen, and there is no second animation to keep in step
 * with the first.
 *
 * ⚠ AND IT IS ZERO FOR EVERY ROUND SO FAR. Rounds one to four pick cards 1–4,
 * all of them inside the first five slots, so this returns 0 and the rows that
 * are already approved are untouched — proven frame by frame, not assumed.
 */
const panOf = (card: number) => Math.max(0, card - (VISIBLE - 2)) * (R.w + R.gap);

/** One round of the list: when it arrives, who is picked, who is finished. */
export type Round = {
  at: number;
  over: number;
  /**
   * ⚠ THE ARRIVAL'S STAGGER — Simon: "tolong dibuat masuk kartu nya satu per
   * satu", for every round of the list and every one after it. Frames between
   * one card setting off and the next, mirroring `out.step`, so the row comes
   * in the way it goes out.
   */
  step: number;
  spread: number;
  cursor: { at: number; over: number; card: number };
  hover: { at: number; over: number };
  done: readonly number[];
  out: { at: number; step: number; over: number };
};

export const MistakeRow = ({ f, V2 }: { f: number; V2: Round }) => {
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
  /**
   * ⚠ ONE AT A TIME, AND THE LEFTMOST FIRST — Simon, and the direction decides
   * which end starts. They travel LEFT into place, so the card in front sets
   * off first; staggered the other way the row would land back to front, which
   * reads as the list being dealt in reverse.
   *
   * ⚠ IT IS THE MIRROR OF THE EXIT, on purpose and on the same `step`. The row
   * leaves one at a time from the far end because they all travel right; it
   * arrives one at a time from the near end because they all travel left. Same
   * gesture, run backwards.
   */
  const t = (i: number) => progressInOut(f, V2.at + i * V2.step, V2.over);
  /** Where this round's row comes to rest — see `panOf`. */
  const pan = panOf(V2.cursor.card);
  const restX = (i: number) => R.x(i) - pan;
  const wide = R.w + R.gap * V2.spread;
  const from0 = theme.canvas.width + 40;
  const startX = (i: number) => from0 + i * wide;
  /**
   * ⚠ AND OUT ONE AT A TIME, FROM THE FAR END — Simon. Same distance for every
   * card, staggered starts: the one nearest the edge goes first, because they
   * are all travelling right and a card that set off before the one in front of
   * it would drive into it. The stagger is also what opens the gaps, so there
   * is no separate spreading to arrange.
   */
  const outAt = (i: number) => V2.out.at + (TITLES.length - 1 - i) * V2.out.step;
  const outX = (i: number) => progressInOut(f, outAt(i), V2.out.over) * AWAY;
  /** The pointer goes with the first card that leaves. */
  const leave = progressInOut(f, V2.out.at, V2.out.over);

  /** The pointer's target on the card it picks — the same spot on the card that
   *  round one used, so the two picks read as the same gesture. */
  const land = {
    x: restX(V2.cursor.card) + R.w * TOUCH.fx,
    y: R.y + R.h * TOUCH.fy,
  };
  const walk = progressInOut(f, V2.cursor.at, V2.cursor.over);
  const from = { x: theme.canvas.width + 60, y: theme.canvas.height + 60 };

  return (
    <>
      {TITLES.map((title, i) => (
        <MistakeCard
          key={title}
          n={i + 1}
          title={title}
          box={{
            x: startX(i) + (restX(i) - startX(i)) * t(i) + outX(i),
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
