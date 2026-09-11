/**
 * core/Cursor.tsx — a mouse pointer, for a scene that is showing an interface.
 *
 * ⚠ IT IS AN OBJECT IN THE FRAME, NOT A UI CONTROL. Nothing is clickable in a
 * rendered video; the pointer is there because a viewer reads "somebody is
 * choosing" from an arrow moving across cards far faster than from any label
 * saying so.
 *
 * ⚠ THE HOTSPOT IS THE TIP, and `x`/`y` are the tip. Placed by the shape's
 * bounding box instead, the arrow would point at somewhere other than the thing
 * it is over — which is the one thing a cursor may never do.
 */
import { theme } from "./theme";

export const Cursor = ({
  x,
  y,
  size = 34,
  opacity = 1,
}: {
  /** The TIP, in canvas pixels. */
  x: number;
  y: number;
  /** Height of the arrow, tip to tail. */
  size?: number;
  opacity?: number;
}) => {
  if (opacity <= 0.001) return null;
  /** The classic pointer, drawn in a 24×32 box and scaled from `size`. */
  const k = size / 32;
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, overflow: "visible", pointerEvents: "none" }}
      width={24 * k}
      height={32 * k}
      viewBox="0 0 24 32"
      opacity={opacity}
    >
      <path
        d="M1 1 L1 24 L7.2 18.2 L11 27.6 L15.4 25.8 L11.6 16.6 L20 16.2 Z"
        fill={theme.color.ink}
        stroke={theme.color.onIndigo}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
};
