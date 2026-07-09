import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { SafeArea } from "../components/SafeArea";

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1: price tag fade-in (0–20) and fade-out (106–116)
  const tagOpacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [106, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const tagY = interpolate(frame, [0, 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Beat 1: tagline fade-in (40–55) and fade-out (106–116)
  const taglineOpacity = Math.min(
    interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [106, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const taglineY = interpolate(frame, [40, 55], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Beat 2: layout fade-in (116–131)
  const layoutOpacity = interpolate(frame, [116, 131], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // State 1 (116–247): Fair Valued — crossfade out at 237–247
  const state1Opacity = (() => {
    if (frame < 116 || frame > 247) return 0;
    return interpolate(frame, [237, 247], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  })();

  // State 2 (247–421): Overvalued — crossfade in at 237–247, crossfade out at 411–421
  const state2Opacity = (() => {
    if (frame < 237 || frame > 421) return 0;
    const fadeIn = interpolate(frame, [237, 247], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const fadeOut = interpolate(frame, [411, 421], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return Math.min(fadeIn, fadeOut);
  })();

  // State 3 (421–599): Undervalued — crossfade in at 411–421
  const state3Opacity = (() => {
    if (frame < 411) return 0;
    return interpolate(frame, [411, 421], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  })();

  return (
    <SafeArea>
      {/* Beat 1: price tag (frames 0–116) */}
      {frame < 116 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Tag graphic */}
          <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)`, position: "relative", width: 560, height: 300 }}>
            <svg width="560" height="300" viewBox="0 0 560 300" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
              {/* Notch */}
              <rect x="279" y="0" width="2" height="20" fill="#5F4DEE" />
              {/* Circle hole */}
              <circle cx="280" cy="32" r="12" stroke="#5F4DEE" strokeWidth="2" fill="#F5F5F5" />
              {/* Tag body */}
              <rect x="1" y="44" width="558" height="254" rx="16" stroke="#5F4DEE" strokeWidth="2" fill="#FFFFFF" />
            </svg>
            <div style={{
              position: "absolute", top: 44, left: 0, right: 0, height: 254,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>BBCA</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 96, color: "#000000" }}>Rp 5,925</div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 48,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontSize: 48,
            color: "#000000",
            textAlign: "center",
          }}>
            Price Is What You Pay.
          </div>
        </div>
      )}

      {/* Beat 2: SVG card swap (frames 116–599) */}
      {frame >= 116 && (
        <div style={{ opacity: layoutOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 36, position: "relative" }}>
          {/* Top label */}
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 36, color: "#626266", marginBottom: 20, transform: "translateY(100px)" }}>
            Price vs. Fair Value
          </div>

          {/* SVG cards — stacked, crossfading */}
          <div style={{ position: "relative", width: 1372, height: 312, transform: "translateY(100px)" }}>
            {/* State 1: Fair Valued */}
            <div style={{ position: "absolute", top: 0, left: 0, opacity: state1Opacity, width: 1372, height: 312 }}>
              <Img src={staticFile("Scene_02_-_Fair_Valued.svg")} style={{ width: 1372, height: 312, display: "block" }} />
            </div>
            {/* State 2: Overvalued */}
            <div style={{ position: "absolute", top: 0, left: 0, opacity: state2Opacity, width: 1372, height: 312 }}>
              <Img src={staticFile("Scene_02_-_Overvalued.svg")} style={{ width: 1372, height: 312, display: "block" }} />
            </div>
            {/* State 3: Undervalued */}
            <div style={{ position: "absolute", top: 0, left: 0, opacity: state3Opacity, width: 1372, height: 312 }}>
              <Img src={staticFile("Scene_02_-_Undervalued.svg")} style={{ width: 1372, height: 312, display: "block" }} />
            </div>
          </div>

          {/* Captions — one per state, stacked */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* State 1 caption */}
            <div style={{ position: "absolute", opacity: state1Opacity, textAlign: "center", width: 800, marginTop: 312 + 40 - 200 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000" }}>Fair Valued</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", marginTop: 12 }}>Price Matches Fair Value</div>
            </div>
            {/* State 2 caption */}
            <div style={{ position: "absolute", opacity: state2Opacity, textAlign: "center", width: 800, marginTop: 312 + 40 - 200 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000" }}>Overvalued</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", marginTop: 12 }}>Price Above Fair Value</div>
            </div>
            {/* State 3 caption */}
            <div style={{ position: "absolute", opacity: state3Opacity, textAlign: "center", width: 800, marginTop: 312 + 40 - 200 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000" }}>Undervalued</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", marginTop: 12 }}>Price Below Fair Value</div>
            </div>
            {/* Spacer */}
            <div style={{ height: 320 }} />
          </div>
        </div>
      )}
    </SafeArea>
  );
};
