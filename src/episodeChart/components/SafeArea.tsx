/**
 * SafeArea — wraps every scene. Solid theme background, Plus Jakarta everywhere.
 * Children position in absolute canvas coordinates and are expected to respect
 * margins 96 / 96 / 54 / 108 (bottom 108px = subtitle zone, stays visually empty)
 * and the top-right 360×150 logo zone (content in the top 150px ends at x ≤ 1368).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

export const SafeArea = ({
  children,
  transparent = false,
}: {
  children: React.ReactNode;
  transparent?: boolean; // overlay stages inside continuity groups
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: transparent ? undefined : theme.colors.bg,
      fontFamily: theme.type.family,
      color: theme.colors.ink,
    }}
  >
    {children}
  </AbsoluteFill>
);
