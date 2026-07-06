/**
 * Scene 26 — Close (comp 6154–6370, dur 216). A muted "Fastest Finger" card
 * (grey, left) vs an in-focus "Clearest Mind" card (indigo, right), the closing
 * takeaway line, then a fade to the brand end-state. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal, clamp01, fadeOut } from "../helpers";

const c = theme.colors;
const FINGER = Math.round(0.5 * 30); // @0.5s
const MIND = Math.round(2.0 * 30); // @2.0s
const TAKE = Math.round(4.0 * 30); // @4.0s
const END = Math.round(6.0 * 30); // @6.0s

export const Scene26 = () => {
  const f = useCurrentFrame();
  const finger = textReveal(f, FINGER, 16);
  const mind = textReveal(f, MIND, 16);
  const take = textReveal(f, TAKE, 20);
  const cardsOut = fadeOut(f, END, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ opacity: cardsOut }}>
        {/* Fastest Finger — muted */}
        <div style={{ position: "absolute", left: 250, top: 300, width: 560, height: 300, borderRadius: theme.radius.card, background: c.greyWash, border: `2px solid ${c.greyLight}`, padding: 36, boxSizing: "border-box", ...finger }}>
          <div style={{ fontSize: 24, color: c.greyLight, fontWeight: theme.font.weights.semibold }}>Not this</div>
          <div style={{ fontSize: 52, color: c.grey, fontWeight: theme.font.weights.extrabold, marginTop: 16 }}>Fastest Finger</div>
        </div>
        {/* Clearest Mind — in focus */}
        <div style={{ position: "absolute", left: 1110, top: 300, width: 560, height: 300, borderRadius: theme.radius.card, background: c.indigoWash, border: `2px solid ${c.indigo}`, padding: 36, boxSizing: "border-box", boxShadow: "0 18px 45px rgba(95,77,238,0.18)", ...mind }}>
          <div style={{ fontSize: 24, color: c.indigo, fontWeight: theme.font.weights.semibold }}>This</div>
          <div style={{ fontSize: 52, color: c.text, fontWeight: theme.font.weights.extrabold, marginTop: 16 }}>Clearest Mind</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 680, width: 1728, textAlign: "center", fontSize: 44, fontWeight: theme.font.weights.bold, color: c.text, ...take }}>
        The edge isn&rsquo;t seeing the news first — it&rsquo;s reading it clearly.
      </div>
      <div style={{ position: "absolute", left: 96, top: 780, width: 1728, textAlign: "center", fontSize: 26, fontWeight: theme.font.weights.semibold, color: c.grey, opacity: clamp01((f - END) / 20) }}>
        Tuntun Academy
      </div>
    </AbsoluteFill>
  );
};
