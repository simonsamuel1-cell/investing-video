/**
 * SCENE TRANSISI 3.  `from 5045 · dur 202`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round three: the platform is the picture that leaves, it
 * leaves UPWARD (Simon), and the pointer picks the third card.
 */
import { Sequence } from "remotion";
import { BLOCK, ROW3 } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { Platform } from "./Platform";

export const CardList3 = () => (
  <SceneTransition V={ROW3} leave="up">
    {/* ⚠ REBASED TO SC06'S CLOCK — see SceneTransition. */}
    <Sequence from={BLOCK.SC06 - ROW3.from} layout="none">
      <Platform />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList3", ROW3);
