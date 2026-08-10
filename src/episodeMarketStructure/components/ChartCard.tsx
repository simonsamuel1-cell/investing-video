/**
 * ChartCard — the white card every chart sits on. 24px radius, 1px border, the
 * resting elevation from the theme. Children are positioned in absolute CANVAS
 * coordinates, not card-relative ones, so a chart can be drawn against PLOT
 * without knowing anything about the card behind it.
 */
import React from "react";
import { theme } from "../theme";
import { usePalette } from "../palette";
import type { Box } from "../helpers";

export const ChartCard = ({
  box,
  children,
  opacity = 1,
  radius = theme.radius.cardLg,
  lifted = false,
  scale = 1,
}: {
  box: Box;
  children?: React.ReactNode;
  opacity?: number;
  radius?: number;
  lifted?: boolean;
  scale?: number;
}) => {
  const pal = usePalette();
  if (opacity <= 0.001) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: radius,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          boxShadow: lifted ? theme.shadow.lift : theme.shadow.rest,
          opacity,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`,
        }}
      />
      {children}
    </>
  );
};
