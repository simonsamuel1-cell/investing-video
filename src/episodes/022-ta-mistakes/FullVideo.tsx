/**
 * TA11 with the CTA (Simon, 20 Oct 2026: "TA11, kasih video CTA aja"): the episode as it was, its last half-second
 * fading to the paper, then CTA.mp4 — no intro, no outro, no BGM. Its frame numbers are unchanged.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { TAMistakesComposition, TOTAL_FRAMES } from "./Composition";

export const TA11_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60, { cta: true, intro: false, outro: false });
export const TAMistakesFull = () => (
  <EpisodeWrap frames={TOTAL_FRAMES} name="TA11 TA Mistakes" intro={false} outro={false} bgm={false} cta>
    <TAMistakesComposition />
  </EpisodeWrap>
);
