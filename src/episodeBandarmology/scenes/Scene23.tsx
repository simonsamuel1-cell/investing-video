/**
 * Scene 23 — Step 1 Screen (5800, ends 6752). [NEEDS DATA]. A "1. Screen" label
 * above a centred phone template placeholder (real Screen capture drops in here).
 * Frame = comp − 5800.
 *
 * TODO[NEEDS DATA]: swap the PhoneFrame placeholder for the real Screen-step
 * capture (verbatim, no redraw) + on-screen data date.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, PhoneFrame } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

export const Scene23 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 938, 14); // end 6752
  const inOp = fadeIn(f, 0, 16);

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 66, textAlign: "left", fontSize: 56, fontWeight: font.weights.extrabold, color: colors.text, opacity: inOp }}>
          1. Screen
        </div>

        <PhoneFrame placeholder="Step 1 · Screen capture" op={inOp} />
      </AbsoluteFill>
    </SafeArea>
  );
};
