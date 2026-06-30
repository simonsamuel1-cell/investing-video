/**
 * Scene 19 — Mistake 4: Average Cost (4784, dur 214). Callback to Scene 14's
 * chart: the avg-cost line is hidden/greyed first and the price floats with a "?"
 * (~0–90); then the line snaps in resolving "Cheap" (near) vs "Stretched" (far)
 * as a neutral gauge (~f110). Label "4 · Ignoring Average Cost".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, SchematicChart } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

const CW = 1500;
const CH = 460;
const CX = 210;
const CY = 280;

const PRICE = Array.from({ length: 60 }).map((_, i) => {
  const x = i / 59;
  const y = 0.4 + x * 0.34 + Math.sin(x * 6) * 0.03;
  return { x, y };
});
const AVG_Y = 0.46;

export const Scene19 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 90], [0, 1]);
  const lineSnap = fadeIn(f, 110, 12);
  const qOp = fadeIn(f, 40, 14) * (1 - lineSnap);
  const priceY = (1 - 0.74) * CH;

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Don't Ignore Average Cost
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        <SchematicChart width={CW} height={CH} points={PRICE} progress={prog} refLines={lineSnap > 0.01 ? [{ y: AVG_Y, label: "Average Cost" }] : []} />
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <text x={CW - 60} y={priceY - 24} textAnchor="middle" fill={colors.slateMute} fontSize={72} fontWeight={font.weights.extrabold} fontFamily={font.family} opacity={qOp}>?</text>
        </svg>
      </div>

      <div style={{ position: "absolute", left: CX, top: CY + CH + 24, width: CW, display: "flex", justifyContent: "space-between", opacity: lineSnap }}>
        <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.cyanDeep }}>Cheap (Near)</span>
        <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate }}>Stretched (Far)</span>
      </div>

      <div style={{ position: "absolute", left: 96, top: 880, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold }}>4 · Ignoring Average Cost</div>
      </div>
    </SafeArea>
  );
};
