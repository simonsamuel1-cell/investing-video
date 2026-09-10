/**
 * The six transition cards. `mounted above the tiling, in GLOBAL frames`
 *
 * ⚠ THEY STRADDLE THE CUTS. Each starts 36 f before the outgoing scene's last
 * word ends and clears 36 f after the incoming scene's first word starts —
 * the recording leaves 0.30–0.83 s at these six joins and not a frame more.
 *
 * ⚠ AND ALL SIX SURVIVED, which is the difference from VIDEO 20. There the
 * recording had a join with ZERO silence and the recap had to be folded into
 * the scenes; here every card has air to land in, so the VO was never padded
 * and no content had to move.
 *
 * ⚠ ONE RAIL, CARRIED (CG-D). The board that opens at 1938 is the board that
 * lights the next part on every card and comes back all-✓ under the recap.
 * `ChapterCard` positions its children at the canvas origin precisely so the
 * rail lands in the same place every time.
 *
 * ⚠ THE CARD STOPS AT THE SUBTITLE BAND — core/StepRail.tsx draws it that
 * height on purpose — so a burned-in cue keeps running underneath it. That is
 * what lets a card sit over a cut at all.
 */
import { ChapterCard, StepRail } from "../../../core";
import { CARDS, STEPS } from "../data/timing";

const rail = (active: number, done: number[]) => (
  <StepRail steps={[...STEPS]} at={0} active={active} done={done} />
);

export const Cards = () => (
  <>
    <ChapterCard
      title="TA — COMMON MISTAKES"
      at={CARDS.roadmap.at}
      over={CARDS.roadmap.over}
    >
      {rail(0, [])}
    </ChapterCard>

    <ChapterCard n="02" title={STEPS[1].label} at={CARDS.ch02.at} over={CARDS.ch02.over}>
      {rail(1, [0])}
    </ChapterCard>

    <ChapterCard n="03" title={STEPS[2].label} at={CARDS.ch03.at} over={CARDS.ch03.over}>
      {rail(2, [0, 1])}
    </ChapterCard>

    <ChapterCard n="04" title={STEPS[3].label} at={CARDS.ch04.at} over={CARDS.ch04.over}>
      {rail(3, [0, 1, 2])}
    </ChapterCard>

    <ChapterCard n="05" title={STEPS[4].label} at={CARDS.ch05.at} over={CARDS.ch05.over}>
      {rail(4, [0, 1, 2, 3])}
    </ChapterCard>

    {/* ⚠ NO NUMBER ON THIS ONE. It is not a sixth chapter — it is the five,
        finished, and a number here would claim otherwise. */}
    <ChapterCard title="SEMUA BAGIAN" at={CARDS.recap.at} over={CARDS.recap.over}>
      {rail(-1, [0, 1, 2, 3, 4])}
    </ChapterCard>
  </>
);
