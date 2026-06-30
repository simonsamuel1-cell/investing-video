/**
 * Scene 14 — Average Cost Matters Most (3453, dur 336). SchematicChart with a
 * horizontal "Average Cost" dashed indigo line and a current-price marker above.
 * A measured distance bracket animates between price and avg-cost (~f120),
 * labeled "Early?" (close) ↔ "Late?" (far) as a NEUTRAL spectrum — not a signal.
 * Figures illustrative (no Rp values unless a real Broker Summary is supplied).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, SchematicChart } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

const CW = 1500;
const CH = 480;
const CX = 210;
const CY = 300;

// gentle rising price line; current price ends well above the avg-cost line
const PRICE = Array.from({ length: 60 }).map((_, i) => {
  const x = i / 59;
  const y = 0.32 + x * 0.42 + Math.sin(x * 7) * 0.03;
  return { x, y };
});
const AVG_Y = 0.4;

export const Scene14 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const bracket = fadeIn(f, 120, 18);
  const priceY = (1 - 0.74) * CH;
  const avgY = (1 - AVG_Y) * CH;

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Average Cost Matters Most
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <SchematicChart
          width={CW}
          height={CH}
          points={PRICE}
          progress={prog}
          refLines={[{ y: AVG_Y, label: "Average Cost" }]}
        />
        {/* distance bracket between current price and avg cost */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: bracket }}>
          <circle cx={CW - 40} cy={priceY} r={12} fill={colors.indigo} />
          <line x1={CW - 40} y1={priceY} x2={CW - 40} y2={avgY} stroke={colors.slate} strokeWidth={3} strokeDasharray="6 6" />
          <line x1={CW - 60} y1={priceY} x2={CW - 20} y2={priceY} stroke={colors.slate} strokeWidth={3} />
          <line x1={CW - 60} y1={avgY} x2={CW - 20} y2={avgY} stroke={colors.slate} strokeWidth={3} />
        </svg>
      </div>

      {/* neutral spectrum labels */}
      <div style={{ position: "absolute", left: CX, top: CY + CH + 28, width: CW, display: "flex", justifyContent: "space-between", opacity: bracket }}>
        <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.cyanDeep }}>Early? (Close)</span>
        <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate }}>Late? (Far)</span>
      </div>
    </SafeArea>
  );
};
