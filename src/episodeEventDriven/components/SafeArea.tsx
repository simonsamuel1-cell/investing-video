/**
 * SafeArea — enforces this episode's layout contract (spec §1):
 *   • flat #F5F5F5 background, Plus Jakarta Sans, black text,
 *   • content clipped to the 1728×918 usable box (margins 96/96/54/108 — the
 *     bottom 108px subtitle zone stays empty),
 *   • the top-right 360×150 logo clear-zone is masked in every scene.
 * Children use absolute coordinates in the full 1920×1080 space.
 */
import { AbsoluteFill } from "remotion";
import type { ReactNode } from "react";
import { theme } from "../theme";

const L = theme.layout;

export const SafeArea = ({ children }: { children: ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.font.family, color: theme.colors.text }}>
    <AbsoluteFill style={{ clipPath: `inset(${L.marginT}px ${L.marginR}px ${L.marginB}px ${L.marginL}px)` }}>
      {children}
    </AbsoluteFill>
    {/* logo clear-zone — always empty */}
    <div style={{ position: "absolute", right: 0, top: 0, width: L.logoClearW, height: L.logoClearH, backgroundColor: theme.bg }} />
  </AbsoluteFill>
);
