/**
 * PhoneSvg — the centre device for the Scenes 3–9 walkthrough. Now matches the
 * S1 phone treatment (per Simon, 25 Jun): a thin 5px dark-grey (slate) rounded
 * border around the screen — NO thick device bezel. NO shadow (flat on #F5F5F5).
 * The screen content (`children`, or a convenience `video`) fills the bordered
 * area; recordings are 980×1920 so the screen uses that aspect (objectFit "fill"
 * → no distortion, no crop).
 */
import { OffthreadVideo, staticFile } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII } from "../theme";

const SCREEN_ASPECT = 980 / 1920; // 0.5104 (w:h) — recording aspect
const BORDER_W = 5; // same 5px dark-grey border as the S1 phones
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
  const innerH = h - BORDER_W * 2;
  const innerW = Math.round(innerH * SCREEN_ASPECT);
  const w = innerW + BORDER_W * 2;

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
        borderRadius: RADII.card,
        border: `${BORDER_W}px solid ${COLORS.slate}`, // 5px dark-grey, like S1
        backgroundColor: COLORS.surface,
        overflow: "hidden",
      }}
    >
      {media}
    </div>
  );
};
