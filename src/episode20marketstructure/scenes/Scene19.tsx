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
 *
 * FROM 9980 THE RECAP NARROWS TO ONE. The other two conditions clear, sideways
 * travels to the middle of the frame, and the point about it is made in words
 * beside it — because the claim being made there is not a shape, it is that a
 * shape everyone reads as "nothing happening" is nothing of the kind.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, progressInOut, textReveal } from "../helpers";
import { CUTS, cutPushOut, cutBlur } from "../transitions/CameraCut";
import { peaksOf, troughsOf, plot, type Curve } from "../data/shape";
import { STAIRCASE, DESCENT, CHANNEL } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  up: 82, // "higher high dan higher low"
  down: 182, // "lower high dan lower low"
  side: 263, // "keduanya tidak terbentuk"
  focus: 370, // 9980 — the other two clear and sideways takes the frame
  active: 386, // 9996 — the move has landed; the words follow it in
  undecided: 451, // 10061 — "Pasar hanya belum menentukan arah."
};
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 9610;
/**
 * NEGATIVE, so `cutPushOut` runs backwards and this card shrinks AWAY into
 * SC20 instead of growing toward it — see CUTS.toWhole.
 */
const PULL = -0.16;
const GAP = 48;
const CARDS = columnsOf();
/**
 * Where the sideways card travels to: the episode's own left margin, carried
 * 300px right of it. Stated as a destination rather than an offset from centre,
 * because "centred, then 200 left" still read as centred.
 *
 * `over` is short on purpose. The words land in the right-hand half, and the
 * other two cards are still crossing it while the move runs — a slow travel
 * printed the first line straight through them.
 */
const FOCUS = { over: 14, x: theme.stage.card.x + 180 };
/**
 * The point, beside the card. Two lines: what sideways IS, then what it is
 * not — the second in indigo because that is the correction being made.
 */
const NOTE = {
  x: 940,
  /** Centre of the first line. */
  y: 460,
  lead: 68,
  size: theme.text.title.size,
  weight: theme.text.title.weight,
};
const NOTE_LINES = [
  { text: "Pasar tetap aktif saat sideways,", accent: false, at: T.active },
  { text: "hanya belum menentukan arah.", accent: true, at: T.undecided },
];
// ═══════════════════════════════════════════════════════════════════════════

function columnsOf() {
  const strip = { x: theme.stage.card.x, y: 236, w: theme.stage.card.w, h: 516 };
  const w = (strip.w - GAP * 2) / 3;
  return [0, 1, 2].map((i) => ({ x: strip.x + i * (w + GAP), y: strip.y, w, h: strip.h }));
}

const inner = (i: number) => ({ x: CARDS[i].x + 50, y: CARDS[i].y + 152, w: CARDS[i].w - 100, h: CARDS[i].h - 250 });

/** How far the sideways card has to travel to land centred and shifted left. */
const SIDE_DX = FOCUS.x - CARDS[2].x;

const PANELS: { title: string; curve: Curve; tags: string[]; tone: "indigo" | "cyan"; at: number }[] = [
  { title: "Uptrend", curve: STAIRCASE, tags: ["HH", "HL"], tone: "indigo", at: T.up },
  { title: "Downtrend", curve: DESCENT, tags: ["LH", "LL"], tone: "indigo", at: T.down },
  { title: "Sideways", curve: CHANNEL, tags: [], tone: "indigo", at: T.side },
];

export const Scene19 = () => {
  const f = useCurrentFrame();
  const focus = f >= T.focus ? progressInOut(f, T.focus, FOCUS.over) : 0;

  // ── leaving on the pull-back SC20 arrives on ──
  const g = f + SCENE_FROM;
  const pull = cutPushOut(g, CUTS.toWhole, PULL);
  const blur = cutBlur(g, CUTS.toWhole);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${pull})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
      {PANELS.map((panel, i) => {
        if (f < panel.at) return null;
        const side = i === 2;
        /** The other two leave as sideways travels; it is the same move. */
        const stay = side ? 1 : 1 - focus;
        if (stay <= 0.001) return null;
        const p = plot(panel.curve, inner(i), { pad: 0.16 });
        const draw = progress(f, panel.at + 8, 46);
        const marks =
          draw > 0.9 ? [...peaksOf(panel.curve), ...troughsOf(panel.curve)].map((turn) => ({ turn, at: panel.at + 54 })) : [];
        return (
          <div
            key={panel.title}
            style={{
              position: "absolute",
              inset: 0,
              opacity: stay,
              transform: side && focus > 0 ? `translateX(${SIDE_DX * focus}px)` : undefined,
            }}
          >
            <Card rect={CARDS[i]} radius={theme.shape.panelRadius} opacity={progress(f, panel.at, 16)}>
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
          </div>
        );
      })}

      {/* sideways is not nothing — it is undecided */}
      {NOTE_LINES.map((l, i) => {
        if (f < l.at) return null;
        const rev = textReveal(f, l.at);
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: NOTE.x,
              top: NOTE.y + i * NOTE.lead,
              transform: `translateY(calc(-50% + ${rev.dy}px))`,
              fontFamily: theme.text.family,
              fontSize: NOTE.size,
              fontWeight: NOTE.weight,
              color: l.accent ? theme.color.indigo : theme.color.ink,
              opacity: rev.opacity,
              whiteSpace: "nowrap",
            }}
          >
            {l.text}
          </div>
          );
        })}
      </div>
    </Stage>
  );
};
