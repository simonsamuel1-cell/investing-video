/**
 * Scene 12–13 — one continuous app capture (comp 3032–3382) in a phone template,
 * centred, with highlight boxes (blink twice), 25px wider than the phone each side:
 *   SINI + SULI (one box)  @ 3123 → 3226
 *   FWCT                   @ 3291 → 3378
 * Boxes are calibrated to where the scrolling capture shows each element.
 * Header owned by Step1Frame. Frame = scene-local (0 at comp 3032).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneFrame } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, blinkTwice } from "../helpers";

const H = 780;
const TOP = 160;
const CX = 960;
const END = 350; // comp 3382
const SCREEN_H = H - 12; // 768
const SCREEN_T = TOP + 6; // 166
const BODY_W = 404; // round((H-12)*980/1920) + 12

const wideBox = (fy0: number, fy1: number) => ({
  left: CX - BODY_W / 2 - 25,
  top: SCREEN_T + fy0 * SCREEN_H,
  width: BODY_W + 50,
  height: (fy1 - fy0) * SCREEN_H,
});

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${theme.colors.indigo}`, borderRadius: 8, opacity: op, boxSizing: "border-box" }} /> : null;

export const Scene12 = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 14), fadeOut(f, END - 14, 14));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PhoneFrame cx={CX} top={TOP} height={H} op={op} video="eventDriven/s12-13.mp4" />

      {/* box 3 — SINI + SULI (one box), comp 3123→3226 */}
      <Box b={wideBox(0.174, 0.539)} op={blinkTwice(f, 91, 194)} />
      {/* box 4 — FWCT, comp 3291→3378 */}
      <Box b={wideBox(0.663, 0.758)} op={blinkTwice(f, 259, 346)} />
    </AbsoluteFill>
  );
};
