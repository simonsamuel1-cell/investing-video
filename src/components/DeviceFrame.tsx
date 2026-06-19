/**
 * DeviceFrame — the Layout-B phone (spec §4). Source recordings are 980×1920
 * portrait; the frame inner is 449×880 (≈ identical aspect, 0.510), so captures
 * are never stretched or cropped. 24px radius, 2px purple border, soft shadow,
 * positioned left and vertically centred in the usable band.
 */
import { OffthreadVideo, Img, staticFile } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII, BORDER } from "../theme";

// Inner content size + default position (top edge 73 ≥ 64, bottom 953 ≤ 972).
export const PHONE = { w: 449, h: 880, x: 96, y: 73 } as const;

export const DeviceFrame = ({
  children,
  x = PHONE.x,
  y = PHONE.y,
  w = PHONE.w,
  h = PHONE.h,
}: {
  children: ReactNode;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: RADII.device,
      border: `${BORDER.regular}px solid ${COLORS.purple}`,
      overflow: "hidden",
      backgroundColor: "#000",
      boxShadow:
        "0 26px 64px rgba(70,54,184,0.20), 0 6px 18px rgba(0,0,0,0.12)",
    }}
  >
    {children}
  </div>
);

/** Phone showing a trimmed screen recording. `startSec` seeks into the source
 * (clips are 30fps); the clip is muted (the VO is the single audio source). */
export const PhoneClip = ({
  src,
  startSec = 0,
  x,
  y,
  w,
  h,
}: {
  src: string;
  startSec?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) => (
  <DeviceFrame x={x} y={y} w={w} h={h}>
    <OffthreadVideo
      src={staticFile(src)}
      trimBefore={Math.round(startSec * 30)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000" }}
    />
  </DeviceFrame>
);

/** Phone showing a still screenshot. */
export const PhoneStill = ({
  src,
  x,
  y,
  w,
  h,
}: {
  src: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) => (
  <DeviceFrame x={x} y={y} w={w} h={h}>
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </DeviceFrame>
);
