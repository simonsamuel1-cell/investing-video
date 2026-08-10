/**
 * Composition — "Market Structure".
 *
 * 20 scenes, 10.534 frames (05:51.04). Every `from` and `duration` below comes
 * from the approved ideation doc, which took them from the corrected SRT — not
 * from a words-per-minute estimate. The scenes TILE: each one runs until the
 * next one starts, so there is no frame the episode does not own.
 *
 * Two departures from the doc's own numbers, both deliberate:
 *   · SC01 starts at 0 rather than 2, so the episode opens on a drawn frame
 *     instead of two blank ones. Its beats are therefore the doc's L + 2.
 *   · SC20 runs to 10.534 rather than 10.526. The recording is 351,14s and the
 *     last cue ends at 10.526; the extra 8 frames are the VO's own tail, and
 *     cutting there would clip it.
 *
 * THREE continuity groups. These are single spanning Sequences, not scenes,
 * because in each case one chart has to survive a boundary the script runs
 * straight through:
 *   · 1965–3042  SC05 + SC06 — the staircase SC06 puts numbers on
 *   · 5855–6851  SC12 + SC13 — the level that re-tints instead of re-drawing
 *   · 6851–7666  SC14 + SC15 — the line that STOPS below the reference and
 *                              waits there for the next scene to resume it
 * Mounting either half as its own scene would remount the chart and quietly
 * undo the argument the scene is making.
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { StaircaseContinuity } from "./continuity/StaircaseContinuity";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { LevelContinuity } from "./continuity/LevelContinuity";
import { WarningContinuity } from "./continuity/WarningContinuity";
import { Scene16 } from "./scenes/Scene16";
import { Scene17 } from "./scenes/Scene17";
import { Scene18 } from "./scenes/Scene18";
import { Scene19 } from "./scenes/Scene19";
import { Scene20 } from "./scenes/Scene20";
import { Subtitles } from "./components/Subtitles";
import { PaletteProvider, usePalette } from "./palette";
import { SUBTITLES, type SubtitleCue } from "./subtitles";

export const TOTAL_FRAMES = 10534; // 05:51.04 @30fps — VO-LOCKED

/** Recorded VO: public/vo/market-structure.mp3 ("VO Market Structure.mp3"), 351,14s. */
const HAS_VO = true;

/**
 * Brand watermark — the full-frame transparent PNG whose mark sits inside the
 * 360×150 top-right clear zone every scene keeps empty. Listed in the ideation
 * doc's asset map as present in all scenes.
 */
const WATERMARK = { fade: 12, opacity: 1 };

const SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 462, Component: Scene01 },
  { from: 462, duration: 466, Component: Scene02 },
  { from: 928, duration: 522, Component: Scene03 },
  { from: 1450, duration: 515, Component: Scene04 },
  { from: 1965, duration: 1077, Component: StaircaseContinuity }, // SC05 + SC06
  { from: 3042, duration: 466, Component: Scene07 },
  { from: 3508, duration: 406, Component: Scene08 },
  { from: 3914, duration: 488, Component: Scene09 },
  { from: 4402, duration: 810, Component: Scene10 },
  { from: 5212, duration: 643, Component: Scene11 },
  { from: 5855, duration: 996, Component: LevelContinuity }, // SC12 + SC13
  { from: 6851, duration: 815, Component: WarningContinuity }, // SC14 + SC15
  { from: 7666, duration: 542, Component: Scene16 },
  { from: 8208, duration: 347, Component: Scene17 },
  { from: 8555, duration: 1055, Component: Scene18 },
  { from: 9610, duration: 512, Component: Scene19 },
  { from: 10122, duration: 412, Component: Scene20 },
];

/**
 * Props exist so a SECOND composition can reuse this component with its own
 * subtitle track and voice-over. Every scene is shared — editing a visual
 * changes both compositions.
 */
export type MarketStructureProps = {
  subtitles?: SubtitleCue[];
  audioSrc?: string;
  showSubtitles?: boolean;
  muted?: boolean;
};

/** Wraps the tree so every component can read the frame's palette. */
export const MarketStructureComposition = (props: MarketStructureProps) => (
  <PaletteProvider>
    <Episode {...props} />
  </PaletteProvider>
);

const Episode = ({
  subtitles = SUBTITLES,
  audioSrc = "vo/market-structure.mp3",
  showSubtitles = true,
  muted = false,
}: MarketStructureProps) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const watermarkOpacity =
    interpolate(f, [0, WATERMARK.fade, TOTAL_FRAMES - WATERMARK.fade, TOTAL_FRAMES], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * WATERMARK.opacity;

  return (
    <AbsoluteFill style={{ backgroundColor: pal.bg, fontFamily: theme.type.family }}>
      {SCENES.map(({ from, duration, Component }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <Component />
        </Sequence>
      ))}

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
