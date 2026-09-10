/**
 * SC03 — probabilitas, bukan kepastian. `from 1140 · dur 855`
 *
 * The premise the rest of the video stands on, and the one scene that has to
 * make its point without a chart: the split frame IS the argument.
 *
 * ⚠ NOT ONE NUMBER IN THIS SCENE. No win rate, no probability, no score, no
 * "7 dari 10". An uncapped probability is precisely what the compliance line
 * forbids, and it would also be a fabricated number — there is no study behind
 * it. Two panes and a strike say the same thing and are true.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Line, SplitDivider, Stage, Words,
  progress, splitRects, theme, usePalette,
} from "../../../core";
import { BLOCK, PREMISE, local } from "../data/timing";
import { GAP } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC03;
const V = PREMISE;
// ═══════════════════════════════════════════════════════════════════════════

const [LEFT, RIGHT] = splitRects(GAP);

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const open = progress(f, local(V.split.at, FROM), V.split.over);

  return (
    <Stage>
      <Line
        text="Intinya:"
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.intinya, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      <Card rect={LEFT} opacity={open} soft />
      <Card rect={RIGHT} opacity={open} soft />
      <SplitDivider at={local(V.split.at, FROM)} over={V.split.over} />

      <Line
        text="PROBABILITAS"
        x={LEFT.x + LEFT.w / 2}
        y={LEFT.y + LEFT.h * 0.2}
        at={local(V.labels, FROM)}
        size={theme.text.title.size}
        weight={theme.text.title.weight}
        color={c.indigo}
      />
      <Line
        text="KEPASTIAN"
        x={RIGHT.x + RIGHT.w / 2}
        y={RIGHT.y + RIGHT.h * 0.2}
        at={local(V.labels, FROM)}
        size={theme.text.title.size}
        weight={theme.text.title.weight}
        color={c.muted}
      />

      <Words
        text="SETUP BAGUS → KUALITAS KEPUTUSAN NAIK"
        x={LEFT.x + LEFT.w / 2}
        y={LEFT.y + LEFT.h * 0.52}
        at={local(V.left, FROM)}
        anchor="center"
        maxWidth={LEFT.w * 0.8}
        size={theme.text.body.size}
      />
      <Words
        text="≠ JAMINAN HASIL"
        x={RIGHT.x + RIGHT.w / 2}
        y={RIGHT.y + RIGHT.h * 0.52}
        at={local(V.right, FROM)}
        anchor="center"
        maxWidth={RIGHT.w * 0.8}
        size={theme.text.body.size}
        color={c.slate}
      />

      <Line
        text="SETUP LENGKAP TETAP BISA GAGAL."
        x={theme.canvas.width / 2}
        y={theme.stage.caption.y}
        at={local(V.close, FROM)}
        size={theme.text.title.size}
        weight={theme.text.title.weight}
      />
    </Stage>
  );
};
