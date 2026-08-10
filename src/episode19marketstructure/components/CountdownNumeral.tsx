/**
 * CountdownNumeral — SC18's 3-2-1.
 *
 * A numeral is a UI element, so it may pop. It dramatises a moment in a chart
 * that has ALREADY happened — the reveal that follows is whatever the data did.
 * It is not a prediction and must never be reused to build anticipation about a
 * future price.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";

export const CountdownNumeral = ({
  value,
  x,
  y,
  startFrame,
  hold = 22,
}: {
  value: string;
  x: number;
  y: number;
  startFrame: number;
  /** Total frames on screen, including the fade out. */
  hold?: number;
}) => {
  const f = useCurrentFrame();
  if (f < startFrame || f >= startFrame + hold) return null;
  const inP = progress(f, startFrame, 10);
  const outP = f >= startFrame + hold - 8 ? progress(f, startFrame + hold - 8, 8) : 0;
  const o = inP * (1 - outP);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * inP})`,
        fontFamily: theme.type.family,
        fontSize: theme.type.display.size,
        fontWeight: theme.type.display.weight,
        color: theme.colors.indigo,
        opacity: o,
      }}
    >
      {value}
    </div>
  );
};
