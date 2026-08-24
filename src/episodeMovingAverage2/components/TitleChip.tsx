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
        left: theme.layout.titleChip.x,
        top: theme.layout.titleChip.y,
        transform: r.transform,
        fontFamily: theme.type.family,
        fontSize: theme.type.h2.size,
        fontWeight: theme.type.h2.weight,
        color: theme.colors.indigo,
        opacity: r.opacity * opacity,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
