/**
 * Chip.tsx — the episode's one label primitive: Title Case type in a tone
 * colour, with an optional hairline leader to whatever it annotates.
 *
 * NO PILL BY DEFAULT. No fill, no border, no padding — a label is the word
 * itself. The tone carries the meaning (indigo for peaks and primary labels,
 * cyan for troughs and accents, slate for muted ones), and the colour alone is
 * enough to say which is which.
 *
 * `pill` opts a label back into a fill and a border. Use it for labels that are
 * their own object rather than an annotation on something else — SC03's three
 * questions, which sit on the card but are not pointing at any part of it.
 * A pill on an annotation would fight the thing it annotates.
 *
 * A chip is still a UI element, so it may pop on arrival — that and the pivot
 * dots are the only places pop is allowed. The glyphs never move once placed.
 *
 * `strike` sweeps a line through the label (SC03, SC08); `check` prefixes a
 * tick (SC08, SC20).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";
import { Layer } from "./Stage";

export type Tone = "indigo" | "cyan" | "slate" | "outline";

/** `outline` is kept as a name for callers; with no pill it reads as indigo. */
const inkOf = (t: Tone) => (t === "cyan" ? theme.color.cyan : t === "slate" ? theme.color.slate : theme.color.indigo);
/** The pill's fill — the same hue as its ink, at wash strength. */
const washOf = (t: Tone) => (t === "cyan" ? theme.color.cyanWash : t === "slate" ? "rgba(98, 98, 102, 0.08)" : theme.color.indigoWash);
/** Breathing room inside a pill, proportional so it holds at any type size. */
const PILL_PAD = { x: 0.62, y: 0.3 };

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
  strike = 0,
  check = false,
  pill = false,
}: {
  label: string;
  x: number;
  /** Centre-y of the label. */
  y: number;
  tone?: Tone;
  at?: number;
  anchor?: "center" | "left" | "right";
  /** Draws a hairline from the label to this point. */
  leaderTo?: { x: number; y: number };
  size?: number;
  opacity?: number;
  /** 0→1 strikethrough sweep. */
  strike?: number;
  check?: boolean;
  /** Wraps the label in a tinted, outlined pill. Off everywhere else. */
  pill?: boolean;
}) => {
  const f = useCurrentFrame();
  if (f < at || opacity <= 0.001) return null;
  const p = progress(f, at, theme.motion.pop);
  const ink = inkOf(tone);
  const shift = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";

  return (
    <>
      {leaderTo && (
        <Layer opacity={p * 0.85 * opacity}>
          <line x1={x} y1={y} x2={leaderTo.x} y2={leaderTo.y} stroke={ink} strokeWidth={theme.shape.hairline} />
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
          opacity: p * opacity,
          ...(pill
            ? {
                padding: `${Math.round(size * PILL_PAD.y)}px ${Math.round(size * PILL_PAD.x)}px`,
                background: washOf(tone),
                border: `${theme.shape.rule}px solid ${ink}`,
                borderRadius: 999,
              }
            : null),
        }}
      >
        {check && <span style={{ marginRight: 10 }}>✓</span>}
        {label}
        {strike > 0.001 && (
          <div style={{ position: "absolute", left: 0, top: "50%", width: `calc(100% * ${Math.min(1, strike)})`, height: theme.shape.rule, background: ink }} />
        )}
      </div>
    </>
  );
};
