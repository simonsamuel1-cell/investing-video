/**
 * S0102Stage — Scenes 01–02 capture layer, mounted once (comp 0, dur 571) so the
 * scene01-02.mp4 recording plays continuously. Owns the scaled phone, the two
 * timed captions, and the running-trade row highlights. Frame = absolute comp
 * frame (sequence starts at 0). Scene01/Scene02 files are intentionally empty.
 *
 * Beats (absolute frames):
 *   106–218  caption "Most of us walk in and buy a few lots at the going price."
 *   218–325  (no text)
 *   325–421  caption "Players moving inventory in enormous quantities" (beside-right)
 *   421–570  (no text)
 *   475→     highlight boxes on the big-lot rows (1316, 2079, 550, 250)
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const { colors, font, type } = theme;

// phone: scaled ~30% up from the previous 806px; centered, may exceed margins.
const PHONE = { cx: 960, top: 116, height: 1048 };
const SCREEN_TOP = PHONE.top; // screen top (abs); CapturePhone body top = top − bezel
const SCREEN_H = PHONE.height;
const SCREEN_W = Math.round(PHONE.height * (980 / 1920));
const SCREEN_LEFT = PHONE.cx - SCREEN_W / 2;

// video-native y (of 1920) for the target rows — tuned against a render.
const ROW_VY = [592, 896, 1204, 1420];
const ROW_H_VID = 90;
const vy2y = (vy: number) => SCREEN_TOP + (vy / 1920) * SCREEN_H;
const rowH = (ROW_H_VID / 1920) * SCREEN_H;

export const S0102Stage = () => {
  const f = useCurrentFrame();
  const cap1 = Math.min(fadeIn(f, 106, 12), fadeOut(f, 206, 12));
  const cap2 = Math.min(fadeIn(f, 325, 12), fadeOut(f, 409, 12));
  const hi = fadeIn(f, 475, 12);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <CapturePhone video="bandarmology/scene01-02.mp4" cx={PHONE.cx} top={PHONE.top} height={PHONE.height} op={fadeIn(f, 0, 12)} />

      {/* row highlights on the running-trade tape */}
      {hi > 0 &&
        ROW_VY.map((vy, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: SCREEN_LEFT + SCREEN_W * 0.03,
              top: vy2y(vy) - rowH / 2,
              width: SCREEN_W * 0.94,
              height: rowH,
              border: `3px solid ${colors.indigo}`,
              borderRadius: theme.radius.sm,
              opacity: hi,
              boxSizing: "border-box",
            }}
          />
        ))}

      {/* caption 1 — beside-left */}
      <div style={{ position: "absolute", left: 96, top: 430, width: 560, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, opacity: cap1 }}>
        Most of us walk in and buy a few lots at the going price.
      </div>

      {/* caption 2 — beside-right */}
      <div style={{ position: "absolute", left: 1264, top: 430, width: 560, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, opacity: cap2 }}>
        Players moving inventory in enormous quantities.
      </div>
    </AbsoluteFill>
  );
};
