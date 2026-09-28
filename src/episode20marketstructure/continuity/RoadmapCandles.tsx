/**
 * RoadmapCandles — the drawing in the roadmap's "Market Structure" box.
 *
 * Simon: "Kotak "Market Structure" gunakan visual seperti ini (screenshot 1)" —
 * a plain candlestick chart that dips and then climbs. Traced from his
 * reference (980px square): 17 candles, light = up, dark = down, drawn here in
 * the film's own candle colours and square bodies (components/CandleChart).
 *
 * ⚠ DRAWN AT FULL FRAME SIZE (1920×1080), NOT CARD SIZE. The roadmap scales a
 * box's content down into the card exactly as it scales a frozen scene, and a
 * push magnifies it back to 1:1 — so the drawing is composed as a frame of its
 * own: clear of the logo's top-right corner and the subtitle band.
 *
 * ⚠ NO TEXT, NO NUMBERS, NO AXIS. Not market data; nothing is labelled.
 */
import React from "react";
import { theme } from "../theme";

const W = theme.canvas.width;
const H = theme.canvas.height;

/** Traced from the reference, in its pixels: [centre x, body top, body bottom, wick top, wick bottom, up]. */
const TRACE: readonly (readonly [number, number, number, number, number, boolean])[] = [
  [236.5, 440, 547, 437, 562, false],
  [268, 561, 571, 535, 590, false],
  [300, 541, 570, 467, 577, true],
  [331, 551, 702, 544, 716, false],
  [363, 660, 678, 642, 715, true],
  [394.5, 571, 665, 522, 665, true],
  [426, 565, 568, 516, 591, false],
  [457.5, 562, 602, 555, 627, false],
  [489, 529, 609, 528, 621, true],
  [521, 357, 530, 357, 536, true],
  [552.5, 362, 372, 224, 388, false],
  [584, 305, 365, 272, 375, true],
  [616, 305, 357, 305, 365, false],
  [647.5, 338, 353, 334, 362, true],
  [679, 294, 339, 268, 339, true],
  [711, 239, 293, 195, 297, true],
  [742, 149, 244, 147, 304, true],
];
/** The reference's ink, left to right and top to bottom. */
const REF = { x0: 222, x1: 756, y0: 147, y1: 716, body: 29 };

/** One uniform scale — the reference is not stretched to the card's shape. */
const CHART_H = 700;
const S = CHART_H / (REF.y1 - REF.y0);
const OX = (W - (REF.x1 - REF.x0) * S) / 2 - REF.x0 * S;
const OY = (H - CHART_H) / 2 - REF.y0 * S;
const X = (x: number) => OX + x * S;
const Y = (y: number) => OY + y * S;
const BODY = REF.body * S;
/** CandleChart's wick-to-body ratio, heavy enough to survive the card's quarter size. */
const WICK = BODY * 0.14;
/** A doji's body is a line, never nothing. */
const MIN_BODY = 4;

export const MarketStructureCandles: React.FC = () => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    {TRACE.map(([cx, bt, bb, wt, wb, up]) => {
      const ink = up ? theme.color.candleGreen : theme.color.candleRed;
      const h = Math.max(MIN_BODY, Y(bb) - Y(bt));
      return (
        <g key={cx}>
          <rect
            x={X(cx) - WICK / 2}
            y={Y(wt)}
            width={WICK}
            height={Y(wb) - Y(wt)}
            fill={ink}
          />
          <rect
            x={X(cx) - BODY / 2}
            y={(Y(bt) + Y(bb)) / 2 - h / 2}
            width={BODY}
            height={h}
            fill={ink}
          />
        </g>
      );
    })}
  </svg>
);
