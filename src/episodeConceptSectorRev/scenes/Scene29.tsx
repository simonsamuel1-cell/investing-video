/**
 * S29 (A) — how many forces push one way. Plain text card + several STRAIGHT
 * geometric arrows aligned in one direction (deliberately NOT flowing water /
 * organic). (spec §7)
 *
 * audio references "currents" metaphor; visual intentionally geometric — re-voice or accept
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

const ROWS = 6;
const ARROW = { x0: 360, x1: 1560, top: 430, gap: 80 };
const COLORSEQ = [COLORS.purple, COLORS.cyan, COLORS.purple, COLORS.cyan, COLORS.purple, COLORS.cyan];

export const Scene29 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <Heading x={96} y={150} width={1728} align="center" size={54}>
        How many forces point one way?
      </Heading>

      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        {Array.from({ length: ROWS }).map((_, i) => {
          const y = ARROW.top + i * ARROW.gap;
          const d = 10 + i * 6;
          const grow = ease(frame, [d, d + 20], [ARROW.x0, ARROW.x1 - 36]);
          const op = fadeIn(frame, d, 8);
          const c = COLORSEQ[i];
          return (
            <g key={i} opacity={op}>
              <line x1={ARROW.x0} y1={y} x2={grow} y2={y} stroke={c} strokeWidth={8} strokeLinecap="round" />
              <polygon points={`${grow},${y - 16} ${grow + 36},${y} ${grow},${y + 16}`} fill={c} />
            </g>
          );
        })}
      </svg>
    </SceneWrap>
  );
};
