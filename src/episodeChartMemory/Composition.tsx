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
import { AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { ChartContinuity } from "./continuity/ChartContinuity";
import { Scene01 } from "./scenes/Scene01";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Subtitles } from "./components/Subtitles";
import { PaletteProvider, usePalette } from "./palette";
import { SUBTITLES, type SubtitleCue } from "./subtitles";

export const TOTAL_FRAMES = 6606; // 03:40.10 @30fps — VO-LOCKED (§8 recalibration applied)

// Recorded VO: public/vo/chart-memory.mp3 ("VIDEO 01 - Chart.MP3"), 220.32s =
// 6606 frames. Every from/duration below and every scene-local beat is now
// derived from VIDEO_01_-_Chart_fixed.srt (106 cues) — not a wpm estimate.
const HAS_VO = true;

/**
 * Brand watermark — a full-frame transparent PNG whose mark sits at
 * x 1538–1853, y 45–142, i.e. inside the 360×150 top-right clear zone every
 * scene already keeps empty. Drawn at full strength, and faded at both ends so
 * it doesn't pop on the first frame.
 */
const WATERMARK = { fade: 12, opacity: 1 };

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

/** Wraps the tree so every component can read the frame's palette. */
export const ChartMemoryComposition = (props: ChartMemoryProps) => (
  <PaletteProvider>
    <Episode {...props} />
  </PaletteProvider>
);

const Episode = ({
  subtitles = SUBTITLES,
  audioSrc = "vo/chart-memory.mp3",
  showSubtitles = true,
  muted = false,
}: ChartMemoryProps) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const watermarkOpacity =
    interpolate(
      f,
      [0, WATERMARK.fade, TOTAL_FRAMES - WATERMARK.fade, TOTAL_FRAMES],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ) * WATERMARK.opacity;
  return (
  <AbsoluteFill style={{ backgroundColor: pal.bg, fontFamily: theme.type.family }}>
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

    {/* Brand watermark — above everything, present for the whole episode. */}
    <AbsoluteFill style={{ opacity: watermarkOpacity, zIndex: 100 }}>
      <Img src={staticFile("watermark.png")} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>

    {HAS_VO && <Audio src={staticFile(audioSrc)} muted={muted} />}
  </AbsoluteFill>
  );
};
