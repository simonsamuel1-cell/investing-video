/**
 * S18 (A) — don't start from a stock. Struck-through "STOCK" → arrow → "THEME"
 * (purple). Punchy. (spec §7)
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

export const Scene18 = () => {
  const frame = useCurrentFrame();
  const strike = ease(frame, [18, 38], [0, 1]);
  const arrowOp = fadeIn(frame, 34, 10);
  const themeOp = fadeIn(frame, 44, 12);
  const themeScale = ease(frame, [44, 66], [0.8, 1]);

  return (
    <SceneWrap>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {/* STOCK struck through */}
          <div style={{ position: "relative", opacity: fadeIn(frame, 6, 12) }}>
            <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: -1, color: COLORS.ink }}>STOCK</span>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                height: 9,
                width: `${strike * 100}%`,
                background: COLORS.cyan,
                borderRadius: 5,
              }}
            />
          </div>

          {/* arrow */}
          <svg width={120} height={60} style={{ opacity: arrowOp }}>
            <line x1={4} y1={30} x2={96} y2={30} stroke={COLORS.purple} strokeWidth={8} strokeLinecap="round" />
            <polygon points="92,16 120,30 92,44" fill={COLORS.purple} />
          </svg>

          {/* THEME */}
          <span
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: -1,
              color: COLORS.purple,
              opacity: themeOp,
              transform: `scale(${themeScale})`,
              display: "inline-block",
            }}
          >
            THEME
          </span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
