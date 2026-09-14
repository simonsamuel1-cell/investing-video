/**
 * SCENE TRANSISI 3.  `from 5045 · dur 236`
 *
 * ⚠ IT OWNS THE PLATFORM'S EXIT, and it has to. The row arriving and the
 * picture leaving have to cross — that is what made the second transition read
 * as one move — and they can only cross if one layer draws both. SC06's own
 * window ends on 5045, so from 5046 this is the only copy of that panel on
 * screen; on 5045 there are two, in the same place, at the same progress.
 *
 * ⚠ THE PANEL IS DRAWN ON ITS OWN CLOCK. A negative `from` rebases the child to
 * SC06's frames, so `Platform` behaves exactly as it does in its own scene —
 * its dashed box does not re-open, its type does not re-type, and nothing in it
 * has to learn that it is being mounted somewhere else.
 *
 * ⚠ AND IT LEAVES UPWARD — Simon. The platform is a window onto a screen; one
 * that slides sideways reads as another screen arriving, one that lifts away
 * reads as this one being put down.
 */
import { Sequence, useCurrentFrame } from "remotion";
import { progressInOut, theme, usePalette } from "../../../core";
import { BLOCK, CARD_LIST, ROW3 } from "../data/timing";
import { MistakeRow } from "./MistakeRow";
import { Platform } from "./Platform";

/** ⚠ THE WHOLE FRAME, plus air. Solved rather than measured off the panel: what
 *  has to clear the top edge is everything drawn in this layer, and the frame
 *  is the one box guaranteed to contain all of it. */
const LIFT = theme.canvas.height + 40;

export const CardList3 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const g = f + ROW3.from;
  const up = progressInOut(g, ROW3.away.at, ROW3.away.over) * LIFT;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ⚠ THE GROUND STAYS WHILE THE PICTURE GOES, the same as in the second
          transition: the row that arrives next has to arrive ONTO something. */}
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-up.toFixed(1)}px)` }}>
        <Sequence from={BLOCK.SC06 - ROW3.from} layout="none">
          <Platform />
        </Sequence>
      </div>
      <MistakeRow f={g} V2={ROW3.row} />
    </div>
  );
};

/** Kept honest: the same three things the second round is checked for. */
{
  const V = ROW3.row;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/CardList3: ${m}`);
  };
  if (V.hover.at + V.hover.over > V.out.at) {
    fail("the row starts leaving while its flood is still spreading");
  }
  const last = V.out.at + (CARD_LIST.titles.length - 1) * V.out.step + V.out.over;
  if (last > ROW3.from + ROW3.over) {
    fail(`the last card clears at ${last}, past the window's end`);
  }
  if (ROW3.away.at < ROW3.from) {
    fail("the platform starts leaving before this layer is mounted");
  }
}
