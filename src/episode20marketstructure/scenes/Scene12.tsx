/**
 * SC12 — Resistance becomes floor (from 5855, dur 496).
 *
 * The episode's callback to the Support & Resistance video, so the room grammar
 * is obeyed exactly: a CYAN band is a ceiling, an INDIGO band is a floor.
 *
 * The scene does NOT draw a second band when price breaks through — the SAME
 * band re-tints. That is the whole claim: one level, and nothing about it
 * changed except which side of it price is standing on.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { Line } from "../components/Text";
import { theme } from "../theme";
import { hold, progress, fadeOut, clamp01 } from "../helpers";
import { plot } from "../data/shape";
import { CEILING, CEILING_LEVEL, CEILING_HL } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  recall: 0, // "support dan resistance"
  breakout: 226, // "menembus resistance"
  retint: 280, // "lantai baru"
  retest: 366, // "kembali lalu memantul"
  higherLow: 419, // "higher low"
};
const DRAW_AT = [40, T.breakout, T.breakout + 64, T.retest, T.retest + 104];
const DRAW_TO = [0, 0.5, 0.62, 0.72, 1];
/** How thick the level reads on screen, in price units either side. */
const HALF = 55;
/**
 * Clear of the band, and anchored to its RIGHT end.
 *
 * The left end is where the line enters the frame, so a label there is drawn
 * through by the price. The right end is empty on the side each label sits:
 * before the break the line is on one side of the level, after it the other,
 * and each label lives on the side the line has left.
 */
const LABEL_DY = 78;
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
const RECALL_X = [700, 1000];
const PIERCE_T = 0.52;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(CEILING, BOX, { pad: 0.12 });
const LEVEL_Y = P.y(CEILING_LEVEL);

export const Scene12 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const pierce = f >= T.breakout ? clamp01((f - T.breakout) / 34) : 0;

  return (
    <Stage>
      <Card>
        <RangeBand
          x={BOX.x}
          w={BOX.w}
          top={P.y(CEILING_LEVEL + HALF)}
          bottom={P.y(CEILING_LEVEL - HALF)}
          tone="cyan"
          becomes="indigo"
          blend={retint}
          draw={f >= 30 ? progress(f, 30, 26) : 0}
          pierce={{ x: P.x(PIERCE_T), y: LEVEL_Y, amount: pierce }}
        />
        {/* the label is the only thing that swaps outright */}
        <Chip label="Resistance" x={BOX.x + BOX.w - 24} y={LEVEL_Y - LABEL_DY} tone="cyan" anchor="right" at={46} opacity={1 - retint} />
        <Chip label="Support" x={BOX.x + BOX.w - 24} y={LEVEL_Y + LABEL_DY} tone="indigo" anchor="right" at={T.retint} opacity={retint} />

        <StructureLine
          plot={P}
          draw={draw}
          head
          marks={draw >= 0.71 ? [{ turn: CEILING_HL, label: "Higher low", tone: "cyan", side: "below", at: T.higherLow }] : []}
        />
      </Card>

      {/* the recall, flashed once at the top of the scene */}
      <Chip label="Support" x={RECALL_X[0]} y={theme.stage.caption.y} tone="indigo" at={T.recall} opacity={fadeOut(f, 92, 24)} />
      <Chip label="Resistance" x={RECALL_X[1]} y={theme.stage.caption.y} tone="cyan" at={T.recall + 14} opacity={fadeOut(f, 100, 24)} />

      <Line text="Level sama, dua cerita" x={1540} y={theme.stage.caption.y} at={T.retint + 40} size={theme.text.tag.size} color={theme.color.slate} />
    </Stage>
  );
};
