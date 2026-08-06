/**
 * StatementText — display typography stack for SC09. Word-by-word textReveal
 * only (fade + slide, never pop/bounce), centred, clear of the logo and
 * subtitle zones.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

export const StatementText = ({
  text,
  y,
  startFrame,
  size,
  weight,
  color,
  wordStagger = 6,
  emphasis = 1,
}: {
  text: string;
  y: number; // centre-y of the line
  startFrame: number;
  size: number;
  weight: number;
  color: string;
  wordStagger?: number;
  /** Whole-line scale, driven by the voice-over. 1 = untouched. */
  emphasis?: number;
}) => {
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: theme.canvas.width,
        transform: emphasis === 1 ? "translateY(-50%)" : `translateY(-50%) scale(${emphasis})`,
        display: "flex",
        justifyContent: "center",
        gap: 18,
        fontFamily: theme.type.family,
        fontSize: size,
        fontWeight: weight,
        color,
      }}
    >
      {text.split(" ").map((w, i) => {
        const r = textReveal(f, startFrame + i * wordStagger);
        return (
          <span key={i} style={{ display: "inline-block", opacity: r.opacity, transform: `translateY(${r.y}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
