/**
 * Chip — rounded label chip (16px radius, 1px border) with an optional 1px
 * connector line to the point it annotates. UI element, so a small pop-in is
 * allowed; the label text itself never rotates and never overlaps other text.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

export type ChipVariant = "indigo" | "slate" | "cyan";

const palette = (v: ChipVariant) =>
  v === "indigo"
    ? { fg: theme.colors.indigo, bg: theme.colors.indigoSoft, line: theme.colors.indigo }
    : v === "cyan"
      ? { fg: theme.colors.cyan, bg: theme.colors.cyanSoft, line: theme.colors.cyan }
      : { fg: theme.colors.slate, bg: theme.colors.cardBg, line: theme.colors.muted };

export const Chip = ({
  label,
  x,
  y,
  variant = "indigo",
  startFrame = 0,
  anchor = "center",
  connectorTo,
  size = theme.type.chip.size,
  opacity = 1,
  width,
  bare = false,
}: {
  label: string;
  x: number;
  y: number; // chip centre-y
  variant?: ChipVariant;
  startFrame?: number;
  anchor?: "center" | "left" | "right";
  connectorTo?: { x: number; y: number }; // draws a 1px connector to this point
  size?: number;
  opacity?: number;
  /** Fixed outer width — lets a set of chips align or balance to a common size. */
  width?: number;
  /** Drop the pill: no background, no border — just the label in the variant colour. */
  bare?: boolean;
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  if (f < startFrame) return null;
  const c = palette(variant);
  const scale = 0.92 + 0.08 * p; // pop is allowed on UI elements
  const translate = anchor === "center" ? "translate(-50%, -50%)" : anchor === "right" ? "translate(-100%, -50%)" : "translate(0, -50%)";

  return (
    <>
      {connectorTo && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={x}
            y1={y}
            x2={connectorTo.x}
            y2={connectorTo.y}
            stroke={c.line}
            strokeWidth={theme.stroke.hair}
            opacity={p * 0.9 * opacity}
          />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `${translate} scale(${scale})`,
          width,
          boxSizing: "border-box",
          textAlign: "center",
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          background: bare ? "transparent" : c.bg,
          border: bare ? "none" : `${theme.stroke.hair}px solid ${c.fg}`,
          color: c.fg,
          fontFamily: theme.type.family,
          fontSize: size,
          fontWeight: theme.type.chip.weight,
          whiteSpace: "nowrap",
          opacity: p * opacity,
        }}
      >
        {label}
      </div>
    </>
  );
};
