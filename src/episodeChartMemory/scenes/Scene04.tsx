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
import type { OHLC } from "../data/bmri";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  /**
   * ⚠ GLOBAL 2073 — the Line / Candlestick buttons arrive WITH the line
   * (Simon: "Di 2073, juga boleh munculkan button Line dan Candlestick"),
   * not on the scene's first frame over a chart that is still candles.
   */
  selector: 92,
  ghosts: 238, // "tetapi banyak cerita"
  hiddenCap: 278, // "tidak terlihat" — timing beat only; the caption itself is gone
  wipe: 313, // "Candlestick memberi gambaran lebih lengkap"
  cardIn: 370, // one candle scales out of the series
  open: 382,
  high: 415,
  low: 445,
  close: 477,
  counter: 536, // "Empat informasi dalam satu candle"
  /**
   * ⚠ THE ANATOMY CARD NO LONGER SLIDES LEFT. Simon, at 2584: "window
   * candlestick jangan geser kiri, tapi fade out biasa dulu text-textnya, lalu
   * trim path out candlesticknya." Labels fade first, then the candle trims.
   */
  textsOut: 603, // global 2584
  textsOutDur: 15,
  candleOut: 618, // global 2599
  candleOutDur: 24,
  /** Global 2685 — the Line / Candlestick buttons leave as the zoom starts. */
  selectorOut: 704,
  selectorOutDur: 15,
  // "membaca pergerakan harga dengan lebih detail" — the push-in and its
  // cut-on-action live in ChartContinuity (K.push / K.cut); these are just the
  // label beats that hang off it. (The "Detail" chip is gone with the cut.)
};
// Moved right 20px: at x=1250 the card's left edge sat 10px off the chart's
// price labels and read as touching them. The candle and its four chips are
// positioned FROM this box, so they travel with it as one group.
const CARD = { x: 1270, y: 250, w: 520, h: 540 };
const FORMS = ["Line", "Candlestick"] as const;
// Two segments + one gap, centred on the canvas.
const SEG = { y: 196, w: 250, h: 56, gap: 8, x: (theme.canvas.width - (250 * 2 + 8)) / 2 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE ANATOMY CANDLE IS SIMON'S REFERENCE, GREEN. Simon, at 2371:
 * "candlesticknya warna hijau aja, buat ulang dari screenshot ini." It used
 * to be the chart's own biggest candle, which on the saham series is a red
 * one. Proportions are read off his reference (a 520px-tall candle): upper
 * wick 87, body 347, lower wick 86, body 66 wide, wick 10. Fitted to the card
 * — "ukurannya ga harus sama, di muatin aja sama ukuran window" — with room
 * above and below for High and Low. Units are pixels of the reference; no
 * price is shown, so none is implied.
 */
const ANATOMY: OHLC = { date: "reference", l: 0, o: 86, c: 86 + 347, h: 520 };
const ANATOMY_BODY = 66 / 520;
const ANATOMY_WICK = 10 / 520;

export const Scene04 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const local = useCurrentFrame();
  const { win, cx, scale, series } = geom;
  // The window bounds go FRACTIONAL while the camera moves (that is what keeps
  // the move smooth) — round before using them as array indices.
  const a = Math.ceil(win[0]);
  const b = Math.floor(win[1]);

  const cardIn = local >= T.cardIn ? fadeIn(local, T.cardIn, 26) : 0;
  const textsOp = local >= T.textsOut ? fadeOut(local, T.textsOut, T.textsOutDur) : 1;
  const candleTrim = local >= T.candleOut ? progress(local, T.candleOut, T.candleOutDur) : 0;
  const cardOp = candleTrim < 0.999 ? cardIn : 0;
  const pulse = local >= T.counter && local < T.counter + 30 ? Math.sin(((local - T.counter) / 30) * Math.PI) : 0;

  // form selector: Line → Candlestick on the wipe
  const toCandle = local >= T.wipe ? progress(local, T.wipe, 30) : 0;


  // ghost wicks — the data a line silently drops
  const ghostOn = local >= T.ghosts && local < T.hiddenCap + 20;
  const ghostFade = local >= T.hiddenCap ? 1 - progress(local, T.hiddenCap, 20) : progress(local, T.ghosts, 16);
  const ghostIdx = (() => {
    const rnd = mulberry32(613);
    return [0.2, 0.42, 0.63, 0.84].map((q) => a + Math.floor((b - a) * (q + (rnd() - 0.5) * 0.04)));
  })();


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
              // "Text 'Line' dan 'Candlestick' nya fade out juga" — at the zoom
              opacity:
                fadeIn(local, T.selector, 18) *
                (local >= T.selectorOut ? fadeOut(local, T.selectorOut, T.selectorOutDur) : 1),
            }}
          >
            <div
              style={{
                width: SEG.w,
                height: SEG.h,
                borderRadius: theme.radius.chip,
                background: active > 0.5 ? pal.indigo : pal.cardBg,
                border: `${theme.stroke.hair}px solid ${active > 0.5 ? pal.indigo : pal.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.type.family,
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: active > 0.5 ? pal.cardBg : pal.slate,
              }}
            >
              {lab}
            </div>
          </div>
        );
      })}

      {/* ⚠ NO TRAVELLING DOTS. A pulse ran along the closes from 2067 —
          standing in for a line that was never actually drawn (see
          ChartContinuity). Simon: "apa itu animasi muncul titik titik ini?
          Gaada artinya." The line itself is on screen now. */}

      {/* ⚠ NO "Harga Penutupan" LABEL — Simon: "'Harga penutupan' nya di
          remove." The voice says it over the line being drawn. */}

      {/* what a line quietly drops — carried by the ghost wicks alone, no caption */}

      {/* ghost wicks — the high/low a line never shows */}
      {ghostOn && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {ghostIdx.map((i) => (
            <line
              key={i}
              x1={cx(i)}
              y1={scale(series[i].h)}
              x2={cx(i)}
              y2={scale(series[i].l)}
              stroke={pal.muted}
              strokeWidth={theme.stroke.rule}
              strokeDasharray="6 6"
              opacity={0.75 * ghostFade}
            />
          ))}
        </svg>
      )}

      {cardOp > 0.001 && (
        <div style={{ opacity: cardOp }}>
          <AnatomyCandle
            candle={ANATOMY}
            cardX={CARD.x}
            cardY={CARD.y}
            cardW={CARD.w}
            cardH={CARD.h}
            nudgeX={20}
            showAt={{ open: T.open, high: T.high, low: T.low, close: T.close }}
            labelsOp={textsOp}
            bodyRatio={ANATOMY_BODY}
            wickRatio={ANATOMY_WICK}
            trim={candleTrim}
          />
        </div>
      )}

      {/* 4 Info · 1 Candle — pulses once above the anatomy card */}
      {local >= T.counter && textsOp > 0.001 && (
        <div style={{ transform: `scale(${1 + 0.06 * pulse})`, transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y - 34}px`, opacity: textsOp }}>
          <Chip label="4 Info · 1 Candle" x={CARD.x + CARD.w / 2} y={CARD.y - 34} variant="indigo" anchor="center" startFrame={T.counter} />
        </div>
      )}

    </>
  );
};
