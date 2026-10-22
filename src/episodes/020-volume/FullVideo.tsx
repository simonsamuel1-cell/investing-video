/**
 * TA09 finished (Simon, 20 Oct 2026): Intro ("Technical Analysis" / "Volume Analysis"), the episode — which now ends
 * on SC21 over TA09-Outro.mp3 — then CTA.mp4 and Outro.mp4, and the BGM under all of it (Simon, 20 Oct: "Jangan lupa juga untuk
 * tambahin background music nya").
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { TOTAL_FRAMES, VolumeComposition } from "./Composition";

export const TA09_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60, { cta: true });
export const VolumeFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Volume Analysis"]} frames={TOTAL_FRAMES} name="TA09 Volume" cta>
    <VolumeComposition />
  </EpisodeWrap>
);
