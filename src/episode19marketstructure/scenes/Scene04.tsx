/**
 * SC04 — Why the shape forms (from 1450, dur 515).
 *
 * The mechanism, drawn once and slowly: buyers push, some sell into strength,
 * and the pullback stops ABOVE the last low because interest is still there.
 * That "above" is the whole scene, so it is MEASURED on screen — a dashed line
 * at the prior low and a cyan bracket showing the gap the pullback never closed.
 *
 * The line pauses between legs rather than running at a constant speed: each
 * leg is a different decision, and the pause is where the narration explains it.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine, ReferenceLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress } from "../helpers";
import { MECHANISM, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  rise: 49, // "pembeli lebih agresif"
  pullback: 179, // "mengambil untung dan harga turun"
  floor: 332, // "pembeli masuk sebelum harga"
  newHigh: 442, // "puncak baru"
};
/** Keyed to the pivots, so the line is always where the narration says it is. */
const DRAW_KEYS = [T.rise, T.rise + 96, T.pullback, T.pullback + 92, T.newHigh, T.newHigh + 62];
const DRAW_VALS = [0, 0.36, 0.36, 0.62, 0.62, 1];
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 110 };
const BRACKET_DX = 54;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(MECHANISM, BOX, { pad: 0.12 });
const LOW = G.pivot(0); // the prior low the pullback must respect
const P1 = G.pivot(1); // Puncak 1
const TROUGH = G.pivot(2); // where the pullback actually stopped

export const Scene04 = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, DRAW_KEYS, DRAW_VALS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const floor = f >= T.floor ? progress(f, T.floor, 30) : 0;
  const bracket = f >= T.floor + 20 ? progress(f, T.floor + 20, 24) : 0;
  const arrows = f >= T.floor + 34 ? progress(f, T.floor + 34, 30) : 0;

  return (
    <SafeArea>
      <ChartCard>
        <ReferenceLine x1={LOW.x} x2={BOX.x + BOX.w} y={LOW.y} draw={floor} label="Titik terendah sebelumnya" />

        <StructureLine
          g={G}
          draw={draw}
          head
          pivots={[
            ...(draw >= 0.34 ? [{ index: 1, label: "Puncak 1", variant: "indigo" as const, startFrame: T.rise + 86 }] : []),
            ...(draw >= 0.99 ? [{ index: 3, label: "Puncak Baru", variant: "indigo" as const, startFrame: T.newHigh + 54 }] : []),
          ]}
        />

        {/* parked ABOVE the descent — the pullback runs through the space
            directly under the peak, and a chip there would sit on the line */}
        {draw >= 0.6 && <Chip label="Ambil Untung" x={(P1.x + TROUGH.x) / 2 + 40} y={P1.y - 44} variant="slate" startFrame={T.pullback + 70} />}

        {/* the gap the pullback left — measured, not asserted */}
        {bracket > 0.001 && (
          <Layer opacity={bracket}>
            <g stroke={theme.colors.cyan} strokeWidth={theme.stroke.rule} fill="none">
              <line x1={TROUGH.x + BRACKET_DX} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX} y2={LOW.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX + 12} y2={TROUGH.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={LOW.y} x2={TROUGH.x + BRACKET_DX + 12} y2={LOW.y} />
            </g>
          </Layer>
        )}

        {/* buyers stepping in under the trough — descriptive, not an entry */}
        {arrows > 0.001 && (
          <Layer>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, arrows * 3 - i));
              const y = TROUGH.y + 78 - 22 * a;
              const x = TROUGH.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y + 18} ${x + 11},${y + 18}`} fill={theme.colors.indigo} opacity={a * 0.9} />;
            })}
          </Layer>
        )}
        {/* below the prior-low line, never across it */}
        {arrows > 0.4 && <Chip label="Pembeli Masuk" x={TROUGH.x} y={LOW.y + 72} variant="indigo" startFrame={T.floor + 44} />}
      </ChartCard>
    </SafeArea>
  );
};
