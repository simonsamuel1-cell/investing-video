/**
 * TA05 finished (Simon, 20 Oct 2026): Intro ("Technical Analysis" / "Mengenal Market Structure dan Perubahan Tren"),
 * the episode, the next-video ending over TA05-Outro.mp3, CTA.mp4, Outro.mp4, and the BGM under all — core/EpisodeWrap.
 */
import { EpisodeWrap, fullFrames } from "../core";
import { MarketStructureComposition, TOTAL_FRAMES } from "./Composition";
import { NEXT_TA05 } from "./NextVideo";

export const TA05_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 30, { next: NEXT_TA05, cta: true });
export const MarketStructureFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Mengenal Market Structure dan Perubahan Tren"]} frames={TOTAL_FRAMES} name="TA05 Market Structure" next={NEXT_TA05} cta>
    <MarketStructureComposition />
  </EpisodeWrap>
);
