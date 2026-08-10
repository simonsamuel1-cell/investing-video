/**
 * Level — a horizontal reference line at one price, drawn on left→right.
 *
 * Two jobs across the episode: the prior low a pullback must stay above (SC04,
 * SC15), and the ceiling a push must clear (SC14, SC18). Both are descriptive
 * — a Level is never an entry, a target, or a stop.
 *
 * `pierce` briefly lights the point where price crosses it. That glow is the
 * only moment a Level is allowed to draw attention to itself.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";

export const Level = ({
  x1,
  x2,
  y,
  draw = 1,
  variant = "slate",
  label,
  labelSide = "inside",
  opacity = 1,
  dashed = true,
  pierce,
}: {
  x1: number;
  x2: number;
  y: number;
  draw?: number;
  variant?: "slate" | "indigo" | "cyan";
  label?: string;
  /**
   * "inside" parks the label just above the line's right end, which is the only
   * placement that cannot run past the safe margin — these lines usually reach
   * the edge of the plot. "right"/"left" hang it off the end and are for short
   * labels on short lines.
   */
  labelSide?: "right" | "left" | "inside";
  opacity?: number;
  dashed?: boolean;
  /** { x, amount } — a soft ring at the crossing point, 0→1. */
  pierce?: { x: number; amount: number };
}) => {
  const pal = usePalette();
  if (draw <= 0.001 || opacity <= 0.001) return null;
  const color = variant === "indigo" ? pal.indigo : variant === "cyan" ? pal.cyan : pal.slate;
  const w = (x2 - x1) * Math.max(0, Math.min(1, draw));

  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={opacity}>
        <line
          x1={x1}
          y1={y}
          x2={x1 + w}
          y2={y}
          stroke={color}
          strokeWidth={theme.stroke.rule}
          strokeDasharray={dashed ? "12 10" : undefined}
          opacity={0.85}
        />
        {pierce && pierce.amount > 0.001 && (
          <circle
            cx={pierce.x}
            cy={y}
            r={10 + 30 * pierce.amount}
            fill="none"
            stroke={color}
            strokeWidth={theme.stroke.rule}
            opacity={(1 - pierce.amount) * 0.9}
          />
        )}
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            left: labelSide === "right" ? x1 + w + 14 : labelSide === "left" ? x1 - 14 : x1 + w - 8,
            top: labelSide === "inside" ? y - 12 : y,
            transform:
              labelSide === "right" ? "translate(0, -50%)" : labelSide === "left" ? "translate(-100%, -50%)" : "translate(-100%, -100%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.axis.size,
            fontWeight: theme.type.axis.weight,
            color,
            opacity: opacity * Math.max(0, Math.min(1, draw * 2 - 1)),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
