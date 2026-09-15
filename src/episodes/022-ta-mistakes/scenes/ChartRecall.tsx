/**
 * THE CHART, RECALLED.  `from 5247`
 *
 * ⚠ IT IS THE SAME DRAWING, FROZEN — Simon: "chart yang sama seperti 4044".
 * `Freeze` holds CardList on the frame that picture lives on, so the card, the
 * tape, the level and the position tool are not reproduced here, they ARE that
 * layer. A second copy would be two drawings of one thing that could only drift.
 *
 * ⚠ WITHOUT THE NOTE — "kecuali text box, jangan di-include". A flag on the
 * layer, not a second layer.
 *
 * ⚠ THE SLIDE IS COMPUTED OUTSIDE THE FREEZE, and has to be: inside it the
 * clock is stopped, so nothing in there can move. This is the one thing in the
 * scene that still reads the real frame.
 */
import { Freeze, useCurrentFrame } from "remotion";
import { progressInOut } from "../../../core";
import { CARD_OPEN } from "../data/layout";
import { RECALL } from "../data/timing";
import { CardList } from "./CardList";

/** ⚠ FAR ENOUGH THAT THE CARD'S RIGHT EDGE IS PAST THE LEFT OF THE FRAME.
 *  Solved from the card rather than from the canvas, so it stays true if the
 *  card is ever re-sized. */
const IN = CARD_OPEN.x + CARD_OPEN.w + 40;

export const ChartRecall = () => {
  const f = useCurrentFrame();
  const x = (1 - progressInOut(f, 0, RECALL.in)) * -IN;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${x.toFixed(1)}px)` }}>
      <Freeze frame={RECALL.frame}>
        {/* ⚠ AND WITHOUT THE OTHER FIVE CARDS. They sit off the right edge on
            a transform; sliding this layer in from the left drags them back
            across the frame, which is the same trap round two hit. */}
        <CardList note={false} deck={false} />
      </Freeze>
    </div>
  );
};
