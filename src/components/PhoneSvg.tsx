/**
 * PhoneSvg — the centre device for the Scenes 3–9 walkthrough. A clean LIGHT
 * device frame (soft-grey bezel, large rounded corners, no notch/buttons) that
 * matches the supplied mockup — it replaces the earlier dark Untitled-2.svg
 * chrome. NO shadow (flat on #F5F5F5). The screen content (`children`, or a
 * convenience `video`) is masked into the inner screen; recordings are 980×1920
 * so the screen uses that aspect (objectFit "fill" → no distortion, no crop).
 */
import { OffthreadVideo, staticFile } from "remotion";
import type { ReactNode } from "react";
import { COLORS } from "../theme";

const SCREEN_ASPECT = 980 / 1920; // 0.5104 (w:h) — recording aspect
const screenFill = { width: "100%", height: "100%", objectFit: "fill" } as const;

export const PhoneSvg = ({
  cx,
  top,
  h,
  video,
  startSec = 0,
  children,
}: {
  cx: number;
  top: number;
  h: number;
  video?: string;
  startSec?: number;
  children?: ReactNode;
}) => {
  const bezel = Math.round(h * 0.018);
  const innerH = h - bezel * 2;
  const innerW = Math.round(innerH * SCREEN_ASPECT);
  const w = innerW + bezel * 2;
  const radius = Math.round(w * 0.12);

  const media: ReactNode =
    children ??
    (video ? (
      <OffthreadVideo
        src={staticFile(video)}
        trimBefore={Math.round(startSec * 30)}
        muted
        style={screenFill}
      />
    ) : null);

  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(cx - w / 2),
        top,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: radius,
        backgroundColor: COLORS.deviceFrame,
        border: `2px solid ${COLORS.deviceEdge}`,
      }}
    >
      {/* inner screen — content masked here, under the bezel */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: radius - bezel,
          overflow: "hidden",
          backgroundColor: COLORS.white,
        }}
      >
        {media}
      </div>
    </div>
  );
};
