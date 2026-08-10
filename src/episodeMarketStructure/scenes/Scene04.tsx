/**
 * SC04 — Why the shape forms (from 1450, dur 515) — INDEPENDENT.
 *
 * The mechanism, drawn once, slowly: buyers push, some sell into strength, and
 * the pullback stops ABOVE the last low because interest is still there. That
 * "above" is the whole scene, so it is measured on screen — a dashed line at
 * the prior low and a cyan bracket showing the gap the pullback never closed.
 *
 * The line pauses between legs rather than drawing continuously: each leg is a
 * different decision, and the pause is where the narration explains it.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Level } from "../components/Level";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress } from "../helpers";
import { MECHANISM, geom } from "../data/structures";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  rise: 49, // "pembeli lebih agresif"
  pullback: 179, // "mengambil untung dan harga turun"
  floor: 332, // "pembeli masuk sebelum harga"
  newHigh: 442, // "puncak baru"
};
/**
 * The draw is keyframed against the pivots, not run at a constant speed: it
 * reaches pivot 1 as the peak is named, pivot 2 as the pullback is named, and
 * only leaves for the new high on the last beat.
 */
const DRAW_KEYS = [T.rise, T.rise + 96, T.pullback, T.pullback + 92, T.newHigh, T.newHigh + 62];
const DRAW_VALS = [0, 0.36, 0.36, 0.62, 0.62, 1];
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 110 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(MECHANISM, BOX, { pad: 0.12 });
const P1 = G.pivot(1); // Puncak 1
const LOW = G.pivot(0); // the prior low the pullback must respect
const TROUGH = G.pivot(2); // where the pullback actually stopped
const P3 = G.pivot(3); // Puncak Baru

export const Scene04 = () => {
  const pal = usePalette();
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
      <ChartCard box={CARD}>
        {/* the prior low, extended right — the thing the pullback stays above */}
        <Level x1={LOW.x} x2={BOX.x + BOX.w} y={LOW.y} draw={floor} variant="slate" label="Titik terendah sebelumnya" />

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {draw >= 0.34 && <PivotMarker x={P1.x} y={P1.y} label="Puncak 1" variant="indigo" startFrame={T.rise + 86} />}
        {/* parked ABOVE the descent — the pullback itself runs through the
            space directly under the peak, and a chip there sits on the line */}
        {draw >= 0.6 && <Chip label="Ambil Untung" x={(P1.x + TROUGH.x) / 2 + 40} y={P1.y - 44} variant="slate" startFrame={T.pullback + 70} />}
        {draw >= 0.99 && <PivotMarker x={P3.x} y={P3.y} label="Puncak Baru" variant="indigo" startFrame={T.newHigh + 54} />}

        {/* the gap the pullback left — measured, not asserted */}
        {bracket > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <g opacity={bracket} stroke={pal.cyan} strokeWidth={theme.stroke.rule} fill="none">
              <line x1={TROUGH.x + 54} y1={TROUGH.y} x2={TROUGH.x + 54} y2={LOW.y} />
              <line x1={TROUGH.x + 42} y1={TROUGH.y} x2={TROUGH.x + 66} y2={TROUGH.y} />
              <line x1={TROUGH.x + 42} y1={LOW.y} x2={TROUGH.x + 66} y2={LOW.y} />
            </g>
          </svg>
        )}

        {/* buyers stepping in under the trough */}
        {arrows > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, arrows * 3 - i));
              const y = TROUGH.y + 78 - 22 * a;
              const x = TROUGH.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y + 18} ${x + 11},${y + 18}`} fill={pal.indigo} opacity={a * 0.9} />;
            })}
          </svg>
        )}
        {/* below the prior-low line, not across it */}
        {arrows > 0.4 && <Chip label="Pembeli Masuk" x={TROUGH.x} y={LOW.y + 72} variant="indigo" startFrame={T.floor + 44} />}
      </ChartCard>
    </SafeArea>
  );
};
