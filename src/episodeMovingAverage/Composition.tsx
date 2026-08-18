/**
 * Composition — "Technical Analysis: Moving Averages & Bollinger Bands".
 *
 * 14 scenes, 8900 frames (04:56.67). Every `from` and `duration` below is
 * VO-LOCKED: it comes from the corrected SRT of the actual recording, verbatim
 * from the build spec's master table, and is never recomputed from word count.
 * The scenes TILE — each runs until the next one starts — so there is no frame
 * the episode does not own.
 *
 *   8318 + 582 = 8900. That equality is the whole timing contract.
 *
 * THREE CONTINUITY GROUPS, each a single spanning Sequence, with their member
 * scenes rendering INSIDE them and never also at top level. In all three cases
 * one element has to survive a boundary the script runs straight through:
 *
 *   CG-A   659 → 1839   SC02 + SC03   the line SC02 builds out of a window is
 *                                     the same line SC03 renames MA20
 *   CG-B  4134 → 5439   SC08 + SC09   the bands keep breathing; SC09's squeeze
 *                                     is a stretch of SC08's own demonstration
 *   CG-C  6670 → 8318   SC12A + 12B   the reveal mask lifts across the join —
 *                                     the question is asked on one side of it
 *                                     and answered on the other, same chart,
 *                                     same scales, no re-fit
 *
 * ONE ROOT <Audio>. The VO is a single file mounted here; no scene has audio.
 *
 * The subtitle band is the bottom 108px and every scene keeps it clear;
 * `Captions` is the only thing that renders there.
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { ExplainerGroup } from "./continuity/ExplainerGroup";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { BandsGroup } from "./continuity/BandsGroup";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { GgrmGroup } from "./continuity/GgrmGroup";
import { Scene13 } from "./scenes/Scene13";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Watermark";

export const TOTAL_FRAMES = 8900;

type Mounted = { from: number; duration: number; Component: React.FC };

/** Everything that is not inside a continuity group. */
const INDEPENDENT_SCENES: Mounted[] = [
  { from: 0, duration: 659, Component: Scene01 },
  { from: 1839, duration: 467, Component: Scene04 },
  { from: 2306, duration: 576, Component: Scene05 },
  { from: 2882, duration: 562, Component: Scene06 },
  { from: 3444, duration: 690, Component: Scene07 },
  { from: 5439, duration: 595, Component: Scene10 },
  { from: 6034, duration: 636, Component: Scene11 },
  { from: 8318, duration: 582, Component: Scene13 },
];

/** Runs of scenes that share one element across an internal boundary. */
const CONTINUITY_GROUPS: Mounted[] = [
  { from: 659, duration: 1180, Component: ExplainerGroup },
  { from: 4134, duration: 1305, Component: BandsGroup },
  { from: 6670, duration: 1648, Component: GgrmGroup },
];

export const MovingAverageComposition = () => (
  <AbsoluteFill style={{ backgroundColor: theme.color.bg }}>
    {[...INDEPENDENT_SCENES, ...CONTINUITY_GROUPS].map(({ from, duration, Component }) => (
      <Sequence key={`${from}-${Component.name}`} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    <Captions />
    <Watermark />

    {/* the episode's one voice */}
    <Audio src={staticFile("vo/moving-average.mp3")} />
  </AbsoluteFill>
);
