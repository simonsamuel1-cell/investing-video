/**
 * AnatomyCandle — one enlarged real candle on a card, with four Title Case
 * callout chips (Open / High / Low / Close) attached by 1px connectors:
 * High at the wick top, Low at the wick bottom, Open/Close at the body edges.
 * Chips alternate sides so no two labels overlap.
 *
 * The whole group — candle plus all four chips — is centred on the card. That
 * only works if Open and Close occupy the same width, hence LABEL_W: with equal
 * side chips the group is symmetric about the wick, so putting the wick on the
 * card's centre line centres everything.
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
}) => {
  const pal = usePalette();
  const padTop = cardY + 96;
  const padBottom = cardY + cardH - 96;
  const scale = priceScale(candle.l, candle.h, padTop, padBottom, 0.05);
  const cx = cardX + cardW / 2 + nudgeX;
  const bodyW = 92;
  const LABEL_W = 150; // fixed, so Open and Close balance either side of the wick
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
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: cardW,
          height: cardH,
          borderRadius: theme.radius.cardLg,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          opacity,
        }}
      />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }} width={theme.canvas.width} height={theme.canvas.height}>
        <line x1={cx} y1={scale(candle.h)} x2={cx} y2={scale(candle.l)} stroke={color} strokeWidth={10} />
        <rect x={leftX} y={top} width={bodyW} height={h} fill={color} />
      </svg>

      {/* High — above the wick top, centred */}
      <Chip label="High" x={cx} y={scale(candle.h) - 52} variant="indigo" startFrame={showAt.high} anchor="center" connectorTo={{ x: cx, y: scale(candle.h) }} />
      {/* Low — below the wick bottom, centred */}
      <Chip label="Low" x={cx} y={scale(candle.l) + 52} variant="indigo" startFrame={showAt.low} anchor="center" connectorTo={{ x: cx, y: scale(candle.l) }} />
      {/* Open — left of the body edge */}
      <Chip
        label="Open"
        x={leftX - LABEL_GAP}
        y={yO}
        variant="indigo"
        startFrame={showAt.open}
        anchor="right"
        width={LABEL_W}
        connectorTo={{ x: leftX, y: yO }}
      />
      {/* Close — right of the body edge */}
      <Chip
        label="Close"
        x={rightX + LABEL_GAP}
        y={yC}
        variant="indigo"
        startFrame={showAt.close}
        anchor="left"
        width={LABEL_W}
        connectorTo={{ x: rightX, y: yC }}
      />
    </>
  );
};
