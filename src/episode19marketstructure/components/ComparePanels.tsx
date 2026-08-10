/**
 * ComparePanels — two side-by-side mini chart cards (SC11 module 2).
 *
 * The angle arc at each base is what makes the comparison literal: both panels
 * climb the same distance, and the only difference the viewer is asked to read
 * is the opening slope. Without the arc it would be an assertion; with it, it
 * is a measurement.
 */
import { theme } from "../theme";
import { ChartCard, Layer } from "./SafeArea";
import { StructureLine } from "./StructureLine";
import { Chip } from "./Chip";
import type { Geom } from "../data/series";

export type ComparePanel = {
  title: string;
  variant: "indigo" | "cyan";
  g: Geom;
  draw: number;
  titleFrame: number;
  /** Optional chip under the panel — SC11's "Lebih Stabil". */
  note?: { label: string; startFrame: number };
};

export const panelBox = (i: number, n = 2, gap = 48) => {
  const w = (theme.frame.card.w - gap * (n - 1)) / n;
  return { x: theme.frame.card.x + i * (w + gap), y: theme.frame.card.y, w, h: theme.frame.card.h };
};

/** The opening slope, drawn as an arc between horizontal and the line itself. */
const SlopeArc = ({ g, opacity }: { g: Geom; opacity: number }) => {
  if (opacity <= 0.001) return null;
  const a = g.pts[0];
  const b = g.headAt(0.55);
  const r = 74;
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  return (
    <Layer opacity={opacity}>
      <line x1={a.x} y1={a.y} x2={a.x + r + 30} y2={a.y} stroke={theme.colors.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" />
      <path
        d={`M ${a.x + r},${a.y} A ${r} ${r} 0 0 0 ${a.x + r * Math.cos(ang)},${a.y + r * Math.sin(ang)}`}
        fill="none"
        stroke={theme.colors.cyan}
        strokeWidth={theme.stroke.rule}
      />
    </Layer>
  );
};

export const ComparePanels = ({ panels, opacity = 1 }: { panels: ComparePanel[]; opacity?: number }) => {
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {panels.map((p, i) => {
        const box = panelBox(i, panels.length);
        return (
          <ChartCard key={p.title} box={box} radius={theme.radius.card}>
            <StructureLine g={p.g} draw={p.draw} color={theme.colors.indigo} width={4} />
            <SlopeArc g={p.g} opacity={p.draw} />
            <Chip label={p.title} x={box.x + box.w / 2} y={box.y + 56} variant={p.variant} startFrame={p.titleFrame} />
            {p.note && <Chip label={p.note.label} x={box.x + box.w / 2} y={theme.frame.captionY} variant="indigo" startFrame={p.note.startFrame} />}
          </ChartCard>
        );
      })}
    </div>
  );
};
