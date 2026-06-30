/**
 * Scene 03 — Bandarmology (571, dur 175). Warehouse shrinks to a node (~0–40);
 * the word "Bandarmology" lands center at 96px indigo via textReveal (~f50);
 * subtitle "Following The Big Players" (~f90). Term kept verbatim (not translated).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene03 = () => {
  const f = useCurrentFrame();
  const shrink = tween(f, [0, 40], [1, 0.16]);
  const nodeOp = tween(f, [30, 46], [1, 0]);

  return (
    <SafeArea>
      <svg width={1728} height={300} viewBox="0 0 1728 300" style={{ position: "absolute", left: 96, top: 250, overflow: "visible" }}>
        <g transform={`translate(864,150) scale(${shrink})`} opacity={nodeOp} fill={colors.indigoTint} stroke={colors.indigo} strokeWidth={4}>
          <rect x={-120} y={-90} width={240} height={180} rx={10} />
        </g>
        <circle cx={864} cy={150} r={16} fill={colors.indigo} opacity={tween(f, [38, 50], [0, 1])} />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 420,
          width: 1728,
          textAlign: "center",
          fontSize: type.display,
          fontWeight: font.weights.extrabold,
          color: colors.indigo,
          letterSpacing: -1,
          ...textReveal(f, 50, 20),
        }}
      >
        Bandarmology
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 560,
          width: 1728,
          textAlign: "center",
          fontSize: type.subhead,
          fontWeight: font.weights.bold,
          color: colors.slate,
          ...textReveal(f, 90, 18),
        }}
      >
        Following The Big Players
      </div>
    </SafeArea>
  );
};
