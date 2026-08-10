/**
 * SC17 — App second opinion (from 8208, dur 347).
 *
 * The ORDER is both the teaching point and the compliance point: read the
 * structure yourself, then check. The badges say so in that order, and on the
 * closing beat the left pane is re-lit before the right one.
 *
 * The right pane is AppSummaryPanel, the drawn fallback — see that file for the
 * [NEEDS ASSET] note. It shows the panel's structure and no reading, because
 * inventing one would style a call as advice.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine, Guide } from "../components/StructureLine";
import { AppSummaryPanel } from "../components/AppSummaryPanel";
import { panelRects } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn } from "../helpers";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { STAIRCASE } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  panel: 22, // "ringkasan tren dan momentum"
  badges: 176, // "second opinion"
  order: 228, // "membaca struktur harganya sendiri lebih dulu"
};
const PANES = panelRects(2);
const BOX = { x: PANES[0].x + 70, y: PANES[0].y + 120, w: PANES[0].w - 140, h: PANES[0].h - 270 };
/** How far back a pane sits before it is re-lit. */
const DIM = 0.85;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(STAIRCASE, BOX, { pad: 0.14 });
const MARKS = [...peaksOf(STAIRCASE), ...troughsOf(STAIRCASE)];

export const Scene17 = () => {
  const f = useCurrentFrame();
  const panel = f >= T.panel ? progress(f, T.panel, 34) : 0;
  const draw = progress(f, 0, 70);
  const guide = f >= 90 ? progress(f, 90, 40) : 0;
  const left = f >= T.order ? 1 : DIM;
  const right = f >= T.order + 40 ? 1 : DIM;

  return (
    <Stage>
      {/* your own reading, drawn first */}
      <div style={{ position: "absolute", inset: 0, opacity: left }}>
        <Card rect={PANES[0]} radius={theme.shape.panelRadius}>
          <StructureLine plot={P} draw={draw} marks={MARKS.map((turn, i) => ({ turn, at: 30 + i * 9 }))} />
          <Guide from={P.turn(2)} to={P.turn(6)} draw={guide} dy={20} />
          <Chip label="Analisis sendiri" x={PANES[0].x + PANES[0].w / 2} y={PANES[0].y + 58} tone="indigo" at={0} />
        </Card>
      </div>

      {/* the app's summary, arriving second and staying second */}
      <div style={{ position: "absolute", inset: 0, opacity: right * panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
        <Card rect={PANES[1]} radius={theme.shape.panelRadius} opacity={fadeIn(f, T.panel, 24)}>
          <Chip label="Tren & momentum" x={PANES[1].x + PANES[1].w / 2} y={PANES[1].y + 58} tone="cyan" at={T.panel} />
          <AppSummaryPanel rect={PANES[1]} reveal={panel} />
        </Card>
      </div>

      <Chip label="1. Baca sendiri" x={PANES[0].x + PANES[0].w / 2} y={theme.stage.caption.y} tone="indigo" at={T.badges} />
      <Chip label="2. Second opinion" x={PANES[1].x + PANES[1].w / 2} y={theme.stage.caption.y} tone="cyan" at={T.badges + 18} />
    </Stage>
  );
};
