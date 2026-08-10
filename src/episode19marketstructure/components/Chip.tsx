/**
 * Chip — the episode's one label primitive. Title Case, rounded pill, optional
 * 1px connector to the point it annotates.
 *
 * A chip is a UI element, so a small pop-in is allowed — that is the ONLY place
 * pop is permitted. The text inside never bounces and never rotates.
 *
 * Variants:
 *   indigo / cyan / slate — filled soft background, 1px border
 *   outline               — no fill, border + text only
 *   bare                  — type alone, no pill at all
 * `strike` drives a line through the label (SC03, SC08); `check` prefixes a
 * tick (SC08, SC20).
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { Layer } from "./SafeArea";

export type ChipVariant = "indigo" | "cyan" | "slate" | "outline";

const colorsOf = (v: ChipVariant) =>
  v === "indigo"
    ? { fg: theme.colors.indigo, bg: theme.colors.indigoSoft, line: theme.colors.indigo }
    : v === "cyan"
      ? { fg: theme.colors.cyan, bg: theme.colors.cyanSoft, line: theme.colors.cyan }
      : v === "slate"
        ? { fg: theme.colors.slate, bg: theme.colors.cardBg, line: theme.colors.muted }
        : { fg: theme.colors.indigo, bg: "transparent", line: theme.colors.indigo };

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
  bare = false,
  strike = 0,
  check = false,
}: {
  label: string;
  x: number;
  /** Centre-y of the chip. */
  y: number;
  variant?: ChipVariant;
  startFrame?: number;
  anchor?: "center" | "left" | "right";
  connectorTo?: { x: number; y: number };
  size?: number;
  opacity?: number;
  bare?: boolean;
  /** 0→1 strikethrough sweep. */
  strike?: number;
  check?: boolean;
}) => {
  const f = useCurrentFrame();
  if (f < startFrame || opacity <= 0.001) return null;
  const p = interpolate(f, [startFrame, startFrame + theme.motion.popFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const c = colorsOf(variant);
  const filled = !bare && variant !== "outline";
  const translate = anchor === "center" ? "translate(-50%, -50%)" : anchor === "right" ? "translate(-100%, -50%)" : "translate(0, -50%)";

  return (
    <>
      {connectorTo && (
        <Layer opacity={p * 0.9 * opacity}>
          <line x1={x} y1={y} x2={connectorTo.x} y2={connectorTo.y} stroke={c.line} strokeWidth={theme.stroke.hair} />
        </Layer>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          // pop is a UI affordance; the glyphs themselves do not move
          transform: `${translate} scale(${0.92 + 0.08 * p})`,
          padding: bare ? 0 : "8px 20px",
          borderRadius: theme.radius.chip,
          background: filled ? c.bg : "transparent",
          border: bare ? "none" : `${theme.stroke.hair}px solid ${c.fg}`,
          color: c.fg,
          fontFamily: theme.type.family,
          fontSize: size,
          fontWeight: theme.type.chip.weight,
          whiteSpace: "nowrap",
          opacity: p * opacity,
        }}
      >
        {check && <span style={{ marginRight: 10 }}>✓</span>}
        {label}
        {strike > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: bare ? 0 : 16,
              top: "50%",
              width: `calc((100% - ${bare ? 0 : 32}px) * ${Math.min(1, strike)})`,
              height: theme.stroke.rule,
              background: c.fg,
            }}
          />
        )}
      </div>
    </>
  );
};
