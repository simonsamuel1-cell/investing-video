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
 */
import { useCurrentFrame } from "remotion";
import {
  Cursor, progress, textReveal, theme, useMotion, usePalette, useShadow,
} from "../../../core";
import { CARD_LIST } from "../data/timing";
import { CARD_ROW } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = CARD_LIST;
const R = CARD_ROW;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Where the pointer lands, and therefore where the flood starts: the lower
 * right of the card it picks, the way a hand arrives at a thing rather than
 * at its middle.
 */
const TOUCH = {
  x: R.x(V.cursor.card) + R.w * 0.82,
  y: R.y + R.h * 0.86,
};
/**
 * ⚠ NOT BIG ENOUGH TO COVER THE CARD, AND THAT IS THE POINT. In the reference
 * the top of a hovered card is still paper — what sells the flood is the soft
 * diagonal edge halfway up it. A blob that covers the card is a fill; one that
 * stops inside it is ink.
 */
const BLOB = R.w * 2.2;

const Card = ({ i, title }: { i: number; title: string }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const r = textReveal(f, V.deal.at + i * V.deal.step, V.deal.over, 34);
  if (r.opacity <= 0.001) return null;

  const wet = i === V.cursor.card ? progress(f, V.hover.at, V.hover.over) : 0;
  const x = R.x(i);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: R.y,
        width: R.w,
        height: R.h,
        borderRadius: theme.shape.cardRadius,
        background: c.cardBg,
        boxShadow: shadow.rest,
        opacity: r.opacity,
        transform: `translateY(${r.dy}px)`,
        /* ⚠ THE CLIP IS ON THE CARD, and the flood is a child of it — a blob
           clipped by anything that also moves would drift off its own card. */
        overflow: "hidden",
      }}
    >
      {wet > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: TOUCH.x - x - BLOB / 2,
            top: TOUCH.y - R.y - BLOB / 2,
            width: BLOB,
            height: BLOB,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.color.liquid} 0%, ${theme.color.liquid} 26%, ${theme.color.liquidEdge} 70%)`,
            filter: `blur(${Math.round(R.w * 0.22)}px)`,
            transform: `scale(${(0.05 + 0.95 * wet).toFixed(4)})`,
          }}
        />
      )}
      {/* ⚠ THE TITLE STAYS DARK, as it does in the reference. The flood is a
          bottom-up thing and the title is at the top; a white copy cross-faded
          in under it would be white type on the pale part of the card, which is
          type that is not there. */}
      <div
        style={{
          position: "absolute",
          left: m.sec(0.4),
          top: m.sec(0.4),
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
   *  cards and the transition reads as a row of cards dropped onto a chart. */
  const ground =
    progress(f, V.ground.at, V.ground.over) * (1 - progress(f, V.out.at, V.out.over));

  /** ⚠ IN FROM OFF-FRAME, BOTTOM RIGHT — a pointer that fades up in the middle
   *  of the screen has no hand attached to it. */
  const walk = progress(f, V.cursor.at, V.cursor.over);
  const from = { x: theme.canvas.width + 60, y: theme.canvas.height + 60 };
  const cursor = {
    x: from.x + (TOUCH.x - from.x) * walk,
    y: from.y + (TOUCH.y - from.y) * walk,
  };

  return (
    <div style={{ position: "absolute", inset: 0, opacity: ground }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {V.titles.map((title, i) => (
        <Card key={title} i={i} title={title} />
      ))}
      <Cursor x={cursor.x} y={cursor.y} opacity={walk > 0.001 ? 1 : 0} />
    </div>
  );
};

/** Kept honest: the pointer has to have landed before the card it is picking
 *  starts to flood, or the card responds to nothing. */
{
  if (CARD_LIST.hover.at < CARD_LIST.cursor.at + CARD_LIST.cursor.over - 4) {
    throw new Error("022-ta-mistakes/CardList: the flood starts before the pointer arrives");
  }
  if (CARD_LIST.hover.at + CARD_LIST.hover.over > CARD_LIST.over) {
    throw new Error("022-ta-mistakes/CardList: the flood is still running when the scene ends");
  }
}
