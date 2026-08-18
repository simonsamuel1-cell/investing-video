/**
 * CG-A — Scenes 02 + 03 as ONE spanning Sequence (global 659 → 1839).
 *
 * The price series, the axes and the fast MA are mounted ONCE, here, and both
 * halves annotate them. Scene 02 builds the cyan line out of a sliding window;
 * Scene 03 keeps that exact line, renames it MA20, and draws MA200 beside it.
 *
 * Mounting the halves separately would remount the chart and redraw the line
 * the viewer just watched being constructed — which would quietly undo the one
 * thing these two scenes prove together: that the second line is the same
 * object as the first, only measured over more days.
 *
 * SCENE 02'S MECHANIC IS LITERAL. The window advances in six DISCRETE steps,
 * not a glide, because a moving average is computed once per bar. Each step
 * lights the five closes inside the window and deposits one dot at its
 * right-hand edge; the dots persist and are what the line is finally drawn
 * through. Nothing about that is a metaphor.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { PriceLine } from "../components/PriceLine";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { ComparisonTable } from "../components/Panels";
import { CalloutTag, SlopeGuide } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, progress, progressInOut, fadeOut, textReveal, sec, clamp01 } from "../helpers";
import { seriesGrid } from "../components/plot";
import { EXPLAINER } from "../data/series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 659;
/** Scene 03 begins here, in the group's own local frames. */
const SC03 = 487;
const T = {
  title: sec(0.2),
  price: sec(2.0),
  window: sec(7.0), // the sliding window starts
  connect: sec(12.5), // the deposited dots become a line
  dim: sec(15.0),
  // ── Scene 03, still in GROUP-local frames ──
  twenty: SC03 + sec(0.2),
  twoHundred: SC03 + sec(1.6),
  relabel: SC03 + sec(3.0),
  slow: SC03 + sec(9.0),
  table: SC03 + sec(15.0),
  pulse: SC03 + sec(19.5),
};
/** Six discrete steps, one per bar of the window. */
const STEPS = 6;
const STEP_OVER = sec(5.5) / STEPS;
const WINDOW = 5;
/** Where the window sits: it walks the middle of the series, not the whole of it. */
const WIN_FROM = 40;
const BOX = { x: theme.stage.active.x, y: 200, w: theme.stage.active.w, h: 500 };
const MA_FAST = 20;
const MA_SLOW = 60;
// ═══════════════════════════════════════════════════════════════════════════

const G = seriesGrid(EXPLAINER, BOX, 0.12);
const FAST = sma(EXPLAINER, MA_FAST);
const SLOW = sma(EXPLAINER, MA_SLOW);
/** The five-day average — what Scene 02 is literally building. */
const FIVE = sma(EXPLAINER, WINDOW);

export const ExplainerChartGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;

  /** `Math.floor`, not a glide: the window jumps one bar at a time. */
  const step = f < T.window ? -1 : Math.min(STEPS - 1, Math.floor((f - T.window) / STEP_OVER));
  const winAt = WIN_FROM + Math.max(0, step) * 4;
  const connect = f >= T.connect ? progress(f, T.connect, 45) : 0;
  const priceDim = f >= T.dim ? 1 - progress(f, T.dim, 14) * 0.75 : 1;

  const slow = f >= T.slow ? 1 : 0;
  const tableOut = f >= T.pulse ? 1 - progress(f, T.pulse, 14) * 0.6 : 1;
  /** Both lines thicken once, together — "banyak trader memakai keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 24)) : 0;

  const dy = cutIn(g, CUTS.toAverage) + cutOut(g, CUTS.toTypes);
  const blur = Math.max(cutBlur(g, CUTS.toAverage), cutBlur(g, CUTS.toTypes));

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card>
          <PriceLine values={EXPLAINER} grid={G} f={f} at={T.price} over={sec(5)} opacity={priceDim} />

          {/* the window, and the five closes it is averaging */}
          {step >= 0 && connect < 0.999 && (
            <Layer opacity={1 - connect}>
              <rect
                x={G.x(winAt)}
                y={BOX.y}
                width={G.x(winAt + WINDOW) - G.x(winAt)}
                height={BOX.h}
                fill={theme.color.indigo12}
              />
              {Array.from({ length: WINDOW }, (_, k) => (
                <circle key={k} cx={G.x(winAt + k)} cy={G.y(EXPLAINER[winAt + k])} r={8} fill={theme.color.indigo} />
              ))}
            </Layer>
          )}

          {/* every dot deposited so far, and they persist */}
          {step >= 0 && (
            <Layer opacity={1 - connect * 0.4}>
              {Array.from({ length: step + 1 }, (_, k) => {
                const i = WIN_FROM + k * 4 + WINDOW - 1;
                const v = FIVE[i];
                return v === null ? null : <circle key={k} cx={G.x(i)} cy={G.y(v)} r={7} fill={theme.color.cyan} />;
              })}
            </Layer>
          )}

          {/* the dots become a line, and that line is Scene 03's MA20 */}
          <MovingAverageLine
            values={FAST}
            grid={G}
            f={f}
            at={T.connect}
            over={45}
            variant="fast"
            width={theme.shape.line + pulse * 1.5}
          />

          {/* the long one, which ignores the swings the short one chases */}
          <MovingAverageLine
            values={SLOW}
            grid={G}
            f={f}
            at={T.slow}
            over={sec(5)}
            variant="slow"
            opacity={slow}
            width={theme.shape.line + pulse * 1.5}
          />
        </Card>

        <Chip label="Moving Average" x={theme.stage.active.x} y={96} tone="indigo" anchor="left" at={T.title} pill />

        {step >= 0 && connect < 0.5 && (
          <CalloutTag
            text={`rata-rata ${WINDOW} hari`}
            x={G.x(winAt + WINDOW / 2)}
            y={BOX.y - 6}
            f={f}
            at={T.window}
            side="above"
          />
        )}

        <CalloutTag text="Harga harian" x={G.x(14)} y={G.y(EXPLAINER[14]) + 12} f={f} at={T.price + sec(2)} side="below" tone={theme.color.slate} />

        {/* the direction the smoothing was for */}
        {f >= T.dim && f < SC03 && (
          <SlopeGuide
            a={{ x: G.x(70), y: G.y(FAST[70] ?? EXPLAINER[70]) }}
            b={{ x: G.x(108), y: G.y(FAST[108] ?? EXPLAINER[108]) }}
            label="Arah utama"
            f={f}
            at={T.dim + 6}
            tone={theme.color.cyan}
          />
        )}

        {/* ── Scene 03 ───────────────────────────────────────────────── */}
        {f >= T.twenty && f < T.relabel + sec(3) && (
          <div
            style={{
              position: "absolute",
              left: theme.stage.active.x,
              top: 742 + textReveal(f, T.twenty).dy,
              fontFamily: theme.text.family,
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: theme.color.cyan,
              opacity: textReveal(f, T.twenty).opacity * fadeOut(f, T.relabel + sec(2), 14),
            }}
          >
            MA 20 = rata-rata 20 hari terakhir
          </div>
        )}
        {f >= T.twoHundred && f < T.slow + sec(4) && (
          <div
            style={{
              position: "absolute",
              left: theme.stage.active.x,
              top: 742 + theme.text.title.size + 20 + textReveal(f, T.twoHundred).dy,
              fontFamily: theme.text.family,
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: theme.color.indigo,
              opacity: textReveal(f, T.twoHundred).opacity * fadeOut(f, T.slow + sec(3), 14),
            }}
          >
            MA 200 = rata-rata 200 hari terakhir
          </div>
        )}

        {f >= T.relabel && (
          <CalloutTag text="Reaktif" x={G.x(96)} y={G.y(FAST[96] ?? EXPLAINER[96]) - 10} f={f} at={T.relabel} side="above" tone={theme.color.cyan} />
        )}
        {f >= T.slow && (
          <CalloutTag text="Arah besar" x={G.x(96)} y={G.y(SLOW[96] ?? EXPLAINER[96]) + 10} f={f} at={T.slow + sec(2)} side="below" tone={theme.color.indigo} />
        )}

        <ComparisonTable
          rect={{ x: theme.stage.active.x, y: 470, w: 820, h: 230 }}
          headers={["MA 20", "MA 200"]}
          headerTones={[theme.color.cyan, theme.color.indigo]}
          rows={[
            ["Reaksi", "Cepat", "Lambat"],
            ["Jarak ke harga", "Dekat", "Jauh"],
            ["Membaca", "Pergerakan dekat", "Arus utama"],
          ]}
          f={f}
          at={T.table}
          opacity={progressInOut(f, T.table, 12) * tableOut}
        />

        <Chip label="Banyak trader memakai keduanya." x={theme.canvas.width / 2} y={800} tone="indigo" at={T.pulse} pill />
      </div>
    </Stage>
  );
};
