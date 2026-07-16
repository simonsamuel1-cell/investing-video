/**
 * SceneEntryPhones — NV 2608→2863 (new content). Two framed phones (TikTok left @2608,
 * X right @2676) as "entry points" at the enlarged size the whole time, then ten
 * "???? / ??%" placeholder stock labels appear one at a time (2770→2832) — five down
 * the left of the left phone, five down the right of the right phone. All fade out by
 * 2863. Frame = scene-local (0 at NV 2608).
 */
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { PhoneCenter } from "../components/PhoneCenter";
import { COLORS } from "../theme";
import { fadeIn, fadeOut } from "../util/anim";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREY = "#9AA0AA";

// Enlarged phones (height 806 ≈ +30%), ~50px gap, vertically centred (y 137→943).
const PH_TOP = 137;
const PH_H = 806;
const CX_L = 735; // TikTok phone
const CX_R = 1185; // X phone

// Tag above the phones. PHONE_VIS_TOP = the phones' visual top edge (screen top after
// the frame's inset/scale ≈ PH_TOP + 50). The tag's BOTTOM sits TAG_GAP px above it.
const PHONE_VIS_TOP = PH_TOP + 51;
const TAG_GAP = 20;

// Ten labels: 5 outer-left, 5 outer-right, appearing one at a time 2770→2832
// (alternating L/R, top→bottom). Local onsets = NV − 2608.
const COL_L = 280;
const COL_R = 1640;
const LABELS = [
  { x: COL_L, y: 150, at: 162 }, // 2770
  { x: COL_R, y: 150, at: 168 },
  { x: COL_L, y: 310, at: 173 },
  { x: COL_R, y: 310, at: 179 },
  { x: COL_L, y: 470, at: 184 },
  { x: COL_R, y: 470, at: 190 },
  { x: COL_L, y: 630, at: 195 },
  { x: COL_R, y: 630, at: 201 },
  { x: COL_L, y: 790, at: 206 },
  { x: COL_R, y: 790, at: 212 }, // done ~2832
];

export const SceneEntryPhones = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 241, 14); // all out by 2863 (local 255)
  const tagOp = fadeIn(f, 0, 14); // tag appears with the phones (~2609)
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* benchmark tag #1 — centred; its bottom edge sits TAG_GAP px above the phones */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 1080 - (PHONE_VIS_TOP - TAG_GAP), display: "flex", justifyContent: "center", opacity: tagOp }}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: COLORS.purple, color: "#FFFFFF", fontSize: 36, fontWeight: 800, boxShadow: "0 10px 26px rgba(95,77,238,0.30)" }}>
          1. You Saw a Stock Online
        </div>
      </div>

      {/* LEFT phone (TikTok) — screenShift pans the image inside the mask (+y = down,
          +x = right); screenScale zooms so panning doesn't expose black edges. */}
      <PhoneCenter img="concept-tiktok.jpg" cx={CX_L} top={PH_TOP} height={PH_H} delay={0} screenScale={1} screenShift={{ x: 0, y: 0 }} />
      <PhoneCenter img="concept-x.jpg" cx={CX_R} top={PH_TOP} height={PH_H} delay={68} />

      {LABELS.map((L, i) => {
        const op = fadeIn(f, L.at, 14);
        const ty = interpolate(f, [L.at, L.at + 14], [16, 0], CLAMP);
        return (
          <div key={i} style={{ position: "absolute", left: L.x - 100, top: L.y, width: 200, height: 96, boxSizing: "border-box", borderRadius: 16, border: `2px solid ${COLORS.hairline}`, background: "rgba(255,255,255,0.66)", boxShadow: "0 10px 26px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: op, transform: `translateY(${ty}px)` }}>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 3, color: GREY }}>????</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: GREY }}>??%</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
