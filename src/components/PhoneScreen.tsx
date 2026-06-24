/**
 * PhoneScreen — a clean CSS device frame (dark bezel + notch pill) wrapping a
 * screen recording or screenshot. Source recordings are 980×1920 (aspect 0.510)
 * full-screen captures, so the inner screen uses the same aspect and objectFit
 * "cover" → no stretch, no crop.
 *
 * `holdFrom` (scene-relative frame) freezes the recording from that frame on, so
 * the take lands and holds on a chosen reading (e.g. the 58% Neutral gauge).
 */
import {
  Freeze,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { CSSProperties, ReactNode } from "react";
import { COLORS, RADII } from "../theme";

export const SCREEN_ASPECT = 980 / 1920; // 0.5104 (w:h)

const fill: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  backgroundColor: COLORS.text,
};

export const PhoneScreen = ({
  x,
  y,
  h,
  video,
  img,
  startSec = 0,
  holdFrom,
  playbackRate = 1,
  opacity = 1,
  scale = 1,
  children,
}: {
  x: number;
  y: number;
  h: number;
  video?: string;
  img?: string;
  startSec?: number;
  holdFrom?: number;
  playbackRate?: number;
  opacity?: number;
  scale?: number;
  children?: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const w = Math.round(h * SCREEN_ASPECT);
  const bezel = Math.max(8, Math.round(w * 0.03));

  const media: ReactNode =
    children ??
    (video ? (
      <OffthreadVideo
        src={staticFile(video)}
        trimBefore={Math.round(startSec * 30)}
        playbackRate={playbackRate}
        muted
        style={fill}
      />
    ) : img ? (
      <Img src={staticFile(img)} style={fill} />
    ) : null);

  const screen = (
    <div
      style={{
        position: "absolute",
        inset: bezel,
        borderRadius: RADII.device * 0.72,
        overflow: "hidden",
        backgroundColor: COLORS.text,
      }}
    >
      {media}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        borderRadius: RADII.device,
        backgroundColor: COLORS.text,
        boxShadow:
          "0 30px 70px rgba(27,29,34,0.26), 0 8px 22px rgba(27,29,34,0.14)",
      }}
    >
      {holdFrom !== undefined && video && !children ? (
        <Freeze frame={holdFrom} active={frame >= holdFrom}>
          {screen}
        </Freeze>
      ) : (
        screen
      )}
      {/* notch pill */}
      <div
        style={{
          position: "absolute",
          top: bezel + Math.round(h * 0.012),
          left: "50%",
          transform: "translateX(-50%)",
          width: Math.round(w * 0.34),
          height: Math.round(h * 0.022),
          borderRadius: 999,
          backgroundColor: COLORS.text,
        }}
      />
    </div>
  );
};
