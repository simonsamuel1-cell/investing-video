/**
 * SafeArea — wraps every scene. Solid theme background, Plus Jakarta everywhere.
 * Children position in absolute canvas coordinates and are expected to respect
 * margins 96 / 96 / 54 / 108 (bottom 108px = subtitle zone, stays visually empty)
 * and the top-right 360×150 logo zone (content in the top 150px ends at x ≤ 1368).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { usePalette, bgCss } from "../palette";

export const SafeArea = ({ children, transparent = false }: { children: React.ReactNode; transparent?: boolean }) => {
  const pal = usePalette();
  return (
    <AbsoluteFill
      style={{
        background: transparent ? undefined : bgCss(pal),
        fontFamily: theme.type.family,
        color: pal.ink,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
