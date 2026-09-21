/**
 * CaseStudyTabsPair — the persistent case-study header spanning SC13B–SC13C
 * (abs 8015–8833). A 2-tab replica of CaseStudyTabs: same font sizes, weights,
 * colors, and vertical divider. The two tabs — "Morning & Evening Star" and
 * "Soldiers & Crows" — are grouped and LEFT-ALIGNED to the header line's left
 * edge, and the horizontal rule is only as wide as that tab group (a
 * shrink-to-fit column: the rule stretches to the row's width). The active tab
 * (driven by the sequence-local frame) is bold, 36px, indigo. The
 * inactive tab is 32.4px, grey, regular, 40% opacity. Ghost sizers reserve the
 * bold width so the group (and therefore the rule) never reflows. Mounted once
 * in Composition (outside the per-scene fades) so it stays put.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { sessionGeom } from "./SessionView";

const TABS = ["Morning & Evening Star", "Soldiers & Crows"];

// Sequence-local frame boundaries (abs − 8015).
const SWITCH = 418; // ≤418 → tab 0 (Morning/Evening) active, else tab 1 (Soldiers/Crows)
// Both scenes show the bullish + bearish halves of the pair together (no flip),
// so the active tab stays green throughout.
const DURATION = 819; // 8015 → 8833 inclusive
const FADE = 12;

// Left edge — aligned to the chart's left panel edge (identical to CaseStudyTabs).
const G = sessionGeom({ x: 96, width: 1536, panelGap: 20, centered: true, centerNudge: 30 });
const RULE_X1 = 96 - 20 + G.centerOffset; // 194

const GROUP_TOP = 102; // top of the tab row
const ROW_H = 48; // fixed row height (tabs vertically centered)
const RULE_GAP = 30; // gap from the row to the rule → rule lands at y≈180

const TAB_SCALE = 0.9;
const ACTIVE_SIZE = (theme.type.label.size + 4) * TAB_SCALE; // 36
const INACTIVE_SIZE = theme.type.label.size * TAB_SCALE; // 32.4
const DIVIDER_H = 44 * TAB_SCALE; // 39.6

export const CaseStudyTabsPair = () => {
  const f = useCurrentFrame();
  const activeIndex = f <= SWITCH ? 0 : 1;
  const activeColor = theme.colors.indigo;
  const opacity = interpolate(f, [0, FADE, DURATION - FADE, DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: "translate(22px, 17px) scale(0.8855)", transformOrigin: "0 0" }}>
      {/* group — tab row + rule, shrink-to-fit, left-aligned to the header line */}
      <div style={{ position: "absolute", left: RULE_X1, top: GROUP_TOP, display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
        {/* tab row */}
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", height: ROW_H, gap: 44 }}>
          {TABS.map((label, i) => {
            const active = i === activeIndex;
            return (
              <React.Fragment key={label}>
                {i > 0 && <div style={{ width: 2, height: DIVIDER_H, background: theme.colors.neutralMuted }} />}
                <div style={{ display: "grid" }}>
                  {/* ghost sizer — reserves the bold width so the group never reflows */}
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

        {/* horizontal rule — as wide as the tab group (stretched by the column) */}
        <div style={{ marginTop: RULE_GAP, height: 2, background: theme.colors.neutralMuted }} />
      </div>
    </div>
  );
};
