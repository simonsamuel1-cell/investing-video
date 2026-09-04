/**
 * The seven transition cards. `mounted above the tiling`
 *
 * ⚠ THEY STRADDLE THE CUTS, they do not sit in gaps — there are no gaps. The
 * recording leaves 0.27–0.63s of silence between scenes and NONE AT ALL at
 * SC10 → SC11. Each card starts before the outgoing scene's last word and
 * clears after the incoming scene's first; by then the outgoing scene has made
 * its point, so nothing is lost.
 *
 * ⚠ THE KEY POINT RECAP IS NOT HERE. Four rows of table have nowhere to live at
 * a cut with zero silence, so that card does not exist: the table is built one
 * row per scene across SC07–SC10 and is already complete when CHAPTER 03 lands
 * over it. See CombosGroup.
 *
 * ONE RAIL, CARRIED. The same StepRail opens the episode and closes it in SC20.
 */
import { ChapterCard, StepRail } from "../../../core";
import type { Step } from "../../../core";
import { CARDS } from "../data/timing";

export const STEPS: Step[] = [
  { n: "01", label: "Understand Volume" },
  { n: "02", label: "Read Price + Volume" },
  { n: "03", label: "Confirm the Move" },
  { n: "04", label: "Read the Context" },
  { n: "05", label: "Use It Correctly" },
];

export const Cards = () => (
  <>
    {/* ⚠ NO LEARNING ROADMAP CARD. It used to land at 1410–1510 and Simon has
        cut it: the two windows are still on screen there making the episode's
        opening claim, and a full-frame contents page over them interrupts the
        one thing the viewer is being asked to compare. The rail still opens
        every chapter below, and still closes the episode in SC20. */}

    {/* ⚠ CHAPTER 02'S CARD IS GONE — Simon's call. The Scene Transisi at
        f4958 already hands the chapter over: the scene shrinks into "mengenal
        volume" and "cara baca volume" lights up beside it. A full-screen card
        saying the same thing 50 frames earlier said it twice. */}
    {/* ⚠ CHAPTER 03'S CARD IS GONE TOO — Simon's call, for the same reason as
        02's. The Scene Transisi at f8178 hands the chapter over: the combos
        board shrinks into "cara baca volume" and "cara pakai volume" lights up
        beside it and opens out into SC11. A full-screen contents list dropped
        over a chart that was still being read said the same thing worse. */}

    {/* ⚠ INTERROGATIVE. Nothing directional, priced or coloured renders on a
        question card — the answer is still two scenes away. */}
    <ChapterCard n="Now you try" title="BRPT" sub="Baca harganya · Bandingkan volumenya" at={CARDS.practice.at} over={CARDS.practice.over} />

    <ChapterCard n="04" title="Read the Context" sub="Kesehatan trend · Volume spike" at={CARDS.ch04.at} over={CARDS.ch04.over}>
      <StepRail steps={STEPS} at={CARDS.ch04.at} active={3} done={[0, 1, 2]} />
    </ChapterCard>

    <ChapterCard n="05" title="Use Volume Correctly" sub="Salah kaprah · Batasannya" at={CARDS.ch05.at} over={CARDS.ch05.over}>
      <StepRail steps={STEPS} at={CARDS.ch05.at} active={4} done={[0, 1, 2, 3]} />
    </ChapterCard>

    <ChapterCard n="Recap" title="Volume Analysis" at={CARDS.recap.at} over={CARDS.recap.over}>
      <StepRail steps={STEPS} at={CARDS.recap.at} done={[0, 1, 2, 3, 4]} />
    </ChapterCard>
  </>
);
