/**
 * Scene 14 — Analysis chapter open (comp 3391–3530). Under the persistent
 * "02 · Analysis" header, a big two-line question lands: "Is this real / or just
 * noise?" at 3459, fading out by 3530. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal, fadeOut } from "../helpers";

const c = theme.colors;
const w = theme.font.weights;
const IN = 68; // comp 3459
const OUT = 139; // comp 3530

export const Scene14 = () => {
  const f = useCurrentFrame();
  const rv = textReveal(f, IN, 18);
  const op = Math.min(rv.opacity, fadeOut(f, OUT - 14, 14));
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontSize: 112, fontWeight: w.extrabold, color: c.text, lineHeight: 1.04, letterSpacing: -1, fontFamily: theme.font.family, opacity: op, transform: rv.transform }}>
        Is this <span style={{ color: c.cyan }}>real</span>
        <br />
        or just <span style={{ color: c.indigo }}>noise?</span>
      </div>
    </AbsoluteFill>
  );
};
