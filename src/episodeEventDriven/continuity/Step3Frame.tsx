/**
 * Step3Frame — Step 3 Monitoring group, Scenes 19–23 (comp 4903–5814), mounted
 * once. Owns the persistent "03 · Monitoring" header (top-left). Each scene owns
 * its own content.
 *   S19 4903 d134 · S20 5037 d224 · S21 5275 d131 · S22 5418 d213 · S23 5631 d183
 * Frame here = group-local (0 at comp 4903).
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, ChapterCard } from "../components";
import { Scene19 } from "../scenes/Scene19";
import { Scene20 } from "../scenes/Scene20";
import { Scene21 } from "../scenes/Scene21";
import { Scene22 } from "../scenes/Scene22";
import { Scene23 } from "../scenes/Scene23";

export const Step3Frame = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <ChapterCard index="03" title="Monitoring" frame={f} start={0} x={96} y={64} />

      <Sequence durationInFrames={134} layout="none"><Scene19 /></Sequence>
      <Sequence from={134} durationInFrames={224} layout="none"><Scene20 /></Sequence>
      <Sequence from={372} durationInFrames={131} layout="none"><Scene21 /></Sequence>
      <Sequence from={515} durationInFrames={213} layout="none"><Scene22 /></Sequence>
      <Sequence from={728} durationInFrames={183} layout="none"><Scene23 /></Sequence>
    </SafeArea>
  );
};
