import React from "react";

interface SafeAreaProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SafeArea: React.FC<SafeAreaProps> = ({ children, style }) => (
  <div style={{ width: 1920, height: 1080, background: "#F5F5F5", position: "relative", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 54,
        width: 1728,
        height: 918,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  </div>
);
