/**
 * S23–27 merged into ONE continuous scene (frames 4800–5917, dur 1118). A single
 * fixed centered phone plays Scene_23__24__25__26__27.mp4 continuously 1:1 from
 * source 0 — no Sequence boundaries, no cut flicker. On-phone cyan highlights
 * appear/disappear by local frame:
 *   • Company Quality card → local 95–271    (02:43.16–02:49.03), lifted out per Scene_24.png
 *   • Reference Fair Value card → local 300–458 (02:50.00–02:55.28), lifted out per Scene_24_2.png
 *   • MA5 lifted card      → local 750–905   (03:05.00–03:10.05), per Scene_26.png
 *   • compliance chip      → during the Technical section
 * (spec §23–27 v3 + GLOBAL continuous-scene rule)
 */
import { interpolate, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const APP_GREEN = "#16A34A";

// S24 lifted cards sit BESIDE the centred phone (body edges 746/1174), vertically
// centred (cy≈512), scaled 0.72 with a 50px gap to the phone. y = 512 − h/2.
const CARD_SCALE = 0.72;
const CQ = { x: 376, y: 405, w: 372, h: 214 };
const RFV = { x: 1160, y: 401, w: 460, h: 222 };

// MA5 lifted card (wider than the phone). Scaled 40% bigger (0.84) and vertical-centred.
const MA5 = { x: 640, y: 466, w: 640, h: 92 };
const MA5_SCALE = 0.84;

export const Scene23to27 = () => {
  const frame = useCurrentFrame();

  // Company Quality + Reference Fair Value — both BESIDE the phone; both DISAPPEAR
  // at 02:56.08 (local 462). CQ appears first (local 95), RFV later (local 300).
  const cqOp = interpolate(frame, [95, 110, 448, 462], [0, 1, 1, 0], CLAMP);
  const cqTy = interpolate(frame, [95, 113], [20, 0], CLAMP);
  const rfvOp = interpolate(frame, [300, 312, 448, 462], [0, 1, 1, 0], CLAMP);
  const rfvTy = interpolate(frame, [300, 318], [20, 0], CLAMP);

  // MA5 lifted card.
  const ma5Op = interpolate(frame, [750, 762, 893, 905], [0, 1, 1, 0], CLAMP);
  const ma5Ty = interpolate(frame, [750, 768], [18, 0], CLAMP);

  // S25: phone slides LEFT ~200px (local ~480–617), then back to centre at 03:01.13
  // (local 617) for S26. The lifted cards only show while the phone is centred.
  const phoneShift = interpolate(frame, [470, 490, 617, 637], [0, -200, -200, 0], CLAMP);
  // "Curated by Tuntun Research Institute" — appears right-beside the shifted phone.
  const curatedOp = interpolate(frame, [495, 510, 605, 620], [0, 1, 1, 0], CLAMP);

  // S26: "validate on chart pro" beside the (centred) phone @ 03:11.27 (local 931).
  const validateOp = interpolate(frame, [931, 943, 1008, 1020], [0, 1, 1, 0], CLAMP);
  // S27/S28 (block now folds in S28): highlight over IDX Sectors / Tuntun Sector /
  // Concept, 03:21.02–03:25.02 (local 1206–1326). Width = phone (428) + 25px each side.
  const hl27Op = interpolate(frame, [1206, 1216, 1314, 1326], [0, 1, 1, 0], CLAMP);

  return (
    <SceneWrap>
      {/* one continuous recording — never remounts across the block */}
      <PhoneCenter video={ASSETS.combo23_27} startSec={0} top={80} height={865} cx={960 + phoneShift} />

      {/* S25 — Curated-by label right-beside the left-shifted phone, vertically centred */}
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 435,
          width: 834,
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: -0.5,
          color: COLORS.black,
          opacity: curatedOp,
        }}
      >
        Curated by<br />Tuntun Research Institute
      </div>

      {/* Company Quality — section lifted out into an opaque card, bottom-left (per Scene_24.png) */}
      <div
        style={{
          position: "absolute",
          left: CQ.x,
          top: CQ.y,
          width: CQ.w,
          height: CQ.h,
          borderRadius: 22,
          background: COLORS.white,
          border: `4px solid ${COLORS.cyan}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.16)",
          opacity: cqOp,
          transform: `translateY(${cqTy}px) scale(${CARD_SCALE})`,
          transformOrigin: "center",
          padding: "26px 32px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.ink }}>Company Quality</span>
        <span style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.05, color: COLORS.black }}>Good</span>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <div style={{ flex: 1, height: 14, borderRadius: 7, background: APP_GREEN }} />
          <div style={{ flex: 1, height: 14, borderRadius: 7, background: APP_GREEN }} />
          <div style={{ flex: 1, height: 14, borderRadius: 7, background: APP_GREEN }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.ink }}>Average</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.ink }}>Best</span>
        </div>
      </div>

      {/* Reference Fair Value — section lifted out into a centred opaque card (per Scene_24_2.png) */}
      <div
        style={{
          position: "absolute",
          left: RFV.x,
          top: RFV.y,
          width: RFV.w,
          height: RFV.h,
          borderRadius: 22,
          background: COLORS.white,
          border: `4px solid ${COLORS.cyan}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.16)",
          opacity: rfvOp,
          transform: `translateY(${rfvTy}px) scale(${CARD_SCALE})`,
          transformOrigin: "center",
          padding: "24px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.ink }}>Reference Fair Value</span>
        <span style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.1, color: COLORS.black }}>933 - 1,094</span>
        <div style={{ position: "relative", width: "100%", marginTop: 16 }}>
          <div
            style={{
              height: 14,
              borderRadius: 7,
              background: "linear-gradient(90deg, #16A34A 0%, #65A30D 26%, #EAB308 52%, #F97316 76%, #DC2626 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "78%",
              top: 13,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: `11px solid ${COLORS.black}`,
            }}
          />
        </div>
        <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.ink, marginTop: 16 }}>30% - 52% Overvalued</span>
      </div>

      {/* MA5 row lifted out into a wide card */}
      <div
        style={{
          position: "absolute",
          left: MA5.x,
          top: MA5.y,
          width: MA5.w,
          height: MA5.h,
          borderRadius: 22,
          background: COLORS.white,
          border: `4px solid ${COLORS.cyan}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.16)",
          opacity: ma5Op,
          transform: `translateY(${ma5Ty}px) scale(${MA5_SCALE})`,
          transformOrigin: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 44px",
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.black }}>MA5</span>
        <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.black }}>1,190</span>
        <span style={{ fontSize: 36, fontWeight: 700, color: APP_GREEN, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={APP_GREEN} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 17 L11 10 L14 13 L20 6" />
            <path d="M15 6 H20 V11" />
          </svg>
          Bullish
        </span>
      </div>

      {/* S26 — "validate on chart pro" right-beside the centred phone (20px gap) */}
      <div
        style={{
          position: "absolute",
          left: 1194,
          top: 440,
          width: 600,
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: -0.5,
          color: COLORS.black,
          opacity: validateOp,
        }}
      >
        validate on<br />chart pro
      </div>

      {/* S27/S28 — highlight over IDX Sectors / Tuntun Sector / Concept */}
      <div
        style={{
          position: "absolute",
          left: 721,
          top: 305,
          width: 478,
          height: 288,
          borderRadius: 18,
          border: `3px solid ${COLORS.cyan}`,
          background: COLORS.cyanWash,
          boxShadow: "0 0 0 4px rgba(92,200,227,0.16)",
          opacity: hl27Op,
        }}
      />
    </SceneWrap>
  );
};
