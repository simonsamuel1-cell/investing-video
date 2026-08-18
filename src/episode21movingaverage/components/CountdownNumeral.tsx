/**
 * CountdownNumeral.tsx — SC18's three, two, one.
 *
 * A numeral is a UI element, so it may pop. It dramatises a moment in a chart
 * that has ALREADY happened, and the reveal that follows is whatever the data
 * did. It is not a prediction, and it must never be reused to build
 * anticipation about a price that has not printed yet.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";

export const CountdownNumeral = ({
  value,
  x,
  y,
  at,
  hold = 22,
}: {
  value: string;
  x: number;
  y: number;
  at: number;
  /** Frames on screen, fade-out included. */
  hold?: number;
}) => {
  const f = useCurrentFrame();
  if (f < at || f >= at + hold) return null;
  const rise = progress(f, at, 10);
  const leave = f >= at + hold - 8 ? progress(f, at + hold - 8, 8) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * rise})`,
        fontFamily: theme.text.family,
        fontSize: theme.text.display.size,
        fontWeight: theme.text.display.weight,
        color: theme.color.indigo,
        opacity: rise * (1 - leave),
      }}
    >
      {value}
    </div>
  );
};
