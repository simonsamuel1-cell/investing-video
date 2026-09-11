/**
 * core/VerdictMark.tsx — a tick or a cross in a filled disc.
 *
 * ⚠ AN INLINE BADGE, NOT A PLACED ONE. Every episode that has needed this drew
 * it absolutely, next to a label whose width nobody could measure, and then
 * nudged the two until they looked centred. As a span it sits in a flex row
 * with its word and the row centres itself.
 *
 * ⚠ GREEN AND RED, AND THIS IS ONE OF THE TWO PLACES THEY ARE ALLOWED OUTSIDE
 * A CANDLE. `ok` and `warn` are named slots for exactly this: a mark that says
 * yes or no. Never for drawn chart content, and never as the colour of words.
 */
import { theme } from "./theme";

export const VerdictMark = ({
  kind,
  size,
}: {
  kind: "check" | "cross";
  /** Diameter. The glyph is sized from it, so one number sets the badge. */
  size: number;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: "0 0 auto",
      borderRadius: 999,
      background: kind === "check" ? theme.color.ok : theme.color.warn,
      color: theme.color.onIndigo,
      fontFamily: theme.text.family,
      fontSize: Math.round(size * 0.58),
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    {kind === "check" ? "✓" : "✕"}
  </span>
);
