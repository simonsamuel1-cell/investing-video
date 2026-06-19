/**
 * S15 (B) — Groups / conglomerate families. Phone shows the Group tab. Right zone:
 * a parent → children node graph (one owner → several companies). Generic labels,
 * not real tickers. (spec §7)
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneStill } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, ease, springUp } from "../util/anim";

const PARENT = { x: 700, y: 360, w: 240, h: 96 };
const CHILD_X = 1240;
const CHILDREN = [
  { label: "Perbankan", y: 270 },
  { label: "Energi", y: 400 },
  { label: "Properti", y: 530 },
  { label: "Konsumer", y: 660 },
];
const CW = 280;
const CH = 84;

export const Scene15 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const px = PARENT.x + PARENT.w;
  const py = PARENT.y + PARENT.h / 2;

  return (
    <SceneWrap>
      <PhoneStill src={ASSETS.tab3} />
      <Heading x={640} y={110} width={800} size={46} delay={4}>
        One owner, many companies.
      </Heading>

      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        {CHILDREN.map((c, i) => {
          const t = ease(frame, [20 + i * 6, 38 + i * 6], [0, 1]);
          const cx = CHILD_X;
          const cy = c.y + CH / 2;
          const len = Math.hypot(cx - px, cy - py);
          return (
            <line
              key={i}
              x1={px}
              y1={py}
              x2={cx}
              y2={cy}
              stroke={COLORS.cyan}
              strokeWidth={2.5}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - t)}
              opacity={fadeIn(frame, 20 + i * 6, 8)}
            />
          );
        })}
      </svg>

      {/* parent */}
      <div
        style={{
          position: "absolute",
          left: PARENT.x,
          top: PARENT.y,
          width: PARENT.w,
          height: PARENT.h,
          borderRadius: RADII.card,
          background: COLORS.purple,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          fontWeight: 800,
          opacity: fadeIn(frame, 8, 10),
          transform: `scale(${0.94 + 0.06 * springUp(frame, fps, 8)})`,
          boxShadow: "0 16px 36px rgba(70,54,184,0.28)",
        }}
      >
        Grup
      </div>

      {/* children */}
      {CHILDREN.map((c, i) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: CHILD_X,
            top: c.y,
            width: CW,
            height: CH,
            borderRadius: RADII.chip,
            border: `2px solid ${COLORS.cyan}`,
            background: COLORS.white,
            color: COLORS.black,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 600,
            opacity: fadeIn(frame, 28 + i * 6, 10),
            transform: `scale(${0.92 + 0.08 * springUp(frame, fps, 28 + i * 6)})`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          {c.label}
        </div>
      ))}
    </SceneWrap>
  );
};
