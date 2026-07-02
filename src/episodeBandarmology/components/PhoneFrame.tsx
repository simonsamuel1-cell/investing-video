/**
 * PhoneFrame — centered device frame for app captures (Scenes 23, 26?, 31).
 * Single persistent instance lives in WorkflowStage; the frame never remounts or
 * repositions — only its `screen` content changes (cross-dissolve handled by the
 * caller layering two <PhoneFrame screen>s by opacity).
 *
 * `placeholder` renders a neutral grey panel with a centered [NEEDS DATA] label
 * (no fabricated app UI).
 */
import type { ReactNode } from "react";
import { theme } from "../theme";

const { colors, radius, type, font } = theme;
const ASPECT = 980 / 1920; // app screen aspect (portrait)

export const PhoneFrame = ({
  cx = 960,
  top = 214,
  height = 728,
  screen,
  placeholder,
  op = 1,
}: {
  cx?: number;
  top?: number;
  height?: number;
  screen?: ReactNode;
  placeholder?: string;
  op?: number;
}) => {
  const bezel = 6;
  const screenH = height;
  const screenW = Math.round(screenH * ASPECT);
  const bodyW = screenW + bezel * 2;
  const bodyH = screenH + bezel * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - bodyW / 2,
        top: top - bezel,
        width: bodyW,
        height: bodyH,
        background: colors.text,
        borderRadius: radius.lg + 10,
        padding: bezel,
        boxSizing: "border-box",
        opacity: op,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius.md,
          overflow: "hidden",
          background: placeholder ? colors.divider : colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {placeholder ? (
          <div
            style={{
              textAlign: "center",
              color: colors.slate,
              fontSize: type.descriptor,
              fontWeight: font.weights.bold,
              padding: 24,
              lineHeight: 1.4,
            }}
          >
            [NEEDS DATA]
            <div style={{ fontSize: type.chip, fontWeight: font.weights.medium, marginTop: 8 }}>
              {placeholder}
            </div>
          </div>
        ) : (
          screen
        )}
      </div>
    </div>
  );
};
