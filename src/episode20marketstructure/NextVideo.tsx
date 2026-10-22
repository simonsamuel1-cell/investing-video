/**
 * TA05 — the next-video ending, over TA05-Outro.mp3 (Simon, 20 Oct 2026: "sama seperti di TA09"). Mounted by
 * FullVideo.tsx through core/EpisodeWrap's `next`; the head is core's, the same on every TA ending.
 *
 *   "Di video selanjutnya kita akan bahas tentang chart patterns,"  → "Video selanjutnya", the title, a chart drawing
 *   "yaitu pola yang terbentuk dari pergerakan harga."              → the pattern traced over the price (a double
 *                                                                    bottom), then its neckline and its two lows
 *
 * Word times: faster-whisper on the clip (7.09 s); the cue words are its transcription — there was no script.
 * ⚠ THE CHART IS GENERATED (fromAnchors): no ticker, no prices on it, and the pattern is not named on screen.
 */
import {
  Stage, GridGround, NextVideoHead, NEXT_LAYOUT, Panel, Candles, HighlightCircle, gridOf, fromAnchors, toBars, progressInOut,
  useMotion, useNextClip, usePalette, theme,
} from "../core";
import type { Anchor, NextVideo } from "../core";

const CLIP = { seconds: 7.094 };
const WORD = { title: 1.92, chart: 1.92, pattern: 4.1, formed: 4.96 };

const CARD = { x: 300, y: NEXT_LAYOUT.body.top, w: 1320, h: 470 };
const BOX = { x: CARD.x + 40, y: CARD.y + 30, w: CARD.w - 80, h: CARD.h - 60 };
/** A double bottom: down, up to the neckline, down to the same low, up through the neckline. */
const TURNS: Anchor[] = [[0, 0.82], [0.2, 0.3], [0.38, 0.62], [0.56, 0.31], [0.76, 0.64], [0.9, 0.82], [1, 0.86]];
const N = 60;
const CLOSES = fromAnchors(TURNS, N, 5501, 0.015);
const BARS = toBars(CLOSES, 5502, 0.8);
const G = gridOf(CLOSES, [0.2, 0.95], BOX, 0.06);
const PATTERN = TURNS.slice(0, 6).map(([t, v]) => [G.x(Math.round(t * (N - 1))), G.y(v)] as const);
const NECK = TURNS[2][1];
const LOWS = [TURNS[1], TURNS[3]].map(([t, v]) => ({ x: G.x(Math.round(t * (N - 1))), y: G.y(v) }));

const Scene = () => {
  const { f, at } = useNextClip();
  const c = usePalette();
  const m = useMotion();
  const shown = progressInOut(f, at(WORD.chart) + m.sec(0.2), m.sec(1.8));
  const trace = progressInOut(f, at(WORD.pattern), m.sec(1));
  const neck = progressInOut(f, at(WORD.formed), m.sec(0.7));
  return (
    <Stage>
      <GridGround f={f} />
      <NextVideoHead title="Chart Patterns" chipAt={at(0)} titleAt={at(WORD.title)} />
      <Panel rect={CARD} at={at(WORD.chart)} radius={theme.shape.cardRadius}>
        {f >= at(WORD.chart) && <Candles bars={BARS} grid={G} shown={shown} opacity={1 - 0.45 * trace} />}
        {trace > 0.001 && (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <polyline points={PATTERN.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} pathLength={1} fill="none" stroke={c.indigo} strokeWidth={theme.shape.line + 3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - trace} />
            {neck > 0.001 && (
              <line x1={BOX.x + 20} y1={G.y(NECK)} x2={BOX.x + 20 + (BOX.w - 40) * neck} y2={G.y(NECK)} stroke={c.cyan} strokeWidth={theme.shape.line} strokeDasharray="14 10" strokeLinecap="round" />
            )}
          </svg>
        )}
        {LOWS.map((p, k) => (
          <HighlightCircle key={k} cx={p.x} cy={p.y} r={34} land={progressInOut(f, at(WORD.formed) + m.sec(0.25) * (k + 1), m.pop)} width={theme.shape.line} />
        ))}
      </Panel>
    </Stage>
  );
};

const s = (sec: number) => Math.round(sec * 30);
export const NEXT_TA05: NextVideo = {
  vo: "vo/ta05-outro.mp3",
  seconds: CLIP.seconds,
  scene: <Scene />,
  cues: [
    { start: s(0), end: s(1.88), text: "Di video selanjutnya, kita akan bahas tentang" },
    { start: s(1.92), end: s(4.05), text: "chart patterns, yaitu" },
    { start: s(4.1), end: s(7.0), text: "pola yang terbentuk dari pergerakan harga." },
  ],
};
