import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { SafeArea } from "../components/SafeArea";

export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();

  // Card + Beat 1 content: fades in at 02:01.08 (frame 4), fades out at 02:11.10 (frame 306)
  const cardOpacity = Math.min(
    interpolate(frame, [4, 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [291, 306], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // "Value Trap" label: fades in at 02:08.03 (frame 209), fades out with card at frame 291–306
  const valueTrapOpacity = Math.min(
    interpolate(frame, [209, 224], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [291, 306], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // Phone fades in after card is gone (frame 306–321)
  const phoneOpacity = interpolate(frame, [306, 321], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // External SVG card fades in at 02:12.03 (frame 329)
  const svgCardOpacity = interpolate(frame, [329, 344], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Company Quality highlight: fades in 340–355, fades out 469–484 (02:16.23)
  const cqOpacity = Math.min(
    interpolate(frame, [340, 355], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [469, 484], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const cqScale = interpolate(frame, [340, 355], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "Not just cheap" — fades in 02:16.23 (469), fades out into 02:19.04 (540)
  const text1Opacity = Math.min(
    interpolate(frame, [469, 484], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [525, 540], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // "but cheap good company" — fades in at 02:19.04 (540)
  const text2Opacity = interpolate(frame, [540, 555], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const PHONE_WIDTH = 340;

  // External SVG card — 700px wide, proportional height
  const SVG_EXT_W = 700;
  const SVG_EXT_H = Math.round(SVG_EXT_W * 78 / 343); // 159

  const extScale = SVG_EXT_W / 343;
  const cqX = 0;
  const cqW = Math.round(98 * extScale);

  return (
    <SafeArea>

      {/* Card + Beat 1 content + "Value Trap" label (02:01.08–02:11.10) */}
      {frame >= 4 && frame < 312 && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, width: 1728, height: 918,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Relative wrapper so the label can anchor below the card */}
          <div style={{ position: "relative" }}>

            {/* White card */}
            <div style={{
              width: 1000,
              height: 400,
              background: "#FFFFFF",
              borderRadius: 24,
              border: "1px solid #EDEEF0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: cardOpacity,
            }}>
              {/* Price tag icon */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="39" y="0" width="2" height="12" fill="#5F4DEE" />
                <circle cx="40" cy="20" r="8" stroke="#5F4DEE" strokeWidth="2" />
                <rect x="4" y="28" width="72" height="48" rx="8" stroke="#5F4DEE" strokeWidth="2" />
              </svg>
              <div style={{ height: 24 }} />
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 56, color: "#000000", textAlign: "center" }}>
                Cheap ≠ Good Investment
              </div>
              <div style={{ height: 16 }} />
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", textAlign: "center", maxWidth: 860 }}>
                {["A", "Low", "Price", "Can", "Hide", "a", "Broken", "Business."].map((word, i) => {
                  const wOp = interpolate(frame, [94 + i * 5, 94 + i * 5 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
                  return <span key={i} style={{ opacity: wOp }}>{word}{" "}</span>;
                })}
              </div>
            </div>

            {/* "Value Trap" — 40px below card, fades in at 02:08.03 */}
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 40,
              textAlign: "center",
              opacity: valueTrapOpacity,
            }}>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 64, color: "#5F4DEE" }}>
                Value Trap
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Phone (left) + External SVG card (right) row — from 02:11.10 (frame 306) */}
      {frame >= 306 && (
        <div style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "center", gap: 80 }}>

          {/* Left: Phone with BBCA chart only */}
          <div style={{ opacity: phoneOpacity }}>
            <PhoneFrame width={PHONE_WIDTH}>
              <Img src={staticFile("Scene_05_06_-_BBCA_Chart.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </PhoneFrame>
          </div>

          {/* Right: External SVG card — fades in at 02:12.03 (frame 329) */}
          <div style={{ position: "relative", opacity: svgCardOpacity }}>
            <Img
              src={staticFile("Scene_05_06_-_BBCA_Reference_Fair_Value.svg")}
              style={{ width: SVG_EXT_W, height: SVG_EXT_H, display: "block" }}
            />

            {/* Company Quality highlight */}
            {frame >= 340 && (
              <div style={{
                position: "absolute", left: cqX, top: 0,
                width: cqW, height: SVG_EXT_H,
                opacity: cqOpacity,
                transform: `scale(${cqScale})`,
                transformOrigin: "center center",
              }}>
                <div style={{ width: "100%", height: "100%", border: "2px solid #5F4DEE", borderRadius: 8, background: "rgba(95,77,238,0.10)" }} />
                <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ background: "#5F4DEE", borderRadius: 14, padding: "8px 16px", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 28, color: "#fff", whiteSpace: "nowrap" }}>
                    Company Quality
                  </div>
                  <div style={{ width: 1, height: 16, background: "#5F4DEE" }} />
                </div>
              </div>
            )}

            {/* "Not just cheap" — 50px below SVG card, 02:16.23–02:19.04 */}
            {frame >= 469 && frame < 540 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 50,
                opacity: text1Opacity,
                whiteSpace: "nowrap",
              }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000" }}>
                  Not just cheap
                </div>
              </div>
            )}

            {/* "but cheap good company" — 50px below SVG card, 02:19.04–02:21.17 */}
            {frame >= 540 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 50,
                opacity: text2Opacity,
                whiteSpace: "nowrap",
              }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000" }}>
                  but cheap good company
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </SafeArea>
  );
};
