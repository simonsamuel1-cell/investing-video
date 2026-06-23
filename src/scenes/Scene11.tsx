/**
 * S11 (Layout C — EXACT match to Layout.jpg, do not reinterpret) — "This is
 * Concept Sector". Centered title + cyan underline + subtitle stacked at the top,
 * with TWO thin-border phone templates side by side, symmetric about x=960.
 *
 * Two highlights call out where "Concept Sector" lives: the "Sector" quick-action
 * on the LEFT phone (IHSG home) and the "Concept Sector" section on the RIGHT phone.
 *
 * Per direction: EVERY animated object in this scene (title, underline, subtitle,
 * both phones, both highlights) finishes its entrance at frame 10.
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease, rise } from "../util/anim";

const DONE = 10; // all entrance animation completes here

// Phone geometry (aspect ≈ 0.4946; preserved). Symmetric about x=960.
const PW = 362;
const PY = 240;
const CX_LEFT = 710;
const CX_RIGHT = 1210;

// Screen-rect geometry on canvas (mirrors PhoneFrame: CUT inset, ×1.03 about centre)
// so highlights can be placed in image-normalised (u,v) coordinates.
const PH = PW / (1924 / 3890);
const CUT = { left: 0.0665, top: 0.0798, w: 0.867, h: 0.8402 };
const scrCW = PW * CUT.w * 1.03;
const scrCH = PH * CUT.h * 1.03;
const scrLeftLocal = PW * CUT.left + (PW * CUT.w - scrCW) / 2;
const scrTopLocal = PY + PH * CUT.top + (PH * CUT.h - scrCH) / 2;
// returns canvas rect for a normalised (u,v,uw,uh) region of the phone at centre cx
const region = (cx: number, u: number, v: number, uw: number, uh: number) => ({
  x: cx - PW / 2 + scrLeftLocal + u * scrCW,
  y: scrTopLocal + v * scrCH,
  w: uw * scrCW,
  h: uh * scrCH,
});

// LEFT: the "Sector" quick-action pill (2nd chip row, 3rd item).
const HL_LEFT = region(CX_LEFT, 0.6, 0.498, 0.235, 0.058);
// RIGHT: the whole "Concept Sector" section (header + 6 concept cards).
const HL_RIGHT = region(CX_RIGHT, 0.03, 0.22, 0.94, 0.42);

const Highlight = ({ x, y, w, h, radius = 16 }: { x: number; y: number; w: number; h: number; radius?: number }) => {
  const frame = useCurrentFrame();
  const op = fadeIn(frame, 0, DONE);
  const s = 0.92 + 0.08 * ease(frame, [0, DONE], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        border: `3px solid ${COLORS.cyan}`,
        background: COLORS.cyanWash,
        boxShadow: `0 0 0 4px rgba(92,200,227,0.18), 0 10px 28px rgba(92,200,227,0.35)`,
        opacity: op,
        transform: `scale(${s})`,
        transformOrigin: "center",
      }}
    />
  );
};

export const Scene11 = () => {
  const frame = useCurrentFrame();
  const lineW = ease(frame, [0, DONE], [0, 384]);
  const titleOp = fadeIn(frame, 0, DONE);
  const titleTy = rise(frame, 0, DONE, 22);
  return (
    <SceneWrap>
      {/* title (centred, ~y59–114 band) */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 54,
          width: 1728,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: -0.6,
          color: COLORS.black,
          opacity: titleOp,
          transform: `translateY(${titleTy}px)`,
        }}
      >
        Concept Sector
      </div>

      {/* cyan underline + subtitle */}
      <div style={{ position: "absolute", left: 96, top: 142, width: 1728, textAlign: "center" }}>
        <div style={{ height: 6, width: lineW, background: COLORS.cyan, borderRadius: 3, margin: "0 auto" }} />
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.black,
            opacity: fadeIn(frame, 0, DONE),
          }}
        >
          One screen for how the market really moves.
        </div>
      </div>

      {/* two thin-border phones (entrance ends at frame 10, no spring) */}
      <PhoneFrame x={CX_LEFT - PW / 2} y={PY} w={PW} img={ASSETS.concept1} delay={0} enterDur={DONE} springScale={false} />
      <PhoneFrame x={CX_RIGHT - PW / 2} y={PY} w={PW} img={ASSETS.concept2} delay={0} enterDur={DONE} springScale={false} />

      {/* highlights */}
      <Highlight x={HL_LEFT.x} y={HL_LEFT.y} w={HL_LEFT.w} h={HL_LEFT.h} radius={14} />
      <Highlight x={HL_RIGHT.x} y={HL_RIGHT.y} w={HL_RIGHT.w} h={HL_RIGHT.h} radius={18} />
    </SceneWrap>
  );
};
