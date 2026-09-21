/**
 * PhonePlaceholder — device frame with a dashed, tinted screen and a centred
 * label, used only where a real recording is not wired for a scene. (Most
 * scenes now use <PhoneScreen>/<FramedShot> with the supplied captures.)
 */
import { useCurrentFrame } from "remotion";
import { COLORS, RADII, BORDER, STROKES, TYPE, WEIGHT } from "../theme";
import { SCREEN_ASPECT } from "./PhoneScreen";
import { fadeIn } from "../helpers";

export const PhonePlaceholder = ({
  n,
  x,
  y,
  h,
  label,
}: {
  n: number;
  x: number;
  y: number;
  h: number;
  label?: string;
}) => {
  const frame = useCurrentFrame();
  const w = Math.round(h * SCREEN_ASPECT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: fadeIn(frame, 0, 12),
        borderRadius: RADII.device,
        backgroundColor: COLORS.text,
        padding: Math.round(w * 0.03),
        boxShadow: "0 30px 70px rgba(27,29,34,0.24)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: RADII.device * 0.72,
          background: COLORS.placeholderTint,
          border: `${BORDER.regular}px dashed ${STROKES.chip}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
          color: COLORS.slate,
          fontSize: TYPE.label,
          fontWeight: WEIGHT.medium,
          lineHeight: 1.4,
        }}
      >
        {label ?? `[ App Recording — Scene ${n} ]`}
      </div>
    </div>
  );
};
