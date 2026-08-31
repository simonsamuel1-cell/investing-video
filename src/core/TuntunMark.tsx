/**
 * TuntunMark.tsx — the Tuntun AI mark, from `TUNTUN AI.svg`.
 *
 * Inlined rather than served from public/ so it is on screen the instant it is
 * mounted. An <Img> can still be decoding when a frame is captured, and a mark
 * that flickers in on a quote card is worse than no mark at all.
 *
 * The two gradients are namespaced through `useId`, because two mounted copies
 * sharing an id would both resolve to whichever paint the browser saw last.
 *
 * Colours are the mark's own — this is a supplied brand asset, not episode
 * artwork, so it is reproduced rather than re-tinted to the episode palette.
 *
 * ⚠ IT USED TO SAY, HERE, THAT THIS FILE WAS COPIED RATHER THAN SHARED —
 * VIDEO 19 had one, VIDEO 20 had a duplicate of it, and the note explained
 * that a change to the brand mark had to be made in both places by hand. That
 * is the exact problem src/core exists to end, so the note is gone with it.
 * There is now one mark and episodes import it.
 *
 * ⚠ ITS COLOURS ARE NOT THE PALETTE'S, deliberately. A supplied brand asset is
 * reproduced, never re-tinted — a logo that follows a theme swap is no longer
 * the logo. scripts/audit.mjs exempts this file from the palette rule by name,
 * the same way it confines candleGreen/candleRed to Candles.tsx by name.
 *
 * NOTHING ELSE IN THIS FILE WAS TOUCHED when it moved into core: not a path,
 * not a stop, not a viewBox number.
 */
import React from "react";

/** The source artboard. Everything below is in these units. */
const VB = { w: 257.97, h: 250.9 };

export const TuntunMark = ({
  x,
  y,
  height,
  opacity = 1,
}: {
  /** Horizontal CENTRE, in canvas px. */
  x: number;
  /** Top edge, in canvas px. */
  y: number;
  height: number;
  opacity?: number;
}) => {
  const uid = React.useId().replace(/:/g, "");
  const shell = `shell-${uid}`;
  const face = `face-${uid}`;
  const width = (VB.w / VB.h) * height;
  if (opacity <= 0.001) return null;

  return (
    <svg
      style={{ position: "absolute", left: x - width / 2, top: y, opacity }}
      width={width}
      height={height}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
    >
      <defs>
        <linearGradient
          id={shell}
          x1="128.9"
          y1="434.82"
          x2="128.9"
          y2="243.99"
          gradientTransform="translate(0 472.27) scale(1 -1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#a696fd" />
          <stop offset="1" stopColor="#715cfd" />
        </linearGradient>
        <linearGradient
          id={face}
          x1="128.9"
          y1="406.97"
          x2="128.9"
          y2="288.17"
          gradientTransform="translate(0 472.27) scale(1 -1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f4f3fd" />
          <stop offset="1" stopColor="#c8bffd" />
        </linearGradient>
      </defs>

      {/* the soft halo behind everything */}
      <circle cx="133.38" cy="144.23" r="99.91" fill="#715cfd" fillOpacity="0.3" />
      {/* the two ears */}
      <path
        fill="#806cfd"
        d="M55.35,162.65c-1.1-4.47-6.05-6.68-9.88-4.42l-38.04,22.45c-4.99,2.94-4.07,10.65,1.48,12.51l47.5,15.85c4.98,1.66,9.69-2.87,8.4-8.09l-9.47-38.29Z"
      />
      <path
        fill="#806cfd"
        d="M202.46,162.65c1.1-4.47,6.05-6.68,9.88-4.42l38.04,22.45c4.99,2.94,4.07,10.65-1.48,12.51l-47.5,15.85c-4.98,1.66-9.69-2.87-8.4-8.09l9.47-38.29Z"
      />
      {/* the head, then the lighter face plate on top of it */}
      <path
        fill={`url(#${shell})`}
        d="M17.4,132.87c0-52.69,42.27-95.41,94.41-95.41h34.16c52.15,0,94.42,42.72,94.42,95.41s-42.27,95.41-94.42,95.41h-34.16c-52.14,0-94.41-42.72-94.41-95.41Z"
      />
      <path
        fill={`url(#${face})`}
        fillRule="evenodd"
        d="M142.77,169.86c-6.13-3.43-10.39-5.45-17.15-5.44-6.74.01-10.96,2.04-17.05,5.48-4.11,2.32-5.52,4.99-9.62,7.34-26.26,15.01-64.33-5.22-68.47-36.22-4.62-34.62,22.17-77.25,98.21-75.65,76.67-2.08,103.53,41.15,98.52,75.95-4.4,30.6-46.84,52.05-74.86,35.78-4.06-2.36-5.5-4.94-9.59-7.24Z"
      />
      {/* the eyes */}
      <path
        fill="#715cfd"
        d="M78.47,104.87h0c7.43,0,13.45,6.02,13.45,13.45v13.45c0,7.43-6.02,13.45-13.45,13.45h0c-7.43,0-13.45-6.02-13.45-13.45v-13.45c0-7.43,6.02-13.45,13.45-13.45Z"
      />
      <path
        fill="#715cfd"
        d="M179.33,104.87h0c7.43,0,13.45,6.02,13.45,13.45v13.45c0,7.43-6.02,13.45-13.45,13.45h0c-7.43,0-13.45-6.02-13.45-13.45v-13.45c0-7.43,6.02-13.45,13.45-13.45Z"
      />
      {/* the tuft */}
      <path
        fill="#a696fd"
        d="M147.32,6.39c-13.82-.64-48.71,26.92-59.32,38.69,26.44-.53,82.14,6.14,82.14-3.06,0-11.51-5.54-34.84-22.82-35.63Z"
      />
    </svg>
  );
};
