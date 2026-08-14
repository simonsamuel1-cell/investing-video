/**
 * 5212 → 5854 — Trend size & speed.
 *
 * Module 1 separates SIZE on ONE CHART. The major trend is the HOOK — the very
 * chart the episode opened on, two years of it — and it is the only chart the
 * module ever shows. On "minor swing yang terjadi dari hari ke hari" one stretch
 * of it is ringed, and on "satu candle merah" a single red bar ELSEWHERE on the
 * same chart is circled. Two marks, one picture: a swing is a stretch of the
 * trend, noise is one bar of it, and neither is an example of the other.
 *
 * THERE IS NO ZOOM AND NO SECOND TIMEFRAME. An earlier cut closed the camera on
 * the ring and resolved those bars into many smaller ones; that transition is
 * gone, and the minor-swing chart with it. The picture stops changing at 5395
 * and the major trend holds the card until the close into module 2.
 *
 * The window is picked on MONTH boundaries so the axis reads cleanly: months
 * across the two years, under the one chart.
 *
 * Module 2 compares SPEED, and there is no handover between the modules at all:
 * module 1's card CLOSES to a panel's width, keeps its chart, and is what the
 * comparison's gradual side then is. The steep panel arrives beside it.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import {
  ComparePanels,
  panelRects,
  PANEL_TITLE_DY,
} from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, progressInOut, fadeIn, fadeOut } from "../helpers";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";
import { candles } from "../data/shape";
import { MAJOR_FROM, MAJOR_MONTHS, MAJOR_LENS, STEEP } from "../data/shapes";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend yang berlangsung berbulan-bulan"
  ring: 169, // "minor swing yang terjadi dari hari ke hari"
  red: 274, // "satu candle merah" — one bar of this same chart, outside the ring
  // 316 — "bisa saja cuma noise" is said, not written: the ring is already there
  shrink: 434, // inside "Begitu juga dengan kecepatannya:" — the card closes
  gradual: 473, // "tren yang naik bertahap" — the card it closed to gets its name
  steep: 560, // the second panel arrives beside it
  spike: 571, // "hampir vertikal"
};
/**
 * The ring is fully drawn on 5395 and NOTHING follows it. That frame is where
 * module 1's picture stops moving: no camera close, no timeframe change, no
 * second chart. The scene from here to the shrink is the major trend plus two
 * marks on it.
 */
const RING_OVER = 14;
/**
 * …and it is GONE by 5478, eight frames before the noise circle arrives. The
 * two marks never share the frame: the swing is shown and put away, then one
 * red candle is picked out of the trend on its own. Overlapping them would ask
 * the viewer to read the circle as something inside the rectangle, which is the
 * one thing it is not.
 */
const RING_OUT = { at: 252, over: 14 };
/**
 * THE CLOSE INTO MODULE 2, at 5646. This IS the transition — there is no fade
 * and no second chart on the left.
 *
 * The card shuts from the RIGHT down to the width of a comparison panel while
 * the chart slides left underneath it by the same distance. So the chart is
 * never squeezed: what is left on screen is its own right-hand end, at its own
 * scale, and that card and that chart are what "Bertahap" then names and what
 * stays on screen to 5854. The timeline goes with it — an axis narrowed to a
 * slice would be labelling months that are no longer on screen.
 */
const SHRINK_OVER = 32;
/**
 * THE PANEL'S TILT — how far the LEFT edge of the closed panel drops, in pixels.
 *
 * "Bertahap" has to look like a climb, and the stretch of the trend left under
 * the panel opens level with where it ends. So as the card closes, the series is
 * leaned: the right-hand end is the PIVOT and does not move at all, and every
 * bar to its left is carried down in proportion to how far left it is.
 *
 * Each candle keeps its own body, wick and colour — only its LEVEL moves — so
 * what is tilted is the trend, not the bars. The price scale is pinned while it
 * happens, or the whole chart would rescale to follow its own tilt.
 *
 * It rides `shrink`, so it arrives with the close and never as a move of its
 * own: by the time the panel is a panel, the lean is already in it.
 */
const TILT = { px: 170 };
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 5212;
/** The dolly SC10 started is still closing on the first frames of this one. */
const PUSH = 0.18;
/**
 * Equal margins left and right — the shared plot rect leaves extra room on the
 * right for price labels, and this chart has none, so it would sit off-centre
 * on the card.
 */
const BOX = {
  x: theme.stage.card.x + 64,
  y: theme.stage.plot.y + 30,
  w: theme.stage.card.w - 128,
  h: theme.stage.plot.h - 100,
};
/**
 * The hook's chart, cut at 61 bars. It is the same series 3868 shows, stopped
 * earlier: the last stretch of the hook rolls over, and ending before it leaves
 * the two years reading as a climb — which is what "Major Trend: Uptrend" says.
 * The 61 bars then span the whole width, so the chart still ends at Jun 2026.
 */
const SHOWN = 61;
const TICKS = [4400, 4800, 5200, 5600, 6000];
/** Clear of the chart's own bottom rule — the timeline reads under the lines. */
const AXIS_Y = 46;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
/** Above the card, centred — the name of the whole picture, not of a stretch. */
const TITLE_Y = 130;
/**
 * THE NOISE RING — the circle drawn around the one red candle.
 *
 * `r` is its radius. `dx` and `dy` nudge it off that candle in canvas pixels:
 * dx positive moves it right, dy positive moves it DOWN from the candle's high.
 * Which candle it sits on is RED, further down.
 *
 * It is drawn on the MAJOR chart, on a red bar OUTSIDE the swing rectangle — so
 * the viewer never has to carry a mark from one picture across to another, and
 * the two marks never read as one containing the other.
 */
const RING_DOT = { r: 36, dx: 0, dy: 0 };
// ═══════════════════════════════════════════════════════════════════════════

const COARSE = BARS.slice(0, SHOWN);
const CG = barGrid(COARSE, BOX, 0.12);
/**
 * The price scale, pinned. Identical to what `barGrid` derives from COARSE, so
 * nothing moves — but stated explicitly, because once the bars are leaned they
 * no longer describe the scale they are drawn against.
 */
const RANGE: [number, number] = [
  Math.min(...COARSE.map((b) => b.l)),
  Math.max(...COARSE.map((b) => b.h)),
];
/** Price units per pixel, so the tilt can be set in pixels and read in price. */
const PX = (RANGE[1] - RANGE[0]) / (BOX.h * (1 - 0.12 * 2));

/** Month `m` after the start of the series, as a label. */
const monthLabel = (m: number, withYear: boolean) => {
  const i = MAJOR_FROM.month + m;
  const name = MONTHS[((i % 12) + 12) % 12];
  const year = MAJOR_FROM.year + Math.floor(i / 12);
  return withYear ? `${name} '${String(year).slice(2)}` : name;
};

const coarseAt = (t: number) => Math.round(t * (COARSE.length - 1));
const WIN = { i0: coarseAt(MAJOR_LENS[0]), i1: coarseAt(MAJOR_LENS[1]) };
const WIN_BARS = COARSE.slice(WIN.i0, WIN.i1 + 1);
const RING = {
  x: CG.x(WIN.i0) - 16,
  w: CG.x(WIN.i1) - CG.x(WIN.i0) + 32,
  top: CG.scale(Math.max(...WIN_BARS.map((b) => b.h))) - 22,
  bottom: CG.scale(Math.min(...WIN_BARS.map((b) => b.l))) + 22,
};
/**
 * The bar "satu candle merah" points at: the BIGGEST down bar OUTSIDE the swing
 * rectangle, with enough room either side for the circle to sit inside the plot.
 *
 * Outside, so the two marks are two separate observations about the same chart
 * rather than one nested in the other — the swing is a stretch, the noise is a
 * single bar anywhere on the trend, and neither is an example of the other.
 *
 * Biggest, not nearest-anything, because the line is about one red candle being
 * readable and dismissible at a glance — a doji with a red tint is neither.
 * Picking it by rule rather than by index also means the mark still lands on a
 * red candle if the hook's series is ever re-seeded; a circle round a green bar
 * would illustrate the opposite of the sentence.
 */
const RED = (() => {
  let best = 0;
  let size = -1;
  for (let i = 0; i < COARSE.length; i++) {
    if (i >= WIN.i0 && i <= WIN.i1) continue;
    const x = CG.x(i);
    if (x - RING_DOT.r < BOX.x || x + RING_DOT.r > BOX.x + BOX.w) continue;
    const drop = COARSE[i].o - COARSE[i].c;
    if (drop > size) {
      size = drop;
      best = i;
    }
  }
  return best;
})();
/** Centred on the body, so the circle sits ON the candle, not above it. */
const RED_AT = {
  x: CG.x(RED) + RING_DOT.dx,
  y: (CG.scale(COARSE[RED].o) + CG.scale(COARSE[RED].c)) / 2 + RING_DOT.dy,
};

const PANELS = panelRects(2);
/**
 * The first bar still on the card once it has closed to a panel — the tilt's
 * far end. Derived, so a change to the panel width moves it automatically.
 */
const FIRST_SHOWN = (() => {
  const slide = PANELS[0].w - theme.stage.card.w;
  for (let i = 0; i < COARSE.length; i++)
    if (CG.x(i) + slide >= theme.stage.card.x) return i;
  return 0;
})();
const LAST_BAR = COARSE.length - 1;
/**
 * The series leaned about its right-hand end. `k` is 0 at the pivot and 1 at
 * the panel's left edge, held at 1 for everything further left so the bars that
 * are off the card cannot run away below it.
 */
const leaned = (amount: number) =>
  amount <= 0.001
    ? COARSE
    : COARSE.map((b, i) => {
        const k = Math.min(
          1,
          Math.max(0, (LAST_BAR - i) / (LAST_BAR - FIRST_SHOWN)),
        );
        const d = -TILT.px * PX * k * amount;
        return { o: b.o + d, c: b.c + d, h: b.h + d, l: b.l + d };
      });
const paneBox = (i: number) => ({
  x: PANELS[i].x + 70,
  y: PANELS[i].y + 100,
  w: PANELS[i].w - 140,
  h: PANELS[i].h - 250,
});
/** Bars enough to read as a chart in a half-width panel, not a picket fence. */
const PANE_N = 34;
const C_STEEP = candles(STEEP, PANE_N, 43, 0.02);

/** One time axis, drawn under the plot in whatever unit the timeframe is in. */
const TimeAxis = ({
  marks,
  year,
  opacity,
}: {
  marks: number[];
  year: boolean;
  opacity: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      {marks.map((m, i) => {
        const x = BOX.x + (BOX.w * i) / (marks.length - 1);
        return (
          <g key={m}>
            <text
              x={x}
              y={BOX.y + BOX.h + AXIS_Y}
              textAnchor={
                i === 0 ? "start" : i === marks.length - 1 ? "end" : "middle"
              }
              fontFamily={theme.text.family}
              fontSize={theme.text.axis.size}
              fontWeight={theme.text.axis.weight}
              fill={theme.color.slate}
            >
              {monthLabel(m, year || i === 0)}
            </text>
          </g>
        );
      })}
    </Layer>
  );
};

export const Scene11 = () => {
  const f = useCurrentFrame();

  const coarseDraw = progress(f, T.major - 40, 90);
  const ring =
    (f >= T.ring ? progress(f, T.ring, RING_OVER) : 0) *
    (f >= RING_OUT.at ? 1 - progress(f, RING_OUT.at, RING_OUT.over) : 1);

  // ── the card closing onto the left panel's slot, and keeping its chart ──
  const shrink = f >= T.shrink ? progressInOut(f, T.shrink, SHRINK_OVER) : 0;
  const open = 1 - shrink;
  /** Everything under the chart leaves AS the card closes, not across it. */
  const axis = f >= T.shrink ? fadeOut(f, T.shrink, 10) : 1;
  const winW = theme.stage.card.w + (PANELS[0].w - theme.stage.card.w) * shrink;
  /** Exactly how far the right edge travelled, so the chart's end stays put. */
  const slide = winW - theme.stage.card.w;

  const steep = f >= T.steep ? fadeIn(f, T.steep, 22) : 0;
  const right = f >= T.spike ? progress(f, T.spike, 62) : 0;

  // ── arriving on the dolly the last scene left in flight, leaving on a rise ──
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toSize, PUSH);
  const dy = cutOut(g, CUTS.toLevel);
  /** The two moves never overlap, so the deeper one is always the live one. */
  const blur = Math.max(cutBlur(g, CUTS.toSize), cutBlur(g, CUTS.toLevel));

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
        <Card
          rect={{
            x: theme.stage.card.x,
            y: theme.stage.card.y,
            w: winW,
            h: theme.stage.card.h,
          }}
        >
          {/* the card is the window both timeframes are seen through */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0px ${theme.canvas.width - (theme.stage.card.x + winW)}px 0px ${theme.stage.card.x}px)`,
            }}
          >
            {/* the chart itself is NOT compressed — it travels left by
                  exactly what the window lost, so its right-hand end stays
                  against the right edge at its own scale */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: slide === 0 ? undefined : `translateX(${slide}px)`,
              }}
            >
              {/* ONE chart for the whole module. The baseline and gridlines
                  leave with the month labels: once the card is a panel there
                  is no time axis left to rule off, and the steep panel beside
                  it has none either. */}
              <CandleChart
                bars={leaned(shrink)}
                box={BOX}
                range={RANGE}
                reveal={coarseDraw}
                ticks={TICKS}
                tickLabels={false}
                pad={0.12}
                axisOpacity={axis}
              />
              {/* the swing: a stretch of this same chart */}
              {ring > 0.001 && (
                <Layer opacity={ring * open}>
                  <rect
                    x={RING.x}
                    y={RING.top}
                    width={RING.w}
                    height={RING.bottom - RING.top}
                    rx={12}
                    fill="none"
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.rule}
                  />
                </Layer>
              )}
              {/* …and the noise: one red bar of that stretch */}
              {f >= T.red && (
                <Layer opacity={progress(f, T.red, 20) * open}>
                  <circle
                    cx={RED_AT.x}
                    cy={RED_AT.y}
                    r={RING_DOT.r}
                    fill="none"
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.rule}
                  />
                </Layer>
              )}
            </div>
          </div>

          {/* Out AS the close starts, not across it: the labels sit under
                  the chart but outside the window, so a slow fade leaves the
                  last month hanging past the card's new right edge. */}
          <TimeAxis
            marks={MAJOR_MONTHS}
            year={false}
            opacity={progress(f, T.major - 20, 30) * axis}
          />

          {/* One title for the whole module, because there is one chart. It
                  holds until the card closes and "Bertahap" takes the slot. */}
          {coarseDraw > 0.5 && (
            <Chip
              label="Major Trend: Uptrend"
              x={theme.canvas.width / 2}
              y={TITLE_Y}
              tone="indigo"
              at={T.major}
              opacity={open}
            />
          )}

          {/* the pointer on the ring — it names the stretch, not the chart, and
                  it leaves exactly when the rectangle does */}
          {ring > 0.001 && (
            <Chip
              label="Minor swing"
              x={RING.x + RING.w / 2}
              y={RING.top - 46}
              tone="slate"
              at={T.ring + 4}
              opacity={open * Math.min(1, ring / 0.4)}
            />
          )}

          {/* Once the card is panel-sized it IS the left panel, so it takes the
              left panel's name — in the panel's own title slot, not the
              scene-title slot the timeframe labels were using. */}
          {f >= T.gradual && (
            <Chip
              label="Bertahap"
              x={PANELS[0].x + PANELS[0].w / 2}
              y={PANELS[0].y + PANEL_TITLE_DY}
              tone="indigo"
              at={T.gradual}
            />
          )}
        </Card>

        <ComparePanels
          opacity={steep}
          panels={[
            {
              title: "Hampir vertikal",
              tone: "cyan",
              rect: PANELS[1],
              bars: C_STEEP,
              box: paneBox(1),
              draw: right,
              titleAt: T.steep + 6,
            },
          ]}
        />
      </div>
    </Stage>
  );
};
