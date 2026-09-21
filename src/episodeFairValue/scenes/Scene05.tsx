import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { SafeArea } from "../components/SafeArea";

export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1: card (0–180)
  const beat1CardOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const beat1FadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const beat1Opacity = Math.min(beat1CardOpacity, beat1FadeOut);
  const underlineW = interpolate(frame, [40, 60], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Beat 2: phone slides in (180–200), fades out at 01:36.23 → frame 285
  const phoneOpacity = Math.min(
    interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [285, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const phoneX = interpolate(frame, [180, 200], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Reference Fair Value SVG — fades in at 01:34.18 (frame 220), stays for rest of scene
  const refFvOpacity = interpolate(frame, [220, 235], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Highlight: slow blink 01:41.18–01:48.02 → frames 430–624
  const refFvHlOpacity = (() => {
    if (frame < 430 || frame >= 624) return 0;
    const fadeIn = interpolate(frame, [430, 445], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const fadeOut = interpolate(frame, [609, 624], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const blink = (Math.sin((frame - 430) * Math.PI / 30) + 1) / 2;
    return fadeIn * fadeOut * blink;
  })();

  // "BBCA =" — 01:38.07 → frame 329
  const bbcaOpacity = interpolate(frame, [329, 344], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "5,925" — 01:39.02 → frame 354
  const priceOpacity = interpolate(frame, [354, 369], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "15–27% below fair value" — 01:48.06 → frame 628
  const belowTextOpacity = interpolate(frame, [628, 643], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Scene fade-out — completes at 02:01.02 (frame 1014), 15-frame fade
  const sceneOut = interpolate(frame, [999, 1014], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const PHONE_WIDTH = 340;

  // SVG natural size: 343×78. Display at 1200px wide.
  const SVG_W = 1200;
  const SVG_H = Math.round(SVG_W * 78 / 343); // 273
  // Reference Fair Value column: x 98–244 in the 343-wide viewBox
  const hlX = Math.round((98 / 343) * SVG_W);  // 343
  const hlW = Math.round((146 / 343) * SVG_W); // 511

  return (
    <SafeArea>

      {/* Beat 1 card */}
      {frame < 180 && (
        <div style={{ opacity: beat1Opacity, position: "absolute", width: 860, background: "#FFFFFF", borderRadius: 24, border: "1px solid #EDEEF0", padding: "36px 48px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000", textAlign: "center", maxWidth: 1100 }}>
            Tuntun Analyzes Every Public Company in Indonesia.
          </div>
          <div style={{ height: 2, width: underlineW, background: "#5F4DEE" }} />
        </div>
      )}

      {/* Beat 2: Phone — removed from DOM once fully faded */}
      {frame >= 180 && frame < 305 && (
        <div style={{ opacity: phoneOpacity, transform: `translateX(${phoneX}px)`, position: "relative" }}>
          <PhoneFrame width={PHONE_WIDTH}>
            <Img src={staticFile("Scene_05_06_-_BBCA_Chart.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </PhoneFrame>
        </div>
      )}

      {/* Reference Fair Value SVG + equation text — centered on full canvas, outside phone */}
      {frame >= 220 && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, width: 1728, height: 918,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          opacity: 1 - sceneOut,
        }}>
          <div style={{ position: "relative", opacity: refFvOpacity }}>

            {/* "BBCA = 5,925" — centered above SVG */}
            <div style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              width: SVG_W,
              marginBottom: 32,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}>
              <div style={{ opacity: bbcaOpacity, fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 50, color: "#000000" }}>
                BBCA =
              </div>
              <div style={{ opacity: priceOpacity, fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 50, color: "#5F4DEE" }}>
                5,925
              </div>
            </div>

            {/* SVG card */}
            <Img
              src={staticFile("Scene_05_06_-_BBCA_Reference_Fair_Value.svg")}
              style={{ width: SVG_W, height: SVG_H, display: "block" }}
            />

            {/* Purple highlight — blinking 01:41.18–01:48.02 */}
            <div style={{
              position: "absolute",
              left: hlX,
              top: 0,
              width: hlW,
              height: SVG_H,
              border: "3px solid #5F4DEE",
              borderRadius: 8,
              background: "rgba(95,77,238,0.10)",
              opacity: refFvHlOpacity,
            }} />

            {/* "15–27% below fair value" — centered below SVG, from 01:48.06 */}
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: SVG_W,
              marginTop: 32,
              display: "flex",
              justifyContent: "center",
              opacity: belowTextOpacity,
            }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 50, color: "#5CC8E3" }}>
                15–27% below fair value
              </div>
            </div>

          </div>
        </div>
      )}

    </SafeArea>
  );
};
