/**
 * SC09 · ONE SETUP, TWO MARKETS.  `from 7311`
 *
 * Simon's sketch: a bracket across the top naming the setup, two columns under
 * it for the two markets, a chart in each, and a verdict under each chart.
 *
 * ⚠ THE TWO TAPES ARE THE SAME SETUP, BAR FOR BAR, for their first 34 — that is
 * not a resemblance, it is the same numbers, because `CTX_FAILS` is built by
 * pasting `CTX_WORKS`' head over its own (see data/series.ts). The whole
 * drawing is only worth making if that is literally true: two charts that
 * merely looked alike would let a viewer conclude the setups differed.
 *
 * ⚠ AND ONE DOMAIN ACROSS BOTH. Left to normalise themselves, each tape would
 * fill its own box and the failure would look the same size as the success —
 * which is the misreading the scene exists to prevent.
 *
 * ⚠ THE BRACKET SPANS BOTH COLUMNS. A title over each chart would say "here are
 * two setups"; one title over both says "here is one setup, twice", which is
 * the only reason the two outcomes mean anything.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Layer, VerdictMark, gridOf, progressInOut,
  textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BREAKOUT_BOX } from "../data/layout";
import { BREAKOUT } from "../data/timing";
import { SETUP_FAILS, SETUP_WORKS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = BREAKOUT;
const B = BREAKOUT_BOX;
// ═══════════════════════════════════════════════════════════════════════════

const TAPES = [SETUP_WORKS, SETUP_FAILS];
/**
 * ⚠ EACH CHART IS NORMALISED TO ITSELF. They are two different pictures of two
 * different markets, so a shared domain would be a claim that they are the same
 * instrument — and it would squash whichever moved less.
 *
 * ⚠ AND THE DOMAIN COVERS THE WICKS, not the closes: a domain solved from
 * closes alone clips the extremes of a traced tape, and the extremes are where
 * both of these stories happen.
 */
const GRIDS = B.boxes.map((r, i) =>
  gridOf(
    TAPES[i].map((b) => b.c),
    [Math.min(...TAPES[i].map((b) => b.l)), Math.max(...TAPES[i].map((b) => b.h))],
    { x: r.x + B.pad.x, y: r.y + B.pad.top, w: r.w - B.pad.x * 2, h: r.h - B.pad.top - B.pad.bottom },
    0,
  ),
);
/** ⚠ THE LOWEST BAR OF THE LEFT TAPE — where Simon wants the "Buy". Found, not
 *  counted off the picture, so it follows the trace if ss06 is ever re-read. */
/** The radius the arrows turn through. */
const ROUND = 16;
const BUY_AT = TAPES[0].reduce((best, b, i) => (b.l < TAPES[0][best].l ? i : best), 0);

export const Breakout = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const g = f + V.at;

  const title = textReveal(g, V.title.at, m.reveal);
  const rule = progressInOut(g, V.title.at, V.title.over);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />

      {/* ═══ THE TWO ARROWS ═══  Simon: the lines beside the title are arrows,
          and each one points at the middle of its own window.

          ⚠ THEY GROW OUT FROM THE TITLE, one to each side, then turn down onto
          the window they mean. One path per side, so the turn is ROUNDED rather
          than mitred — Simon — and the head only appears once that turn has
          been made: an arrowhead waiting at a destination the line has not
          reached is a label, not a gesture.

          ⚠ INDIGO, NOT INK. They are the video's own pointing, not something
          drawn on the charts, and indigo is the colour this episode thinks
          in. */}
      <Layer opacity={title.opacity}>
        {B.rule.to.map((x, i) => {
          const mid = (B.rule.to[0] + B.rule.to[1]) / 2;
          /** Which way this one leaves the title: -1 to the left, +1 right. */
          const side = x < mid ? -1 : 1;
          const run = mid + (x - mid) * rule;
          const tip = B.rule.y + B.rule.drop;
          return (
            <g key={i}>
              <path
                d={
                  rule > 0.999
                    ? /** ⚠ THE CORNER IS AN ARC, and the straight before it
                       *  stops one radius short — drawn to the corner and then
                       *  curved, the bend would bulge past where the arrow is
                       *  meant to point. */
                      `M ${mid} ${B.rule.y} H ${x - side * ROUND} Q ${x} ${B.rule.y} ${x} ${B.rule.y + ROUND} V ${tip}`
                    : `M ${mid} ${B.rule.y} H ${run}`
                }
                fill="none"
                stroke={c.indigo}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
              />
              {rule > 0.999
                ? [-1, 1].map((wing) => (
                    <line
                      key={wing}
                      x1={x}
                      y1={tip}
                      x2={x + wing * 9}
                      y2={tip - 13}
                      stroke={c.indigo}
                      strokeWidth={theme.shape.line}
                      strokeLinecap="round"
                    />
                  ))
                : null}
            </g>
          );
        })}
      </Layer>
      {/* ⚠ THE TITLE SITS ON THE RULE with the ground showing through behind it,
          so the brace reads as broken by the words rather than crossed out by
          them. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: B.rule.y,
          transform: `translateY(calc(-50% + ${title.dy}px))`,
          textAlign: "center",
          opacity: title.opacity,
        }}
      >
        <span
          style={{
            background: c.bg,
            padding: "0 26px",
            fontFamily: theme.text.family,
            fontSize: theme.text.body.size,
            fontWeight: 800,
            color: c.ink,
          }}
        >
          {V.setup}
        </span>
      </div>

      {B.boxes.map((r, i) => {
        const col = V.cols[i];
        const on = progressInOut(g, col.at, col.over);
        if (on <= 0.001) return null;
        const head = textReveal(g, col.at, m.reveal);
        const said = textReveal(g, V.verdict.at + i * V.verdict.step, m.reveal);
        return (
          <div key={i} style={{ position: "absolute", inset: 0 }}>
            <Card rect={r} opacity={on}>
              {/* ⚠ THE NAME SITS INSIDE ITS OWN WINDOW — Simon: top-left corner.
                  Outside, the two names were labels on a diagram; inside, each
                  one is the window saying which market it is. */}
              <div
                style={{
                  position: "absolute",
                  left: r.x + B.head.x,
                  top: r.y + B.head.y,
                  transform: `translateY(calc(-50% + ${head.dy}px))`,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: 700,
                  color: c.slate,
                  opacity: head.opacity,
                }}
              >
                {V.heads[i]}
              </div>
              {/* ⚠ THE TAPE DRAWS ACROSS, so the two charts are watched being
                  the same and then not. Arriving finished, the identity of
                  their first two thirds is something a viewer has to go
                  looking for. */}
              <Candles
                bars={TAPES[i]}
                grid={GRIDS[i]}
                wipe={(k) => progressInOut(g, col.tape.at + k * col.tape.step, col.tape.over)}
              />
              {/* ═══ THE ENTRY ═══  Simon: white "Buy" on the lowest candle of
                  the left chart, and none on the right — not yet.

                  ⚠ GREEN UNDER WHITE, WHICH IS THE ONE FORM THIS EPISODE LETS
                  GREEN TAKE ON A WORD: a filled badge is plainly a label on
                  something, where green ink beside a chart would read as the
                  video's own call. It is also the same object as the "Buy"
                  badges at 4356.

                  ⚠ AND IT SITS UNDER THE LOW, in the inset the plot leaves
                  inside the card — so it marks the bar without covering it. */}
              {i === 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: GRIDS[0].x(BUY_AT),
                    top: GRIDS[0].y(TAPES[0][BUY_AT].l) + 22,
                    transform: "translate(-50%, -50%)",
                    padding: "5px 13px",
                    borderRadius: theme.shape.chipRadius,
                    background: theme.color.ok,
                    color: theme.color.onIndigo,
                    fontFamily: theme.text.family,
                    fontSize: theme.text.tag.size,
                    fontWeight: 800,
                    opacity: progressInOut(g, col.tape.at + BUY_AT * col.tape.step, col.tape.over),
                  }}
                >
                  Buy
                </div>
              ) : null}
            </Card>
            {/* ═══ AND WHAT EACH ONE CAME TO ═══ */}
            <div
              style={{
                position: "absolute",
                left: r.x,
                top: B.verdict.y,
                transform: `translateY(calc(-50% + ${said.dy}px))`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: theme.text.family,
                fontSize: theme.text.body.size,
                fontWeight: 700,
                color: c.ink,
                opacity: said.opacity,
              }}
            >
              <VerdictMark kind={i === 0 ? "check" : "cross"} size={38} />
              {V.says[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Kept honest. */
{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/Breakout: ${m}`);
  };
  /** ⚠ THE BUY MARK HAS TO STAY INSIDE ITS CARD. It hangs below the lowest bar,
   *  which is the one place on the chart with nothing under it — and therefore
   *  the one place a badge can run out of card. */
  const r = B.boxes[0];
  const y = GRIDS[0].y(TAPES[0][BUY_AT].l) + 22;
  if (y + 20 > r.y + r.h) {
    fail(`the Buy mark reaches ${(y + 20).toFixed(0)}, past the card's floor at ${r.y + r.h}`);
  }
  /** And it must be on the lowest bar, which is what Simon asked for. */
  const lowest = Math.min(...TAPES[0].map((b) => b.l));
  if (TAPES[0][BUY_AT].l !== lowest) fail("the Buy mark is not on the lowest candle");
}
