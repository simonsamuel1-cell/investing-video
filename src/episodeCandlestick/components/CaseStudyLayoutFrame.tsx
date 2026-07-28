/**
 * CaseStudyLayoutFrame — static geometry wrapper for the case-study format
 * (docs/layout-4980.md). Renders the panel chrome (left panel, left sub-zone,
 * right panel) and exposes slots. The tab header + rule are NOT drawn here — for
 * SC13B–C they are the Composition-level CaseStudyTabsPair (persistent across
 * the two scenes). NO timings/animation of its own — the slot content drives its
 * own reveal. Division of labour: left panel is a static reference, ALL
 * beat-driven work is in the right panel.
 */
import React from "react";
import { theme } from "../theme";
import { LEFT_PANEL } from "./ReferenceCard";
import { RIGHT_PANEL } from "./DemoChart";

export const LEFT_SUBZONE = { x: 194, y: 565, w: 389, h: 335 };

const panelChrome = (r: { x: number; y: number; w: number; h: number }): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
  background: theme.colors.neutralFill,
  border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
  borderRadius: theme.radius.panel,
  boxSizing: "border-box",
});

export const CaseStudyLayoutFrame = ({
  leftPanel,
  leftSubZone,
  rightPanel,
  titleVariant = false,
  title,
}: {
  leftPanel?: React.ReactNode;
  leftSubZone?: React.ReactNode;
  rightPanel?: React.ReactNode;
  titleVariant?: boolean;
  title?: string;
}) => (
  <>
    {/* Panel chrome (behind the self-positioning slot content). */}
    <div style={panelChrome(LEFT_PANEL)} />
    <div style={panelChrome(RIGHT_PANEL)} />
    {leftPanel}
    {leftSubZone}
    {rightPanel}
    {title && (
      <div
        style={{
          position: "absolute",
          left: titleVariant ? LEFT_PANEL.x : 0,
          top: titleVariant ? 186 : 186,
          width: titleVariant ? undefined : theme.canvas.width,
          textAlign: titleVariant ? "left" : "center",
          fontFamily: theme.type.family,
          fontSize: 36,
          fontWeight: 600,
          color: theme.colors.indigo,
        }}
      >
        {title}
      </div>
    )}
  </>
);
