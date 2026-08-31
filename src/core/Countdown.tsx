/**
 * core/Countdown.tsx — the "3 … 2 … 1" before a prediction beat is answered.
 *
 * ⚠ THE NUMERALS LAND ON THE SPOKEN WORD, NOT ON AN EVEN GRID.
 *
 * A recorded countdown is almost never evenly spaced — a real one measured off
 * a VO ran 102 frames from "tiga" to "dua" and 40 from "dua" to "satu". So this
 * takes an ARRAY OF FRAMES, one per numeral, taken from the corrected SRT. It
 * does not take a start and an interval, because that API would quietly invite
 * the wrong thing.
 *
 * A numeral is a UI element, so it may pop.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";
import { useMotion } from "./useMotion";

export const Countdown = ({
  beats,
  x = theme.canvas.width / 2,
  y = theme.stage.card.y + theme.stage.card.h / 2,
  labels = ["3", "2", "1"],
}: {
  /** One frame per numeral, from the SRT. Same length as `labels`. */
  beats: number[];
  x?: number;
  y?: number;
  labels?: string[];
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  /** The numeral currently owning the screen: the last one whose beat passed. */
  let k = -1;
  beats.forEach((b, i) => {
    if (f >= b) k = i;
  });
  if (k < 0) return null;
  const p = progress(f, beats[k], m.pop);
  const next = beats[k + 1] ?? beats[k] + m.sec(1);
  const out = 1 - progress(f, next - m.fade, m.fade);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.86 + 0.14 * p})`,
        fontFamily: theme.text.family,
        fontSize: theme.text.display.size * 2,
        fontWeight: theme.text.display.weight,
        color: c.indigo,
        opacity: Math.min(p, out),
        lineHeight: 1,
      }}
    >
      {labels[k]}
    </div>
  );
};
