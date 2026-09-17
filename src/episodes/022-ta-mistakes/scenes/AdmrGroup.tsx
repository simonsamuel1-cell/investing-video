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
 * chart four numbers: how far the tape has come, how the triangle is drawing,
 * how far the preview has travelled, and what the projection is doing. Retiming
 * any beat is an edit to data/timing.ts and nothing else.
 *
 *   f10185  the cut delivers the window — border, price ladder, dates, no data
 *   f10205  run 1 begins; 56 candles are wiped in by f10421
 *   f10580  run 2 begins; 123 by f10646, and there it stops
 *   f10646  the triangle draws itself on the tape, high line then low line
 *   f10950  the preview closes in on candle 123
 *   f11010  ten hollow bars climb away from the last close, blinking 3×
 *   f11222  "Apa yang perlu diwaspadai?" in the room the preview opened
 *   f11300  the ten bars fade out
 *   f11413  Simon's arrow, 20px right of candle 123
 *   f11540  the question and the arrow go
 *   f11642  candle 123 glows twice and swells, finished by 11752
 *   f11752  candle 124 wipes up out of its own low, half as fast again
 *   f12147  three more follow it
 *   f12338  the preview lets go, then the last ten bars wipe in from the left
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
import SHOT from "../data/admr-chart.json";
import { AdmrChart } from "./AdmrChart";

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
/** How many bars the trace holds — the closing wipe runs out to this. */
const BAR_COUNT = SHOT.bars.length;

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
  /**
   * ⚠ THE FRONT THEN STANDS STILL FOR NEARLY TWO THOUSAND FRAMES. Between the
   * triangle and the closing wipe the tape does not grow by the front at all —
   * the four bars after the break are placed one at a time, each wiping up out
   * of its own low, so the front stays where run 2 left it. It picks up again
   * at `back.tape`, from the bar those four finished on.
   */
  const T = V.back.tape;
  if (g < T.at) return RUN2.bars;
  const from: number = V.after[V.after.length - 1].bars;
  return from + (BAR_COUNT - from) * progressInOut(g, T.at, T.to - T.at);
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
  /** In on 10950, and back out again on 12338 — "preview kembali normal". */
  const zoom =
    progress(f, local(V.zoom.at, FROM), m.sec(0.9)) * (1 - progress(g, V.back.at, V.back.over));

  /**
   * The highlight on candle 123. Two blinks that fade in and out, and one swell
   * to 20% and back, both landing exactly on `glow.to` — which is the frame the
   * next bar arrives, so nothing is still moving when it does.
   */
  const span = V.glow.to - V.glow.at;
  const t = Math.max(0, Math.min(1, (g - V.glow.at) / span));
  const lit = g < V.glow.at || g > V.glow.to ? 0 : 0.5 - 0.5 * Math.cos(Math.PI * 2 * V.glow.blinks * t);
  const glow = {
    ink: lit,
    scale: g < V.glow.at || g > V.glow.to ? 1 : 1 + V.glow.grow * Math.sin(Math.PI * t),
  };

  /**
   * The four bars after the break, each one 0→1 as it wipes up. `slow`
   * multiplies the house reveal — 1.5 for the first, which is the one Simon
   * asked to be half as fast again — and `step` staggers the ones that share a
   * beat so they arrive in order rather than together.
   */
  const after: number[] = [];
  let placed: number = RUN2.bars;
  for (const beat of V.after) {
    for (let i = placed; i < beat.bars; i++) {
      after.push(progress(g, beat.at + (i - placed) * beat.step, m.reveal * beat.slow));
    }
    placed = beat.bars;
  }

  /**
   * ⚠ A HARD BLINK, NOT A PULSE. "kedip" is an eyelid: on, off, on. Three of
   * them, and then it stays on — the last half-period is the OFF one, so the
   * projection does not end on a flash.
   */
  const half = m.sec(0.18);
  const since = g - V.ghost.at;
  const beat = Math.floor(since / half);
  const blink = since < 0 ? 0 : beat >= V.ghost.blinks * 2 ? 1 : beat % 2 === 0 ? 1 : 0.12;
  /** …and then they go, before the arrow arrives to talk about something else. */
  const ghostInk = blink * (1 - progress(g, V.ghost.out.at, V.ghost.out.over));

  return (
    <AbsoluteFill style={FENCE}>
      <AbsoluteFill style={cutInStyle(g, CUT11)}>
        <AdmrChart
          shown={drawn(g)}
          tri={tri}
          zoom={zoom}
          ghosts={since >= 0 ? V.ghost.count : 0}
          ghostInk={ghostInk}
          ask={progress(g, V.ask.at, m.reveal) * (1 - progress(g, V.ask.out.at, V.ask.out.over))}
          arc={progress(g, V.arc.at, V.arc.over) * (1 - progress(g, V.arc.out.at, V.arc.out.over))}
          glow={glow}
          after={after}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
