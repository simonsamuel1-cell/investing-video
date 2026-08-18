/**
 * SafeArea.tsx — the frame every scene is built inside.
 *
 * Nothing but the background lives here. The margins are honoured by the
 * geometry in `theme.layout`, not by a wrapper that clips: a clip would hide a
 * violation instead of showing it, and the whole point of the reserved bands is
 * that they stay visibly empty.
 *
 * `Guides` outlines the logo zone and the subtitle band for eyeballing in
 * Studio. It is OFF by default and must never ship on.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

/** Flip to true only while checking a layout in Studio. */
const SHOW_GUIDES = false;

export const SafeArea = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill
    style={{
      backgroundColor: theme.color.bg,
      fontFamily: theme.text.family,
      color: theme.color.ink,
    }}
  >
    {children}
    {SHOW_GUIDES && <Guides />}
  </AbsoluteFill>
);

const Guides = () => (
  <>
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: theme.logoZone.width,
        height: theme.logoZone.height,
        outline: `1px dashed ${theme.color.warn}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: theme.captionBand.top,
        width: theme.canvas.width,
        height: theme.captionBand.height,
        outline: `1px dashed ${theme.color.warn}`,
      }}
    />
  </>
);
