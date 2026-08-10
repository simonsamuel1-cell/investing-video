/**
 * Composition — "Market Structure".
 *
 * 20 scenes, 10.586 frames. Every `from` and `duration` below is VO-locked and
 * taken verbatim from the build spec's timing table — never recomputed from
 * word count. The scenes TILE: each runs until the next one starts, so there is
 * no frame the episode does not own. The VO ends at 10.526; the last 60 frames
 * are the outro hold inside SC20.
 *
 * TWO continuity groups, each a single spanning Sequence. Their member scenes
 * render INSIDE them and are never mounted at top level, because in each case
 * one chart has to survive a boundary the script runs straight through:
 *   CG-A  1965–3042  SC05 + SC06 — the staircase SC06 puts numbers on
 *   CG-B  6851–7666  SC14 + SC15 — the line that stops below the reference and
 *                                  holds there until SC15 resumes it
 * Mounting either half separately would remount the chart and quietly undo the
 * argument those scenes are making.
 *
 * `[NEEDS ASSET]` The recorded VO is staged at public/vo-market-structure.mp3.
 * The other two open items are flagged where they bite: data/asii.ts (SC18's
 * CSV) and components/AppSummaryPanel.tsx (SC17's screen recording).
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { StaircaseGroup } from "./continuity/StaircaseGroup";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { Scene12 } from "./scenes/Scene12";
import { Scene13 } from "./scenes/Scene13";
import { FailedPeakGroup } from "./continuity/FailedPeakGroup";
import { Scene16 } from "./scenes/Scene16";
import { Scene17 } from "./scenes/Scene17";
import { Scene18 } from "./scenes/Scene18";
import { Scene19 } from "./scenes/Scene19";
import { Scene20 } from "./scenes/Scene20";
import { Subtitles } from "./components/Subtitles";
import { SUBTITLES, type SubtitleCue } from "./subtitles";

export const TOTAL_FRAMES = 10586;

/** Independent scenes — everything except CG-A's and CG-B's members. */
const INDEPENDENT_SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 462, Component: Scene01 },
  { from: 462, duration: 466, Component: Scene02 },
  { from: 928, duration: 522, Component: Scene03 },
  { from: 1450, duration: 515, Component: Scene04 },
  { from: 3042, duration: 466, Component: Scene07 },
  { from: 3508, duration: 406, Component: Scene08 },
  { from: 3914, duration: 488, Component: Scene09 },
  { from: 4402, duration: 810, Component: Scene10 },
  { from: 5212, duration: 643, Component: Scene11 },
  { from: 5855, duration: 496, Component: Scene12 },
  { from: 6351, duration: 500, Component: Scene13 },
  { from: 7666, duration: 542, Component: Scene16 },
  { from: 8208, duration: 347, Component: Scene17 },
  { from: 8555, duration: 1055, Component: Scene18 },
  { from: 9610, duration: 512, Component: Scene19 },
  { from: 10122, duration: 464, Component: Scene20 },
];

const CONTINUITY_GROUPS: { from: number; duration: number; Component: React.FC }[] = [
  { from: 1965, duration: 1077, Component: StaircaseGroup }, // CG-A: SC05 + SC06
  { from: 6851, duration: 815, Component: FailedPeakGroup }, // CG-B: SC14 + SC15
];

/**
 * Props exist so a second composition can reuse this component with its own
 * subtitle track, or render a clean plate with `showSubtitles={false}`.
 */
export type MarketStructureProps = {
  subtitles?: SubtitleCue[];
  audioSrc?: string;
  showSubtitles?: boolean;
  muted?: boolean;
};

export const MarketStructureComposition = ({
  subtitles = SUBTITLES,
  audioSrc = "vo-market-structure.mp3",
  showSubtitles = true,
  muted = false,
}: MarketStructureProps) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family }}>
    {[...INDEPENDENT_SCENES, ...CONTINUITY_GROUPS].map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* Burned-in subtitles, inside the reserved bottom band and nowhere else. */}
    {showSubtitles && <Subtitles cues={subtitles} />}

    {/* ONE root Audio for the whole episode, aligned at frame 0. */}
    <Audio src={staticFile(audioSrc)} muted={muted} />
  </AbsoluteFill>
);
