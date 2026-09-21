/**
 * Scene 29 — Verify takeaway (7615, ends 7806). Three lines build in, centred:
 * "These aren't needed" (7631), "but if all lined up," (7685),
 * "your read gets steadier." (7734). Frame = comp − 7615.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

const LINES = [
  { t: "These aren't needed", at: 16 }, // 7631
  { t: "but if all lined up,", at: 70 }, // 7685
  { t: "your read gets steadier.", at: 119 }, // 7734
];

export const Scene29 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 177, 14); // end 7806

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 396, width: 1728, textAlign: "center", fontSize: 62, lineHeight: 1.32, fontWeight: font.weights.extrabold, color: colors.text }}>
          {LINES.map((l) => (
            <div key={l.t} style={{ opacity: fadeIn(f, l.at, 16) }}>
              {l.t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SafeArea>
  );
};
