/**
 * scenes/SceneTransition.tsx — the move from a scene to the list of mistakes.
 *
 * ⚠ ONE OBJECT, NOT ONE PER ROUND. Transitions three and four differ in exactly
 * three things: which picture leaves, which way it goes, and which card the
 * pointer picks. Everything else — the ground that stays, the row that arrives
 * onto it, the crossing of the two — is the same move, and two scenes that are
 * nearly alike is the one thing these transitions must not be. Round two still
 * lives inside CardList, because there the row is arriving into its own scene
 * rather than onto a picture this layer has to carry off.
 *
 * ⚠ IT OWNS THE OUTGOING PICTURE'S EXIT, and it has to. The row arriving and
 * the picture leaving have to cross — that is what made the second transition
 * read as one move — and they can only cross if one layer draws both. The
 * outgoing scene's own window ends on this layer's first frame, so on that one
 * frame there are two copies in the same place at the same progress, and from
 * the next there is only this one.
 *
 * ⚠ THE PICTURE IS DRAWN ON ITS OWN CLOCK. The caller wraps it in a Sequence
 * with a negative `from`, which rebases it to its own frames — so it behaves
 * exactly as it does in its own scene: dashed boxes do not re-open, type does
 * not re-type, and nothing in it has to learn it is mounted somewhere else.
 *
 * ⚠ AND THE GROUND STAYS WHILE THE PICTURE GOES. The row that arrives next has
 * to arrive ONTO something; without it the cards would cross bare canvas for as
 * long as the two overlap.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { progressInOut, theme, usePalette } from "../../../core";
import { CARD_ROW, VISIBLE } from "../data/layout";
import { CARD_LIST } from "../data/timing";
import { MistakeRow, type Round } from "./MistakeRow";

/**
 * ⚠ THE WHOLE FRAME, PLUS AIR, in whichever direction is asked for. Solved
 * rather than measured off the picture: what has to clear the edge is
 * everything drawn in this layer, and the frame is the one box guaranteed to
 * contain all of it.
 */
const AWAY = { up: theme.canvas.height + 40, left: theme.canvas.width + 40 };

export type Transition = {
  from: number;
  over: number;
  away: { at: number; over: number };
  row: Round;
};

export const SceneTransition = ({
  V,
  leave,
  children,
}: {
  V: Transition;
  /**
   * ⚠ UP READS DIFFERENTLY FROM LEFT, and the choice is not decoration. A
   * window onto a screen that slides sideways reads as another screen
   * arriving; one that lifts away reads as this one being put down. A chart on
   * a card is the other way round: it is a page, and a page is pushed aside by
   * what comes next.
   *
   * ⚠ AND `fade` IS FOR A PICTURE THAT IS ALREADY FINISHED. See the note on
   * the style below — it is not a weaker version of the other two.
   */
  leave: "up" | "left" | "fade";
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const g = f + V.from;
  const p = progressInOut(g, V.away.at, V.away.over);
  /**
   * ⚠ A FADE MOVES NOTHING, AND THAT IS WHY IT IS A THIRD KIND rather than a
   * translate of zero. Both of the others carry a picture off: a window is put
   * down, a page is pushed aside. Neither is right for a scene that has already
   * finished speaking — SC10 ends on a sentence in a box, and sliding that box
   * away would set the closing line moving at the exact moment it is meant to
   * be read. Simon's call: "kasih fade out aja".
   */
  const style: React.CSSProperties =
    leave === "fade"
      ? { opacity: 1 - p }
      : {
          transform:
            leave === "up"
              ? `translateY(${(-p * AWAY.up).toFixed(1)}px)`
              : `translateX(${(-p * AWAY.left).toFixed(1)}px)`,
        };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      <div style={{ position: "absolute", inset: 0, ...style }}>
        {children}
      </div>
      <MistakeRow f={g} V2={V.row} />
    </div>
  );
};

/** The three things every round is checked for. Called by each one with its own
 *  name, so a failure says which transition broke rather than which file. */
export const assertTransition = (name: string, V: Transition) => {
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/${name}: ${m}`);
  };
  if (V.row.hover.at + V.row.hover.over > V.row.out.at) {
    fail("the row starts leaving while its flood is still spreading");
  }
  const last =
    V.row.out.at + (CARD_LIST.titles.length - 1) * V.row.out.step + V.row.out.over;
  if (last > V.from + V.over) {
    fail(`the last card clears at ${last}, past the window's end`);
  }
  if (V.away.at < V.from) {
    fail("the outgoing picture starts leaving before this layer is mounted");
  }
  /** ⚠ AND THE PICK HAS TO BE A CARD THAT EXISTS, and one the list has not
   *  already finished — the round after this one reads `done` as "everything
   *  picked so far", so a pick outside the row breaks the next round too. */
  if (V.row.cursor.card < 0 || V.row.cursor.card >= CARD_LIST.titles.length) {
    fail(`the pointer picks card ${V.row.cursor.card + 1}, which is not in the row`);
  }
  if (V.row.done.includes(V.row.cursor.card)) {
    fail(`the pointer picks card ${V.row.cursor.card + 1}, which is already done`);
  }
  assertRowArrival(name, V.row);
};

/**
 * ⚠ THE POINTER MAY NOT ARRIVE BEFORE THE CARD IT PICKS. Staggering the row's
 * entrance made this possible for the first time: the later a card sits in the
 * row the later it lands, so a pointer aimed at the far end can now get there
 * first and hover over empty paper. Exported, because round two is inside
 * CardList and has the same exposure.
 */
export const assertRowArrival = (name: string, row: Round) => {
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/${name}: ${m}`);
  };
  /** ⚠ AND THE CARD IT PICKS HAS TO BE FULLY ON SCREEN WHEN IT GETS THERE. The
   *  row rests further along the list for a later pick (see `panOf`), so this
   *  is really a check that the panning rule and the window rule agree — a pick
   *  the pointer can reach but the viewer cannot read is the failure mode the
   *  eight-card list introduced. */
  const pan = Math.max(0, row.cursor.card - (VISIBLE - 3)) * (CARD_ROW.w + CARD_ROW.gap);
  const left = CARD_ROW.x(row.cursor.card) - pan;
  if (left < 0 || left + CARD_ROW.w > theme.canvas.width) {
    fail(
      `card ${row.cursor.card + 1} rests at ${left.toFixed(0)}..${(left + CARD_ROW.w).toFixed(0)}, not fully on a ${theme.canvas.width}px frame`,
    );
  }
  const landed = row.at + row.cursor.card * row.step + row.over;
  const reached = row.cursor.at + row.cursor.over;
  if (reached < landed) {
    fail(
      `the pointer reaches card ${row.cursor.card + 1} on ${reached}, ${landed - reached} frames before that card lands`,
    );
  }
  /** ⚠ AND THE FLOOD CANNOT START BEFORE ITS CARD HAS LANDED — the same
   *  exposure, on the other half of the gesture. Note what is NOT checked here:
   *  the flood is allowed to lead the pointer's last frame or two. Round two
   *  has done exactly that since it was approved, and a hover response that
   *  begins as the pointer settles is anticipation, not an error. */
  if (row.hover.at < landed) {
    fail(`card ${row.cursor.card + 1} floods on ${row.hover.at}, before it lands on ${landed}`);
  }
  /** The whole row has to be in before any of it leaves. */
  const allIn = row.at + (CARD_LIST.titles.length - 1) * row.step + row.over;
  if (row.out.at < allIn) {
    fail(`the row starts leaving on ${row.out.at}, before the last card lands on ${allIn}`);
  }
};
