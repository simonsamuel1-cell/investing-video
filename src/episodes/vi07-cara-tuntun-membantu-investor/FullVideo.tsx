/** VI07 finished: Intro ("Investing 101" / "Cara Tuntun Membantu Investor Mengurangi Kesalahan"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { CaraTuntunMembantuComposition, VI07_FRAMES } from "./Composition";

export const VI07_FULL_FRAMES = fullFrames(VI07_FRAMES, 60);
export const CaraTuntunMembantuFull = () => (
  <EpisodeWrap title={["Investing 101", "Cara Tuntun Membantu Investor Mengurangi Kesalahan"]} frames={VI07_FRAMES} name="VI07 Cara Tuntun Membantu Investor Mengurangi Kesalahan">
    <CaraTuntunMembantuComposition />
  </EpisodeWrap>
);
