/**
 * SCENE TRANSISI 8.  `from 12535 · dur 210`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round eight: the ADMR window is the picture that leaves,
 * it leaves LEFT, and the pointer picks the eighth card.
 *
 * ⚠ THIS ROUND IS ALSO SC15'S TITLE, the way rounds six and seven were SC10's
 * and SC11's. "Kesalahan lain adalah asal copy trade orang lain." starts on
 * 12559, 24 frames into this window, and card eight's own text is those three
 * words — so the pick and the naming happen together.
 *
 * ⚠ AND IT IS THE LAST TURN OF THE LIST. Eight cards, eight rounds, and this
 * one leaves none behind: `done` is the seven before it, and the pointer takes
 * the last one that is left.
 */
import { Sequence } from "remotion";
import { CUT11, ROW8 } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { AdmrGroup } from "./AdmrGroup";

export const CardList8 = () => (
  <SceneTransition V={ROW8} leave="left">
    {/* ⚠ REBASED TO THE ADMR GROUP'S OWN CLOCK — see SceneTransition. Without
        this the tape would start drawing itself in again from bar zero. */}
    <Sequence from={CUT11.at - ROW8.from} layout="none">
      <AdmrGroup />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList8", ROW8);
