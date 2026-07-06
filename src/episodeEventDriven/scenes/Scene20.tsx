/**
 * Scene 20 — The common mistake (comp 5037–5261, dur 224). A grey "Common
 * Mistake" banner, then the three-beat strip See News → Feel Excitement →
 * Jump In, ending on a cursor slam onto "Buy Now". No real ticker. Frame=local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CursorPing } from "../components";
import { textReveal, clamp01 } from "../helpers";

const c = theme.colors;
const BANNER = 0; // @0.0s
const STEPS = [Math.round(1.5 * 30), Math.round(3.0 * 30), Math.round(4.5 * 30)];
const LABELS = ["See News", "Feel Excitement", "Jump In"];

export const Scene20 = () => {
  const f = useCurrentFrame();
  const banner = textReveal(f, BANNER, 14);
  const slam = clamp01((f - STEPS[2]) / 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 240, padding: "10px 22px", borderRadius: theme.radius.chip, background: c.greyWash, color: c.grey, fontSize: 28, fontWeight: theme.font.weights.extrabold, letterSpacing: 0.4, ...banner }}>
        Common Mistake
      </div>

      <div style={{ position: "absolute", left: 96, top: 360, display: "flex", alignItems: "center", gap: 28 }}>
        {LABELS.map((l, i) => {
          const rv = textReveal(f, STEPS[i], 14);
          return (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ padding: "22px 30px", borderRadius: theme.radius.card, border: `2px solid ${c.greyLight}`, background: c.cardBg, fontSize: 34, fontWeight: theme.font.weights.bold, color: c.text, ...rv }}>{l}</div>
              {i < 2 && <span style={{ fontSize: 40, color: c.greyLight, opacity: rv.opacity }}>→</span>}
            </div>
          );
        })}
      </div>

      {/* Buy Now button + cursor slam */}
      <div style={{ position: "absolute", left: 96, top: 560, width: 300, textAlign: "center", padding: "22px 0", borderRadius: theme.radius.chip, background: c.indigo, color: c.white, fontSize: 34, fontWeight: theme.font.weights.extrabold, opacity: clamp01((f - STEPS[2]) / 14), boxShadow: `0 0 0 ${8 * slam}px ${c.indigoWash}` }}>
        Buy Now
      </div>
      <CursorPing x={300} y={600} frame={f} start={STEPS[2]} mode="slam" />
    </AbsoluteFill>
  );
};
