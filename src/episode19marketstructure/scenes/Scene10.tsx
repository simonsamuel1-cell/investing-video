/**
 * SC10 — Accumulation / distribution / cycle (from 4402, dur 810).
 *
 * The longest scene, and the only one that draws a whole cycle in one pass.
 * The line never restarts: markdown, base, markup, top and markdown again are
 * all one curve, because the point is that they are one thing seen at different
 * moments — not four diagrams.
 *
 * Room grammar holds: the base tints INDIGO (a floor is being built), the top
 * tints CYAN (a ceiling is forming). SC12 and SC13 then trade on exactly that.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { StructureLine } from "../components/StructureLine";
import { RangeBand } from "../components/RangeBand";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress } from "../helpers";
import { CYCLE, CYCLE_PHASES, geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  decline: 97, // "penurunan panjang"
  accum: 292, // "accumulation"
  markup: 336, // (rise)
  distrib: 508, // "distribution"
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
const DRAW_KEYS = [T.decline, T.accum, T.markup, T.distrib, T.cycle, T.cycle + 90];
const DRAW_VALS = [0, 0.28, 0.36, 0.78, 0.93, 1];
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 30, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
/** Half-height of each phase band around the prices it covers. */
const BAND_PAD = 26;
/** Kept well below the top 150px so it can never crowd the logo zone. */
const LOOP = { x: 1660, y: 250 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(CYCLE, BOX, { pad: 0.12 });

const windowBand = (win: [number, number]) => {
  const inside = CYCLE.pts.filter((p) => p.t >= win[0] && p.t <= win[1]).map((p) => p.p);
  return { yTop: G.y(Math.max(...inside)) - BAND_PAD, yBottom: G.y(Math.min(...inside)) + BAND_PAD };
};
const ACC = windowBand(CYCLE_PHASES.accumulation);
const DIS = windowBand(CYCLE_PHASES.distribution);

const PHASE_CHIPS = [
  { label: "Markdown", win: CYCLE_PHASES.markdown, variant: "slate" as const, at: "A" as const },
  { label: "Accumulation", win: CYCLE_PHASES.accumulation, variant: "indigo" as const, at: "A" as const },
  { label: "Markup", win: CYCLE_PHASES.markup, variant: "slate" as const, at: "B" as const },
  { label: "Distribution", win: CYCLE_PHASES.distribution, variant: "cyan" as const, at: "B" as const },
];

export const Scene10 = () => {
  const f = useCurrentFrame();

  // hold-then-move between the phase keyframes above
  const draw = (() => {
    for (let i = 1; i < DRAW_KEYS.length; i++) {
      if (f <= DRAW_KEYS[i]) {
        const u = (f - DRAW_KEYS[i - 1]) / Math.max(1, DRAW_KEYS[i] - DRAW_KEYS[i - 1]);
        return DRAW_VALS[i - 1] + (DRAW_VALS[i] - DRAW_VALS[i - 1]) * Math.max(0, Math.min(1, u));
      }
    }
    return f < DRAW_KEYS[0] ? 0 : 1;
  })();

  const acc = f >= T.accum ? progress(f, T.accum, 30) : 0;
  const dis = f >= T.distrib ? progress(f, T.distrib, 30) : 0;
  const loop = f >= T.loop ? progress(f, T.loop, 36) : 0;

  return (
    <SafeArea>
      <ChartCard>
        {/* the base: a floor being built, so indigo */}
        <RangeBand
          x={G.x(CYCLE_PHASES.accumulation[0])}
          w={G.x(CYCLE_PHASES.accumulation[1]) - G.x(CYCLE_PHASES.accumulation[0])}
          yTop={ACC.yTop}
          yBottom={ACC.yBottom}
          variant="indigo"
          draw={acc}
          label="Accumulation"
        />
        {/* the top: a ceiling forming, so cyan */}
        <RangeBand
          x={G.x(CYCLE_PHASES.distribution[0])}
          w={G.x(CYCLE_PHASES.distribution[1]) - G.x(CYCLE_PHASES.distribution[0])}
          yTop={DIS.yTop}
          yBottom={DIS.yBottom}
          variant="cyan"
          draw={dis}
          label="Distribution"
        />

        <StructureLine g={G} draw={draw} head />

        {/* the cycle repeats — said quietly, once, in the corner */}
        {loop > 0.001 && (
          <Layer opacity={loop}>
            <path d={`M ${LOOP.x} ${LOOP.y} a 34 34 0 1 1 -24 -32`} fill="none" stroke={theme.colors.slate} strokeWidth={theme.stroke.rule} strokeLinecap="round" />
            <polygon points={`${LOOP.x - 24},${LOOP.y - 44} ${LOOP.x - 32},${LOOP.y - 22} ${LOOP.x - 8},${LOOP.y - 26}`} fill={theme.colors.slate} />
          </Layer>
        )}
      </ChartCard>

      {/* one chip per phase, under the stretch of line it names */}
      {PHASE_CHIPS.map((c, i) => (
        <Chip
          key={c.label}
          label={c.label}
          x={(G.x(c.win[0]) + G.x(c.win[1])) / 2}
          y={theme.frame.captionY}
          variant={c.variant}
          startFrame={(c.at === "A" ? T.chipsA : T.chipsB) + (i % 2) * 22}
        />
      ))}
    </SafeArea>
  );
};
