/**
 * SC10 — indicator overload. `from 7965 · dur 1003`
 *
 * The chart starts clean and is CROWDED on screen: five panes arrive between
 * f8112 and f8283, and the price pane gives up height for each one until it is
 * squeezed. The crowding is the argument, so the geometry has to actually
 * crowd — a scene that merely says "too many indicators" over a comfortable
 * chart is asking to be taken on trust.
 *
 * ⚠ THE STACK NEVER GROWS DOWNWARD. Five panes fit by getting SHORTER, inside
 * theme.stage.plot — see layout.overloadStack, which asserts it. Growing down
 * would reach the 108px subtitle band.
 *
 * ⚠ THREE OF THE FIVE ARE THE SAME MESSAGE, and it is true of the numbers, not
 * of a label: data/series.ts asserts they correlate above 0.9 before the build
 * is allowed to run.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, IndicatorLine, Line, Stage,
  domainOf, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, OVERLOAD, local } from "../data/timing";
import { OVERLOAD_PANES, overloadStack } from "../data/layout";
import { OVER_PANES, OVER_TAPE } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC10;
const V = OVERLOAD;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(OVER_TAPE.closes, OVER_TAPE.bars);
/** Widened once, here — `V.similar` is a frozen tuple of literals and a pane
 *  index is just a number. */
const SAME: number[] = [...OVERLOAD.similar];
/** Room for a pane's name, inside the pane. */
const LABEL_W = 210;

export const SC10 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /** How many panes have arrived. Stepped, not eased — a pane either exists or
   *  it does not, and half a pane is not a state the argument has. */
  const added = Math.max(
    0,
    Math.min(OVERLOAD_PANES, Math.floor((g - V.add.at) / V.add.step) + 1),
  );
  const stack = overloadStack(added);
  const grid = gridOf(OVER_TAPE.closes, DOMAIN, stack.price, 0.12, 110);
  const merge = progress(f, local(V.merge.at, FROM), V.merge.over);

  return (
    <Stage>
      <Line
        text="Jangan terjebak indicator overload."
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.name, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      <Card rect={theme.stage.card} opacity={progress(f, local(V.chart.at, FROM), m.fade)} soft />

      <Candles
        bars={OVER_TAPE.bars}
        grid={grid}
        shown={progress(f, local(V.chart.at, FROM), V.chart.over)}
      />

      {stack.panes.map((box, i) => {
        const same = SAME.includes(i);
        /* the three that read alike are lit at 8450 and then fold together */
        const dim = g >= V.lit && !same ? 1 - merge * 0.75 : 1;
        const fold = same ? 1 - merge : 1;
        /** ⚠ THE LINE STARTS AFTER THE LABEL. A pane 40px tall has no room for
         *  a caption above it, so the name sits inside — and a line drawn from
         *  the box's own left edge runs straight through the word. */
        const pg = gridOf(
          OVER_PANES[i].values,
          domainOf(OVER_PANES[i].values),
          { ...box, x: box.x + LABEL_W, w: box.w - LABEL_W },
          0.18,
        );
        return (
          <div key={OVER_PANES[i].name} style={{ opacity: dim }}>
            {/* ⚠ EACH PANE IS A BOX, NOT A LOOSE LINE. Drawn as five bare
                squiggles the stack read as faint decoration, and the scene's
                whole claim is that the chart has been CROWDED — the crowding
                has to be visible before the fold can mean anything. */}
            <div
              style={{
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
                borderRadius: theme.shape.panelRadius,
                background: g >= V.lit && same ? theme.color.cyanWash : theme.color.slateWash,
                opacity: fold,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: box.x + theme.shape.panelRadius,
                top: box.y + box.h / 2,
                transform: "translateY(-50%)",
                fontFamily: theme.text.mono,
                fontSize: theme.text.axis.size,
                color: g >= V.lit && same ? c.cyan : c.slate,
                opacity: fold,
              }}
            >
              {OVER_PANES[i].name}
            </div>
            <div style={{ opacity: fold }}>
              <IndicatorLine
                values={OVER_PANES[i].values}
                grid={pg}
                at={local(V.add.at + i * V.add.step, FROM)}
                over={m.sec(0.5)}
                tone={g >= V.lit && same ? "cyan" : "primary"}
              />
            </div>
          </div>
        );
      })}

      {/* what the three collapse INTO */}
      {merge > 0.02 && (
        <div style={{ opacity: merge }}>
          <Line
            text="SAMA-SAMA MOMENTUM"
            x={theme.stage.plot.x}
            y={stack.panes[SAME[0]].y + stack.panes[SAME[0]].h / 2}
            at={local(V.merge.at, FROM)}
            anchor="left"
            size={theme.text.body.size}
            weight={theme.text.chip.weight}
            color={c.cyan}
          />
        </div>
      )}

      {g >= V.close && (
        <Line
          text="LEBIH BANYAK INDIKATOR ≠ LEBIH BANYAK INSIGHT."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
    </Stage>
  );
};
