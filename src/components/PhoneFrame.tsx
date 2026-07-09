import React from "react";

interface PhoneFrameProps {
  width: number;
  children?: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ width, children }) => {
  const RATIO = 19.5 / 9;
  const height = width * RATIO;
  const borderWidth = 12;
  const borderRadius = 52;
  const innerWidth = width - borderWidth * 2;
  const innerHeight = height - borderWidth * 2;
  const dynamicIslandWidth = innerWidth * 0.28;
  const dynamicIslandHeight = 28;

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(160deg, #4a4a4f 0%, #2a2a2e 40%, #1a1a1e 100%)",
        padding: borderWidth,
        boxSizing: "border-box",
        position: "relative",
        boxShadow: "0 0 0 1px #555, inset 0 0 0 1px #333, 0 24px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* Screen aperture */}
      <div
        style={{
          width: innerWidth,
          height: innerHeight,
          borderRadius: borderRadius - borderWidth,
          background: "#000",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: dynamicIslandWidth,
            height: dynamicIslandHeight,
            borderRadius: dynamicIslandHeight / 2,
            background: "#000",
            zIndex: 10,
          }}
        />
      </div>
      {/* Side buttons */}
      <div style={{ position: "absolute", left: -4, top: height * 0.22, width: 4, height: 36, background: "#3a3a3e", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -4, top: height * 0.32, width: 4, height: 60, background: "#3a3a3e", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -4, top: height * 0.42, width: 4, height: 60, background: "#3a3a3e", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", right: -4, top: height * 0.3, width: 4, height: 80, background: "#3a3a3e", borderRadius: "0 2px 2px 0" }} />
    </div>
  );
};
