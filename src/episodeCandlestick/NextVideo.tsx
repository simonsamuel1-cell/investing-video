/**
 * TA03 (Indonesian cut) — the next-video ending, over TA03-Outro.mp3 (Simon, 20 Oct 2026: "sama seperti di TA09").
 * Mounted by FullVideo.tsx through core/EpisodeWrap's `next`; the head is core's, the same on every TA ending.
 *
 *   "Di video selanjutnya kita akan bahas support dan resistance,"  → "Video selanjutnya", the title, a chart drawing
 *   "area di mana harga sering bereaksi."                           → the two areas; rings where price turned at them
 *
 * Word times: faster-whisper on the clip (7.01 s); the cue words are its transcription — there was no script.
 * ⚠ THE CHART IS GENERATED (fromAnchors): no ticker, no prices on it.
 */
import {
  Stage, GridGround, NextVideoHead, NEXT_LAYOUT, Panel, Candles, HighlightCircle, gridOf, fromAnchors, toBars, progressInOut,
  useMotion, useNextClip, usePalette, theme,
} from "../core";
import type { Anchor, NextVideo } from "../core";

const CLIP = { seconds: 7.012 };
const WORD = { title: 2.46, chart: 2.46, area: 4.38, react: 5.24 };

const CARD = { x: 300, y: NEXT_LAYOUT.body.top, w: 1320, h: 470 };
const BOX = { x: CARD.x + 40, y: CARD.y + 30, w: CARD.w - 80, h: CARD.h - 60 };
/** Price swinging between two areas: the turns are the anchors. */
const TURNS: Anchor[] = [[0, 0.42], [0.12, 0.78], [0.25, 0.3], [0.4, 0.8], [0.55, 0.29], [0.7, 0.79], [0.85, 0.31], [1, 0.6]];
const N = 64;
const CLOSES = fromAnchors(TURNS, N, 3301, 0.02);
const BARS = toBars(CLOSES, 3302, 0.8);
const G = gridOf(CLOSES, [0.2, 0.9], BOX, 0.06);
const ZONE = { resistance: [0.76, 0.84], support: [0.25, 0.33] } as const;
/** The bars at the turns, where the rings land. */
const TOUCH = TURNS.slice(1, -1).map(([t]) => Math.round(t * (N - 1)));

const Scene = () => {
  const { f, at } = useNextClip();
  const c = usePalette();
  const m = useMotion();
  const shown = progressInOut(f, at(WORD.chart) + m.sec(0.2), m.sec(1.6));
  const zone = (k: number) => progressInOut(f, at(WORD.area) + m.sec(0.25) * k, m.reveal);
  const band = (lohi: readonly [number, number], tint: string, line: string, label: string, p: number, k: number) =>
    p > 0.001 ? (
      <div key={k} style={{ position: "absolute", left: BOX.x, top: G.y(lohi[1]), width: BOX.w * p, height: G.y(lohi[0]) - G.y(lohi[1]), background: tint, borderTop: `2px dashed ${line}`, borderBottom: `2px dashed ${line}`, borderRadius: 8 }}>
        <div style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontFamily: theme.text.family, fontSize: theme.text.tag.size, fontWeight: 800, color: line, opacity: p }}>{label}</div>
      </div>
    ) : null;
  return (
    <Stage>
      <GridGround f={f} />
      <NextVideoHead title="Support & Resistance" chipAt={at(0)} titleAt={at(WORD.title)} />
      <Panel rect={CARD} at={at(WORD.chart)} radius={theme.shape.cardRadius}>
        {band(ZONE.resistance, theme.color.indigoWash, c.indigo, "Resistance", zone(0), 0)}
        {band(ZONE.support, theme.color.cyanWash, c.cyan, "Support", zone(1), 1)}
        {f >= at(WORD.chart) && <Candles bars={BARS} grid={G} shown={shown} />}
        {TOUCH.map((i, k) => {
          const p = progressInOut(f, at(WORD.react) + m.sec(0.15) * k, m.pop);
          return <HighlightCircle key={i} cx={G.x(i)} cy={G.y(CLOSES[i])} r={30} land={p} width={theme.shape.line} />;
        })}
      </Panel>
    </Stage>
  );
};

const s = (sec: number) => Math.round(sec * 30);
export const NEXT_TA03: NextVideo = {
  vo: "vo/ta03-outro.mp3",
  seconds: CLIP.seconds,
  scene: <Scene />,
  cues: [
    { start: s(0), end: s(2.4), text: "Di video selanjutnya, kita akan bahas" },
    { start: s(2.46), end: s(4.3), text: "support dan resistance," },
    { start: s(4.38), end: s(6.9), text: "area di mana harga sering bereaksi." },
  ],
};
