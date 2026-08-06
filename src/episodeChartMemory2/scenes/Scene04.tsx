import { useCurrentFrame } from "remotion";
/**
 * SC04 — Line Becomes Candles + Anatomy (Phase C, local 1190–1997).
 * The longest scene, in three movements so nothing idles: the line chart is
 * praised then found wanting (ghost wicks hint at the missing data), the
 * line→candle mask-wipe hands over (that wipe lives in ChartContinuity), and one
 * real candle is dissected on the AnatomyCandle card before the series is
 * inspected up close.
 */
import { Chip } from "../components/Chip";
import { AnatomyCandle } from "../components/AnatomyCandle";
import { theme } from "../theme";
import { fadeIn, fadeOut, progress, mulberry32 } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  selector: 0, // "beberapa bentuk"
  closeChip: 86, // "menghubungkan harga penutupan"
  ghosts: 238, // "tetapi banyak cerita"
  hiddenCap: 278, // "tidak terlihat" — timing beat only; the caption itself is gone
  wipe: 313, // "Candlestick memberi gambaran lebih lengkap"
  cardIn: 370, // one candle scales out of the series
  open: 382,
  high: 415,
  low: 445,
  close: 477,
  counter: 536, // "Empat informasi dalam satu candle"
  back: 600, // "Karena itulah"
  // "membaca pergerakan harga dengan lebih detail" — the push-in and its
  // cut-on-action live in ChartContinuity (K.push / K.cut); these are just the
  // label beats that hang off it.
  label: 736, // global 2415 — the camera has come to rest
  labelOut: 767, // global 2446 — it backs out again
};
const CARD = { x: 1250, y: 250, w: 520, h: 540 };
const FORMS = ["Line", "Candlestick"] as const;
// Two segments + one gap, centred on the canvas.
const SEG = { y: 196, w: 250, h: 56, gap: 8, x: (theme.canvas.width - (250 * 2 + 8)) / 2 };
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
  const { box, win, cx, scale, camera } = geom;
  // The window bounds go FRACTIONAL while the camera moves (that is what keeps
  // the move smooth) — round before using them as array indices.
  const a = Math.ceil(win[0]);
  const b = Math.floor(win[1]);
  const idx = pickAnatomy(a, b);
  const candle = bmriDaily[idx];

  const cardIn = local >= T.cardIn ? fadeIn(local, T.cardIn, 26) : 0;
  const back = local >= T.back ? progress(local, T.back, 40) : 0;
  const cardOp = cardIn * (1 - back);
  const cardShift = back * -180; // the card travels back toward the series
  const pulse = local >= T.counter && local < T.counter + 30 ? Math.sin(((local - T.counter) / 30) * Math.PI) : 0;

  // form selector: Line → Candlestick on the wipe
  const toCandle = local >= T.wipe ? progress(local, T.wipe, 30) : 0;

  // the closes the line is built from, pulsing in sequence
  const closePulse = (i: number) => {
    const t = local - (T.closeChip + (i - a) * 4);
    return t >= 0 && t < 18 ? Math.sin((t / 18) * Math.PI) : 0;
  };
  const closesOn = local >= T.closeChip && local < T.wipe;

  // ghost wicks — the data a line silently drops
  const ghostOn = local >= T.ghosts && local < T.hiddenCap + 20;
  const ghostFade = local >= T.hiddenCap ? 1 - progress(local, T.hiddenCap, 20) : progress(local, T.ghosts, 16);
  const ghostIdx = (() => {
    const rnd = mulberry32(613);
    return [0.2, 0.42, 0.63, 0.84].map((q) => a + Math.floor((b - a) * (q + (rnd() - 0.5) * 0.04)));
  })();

  const labelOp = local >= T.labelOut ? fadeOut(local, T.labelOut, 20) : 1;

  return (
    <>
      {/* which form are we looking at */}
      {FORMS.map((lab, i) => {
        const active = i === 0 ? 1 - toCandle : toCandle;
        return (
          <div
            key={lab}
            style={{
              position: "absolute",
              left: SEG.x + i * (SEG.w + SEG.gap),
              top: SEG.y,
              // wide-view chrome: steps aside with the axes while the camera moves in
              opacity: fadeIn(local, T.selector, 18) * Math.max(0, 1 - camera * 3),
            }}
          >
            <div
              style={{
                width: SEG.w,
                height: SEG.h,
                borderRadius: theme.radius.chip,
                background: active > 0.5 ? theme.colors.indigo : theme.colors.cardBg,
                border: `${theme.stroke.hair}px solid ${active > 0.5 ? theme.colors.indigo : theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.type.family,
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: active > 0.5 ? theme.colors.cardBg : theme.colors.slate,
              }}
            >
              {lab}
            </div>
          </div>
        );
      })}

      {/* the closes the line is drawn through */}
      {closesOn && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {Array.from({ length: b - a + 1 }, (_, k) => {
            const i = a + k;
            const q = closePulse(i);
            if (q <= 0.01) return null;
            return <circle key={i} cx={cx(i)} cy={scale(bmriDaily[i].c)} r={3 + 4 * q} fill={theme.colors.indigo} opacity={0.9 * q} />;
          })}
        </svg>
      )}

      {/* the line still reads as closing prices before the wipe */}
      {local < T.wipe && (
        <Chip
          label="Harga Penutupan"
          x={cx(b) - 22}
          // y sits just below the Line/Candlestick selector; x is unchanged, so
          // the connector still runs down to the last close.
          y={SEG.y + SEG.h + 40}
          variant="indigo"
          anchor="right"
          bare
          size={theme.type.chip.size - 4}
          startFrame={T.closeChip}
          connectorTo={{ x: cx(b), y: scale(bmriDaily[b].c) - 10 }}
        />
      )}

      {/* what a line quietly drops — carried by the ghost wicks alone, no caption */}

      {/* ghost wicks — the high/low a line never shows */}
      {ghostOn && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {ghostIdx.map((i) => (
            <line
              key={i}
              x1={cx(i)}
              y1={scale(bmriDaily[i].h)}
              x2={cx(i)}
              y2={scale(bmriDaily[i].l)}
              stroke={theme.colors.muted}
              strokeWidth={theme.stroke.rule}
              strokeDasharray="6 6"
              opacity={0.75 * ghostFade}
            />
          ))}
        </svg>
      )}

      {cardOp > 0.001 && (
        <div style={{ opacity: cardOp, transform: `translateX(${cardShift}px)` }}>
          <AnatomyCandle
            candle={candle}
            cardX={CARD.x}
            cardY={CARD.y}
            cardW={CARD.w}
            cardH={CARD.h}
            nudgeX={20}
            showAt={{ open: T.open, high: T.high, low: T.low, close: T.close }}
          />
        </div>
      )}

      {/* 4 Info · 1 Candle — pulses once above the anatomy card */}
      {local >= T.counter && local < T.back + 40 && (
        <div style={{ transform: `scale(${1 + 0.06 * pulse})`, transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y - 34}px`, opacity: 1 - back }}>
          <Chip label="4 Info · 1 Candle" x={CARD.x + CARD.w / 2} y={CARD.y - 34} variant="indigo" anchor="center" startFrame={T.counter} />
        </div>
      )}

      {/* the camera has landed; label what it landed on */}
      <Chip label="Detail" x={box.x + box.w} y={box.y - 34} variant="slate" anchor="right" startFrame={T.label} opacity={labelOp} />
    </>
  );
};
