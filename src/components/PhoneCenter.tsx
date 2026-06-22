/**
 * PhoneCenter (G3) — centres a <PhoneFrame> horizontally about `cx` for the
 * "B-top" layout family (title/heading above, phone(s) centred below). Sized by
 * `height`; width derives from the device-frame aspect.
 *
 * For raw recordings pass `video`; for a raw screenshot to be framed pass `img`;
 * for custom screen content (e.g. a cross-fade) pass `children`.
 */
import type { ReactNode } from "react";
import { PhoneFrame, FRAME_ASPECT } from "./PhoneFrame";

export const PhoneCenter = ({
  cx = 960,
  top,
  height,
  video,
  img,
  startSec = 0,
  playbackRate = 1,
  screenScale = 1,
  children,
  delay = 0,
}: {
  cx?: number;
  top: number;
  height: number;
  video?: string;
  img?: string;
  startSec?: number;
  playbackRate?: number;
  screenScale?: number;
  children?: ReactNode;
  delay?: number;
}) => {
  const w = Math.round(height * FRAME_ASPECT);
  const x = Math.round(cx - w / 2);
  return (
    <PhoneFrame x={x} y={top} w={w} video={video} img={img} startSec={startSec} playbackRate={playbackRate} screenScale={screenScale} delay={delay}>
      {children}
    </PhoneFrame>
  );
};
