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
import { Stage } from "../components/Stage";
import { ScreenClip } from "../components/ScreenClip";
import { HighlightBox, type HLRect } from "../components/HighlightBox";
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
];
/**
 * The box is at full width before it is fully opaque on the way in, and fully
 * closed before it is invisible on the way out — so the eye follows the EDGE
 * travelling, not a rectangle dissolving in place.
 */
const FADE_IN_BY = 0.45;
const FADE_OUT_FROM = 0.6;
/**
 * THE QUIZ, from 9112. The recording steps aside and the question is put in
 * words beside it — the chart stays on screen because the answer is IN it.
 *
 * `shift` is how far the footage moves left; the text column starts clear of
 * where it lands. Everything in the column shares `x`, so the question, the
 * count and the verdict all hang off one left edge.
 */
const QUIZ = {
  slide: { at: 557, shift: 450, over: 26 },
  x: 880,
  /** TOP of the question, not its centre — the answer stacks below it. */
  y: 396,
  size: theme.text.title.size,
  weight: theme.text.title.weight,
  at: 563,
  /** From the top of the question down to the top of the answer. */
  gap: 150,
  countSize: 120,
};
/**
 * One line, so "Quiz:" is a coloured label inside the sentence rather than a
 * heading over it.
 *
 * The question and the answer share ONE inline-block column, which is why the
 * numerals can be centred on the question without anyone measuring the text:
 * the column shrinks to the question's own width and the count is centred
 * inside it. Change the wording and the centring follows by itself.
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
// ═══════════════════════════════════════════════════════════════════════════

export const Scene18 = () => {
  const f = useCurrentFrame();

  // ── arriving on the slide SC17 left in flight ──
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toChart);
  const blur = cutBlur(g, CUTS.toChart);

  const slide =
    f >= QUIZ.slide.at
      ? progressInOut(f, QUIZ.slide.at, QUIZ.slide.over) * -QUIZ.slide.shift
      : 0;
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
          transform: dx === 0 ? undefined : `translateX(${dx}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: slide === 0 ? undefined : `translateX(${slide}px)`,
          }}
        >
          <ScreenClip
            src={CLIP.src}
            height={CLIP.h}
            aspect={CLIP.aspect}
            inset={CLIP.inset}
          />
          {MARKS.map((m) => {
            const shutAt = m.gone - m.over;
            const open = f >= m.at ? progressInOut(f, m.at, m.over) : 0;
            const shut = f >= shutAt ? progressInOut(f, shutAt, m.over) : 0;
            return (
              <HighlightBox
                key={m.at}
                rect={m.rect}
                grow={open * (1 - shut)}
                opacity={
                  clamp01(open / FADE_IN_BY) *
                  (1 - clamp01((shut - FADE_OUT_FROM) / (1 - FADE_OUT_FROM)))
                }
              />
            );
          })}
        </div>

        {/* the question, beside the chart that answers it. Inline-block, so
          the column is exactly as wide as the question and the count below
          can centre on it without anyone measuring the type. */}
        {f >= QUIZ.at && (
          <div
            style={{
              position: "absolute",
              left: QUIZ.x,
              top: QUIZ.y,
              display: "inline-block",
              fontFamily: theme.text.family,
            }}
          >
            <div
              style={{
                fontSize: QUIZ.size,
                fontWeight: QUIZ.weight,
                color: theme.color.ink,
                whiteSpace: "nowrap",
                opacity: ask.opacity,
                transform: `translateY(${ask.dy}px)`,
              }}
            >
              <span style={{ color: theme.color.indigo }}>{QUIZ_LEAD}</span>
              {QUIZ_TEXT}
            </div>

            {/* numerals POP — see Chip. A number that faded in would still be
              arriving when the next one is due. */}
            {counting && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: QUIZ.gap,
                  textAlign: "center",
                  fontSize: QUIZ.countSize,
                  fontWeight: QUIZ.weight,
                  color: theme.color.indigo,
                  opacity: pop,
                  transform: `scale(${0.94 + 0.06 * pop})`,
                }}
              >
                {counting.label}
              </div>
            )}

            {/* left-aligned on the question, so the answer reads as its reply */}
            {result && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: QUIZ.gap,
                  fontSize: QUIZ.size,
                  fontWeight: QUIZ.weight,
                  color: theme.color.warn,
                  whiteSpace: "nowrap",
                  opacity: result.opacity,
                  transform: `translateY(${result.dy}px)`,
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
