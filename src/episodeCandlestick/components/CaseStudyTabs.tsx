/**
 * CaseStudyTabs — the persistent case-study header spanning SC09–SC12.
 * Four tabs (Hammer / Bullish Engulfing / Shooting Star / Bearish Engulfing) in
 * one centered row, split by thin vertical dividers. The active tab (driven by
 * the sequence-local frame) is bold and 40px; green for the bullish patterns
 * (Hammer, Bullish Engulfing) and red for the bearish ones (Shooting Star,
 * Bearish Engulfing). Inactive tabs are 36px, grey, regular, at 40% opacity.
 * Each tab reserves its BOLD width (invisible ghost sizer) so the row never
 * reflows as the highlight moves. A horizontal rule as wide as the chart sits
 * 30px below the tab row. Mounted once in Composition (outside the per-scene
 * fades) so it stays put.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { sessionGeom } from "./SessionView";

const TABS = ["Hammer", "Bullish Engulfing", "Shooting Star", "Bearish Engulfing"];

// Sequence-local frame boundaries (abs − 4158). Active tab per talking point.
const BOUNDS = [920, 1898, 2767]; // ≤920 → 0, ≤1898 → 1, ≤2767 → 2, else 3
const DURATION = 3608; // 4158 → 7765 inclusive
const FADE = 12;
const TAB_BOTTOM = 150; // bottom edge of the tab row (moved 30px up from 180)
const RULE_Y = 180; // horizontal rule 30px below the tab row

// The rule spans the chart's combined width (left panel edge → right panel edge),
// matching the SC09–SC12 chart geometry.
const G = sessionGeom({ x: 96, width: 1536, panelGap: 20, centered: true, centerNudge: 30 });
const RULE_X1 = 96 - 20 + G.centerOffset; // 194
const RULE_X2 = G.rightX + G.rightW + 20 + G.centerOffset; // 1650

// Tabs (+ dividers) are shrunk 10% and spread across the rule length minus 40px
// (20px inset each side), evenly distributed via space-between.
const TAB_SCALE = 0.9;
const ACTIVE_SIZE = (theme.type.label.size + 4) * TAB_SCALE; // 36
const INACTIVE_SIZE = theme.type.label.size * TAB_SCALE; // 32.4
const DIVIDER_H = 44 * TAB_SCALE; // 39.6
const ROW_INSET = 20; // per-side inset → row width = rule length − 40

export const CaseStudyTabs = () => {
  const f = useCurrentFrame();
  const activeIndex = f <= BOUNDS[0] ? 0 : f <= BOUNDS[1] ? 1 : f <= BOUNDS[2] ? 2 : 3;
  const activeColor = activeIndex < 2 ? theme.colors.candleGreen : theme.colors.candleRed;
  const opacity = interpolate(f, [0, FADE, DURATION - FADE, DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: "translate(22px, 17px) scale(0.8855)", transformOrigin: "0 0" }}>
      {/* tab row — centered over the chart */}
      <div
        style={{
          position: "absolute",
          left: RULE_X1 + ROW_INSET,
          width: RULE_X2 - RULE_X1 - 2 * ROW_INSET,
          bottom: theme.canvas.height - TAB_BOTTOM,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {TABS.map((label, i) => {
          const active = i === activeIndex;
          return (
            <React.Fragment key={label}>
              {i > 0 && <div style={{ width: 2, height: DIVIDER_H, background: theme.colors.neutralMuted }} />}
              <div style={{ display: "grid" }}>
                {/* ghost sizer — reserves the bold width so the row never reflows */}
                <span
                  style={{
                    gridArea: "1 / 1",
                    visibility: "hidden",
                    fontSize: ACTIVE_SIZE,
                    fontWeight: theme.type.headline.weight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
                {/* visible layer — highlighted or plain, centered in the reserved box */}
                <span
                  style={{
                    gridArea: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    ...(active
                      ? { fontSize: ACTIVE_SIZE, fontWeight: theme.type.headline.weight, color: activeColor }
                      : { fontSize: INACTIVE_SIZE, fontWeight: theme.type.body.weight, color: theme.colors.slate, opacity: 0.4 }),
                  }}
                >
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* horizontal rule — as wide as the chart, 30px below the tabs */}
      <div
        style={{
          position: "absolute",
          left: RULE_X1,
          top: RULE_Y,
          width: RULE_X2 - RULE_X1,
          height: 2,
          background: theme.colors.neutralMuted,
        }}
      />
    </div>
  );
};
