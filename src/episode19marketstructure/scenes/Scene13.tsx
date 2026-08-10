/**
 * SC13 — Support becomes ceiling (from 6351, dur 500).
 *
 * The mirror of SC12, using the same band mechanism in the other direction: an
 * indigo floor is broken and re-tints cyan into a ceiling. The bounce back into
 * it is REJECTED, which is what makes the pivot a lower high.
 *
 * The closing pair says the two readings are one event: `Breakout` and
 * `Perubahan Struktur` joined by an equals. The chart dims almost out under it
 * so the pairing is the only thing being read.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, clamp01 } from "../helpers";
import { BREAK_DOWN, BREAK_DOWN_LEVEL, BREAK_DOWN_LH, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  breakdown: 91, // "support ditembus"
  retint: 126, // "langit-langit baru"
  bounce: 223, // "memantul ke sana"
  lh: 276, // "lower high"
  paired: 351, // "breakout dan perubahan struktur"
};
const DRAW_KEYS = [20, T.breakdown, T.breakdown + 64, T.bounce, T.bounce + 104];
const DRAW_VALS = [0, 0.5, 0.62, 0.72, 1];
const BAND_HALF = 55;
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
const PIERCE_T = 0.52;
/** Centre-y of the closing pair, over the dimmed chart. */
const PAIRED = { y: 510, dx: 300 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(BREAK_DOWN, BOX, { pad: 0.12 });
const LEVEL_Y = G.y(BREAK_DOWN_LEVEL);

export const Scene13 = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, DRAW_KEYS, DRAW_VALS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const pierce = f >= T.breakdown ? clamp01((f - T.breakdown) / 34) : 0;
  const paired = f >= T.paired ? progress(f, T.paired, 26) : 0;
  const lhPoint = G.pivot(BREAK_DOWN_LH);

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - paired * 0.9 }}>
        <ChartCard>
          <RangeBand
            x={BOX.x}
            w={BOX.w}
            yTop={G.y(BREAK_DOWN_LEVEL + BAND_HALF)}
            yBottom={G.y(BREAK_DOWN_LEVEL - BAND_HALF)}
            variant="indigo"
            variantTo="cyan"
            blend={retint}
            draw={f >= 10 ? progress(f, 10, 26) : 0}
            pierce={{ x: G.x(PIERCE_T), y: LEVEL_Y, amount: pierce }}
          />
          <Chip label="Support" x={BOX.x + 24} y={LEVEL_Y + 44} variant="indigo" anchor="left" startFrame={26} opacity={1 - retint} />
          <Chip label="Resistance" x={BOX.x + 24} y={LEVEL_Y - 44} variant="cyan" anchor="left" startFrame={T.retint} opacity={retint} />

          <StructureLine
            g={G}
            draw={draw}
            head
            pivots={draw >= 0.71 ? [{ index: BREAK_DOWN_LH, label: "Lower High", variant: "indigo", startFrame: T.lh }] : []}
          />

          {/* a small tick, not an alarm: the structure is being read, not traded */}
          {draw >= 0.71 && f >= T.lh + 12 && (
            <Layer>
              <path d={`M ${lhPoint.x + 44},${lhPoint.y - 8} l 13,22 l -26,0 z`} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.rule} />
            </Layer>
          )}
        </ChartCard>
      </div>

      {/* the two views, side by side, joined by an equals */}
      {paired > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: paired }}>
          <Chip label="Breakout" x={theme.canvas.width / 2 - PAIRED.dx} y={PAIRED.y} variant="cyan" size={theme.type.header.size} startFrame={T.paired} />
          <Chip
            label="Perubahan Struktur"
            x={theme.canvas.width / 2 + PAIRED.dx}
            y={PAIRED.y}
            variant="indigo"
            size={theme.type.header.size}
            startFrame={T.paired + 12}
          />
          <Layer>
            <line x1={theme.canvas.width / 2 - 26} y1={PAIRED.y - 10} x2={theme.canvas.width / 2 + 26} y2={PAIRED.y - 10} stroke={theme.colors.slate} strokeWidth={theme.stroke.line} />
            <line x1={theme.canvas.width / 2 - 26} y1={PAIRED.y + 10} x2={theme.canvas.width / 2 + 26} y2={PAIRED.y + 10} stroke={theme.colors.slate} strokeWidth={theme.stroke.line} />
          </Layer>
        </div>
      )}
    </SafeArea>
  );
};
