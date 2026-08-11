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
 * Module 2 compares SPEED. The spec asks for a cross-wipe between the modules;
 * wipes are not used here, so the handover is a cross-fade.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { ComparePanels, panelRects } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { CUTS, cutPushIn, cutBlur } from "../transitions/CameraCut";
import { plot, window as cut, candles } from "../data/shape";
import {
  HOOK,
  MAJOR_FROM,
  MAJOR_MONTHS,
  MAJOR_LENS,
  MAJOR_LENS_MONTHS,
  GRADUAL,
  STEEP,
} from "../data/shapes";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend yang berlangsung berbulan-bulan"
  ring: 169, // "minor swing yang terjadi dari hari ke hari"
  zoom: 205, // the camera closes on what the ring marked
  red: 274, // "satu candle merah"
  noise: 316, // "bisa saja cuma noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
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
const FINE_N = 63;
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
// ═══════════════════════════════════════════════════════════════════════════

const COARSE = BARS.slice(0, SHOWN);
const CG = barGrid(COARSE, BOX, 0.12);
/**
 * MAJOR_LENS is a fraction of what is DISPLAYED, not of the whole hook curve —
 * so the sub-curve has to be rescaled by how much of the curve is on screen, or
 * the ring and the zoomed view would show different stretches of price.
 */
const HOOK_WIN: [number, number] = [
  (MAJOR_LENS[0] * SHOWN) / BARS.length,
  (MAJOR_LENS[1] * SHOWN) / BARS.length,
];
const FINE = candles(cut(HOOK, HOOK_WIN), FINE_N, 61, 0.016);
const FG = barGrid(FINE, BOX, 0.12);

/** Month `m` after the start of the series, as a label. */
const monthLabel = (m: number, withYear: boolean) => {
  const i = MAJOR_FROM.month + m;
  const name = MONTHS[((i % 12) + 12) % 12];
  return withYear ? `${name} ${MAJOR_FROM.year + Math.floor(i / 12)}` : name;
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
const P_GRADUAL = plot(GRADUAL, paneBox(0), { pad: 0.14 });
const P_STEEP = plot(STEEP, paneBox(1), {
  pad: 0.14,
  range: [GRADUAL.lo, GRADUAL.hi],
});

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
              textAnchor="middle"
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
  const first = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  const second = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const left = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const right =
    f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  // ── arriving on the dolly the last scene left in flight ──
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toSize, PUSH);
  const blur = cutBlur(g, CUTS.toSize);

  const kx = 1 + (KX - 1) * zoom;
  const ky = 1 + (KY - 1) * zoom;
  const coarseTx = `translate(${CARD_MID.x - kx * RING_MID.x}px, ${CARD_MID.y - ky * RING_MID.y}px) scale(${kx}, ${ky})`;
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
          transform: `scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {first > 0.001 && (
          <div style={{ position: "absolute", inset: 0, opacity: first }}>
            <Card>
              {/* the card is the window both timeframes are seen through */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(0px ${theme.canvas.width - (theme.stage.card.x + theme.stage.card.w)}px 0px ${theme.stage.card.x}px)`,
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
                    <CandleChart bars={FINE} box={BOX} pad={0.12} />
                  </div>
                )}
              </div>

              {/* the months leave with the ZOOM: an axis that held still while
                  the bars grew would be measuring something off screen */}
              <TimeAxis
                marks={MAJOR_MONTHS}
                year={false}
                opacity={progress(f, T.major - 20, 30) * (1 - zoom)}
              />
              <TimeAxis marks={MAJOR_LENS_MONTHS} year={false} opacity={fine} />

              {coarseDraw > 0.5 && zoom < 0.3 && (
                <Chip
                  label="Major Trend: Uptrend"
                  x={theme.canvas.width / 2}
                  y={TITLE_Y}
                  tone="indigo"
                  at={T.major}
                />
              )}
              {ring > 0.4 && zoom < 0.3 && (
                <Chip
                  label="Minor swing"
                  x={RING.x + RING.w / 2}
                  y={RING.top - 46}
                  tone="slate"
                  at={T.ring + 10}
                />
              )}

              {/* one red bar, ringed, then named for what it is */}
              {f >= T.red && fine > 0.5 && (
                <Layer opacity={progress(f, T.red, 20)}>
                  <circle
                    cx={redX}
                    cy={redY + 26}
                    r={34}
                    fill="none"
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.rule}
                  />
                </Layer>
              )}
              {f >= T.noise && (
                <Chip
                  label="Noise"
                  x={redX}
                  y={redY - 60}
                  tone="slate"
                  at={T.noise}
                />
              )}
            </Card>
          </div>
        )}

        <ComparePanels
          opacity={second}
          panels={[
            {
              title: "Bertahap",
              tone: "indigo",
              plot: P_GRADUAL,
              draw: left,
              titleAt: T.swap + 20,
              note: { label: "Lebih stabil", at: T.spike },
            },
            {
              title: "Hampir vertikal",
              tone: "cyan",
              plot: P_STEEP,
              draw: right,
              titleAt: T.swap + 20,
            },
          ]}
        />
      </div>
    </Stage>
  );
};
