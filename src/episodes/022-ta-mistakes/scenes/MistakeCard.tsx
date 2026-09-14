/**
 * scenes/MistakeCard.tsx — one card from the list of mistakes.
 *
 * ⚠ EXTRACTED, NOT REWRITTEN. This is exactly what scenes/CardList.tsx drew
 * inline for the first round, moved out unchanged so the second round cannot
 * drift from it. Two rows of cards that are nearly alike is the one thing this
 * transition must not be; the way to guarantee that is for there to be one
 * drawing of a card and two callers.
 *
 * ⚠ IT KNOWS NOTHING ABOUT TIME. Where the card is, how wet it is and how much
 * of itself is left are all handed in — which is what lets one component serve
 * a card that is being dealt, one that is opening into a chart, and one that is
 * standing there already done.
 */
import { interpolateColors } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { CARD_ROW } from "../data/layout";

/** Where the pointer lands, and therefore where the flood starts, as fractions
 *  of the card — see CardList. */
export const TOUCH = { fx: 0.82, fy: 0.86 };
/** The big numeral's offset from the card's bottom-centre — Simon's. */
export const NUM = { dx: 60, dy: -20 } as const;
/**
 * ⚠ NOT BIG ENOUGH TO COVER THE CARD, AND THAT IS THE POINT. What sells the
 * flood is the soft diagonal edge partway up it; a blob that covers the card is
 * a fill, one that stops inside it is ink.
 */
export const blobOf = (w: number) => w * 2.2;

export type Box = { x: number; y: number; w: number; h: number };

export const MistakeCard = ({
  n,
  title,
  box,
  wet = 0,
  drain = 1,
  tone = "indigo",
  opacity = 1,
  dx = 0,
  dy = 0,
}: {
  /** The number printed under the card — 1-based. */
  n: number;
  title: string;
  box: Box;
  /** 0→1 flood. */
  wet?: number;
  /** 1→0 as the card empties itself out. */
  drain?: number;
  /**
   * Which flood. ⚠ `cyan` IS "ALREADY DONE" — Simon: the card that has had its
   * turn changes colour so the list reads as progress rather than as six things
   * of equal standing.
   */
  tone?: "indigo" | "cyan";
  opacity?: number;
  /** A rigid move, for a row travelling as one object. */
  dx?: number;
  dy?: number;
}) => {
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  if (opacity <= 0.001) return null;

  const blob = blobOf(box.w);
  const cyan = tone === "cyan";
  const ink = cyan ? theme.color.liquidCyan : theme.color.liquid;
  const edge = cyan ? theme.color.liquidCyanEdge : theme.color.liquidEdge;
  const digit = cyan ? theme.color.liquidCyanInk : theme.color.liquidInk;

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: theme.shape.cardRadius,
        background: c.cardBg,
        boxShadow: shadow.rest,
        opacity,
        transform: `translate(${dx}px, ${dy}px)`,
        /* ⚠ THE CLIP IS ON THE CARD, and the flood is a child of it — a blob
           clipped by anything that also moves would drift off its own card. */
        overflow: "hidden",
      }}
    >
      {wet * drain > 0.001 && (
        <div
          style={{
            position: "absolute",
            opacity: drain,
            left: box.w * TOUCH.fx - blob / 2,
            top: box.h * TOUCH.fy - blob / 2,
            width: blob,
            height: blob,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ink} 0%, ${ink} 26%, ${edge} 70%)`,
            filter: `blur(${Math.round(box.w * 0.22)}px)`,
            transform: `scale(${(0.05 + 0.95 * wet).toFixed(4)})`,
          }}
        />
      )}
      {/* ═══ THE NUMBER ═══  (Simon)
          ⚠ IT HANGS OFF THE BOTTOM EDGE AND THE CARD CUTS IT. That is what the
          masking is FOR — a numeral this size placed safely inside the card is
          just a big grey digit, while one the card crops reads as a page
          number printed under everything else. */}
      <div
        style={{
          position: "absolute",
          left: box.w / 2 + NUM.dx,
          top: box.h + NUM.dy,
          /** ⚠ THE PERCENTAGE IS THE SIT, THE PIXELS ARE THE NUDGE. */
          transform: "translate(-50%, -90%)",
          fontFamily: theme.text.family,
          /** ⚠ A THIRD OF THE CARD, not a typed size. */
          fontSize: box.h / 3,
          fontWeight: 800,
          lineHeight: 1,
          /** ⚠ IT TAKES THE FLOOD'S COLOUR ON THE SAME CURVE AS THE FLOOD. */
          color: interpolateColors(wet, [0, 1], [c.muted, digit]),
          opacity: drain,
        }}
      >
        {n}
      </div>

      {/* ⚠ THE TITLE STAYS DARK. The flood is a bottom-up thing and the title is
          at the top; a white copy cross-faded in under it would be white type on
          the pale part of the card, which is type that is not there. */}
      <div
        style={{
          position: "absolute",
          left: m.sec(0.4),
          top: m.sec(0.4),
          /* ⚠ THE WRAP WIDTH IS THE RESTING ONE, EVEN WHILE THE CARD OPENS. */
          width: CARD_ROW.w - m.sec(0.8),
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: 700,
          lineHeight: 1.25,
          color: c.ink,
          opacity: drain,
        }}
      >
        {title}
      </div>
    </div>
  );
};
