/**
 * Proto-PaperShot — one shot in the paper-diorama style of Simon's Threads reference (21 Oct 2026: "coba bikin
 * prototype 1 shot dulu. gausa pake voice over"). Not an episode: a test of the technique.
 *
 * ⚠ NOTHING HERE IS FILMED OR 3D. Every layer is a flat image laid out on a 1920×1080 "world"; a virtual camera
 * (centre, zoom, roll) films it, and each layer follows that camera by its own depth factor — far layers less, near
 * layers more — which is what makes flat pictures read as a tabletop (parallax).
 *
 *   far   the desk plate (ChatGPT)                       depth 0.75, slightly blurred
 *   mid   the standee — cartoon body (ChatGPT) with Orang Tuntun's real face pasted on — and the paper props
 *   near  a coffee cup in the foreground                 depth 1.5, heavily blurred
 *
 *   A  0–4.5 s   the camera eases in on the standee; "HALO!" lands beside his head
 *   →  whip      0.33 s fast pan to the calendar, with REAL motion blur (@remotion/motion-blur averages sub-frames)
 *   B  to 6.5 s  close on the calendar; a red marker circle draws round the date
 *
 * Grain and a warm vignette sit over the frame, as on the reference.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { progressInOut, theme, useMotion } from "../../core";

export const PAPER_SHOT_FRAMES = 390;

const W = theme.canvas.width;
const H = theme.canvas.height;
const ART = (f: string) => staticFile(`art/proto-paper/${f}`);

/** The world: where each picture sits, in world pixels (the camera starts out seeing exactly 0..W × 0..H). */
const DESK = { x: -140, y: -250, w: 2200, h: 1467 };
const STANDEE = { x: 960, foot: 905, h: 760 };
/** Body image 637×1493; the photo head laid over its cartoon head (measured on the PNG). */
const BODY = { w: 637, h: 1493 };
const HEAD = { cx: 338, top: -34, w: 318, h: 403 };
const PROPS = {
  calendar: { x: 540, foot: 885, h: 340 },
  notes: { x: 1400, foot: 910, h: 220 },
  cup: { x: 1660, foot: 1200, h: 520 },
};
const DEPTH = { far: 0.75, mid: 1, near: 1.5 };

/** Camera keys: centre (world px), zoom, roll (deg). */
type Cam = { x: number; y: number; z: number; r: number };
const SHOT_A = { at: 0, from: { x: 960, y: 560, z: 1.12, r: -0.6 }, to: { x: 990, y: 520, z: 1.28, r: 0.3 } };
const WHIP = { at: 270, over: 20 };
const SHOT_B = { from: { x: 575, y: 700, z: 1.95, r: 0.8 }, to: { x: 562, y: 694, z: 2.05, r: 0.2 } };
const STICKER = { at: 70, x: 1270, y: 250, rot: -7, text: "HALO!" };
const MARKER = { at: WHIP.at + WHIP.over + 18, cx: 580, cy: 770, rx: 64, ry: 54 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t), r: lerp(a.r, b.r, t) });

/** Where the camera is on frame `f` (fractional during motion-blur sub-frames). */
const cameraAt = (f: number): Cam => {
  const end = WHIP.at + WHIP.over;
  let c: Cam;
  if (f < WHIP.at) {
    c = lerpCam(SHOT_A.from, SHOT_A.to, progressInOut(f, SHOT_A.at, WHIP.at - SHOT_A.at));
  } else if (f < end) {
    c = lerpCam(SHOT_A.to, SHOT_B.from, progressInOut(f, WHIP.at, WHIP.over));
  } else {
    c = lerpCam(SHOT_B.from, SHOT_B.to, progressInOut(f, end, PAPER_SHOT_FRAMES - end));
  }
  /** A hand holding the camera: two slow sines, a few pixels. */
  return { ...c, x: c.x + 3 * Math.sin(f / 37), y: c.y + 2.2 * Math.sin(f / 53 + 1), r: c.r + 0.12 * Math.sin(f / 61) };
};

/** One depth layer: follows the camera by `k`. */
const Layer = ({ cam, k, blur = 0, children }: { cam: Cam; k: number; blur?: number; children: React.ReactNode }) => {
  const z = 1 + (cam.z - 1) * k;
  const cx = W / 2 + (cam.x - W / 2) * k;
  const cy = H / 2 + (cam.y - H / 2) * k;
  return (
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) rotate(${(cam.r * k).toFixed(3)}deg) scale(${z.toFixed(4)}) translate(${-cx}px, ${-cy}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/** A paper standee standing on the desk at (x, foot): its cast shadow (light from the window, left), a contact
 *  shadow, and a small wobble round its feet. */
const Standee = ({ src, x, foot, h, aspect, wobble = 0, children }: { src: string; x: number; foot: number; h: number; aspect: number; wobble?: number; children?: React.ReactNode }) => {
  const w = h * aspect;
  return (
    <>
      <Img src={src} style={{ position: "absolute", left: x - w / 2, top: foot - h, width: w, height: h, maxWidth: "none", filter: "brightness(0) blur(7px)", opacity: 0.32, transformOrigin: "50% 100%", transform: "skewX(-48deg) scaleY(0.3)" }} />
      <div style={{ position: "absolute", left: x - w * 0.42, top: foot - 16, width: w * 0.84, height: 30, borderRadius: "50%", background: `radial-gradient(closest-side, ${theme.color.paperContact}, transparent)` }} />
      <div style={{ position: "absolute", left: x - w / 2, top: foot - h, width: w, height: h, transformOrigin: "50% 100%", transform: `rotate(${wobble.toFixed(3)}deg)` }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, maxWidth: "none" }} />
        {children}
      </div>
    </>
  );
};

/** A comic sticker word: yellow, dark ink outline, white paper edge, a hard offset shadow. */
const Sticker = ({ text, p }: { text: string; p: number }) => {
  if (p <= 0.001) return null;
  const size = 120;
  const common = { x: 20, y: size, fontFamily: theme.text.family, fontSize: size, fontWeight: 800, letterSpacing: -2 } as const;
  return (
    <svg width={460} height={170} style={{ position: "absolute", left: -230, top: -100, overflow: "visible", opacity: Math.min(1, p * 2), transform: `scale(${(0.55 + 0.45 * p).toFixed(3)}) rotate(${((1 - p) * -10).toFixed(2)}deg)` }}>
      <text {...common} transform="translate(7 8)" fill={theme.color.stickerInk} stroke={theme.color.stickerInk} strokeWidth={30} strokeLinejoin="round">{text}</text>
      <text {...common} fill="white" stroke="white" strokeWidth={30} strokeLinejoin="round">{text}</text>
      <text {...common} fill={theme.color.stickerFill} stroke={theme.color.stickerInk} strokeWidth={12} strokeLinejoin="round" paintOrder="stroke">{text}</text>
    </svg>
  );
};

const World = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const cam = cameraAt(f);
  const sticker = progressInOut(f, STICKER.at, m.sec(0.25));
  const marker = progressInOut(f, MARKER.at, m.sec(0.6));
  const ellipse = (rx: number, ry: number, rot: number) =>
    `M ${MARKER.cx + rx} ${MARKER.cy} A ${rx} ${ry} ${rot} 1 1 ${MARKER.cx - rx} ${MARKER.cy} A ${rx} ${ry} ${rot} 1 1 ${MARKER.cx + rx * 0.94} ${MARKER.cy - ry * 0.25}`;
  return (
    <AbsoluteFill style={{ background: theme.color.stickerInk, overflow: "hidden" }}>
      <Layer cam={cam} k={DEPTH.far} blur={2.2}>
        <Img src={ART("desk.png")} style={{ position: "absolute", left: DESK.x, top: DESK.y, width: DESK.w, height: DESK.h, maxWidth: "none" }} />
      </Layer>
      <Layer cam={cam} k={DEPTH.mid}>
        <Standee src={ART("calendar.png")} {...PROPS.calendar} aspect={PROPS_ASPECT.calendar} />
        <Standee src={ART("notes.png")} {...PROPS.notes} aspect={PROPS_ASPECT.notes} />
        <Standee src={ART("body.png")} x={STANDEE.x} foot={STANDEE.foot} h={STANDEE.h} aspect={BODY.w / BODY.h} wobble={0.7 * Math.sin(f / 45)}>
          {(() => {
            const k = STANDEE.h / BODY.h;
            return <Img src={ART("head.png")} style={{ position: "absolute", left: (HEAD.cx - HEAD.w / 2) * k, top: HEAD.top * k, width: HEAD.w * k, height: HEAD.h * k, maxWidth: "none" }} />;
          })()}
        </Standee>
        <div style={{ position: "absolute", left: STICKER.x, top: STICKER.y, transform: `rotate(${STICKER.rot}deg)` }}>
          <Sticker text={STICKER.text} p={sticker} />
        </div>
        {marker > 0.001 && (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={ellipse(MARKER.rx, MARKER.ry, -8)} pathLength={1} fill="none" stroke={theme.color.calendarRed} strokeWidth={7} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - marker} />
          </svg>
        )}
      </Layer>
      <Layer cam={cam} k={DEPTH.near} blur={9}>
        <Standee src={ART("cup.png")} {...PROPS.cup} aspect={PROPS_ASPECT.cup} />
      </Layer>
    </AbsoluteFill>
  );
};

/** Measured off the prop PNGs (width / height). */
const PROPS_ASPECT = { calendar: 655 / 618, notes: 599 / 513, cup: 528 / 670 };

/** Film grain (a fresh seed each frame) and a warm vignette. */
const Lens = () => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="proto-grain">
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={f % 9} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#proto-grain)" />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent 55%, ${theme.color.paperVignette} 100%)` }} />
    </>
  );
};

export const PaperShot = () => {
  const f = useCurrentFrame();
  const whipping = f >= WHIP.at - 2 && f <= WHIP.at + WHIP.over + 2;
  return (
    <AbsoluteFill>
      {whipping ? (
        <CameraMotionBlur shutterAngle={200} samples={12}>
          <World />
        </CameraMotionBlur>
      ) : (
        <World />
      )}
      <Lens />
    </AbsoluteFill>
  );
};
