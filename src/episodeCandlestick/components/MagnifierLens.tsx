/**
 * MagnifierLens — rounded card (2px indigo border, near-opaque white backdrop)
 * that glides along a chart; children (the full-canvas chart JSX, re-rendered)
 * show at `scale`× centered on (focusX, focusY), clipped to the lens.
 * The scene lerps centerX/focusX between anchors for the glide.
 */
import React from "react";
import { theme } from "../theme";

export const MagnifierLens = ({
  centerX,
  centerY,
  width,
  height,
  scale = 1.35,
  focusX,
  focusY,
  opacity = 1,
  children,
}: {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  scale?: number;
  focusX?: number; // content point magnified to the lens center
  focusY?: number;
  opacity?: number;
  children: React.ReactNode;
}) => {
  const fx = focusX ?? centerX;
  const fy = focusY ?? centerY;
  return (
    <div
      style={{
        position: "absolute",
        left: centerX - width / 2,
        top: centerY - height / 2,
        width,
        height,
        overflow: "hidden",
        borderRadius: theme.radius.card,
        border: `${theme.stroke.standard}px solid ${theme.colors.indigo}`,
        opacity,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: theme.colors.neutralFill, opacity: 0.92 }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: theme.canvas.width,
          height: theme.canvas.height,
          transformOrigin: "0 0",
          transform: `translate(${width / 2 - fx * scale}px, ${height / 2 - fy * scale}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
