/**
 * SC02 — Indicators before direction (from 462, dur 466).
 *
 * ⚠ THE SCENE OPENS INSIDE THE ROADMAP'S FIRST BOX. Simon: "dari scene transisi
 * dibuat continuous aja" — the "Market Structure" box is candles 37–53 of this
 * scene's chart, and Scene Transisi 1 pushes into it and CUTS onto this scene's
 * frame 11 (output 690), which is that box at full size. From there (output =
 * global + 217 in this scene, the first passage's length):
 *
 *   691   the 17 candles scale down a little, anchored at the bottom
 *   721   "Market Structure" rises in above them; the sub-line joins at 781
 *   844   the pair travels up to the title strip — and from 845 the camera
 *         pulls back off the 17 onto the whole chart, the card and the rest of
 *         the candles arriving around them
 *
 * Nothing is redrawn for the zoom: it is the chart itself, seen through
 * CandleChart's `view`, so the pull-back lands on the chart as it always was.
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
import { CandleChart, barGrid } from "../components/CandleChart";
import { Overlays, SubPane } from "../components/Studies";
import { TitleBlock, TITLE_BIG, TITLE_REST, TITLE_REST_CY } from "../components/TitleBlock";
import { theme } from "../theme";
import { progress, progressInOut, textReveal } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";
import { breathScale, BREATH_ORIGIN } from "../transitions/Breath";
import { rsi, macdHistogram } from "../data/studies";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared curve. */
const SCENE_FROM = 462;

const T = {
  shrink: 12, // output 691 — the 17 candles give up a little height, bottom fixed
  title: 42, // output 721 — "Market Structure" rises in above them
  sub: 102, // global 564 — the sub-line joins it
  settle: 165, // global 627 — the pair travels to the title strip
  pullBack: 166, // output 845 — "mulai dari 845, chartnya transisi jadi chart original"
  clutter: 317, // global 779 — the tools start piling on
  clear: 428, // global 890 — the tools start clearing

};
const MOVE_OVER = 30; // frames the pair takes to travel and shrink
const SHRINK_OVER = 30;
const PULL_BACK_OVER = 40;

/**
 * THE 17 — candles 37–53 (0-based 36–52), "17 candlesticks dari candle ke-37
 * dari chart 900". Zoomed until they stand 700px tall on a bottom edge of 890,
 * exactly where the roadmap's box drew its candles before, then "sedikit scale
 * down anchor bawah" to 3/4 of that.
 */
const FOCUS = { from: 36, to: 53 };
const OPEN = { height: 700, bottom: 890, shrink: 0.75 };
/** The title while it sits over the 17: its sub-line clears their tops by ~40px. */
const TITLE_OPEN_CY = 232;
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

// ── the camera on the 17 ──
const GRID = barGrid(BARS, CHART_BOX);
const IN_FOCUS = BARS.slice(FOCUS.from, FOCUS.to);
const FOCUS_TOP = GRID.scale(Math.max(...IN_FOCUS.map((b) => b.h)));
const FOCUS_BOTTOM = GRID.scale(Math.min(...IN_FOCUS.map((b) => b.l)));
/** The 17's bottom centre on the chart — the point the opening holds still. */
const ANCHOR = { x: (GRID.x(FOCUS.from) + GRID.x(FOCUS.to - 1)) / 2, y: FOCUS_BOTTOM };
const SCREEN = { x: theme.canvas.width / 2, y: OPEN.bottom };
const K_OPEN = OPEN.height / (FOCUS_BOTTOM - FOCUS_TOP);
const K_SHRUNK = K_OPEN * OPEN.shrink;
/** A zoom about the anchor, pinned to SCREEN — the scale-down keeps the bottom where it is. */
const anchored = (k: number) => ({ k, dx: SCREEN.x - ANCHOR.x * k, dy: SCREEN.y - ANCHOR.y * k });
/**
 * The pull-back is a PURE zoom — about the one point the shrunk view and the
 * unzoomed chart agree on — with the scale moving geometrically, so it reads
 * as a camera backing away, not as the picture sliding while it shrinks.
 */
const PIVOT = { x: anchored(K_SHRUNK).dx / (1 - K_SHRUNK), y: anchored(K_SHRUNK).dy / (1 - K_SHRUNK) };
const pulled = (t: number) => {
  const k = Math.pow(K_SHRUNK, 1 - t);
  return { k, dx: PIVOT.x * (1 - k), dy: PIVOT.y * (1 - k) };
};
/** The card, where the camera sees it. */
const cardIn = (v: { k: number; dx: number; dy: number }) => ({
  x: theme.stage.card.x * v.k + v.dx,
  y: theme.stage.card.y * v.k + v.dy,
  w: theme.stage.card.w * v.k,
  h: theme.stage.card.h * v.k,
});
const CAMERA = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.roadmap.ease } as const;

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
  const cy = interpolate(travel, [0, 1], [TITLE_OPEN_CY, TITLE_REST_CY]);
  const titleSize = interpolate(travel, [0, 1], [TITLE_BIG.title, TITLE_REST.title]);
  const subSize = interpolate(travel, [0, 1], [TITLE_BIG.sub, TITLE_REST.sub]);
  const head = textReveal(f, T.title);
  const tail = textReveal(f, T.sub);

  // ── the camera: on the 17, a little further back, then off them onto the chart ──
  const shrink = interpolate(f, [T.shrink, T.shrink + SHRINK_OVER], [0, 1], CAMERA);
  const pull = interpolate(f, [T.pullBack, T.pullBack + PULL_BACK_OVER], [0, 1], CAMERA);
  const view = pull > 0 ? pulled(pull) : anchored(K_OPEN * Math.pow(OPEN.shrink, shrink));
  /** The rest of the chart — the card, its rules, the other 75 candles — arrives with the pull-back. */
  const rest = interpolate(pull, [0, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const still = pull >= 1;

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            /* the long breath starts once the camera is back and only releases
               at the end of SC03 — the chart, its tools and the card ride it
               together */
            transform: `translateY(0px) scale(${breathScale(g)})`,
            transformOrigin: BREATH_ORIGIN,
          }}
        >
          {still ? (
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
          ) : (
            <>
              <Card rect={cardIn(view)} radius={theme.shape.cardRadius * view.k} opacity={rest} />
              <CandleChart
                bars={BARS}
                box={BOX}
                ticks={CHART_TICKS}
                tickLabels={false}
                axisOpacity={rest}
                view={view}
                focus={{ ...FOCUS, others: rest }}
              />
            </>
          )}
        </div>

        {/* the words: centre frame at first, then the header they become */}
        <TitleBlock cy={cy} titleSize={titleSize} subSize={subSize} head={head} tail={tail} />
      </div>
    </Stage>
  );
};
