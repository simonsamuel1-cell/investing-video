/**
 * SCENE TRANSISI 6.  `from 8060 · dur 210`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round six: the two market windows are the picture that
 * leaves, they leave LEFT, and the pointer picks the sixth card.
 *
 * ⚠ THIS ROUND IS ALSO THE SCENE'S TITLE. The voice names mistake six —
 * "Jangan terjebak indicator overload" — while this is up, and card six's own
 * text is those two words. So SC10 does not have to introduce itself to a
 * viewer who has just read its name off the list.
 */
import { Sequence } from "remotion";
import { BREAKOUT, ROW6 } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { Breakout } from "./Breakout";

export const CardList6 = () => (
  <SceneTransition V={ROW6} leave="left">
    {/* ⚠ REBASED TO SC09'S OWN CLOCK — see SceneTransition. */}
    <Sequence from={BREAKOUT.at - ROW6.from} layout="none">
      <Breakout />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList6", ROW6);
