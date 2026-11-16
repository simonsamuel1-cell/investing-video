/**
 * VI03 finished: Intro ("Value Investing" / "Membeli dengan Harga yang Cukup Murah"), the episode, Outro, and the looped
 * bed made from Simon's Background Music.mp3 (scripts/vi/bgm-loop.py) — core/EpisodeWrap. The "video selanjutnya" line is
 * in this VO's Scene 08, so there is no separate next-video ending.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { MembeliCukupMurahComposition, VI03_FRAMES } from "./Composition";

/** The BGM switch. Simon turns it on or off; the bed's file is never touched. */
const BGM: boolean = true;

export const VI03_FULL_FRAMES = fullFrames(VI03_FRAMES, 60);
export const MembeliCukupMurahFull = () => (
  <EpisodeWrap title={["Value Investing", "Membeli dengan Harga yang Cukup Murah"]} frames={VI03_FRAMES} name="VI03 Membeli dengan Harga yang Cukup Murah" bgm={BGM} bgmSrc="bgm/background-music-bed.mp3">
    <MembeliCukupMurahComposition />
  </EpisodeWrap>
);
