/**
 * TuntunLogo.tsx — the Tuntun diamond mark, without its wordmark.
 *
 * Simon: "Kotak kanan bawah, kasih logo tuntun bisa ga? Tanpa text. Crop aja
 * dari logo asli." The paths are the original's, from `Tamplate Video/
 * Watermark.svg` — the same mark public/watermark.png carries next to "Tuntun
 * Sekuritas Indonesia" — so it stays sharp at any size, including the full
 * frame a push would magnify it to.
 *
 * Colours are the mark's own — a supplied brand asset, reproduced rather than
 * re-tinted to the episode palette (the same stance as TuntunMark.tsx).
 */
import React from "react";
import { theme } from "../theme";

/** The source artboard, square. */
const VB = 78.95;

export const TuntunLogo = ({ cx, cy, size }: { cx: number; cy: number; size: number }) => (
  <svg
    style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2 }}
    width={size}
    height={size}
    viewBox={`0 0 ${VB} ${VB}`}
  >
    <path
      d="M5.57,27.37L27.37,5.57c6.7-6.7,17.5-6.7,24.2,0l21.8,21.8c6.7,6.7,6.7,17.5,0,24.2l-21.8,21.8c-6.7,6.7-17.5,6.7-24.2,0L5.57,51.57c-6.7-6.7-6.7-17.5,0-24.2Z"
      fill="#fff"
      stroke="#624cf7"
      strokeWidth={1.1}
    />
    <path
      d="M51.57,25.68h-30.4c8.6,0,13.9,3.2,19.1,6.3,5,3,9.9,5.9,17.4,5.9v-6c0-3.4-2.7-6.1-6.1-6.1h0v-.1Z"
      fill="#624cf7"
      fillRule="evenodd"
    />
    <path
      d="M21.18,37.77h36.5c-7.5,0-12.4-2.9-17.4-5.9-5.2-3.1-10.5-6.3-19.1-6.3v12.1h0v.1Z"
      fill="#5e26ef"
    />
    <path
      d="M63.57,19.87c.3.3.3.8,0,1.1l-12.3,11.9c-.8.7-1.8,1-2.9.7l-6.5-1.9c-.9-.3-1.8,0-2.5.4l-5.3,3.8c-.8.6-1.8.7-2.7.4l-3.4-1.3c-.9-.3-1.9-.2-2.7.3l-3.4,2.3c-.5.3-1.1,0-1.1-.5s0-.5.3-.6l4-2.9c.8-.6,1.8-.7,2.8-.3l3.2,1.3c.9.4,1.9.2,2.7-.3l5.3-3.7c.7-.5,1.6-.7,2.5-.4l6.4,1.9c1,.3,2.1,0,2.8-.7l11.8-11.3c.3-.3.7-.3,1,0,0,0,0-.2,0-.2Z"
      fill="#fff"
      fillRule="evenodd"
    />
    <path
      d="M61.38,21.37l-6.7,2.2c-.4.1-.5.8,0,.9.8.3,1.7.7,2.6,1.6.8.8,1.3,1.8,1.6,2.5,0,.4.8.4.9,0,.7-2.2,1.5-4.4,2.2-6.6,0-.4-.2-.7-.6-.6Z"
      fill="#05cbe7"
    />
    <path d="M33.38,62.27v-24.5h12.2v18.2c0,3.5-2.8,6.3-6.4,6.3h-5.9.1Z" fill="#624cf7" />
    <path d="M33.77,37.68h11.8v9.8c-2.2-4.9-4.5-9.4-11.8-9.9h0v.1Z" fill="#5e26ef" />
  </svg>
);

/** The roadmap's fourth box: the mark alone, centred, composed at full frame size. */
export const TuntunLogoCard: React.FC = () => (
  <TuntunLogo cx={theme.canvas.width / 2} cy={theme.canvas.height / 2} size={560} />
);
