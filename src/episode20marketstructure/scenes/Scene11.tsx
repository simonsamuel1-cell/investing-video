/**
 * SC11 — Trend size & speed (from 5212, dur 643).
 *
 * Module 1 separates SIZE, and it does it with one shape drawn twice: MAJOR
 * with its jitter (the swings) and MAJOR_TREND without it (the trend). Same
 * legs, same seed, one flag apart. That is the claim the scene makes, so it is
 * built rather than illustrated — and the swings are drawn ON the trend band,
 * because that is the relationship being described.
 *
 * The lens then magnifies one swing until a single red candle fills it. Nothing
 * about the trend changed; only how close we stood.
 *
 * Module 2 compares SPEED. The spec asks for a cross-wipe between the modules;
 * wipes are not used here, so the handover is a cross-fade.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { StructureLine } from "../components/StructureLine";
import { ComparePanels, panelRects } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut, inset } from "../helpers";
import { CUTS, cutPushIn, cutBlur } from "../transitions/CameraCut";
import { plot, candles } from "../data/shape";
import {
  MAJOR,
  MAJOR_TREND,
  MAJOR_LENS,
  MAJOR_MONTHS,
  GRADUAL,
  STEEP,
} from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend"
  minor: 169, // "minor swing"
  lens: 274, // "satu candle merah"
  noise: 316, // "noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 5212;
/**
 * The camera is still closing when this scene starts: it arrives smaller than
 * its rest size and grows into it, which is the second half of the push that
 * began at 5199. "Tren juga punya ukuran" is spoken over the move.
 */
const PUSH = 0.18;
const BOX = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 30,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 100,
};
/** The magnified card that opens over the swing. */
const LENS_CARD = { x: 1090, y: 300, w: 470, h: 300 };
/** Candles across the two-year climb. */
const COUNT = 90;
/**
 * The trend band is wide and pale — the candles have to read THROUGH it, since
 * the scene's claim is that they are the same series at two sizes.
 */
const BAND_W = 26;
/** The time axis sits under the plot, inside the card. */
const AXIS_Y = 30;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The swings are CANDLES; the trend is the band behind them. Both are fitted to
 * the CANDLES' price range and to the candles' own x positions — plot() and
 * barGrid() share a vertical formula, so passing the bars' lo/hi and insetting
 * the trend box by half a slot makes the two line up exactly rather than
 * approximately.
 */
const MAJOR_BARS = candles(MAJOR, COUNT, 19, 0.012);
const G = barGrid(MAJOR_BARS, BOX, 0.12);
const B_LO = Math.min(...MAJOR_BARS.map((b) => b.l));
const B_HI = Math.max(...MAJOR_BARS.map((b) => b.h));
const SLOT = BOX.w / COUNT;
const P_TREND = plot(
  MAJOR_TREND,
  { ...BOX, x: BOX.x + SLOT / 2, w: BOX.w - SLOT },
  { pad: 0.12, range: [B_LO, B_HI] },
);
const barOf = (t: number) => Math.round(t * (COUNT - 1));

/**
 * The lens shows the SAME bars, not a fresh series drawn from the same window.
 * The claim is "nothing about the trend changed, only how close we stood", and
 * a separately generated set of candles would quietly make that false.
 */
const LENS_BARS = MAJOR_BARS.slice(
  barOf(MAJOR_LENS[0]),
  barOf(MAJOR_LENS[1]) + 1,
);
const LENS_BOX = inset(LENS_CARD, 30);
/** The rectangle hugs the CANDLES it contains — wicks included, not just closes. */
const LENS_IN = MAJOR_BARS.slice(
  barOf(MAJOR_LENS[0]),
  barOf(MAJOR_LENS[1]) + 1,
);
const LENS_RECT = {
  x: G.x(barOf(MAJOR_LENS[0])) - 18,
  w: G.x(barOf(MAJOR_LENS[1])) - G.x(barOf(MAJOR_LENS[0])) + 36,
  top: G.scale(Math.max(...LENS_IN.map((b) => b.h))) - 30,
  bottom: G.scale(Math.min(...LENS_IN.map((b) => b.l))) + 30,
};

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

export const Scene11 = () => {
  const f = useCurrentFrame();

  const trend = progress(f, T.major - 40, 120);
  const swings = f >= T.minor ? progress(f, T.minor, 46) : 0;
  const lens = f >= T.lens ? progress(f, T.lens, 34) : 0;
  const first = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  const second = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const left = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const right =
    f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  // ── arriving on the dolly SC10 left in flight ──
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toSize, PUSH);
  const blur = cutBlur(g, CUTS.toSize);

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
              <StructureLine
                plot={P_TREND}
                draw={trend}
                color={theme.color.indigo}
                width={BAND_W}
                opacity={0.3}
              />
              {swings > 0.001 && (
                <CandleChart
                  bars={MAJOR_BARS}
                  box={BOX}
                  reveal={swings}
                  axis={false}
                  pad={0.12}
                />
              )}

              {/* two years, in months — the span the narration is claiming */}
              {trend > 0.4 && (
                <Layer opacity={progress(f, T.major - 20, 30)}>
                  <line
                    x1={BOX.x}
                    y1={BOX.y + BOX.h}
                    x2={BOX.x + BOX.w}
                    y2={BOX.y + BOX.h}
                    stroke={theme.color.hairline}
                    strokeWidth={theme.shape.hairline}
                  />
                  {MAJOR_MONTHS.map((m, i) => {
                    const x = BOX.x + (BOX.w * i) / (MAJOR_MONTHS.length - 1);
                    return (
                      <g key={m}>
                        <line
                          x1={x}
                          y1={BOX.y + BOX.h}
                          x2={x}
                          y2={BOX.y + BOX.h + 10}
                          stroke={theme.color.hairline}
                          strokeWidth={theme.shape.hairline}
                        />
                        <text
                          x={x}
                          y={BOX.y + BOX.h + AXIS_Y}
                          textAnchor="middle"
                          fontFamily={theme.text.family}
                          fontSize={theme.text.axis.size}
                          fontWeight={theme.text.axis.weight}
                          fill={theme.color.slate}
                        >
                          {m === 0 ? "0" : `${m} bln`}
                        </text>
                      </g>
                    );
                  })}
                </Layer>
              )}

              {/* kept left of the lens card, which opens over the right half */}
              {trend > 0.5 && (
                <Chip
                  label="Major trend"
                  x={P_TREND.along(0.45).x}
                  y={P_TREND.along(0.45).y + 96}
                  tone="indigo"
                  at={T.major}
                />
              )}
              {swings > 0.4 && (
                <Chip
                  label="Minor swing"
                  x={G.x(barOf(0.2))}
                  y={G.scale(MAJOR_BARS[barOf(0.2)].h) - 76}
                  tone="slate"
                  at={T.minor + 24}
                />
              )}

              {lens > 0.001 && (
                <Layer>
                  <rect
                    x={LENS_RECT.x}
                    y={LENS_RECT.top}
                    width={LENS_RECT.w}
                    height={LENS_RECT.bottom - LENS_RECT.top}
                    fill="none"
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.rule}
                    rx={10}
                    opacity={lens}
                  />
                  <line
                    x1={LENS_RECT.x + LENS_RECT.w}
                    y1={(LENS_RECT.top + LENS_RECT.bottom) / 2}
                    x2={LENS_CARD.x}
                    y2={LENS_CARD.y + LENS_CARD.h / 2}
                    stroke={theme.color.slate}
                    strokeWidth={theme.shape.hairline}
                    opacity={lens * 0.7}
                  />
                </Layer>
              )}
            </Card>

            {lens > 0.2 && (
              <Card
                rect={LENS_CARD}
                radius={theme.shape.panelRadius}
                scale={0.9 + 0.1 * lens}
                opacity={lens}
              >
                <CandleChart
                  bars={LENS_BARS}
                  box={LENS_BOX}
                  axis={false}
                  opacity={lens}
                />
              </Card>
            )}
            {f >= T.noise && (
              <Chip
                label="Noise"
                x={LENS_CARD.x + LENS_CARD.w / 2}
                y={LENS_CARD.y + LENS_CARD.h + 46}
                tone="slate"
                at={T.noise}
              />
            )}
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
