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
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREY = "#9AA0AA";

// Enlarged phones (height 806 ≈ +30%), ~50px gap, vertically centred (y 137→943).
const PH_TOP = 137;
const PH_H = 806;
const CX_L = 735; // TikTok phone
const CX_R = 1185; // X phone

// The four "entry point" tags that sit above the phones now live in their own
// persistent row (SceneEntryTags, NV 2598→6000) so they can step-highlight across the
// later phone clips; they are no longer rendered here.

// Ten labels: 5 left, 5 right, appearing one at a time from ~2770 (alternating L/R,
// top→bottom). Local onsets = NV − 2608; stagger 3 frames for a quick reveal.
// Boxes are 200×96. Column centres put each box 50px off its phone (left phone edge
// 542 → box right 492 → centre 392; right phone edge 1379 → box left 1429 → centre
// 1529). Vertical pitch 126 = 96 box + 30px gap, centred on the phone (centre y 540).
const COL_L = 392;
const COL_R = 1529;
const LABELS = [
  { x: COL_L, y: 240, at: 162 }, // 2770
  { x: COL_R, y: 240, at: 165 },
  { x: COL_L, y: 366, at: 168 },
  { x: COL_R, y: 366, at: 171 },
  { x: COL_L, y: 492, at: 174 },
  { x: COL_R, y: 492, at: 177 },
  { x: COL_L, y: 618, at: 180 },
  { x: COL_R, y: 618, at: 183 },
  { x: COL_L, y: 744, at: 186 },
  { x: COL_R, y: 744, at: 189 }, // done ~2805
];

export const SceneEntryPhones = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 241, 14); // all out by 2863 (local 255)
  return (
    <AbsoluteFill style={{ opacity: out, fontFamily }}>
      {/* LEFT phone (TikTok) — screenShift pans the image inside the mask (+y = down,
          +x = right); screenScale zooms so panning doesn't expose black edges. */}
      <PhoneCenter img="concept-tiktok.jpg" cx={CX_L} top={PH_TOP} height={PH_H} delay={0} screenScale={1} screenShift={{ x: 0, y: 0 }} />
      <PhoneCenter img="concept-x.jpg" cx={CX_R} top={PH_TOP} height={PH_H} delay={68} />

      {LABELS.map((L, i) => {
        const op = fadeIn(f, L.at, 8);
        const ty = interpolate(f, [L.at, L.at + 8], [16, 0], CLAMP);
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
