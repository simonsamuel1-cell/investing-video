/**
 * TA11 finished: Intro ("Technical Analysis" / "Common Mistakes in Technical Analysis"), the episode, its last
 * half-second fading to the paper, CTA.mp4, Outro.mp4, and the BGM under all — core/EpisodeWrap, as TA09.
 * (20 Oct 2026 it was the CTA alone, "kasih video CTA aja"; Simon, 12 Nov 2026: "pasang intro outro juga dan bgm nya".)
 * The episode's frame numbers sit introFrames (240) later in this timeline.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { TAMistakesComposition, TOTAL_FRAMES } from "./Composition";

export const TA11_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60, { cta: true });
export const TAMistakesFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Common Mistakes in Technical Analysis"]} frames={TOTAL_FRAMES} name="TA11 TA Mistakes" cta>
    <TAMistakesComposition />
  </EpisodeWrap>
);
