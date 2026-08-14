/**
 * SC18 — ASII, on film (from 8555, dur 1055).
 *
 * This slot carried a `[NEEDS DATA]` placeholder: real ASII daily OHLC, which
 * must never be drawn from invented numbers. The recording of the real chart
 * has arrived, so everything drawn here is gone and the frame is the recording.
 *
 * `asii.mp4` is 1048 frames at 30fps, so it runs 8555 → 9602 and the scene's
 * last SEVEN frames hold on its final picture.
 *
 * Two highlights walk the narration along the chart: the sideways stretch it
 * opens on, then the climb that breaks out of it. The first is fully gone on
 * the frame the second starts, so the frame is only ever making one claim.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Layer } from "../components/Stage";
import { ScreenClip } from "../components/ScreenClip";
import {
  HighlightBox,
  HighlightCircle,
  type HLRect,
} from "../components/HighlightBox";
import { theme } from "../theme";
import { progress, progressInOut, clamp01, textReveal } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 8555;
/**
 * The recording is portrait, so HEIGHT is what is set and the width follows
 * from its own 980 × 1450. It fills the active area top to bottom and stops
 * clear of the subtitle band, which owns the bottom 108px of every frame.
 *
 * `inset` is trimmed off EACH side.
 */
const CLIP = {
  src: "asii.mp4",
  h: theme.stage.active.h,
  aspect: 980 / 1450,
  inset: 10,
};
/** Where the footage sits once masked — the boxes are measured against this. */
const CLIP_W = CLIP.h * CLIP.aspect - CLIP.inset * 2;
const CLIP_X = (theme.canvas.width - CLIP_W) / 2;
/** How far a box reaches past the footage on the side it starts or ends on. */
const PAD = 20;
/**
 * THE TRADINGVIEW RECORDING, on from this scene's first frame.
 *
 * Landscape, unlike the ASII capture, so its height follows from its own
 * 1500 × 776 — nothing is stretched. 1054 frames at 30fps, which covers
 * 8555 → 9608 and leaves this scene's last frame holding on its last picture.
 */
const TV = { src: "tradingview.mp4", aspect: 1500 / 776 };
/**
 * ═══ THE SPLIT, ON 8639 ═══
 *
 * 8555 → 8638 is the ASII capture ALONE, centred and at full size. The
 * TradingView clip is mounted for all of it but drawn at zero opacity, so it
 * is running the whole time and arrives already at the right moment in its own
 * footage — it is not started on 8639, it is revealed on 8639.
 *
 * On 8639 the ASII clip loses 30% and the TradingView clip comes up beside it,
 * sized to whatever is left of the active width once that 30% is gone. Every
 * number below is derived from `SHRINK`, so changing it re-solves both columns.
 */
const SPLIT = { at: 84, over: 20 };
const SHRINK = 0.3;
const GAP = 32;
const ASII_W = (CLIP.h * CLIP.aspect - CLIP.inset * 2) * (1 - SHRINK);
const TV_W = theme.stage.active.w - ASII_W - GAP;
const TV_H = TV_W / TV.aspect;
const HALF = theme.canvas.width / 2;
/** The ASII clip's centre while it is alone — what it scales about. */
const CENTRE_Y = theme.margin.top + CLIP.h / 2;
const ASII_DX = theme.stage.active.x + ASII_W / 2 - HALF;
const TV_DX = theme.stage.active.x + ASII_W + GAP + TV_W / 2 - HALF;
/** Centred in the active area, on the same middle the ASII clip scales about. */
const TV_TOP = CENTRE_Y - TV_H / 2;
/**
 * ═══ THE TRADINGVIEW TREND LINE — EDIT THESE ═══
 *
 * A zigzag along the swing highs and lows of the TradingView chart, in TWO
 * stages: 8778 → 8783 draws the opening stretch, then 8838 → 8918 carries the
 * same line on to the right-hand end. It is one path traced in two passes, not
 * two lines — so the second stage continues exactly where the first stopped.
 *
 * Points are FRACTIONS of the clip's own rect: `u` 0 is its left edge and 1 its
 * right, `v` 0 its top and 1 its bottom. Written that way because the clip's
 * size is derived from SHRINK, and a line in canvas pixels would come off the
 * chart the moment either changes.
 *
 * `STAGE1_END` is the index of the last point the first pass draws. That point
 * sits ON the segment between its neighbours, so moving where the first stage
 * stops does not bend the line.
 *
 * The vertices were read off the recording's own swing highs and lows, so each
 * one rests on a wick rather than near it.
 */
const TV_TREND = {
  at: 223, // 8778
  over: 5,
  resume: 283, // 8838
  resumeOver: 80, // lands on 8918
  /**
   * IT LEAVES WHEN THE QUESTION ARRIVES. By 9118 the recording has scrolled on
   * to a later window and the line is floating over candles it was never fitted
   * to, so it un-draws right to left — retracing its own trim backwards, which
   * is the only honest way for a traced line to go.
   */
  out: { at: 563, over: 24 },
  points: [
    { u: 0.009, v: 0.659 },
    { u: 0.158, v: 0.614 },
    { u: 0.252, v: 0.718 },
    { u: 0.344, v: 0.594 }, // ← where the first stage stops
    { u: 0.448, v: 0.453 },
    { u: 0.477, v: 0.565 },
    { u: 0.618, v: 0.402 },
    { u: 0.637, v: 0.48 },
    { u: 0.661, v: 0.261 },
    { u: 0.68, v: 0.377 },
    { u: 0.796, v: 0.227 },
    { u: 0.815, v: 0.333 },
    { u: 0.923, v: 0.155 },
    { u: 0.929, v: 0.347 },
    { u: 0.938, v: 0.227 },
    { u: 0.957, v: 0.435 },
  ],
  stage1End: 3,
};
/**
 * The trend line, resolved against the clip in its UN-TRANSLATED place — it
 * lives inside the same wrapper as the footage, so it is measured where
 * `ScreenClip` puts it (centred) and carried into the column by that wrapper.
 */
const TV_LEFT = HALF - TV_W / 2;
const TV_PTS = TV_TREND.points.map((p) => ({
  x: TV_LEFT + p.u * TV_W,
  y: TV_TOP + p.v * TV_H,
}));
const TV_PATH = TV_PTS.map(
  (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
).join(" ");
/** Arc length, and how much of it the first stage is responsible for. */
const TV_RUN = TV_PTS.reduce<number[]>(
  (a, p, i) => [
    ...a,
    i === 0
      ? 0
      : a[i - 1] + Math.hypot(p.x - TV_PTS[i - 1].x, p.y - TV_PTS[i - 1].y),
  ],
  [],
);
const TV_LEN = TV_RUN[TV_RUN.length - 1];
const TV_STAGE1 = TV_RUN[TV_TREND.stage1End] / TV_LEN;
/**
 * ═══ THE DOWNTREND — EDIT THESE ═══
 *
 * Drawn once "Ternyata gagal" is on screen: the answer to the quiz, stated on
 * the chart rather than only in words.
 *
 * IT IS A ZIGZAG, NOT A STRAIGHT LINE. A single sloped line would be one claim
 * about a ceiling; what the fall actually consists of is lower high after lower
 * high, and the only way to show that is to walk the swings. It reads as the
 * mirror of the zigzag that climbed — same notation, opposite direction.
 *
 * Fractions of the clip rect, like the climb above, and the vertices were read
 * off the recording's own swing highs and lows so each rests on a wick.
 *
 * The recording is STILL between 9360 and 9575, which is the whole life of this
 * line — a path pinned to a chart that is panning would come off it at once.
 */
const TV_DOWN = {
  at: 781, // 9336 — ten frames after the verdict lands
  over: 54,
  points: [
    { u: 0.268, v: 0.155 },
    { u: 0.322, v: 0.455 },
    { u: 0.345, v: 0.214 },
    { u: 0.467, v: 0.447 },
    { u: 0.471, v: 0.283 },
    { u: 0.51, v: 0.429 },
    { u: 0.56, v: 0.283 },
    { u: 0.695, v: 0.718 },
    { u: 0.745, v: 0.614 },
    { u: 0.764, v: 0.702 },
    { u: 0.834, v: 0.545 },
    { u: 0.862, v: 0.627 },
    { u: 0.873, v: 0.548 },
    { u: 0.929, v: 0.659 },
  ],
};
const DOWN_PTS = TV_DOWN.points.map((p) => ({
  x: TV_LEFT + p.u * TV_W,
  y: TV_TOP + p.v * TV_H,
}));
const DOWN_PATH = DOWN_PTS.map(
  (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
).join(" ");
const DOWN_DRAW = DOWN_PTS.reduce(
  (a, p, i) =>
    i === 0
      ? 0
      : a + Math.hypot(p.x - DOWN_PTS[i - 1].x, p.y - DOWN_PTS[i - 1].y),
  0,
);
/**
 * ═══ THE TWO MARKS ON THE TREND LINE ═══
 *
 * The higher low and the higher high at its right-hand end — the pair that
 * makes the last leg a continuation rather than merely a rise.
 *
 * They are given as INDICES INTO `TV_TREND.points`, never as coordinates of
 * their own, so a ring cannot drift off the vertex it marks when the line is
 * edited. `hl` is the low, `hh` the high; `r` is shared, because the two are
 * one observation and a pair of different-sized rings would rank them.
 *
 * The second arrives a beat after the first: a higher low is only readable as
 * one once the high that follows it has cleared the last, so the order the
 * rings appear in is the order the reading is made in.
 */
const TV_MARKS = {
  hl: 11,
  hh: 12,
  r: 46,
  at: 375,
  stagger: 12,
  gone: 464,
  over: 18,
};
/**
 * The three highlight boxes are back ON.
 *
 * Their rects below are still written against the ASII capture at FULL size and
 * centred, and they do not need rewriting: all three live inside the ASII
 * wrapper, so the same `SHRINK` that takes 30% off the footage takes 30% off
 * them, and the same translate carries them into its column. A box therefore
 * cannot come off the chart it was measured against, whatever the layout does
 * next.
 */
const SHOW_MARKS = true;
/**
 * ═══ THE TWO HIGHLIGHTS — EDIT THESE ═══
 *
 * Canvas pixels, because what they point at is a place on a recording and
 * there is nothing else to measure against. `x1` is the LEFT edge and `x2` the
 * RIGHT, so the width of a box is x2 − x1; `y1` is its top and `y2` its
 * bottom. The footage itself runs from CLIP_X to CLIP_X + CLIP_W.
 *
 * The first begins OUTSIDE the footage on the left and stops where the
 * sideways range does, so its right edge is the claim: this far and no
 * further. The second picks up where that one stopped and runs off the right,
 * which is the breakout it is naming.
 *
 * Each opens by DRAWING rightwards out of its left edge and closes the same
 * way in reverse, so the edge that anchors the reading is the one that never
 * moves. `over` is how long that takes at each end.
 *
 * `at` is the frame it STARTS opening; `gone` is the frame it has FINISHED
 * closing — so the close begins at `gone − over`. Written that way because the
 * two boxes hand over back to back: the first is required to be off the screen
 * on the frame the second starts, and with `gone` meaning "starts leaving" it
 * was still shrinking while the next one grew.
 */
const MARKS: { at: number; gone: number; over: number; rect: HLRect }[] = [
  {
    at: 142, // 8697 — "harga bergerak sideways"
    gone: 284, // 8839
    over: 22,
    rect: { x1: CLIP_X - PAD, x2: 960, y1: 618, y2: 728 },
  },
  {
    // ── THE SECOND BOX. Its width is x2 − x1; change either to resize it. ──
    at: 285, // 8840
    gone: 551, // 9106
    over: 22,
    rect: { x1: 930, x2: CLIP_X + CLIP_W + PAD, y1: 415, y2: 700 },
  },
  {
    /**
     * The tail: where the fall stops and price steadies along the level it
     * broke down from. Starts just past the end of the trend line, so the two
     * read as one sentence — the fall, then what it ran into.
     *
     * `gone` is 9690, which this scene never reaches: it ends at 9609. The
     * close therefore never runs and the box holds to the last frame, which is
     * as far as the request can be honoured while the footage is on screen.
     */
    at: 918, // 9473
    gone: 1135, // 9690 — past this scene's last frame
    over: 22,
    rect: { x1: 1100, x2: CLIP_X + CLIP_W + PAD, y1: 596, y2: 700 },
  },
];
/**
 * The box is at full width before it is fully opaque on the way in, and fully
 * closed before it is invisible on the way out — so the eye follows the EDGE
 * travelling, not a rectangle dissolving in place.
 */
const FADE_IN_BY = 0.45;
const FADE_OUT_FROM = 0.6;
/**
 * THE QUIZ, from 9112. NOTHING MOVES for it — the pair of recordings holds
 * exactly where it is and the words are placed around it instead.
 *
 * The three parts take the three places the frame has left: the question in the
 * strip above the clips, the countdown dead centre over them, the verdict in
 * the strip below. All three are centred on the canvas, so the question, the
 * count and the answer share one vertical axis and read top to bottom.
 *
 * `y` values are CENTRES. The two strips are what is left of the active area
 * once the clips have taken their band, and the count sits on the canvas's own
 * middle rather than on either clip's.
 */
const QUIZ = {
  /** Between the safe top and the top of the clips. */
  y: 118,
  size: theme.text.title.size,
  weight: theme.text.title.weight,
  at: 563,
  /** Dead centre of the frame. */
  countY: 540,
  countSize: 120,
  /** Between the bottom of the clips and the subtitle band. */
  resultY: 908,
};
/**
 * One line, so "Quiz:" is a coloured label inside the sentence rather than a
 * heading over it.
 */
const QUIZ_LEAD = "Quiz:";
const QUIZ_TEXT = " Mampukah melewati 7300?";
/**
 * The countdown. Numerals are the one kind of type in this episode allowed to
 * POP — see Chip — because a number that faded in would still be arriving when
 * the next one is due.
 */
const COUNT = [
  { label: "3", at: 692 }, // 9247
  { label: "2", at: 710 }, // 9265
  { label: "1", at: 731 }, // 9286
];
/** The answer, in the one red this episode allows outside a candle body. */
const RESULT = { text: "Ternyata gagal", at: 771 }; // 9326
/**
 * THE RING on the peak the quiz is about — 7.475, the high that has to be
 * beaten. Round rather than boxed because it marks ONE bar, and a box across a
 * single peak would imply a range the question is not asking about.
 *
 * `cx`/`cy` are in the footage's UN-SLID coordinates: it sits inside the same
 * wrapper as the recording, so it travels with it and its numbers are read off
 * the chart before the slide, not after.
 */
const RING = { cx: 1207, cy: 468, r: 80, at: 591, gone: 724, over: 22 }; // 9146 → 9279
/**
 * ═══ THE TREND LINE — EDIT THESE ═══
 *
 * The two points it rests on, NOT the two ends of the line: the low, then the
 * lower low that confirms the fall. The ends are derived, so moving a low moves
 * the line without anyone recomputing a slope.
 *
 * UN-SLID coordinates, like the ring, so it rides with the footage. The values
 * are the WICK bottoms, not the candle bodies — this app draws its wicks grey,
 * and a line fitted to the bodies runs straight through them. Each is then
 * carried ~7px lower so the 3px stroke rests under the low rather than on it.
 *
 * `before` and `after` run the line on past each low, because a line that
 * stops exactly on its anchors reads as a measurement rather than a direction.
 *
 * It is TRACED rather than placed, like every other line in this episode.
 */
const TREND = {
  low: { x: 1027, y: 583 },
  lowerLow: { x: 1145, y: 695 },
  before: 35,
  after: 12,
  at: 804, // 9359
  over: 26,
};
const TREND_LEN = Math.hypot(
  TREND.lowerLow.x - TREND.low.x,
  TREND.lowerLow.y - TREND.low.y,
);
/** Unit vector along the two lows, so the ends extend on the same bearing. */
const TREND_U = {
  x: (TREND.lowerLow.x - TREND.low.x) / TREND_LEN,
  y: (TREND.lowerLow.y - TREND.low.y) / TREND_LEN,
};
const TREND_A = {
  x: TREND.low.x - TREND_U.x * TREND.before,
  y: TREND.low.y - TREND_U.y * TREND.before,
};
const TREND_B = {
  x: TREND.lowerLow.x + TREND_U.x * TREND.after,
  y: TREND.lowerLow.y + TREND_U.y * TREND.after,
};
const TREND_DRAW = TREND_LEN + TREND.before + TREND.after;
/**
 * THE EXIT, landing on 9609 — this scene's last frame.
 *
 * Everything leaves the way it arrived, reversed, and all on one clock: the
 * box shuts like a lid on its own centre, the trend line un-draws back to
 * where it started, the words rise and fade, and the camera whips off the
 * footage behind them. One curve drives all four, so nothing can drift out of
 * step with the rest.
 *
 * It is a whip-out rather than a true camera CUT, and it has to be: SC19 draws
 * nothing until 9692, so there is no incoming half for a cut to hand over to.
 * The move therefore has to finish the job itself — push, blur and fade all
 * land together on 9609 and the frame is empty when SC19 takes over.
 */
const EXIT = { at: 1024, over: 30, lift: 70, push: 0.14, blur: 9 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene18 = () => {
  const f = useCurrentFrame();

  /** One curve for the whole exit — see EXIT. */
  const leave = f >= EXIT.at ? progressInOut(f, EXIT.at, EXIT.over) : 0;
  /** Nothing fades until it has already moved, so the motion is what reads. */
  const held = 1 - clamp01((leave - 0.5) / 0.5);

  // ── arriving on the slide SC17 left in flight, and pulling off at the end ──
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toChart);
  /**
   * The exit blur RISES to its maximum on 9609 rather than peaking halfway.
   * A cut hides under speed, and the fastest frame here is the last one — a
   * blur that had already resolved would leave the boundary bare.
   */
  const blur = Math.max(cutBlur(g, CUTS.toChart), leave * EXIT.blur);

  /**
   * The trend line's trim, in ONE number: the first stage takes it to
   * `TV_STAGE1`, the second carries it the rest of the way. Between the two it
   * simply holds, which is what makes them read as one line pausing rather than
   * two lines being drawn.
   */
  const tvTrend =
    f >= TV_TREND.resume
      ? TV_STAGE1 +
        (1 - TV_STAGE1) * progress(f, TV_TREND.resume, TV_TREND.resumeOver)
      : f >= TV_TREND.at
        ? TV_STAGE1 * progress(f, TV_TREND.at, TV_TREND.over)
        : 0;
  /** …and it retracts when the question arrives — see TV_TREND.out. */
  const tvGone =
    f >= TV_TREND.out.at
      ? progressInOut(f, TV_TREND.out.at, TV_TREND.out.over)
      : 0;
  const tvDrawn = tvTrend * (1 - tvGone);
  /** The downtrend that answers the quiz, traced like every other line here. */
  const down = f >= TV_DOWN.at ? progress(f, TV_DOWN.at, TV_DOWN.over) : 0;

  /** Each ring closes onto its vertex, then both leave together on 9019. */
  const markOut =
    f >= TV_MARKS.gone - TV_MARKS.over
      ? progressInOut(f, TV_MARKS.gone - TV_MARKS.over, TV_MARKS.over)
      : 0;
  const markIn = (at: number) =>
    f >= at ? progressInOut(f, at, TV_MARKS.over) : 0;

  /** 0 before 8639, 1 once the pair has settled — see SPLIT. */
  const split = f >= SPLIT.at ? progressInOut(f, SPLIT.at, SPLIT.over) : 0;

  const ringIn = f >= RING.at ? progressInOut(f, RING.at, RING.over) : 0;
  const ringOut =
    f >= RING.gone - RING.over
      ? progressInOut(f, RING.gone - RING.over, RING.over)
      : 0;
  const trend = f >= TREND.at ? progress(f, TREND.at, TREND.over) : 0;
  const ask = textReveal(f, QUIZ.at);
  /** The last numeral that has arrived, and only until the verdict lands. */
  const counting = f < RESULT.at ? COUNT.filter((c) => f >= c.at).pop() : null;
  const pop = counting ? progress(f, counting.at, theme.motion.pop) : 0;
  const result = f >= RESULT.at ? textReveal(f, RESULT.at) : null;

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${dx}px) scale(${1 + EXIT.push * leave})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            /* goes with the whip, not before it: the footage is still fully
               there while the camera is still slow enough to read */
            opacity: held,
          }}
        >
          {/* the ASII column: footage, boxes, trend and ring in ONE wrapper, so
            every mark stays welded to the chart it was measured against */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${ASII_DX * split}px) scale(${1 - SHRINK * split})`,
              transformOrigin: `${HALF}px ${CENTRE_Y}px`,
            }}
          >
            <ScreenClip
              src={CLIP.src}
              height={CLIP.h}
              aspect={CLIP.aspect}
              inset={CLIP.inset}
            />
            {SHOW_MARKS &&
              MARKS.map((m) => {
                const shutAt = m.gone - m.over;
                const open = f >= m.at ? progressInOut(f, m.at, m.over) : 0;
                const shut = f >= shutAt ? progressInOut(f, shutAt, m.over) : 0;
                return (
                  <HighlightBox
                    key={m.at}
                    rect={m.rect}
                    grow={open * (1 - shut)}
                    collapse={1 - leave}
                    opacity={
                      clamp01(open / FADE_IN_BY) *
                      (1 -
                        clamp01((shut - FADE_OUT_FROM) / (1 - FADE_OUT_FROM))) *
                      held
                    }
                  />
                );
              })}

            {trend * (1 - leave) > 0.001 && (
              <Layer>
                <line
                  x1={TREND_A.x}
                  y1={TREND_A.y}
                  x2={TREND_B.x}
                  y2={TREND_B.y}
                  stroke={theme.color.indigo}
                  strokeWidth={theme.shape.line}
                  strokeLinecap="round"
                  strokeDasharray={TREND_DRAW}
                  strokeDashoffset={TREND_DRAW * (1 - trend * (1 - leave))}
                />
              </Layer>
            )}

            <HighlightCircle
              cx={RING.cx}
              cy={RING.cy}
              r={RING.r}
              settle={ringIn}
              opacity={
                clamp01(ringIn / FADE_IN_BY) *
                (1 - clamp01((ringOut - FADE_OUT_FROM) / (1 - FADE_OUT_FROM)))
              }
            />
          </div>

          {/* the TradingView column, beside it and inside the same wrapper —
            the two are one picture and have to travel together. Mounted from
            frame 0 and merely INVISIBLE before the split, so its own footage
            is already where it should be when it is revealed. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${TV_DX}px)`,
              opacity: split,
            }}
          >
            <ScreenClip
              src={TV.src}
              height={TV_H}
              aspect={TV.aspect}
              top={TV_TOP}
            />
            {tvDrawn > 0.001 && (
              <Layer>
                <path
                  d={TV_PATH}
                  fill="none"
                  stroke={theme.color.indigo}
                  strokeWidth={theme.shape.line}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={TV_LEN}
                  strokeDashoffset={TV_LEN * (1 - tvDrawn)}
                />
              </Layer>
            )}

            {/* lower high after lower high — what the failed push became */}
            {down * (1 - leave) > 0.001 && (
              <Layer>
                <path
                  d={DOWN_PATH}
                  fill="none"
                  stroke={theme.color.indigo}
                  strokeWidth={theme.shape.line}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={DOWN_DRAW}
                  strokeDashoffset={DOWN_DRAW * (1 - down * (1 - leave))}
                />
              </Layer>
            )}

            {/* the higher low, then the higher high it is read against */}
            {[TV_MARKS.hl, TV_MARKS.hh].map((i, n) => {
              const on = markIn(TV_MARKS.at + n * TV_MARKS.stagger);
              return (
                <HighlightCircle
                  key={i}
                  cx={TV_PTS[i].x}
                  cy={TV_PTS[i].y}
                  r={TV_MARKS.r}
                  settle={on}
                  opacity={
                    clamp01(on / FADE_IN_BY) *
                    (1 -
                      clamp01((markOut - FADE_OUT_FROM) / (1 - FADE_OUT_FROM)))
                  }
                />
              );
            })}
          </div>
        </div>

        {/* THREE PLACES, NOT ONE COLUMN. Each is centred on the canvas and
          rises with the same exit, so the question, the count and the answer
          still leave as one statement even though they no longer touch. */}
        {f >= QUIZ.at && held > 0.001 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: theme.text.family,
              transform: `translateY(${-EXIT.lift * leave}px)`,
              opacity: held,
            }}
          >
            {/* the question, in the strip above the clips */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: QUIZ.y,
                transform: `translateY(calc(-50% + ${ask.dy}px))`,
                textAlign: "center",
                fontSize: QUIZ.size,
                fontWeight: QUIZ.weight,
                color: theme.color.ink,
                whiteSpace: "nowrap",
                opacity: ask.opacity,
              }}
            >
              <span style={{ color: theme.color.indigo }}>{QUIZ_LEAD}</span>
              {QUIZ_TEXT}
            </div>

            {/* the count, dead centre. Numerals POP — see Chip. A number that
              faded in would still be arriving when the next one is due. */}
            {counting && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: QUIZ.countY,
                  transform: `translateY(-50%) scale(${0.94 + 0.06 * pop})`,
                  textAlign: "center",
                  fontSize: QUIZ.countSize,
                  fontWeight: QUIZ.weight,
                  color: theme.color.indigo,
                  opacity: pop,
                }}
              >
                {counting.label}
              </div>
            )}

            {/* the verdict, in the strip below the clips */}
            {result && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: QUIZ.resultY,
                  transform: `translateY(calc(-50% + ${result.dy}px))`,
                  textAlign: "center",
                  fontSize: QUIZ.size,
                  fontWeight: QUIZ.weight,
                  color: theme.color.warn,
                  whiteSpace: "nowrap",
                  opacity: result.opacity,
                }}
              >
                {RESULT.text}
              </div>
            )}
          </div>
        )}
      </div>
    </Stage>
  );
};
