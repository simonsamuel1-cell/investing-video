/**
 * ComparePanels.tsx — two side-by-side mini charts (SC11 module 2).
 *
 * The angle arc at each base is what makes the comparison a measurement rather
 * than an assertion: both panels climb the same distance, and the only thing
 * the viewer is asked to read is the opening slope.
 */
import { theme } from "../theme";
import { columns, type Rect } from "../helpers";
import { Card, Layer } from "./Stage";
import { StructureLine } from "./StructureLine";
import { Chip } from "./Chip";
import type { Plot } from "../data/shape";

export type Panel = {
  title: string;
  tone: "indigo" | "cyan";
  plot: Plot;
  draw: number;
  titleAt: number;
  /** Optional chip in the caption row — SC11's "Lebih Stabil". */
  note?: { label: string; at: number };
};

export const panelRects = (n = 2, gap = 48): Rect[] => columns(theme.stage.card, n, gap);

const SlopeArc = ({ plot, opacity }: { plot: Plot; opacity: number }) => {
  if (opacity <= 0.001) return null;
  const a = plot.points[0];
  const b = plot.along(0.45);
  const r = 74;
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  return (
    <Layer opacity={opacity}>
      <line x1={a.x} y1={a.y} x2={a.x + r + 30} y2={a.y} stroke={theme.color.slate} strokeWidth={theme.shape.hairline} strokeDasharray="8 8" />
      <path
        d={`M ${a.x + r},${a.y} A ${r} ${r} 0 0 0 ${a.x + r * Math.cos(angle)},${a.y + r * Math.sin(angle)}`}
        fill="none"
        stroke={theme.color.cyan}
        strokeWidth={theme.shape.rule}
      />
    </Layer>
  );
};

export const ComparePanels = ({ panels, opacity = 1 }: { panels: Panel[]; opacity?: number }) => {
  if (opacity <= 0.001) return null;
  const rects = panelRects(panels.length);
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {panels.map((p, i) => (
        <Card key={p.title} rect={rects[i]} radius={theme.shape.panelRadius}>
          <StructureLine plot={p.plot} draw={p.draw} color={theme.color.indigo} width={4} />
          <SlopeArc plot={p.plot} opacity={p.draw} />
          <Chip label={p.title} x={rects[i].x + rects[i].w / 2} y={rects[i].y + 58} tone={p.tone} at={p.titleAt} />
          {p.note && <Chip label={p.note.label} x={rects[i].x + rects[i].w / 2} y={theme.stage.caption.y} tone="indigo" at={p.note.at} />}
        </Card>
      ))}
    </div>
  );
};
