/**
 * SC19 — Recap: three conditions (from 9610, dur 512).
 *
 * The three shapes are drawn from the SAME structures the episode taught them
 * with — UPTREND from CG-A, DOWNTREND from SC07, SIDEWAYS from SC09. A recap
 * that re-drew them freehand would be teaching a fourth thing; these are
 * literally the lines the viewer already read.
 *
 * The colour rule carries the recap on its own: indigo dots are peaks, cyan
 * dots are troughs, in all three cards.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { Statement } from "../components/Header";
import { theme } from "../theme";
import { progress } from "../helpers";
import {
  UPTREND,
  UP_PEAKS,
  UP_TROUGHS,
  DOWNTREND,
  DOWN_PEAKS,
  DOWN_TROUGHS,
  SIDEWAYS,
  SIDEWAYS_PEAKS,
  SIDEWAYS_TROUGHS,
  geom,
  type Structure,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  up: 82, // "higher high dan higher low"
  down: 182, // "lower high dan lower low"
  side: 263, // "keduanya tidak terbentuk"
  ring: 377, // "bukan berarti tidak terjadi apa-apa"
};
const GAP = 48;
const CARD_W = (theme.frame.card.w - GAP * 2) / 3;
const CARD_Y = 230;
const CARD_H = 520;
// ═══════════════════════════════════════════════════════════════════════════

const box = (i: number) => ({ x: theme.frame.card.x + i * (CARD_W + GAP), y: CARD_Y, w: CARD_W, h: CARD_H });
const plot = (i: number) => ({ x: box(i).x + 50, y: box(i).y + 150, w: CARD_W - 100, h: CARD_H - 250 });

const CARDS: {
  title: string;
  s: Structure;
  peaks: number[];
  troughs: number[];
  tags: string[];
  variant: "indigo" | "cyan";
  at: number;
}[] = [
  { title: "Uptrend", s: UPTREND, peaks: UP_PEAKS, troughs: UP_TROUGHS, tags: ["HH", "HL"], variant: "indigo", at: T.up },
  { title: "Downtrend", s: DOWNTREND, peaks: DOWN_PEAKS, troughs: DOWN_TROUGHS, tags: ["LH", "LL"], variant: "indigo", at: T.down },
  { title: "Sideways", s: SIDEWAYS, peaks: SIDEWAYS_PEAKS, troughs: SIDEWAYS_TROUGHS, tags: ["Seimbang"], variant: "cyan", at: T.side },
];

export const Scene19 = () => {
  const f = useCurrentFrame();
  const ring = f >= T.ring ? progress(f, T.ring, 26) : 0;

  return (
    <SafeArea>
      {CARDS.map((c, i) => {
        if (f < c.at) return null;
        const g = geom(c.s, plot(i), { pad: 0.16 });
        const draw = progress(f, c.at + 8, 46);
        const marks =
          draw > 0.9
            ? [
                ...c.peaks.map((pi) => ({ index: pi, variant: "indigo" as const, startFrame: c.at + 52 })),
                ...c.troughs.map((pi) => ({ index: pi, variant: "cyan" as const, startFrame: c.at + 56 })),
              ]
            : [];
        return (
          <ChartCard key={c.title} box={box(i)} radius={theme.radius.card} opacity={progress(f, c.at, 16)}>
            <Chip label={c.title} x={box(i).x + CARD_W / 2} y={box(i).y + 76} variant={c.variant} startFrame={c.at} />
            <StructureLine g={g} draw={draw} pivots={marks} />
            {c.tags.map((tag, k) => (
              <Chip
                key={tag}
                label={tag}
                x={box(i).x + CARD_W / 2 + (c.tags.length > 1 ? (k === 0 ? -60 : 60) : 0)}
                y={box(i).y + CARD_H - 58}
                variant={k === 0 && c.tags.length > 1 ? "indigo" : "cyan"}
                size={theme.type.axis.size}
                startFrame={c.at + 62 + k * 6}
              />
            ))}
          </ChartCard>
        );
      })}

      {/* sideways is not nothing — it is undecided */}
      {ring > 0.001 && (
        <Layer opacity={ring}>
          <rect
            x={box(2).x - 10}
            y={box(2).y - 10}
            width={CARD_W + 20}
            height={CARD_H + 20}
            rx={theme.radius.cardLg}
            fill="none"
            stroke={theme.colors.cyan}
            strokeWidth={theme.stroke.line}
          />
        </Layer>
      )}

      <Statement text="Pasar belum menentukan arah." x={theme.canvas.width / 2} y={theme.frame.captionY} startFrame={T.ring + 20} />
    </SafeArea>
  );
};
