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

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
/** Frames the HH/HL names take to step aside for SC06's numbers. */
const HANDOVER = 30;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(STAIRCASE, BOX, { pad: 0.12 });

export const StaircaseGroup = () => {
  const f = useCurrentFrame();
  const names = f >= SC06_FROM ? fadeOut(f, SC06_FROM, HANDOVER) : 1;

  return (
    <Stage>
      <Card>
        <Scene05 f={f} p={P} names={names} />
        {f >= SC06_FROM - 20 && <Scene06 f={f} p={P} plotRight={BOX.x + BOX.w} />}
      </Card>
    </Stage>
  );
};
