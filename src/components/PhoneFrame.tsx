/**
 * PhoneFrame (G1) — wraps a RAW recording/screenshot inside the Placeholder-02.png
 * black device body.
 *
 * NOTE: the supplied frame PNG's screen area is OPAQUE WHITE (not a transparent
 * cutout as the spec assumed), so the documented "white fill → recording → frame
 * PNG" order hides the recording. We instead render the frame PNG UNDERNEATH and
 * the recording on TOP, clipped to the screen cutout — any letterbox/corner gap
 * reveals the PNG's own white screen, so the result is identical and the recording
 * stays visible.
 *
 * Cutout: L/R 6.65%, T 3.08%, B 3.11% (aspect ≈ 0.457). Screen content is fit by
 * WIDTH (objectFit:contain) so a wider recording (0.510) letterboxes against the
 * white screen — never cropped. Pre-framed assets are NOT wrapped in this.
 */
import {
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ReactNode, CSSProperties } from "react";
import { ASSETS } from "../timeline";
import { fadeIn, rise, springUp } from "../util/anim";

export const FRAME_ASPECT = 1924 / 3890; // ≈ 0.4946 (w:h)
const CUT = { left: 0.0665, top: 0.0308, w: 0.867, h: 0.9381 };

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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w / FRAME_ASPECT;
  const cl = w * CUT.left;
  const ct = h * CUT.top;
  const cw = w * CUT.w;
  const ch = h * CUT.h;

  const opacity = fadeIn(frame, delay, 12);
  const scale = 0.96 + 0.04 * springUp(frame, fps, delay);
  const ty = rise(frame, delay, 12, 12);

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
      {/* device body underneath (bezel + its own white screen) */}
      <Img
        src={staticFile(ASSETS.deviceFrame)}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          scale: 1.05,
          translate: "0.9px 0px",
        }}
      />
      {/* recording on TOP, clipped to the screen; scaled to match the 1.03 frame
          so it fills the enlarged screen (no white edge ring). */}
      <div
        style={{
          position: "absolute",
          left: cl,
          top: ct,
          width: cw,
          height: ch,
          overflow: "hidden",
          borderRadius: cw * 0.085,
          scale: 1.03,
        }}
      >
        {/* per-scene zoom of the screen content (default 1) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", scale: screenScale }}>
          {content}
        </div>
      </div>
    </div>
  );
};
