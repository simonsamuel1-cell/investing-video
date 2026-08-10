/**
 * SC08 — Principle card (from 3508, dur 406).
 *
 * The only scene with no chart to read. A muted line keeps drifting up behind
 * the card — the market does not stop while you hold a principle — and it runs
 * FULL BLEED so it reads as one chart passing behind the card rather than two
 * stray marks either side of it.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { PrincipleCard } from "../components/PrincipleCard";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { DRIFT, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  drift: 0, // "tren masih berlanjut"
  card: 115, // "sampai chart benar-benar menunjukkan"
  contrast: 236, // "bukan menebak"
};
const LINE = "Tren berlanjut sampai chart membuktikan sebaliknya.";
const CARD_BOX = { x: 300, y: 300, w: 1320, h: 268 };
const CHIP_Y = 880;
const CHIP_DX = 200;
const BOX = { x: 0, y: 360, w: theme.canvas.width, h: 440 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(DRIFT, BOX, { pad: 0.14 });

export const Scene08 = () => {
  const f = useCurrentFrame();
  const drift = progress(f, T.drift, 300);
  const guessIn = fadeIn(f, T.contrast - 46, 16);
  const strike = f >= T.contrast ? progress(f, T.contrast, 16) : 0;
  const guessOut = f >= T.contrast + 26 ? fadeOut(f, T.contrast + 26, 20) : 1;
  const know = f >= T.contrast + 22 ? progress(f, T.contrast + 22, 16) : 0;

  return (
    <SafeArea>
      {/* the market, still moving, deliberately quiet */}
      <StructureLine g={G} draw={drift} color={theme.colors.slate} width={2} opacity={0.35} />

      <PrincipleCard sentence={LINE} box={CARD_BOX} startFrame={T.card} />

      {/* the job, stated as a contrast: not guessing — recognising */}
      <Chip
        label="Menebak"
        x={theme.canvas.width / 2 - CHIP_DX}
        y={CHIP_Y}
        variant="slate"
        anchor="right"
        startFrame={T.contrast - 46}
        strike={strike}
        opacity={guessIn * guessOut}
      />
      <Chip label="Mengenali" x={theme.canvas.width / 2 + CHIP_DX} y={CHIP_Y} variant="indigo" anchor="left" startFrame={T.contrast + 22} opacity={know} check />
    </SafeArea>
  );
};
