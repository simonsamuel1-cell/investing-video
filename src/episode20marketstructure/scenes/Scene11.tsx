/**
 * 5212 → 5854 — Trend size & speed.
 *
 * Module 1 separates SIZE by changing TIMEFRAME, not by drawing two shapes.
 * The major trend is the HOOK — the very chart the episode opened on, two years
 * of it. On "minor swing yang terjadi dari hari ke hari" one stretch is ringed,
 * the camera closes on it, and those bars resolve into many smaller ones. Same
 * price, same two years; a different bar size. That is what the sentence says,
 * so it is what the picture does.
 *
 * The window is picked on MONTH boundaries so both axes can be read: months
 * across the two years, then days across the three months inside the ring.
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
import {
  MAJOR_FROM,
  MAJOR_MONTHS,
  MAJOR_LENS,
  MAJOR_LENS_MONTHS,
  MINOR,
  STEEP,
} from "../data/shapes";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend yang berlangsung berbulan-bulan"
  ring: 169, // "minor swing yang terjadi dari hari ke hari"
  zoom: 205, // the camera closes on what the ring marked
  red: 274, // "satu candle merah"
  // 316 — "bisa saja cuma noise" is said, not written: the ring is already there
  shrink: 434, // inside "Begitu juga dengan kecepatannya:" — the card closes
  gradual: 473, // "tren yang naik bertahap" — the card it closed to gets its name
  steep: 560, // the second panel arrives beside it
  spike: 571, // "hampir vertikal"
};
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
/** Bars across the three months inside the ring. Roughly one per day. */
const FINE_N = 88;
/** The move that changes the timeframe, and the swap that lands inside it. */
const ZOOM_OVER = 46;
const SWAP = { at: T.zoom + 26, over: 20 };
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
 * Which candle it starts from is RED, further down.
 */
const RING_DOT = { r: 34, dx: 10, dy: 10 };
// ═══════════════════════════════════════════════════════════════════════════

const COARSE = BARS.slice(0, SHOWN);
const CG = barGrid(COARSE, BOX, 0.12);
const FINE = candles(MINOR, FINE_N, 53, 0.014);
const FG = barGrid(FINE, BOX, 0.12);

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
 * Zoom to FIT the ring, not by a round number: x so the ring fills the plot's
 * width, y so its price range fills the plot's height. That is what a charting
 * app does when you drag a box, and it is why the bars appear to split rather
 * than merely grow.
 */
const KX = BOX.w / RING.w;
const KY = (BOX.h * 0.76) / (RING.bottom - RING.top);
const RING_MID = { x: RING.x + RING.w / 2, y: (RING.top + RING.bottom) / 2 };
const CARD_MID = { x: theme.canvas.width / 2, y: BOX.y + BOX.h / 2 };

/** The reddest bar in the middle of the climb — what "satu candle merah" rings. */
const RED = (() => {
  const mid = Math.round(FINE_N * 0.55);
  for (let d = 0; d < FINE_N; d++) {
    for (const i of [mid + d, mid - d])
      if (i >= 0 && i < FINE_N && FINE[i].c < FINE[i].o) return i;
  }
  return mid;
})();

const PANELS = panelRects(2);
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
  const ring = f >= T.ring ? progress(f, T.ring, 22) : 0;
  const zoom = f >= T.zoom ? progress(f, T.zoom, ZOOM_OVER) : 0;
  const fine = f >= SWAP.at ? progress(f, SWAP.at, SWAP.over) : 0;

  // ── the card closing onto the left panel's slot, and keeping its chart ──
  const shrink = f >= T.shrink ? progressInOut(f, T.shrink, SHRINK_OVER) : 0;
  const open = 1 - shrink;
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

  /**
   * Interpolated from IDENTITY, not from the framing that puts the ring in the
   * middle. Solving `t = centre − k·ring` gives a non-zero offset even at k = 1,
   * which quietly slid the untouched chart a whole bar-width to the right and
   * left the card's white margins uneven.
   */
  const kx = 1 + (KX - 1) * zoom;
  const ky = 1 + (KY - 1) * zoom;
  const tx = zoom * (CARD_MID.x - KX * RING_MID.x);
  const ty = zoom * (CARD_MID.y - KY * RING_MID.y);
  const coarseTx = `translate(${tx}px, ${ty}px) scale(${kx}, ${ky})`;
  /** The small bars meet it coming the other way, so the two sizes converge. */
  const fineK = 0.9 + 0.1 * fine;

  const redX = FG.x(RED);
  const redY = FG.scale(FINE[RED].h);

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
              {fine < 0.999 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: coarseTx,
                    transformOrigin: "0px 0px",
                    opacity: 1 - fine,
                  }}
                >
                  <CandleChart
                    bars={COARSE}
                    box={BOX}
                    reveal={coarseDraw}
                    ticks={TICKS}
                    tickLabels={false}
                    pad={0.12}
                  />
                  {/* the ring travels with the chart it marks */}
                  {ring > 0.001 && (
                    <Layer opacity={ring * (1 - zoom)}>
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
                </div>
              )}
              {fine > 0.001 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translate(${CARD_MID.x * (1 - fineK)}px, ${CARD_MID.y * (1 - fineK)}px) scale(${fineK})`,
                    transformOrigin: "0px 0px",
                    opacity: fine,
                  }}
                >
                  {/* the baseline leaves with the month labels: once the card
                    is a panel there is no time axis left to rule off, and the
                    steep panel beside it has none either */}
                  <CandleChart
                    bars={FINE}
                    box={BOX}
                    pad={0.12}
                    axisOpacity={f >= T.shrink ? fadeOut(f, T.shrink, 10) : 1}
                  />
                </div>
              )}
              {/* the noise ring is pinned to a bar, so it rides along */}
              {f >= T.red && fine > 0.5 && (
                <Layer opacity={progress(f, T.red, 20) * open}>
                  <circle
                    cx={redX}
                    cy={redY + RING_DOT.dy}
                    r={RING_DOT.r}
                    fill="none"
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.rule}
                  />
                </Layer>
              )}
            </div>
          </div>

          {/* the months leave with the ZOOM: an axis that held still while
                  the bars grew would be measuring something off screen */}
          <TimeAxis
            marks={MAJOR_MONTHS}
            year={false}
            opacity={progress(f, T.major - 20, 30) * (1 - zoom)}
          />
          {/* Out AS the close starts, not across it: the labels sit under
                  the chart but outside the window, so a slow fade leaves the
                  last month hanging past the card's new right edge. */}
          <TimeAxis
            marks={MAJOR_LENS_MONTHS}
            year={false}
            opacity={fine * (f >= T.shrink ? fadeOut(f, T.shrink, 10) : 1)}
          />

          {/* The title names the TIMEFRAME on screen, so it changes with
                  it: the same slot says what you are looking at, rather than
                  two labels arguing about which chart this is. */}
          {coarseDraw > 0.5 && zoom < 0.999 && (
            <Chip
              label="Major Trend: Uptrend"
              x={theme.canvas.width / 2}
              y={TITLE_Y}
              tone="indigo"
              at={T.major}
              opacity={1 - zoom}
            />
          )}
          {zoom > 0.001 && (
            <Chip
              label="Minor Swing"
              x={theme.canvas.width / 2}
              y={TITLE_Y}
              tone="indigo"
              at={T.zoom}
              opacity={zoom * open}
            />
          )}

          {/* the pointer on the ring, which the title then takes over from */}
          {ring > 0.4 && zoom < 0.999 && (
            <Chip
              label="Minor swing"
              x={RING.x + RING.w / 2}
              y={RING.top - 46}
              tone="slate"
              at={T.ring + 10}
              opacity={1 - zoom}
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
