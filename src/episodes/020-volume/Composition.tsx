/**
 * VIDEO 20 — VOLUME. `19592 frames · 60fps · 05:26.533`
 *
 * ⚠ EVERY FRAME NUMBER COMES FROM data/timing.ts, WHICH COPIES THE SYNC
 * DOCUMENT. That table was computed from the corrected SRT's milliseconds at
 * 60fps. Nothing here re-derives it, converts it, or doubles anything.
 *
 * ═══ FOUR CONTINUITY GROUPS ═══
 *
 *   CG-A  SC01·02·11·12·13   spans f0–10411 and DRAWS NOTHING between f1460 and
 *                            f8154. SC11's line is "kita kembali ke breakout
 *                            tadi", so it has to be the same chart — mounting a
 *                            second one would make that sentence a lie the
 *                            viewer cannot catch.
 *   CG-B  SC03–SC06          one price pane over one volume pane, sharing an x
 *                            axis, so "satu candle ↔ satu volume bar" stays
 *                            true for four scenes.
 *   CG-C  SC07–SC10          the four-combination table, filled one row per
 *                            scene. There is ZERO silence at the SC10 → SC11
 *                            cut, so the recap card the script asks for cannot
 *                            exist; the table is complete by f8154 and simply
 *                            holds under CHAPTER 03.
 *   CG-D  SC15A+15B          the reveal mask lifts across the join. The answer
 *                            is on the chart the whole time.
 *
 * ⚠ CG-A IS MOUNTED FIRST AND SPANS THE OTHERS. CG-B and CG-C sit above it
 * during their windows; CG-A is blank there, so nothing is covered — and the
 * tape is never rebuilt.
 *
 * ⚠ TWO HARD CUTS, f6798 and f8154, both mid-word. No wipe, no transition of
 * any kind: the narration runs straight through them, and a transition on a
 * mid-sentence cut reads as a mistake.
 */
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { PaletteProvider, Stage, Captions, Watermark } from "../../core";
import { CUES, VO_END } from "./subtitles";
import { BLOCK, TRANS, RUNNING_LINE, COMBOS_VERSION } from "./data/timing";
import { MainChartGroup } from "./scenes/MainChartGroup";
import { UnderstandGroup } from "./scenes/UnderstandGroup";
import { CombosGroup } from "./scenes/CombosGroup";
import { CombosGroupV2 } from "./scenes/CombosGroupV2";
import { CombosGroupV3 } from "./scenes/CombosGroupV3";
import { SC14 } from "./scenes/SC14";
import { BrptGroup } from "./scenes/BrptGroup";
import { SC16 } from "./scenes/SC16";
import { SC17 } from "./scenes/SC17";
import { SC18 } from "./scenes/SC18";
import { SC19 } from "./scenes/SC19";
import { SC20 } from "./scenes/SC20";
import { Cards } from "./scenes/Cards";

/** The voice ends on the last cue. `VO_END` is computed from the SRT, so a
 *  re-cut recording fails against the wrong number rather than truncating. */
export const TOTAL_FRAMES = 19652;

type Mounted = {
  from: number;
  duration: number;
  Component: React.FC;
  name?: string;
};

/**
 * ═══ ⚠ TEMPORARY — MOUNTS LISTED HERE DO NOT RENDER ═══
 *
 * By NAME, not by frame: naming the mount says which scene is being held back,
 * and it cannot drift when the frame table shifts. Empty the list to bring
 * everything back — nothing below has been deleted, and the frames, the voice
 * and the subtitles all continue as they are, so the timeline stays in sync.
 */
const HIDDEN: string[] = [];

/**
 * ⚠ ORDER IS Z-ORDER, AND CG-A IS LAST ON PURPOSE — Simon's call: scene 1 sits
 * ON TOP.
 *
 * The two overlap for one stretch only. CG-B opens at f1516 while CG-A is still
 * holding the four-card roadmap, and CG-A goes dark at `MAP_HOLD` (f1691) —
 * everywhere else CG-A has already returned null, so painting it last costs
 * nothing. What it buys is the hand-over: the board dissolves and SC03 is
 * already standing underneath it, which is what makes the fade a cross-fade
 * rather than a fade to empty followed by a scene arriving.
 */
const SCENES: Mounted[] = [
  {
    from: BLOCK.SC07,
    duration: BLOCK.SC11 - BLOCK.SC07,
    /** ⚠ THE LEVER LIVES IN data/timing.ts — `COMBOS_VERSION`. Both builds
     *  cover the same frames and key off the same stage table; this is the only
     *  place either of them is mounted. */
    Component:
      COMBOS_VERSION === 1 ? CombosGroup : COMBOS_VERSION === 2 ? CombosGroupV2 : CombosGroupV3,
    name: `CG-C · SC07–10 · v${COMBOS_VERSION}`,
  },
  {
    from: BLOCK.SC14,
    duration: BLOCK.SC15A - BLOCK.SC14,
    Component: SC14,
    name: "SC14 Breakdown",
  },
  {
    from: BLOCK.SC15A,
    duration: BLOCK.SC16 - BLOCK.SC15A,
    Component: BrptGroup,
    name: "CG-D · SC15A+B",
  },
  {
    from: BLOCK.SC16,
    duration: BLOCK.SC17 - BLOCK.SC16,
    Component: SC16,
    name: "SC16 Trend health",
  },
  {
    from: BLOCK.SC17,
    duration: BLOCK.SC18 - BLOCK.SC17,
    Component: SC17,
    name: "SC17 Volume spike",
  },
  {
    from: BLOCK.SC18,
    duration: BLOCK.SC19 - BLOCK.SC18,
    Component: SC18,
    name: "SC18 Colour",
  },
  {
    from: BLOCK.SC19,
    duration: BLOCK.SC20 - BLOCK.SC19,
    Component: SC19,
    name: "SC19 Limits",
  },
  {
    from: BLOCK.SC20,
    duration: BLOCK.END - BLOCK.SC20,
    Component: SC20,
    name: "SC20 Close",
  },
  /**
   * ⚠ CG-B RUNS PAST ITS OWN BLOCK AND IS DRAWN OVER CG-C, on purpose. SC06's
   * scene is what shrinks into the roadmap card at f4958, so the group that
   * draws SC06 has to still be mounted while it shrinks — and it has to be
   * ON TOP, because CG-C opens at f4954 with a stage of its own. It returns
   * null the moment the transition is over.
   */
  {
    from: BLOCK.SC03,
    duration: TRANS.gone - BLOCK.SC03,
    Component: UnderstandGroup,
    name: "CG-B · SC03–06",
  },
  /* ⚠ LAST = ON TOP. See the note above the array. */
  {
    from: BLOCK.SC01,
    duration: BLOCK.SC14 - BLOCK.SC01,
    Component: MainChartGroup,
    name: "CG-A · SC01·02·11·12·13",
  },
];

/* ⚠ COVERAGE, ASSERTED. Reading a table is how a one-frame hole survives to the
   render. CG-B and CG-C sit inside CG-A's span, so this checks that every frame
   from 0 to END is owned by something rather than that the rows abut. */
(() => {
  const owned = new Array(BLOCK.END).fill(false);
  SCENES.forEach(({ from, duration }) => {
    for (let i = from; i < from + duration; i++) owned[i] = true;
  });
  /* ⚠ CHECKED AGAINST THE FULL TABLE, not against what is currently visible:
     `HIDDEN` is a review switch, and the tiling has to stay sound underneath it
     so nothing is quietly lost when a mount comes back. */
  const hole = owned.indexOf(false);
  if (hole !== -1) throw new Error(`020-volume: frame ${hole} is unowned`);
  if (TOTAL_FRAMES < VO_END) {
    throw new Error(
      `020-volume: ${TOTAL_FRAMES} frames is shorter than the voice (${VO_END})`,
    );
  }
})();

const Body = () => (
  <Stage>
    {SCENES.filter((m) => !HIDDEN.includes(m.name ?? "")).map(
      ({ from, duration, Component, name }) => (
        <Sequence
          key={name}
          from={from}
          durationInFrames={duration}
          name={name}
          style={{
            translate: "-2px 2px",
          }}
        >
          <Component />
        </Sequence>
      ),
    )}

    {/* above the tiling, straddling the cuts — see scenes/Cards.tsx */}
    <Cards />

    <Captions cues={CUES} mute={RUNNING_LINE.mute} />
    <Watermark totalFrames={TOTAL_FRAMES} />
    <Audio src={staticFile("vo/volume.mp3")} />
  </Stage>
);

export const VolumeComposition = () => (
  <AbsoluteFill>
    {/* ⚠ THE DEFAULT `terang` PALETTE — #F5F5F5, the brand ground.
        A white ground was tried here and reverted: on #FFFFFF the white card
        disappears, and that card is what makes a hairline gridline, a 2px band
        and a neutral price line legible in the first place. */}
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
