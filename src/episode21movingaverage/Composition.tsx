/**
 * Composition — "Moving Average".
 *
 * [NEEDS ASSET] Script, SRT and ideation are still to come. Until they land
 * this mounts nothing: no scenes, no VO, no cues. It builds and it renders a
 * bare stage, which is the honest state of an episode that has not been
 * written yet.
 *
 * WHEN THE IDEATION ARRIVES, three things get filled in and nothing else has
 * to change:
 *
 *   1. TOTAL_FRAMES        the VO's own length, never recomputed from wpm
 *   2. INDEPENDENT_SCENES  one row per scene, `from` and `duration` verbatim
 *                          from the timing table
 *   3. CONTINUITY_GROUPS   any run of scenes that has to share ONE element
 *                          across a boundary — a chart that keeps panning, a
 *                          line that stops and resumes. Those mount as a single
 *                          spanning Sequence with their member scenes rendering
 *                          INSIDE them, never also at top level. Mounting a
 *                          member separately remounts its chart and restarts
 *                          its line, which quietly undoes the argument the
 *                          scenes are making together.
 *
 * The scenes TILE: each runs until the next one starts, so there is no frame
 * the episode does not own.
 *
 * ONE root <Audio>. The episode has a single voice and it is mounted here, not
 * per scene.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { theme } from "./theme";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Watermark";
import { CUES, type Cue } from "./subtitles";

/** The VO's length. Placeholder — 30 seconds of empty stage. */
export const TOTAL_FRAMES = 900;

type Mounted = { from: number; duration: number; Component: React.FC };

/** Everything that is not inside a continuity group. */
const INDEPENDENT_SCENES: Mounted[] = [];

/** Runs of scenes that share one element across a boundary. */
const CONTINUITY_GROUPS: Mounted[] = [];

const cueOn = (c: Cue) => c.end > c.start;

export const MovingAverageComposition = () => (
  <AbsoluteFill style={{ backgroundColor: theme.color.bg }}>
    {[...INDEPENDENT_SCENES, ...CONTINUITY_GROUPS].map(
      ({ from, duration, Component }) => (
        <Sequence key={`${from}-${Component.name}`} from={from} durationInFrames={duration}>
          <Component />
        </Sequence>
      ),
    )}

    {CUES.filter(cueOn).length > 0 && <Captions />}
    <Watermark />
  </AbsoluteFill>
);
