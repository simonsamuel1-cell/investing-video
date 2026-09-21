/**
 * S4 (A) — split infographic. LEFT: one small wobbling line "1 stock". RIGHT: a
 * cluster of 6 mini-lines moving together "the theme". (spec §7)
 *
 * audio references leaves/tree metaphor; visual intentionally literal — re-voice or accept
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

const N = 30;
const MID_Y = 560;
const pts = (x0: number, x1: number, fn: (i: number) => number) => {
  const out: string[] = [];
  for (let i = 0; i < N; i++) {
    const x = x0 + ((x1 - x0) * i) / (N - 1);
    out.push(`${x.toFixed(1)},${(MID_Y + fn(i)).toFixed(1)}`);
  }
  return out.join(" ");
};

const SERIES = [COLORS.cyanDark, COLORS.cyan, COLORS.cyanLight, COLORS.purpleLight, COLORS.purple, COLORS.purpleDark];

export const Scene04 = () => {
  const frame = useCurrentFrame();

  // left: nervous single line.
  const wobble = (i: number) => 34 * Math.sin(i * 0.7 + frame * 0.2) + 14 * Math.sin(i * 1.9 + frame * 0.5);

  // right: shared slow trend → all 6 move together.
  const trend = (i: number) => -64 * Math.sin(i * 0.42 + frame * 0.06) - 0.8 * i;

  const drawL = ease(frame, [8, 30], [0, 1]);
  const drawR = ease(frame, [14, 40], [0, 1]);
  const len = 720;

  return (
    <SceneWrap>
      {/* width capped + centred so the 2-line heading stays clear of the
          top-right logo reserve (x≥1464). */}
      <Heading x={460} y={110} width={1000} align="center" size={56}>
        One stock can mislead. The theme tells the truth.
      </Heading>

      {/* centre divider */}
      <div style={{ position: "absolute", left: 960, top: 320, width: 1, height: 420, background: COLORS.hairline }} />

      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        {/* LEFT — 1 stock */}
        <polyline
          points={pts(190, 760, wobble)}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - drawL)}
          opacity={fadeIn(frame, 8, 8)}
        />
        {/* RIGHT — the theme (6 lines together) */}
        {SERIES.map((col, k) => (
          <polyline
            key={k}
            points={pts(1100, 1740, (i) => trend(i) + (k - 2.5) * 16)}
            fill="none"
            stroke={col}
            strokeWidth={4}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - drawR)}
            opacity={fadeIn(frame, 14 + k * 2, 8) * 0.95}
          />
        ))}
      </svg>

      {/* labels */}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 720,
          width: 570,
          textAlign: "center",
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.black,
          opacity: fadeIn(frame, 24, 12),
        }}
      >
        1 stock
      </div>
      <div
        style={{
          position: "absolute",
          left: 1100,
          top: 720,
          width: 640,
          textAlign: "center",
          fontSize: 36,
          fontWeight: 800,
          color: COLORS.purple,
          opacity: fadeIn(frame, 30, 12),
        }}
      >
        the theme
      </div>
    </SceneWrap>
  );
};
