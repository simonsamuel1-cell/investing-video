/**
 * Scene 15 — Tuntun AI Key Events (comp 3535–4903, dur 1368). One centred phone
 * (same size as the Scene 12 phone: cx 960 / top 160 / height 780) plays the
 * Scene 14-18 capture, which runs continuously to 4903 (this scene now spans the
 * whole rest of the Analysis group — scenes 16–18 retired). From 3861 it
 * cross-fades to the "Market Size" AI answer; companion phones fade in beside it
 * — Financial (left) and Price & Volume (right) — while highlight boxes call out
 * each factor and a caption above grows into the full list. At 4140 the graphics
 * fade back to the continuous video, which plays out to 4903.
 * Frame = scene-local (0 at comp 3535).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PhoneFrame } from "../components";
import { fadeIn, fadeOut, blinkTwice } from "../helpers";

const CX = 960;
const TOP = 160;
const H = 780;
const SCREEN_T = TOP + 6; // 166
const SCREEN_H = H - 12; // 768
const BODY_W = 404; // round((H-12)*980/1920) + 12
const CX_L = 466; // left companion phone
const CX_R = 1454; // right companion phone
const END = 1368; // video runs continuously to comp 4903 (replaces scenes 16–18)

// onsets (scene-local)
const IMG_IN = 326; // 3861 — video → Market Size + first highlight/caption
const NPM_AT = 368; // 3903
const VAL_AT = 416; // 3951 — Financial (left) appears
const FIN_AT = 459; // 3994
const PV_AT = 510; // 4045 — Price & Volume (right) appears
const FADE_BACK = 605; // 4140 — graphics fade back to the video

// highlight box: 25px wider than the phone body on each side
const hlBox = (cx: number, fy0: number, fy1: number) => ({
  left: cx - BODY_W / 2 - 25,
  top: SCREEN_T + fy0 * SCREEN_H,
  width: BODY_W + 50,
  height: (fy1 - fy0) * SCREEN_H,
});

const Box = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${theme.colors.indigo}`, borderRadius: 8, opacity: op, boxSizing: "border-box" }} /> : null;

const SEGS = [
  { t: "Market share", at: IMG_IN },
  { t: ", profit margin", at: NPM_AT },
  { t: ", valuation", at: VAL_AT },
  { t: ", financial performance", at: FIN_AT },
  { t: ", price & volume", at: PV_AT },
];

export const Scene15 = () => {
  const f = useCurrentFrame();
  const phoneOp = Math.min(fadeIn(f, 0, 14), fadeOut(f, END - 14, 14));
  const msOp = Math.min(fadeIn(f, IMG_IN, 14), fadeOut(f, FADE_BACK, 14));
  const finOp = Math.min(fadeIn(f, VAL_AT, 14), fadeOut(f, FADE_BACK, 14));
  const pvOp = Math.min(fadeIn(f, PV_AT, 14), fadeOut(f, FADE_BACK, 14));
  const textOut = fadeOut(f, FADE_BACK, 14);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* centre phone — Scene 14-18 video, cross-faded to the Market Size answer */}
      <PhoneFrame cx={CX} top={TOP} height={H} op={phoneOp} video="eventDriven/s14-18.mp4" />
      <PhoneFrame cx={CX} top={TOP} height={H} op={msOp} img="eventDriven/s15-marketsize.jpg" />

      {/* companions */}
      <PhoneFrame cx={CX_L} top={TOP} height={H} op={finOp} img="eventDriven/s15-financial.jpg" />
      <PhoneFrame cx={CX_R} top={TOP} height={H} op={pvOp} img="eventDriven/s15-pricevolume.jpg" />

      {/* highlights (two blinks then end) */}
      <Box b={hlBox(CX, 0.095, 0.385)} op={blinkTwice(f, IMG_IN, IMG_IN + 46)} />
      <Box b={hlBox(CX, 0.378, 0.578)} op={blinkTwice(f, NPM_AT, NPM_AT + 46)} />
      <Box b={hlBox(CX, 0.572, 0.905)} op={blinkTwice(f, VAL_AT, VAL_AT + 46)} />
      <Box b={hlBox(CX_L, 0.228, 0.5)} op={blinkTwice(f, FIN_AT, FIN_AT + 46)} />
      <Box b={hlBox(CX_R, 0.155, 0.755)} op={blinkTwice(f, PV_AT, PV_AT + 46)} />

      {/* caption above the phones — grows into the full list */}
      <div style={{ position: "absolute", left: 96, right: 96, top: 104, textAlign: "center", fontSize: 30, lineHeight: 1.25, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, opacity: textOut }}>
        {SEGS.filter((s) => f >= s.at).map((s) => (
          <span key={s.t} style={{ opacity: fadeIn(f, s.at, 12) }}>{s.t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
