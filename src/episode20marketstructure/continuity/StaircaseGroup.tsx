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
import { fadeOut, progressInOut } from "../helpers";
import { STAIR, STAIR_BOX } from "../data/staircaseView";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = STAIR_BOX;
/** Frames the HH/HL names take to step aside for SC06's numbers. */
const HANDOVER = 30;
/**
 * Frames the camera takes to pull back from SC04's crop to the whole climb.
 * SC04 was this same chart, magnified to its first step; nothing is redrawn.
 */
const ZOOM_OVER = 45;
/**
 * THE HANDOFF INTO SC07, at 3041/3042.
 *
 * Everything written on the chart clears here — the axis, the four prices, the
 * comparisons, the guide, the marks — and the LINE is left alone on the card.
 * SC07 opens on exactly that line and pans sideways off it to the downtrend, so
 * the two shapes are compared by moving the camera rather than by cutting.
 */
const EXIT = { at: 1046, over: 30 };
// ═══════════════════════════════════════════════════════════════════════════

const P = STAIR;

export const StaircaseGroup = () => {
  const f = useCurrentFrame();
  const names = f >= SC06_FROM ? fadeOut(f, SC06_FROM, HANDOVER) : 1;
  const stay = f >= EXIT.at ? 1 - progressInOut(f, EXIT.at, EXIT.over) : 1;

  return (
    <Stage>
      <Card>
        <Scene05 f={f} p={P} zoomOver={ZOOM_OVER} names={names * stay} extras={stay} />
        {/* opacity only — a transform here would become the containing block
            for every absolutely-positioned child and collapse the layout */}
        {f >= SC06_FROM - 20 && stay > 0.001 && (
          <div style={{ opacity: stay }}>
            <Scene06 f={f} p={P} plotRight={BOX.x + BOX.w} />
          </div>
        )}
      </Card>
    </Stage>
  );
};
