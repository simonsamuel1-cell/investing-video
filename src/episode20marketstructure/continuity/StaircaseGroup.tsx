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
 * How soft the transformation front is, as a fraction of the line's width.
 * Too sharp and it reads as a wipe passing over the chart; too soft and the
 * whole line squirms at once and the left-to-right reading is lost.
 */
const MORPH_FRONT = 0.12;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(STAIRCASE, BOX, { pad: 0.12 });
/**
 * SC04's finished line paired point-for-point with this one. SC04 draws in the
 * SAME box, so frame 1965 IS frame 1964 and the staircase then grows out of the
 * mechanism instead of being drawn onto an emptied card. Built once, at load.
 */
const MORPH = morph(MECH_LINE, P.points, 260, MORPH_FRONT);

export const StaircaseGroup = () => {
  const f = useCurrentFrame();
  const names = f >= SC06_FROM ? fadeOut(f, SC06_FROM, HANDOVER) : 1;

  return (
    <Stage>
      <Card>
        <Scene05 f={f} p={P} shape={MORPH} names={names} />
        {f >= SC06_FROM - 20 && <Scene06 f={f} p={P} plotRight={BOX.x + BOX.w} />}
      </Card>
    </Stage>
  );
};
