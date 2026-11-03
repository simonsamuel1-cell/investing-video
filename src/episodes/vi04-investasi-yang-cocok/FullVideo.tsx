/**
 * VI04 finished: Intro ("Investing 101" / "Cari Investasi yang Cocok? Kenali Dirimu Dulu"), the episode, the
 * next-video ending over "VO Penutup.mp3" (NextVideo.tsx), Outro, BGM — core/EpisodeWrap.
 *
 * The BGM is VI04's own bed since 3 Nov 2026 (Simon: the old one ran out before the end — "pake ini Background
 * Music.mp3 lalu buat looping, dan bikin volumenya lebih rendah daripada voice overnya"): public/bgm/vi04-bgm.mp3,
 * made by scripts/vi/bgm-loop.py — seamless, about −41 LUFS (the VO is ≈ −15.6), peaks held near −30 dB.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import { InvestasiYangCocokComposition, TOTAL_FRAMES } from "./Composition";
import { NEXT_VI04 } from "./NextVideo";
import { PETA_BARU } from "./components/PetaSwitch";

export const VI04_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 60, { next: NEXT_VI04 });
/** `petaBaru`: the 2 Nov route-map revision on (true) or the islands as before (false) — components/PetaSwitch.tsx. */
export const InvestasiYangCocokFull = ({ petaBaru = PETA_BARU }: { petaBaru?: boolean }) => (
  <EpisodeWrap title={["Investing 101", "Cari Investasi yang Cocok? Kenali Dirimu Dulu"]} frames={TOTAL_FRAMES} name="VI04 Investasi yang Cocok" next={NEXT_VI04} bgmSrc="bgm/vi04-bgm.mp3">
    <InvestasiYangCocokComposition petaBaru={petaBaru} />
  </EpisodeWrap>
);
