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
import { CARD_ROW } from "../data/layout";
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

/** One round of the list: when it arrives, who is picked, who is finished. */
export type Round = {
  at: number;
  over: number;
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
  const t = progressInOut(f, V2.at, V2.over);
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
    x: R.x(V2.cursor.card) + R.w * TOUCH.fx,
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
