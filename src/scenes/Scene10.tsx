import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SafeArea } from "../components/SafeArea";

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();

  // Scale fade-in
  const scaleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scaleY = interpolate(frame, [0, 20], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Oscillation: -2deg to +2deg, sine over 120 frames, looping
  const oscillationT = (frame % 120) / 120;
  const scaleRotate = Math.sin(oscillationT * Math.PI * 2) * 2;

  // Disclaimer panel
  const panelOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelY = interpolate(frame, [40, 60], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <SafeArea style={{ flexDirection: "column", gap: 48 }}>
      {/* Scale icon */}
      <div style={{ opacity: scaleOpacity, transform: `translateY(${scaleY}px)` }}>
        <div style={{ transform: `rotate(${scaleRotate}deg)`, transformOrigin: "center bottom", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="400" height="280" viewBox="0 0 400 280" fill="none">
            {/* Vertical pole */}
            <rect x="198" y="80" width="4" height="120" fill="#5F4DEE" rx="2" />
            {/* Horizontal crossbar */}
            <rect x="80" y="80" width="240" height="3" fill="#5F4DEE" rx="1" />
            {/* Left arm hanging lines */}
            <line x1="96" y1="83" x2="84" y2="148" stroke="#5F4DEE" strokeWidth="1.5" />
            <line x1="120" y1="83" x2="130" y2="148" stroke="#5F4DEE" strokeWidth="1.5" />
            {/* Left pan (lower) */}
            <rect x="78" y="148" width="58" height="16" rx="6" stroke="#5F4DEE" strokeWidth="2" fill="none" />
            {/* Right arm hanging lines */}
            <line x1="280" y1="83" x2="268" y2="128" stroke="#5F4DEE" strokeWidth="1.5" />
            <line x1="304" y1="83" x2="314" y2="128" stroke="#5F4DEE" strokeWidth="1.5" />
            {/* Right pan (higher — 20px higher than left) */}
            <rect x="262" y="128" width="58" height="16" rx="6" stroke="#5F4DEE" strokeWidth="2" fill="none" />
            {/* Labels */}
            <text x="107" y="208" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="32" fill="#626266">Estimate</text>
            <text x="291" y="188" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="32" fill="#626266">Reality</text>
          </svg>
        </div>
      </div>

      {/* Disclaimer panel */}
      <div style={{
        opacity: panelOpacity,
        transform: `translateY(${panelY}px)`,
        width: 1200,
        background: "#F7F8FA",
        border: "2px solid #EDEEF0",
        borderRadius: 16,
        padding: 48,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000", textAlign: "center" }}>
          This Video Is for Educational Purposes Only.
        </div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", textAlign: "center", maxWidth: 1100 }}>
          Not a Recommendation To Buy or Sell. Investing Carries Risk. The Final Decision Is Yours.
        </div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 32, color: "#949499", textAlign: "center", maxWidth: 1000 }}>
          Always Do Your Own Research Before Making Any Investment Decision.
        </div>
      </div>
    </SafeArea>
  );
};
