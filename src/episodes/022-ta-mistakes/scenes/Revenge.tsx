/**
 * SC07 · THE REVENGE TRADE.  `from 5394 · dur 590`
 *
 * ⚠ IT TAKES OVER FROM A FROZEN PICTURE, so its first frame has to BE that
 * picture. Same card, same grid, same bars, same level, same tool — all read
 * from the layer that drew them (scenes/CardList.tsx) rather than rebuilt here,
 * because a hand-off between two drawings of one thing is a seam waiting to
 * open. What this scene adds is that the picture can move again.
 *
 * ⚠ THE PAN IS A CHANGE OF GRID, NOT A TRANSFORM. Translating the drawn chart
 * would take the candle widths, the stroke weights and the level's thickness
 * with it; moving the grid's BOX moves every bar and every price and leaves
 * everything drawn on them at its own weight. It is the same rule the zoom
 * followed at 2676.
 *
 * ⚠ AND THE PAN IS SOLVED, NOT TYPED. Simon wants exactly seven bars left on
 * the card, so the distance is the one that puts the GAP between the seventh-
 * from-last and the eighth-from-last on the card's left edge. Typed as a round
 * number it would cut a candle in half the first time anything moved.
 *
 * ⚠ THE OLD TAIL IS NOT DRAWN AT ALL. Nineteen bars of ss02's grind live in the
 * series after the ones this card shows; the card's own window hid them, and
 * once the pan opens the card up they would walk straight into the room the
 * revenge trade needs. Drawing up to SEEN_TO and no further is why there is no
 * second mask here.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Chip, Level, PositionTool, candleWidth, extendGrid, gridOf, lerpGrid,
  progress, progressInOut, theme, useMotion, usePalette, useShadow,
} from "../../../core";
import { CARD_OPEN, CARD_ZOOM } from "../data/layout";
import { REVENGE_T } from "../data/timing";
import {
  CARD_ALL, CARD_FULL, CARD_HEAD_N, CARD_REVENGE, CARD_REVENGE_UP, CARD_SUPPORT,
  REVENGE_ENTRY,
} from "../data/series";
import { SEEN_TO, TOOL, ZOOM_GRID, toolMid } from "./CardList";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = REVENGE_T;
const O = CARD_OPEN;
// ═══════════════════════════════════════════════════════════════════════════

/** Everything the card was showing when the picture was still frozen. */
const SHOWN = CARD_ALL.slice(0, SEEN_TO + 1);
/** ⚠ SIMON'S SEVEN. How many of them survive the pan, and therefore what the
 *  pan has to be. */
const KEEP = 7;

/**
 * The panned grid — same scale, a moved box.
 *
 * ⚠ THE LEFT SHIFT IS SOLVED FROM THE SEVEN. The gap between the last bar to go
 * and the first bar to stay has to land on the card's left edge, so the
 * distance is that gap's own position minus that edge. Nothing is cut in half
 * and nothing is left hanging.
 */
const PAN_GRID = (() => {
  const half = candleWidth(ZOOM_GRID) / 2;
  const last = SEEN_TO - KEEP; // the newest bar that must go
  const gap = (ZOOM_GRID.x(last) + half + (ZOOM_GRID.x(last + 1) - half)) / 2;
  const left = gap - O.x;
  const plot = { ...CARD_ZOOM.plot, x: CARD_ZOOM.plot.x - left, y: CARD_ZOOM.plot.y - V.pan.up };
  return extendGrid(
    gridOf(
      CARD_FULL.map((b) => b.c),
      [0, 1],
      plot,
      0,
    ),
    CARD_HEAD_N,
  );
})();

/**
 * ⚠ THE NEW BARS CONTINUE THE OLD ONES' SPACING, and are indexed from the last
 * bar ON SCREEN rather than from the last bar in the series. The nineteen the
 * card was hiding sit between the two in index order; counted through them the
 * revenge tape would start a screen's width to the right of the bar it opens on.
 */
const nextGrid = (g: typeof ZOOM_GRID) => ({
  ...g,
  x: (i: number) => g.x(SEEN_TO + 1 + i),
});

/**
 * ⚠ THE TOOL IS PLACED ON THE PRICE THE CARD CLOSED AT, and reaches the same
 * distance each way — the same convention the first one used, so two tools in
 * one video cannot mean two different things.
 *
 * ⚠ SIMON'S "2x LIPAT", and it is one number because both halves read it. The
 * first tool got the same instruction at 3832 and took it the same way: the
 * target and the stop are one reach apart from the entry, so doubling the reach
 * doubles the whole tool without tilting it.
 */
const REACH = 0.24 * 2;

export const Revenge = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const g = f + V.at;

  const panned = progressInOut(g, V.pan.at, V.pan.over);
  const grid = lerpGrid(ZOOM_GRID, PAN_GRID, panned);
  const next = nextGrid(grid);
  /**
   * ⚠ EVERYTHING THE FIRST TRADE LEFT ON THE CARD GOES WITH THE PAN — its tool,
   * and the support line and label it was drawn against (Simon: "garis support
   * dan textnya dibuat fade out"). One curve for all of it, because they are
   * one thing: the picture the last scene ended on.
   *
   * The tool has to go because its entry is off the card by the end of the pan
   * and a tool anchored off screen is just a rectangle. The support has to go
   * because the level it marks belongs to the trade that is over — left up, it
   * would sit under the new trade as though the new trade were about it.
   */
  const old = 1 - progress(g, V.clear.at, V.clear.over);
  const inner: [number, number] = [O.x + O.pad, O.x + O.w - O.pad];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {/* ⚠ THE CARD IS THE MASK. Everything the pan carries off its left edge is
          clipped by the thing it is drawn on, which cannot drift away from it. */}
      <div
        style={{
          position: "absolute",
          left: O.x,
          top: O.y,
          width: O.w,
          height: O.h,
          borderRadius: theme.shape.cardRadius,
          background: c.cardBg,
          boxShadow: shadow.rest,
          overflow: "hidden",
        }}
      />
      {/* ⚠ THE TRACED PRE-HISTORY IS NOT DRAWN. `SHOWN` is indexed against the
          grid, so it cannot be sliced at the front without moving every bar;
          the first CARD_HEAD_N of it are hidden by their wipe instead. They
          have to go: the rewind at 3517 took them off the card, and the last
          of them ends one pixel INSIDE the card's left edge — drawn, it
          survives the clip as a red splinter against the corner radius. */}
      <Candles
        bars={SHOWN}
        grid={grid}
        clip={{ x: O.x, y: O.y, w: O.w, h: O.h }}
        wipe={(i) => (i < CARD_HEAD_N ? 0 : 1)}
      />

      <Level
        value={CARD_SUPPORT}
        grid={grid}
        span={inner}
        /** ⚠ ALREADY DRAWN ON FRAME ZERO. This scene takes over from a picture
         *  that has these on it; an entrance here would be the level drawing
         *  itself a second time. `at` is before the window so the curve is
         *  already finished when the window opens. */
        at={-2}
        over={1}
        label="Support"
        labelSide="left"
        labelAt="below"
        width={theme.shape.line}
        opacity={old}
      />

      {/* The first trade's tool, leaving on the same curve as its level. */}
      <PositionTool
        grid={grid}
        entry={TOOL.entry}
        target={TOOL.target}
        stop={TOOL.stop}
        x1={TOOL.x1}
        x2={inner[1]}
        at={-2}
        over={1}
        opacity={old}
      />

      {/* ═══ AND THE NEXT ONE ═══  Simon: "muncul lagi tool Long Position". */}
      <PositionTool
        grid={grid}
        entry={REVENGE_ENTRY}
        target={REVENGE_ENTRY + REACH}
        stop={REVENGE_ENTRY - REACH}
        x1={grid.x(SEEN_TO)}
        x2={inner[1]}
        at={V.tool.at - V.at}
        over={V.tool.over}
      />

      {/* ⚠ THE FIRST VERDICT IS CARRIED OVER, NOT RE-STAMPED. It has been on the
          chart since 5310 and this scene opens on that picture, so it arrives
          a full pop BEFORE frame zero — anything later and the word would pop
          a second time on the hand-over frame. It then leaves with the trade it
          judges, on the same curve as that trade's tool and level: `opacity`
          is not a prop a Chip takes, by design, so the fade belongs to the
          layer the three of them share. */}
      <div style={{ position: "absolute", inset: 0, opacity: old }}>
        <Chip label="Loss" {...toolMid(grid)} at={-m.pop} tone="warn" pill solid />
      </div>

      <Candles
        bars={CARD_REVENGE}
        grid={next}
        clip={{ x: O.x, y: O.y, w: O.w, h: O.h }}
        wipe={(i) =>
          i < CARD_REVENGE_UP.length
            ? progressInOut(g, V.up.at + i * V.up.step, V.up.over)
            : progressInOut(
                g,
                V.down.at + (i - CARD_REVENGE_UP.length) * V.down.step,
                V.down.over,
              )
        }
      />

      {/* ═══ AND THE SECOND VERDICT ═══  Simon: "Loss lagi", same stamp, middle
          of the new tool.

          ⚠ LAST IN THE TREE, so it sits over the tape it is judging. The bars
          run straight through the middle of the tool — that is where the trade
          happened — and a stamp behind them would be a word with candles
          through it. */}
      <Chip
        label="Loss lagi"
        x={(grid.x(SEEN_TO) + inner[1]) / 2}
        y={grid.y(REVENGE_ENTRY)}
        at={V.lossAgain - V.at}
        tone="warn"
        pill
        solid
      />
    </div>
  );
};

/** Kept honest: the seven are seven, and nothing the scene draws leaves the card. */
{
  const half = candleWidth(ZOOM_GRID) / 2;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/Revenge: ${m}`);
  };
  if (PAN_GRID.x(SEEN_TO - KEEP) + half > CARD_OPEN.x) {
    fail("an eighth bar is still on the card after the pan");
  }
  if (PAN_GRID.x(SEEN_TO - KEEP + 1) - half < CARD_OPEN.x) {
    fail("the seventh-from-last bar is cut by the card's edge");
  }
  const right = PAN_GRID.x(SEEN_TO + CARD_REVENGE.length) + half;
  if (right > CARD_OPEN.x + CARD_OPEN.w - CARD_OPEN.pad) {
    fail(`the revenge tape ends at ${right.toFixed(0)}, past the card's inner edge`);
  }
  const top = PAN_GRID.y(Math.max(...CARD_REVENGE.map((b) => b.h)));
  const bot = PAN_GRID.y(Math.min(...CARD_REVENGE.map((b) => b.l)));
  if (top < CARD_OPEN.y || bot > CARD_OPEN.y + CARD_OPEN.h) {
    fail(`the revenge tape runs ${top.toFixed(0)}..${bot.toFixed(0)}, outside the card`);
  }
  /** ⚠ AND THE DOUBLED TOOL HAS TO FIT TOO. It is drawn as two filled boxes, so
   *  a target or a stop off the card is not a line that disappears — it is a
   *  wash running to the card's edge and reading as a different shape. */
  const tTop = PAN_GRID.y(REVENGE_ENTRY + REACH);
  const tBot = PAN_GRID.y(REVENGE_ENTRY - REACH);
  if (tTop < CARD_OPEN.y || tBot > CARD_OPEN.y + CARD_OPEN.h) {
    fail(`the position tool runs ${tTop.toFixed(0)}..${tBot.toFixed(0)}, outside the card`);
  }
  /** ⚠ BOTH VERDICTS ARE STAMPED ON THE TOOL, AND A CHIP IS NOT CLIPPED. It is
   *  a div over the top of everything, so a tool centre that wandered off the
   *  card would put the word on the grey paper beside it rather than cut it. */
  for (const [name, mid] of [
    ["Loss", toolMid(PAN_GRID)],
    ["Loss lagi", { x: (PAN_GRID.x(SEEN_TO) + (CARD_OPEN.x + CARD_OPEN.w - CARD_OPEN.pad)) / 2, y: PAN_GRID.y(REVENGE_ENTRY) }],
  ] as const) {
    const inX = mid.x > CARD_OPEN.x && mid.x < CARD_OPEN.x + CARD_OPEN.w;
    const inY = mid.y > CARD_OPEN.y && mid.y < CARD_OPEN.y + CARD_OPEN.h;
    if (!inX || !inY) {
      fail(`"${name}" would be stamped at ${mid.x.toFixed(0)},${mid.y.toFixed(0)}, off the card`);
    }
  }
  /** ⚠ THE TRADE MUST STILL FAIL ON SCREEN: short of the target, through the
   *  stop. That is the only thing the two washes are there to say. */
  if (Math.max(...CARD_REVENGE.map((b) => b.h)) >= REVENGE_ENTRY + REACH) {
    fail("the revenge trade reaches its target");
  }
  if (Math.min(...CARD_REVENGE.map((b) => b.l)) > REVENGE_ENTRY - REACH) {
    fail("the revenge trade never breaks its stop");
  }
}
