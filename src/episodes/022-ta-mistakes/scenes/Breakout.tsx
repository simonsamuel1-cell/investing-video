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
  Candles, Card, Layer, Level, VerdictMark, candleWidth, gridOf, progressInOut,
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
    {
      x: r.x + B.pad[i].x,
      y: r.y + B.pad[i].top,
      w: r.w - B.pad[i].x * 2,
      h: r.h - B.pad[i].top - B.pad[i].bottom,
    },
    0,
  ),
);
/** The radius the arrows turn through. */
const ROUND = 16;
const M = B.mark;

/**
 * ═══ WHERE THE TRADE IS READ OFF ═══
 *
 * ⚠ THE LEFT ENTRY IS FOUND, THE RIGHT ONE IS COUNTED. Simon named them
 * differently and they are different KINDS of claim: on the trending tape the
 * support is the lowest wick there is, so it must be searched for and will
 * follow ss06 if that is ever re-traced; on the sideways tape it is "candle ke
 * 16", a bar Simon picked by eye off ss07 because that is where the range's
 * floor is — a number, and a number is what it has to stay.
 */
const BUY_AT = [
  TAPES[0].reduce((best, b, i) => (b.l < TAPES[0][best].l ? i : best), 0),
  15,
];
/** And both trades are closed on the last bar but one — Simon, for both. */
const SELL_AT = TAPES.map((t) => t.length - 2);
/** The level each entry was taken at: the low of the bar it is read off. */
const SUPPORT = BUY_AT.map((k, i) => TAPES[i][k].l);

/**
 * ═══ WHERE A MARK LANDS ═══  Solved once, so the drawing and the checks at the
 * foot of this file cannot disagree about it.
 *
 * ⚠ SIMON'S 30 IS BORDER TO BORDER — the dot's edge to the label's, which is
 * why the radius is part of the sum and not merely near it. I have got this
 * wrong before by measuring a rounded cap instead of a height, so every piece
 * of this group has a size declared in layout rather than left to the text
 * inside it.
 *
 * ⚠ THE GROUP IS CLAMPED INTO ITS CARD. Both "Sell" marks sit on the last bar
 * but one, 76px from the card's side — centred on their own candle they would
 * hang over the edge, so the group slides in while the dot stays where the
 * price is. The dot is the claim; the label only has to be findable.
 *
 * ⚠ AND IT IS PUSHED CLEAR OF ITS OWN SUPPORT LINE. The sideways chart closes
 * BELOW the level it bought, so its "Sell" hangs up into exactly the band the
 * level runs through — and a caption laid over a line ends the line as far as
 * the eye is concerned, which on the right card hid 135px of it. Pushing the
 * group instead of breaking the line keeps the level a level; the extra
 * distance is only ever spent on the side that needs it.
 */
const markBox = (i: number, bar: number, side: "low" | "high", note: boolean) => {
  const g = GRIDS[i];
  const r = B.boxes[i];
  const x = g.x(bar);
  const y = g.y(side === "low" ? TAPES[i][bar].l : TAPES[i][bar].h);
  const h = M.pill + (note ? M.stack + M.note : 0);
  const level = g.y(SUPPORT[i]);
  let top = side === "low" ? y + M.dot + M.gap : y - M.dot - M.gap - h;
  /** ⚠ AND IT ONLY MOVES IF THE LINE ACTUALLY RUNS THROUGH IT, and then only
   *  further along the way it already hangs. Pushed to the near side instead,
   *  a group would cross back over the candle it is naming — which is the one
   *  thing Simon ruled out. Today this fires once, on the sideways card. */
  if (level > top && level < top + h) {
    top = side === "low" ? level + M.stack : level - M.stack - h;
  }
  const left = Math.min(
    Math.max(x - M.group / 2, r.x + M.edge),
    r.x + r.w - M.edge - M.group,
  );
  return { x, y, left, top, h, card: r };
};

/** A dot on a wick and the label that hangs off it. */
const Mark = ({
  i, bar, side, word, fill, note, show,
}: {
  i: number;
  bar: number;
  /** Which wick the dot sits on, and therefore which way the label hangs. */
  side: "low" | "high";
  word: string;
  fill: string;
  note?: string;
  show: { opacity: number; dy: number };
}) => {
  const c = usePalette();
  const { x, y, left, top } = markBox(i, bar, side, note !== undefined);
  if (show.opacity <= 0.001) return null;
  return (
    <>
      <Layer opacity={show.opacity}>
        <circle cx={x} cy={y} r={M.dot} fill={c.indigo} />
      </Layer>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: M.group,
          textAlign: "center",
          fontFamily: theme.text.family,
          opacity: show.opacity,
          transform: `translateY(${show.dy}px)`,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: M.pill,
            padding: "0 13px",
            borderRadius: theme.shape.chipRadius,
            background: fill,
            color: theme.color.onIndigo,
            fontSize: theme.text.tag.size,
            fontWeight: 800,
          }}
        >
          {word}
        </span>
        {note ? (
          <div
            style={{
              marginTop: M.stack,
              height: M.note,
              lineHeight: `${M.note}px`,
              fontSize: theme.text.tag.size,
              fontWeight: 700,
              color: c.ink,
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
    </>
  );
};

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
          {V.setup.lead}{" "}
          {/* ⚠ ONLY THE RULE IS COLOURED — Simon. "Setup:" is a label and stays
              ink; what follows is the thing both charts are about, so it is the
              one indigo phrase in the title. */}
          <span style={{ color: c.indigo }}>{V.setup.term}</span>
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
              {/* ═══ THE LEVEL THE TRADE WAS READ AGAINST ═══  Simon: a
                  support line on the lowest wick of the trending chart, and on
                  candle 16 of the sideways one.

                  ⚠ IT IS DRAWN AFTER ITS TAPE, so it arrives as the reading of
                  a chart already watched rather than as a line the market is
                  then fitted to. Indigo and 3px — the weight every other level
                  in this episode carries.

                  ⚠ AND IT IS THE ONLY THING THE TWO CHARTS SHARE. Left, the
                  price leaves it and does not come back; right, it is bought
                  and then lost. The whole scene is that one difference. */}
              <Level
                value={SUPPORT[i]}
                grid={GRIDS[i]}
                at={V.marks[i].support.at - V.at}
                over={V.marks[i].support.over}
                width={theme.shape.line}
              />
              {/* ═══ THE ENTRY ═══  Simon: an indigo dot on the wick, and the
                  "Buy" 30px off it.

                  ⚠ GREEN UNDER WHITE, WHICH IS THE ONE FORM THIS EPISODE LETS
                  GREEN TAKE ON A WORD: a filled badge is plainly a label on
                  something, where green ink beside a chart would read as the
                  video's own call. It is the same object as the "Buy" badges at
                  4356. */}
              <Mark
                i={i}
                bar={BUY_AT[i]}
                side="low"
                word="Buy"
                fill={theme.color.ok}
                show={textReveal(g, V.marks[i].buy.at, V.marks[i].buy.over)}
              />
              {/* ═══ AND THE EXIT ═══  Simon: "Sell" on the last bar but one —
                  hanging BELOW it on the trending chart, ABOVE it on the
                  sideways one, with what the trade came to underneath.

                  ⚠ THE SIDE IS NOT A STYLE CHOICE. Left, the exit is high and
                  the room is beneath it; right, the exit is low and the room is
                  above. Each label hangs into the empty half of its own
                  chart. */}
              <Mark
                i={i}
                bar={SELL_AT[i]}
                side={i === 0 ? "low" : "high"}
                word="Sell"
                fill={theme.color.warn}
                note={i === 0 ? "Profit 20%" : "Loss 20%"}
                show={textReveal(g, V.marks[i].sell.at, V.marks[i].sell.over)}
              />
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
  /** The left entry must be on the lowest bar, which is what Simon asked for;
   *  the right one on candle 16, counted his way — from one. */
  const lowest = Math.min(...TAPES[0].map((b) => b.l));
  if (TAPES[0][BUY_AT[0]].l !== lowest) fail("the left Buy is not on the lowest candle");
  if (BUY_AT[1] !== 15) fail(`the right Buy is on candle ${BUY_AT[1] + 1}, not candle 16`);
  SELL_AT.forEach((k, i) => {
    if (k !== TAPES[i].length - 2) fail(`window ${i + 1}'s Sell is not on the last bar but one`);
  });
  /** ⚠ AND THE LEVEL WAITS FOR ITS OWN TAPE. timing.ts can only bound this with
   *  a guessed bar count; the real length lives here, so the check does too. */
  V.cols.forEach((col, i) => {
    const drawn = col.tape.at + (TAPES[i].length - 1) * col.tape.step + col.tape.over;
    if (V.marks[i].support.at < drawn) {
      fail(`window ${i + 1}'s support is drawn at ${V.marks[i].support.at}, while its tape is still building until ${drawn.toFixed(0)}`);
    }
  });

  /**
   * ⚠ NOTHING MAY LAND ON A CANDLE — Simon: "segala label dan text tidak
   * bertabrakan dengan candle apapun ya". Checked as rectangles against every
   * bar of the tape, not against the few bars near the mark: the group is 180
   * wide and reaches five candles either side of the one it names, and a check
   * that only looked at the neighbours would pass while the far end of the
   * label sat on a wick.
   *
   * ⚠ AND THE WHOLE GROUP IS THE BOX, not the pill inside it. The pill is
   * narrower and centred, so testing the pill would let the note — which is the
   * wider of the two — go anywhere it liked.
   */
  const marks = [0, 1].flatMap((i) => {
    const one = (bar: number, side: "low" | "high", note: boolean, name: string) => {
      const q = markBox(i, bar, side, note);
      return { i, name, card: q.card, x0: q.left, x1: q.left + M.group, y0: q.top, y1: q.top + q.h };
    };
    return [
      one(BUY_AT[i], "low", false, `window ${i + 1}'s Buy`),
      one(SELL_AT[i], i === 0 ? "low" : "high", true, `window ${i + 1}'s Sell`),
    ];
  });
  for (const m of marks) {
    const r = m.card;
    if (m.y1 > r.y + r.h) {
      fail(`${m.name} reaches ${m.y1.toFixed(0)}, past its card's floor at ${r.y + r.h}`);
    }
    if (m.y0 < r.y) fail(`${m.name} starts at ${m.y0.toFixed(0)}, above its card's top at ${r.y}`);
    if (m.x0 < r.x || m.x1 > r.x + r.w) fail(`${m.name} runs outside its card`);
    const g = GRIDS[m.i];
    const w = candleWidth(g);
    TAPES[m.i].forEach((b, k) => {
      const c0 = g.x(k) - w / 2;
      const c1 = g.x(k) + w / 2;
      if (c1 > m.x0 && c0 < m.x1 && g.y(b.l) > m.y0 && g.y(b.h) < m.y1) {
        fail(`${m.name} lands on candle ${k + 1}`);
      }
    });
    /** ⚠ AND NOT ON ITS OWN LEVEL EITHER — the push above is only worth having
     *  if something proves it happened. */
    const level = GRIDS[m.i].y(SUPPORT[m.i]);
    if (level > m.y0 && level < m.y1) fail(`${m.name} lies across its support line`);
  }
}
