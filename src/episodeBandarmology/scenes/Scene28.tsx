/**
 * Scene 28 — Verify: Volume Dry-Up / Squeeze (7342, dur 261). SchematicChart:
 * price compresses into a narrow channel (two converging dashed bounds) while the
 * volume histogram below shrinks (slate bars, NOT green/red). Squeeze zone labeled
 * "Quiet Squeeze". Ties back to Accumulation (Scene 6).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, SchematicChart } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

const CW = 1500;
const CH = 440;
const CX = 210;
const CY = 300;

// price oscillates with decaying amplitude (a squeeze)
const PRICE = Array.from({ length: 80 }).map((_, i) => {
  const x = i / 79;
  const amp = 0.22 * (1 - x * 0.8);
  const y = 0.55 + Math.sin(x * 28) * amp;
  return { x, y };
});
// volume bars shrink toward the right
const VOL = Array.from({ length: 24 }).map((_, i) => 1 - (i / 23) * 0.85);

export const Scene28 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 150], [0, 1]);
  const boundsOp = fadeIn(f, 90, 18);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Volume Dry-Up
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <SchematicChart width={CW} height={CH} points={PRICE} progress={prog} volume={VOL} />
        {/* converging dashed channel bounds */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: boundsOp }}>
          <line x1={0} y1={0.18 * CH} x2={CW} y2={0.4 * CH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          <line x1={0} y1={0.74 * CH} x2={CW} y2={0.52 * CH} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          <text x={CW - 10} y={0.4 * CH} textAnchor="end" fill={colors.cyanDeep} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Quiet Squeeze</text>
        </svg>
      </div>
    </SafeArea>
  );
};
