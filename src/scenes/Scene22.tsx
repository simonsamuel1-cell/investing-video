/**
 * S22 (Layout B-top showcase) — "Theme → Story → Stock. That's the sequence."
 * Three phones side by side connected by cyan arrows (1→2, 2→3). On silver, no
 * grey panel (G2). Ref: Scene_22.png (layout only).
 *
 * NB the Scene_22_-_*.jpg assets are screen-only (1080×2340, not pre-framed), so
 * they are wrapped in <PhoneFrame> (via PhoneCenter `img`) to read as phones,
 * matching the reference's framed phones. (spec §22)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

// GR4 (no-crop, 3-phone row): smaller phones centered about x=960 so the row
// (~x461–1459) clears the logo reserve x-range; vertically centred, no crop.
const PH_TOP = 266;
const PH_H = 576;
const HALF = 150; // visual half-width (incl. scale 1.05) for arrow clearance
const STEPS = [
  { src: ASSETS.theme22, cx: 606 },
  { src: ASSETS.story22, cx: 960 },
  { src: ASSETS.stock22, cx: 1314 },
];
const ARROWS = [
  { x0: 606 + HALF, x1: 960 - HALF, delay: 18 },
  { x0: 960 + HALF, x1: 1314 - HALF, delay: 32 },
];
const ARROW_Y = PH_TOP + PH_H / 2;

export const Scene22 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      {STEPS.map((s, i) => (
        <PhoneCenter key={i} img={s.src} cx={s.cx} top={PH_TOP} height={PH_H} delay={4 + i * 14} />
      ))}

      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        {ARROWS.map((a, i) => {
          const gx = ease(frame, [a.delay, a.delay + 12], [a.x0, a.x1 - 18]);
          return (
            <g key={i} opacity={fadeIn(frame, a.delay, 8)}>
              <line x1={a.x0} y1={ARROW_Y} x2={gx} y2={ARROW_Y} stroke={COLORS.cyan} strokeWidth={7} strokeLinecap="round" />
              <polygon points={`${gx},${ARROW_Y - 16} ${gx + 20},${ARROW_Y} ${gx},${ARROW_Y + 16}`} fill={COLORS.cyan} />
            </g>
          );
        })}
      </svg>
    </SceneWrap>
  );
};
