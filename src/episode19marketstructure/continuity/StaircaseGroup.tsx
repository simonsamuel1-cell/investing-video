/**
 * CG-A — SC05 + SC06 as ONE spanning Sequence (global 1965 → 3042, dur 1077).
 *
 * These are mounted together, never as two top-level scenes, because the
 * script's own sentence runs across the boundary ("…naik lagi. | Coba pakai
 * angka.") and the picture must not remount underneath it. Nothing about the
 * line changes at group-local 513: SC06 only ADDS an axis, the four numbers,
 * the comparisons and the guide onto the geometry SC05 already drew.
 *
 * The single `Geom` built here is the reason that holds — both halves read the
 * same object, so there is no second chart that could disagree with the first.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { Scene05 } from "../scenes/Scene05";
import { Scene06, SC06_FROM } from "../scenes/Scene06";
import { theme } from "../theme";
import { fadeOut } from "../helpers";
import { UPTREND, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 110 };
/** Frames the HH/HL names take to step aside for SC06's numbers. */
const HANDOVER = 30;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(UPTREND, BOX, { pad: 0.12 });

export const StaircaseGroup = () => {
  const f = useCurrentFrame();
  // SC06 takes the pivots over: the names step aside for the numbers
  const labels = f >= SC06_FROM ? fadeOut(f, SC06_FROM, HANDOVER) : 1;

  return (
    <SafeArea>
      <ChartCard>
        <Scene05 f={f} g={G} labels={labels} />
        {f >= SC06_FROM - 20 && <Scene06 f={f} g={G} />}
      </ChartCard>
    </SafeArea>
  );
};
