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
import { useCurrentFrame, interpolate, OffthreadVideo, staticFile } from "remotion";

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
  interpolate(f, [0, K.downFrom, K.downTo], [UPSCALE, UPSCALE, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const videoCx = (f: number) =>
  interpolate(f, [0, K.leftFrom, K.leftTo, K.backFrom, K.backTo], [BASE_CX, BASE_CX, LEFT_CX, LEFT_CX, BASE_CX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// On-screen video box (the rounded clip window) for a given scene-local frame.
export const videoBox = (f: number) => {
  const s = videoScale(f);
  const w = BASE_W * s;
  return { left: videoCx(f) - w / 2, top: SAFE_TOP, width: w, height: BASE_H, right: videoCx(f) + w / 2, scale: s };
};

export const BbriVideo = () => {
  const f = useCurrentFrame();
  const box = videoBox(f);
  return (
    <div style={{ position: "absolute", left: box.left, top: box.top, width: box.width, height: box.height, overflow: "hidden", borderRadius: RADIUS }}>
      <OffthreadVideo
        src={staticFile("bbri.mp4")}
        muted
        style={{ position: "absolute", left: -EC, top: -EC, width: box.width + 2 * EC, height: BASE_H * box.scale + 2 * EC, objectFit: "fill" }}
      />
    </div>
  );
};
