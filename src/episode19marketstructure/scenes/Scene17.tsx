/**
 * SC17 — App second opinion (from 8208, dur 347).
 *
 * The ORDER is both the teaching point and the compliance point: read the
 * structure yourself, then check. The badges say so in that order, and on the
 * closing beat the left pane is re-lit before the right one.
 *
 * The right pane is currently AppSummaryPanel, the drawn fallback — see that
 * component for the [NEEDS ASSET] note. It renders the panel's structure and no
 * directional reading, because inventing one would style a call as advice.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard } from "../components/SafeArea";
import { StructureLine, GuideLine } from "../components/StructureLine";
import { AppSummaryPanel } from "../components/AppSummaryPanel";
import { panelBox } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn } from "../helpers";
import { UPTREND, UP_PEAKS, UP_TROUGHS, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  panel: 22, // "ringkasan tren dan momentum"
  badges: 176, // "second opinion"
  order: 228, // "membaca struktur harganya sendiri lebih dulu"
};
const PANE_L = panelBox(0);
const PANE_R = panelBox(1);
const BOX = { x: PANE_L.x + 70, y: PANE_L.y + 110, w: PANE_L.w - 140, h: PANE_L.h - 260 };
const DIM = 0.85; // how far back a pane sits before it is re-lit
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(UPTREND, BOX, { pad: 0.14 });
const MARKS = [
  ...UP_PEAKS.map((i) => ({ index: i, variant: "indigo" as const })),
  ...UP_TROUGHS.map((i) => ({ index: i, variant: "cyan" as const })),
];

export const Scene17 = () => {
  const f = useCurrentFrame();
  const panel = f >= T.panel ? progress(f, T.panel, 34) : 0;
  const draw = progress(f, 0, 70);
  const guide = f >= 90 ? progress(f, 90, 40) : 0;
  const liftL = f >= T.order ? 1 : DIM;
  const liftR = f >= T.order + 40 ? 1 : DIM;

  return (
    <SafeArea>
      {/* your own reading, drawn first */}
      <div style={{ position: "absolute", inset: 0, opacity: liftL }}>
        <ChartCard box={PANE_L} radius={theme.radius.card}>
          <StructureLine g={G} draw={draw} pivots={MARKS.map((m, i) => ({ ...m, startFrame: 30 + i * 9 }))} />
          <GuideLine from={G.pivot(2)} to={G.pivot(6)} draw={guide} dy={18} />
          <Chip label="Analisis Sendiri" x={PANE_L.x + PANE_L.w / 2} y={PANE_L.y + 56} variant="indigo" startFrame={0} />
        </ChartCard>
      </div>

      {/* the app's summary, arriving second and staying second */}
      <div style={{ position: "absolute", inset: 0, opacity: liftR * panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
        <ChartCard box={PANE_R} radius={theme.radius.card} opacity={fadeIn(f, T.panel, 24)}>
          <Chip label="Tren & Momentum" x={PANE_R.x + PANE_R.w / 2} y={PANE_R.y + 56} variant="cyan" startFrame={T.panel} />
          <AppSummaryPanel box={PANE_R} reveal={panel} />
        </ChartCard>
      </div>

      <Chip label="1. Baca Sendiri" x={PANE_L.x + PANE_L.w / 2} y={theme.frame.captionY} variant="indigo" startFrame={T.badges} />
      <Chip label="2. Second Opinion" x={PANE_R.x + PANE_R.w / 2} y={theme.frame.captionY} variant="cyan" startFrame={T.badges + 18} />
    </SafeArea>
  );
};
