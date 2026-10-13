/**
 * core/EpisodeWrap.tsx — the finished-video wrapper every VI episode shares: Intro (Essentials/Intro.mp4 with
 * the two title lines), the episode, a half-second fade-out to the paper colour, Outro, and the BGM under all.
 *
 * Lifted from VI01's FullVideo.tsx so VI03 on don't copy it. The episode keeps its own frame numbers; it is
 * simply mounted INTRO_FRAMES later.
 *
 * ⚠ THE BGM AND THE LOGO ARE UNTOUCHABLE (Simon): public/essentials/BGM.mp3 is a byte-for-byte copy of
 * Simon's BGM — no trim, gain, fade, loop or re-encode; it plays from frame 0 and stops where the video ends.
 */
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { progressInOut } from "./helpers";
import { PaletteProvider, usePalette } from "./palette";
import { theme } from "./theme";
import { useMotion } from "./useMotion";

/** Intro.mp4 — 4.000 s at 60 fps. */
export const INTRO_FRAMES = 240;
/** Outro.mp4 — 3.983 s at 60 fps. */
export const OUTRO_FRAMES = 239;

/**
 * The Intro's two title lines (series over episode), after MovingAverageIntro.mp4: centred, revealed left to
 * right behind a soft edge, the second line 12 frames behind the first — measured off that video.
 */
const TITLE = { starts: [71, 83], span: 26, y: [698, 764], size: 56, weight: 600, soft: 28, leading: 1.4 };

const IntroTitle = ({ lines }: { lines: [string, string] }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  return (
    <>
      {lines.map((text, i) => {
        const p = progressInOut(f, TITLE.starts[i], TITLE.span);
        if (p <= 0.001) return null;
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

const FADE_OUT_SECS = 0.5;
const EpisodeFade = ({ frames }: { frames: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const o = progressInOut(f, frames - m.sec(FADE_OUT_SECS), m.sec(FADE_OUT_SECS));
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: c.bg, opacity: o }} />;
};

export const fullFrames = (episodeFrames: number) => INTRO_FRAMES + episodeFrames + OUTRO_FRAMES;

export const EpisodeWrap = ({ title, frames, name, children }: { title: [string, string]; frames: number; name: string; children: React.ReactNode }) => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
      <OffthreadVideo src={staticFile("essentials/Intro.mp4")} />
      <PaletteProvider>
        <IntroTitle lines={title} />
      </PaletteProvider>
    </Sequence>
    <Sequence from={INTRO_FRAMES} durationInFrames={frames} name={name}>
      {children}
      <PaletteProvider>
        <EpisodeFade frames={frames} />
      </PaletteProvider>
    </Sequence>
    <Sequence from={INTRO_FRAMES + frames} durationInFrames={OUTRO_FRAMES} name="Outro">
      <OffthreadVideo src={staticFile("essentials/Outro.mp4")} />
    </Sequence>
    {/* the BGM, as it is, under all of it */}
    <Audio src={staticFile("essentials/BGM.mp3")} />
  </AbsoluteFill>
);
