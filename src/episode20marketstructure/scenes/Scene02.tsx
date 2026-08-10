/**
 * SC02 — Indicators before direction (from 462, dur 466).
 *
 * The scene opens with NO chart. "Market structure" arrives alone in the middle
 * of the frame, the sub-line joins it, and only then does the pair travel up to
 * the title strip and shrink to their working size — and the chart comes back
 * underneath them. The words earn the top of the frame instead of starting
 * there.
 *
 * The title block always RESERVES the sub-line's space, even before it fades
 * in. Without that the title would jump upward the moment the sub appeared,
 * because the block is anchored by its centre.
 *
 * The same candles as SC01, buried under tools and then dug back out. The
 * clearing move clips the OVERLAY GROUP only — the price itself never moves,
 * which is the argument: it was there the whole time.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, Card } from "../components/Stage";
import { CandleChart } from "../components/CandleChart";
import { Overlays, SubPane } from "../components/Studies";
import { TitleBlock, TITLE_BIG, TITLE_REST, TITLE_BIG_CY, TITLE_REST_CY } from "../components/TitleBlock";
import { theme } from "../theme";
import { progress, progressInOut, textReveal } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";
import { rsi, macdHistogram } from "../data/studies";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared curve. */
const SCENE_FROM = 462;

const T = {
  title: 0, // "market structure" — alone, centre frame
  sub: 102, // global 564 — the sub-line joins it
  settle: 165, // global 627 — the pair travels to the title strip
  chart: 178, // the chart returns under them
  clutter: 317, // global 779 — the tools start piling on
  clear: 428, // global 890 — the tools start clearing

};
const MOVE_OVER = 30; // frames the pair takes to travel and shrink
/**
 * 890 → 920. The tools hold, fully on screen, and only then clear.
 *
 * Eased in and out, symmetrically. The episode's `settle` curve is front-loaded
 * and would have the tools gone a third of the way in; a symmetric ease starts
 * and stops softly and still finishes on the frame it should.
 */
const CLEAR_OVER = 30;
/** How far the price is squeezed to make room for the panes underneath. */
const SQUEEZE = 0.38;

/**
 * The chart's box and gridlines, EXPORTED: SC03 opens on this exact geometry so
 * frame 928 is identical to frame 927 and the cut between them is invisible.
 */
export const CHART_BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 40, w: theme.stage.plot.w, h: theme.stage.plot.h - 40 };
export const CHART_TICKS = [4400, 4800, 5200, 5600, 6000];
const BOX = CHART_BOX;
/** The two sub-panes rise over the lower third. The price gets buried. */
const RSI_BOX = { x: theme.stage.plot.x, y: 662, w: theme.stage.plot.w, h: 84 };
const MACD_BOX = { x: theme.stage.plot.x, y: 758, w: theme.stage.plot.w, h: 84 };
/** Tight, so the last tool is on screen before the wipe starts clearing. */
const STAGGER = 6;
// ═══════════════════════════════════════════════════════════════════════════

const RSI = rsi(BARS);
const MACD = macdHistogram(BARS);
const HOLD = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene02 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;

  // ── arriving on the same camera move SC01 left on ──
  const enterDy = cutIn(g, CUTS.toTitle);
  const enterBlur = cutBlur(g, CUTS.toTitle);

  // ── the title block: centre frame, then up to the strip ──
  const travel = interpolate(f, [T.settle, T.settle + MOVE_OVER], [0, 1], { ...HOLD, easing: theme.motion.settle });
  const cy = interpolate(travel, [0, 1], [TITLE_BIG_CY, TITLE_REST_CY]);
  const titleSize = interpolate(travel, [0, 1], [TITLE_BIG.title, TITLE_REST.title]);
  const subSize = interpolate(travel, [0, 1], [TITLE_BIG.sub, TITLE_REST.sub]);
  const head = textReveal(f, T.title);
  const tail = textReveal(f, T.sub);

  // ── the chart returns once the words have moved out of its way ──
  const chartIn = f >= T.chart ? progress(f, T.chart, 30) : 0;

  const tool = (i: number) => progress(f, T.clutter + i * STAGGER, 30);
  // easy ease — symmetric, so it starts and stops softly and still lands
  // exactly on 920, unlike the episode's front-loaded settle curve
  const wipe = f >= T.clear ? progressInOut(f, T.clear, CLEAR_OVER) : 0;

  /**
   * The price gives up height as the tools arrive and takes it back as they
   * are cleared — which is the scene's argument in one move: the tools crowded
   * it out, and it was there the whole time.
   */
  const squeeze = (f >= T.clutter ? progress(f, T.clutter, 40) : 0) * (1 - wipe);
  const plot = { ...BOX, h: BOX.h * (1 - SQUEEZE * squeeze) };

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${enterDy}px)`,
          filter: enterBlur > 0.05 ? `blur(${enterBlur}px)` : undefined,
        }}
      >
        {/* absolute + inset so the clip further down has a box to clip INSIDE.
            A static wrapper collapses to zero height and takes the overlays with
            it, because the transform on it makes it their containing block. */}
        {chartIn > 0.001 && (
          <div style={{ position: "absolute", inset: 0, opacity: chartIn, transform: `translateY(${(1 - chartIn) * 40}px)` }}>
            <Card>
              {/* the axis stays at full strength: it has to hand over to SC03 */}
              <CandleChart bars={BARS} box={plot} ticks={CHART_TICKS} tickLabels={false} />


              {/* EVERY tool lives in this one group, so a single clip clears them all */}
              <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>
                <Overlays bars={BARS} box={plot} envelope={tool(0)} slow={tool(1)} fast={tool(2)} />
                <SubPane box={RSI_BOX} values={RSI} kind="line" rise={tool(3)} label="RSI (14)" bounds={[0, 100]} />
                <SubPane box={MACD_BOX} values={MACD} kind="bars" rise={tool(4)} label="MACD" />
              </div>
            </Card>
          </div>
        )}

        {/* the words: centre frame at first, then the header they become */}
        <TitleBlock cy={cy} titleSize={titleSize} subSize={subSize} head={head} tail={tail} />
      </div>
    </Stage>
  );
};
