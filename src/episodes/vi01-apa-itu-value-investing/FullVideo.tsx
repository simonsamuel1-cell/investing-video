/**
 * VI01 finished: Intro ("Value Investing" / "Apa Itu Value Investing dan Kenapa Cocok untuk Investor Indonesia?"), the
 * episode, Outro, and the looped bed the other VI/IN videos use (bgm/background-music-bed.mp3, made from Simon's
 * Background Music.mp3 by scripts/vi/bgm-loop.py) — core/EpisodeWrap. The "video selanjutnya" line is in this VO's
 * Scene 08, so there is no separate next-video ending.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { ApaItuValueInvestingComposition, VI01_FRAMES } from "./Composition";

export const VI01_FULL_FRAMES = fullFrames(VI01_FRAMES, 60);
export const ApaItuValueInvestingFull = () => (
  <EpisodeWrap title={["Value Investing", "Apa Itu Value Investing dan Kenapa Cocok untuk Investor Indonesia?"]} frames={VI01_FRAMES} name="VI01 Apa Itu Value Investing" bgmSrc="bgm/background-music-bed.mp3">
    <ApaItuValueInvestingComposition />
  </EpisodeWrap>
);
