/**
 * TextCard — a full-scene centred text zone (Layout A statement scenes:
 * S2, S5, S18, S29, S31, S32). One text zone, horizontal baselines, optional
 * cyan underline accent.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { COLORS } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const TextCard = ({
  children,
  underline = false,
  maxWidth = 1320,
  delay = 4,
  underlineWidth = 120,
  underlineColor = COLORS.cyan,
}: {
  children: ReactNode;
  underline?: boolean;
  maxWidth?: number;
  delay?: number;
  underlineWidth?: number;
  underlineColor?: string;
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 16);
  const ty = rise(frame, delay, 18, 24);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          maxWidth,
          padding: "0 60px",
          textAlign: "center",
          opacity,
          transform: `translateY(${ty}px)`,
        }}
      >
        {children}
        {underline && (
          <div
            style={{
              height: 6,
              width: underlineWidth,
              background: underlineColor,
              borderRadius: 3,
              margin: "30px auto 0",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
