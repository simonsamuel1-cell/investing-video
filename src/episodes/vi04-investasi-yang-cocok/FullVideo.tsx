/** VI04 finished: Intro ("Value Investing" / "Investasi yang Cocok"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { InvestasiYangCocokComposition, TOTAL_FRAMES } from "./Composition";

export const VI04_FULL_FRAMES = fullFrames(TOTAL_FRAMES);
export const InvestasiYangCocokFull = () => (
  <EpisodeWrap title={["Value Investing", "Investasi yang Cocok"]} frames={TOTAL_FRAMES} name="VI04 Investasi yang Cocok">
    <InvestasiYangCocokComposition />
  </EpisodeWrap>
);
