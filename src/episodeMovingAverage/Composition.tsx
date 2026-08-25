/**
 * Composition — "Moving Averages & Bollinger Bands".
 *
 * 14 scenes, 8895 frames (04:56.50). Every `from` and `duration` below is
 * VO-LOCKED: it comes from the corrected SRT of the actual recording and is
 * never recomputed from word count. The scenes TILE — each runs until the next
 * begins — so there is no frame the episode does not own.
 *
 *   8271 + 624 = 8895. That equality is the whole timing contract.
 *
 * THREE CONTINUITY GROUPS, each a single spanning Sequence, with their member
 * scenes rendering INSIDE them and never also at top level. In all three one
 * element has to survive a boundary the script runs straight through:
 *
 *   CG-A   715 → 2381   SC02 + SC03 + SC04   the line SC02 builds out of the
 *                                     noise is the same line SC03 renames
 *                                     MA20 — and the same CANDLES SC04 then
 *                                     draws SMA and EMA on. SC04 used to be a
 *                                     separate scene with its own chart behind
 *                                     a camera cut; folding it in is what lets
 *                                     the two KINDS of average be shown on the
 *                                     average the viewer already knows.
 *   CG-B  4140 → 5366   SC08 + SC09   the bands keep breathing; SC09's squeeze
 *                                     is a stretch of SC08's demonstration
 *   CG-C  6645 → 8271   SC12A + 12B   the reveal mask lifts across the join —
 *                                     the question is asked on one side and
 *                                     answered on the other, same chart
 *
 * ONE ROOT <Audio>. The VO is a single file mounted here; no scene has audio.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { ExplainerGroup } from "./continuity/ExplainerGroup";
import { Scene05 } from "./scenes/Scene05";
import { BandsGroup } from "./continuity/BandsGroup";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { GgrmGroup } from "./continuity/GgrmGroup";
import { Scene13 } from "./scenes/Scene13";
import { SceneRoadmap } from "./scenes/SceneRoadmap";
import { TitleChip } from "./components/TitleChip";
import { CUTS, cutOutStyle } from "./transitions/CameraCut";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Watermark";

export const TOTAL_FRAMES = 8982;

type Mounted = {
  from: number;
  duration: number;
  Component: React.FC;
  /** Timeline label in Studio. Only where the component name is not enough. */
  name?: string;
};

/** Everything that is not inside a continuity group. */
const INDEPENDENT_SCENES: Mounted[] = [
  /* SC05 runs through what used to be SC06: support and resistance are read
     off the same series it has been scrolling, so the chart stays mounted and
     the window travels back to the uptrend rather than a new chart arriving. */
  /* SC05 runs THROUGH SC07's span: the crossing scene is drawn on SC05's own
     candles, so the chart is mounted once, here, and zooms out at 3547 rather
     than being replaced. SC07 is mounted on top of it for its heading and its
     text, and owns no chart of its own any more. */
  { from: 2381, duration: 1846, Component: Scene05 },
  { from: 5453, duration: 633, Component: Scene10 },
  { from: 6086, duration: 646, Component: Scene11 },
  { from: 8358, duration: 624, Component: Scene13 },
];

/** Runs of scenes that share one element across an internal boundary. */
const CONTINUITY_GROUPS: Mounted[] = [
  { from: 626, duration: 1755, Component: ExplainerGroup },
  { from: 4227, duration: 1226, Component: BandsGroup },
  { from: 6732, duration: 1626, Component: GgrmGroup },
];

/**
 * ═══ THE TWO THAT DISSOLVE ═══
 *
 * The roadmap opens the episode and closes the moving-average chapter, and
 * both times it leaves the same way: the camera pushes into one of its cards
 * and the whole frame FADES, revealing the scene that has already started
 * drawing underneath.
 *
 * That only works if these two are ABOVE the tiling. Mounted in their natural
 * place, the incoming scene would be over them — there would be nothing for
 * the fade to reveal and each hand-off would be a hard cut. So they are
 * rendered last, and they overlap the scene they hand to on purpose:
 *
 *   SC01     0 → 681    dissolves onto CG-A, which opens at 626
 *   Daftar Isi  4160 → 4251   dissolves onto CG-B, which opens at 4227
 */
const DISSOLVE_OVER: Mounted[] = [
  { from: 0, duration: 681, Component: Scene01 },
  { from: 4160, duration: 91, Component: SceneRoadmap, name: "Daftar Isi" },
];

/**
 * The hoisted heading. It reads its OWN frames, which start at 607, and it
 * leaves on the cut at 2324 rather than simply unmounting there — the heading
 * changes at that boundary, so it has to be carried out by the same move that
 * carries everything else, not blink off while the rest of the frame slides.
 */
const TITLE_FROM = 626;
const RunTitle = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        ...cutOutStyle(f + TITLE_FROM, CUTS.toReading),
      }}
    >
      <TitleChip text="Moving Average" f={f} at={0} />
    </div>
  );
};

export const MovingAverageComposition = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    {[...INDEPENDENT_SCENES, ...CONTINUITY_GROUPS].map(
      ({ from, duration, Component }) => (
        <Sequence
          key={`${from}-${Component.name}`}
          from={from}
          durationInFrames={duration}
        >
          <Component />
        </Sequence>
      ),
    )}

    {/*
      THE HOISTED HEADING. "Moving Average" belongs to CG-A *and* to SC04, and
      the boundary between them at 1765 is a camera cut — so if each scene
      mounted its own, the viewer would watch one heading leave and an
      identical one arrive. Mounted here it simply stays put while the cut
      moves everything else.
    */}
    <Sequence from={TITLE_FROM} durationInFrames={2384 - TITLE_FROM}>
      <RunTitle />
    </Sequence>

    {/* the two that dissolve, over everything — see DISSOLVE_OVER */}
    {DISSOLVE_OVER.map(({ from, duration, Component, name }) => (
      <Sequence
        key={`${from}-${Component.name}`}
        from={from}
        durationInFrames={duration}
        name={name}
      >
        <Component />
      </Sequence>
    ))}

    <Captions />
    <Watermark />

    {/* the episode's one voice */}
    <Audio src={staticFile("vo/moving-average.mp3")} />
  </AbsoluteFill>
);
