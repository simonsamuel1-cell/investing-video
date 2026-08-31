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
    <ChapterCard title="Volume Analysis" at={CARDS.roadmap.at} over={CARDS.roadmap.over}>
      <StepRail steps={STEPS} at={CARDS.roadmap.at} active={0} />
    </ChapterCard>

    <ChapterCard n="02" title="Read Price + Volume" sub="Empat kombinasi dasar" at={CARDS.ch02.at} over={CARDS.ch02.over}>
      <StepRail steps={STEPS} at={CARDS.ch02.at} active={1} done={[0]} />
    </ChapterCard>

    <ChapterCard n="03" title="Confirm the Move" sub="Breakout · Breakdown · Studi kasus" at={CARDS.ch03.at} over={CARDS.ch03.over}>
      <StepRail steps={STEPS} at={CARDS.ch03.at} active={2} done={[0, 1]} />
    </ChapterCard>

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
