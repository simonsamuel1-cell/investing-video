/**
 * S16 (B) — "one screen, every angle". The phone slides out to the left and the
 * three tab views appear side by side as small framed thumbnails. Mid-flow —
 * animate continuously. (spec §7)
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneStill, PHONE } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, ease, springUp } from "../util/anim";

const THUMBS = [
  { src: ASSETS.tab1, label: "Sektor" },
  { src: ASSETS.tab2, label: "Konsep" },
  { src: ASSETS.tab3, label: "Grup" },
];
const TW = 286;
const TH = 572;
const GAP = 92;

export const Scene16 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneX = ease(frame, [4, 32], [PHONE.x, -540]);

  const total = THUMBS.length * TW + (THUMBS.length - 1) * GAP;
  const startX = (1920 - total) / 2;
  const top = 286;

  return (
    <SceneWrap>
      <div style={{ opacity: fadeIn(frame, 0, 1) }}>
        <PhoneStill src={ASSETS.tab3} x={phoneX} />
      </div>

      <Heading x={96} y={130} width={1728} align="center" size={54} delay={20}>
        One screen, every angle.
      </Heading>

      {THUMBS.map((t, i) => {
        const d = 24 + i * 7;
        const op = fadeIn(frame, d, 12);
        const s = 0.92 + 0.08 * springUp(frame, fps, d);
        return (
          <div key={t.label}>
            <div
              style={{
                position: "absolute",
                left: startX + i * (TW + GAP),
                top,
                width: TW,
                height: TH,
                borderRadius: RADII.device,
                border: `2px solid ${COLORS.purple}`,
                overflow: "hidden",
                background: "#000",
                opacity: op,
                transform: `scale(${s})`,
                boxShadow: "0 20px 48px rgba(70,54,184,0.16)",
              }}
            >
              <Img src={staticFile(t.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: startX + i * (TW + GAP),
                top: top + TH + 22,
                width: TW,
                textAlign: "center",
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.black,
                opacity: op,
              }}
            >
              {t.label}
            </div>
          </div>
        );
      })}
    </SceneWrap>
  );
};
