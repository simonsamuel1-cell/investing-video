/**
 * SCENE TRANSISI 7.  `from 9110 · dur 210`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round seven: SC10 is the picture that leaves, it leaves
 * by FADING, and the pointer picks the seventh card.
 *
 * ⚠ IT FADES RATHER THAN SLIDES — Simon: "dari scene terakhir (yang ada text
 * box), kasih fade out aja". By 9110 SC10 is one sentence in a dashed box and
 * nothing else; its chart cleared at 8930. A box holding the scene's conclusion
 * is not a picture waiting to be carried off, and sliding it would set the
 * closing line moving at the moment it is meant to be read.
 *
 * ⚠ THIS ROUND IS ALSO SC11'S TITLE, the way round six was SC10's. "Ada juga
 * hindsight bias." starts on 9130, twenty frames into this window, and card
 * seven's own text is those two words — so the pick and the naming happen
 * together and SC11 opens already introduced.
 */
import { Sequence } from "remotion";
import { PANEL10, ROW7 } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { Overload } from "./Overload";

export const CardList7 = () => (
  <SceneTransition V={ROW7} leave="fade">
    {/* ⚠ REBASED TO SC10'S OWN CLOCK — see SceneTransition. Without this the
        dashed box would open again and the sentence would re-type. */}
    <Sequence from={PANEL10.at - ROW7.from} layout="none">
      <Overload />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList7", ROW7);
