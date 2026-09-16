/**
 * SC11 · TWO WINDOWS.  `from 9320 · to 10185`
 *
 * ⚠ THE WINDOWS ARE EMPTY ON PURPOSE — Simon: "hapus isi chartnya, keep
 * windownya. Lalu buat windownya jadi 2 kiri kanan". What is drawn here is two
 * white cards arriving and, at the end, leaving. Nothing else.
 *
 * ⚠ THE FILE KEEPS ITS NAME, and that is a choice worth stating. It held the
 * draft workbench's chart until this instruction and the tape is untouched on
 * disk — HIND_WINDOW in data/series.ts, still with its [NEEDS DATA] marker, and
 * WINDOW11.candles in data/timing.ts still holds the frame it built on. Putting
 * a chart back into a half is an import and a mount, not a rebuild; renaming
 * the file twice in two days would cost more than the name is worth.
 *
 * ⚠ WHAT WENT WITH THE CHART, AND WHY IT IS NOT COMING BACK BY ITSELF: the
 * plot box, the gridline span, the price ticks and the data credit. All four
 * described a chart inside a 1728-wide card; each half is 836 now, so every one
 * of those numbers is wrong for the box that exists. They are deleted rather
 * than parked, because parked geometry reads as usable.
 *
 * ⚠ THE PAIR IS THE SAME BOX, CUT. 96..1824 across and 230..870 down is exactly
 * where the single window stood; `halves()` splits it on the episode's own gap,
 * the same cut SC08's two windows and SC09's comparison use. See WIN11 in
 * data/layout.ts, where that is asserted rather than intended.
 *
 * ⚠ AND THEY ARRIVE ON THE SAME FRAME. Two windows that open one after the
 * other make the first one the subject and the second the comparison; nothing
 * in the voice says one of them leads.
 */
import { useCurrentFrame } from "remotion";
import { Card, Stage, fadeOut, progress, useMotion } from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11 } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
// ═══════════════════════════════════════════════════════════════════════════

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const open = progress(f, local(V.card, V.at), m.fade);
  const out = fadeOut(f, local(V.out, V.at), m.fade);

  return (
    <Stage>
      <div style={{ opacity: out }}>
        {W.cards.map((rect, i) => (
          <Card key={i} rect={rect} opacity={open} soft />
        ))}
      </div>
    </Stage>
  );
};
