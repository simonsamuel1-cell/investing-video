/**
 * VI04 finished: Intro ("Investing 101" / "Cari Investasi yang Cocok? Kenali Dirimu Dulu"), the episode, the
 * next-video ending over "VO Penutup.mp3" (NextVideo.tsx), Outro, BGM — core/EpisodeWrap.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { InvestasiYangCocokComposition, TOTAL_FRAMES } from "./Composition";
import { NEXT_VI04 } from "./NextVideo";
import { PETA_BARU } from "./components/PetaSwitch";

export const VI04_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60, { next: NEXT_VI04 });
/** `petaBaru`: the 2 Nov route-map revision on (true) or the islands as before (false) — components/PetaSwitch.tsx. */
export const InvestasiYangCocokFull = ({ petaBaru = PETA_BARU }: { petaBaru?: boolean }) => (
  <EpisodeWrap title={["Investing 101", "Cari Investasi yang Cocok? Kenali Dirimu Dulu"]} frames={TOTAL_FRAMES} name="VI04 Investasi yang Cocok" next={NEXT_VI04}>
    <InvestasiYangCocokComposition petaBaru={petaBaru} />
  </EpisodeWrap>
);
