/**
 * MonitorStage — Step 3 Monitor title (comp 7839–8479), mounted once. Owns only
 * the "3. Monitor" title (top-left), kept continuous across Scene 30 (chart) and
 * Scene 31 (Market Radar) so it never remounts. Rendered as a TRANSPARENT overlay
 * (NOT SafeArea, which paints an opaque background that would hide the scenes
 * below). Frame = comp − 7839.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font } = theme;

export const MonitorStage = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 626, 14); // end 8479
  const titleOp = Math.min(fadeIn(f, 15, 16), stageOut); // 7854

  // Bridge: hold scene31.mp4's last frame across the 8191→8205 gap (local 352–366)
  // between Scene 30 and Scene 31, no transition — so the phone is continuous.
  const bridge = f >= 8191 - 7839 && f < 8205 - 7839;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: theme.font.family }}>
      {bridge && <CapturePhone cx={960} top={124} height={811} op={1} imageLayers={[{ src: "bandarmology/scene31-last.jpg", op: 1 }]} />}

      <div style={{ position: "absolute", left: 96, top: 66, textAlign: "left", fontSize: 56, fontWeight: font.weights.extrabold, color: colors.text, opacity: titleOp }}>
        3. Monitor
      </div>
    </AbsoluteFill>
  );
};
