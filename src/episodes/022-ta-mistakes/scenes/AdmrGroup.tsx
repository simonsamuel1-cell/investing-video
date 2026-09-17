/**
 * CG-B — SC12 + SC13, the ADMR case. `from 10185 · to 12514`
 *
 * ONE tape, drawn once. SC12 reads the evidence with the future still ahead of
 * it; SC13 re-reads THAT SAME tape after it has played out. If the chart were
 * mounted twice the scene would be saying "here is one chart, and here is
 * another one that agrees with me" — the argument is that the evidence did not
 * change, the reading of it did, and only a carried tape can make it.
 *
 * ═══ WHAT CHANGED, 2026-09-17 ═══
 * The tape is no longer drawn in the house style off a placeholder series. It
 * is Simon's own TradingView export, `ADMR_03.png`, reproduced — traced by
 * scripts/trace-admr2.mjs into data/admr-chart.json and drawn by
 * scenes/AdmrChart.tsx at one uniform scale.
 *
 * ═══ THIS FILE IS THE CLOCK, AND THE ONLY ONE ═══
 * AdmrChart owns no frames. Everything below reads `ADMR_TAPE` and hands the
 * chart four numbers: how far the tape has come, whether the rule is up, how
 * far the zoom has travelled, and what the projection is doing. Retiming any
 * beat is an edit to data/timing.ts and nothing else.
 *
 *   f10185  the cut delivers the window — border, price ladder, dates, no data
 *   f10205  run 1 begins; 56 candles are wiped in by f10421
 *   f10580  run 2 begins; 123 by f10646, and there it stops
 *   f10646  the triangle draws itself on the tape, high line then low line
 *   f10703  the rule sweeps in from the left and stops on bar 122
 *   f10950  the note opens and the zoom leans in on the right-hand end
 *   f11010  ten hollow bars climb away from the last close, blinking 3×
 *
 * ⚠ IT ARRIVES ON A CAMERA CUT, WHICH IS WHY THE WINDOW HAS NO ENTRANCE OF ITS
 * OWN. SC11 leaves through the outgoing half of CUT11 at f10185; this is the
 * half that cut brings in. `cutInStyle` is read from GLOBAL frames — the
 * Sequence rebases them, so FROM has to be added back. That is the number one
 * bug in this pipeline and it is silent when you get it wrong.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cutInStyle, progress, progressInOut, theme, useMotion } from "../../../core";
import { ADMR_TAPE, CUT11, local } from "../data/timing";
import { AdmrChart } from "./AdmrChart";
import { AdmrNote } from "./AdmrNote";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** The frame this Sequence is mounted on, which is the cut itself. */
const FROM = CUT11.at;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE CUT ITSELF HAS TO BE FENCED OFF THE TWO RESERVES, and nothing else in
 * this episode has needed that before.
 *
 * At rest the window sits at y152..968, clear of the logo zone above it and the
 * subtitle band below. But `cutInStyle` hands it a 120px throw and a 10px blur,
 * and a 10px blur on an 816px-tall panel reaches well past its own edge:
 * scripts/audit-frames.mjs failed f10185, f10186, f10190 and f10195 on both
 * reserves at once, with the throw carrying the panel's right edge to x1890
 * while the blur smeared its top up to y142.
 *
 * Shrinking the window to leave room for the blur costs it 30px of height for
 * twenty frames of motion. Clipping the moving half to the band between the two
 * reserves costs nothing and cannot be got wrong later: the reserves are empty
 * because they are OUTSIDE THE CLIP, not because the arithmetic happened to
 * work out. The clip is on the parent, so the filter renders first and is then
 * cut — which is also why it cannot live on the same element as the transform.
 */
const FENCE = {
  clipPath: `inset(${theme.logoZone.height}px 0px ${theme.captionBand.height}px 0px)`,
} as const;

const V = ADMR_TAPE;
const [RUN1, RUN2] = V.runs;

/**
 * How far the tape has been uncovered at a GLOBAL frame — two eased runs with a
 * hold between them.
 *
 * ⚠ ONE CURVE FOR THE BARS AND THE LINES. The bars are wiped by a front and the
 * three plotted lines draw themselves by trim path, but both read this, so the
 * lines' two checkpoints ("candle ke 56 dan 123") are the runs' own ends and
 * cannot drift from them. Easy ease, per run — `progressInOut`.
 */
const drawn = (g: number) => {
  if (g < RUN1.at) return 0;
  if (g <= RUN1.to) return RUN1.bars * progressInOut(g, RUN1.at, RUN1.to - RUN1.at);
  if (g < RUN2.at) return RUN1.bars;
  if (g <= RUN2.to)
    return RUN1.bars + (RUN2.bars - RUN1.bars) * progressInOut(g, RUN2.at, RUN2.to - RUN2.at);
  return RUN2.bars;
};

export const AdmrGroup = () => {
  const f = useCurrentFrame();
  const g = f + FROM;
  const m = useMotion();

  /** Each trendline draws itself on the symmetric curve — "easy ease". */
  const tri = {
    high: progressInOut(g, V.tri.high.at, V.tri.high.over),
    run: progressInOut(g, V.tri.high.run.at, V.tri.high.run.over),
    low: progressInOut(g, V.tri.low.at, V.tri.low.over),
  };
  /** And so does the rule's travel, from the plot's left edge to bar 122. */
  const mark = progressInOut(g, V.mark.at, V.mark.over);

  const zoom = progress(f, local(V.zoom.at, FROM), m.sec(0.9));
  const open = progress(f, local(V.note.at, FROM), m.reveal);
  const ink = progress(f, local(V.note.at, FROM) + m.reveal, m.fade);

  /**
   * ⚠ A HARD BLINK, NOT A PULSE. "kedip" is an eyelid: on, off, on. Three of
   * them, and then it stays on — the last half-period is the OFF one, so the
   * projection does not end on a flash.
   */
  const half = m.sec(0.18);
  const since = g - V.ghost.at;
  const beat = Math.floor(since / half);
  const ghostInk =
    since < 0 ? 0 : beat >= V.ghost.blinks * 2 ? 1 : beat % 2 === 0 ? 1 : 0.12;

  return (
    <AbsoluteFill style={FENCE}>
      <AbsoluteFill style={cutInStyle(g, CUT11)}>
        <AdmrChart
          shown={drawn(g)}
          mark={mark}
          tri={tri}
          zoom={zoom}
          ghosts={since >= 0 ? V.ghost.count : 0}
          ghostInk={ghostInk}
        />
        {g >= V.note.at && <AdmrNote open={open} ink={ink} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
