/**
 * SC07 — Golden cross, death cross (from 3444, dur 690).
 *
 * ONE CHART, BOTH AVERAGES, TWO CROSSINGS. Price sits back at 0.4 so the two
 * lines dominate — the scene is about them, not about the series.
 *
 * THE LAG IS A SHADED REGION, NOT A NUMBER. The box covers the stretch of rise
 * that had already happened before the crossing printed, and one short arrow
 * runs from the start of that rise to the crossing point. v1 put "≈ 18 hari" on
 * it, which reads as an unsourced statistic; the box says the same thing and
 * claims nothing.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { Ping } from "../components/Ping";
import { Arrow } from "../components/Arrow";
import { theme } from "../theme";
import { sec, sma, textReveal, fadeOut } from "../helpers";
import { SERIES_CROSS, BARS_CROSS, domainOf } from "../series";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 3444;
const T = {
  title: sec(0.2),
  chart: sec(0.4),
  golden: sec(4.0),
  death: sec(7.0),
  lag: sec(12.0),
  caption: sec(18.0),
};
const FAST = 16;
const SLOW = 52;
const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
/** Room on the right for the price axis, so no label lands on the data. */
const AXIS_GUTTER = 150;
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN = domainOf(BARS_CROSS);
const G = gridOf(SERIES_CROSS, DOMAIN, CHART, 0.12, AXIS_GUTTER);
const F = sma(SERIES_CROSS, FAST);
const S = sma(SERIES_CROSS, SLOW);

/** Both crossings, found in the data rather than chosen by eye. */
const CROSS = (() => {
  let up = -1;
  let down = -1;
  for (let i = 1; i < SERIES_CROSS.length; i++) {
    const a = F[i - 1];
    const b = F[i];
    const c = S[i - 1];
    const d = S[i];
    if (a === null || b === null || c === null || d === null) continue;
    if (up < 0 && a <= c && b > d) up = i;
    else if (up > 0 && down < 0 && a >= c && b < d) down = i;
  }
  /* fallbacks clamped INTO the series — an out-of-range index put a label at
     an undefined price, which is how "Death Cross" ended up over the logo */
  const n = SERIES_CROSS.length;
  return {
    up: up < 0 ? Math.round(n * 0.35) : up,
    down: down < 0 ? Math.round(n * 0.75) : down,
  };
})();

/** Where price actually turned, before the crossing confirmed anything. */
const LOW = (() => {
  const from = Math.max(0, CROSS.up - 40);
  let best = from;
  for (let i = from; i < CROSS.up; i++) if (SERIES_CROSS[i] < SERIES_CROSS[best]) best = i;
  return best;
})();

export const Scene07 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toCross, 0.16);
  const dy = cutOut(g, CUTS.toBands);
  const blur = Math.max(cutBlur(g, CUTS.toCross), cutBlur(g, CUTS.toBands));
  const cap = textReveal(f, T.caption);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <ChartFrame
          closes={SERIES_CROSS}
          bars={BARS_CROSS}
          grid={G}
          f={f}
          drawFrom={T.chart}
          drawDur={sec(3)}
          ticks={TICKS}
          opacity={0.4}
        />
        <MALine values={S} grid={G} f={f} drawFrom={T.chart} drawDur={sec(3.4)} variant="slow" />
        <MALine values={F} grid={G} f={f} drawFrom={T.chart} drawDur={sec(3.4)} variant="fast" />

        <Ping x={G.x(CROSS.up)} y={G.y(F[CROSS.up]!)} f={f} at={T.golden} />
        <Ping x={G.x(CROSS.down)} y={G.y(F[CROSS.down]!)} f={f} at={T.death} />

        {/* the move that had already happened by the time the cross printed */}
        <HighlightBox
          x1={G.x(LOW)}
          x2={G.x(CROSS.up)}
          y1={CHART.y + 30}
          y2={CHART.y + CHART.h - 30}
          f={f}
          at={T.lag}
        />
        {f >= T.lag + sec(1) && (
          <Arrow
            from={{ x: G.x(LOW), y: G.y(SERIES_CROSS[LOW]) }}
            to={{ x: G.x(CROSS.up), y: G.y(SERIES_CROSS[CROSS.up]) }}
            f={f}
            at={T.lag + sec(1)}
            width={theme.shape.band}
          />
        )}

        <TitleChip text="Golden & Death Cross" f={f} at={T.title} />

        <LabelChip
          text="Golden Cross"
          x={G.x(CROSS.up)}
          y={G.y(F[CROSS.up]!)}
          f={f}
          at={T.golden + 8}
          anchor="above"
          opacity={f >= T.death ? fadeOut(f, T.death, 12) : 1}
        />
        <LabelChip
          text="Death Cross"
          x={G.x(CROSS.down)}
          y={G.y(F[CROSS.down]!)}
          f={f}
          at={T.death + 8}
          anchor="below"
          opacity={f >= T.lag ? fadeOut(f, T.lag, 12) : 1}
        />

        {f >= T.caption && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: theme.stage.captionY + cap.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.label.size,
              fontWeight: theme.text.label.weight,
              color: theme.color.ink,
              opacity: cap.opacity,
              whiteSpace: "nowrap",
            }}
          >
            Confirmation, Not a Trigger
          </div>
        )}
      </div>
    </SafeArea>
  );
};
