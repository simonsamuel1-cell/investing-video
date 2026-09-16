/**
 * SC11 · THE CHART WINDOW.  `from 9320 · to 10185`
 *
 * ⚠ IT IS THE DRAFT WORKBENCH'S WINDOW, AND ONLY THE WINDOW — Simon: "copy deh
 * sama animasinya … tapi chart dan animasinya aja, sisanya jangan ambil". The
 * card, the tape building left to right, the gridlines and the time axis. What
 * is deliberately NOT here is everything scenes/Draft.tsx puts on top of the
 * same box: the title card, Resistance, the Zone, Swing Low, Prior High, the
 * Decision Point cut, the three branches and the process matrix.
 *
 * ⚠ SAME TAPE, NOT A SIMILAR ONE. The anchors, the length and both seeds are
 * copied exactly, so these bars ARE the draft's bars. See HIND_WINDOW in
 * data/series.ts, and the note there about the copy still living in
 * scenes/Draft.tsx — that file belongs to the other chat and cannot be edited
 * from here.
 *
 * ⚠ THE PRICE SCALE IS OUTSIDE THE PLOT. `gridSpan` is what does it: the
 * gridlines run past the last candle and the numbers sit in their own 198px
 * column, instead of landing on the newest bars. See WIN11 in data/layout.ts.
 *
 * ⚠ AND IT OPENS ON THE FRAME THE CARD LIST CLEARS. Round seven ends at 9320
 * and the voice starts "Setelah harga bergerak…" on 9320; the pad at 9276 is
 * what made those the same number.
 *
 * ⚠ NOTHING MOVES BETWEEN 9390 AND 10165. The tape is finished at 9390 and the
 * window holds for thirteen seconds. That stretch is the room for whatever
 * goes on top of it, not an oversight.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chart, SourceTag, Stage, TimeAxis,
  domainOf, fadeOut, gridOf, progress, useMotion,
} from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11 } from "../data/layout";
import { HIND_WINDOW, HIND_WINDOW_AXIS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(HIND_WINDOW.closes, HIND_WINDOW.bars);

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const grid = gridOf(HIND_WINDOW.closes, DOMAIN, W.plot, 0.12);
  const candles = local(V.candles, V.at);
  const out = fadeOut(f, local(V.out, V.at), m.fade);
  /**
   * ⚠ THE RULES ARRIVE WITH THE PANEL, AND THIS IS A FIX RATHER THAN A CHOICE.
   * core/Chart gates its CANDLES on `at` but draws its gridlines and price
   * scale the moment it is mounted, so with the card fading over its own 20
   * frames the first render of 9320 was six ruled lines and six prices hanging
   * on the bare ground with no panel behind them. The draft workbench has the
   * same 20-frame gap and therefore the same flash; it is simply never looked
   * at there, because that file opens on a title card.
   *
   * ⚠ AND IT COSTS THE CANDLES NOTHING. The tape starts on 9340, which is the
   * frame this reaches 1, so the whole build happens at full strength.
   */
  const panel = progress(f, local(V.card, V.at), m.fade);

  return (
    <Stage>
      <div style={{ opacity: out }}>
        <Card rect={W.card} opacity={panel} soft />
        <div style={{ opacity: panel }}>
        <Chart
          series={HIND_WINDOW}
          grid={grid}
          at={candles}
          over={m.sec(0.83)}
          gridSpan={W.span}
          ticks={W.ticks}
          baseline={false}
        />
        {/* ⚠ IT FOLLOWS THE TAPE RATHER THAN SHARING ITS FRAME. Dates that are
            already there while the bars are still arriving read as a chart
            being uncovered rather than one being drawn. */}
        <TimeAxis labels={HIND_WINDOW_AXIS} grid={grid} at={candles + m.reveal} />
        {/* ⚠ MOUNTED, AND IT DRAWS NOTHING WHILE THE TAPE IS GENERATED — that
            is core/SourceTag's standing behaviour, not an omission. Swapping in
            the real export makes the credit appear by itself. */}
        <SourceTag
          kind={HIND_WINDOW.kind}
          label={HIND_WINDOW.label}
          x={W.tag.x}
          y={W.tag.y}
          anchor="left"
        />
        </div>
      </div>
    </Stage>
  );
};
