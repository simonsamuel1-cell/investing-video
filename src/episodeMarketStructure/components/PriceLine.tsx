/**
 * PriceLine — a price path drawn on with a trim path.
 *
 * `draw` 0→1 reveals the line left to right by walking a dash offset, which is
 * how every chart in this episode arrives: the shape is not placed, it is
 * traced, the same way the market traced it.
 *
 * Conditionally mounted by the caller (`draw > 0`) so no end-state ghost can
 * flash on a scene's frame 0.
 */
import { theme } from "../theme";
import type { Geom } from "../data/structures";
import { usePalette } from "../palette";

export const PriceLine = ({
  g,
  draw = 1,
  color,
  width = 3,
  opacity = 1,
  dashed = false,
  /** Small dot riding the head of the line while it draws. */
  head = false,
}: {
  g: Geom;
  draw?: number;
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
  head?: boolean;
}) => {
  const pal = usePalette();
  if (draw <= 0.001 || opacity <= 0.001) return null;
  const stroke = color ?? pal.ink;
  const p = Math.max(0, Math.min(1, draw));
  // measured along the line, so the dot sits exactly on the drawn end
  const tip = g.atArc(p);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={theme.canvas.width}
      height={theme.canvas.height}
      opacity={opacity}
    >
      <path
        d={g.path}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? `10 10` : g.len}
        strokeDashoffset={dashed ? 0 : g.len * (1 - p)}
      />
      {head && p < 0.999 && <circle cx={tip.x} cy={tip.y} r={width + 2} fill={stroke} />}
    </svg>
  );
};
