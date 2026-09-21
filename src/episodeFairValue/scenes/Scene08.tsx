import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, OffthreadVideo, Sequence, Img } from "remotion";
import { SafeArea } from "../components/SafeArea";

// ── Beat 1 logo scatter ──────────────────────────────────────────────
const LOGO_DIR = "Circle Logo of Stocks";
const TICKERS = [
  "AADI", "AMMS", "ATLA", "BEEF", "BNGA", "BWPT", "COCO", "DMAS", "ERTX", "GLOB",
  "HITS", "INDO", "JIHD", "KOBX", "LPLI", "MEDS", "MPXL", "NIPS", "PGAS", "PRIM",
  "RICY", "SIDO", "SPTO", "TFAS", "TSPC",
];
const logoSrc = (t: string) => staticFile(`${LOGO_DIR}/Emiten Logo=${t}.png`);

// Deterministic pseudo-random in [0,1) (Math.random is forbidden in Remotion)
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Stage area (SafeArea inner) and the centered text exclusion zone
const STAGE_W = 1728;
const STAGE_H = 918;
const MARGIN = 50;

// ── Beat 2 phone mockup ──────────────────────────────────────────────
const VID_W = 980;
const VID_H = 1920;
const AP_H = 870;
const AP_W = Math.round((AP_H * VID_W) / VID_H); // 444
const BORDER = 12;
const RADIUS = 52;

// Highlight boxes, measured in native video pixels { l, t, w, h }
const HL1 = { l: 55, t: 606, w: 880, h: 745 }; // Investing Selection card
const HL2 = { l: 73, t: 800, w: 835, h: 145 }; // SIDO row (centered horizontally)
const HL3 = { l: 55, t: 604, w: 880, h: 705 }; // Top Pick Today card (+50px height)

const pctL = (px: number) => `${(px / VID_W) * 100}%`;
const pctT = (px: number) => `${(px / VID_H) * 100}%`;

const blink = (frame: number, start: number, seg: number) =>
  interpolate(
    frame - start,
    [0, seg, 2 * seg, 3 * seg, 4 * seg, 5 * seg],
    [0, 1, 0, 1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

const HighlightBox: React.FC<{ box: { l: number; t: number; w: number; h: number }; opacity: number }> = ({ box, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: pctL(box.l),
      top: pctT(box.t),
      width: pctL(box.w),
      height: pctT(box.h),
      border: "4px solid #5F4DEE",
      borderRadius: 12,
      boxShadow: "0 0 12px rgba(95,77,238,0.45)",
      boxSizing: "border-box",
      opacity,
    }}
  />
);

export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1a — text + logo scatter. Text fades in; the whole group's master opacity
  // fades to 0 at frame 90 (02:47.19) while logos keep appearing underneath until 131.
  const textOp = interpolate(frame, [7, 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const beat1aOut = interpolate(frame, [78, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Beat 1b — big "You don't have to" (02:47.23 → 02:48.28): frames 94–129, bridges to video at 146
  const bigOp = Math.min(
    interpolate(frame, [94, 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [132, 146], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // Highlight 1 — Investing Selection: blinks twice then static. 02:53.04 (255) → 02:55.06 (317)
  const hl1 = Math.min(
    blink(frame, 255, 8),
    interpolate(frame, [311, 317], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  // Highlight 2 — SIDO row: static. 02:55.10 (321) → 03:00.08 (469)
  const hl2 = Math.min(
    interpolate(frame, [321, 329], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [463, 469], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  // Highlight 3 — Top Pick Today: blinks twice then static. 03:01.26 (517) → 03:04.25 (606)
  const hl3 = Math.min(
    blink(frame, 517, 10),
    interpolate(frame, [600, 606], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // Scene-ending fade out (last 15 frames of the 719-frame scene)
  const sceneFade = interpolate(frame, [704, 719], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <SafeArea>
      {/* Beat 1a — random logo scatter + white-background text */}
      {frame < 94 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: STAGE_W, height: STAGE_H, opacity: beat1aOut }}>
          {/* Scattered logos */}
          {TICKERS.map((t, i) => {
            const size = 72 + rnd(i * 7 + 1) * 88; // 72–160
            const half = size / 2;
            const rot = (rnd(i * 7 + 2) - 0.5) * 50; // -25°..25°
            // Free placement across the whole stage (text sits above via zIndex)
            const cx = (MARGIN + half) + rnd(i * 7 + 3) * ((STAGE_W - MARGIN - half) - (MARGIN + half));
            const cy = (MARGIN + half) + rnd(i * 7 + 4) * ((STAGE_H - MARGIN - half) - (MARGIN + half));
            const appear = 7 + rnd(i * 7 + 7) * 124; // staggered 7–131 (keeps appearing until 02:49.00)
            const inOp = interpolate(frame, [appear, appear + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            const pop = interpolate(frame, [appear, appear + 10], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <Img
                key={t}
                src={logoSrc(t)}
                style={{
                  position: "absolute",
                  left: cx,
                  top: cy,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pop})`,
                  opacity: inOp,
                  objectFit: "cover",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
              />
            );
          })}

          {/* White-background text (above logos) */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <div style={{ opacity: textOp, background: "#FFFFFF", padding: "22px 44px", borderRadius: 18, boxShadow: "0 10px 40px rgba(0,0,0,0.14)" }}>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 56, color: "#000000" }}>
                Rather not check stocks one by one?
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Beat 1b — big "You don't have to" */}
      {frame >= 94 && frame < 146 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: bigOp, fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 110, color: "#000000", textAlign: "center" }}>
            You don't have to
          </div>
        </div>
      )}

      {/* Beat 2 — Scene 08_3.mp4 inside a phone mockup; plays from its start at frame 146 */}
      <Sequence from={146} layout="none">
        {/* Phone bezel */}
        <div style={{
          width: AP_W + BORDER * 2,
          height: AP_H + BORDER * 2,
          borderRadius: RADIUS,
          background: "linear-gradient(160deg, #4a4a4f 0%, #2a2a2e 40%, #1a1a1e 100%)",
          padding: BORDER,
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "0 0 0 1px #555, inset 0 0 0 1px #333, 0 24px 80px rgba(0,0,0,0.5)",
          opacity: sceneFade,
          transform: "scale(0.8)",
        }}>
          {/* Screen aperture */}
          <div style={{
            width: AP_W,
            height: AP_H,
            borderRadius: RADIUS - BORDER,
            background: "#000",
            overflow: "hidden",
            position: "relative",
          }}>
            <OffthreadVideo
              src={staticFile("Scene 08_3.mp4")}
              muted
              style={{ width: AP_W, height: AP_H, display: "block" }}
            />
            {/* Timed highlight boxes (positioned in video coordinate space) */}
            {frame >= 255 && frame < 317 && <HighlightBox box={HL1} opacity={hl1} />}
            {frame >= 321 && frame < 469 && <HighlightBox box={HL2} opacity={hl2} />}
            {frame >= 517 && frame < 606 && <HighlightBox box={HL3} opacity={hl3} />}
          </div>
        </div>
      </Sequence>
    </SafeArea>
  );
};
