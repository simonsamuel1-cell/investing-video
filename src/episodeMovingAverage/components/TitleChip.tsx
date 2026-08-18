/**
 * TitleChip.tsx — one per scene, top-LEFT, and never anywhere else.
 *
 * Top-left because the top-right 360 x 150 belongs to the logo and must stay
 * empty. One per scene because the episode allows at most two text elements on
 * screen at once, and the title is always one of them.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const TitleChip = ({
  text,
  f,
  at = 0,
  opacity = 1,
}: {
  text: string;
  f: number;
  at?: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  return (
    <div
      style={{
        position: "absolute",
        left: theme.stage.titleChip.x,
        top: theme.stage.titleChip.y + r.dy,
        transform: "translateY(-50%)",
        fontFamily: theme.text.family,
        fontSize: theme.text.h2.size,
        fontWeight: theme.text.h2.weight,
        color: theme.color.indigo,
        opacity: r.opacity * opacity,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
