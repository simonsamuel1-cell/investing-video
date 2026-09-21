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
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
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

// Source-types bullet list (right of the phone), then "Decide Faster" (left).
// Scene-local frames (comp − 3535).
const SOURCES = [
  { t: "Announcements", at: 683 }, // 4218
  { t: "News", at: 717 }, // 4252
  { t: "Sentiments", at: 738 }, // 4273
  { t: "Research", at: 761 }, // 4296
  { t: "Financials", at: 785 }, // 4320
];
const SRC_END = 915; // 4450 — all fade out

export const Scene15 = () => {
  const f = useCurrentFrame();
  const phoneOp = Math.min(fadeIn(f, 0, 14), fadeOut(f, END - 14, 14));
  const msOp = Math.min(fadeIn(f, IMG_IN, 14), fadeOut(f, FADE_BACK, 14));
  const finOp = Math.min(fadeIn(f, VAL_AT, 14), fadeOut(f, FADE_BACK, 14));
  const pvOp = Math.min(fadeIn(f, PV_AT, 14), fadeOut(f, FADE_BACK, 14));
  const textOut = fadeOut(f, FADE_BACK, 14);

  // "Key Events" card highlight (3648→3846). The capture scrolls up quickly early
  // (local 113→137) then holds, so the box top tracks that scroll then settles.
  const keTop = interpolate(f, [113, 130], [462, 388], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keOp = blinkTwice(f, 113, 311);

  // 4218–4450: source-types list (right) + "Decide Faster" (left), on the video.
  const srcOut = fadeOut(f, SRC_END - 14, 14);
  const decideOp = Math.min(fadeIn(f, 864, 14), srcOut); // "Decide Faster" from 4399

  // 4676 / 4763: two-line prompts flanking the phone, all end 4898.
  const moveOut = fadeOut(f, 1349, 14);
  const q1Op = Math.min(fadeIn(f, 1141, 14), moveOut); // "Is the move / spreading" (left)
  const q2Op = Math.min(fadeIn(f, 1228, 14), moveOut); // "if yes, means / stronger signal" (right)

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

      {/* "Key Events" card (on the video) — 3648→3846, tracks the early scroll;
          width runs 25px past the phone each side */}
      {keOp > 0 && <div style={{ position: "absolute", left: CX - BODY_W / 2 - 25, top: keTop, width: BODY_W + 50, height: 186, border: `3px solid ${theme.colors.indigo}`, borderRadius: 12, opacity: keOp, boxSizing: "border-box" }} />}

      {/* Concept Sector section (IDX Sectors → Group) on the video — 4549 */}
      <Box b={hlBox(CX, 0.263, 0.778)} op={blinkTwice(f, 1014, 1160)} />

      {/* source types — bullet list right of the phone (4218→…), all end 4450 */}
      <div style={{ position: "absolute", left: 1240, top: 385, width: 560, display: "flex", flexDirection: "column", gap: 22, opacity: srcOut }}>
        {SOURCES.map((s) => (
          <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: theme.font.weights.bold, color: theme.colors.text, opacity: fadeIn(f, s.at, 12) }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: theme.colors.indigo, flex: "0 0 auto" }} />
            {s.t}
          </div>
        ))}
      </div>

      {/* "Decide Faster" — left of the phone (4399→4450) */}
      <div style={{ position: "absolute", left: 96, top: 490, width: 640, textAlign: "center", fontSize: 60, fontWeight: theme.font.weights.extrabold, color: theme.colors.indigo, opacity: decideOp }}>
        Decide Faster
      </div>

      {/* "Is the move / spreading" — left of the phone (4676→4898) */}
      <div style={{ position: "absolute", left: 96, top: 485, width: 662, textAlign: "center", fontSize: 52, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, lineHeight: 1.22, opacity: q1Op }}>
        Is the move
        <br />
        <span style={{ color: theme.colors.indigo }}>spreading</span>
      </div>

      {/* "if yes, means / stronger signal" — right of the phone (4763→4898) */}
      <div style={{ position: "absolute", left: 1162, top: 485, width: 662, textAlign: "center", fontSize: 52, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, lineHeight: 1.22, opacity: q2Op }}>
        if yes, means
        <br />
        <span style={{ color: theme.colors.indigo }}>stronger signal</span>
      </div>

      {/* caption above the phones — grows into the full list */}
      <div style={{ position: "absolute", left: 96, right: 96, top: 104, textAlign: "center", fontSize: 30, lineHeight: 1.25, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, opacity: textOut }}>
        {SEGS.filter((s) => f >= s.at).map((s) => (
          <span key={s.t} style={{ opacity: fadeIn(f, s.at, 12) }}>{s.t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
