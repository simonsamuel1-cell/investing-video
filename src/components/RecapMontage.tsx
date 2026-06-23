/**
 * RecapMontage — S30 (the longest scene: 515f / 17s, no internal pause). A calm
 * filmstrip of the four-step flow (Hot Themes → Theme → Stock → Validate), each
 * shown INSIDE a device frame (Placeholder-02) for consistency with the other
 * scenes. One step is foregrounded at a time, cycling across the full duration with
 * a slow Ken-Burns drift. Heading: "They look at a different level."
 */
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, USABLE } from "../theme";
import { ASSETS } from "../timeline";
import { fadeIn, ease } from "../util/anim";

const STEPS = [
  { label: "Hot Themes", src: ASSETS.concept1 },
  { label: "Theme", src: ASSETS.theme22 },
  { label: "Stock", src: ASSETS.stock22 },
  { label: "Validate", src: ASSETS.tab2 },
];

// Card aspect = device-frame aspect (0.4946); the screen rect matches the screen
// content aspect (≈0.5104), centred, so it fits with no letterbox (same as PhoneFrame).
const CARD = { w: 224, h: 453, gap: 96, top: 280 };
const CUT = { left: 0.0665, top: 0.0798, w: 0.867, h: 0.8402 };

export const RecapMontage = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const seg = dur / STEPS.length;

  const totalW = STEPS.length * CARD.w + (STEPS.length - 1) * CARD.gap;
  const startX = USABLE.cx - totalW / 2;

  const enter = fadeIn(frame, 0, 16);
  const progress = ease(frame, [0, dur], [0, 1]);

  return (
    <>
      {/* heading */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 120,
          width: 1280,
          textAlign: "center",
          fontSize: 60,
          fontWeight: 800,
          letterSpacing: -0.6,
          color: COLORS.black,
          opacity: fadeIn(frame, 4, 16),
        }}
      >
        They look at a different level.
      </div>

      {/* flow arrows between cards */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none", opacity: enter }}>
        {STEPS.slice(0, -1).map((_, i) => {
          const ax = startX + (i + 1) * CARD.w + i * CARD.gap + 18;
          const ay = CARD.top + CARD.h / 2;
          return (
            <g key={i} stroke={COLORS.ink} strokeWidth={3} opacity={0.4}>
              <line x1={ax} y1={ay} x2={ax + CARD.gap - 36} y2={ay} />
              <polygon
                points={`${ax + CARD.gap - 36},${ay - 9} ${ax + CARD.gap - 36},${ay + 9} ${ax + CARD.gap - 16},${ay}`}
                fill={COLORS.ink}
                stroke="none"
              />
            </g>
          );
        })}
      </svg>

      {/* step cards — each composited inside the device frame */}
      {STEPS.map((s, i) => {
        const x = startX + i * (CARD.w + CARD.gap);
        const elev = interpolateBump(frame, i * seg, (i + 1) * seg);
        const within = ease(frame, [i * seg, (i + 1) * seg], [0, 1]);
        const kb = 1.05 + 0.07 * within; // slow Ken-Burns zoom
        const scale = 1 + 0.12 * elev;
        const lift = -20 * elev;
        const op = (0.5 + 0.5 * elev) * enter;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: CARD.top,
                width: CARD.w,
                height: CARD.h,
                opacity: op,
                transform: `translateY(${lift}px) scale(${scale})`,
                filter: `drop-shadow(0 ${10 + 22 * elev}px ${20 + 24 * elev}px rgba(70,54,184,${0.1 + 0.18 * elev}))`,
              }}
            >
              {/* screen content inside a thin-border phone template (matches S11+) */}
              <div
                style={{
                  position: "absolute",
                  left: CARD.w * CUT.left,
                  top: CARD.h * CUT.top,
                  width: CARD.w * CUT.w,
                  height: CARD.h * CUT.h,
                  overflow: "hidden",
                  borderRadius: CARD.w * 0.085,
                  border: `${Math.max(2, CARD.w * CUT.w * 0.011)}px solid ${COLORS.ink}`,
                  background: COLORS.black,
                }}
              >
                <Img
                  src={staticFile(s.src)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
                />
              </div>
            </div>
            {/* label */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: CARD.top + CARD.h + 26,
                width: CARD.w,
                textAlign: "center",
                fontSize: 28,
                fontWeight: elev > 0.5 ? 800 : 600,
                color: COLORS.black,
                opacity: op,
                transform: `translateY(${lift}px)`,
              }}
            >
              {`${i + 1}. ${s.label}`}
            </div>
          </div>
        );
      })}

      {/* progress bar */}
      <div
        style={{
          position: "absolute",
          left: startX,
          top: 812,
          width: totalW,
          height: 6,
          borderRadius: 3,
          background: COLORS.hairline,
          opacity: enter,
        }}
      >
        <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 3, background: COLORS.purple }} />
      </div>
    </>
  );
};

/** Smooth 0→1→0 bump over [start,end] with eased shoulders. */
const interpolateBump = (frame: number, start: number, end: number) => {
  const e = ease;
  if (frame < (start + end) / 2) return e(frame, [start - 8, start + 16], [0, 1]);
  return e(frame, [end - 16, end + 8], [1, 0]);
};
