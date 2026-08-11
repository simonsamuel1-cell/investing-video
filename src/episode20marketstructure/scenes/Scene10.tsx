/**
 * SC10 — Accumulation / distribution / cycle (from 4402, dur 810).
 *
 * The longest scene, and the only one that draws a whole cycle in one pass. The
 * line never restarts: markdown, base, markup, top and markdown again are all
 * one curve, because the point is that they are one thing seen at different
 * moments — not four diagrams.
 *
 * Room grammar holds: the base tints INDIGO (a floor is being built) and the
 * top tints CYAN (a ceiling is forming). SC12 and SC13 then trade on exactly
 * that association.
 *
 * Drawn as CANDLES. The two tight boxes belong to the CLOSE-UP: while the
 * camera is in among the candles they name what is being built, measured off
 * the candles' own highs and lows so nothing pokes out of the floor or ceiling
 * they claim. They leave on 5050, the frame the camera finishes pulling back —
 * from there the dashed dividers and the chips carry the same information at
 * the scale of the whole cycle, and keeping both would put two boxes around one
 * stretch and invite the viewer to look for a difference that is not there.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress, fadeOut } from "../helpers";
import { CUTS, cutPushOut, cutBlur } from "../transitions/CameraCut";
import { candles } from "../data/shape";
import { CYCLE, CYCLE_PHASES } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  decline: 97, // "penurunan panjang"
  accumulation: 292, // "accumulation"
  markup: 336, // (rise)
  distribution: 508, // "distribution"
  cycle: 587, // "siklus"
  chipsA: 662, // "turun, membentuk dasar"
  chipsB: 718, // "naik, membentuk puncak"
  loop: 773, // "lalu turun lagi"
};
/**
 * The draw is keyed to the phases, so the line is always where the narration
 * says it is: at the base when accumulation is named, at the top when
 * distribution is.
 */
const DRAW_AT = [
  T.decline,
  T.accumulation,
  T.markup,
  T.distribution,
  T.cycle,
  T.cycle + 90,
];
const DRAW_TO = [0, 0.28, 0.36, 0.78, 0.93, 1];
const BOX = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 20,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 90,
};
/** Bars across the whole cycle. Dense enough to read as a chart, not a diagram. */
const COUNT = 120;
/** Half-height of a phase box beyond the prices it covers. */
const BAND_PAD = 26;
/** The two boxes leave on 5050, as the camera lands on the wide framing. */
const BOX_OUT = { at: 648, over: 16 };
/**
 * The phase names sit INSIDE the card, along its foot. Below it they read as a
 * caption for the whole picture; on the white, under the stretch each one
 * names, they read as part of the chart — which is what they are.
 */
const CHIP_Y = theme.stage.card.y + theme.stage.card.h - 50;
/**
 * Where in the window the newest candle sits — not the middle. Centring the
 * head leaves half the card empty ahead of a chart that has not happened yet;
 * four fifths across keeps the history just drawn on screen and still leaves
 * somewhere for the next candles to go.
 */
const HEAD_AT = 0.82;
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 4402;
/** How far the dolly closes across the cut into SC11. */
const PUSH = 0.18;
// ═══════════════════════════════════════════════════════════════════════════

const BARS = candles(CYCLE, COUNT, 53, 0.012);
/** A phase window, in bars. */
const barAt = (t: number) => Math.round(t * (BARS.length - 1));
/** Prices never move, so the vertical scale is fixed at load. */
const SCALE = barGrid(BARS, BOX, 0.12).scale;
const bandFor = (win: [number, number]) => {
  const inside = BARS.slice(barAt(win[0]), barAt(win[1]) + 1);
  return {
    top: SCALE(Math.max(...inside.map((b) => b.h))) - BAND_PAD,
    bottom: SCALE(Math.min(...inside.map((b) => b.l))) + BAND_PAD,
  };
};
const BASE = bandFor(CYCLE_PHASES.accumulation);
const TOP = bandFor(CYCLE_PHASES.distribution);

/**
 * Each phase is named AND pointed at: the chip says which stretch, the column
 * behind it shows which stretch. The highlight is a spotlight, not a legend —
 * it hands over to the next phase rather than accumulating, so at any moment
 * exactly one part of the chart is the one being talked about.
 *
 * The fifth entry is the point of the whole scene: the cycle closes back into
 * markdown. That used to be a loop icon in the corner, which asked the viewer
 * to take the repetition on trust; naming the last stretch shows it instead.
 */
const PHASES: {
  label: string;
  win: [number, number];
  tone: "slate" | "indigo" | "cyan";
  at: number;
  anchor?: "left";
}[] = [
  {
    label: "Markdown",
    win: CYCLE_PHASES.markdown,
    tone: "slate" as const,
    at: T.chipsA,
  },
  {
    label: "Accumulation",
    win: CYCLE_PHASES.accumulation,
    tone: "indigo" as const,
    at: T.chipsA + 22,
  },
  {
    label: "Markup",
    win: CYCLE_PHASES.markup,
    tone: "slate" as const,
    at: T.chipsB,
  },
  {
    label: "Distribution",
    win: CYCLE_PHASES.distribution,
    tone: "cyan" as const,
    at: T.chipsB + 22,
  },
  /**
   * Flush LEFT against its own stretch rather than centred on it. The repeat
   * window is narrow and butts straight up against distribution's, so a centred
   * chip runs into the word beside it.
   */
  {
    label: "Markdown",
    win: CYCLE_PHASES.repeat,
    tone: "slate" as const,
    at: T.loop,
    anchor: "left" as const,
  },
];
/** Wash fills, one per tone — the same hues, at the strength a tint should be. */
const WASH: Record<string, string> = {
  slate: "rgba(98, 98, 102, 0.10)",
  indigo: theme.color.indigoWash,
  cyan: theme.color.cyanWash,
};
/** Frames a spotlight takes to arrive, and to hand over to the next one. */
const SPOT = 18;
/**
 * THE FOLLOWING CAMERA.
 *
 * The cycle is the one thing in this episode a viewer must NOT be shown all at
 * once: seeing the whole shape from frame one gives away that it is a cycle
 * before the narration has walked through a single phase. So the camera sits in
 * close and travels right with the drawing, and only pulls back at 4985 — by
 * which point the viewer has watched each phase happen rather than been handed
 * a diagram of them.
 *
 * It moves on X ONLY. The zoom widens the time axis and leaves prices exactly
 * where they are, which is what a charting app does and what keeps the four
 * phase heights comparable while the camera is moving.
 */
const ZOOM = 2.4;
/** Local frames the pull-back takes — global 4985 → 5050. */
const PULL_BACK = { at: 583, over: 65 };
/** The window the camera looks through: the card, edge to edge. */
const WINDOW = {
  left: theme.stage.card.x,
  right: theme.stage.card.x + theme.stage.card.w,
};
/**
 * The internal phase boundaries. Each leaves a dashed vertical behind as the
 * drawing passes it, so that when the camera finally pulls back the whole cycle
 * is already divided into the parts the viewer just watched being built.
 */
const DIVIDERS = [
  CYCLE_PHASES.markdown[1],
  CYCLE_PHASES.accumulation[1],
  CYCLE_PHASES.markup[1],
  CYCLE_PHASES.distribution[1],
];
const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Scene10 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const boxOut = f >= BOX_OUT.at ? fadeOut(f, BOX_OUT.at, BOX_OUT.over) : 1;
  const base =
    (f >= T.accumulation ? progress(f, T.accumulation, 30) : 0) * boxOut;
  const top =
    (f >= T.distribution ? progress(f, T.distribution, 30) : 0) * boxOut;

  /**
   * Close in and follow, then ease back to the plain framing. Both the zoom and
   * the position are blended toward rest independently, so the widening and the
   * sliding finish together and there is no seam where a clamp lets go.
   */
  const back =
    f >= PULL_BACK.at ? progress(f, PULL_BACK.at, PULL_BACK.over) : 0;
  const wide = BOX.w * ZOOM;
  const focus = WINDOW.left + (WINDOW.right - WINDOW.left) * HEAD_AT;
  const follow = clamp(focus - wide * draw, WINDOW.right - wide, WINDOW.left);
  const view = {
    ...BOX,
    x: lerp(follow, BOX.x, back),
    w: BOX.w * lerp(ZOOM, 1, back),
  };
  const G = barGrid(BARS, view, 0.12);
  const xAt = (t: number) => G.x(barAt(t));

  // ── and on the last frames, the camera starts closing on SC11 ──
  const g = f + SCENE_FROM;
  const push = cutPushOut(g, CUTS.toSize, PUSH);
  const blur = cutBlur(g, CUTS.toSize);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card>
          {/* the card is the window; the chart moves behind it */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0px ${theme.canvas.width - WINDOW.right}px 0px ${WINDOW.left}px)`,
            }}
          >
            {/* the stretch being named, right now */}
            <Layer>
              {PHASES.map((p, i) => {
                const next = PHASES[i + 1];
                const inAt = f >= p.at ? progress(f, p.at, SPOT) : 0;
                const outAt =
                  next && f >= next.at ? progress(f, next.at, SPOT) : 0;
                const on = inAt * (1 - outAt);
                if (on <= 0.001) return null;
                return (
                  <rect
                    key={`${p.label}${i}`}
                    x={xAt(p.win[0])}
                    y={BOX.y}
                    width={xAt(p.win[1]) - xAt(p.win[0])}
                    height={BOX.h}
                    fill={WASH[p.tone]}
                    opacity={on}
                  />
                );
              })}
            </Layer>

            {/* the base: a floor being built, so indigo */}
            <RangeBand
              x={xAt(CYCLE_PHASES.accumulation[0])}
              w={
                xAt(CYCLE_PHASES.accumulation[1]) -
                xAt(CYCLE_PHASES.accumulation[0])
              }
              top={BASE.top}
              bottom={BASE.bottom}
              tone="indigo"
              draw={base}
              label="Accumulation"
            />
            {/* the top: a ceiling forming, so cyan */}
            <RangeBand
              x={xAt(CYCLE_PHASES.distribution[0])}
              w={
                xAt(CYCLE_PHASES.distribution[1]) -
                xAt(CYCLE_PHASES.distribution[0])
              }
              top={TOP.top}
              bottom={TOP.bottom}
              tone="cyan"
              draw={top}
              label="Distribution"
            />

            <CandleChart
              bars={BARS}
              box={view}
              reveal={draw}
              axis={false}
              pad={0.12}
            />

            {/* what the camera leaves behind: the divisions it travelled past */}
            <Layer>
              {DIVIDERS.map((t) => {
                const on = clamp((draw - t) / 0.03, 0, 1);
                if (on <= 0.001) return null;
                return (
                  <line
                    key={t}
                    x1={xAt(t)}
                    y1={BOX.y}
                    x2={xAt(t)}
                    y2={BOX.y + BOX.h}
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.hairline}
                    strokeDasharray="8 8"
                    opacity={on * 0.55}
                  />
                );
              })}
            </Layer>
          </div>
        </Card>

        {/* one chip per phase, under the stretch of line it names */}
        {PHASES.map((p, i) => (
          <Chip
            key={`${p.label}${i}`}
            label={p.label}
            x={
              p.anchor === "left"
                ? xAt(p.win[0]) + 20
                : (xAt(p.win[0]) + xAt(p.win[1])) / 2
            }
            y={CHIP_Y}
            anchor={p.anchor ?? "center"}
            tone={p.tone}
            at={p.at}
          />
        ))}
      </div>
    </Stage>
  );
};
