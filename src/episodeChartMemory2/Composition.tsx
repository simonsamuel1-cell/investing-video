/**
 * ChartMemory2 — an INDEPENDENT copy of the ChartMemory episode, forked at
 * commit 2dca154. Everything it uses lives under src/episodeChartMemory2/:
 * editing a scene here does not touch the original, and vice versa. Shared
 * only: the files in public/ (voice-over, images).
 *
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
import { SUBTITLES, type SubtitleCue } from "./subtitles";

export const TOTAL_FRAMES = 6606; // 03:40.10 @30fps — VO-LOCKED (§8 recalibration applied)

// Recorded VO: public/vo/chart-memory.mp3 ("VIDEO 01 - Chart.MP3"), 220.32s =
// 6606 frames. Every from/duration below and every scene-local beat is now
// derived from VIDEO_01_-_Chart_fixed.srt (106 cues) — not a wpm estimate.
const HAS_VO = true;

const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 489, Component: Scene01 },
  // SC02–SC05 → ChartContinuity (spanning Sequence below), 489–3008
  { from: 3008, duration: 712, Component: Scene06 },
  { from: 3720, duration: 752, Component: Scene07 },
  { from: 4472, duration: 720, Component: Scene08 },
  { from: 5192, duration: 754, Component: Scene09 },
  { from: 5946, duration: 660, Component: Scene10 },
];

/**
 * Props exist so a SECOND composition can reuse this same component with its
 * own subtitle track and voice-over. Every scene is shared — editing a visual
 * changes both compositions.
 */
export type ChartMemoryProps = {
  subtitles?: SubtitleCue[];
  audioSrc?: string;
  showSubtitles?: boolean;
  muted?: boolean;
};

export const ChartMemoryComposition = ({
  subtitles = SUBTITLES,
  audioSrc = "vo/chart-memory.mp3",
  showSubtitles = true,
  muted = false,
}: ChartMemoryProps) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family }}>
    {INDEPENDENT_SCENES.map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* SC02 → SC05: ONE chart element, four phases, zero remounts. */}
    <Sequence from={489} durationInFrames={2519}>
      <ChartContinuity />
    </Sequence>

    {/* Burned-in subtitles live in the reserved bottom band. */}
    {showSubtitles && <Subtitles cues={subtitles} />}

    {HAS_VO && <Audio src={staticFile(audioSrc)} muted={muted} />}
  </AbsoluteFill>
);
