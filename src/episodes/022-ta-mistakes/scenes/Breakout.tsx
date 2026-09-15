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
  Candles, Card, Layer, VerdictMark, domainOf, gridOf, inset, progressInOut,
  textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BREAKOUT_BOX } from "../data/layout";
import { BREAKOUT } from "../data/timing";
import { CTX_FAILS, CTX_SHARED, CTX_WORKS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = BREAKOUT;
const B = BREAKOUT_BOX;
// ═══════════════════════════════════════════════════════════════════════════

const TAPES = [CTX_WORKS, CTX_FAILS];
/** ⚠ SHARED — see the header. */
const DOMAIN = domainOf(
  [...CTX_WORKS.closes, ...CTX_FAILS.closes],
  [...CTX_WORKS.bars, ...CTX_FAILS.bars],
);
const GRIDS = B.boxes.map((r, i) => gridOf(TAPES[i].closes, DOMAIN, inset(r, 34), 0));

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

      {/* ═══ THE BRACKET ═══  ⚠ DRAWN IN TWO HALVES, growing outward from the
          middle, with a stub turned down at each end. It is a brace, not an
          underline: what the stubs do is gather the two columns in, and a rule
          that arrived from one side would read as a timeline instead. */}
      <Layer opacity={title.opacity}>
        {[-1, 1].map((side) => {
          const mid = (B.rule.x1 + B.rule.x2) / 2;
          const end = side < 0 ? B.rule.x1 : B.rule.x2;
          const x = mid + (end - mid) * rule;
          return (
            <g key={side}>
              <line
                x1={mid}
                y1={B.rule.y}
                x2={x}
                y2={B.rule.y}
                stroke={c.ink}
                strokeWidth={theme.shape.rule}
              />
              {rule > 0.999 ? (
                <line
                  x1={end}
                  y1={B.rule.y}
                  x2={end}
                  y2={B.rule.y + B.rule.stub}
                  stroke={c.ink}
                  strokeWidth={theme.shape.rule}
                />
              ) : null}
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
            <div
              style={{
                position: "absolute",
                left: r.x,
                top: B.head.y,
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
            <Card rect={r} opacity={on}>
              {/* ⚠ THE TAPE DRAWS ACROSS, so the two charts are watched being
                  the same and then not. Arriving finished, the identity of
                  their first two thirds is something a viewer has to go
                  looking for. */}
              <Candles
                bars={TAPES[i].bars}
                grid={GRIDS[i]}
                wipe={(k) => progressInOut(g, col.tape.at + k * col.tape.step, col.tape.over)}
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

/** Kept honest: the thing the drawing claims has to be true of the numbers. */
{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/Breakout: ${m}`);
  };
  /** ⚠ THE BARS, NOT THE CLOSES. Checking closes is what let this through the
   *  first time: they matched while every open, high and low differed, and the
   *  wicks are drawn. A claim about what is on screen has to be checked against
   *  what is on screen. */
  for (let i = 0; i < CTX_SHARED; i++) {
    const a = CTX_WORKS.bars[i];
    const b = CTX_FAILS.bars[i];
    if (a.o !== b.o || a.h !== b.h || a.l !== b.l || a.c !== b.c) {
      fail(`the two setups differ at bar ${i + 1}, so "setup-nya bisa sama" is not true of the tapes`);
    }
  }
  /** ⚠ AND THEY MUST END APART, or there is nothing to put a tick and a cross
   *  under. */
  const last = CTX_WORKS.closes.length - 1;
  if (CTX_WORKS.closes[last] <= CTX_FAILS.closes[last]) {
    fail("the trending market does not finish above the sideways one");
  }
}
