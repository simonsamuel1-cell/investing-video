/**
 * Scene 32 — (8479, ends 8690). Continuous from Scene 31: the Market Radar phone
 * freezes on scene31.mp4's last frame (scene31-last.jpg) at the same position, then
 * at 8500 slides 100px left. Beside it (right): a crossed-out "someone is quietly
 * buying" (8555) and, below, "someone is making their move" (8611).
 * Frame = comp − 8479.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, tween } from "../helpers";

const { colors, font } = theme;

const PH = 811; // same as Scene 30/31
const PT = 124;

export const Scene32 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 197, 14); // end 8690
  const cx = tween(f, [21, 39], [960, 860]); // 8500: slide 100px left
  const t1 = fadeIn(f, 76, 16); // 8555 (crossed)
  const t2 = fadeIn(f, 132, 16); // 8611

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        {/* frozen last frame of scene31.mp4 — continuous with Scene 31 */}
        <CapturePhone cx={cx} top={PT} height={PH} op={1} imageLayers={[{ src: "bandarmology/scene31-last.jpg", op: 1 }]} />

        <div style={{ position: "absolute", left: 1105, top: 450, width: 710, fontSize: 44, fontWeight: font.weights.bold, color: colors.slate, textDecoration: "line-through", opacity: t1 }}>
          someone is quietly buying
        </div>
        <div style={{ position: "absolute", left: 1105, top: 545, width: 710, fontSize: 46, fontWeight: font.weights.extrabold, color: colors.indigo, opacity: t2 }}>
          someone is making their move
        </div>
      </AbsoluteFill>
    </SafeArea>
  );
};
