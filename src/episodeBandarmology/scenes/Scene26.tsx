/**
 * Scene 26 — Step 2 Verify: shareholder count (6776, dur 259). Rail → Verify
 * (WorkflowStage). A declining step-LineChart "Number Of Shareholders"
 * 22,140 → 18,005 → 14,905, a big counter ticking down, and a holder pictogram
 * cluster shrinking. Note (sentence case). Indigo line, neutral chrome. Illustrative.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, LineChart } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn } from "../helpers";

const { colors, font, type } = theme;

const PTS = [
  { x: 0, y: 0.9 },
  { x: 0.25, y: 0.9 },
  { x: 0.3, y: 0.6 },
  { x: 0.6, y: 0.6 },
  { x: 0.65, y: 0.35 },
  { x: 1, y: 0.35 },
];

export const Scene26 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const count = Math.round(tween(f, [20, 180], [22140, 14905]));
  const dotsGone = Math.round(tween(f, [20, 180], [0, 24]));

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Number Of Shareholders
      </div>

      <div style={{ position: "absolute", left: 96, top: 320, width: 900, height: 420 }}>
        <LineChart width={900} height={420} points={PTS} progress={prog} step area />
      </div>

      {/* counter + pictogram */}
      <div style={{ position: "absolute", left: 1060, top: 340, width: 620, textAlign: "center", opacity: fadeIn(f, 20, 18) }}>
        <div style={{ fontSize: type.display, fontWeight: font.weights.extrabold, color: colors.indigoDeep, fontVariantNumeric: "tabular-nums" }}>{count.toLocaleString("en-US")}</div>
        <svg width={560} height={180} viewBox="0 0 560 180" style={{ marginTop: 20 }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const col = i % 10;
            const row = Math.floor(i / 10);
            return <circle key={i} cx={28 + col * 56} cy={24 + row * 50} r={14} fill={colors.indigo} opacity={i < 40 - dotsGone ? 1 : 0.12} />;
          })}
        </svg>
      </div>

      <div style={{ position: "absolute", left: 96, top: 800, width: 1500, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, opacity: fadeIn(f, 180, 18) }}>
        Fewer holders can mean shares concentrating into fewer hands.
      </div>

    </SafeArea>
  );
};
