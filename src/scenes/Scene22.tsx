/**
 * S22 (A) — key takeaway. A horizontal 3-step lockup Theme → Story → Stock
 * (purple → cyan → purple-dark), each step framing a Scene_22 thumbnail.
 * Instantly legible. Mid-flow. (spec §7)
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, springUp } from "../util/anim";

const STEPS = [
  { label: "Theme", src: ASSETS.theme22, accent: COLORS.purple },
  { label: "Story", src: ASSETS.story22, accent: COLORS.cyan },
  { label: "Stock", src: ASSETS.stock22, accent: COLORS.purpleDark },
];
const TW = 300;
const TH = 540;
const GAP = 132;

export const Scene22 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = STEPS.length * TW + (STEPS.length - 1) * GAP;
  const startX = (1920 - total) / 2;
  const top = 286;

  return (
    <SceneWrap>
      <Heading x={96} y={130} width={1728} align="center" size={56} delay={4}>
        Theme → Story → Stock.
      </Heading>

      {/* arrows */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        {[0, 1].map((i) => {
          const ax = startX + (i + 1) * TW + i * GAP + 24;
          const ay = top + TH / 2;
          return (
            <g key={i} opacity={fadeIn(frame, 24 + i * 8, 10)}>
              <line x1={ax} y1={ay} x2={ax + GAP - 56} y2={ay} stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
              <polygon points={`${ax + GAP - 60},${ay - 12} ${ax + GAP - 60},${ay + 12} ${ax + GAP - 30},${ay}`} fill={COLORS.ink} />
            </g>
          );
        })}
      </svg>

      {STEPS.map((s, i) => {
        const d = 8 + i * 12;
        const op = fadeIn(frame, d, 12);
        const sc = 0.92 + 0.08 * springUp(frame, fps, d);
        const x = startX + i * (TW + GAP);
        return (
          <div key={s.label}>
            <div
              style={{
                position: "absolute",
                left: x,
                top,
                width: TW,
                height: TH,
                borderRadius: RADII.device,
                border: `3px solid ${s.accent}`,
                overflow: "hidden",
                background: "#000",
                opacity: op,
                transform: `scale(${sc})`,
                boxShadow: `0 22px 50px ${s.accent}33`,
              }}
            >
              <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: x,
                top: top + TH + 20,
                width: TW,
                textAlign: "center",
                fontSize: 36,
                fontWeight: 800,
                color: s.accent,
                opacity: op,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </SceneWrap>
  );
};
