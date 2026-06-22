/**
 * S11 (Layout C — EXACT match to Layout.jpg, do not reinterpret) — "This is
 * Concept Sector". Centered title + cyan underline + subtitle stacked at the top,
 * with TWO pre-framed phone mockups side by side, symmetric about x=960.
 *
 * Assets are already composited inside black device bodies (1925×3890) → render
 * as plain <Img>, NOT wrapped in <DeviceFrame> and with no extra border. (spec §7)
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease, rise, springUp } from "../util/anim";

// Phone geometry (1925:3890 aspect ≈ 0.4949; preserved). Bottom capped at y=972
// so nothing enters the 108px subtitle zone. Symmetric about x=960.
const PW = 362;
const PH = 732;
const PY = 240; // bottom = 972
const CX_LEFT = 710;
const CX_RIGHT = 1210;

const Phone = ({ src, cx, delay }: { src: string; cx: number; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = fadeIn(frame, delay, 12);
  const s = 0.96 + 0.04 * springUp(frame, fps, delay);
  const ty = rise(frame, delay, 14, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - PW / 2,
        top: PY,
        width: PW,
        height: PH,
        opacity: op,
        transform: `translateY(${ty}px) scale(${s})`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

export const Scene11 = () => {
  const frame = useCurrentFrame();
  const lineW = ease(frame, [10, 26], [0, 384]);
  return (
    <SceneWrap>
      {/* title (centred, ~y59–114 band) */}
      <Heading x={96} y={54} width={1728} align="center" size={64} delay={2}>
        Concept Sector
      </Heading>

      {/* cyan underline + subtitle */}
      <div style={{ position: "absolute", left: 96, top: 142, width: 1728, textAlign: "center" }}>
        <div style={{ height: 6, width: lineW, background: COLORS.cyan, borderRadius: 3, margin: "0 auto" }} />
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.black,
            opacity: fadeIn(frame, 14, 12),
          }}
        >
          One screen for how the market really moves.
        </div>
      </div>

      {/* two pre-framed phones, side by side */}
      <Phone src={ASSETS.conceptFramed1} cx={CX_LEFT} delay={6} />
      <Phone src={ASSETS.conceptFramed2} cx={CX_RIGHT} delay={10} />
    </SceneWrap>
  );
};
