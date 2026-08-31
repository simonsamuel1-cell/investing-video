/**
 * core/Screen.tsx — showing the Tuntun app itself: a screen recording or a
 * screenshot, in a device frame, with our own marks on top.
 *
 * ⚠ SUPPLIED ASSETS ARE USED VERBATIM. No masking, no blurring, no cropping, no
 * recolouring. If something in the recording should not be on screen, the fix
 * is a new recording, not a mask.
 *
 * Our marks go OUTSIDE or OVER the frame, never inside it as if they were part
 * of the app's own interface — see HighlightBox, which is deliberately wider
 * than what it points at for exactly this reason.
 */
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette, useShadow } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";
import type { Rect } from "./helpers";

/**
 * A phone-shaped frame for a portrait capture. The frame is ours; the pixels
 * inside are the app's.
 */
export const DeviceFrame = ({
  rect,
  at,
  src,
  kind = "image",
  radius = 44,
  /** Trim the video, in frames from its own start. */
  startFrom,
}: {
  rect: Rect;
  at: number;
  /** Path inside public/, e.g. "captures/watchlist.mp4". */
  src: string;
  kind?: "image" | "video";
  radius?: number;
  startFrom?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  if (f < at) return null;
  const p = progress(f, at, m.pop);
  const bezel = 14;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: radius,
        background: c.cardBg,
        border: `${theme.shape.rule}px solid ${c.border}`,
        boxShadow: shadow.lift,
        overflow: "hidden",
        opacity: p,
        transform: `scale(${0.97 + 0.03 * p})`,
        transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: radius - bezel,
          overflow: "hidden",
        }}
      >
        {kind === "video" ? (
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={startFrom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
    </div>
  );
};

/**
 * A full-bleed clip of a capture, for a beat that is entirely about the app.
 * Fades rather than pops: it is a change of picture, not the arrival of an
 * object.
 */
export const ScreenClip = ({
  src,
  at,
  over,
  kind = "video",
  startFrom,
  fit = "contain",
}: {
  src: string;
  at: number;
  over: number;
  kind?: "image" | "video";
  startFrom?: number;
  fit?: "contain" | "cover";
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  if (f < at) return null;
  const op = progress(f, at, m.fade);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {kind === "video" ? (
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: fit }}
        />
      ) : (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit }} />
      )}
    </AbsoluteFill>
  );
};
