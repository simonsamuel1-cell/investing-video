/**
 * Scene 10 — Screening routes (comp 2277–2801). Three real app captures in phone
 * templates, placed left→right in order, each appearing on its frame, each with a
 * highlight box:
 *   Watchlist   s10-watchlist.mp4    @ 2277 — box on the middle top-bar icon
 *   Event-Driven s10-eventdriven.mp4 @ 2493 — box on the tab row (wider than phone)
 *   Concept     s10-conceptsector.jpg@ 2646 — box on the Concept Sector (wider)
 * Header owned by Step1Frame. Frame = scene-local.
 */
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { PhoneFrame } from "../components";
import { theme } from "../theme";
import { fadeIn, blinkTwice } from "../helpers";

const H = 730;
const TOP = 224;
const SCREEN_W = 366; // round((H-12) * 980/1920)
const SCREEN_H = H - 12; // 718
const SCREEN_T = TOP + 6; // 230
const BODY_W = SCREEN_W + 12; // 378

// screen rect for a phone centred at cx
const scr = (cx: number) => ({ L: cx - SCREEN_W / 2, T: SCREEN_T, W: SCREEN_W, H: SCREEN_H });
// image-fraction box within a phone screen
const fbox = (cx: number, fx0: number, fx1: number, fy0: number, fy1: number) => {
  const r = scr(cx);
  return { left: r.L + fx0 * r.W, top: r.T + fy0 * r.H, width: (fx1 - fx0) * r.W, height: (fy1 - fy0) * r.H };
};
// box 10px wider than the phone body on each side, at a vertical fraction span
const wideBox = (cx: number, fy0: number, fy1: number) => ({
  left: cx - BODY_W / 2 - 10,
  top: SCREEN_T + fy0 * SCREEN_H,
  width: BODY_W + 20,
  height: (fy1 - fy0) * SCREEN_H,
});

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${theme.colors.indigo}`, borderRadius: 8, opacity: op, boxSizing: "border-box" }} /> : null;

const PhoneClip = ({ cx, video, img }: { cx: number; video?: string; img?: string }) => {
  const f = useCurrentFrame();
  return <PhoneFrame cx={cx} top={TOP} height={H} op={fadeIn(f, 0, 16)} video={video} img={img} />;
};

export const Scene10 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PhoneClip cx={532} video="eventDriven/s10-watchlist.mp4" />
      <Sequence from={216} layout="none">
        <PhoneClip cx={960} video="eventDriven/s10-eventdriven.mp4" />
      </Sequence>
      <Sequence from={369} layout="none">
        <PhoneClip cx={1388} img="eventDriven/s10-conceptsector.jpg" />
      </Sequence>

      {/* phone 1 — middle top-bar icon */}
      <Box b={fbox(532, 0.77, 0.89, 0.01, 0.065)} op={blinkTwice(f, 30, 524)} />
      {/* phone 2 — tab row, wider than phone */}
      <Box b={wideBox(960, 0.2, 0.25)} op={blinkTwice(f, 250, 524)} />
      {/* phone 3 — Concept Sector section, wider than phone */}
      <Box b={wideBox(1388, 0.24, 0.63)} op={blinkTwice(f, 400, 524)} />
    </AbsoluteFill>
  );
};
