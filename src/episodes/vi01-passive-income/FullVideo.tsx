/**
 * VI01 · Passive Income — THE FINISHED VIDEO: Intro, the episode, Outro, one BGM underneath.
 *
 * `VI01-PassiveIncome` stays the working composition: every frame number Simon gives for the episode is
 * a frame of THAT one. This wraps it, so nothing inside it moves — the whole episode is simply mounted
 * `INTRO_FRAMES` later, its own voice-over and subtitles with it.
 *
 * ⚠ THE BGM IS UNTOUCHABLE. Simon: "Jangan ganggu gugat BGM sama sekali, kalau pun suatu saat aku bilang
 * 'ubah semua', BGM tidak boleh disentuh. Termasuk Logo juga." public/essentials/BGM.mp3 is a byte-for-byte
 * copy of Documents/01 Academy/Essentials/BGM(1).MP3 (Simon's updated BGM, 2026-10-12; 494 s — the video is shorter,
 * so it simply stops where the video does, "nanti potong aja"): no trim, no gain, no fade, no loop, no ducking, no
 * re-encode, one <Audio> from frame 0 at full volume. The Logo (core Watermark) is left as it is as well.
 */
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaletteProvider, theme, usePalette } from "../../core";
import { PassiveIncomeComposition, TOTAL_FRAMES } from "./Composition";
import { ease } from "./components/kit";

/** Intro.mp4 — 4.000 s at 60 fps. */
export const INTRO_FRAMES = 240;
/** Outro.mp4 — 3.983 s at 60 fps. */
export const OUTRO_FRAMES = 239;
export const FULL_FRAMES = INTRO_FRAMES + TOTAL_FRAMES + OUTRO_FRAMES;

/**
 * The two title lines of the Intro, after MovingAverageIntro.mp4 (VIDEO 20): the same Tuntun bumper, and
 * under the logo two centred lines that reveal left to right behind a soft edge — the second a dozen
 * frames behind the first. Measured off that video's frames: line one runs f71–f97, line two f83–f109,
 * their centres at y 698 and y 764, indigo. Here the words are Simon's — "Value Investing" over
 * "Passive Income" — set in Plus Jakarta.
 */
const TITLE = { lines: ["Value Investing", "Passive Income"], starts: [71, 83], span: 26, y: [698, 764], size: 56, weight: 600, soft: 28, leading: 1.4 };

const IntroTitle = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  return (
    <>
      {TITLE.lines.map((text, i) => {
        const p = ease(f, TITLE.starts[i], TITLE.span);
        if (p <= 0.001) return null;
        /* the edge of the reveal, in % of the line's width, with a soft run-off behind it */
        const edge = p * (100 + TITLE.soft);
        const mask = `linear-gradient(to right, black ${(edge - TITLE.soft).toFixed(2)}%, transparent ${edge.toFixed(2)}%)`;
        return (
          <div key={text} style={{ position: "absolute", left: 0, width: theme.canvas.width, top: TITLE.y[i] - (TITLE.size * TITLE.leading) / 2, height: TITLE.size * TITLE.leading, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ fontFamily: theme.text.family, fontSize: TITLE.size, fontWeight: TITLE.weight, lineHeight: TITLE.leading, color: c.indigo, whiteSpace: "nowrap", WebkitMaskImage: mask, maskImage: mask }}>{text}</span>
          </div>
        );
      })}
    </>
  );
};

export const PassiveIncomeFull = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
      <OffthreadVideo src={staticFile("essentials/Intro.mp4")} />
      <PaletteProvider>
        <IntroTitle />
      </PaletteProvider>
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
