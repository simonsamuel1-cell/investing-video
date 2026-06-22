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
import { DisclaimerChip } from "../components/DisclaimerChip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const APP_GREEN = "#16A34A";

// Reference Fair Value — section lifted out into a centred opaque card (per Scene_24_2.png),
// same lift-out approach as the MA5 card.
const RFV = { x: 730, y: 630, w: 460, h: 222 };

// Company Quality — section lifted out into an opaque card pulled to the bottom-left
// (per Scene_24.png), same lift-out approach as the MA5 card.
const CQ = { x: 540, y: 632, w: 372, h: 214 };

// MA5 lifted card (wider than the phone, at the MA5 row's y).
const MA5 = { x: 640, y: 586, w: 640, h: 92 };

export const Scene23to27 = () => {
  const frame = useCurrentFrame();

  // Company Quality — lifted card (state 1).
  const cqOp = interpolate(frame, [95, 110, 256, 271], [0, 1, 1, 0], CLAMP);
  const cqTy = interpolate(frame, [95, 113], [20, 0], CLAMP);

  // Reference Fair Value — lifted card (state 2).
  const rfvOp = interpolate(frame, [300, 312, 446, 458], [0, 1, 1, 0], CLAMP);
  const rfvTy = interpolate(frame, [300, 318], [20, 0], CLAMP);

  // MA5 lifted card.
  const ma5Op = interpolate(frame, [750, 762, 893, 905], [0, 1, 1, 0], CLAMP);
  const ma5Ty = interpolate(frame, [750, 768], [18, 0], CLAMP);

  // Compliance chip during the Technical section.
  const discOp = interpolate(frame, [620, 635, 893, 905], [0, 1, 1, 0], CLAMP);

  return (
    <SceneWrap>
      {/* one continuous recording — never remounts across the block */}
      <PhoneCenter video={ASSETS.combo23_27} startSec={0} top={80} height={865} />

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
          transform: `translateY(${cqTy}px) scale(0.6)`,
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
          transform: `translateY(${rfvTy}px) scale(0.6)`,
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
          transform: `translateY(${ma5Ty}px) scale(0.6)`,
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

      {/* compliance chip, bottom-left, clear of the phone */}
      <div style={{ opacity: discOp }}>
        <DisclaimerChip x={110} y={906} delay={0} />
      </div>
    </SceneWrap>
  );
};
