/**
 * AnatomyCandle — one enlarged real candle on a card, with four Title Case
 * text labels (Open / High / Low / Close) attached by 1px connectors:
 * High at the wick top, Low at the wick bottom, Open/Close at the body edges.
 * Labels alternate sides so no two overlap. The wick sits on the card's
 * centre line.
 */
import { theme } from "../theme";
import { priceScale } from "../helpers";
import { Chip } from "./Chip";
import type { OHLC } from "../data/bmri";
import { usePalette } from "../palette";

export const AnatomyCandle = ({
  candle,
  cardX,
  cardY,
  cardW,
  cardH,
  showAt,
  opacity = 1,
  nudgeX = 0,
  labelsOp = 1,
  trim = 0,
  bodyRatio,
  wickRatio,
}: {
  candle: OHLC;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  /** Frames at which Open / High / Low / Close chips appear. */
  showAt: { open: number; high: number; low: number; close: number };
  opacity?: number;
  /** Shifts the candle AND its four chips together, leaving the card in place. */
  nudgeX?: number;
  /** The four labels' own opacity — they leave before the candle does. */
  labelsOp?: number;
  /** 0 → the whole candle, 1 → trimmed away (see the clip below). */
  trim?: number;
  /** Body and wick width as fractions of the candle's full drawn height —
   *  lets a candle keep a reference's proportions at whatever size it fits. */
  bodyRatio?: number;
  wickRatio?: number;
}) => {
  const pal = usePalette();
  const padTop = cardY + 96;
  const padBottom = cardY + cardH - 96;
  const scale = priceScale(candle.l, candle.h, padTop, padBottom, 0.05);
  const cx = cardX + cardW / 2 + nudgeX;
  const span = scale(candle.l) - scale(candle.h);
  const bodyW = bodyRatio ? span * bodyRatio : 92;
  const wickW = wickRatio ? span * wickRatio : 10;
  /* ⚠ ROUNDED, like every candle in the film — Simon: "jangan lupa rounded
     corner pada candlestick". */
  const radius = Math.min(8, bodyW * 0.14);
  /* ⚠ TEXT ONLY — Simon: "Label OHLC ubah jadi text aja." With no pill there
     is no box to balance, so Open and Close sit flush against their
     connectors instead of centred in a fixed 150px width. */
  const LABEL_GAP = 28; // connector length from the body edge to the chip
  const up = candle.c >= candle.o;
  const color = up ? pal.candleGreen : pal.candleRed;
  const yO = scale(candle.o);
  const yC = scale(candle.c);
  const top = Math.min(yO, yC);
  const h = Math.max(4, Math.abs(yC - yO));
  const leftX = cx - bodyW / 2;
  const rightX = cx + bodyW / 2;

  return (
    <>
      {/* ⚠ NO CARD BEHIND THE CANDLE. Its border went at 2379 ("remove aja
          border tipisnya"), which left a white rectangle on white paper doing
          nothing — until the group moved down to the chart's top and its foot
          hung out below the paper. cardX/cardY/cardW/cardH still place the
          candle and its labels. */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }} width={theme.canvas.width} height={theme.canvas.height}>
        {/* ⚠ THE CANDLE TRIMS OUT THE WAY IT LEANS — the rule SC01's bars
            follow: a candle that closed down keeps its low and its high draws
            down to meet it; one that closed up keeps its high. */}
        <defs>
          <clipPath id="anatomy-trim">
            <rect
              x={leftX - 20}
              y={up ? scale(candle.h) - 10 : scale(candle.h) - 10 + (scale(candle.l) - scale(candle.h) + 20) * trim}
              width={bodyW + 40}
              height={Math.max(0, (scale(candle.l) - scale(candle.h) + 20) * (1 - trim))}
            />
          </clipPath>
        </defs>
        <g clipPath="url(#anatomy-trim)">
          <line x1={cx} y1={scale(candle.h)} x2={cx} y2={scale(candle.l)} stroke={color} strokeWidth={wickW} strokeLinecap="round" />
          <rect x={leftX} y={top} width={bodyW} height={h} rx={radius} ry={radius} fill={color} />
        </g>
      </svg>

      {/* High — above the wick top, centred */}
      <Chip bare label="High" x={cx} y={scale(candle.h) - 52} variant="indigo" startFrame={showAt.high} anchor="center" opacity={labelsOp} connectorTo={{ x: cx, y: scale(candle.h) }} />
      {/* Low — below the wick bottom, centred */}
      <Chip bare label="Low" x={cx} y={scale(candle.l) + 52} variant="indigo" startFrame={showAt.low} anchor="center" opacity={labelsOp} connectorTo={{ x: cx, y: scale(candle.l) }} />
      {/* Open — left of the body edge */}
      <Chip
        label="Open"
        bare
        opacity={labelsOp}
        x={leftX - LABEL_GAP}
        y={yO}
        variant="indigo"
        startFrame={showAt.open}
        anchor="right"
        connectorTo={{ x: leftX, y: yO }}
      />
      {/* Close — right of the body edge */}
      <Chip
        label="Close"
        bare
        opacity={labelsOp}
        x={rightX + LABEL_GAP}
        y={yC}
        variant="indigo"
        startFrame={showAt.close}
        anchor="left"
        connectorTo={{ x: rightX, y: yC }}
      />
    </>
  );
};
