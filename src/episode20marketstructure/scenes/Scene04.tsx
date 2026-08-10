/**
 * SC04 — Why the shape forms (from 1450, dur 515).
 *
 * The mechanism, drawn once and slowly. The pullback stops ABOVE the last low
 * because interest is still there, and that "above" is the entire scene — so it
 * is MEASURED on screen: a dashed line at the prior low, and a cyan bracket
 * spanning the gap the pullback never closed.
 *
 * The line pauses between legs rather than running at one speed. Each leg is a
 * different decision, and the pause is where the narration explains it.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine, Reference } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress } from "../helpers";
import { plot } from "../data/shape";
import { MECHANISM } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  rise: 49, // "pembeli lebih agresif"
  pullback: 179, // "mengambil untung dan harga turun"
  floor: 332, // "pembeli masuk sebelum harga"
  newHigh: 442, // "puncak baru"
};
/** Keyed to the turns, so the line is always where the narration says it is. */
const DRAW_AT = [T.rise, T.rise + 96, T.pullback, T.pullback + 92, T.newHigh, T.newHigh + 62];
const DRAW_TO = [0, 0.36, 0.36, 0.62, 0.62, 1];
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
const BRACKET_DX = 58;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(MECHANISM, BOX, { pad: 0.12 });
const LOW = P.turn(0); // the prior low the pullback must respect
const PEAK = P.turn(1);
const TROUGH = P.turn(2); // where the pullback actually stopped

export const Scene04 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const floor = f >= T.floor ? progress(f, T.floor, 30) : 0;
  const bracket = f >= T.floor + 20 ? progress(f, T.floor + 20, 24) : 0;
  const arrows = f >= T.floor + 34 ? progress(f, T.floor + 34, 30) : 0;

  return (
    <Stage>
      <Card>
        <Reference x1={LOW.x} x2={BOX.x + BOX.w} y={LOW.y} draw={floor} label="Titik terendah sebelumnya" />

        <StructureLine
          plot={P}
          draw={draw}
          head
          marks={[
            ...(draw >= 0.34 ? [{ turn: 1, label: "Puncak 1", at: T.rise + 86 }] : []),
            ...(draw >= 0.99 ? [{ turn: 3, label: "Puncak Baru", tone: "indigo" as const, side: "above" as const, at: T.newHigh + 54 }] : []),
          ]}
        />

        {/* parked ABOVE the descent — the pullback runs through the space
            directly under the peak, and a chip there would sit on the line */}
        {draw >= 0.6 && <Chip label="Ambil Untung" x={(PEAK.x + TROUGH.x) / 2 + 40} y={PEAK.y - 46} tone="slate" at={T.pullback + 70} />}

        {/* the gap the pullback left — measured, not asserted */}
        {bracket > 0.001 && (
          <Layer opacity={bracket}>
            <g stroke={theme.color.cyan} strokeWidth={theme.shape.rule} fill="none">
              <line x1={TROUGH.x + BRACKET_DX} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX} y2={LOW.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX + 12} y2={TROUGH.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={LOW.y} x2={TROUGH.x + BRACKET_DX + 12} y2={LOW.y} />
            </g>
          </Layer>
        )}

        {/* buyers stepping in under the trough — descriptive, never an entry */}
        {arrows > 0.001 && (
          <Layer>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, arrows * 3 - i));
              const y = TROUGH.y + 80 - 22 * a;
              const x = TROUGH.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y + 18} ${x + 11},${y + 18}`} fill={theme.color.indigo} opacity={a * 0.9} />;
            })}
          </Layer>
        )}
        {/* below the prior-low line, never across it */}
        {arrows > 0.4 && <Chip label="Pembeli Masuk" x={TROUGH.x} y={LOW.y + 74} tone="indigo" at={T.floor + 44} />}
      </Card>
    </Stage>
  );
};
