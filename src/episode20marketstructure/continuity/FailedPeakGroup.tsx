/**
 * CG-B — SC14 + SC15 as ONE spanning Sequence (global 6851 → 7666, dur 815).
 *
 * The line is mounted ONCE, here, and both halves annotate it. SC14 draws up to
 * the push that fails; the schedule then HOLDS the same value across the
 * boundary, so the freeze SC15 opens on is literal — no path is re-issued and
 * nothing re-animates under the narration. SC15 resumes the identical path when
 * its beat lands.
 *
 * Mounting either half as its own scene would remount the chart and restart the
 * line, which would quietly undo the argument these two scenes make together.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { Scene14, SC14 } from "../scenes/Scene14";
import { Scene15, SC15 } from "../scenes/Scene15";
import { theme } from "../theme";
import { hold } from "../helpers";
import { plot } from "../data/shape";
import { FAILURE, FAIL_STOP_T } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(FAILURE, BOX, { pad: 0.12 });
/** Where the draw stops: exactly on the failed peak, measured along the line. */
const STOP = P.reaches(FAIL_STOP_T);

/** The flat stretch between `SC14.stall` and `SC15.breakLow` IS the freeze. */
const DRAW_AT = [0, SC14.reference, SC14.push, SC14.stall, SC15.breakLow, SC15.breakLow + 62, SC15.flip + 40];
const DRAW_TO = [0, 0.44, 0.44, STOP, STOP, 0.8, 1];

export const FailedPeakGroup = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);

  return (
    <Stage>
      <Card>
        <Scene14 f={f} p={P} plotRight={BOX.x + BOX.w} />
        <StructureLine plot={P} draw={draw} head />
        <Scene15 f={f} p={P} draw={draw} plotRight={BOX.x + BOX.w} />
      </Card>
    </Stage>
  );
};
