/**
 * TA01 — the next-video ending, over TA01-Outro.mp3 (Simon, 20 Oct 2026: "sama seperti di TA09"). Mounted by
 * FullVideo.tsx through core/EpisodeWrap's `next`; the head is core's, the same on every TA ending.
 *
 *   "Di video selanjutnya, kita akan mulai membedah candlestick dari paling dasar."
 *        → "Video selanjutnya", the title, and on "dasar" an empty card
 *   "Satu candle sebenarnya sedang menceritakan apa?"
 *        → one big candle grows in it on "Satu candle"; on "menceritakan apa" a speech bubble with a "?" beside it
 *
 * Word times: faster-whisper on the clip (7.88 s). The words in `cues` are its transcription — there was no script.
 * The candle is drawn here, not from data: it is one candle, standing for "a candle".
 */
import { Stage, GridGround, NextVideoHead, NEXT_LAYOUT, Panel, progressInOut, useMotion, useNextClip, usePalette, theme } from "../core";
import type { NextVideo } from "../core";

const CLIP = { seconds: 7.883 };
const WORD = { title: 2.5, card: 3.7, candle: 4.76, tells: 6.64 };

const CX = theme.canvas.width / 2;
const CARD = { w: 760, h: 460, y: NEXT_LAYOUT.body.top };
const CANDLE = { x: CX - 90, w: 120, high: CARD.y + 50, top: CARD.y + 130, bottom: CARD.y + 330, low: CARD.y + 410, r: 14 };
const BUBBLE = { x: CX + 40, y: CARD.y + 70, w: 200, h: 150, r: 34 };

const Scene = () => {
  const { f, at } = useNextClip();
  const c = usePalette();
  const m = useMotion();
  const grow = progressInOut(f, at(WORD.candle), m.sec(0.8));
  const wick = progressInOut(f, at(WORD.candle) + m.sec(0.5), m.sec(0.5));
  const bubble = progressInOut(f, at(WORD.tells), m.pop);
  const mid = (CANDLE.top + CANDLE.bottom) / 2;
  const bodyH = (CANDLE.bottom - CANDLE.top) * grow;
  return (
    <Stage>
      <GridGround f={f} />
      <NextVideoHead title="Candlestick" chipAt={at(0)} titleAt={at(WORD.title)} />
      <Panel rect={{ x: CX - CARD.w / 2, y: CARD.y, w: CARD.w, h: CARD.h }} at={at(WORD.card)} radius={theme.shape.cardRadius}>
        {grow > 0.001 && (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={CANDLE.x} y1={mid - (mid - CANDLE.high) * wick} x2={CANDLE.x} y2={mid + (CANDLE.low - mid) * wick} stroke={c.candleGreen} strokeWidth={theme.shape.heavy} strokeLinecap="round" />
            <rect x={CANDLE.x - CANDLE.w / 2} y={mid - bodyH / 2} width={CANDLE.w} height={bodyH} rx={CANDLE.r} fill={c.candleGreen} />
          </svg>
        )}
        {bubble > 0.001 && (
          <svg width={BUBBLE.w + 40} height={BUBBLE.h + 40} style={{ position: "absolute", left: BUBBLE.x - 30, top: BUBBLE.y, opacity: bubble, transform: `scale(${(0.85 + 0.15 * bubble).toFixed(3)})`, transformOrigin: "0px 100%" }}>
            <rect x={30} y={0} width={BUBBLE.w} height={BUBBLE.h} rx={BUBBLE.r} fill={theme.color.indigoWash} stroke={c.indigo} strokeWidth={theme.shape.line} />
            <path d={`M 52 ${BUBBLE.h - 2} L 30 ${BUBBLE.h + 30} L 84 ${BUBBLE.h - 2}`} fill={theme.color.indigoWash} stroke={c.indigo} strokeWidth={theme.shape.line} strokeLinejoin="round" />
            <text x={30 + BUBBLE.w / 2} y={BUBBLE.h / 2 + 38} textAnchor="middle" fontFamily={theme.text.family} fontSize={110} fontWeight={800} fill={c.indigo}>?</text>
          </svg>
        )}
      </Panel>
    </Stage>
  );
};

const s = (sec: number) => Math.round(sec * 30);
export const NEXT_TA01: NextVideo = {
  vo: "vo/ta01-outro.mp3",
  seconds: CLIP.seconds,
  scene: <Scene />,
  cues: [
    { start: s(0), end: s(1.94), text: "Di video selanjutnya, kita akan mulai" },
    { start: s(1.96), end: s(4.3), text: "membedah candlestick dari paling dasar." },
    { start: s(4.76), end: s(7.7), text: "Satu candle sebenarnya sedang menceritakan apa?" },
  ],
};
