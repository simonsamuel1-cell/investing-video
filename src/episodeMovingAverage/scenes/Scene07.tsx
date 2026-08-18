/**
 * SC07 — Golden cross, death cross, and lag (from 3444, dur 690).
 *
 * THE LAG IS MEASURED ON THE CHART, not asserted. Two dashed markers drop — one
 * on the low where price actually turned, one on the frame the crossing
 * appeared — and a caliper spans between them. The move that already happened
 * inside that gap is shaded, so "sebagian pergerakan sudah terjadi" is a
 * picture of the missed distance rather than a claim about it.
 *
 * [NEEDS DATA] The figure on the caliper is ON-CHART GEOMETRY between two
 * visible points of THIS illustrative series. It is not a statistic and no
 * wording near it may generalise ("rata-rata", "biasanya"). If Simon supplies a
 * measured figure from real data, replace `LAG_LABEL` and say where it is from.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { Panel } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { MeasureCaliper, CalloutTag } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, sec, textReveal, progress } from "../helpers";
import { seriesGrid } from "../components/plot";
import { CROSSES } from "../data/series";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 3444;
const T = {
  chart: sec(0.2),
  golden: sec(4.0),
  death: sec(6.5),
  strip: sec(9.5),
  lag: sec(12.5),
  chips: sec(19.0),
};
const FAST = 20;
const SLOW = 60;
const BOX = { x: theme.stage.active.x + 40, y: 160, w: theme.stage.active.w - 80, h: 520 };
const STRIP = { y: 700, h: 84 };
/** The number is geometry between two marked bars — see the header note. */
const LAG_LABEL = "≈ 18 hari";
// ═══════════════════════════════════════════════════════════════════════════

const G = seriesGrid(CROSSES, BOX, 0.12);
const F = sma(CROSSES, FAST);
const S = sma(CROSSES, SLOW);

/** The first bar the fast line is above the slow one, and the first it is below. */
const crossings = (() => {
  let up = -1;
  let down = -1;
  for (let i = 1; i < CROSSES.length; i++) {
    const a = F[i - 1];
    const b = F[i];
    const c = S[i - 1];
    const d = S[i];
    if (a === null || b === null || c === null || d === null) continue;
    if (up < 0 && a <= c && b > d) up = i;
    if (up > 0 && down < 0 && a >= c && b < d) down = i;
  }
  return { up, down };
})();

/** The low price turned on, before the crossing confirmed anything. */
const LOW = (() => {
  const from = Math.max(0, crossings.up - 40);
  let best = from;
  for (let i = from; i < crossings.up; i++) if (CROSSES[i] < CROSSES[best]) best = i;
  return best;
})();

export const Scene07 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toCross, 0.16);
  const dy = cutOut(g, CUTS.toBands);
  const blur = Math.max(cutBlur(g, CUTS.toCross), cutBlur(g, CUTS.toBands));
  const strip = textReveal(f, T.strip);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card>
          <PriceLine values={CROSSES} grid={G} f={f} at={T.chart} over={sec(4)} opacity={0.35} />
          <MovingAverageLine values={S} grid={G} f={f} at={T.chart} over={sec(4)} variant="slow" />
          <MovingAverageLine values={F} grid={G} f={f} at={T.chart} over={sec(4)} variant="fast" />

          {/* the two crossings, marked where they actually happen */}
          {[
            { i: crossings.up, at: T.golden, label: "Golden Cross" },
            { i: crossings.down, at: T.death, label: "Death Cross" },
          ].map((c) =>
            f < c.at || c.i < 0 ? null : (
              <Layer key={c.label} opacity={progress(f, c.at, 12)}>
                <line x1={G.x(c.i) - 18} y1={G.y(F[c.i]!)} x2={G.x(c.i) + 18} y2={G.y(F[c.i]!)} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
                <line x1={G.x(c.i)} y1={G.y(F[c.i]!) - 18} x2={G.x(c.i)} y2={G.y(F[c.i]!) + 18} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
              </Layer>
            ),
          )}
          {/* the move that had already happened by the time the cross printed */}
          {f >= T.lag && crossings.up >= 0 && (
            <>
              <Layer opacity={progress(f, T.lag, 14)}>
                <rect
                  x={G.x(LOW)}
                  y={BOX.y}
                  width={G.x(crossings.up) - G.x(LOW)}
                  height={BOX.h}
                  fill={theme.color.indigo12}
                />
                {[LOW, crossings.up].map((i) => (
                  <line key={i} x1={G.x(i)} y1={BOX.y} x2={G.x(i)} y2={BOX.y + BOX.h} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} strokeDasharray="8 8" />
                ))}
              </Layer>
              <CalloutTag text="Harga mulai naik" x={G.x(LOW) - 16} y={BOX.y + BOX.h - 40} f={f} at={T.lag + 6} side="left" tone={theme.color.slate} />
              <CalloutTag text="Crossing muncul" x={G.x(crossings.up) + 16} y={BOX.y + BOX.h - 40} f={f} at={T.lag + 12} side="right" tone={theme.color.slate} />
              <MeasureCaliper
                from={{ x: G.x(LOW), y: BOX.y + 96 }}
                to={{ x: G.x(crossings.up), y: BOX.y + 96 }}
                label={LAG_LABEL}
                f={f}
                at={T.lag + 18}
                orientation="horizontal"
              />
              <CalloutTag
                text="Sebagian pergerakan sudah terjadi"
                x={(G.x(LOW) + G.x(crossings.up)) / 2}
                y={BOX.y + BOX.h - 130}
                f={f}
                at={T.lag + 30}
                side="above"
              />
            </>
          )}
            {crossings.up >= 0 && (
            <CalloutTag text="Golden Cross" x={G.x(crossings.up)} y={G.y(F[crossings.up]!) - 54} f={f} at={T.golden + 8} side="above" />
          )}
          {crossings.down >= 0 && (
            <CalloutTag text="Death Cross" x={G.x(crossings.down)} y={G.y(F[crossings.down]!) + 24} f={f} at={T.death + 8} side="below" />
          )}
        </Card>

        {f >= T.strip && f < T.lag && (
          <Panel rect={{ x: theme.stage.active.x, y: STRIP.y + strip.dy, w: theme.stage.active.w, h: STRIP.h }} opacity={strip.opacity}>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: STRIP.y + STRIP.h / 2 + strip.dy,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.ink,
                opacity: strip.opacity,
              }}
            >
              Crossing ≠ aba-aba entry.
            </div>
          </Panel>
        )}

        <Chip label="Konfirmasi trend" x={theme.canvas.width / 2 - 260} y={758} tone="indigo" at={T.chips} check pill />
        <Chip label="Meramal harga" x={theme.canvas.width / 2 + 260} y={758} tone="slate" at={T.chips + 10} strike={progress(f, T.chips + 20, 14)} pill />
      </div>
    </Stage>
  );
};
