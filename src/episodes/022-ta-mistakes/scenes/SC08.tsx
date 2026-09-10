/**
 * SC08 — confirmation bias. `from 5954 · dur 1080`
 *
 * Six pieces of evidence on one ambiguous tape: three that support the
 * scenario, three that argue against it. A highlight box grows around the
 * supporting three and the other three FADE — the viewer watches the bias
 * happen instead of being told about it.
 *
 * ⚠ f6917 HAS NO AIR. Cue 31 ("…membuktikan aku salah?") runs straight into
 * cue 32 ("Ini membantu tetap objektif."). The box collapses and the three
 * ignored markers come back to full on that same frame — one move, no pause.
 *
 * ⚠ THE TWO QUESTIONS ARE VERBATIM, curly quotes included. They are the
 * subtitle running underneath them.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chart, CrossMark, HighlightBox, Line, Stage, Words,
  domainOf, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { BIASED, BLOCK, local } from "../data/timing";
import { FULL } from "../data/layout";
import { BIAS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC08;
const V = BIASED;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(BIAS.closes, BIAS.bars);

export const SC08 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const grid = gridOf(BIAS.closes, DOMAIN, FULL, 0.12, 110);

  const grow = progress(f, local(V.box.at, FROM), V.box.over);
  const collapse = progress(f, local(V.collapse, FROM), m.fade);
  /* the three that argue the other way go quiet, then come back */
  const ignored = 1 - progress(f, local(V.fade.at, FROM), V.fade.over) * 0.88 + collapse * 0.88;

  const supporting = V.marks.filter((q) => q.supports);
  const xs = supporting.map((q) => grid.x(q.i));
  const pad = theme.text.chip.size;

  return (
    <Stage>
      <Card rect={theme.stage.card} opacity={progress(f, local(V.chart.at, FROM), m.fade)} soft />
      <Chart
        series={BIAS}
        grid={grid}
        at={local(V.chart.at, FROM)}
        over={V.chart.over}
        baseline={false}
      />

      {V.marks.map((q) => (
        <div key={q.i} style={{ opacity: q.supports ? 1 : ignored }}>
          <CrossMark
            index={q.i}
            value={BIAS.closes[q.i]}
            grid={grid}
            at={local(V.chart.at, FROM) + m.reveal}
            tone={q.supports ? "primary" : "cyan"}
          />
        </div>
      ))}

      {/* ⚠ THE BOX IS DRAWN ROUND THE SUPPORTING MARKS THEMSELVES, from the
          grid — not around a rectangle chosen by eye, which stops matching the
          moment a mark index changes. */}
      <HighlightBox
        rect={{
          x1: Math.min(...xs) - pad,
          y1: grid.box.y,
          x2: Math.max(...xs) + pad,
          y2: grid.box.y + grid.box.h,
        }}
        grow={grow}
        collapse={collapse}
      />

      <Line
        text="cuma melihat yang mendukung"
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.box.at, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      {g >= V.q1 && (
        <Words
          text="“Apa yang membuat analisisku benar?”"
          x={theme.stage.card.x + theme.stage.card.w * 0.26}
          y={theme.stage.caption.y}
          at={local(V.q1, FROM)}
          anchor="center"
          size={theme.text.body.size}
          color={c.muted}
        />
      )}
      {g >= V.q2 && (
        <Words
          text="“Apa yang bisa membuktikan aku salah?”"
          x={theme.stage.card.x + theme.stage.card.w * 0.74}
          y={theme.stage.caption.y}
          at={local(V.q2, FROM)}
          anchor="center"
          size={theme.text.body.size}
          weight={theme.text.chip.weight}
          marks={[{ text: "membuktikan aku salah", color: theme.color.hlCyan }]}
        />
      )}
    </Stage>
  );
};
