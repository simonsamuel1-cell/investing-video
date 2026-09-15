/**
 * SCENE TRANSISI 4.  `from 6023 · dur 202`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round four: the revenge trade is the picture that leaves,
 * it leaves LEFT, and the pointer picks the fourth card.
 *
 * ⚠ THE PICTURE IS THE WHOLE SCENE, not a copy of its last frame. Mounted on
 * its own clock it is still animating as it goes — the note is still up, the
 * stamp is still on the tool — which is the difference between a scene leaving
 * and a screenshot of one sliding away.
 */
import { Sequence } from "remotion";
import { REVENGE_T, ROW4 } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { Revenge } from "./Revenge";

export const CardList4 = () => (
  <SceneTransition V={ROW4} leave="left">
    {/* ⚠ REBASED TO THE REVENGE SCENE'S CLOCK — see SceneTransition. */}
    <Sequence from={REVENGE_T.at - ROW4.from} layout="none">
      <Revenge />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList4", ROW4);
