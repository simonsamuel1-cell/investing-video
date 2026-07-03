/**
 * Scene 22 — Three-steps intro (5609, ends 5800). A centred two-line title, then
 * the three step names stack in below it as identical indigo-tint labels (black
 * text): Screen (5713), Verify (5739), Monitor (5763). All fade out by 5800.
 * Frame = comp − 5609.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font, radius } = theme;

const STEPS = [
  { t: "Screen", at: 104 }, // 5713
  { t: "Verify", at: 130 }, // 5739
  { t: "Monitor", at: 154 }, // 5763
];

export const Scene22 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 177, 14); // all end 5800

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 264, width: 1728, textAlign: "center", fontSize: 76, lineHeight: 1.12, fontWeight: font.weights.extrabold, color: colors.text, opacity: fadeIn(f, 0, 18) }}>
          3 Steps to work with
          <br />
          Tuntun tools
        </div>

        <div style={{ position: "absolute", left: 0, top: 508, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          {STEPS.map((s) => (
            <div
              key={s.t}
              style={{ width: 320, textAlign: "center", padding: "14px 0", borderRadius: radius.pill, background: colors.indigoTint, border: `2px solid ${colors.indigo}`, color: colors.text, fontSize: 40, fontWeight: font.weights.bold, opacity: fadeIn(f, s.at, 14) }}
            >
              {s.t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SafeArea>
  );
};
