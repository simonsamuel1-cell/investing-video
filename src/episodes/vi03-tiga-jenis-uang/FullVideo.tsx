/** VI03 finished: Intro ("Value Investing" / "Tiga Jenis Uang"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { TigaJenisUangComposition, TOTAL_FRAMES } from "./Composition";

export const VI03_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60);
export const TigaJenisUangFull = () => (
  <EpisodeWrap title={["Value Investing", "Tiga Jenis Uang"]} frames={TOTAL_FRAMES} name="VI03 Tiga Jenis Uang">
    <TigaJenisUangComposition />
  </EpisodeWrap>
);
