/**
 * CG-A — SC05 + SC06 as ONE spanning Sequence (global 1965 → 3042, dur 1077).
 *
 * Mounted together, never as two top-level scenes, because the script's own
 * sentence runs across the boundary ("…naik lagi. | Coba pakai angka.") and the
 * picture must not remount underneath it.
 *
 * The single `Plot` built here is what holds that promise: both halves read the
 * same object, so there is no second chart that could disagree with the first.
 * Nothing about the line changes at group-local 513 — SC06 only ADDS an axis,
 * four numbers, the comparisons and the guide.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { Scene05 } from "../scenes/Scene05";
import { Scene06, SC06_FROM } from "../scenes/Scene06";
import { theme } from "../theme";
import { fadeOut } from "../helpers";
import { plot } from "../data/shape";
import { STAIRCASE } from "../data/shapes";
import { morph } from "../transitions/Morph";
import { MECH_LINE } from "../scenes/Scene04";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
/** Frames the HH/HL names take to step aside for SC06's numbers. */
const HANDOVER = 30;
/**
 * ONE STEP of this staircase is what SC04 spent its whole scene drawing: up,
 * pull back, up to a higher high. So the join at 1964/1965 is a pull-back of
 * the camera — SC04's chart is the same picture, closer in.
 *
 * The step ends at the SECOND peak, turn 3. Ending at the trough instead would
 * shrink away the higher high, which is the only part of SC04 that mattered.
 */
const STEP_TURN = 3;
/** Frames the pull-back takes. The rest of the staircase draws on as usual. */
const ZOOM_OVER = 45;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(STAIRCASE, BOX, { pad: 0.12 });
/** How far along this line one step reaches — where the normal drawing resumes. */
const STEP_END = P.reaches(P.turn(STEP_TURN).t);
/**
 * SC04's finished line paired point-for-point with that first step, so every
 * point of the big shape knows which point of the small one it is heading for.
 * At blend 0 this is SC04's last frame exactly; at 1 it is step one, and the
 * trim path takes over from there without a seam. Built once, at load.
 */
const SHRINK = morph(MECH_LINE, P.points.filter((pt) => pt.x <= P.turn(STEP_TURN).x));

export const StaircaseGroup = () => {
  const f = useCurrentFrame();
  const names = f >= SC06_FROM ? fadeOut(f, SC06_FROM, HANDOVER) : 1;

  return (
    <Stage>
      <Card>
        <Scene05 f={f} p={P} shrink={SHRINK} stepEnd={STEP_END} zoomOver={ZOOM_OVER} names={names} />
        {f >= SC06_FROM - 20 && <Scene06 f={f} p={P} plotRight={BOX.x + BOX.w} />}
      </Card>
    </Stage>
  );
};
