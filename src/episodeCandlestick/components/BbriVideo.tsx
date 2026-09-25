/**
 * BbriVideo — the real BBRI footage (portrait 980×1920) in a rounded clip
 * window with an animated scale + position. Drives, and exposes, the on-screen
 * video box so overlays can align to it.
 *
 * States (scene-local frames; the parent Sequence starts at abs 9044):
 *   0–572   upscaled 130% (anchored top, cropped at the subtitle margin)
 *   572–636 scales back down to the saved base (safe-margin fit, centered)
 *   636–974 base
 *   974–1006 slides to the left side
 *   1006–1133 held left
 *   1133–1162 slides back to center
 * Rounded corners throughout; a 2px edge crop hides a black source-edge line.
 */
import { useContext } from "react";
import {
  useCurrentFrame,
  interpolate,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { FilmTracks } from "../tracks";
import { Cut } from "../cut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const SAFE_TOP = 54;
export const SUBTITLE_Y = 972; // subtitle-margin top (1080 − 108); video never crosses it
export const BASE_H = SUBTITLE_Y - SAFE_TOP; // 918 — saved base height
export const BASE_W = (BASE_H * 980) / 1920; // 468.5625 — saved base width (fit to height)
export const BASE_CX = 960; // saved base center-x
export const UPSCALE = 1.56; // 1.3 × 1.2 (upscaled a further 20%)
export const LEFT_CX = BASE_CX - 250; // nudged 250px left when moved aside
export const EC = 3; // edge crop px — hides a black source-edge line
export const RADIUS = 28; // rounded corners
/**
 * The Indonesian cut crops the window's RIGHT side 8px — Simon: "di scene
 * study case, kok ada kayak garis hitam gitu ya? ilangin deh, klo itu image,
 * crop aja".
 *
 * ⚠ WHY THE 3px EDGE CROP NEVER WORKED. Tailwind's preflight gives every img
 * `max-width: 100%`, so the frame's styled width (window + 2·EC) was silently
 * capped at the WINDOW's width: squeezed to fit, the recording's 3px black
 * edge (source columns 977-979) landed 3-5px inside the window's right side,
 * a 2px line down its whole height — and it followed the window when only
 * the window was narrowed. So in this cut the frame is given, explicitly and
 * uncapped, the width it has actually always had (the window's), which keeps
 * every overlay aligned exactly as before, and then the window is narrowed
 * past the black edge.
 */
export const CROP_RIGHT_INDO = 8;
export const END = 10385 - 9044; // 1341

const K = {
  downFrom: 572,
  downTo: 636, // 9616–9680 scale back to base
  leftFrom: 974,
  leftTo: 1006, // 10018 → slide left
  backFrom: 1133,
  backTo: 1162, // 10177–10206 slide back to center
};
// ═══════════════════════════════════════════════════════════════════════════

export const videoScale = (f: number) =>
  interpolate(f, [0, K.downFrom, K.downTo], [UPSCALE, UPSCALE, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const videoCx = (f: number) =>
  interpolate(
    f,
    [0, K.leftFrom, K.leftTo, K.backFrom, K.backTo],
    [BASE_CX, BASE_CX, LEFT_CX, LEFT_CX, BASE_CX],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

// On-screen video box (the rounded clip window) for a given scene-local frame.
export const videoBox = (f: number) => {
  const s = videoScale(f);
  const w = BASE_W * s;
  return {
    left: videoCx(f) - w / 2,
    top: SAFE_TOP,
    width: w,
    height: BASE_H,
    right: videoCx(f) + w / 2,
    scale: s,
  };
};

export const BbriVideo = () => {
  const f = useCurrentFrame();
  const box = videoBox(f);
  const cropRight = useContext(Cut) === "indo" ? CROP_RIGHT_INDO : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: box.left,
        top: box.top,
        width: box.width - cropRight,
        height: box.height,
        overflow: "hidden",
        borderRadius: RADIUS,
      }}
    >
      <OffthreadVideo
        src={staticFile("bbri.mp4")}
        muted
        showInTimeline={useContext(FilmTracks)}
        style={
          cropRight > 0
            ? {
                position: "absolute",
                left: -EC,
                top: -EC,
                width: box.width,
                maxWidth: "none",
                height: BASE_H * box.scale + 2 * EC,
                objectFit: "fill",
              }
            : {
                position: "absolute",
                left: -EC,
                top: -EC,
                width: box.width + 2 * EC,
                height: BASE_H * box.scale + 2 * EC,
                objectFit: "fill",
              }
        }
      />
    </div>
  );
};
