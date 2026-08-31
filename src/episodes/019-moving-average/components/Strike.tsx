/**
 * Strike.tsx — cancels a wrong claim by ruling through it.
 *
 * ═══ WHY THIS COMPONENT IS THE HIGHEST-PRIORITY ITEM IN THE BUILD ═══
 *
 * Seven lines in this episode are misconceptions shown IN ORDER TO BE
 * CANCELLED. If any one of them renders as a plain statement, the screen
 * asserts the opposite of what the voice-over teaches — `UPPER BAND = SELL`
 * unstruck is a sell signal, not a warning about one.
 *
 * So the strike is not decoration on the text; the text is not allowed to
 * exist without it. It grows left to right over 10 frames, and as it completes
 * the claim eases back to 0.45 — dimmed, but STILL ON SCREEN. It is not
 * removed: the point is that the claim was made, and then failed.
 */
import React from "react";
import { theme } from "../theme";
import { clamp01, progress } from "../helpers";

export const Strike = ({
  f,
  at,
  children,
}: {
  f: number;
  /** The frame the rule starts sweeping. */
  at: number;
  children: React.ReactNode;
}) => {
  const swept = f < at ? 0 : clamp01(progress(f, at, theme.motion.strikeF));
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        /* the claim dims as the rule lands, and stays */
        opacity: 1 - 0.55 * swept,
      }}
    >
      {children}
      {swept > 0.001 && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "52%",
            width: `${(swept * 100).toFixed(1)}%`,
            height: theme.layout.stroke.strike,
            background: theme.colors.textMuted,
          }}
        />
      )}
    </span>
  );
};
