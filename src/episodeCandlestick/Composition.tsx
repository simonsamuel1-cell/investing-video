/**
 * Composition — 13 independent scenes + the ClosingChart continuity group
 * (SC14–16 as gated windows inside one spanning Sequence). One root <Audio>.
 * Spec length 8986 frames + 10 frames extended from the last frame = 8996.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
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

const EXTEND_FRAMES = 10; // hold extended from the final frame (user request)
export const TOTAL_FRAMES = 8986 + EXTEND_FRAMES; // 8996

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

export const CandlestickComposition = () => (
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
    <Sequence from={8367} durationInFrames={619 + EXTEND_FRAMES}>
      <SceneFade durationInFrames={619 + EXTEND_FRAMES}>
        <ClosingChart />
      </SceneFade>
    </Sequence>
    <Audio src={staticFile("vo.mp3")} />
  </AbsoluteFill>
);
