/**
 * Scene 31 — Market Radar (8205, ends 8479). Just the Market Radar capture
 * (scene31.mp4) in a centred phone, same height as Scene 30 (811). The
 * "3. Monitor" title is owned by MonitorStage. A highlight box (wider than the
 * phone) frames the Market Radar section from 8324. The phone does NOT fade at the
 * end — Scene 32 freezes its last frame and continues seamlessly. Frame = comp − 8205.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, blinkTwice } from "../helpers";

const { colors, radius } = theme;

const PH = 811; // same height as Scene 30
const PT = 124;
const my = (iy: number) => PT + (iy / 1920) * PH; // image-y (0..1920) → screen
// Market Radar section (heading + alert card); box runs 20px past the phone body
// (426px, centred on 960) on each side.
const RADAR = { left: 747 - 20, top: my(900), width: 426 + 40, height: my(1165) - my(900) };

export const Scene31 = () => {
  const f = useCurrentFrame();
  const phoneOp = fadeIn(f, 6, 12); // stays full → continuous into Scene 32
  const radarBox = blinkTwice(f, 119, 274); // 8324, two blinks then hold (fades by 8479)

  return (
    <SafeArea>
      <CapturePhone video="bandarmology/scene31.mp4" cx={960} top={PT} height={PH} op={phoneOp} />

      {radarBox > 0 && (
        <div style={{ position: "absolute", left: RADAR.left, top: RADAR.top, width: RADAR.width, height: RADAR.height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: radarBox, boxSizing: "border-box" }} />
      )}
    </SafeArea>
  );
};
