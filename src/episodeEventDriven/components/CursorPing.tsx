/**
 * CursorPing — an animated cursor arrow for UI beats: `ping` (repeated pulses
 * toward a target), `slam` (drops + presses), `recoil` (pulls back), `hold`
 * (parks with a "Don't" gate). Frame-driven; deterministic. The arrow itself is
 * neutral ink so it never competes with candle colour.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const c = theme.colors;

export const CursorPing = ({
  x,
  y,
  frame,
  start,
  mode = "ping",
  count = 3,
  period = 20,
}: {
  x: number;
  y: number;
  frame: number;
  start: number;
  mode?: "ping" | "slam" | "recoil" | "hold";
  count?: number;
  period?: number;
}) => {
  if (frame < start) return null;
  const t = frame - start;

  let scale = 1;
  let dx = 0;
  let dy = 0;
  if (mode === "ping") {
    const k = Math.min(count, Math.floor(t / period) + 1);
    const ph = (t % period) / period;
    scale = k <= count ? 1 - Math.sin(ph * Math.PI) * 0.16 : 1;
  } else if (mode === "slam") {
    const ph = clamp01(t / 16);
    dy = Math.sin(ph * Math.PI) * 14;
    scale = 1 - Math.sin(ph * Math.PI) * 0.12;
  } else if (mode === "recoil") {
    const ph = clamp01(t / 18);
    dx = ph * 26;
    dy = -ph * 14;
  }

  return (
    <svg style={{ position: "absolute", left: x + dx, top: y + dy, transform: `scale(${scale})`, transformOrigin: "top left" }} width={40} height={44} viewBox="0 0 40 44">
      <path d="M4 2 L4 34 L12 26 L18 40 L24 37 L18 23 L30 23 Z" fill={c.ink} stroke={c.white} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
};
