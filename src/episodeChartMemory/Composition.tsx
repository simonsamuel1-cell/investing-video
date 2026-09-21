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

export const TOTAL_FRAMES = 7769; // 04:18.97 @30fps — VO-LOCKED, plus four inserts

// Recorded VO: public/vo/chart-memory.mp3 ("VIDEO 01 - Chart.MP3"), 259.08s =
// 7769 frames. Every from/duration below and every scene-local beat is now
// derived from VIDEO_01_-_Chart_fixed.srt (106 cues) — not a wpm estimate.
//
// ⚠ FOUR PASSAGES WERE CUT IN, and every number after each one moved. Simon
// first gave the cuts as timecodes on the finished film — 487, 2482, 3714,
// 5187 — and each landed two to six frames short of a scene change. He then
// asked for them ON the change, which is what they are now:
//
//   cut at 489  +244f  "Tapi sebenarnya, kita nggak perlu memahami semuanya…"
//   cut at 2486 +302f  "Ya, jadi kita sudah punya dasar untuk membaca chart…"
//   cut at 3720 +290f  "Sampai di sini, kita sudah melihat bahwa satu saham…"
//   cut at 5192 +327f  "Sekarang kita sudah melihat bagaimana chart merekam…"
//
// ⚠ AND THE SCENE TABLE BELOW DID NOT CHANGE WHEN THEY MOVED. Each cut stayed
// inside the same scene and each scene grows by the same amount, so every
// boundary lands on the frame it already had. Only the audio and the cues
// shifted, by those two to six frames. Nothing inside a scene was ever
// retimed — only the boundaries, the two SlideCut frames, and phase D.
//
// The outgoing scene HOLDS through each window: a cut on the boundary is the
// last frame of what you were watching, not the first of what comes next.
//
// The audio was rebuilt sample-exact: 44100/30 = 1470 samples per frame, so
// every cut falls on a whole frame and each passage is padded with a few
// milliseconds of silence to fill its window exactly. Verified by correlating
// each inserted passage and each resumption against its source — r > 0.9998,
// lag 0. The previous track is kept as vo/chart-memory.pre-extend.mp3.
const HAS_VO = true;

/**
 * Brand watermark — a full-frame transparent PNG whose mark sits at
 * x 1538–1853, y 45–142, i.e. inside the 360×150 top-right clear zone every
 * scene already keeps empty. Drawn at full strength, and faded at both ends so
 * it doesn't pop on the first frame.
 */
const WATERMARK = { fade: 12, opacity: 1 };

const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 733, Component: Scene01 }, // 489 + 244 (cut 1 holds here)
  // SC02–SC05 → ChartContinuity (spanning Sequence below), 733–3554
  { from: 3554, duration: 1002, Component: Scene06 }, // 712 + 290 (cut 3)
  { from: 4556, duration: 752, Component: Scene07 },
  { from: 5308, duration: 1047, Component: Scene08 }, // 720 + 327 (cut 4)
  { from: 6355, duration: 754, Component: Scene09 },
  { from: 7109, duration: 660, Component: Scene10 },
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
    <Sequence from={733} durationInFrames={2821}>
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
