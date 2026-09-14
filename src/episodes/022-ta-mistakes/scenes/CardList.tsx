/**
 * SCENE TRANSISI · THE CARD LIST.  `from 1994 · dur 180`
 *
 * Simon's reference: `VIDEO 22 - TA Mistakes/card list.mp4`. Six cards in a
 * row, a pointer that picks one, and the picked card floods with colour.
 *
 * ═══ WHAT THE REFERENCE ACTUALLY DOES ═══  (read off a 30fps burst, not
 * watched)
 *
 * The flood does NOT rise like a waterline. It starts as a soft blob AT THE
 * POINT THE CURSOR TOUCHES — the card's lower right — and spreads up and across
 * it, heavily blurred, so what the eye reads is ink soaking into paper. Copying
 * it as a rising bar would be the same colour doing a different thing.
 *
 * ⚠ THE HUE IS OURS. The reference floods orange; this floods indigo, because
 * a warm flood would be the only warm thing in the video. See `liquid` in
 * core/theme.ts.
 *
 * ⚠ IT IS AN OVERLAY, MOUNTED LAST — Simon: "layer ini harus yang paling atas
 * jika overlapping dengan scene lain". It runs over the opening of SC04 until
 * the recording has room made in it.
 *
 * ⚠ THE SIXTH CARD IS CUT IN HALF BY THE FRAME, on purpose, and the gap is
 * solved for rather than typed — see CARD_ROW in data/layout.ts. A row that
 * ends neatly says "six things"; a row that runs off the edge says "and there
 * are more of these", which is what a list of mistakes should say.
 *
 * ⚠ AND IT LEAVES BY MOVING — Simon's continuous join into SC04. The five
 * un-picked cards slide off to the right; the picked one goes as far as the
 * middle and opens out. See `exit` in data/timing.ts for why that is not a
 * fade.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import {
  Cursor, progress, progressInOut, textReveal, theme, useMotion, usePalette,
  useShadow,
} from "../../../core";
import { BLOCK, CARD_LIST } from "../data/timing";
import { CARD_ROW } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = CARD_LIST;
const R = CARD_ROW;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Where the pointer lands, and therefore where the flood starts: the lower
 * right of the card it picks, the way a hand arrives at a thing rather than
 * at its middle.
 *
 * ⚠ FRACTIONS OF THE CARD, NOT CANVAS PIXELS. The picked card changes width
 * during the exit, and the ink already in it has to stay on the same spot of
 * the paper — held as pixels it would slide across its own card as the card
 * opened out.
 */
const TOUCH = { fx: 0.82, fy: 0.86 };
/** The same point in canvas pixels, for the pointer, which lives outside any card. */
const LAND = {
  x: R.x(V.cursor.card) + R.w * TOUCH.fx,
  y: R.y + R.h * TOUCH.fy,
};
/**
 * ⚠ NOT BIG ENOUGH TO COVER THE CARD, AND THAT IS THE POINT. In the reference
 * the top of a hovered card is still paper — what sells the flood is the soft
 * diagonal edge halfway up it. A blob that covers the card is a fill; one that
 * stops inside it is ink. Sized from the card's LIVE width so it opens with it.
 */
const blobOf = (w: number) => w * 2.2;

/**
 * ⚠ THE SWEEP IS SOLVED, NOT TYPED: far enough that the LEFTMOST of the leaving
 * cards clears the right edge, which puts all five of them off frame. Typed as
 * a round number it would be wrong the moment the row's geometry moved.
 */
const SWEEP = theme.canvas.width - R.x(1);
/** Where the picked card lands — the middle of the frame, at its opened width. */
const OPEN_X = (theme.canvas.width - V.exit.w) / 2;

/**
 * The big numeral's offset from the card's bottom-centre — Simon's, settled at
 * 60 right and 20 up. Kept as one pair rather than folded into the style so the
 * next nudge is one number.
 *
 * ⚠ 60 IS AS FAR RIGHT AS THE DIGITS GO. At 90 the card's own clip started
 * cutting 2, 3 and 5 down their right-hand side — a crop that reads as a
 * mistake, where the bottom crop reads as a page number. The numeral is meant
 * to be cut by ONE edge, and that edge is the bottom one.
 */
const NUM = { dx: 60, dy: -20 } as const;

const Card = ({ i, title }: { i: number; title: string }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const r = textReveal(f, V.deal.at + i * V.deal.step, V.deal.over, 34);
  if (r.opacity <= 0.001) return null;

  const picked = i === V.cursor.card;
  const wet = picked ? progress(f, V.hover.at, V.hover.over) : 0;

  /**
   * ═══ THE EXIT ═══  Two different motions, because the two groups are doing
   * two different things.
   *
   * ⚠ THE UN-PICKED FIVE LEAVE AS ONE ROW — one distance, one curve, so what
   * goes is "the list" and not five cards that happen to agree. Carried on the
   * transform, which is what a rigid move is.
   *
   * ⚠ THE PICKED ONE CHANGES ITS BOX, and that is deliberate: a CSS scale would
   * take the type, the corner radius and the shadow with it, and what has to
   * grow here is the CARD, not the picture of the card.
   *
   * ⚠ EASE-IN-OUT ON BOTH — Simon's standing note on movement. `progress` eases
   * out only, which for something leaving the frame reads as a card that gives
   * up halfway.
   */
  const sweep = picked ? 0 : progressInOut(f, V.exit.at, V.exit.row) * SWEEP;
  const open = picked ? progressInOut(f, V.exit.at + V.exit.lead, V.exit.one) : 0;
  const w = R.w + (V.exit.w - R.w) * open;
  const x = R.x(i) + (OPEN_X - R.x(i)) * open;
  const blob = blobOf(w);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: R.y,
        width: w,
        height: R.h,
        borderRadius: theme.shape.cardRadius,
        background: c.cardBg,
        boxShadow: shadow.rest,
        opacity: r.opacity,
        transform: `translate(${sweep}px, ${r.dy}px)`,
        /* ⚠ THE CLIP IS ON THE CARD, and the flood is a child of it — a blob
           clipped by anything that also moves would drift off its own card. */
        overflow: "hidden",
      }}
    >
      {wet > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: w * TOUCH.fx - blob / 2,
            top: R.h * TOUCH.fy - blob / 2,
            width: blob,
            height: blob,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.color.liquid} 0%, ${theme.color.liquid} 26%, ${theme.color.liquidEdge} 70%)`,
            filter: `blur(${Math.round(w * 0.22)}px)`,
            transform: `scale(${(0.05 + 0.95 * wet).toFixed(4)})`,
          }}
        />
      )}
      {/* ═══ THE NUMBER ═══  (Simon)
          ⚠ IT HANGS OFF THE BOTTOM EDGE AND THE CARD CUTS IT. That is what the
          masking is FOR — a numeral this size placed safely inside the card is
          just a big grey digit, while one the card crops reads as a page
          number printed under everything else. The card's own `overflow` does
          the cutting, so the mask can never drift off the shape it belongs to.

          ⚠ ANCHORED ON THE CARD'S BOTTOM-CENTRE, then moved by NUM — his
          offsets, measured from that corner-less anchor so they stay put
          whatever the card's width and height become. */}
      <div
        style={{
          position: "absolute",
          left: w / 2 + NUM.dx,
          top: R.h + NUM.dy,
          /**
           * ⚠ THE PERCENTAGE IS THE SIT, THE PIXELS ARE THE NUDGE. -90% is of
           * the numeral's OWN box, so the glyph lands whole on the card's
           * bottom edge at any size; NUM.dy is Simon's 20px on top of that.
           * Kept apart on purpose — re-sizing the card must not undo his nudge,
           * and his nudge must not have to be re-derived when it is re-sized.
           */
          transform: "translate(-50%, -90%)",
          fontFamily: theme.text.family,
          /** ⚠ A THIRD OF THE CARD, not a typed size. */
          fontSize: R.h / 3,
          fontWeight: 800,
          lineHeight: 1,
          /**
           * ⚠ IT TAKES THE FLOOD'S COLOUR ON THE SAME CURVE AS THE FLOOD —
           * Simon. Driven by `wet`, so the ink reaching the numeral and the ink
           * reaching the card are one event rather than two that nearly line
           * up. Deep indigo, not the brand one: see `liquidInk` in core/theme.
           */
          color: interpolateColors(wet, [0, 1], [c.muted, theme.color.liquidInk]),
        }}
      >
        {i + 1}
      </div>

      {/* ⚠ THE TITLE STAYS DARK, as it does in the reference. The flood is a
          bottom-up thing and the title is at the top; a white copy cross-faded
          in under it would be white type on the pale part of the card, which is
          type that is not there. */}
      <div
        style={{
          position: "absolute",
          left: m.sec(0.4),
          top: m.sec(0.4),
          /* ⚠ THE WRAP WIDTH IS THE RESTING ONE, EVEN WHILE THE CARD OPENS. Fed
             the live width the three lines would re-wrap to two on one frame
             in the middle of the move — a jump, not a motion. The card grows
             around its title instead, and the room it opens up is room. */
          width: R.w - m.sec(0.8),
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: 700,
          lineHeight: 1.25,
          color: c.ink,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const CardList = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  /** ⚠ IT OWNS THE FRAME. Transparent, the scene underneath shows between the
   *  cards and the transition reads as a row of cards dropped onto a chart.
   *
   *  ⚠ AND IT NEVER FADES BACK OUT — Simon wants the opened card to stand to
   *  3075, so the layer holds and the window's end cuts it. See `out`. */
  const ground = progress(f, V.ground.at, V.ground.over);

  /** ⚠ IN FROM OFF-FRAME, BOTTOM RIGHT — a pointer that fades up in the middle
   *  of the screen has no hand attached to it. */
  const walk = progress(f, V.cursor.at, V.cursor.over);
  const from = { x: theme.canvas.width + 60, y: theme.canvas.height + 60 };
  const cursor = {
    x: from.x + (LAND.x - from.x) * walk,
    y: from.y + (LAND.y - from.y) * walk,
  };
  /** ⚠ AND IT LEAVES BEFORE THE CARD IT PICKED MOVES. Its job was the choosing;
   *  left standing while the card opens out it would read as still choosing. */
  const put = 1 - progress(f, V.exit.at, V.exit.row);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: ground }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {V.titles.map((title, i) => (
        <Card key={title} i={i} title={title} />
      ))}
      <Cursor x={cursor.x} y={cursor.y} opacity={walk > 0.001 ? put : 0} />
    </div>
  );
};

/** Kept honest: the pointer has to have landed before the card it is picking
 *  starts to flood, or the card responds to nothing. */
{
  if (CARD_LIST.hover.at < CARD_LIST.cursor.at + CARD_LIST.cursor.over - 4) {
    throw new Error("022-ta-mistakes/CardList: the flood starts before the pointer arrives");
  }
  if (CARD_LIST.hover.at + CARD_LIST.hover.over > CARD_LIST.exit.at) {
    throw new Error("022-ta-mistakes/CardList: the row starts leaving while the flood is still spreading");
  }
  /** And the window has to outlast the exit, or the card would be cut off
   *  mid-move — which is the one thing a continuous join may not do. */
  const settled = CARD_LIST.exit.at + CARD_LIST.exit.lead + CARD_LIST.exit.one;
  if (settled > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the picked card is still moving when the window ends");
  }
  /** ⚠ AND IT ENDS EXACTLY ON THE NEXT SCENE'S FIRST FRAME. One frame short and
   *  a scene nobody has seen flashes; one frame long and it eats SC05's open. */
  if (CARD_LIST.at + CARD_LIST.over !== BLOCK.SC05) {
    throw new Error(
      `022-ta-mistakes/CardList: the window ends at ${CARD_LIST.at + CARD_LIST.over}, not on SC05 at ${BLOCK.SC05}`,
    );
  }
}
