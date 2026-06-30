/**
 * Scene 26 — Step 2 Verify: Shareholder Count (6776, dur 259). Rail flips to
 * Verify (WorkflowStage). A shareholder-count figure ticks DOWN over time while
 * holder-dots merge many→few. Indigo dots, cyan count label. Header "Shrinking
 * Shareholder Count". Numbers are ILLUSTRATIVE (no real capture supplied).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal, mulberry32 } from "../helpers";

const { colors, font, type } = theme;

const HOLDERS = (() => {
  const rng = mulberry32(6776);
  return Array.from({ length: 40 }).map(() => ({ x: rng() * 600, y: rng() * 320 }));
})();

export const Scene26 = () => {
  const f = useCurrentFrame();
  const merge = tween(f, [40, 180], [0, 1]);
  const count = Math.round(tween(f, [40, 180], [12400, 7100]));
  const visible = Math.round(40 - merge * 28); // dots fade as they merge

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        Shrinking Shareholder Count
      </div>

      {/* merging holder dots */}
      <svg width={680} height={360} viewBox="0 0 680 360" style={{ position: "absolute", left: 150, top: 340 }}>
        {HOLDERS.map((d, i) => {
          const cx = d.x + 40 + (340 - (d.x + 40)) * merge;
          const cy = d.y + 20 + (180 - (d.y + 20)) * merge;
          const op = i < visible ? 1 : 1 - merge;
          return <circle key={i} cx={cx} cy={cy} r={9} fill={colors.indigo} opacity={op} />;
        })}
      </svg>

      {/* count label */}
      <div style={{ position: "absolute", left: 1000, top: 420, width: 600, textAlign: "center", opacity: fadeIn(f, 30, 18) }}>
        <div style={{ fontSize: type.display, fontWeight: font.weights.extrabold, color: colors.cyanDeep, fontVariantNumeric: "tabular-nums" }}>{count.toLocaleString("en-US")}</div>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginTop: 8 }}>Shareholders</div>
        <div style={{ fontSize: type.chip, fontWeight: font.weights.medium, color: colors.slateMute, marginTop: 18 }}>Illustrative</div>
      </div>
    </SafeArea>
  );
};
