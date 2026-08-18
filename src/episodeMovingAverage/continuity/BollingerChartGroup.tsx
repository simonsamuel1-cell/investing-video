/**
 * CG-B — Scenes 08 + 09 as ONE spanning Sequence (global 4134 → 5439).
 *
 * The chart and the Bollinger overlay mount once and never unmount. The bands
 * keep breathing straight through the internal boundary at local 604, which is
 * the whole reason this is a group: Scene 09's squeeze is a stretch of the same
 * breathing Scene 08 just demonstrated, and a remount would present it as a
 * different chart with a coincidentally similar shape.
 *
 * THE BANDS UNFOLD OUT OF THE MIDDLE LINE. `BollingerBandsLayer` interpolates
 * each band's DISTANCE from the average rather than fading two lines in, so
 * what the viewer sees is the definition: a band is a distance from the mean.
 *
 * ⚠ COMPLIANCE (Scene 09, local 17.5–20.5s). The two ghosted arrows are built
 * from ONE object with a sign flip on `dir`. Identical opacity, identical
 * stroke, identical length, mirrored geometry — enforced by construction. Any
 * asymmetry would turn a volatility explainer into a directional call.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { Panel, BBWidthPanel } from "../components/Panels";
import { OrderBook } from "../components/OrderBook";
import { CandleChart } from "../components/CandleChart";
import { BollingerBandsLayer } from "../components/BollingerBandsLayer";
import { MeasureCaliper, CalloutTag } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { bollinger, sec, progress, progressInOut, fadeOut, textReveal, clamp01 } from "../helpers";
import { seriesGrid } from "../components/plot";
import { BREATHING, toBars } from "../data/series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 4134;
/** Scene 09 begins here, in the group's own local frames. */
const SC09 = 604;
const T = {
  title: sec(0.2),
  mid: sec(2.0),
  bands: sec(5.5),
  caliper: sec(10.0),
  breathe: sec(13.0),
  // ── Scene 09 ──
  head: SC09 + sec(0.2),
  squeeze: SC09 + sec(3.0),
  book: SC09 + sec(9.0),
  brief: SC09 + sec(13.0),
  arrows: SC09 + sec(17.5),
  chips: SC09 + sec(20.5),
};
const PERIOD = 20;
const BOX = { x: theme.stage.active.x + 40, y: 140, w: theme.stage.active.w - 80, h: 480 };
const WIDTH_PANEL = { x: theme.stage.active.x, y: 650, w: theme.stage.active.w, h: 140 };
/** Two calm→active cycles, scrubbed slowly — the ideation asks for exactly two. */
const CYCLE = sec(3.5);
/** The stretch Scene 09 calls the squeeze: the second calm window. */
const SQUEEZE = { from: 96, to: 134 };
/**
 * ⚠ ONE arrow, drawn twice with `dir` flipped. Never split this into two
 * objects — the moment they can drift, the graphic starts making a call.
 */
const ARROW = { len: 150, opacity: 0.4, width: theme.shape.line };
// ═══════════════════════════════════════════════════════════════════════════

const BARS = toBars(BREATHING, 818);
const BB = bollinger(BREATHING, PERIOD, 2);
const G = seriesGrid(BREATHING, BOX, 0.14, [
  Math.min(...BB.lower.filter((v): v is number => v !== null)),
  Math.max(...BB.upper.filter((v): v is number => v !== null)),
]);
/* The candles are handed the SAME domain as the bands below, so a band and the
   candle it is measured from can never disagree about where a price is. */
const MID_X = Math.round((SQUEEZE.from + SQUEEZE.to) / 2);

export const BollingerChartGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;

  const unfold = f >= T.bands ? progressInOut(f, T.bands, sec(4)) : 0;
  /** Where the playhead sits — the scene scrubs, it does not cut. */
  const reveal = f < T.breathe ? 1 : 1;
  /** Which stretch the caliper and the readout are reading. */
  const cycle = f < T.breathe ? 0 : clamp01((f - T.breathe) / (CYCLE * 2));
  const calm = Math.cos(cycle * Math.PI * 4) > 0;
  const at = f >= SC09 ? MID_X : Math.round(30 + cycle * 60);
  const upper = BB.upper[at] ?? BREATHING[at];
  const lower = BB.lower[at] ?? BREATHING[at];

  const squeeze = f >= T.squeeze ? progressInOut(f, T.squeeze, sec(1.4)) : 0;
  /** The highlight breathes gently once the VO says it rarely lasts. */
  const pulse = f >= T.brief ? 0.12 + 0.08 * (0.5 + 0.5 * Math.sin((f - T.brief) / 14)) : 0.12;
  const arrows = f >= T.arrows ? progressInOut(f, T.arrows, sec(1)) * (f >= T.chips ? fadeOut(f, T.chips, 12) : 1) : 0;

  const dy = cutIn(g, CUTS.toBands);
  const dx = cutOut(g, CUTS.toTrap);
  const blur = Math.max(cutBlur(g, CUTS.toBands), cutBlur(g, CUTS.toTrap));
  const head = textReveal(f, T.head);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card>
          <CandleChart bars={BARS} box={BOX} pad={0.14} range={[G.lo, G.hi]} axis={false} reveal={reveal} opacity={0.9} />
          {f >= T.mid && (
            <BollingerBandsLayer mid={BB.mid} upper={BB.upper} lower={BB.lower} grid={G} unfold={unfold} opacity={progress(f, T.mid, sec(1.5))} />
          )}

          {/* the squeeze, boxed on the chart it happens on */}
          {squeeze > 0.001 && (
            <Layer opacity={squeeze}>
              <rect
                x={G.x(SQUEEZE.from)}
                y={BOX.y}
                width={G.x(SQUEEZE.to) - G.x(SQUEEZE.from)}
                height={BOX.h}
                fill={theme.color.indigo}
                fillOpacity={pulse}
                rx={12}
              />
            </Layer>
          )}

          {/* ⚠ ONE object, drawn twice. See ARROW. */}
          {arrows > 0.001 &&
            [-1, 1].map((dir) => {
              const x = G.x(SQUEEZE.to);
              const y = (G.y(upper) + G.y(lower)) / 2;
              return (
                <Layer key={dir} opacity={arrows * ARROW.opacity}>
                  <line
                    x1={x}
                    y1={y}
                    x2={x + ARROW.len}
                    y2={y + dir * ARROW.len * 0.55}
                    stroke={theme.color.indigo}
                    strokeWidth={ARROW.width}
                    strokeLinecap="round"
                  />
                </Layer>
              );
            })}

          {f >= T.caliper && f < SC09 && (
            <MeasureCaliper
              from={{ x: G.x(at), y: G.y(upper) }}
              to={{ x: G.x(at), y: G.y(lower) }}
              label="Volatility"
              f={f}
              at={T.caliper}
              orientation="vertical"
            />
          )}
        </Card>

        {/* the section title, then the corner chip it shrinks to */}
        {f < T.mid + sec(1) ? (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: 300 + textReveal(f, T.title).dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.display.size,
              fontWeight: theme.text.display.weight,
              color: theme.color.ink,
              opacity: textReveal(f, T.title).opacity * fadeOut(f, T.mid, 14),
            }}
          >
            Bollinger Bands
          </div>
        ) : (
          f < T.head && <Chip label="Bollinger Bands" x={theme.stage.active.x} y={72} tone="indigo" anchor="left" at={T.mid} pill />
        )}

        {f >= T.mid && f < T.bands + sec(3) && (
          <CalloutTag text="Middle Band = Moving Average" x={G.x(24)} y={G.y(BB.mid[24] ?? BREATHING[24]) - 8} f={f} at={T.mid + sec(1)} side="above" />
        )}
        {f >= T.bands && f < SC09 && (
          <>
            <CalloutTag text="Upper Band" x={G.x(150)} y={G.y(BB.upper[150] ?? BREATHING[150]) - 8} f={f} at={T.bands + sec(2)} side="above" tone={theme.color.cyan} />
            <CalloutTag text="Lower Band" x={G.x(150)} y={G.y(BB.lower[150] ?? BREATHING[150]) + 8} f={f} at={T.bands + sec(2)} side="below" tone={theme.color.cyan} />
          </>
        )}

        {/* the reading, top-LEFT — never the logo's corner */}
        {f >= T.caliper && f < SC09 && (
          <Chip label={calm ? "Pasar tenang" : "Pergerakan membesar"} x={theme.stage.active.x + 420} y={72} tone={calm ? "slate" : "indigo"} anchor="left" at={T.caliper} pill />
        )}

        {/* ── Scene 09 ───────────────────────────────────────────────── */}
        {f >= T.head && (
          <div
            style={{
              position: "absolute",
              left: theme.stage.active.x,
              top: 72 + head.dy,
              transform: "translateY(-50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.h1.size,
              fontWeight: theme.text.h1.weight,
              color: theme.color.indigo,
              opacity: head.opacity,
            }}
          >
            Squeeze
          </div>
        )}
        {f >= T.squeeze && (
          <CalloutTag text="Squeeze" x={G.x(MID_X)} y={BOX.y + 18} f={f} at={T.squeeze + 6} side="below" />
        )}

        <BBWidthPanel
          rect={WIDTH_PANEL}
          width={BB.width}
          upto={BREATHING.length - 1}
          f={f}
          at={T.head}
          troughLabel="Level terendah"
          opacity={f >= T.head ? progress(f, T.head, sec(0.8)) : 0}
        />

        <OrderBook
          rect={{ x: 1180, y: 160, w: theme.stage.active.x + theme.stage.active.w - 1180, h: 440 }}
          f={f}
          at={T.book}
          opacity={f >= T.book ? progressInOut(f, T.book, 14) * (f >= T.brief ? fadeOut(f, T.brief, 14) : 1) : 0}
        />
        {f >= T.book && f < T.brief + 20 && (
          <CalloutTag text="Pembeli dan penjual sama-sama menunggu" x={1180 + 274} y={132} f={f} at={T.book + 12} side="below" tone={theme.color.slate} />
        )}

        {f >= T.brief && f < T.arrows && (
          <Chip label="Jarang bertahan lama." x={G.x(MID_X)} y={BOX.y - 22} tone="indigo" at={T.brief} pill />
        )}

        {arrows > 0.001 && (
          <Panel rect={{ x: theme.stage.active.x, y: 800, w: theme.stage.active.w, h: 116 }} opacity={arrows}>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: 858,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.ink,
                opacity: arrows,
                whiteSpace: "nowrap",
              }}
            >
              Squeeze memberi tahu <i>kapan</i>, bukan <i>ke mana</i>.
            </div>
          </Panel>
        )}

        <Chip label="Baca trend" x={theme.canvas.width / 2 - 200} y={858} tone="indigo" at={T.chips} pill />
        <Chip label="Baca level penting" x={theme.canvas.width / 2 + 200} y={858} tone="indigo" at={T.chips + 10} pill />
      </div>
    </Stage>
  );
};
