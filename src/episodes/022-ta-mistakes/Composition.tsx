/**
 * VIDEO 22 — COMMON MISTAKES IN TECHNICAL ANALYSIS. `16800 frames · 60fps`
 *
 * ⚠ EVERY FRAME NUMBER COMES FROM data/timing.ts, WHICH COPIES
 * docs/Video22_TA_Mistakes_Script_SYNCED.md. That table was computed from the
 * corrected SRT's milliseconds at 60fps. Nothing here re-derives it, converts
 * it, or doubles anything.
 *
 * ═══ FIVE CONTINUITY GROUPS ═══
 *
 *   CG-A  SC01·02·04·05   f0–4047, and it DRAWS NOTHING between 1140 and 1995.
 *                         The cold open's failure is the worked example of
 *                         Mistake 01 — "misalnya kamu beli karena support
 *                         bertahan" is the same support, on the same trade. A
 *                         second chart there turns one story into two examples
 *                         and the viewer cannot tell.
 *   CG-B  SC12+SC13       one ADMR tape. SC12 masks the future, SC13 opens the
 *                         same mask. Redrawing it would delete the argument —
 *                         that the evidence did not change, the reading did.
 *   CG-C  SC16+SC17       the process rail, built and then carried to the left.
 *                         SC17 checks the person, not the process.
 *   CG-D  f1938 → 15772   ONE roadmap object, in every transition card: it
 *                         lights the next part each time and comes back all-✓
 *                         under the recap. Six cards, not six boards.
 *   CG-E  SC04 → SC14     one mistake counter, 01 → 08, dark for the ADMR case.
 *
 * ⚠ ALL SIX TRANSITION CARDS SURVIVED, and that is this episode's one piece of
 * luck. The recording leaves 0.30–0.83 s at all six joins, so the VO was never
 * padded and nothing had to be folded into a scene — unlike VIDEO 20, whose
 * SC10 → SC11 join had zero silence.
 *
 * ⚠ NO WIPES, AND NO CameraCut EITHER. Every join here has real air in it, so
 * a plain hard cut under a card is what the recording actually supports; a
 * camera move added on top would be a move nobody asked for.
 *
 * ⚠ FOUR JOINS IN THE RECORDING HAVE NO SILENCE AT ALL — f227, f4900, f6917,
 * f12496 — and all four fall INSIDE a scene, not at a boundary. Each one is
 * marked in the scene that owns it, because a beat there cannot be given an
 * entrance that needs a run-up.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark } from "../../core";
import { CUES, VO_END } from "./subtitles";
import { BLOCK, COUNTER, REVERSE } from "./data/timing";
import { SetupGroup } from "./scenes/SetupGroup";
import { SC03 } from "./scenes/SC03";
import { SC06 } from "./scenes/SC06";
import { SC07 } from "./scenes/SC07";
import { SC08 } from "./scenes/SC08";
import { SC09 } from "./scenes/SC09";
import { SC10 } from "./scenes/SC10";
import { SC11 } from "./scenes/SC11";
import { AdmrGroup } from "./scenes/AdmrGroup";
import { SC14 } from "./scenes/SC14";
import { SC15 } from "./scenes/SC15";
import { ProcessGroup } from "./scenes/ProcessGroup";
import { SC18 } from "./scenes/SC18";
import { MistakeCounter } from "./scenes/Chrome";
import { Cards } from "./scenes/Cards";
import { CarryLine } from "./scenes/CarryLine";

/** ⚠ LONGER THAN THE VOICE ON PURPOSE — `BLOCK.END` holds the closing card for
 *  three seconds after the last word. The guard below is a floor, not an
 *  equality, precisely so that tail is allowed. */
export const TOTAL_FRAMES = BLOCK.END;

/**
 * ⚠ THE ONE SWITCH THIS EPISODE TAKES FROM OUTSIDE, and it exists for
 * scripts/audit-frames.mjs. That check proves the 108px subtitle band and the
 * 360×150 logo zone are EMPTY, and it cannot do that against stills that have
 * the burned-in captions and the watermark painted into them:
 *
 *     node scripts/stills.mjs . TAMistakes022 out/check <frames> '{"chrome":false}'
 *
 * It never affects a real render — the default is on.
 */
const { chrome = true } = getInputProps() as { chrome?: boolean };

type Mounted = { from: number; duration: number; Component: React.FC; name: string };

/**
 * ═══ ⚠ TEMPORARY — MOUNTS LISTED HERE DO NOT RENDER ═══
 * By NAME, not by frame, so it cannot drift when the table shifts. The tiling
 * check below still runs against the FULL table, so nothing is quietly lost
 * while a scene is held back.
 */
const HIDDEN: string[] = [];

/** ⚠ ORDER IS Z-ORDER. CG-A is first because SC03 is mounted over the stretch
 *  it deliberately leaves blank — see the header. */
const SCENES: Mounted[] = [
  { from: BLOCK.SC01, duration: BLOCK.SC06 - BLOCK.SC01, Component: SetupGroup, name: "CG-A · SC01·02·04·05" },
  { from: BLOCK.SC03, duration: BLOCK.SC04 - BLOCK.SC03, Component: SC03, name: "SC03 Probabilitas" },
  { from: BLOCK.SC06, duration: BLOCK.SC07 - BLOCK.SC06, Component: SC06, name: "SC06 Overtrading" },
  { from: BLOCK.SC07, duration: BLOCK.SC08 - BLOCK.SC07, Component: SC07, name: "SC07 Revenge trading" },
  { from: BLOCK.SC08, duration: BLOCK.SC09 - BLOCK.SC08, Component: SC08, name: "SC08 Confirmation bias" },
  { from: BLOCK.SC09, duration: BLOCK.SC10 - BLOCK.SC09, Component: SC09, name: "SC09 Konteks market" },
  { from: BLOCK.SC10, duration: BLOCK.SC11 - BLOCK.SC10, Component: SC10, name: "SC10 Indicator overload" },
  { from: BLOCK.SC11, duration: BLOCK.SC12 - BLOCK.SC11, Component: SC11, name: "SC11 Hindsight bias" },
  { from: BLOCK.SC12, duration: BLOCK.SC14 - BLOCK.SC12, Component: AdmrGroup, name: "CG-B · SC12+13 ADMR" },
  { from: BLOCK.SC14, duration: BLOCK.SC15 - BLOCK.SC14, Component: SC14, name: "SC14 Copy trade" },
  { from: BLOCK.SC15, duration: BLOCK.SC16 - BLOCK.SC15, Component: SC15, name: "SC15 The right question" },
  { from: BLOCK.SC16, duration: BLOCK.SC18 - BLOCK.SC16, Component: ProcessGroup, name: "CG-C · SC16+17" },
  { from: BLOCK.SC18, duration: BLOCK.END - BLOCK.SC18, Component: SC18, name: "SC18 Close" },
];

/* ⚠ COVERAGE, ASSERTED. Reading a table is how a one-frame hole survives to the
   render. CG-A spans SC03's window, so this checks that every frame from 0 to
   END is OWNED by something rather than that the rows abut.

   ⚠ CHECKED AGAINST THE FULL TABLE, not against what is currently visible:
   HIDDEN is a review switch and the tiling has to stay sound underneath it. */
(() => {
  const owned = new Array(BLOCK.END).fill(false);
  SCENES.forEach(({ from, duration }) => {
    for (let i = from; i < from + duration; i++) owned[i] = true;
  });
  const hole = owned.indexOf(false);
  if (hole !== -1) throw new Error(`022-ta-mistakes: frame ${hole} is unowned`);
  if (TOTAL_FRAMES < VO_END) {
    throw new Error(`022-ta-mistakes: ${TOTAL_FRAMES} frames is shorter than the voice (${VO_END})`);
  }
})();

const Body = () => (
  <Stage>
    {SCENES.filter((s) => !HIDDEN.includes(s.name)).map(({ from, duration, Component, name }) => (
      <Sequence key={name} from={from} durationInFrames={duration} name={name}>
        <Component />
      </Sequence>
    ))}

    {/* CG-E, above the tiling and below the cards: a card that lands over a
        chapter join must cover the counter too, or the card is not a card. */}
    <Sequence
      from={COUNTER.from}
      durationInFrames={COUNTER.to - COUNTER.from}
      name="CG-E · Mistake counter"
    >
      <MistakeCounter />
    </Sequence>

    {/* ⚠ ABOVE THE TILING, AND THAT IS THE WHOLE POINT. The two words it holds
        belong to SC02's question and to SC03's answer, so they belong to
        neither scene — SC03 paints an opaque stage over CG-A, and a heading
        owned by either side would be covered by the other. */}
    <Sequence
      from={REVERSE.ask}
      durationInFrames={BLOCK.SC04 - REVERSE.ask}
      name="Carry · Technical Analysis"
    >
      <CarryLine />
    </Sequence>

    {/* above everything, straddling the cuts — GLOBAL frames, see scenes/Cards.tsx */}
    <Cards />

    <Captions cues={CUES} show={chrome} />
    {chrome && <Watermark totalFrames={TOTAL_FRAMES} />}
    <Audio src={staticFile("vo/ta-mistakes.mp3")} />
  </Stage>
);

export const TAMistakesComposition = () => (
  <AbsoluteFill>
    {/* ⚠ THE DEFAULT `terang` PALETTE — #F5F5F5, the brand ground. */}
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
