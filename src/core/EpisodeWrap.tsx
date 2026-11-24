/**
 * core/EpisodeWrap.tsx — the finished-video wrapper every VI episode shares: Intro (Essentials/Intro.mp4 with
 * the two title lines), the episode, a half-second fade-out to the paper colour, Outro, and the BGM under all.
 *
 * Lifted from IN01's FullVideo.tsx so IN03 on don't copy it. The episode keeps its own frame numbers; it is
 * simply mounted after the intro (4 s: 240 frames at 60fps, 120 at 30fps — the TA videos before TA09 are 30fps).
 *
 * `next` (Simon, 20 Oct 2026, the TA endings "sama seperti di TA09"): after the episode's last frame, a 30-frame
 * pause on that frame, a camera cut into the next-video scene while the outro clip plays (core/NextVideo.tsx), one
 * second held, the fade, then Outro.mp4. `cta` puts CTA.mp4 between that fade and Outro.mp4.
 *
 * ⚠ THE BGM AND THE LOGO ARE UNTOUCHABLE (Simon): public/essentials/BGM.mp3 is a byte-for-byte copy of
 * Simon's BGM — no trim, gain, fade, loop or re-encode; it plays from frame 0 and stops where the video ends.
 * `bgmSrc` puts an episode's own bed there instead, when Simon asks for one (IN04, 3 Nov 2026: his "Background
 * Music.mp3" looped and levelled by scripts/vi/bgm-loop.py, longer than any video): it plays from frame 0 and is
 * faded out over the video's last BGM_FADE seconds, so it never stops dead. Essentials/BGM.mp3 is not touched.
 */
import React from "react";
import { LockedSequence as Sequence } from "./nudge";
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Cue } from "./Captions";
import { Captions } from "./Captions";
import { cutInStyle, cutOutStyle } from "./CameraCut";
import type { Cut } from "./CameraCut";
import { progressInOut } from "./helpers";
import { QUOTE } from "./QuoteCard";
import { NextClipProvider } from "./NextVideo";
import { PaletteProvider, usePalette } from "./palette";
import { theme } from "./theme";
import { useMotion } from "./useMotion";

/** Intro.mp4 — 4.000 s at 60 fps. */
export const INTRO_FRAMES = 240;
/** Outro.mp4 — 3.983 s at 60 fps. */
export const OUTRO_FRAMES = 239;
/** The same two clips at any fps. */
export const introFrames = (fps: number) => Math.round(4 * fps);
export const outroFrames = (fps: number) => Math.round(3.983 * fps);
/**
 * CTA.mp4 — the Chart Pro promo, 86.217 s at 60fps, with its own voice, subtitles and logo (Simon, 20 Oct 2026: "Untuk
 * semua video ini, kamu harus tambahkan CTA.mp4 … setelah voice over outro, kamu fade out, lalu masukkan video ini. Lalu
 * tutup dengan Outro original nya"). Floored, so a 30fps cut never asks for a frame past its end.
 */
export const ctaFrames = (fps: number) => Math.floor(86.216 * fps);

/** The next-video ending: the clip (public/ path), its length, the scene shown over it, and its subtitles in frames
 *  from the clip's first frame. */
export type NextVideo = { vo: string; seconds: number; scene: React.ReactNode; cues?: Cue[] };
/** Simon, for TA09: "Kasih jeda dulu 30 frame". */
export const NEXT_PAUSE = 30;
const NEXT_HOLD_SECS = 1;
const NEXT_CUT_SECS = 0.4;
/** An episode's own bed (`bgmSrc`) fades out over the video's last seconds. */
const BGM_FADE = 2;
const nextTail = (next: NextVideo, fps: number) => NEXT_PAUSE + Math.round(next.seconds * fps) + Math.round(NEXT_HOLD_SECS * fps);

/**
 * The Intro's two title lines (series over episode), after MovingAverageIntro.mp4: centred, revealed left to
 * right behind a soft edge, the second line 12 frames behind the first — measured off that video.
 */
const TITLE = { starts: [71, 83], span: 26, y: [698, 764], size: 56, weight: 600, soft: 28, leading: 1.4 };
/** The intro title's type size, for an episode that sets a line relative to it (`titleStyle`). */
export const INTRO_TITLE = { size: TITLE.size, weight: TITLE.weight };
/**
 * An episode's own look for its two title lines, laid over the shared one (VI03, Simon 19 Nov: "Value Investingnya buat all
 * caps dan bold", the subtitle 6 px lower, both in Montserrat at 44 px). Type — face, size, weight, style, case, spacing — and `dy`, a line's shift
 * down from its place in px.
 */
export type IntroTitleStyle = Pick<React.CSSProperties, "fontSize" | "fontWeight" | "fontStyle" | "textTransform" | "letterSpacing" | "fontFamily"> & {
  dy?: number;
  /** the line's colour, a palette slot: indigo (default) or ink (VI03, Simon 19 Nov: "ketiganya jadi warna hitam") */
  tone?: "indigo" | "ink" | "cyan";
  /** a short rule each side of the line, `length` long, `gap` off the type (VI03: "di kiri dan kanan value investing di kasih
   *  garis 30 px") */
  rule?: { length: number; gap: number; thickness: number };
};

/** a line's type, without its `dy` */
const typeOf = (st?: IntroTitleStyle): React.CSSProperties => {
  if (!st) return {};
  const { dy: _dy, rule: _rule, tone: _tone, ...type } = st;
  return type;
};

/**
 * An optional text box behind the two lines, in the quote card's look (VI03, Simon 19 Nov: "kalo di kasih textbox kayak di
 * 2660"): white, a black border, a solid indigo block down and right; `w` × `h`, centred on the two lines; it fades in with
 * the first line's reveal.
 */
export type IntroTitleBox = { w: number; h: number };
const TitleBox = ({ box, p }: { box: IntroTitleBox; p: number }) => {
  const c = usePalette();
  const cy = (TITLE.y[0] + TITLE.y[1]) / 2;
  const shell = { position: "absolute" as const, left: theme.canvas.width / 2 - box.w / 2, top: cy - box.h / 2, width: box.w, height: box.h, borderRadius: theme.shape.panelRadius };
  return p > 0.001 ? (
    <div style={{ position: "absolute", inset: 0, opacity: p }}>
      <div style={{ ...shell, left: shell.left + QUOTE.drop, top: shell.top + QUOTE.drop, background: c.indigo }} />
      <div style={{ ...shell, background: c.cardBg, border: `${QUOTE.border}px solid ${c.ink}`, boxSizing: "border-box" }} />
    </div>
  ) : null;
};

const IntroTitle = ({ lines, styles, box }: { lines: [string, string]; styles?: [IntroTitleStyle?, IntroTitleStyle?]; box?: IntroTitleBox }) => {
  const { fps } = useVideoConfig();
  /** TITLE is measured in 60fps frames. */
  const f = useCurrentFrame() * (60 / fps);
  const c = usePalette();
  return (
    <>
      {box ? <TitleBox box={box} p={progressInOut(f, TITLE.starts[0] - 12, TITLE.span)} /> : null}
      {lines.map((text, i) => {
        const p = progressInOut(f, TITLE.starts[i], TITLE.span);
        if (p <= 0.001) return null;
        const edge = p * (100 + TITLE.soft);
        const mask = `linear-gradient(to right, black ${(edge - TITLE.soft).toFixed(2)}%, transparent ${edge.toFixed(2)}%)`;
        return (
          <div key={text} style={{ position: "absolute", left: 0, width: theme.canvas.width, top: TITLE.y[i] + (styles?.[i]?.dy ?? 0) - (TITLE.size * TITLE.leading) / 2, height: TITLE.size * TITLE.leading, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ fontFamily: theme.text.family, fontSize: TITLE.size, fontWeight: TITLE.weight, lineHeight: TITLE.leading, color: c[styles?.[i]?.tone ?? "indigo"], whiteSpace: "nowrap", ...typeOf(styles?.[i]), WebkitMaskImage: mask, maskImage: mask, display: "inline-flex", alignItems: "center", gap: styles?.[i]?.rule?.gap ?? 0 }}>
              {styles?.[i]?.rule ? <span style={{ width: styles[i]!.rule!.length, height: styles[i]!.rule!.thickness, borderRadius: styles[i]!.rule!.thickness, background: "currentColor", flex: "none" }} /> : null}
              {/* letter-spacing also follows the last letter: taken back so the text stays centred between its rules */}
              <span style={{ marginRight: styles?.[i]?.letterSpacing ? `-${styles[i]!.letterSpacing}` : undefined }}>{text}</span>
              {styles?.[i]?.rule ? <span style={{ width: styles[i]!.rule!.length, height: styles[i]!.rule!.thickness, borderRadius: styles[i]!.rule!.thickness, background: "currentColor", flex: "none" }} /> : null}
            </span>
          </div>
        );
      })}
    </>
  );
};

const FADE_OUT_SECS = 0.5;

/** The logo over the ending: solid from its first frame, fading with the episode's last half-second. */
const EndingLogo = ({ frames }: { frames: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const o = 1 - progressInOut(f, frames - m.sec(FADE_OUT_SECS), m.sec(FADE_OUT_SECS));
  return (
    <AbsoluteFill style={{ zIndex: 100, opacity: o }}>
      <Img showInTimeline={false} src={staticFile("watermark.png")} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
const EpisodeFade = ({ frames, to }: { frames: number; to?: string }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const o = progressInOut(f, frames - m.sec(FADE_OUT_SECS), m.sec(FADE_OUT_SECS));
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: to ?? c.bg, opacity: o }} />;
};

export const fullFrames = (
  episodeFrames: number,
  fps: number,
  extra: { next?: NextVideo; cta?: boolean; intro?: boolean; outro?: boolean } = {},
) =>
  (extra.intro === false ? 0 : introFrames(fps)) +
  episodeFrames +
  (extra.next ? nextTail(extra.next, fps) : 0) +
  (extra.cta ? ctaFrames(fps) : 0) +
  (extra.outro === false ? 0 : outroFrames(fps));

/** Cut a picture in or out on `cut`; `from` = the global frame this Sequence starts on. */
/**
 * The incoming half of a cut is shown only from the cut's midpoint on (as every cut inside an episode is: its scene's
 * Sequence starts there). Before it the next-video scene is mounted — its clocks run from `nextFrom` — but not seen,
 * so the frozen last frame stays on screen through the first half of the move instead of vanishing under the next
 * scene's paper on the move's first frame (Simon, 3 Nov 2026: "dari scene terakhir ke scene 'video selanjutnya' tuh
 * kayak ga smooth"). `at` is local to the enclosing Sequence.
 */
const FromMidpoint = ({ at, children }: { at: number; children: React.ReactNode }) => <AbsoluteFill style={{ opacity: useCurrentFrame() >= at ? 1 : 0 }}>{children}</AbsoluteFill>;

/** The paper under the ending's cut, so the frozen frame moving aside never shows the black behind it. */
const Paper = () => <AbsoluteFill style={{ background: usePalette().bg }} />;

const CutLayer = ({ cut, from, dir, children }: { cut: Cut; from: number; dir: "in" | "out"; children: React.ReactNode }) => {
  const g = useCurrentFrame() + from;
  /** No transform at all outside the move: the episode under it renders exactly as it does on its own. */
  const moving = g >= cut.at - cut.over / 2 && g < cut.at + cut.over / 2;
  return <AbsoluteFill style={moving ? (dir === "in" ? cutInStyle(g, cut) : cutOutStyle(g, cut)) : undefined}>{children}</AbsoluteFill>;
};

/**
 * `bgm={false}` leaves the BGM out altogether (TA09, 20 Oct: Simon asked for the intro and the outro, not the BGM).
 * `bgmGainDb` turns an episode's own bed (`bgmSrc`) up or down by that many dB as it plays (VI03, 17 Nov: "bgm nya turunin
 * 10 db … peaknya"); the file is not touched and nor is any other episode's level. It never applies to Essentials/BGM.mp3.
 * It never changes the BGM itself — the file plays as it is, or not at all.
 */
/**
 * `intro={false}` / `outro={false}` leave either clip out (TA11, 20 Oct 2026: "kasih video CTA aja" — the episode,
 * its fade, CTA.mp4, and nothing else).
 */
export const EpisodeWrap = ({ title, titleStyle, titleBox, frames, name, bgm = true, bgmSrc, bgmGainDb = 0, next, cta = false, intro = true, outro = true, children }: { title?: [string, string]; titleStyle?: [IntroTitleStyle?, IntroTitleStyle?]; titleBox?: IntroTitleBox; frames: number; name: string; bgm?: boolean; bgmSrc?: string; bgmGainDb?: number; next?: NextVideo; cta?: boolean; intro?: boolean; outro?: boolean; children: React.ReactNode }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const I = intro ? introFrames(fps) : 0;
  const O = outro ? outroFrames(fps) : 0;
  const tail = next ? nextTail(next, fps) : 0;
  const half = Math.round((NEXT_CUT_SECS * fps) / 2);
  /** The global frame the outro clip starts on, and the cut lands on. */
  const clipAt = I + frames + NEXT_PAUSE;
  const cut: Cut = { at: clipAt, over: 2 * half, distance: 90, blur: 10, axis: "x" };
  const nextFrom = clipAt - half;
  const nextDur = I + frames + tail - nextFrom;
  const C = cta ? ctaFrames(fps) : 0;
  /** The fade ends on what comes next: the Outro's own grey when the Outro follows straight on. */
  const fadeTo = outro && !cta ? theme.color.outroGround : undefined;
  return (
    <AbsoluteFill>
      {intro ? (
        <Sequence from={0} durationInFrames={I} name="Intro">
          <OffthreadVideo showInTimeline={false} src={staticFile("essentials/Intro.mp4")} />
          {title ? (
            <PaletteProvider>
              <IntroTitle lines={title} styles={titleStyle} box={titleBox} />
            </PaletteProvider>
          ) : null}
        </Sequence>
      ) : null}
      {next ? (
        <>
          {/* ⚠ THE EPISODE RUNS ON PAST ITS END, FROZEN ON ITS LAST FRAME, then cuts away. The Freeze sits at the top
              level on purpose: inside a later Sequence, Remotion adds that Sequence's start to the frozen frame,
              the sum runs past the composition's length and is clamped — and the pause showed a frame from the
              first minute instead. */}
          <Sequence from={I + frames} durationInFrames={tail} name="Paper · ending" layout="none">
            <PaletteProvider>
              <Paper />
            </PaletteProvider>
          </Sequence>
          <CutLayer cut={cut} from={0} dir="out">
            <Freeze frame={I + frames - 1} active={(f) => f >= I + frames}>
              <Sequence from={I} durationInFrames={frames + NEXT_PAUSE + half} name={name}>
                {children}
              </Sequence>
            </Freeze>
          </CutLayer>
          {/* ⚠ THE LOGO STAYS PUT through the pause and the ending. The episodes fade their own logo out on their
              last frames, so the frozen frame carries a faded one; this one takes over half a second before the
              end (laid over the episode's while that is still solid) and leaves with the final fade. */}
          <Sequence from={I + frames - Math.round(0.5 * fps)} durationInFrames={Math.round(0.5 * fps) + tail} name="Logo · ending">
            <EndingLogo frames={Math.round(0.5 * fps) + tail} />
          </Sequence>
          {/* the next video, over the outro clip */}
          <Sequence from={nextFrom} durationInFrames={nextDur} name="Next video">
            <PaletteProvider>
              <FromMidpoint at={half}>
                <CutLayer cut={cut} from={nextFrom} dir="in">
                  <NextClipProvider value={{ lead: half }}>{next.scene}</NextClipProvider>
                </CutLayer>
              </FromMidpoint>
              <Sequence from={half} durationInFrames={Math.round(next.seconds * fps)} name="Outro clip">
                <Audio src={staticFile(next.vo)} />
              </Sequence>
              {next.cues ? (
                <Sequence from={half} name="Outro subtitles">
                  <Captions cues={next.cues} />
                </Sequence>
              ) : null}
              <EpisodeFade frames={nextDur} to={fadeTo} />
            </PaletteProvider>
          </Sequence>
        </>
      ) : (
        <Sequence from={I} durationInFrames={frames} name={name}>
          {children}
          <PaletteProvider>
            <EpisodeFade frames={frames} to={fadeTo} />
          </PaletteProvider>
        </Sequence>
      )}
      {cta ? (
        <Sequence from={I + frames + tail} durationInFrames={C} name="CTA">
          <OffthreadVideo showInTimeline={false} src={staticFile("essentials/CTA.mp4")} />
        </Sequence>
      ) : null}
      {outro ? (
        <Sequence from={I + frames + tail + C} durationInFrames={O} name="Outro">
          <OffthreadVideo showInTimeline={false} src={staticFile("essentials/Outro.mp4")} />
        </Sequence>
      ) : null}
      {/* the BGM, as it is, under all of it — or the episode's own bed, faded out at the very end */}
      {bgm && bgmSrc ? (
        <Audio src={staticFile(bgmSrc)} volume={(f) => 10 ** (bgmGainDb / 20) * interpolate(f, [durationInFrames - Math.round(BGM_FADE * fps), durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      ) : bgm ? (
        <Audio src={staticFile("essentials/BGM.mp3")} />
      ) : null}
    </AbsoluteFill>
  );
};
