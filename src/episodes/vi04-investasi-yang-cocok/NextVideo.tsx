/**
 * VI04 — the next-video ending, over "VO Penutup.mp3" (Simon, 22 Oct 2026: "Tambahkan ini setelah scene terakhir,
 * sebelum Outro"). Mounted by FullVideo.tsx through core/EpisodeWrap's `next` — the same ending the TA videos close
 * on (a 30-frame pause on the last frame, a camera cut in, then Outro.mp4), with core's head in its light VI look.
 * Storyboard: docs/vi-style/storyboards/VI04-Next-v2.jpg.
 *
 *   "Di video selanjutnya, kita akan bahas"            → "Video selanjutnya"
 *   "gimana perjalanan investasi …"                    → the title (the VO's own words; the next video's real
 *                                                         title to come from Simon)
 *   "… kita bisa berkembang"                           → SC06's four steps, rising, linked by one growing dash
 *   "dari waktu ke waktu."                             → the time axis under them
 *
 * Word times: faster-whisper on the clip (6.36 s). The file in public/vo is the same take, its level matched to the
 * episode VO (−15.8 vs −15.6 LUFS).
 */
import { Connector, NextVideoHead, SoftGround, Stage, progressInOut, theme, typeStyle, useMotion, useNextClip, usePalette } from "../../core";
import type { NextVideo } from "../../core";
import { Card, IsoIcon } from "./components/kit";

const CLIP = { seconds: 6.358 };
const WORD = { title: 3.1, grow: 3.68, rise: 4.74, time: 5.38 };

/** SC06's ladder — stable, index, equity, stock — as four steps rising to the right. */
const STEPS = ["stable", "index", "equity", "stock"];
const STEP = { size: 150, xs: [600, 840, 1080, 1320], ys: [790, 705, 620, 535] };
const AXIS = { y: 900, x0: 520, x1: 1420 };

const Scene = () => {
  const { f, at } = useNextClip();
  const c = usePalette();
  const m = useMotion();
  const axis = progressInOut(f, at(WORD.time), m.sec(0.8));
  return (
    <Stage>
      <SoftGround f={f} />
      <NextVideoHead title="Perjalanan investasi dari waktu ke waktu" chipAt={at(0)} titleAt={at(WORD.title)} light />
      {STEPS.slice(0, -1).map((_, i) => (
        <Connector key={i} a={{ x: STEP.xs[i] + STEP.size / 2, y: STEP.ys[i] }} b={{ x: STEP.xs[i + 1] - STEP.size / 2, y: STEP.ys[i + 1] }} p={progressInOut(f, at(WORD.grow) + m.sec(0.3) * (i + 1), m.sec(0.4))} shape="curve" dashed dot={false} />
      ))}
      {STEPS.map((s, i) => {
        const p = progressInOut(f, at(WORD.grow) + m.sec(0.3) * i, m.reveal);
        if (p <= 0.001) return null;
        return (
          <div key={s} style={{ position: "absolute", left: 0, top: 0, opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(2)}px)` }}>
            <Card x={STEP.xs[i] - STEP.size / 2} y={STEP.ys[i] - STEP.size / 2} w={STEP.size} h={STEP.size} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IsoIcon name={s} h={96} />
            </Card>
          </div>
        );
      })}
      {axis > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={AXIS.x0} y1={AXIS.y} x2={AXIS.x0 + (AXIS.x1 - AXIS.x0) * axis} y2={AXIS.y} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
          {axis > 0.95 ? <path d={`M ${AXIS.x1 - 12} ${AXIS.y - 9} L ${AXIS.x1} ${AXIS.y} L ${AXIS.x1 - 12} ${AXIS.y + 9}`} fill="none" stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: AXIS.x1 + 24, top: AXIS.y - 20, ...typeStyle("label"), lineHeight: "40px", color: c.slate, opacity: progressInOut(f, at(WORD.time) + m.sec(0.5), m.reveal) }}>waktu</div>
    </Stage>
  );
};

const s = (sec: number) => Math.round(sec * 60);
export const NEXT_VI04: NextVideo = {
  vo: "vo/vi04-outro.mp3",
  seconds: CLIP.seconds,
  scene: <Scene />,
  cues: [
    { start: s(0), end: s(2.56), text: "Di video selanjutnya, kita akan bahas" },
    { start: s(2.58), end: s(5.36), text: "gimana perjalanan investasi kita bisa berkembang" },
    { start: s(5.38), end: s(6.3), text: "dari waktu ke waktu." },
  ],
};
