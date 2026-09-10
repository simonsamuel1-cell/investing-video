/**
 * SC11 — hindsight bias. `from 8968 · dur 1037`
 *
 * ⚠ THE REVEAL MASK RUNS BACKWARDS HERE, and that is the whole scene.
 * Everywhere else in the library a mask OPENS to show what happened; this one
 * CLOSES over a chart that is already finished and already annotated, taking
 * the obvious reading away with it. What is left is the tape the viewer would
 * actually have had — which is unreadable, and is the point.
 *
 * ⚠ IT IS INTRODUCED HERE ON PURPOSE. SC12–SC13 use the same device on the
 * real case, so it has to be a thing the viewer has already seen work rather
 * than a trick that arrives with the example.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Chart, Chip, Level, Line, Stage,
  domainOf, fadeOut, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, HINDSIGHT, local } from "../data/timing";
import { FULL } from "../data/layout";
import { HIND, HIND_MASK } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC11;
const V = HINDSIGHT;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(HIND.closes, HIND.bars);
/** Bars up to the decision — the half that stays. */
const PAST = { ...HIND, bars: HIND.bars.slice(0, HIND_MASK + 1) };

export const SC11 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const grid = gridOf(HIND.closes, DOMAIN, FULL, 0.12, 110);

  /**
   * ⚠ 1 → 0: THE FUTURE IS DRAWN AND THEN TAKEN AWAY, which is the opposite of
   * every other reveal in the library and is the whole scene. A RevealMask was
   * the obvious way to do it and it is wrong here — the mask paints in the
   * PAGE ground and this chart stands on a white card, so it left a grey block
   * where the future had been. Fading the bars themselves leaves the card
   * intact and reads as "you did not have this", not "something is covering
   * it".
   */
  const future = 1 - progress(f, local(V.hide.at, FROM), V.hide.over);
  /** the "obvious" reading lives only while the future does */
  const obvious = fadeOut(f, local(V.hide.at, FROM), V.hide.over);

  return (
    <Stage>
      <Line
        text={g >= V.hide.at ? "…dan ini yang sebenarnya kamu punya" : "chart sering terlihat sangat jelas"}
        key={g >= V.hide.at ? "b" : "a"}
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(g >= V.hide.at ? V.hide.at : V.obvious, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      <Card rect={theme.stage.card} opacity={progress(f, local(V.chart.at, FROM), m.fade)} soft />

      {/* the tape the viewer actually had — it never leaves */}
      <Chart
        series={PAST}
        grid={grid}
        at={local(V.chart.at, FROM)}
        over={V.chart.over}
        baseline={false}
      />
      {/* …and the part that only exists in hindsight */}
      <Candles
        bars={HIND.bars}
        grid={grid}
        from={HIND_MASK + 1}
        shown={progress(f, local(V.chart.at, FROM), V.chart.over)}
        opacity={future}
      />

      {/* the reading that only exists once it has happened */}
      <div style={{ opacity: obvious }}>
        <Level
          value={HIND.closes[HIND_MASK]}
          grid={grid}
          at={local(V.obvious, FROM)}
          over={m.sec(0.6)}
          label="BREAKOUT — “ya jelas dong”"
        />
      </div>

      {g >= V.note && (
        <Line
          text="DI SINI, KITA BELUM TAHU."
          x={grid.x(HIND_MASK) + theme.text.chip.size}
          y={grid.box.y + grid.box.h * 0.24}
          at={local(V.note, FROM)}
          anchor="left"
          size={theme.text.body.size}
          weight={theme.text.chip.weight}
          color={c.slate}
        />
      )}

      {g >= V.chips && (
        <>
          <Chip
            label="HASIL"
            x={theme.stage.card.x + theme.stage.card.w * 0.36}
            y={theme.stage.caption.y}
            at={local(V.chips, FROM)}
            tone="slate"
            pill
          />
          <Chip
            label="PROSES"
            x={theme.stage.card.x + theme.stage.card.w * 0.62}
            y={theme.stage.caption.y}
            at={local(V.chips, FROM) + m.pop}
            tone="indigo"
            check
            pill
          />
        </>
      )}

      {g >= V.close && (
        <Line
          text="NILAI PROSESNYA, BUKAN HANYA HASILNYA."
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.5}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
    </Stage>
  );
};
