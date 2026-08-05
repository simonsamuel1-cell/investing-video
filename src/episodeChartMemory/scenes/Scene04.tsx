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
import { CandlestickChart } from "../components/CandlestickChart";
import { theme } from "../theme";
import { fadeIn, progress, textReveal, mulberry32, type Box } from "../helpers";
import { bmriDaily } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  selector: 0, // "beberapa bentuk"
  closeChip: 86, // "menghubungkan harga penutupan"
  cleanCap: 164, // "bersih dan mudah dipahami"
  ghosts: 238, // "tetapi banyak cerita"
  hiddenCap: 278, // "tidak terlihat"
  wipe: 313, // "Candlestick memberi gambaran lebih lengkap"
  cardIn: 370, // one candle scales out of the series
  open: 382,
  high: 415,
  low: 445,
  close: 477,
  counter: 536, // "Empat informasi dalam satu candle"
  back: 600, // "Karena itulah"
  standard: 630, // "pilihan utama trader"
  zoom: 709, // "membaca pergerakan harga dengan lebih detail"
};
const CARD = { x: 1250, y: 250, w: 520, h: 540 };
const DETAIL: Box = { x: 500, y: 330, w: 920, h: 400 };
const N_DETAIL = 12;
const FORMS = ["Line", "Candlestick"] as const;
const SEG = { x: 260, y: 196, w: 250, h: 56, gap: 8 };
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

  const cleanCap = textReveal(local, T.cleanCap);
  const hiddenCap = textReveal(local, T.hiddenCap);
  const detail = local >= T.zoom ? progress(local, T.zoom, 40) : 0;

  return (
    <>
      {/* which form are we looking at */}
      {FORMS.map((lab, i) => {
        const active = i === 0 ? 1 - toCandle : toCandle;
        return (
          <div key={lab} style={{ position: "absolute", left: SEG.x + i * (SEG.w + SEG.gap), top: SEG.y, opacity: fadeIn(local, T.selector, 18) }}>
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
          y={scale(bmriDaily[b].c) - 74}
          variant="indigo"
          anchor="right"
          startFrame={T.closeChip}
          connectorTo={{ x: cx(b), y: scale(bmriDaily[b].c) - 10 }}
        />
      )}

      {/* what a line does well… */}
      {local >= T.cleanCap && local < T.hiddenCap && (
        <div
          style={{
            position: "absolute",
            left: SEG.x,
            top: 880,
            fontFamily: theme.type.family,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.slate,
            opacity: cleanCap.opacity,
            transform: `translateY(${cleanCap.y}px)`,
          }}
        >
          Bersih, mudah dibaca
        </div>
      )}
      {/* …and what it quietly drops */}
      {local >= T.hiddenCap && local < T.wipe + 60 && (
        <div
          style={{
            position: "absolute",
            left: SEG.x,
            top: 880,
            fontFamily: theme.type.family,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.slate,
            opacity: hiddenCap.opacity,
            transform: `translateY(${hiddenCap.y}px)`,
          }}
        >
          Tapi banyak yang tersembunyi
        </div>
      )}

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

      <Chip label="Standar Trader" x={SEG.x} y={880} variant="indigo" anchor="left" startFrame={T.standard} opacity={detail > 0.5 ? 1 - detail : 1} />

      {/* up close, so individual bodies and wicks read */}
      {detail > 0.001 && (
        <div style={{ opacity: detail }}>
          <div
            style={{
              position: "absolute",
              left: DETAIL.x,
              top: DETAIL.y,
              width: DETAIL.w,
              height: DETAIL.h,
              borderRadius: theme.radius.cardLg,
              background: theme.colors.cardBg,
              border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.lift,
            }}
          />
          <CandlestickChart
            data={bmriDaily}
            window={[b - N_DETAIL + 1, b]}
            box={{ x: DETAIL.x + 40, y: DETAIL.y + 56, w: DETAIL.w - 150, h: DETAIL.h - 110 }}
            showAxes={false}
            revealProgress={detail}
          />
          <Chip label="Detail" x={DETAIL.x + DETAIL.w - 20} y={DETAIL.y + 34} variant="slate" anchor="right" startFrame={T.zoom + 14} />
        </div>
      )}
    </>
  );
};
