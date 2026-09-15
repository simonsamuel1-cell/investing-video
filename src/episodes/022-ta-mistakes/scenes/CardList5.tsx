/**
 * SCENE TRANSISI 5.  `from 7101 · dur 210`
 *
 * The move itself lives in scenes/SceneTransition.tsx — this is only the three
 * things that make it round five: the two windows are the picture that leaves,
 * they leave LEFT, and the pointer picks the fifth card.
 *
 * ⚠ THE PICTURE IS THE WHOLE SCENE, not a copy of its last frame. Mounted on
 * its own clock it is still alive as it goes — the glow still on window 1, the
 * green answer still in the box — which is the difference between a scene
 * leaving and a screenshot of one sliding away.
 */
import { Sequence } from "remotion";
import { ROW5, TWIN } from "../data/timing";
import { SceneTransition, assertTransition } from "./SceneTransition";
import { TwinWindows } from "./TwinWindows";

export const CardList5 = () => (
  <SceneTransition V={ROW5} leave="left">
    {/* ⚠ REBASED TO THE TWIN WINDOWS' CLOCK — see SceneTransition. */}
    <Sequence from={TWIN.at - ROW5.from} layout="none">
      <TwinWindows />
    </Sequence>
  </SceneTransition>
);

assertTransition("CardList5", ROW5);
