/**
 * SC12 — Resistance becomes floor (from 5855, dur 496).
 *
 * The episode's callback to the Support & Resistance video, so the room grammar
 * is obeyed exactly: a CYAN band is a ceiling, an INDIGO band is a floor.
 *
 * The scene does NOT draw a second band when price passes through — the SAME
 * band re-tints. That is the whole claim: one level, and nothing about it
 * changed except which side of it price is standing on.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { Statement } from "../components/Header";
import { theme } from "../theme";
import { progress, fadeOut, clamp01 } from "../helpers";
import { BREAK_UP, BREAK_UP_LEVEL, BREAK_UP_HL, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  recall: 0, // "support dan resistance"
  breakout: 226, // "menembus resistance"
  retint: 280, // "lantai baru"
  retest: 366, // "kembali lalu memantul"
  hl: 419, // "higher low"
};
/** Keyed so the line is always where the narration says it is. */
const DRAW_KEYS = [40, T.breakout, T.breakout + 64, T.retest, T.retest + 104];
const DRAW_VALS = [0, 0.5, 0.62, 0.72, 1];
/** How thick the level reads on screen, in price units either side. */
const BAND_HALF = 55;
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
const RECALL_X = [700, 1000];
const PIERCE_T = 0.52;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(BREAK_UP, BOX, { pad: 0.12 });
const LEVEL_Y = G.y(BREAK_UP_LEVEL);

export const Scene12 = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, DRAW_KEYS, DRAW_VALS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const pierce = f >= T.breakout ? clamp01((f - T.breakout) / 34) : 0;

  return (
    <SafeArea>
      <ChartCard>
        <RangeBand
          x={BOX.x}
          w={BOX.w}
          yTop={G.y(BREAK_UP_LEVEL + BAND_HALF)}
          yBottom={G.y(BREAK_UP_LEVEL - BAND_HALF)}
          variant="cyan"
          variantTo="indigo"
          blend={retint}
          draw={f >= 30 ? progress(f, 30, 26) : 0}
          pierce={{ x: G.x(PIERCE_T), y: LEVEL_Y, amount: pierce }}
        />
        {/* the label is the only thing that swaps outright */}
        <Chip label="Resistance" x={BOX.x + 24} y={LEVEL_Y - 44} variant="cyan" anchor="left" startFrame={46} opacity={1 - retint} />
        <Chip label="Support" x={BOX.x + 24} y={LEVEL_Y + 44} variant="indigo" anchor="left" startFrame={T.retint} opacity={retint} />

        <StructureLine
          g={G}
          draw={draw}
          head
          pivots={draw >= 0.71 ? [{ index: BREAK_UP_HL, label: "Higher Low", variant: "cyan", side: "below", startFrame: T.hl }] : []}
        />
      </ChartCard>

      {/* the recall, flashed once at the top of the scene */}
      <Chip label="Support" x={RECALL_X[0]} y={theme.frame.captionY} variant="indigo" startFrame={T.recall} opacity={fadeOut(f, 92, 24)} />
      <Chip label="Resistance" x={RECALL_X[1]} y={theme.frame.captionY} variant="cyan" startFrame={T.recall + 14} opacity={fadeOut(f, 100, 24)} />

      <Statement
        text="Level Sama, Dua Cerita"
        x={1520}
        y={theme.frame.captionY}
        startFrame={T.retint + 40}
        size={theme.type.small.size}
        color={theme.colors.slate}
      />
    </SafeArea>
  );
};
