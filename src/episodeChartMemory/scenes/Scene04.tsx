import { useCurrentFrame } from "remotion";
/**
 * SC04 — Line Becomes Candles + Anatomy (Phase C, local 1190–1997). The line→candle mask-wipe lives in ChartContinuity;
 * this overlay carries the closing-price chip, the AnatomyCandle card on the
 * right third, and the 4-info counter.
 */
import { Chip } from "../components/Chip";
import { AnatomyCandle } from "../components/AnatomyCandle";
import { fadeIn } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = { closeChip: 86, cardIn: 340, open: 382, high: 415, low: 445, close: 477, counter: 536 };
const CARD = { x: 1250, y: 250, w: 520, h: 540 };
// ═══════════════════════════════════════════════════════════════════════════

/** A real candle from the window with a readable body — the anatomy subject. */
const pickAnatomy = (a: number, b: number) => {
  let best = a;
  let bestScore = -1;
  for (let i = a + 4; i <= b - 4; i++) {
    const d = bmriDaily[i];
    const body = Math.abs(d.c - d.o);
    const wick = d.h - d.l;
    const score = body * 0.7 + wick * 0.3;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
};

export const Scene04 = ({ geom }: { geom: ContGeom }) => {
  const local = useCurrentFrame();
  const { win, cx, scale } = geom;
  const [a, b] = win;
  const idx = pickAnatomy(a, b);
  const candle = bmriDaily[idx];

  const cardOp = local >= T.cardIn ? fadeIn(local, T.cardIn, 26) : 0;
  // counter pulses once when the four values are all on screen
  const pulse = local >= T.counter && local < T.counter + 30 ? Math.sin(((local - T.counter) / 30) * Math.PI) : 0;

  return (
    <>
      {/* the line still reads as closing prices before the wipe */}
      {local < T.cardIn && (
        <Chip
          label="Harga Penutupan"
          x={cx(b) - 22}
          y={scale(bmriDaily[b].c) - 74}
          variant="indigo"
          anchor="right"
          startFrame={T.closeChip}
          connectorTo={{ x: cx(b), y: scale(bmriDaily[b].c) - 10 }}
        />
      )}

      {cardOp > 0.001 && (
        <div style={{ opacity: cardOp }}>
          <AnatomyCandle
            candle={candle}
            cardX={CARD.x}
            cardY={CARD.y}
            cardW={CARD.w}
            cardH={CARD.h}
            showAt={{ open: T.open, high: T.high, low: T.low, close: T.close }}
          />
        </div>
      )}

      {/* 4 Info · 1 Candle — pulses once above the anatomy card */}
      {local >= T.counter && (
        <div style={{ transform: `scale(${1 + 0.06 * pulse})`, transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y - 34}px` }}>
          <Chip label="4 Info · 1 Candle" x={CARD.x + CARD.w / 2} y={CARD.y - 34} variant="indigo" anchor="center" startFrame={T.counter} />
        </div>
      )}
    </>
  );
};
