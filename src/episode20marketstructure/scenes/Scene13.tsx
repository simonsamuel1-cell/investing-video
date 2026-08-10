/**
 * SC13 — Support becomes ceiling (from 6351, dur 500).
 *
 * The mirror of SC12, on the same band mechanism in the other direction: an
 * indigo floor is broken and re-tints cyan into a ceiling. The bounce back into
 * it is REJECTED, and that rejection is what makes the turn a lower high.
 *
 * The closing pair says the two readings are one event — `Breakout` and
 * `Perubahan struktur` joined by an equals. The chart dims almost out beneath
 * it so the pairing is the only thing being read.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress, clamp01 } from "../helpers";
import { plot } from "../data/shape";
import { FLOOR, FLOOR_LEVEL, FLOOR_LH } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  breakdown: 91, // "support ditembus"
  retint: 126, // "langit-langit baru"
  bounce: 223, // "memantul ke sana"
  lowerHigh: 276, // "lower high"
  paired: 351, // "breakout dan perubahan struktur"
};
const DRAW_AT = [20, T.breakdown, T.breakdown + 64, T.bounce, T.bounce + 104];
const DRAW_TO = [0, 0.5, 0.62, 0.72, 1];
const HALF = 55;
const LABEL_DY = 78;
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
const PIERCE_T = 0.52;
/** The closing pair, centred over the dimmed chart. */
const PAIR = { y: 520, dx: 300 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(FLOOR, BOX, { pad: 0.12 });
const LEVEL_Y = P.y(FLOOR_LEVEL);

export const Scene13 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const pierce = f >= T.breakdown ? clamp01((f - T.breakdown) / 34) : 0;
  const paired = f >= T.paired ? progress(f, T.paired, 26) : 0;
  const lh = P.turn(FLOOR_LH);

  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - paired * 0.9 }}>
        <Card>
          <RangeBand
            x={BOX.x}
            w={BOX.w}
            top={P.y(FLOOR_LEVEL + HALF)}
            bottom={P.y(FLOOR_LEVEL - HALF)}
            tone="indigo"
            becomes="cyan"
            blend={retint}
            draw={f >= 10 ? progress(f, 10, 26) : 0}
            pierce={{ x: P.x(PIERCE_T), y: LEVEL_Y, amount: pierce }}
          />
          <Chip label="Support" x={BOX.x + BOX.w - 24} y={LEVEL_Y + LABEL_DY} tone="indigo" anchor="right" at={26} opacity={1 - retint} />
          <Chip label="Resistance" x={BOX.x + BOX.w - 24} y={LEVEL_Y - LABEL_DY} tone="cyan" anchor="right" at={T.retint} opacity={retint} />

          <StructureLine plot={P} draw={draw} head marks={draw >= 0.71 ? [{ turn: FLOOR_LH, label: "Lower high", tone: "indigo", at: T.lowerHigh }] : []} />

          {/* a small tick, not an alarm: the structure is being read, not traded */}
          {draw >= 0.71 && f >= T.lowerHigh + 12 && (
            <Layer>
              <path d={`M ${lh.x + 46},${lh.y - 8} l 13,22 l -26,0 z`} fill="none" stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
            </Layer>
          )}
        </Card>
      </div>

      {/* the two views, side by side, joined by an equals */}
      {paired > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: paired }}>
          <Chip label="Breakout" x={theme.canvas.width / 2 - PAIR.dx} y={PAIR.y} tone="cyan" size={theme.text.title.size} at={T.paired} />
          <Chip label="Perubahan struktur" x={theme.canvas.width / 2 + PAIR.dx} y={PAIR.y} tone="indigo" size={theme.text.title.size} at={T.paired + 12} />
          <Layer>
            <line x1={theme.canvas.width / 2 - 26} y1={PAIR.y - 10} x2={theme.canvas.width / 2 + 26} y2={PAIR.y - 10} stroke={theme.color.slate} strokeWidth={theme.shape.line} />
            <line x1={theme.canvas.width / 2 - 26} y1={PAIR.y + 10} x2={theme.canvas.width / 2 + 26} y2={PAIR.y + 10} stroke={theme.color.slate} strokeWidth={theme.shape.line} />
          </Layer>
        </div>
      )}
    </Stage>
  );
};
