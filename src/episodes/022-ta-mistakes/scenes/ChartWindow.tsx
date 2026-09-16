/**
 * SC11 · ONE WINDOW, CENTRED.  `from 9320 · to 10185`
 *
 * ⚠ THE BULLISH FLAG FROM SIMON'S REFERENCE SHEET — the Flag cell under
 * Bullish Patterns in chart pattern.webp. Sixteen bars traced off that drawing,
 * and the two converging lines that make it a flag rather than a run of
 * candles.
 *
 * ⚠ ONE WINDOW NOW, AND IT IS THE HALF THAT WAS LEFT — Simon: "remove 1 window,
 * lalu geser window 1 nya lagi ke tengah". A shift, not a resize: it is still
 * exactly the size it was as half of a pair, standing on the frame's own
 * centre-line. See WIN11 in data/layout.ts, where that is asserted.
 *
 * ⚠ THE SCENE STILL DRAWS A LIST, and that is on purpose. This has been one
 * window, then two, then one again; `W11_COUNT` in data/layout.ts is the whole
 * difference and nothing here counts. What is below maps over whatever it is
 * handed.
 *
 * ⚠ AND EACH WINDOW SOLVES ITS OWN GRID inside its own box, rather than sharing
 * one — which is what let the pair be identical without either of them being
 * drawn in the other's pixels, and is why going back to two needs no change here.
 *
 * ⚠ NO "Entry" AND NO ARROW. The reference labels an entry on the breakout and
 * draws an arrow down to it. Both are directional markers, scripts/audit.mjs is
 * right to refuse them, and they are the one part of that cell that cannot come
 * across. The pattern is the drawing; the instruction is not.
 *
 * ⚠ NO PRICE SCALE, NO GRIDLINES, NO TIME AXIS. core/Chart is here for its
 * left-to-right build — the animation Simon kept — and everything it would
 * otherwise draw is turned off. A pattern diagram with a price scale is a
 * chart of something, and this is a chart of nothing in particular.
 *
 * ⚠ THE LINES DRAW, THEY DO NOT FADE. They are a reading OF the candles, so
 * they arrive after them and they arrive by being drawn from the triangle's
 * mouth to its apex — which is where the bars put it. See FLAG_LINES.
 *
 * ⚠ AND THE WEDGE IS OPENED 5° WIDER THAN THE BARS ASK FOR — Simon: "gedein
 * sudutnya 5 derajat", so it clears the candles rather than hugging them. The
 * apex is the pivot, so the point the two converge to has not moved. See
 * flagWedge in data/layout.ts.
 *
 * ⚠ THE LAST THREE BARS ARE HIDDEN — Simon: "hide 3 candlestick dari kanan",
 * which are the breakout. On a scene about hindsight that is the whole picture:
 * the flag, and no answer yet. The domain still reserves their room, so nothing
 * moves when they come back.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Layer, Line, Stage,
  domainOf, drawPath, fadeOut, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11, flagWedge } from "../data/layout";
import { FLAG, FLAG_BARS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
// ═══════════════════════════════════════════════════════════════════════════

const NAME = "Flag";
/**
 * ⚠ THE DOMAIN IS THE WHOLE TAPE, INCLUDING THE BARS THAT ARE HIDDEN. That is
 * what makes them HIDDEN rather than removed: the price scale still reserves
 * their room, so the thirteen on screen sit exactly where they sat and nothing
 * moves when the three come back. It also leaves the top of the plot empty,
 * which on a scene about not knowing what comes next is the right kind of
 * empty — a chart that had re-fitted itself around the missing future would be
 * making the opposite point.
 */
const DOMAIN = domainOf(FLAG.closes, FLAG_BARS);
/** ⚠ SLICED, NOT RE-INDEXED. core/Candles maps index k of what it is given onto
 *  grid.x(k), so dropping bars off the END leaves every remaining one where it
 *  was. Dropping them off the front would not. */
const SHOWN = FLAG_BARS.slice(0, FLAG_BARS.length - W.hidden);

/** ⚠ SOLVED ONCE, AT MODULE LOAD. One grid per window, each inside its own box
 *  — so two windows would be identical without sharing a coordinate space. */
const GRIDS = W.plots.map((box) => gridOf(FLAG.closes, DOMAIN, box, W.plotPad));

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const open = progress(f, local(V.card, V.at), m.fade);
  const drawn = progress(f, local(V.lines, V.at), m.sec(0.5));
  const out = fadeOut(f, local(V.out, V.at), m.fade);

  return (
    <Stage>
      <div style={{ opacity: out }}>
        {W.cards.map((rect, i) => (
          <Card key={`win${i}`} rect={rect} opacity={open} soft />
        ))}

        {/* ⚠ core/Candles DIRECTLY, NOT core/Chart. Chart was here for its
            left-to-right build and everything else it draws was already turned
            off; its `shown` is a fraction of the whole series, and hiding the
            last three bars is exactly a thing that fraction cannot say. The
            build is the one line it was providing. */}
        {GRIDS.map((g, i) => (
          <Candles
            key={`bars${i}`}
            bars={SHOWN}
            grid={g}
            shown={progress(f, local(V.candles, V.at), m.sec(0.83))}
          />
        ))}

        {/* ⚠ MOUNTED ON THEIR OWN FRAME. An animated path that exists before
            its beat is a path that flashes its end state on frame zero. */}
        {f >= local(V.lines, V.at) &&
          GRIDS.map((g, i) => (
            <Layer key={`lines${i}`}>
              {flagWedge(g).map((e, k) => (
                <line
                  key={k}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={c.indigo}
                  strokeWidth={W.wedge.width}
                  strokeLinecap="round"
                  {...drawPath(drawn, Math.hypot(e.x2 - e.x1, e.y2 - e.y1))}
                />
              ))}
            </Layer>
          ))}

        {W.names.map((n, i) => (
          <Line
            key={`name${i}`}
            text={NAME}
            x={n.x}
            y={n.y}
            at={local(V.name, V.at)}
            size={theme.text.chip.size}
            weight={theme.text.chip.weight}
            color={c.slate}
          />
        ))}
      </div>
    </Stage>
  );
};
