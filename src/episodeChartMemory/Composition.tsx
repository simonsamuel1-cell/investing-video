/**
 * Composition — "Technical Analysis: The Chart is the Market's Memory".
 * 10 scenes, 5400 frames (03:00.00). SC02–SC05 do NOT sit in INDEPENDENT_SCENES:
 * they live inside the single spanning ChartContinuity Sequence (390–2490) so
 * the chart element transforms across them without ever remounting.
 *
 * NOTE: every from/duration here is a 160 wpm ESTIMATE. §8 recalibration will
 * retime these against the recorded VO and cascade the downstream values.
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { theme } from "./theme";
import { ChartContinuity } from "./continuity/ChartContinuity";
import { Scene01 } from "./scenes/Scene01";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Subtitles } from "./components/Subtitles";

export const TOTAL_FRAMES = 5400; // 03:00.00 @30fps (provisional — see §8)

// Recorded VO: public/vo/chart-memory.mp3 ("The first time.wav"), 170.02s =
// ~5101 frames. NOTE: that is ~299 frames SHORT of TOTAL_FRAMES, and the scene
// from/duration values below are still 160 wpm estimates — the §8 recalibration
// pass is what aligns the beats to this audio.
const HAS_VO = true;

const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 390, Component: Scene01 },
  // SC02–SC05 → ChartContinuity (spanning Sequence below)
  { from: 2490, duration: 660, Component: Scene06 },
  { from: 3150, duration: 600, Component: Scene07 },
  { from: 3750, duration: 600, Component: Scene08 },
  { from: 4350, duration: 600, Component: Scene09 },
  { from: 4950, duration: 450, Component: Scene10 },
];

export const ChartMemoryComposition = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family }}>
    {INDEPENDENT_SCENES.map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* SC02 → SC05: ONE chart element, four phases, zero remounts. */}
    <Sequence from={390} durationInFrames={2100}>
      <ChartContinuity />
    </Sequence>

    {/* Burned-in subtitles live in the reserved bottom band. */}
    <Subtitles />

    {HAS_VO && <Audio src={staticFile("vo/chart-memory.mp3")} />}
  </AbsoluteFill>
);
