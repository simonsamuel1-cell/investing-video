/**
 * SC19 — Recap: three conditions (from 9610, dur 512).
 *
 * The three shapes are the SAME ones the episode taught them with — STAIRCASE
 * from CG-A, DESCENT from SC07, CHANNEL from SC09. A recap that re-drew them
 * freehand would be teaching a fourth thing; these are literally the lines the
 * viewer already read.
 *
 * The colour rule carries the recap on its own: indigo dots are peaks, cyan
 * dots are troughs, in all three cards.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { Line } from "../components/Text";
import { theme } from "../theme";
import { progress, columns } from "../helpers";
import { peaksOf, troughsOf, plot, type Curve } from "../data/shape";
import { STAIRCASE, DESCENT, CHANNEL } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  up: 82, // "higher high dan higher low"
  down: 182, // "lower high dan lower low"
  side: 263, // "keduanya tidak terbentuk"
  ring: 377, // "bukan berarti tidak terjadi apa-apa"
};
const GAP = 48;
const CARDS = columns({ x: theme.stage.card.x, y: 236, w: theme.stage.card.w, h: 516 }, 3, GAP);
// ═══════════════════════════════════════════════════════════════════════════

const inner = (i: number) => ({ x: CARDS[i].x + 50, y: CARDS[i].y + 152, w: CARDS[i].w - 100, h: CARDS[i].h - 250 });

const PANELS: { title: string; curve: Curve; tags: string[]; tone: "indigo" | "cyan"; at: number }[] = [
  { title: "Uptrend", curve: STAIRCASE, tags: ["HH", "HL"], tone: "indigo", at: T.up },
  { title: "Downtrend", curve: DESCENT, tags: ["LH", "LL"], tone: "indigo", at: T.down },
  { title: "Sideways", curve: CHANNEL, tags: ["Seimbang"], tone: "cyan", at: T.side },
];

export const Scene19 = () => {
  const f = useCurrentFrame();
  const ring = f >= T.ring ? progress(f, T.ring, 26) : 0;

  return (
    <Stage>
      {PANELS.map((panel, i) => {
        if (f < panel.at) return null;
        const p = plot(panel.curve, inner(i), { pad: 0.16 });
        const draw = progress(f, panel.at + 8, 46);
        const marks =
          draw > 0.9 ? [...peaksOf(panel.curve), ...troughsOf(panel.curve)].map((turn) => ({ turn, at: panel.at + 54 })) : [];
        return (
          <Card key={panel.title} rect={CARDS[i]} radius={theme.shape.panelRadius} opacity={progress(f, panel.at, 16)}>
            <Chip label={panel.title} x={CARDS[i].x + CARDS[i].w / 2} y={CARDS[i].y + 78} tone={panel.tone} at={panel.at} />
            <StructureLine plot={p} draw={draw} marks={marks} />
            {panel.tags.map((tag, k) => (
              <Chip
                key={tag}
                label={tag}
                x={CARDS[i].x + CARDS[i].w / 2 + (panel.tags.length > 1 ? (k === 0 ? -60 : 60) : 0)}
                y={CARDS[i].y + CARDS[i].h - 58}
                tone={panel.tags.length > 1 && k === 0 ? "indigo" : "cyan"}
                size={theme.text.axis.size}
                at={panel.at + 62 + k * 6}
              />
            ))}
          </Card>
        );
      })}

      {/* sideways is not nothing — it is undecided */}
      {ring > 0.001 && (
        <Layer opacity={ring}>
          <rect
            x={CARDS[2].x - 10}
            y={CARDS[2].y - 10}
            width={CARDS[2].w + 20}
            height={CARDS[2].h + 20}
            rx={theme.shape.cardRadius}
            fill="none"
            stroke={theme.color.cyan}
            strokeWidth={theme.shape.line}
          />
        </Layer>
      )}

      <Line text="Pasar belum menentukan arah." x={theme.canvas.width / 2} y={theme.stage.caption.y} at={T.ring + 20} />
    </Stage>
  );
};
