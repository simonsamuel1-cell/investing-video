/**
 * SafeArea.tsx — the frame every scene is built inside.
 *
 * Nothing but the background lives here. The margins are honoured by the
 * geometry in `theme.layout`, not by a wrapper that clips: a clip would hide a
 * violation instead of showing it, and the whole point of the reserved bands
 * is that they stay visibly empty.
 *
 * `Guides` outlines the logo zone and the subtitle band for eyeballing in
 * Studio. It is OFF by default and must never ship on.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, CAPTION_BAND } from "../theme";

const SHOW_GUIDES = false;

export const SafeArea = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill
    style={{
      backgroundColor: theme.colors.bg,
      fontFamily: theme.type.family,
      color: theme.colors.text,
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
        width: theme.layout.logoZoneW,
        height: theme.layout.logoZoneH,
        outline: `1px dashed ${theme.colors.candleRed}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: CAPTION_BAND.top,
        width: theme.layout.width,
        height: CAPTION_BAND.height,
        outline: `1px dashed ${theme.colors.candleRed}`,
      }}
    />
  </>
);
