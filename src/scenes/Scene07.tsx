import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";

// Scene 07 (comp 4249–4939, local = comp − 4249).
// Continues Scene 06's phone (BBCA chart, left) → slides it to centre, highlights
// "Reference Fair Value", cross-fades the screen to the Deep Research view,
// highlights the Deep Research section, then the phone slides back left while
// Research.jpg appears on the right.
// Then a "zoom tour" of Research.jpg: the clip window grows to 1120×630 centred
// (phone hidden) and the camera pans/zooms across three regions —
// Investment Thesis → Tuntun Valuation → Company Highlight — before returning.

const PHONE_WIDTH = 340;
const PHONE_TOP = 144.5; // matches Scene 06 (safe-area vertical centre)
const CX_LEFT = 570; // Scene 06 phone centre-x
const CX_CENTER = 960;
const HALF = PHONE_WIDTH / 2; // 170
const BAND_W = PHONE_WIDTH + 50; // 25px past the phone on each side

const EASE = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// --- Zoom-tour geometry ------------------------------------------------------
// Research.jpg native size, the enlarged clip window, and the three target
// regions (in image space). `cam` returns the scale + region centre needed to
// frame a region inside the 1120×630 window with a little margin.
const RES_IMG_W = 980;
const RES_IMG_H = 1920;
const MASK_BW = 1120;
const MASK_BH = 630;
const FILL = 0.9;
const cam = (x: number, y: number, w: number, h: number) => ({
  s: Math.min(MASK_BW / w, MASK_BH / h) * FILL,
  cx: x + w / 2,
  cy: y + h / 2,
});
// Investment Thesis is a tall/narrow left-column block; frame it to fill the
// column (shifted left) so the right column doesn't peek into the wide window.
const REG_IT = { s: 1.83, cx: 295, cy: 572 };
const REG_TV = cam(605, 452, 318, 140); // Tuntun Valuation table (right column)
const REG_CH = cam(605, 598, 318, 182); // Company Highlight table (right column)
// State A = whole page in the small 376-wide box (aspect-matched → shows full page)
const CAM_A = { s: 376 / RES_IMG_W, cx: RES_IMG_W / 2, cy: RES_IMG_H / 2 };

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

  // --- Zoom tour (local frames; comp − 4249) --------------------------------
  // 279 (4528) grow window + move to centre → 288 (4537) Investment Thesis →
  // 368 (4617) Tuntun Valuation → 476 (4725) Company Highlight → 536 (4785) back.
  const TE = { ...clamp, easing: Easing.inOut(Easing.cubic) } as const;
  const maskW = interpolate(frame, [279, 288, 512, 536], [376, MASK_BW, MASK_BW, 376], TE);
  const maskH = interpolate(frame, [279, 288, 512, 536], [737, MASK_BH, MASK_BH, 737], TE);
  const maskL = interpolate(frame, [279, 288, 512, 536], [1094, 400, 400, 1094], TE);
  const maskT = interpolate(frame, [279, 288, 512, 536], [PHONE_TOP, 225, 225, PHONE_TOP], TE);

  const CT = [279, 288, 348, 368, 456, 476, 512, 536];
  const camS = interpolate(frame, CT, [CAM_A.s, REG_IT.s, REG_IT.s, REG_TV.s, REG_TV.s, REG_CH.s, REG_CH.s, CAM_A.s], TE);
  const camCx = interpolate(frame, CT, [CAM_A.cx, REG_IT.cx, REG_IT.cx, REG_TV.cx, REG_TV.cx, REG_CH.cx, REG_CH.cx, CAM_A.cx], TE);
  const camCy = interpolate(frame, CT, [CAM_A.cy, REG_IT.cy, REG_IT.cy, REG_TV.cy, REG_TV.cy, REG_CH.cy, REG_CH.cy, CAM_A.cy], TE);

  const imgW = RES_IMG_W * camS;
  const imgH = RES_IMG_H * camS;
  const imgL = maskW / 2 - camCx * camS;
  const imgT = maskH / 2 - camCy * camS;

  // Phone hidden during the tour (fades out as the window grows, back in on return).
  const phoneVis = interpolate(frame, [279, 288, 520, 534], [1, 0, 0, 1], clamp);
  // All visuals fade out at 4935 (local 686).
  const sceneFade = interpolate(frame, [672, 686], [1, 0], clamp);

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
      <div style={{ position: "absolute", left: phoneLeft, top: PHONE_TOP, opacity: phoneVis * sceneFade }}>
        <PhoneFrame width={PHONE_WIDTH}>
          <Img src={staticFile("Scene_05_06_-_BBCA_Chart.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          {/* Deep Research: full screenshot (no crop) on a white fill, fades in */}
          <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: deepOp }}>
            <Img src={staticFile("Deep_Research.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} />
          </div>
        </PhoneFrame>
      </div>

      {/* Research.jpg — clip window (right box → 1120×630 centre for the zoom tour) */}
      <div
        style={{
          position: "absolute",
          left: maskL,
          top: maskT,
          width: maskW,
          height: maskH,
          borderRadius: 24,
          overflow: "hidden",
          background: "#FFFFFF",
          boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
          opacity: researchOp * sceneFade,
        }}
      >
        <Img src={staticFile("Research.jpg")} style={{ position: "absolute", left: imgL, top: imgT, width: imgW, height: imgH, maxWidth: "none" }} />
      </div>

      {/* Highlights (rendered above the phone) */}
      {rfvOp > 0.01 && band(672, 82, rfvOp)}
      {drOp > 0.01 && band(616, 86, drOp)}
    </div>
  );
};
