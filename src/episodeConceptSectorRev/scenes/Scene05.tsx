/**
 * S5 (A) — brief bridge. A cyan downward chevron + a thin line revealing a faint
 * layer beneath. Minimal. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { COLORS } from "../theme";
import { fadeIn, ease, rise } from "../util/anim";

export const Scene05 = () => {
  const frame = useCurrentFrame();
  const topY = 300;
  const lineGrow = ease(frame, [6, 34], [0, 230]);
  const chevY = topY + 250 + 18 * Math.sin(frame * 0.18); // gentle bob
  const layerOp = fadeIn(frame, 26, 18);
  const labelOp = fadeIn(frame, 36, 14);

  return (
    <SceneWrap>
      {/* top surface label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: topY,
          width: 1920,
          textAlign: "center",
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.black,
          opacity: fadeIn(frame, 4, 12),
          transform: `translateY(${rise(frame, 4, 14, 16)}px)`,
        }}
      >
        Price is the surface.
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
        <line x1={960} y1={topY + 70} x2={960} y2={topY + 70 + lineGrow} stroke={COLORS.cyan} strokeWidth={3} />
        {/* downward chevron */}
        <polyline
          points={`${960 - 26},${chevY} ${960},${chevY + 26} ${960 + 26},${chevY}`}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={fadeIn(frame, 18, 8)}
        />
      </svg>

      {/* faint layer beneath */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 660,
          width: 800,
          height: 150,
          borderRadius: 24,
          border: `2px solid ${COLORS.purple}`,
          background: COLORS.purpleWash,
          opacity: layerOp,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.black,
        }}
      >
        <span style={{ opacity: labelOp }}>What moves beneath it</span>
      </div>
    </SceneWrap>
  );
};
