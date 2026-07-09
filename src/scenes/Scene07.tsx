import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";

// Scene 07 (comp 4249–4939, local = comp − 4249).
// Continues Scene 06's phone (BBCA chart, left) → slides it to centre, highlights
// "Reference Fair Value", cross-fades the screen to the Deep Research view,
// highlights the Deep Research section, then the phone slides back left while
// Research.jpg appears on the right.

const PHONE_WIDTH = 340;
const PHONE_TOP = 144.5; // matches Scene 06 (safe-area vertical centre)
const CX_LEFT = 570; // Scene 06 phone centre-x
const CX_CENTER = 960;
const HALF = PHONE_WIDTH / 2; // 170
const BAND_W = PHONE_WIDTH + 50; // 25px past the phone on each side

const EASE = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene07: React.FC = () => {
  const frame = useCurrentFrame();

  // Phone horizontal position: centre-x. Slide in (0→18), hold, slide back (205→223).
  const moveIn = interpolate(frame, [0, 18], [CX_LEFT, CX_CENTER], { ...clamp, easing: EASE });
  const moveOut = interpolate(frame, [205, 223], [0, CX_CENTER - CX_LEFT], { ...clamp, easing: EASE });
  const phoneCx = moveIn - moveOut;
  const phoneLeft = phoneCx - HALF;

  // Screen cross-fade: BBCA chart → Deep Research at local 97.
  const deepOp = interpolate(frame, [97, 112], [0, 1], { ...clamp, easing: EASE });

  // Highlight 1 — "Reference Fair Value" (steady): in at 4265, out as screen changes.
  const rfvOp = Math.min(
    interpolate(frame, [16, 31], [0, 1], clamp),
    interpolate(frame, [90, 104], [1, 0], clamp)
  );
  // Highlight 2 — "Deep Research" + "View BBCA Deep Research": two blinks, ends. (4397)
  const drOp = interpolate(frame, [148, 154, 160, 166, 172], [0, 1, 0, 1, 0], clamp);

  // Research.jpg (right side) appears as the phone slides back left (205→223).
  const researchOp = interpolate(frame, [205, 223], [0, 1], { ...clamp, easing: EASE });
  const RES_W = 376;
  const RES_H = 737;

  const band = (top: number, height: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: phoneCx - BAND_W / 2,
        top,
        width: BAND_W,
        height,
        border: "3px solid #5F4DEE",
        borderRadius: 10,
        background: "rgba(95,77,238,0.10)",
        opacity,
        boxSizing: "border-box",
      }}
    />
  );

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", background: "#F5F5F5", fontFamily: "Plus Jakarta Sans" }}>
      {/* Phone with cross-fading screen */}
      <div style={{ position: "absolute", left: phoneLeft, top: PHONE_TOP }}>
        <PhoneFrame width={PHONE_WIDTH}>
          <Img src={staticFile("Scene_05_06_-_BBCA_Chart.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          {/* Deep Research: full screenshot (no crop) on a white fill, fades in */}
          <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: deepOp }}>
            <Img src={staticFile("Deep_Research.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} />
          </div>
        </PhoneFrame>
      </div>

      {/* Research.jpg — right of the phone, rounded corners (no device frame) */}
      <div
        style={{
          position: "absolute",
          left: 1094,
          top: PHONE_TOP,
          width: RES_W,
          height: RES_H,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          opacity: researchOp,
        }}
      >
        <Img src={staticFile("Research.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>

      {/* Highlights (rendered above the phone) */}
      {rfvOp > 0.01 && band(672, 82, rfvOp)}
      {drOp > 0.01 && band(616, 86, drOp)}
    </div>
  );
};
