/**
 * 5212 → 5854 — Trend size & speed.
 *
 * Module 1 separates SIZE, and it does it by changing TIMEFRAME rather than by
 * drawing two shapes. The major trend is a handful of fat candles across two
 * years; on "minor swing yang terjadi dari hari ke hari" the camera closes on
 * one stretch of it and those fat candles resolve into many small ones. Same
 * price, same two years — a different bar size. That is what the sentence says,
 * so it is what the picture does.
 *
 * There is no separate "trend line" drawn over the candles. A second smoothed
 * curve would be a second claim; the coarse candles ARE the trend, because a
 * coarse bar is a summary of everything inside it.
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
import { MAJOR, MAJOR_LENS, MAJOR_MONTHS, GRADUAL, STEEP } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend yang berlangsung berbulan-bulan"
  minor: 169, // "minor swing yang terjadi dari hari ke hari"
  red: 274, // "satu candle merah"
  noise: 316, // "bisa saja cuma noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 5212;
/** The dolly SC10 started is still closing on the first frames of this one. */
const PUSH = 0.18;
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
/**
 * Two bar sizes for one series. Twenty-four fat bars across two years is a
 * summary; sixty-three small ones across three months is the same price seen
 * one day at a time.
 */
const COARSE_N = 24;
const FINE_N = 63;
/** Days across the zoomed window — MAJOR_LENS is 12% of two years. */
const FINE_DAYS = [0, 30, 60, 90];
/** The move that changes the timeframe. */
const ZOOM = { at: T.minor, over: 50, to: 3 };
/** The small bars arrive over the tail of it. */
const SWAP = { at: T.minor + 30, over: 20 };
/** Where the axis labels sit under the plot. */
const AXIS_Y = 30;
// ═══════════════════════════════════════════════════════════════════════════

const COARSE = candles(MAJOR, COARSE_N, 19, 0.02);
const FINE = candles(cut(MAJOR, MAJOR_LENS), FINE_N, 61, 0.016);
const CG = barGrid(COARSE, BOX, 0.12);
const FG = barGrid(FINE, BOX, 0.12);

/**
 * The zoom is centred on MAJOR_LENS, which spans a trough and the peak after
 * it — so the window climbs overall and still has red bars inside it, which is
 * exactly the claim "satu candle merah ... bisa saja cuma noise".
 */
const WIN_MID = (MAJOR_LENS[0] + MAJOR_LENS[1]) / 2;
const coarseAt = (t: number) => Math.round(t * (COARSE_N - 1));
const WIN_BARS = COARSE.slice(coarseAt(MAJOR_LENS[0]), coarseAt(MAJOR_LENS[1]) + 1);
const WIN_Y = (CG.scale(Math.max(...WIN_BARS.map((b) => b.h))) + CG.scale(Math.min(...WIN_BARS.map((b) => b.l)))) / 2;
const WIN_X = BOX.x + BOX.w * WIN_MID;
const CARD_MID = { x: theme.canvas.width / 2, y: BOX.y + BOX.h / 2 };

/** The reddest bar in the middle of the climb — what "satu candle merah" points at. */
const RED = (() => {
  const mid = Math.round(FINE_N * 0.55);
  for (let d = 0; d < FINE_N; d++) {
    for (const i of [mid + d, mid - d]) {
      if (i >= 0 && i < FINE_N && FINE[i].c < FINE[i].o) return i;
    }
  }
  return mid;
})();

const PANELS = panelRects(2);
const paneBox = (i: number) => ({ x: PANELS[i].x + 70, y: PANELS[i].y + 100, w: PANELS[i].w - 140, h: PANELS[i].h - 250 });
const P_GRADUAL = plot(GRADUAL, paneBox(0), { pad: 0.14 });
const P_STEEP = plot(STEEP, paneBox(1), { pad: 0.14, range: [GRADUAL.lo, GRADUAL.hi] });

/** One time axis, drawn under the plot in whatever unit the timeframe is in. */
const TimeAxis = ({ marks, unit, opacity }: { marks: number[]; unit: string; opacity: number }) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      <line x1={BOX.x} y1={BOX.y + BOX.h} x2={BOX.x + BOX.w} y2={BOX.y + BOX.h} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
      {marks.map((m, i) => {
        const x = BOX.x + (BOX.w * i) / (marks.length - 1);
        return (
          <g key={m}>
            <line x1={x} y1={BOX.y + BOX.h} x2={x} y2={BOX.y + BOX.h + 10} stroke={theme.color.hairline} strokeWidth={theme.shape.hairline} />
            <text
              x={x}
              y={BOX.y + BOX.h + AXIS_Y}
              textAnchor="middle"
              fontFamily={theme.text.family}
              fontSize={theme.text.axis.size}
              fontWeight={theme.text.axis.weight}
              fill={theme.color.slate}
            >
              {m === 0 ? "0" : `${m} ${unit}`}
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
  const zoom = f >= ZOOM.at ? progress(f, ZOOM.at, ZOOM.over) : 0;
  const fine = f >= SWAP.at ? progress(f, SWAP.at, SWAP.over) : 0;
  const first = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  const second = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const left = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const right = f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  // ── arriving on the dolly the last scene left in flight ──
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toSize, PUSH);
  const blur = cutBlur(g, CUTS.toSize);

  /** The coarse chart closes on the window while the fine one takes over. */
  const k = 1 + (ZOOM.to - 1) * zoom;
  const coarseTx = `translate(${CARD_MID.x - k * WIN_X}px, ${CARD_MID.y - k * WIN_Y}px) scale(${k})`;
  /** The fine chart meets it coming the other way, so the two sizes converge. */
  const fineK = 0.88 + 0.12 * fine;

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
                  <div style={{ position: "absolute", inset: 0, transform: coarseTx, transformOrigin: "0px 0px", opacity: 1 - fine }}>
                    <CandleChart bars={COARSE} box={BOX} reveal={coarseDraw} axis={false} pad={0.12} />
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
                    <CandleChart bars={FINE} box={BOX} axis={false} pad={0.12} />
                  </div>
                )}
              </div>

              {/* the months leave with the ZOOM, not with the swap: an axis that
                  held still while the bars grew would be measuring nothing */}
              <TimeAxis marks={MAJOR_MONTHS} unit="bln" opacity={progress(f, T.major - 20, 30) * (1 - zoom)} />
              <TimeAxis marks={FINE_DAYS} unit="hari" opacity={fine} />

              {/* what the fat bars are: months of price, summarised */}
              {coarseDraw > 0.5 && zoom < 0.4 && (
                <Chip label="Major trend" x={BOX.x + BOX.w * 0.28} y={CG.scale(COARSE[coarseAt(0.28)].h) - 86} tone="indigo" at={T.major} />
              )}

              {/* and what the small ones are: the same price, day by day */}
              {fine > 0.5 && <Chip label="Minor swing" x={FG.x(Math.round(FINE_N * 0.2))} y={FG.scale(FINE[Math.round(FINE_N * 0.2)].h) - 86} tone="slate" at={SWAP.at + SWAP.over} />}

              {/* one red bar, ringed, then named for what it is */}
              {f >= T.red && fine > 0.5 && (
                <Layer opacity={progress(f, T.red, 20)}>
                  <circle cx={redX} cy={redY + 26} r={34} fill="none" stroke={theme.color.slate} strokeWidth={theme.shape.rule} />
                </Layer>
              )}
              {f >= T.noise && <Chip label="Noise" x={redX} y={redY - 60} tone="slate" at={T.noise} />}
            </Card>
          </div>
        )}

        <ComparePanels
          opacity={second}
          panels={[
            { title: "Bertahap", tone: "indigo", plot: P_GRADUAL, draw: left, titleAt: T.swap + 20, note: { label: "Lebih stabil", at: T.spike } },
            { title: "Hampir vertikal", tone: "cyan", plot: P_STEEP, draw: right, titleAt: T.swap + 20 },
          ]}
        />
      </div>
    </Stage>
  );
};
