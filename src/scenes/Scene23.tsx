/**
 * S23 (B) — a candidate stock; two things to check first. Phone taps into the
 * stock (combined clip 0–3s). Right zone: heading + two numbered empty slots
 * (filled in S24). Mid-flow. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise } from "../util/anim";

const SLOTS = ["", ""];

export const Scene23 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <PhoneClip src={ASSETS.combo23_27} startSec={0} />
      <Heading x={640} y={130} width={800} size={48} delay={4}>
        Before you act, check two things.
      </Heading>
      {SLOTS.map((_, i) => {
        const d = 24 + i * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 640,
              top: 320 + i * 168,
              width: 1080,
              height: 132,
              borderRadius: RADII.card,
              border: `2px dashed ${COLORS.hairline}`,
              background: "rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 30px",
              opacity: fadeIn(frame, d, 12),
              transform: `translateY(${rise(frame, d, 14, 18)}px)`,
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: i === 0 ? COLORS.purple : COLORS.cyan,
                color: COLORS.white,
                fontSize: 34,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 30, fontWeight: 600, color: COLORS.ink }}>
              {i === 0 ? "Quality" : "Value"} — coming up
            </span>
          </div>
        );
      })}
    </SceneWrap>
  );
};
