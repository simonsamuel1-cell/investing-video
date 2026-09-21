/**
 * DisclaimerChip — compliance chip (spec §7 S26). Sits at the bottom of the
 * right zone, above the subtitle margin (y stays < 972). Cyan-tinted pill with
 * an info dot. Default copy: "Educational, not investment advice."
 *
 * ⚠️ Wording must be confirmed against Tuntun/OJK compliance before publishing
 * (see TODO.md item 3).
 */
import { useCurrentFrame } from "remotion";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const DisclaimerChip = ({
  x = 600,
  y = 904,
  text = "Educational, not investment advice.",
  delay = 14,
}: {
  x?: number;
  y?: number;
  text?: string;
  delay?: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 12);
  const ty = rise(frame, delay, 14, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        borderRadius: RADII.chip,
        border: `1.5px solid ${COLORS.cyan}`,
        background: COLORS.cyanWash,
        opacity,
        transform: `translateY(${ty}px)`,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: COLORS.cyanDark,
          color: COLORS.white,
          fontSize: 15,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        i
      </span>
      <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.black }}>{text}</span>
    </div>
  );
};
