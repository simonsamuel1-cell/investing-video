/**
 * TA07 — the next-video ending, over TA07-Outro.mp3 (Simon, 20 Oct 2026: "sama seperti di TA09"). Mounted by
 * FullVideo.tsx through core/EpisodeWrap's `next`; the head is core's, the same on every TA ending.
 *
 *   "Di video selanjutnya kita lanjut membahas ke indikator momentum"  → "Video selanjutnya", the title
 *   "seperti RSI, Stochastic, dan MACD."                                → three cards, each on its word, each with
 *                                                                        the shape that indicator draws
 *
 * Word times: faster-whisper on the clip (5.03 s); the cue words are its transcription — there was no script.
 * ⚠ THE LINES ARE SCHEMATIC (sine waves), not computed from a price: no ticker, no values, no levels written on them.
 */
import { Stage, GridGround, NextVideoHead, NextTab, NEXT_LAYOUT, Panel, progressInOut, useMotion, useNextClip, usePalette, theme } from "../../core";
import type { NextVideo } from "../../core";

const CLIP = { seconds: 5.027 };
const WORD = { title: 1.68, rsi: 2.84, stoch: 3.6, macd: 4.3 };

const CX = theme.canvas.width / 2;
const CARD = { w: 500, h: 340, gap: 50, y: NEXT_LAYOUT.body.top + 60 };
const cardX = (i: number) => CX - (3 * CARD.w + 2 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
const PLOT = { dx: 30, dy: 96, w: CARD.w - 60, h: CARD.h - 126 };
const SAMPLES = 80;

/** A schematic oscillator: 0..1 across the plot, `fn` → 0..1 up the plot. */
const line = (x: number, y: number, fn: (t: number) => number) =>
  Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES;
    return `${(x + t * PLOT.w).toFixed(1)},${(y + PLOT.h * (1 - fn(t))).toFixed(1)}`;
  }).join(" ");
const rsi = (t: number) => 0.5 + 0.36 * Math.sin(t * 11) * (0.7 + 0.3 * Math.sin(t * 3));
const stochK = (t: number) => 0.5 + 0.42 * Math.sin(t * 13);
const stochD = (t: number) => 0.5 + 0.36 * Math.sin(t * 13 - 0.6);
const macdA = (t: number) => 0.5 + 0.3 * Math.sin(t * 7);
const macdB = (t: number) => 0.5 + 0.3 * Math.sin(t * 7 - 0.7);

const Card = ({ i, name, at }: { i: number; name: string; at: number }) => {
  const { f } = useNextClip();
  const c = usePalette();
  const m = useMotion();
  const x = cardX(i);
  const px = x + PLOT.dx;
  const py = CARD.y + PLOT.dy;
  const draw = progressInOut(f, at + m.sec(0.15), m.sec(0.8));
  const tab = progressInOut(f, at, m.pop);
  const dash = (v: number) => <line x1={px} y1={py + PLOT.h * (1 - v)} x2={px + PLOT.w} y2={py + PLOT.h * (1 - v)} stroke={c.border} strokeWidth={2} strokeDasharray="10 8" />;
  const path = (pts: string, color: string) => <polyline points={pts} pathLength={1} fill="none" stroke={color} strokeWidth={theme.shape.line + 1} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - draw} />;
  return (
    <Panel rect={{ x, y: CARD.y, w: CARD.w, h: CARD.h }} at={at} radius={theme.shape.cardRadius}>
      <NextTab x={x + 28} y={CARD.y + 24} text={name} p={tab} on={tab > 0.5} />
      {f >= at && (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {name === "RSI" && (
            <>
              {dash(0.7)}
              {dash(0.3)}
              {path(line(px, py, rsi), c.indigo)}
            </>
          )}
          {name === "Stochastic" && (
            <>
              {dash(0.8)}
              {dash(0.2)}
              {path(line(px, py, stochK), c.indigo)}
              {path(line(px, py, stochD), c.cyan)}
            </>
          )}
          {name === "MACD" && (
            <>
              {Array.from({ length: 24 }, (_, k) => {
                const t = (k + 0.5) / 24;
                const v = (macdA(t) - macdB(t)) * 1.6;
                const h = Math.abs(v) * PLOT.h * draw;
                const y0 = py + PLOT.h / 2;
                return <rect key={k} x={px + t * PLOT.w - 6} y={v > 0 ? y0 - h : y0} width={12} height={h} rx={3} fill={v > 0 ? c.cyan : theme.color.indigoWashStrong} />;
              })}
              {path(line(px, py, macdA), c.indigo)}
              {path(line(px, py, macdB), c.cyan)}
            </>
          )}
        </svg>
      )}
    </Panel>
  );
};

const Scene = () => {
  const { f, at } = useNextClip();
  return (
    <Stage>
      <GridGround f={f} />
      <NextVideoHead title="Indikator Momentum" chipAt={at(0)} titleAt={at(WORD.title)} />
      <Card i={0} name="RSI" at={at(WORD.rsi)} />
      <Card i={1} name="Stochastic" at={at(WORD.stoch)} />
      <Card i={2} name="MACD" at={at(WORD.macd)} />
    </Stage>
  );
};

const s = (sec: number) => Math.round(sec * 30);
export const NEXT_TA07: NextVideo = {
  vo: "vo/ta07-outro.mp3",
  seconds: CLIP.seconds,
  scene: <Scene />,
  cues: [
    { start: s(0), end: s(1.66), text: "Di video selanjutnya, kita lanjut membahas" },
    { start: s(1.68), end: s(3.55), text: "ke indikator momentum seperti RSI," },
    { start: s(3.6), end: s(5.0), text: "Stochastic, dan MACD." },
  ],
};
