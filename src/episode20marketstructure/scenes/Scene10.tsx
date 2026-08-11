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
 * Drawn as CANDLES. The two phase bands are measured off the candles' own highs
 * and lows rather than off the closes, so a band always covers everything that
 * actually happened inside its window — a base drawn to the closes would leave
 * wicks hanging outside the floor it claims to describe.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress } from "../helpers";
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
/** Half-height of a phase band beyond the prices it covers. */
const BAND_PAD = 26;
/** Bars across the whole cycle. Dense enough to read as a chart, not a diagram. */
const COUNT = 120;
// ═══════════════════════════════════════════════════════════════════════════

const BARS = candles(CYCLE, COUNT, 53, 0.012);
const G = barGrid(BARS, BOX, 0.12);
/** A phase window, in bars. */
const barAt = (t: number) => Math.round(t * (BARS.length - 1));
const xAt = (t: number) => G.x(barAt(t));

const bandFor = (win: [number, number]) => {
  const inside = BARS.slice(barAt(win[0]), barAt(win[1]) + 1);
  return {
    top: G.scale(Math.max(...inside.map((b) => b.h))) - BAND_PAD,
    bottom: G.scale(Math.min(...inside.map((b) => b.l))) + BAND_PAD,
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

export const Scene10 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const base = f >= T.accumulation ? progress(f, T.accumulation, 30) : 0;
  const top = f >= T.distribution ? progress(f, T.distribution, 30) : 0;

  return (
    <Stage>
      <Card>
        {/* the stretch being named, right now */}
        <Layer>
          {PHASES.map((p, i) => {
            const next = PHASES[i + 1];
            const inAt = f >= p.at ? progress(f, p.at, SPOT) : 0;
            const outAt = next && f >= next.at ? progress(f, next.at, SPOT) : 0;
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
          box={BOX}
          reveal={draw}
          axis={false}
          pad={0.12}
        />
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
          y={theme.stage.caption.y}
          anchor={p.anchor ?? "center"}
          tone={p.tone}
          at={p.at}
        />
      ))}
    </Stage>
  );
};
