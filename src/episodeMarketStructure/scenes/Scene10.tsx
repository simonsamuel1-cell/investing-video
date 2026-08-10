/**
 * SC10 — Accumulation, distribution, the cycle (from 4402, dur 810) — INDEPENDENT.
 *
 * The longest scene, and the only one that draws a whole cycle in one pass.
 * The line never restarts: markdown, base, markup, top, markdown again are all
 * one curve, because the point is that they are one thing seen at different
 * moments — not four separate diagrams.
 *
 * Room grammar holds: the base tints INDIGO (a floor is being built) and the
 * top tints CYAN (a ceiling is forming). SC12 and SC13 then trade on exactly
 * that association.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { Band } from "../components/Band";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress } from "../helpers";
import { CYCLE, CYCLE_PHASES, geom } from "../data/structures";
import { CARD, PLOT, CAPTION_Y } from "../layout";

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
 * The draw is keyed to the phases so the line is always where the narration
 * says it is: at the base when accumulation is named, at the top when
 * distribution is.
 */
const DRAW_KEYS = [T.decline, T.accum, T.markup, T.distrib, T.cycle, T.cycle + 90];
const DRAW_VALS = [0, 0.28, 0.36, 0.78, 0.93, 1];
const BOX = { x: PLOT.x, y: PLOT.y + 30, w: PLOT.w, h: PLOT.h - 120 };
/** Half-height of each phase band around the prices it covers. */
const BAND_PAD = 26;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(CYCLE, BOX, { pad: 0.12 });

/** The price extremes inside a `t` window — the band hugs the phase it marks. */
const windowBand = (win: [number, number]) => {
  const inside = CYCLE.pts.filter((p) => p.t >= win[0] && p.t <= win[1]).map((p) => p.p);
  return { yTop: G.y(Math.max(...inside)) - BAND_PAD, yBottom: G.y(Math.min(...inside)) + BAND_PAD };
};
const ACC = windowBand(CYCLE_PHASES.accumulation);
const DIS = windowBand(CYCLE_PHASES.distribution);

const PHASE_CHIPS = [
  { label: "Markdown", win: CYCLE_PHASES.markdown, variant: "slate" as const, at: "chipsA" as const },
  { label: "Accumulation", win: CYCLE_PHASES.accumulation, variant: "indigo" as const, at: "chipsA" as const },
  { label: "Markup", win: CYCLE_PHASES.markup, variant: "slate" as const, at: "chipsB" as const },
  { label: "Distribution", win: CYCLE_PHASES.distribution, variant: "cyan" as const, at: "chipsB" as const },
];

export const Scene10 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const draw = (() => {
    // hold-then-move between the phase keyframes above
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
      <ChartCard box={CARD}>
        {/* the base: a floor being built, so indigo */}
        <Band
          x={G.x(CYCLE_PHASES.accumulation[0])}
          w={G.x(CYCLE_PHASES.accumulation[1]) - G.x(CYCLE_PHASES.accumulation[0])}
          yTop={ACC.yTop}
          yBottom={ACC.yBottom}
          variant="indigo"
          draw={acc}
          label="Accumulation"
        />
        {/* the top: a ceiling forming, so cyan */}
        <Band
          x={G.x(CYCLE_PHASES.distribution[0])}
          w={G.x(CYCLE_PHASES.distribution[1]) - G.x(CYCLE_PHASES.distribution[0])}
          yTop={DIS.yTop}
          yBottom={DIS.yBottom}
          variant="cyan"
          draw={dis}
          label="Distribution"
        />

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {/* the cycle repeats — said quietly, in the corner, once */}
        {loop > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={loop}>
            <path
              d="M 1660 250 a 34 34 0 1 1 -24 -32"
              fill="none"
              stroke={pal.slate}
              strokeWidth={theme.stroke.rule}
              strokeLinecap="round"
            />
            <polygon points="1636,206 1628,228 1652,224" fill={pal.slate} />
          </svg>
        )}
      </ChartCard>

      {/* one chip per phase, under the stretch of line it names */}
      {PHASE_CHIPS.map((c, i) => (
        <Chip
          key={c.label}
          label={c.label}
          x={(G.x(c.win[0]) + G.x(c.win[1])) / 2}
          y={CAPTION_Y}
          variant={c.variant}
          startFrame={(c.at === "chipsA" ? T.chipsA : T.chipsB) + (i % 2) * 22}
        />
      ))}
    </SafeArea>
  );
};
