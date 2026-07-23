/**
 * CaseStudyLayout — shared scaffold for SC09–SC12.
 * Header row at y = 84: 72px pattern name at x = 96, signal chip immediately
 * right of it (inline flex — never enters the logo zone; titles are short).
 * SessionView slot beneath (y 210 → 640), ContextStrip slot (y 690 → 880).
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";
import type { ChipVariant } from "./Chip";

const CHIP_STYLE: Record<ChipVariant, { border: string; text: string }> = {
  indigo: { border: theme.colors.indigo, text: theme.colors.indigo },
  cyan: { border: theme.colors.cyan, text: theme.colors.slate },
  neutral: { border: theme.colors.neutralLine, text: theme.colors.ink },
  muted: { border: theme.colors.neutralLine, text: theme.colors.neutralMuted },
};

export const CaseStudyLayout = ({
  title,
  signalChip,
  headerFrame = 0,
  children,
}: {
  title: string;
  signalChip: { label: string; variant: ChipVariant };
  headerFrame?: number;
  children: React.ReactNode; // SessionView + ContextStrip + overlays
}) => {
  const f = useCurrentFrame();
  const rv = textReveal(f, headerFrame);
  const chipStart = headerFrame + 8;
  const pop = interpolate(f, [chipStart, chipStart + 9], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const chipOp = interpolate(f, [chipStart, chipStart + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cs = CHIP_STYLE[signalChip.variant];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeLeft,
          top: 84,
          display: "flex",
          alignItems: "center",
          gap: 32,
          opacity: rv.opacity,
          transform: `translateY(${rv.y}px)`,
        }}
      >
        <span style={{ fontSize: theme.type.headline.size, fontWeight: theme.type.headline.weight, color: theme.colors.ink }}>
          {title}
        </span>
        <span
          style={{
            padding: "10px 22px",
            borderRadius: theme.radius.chip,
            background: theme.colors.neutralFill,
            border: `${theme.stroke.hairline}px solid ${cs.border}`,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: cs.text,
            opacity: chipOp,
            transform: `scale(${pop})`,
            whiteSpace: "nowrap",
          }}
        >
          {signalChip.label}
        </span>
      </div>
      {children}
    </>
  );
};
