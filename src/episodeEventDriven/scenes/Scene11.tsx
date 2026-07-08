/**
 * Scene 11 — From signal to stock (comp 2801–3032). Two app captures in phone
 * templates, side by side, each with a highlight box (blinks twice):
 *   Bullish Signal (sector list) s11-bullish.jpg @ 2846 — box on Distributor +
 *     Equipment Ma… rows
 *   HEAL (the stock)             s11-heal.jpg    @ 2943 — box on the HEAL row
 * Boxes are 25px wider than the phone on each side. Both fade out by 3032.
 * Header owned by Step1Frame. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneFrame } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, blinkTwice } from "../helpers";

const H = 760;
const TOP = 180;
const SCREEN_H = H - 12; // 748
const SCREEN_T = TOP + 6; // 186
const BODY_W = 394; // round((H-12)*980/1920) + 12
const BULLISH_IN = 45; // comp 2846
const HEAL_IN = 142; // comp 2943
const END = 231; // comp 3032

// box 25px wider than the phone body on each side, at a vertical fraction span
const wideBox = (cx: number, fy0: number, fy1: number) => ({
  left: cx - BODY_W / 2 - 25,
  top: SCREEN_T + fy0 * SCREEN_H,
  width: BODY_W + 50,
  height: (fy1 - fy0) * SCREEN_H,
});

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${theme.colors.indigo}`, borderRadius: 8, opacity: op, boxSizing: "border-box" }} /> : null;

export const Scene11 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, END - 14, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PhoneFrame cx={713} top={TOP} height={H} op={Math.min(fadeIn(f, BULLISH_IN, 16), out)} img="eventDriven/s11-bullish.jpg" />
      <PhoneFrame cx={1207} top={TOP} height={H} op={Math.min(fadeIn(f, HEAL_IN, 16), out)} img="eventDriven/s11-heal.jpg" />

      {/* box 1 — Distributor + Equipment Ma… rows (left phone) */}
      <Box b={wideBox(713, 0.548, 0.658)} op={blinkTwice(f, BULLISH_IN, END)} />
      {/* box 2 — HEAL row (right phone) */}
      <Box b={wideBox(1207, 0.29, 0.39)} op={blinkTwice(f, 148, END)} />
    </AbsoluteFill>
  );
};
