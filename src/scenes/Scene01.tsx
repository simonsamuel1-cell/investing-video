import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SafeArea } from "../components/SafeArea";

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1: headline fade+slide (0–30 frames)
  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const headlineY = interpolate(frame, [0, 30], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Underline draws in (15–50 frames)
  const underlineWidth = interpolate(frame, [15, 50], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Beat 2: pill fade+slide (150–180)
  const pillOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const pillY = interpolate(frame, [150, 180], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // X icon: gentler spring, starts after pill (170–192)
  const xScale = interpolate(frame, [170, 192], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Beat 3: caption fade+slide (300–325)
  const captionOpacity = interpolate(frame, [300, 325], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const captionY = interpolate(frame, [300, 325], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Scene fade-out (437–457)
  const sceneOut = interpolate(frame, [437, 457], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <SafeArea>
      {/* White card */}
      <div style={{
        opacity: sceneOut,
        width: 1100,
        minHeight: 480,
        background: "#FFFFFF",
        borderRadius: 24,
        border: "1px solid #EDEEF0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        gap: 40,
        boxSizing: "border-box",
      }}>
        {/* Beat 1: Headline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontSize: 96,
            color: "#000000",
            textAlign: "center",
          }}>
            Cheap or Expensive?
          </div>
          {/* Underline */}
          <div style={{
            height: 2,
            width: underlineWidth,
            background: "#5F4DEE",
            alignSelf: "center",
          }} />
        </div>

        {/* Beat 2: Price pill — always rendered to avoid layout shift */}
        <div style={{ opacity: pillOpacity, transform: `translateY(${pillY}px)`, position: "relative" }}>
          <div style={{
            width: 640,
            height: 96,
            borderRadius: 40,
            border: "1px solid #5F4DEE",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            boxSizing: "border-box",
          }}>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 36, color: "#626266" }}>BBCA</span>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>Rp 5.925</span>
          </div>
          {/* ❌ icon — scale(0) keeps it invisible until xScale animates in */}
          <div style={{
            position: "absolute",
            left: 656,
            top: "50%",
            transform: `translateY(-50%) scale(${xScale})`,
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" stroke="#5F4DEE" strokeWidth="3" />
              <line x1="26" y1="26" x2="54" y2="54" stroke="#5F4DEE" strokeWidth="3" strokeLinecap="round" />
              <line x1="54" y1="26" x2="26" y2="54" stroke="#5F4DEE" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Beat 3: Caption — always rendered to avoid layout shift */}
        <div style={{
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 400,
          fontSize: 36,
          color: "#626266",
          textAlign: "center",
        }}>
          Price ≠ Cheap or Expensive
        </div>
      </div>
    </SafeArea>
  );
};
