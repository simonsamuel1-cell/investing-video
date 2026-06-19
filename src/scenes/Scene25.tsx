/**
 * S25 (B) — curated by Tuntun research. Phone shows the research report (combined
 * clip 13–19s). Right zone: a cyan "Tuntun Research" badge + one line. Mid-flow.
 * (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise } from "../util/anim";

const CheckBadge = () => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17 19 7" />
  </svg>
);

export const Scene25 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <PhoneClip src={ASSETS.combo23_27} startSec={13} />
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 400,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "16px 30px",
          borderRadius: RADII.chip,
          background: COLORS.cyan,
          color: COLORS.white,
          fontSize: 38,
          fontWeight: 800,
          opacity: fadeIn(frame, 8, 12),
          transform: `translateY(${rise(frame, 8, 16, 20)}px)`,
          boxShadow: "0 14px 32px rgba(58,157,184,0.30)",
        }}
      >
        <CheckBadge />
        Tuntun Research
      </div>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 506,
          width: 1100,
          fontSize: 34,
          fontWeight: 600,
          lineHeight: 1.35,
          color: COLORS.black,
          opacity: fadeIn(frame, 24, 14),
        }}
      >
        Every read is curated by our research desk — not auto-generated.
      </div>
    </SceneWrap>
  );
};
