/**
 * SC07 — revenge trading. `from 5031 · dur 923`
 *
 * The whole scene is one arrow that should not exist: a loss on the left, a
 * new trade on the right, and a loop between them drawn FAST — the speed is
 * the argument, because "buru-buru masuk lagi" is what is being described.
 *
 * ⚠ THEN THE LOOP IS CUT, NOT ERASED. The claim is not that the two are
 * unrelated in the trader's head; it is that the relation does not exist in
 * the market. A struck link says that. A missing link says nothing happened.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chip, Line, MarkerArrow, Stage, Words,
  progress, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, REVENGE, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC07;
const V = REVENGE;
// ═══════════════════════════════════════════════════════════════════════════

const BOX = theme.stage.card;
const ROW = BOX.y + BOX.h * 0.34;
const L = { x: BOX.x + BOX.w * 0.2, y: ROW };
const R = { x: BOX.x + BOX.w * 0.8, y: ROW };

export const SC07 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  return (
    <Stage>
      <Line
        text="Lalu ada revenge trading."
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.name, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      <Card rect={BOX} opacity={progress(f, local(V.name, FROM), m.fade)} soft />

      <Chip label="LOSS" x={L.x} y={L.y} at={local(V.loss, FROM)} tone="warn" pill />
      <Chip
        label="TRADE BERIKUTNYA"
        x={R.x}
        y={R.y}
        at={local(V.next, FROM)}
        tone="slate"
        pill
      />

      {/* ⚠ THE LOOP RUNS OVER `V.loop.over`, WHICH IS SHORT ON PURPOSE. Given
          a comfortable draw it reads as a considered decision, which is the
          opposite of what the voice is describing. */}
      <MarkerArrow
        from={{ x: L.x + theme.text.chip.size * 2, y: L.y - theme.text.chip.size }}
        to={{ x: R.x - theme.text.chip.size * 3.4, y: R.y - theme.text.chip.size }}
        bow={0.42}
        at={local(V.loop.at, FROM)}
        over={V.loop.over}
      />

      {g >= V.cut && (
        <>
          <Chip
            label="✗"
            x={theme.canvas.width / 2}
            y={ROW - theme.text.chip.size * 2.1}
            at={local(V.cut, FROM)}
            tone="warn"
          />
          <Words
            text="loss sebelumnya tidak membuat setup berikutnya lebih valid"
            x={theme.canvas.width / 2}
            y={BOX.y + BOX.h * 0.56}
            at={local(V.caption, FROM)}
            anchor="center"
            maxWidth={BOX.w * 0.62}
            size={theme.text.body.size}
            color={c.slate}
          />
        </>
      )}

      {g >= V.verdict && (
        <Line
          text="BELUM ADA SETUP → JANGAN TRADE"
          x={theme.canvas.width / 2}
          y={BOX.y + BOX.h * 0.74}
          at={local(V.verdict, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
      {g >= V.close && (
        <Line
          text="SETIAP TRADE BARU = ATURAN YANG SAMA."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
          color={c.indigo}
        />
      )}
    </Stage>
  );
};
