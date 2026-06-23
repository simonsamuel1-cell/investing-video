/**
 * S10 — first the WRONG question ("Which stock is going up?") appears and is
 * struck through with an X (local f0–108 ≈ 01:02.21–01:06.09); then the two real
 * questions ("Which theme is moving?" / "Which stocks lead it?") resolve on screen
 * (local f108–271 ≈ 01:06.09–01:11.22). (spec §7)
 */
import { Sequence, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { COLORS } from "../theme";
import { fadeInOut, ease } from "../util/anim";

const PHASE1 = 108; // local frame where the wrong question gives way to the real ones

// Phase 1 — the wrong question, crossed out with an X.
const WrongQuestion = () => {
  const frame = useCurrentFrame();
  // box geometry (centred about x=960)
  const W = 980;
  const H = 150;
  const X = 960 - W / 2;
  const Y = 438;

  const op = fadeInOut(frame, PHASE1, 12, 12);
  // the two X strokes draw in once the text has landed
  const draw = ease(frame, [22, 44], [0, 1]);
  const diag = Math.hypot(W, H);

  return (
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, opacity: op }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 60,
          fontWeight: 800,
          letterSpacing: -0.6,
          color: COLORS.ink,
        }}
      >
        Which stock is going up?
      </div>

      {/* X drawn over the text to reject it */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        {[
          [0, 0, W, H],
          [W, 0, 0, H],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={COLORS.purple}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={diag}
            strokeDashoffset={diag * (1 - draw)}
          />
        ))}
      </svg>
    </div>
  );
};

// Phase 2 — the two real questions (the previous S10 visual, unchanged).
const RealQuestions = () => (
  <>
    <Heading x={96} y={150} width={1728} align="center" size={56}>
      So the real questions are:
    </Heading>

    {/* the two questions, centred */}
    <Chip x={660} y={452} width={600} variant="purple" size={36} delay={20} badge="?">
      Which theme is moving?
    </Chip>
    <Chip x={660} y={576} width={600} variant="cyan" size={36} delay={36} badge="?">
      Which stocks lead it?
    </Chip>
  </>
);

export const Scene10 = () => {
  return (
    <SceneWrap>
      <Sequence durationInFrames={PHASE1} name="S10a · wrong question (crossed out)">
        <WrongQuestion />
      </Sequence>

      <Sequence from={PHASE1} name="S10b · the real questions">
        <RealQuestions />
      </Sequence>
    </SceneWrap>
  );
};
