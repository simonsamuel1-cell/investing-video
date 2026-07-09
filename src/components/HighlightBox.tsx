import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface HighlightBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  startFrame: number;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  x, y, width, height, label, startFrame
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const opacity = progress;

  const PILL_HEIGHT = 28;
  const CONNECTOR_HEIGHT = 16;
  const PILL_PADDING_H = 12;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - PILL_HEIGHT - CONNECTOR_HEIGHT - 8,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
        pointerEvents: "none",
      }}
    >
      {/* Pill label */}
      <div
        style={{
          background: "#5F4DEE",
          borderRadius: PILL_HEIGHT / 2,
          padding: `0 ${PILL_PADDING_H}px`,
          height: PILL_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <span style={{ color: "#fff", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 12 }}>
          {label}
        </span>
      </div>
      {/* Connector line */}
      <div
        style={{
          width: 1,
          height: CONNECTOR_HEIGHT,
          background: "#5F4DEE",
          margin: "0 auto",
        }}
      />
      {/* Highlight box */}
      <div
        style={{
          width,
          height,
          border: "2px solid #5F4DEE",
          borderRadius: 8,
          background: "rgba(95, 77, 238, 0.10)",
        }}
      />
    </div>
  );
};
