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
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress } from "../helpers";
import { plot } from "../data/shape";
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
const DRAW_AT = [T.decline, T.accumulation, T.markup, T.distribution, T.cycle, T.cycle + 90];
const DRAW_TO = [0, 0.28, 0.36, 0.78, 0.93, 1];
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 20, w: theme.stage.plot.w, h: theme.stage.plot.h - 90 };
/** Half-height of a phase band beyond the prices it covers. */
const BAND_PAD = 26;
/** Well below the top 150px, so it can never crowd the logo zone. */
const LOOP = { x: 1620, y: 300 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(CYCLE, BOX, { pad: 0.12 });

const bandFor = (win: [number, number]) => {
  const inside = CYCLE.samples.filter((s) => s.t >= win[0] && s.t <= win[1]).map((s) => s.p);
  return { top: P.y(Math.max(...inside)) - BAND_PAD, bottom: P.y(Math.min(...inside)) + BAND_PAD };
};
const BASE = bandFor(CYCLE_PHASES.accumulation);
const TOP = bandFor(CYCLE_PHASES.distribution);

const PHASES = [
  { label: "Markdown", win: CYCLE_PHASES.markdown, tone: "slate" as const, wave: 0 },
  { label: "Accumulation", win: CYCLE_PHASES.accumulation, tone: "indigo" as const, wave: 0 },
  { label: "Markup", win: CYCLE_PHASES.markup, tone: "slate" as const, wave: 1 },
  { label: "Distribution", win: CYCLE_PHASES.distribution, tone: "cyan" as const, wave: 1 },
];

export const Scene10 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const base = f >= T.accumulation ? progress(f, T.accumulation, 30) : 0;
  const top = f >= T.distribution ? progress(f, T.distribution, 30) : 0;
  const loop = f >= T.loop ? progress(f, T.loop, 36) : 0;

  return (
    <Stage>
      <Card>
        {/* the base: a floor being built, so indigo */}
        <RangeBand
          x={P.x(CYCLE_PHASES.accumulation[0])}
          w={P.x(CYCLE_PHASES.accumulation[1]) - P.x(CYCLE_PHASES.accumulation[0])}
          top={BASE.top}
          bottom={BASE.bottom}
          tone="indigo"
          draw={base}
          label="Accumulation"
        />
        {/* the top: a ceiling forming, so cyan */}
        <RangeBand
          x={P.x(CYCLE_PHASES.distribution[0])}
          w={P.x(CYCLE_PHASES.distribution[1]) - P.x(CYCLE_PHASES.distribution[0])}
          top={TOP.top}
          bottom={TOP.bottom}
          tone="cyan"
          draw={top}
          label="Distribution"
        />

        <StructureLine plot={P} draw={draw} head />

        {/* the cycle repeats — said quietly, once, in the corner */}
        {loop > 0.001 && (
          <Layer opacity={loop}>
            <path d={`M ${LOOP.x} ${LOOP.y} a 34 34 0 1 1 -24 -32`} fill="none" stroke={theme.color.slate} strokeWidth={theme.shape.rule} strokeLinecap="round" />
            <polygon points={`${LOOP.x - 24},${LOOP.y - 44} ${LOOP.x - 32},${LOOP.y - 22} ${LOOP.x - 8},${LOOP.y - 26}`} fill={theme.color.slate} />
          </Layer>
        )}
      </Card>

      {/* one chip per phase, under the stretch of line it names */}
      {PHASES.map((p, i) => (
        <Chip
          key={p.label}
          label={p.label}
          x={(P.x(p.win[0]) + P.x(p.win[1])) / 2}
          y={theme.stage.caption.y}
          tone={p.tone}
          at={(p.wave === 0 ? T.chipsA : T.chipsB) + (i % 2) * 22}
        />
      ))}
    </Stage>
  );
};
