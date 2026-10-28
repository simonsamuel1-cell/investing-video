/** VI07 finished: Intro ("Investing 101" / "Cara Tuntun Membantu Investor Mengurangi Kesalahan"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { CaraTuntunMembantuComposition, VI07_FRAMES } from "./Composition";

/**
 * BGM was off from 27 to 28 Oct 2026 while Simon redid the VO; back on. The BGM file itself is never touched — `bgm={false}`
 * in EpisodeWrap just leaves it out.
 */
const PLAY_BGM = true;

export const VI07_FULL_FRAMES = fullFrames(VI07_FRAMES, 60);
export const CaraTuntunMembantuFull = () => (
  <EpisodeWrap title={["Investing 101", "Cara Tuntun Membantu Investor Mengurangi Kesalahan"]} frames={VI07_FRAMES} name="VI07 Cara Tuntun Membantu Investor Mengurangi Kesalahan" bgm={PLAY_BGM}>
    <CaraTuntunMembantuComposition />
  </EpisodeWrap>
);
