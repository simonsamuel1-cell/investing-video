/**
 * Step2Frame — Step 2 Analysis group (comp 3391–4903), mounted once. Owns the
 * persistent "02 · Analysis" header (top-left).
 *   S14 3391 d140 · S15 3535 d1368 — the Scene 14-18 capture plays continuously
 * to 4903, with S15's AI-answer graphics overlaid then faded back to the video.
 * Scenes 16–18 (Sources converge / Company sync / Signal spreads) are retired:
 * the continuous video replaces them (scene files kept on disk). Frame = group-local.
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, ChapterCard } from "../components";
import { Scene14 } from "../scenes/Scene14";
import { Scene15 } from "../scenes/Scene15";

export const Step2Frame = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <ChapterCard index="02" title="Analysis" frame={f} start={0} x={96} y={64} />

      <Sequence durationInFrames={140} layout="none"><Scene14 /></Sequence>
      <Sequence from={144} durationInFrames={1368} layout="none"><Scene15 /></Sequence>
    </SafeArea>
  );
};
