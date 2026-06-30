/**
 * Scene 30 — Step 3 Monitor: The Trigger (7839, dur 352). Rail flips to Monitor.
 * ⚠️ Descriptive of the pattern, NOT instructional. SchematicChart sequence:
 * (1) "Cost Area" band appears, (2) price holds flat near it, (3) volume spikes
 * (slate → cyan), (4) price lifts away. NO "buy now" cue, no entry arrow, no green.
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

// flat near cost, then lifts away in the last third
const PRICE = Array.from({ length: 80 }).map((_, i) => {
  const x = i / 79;
  let y = 0.4 + Math.sin(x * 22) * 0.02;
  if (x > 0.66) y = 0.4 + (x - 0.66) / 0.34 * 0.32;
  return { x, y };
});
const VOL = Array.from({ length: 24 }).map((_, i) => (i > 17 ? 0.9 : 0.25));

export const Scene30 = () => {
  const f = useCurrentFrame();
  const prog = tween(f, [10, 220], [0, 1]);
  const spikeOn = f > 200;

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        The Pattern To Watch
      </div>

      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        {/* cost-area band */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: fadeIn(f, 20, 18) }}>
          <rect x={0} y={0.54 * CH} width={CW} height={0.12 * CH} fill={colors.indigoTint} />
          <text x={10} y={0.54 * CH - 12} fill={colors.indigoDeep} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>Cost Area</text>
        </svg>

        <SchematicChart width={CW} height={CH} points={PRICE} progress={prog} volume={VOL} />

        {/* volume spike recolours slate → cyan on the last bars */}
        {spikeOn && (
          <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {[18, 19, 20, 21, 22, 23].map((i) => {
              const bw = (CW / 24) * 0.62;
              const cx = (i + 0.5) * (CW / 24);
              const bh = 0.9 * CH * 0.28;
              return <rect key={i} x={cx - bw / 2} y={CH - bh} width={bw} height={bh} rx={2} fill={colors.cyan} opacity={fadeIn(f, 200, 14)} />;
            })}
          </svg>
        )}
      </div>

      <div style={{ position: "absolute", left: 96, top: 800, width: 1600, fontSize: type.subhead, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 240, 18) }}>
        Hold Near Cost, Then A Lift On Volume — An Observed Pattern.
      </div>
    </SafeArea>
  );
};
