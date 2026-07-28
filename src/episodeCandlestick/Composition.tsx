/**
 * Composition — SC01–SC12 (unchanged) + SC13A–D and SC14A–C (extension) + the
 * ClosingChart continuity group (SC15–16 only). One root <Audio>.
 * durationInFrames = 10663 (05:55.13 @30fps).
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
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
import { Scene13A } from "./scenes/Scene13A";
import { Scene13B } from "./scenes/Scene13B";
import { Scene13C } from "./scenes/Scene13C";
import { Scene13D } from "./scenes/Scene13D";
import { ClosingChart } from "./continuity/ClosingChart";
import { CaseStudyTabs } from "./components/CaseStudyTabs";
import { CaseStudyTabsPair } from "./components/CaseStudyTabsPair";
import { Subtitles } from "./components/Subtitles";

export const TOTAL_FRAMES = 10663; // 05:55.13 @30fps

const FADE = 12; // every scene fades in at its start and out at its end

const SceneFade: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const INDEPENDENT_SCENES: {
  from: number;
  duration: number;
  Component: React.FC;
}[] = [
  { from: 0, duration: 240, Component: Scene01 },
  { from: 240, duration: 374, Component: Scene02 },
  { from: 614, duration: 460, Component: Scene03 },
  { from: 1074, duration: 483, Component: Scene04 },
  { from: 1557, duration: 788, Component: Scene05 },
  { from: 2345, duration: 808, Component: Scene06 },
  { from: 3153, duration: 504, Component: Scene07 },
  { from: 3657, duration: 501, Component: Scene08 },
  { from: 4158, duration: 921, Component: Scene09 },
  { from: 5079, duration: 978, Component: Scene10 },
  { from: 6057, duration: 869, Component: Scene11 },
  { from: 6926, duration: 847, Component: Scene12 },
  { from: 7773, duration: 242, Component: Scene13A },
  { from: 8015, duration: 418, Component: Scene13B },
  { from: 8433, duration: 401, Component: Scene13C },
  { from: 8834, duration: 210, Component: Scene13D },
  // 9044–10385 is the BBRI real-footage insert (see the video Sequence below).
];

export const CandlestickComposition = () => {
  const f = useCurrentFrame();
  const watermarkFade = interpolate(
    f,
    [0, FADE, TOTAL_FRAMES - FADE, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.type.family,
      }}
    >
      {INDEPENDENT_SCENES.map(({ from, duration, Component }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <SceneFade durationInFrames={duration}>
            <Component />
          </SceneFade>
        </Sequence>
      ))}
      {/* SC09–SC12 pattern tab header (unchanged). */}
      <Sequence from={4158} durationInFrames={7766 - 4158}>
        <CaseStudyTabs />
      </Sequence>
      {/* SC13B–SC13C header — 2-tab replica, persistent across both scenes. */}
      <Sequence from={8015} durationInFrames={819}>
        <CaseStudyTabsPair />
      </Sequence>
      {/* SC14 — BBRI real footage (portrait 980×1920, centered) replaces the built SC14A–C. */}
      <Sequence from={9044} durationInFrames={10386 - 9044}>
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center" }}>
          <OffthreadVideo src={staticFile("bbri.mp4")} muted style={{ height: "100%", width: "auto" }} />
        </AbsoluteFill>
      </Sequence>
      {/* Continuity group — SC15 (0–193) + SC16 (193–277). */}
      <Sequence from={10386} durationInFrames={277}>
        <SceneFade durationInFrames={277}>
          <ClosingChart />
        </SceneFade>
      </Sequence>
      {/* Burned-in subtitles (SRT covers SC01–12 only; extended SRT needed for SC13A+). */}
      <Subtitles />
      {/* Full-frame brand watermark — always on top; fades in at the start, out at the very end. */}
      <AbsoluteFill
        style={{
          opacity: watermarkFade,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Img src={staticFile("watermark.png")} style={{ maxWidth: "100%", maxHeight: "100%" }} />
      </AbsoluteFill>
      <Audio src={staticFile("vo.mp3")} />
    </AbsoluteFill>
  );
};
