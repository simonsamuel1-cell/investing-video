/**
 * Step2Frame — Step 2 Analysis group, Scenes 14–18 (comp 3391–4884), mounted
 * once. Owns the persistent "02 · Analysis" header (top-left). Each scene owns
 * its own content.
 *   S14 3391 d136 · S15 3535 d597 · S16 4141 d316 · S17 4460 d200 · S18 4660 d224
 * Frame here = group-local (0 at comp 3391).
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, ChapterCard } from "../components";
import { Scene14 } from "../scenes/Scene14";
import { Scene15 } from "../scenes/Scene15";
import { Scene16 } from "../scenes/Scene16";
import { Scene17 } from "../scenes/Scene17";
import { Scene18 } from "../scenes/Scene18";

export const Step2Frame = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <ChapterCard index="02" title="Analysis" frame={f} start={0} x={96} y={64} />

      <Sequence durationInFrames={136} layout="none"><Scene14 /></Sequence>
      <Sequence from={144} durationInFrames={597} layout="none"><Scene15 /></Sequence>
      <Sequence from={750} durationInFrames={316} layout="none"><Scene16 /></Sequence>
      <Sequence from={1069} durationInFrames={200} layout="none"><Scene17 /></Sequence>
      <Sequence from={1269} durationInFrames={224} layout="none"><Scene18 /></Sequence>
    </SafeArea>
  );
};
