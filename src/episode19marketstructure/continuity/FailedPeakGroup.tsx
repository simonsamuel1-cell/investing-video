/**
 * CG-B — SC14 + SC15 as ONE spanning Sequence (global 6851 → 7666, dur 815).
 *
 * The line is mounted ONCE, here, and both halves annotate it. SC14 draws up to
 * the push that fails; the draw keyframes then hold the SAME value across the
 * boundary, so the freeze SC15 opens on is literal — no path is re-issued, and
 * nothing re-animates under the narration. SC15 resumes the identical path when
 * "menembus lembah sebelumnya" lands.
 *
 * Mounting either half as its own scene would remount the chart and restart the
 * line, which would quietly undo the argument these two scenes are making.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { Scene14, SC14 } from "../scenes/Scene14";
import { Scene15, SC15 } from "../scenes/Scene15";
import { theme } from "../theme";
import { FAILURE, FAIL_SC14_END, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
/**
 * The one draw schedule both scenes read. The flat stretch between
 * `SC14.stall` and `SC15.breakLow` IS the freeze.
 */
const DRAW_KEYS = [0, SC14.ref, SC14.push, SC14.stall, SC15.breakLow, SC15.breakLow + 62, SC15.flip + 40];
const DRAW_VALS = [0, 0.44, 0.44, FAIL_SC14_END, FAIL_SC14_END, 0.8, 1];
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(FAILURE, BOX, { pad: 0.12 });

export const FailedPeakGroup = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, DRAW_KEYS, DRAW_VALS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });

  return (
    <SafeArea>
      <ChartCard>
        <Scene14 f={f} g={G} boxRight={BOX.x + BOX.w} />
        <StructureLine g={G} draw={draw} head />
        <Scene15 f={f} g={G} draw={draw} boxRight={BOX.x + BOX.w} />
      </ChartCard>
    </SafeArea>
  );
};
