/** IN07 finished: Intro ("Investing 101" / "Cara Tuntun Membantu Investor Mengurangi Kesalahan"), the episode, Outro, BGM — core/EpisodeWrap. */
import { EpisodeWrap, fullFrames } from "../../core";
import { CaraTuntunMembantuComposition, IN07_FRAMES } from "./Composition";

/**
 * BGM was off from 27 to 28 Oct 2026 while Simon redid the VO; back on. The BGM file itself is never touched — `bgm={false}`
 * in EpisodeWrap just leaves it out.
 *
 * Since 9 Nov 2026 the bed is the one IN04 and VI02 use, public/bgm/background-music-bed.mp3 (Simon: "background
 * musicnya hilang di akhir, tolong benerin"): the Essentials BGM is 8:14 long and the video, grown with the 9 Nov VO,
 * runs past it. The bed is 15 min, seamless, quieter than the VO, faded out over the video's last 2 s (core
 * EpisodeWrap `bgmSrc`; scripts/vi/bgm-loop.py made it from his "Background Music.mp3" for IN04 on 3 Nov).
 */
const PLAY_BGM = true;

export const IN07_FULL_FRAMES = fullFrames(IN07_FRAMES, 60);
export const CaraTuntunMembantuFull = () => (
  <EpisodeWrap title={["Investing 101", "Cara Tuntun Membantu Investor Mengurangi Kesalahan"]} frames={IN07_FRAMES} name="IN07 Cara Tuntun Membantu Investor Mengurangi Kesalahan" bgm={PLAY_BGM} bgmSrc="bgm/background-music-bed.mp3">
    <CaraTuntunMembantuComposition />
  </EpisodeWrap>
);
