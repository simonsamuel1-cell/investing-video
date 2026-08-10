/**
 * SC08 — Principle card (from 3508, dur 406).
 *
 * The only scene with no chart to read. A muted line keeps drifting up behind
 * the card — the market does not stop while you hold a principle — and it runs
 * FULL BLEED, edge to edge, so it reads as one chart passing behind the card
 * rather than two stray marks either side of it.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { PrincipleCard } from "../components/PrincipleCard";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { plot } from "../data/shape";
import { DRIFT } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  drift: 0, // "tren masih berlanjut"
  card: 115, // "sampai chart benar-benar menunjukkan"
  contrast: 236, // "bukan menebak"
};
const SENTENCE = "Tren berlanjut sampai chart membuktikan sebaliknya.";
const CARD = { x: 300, y: 300, w: 1320, h: 268 };
const CHIP = { y: 884, dx: 200 };
/** Edge to edge on purpose — a line that stopped at the margin reads as debris. */
const BOX = { x: 0, y: 360, w: theme.canvas.width, h: 440 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(DRIFT, BOX, { pad: 0.14 });

export const Scene08 = () => {
  const f = useCurrentFrame();
  const drift = progress(f, T.drift, 300);
  const guessIn = fadeIn(f, T.contrast - 46, 16);
  const strike = f >= T.contrast ? progress(f, T.contrast, 16) : 0;
  const guessOut = f >= T.contrast + 26 ? fadeOut(f, T.contrast + 26, 20) : 1;
  const know = f >= T.contrast + 22 ? progress(f, T.contrast + 22, 16) : 0;

  return (
    <Stage>
      {/* the market, still moving, deliberately quiet */}
      <StructureLine plot={P} draw={drift} color={theme.color.slate} width={2} opacity={0.35} />

      <PrincipleCard sentence={SENTENCE} rect={CARD} at={T.card} />

      {/* the job, stated as a contrast: not guessing — recognising */}
      <Chip
        label="Menebak"
        x={theme.canvas.width / 2 - CHIP.dx}
        y={CHIP.y}
        tone="slate"
        anchor="right"
        at={T.contrast - 46}
        strike={strike}
        opacity={guessIn * guessOut}
      />
      <Chip label="Mengenali" x={theme.canvas.width / 2 + CHIP.dx} y={CHIP.y} tone="indigo" anchor="left" at={T.contrast + 22} opacity={know} check />
    </Stage>
  );
};
