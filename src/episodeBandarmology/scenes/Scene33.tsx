/**
 * Scene 33 — Short-term traders: risk panel (8670, dur 350). ⚠️ STRONGEST
 * compliance flag. Leads with risk discipline; NO entry marker on any chart. A
 * "Risk Discipline" Card with a "Signals can fail" banner + three fields:
 * Position Size = "size to your risk tolerance" (non-numeric, decision #3) ·
 * Exit Plan = "predefined stop" · Manage Risk. The "more efficient" clause stays
 * audio-only.
 *
 * NOTE: recommend OJK advice-line review before lock.
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const FIELDS = [
  { k: "Position Size", v: "Size to your risk tolerance", at: 150 },
  { k: "Exit Plan", v: "Predefined stop", at: 200 },
  { k: "Manage Risk", v: "Decide before you act", at: 250 },
];

export const Scene33 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 360, top: 240, width: 1200, boxSizing: "border-box", background: colors.cardWhite, border: `2px solid ${colors.indigo}`, borderRadius: radius.lg, overflow: "hidden", opacity: fadeIn(f, 8, 18) }}>
        {/* caveat banner */}
        <div style={{ background: colors.indigo, color: colors.white, padding: "22px 32px", fontSize: type.subhead, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
          Signals can fail
        </div>
        <div style={{ padding: 32 }}>
          <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, marginBottom: 20 }}>Risk Discipline</div>
          {FIELDS.map((fl) => (
            <div key={fl.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", borderBottom: `1px solid ${colors.divider}`, transform: `scale(${popIn(f, fps, fl.at, false)})`, transformOrigin: "left center", opacity: fadeIn(f, fl.at, 14) }}>
              <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate }}>{fl.k}</span>
              <span style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.cyanDeep }}>{fl.v}</span>
            </div>
          ))}
        </div>
      </div>
    </SafeArea>
  );
};
