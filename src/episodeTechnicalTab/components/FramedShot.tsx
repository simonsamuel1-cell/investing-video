/**
 * FramedShot — a flat phone screenshot inside a 2px indigo rounded border (NO
 * device bezel), matching the side-rail reference comps. Used for the
 * comparison phones (ESIP bullish / CEKA bearish) and S&R examples.
 */
import { Img, staticFile } from "remotion";
import { COLORS, RADII, BORDER, STROKES } from "../theme";

export const SHOT_ASPECT = 1080 / 2340; // 0.4615 (w:h)

export const FramedShot = ({
  src,
  x,
  y,
  h,
  opacity = 1,
  scale = 1,
}: {
  src: string;
  x: number;
  y: number;
  h: number;
  opacity?: number;
  scale?: number;
}) => {
  const w = Math.round(h * SHOT_ASPECT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        borderRadius: RADII.lg,
        border: `${BORDER.regular}px solid ${STROKES.flow}`,
        backgroundColor: COLORS.surface,
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(95,77,238,0.16), 0 5px 14px rgba(27,29,34,0.10)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
