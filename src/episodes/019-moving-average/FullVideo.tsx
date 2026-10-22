/**
 * TA07 finished (Simon, 20 Oct 2026): Intro ("Technical Analysis" / "Moving Averages & Bollinger Bands"), the
 * episode, the next-video ending over TA07-Outro.mp3, CTA.mp4, Outro.mp4, and the BGM under all — core/EpisodeWrap.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { MovingAverageComposition, TOTAL_FRAMES } from "./Composition";
import { NEXT_TA07 } from "./NextVideo";

export const TA07_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 30, { next: NEXT_TA07, cta: true });
export const MovingAverageFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Moving Averages & Bollinger Bands"]} frames={TOTAL_FRAMES} name="TA07 Moving Averages & Bollinger Bands" next={NEXT_TA07} cta>
    <MovingAverageComposition />
  </EpisodeWrap>
);
