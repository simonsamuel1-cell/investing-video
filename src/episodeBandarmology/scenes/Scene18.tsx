/**
 * Scene 18 — Mistake 3: Concentration (4544, dur 226). Two cluster diagrams side
 * by side: left = one/two large indigo nodes "Concentrated"; right = many
 * scattered small dots "Scattered Noise". A "#1" crown floats uselessly above the
 * scattered side. Label "3 · Ignoring Concentration".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal, mulberry32 } from "../helpers";

const { colors, font, type } = theme;

const SCATTER = (() => {
  const rng = mulberry32(771);
  return Array.from({ length: 22 }).map(() => ({ x: rng() * 560, y: rng() * 360, r: 8 + rng() * 8 }));
})();

export const Scene18 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 110, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Concentration Beats Noise
      </div>

      {/* concentrated */}
      <div style={{ position: "absolute", left: 150, top: 280, width: 660, opacity: fadeIn(f, 20, 18) }}>
        <svg width={620} height={360} viewBox="0 0 620 360">
          <circle cx={230} cy={170} r={90} fill={colors.indigo} />
          <circle cx={420} cy={210} r={56} fill={colors.indigoDeep} />
        </svg>
        <div style={{ textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.indigoDeep }}>Concentrated</div>
      </div>

      {/* scattered noise + useless crown */}
      <div style={{ position: "absolute", left: 920, top: 280, width: 660, opacity: fadeIn(f, 60, 18) }}>
        <svg width={620} height={360} viewBox="0 0 620 360">
          {SCATTER.map((d, i) => (
            <circle key={i} cx={d.x + 20} cy={d.y} r={d.r} fill={colors.slateFaint} />
          ))}
          {/* crown floating uselessly */}
          <g transform="translate(300,20)" opacity={fadeIn(f, 120, 16)}>
            <path d="M -40 30 L -40 -10 L -18 14 L 0 -22 L 18 14 L 40 -10 L 40 30 Z" fill={colors.cyan} />
            <text x={0} y={66} textAnchor="middle" fill={colors.slateMute} fontSize={28} fontWeight={font.weights.bold} fontFamily={font.family}>#1</text>
          </g>
        </svg>
        <div style={{ textAlign: "center", fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.slate }}>Scattered Noise</div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 800, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold }}>3 · Ignoring Concentration</div>
      </div>
    </SafeArea>
  );
};
