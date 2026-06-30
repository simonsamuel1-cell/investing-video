/**
 * Scene 18 — Mistake 3: concentration donuts (4544, dur 226). Two Donuts (indigo
 * shades + neutral): left "Concentrated" top 2 brokers = 78%; right "Scattered"
 * top broker 14%, long tail. A "#1" crown floats uselessly over the scattered
 * donut. Title "3 · Ignoring Concentration".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Donut, IllustrationTag } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, tween } from "../helpers";

const { colors, font, type } = theme;

const CONC = [
  { value: 78, color: colors.indigo },
  { value: 22, color: colors.slateFaint },
];
const SCAT = [
  { value: 14, color: colors.indigo },
  { value: 12, color: colors.indigoTint },
  { value: 11, color: colors.cyan },
  { value: 10, color: colors.cyanTint },
  { value: 53, color: colors.slateFaint },
];

export const Scene18 = () => {
  const f = useCurrentFrame();
  const reveal = tween(f, [20, 120], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Concentration beats noise
      </div>

      <Donut cx={520} cy={560} r={150} segments={CONC} reveal={reveal} centerLabel="78%" />
      <Donut cx={1320} cy={560} r={150} segments={SCAT} reveal={reveal} centerLabel="14%" />

      {/* crown over scattered */}
      <svg width={140} height={120} viewBox="0 0 140 120" style={{ position: "absolute", left: 1250, top: 300, opacity: fadeIn(f, 130, 16) }}>
        <path d="M 20 90 L 20 30 L 50 64 L 70 18 L 90 64 L 120 30 L 120 90 Z" fill={colors.cyan} />
        <text x={70} y={114} textAnchor="middle" fill={colors.slateMute} fontSize={26} fontWeight={font.weights.bold} fontFamily={font.family}>#1</text>
      </svg>

      <div style={{ position: "absolute", left: 360, top: 760, width: 320, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.indigoDeep }}>Concentrated</div>
      <div style={{ position: "absolute", left: 1160, top: 760, width: 320, textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.slate }}>Scattered</div>

      <div style={{ position: "absolute", left: 96, top: 860, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>
        3 · Ignoring Concentration
      </div>

      <IllustrationTag left={1620} top={150} />
    </SafeArea>
  );
};
