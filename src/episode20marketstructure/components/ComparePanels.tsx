/**
 * ComparePanels.tsx — the side-by-side comparison in SC11 module 2.
 *
 * The LEFT panel is not built here. Module 1's card closes down to a panel's
 * width and keeps its own chart, so the gradual climb the comparison opens on is
 * literally the chart the viewer was just looking at — see Scene11. This renders
 * whatever panels a scene still has to introduce, which in SC11 is the steep one
 * arriving beside it; `rect` is therefore explicit rather than derived from how
 * many panels are passed.
 *
 * The old line version carried an angle arc at each base. It is gone: an arc
 * sized to a line reads as a stray mark once there are candle bodies around it,
 * and the opening angle is the wrong measurement for a shape whose whole point
 * is where the steep part sits.
 */
import { theme } from "../theme";
import { columns, type Rect } from "../helpers";
import { Card } from "./Stage";
import { CandleChart } from "./CandleChart";
import { Chip } from "./Chip";
import type { Bar } from "../data/shape";

/** Matches the pad the panels' CandleChart is drawn with. */
export const PANEL_PAD = 0.12;
/** Where a panel's name sits inside its card. */
export const PANEL_TITLE_DY = 58;

export type Panel = {
  title: string;
  tone: "indigo" | "cyan";
  bars: Bar[];
  /** The rect the candles are plotted in, inside the panel card. */
  box: Rect;
  draw: number;
  titleAt: number;
  /** Which slot this panel occupies. Defaults to its index. */
  rect?: Rect;
};

export const panelRects = (n = 2, gap = 48): Rect[] =>
  columns(theme.stage.card, n, gap);

export const ComparePanels = ({
  panels,
  opacity = 1,
}: {
  panels: Panel[];
  opacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  const fallback = panelRects(panels.length);
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {panels.map((p, i) => {
        const rect = p.rect ?? fallback[i];
        return (
          <Card key={p.title} rect={rect} radius={theme.shape.panelRadius}>
            <CandleChart
              bars={p.bars}
              box={p.box}
              reveal={p.draw}
              axis={false}
              pad={PANEL_PAD}
            />
            <Chip
              label={p.title}
              x={rect.x + rect.w / 2}
              y={rect.y + PANEL_TITLE_DY}
              tone={p.tone}
              at={p.titleAt}
            />
          </Card>
        );
      })}
    </div>
  );
};
