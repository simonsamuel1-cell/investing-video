/** IN07 finished: Intro ("Investing 101" / "Cara Tuntun Membantu Investor Mengurangi Kesalahan"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { CaraTuntunMembantuComposition, IN07_FRAMES } from "./Composition";

/**
 * BGM was off from 27 to 28 Oct 2026 while Simon redid the VO; back on. The BGM file itself is never touched — `bgm={false}`
 * in EpisodeWrap just leaves it out.
 */
const PLAY_BGM = true;

export const IN07_FULL_FRAMES = fullFrames(IN07_FRAMES, 60);
export const CaraTuntunMembantuFull = () => (
  <EpisodeWrap title={["Investing 101", "Cara Tuntun Membantu Investor Mengurangi Kesalahan"]} frames={IN07_FRAMES} name="IN07 Cara Tuntun Membantu Investor Mengurangi Kesalahan" bgm={PLAY_BGM}>
    <CaraTuntunMembantuComposition />
  </EpisodeWrap>
);
