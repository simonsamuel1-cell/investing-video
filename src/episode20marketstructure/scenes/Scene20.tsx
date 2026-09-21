/**
 * SC20 — the closer (from 10122, dur 464).
 *
 * THE EPISODE ENDS ON THE CHART IT OPENED WITH. Same series, same box, same
 * gridlines as SC01 — not a redrawn lookalike but literally `BARS`, imported
 * from the scene that first showed it. SC01 asked three questions over this
 * chart and refused to answer them; by here the viewer has been given the
 * grammar to answer them, and the argument is made by showing the same picture
 * rather than by saying so.
 *
 * Then the closing order, in the order the narration gives it: first the three
 * directions the structure can take, and only after those have been read do the
 * indicators arrive on top of them. That sequence IS the point — the tools are
 * added to a reading, never used instead of one.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, textReveal } from "../helpers";
import { CUTS, cutPushIn, cutBlur } from "../transitions/CameraCut";
import { BARS } from "./Scene01";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 10122;
/** NEGATIVE, so this chart arrives OVERSIZED and settles — see CUTS.toWhole. */
const PULL = -0.16;
const T = {
  chart: 10, // "Kalau kamu sudah bisa membaca struktur harga,"
  arrows: 153, // 10275
  arrowsGone: 250, // 10372 — they have been read; the tools follow
  tools: 260, // 10382 — "barulah tambahkan indikator atau alat bantu"
  out: 430, // 10552 — the voice has finished; everything goes
};
/** How long the series takes to plot across the card. */
const DRAW_OVER = 150;
/** One rise and one fall — the episode's motif, never a loop. */
const BREATH = { at: 180, over: 300, amount: 0.03 };
/**
 * SC01's box and gridlines, repeated exactly. If either scene's framing moves,
 * they must move together — the whole point is that this is the same picture.
 */
const BOX = {
  x: theme.stage.card.x + 64,
  y: theme.stage.plot.y + 96,
  w: theme.stage.card.w - 128,
  h: theme.stage.plot.h - 96,
};
const GRID = [4400, 4800, 5200, 5600, 6000];
/**
 * The title, on the card rather than above it, and riding the breath with
 * everything else. Type in this episode does NOT normally scale — SC01 keeps
 * its three questions out of the breath for exactly that reason — but this line
 * was asked for as part of the moving group, so it is one object with the card.
 */
const TITLE = { text: "Kuasai membaca struktur harga", y: 268 };
/**
 * ═══ THE THREE DIRECTIONS — EDIT THESE ═══
 *
 * One entry per arrow, in the order they arrive. `x` and `y` are where its
 * TAIL sits, in canvas pixels; the head is drawn `len` away on the bearing.
 *
 * `deg` is in SCREEN degrees, so a NEGATIVE angle points UP: 0 is flat to the
 * right, −30 is up-right, 30 is down-right.
 *
 * `len` and `head` are shared, so the three stay the same size as each other —
 * they are three readings of one thing, not three different claims.
 */
const ARROWS = {
  len: 250,
  head: 20,
  /**
   * Heavier than the episode's 3px `line`, because these are not price — they
   * are the reading laid over it, and at 3px they were competing with the
   * candles instead of sitting above them.
   */
  weight: 5,
  /**
   * Half the head's width. It has to clear `weight` by a good margin or the
   * head reads as a bulge in the shaft rather than as a point.
   */
  spread: 12,
  /** Frames one arrow takes to draw, and the gap before the next starts. */
  over: 15,
  step: 25,
  list: [
    { x: 290, y: 550, deg: 0 },
    { x: 960, y: 660, deg: -30 },
    { x: 1380, y: 422, deg: 30 },
  ],
};
/**
 * The tools, drawn ON the chart rather than named beside it — an indicator is
 * a line over price, and showing it as one keeps the claim honest: it is
 * derived from the structure, not a second opinion about it.
 */
const TOOLS = [
  { label: "MA 5", period: 5, tone: "cyan" as const, at: 260, over: 44 },
  { label: "MA 20", period: 20, tone: "indigo" as const, at: 300, over: 44 },
];
const OUT_OVER = 30;
// ═══════════════════════════════════════════════════════════════════════════

const CENTRE = `${theme.stage.card.x + theme.stage.card.w / 2}px ${theme.stage.card.y + theme.stage.card.h / 2}px`;
const G = barGrid(BARS, BOX, 0.08);

/** A moving average of the closes, in the candles' own coordinate space. */
const maPath = (period: number) => {
  const pts: string[] = [];
  for (let i = period - 1; i < BARS.length; i++) {
    let sum = 0;
    for (let k = 0; k < period; k++) sum += BARS[i - k].c;
    pts.push(`${pts.length ? "L" : "M"}${G.x(i).toFixed(1)},${G.scale(sum / period).toFixed(1)}`);
  }
  return pts.join(" ");
};
/** Straight-line length is close enough for a trim on a line this smooth. */
const MA_LEN = G.x(BARS.length - 1) - G.x(0);

export const Scene20 = () => {
  const f = useCurrentFrame();
  const plotted = progress(f, T.chart, DRAW_OVER);
  const breath =
    f >= BREATH.at && f < BREATH.at + BREATH.over
      ? Math.sin(Math.PI * ((f - BREATH.at) / BREATH.over))
      : 0;
  const title = textReveal(f, T.chart);
  const arrowsGone =
    f >= T.arrowsGone ? fadeOut(f, T.arrowsGone, 16) : 1;
  /** Everything goes together — the closer is one picture, not a list. */
  const out = f >= T.out ? fadeOut(f, T.out, OUT_OVER) : 1;

  // ── arriving on the pull-back SC19 left in flight ──
  const g = f + SCENE_FROM;
  const pull = cutPushIn(g, CUTS.toWhole, PULL);
  const cut = cutBlur(g, CUTS.toWhole);

  return (
    <Stage>
      {/* card, candles, gridlines, title, arrows and tools ride the breath
        TOGETHER — one object, as SC01 treats its own chart */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${(1 + BREATH.amount * breath) * pull})`,
          transformOrigin: CENTRE,
          filter: cut > 0.05 ? `blur(${cut}px)` : undefined,
          opacity: out,
        }}
      >
        <Card>
          <CandleChart
            bars={BARS}
            box={BOX}
            reveal={plotted}
            ticks={GRID}
            tickLabels={false}
          />

          {TOOLS.map((tool) => {
            const draw = f >= tool.at ? progress(f, tool.at, tool.over) : 0;
            if (draw <= 0.001) return null;
            return (
              <Layer key={tool.label}>
                <path
                  d={maPath(tool.period)}
                  fill="none"
                  stroke={theme.color[tool.tone]}
                  strokeWidth={theme.shape.rule}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={MA_LEN}
                  strokeDashoffset={MA_LEN * (1 - draw)}
                />
              </Layer>
            );
          })}

          {/* the three directions, before any tool is on the chart */}
          {arrowsGone > 0.001 &&
            ARROWS.list.map((a, i) => {
              const at = T.arrows + i * ARROWS.step;
              if (f < at) return null;
              const draw = progress(f, at, ARROWS.over);
              const rad = (a.deg * Math.PI) / 180;
              const ux = Math.cos(rad);
              const uy = Math.sin(rad);
              const tip = {
                x: a.x + ux * ARROWS.len * draw,
                y: a.y + uy * ARROWS.len * draw,
              };
              const back = { x: -ux * ARROWS.head, y: -uy * ARROWS.head };
              const side = { x: -uy * ARROWS.spread, y: ux * ARROWS.spread };
              /**
               * The head arrives, and the SHAFT GETS OUT OF ITS WAY. A stroke
               * this heavy has a round cap half its weight long, which ran
               * straight past the apex and blunted the point — so the shaft
               * stops inside the head as the head fades up. `0.85` leaves it
               * overlapping enough that no gap can open between them.
               */
              const headIn = progress(f, at + ARROWS.over * 0.7, 8);
              const shaft = {
                x: tip.x - ux * ARROWS.head * 0.85 * headIn,
                y: tip.y - uy * ARROWS.head * 0.85 * headIn,
              };
              return (
                <Layer key={a.deg} opacity={arrowsGone}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={shaft.x}
                    y2={shaft.y}
                    stroke={theme.color.indigo}
                    strokeWidth={ARROWS.weight}
                    strokeLinecap="round"
                  />
                  {headIn > 0.001 && (
                    <polygon
                      points={`${tip.x},${tip.y} ${tip.x + back.x + side.x},${tip.y + back.y + side.y} ${tip.x + back.x - side.x},${tip.y + back.y - side.y}`}
                      fill={theme.color.indigo}
                      opacity={headIn}
                    />
                  )}
                </Layer>
              );
            })}

          {/* what the tools are labels for, named once each */}
          {TOOLS.map((tool, i) => (
            <Chip
              key={tool.label}
              label={tool.label}
              x={BOX.x + 8 + i * 130}
              y={BOX.y + 26}
              tone={tool.tone}
              anchor="left"
              size={theme.text.tag.size}
              at={tool.at + 10}
            />
          ))}
        </Card>

        <div
          style={{
            position: "absolute",
            left: theme.canvas.width / 2,
            top: TITLE.y + title.dy,
            transform: "translate(-50%, -50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.title.size,
            fontWeight: theme.text.title.weight,
            color: theme.color.ink,
            opacity: title.opacity,
            whiteSpace: "nowrap",
          }}
        >
          {TITLE.text}
        </div>
      </div>
    </Stage>
  );
};
