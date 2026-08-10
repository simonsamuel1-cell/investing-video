/**
 * Chip.tsx — the episode's one label primitive. Title Case, rounded, optional
 * hairline leader to whatever it annotates.
 *
 * A chip is a UI element, so it may pop on arrival — that and the pivot dots
 * are the only places pop is allowed. The glyphs inside never move.
 *
 * Variants: indigo / cyan / slate carry a soft fill; `outline` drops the fill;
 * `bare` drops the pill entirely. `strike` sweeps a line through the label
 * (SC03, SC08) and `check` prefixes a tick (SC08, SC20).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";
import { Layer } from "./Stage";

export type Tone = "indigo" | "cyan" | "slate" | "outline";

const toneOf = (t: Tone) =>
  t === "indigo"
    ? { fg: theme.color.indigo, bg: theme.color.indigoPale }
    : t === "cyan"
      ? { fg: theme.color.cyan, bg: theme.color.cyanPale }
      : t === "slate"
        ? { fg: theme.color.slate, bg: theme.color.surface }
        : { fg: theme.color.indigo, bg: "transparent" };

export const Chip = ({
  label,
  x,
  y,
  tone = "indigo",
  at = 0,
  anchor = "center",
  leaderTo,
  size = theme.text.chip.size,
  opacity = 1,
  bare = false,
  strike = 0,
  check = false,
}: {
  label: string;
  x: number;
  /** Centre-y of the chip. */
  y: number;
  tone?: Tone;
  at?: number;
  anchor?: "center" | "left" | "right";
  /** Draws a hairline from the chip to this point. */
  leaderTo?: { x: number; y: number };
  size?: number;
  opacity?: number;
  bare?: boolean;
  /** 0→1 strikethrough sweep. */
  strike?: number;
  check?: boolean;
}) => {
  const f = useCurrentFrame();
  if (f < at || opacity <= 0.001) return null;
  const p = progress(f, at, theme.motion.pop);
  const c = toneOf(tone);
  const shift = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";

  return (
    <>
      {leaderTo && (
        <Layer opacity={p * 0.85 * opacity}>
          <line x1={x} y1={y} x2={leaderTo.x} y2={leaderTo.y} stroke={c.fg} strokeWidth={theme.shape.hairline} />
        </Layer>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(${shift}, -50%) scale(${0.92 + 0.08 * p})`,
          padding: bare ? 0 : "8px 20px",
          borderRadius: theme.shape.chipRadius,
          background: bare || tone === "outline" ? "transparent" : c.bg,
          border: bare ? "none" : `${theme.shape.hairline}px solid ${c.fg}`,
          color: c.fg,
          fontFamily: theme.text.family,
          fontSize: size,
          fontWeight: theme.text.chip.weight,
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
              height: theme.shape.rule,
              background: c.fg,
            }}
          />
        )}
      </div>
    </>
  );
};
