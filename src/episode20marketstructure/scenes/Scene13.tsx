/**
 * SC13 — Support becomes ceiling (from 6351, dur 500).
 *
 * The mirror of SC12, on the same band mechanism in the other direction: an
 * indigo floor is broken and re-tints cyan into a ceiling. The bounce back into
 * it is REJECTED, and that rejection is what makes the turn a lower high.
 *
 * IT IS THE SAME BAND, NOT A NEW ONE. Nothing fades at 6351 — SC12's level is
 * inherited in place, already drawn, and this scene's chart is positioned to
 * meet it. What DOES leave is the previous line: the labels go with the cut and
 * the line slides out to the left, so the level is left standing alone with
 * nothing on it, ready for the second story.
 *
 * IT ENDS ON A QUOTE, at 6698. Everything drawn clears — chart, band, labels —
 * and the scene's conclusion is stated in words over an empty frame, under the
 * Tuntun AI mark. Nothing is left to read but the sentence, which is the point:
 * the two names the scene has been juggling turn out to be one thing.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { TuntunMark } from "../components/TuntunMark";
import { theme } from "../theme";
import { hold, progress, progressInOut, clamp01, textReveal } from "../helpers";
import { CUTS, cutOut, cutBlur } from "../transitions/CameraCut";
import { plot } from "../data/shape";
import { FLOOR, FLOOR_LEVEL, FLOOR_LH } from "../data/shapes";
import { HANDOFF } from "./Scene12";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  label: 36, // the level is named again once it is standing on its own
  breakdown: 91, // "support ditembus"
  retint: 126, // "langit-langit baru"
  bounce: 223, // "memantul ke sana"
  lowerHigh: 276, // "lower high"
  quote: 347, // 6698 — the chart clears and the conclusion is stated
};
/** How long SC12's line takes to clear the frame, starting on this scene's 0. */
const EXIT_OVER = 30;
const DRAW_AT = [34, T.breakdown, T.breakdown + 64, T.bounce, T.bounce + 104];
const DRAW_TO = [0, 0.5, 0.62, 0.72, 1];
/** The band's own thickness lives in SC12 now — this scene inherits it. */
const LABEL_DY = 78;
const PIERCE_T = 0.52;
/**
 * THE CLOSING QUOTE.
 *
 * `CLEAR_OVER` is how long the chart takes to go; the mark and the two lines
 * follow it in, one beat apart, so the frame is never carrying both pictures.
 * The block sits a little above centre because the subtitle band owns the
 * bottom 108px and a quote centred on the canvas reads as crowding it.
 */
const CLEAR_OVER = 18;
const QUOTE = {
  markY: 250,
  markH: 150,
  /** Centre of the first line; the second sits one `lead` below. */
  y: 540,
  lead: 92,
  size: 62,
  weight: 700,
  /** The rule under the quote, and how far below the second line it sits. */
  ruleW: 120,
  ruleDy: 116,
};
const QUOTE_LINES = [
  "Breakout dan perubahan struktur",
  "sering menggambarkan hal yang sama.",
];
/** How far the mark drifts up and down, and how long one full cycle takes. */
const MARK_FLOAT = { amount: 12, period: 96 };
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 6351;
// ═══════════════════════════════════════════════════════════════════════════

const BOX0 = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 30,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 100,
};
/**
 * The band does not move across the cut, so THIS chart moves to meet it.
 *
 * `plot()` normalises every curve to its own box, and FLOOR is CEILING's mirror
 * — its level sits high in its range where CEILING's sits low. Left alone the
 * two would land ~93px apart, and the one thing this pair of scenes is about
 * would visibly jump at the cut. So the box is shifted by exactly that gap.
 */
const DY = HANDOFF.level - plot(FLOOR, BOX0, { pad: 0.12 }).y(FLOOR_LEVEL);
const BOX = { ...BOX0, y: BOX0.y + DY };
const P = plot(FLOOR, BOX, { pad: 0.12 });
const LEVEL_Y = HANDOFF.level;
/** Far enough that the line's right-hand end is past the card's left edge. */
const EXIT_X = BOX0.x + BOX0.w + 40;

export const Scene13 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const pierce = f >= T.breakdown ? clamp01((f - T.breakdown) / 34) : 0;
  const exit = progressInOut(f, 0, EXIT_OVER);
  /** Everything drawn goes to zero — not dimmed, gone. */
  const clear = f >= T.quote ? progressInOut(f, T.quote, CLEAR_OVER) : 0;

  // ── leaving on the rise CG-B arrives on ──
  const g = f + SCENE_FROM;
  const dy = cutOut(g, CUTS.toQuestion);
  const blur = cutBlur(g, CUTS.toQuestion);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: dy === 0 ? undefined : `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {clear < 0.999 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - clear }}>
            <Card>
              {/* inherited, not drawn: `draw` is 1 on frame 0 because SC12 already
            finished drawing it 496 frames ago */}
              <RangeBand
                x={BOX0.x}
                w={BOX0.w}
                top={HANDOFF.top}
                bottom={HANDOFF.bottom}
                tone="indigo"
                becomes="cyan"
                blend={retint}
                pierce={{ x: P.x(PIERCE_T), y: LEVEL_Y, amount: pierce }}
              />
              <Chip
                label="Support"
                x={BOX0.x + BOX0.w - 24}
                y={LEVEL_Y + LABEL_DY}
                tone="indigo"
                anchor="right"
                at={T.label}
                opacity={1 - retint}
              />
              <Chip
                label="Resistance"
                x={BOX0.x + BOX0.w - 24}
                y={LEVEL_Y - LABEL_DY}
                tone="cyan"
                anchor="right"
                at={T.retint}
                opacity={retint}
              />

              {/* SC12's line, still where it ended, leaving to the left. Clipped to
            the card, because a line on its way out is a line running off an
            edge — off the card's edge, not off the canvas. */}
              {exit < 0.999 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `inset(0px ${theme.canvas.width - (theme.stage.card.x + theme.stage.card.w)}px 0px ${theme.stage.card.x}px)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: `translateX(${-EXIT_X * exit}px)`,
                    }}
                  >
                    <StructureLine plot={HANDOFF.plot} draw={1} />
                  </div>
                </div>
              )}

              <StructureLine
                plot={P}
                draw={draw}
                head
                marks={
                  draw >= 0.71
                    ? [
                        {
                          turn: FLOOR_LH,
                          label: "Lower high",
                          tone: "indigo",
                          at: T.lowerHigh,
                        },
                      ]
                    : []
                }
              />
            </Card>
          </div>
        )}

        {f >= T.quote + 6 && <QuoteCard f={f} />}
      </div>
    </Stage>
  );
};

/**
 * The quote itself: mark, two lines, rule. The opening and closing marks are
 * indigo and the sentence is ink, so the frame reads as a quotation without a
 * second colour arguing inside the words.
 */
const QuoteCard = ({ f }: { f: number }) => {
  const mark = textReveal(f, T.quote + 6);
  const rule = textReveal(f, T.quote + 40);
  const cx = theme.canvas.width / 2;
  /**
   * The mark breathes. A sine starting at its own zero, so it leaves rest
   * exactly as it arrives and the entrance is never fighting the drift.
   */
  const float =
    Math.sin(((f - T.quote) / MARK_FLOAT.period) * Math.PI * 2) *
    MARK_FLOAT.amount;

  return (
    <>
      <TuntunMark
        x={cx}
        y={QUOTE.markY + mark.dy + float}
        height={QUOTE.markH}
        opacity={mark.opacity}
      />
      {QUOTE_LINES.map((text, i) => {
        const line = textReveal(f, T.quote + 18 + i * 10);
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: 0,
              top: QUOTE.y + i * QUOTE.lead,
              width: theme.canvas.width,
              transform: `translateY(calc(-50% + ${line.dy}px))`,
              textAlign: "center",
              fontFamily: theme.text.family,
              fontSize: QUOTE.size,
              fontWeight: QUOTE.weight,
              color: theme.color.ink,
              opacity: line.opacity,
              whiteSpace: "nowrap",
            }}
          >
            {i === 0 && <span style={{ color: theme.color.indigo }}>“</span>}
            {text}
            {i === QUOTE_LINES.length - 1 && (
              <span style={{ color: theme.color.indigo }}>”</span>
            )}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: cx - QUOTE.ruleW / 2,
          top:
            QUOTE.y +
            (QUOTE_LINES.length - 1) * QUOTE.lead +
            QUOTE.ruleDy +
            rule.dy,
          width: QUOTE.ruleW,
          height: theme.shape.rule,
          background: theme.color.indigo,
          opacity: rule.opacity,
        }}
      />
    </>
  );
};
