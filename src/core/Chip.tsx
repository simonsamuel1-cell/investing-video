/**
 * core/Chip.tsx — the ONE label primitive. Title Case type in a tone colour,
 * with an optional hairline leader to whatever it annotates.
 *
 * NO PILL BY DEFAULT. No fill, no border, no padding — a label is the word
 * itself. The tone carries the meaning: indigo for peaks and primary labels,
 * cyan for troughs and accents, slate for muted ones.
 *
 * `pill` opts a label back into a fill and a border. Use it for labels that are
 * their own object rather than an annotation on something else. A pill on an
 * annotation fights the thing it annotates.
 *
 * A chip is a UI element, so it may pop on arrival — that and pivot dots are
 * the only places pop is allowed. It never moves once placed.
 *
 * ── TRIMMED FROM THE EPISODE VERSION ───────────────────────────────────────
 * The Market-Structure Chip carried 14 props. Four are gone, by decision:
 *   · `outline` tone — with no pill it resolved to indigo, so it was a
 *     duplicate name for an existing tone.
 *   · `size` / `weight` — per-call overrides. Type sizes belong to the theme;
 *     a chip that needs a different size is a different component.
 *   · `strikeInk` — a strike in a colour other than its own label's.
 *   · `opacity` — scene-level fades belong on the Layer, not on each chip.
 * These existed because each episode made a one-off design call and kept the
 * prop afterwards. Every one of them is a combination nobody checks, and it is
 * how a later episode ends up looking subtly unlike the last.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";
import { Layer } from "./Stage";

export type Tone = "indigo" | "cyan" | "slate";

/** Breathing room inside a pill, proportional so it holds at any type size. */
const PILL_PAD = { x: 0.62, y: 0.3 };

export const Chip = ({
  label,
  x,
  y,
  at = 0,
  tone = "indigo",
  anchor = "center",
  leaderTo,
  strike = 0,
  check = false,
  pill = false,
}: {
  label: string;
  x: number;
  /** Centre-y of the label. */
  y: number;
  /** Frame it arrives on. Scene-local. */
  at?: number;
  tone?: Tone;
  anchor?: "center" | "left" | "right";
  /** Draws a hairline from the label to this point. */
  leaderTo?: { x: number; y: number };
  /** 0→1 strikethrough sweep, in the label's own ink. */
  strike?: number;
  check?: boolean;
  /** Wraps the label in a tinted, outlined pill. */
  pill?: boolean;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at) return null;

  const p = progress(f, at, m.pop);
  const ink = tone === "cyan" ? c.cyan : tone === "slate" ? c.slate : c.indigo;
  const wash =
    tone === "cyan"
      ? theme.color.cyanWash
      : tone === "slate"
        ? theme.color.slateWash
        : theme.color.indigoWash;
  const shift =
    anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
  const size = theme.text.chip.size;

  return (
    <>
      {leaderTo && (
        <Layer opacity={p * 0.85}>
          <line
            x1={x}
            y1={y}
            x2={leaderTo.x}
            y2={leaderTo.y}
            stroke={ink}
            strokeWidth={theme.shape.hairline}
          />
        </Layer>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(${shift}, -50%) scale(${0.94 + 0.06 * p})`,
          color: ink,
          fontFamily: theme.text.family,
          fontSize: size,
          fontWeight: theme.text.chip.weight,
          whiteSpace: "nowrap",
          opacity: p,
          ...(pill
            ? {
                padding: `${Math.round(size * PILL_PAD.y)}px ${Math.round(size * PILL_PAD.x)}px`,
                background: wash,
                border: `${theme.shape.rule}px solid ${ink}`,
                borderRadius: 999,
              }
            : null),
        }}
      >
        {check && <span style={{ marginRight: 10 }}>✓</span>}
        {label}
        {strike > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              width: `calc(100% * ${Math.min(1, strike)})`,
              height: theme.shape.rule,
              background: ink,
            }}
          />
        )}
      </div>
    </>
  );
};
