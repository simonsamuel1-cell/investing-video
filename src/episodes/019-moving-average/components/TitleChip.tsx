/**
 * TitleChip.tsx — one per scene, top-LEFT, and never anywhere else.
 *
 * Top-left because the top-right 360 x 150 belongs to the logo and must stay
 * empty. One per scene because the episode allows at most two text elements on
 * screen at once, and the title is always one of them.
 *
 * ═══ THE BADGE ═══
 *
 * A heading can carry ONE pill beside it, naming the beat inside the scene
 * rather than replacing the scene's own name. It is laid out as a flex row
 * with the title, never positioned by hand: the title's width is whatever the
 * browser makes of that string at that weight, so a badge placed at a measured
 * offset would drift the moment the heading changed.
 *
 * It reveals on its OWN frame, so the heading can have been standing for a
 * minute before the badge arrives.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

/** How the pill sits against the heading. */
const BADGE = { gap: 18, padX: 18, padY: 7, size: 26 };

export const TitleChip = ({
  text,
  f,
  at = 0,
  opacity = 1,
  badge,
}: {
  text: string;
  f: number;
  at?: number;
  opacity?: number;
  badge?: { text: string; at: number };
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  const b = badge && f >= badge.at ? textReveal(f, badge.at) : null;
  return (
    <div
      style={{
        position: "absolute",
        left: theme.layout.titleChip.x,
        top: theme.layout.titleChip.y,
        transform: r.transform,
        display: "flex",
        alignItems: "center",
        gap: BADGE.gap,
        fontFamily: theme.type.family,
        fontSize: theme.type.h2.size,
        fontWeight: theme.type.h2.weight,
        color: theme.colors.indigo,
        opacity: r.opacity * opacity,
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {b && badge && (
        <span
          style={{
            transform: b.transform,
            opacity: b.opacity,
            background: theme.colors.indigo,
            color: theme.colors.surface,
            borderRadius: theme.layout.radius.sm,
            padding: `${BADGE.padY}px ${BADGE.padX}px`,
            fontSize: BADGE.size,
            fontWeight: theme.type.label.weight,
          }}
        >
          {badge.text}
        </span>
      )}
    </div>
  );
};
