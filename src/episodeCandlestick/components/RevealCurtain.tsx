/**
 * RevealCurtain — a solid bg panel that conceals everything to the right of a
 * leading edge, with a 2px indigo vertical rule at that edge. Used in SC14B
 * (slides in to hide the future) and SC14C (retreats right to reveal it).
 *
 * `x` is the target leading edge (where a fully-in curtain sits). `slideProgress`
 * 1 = fully covering from `x`; 0 = fully off the right edge.
 */
import { theme } from "../theme";

export const RevealCurtain = ({ x, slideProgress }: { x: number; slideProgress: number }) => {
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  const edge = x + (W - x) * (1 - slideProgress); // leading edge position
  if (slideProgress <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <div style={{ position: "absolute", left: edge, top: 0, width: W - edge, height: H, background: theme.colors.bg }} />
      <div style={{ position: "absolute", left: edge - theme.stroke.standard, top: 0, width: theme.stroke.standard, height: H, background: theme.colors.indigo }} />
    </div>
  );
};
