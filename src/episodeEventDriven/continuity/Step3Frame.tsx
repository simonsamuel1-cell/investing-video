/**
 * Step3Frame — Step 3 Monitoring group (comp 4903–5814), mounted once. Owns the
 * persistent "03 · Monitoring" header (top-left).
 *   (chapter card only) 4903–4963 · S20 4963 d352 (ends 5315) · S20-23 5315 d499 (Biasa/Pro + holds/fade arrows)
 * S20 rebuilt with real captures (News List → News → Buy → cursor → dim + "Don't");
 * S20-23 follows with the Biasa vs Pro charts and holds/fade arrows to the group
 * end. Old illustrated S19/S21–23 retired (.tsx files kept on disk). Frame = group-local.
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, ChapterCard } from "../components";
import { Scene20 } from "../scenes/Scene20";
import { Scene2023 } from "../scenes/Scene2023";

export const Step3Frame = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <ChapterCard index="03" title="Monitoring" frame={f} start={0} x={96} y={64} />

      <Sequence from={60} durationInFrames={352} layout="none"><Scene20 /></Sequence>
      <Sequence from={412} durationInFrames={499} layout="none"><Scene2023 /></Sequence>
    </SafeArea>
  );
};
