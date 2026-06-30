/**
 * Scene 25 — Big-Picture Question (6552, dur 200). Before→after toggle. Left:
 * scattered dots "Nobody In Charge" → arrow → right: consolidated indigo node
 * "Serious Money Building". One clean state change.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal, mulberry32 } from "../helpers";

const { colors, font, type } = theme;

const DOTS = (() => {
  const rng = mulberry32(2552);
  return Array.from({ length: 16 }).map(() => ({ x: rng() * 440, y: rng() * 300 }));
})();

export const Scene25 = () => {
  const f = useCurrentFrame();
  const merge = tween(f, [70, 150], [0, 1]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        The Big-Picture Question
      </div>

      {/* before: scattered */}
      <div style={{ position: "absolute", left: 150, top: 360, width: 560 }}>
        <svg width={500} height={340} viewBox="0 0 500 340">
          {DOTS.map((d, i) => {
            const cx = d.x + 30 + (250 - (d.x + 30)) * merge;
            const cy = d.y + 20 + (170 - (d.y + 20)) * merge;
            return <circle key={i} cx={cx} cy={cy} r={10} fill={colors.slateFaint} />;
          })}
        </svg>
        <div style={{ textAlign: "center", fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate }}>Nobody In Charge</div>
      </div>

      {/* arrow */}
      <div style={{ position: "absolute", left: 760, top: 500, fontSize: 72, color: colors.slateMute, opacity: fadeIn(f, 60, 16) }}>→</div>

      {/* after: consolidated node */}
      <div style={{ position: "absolute", left: 1010, top: 360, width: 560 }}>
        <svg width={500} height={340} viewBox="0 0 500 340">
          <circle cx={250} cy={170} r={20 + 80 * merge} fill={colors.indigo} opacity={merge} />
        </svg>
        <div style={{ textAlign: "center", fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.indigoDeep, opacity: fadeIn(f, 120, 16) }}>Serious Money Building</div>
      </div>
    </SafeArea>
  );
};
