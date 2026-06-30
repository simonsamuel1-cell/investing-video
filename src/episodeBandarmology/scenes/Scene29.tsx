/**
 * Scene 29 — Clues Line Up (7616, dur 178). Four Verify clues as toggle chips
 * (shareholder count, insider, foreign, squeeze); several switch "on" (cyan fill,
 * bounce OK — UI). A "Confidence" steadiness indicator firms up but stays CAPPED
 * (echo Scene 21), not a certainty meter. Label "Several Lining Up = Steadier Read".
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const CLUES = [
  { label: "Shareholder Count", at: 20 },
  { label: "Insider Buying", at: 50 },
  { label: "Foreign Buying", at: 80 },
  { label: "Quiet Squeeze", at: 110 },
];

export const Scene29 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conf = tween(f, [40, 150], [0.15, 0.6]); // capped

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, ...textReveal(f, 8, 18) }}>
        The Clues Line Up
      </div>

      {/* toggle chips */}
      <div style={{ position: "absolute", left: 150, top: 360, width: 760, display: "flex", flexDirection: "column", gap: 24 }}>
        {CLUES.map((c) => {
          const on = f >= c.at + 8;
          const grow = popIn(f, fps, c.at, true);
          return (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 20, opacity: fadeIn(f, c.at, 12) }}>
              <span style={{ transform: `scale(${on ? grow : 1})`, transformOrigin: "left center", padding: "14px 26px", borderRadius: radius.pill, background: on ? colors.cyan : colors.white, border: `2px solid ${colors.cyan}`, color: on ? colors.white : colors.cyanDeep, fontSize: type.descriptor, fontWeight: font.weights.bold }}>{c.label}</span>
            </div>
          );
        })}
      </div>

      {/* capped confidence bar */}
      <div style={{ position: "absolute", left: 1010, top: 420, width: 560 }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 18 }}>Confidence</div>
        <div style={{ width: "100%", height: 44, borderRadius: 22, background: colors.cyanTint, overflow: "hidden" }}>
          <div style={{ width: `${conf * 100}%`, height: "100%", background: colors.indigo, borderRadius: 22 }} />
        </div>
        <div style={{ fontSize: type.chip, fontWeight: font.weights.medium, color: colors.slateMute, marginTop: 16 }}>Steadier Read — Still Not Certainty</div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 800, width: 1600, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 130, 18) }}>
        Several Lining Up = Steadier Read
      </div>
    </SafeArea>
  );
};
