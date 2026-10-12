/**
 * VI01 · Passive Income — THE FINISHED VIDEO: Intro, the episode, Outro, one BGM underneath.
 *
 * `VI01-PassiveIncome` stays the working composition: every frame number Simon gives for the episode is
 * a frame of THAT one. This wraps it, so nothing inside it moves — the whole episode is simply mounted
 * `INTRO_FRAMES` later, its own voice-over and subtitles with it.
 *
 * ⚠ THE BGM IS UNTOUCHABLE. Simon: "Jangan ganggu gugat BGM sama sekali, kalau pun suatu saat aku bilang
 * 'ubah semua', BGM tidak boleh disentuh. Termasuk Logo juga." public/essentials/BGM.mp3 is a byte-for-byte
 * copy of Documents/01 Academy/Essentials/BGM.MP3: no trim, no gain, no fade, no loop, no ducking, no
 * re-encode, one <Audio> from frame 0 at full volume. The Logo (core Watermark) is left as it is as well.
 */
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { PassiveIncomeComposition, TOTAL_FRAMES } from "./Composition";

/** Intro.mp4 — 4.000 s at 60 fps. */
export const INTRO_FRAMES = 240;
/** Outro.mp4 — 3.983 s at 60 fps. */
export const OUTRO_FRAMES = 239;
export const FULL_FRAMES = INTRO_FRAMES + TOTAL_FRAMES + OUTRO_FRAMES;

export const PassiveIncomeFull = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
      <OffthreadVideo src={staticFile("essentials/Intro.mp4")} />
    </Sequence>
    <Sequence from={INTRO_FRAMES} durationInFrames={TOTAL_FRAMES} name="VI01 Passive Income">
      <PassiveIncomeComposition />
    </Sequence>
    <Sequence from={INTRO_FRAMES + TOTAL_FRAMES} durationInFrames={OUTRO_FRAMES} name="Outro">
      <OffthreadVideo src={staticFile("essentials/Outro.mp4")} />
    </Sequence>
    {/* the BGM, as it is, under all of it */}
    <Audio src={staticFile("essentials/BGM.mp3")} />
  </AbsoluteFill>
);
