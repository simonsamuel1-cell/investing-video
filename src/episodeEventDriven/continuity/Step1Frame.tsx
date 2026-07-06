/**
 * Step1Frame — Step 1 Screening group, Scenes 9–13 (comp 2077–3382), mounted
 * once. Owns the persistent "01 · Screening" header (top-left) so it never
 * remounts across the five member scenes. Each scene owns its own chart/route.
 *   S9 from 2077 d183 · S10 2277 d524 · S11 2801 d221 · S12 3032 d152 · S13 3187 d195
 * Frame here = group-local (0 at comp 2077).
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, ChapterCard } from "../components";
import { Scene09 } from "../scenes/Scene09";
import { Scene10 } from "../scenes/Scene10";
import { Scene11 } from "../scenes/Scene11";
import { Scene12 } from "../scenes/Scene12";
import { Scene13 } from "../scenes/Scene13";

export const Step1Frame = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <ChapterCard index="01" title="Screening" frame={f} start={0} x={96} y={64} />

      <Sequence durationInFrames={183} layout="none"><Scene09 /></Sequence>
      <Sequence from={200} durationInFrames={524} layout="none"><Scene10 /></Sequence>
      <Sequence from={724} durationInFrames={221} layout="none"><Scene11 /></Sequence>
      <Sequence from={955} durationInFrames={152} layout="none"><Scene12 /></Sequence>
      <Sequence from={1110} durationInFrames={195} layout="none"><Scene13 /></Sequence>
    </SafeArea>
  );
};
