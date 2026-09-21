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
import { FRAME_ASPECT } from "./phoneGeometry";
import { fadeIn, rise, springUp, ease } from "../util/anim";

// NOTE: FRAME_ASPECT now lives in ./phoneGeometry — this file must export ONLY
// components to stay a valid React Fast Refresh boundary (see that file's comment).
// top/h tightened from the old {0.0308, 0.9381} so the rect aspect = content aspect
// (cw/ch = 0.867·0.4946/0.8402 ≈ 0.5104); centre stays at ≈0.5h so content doesn't move.
const CUT = { left: 0.0665, top: 0.0798, w: 0.867, h: 0.8402 };
const BORDER_RATIO = 0.011; // thin bezel as a fraction of phone width

// images/videos are always 980×1920 = the screen aspect, so cover fills it exactly.
const SCREEN: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
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
  screenShift = { x: 0, y: 0 },
  children,
  delay = 0,
  enterDur = 12,
  springScale = true,
  noEnter = false,
}: {
  x: number;
  y: number;
  w: number;
  video?: string;
  img?: string;
  startSec?: number;
  playbackRate?: number;
  screenScale?: number;
  // pan the screen content inside the mask (px). Pair with screenScale>1 to avoid
  // exposing black edges. +y = shift the image DOWN, +x = RIGHT.
  screenShift?: { x?: number; y?: number };
  children?: ReactNode;
  delay?: number;
  enterDur?: number;
  // springScale: true → springy scale settle (default); false → linear ease that
  // finishes exactly at delay+enterDur (used when an entrance must end on a frame).
  springScale?: boolean;
  // noEnter: skip the entrance entirely — the phone is fully visible at its final
  // size from frame 0 (used when a clip must hard-start on an exact frame).
  noEnter?: boolean;
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

  const opacity = noEnter ? 1 : fadeIn(frame, delay, enterDur);
  const sp = springScale ? springUp(frame, fps, delay) : ease(frame, [delay, delay + enterDur], [0, 1]);
  const scale = noEnter ? 1 : 0.96 + 0.04 * sp;
  const ty = noEnter ? 0 : rise(frame, delay, enterDur, 12);

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
      {/* screen (same rect/geometry as before → calibrated callouts hold). The bezel
          is a single box-shadow ring that grows OUTWARD from the screen edge. */}
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
          boxShadow: `0 0 0 ${border}px ${COLORS.ink}, 0 18px 45px rgba(0,0,0,0.16)`,
        }}
      >
        {/* per-scene zoom + pan of the screen content (default 1 / no shift) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: `translate(${screenShift.x ?? 0}px, ${screenShift.y ?? 0}px) scale(${screenScale})` }}>
          {content}
        </div>
      </div>
    </div>
  );
};
