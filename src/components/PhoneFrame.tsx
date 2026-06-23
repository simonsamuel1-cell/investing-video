/**
 * PhoneFrame (G1) — wraps a RAW recording/screenshot in a THIN-border phone
 * template (a slim bezel traced around the screen), replacing the old thick
 * Placeholder-02.png device body.
 *
 * The screen rectangle keeps the exact position/size of the previous device-body
 * cutout (CUT below, scaled ×1.03), so every per-scene callout/cyan-box that was
 * calibrated against the screen stays aligned — only the bezel changed. Letterbox
 * gaps (recordings are wider than the screen) now read as black, like a real phone.
 *
 * Cutout: the screen rect is sized to the SCREEN CONTENT aspect (980:1920 ≈ 0.5104)
 * and kept vertically centred at the same point as the old taller cutout, so the
 * content now fills top-to-bottom with NO letterbox — yet lands in the exact same
 * on-canvas position, keeping every calibrated callout/box aligned. Width is
 * unchanged (L/R 6.65%). Pre-framed assets are NOT wrapped in this.
 */
import {
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ReactNode, CSSProperties } from "react";
import { COLORS } from "../theme";
import { fadeIn, rise, springUp, ease } from "../util/anim";

export const FRAME_ASPECT = 1924 / 3890; // ≈ 0.4946 (w:h) — unchanged so scene geometry holds
// top/h tightened from the old {0.0308, 0.9381} so the rect aspect = content aspect
// (cw/ch = 0.867·0.4946/0.8402 ≈ 0.5104); centre stays at ≈0.5h so content doesn't move.
const CUT = { left: 0.0665, top: 0.0798, w: 0.867, h: 0.8402 };
const BORDER_RATIO = 0.011; // thin bezel as a fraction of phone width

const SCREEN: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

export const PhoneFrame = ({
  x,
  y,
  w,
  video,
  img,
  startSec = 0,
  playbackRate = 1,
  screenScale = 1,
  children,
  delay = 0,
  enterDur = 12,
  springScale = true,
}: {
  x: number;
  y: number;
  w: number;
  video?: string;
  img?: string;
  startSec?: number;
  playbackRate?: number;
  screenScale?: number;
  children?: ReactNode;
  delay?: number;
  enterDur?: number;
  // springScale: true → springy scale settle (default); false → linear ease that
  // finishes exactly at delay+enterDur (used when an entrance must end on a frame).
  springScale?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w / FRAME_ASPECT;
  const cl = w * CUT.left;
  const ct = h * CUT.top;
  const cw = w * CUT.w;
  const ch = h * CUT.h;
  const border = Math.max(2, cw * BORDER_RATIO);
  const radius = cw * 0.085;

  const opacity = fadeIn(frame, delay, enterDur);
  const sp = springScale ? springUp(frame, fps, delay) : ease(frame, [delay, delay + enterDur], [0, 1]);
  const scale = 0.96 + 0.04 * sp;
  const ty = rise(frame, delay, enterDur, 12);

  const content =
    children ??
    (video ? (
      <OffthreadVideo
        src={staticFile(video)}
        trimBefore={Math.round(startSec * 30)}
        playbackRate={playbackRate}
        muted
        style={SCREEN}
      />
    ) : img ? (
      <Img src={staticFile(img)} style={SCREEN} />
    ) : null);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `translateY(${ty}px) scale(${scale})`,
      }}
    >
      {/* screen content, clipped to the screen rect — identical geometry to the
          old cutout (×1.03) so calibrated callouts stay aligned. */}
      <div
        style={{
          position: "absolute",
          left: cl,
          top: ct,
          width: cw,
          height: ch,
          overflow: "hidden",
          borderRadius: radius,
          background: COLORS.black,
          scale: 1.03,
        }}
      >
        {/* per-scene zoom of the screen content (default 1) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", scale: screenScale }}>
          {content}
        </div>
      </div>
      {/* thin bezel traced around the screen */}
      <div
        style={{
          position: "absolute",
          left: cl,
          top: ct,
          width: cw,
          height: ch,
          borderRadius: radius,
          border: `${border}px solid ${COLORS.ink}`,
          boxShadow: "0 18px 45px rgba(0,0,0,0.16)",
          pointerEvents: "none",
          scale: 1.03,
        }}
      />
    </div>
  );
};
