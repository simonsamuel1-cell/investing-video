/**
 * Composition — 13 independent scenes + the ClosingChart continuity group
 * (SC14–16 as gated windows inside one spanning Sequence). One root <Audio>.
 * Spec length 8986 frames + a 600-frame (20s) tail = 9596 total. The closing
 * scene + logo fade out at 8995; frames 8995→9596 are a blank/silent tail.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { Scene12 } from "./scenes/Scene12";
import { Scene13 } from "./scenes/Scene13";
import { ClosingChart } from "./continuity/ClosingChart";
import { CaseStudyTabs } from "./components/CaseStudyTabs";
import { CTX_RECT } from "./components/CaseStudyScene";
import { Subtitles } from "./components/Subtitles";

const TAIL_CARD_FROM = 9000; // static end-card (frozen SC09 layout, empty right chart)
const TAIL_CARD_FREEZE = 4980 - 4158; // 822 → SC09-local frame for the frame-4980 collapsed state

const TAIL_FRAMES = 600; // 20s @30fps of blank tail after the closing scene
export const TOTAL_FRAMES = 8996 + TAIL_FRAMES; // 9596
const CLOSING_FROM = 8367; // ClosingChart start
const CLOSING_END = 8995; // closing scene (and logo) finish fading out here

const FADE = 12; // every scene fades in at its start and out at its end

/** Fades its scene in over the first FADE frames and out over the last FADE frames. */
const SceneFade: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 240, Component: Scene01 },
  { from: 240, duration: 374, Component: Scene02 },
  { from: 614, duration: 460, Component: Scene03 },
  { from: 1074, duration: 507, Component: Scene04 }, // extended to frame 1580
  { from: 1581, duration: 764, Component: Scene05 },
  { from: 2345, duration: 808, Component: Scene06 },
  { from: 3153, duration: 504, Component: Scene07 },
  { from: 3657, duration: 501, Component: Scene08 },
  { from: 4158, duration: 921, Component: Scene09 },
  { from: 5079, duration: 978, Component: Scene10 },
  { from: 6057, duration: 869, Component: Scene11 },
  { from: 6926, duration: 840, Component: Scene12 },
  { from: 7766, duration: 601, Component: Scene13 },
];

export const CandlestickComposition = () => {
  const f = useCurrentFrame();
  // Fade content out with the closing scene at 8995 (subtitles).
  const endFade = interpolate(f, [CLOSING_END - FADE, CLOSING_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The watermark fades in at the very start and out at the very end of the whole video.
  const watermarkFade = interpolate(f, [0, FADE, TOTAL_FRAMES - FADE, TOTAL_FRAMES], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family }}>
    {INDEPENDENT_SCENES.map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <SceneFade durationInFrames={duration}>
          <Component />
        </SceneFade>
      </Sequence>
    ))}
    {/* Persistent case-study tab header across SC09–SC12 (outside the scene fades). */}
    <Sequence from={4158} durationInFrames={7766 - 4158}>
      <CaseStudyTabs />
    </Sequence>
    <Sequence from={CLOSING_FROM} durationInFrames={CLOSING_END - CLOSING_FROM}>
      <SceneFade durationInFrames={CLOSING_END - CLOSING_FROM}>
        <ClosingChart />
      </SceneFade>
    </Sequence>
    {/* Static end-card from frame 9000: SC09's collapsed layout frozen, right chart
        emptied, header re-shown (frozen). No animation; fades out at the very end. */}
    {f >= TAIL_CARD_FROM && (
      <AbsoluteFill style={{ opacity: watermarkFade }}>
        {/* the 2 charts, moved down 20px */}
        <AbsoluteFill style={{ transform: "translateY(20px)" }}>
          <Freeze frame={TAIL_CARD_FREEZE}>
            <Scene09 />
          </Freeze>
          {/* empty the right chart — redraw its panel over the frozen content */}
          <div
            style={{
              position: "absolute",
              left: CTX_RECT.x,
              top: CTX_RECT.y,
              width: CTX_RECT.w,
              height: CTX_RECT.h,
              background: theme.colors.neutralFill,
              border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
              borderRadius: theme.radius.panel,
            }}
          />
        </AbsoluteFill>
        {/* header shifted up to make room for the section title (tail card only) */}
        <AbsoluteFill style={{ transform: "translateY(-22px)" }}>
          <Freeze frame={TAIL_CARD_FREEZE}>
            <CaseStudyTabs />
          </Freeze>
        </AbsoluteFill>
        {/* section title — left-aligned to the left chart, moved down 20px (9000 only) */}
        <div
          style={{
            position: "absolute",
            left: 194,
            top: 186,
            fontFamily: theme.type.family,
            fontSize: 36,
            fontWeight: 600,
            color: theme.colors.indigo,
          }}
        >
          Use cases of candlestick patterns
        </div>
      </AbsoluteFill>
    )}
    {/* Full-frame brand watermark (1920×1080) — centered; fades in at the video's
        start and out at its end (whole episode, incl. the tail). */}
    <AbsoluteFill style={{ opacity: watermarkFade, alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile("watermark.png")} style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </AbsoluteFill>
    {/* Burned-in subtitles — active SRT cue in the bottom band, whole episode
        (fades out with the closing scene at 8995). */}
    <div style={{ opacity: endFade }}>
      <Subtitles />
    </div>
    <Audio src={staticFile("vo.mp3")} />
  </AbsoluteFill>
  );
};
