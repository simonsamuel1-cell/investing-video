/**
 * VIDEO 22 — COMMON MISTAKES IN TECHNICAL ANALYSIS. `16830 frames · 60fps`
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
 *   CG-D  f1938 → 15802   ONE roadmap object, in every transition card: it
 *                         lights the next part each time and comes back all-✓
 *                         under the recap. Six cards, not six boards.
 *   CG-E  SC04 → SC14     one mistake counter, 01 → 08, dark for the ADMR case.
 *
 * ⚠ ALL SIX TRANSITION CARDS SURVIVED, and that is this episode's one piece of
 * luck. The recording leaves 0.30–0.83 s at all six joins, so the VO was never
 * padded and nothing had to be folded into a scene — unlike VIDEO 20, whose
 * SC10 → SC11 join had zero silence.
 *
 * ⚠ NO WIPES. That one still holds, and always will.
 *
 * ⚠ BUT THERE IS ONE CameraCut NOW, AT 10185 — Simon asked for it. This note
 * used to say there were none, on the grounds that every join here has real air
 * in it and a camera move on top would be a move nobody asked for. Somebody has
 * now asked for one, at the end of SC11, so the reasoning stands for the other
 * joins and the claim does not. See CUT11 in data/timing.ts.
 *
 * ⚠ FOUR JOINS IN THE RECORDING HAVE NO SILENCE AT ALL — f227, f4900, f6947,
 * f12526 — and all four fall INSIDE a scene, not at a boundary. Each one is
 * marked in the scene that owns it, because a beat there cannot be given an
 * entrance that needs a run-up.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark } from "../../core";
import { CUES, VO_END } from "./subtitles";
import { BLOCK, CARD_LIST, COUNTER, PANEL10, PLANS, RECALL, REVENGE_T, REVERSE, BREAKOUT, ROW3, ROW4, ROW5, ROW6, ROW7, TWIN, WINDOW11 } from "./data/timing";
import { SetupGroup } from "./scenes/SetupGroup";
import { SC03 } from "./scenes/SC03";
import { Platform } from "./scenes/Platform";
/**
 * ⚠ SC10 → SC18 ARE NO LONGER IMPORTED — Simon: "hapus semua visual dari scene
 * 10 ke belakang". The files stay on disk, whole and compiling, because they
 * are the work and the frame tables they read are untouched: SC10.tsx,
 * SC11.tsx, AdmrGroup.tsx, SC14.tsx, SC15.tsx, ProcessGroup.tsx, SC18.tsx.
 * Bringing any of them back is one import and one row in SCENES.
 */
import { Overload } from "./scenes/Overload";
import { ChartWindow } from "./scenes/ChartWindow";
import { AdmrGroup } from "./scenes/AdmrGroup";
import { CopyTrade } from "./scenes/CopyTrade";
import { MistakeCounter } from "./scenes/Chrome";
import { Cards } from "./scenes/Cards";
import { CarryLine } from "./scenes/CarryLine";
import { CardList, CardListFadeIn } from "./scenes/CardList";
import { CardList3 } from "./scenes/CardList3";
import { CardList4 } from "./scenes/CardList4";
import { CardList5 } from "./scenes/CardList5";
import { Breakout } from "./scenes/Breakout";
import { CardList6 } from "./scenes/CardList6";
import { CardList7 } from "./scenes/CardList7";
import { TwinWindows } from "./scenes/TwinWindows";
import { ChartRecall } from "./scenes/ChartRecall";
import { Revenge } from "./scenes/Revenge";

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

/** ⚠ THE CHAPTER CARDS' ONE SWITCH — see where it is used, below. */
const CHAPTER_CARDS = false;

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
/**
 * ⚠ A SCENE THAT DRAWS NOTHING, and it is not the same as no scene at all. The
 * coverage assertion below is the thing that catches a one-frame hole before a
 * render does, and it can only do that if every stretch is owned by something.
 * A deleted scene therefore leaves this behind rather than a gap in the table.
 */
const Blank = () => null;

const SCENES: Mounted[] = [
  { from: BLOCK.SC01, duration: BLOCK.SC06 - BLOCK.SC01, Component: SetupGroup, name: "CG-A · SC01·02·04·05" },
  { from: BLOCK.SC03, duration: BLOCK.SC04 - BLOCK.SC03, Component: SC03, name: "SC03 Probabilitas" },
  /** ⚠ SC06'S OWN VISUALS ARE GONE — Simon: "scene dari 4282-5030 dihapus
   *  semua". What runs here now is VIDEO 19's broker panel, held on its frame
   *  170; see scenes/Platform.tsx. The window still starts at BLOCK.SC06
   *  because the timeline may not have a hole in it — the card list covers its
   *  first 235 frames, and the panel is what shows from 4282. */
  { from: BLOCK.SC06, duration: BLOCK.SC07 - BLOCK.SC06, Component: Platform, name: "SC06 Platform" },
  /** ⚠ SC07'S VISUALS ARE GONE — Simon: "visual scene 07 hapus aja". The window
   *  stays because the timeline may not have a hole in it; what owns it now
   *  draws nothing. The third card row covers its first 200 frames anyway, and
   *  REVENGE is still in data/timing.ts for whatever replaces it. */
  { from: BLOCK.SC07, duration: BLOCK.SC08 - BLOCK.SC07, Component: Blank, name: "SC07 (empty)" },
  /** ⚠ SC08'S VISUALS ARE GONE — Simon: "hapus semua visual scene 8 termasuk
   *  text". Same shape as SC07: the window stays because the timeline may not
   *  have a hole in it, and what owns it now draws nothing. The fourth card row
   *  covers its first 249 frames; BIASED is still in data/timing.ts for
   *  whatever replaces the rest. */
  { from: BLOCK.SC08, duration: BLOCK.SC09 - BLOCK.SC08, Component: Blank, name: "SC08 (empty)" },
  /** ⚠ SC09'S VISUALS ARE GONE — Simon: "hilangkan dulu semua visual di scene
   *  09". Same shape as SC07 and SC08: the window stays because the timeline
   *  may not have a hole in it, and what owns it now draws nothing. CONTEXT is
   *  still in data/timing.ts for whatever replaces it. */
  { from: BLOCK.SC09, duration: BLOCK.SC10 - BLOCK.SC09, Component: Blank, name: "SC09 (empty)" },
  /** ⚠ SC10 IS AN OVERLAY NOW, not a tile — Simon: "scene 10 perpanjang hingga
   *  9050". Its picture has to start after round six clears at 8270 and run 52
   *  frames past SC11's window, and a tile can do neither. Same shape as SC09:
   *  the window stays because the timeline may not have a hole in it, and what
   *  owns it here draws nothing. */
  /**
   * ═══ ⚠ EVERYTHING FROM SC10 ON DRAWS NOTHING ═══  Simon: "hapus semua visual
   * dari scene 10 ke belakang".
   *
   * Same shape as SC07, SC08 and SC09, eight rows at once: the windows stay
   * because the timeline may not have a hole in it, and what owns them draws
   * nothing. Every frame table behind them is untouched in data/timing.ts —
   * OVERLOAD, HINDSIGHT, the ADMR case, COPY, QUESTION, PROCESS, CLOSE — and so
   * are the components, which are simply no longer mounted. That is the
   * expensive half and it is the half that is kept.
   *
   * ⚠ AND THE COUNTER CAME OFF WITH THEM, in data/timing.ts. It is an overlay
   * that outlives these scenes, so deleting them does not remove it — see the
   * note on `gaps` there, and what it costs.
   */
  /** ⚠ SC10 IS FILLED AGAIN, by an overlay — see the Sequence below. Its tile
   *  stays Blank because the picture has to start when round six clears at
   *  8270 and run 112 frames past SC11's window, and a tile can do neither. */
  { from: BLOCK.SC10, duration: BLOCK.SC11 - BLOCK.SC10, Component: Blank, name: "SC10 (overlaid)" },
  { from: BLOCK.SC11, duration: BLOCK.SC12 - BLOCK.SC11, Component: Blank, name: "SC11 (empty)" },
  { from: BLOCK.SC12, duration: BLOCK.SC14 - BLOCK.SC12, Component: Blank, name: "SC12+13 (empty)" },
  { from: BLOCK.SC14, duration: BLOCK.SC15 - BLOCK.SC14, Component: Blank, name: "SC14 (empty)" },
  { from: BLOCK.SC15, duration: BLOCK.SC16 - BLOCK.SC15, Component: Blank, name: "SC15 (empty)" },
  { from: BLOCK.SC16, duration: BLOCK.SC18 - BLOCK.SC16, Component: Blank, name: "SC16+17 (empty)" },
  { from: BLOCK.SC18, duration: BLOCK.END - BLOCK.SC18, Component: Blank, name: "SC18 (empty)" },
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

    {/* ⚠ SC10 ON ITS OWN WINDOW, AND BELOW THE COUNTER. It opens when round six
        clears and is held past SC11's opening.

        ⚠ IT SITS HERE, NOT WITH THE OTHER OVERLAYS AT THE FOOT OF THIS FILE.
        It paints an opaque panel over the whole frame, so mounted above CG-E it
        would hide the counter for its whole run — the chip simply would not be
        there for mistake 06. An overlay that is a SCENE belongs where its tile
        was: above the tiling, below the chrome. See scenes/Overload.tsx. */}
    <Sequence
      from={PANEL10.at}
      durationInFrames={PANEL10.to - PANEL10.at}
      name="SC10 · indicator overload"
    >
      <Overload />
    </Sequence>

    {/* ⚠ SC11'S CHART WINDOW — Simon: "copy deh sama animasinya … tapi chart
        dan animasinya aja, sisanya jangan ambil". It is the draft workbench's
        window and tape, and none of what that workbench stacks on top. It opens
        on 9320, the frame round seven clears and the frame the voice starts the
        sentence about it. Its own window again rather than a tile: BLOCK.SC11
        is 8998 and the picture belongs to the voice. See scenes/ChartWindow.tsx. */}
    <Sequence
      from={WINDOW11.at}
      durationInFrames={WINDOW11.to - WINDOW11.at}
      name="SC11 · chart window"
    >
      <ChartWindow />
    </Sequence>

    {/* ⚠ THE ADMR WINDOW STARTS ON SC11'S CUT, f10185. This is the existing
        carried case-study component, not a remake; it resolves its local
        clock from this cut so the full window is already present on f10185.
        It remains beneath the copy-trade overlay, which begins independently
        at PLANS.at. */}
    <Sequence
      from={WINDOW11.to}
      durationInFrames={PLANS.at - WINDOW11.to}
      name="SC12+13 · ADMR case"
    >
      <AdmrGroup />
    </Sequence>

    {/* ⚠ SC15 ON ITS OWN WINDOW, FOR THE SAME REASON SC10 IS ON ONE. Its three
        cues are 12514, 12676 and 13096 in the recording, and `BLOCK` is still
        150–180 frames behind from SC11 on because the six VO pads were never
        rippled into it. So the picture is hung on the voice and the block table
        is left alone until it is re-derived as a whole — which means this
        straddles the SC14/SC15 boundary at 13070. Both tiles are Blank, so
        nothing of theirs is covered.

        ⚠ AND IT SITS WHERE ITS TILE WOULD: above the tiling, below the chrome.
        It paints its own ground, so mounted above CG-E it would hide the
        counter — the same mistake SC10 made once. See scenes/CopyTrade.tsx. */}
    <Sequence
      from={PLANS.at}
      durationInFrames={PLANS.to - PLANS.at}
      name="SC15 · satu saham, dua rencana"
    >
      <CopyTrade />
    </Sequence>

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

    {/* ═══ ⚠ THE SIX TRANSITION CARDS ARE OFF ═══
        Simon: "hapus ini … instead kosongkan dulu, aku punya ide visualnya tapi
        panjang". What is empty is the PICTURE, not the plan: the six windows
        are still in data/timing.ts (CARDS) and scenes/Cards.tsx is untouched,
        so bringing them back is this one word. The cuts they straddled play
        through with the scenes either side of them, which is what the recording
        supports anyway. */}
    {CHAPTER_CARDS && <Cards />}

    {/* ⚠ THE TOPMOST LAYER — Simon: "layer ini harus yang paling atas jika
        overlapping dengan scene lain".

        ⚠ AND IT NOW OWNS EVERYTHING FROM 1994 TO SC06. Simon extended it to
        4041 and had the visuals that used to run there deleted, so SC04's
        stretch is covered by it and SC05's is covered by it and empty
        underneath — see the note on HOPE in data/timing.ts. SetupGroup still
        spans to BLOCK.SC06 because the timeline may not have a hole in it; what
        it draws after 1994 is simply never seen. */}
    {/* ⚠ THE FADE IS ITS OWN WINDOW, AND IT ENDS WHERE THE SCENE BEGINS —
        Simon. See `fade` in data/timing.ts for why it cannot live inside the
        scene it is fading into. */}
    <Sequence
      from={CARD_LIST.at - CARD_LIST.fade}
      durationInFrames={CARD_LIST.fade}
      name="Scene Transisi · fade in"
    >
      <CardListFadeIn />
    </Sequence>
    <Sequence from={CARD_LIST.at} durationInFrames={CARD_LIST.over} name="Scene Transisi · Card list">
      <CardList />
    </Sequence>

    {/* ⚠ THE THIRD TURN OF THE LIST, and it owns the platform's exit as well as
        its own arrival — the two have to cross, and they can only cross if one
        layer draws both. See scenes/CardList3.tsx. */}
    <Sequence from={ROW3.from} durationInFrames={ROW3.over} name="Scene Transisi 3 · Card list">
      <CardList3 />
    </Sequence>

    {/* ⚠ THE SAME CHART AS 4044, HELD — see scenes/ChartRecall.tsx. It fills the
        stretch SC07's deleted visuals left empty. */}
    <Sequence from={RECALL.at} durationInFrames={RECALL.over} name="SC07 · chart recalled">
      <ChartRecall />
    </Sequence>

    {/* ⚠ AND THEN IT MOVES AGAIN. The recall hands over on 5394; this is the
        same picture with its clock started — see scenes/Revenge.tsx. */}
    <Sequence from={REVENGE_T.at} durationInFrames={REVENGE_T.over} name="SC07 · revenge trade">
      <Revenge />
    </Sequence>

    {/* ⚠ THE FOURTH TURN OF THE LIST, and like the third it owns the outgoing
        picture's exit as well as its own arrival. ⚠ IT OVERLAPS SC08 — Simon:
        "tidak masalah overlap dengan scene lain", while the timing is parked.
        Mounted AFTER the revenge scene so that on 6023, where both are drawn,
        this layer's copy is the one on top. See scenes/CardList4.tsx. */}
    <Sequence from={ROW4.from} durationInFrames={ROW4.over} name="Scene Transisi 4 · Card list">
      <CardList4 />
    </Sequence>

    {/* ⚠ WHAT FILLS THE STRETCH SC08'S DELETED VISUALS LEFT — Simon: "buat 2
        window kiri kanan, isi chartnya sama". An overlay rather than the
        blanked scene itself, so the window it fills stays the one the coverage
        assertion owns. See scenes/TwinWindows.tsx. */}
    <Sequence from={TWIN.at} durationInFrames={TWIN.to - TWIN.at} name="SC08 · two windows">
      <TwinWindows />
    </Sequence>

    {/* ⚠ THE FIFTH TURN OF THE LIST, and like the third and fourth it owns the
        outgoing picture's exit as well as its own arrival. It runs over SC09
        the way the fourth ran over SC08. See scenes/CardList5.tsx. */}
    <Sequence from={ROW5.from} durationInFrames={ROW5.over} name="Scene Transisi 5 · Card list">
      <CardList5 />
    </Sequence>

    {/* ⚠ WHAT FILLS THE STRETCH SC09'S DELETED VISUALS LEFT — Simon's sketch:
        one setup, two markets, two outcomes. An overlay rather than the blanked
        scene itself, so the window it fills stays the one the coverage
        assertion owns. See scenes/Breakout.tsx. */}
    <Sequence
      from={BREAKOUT.at}
      durationInFrames={BREAKOUT.to - BREAKOUT.at}
      name="SC09 · one setup, two markets"
    >
      <Breakout />
    </Sequence>

    {/* ⚠ THE SIXTH TURN OF THE LIST, and it carries SC09 off the way the fifth
        carried SC08. It also does SC10's introducing: the voice names mistake
        six over it, off card six. See scenes/CardList6.tsx. */}
    <Sequence from={ROW6.from} durationInFrames={ROW6.over} name="Scene Transisi 6 · Card list">
      <CardList6 />
    </Sequence>

    {/* ⚠ THE SEVENTH TURN, AND IT CARRIES SC10 OFF BY FADING IT — Simon:
        "9109-9110 kasih Scene Transisi seleksi kartu selanjutnya … dari scene
        terakhir (yang ada text box), kasih fade out aja". It takes over on the
        frame after SC10's window draws its last, and like round six it does the
        introducing: the voice names hindsight bias over it, off card seven.
        See scenes/CardList7.tsx. */}
    <Sequence from={ROW7.from} durationInFrames={ROW7.over} name="Scene Transisi 7 · Card list">
      <CardList7 />
    </Sequence>

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
