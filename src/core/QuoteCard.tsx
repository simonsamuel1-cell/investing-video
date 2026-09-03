/**
 * core/QuoteCard.tsx — the closing card: a bordered panel on a solid indigo
 * block, with a pair of quote marks tucked into opposite corners.
 *
 * Ported from Moving Average's Scene13, where Simon settled the shape, the
 * offset and the 20px the marks sit off the type. What is left behind is that
 * scene's four hard-coded lines: this takes CHILDREN, so an episode puts its
 * own sentences in and can highlight or animate them however it needs.
 *
 * ⚠ THE OFFSET BLOCK IS WHAT MAKES IT A CARD. An outline alone reads as a
 * region of the page; a shape with something solid behind it reads as sitting
 * ON it. The block is indigo rather than a shadow colour — it is a second
 * shape, not a shadow.
 *
 * ⚠ THE 20px IS INK-TO-INK, AND IT IS MEASURED, NOT ASSUMED. Both glyphs float
 * inside boxes far taller than the drawn shape: at full resolution the opening
 * mark's ink runs from +11 to +34 inside its own 76px box, the closing mark's
 * from +12, and 46px type has its cap-top at +13 with descenders reaching +57.
 * Setting the boxes 20px apart would read as roughly sixty. `ink` is those
 * measurements, and `quoteMarks` is what turns them into positions.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";

export const QUOTE = {
  /** How far the solid block sits down and right of the card. */
  drop: 14,
  border: 4,
  /** The quote marks' box, and how far they inset from their own corner. */
  mark: 76,
  pad: 46,
  gap: 20,
  ink: { markTop: 12, markBot: 34, textTop: 13, textBot: 57 },
} as const;

/**
 * Where the two marks go, given where the lines are.
 *
 * The opening mark's ink lands `gap` above the first line's cap-top; the
 * closing one's `gap` below the last line's descender — and BELOW the last
 * line rather than beside it, Simon's call: level with a line it reads as
 * belonging to that line rather than closing all of them.
 */
export const quoteMarks = (
  box: { x: number; w: number },
  listY: number,
  lead: number,
  count: number,
) => [
  {
    ch: "“",
    x: box.x + QUOTE.pad,
    y: listY + QUOTE.ink.textTop - QUOTE.gap - QUOTE.ink.markBot,
  },
  {
    ch: "”",
    x: box.x + box.w - QUOTE.pad - QUOTE.mark,
    y: listY + (count - 1) * lead + QUOTE.ink.textBot + QUOTE.gap - QUOTE.ink.markTop,
  },
];

/**
 * Where the first line's box should sit so the whole quote — opening mark, the
 * lines, closing mark — is CENTRED IN THE CARD by its ink.
 *
 * ⚠ CENTRED BY INK, NOT BY BOXES. Both marks and the type float inside boxes
 * taller than what they draw; centring the boxes would leave the visible block
 * sitting high by about thirty pixels. This measures from the opening mark's
 * top pixel to the closing mark's bottom one, using the same constants that
 * put them 20px off the type.
 */
export const quoteListY = (
  boxY: number,
  boxH: number,
  lead: number,
  count: number,
) => {
  const { textTop, textBot, markTop, markBot } = QUOTE.ink;
  /** first ink pixel, relative to listY */
  const from = textTop - QUOTE.gap - markBot + markTop;
  /** last ink pixel, relative to listY */
  const to = (count - 1) * lead + textBot + QUOTE.gap - markTop + markBot;
  return boxY + (boxH - (to - from)) / 2 - from;
};

export const QuoteCard = ({
  x,
  y,
  w,
  h,
  at,
  listY,
  lead,
  count,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  /** Top of the first line's box — the marks are placed off this. */
  listY: number;
  lead: number;
  count: number;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const box = textReveal(f, at, m.reveal);
  if (box.opacity <= 0.001) return null;
  const shell = {
    position: "absolute" as const,
    left: x,
    top: y,
    width: w,
    height: h,
    borderRadius: theme.shape.panelRadius,
  };
  return (
    <div style={{ opacity: box.opacity, transform: `translateY(${box.dy}px)` }}>
      <div
        style={{ ...shell, left: x + QUOTE.drop, top: y + QUOTE.drop, background: c.indigo }}
      />
      <div
        style={{
          ...shell,
          background: c.cardBg,
          border: `${QUOTE.border}px solid ${c.ink}`,
        }}
      />
      {quoteMarks({ x, w }, listY, lead, count).map((q) => (
        <div
          key={q.ch}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y,
            width: QUOTE.mark,
            textAlign: "center",
            fontFamily: theme.text.family,
            fontSize: QUOTE.mark,
            fontWeight: 800,
            color: c.ink,
            lineHeight: 1,
          }}
        >
          {q.ch}
        </div>
      ))}
      {children}
    </div>
  );
};
