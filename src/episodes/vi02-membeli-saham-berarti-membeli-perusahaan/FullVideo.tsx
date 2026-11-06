/**
 * VI02 finished: Intro ("Value Investing" / "Membeli Saham Berarti Membeli Perusahaan"), the episode, Outro, and the
 * looped bed made from Simon's Background Music.mp3 (scripts/vi/bgm-loop.py) — core/EpisodeWrap. The "video selanjutnya"
 * line is in this VO's Scene 08, so there is no separate next-video ending.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { MembeliSahamComposition, VI02_FRAMES } from "./Composition";

/** `false` while the visuals are reviewed (Simon, 5 Nov): the bed is left out, its file untouched. Back to `true` before a render. */
const BGM: boolean = false;

export const VI02_FULL_FRAMES = fullFrames(VI02_FRAMES, 60);
export const MembeliSahamFull = () => (
  <EpisodeWrap title={["Value Investing", "Membeli Saham Berarti Membeli Perusahaan"]} frames={VI02_FRAMES} name="VI02 Membeli Saham Berarti Membeli Perusahaan" bgm={BGM} bgmSrc="bgm/background-music-bed.mp3">
    <MembeliSahamComposition />
  </EpisodeWrap>
);
