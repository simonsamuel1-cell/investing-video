/**
 * Composition — "Market Structure", second build.
 *
 * 20 scenes, 10.586 frames. Every `from` and `duration` is VO-locked and taken
 * verbatim from the build spec's timing table — never recomputed from word
 * count. The scenes TILE: each runs until the next one starts, so there is no
 * frame the episode does not own. The voice ends at 10.526; the final 60 frames
 * are the outro hold inside SC20.
 *
 * TWO continuity groups, each a single spanning Sequence, with their member
 * scenes rendering INSIDE them and never at top level. In both cases one chart
 * has to survive a boundary the script runs straight through:
 *
 *   CG-A  1965 → 3042   SC05 + SC06   the staircase SC06 puts numbers on
 *   CG-B  6851 → 7666   SC14 + SC15   the line that stops below the reference
 *                                     and holds there until SC15 resumes it
 *
 * Mounting either half separately would remount its chart and restart the line,
 * which would quietly undo the argument those scenes are making.
 *
 * [NEEDS ASSET] The recorded VO is staged at public/vo-market-structure.mp3.
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
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Watermark";
import { CUES, type Cue } from "./subtitles";

export const TOTAL_FRAMES = 10586;

type Mounted = { from: number; duration: number; Component: React.FC };

/** Everything except CG-A's and CG-B's member scenes. */
const INDEPENDENT_SCENES: Mounted[] = [
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

const CONTINUITY_GROUPS: Mounted[] = [
  { from: 1965, duration: 1077, Component: StaircaseGroup },
  { from: 6851, duration: 815, Component: FailedPeakGroup },
];

export type MarketStructureProps = {
  cues?: Cue[];
  audioSrc?: string;
  showCaptions?: boolean;
  muted?: boolean;
};

export const MarketStructureComposition = ({
  cues = CUES,
  audioSrc = "vo-market-structure.mp3",
  showCaptions = true,
  muted = false,
}: MarketStructureProps) => (
  <AbsoluteFill style={{ backgroundColor: theme.color.bg, fontFamily: theme.text.family }}>
    {[...INDEPENDENT_SCENES, ...CONTINUITY_GROUPS].map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* Burned-in captions, inside the reserved band and nowhere else. */}
    {showCaptions && <Captions cues={cues} />}

    {/* Brand watermark — above everything, including the captions. */}
    <Watermark />

    {/* ONE root Audio for the whole episode, aligned at frame 0. */}
    <Audio src={staticFile(audioSrc)} muted={muted} />
  </AbsoluteFill>
);
