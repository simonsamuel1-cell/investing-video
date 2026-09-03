/**
 * core/PickRail.tsx — a column of choices with one of them picked.
 *
 * The third way of showing a small fixed set, after `TabRow` (a line across the
 * top) and `RollList` (a drum that shows three). This one shows ALL of them,
 * standing still, and moves a single highlight between them.
 *
 * ═══ ONE HIGHLIGHT THAT TRAVELS ═══
 *
 * ⚠ THERE IS EXACTLY ONE PILL AND IT SLIDES. Four pills trading opacity is the
 * obvious build and it is wrong: two of them are half-lit through the whole
 * change, so the eye is told "these two, a bit" instead of "that one, now".
 * A single pill moving from one row to the next says which one is next BEFORE
 * it arrives, which is the entire job of the animation.
 *
 * ⚠ THE ROWS DO NOT MOVE. Only the pill and the ink do — a list whose items
 * shift when the choice changes makes the reader re-find the one they were
 * reading.
 */
import { useCurrentFrame, interpolate, interpolateColors } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";

/** One row: an optional dot, and one entry per LINE of its label. Colours are
 *  the ones the row takes once picked; unpicked, every line is the same grey —
 *  a dimmed row that keeps its colours is not dimmed, only smaller. */
export type PickRow = {
  dot?: string;
  lines: { text: string; color?: string }[];
};

export const PickRail = ({
  rows,
  select,
  at,
  x,
  y,
  w,
  h,
  gap,
  size,
  lead,
  radius,
  weight = 700,
  weightOff = weight,
  dim = 0.55,
  move,
  stepIn = 0,
  fill,
  pad = 24,
  dotSize = 16,
  dotGap = 16,
}: {
  rows: PickRow[];
  /** The frame each row becomes the picked one. */
  select: number[];
  /** The frame the rail arrives on. */
  at: number;
  /** Top-left of the FIRST row. */
  x: number;
  y: number;
  w: number;
  h: number;
  gap: number;
  size: number;
  /** Leading between a row's own lines. Defaults to `size * 1.3`. */
  lead?: number;
  /** Corner radius of the pill. Defaults to a capsule. */
  radius?: number;
  /** The picked row's weight. */
  weight?: number;
  /** Every other row's weight. */
  weightOff?: number;
  /** An unpicked row's opacity. */
  dim?: number;
  /** How long the pill takes to travel one row, in frames. */
  move: number;
  /** Frames between one row arriving and the next. 0 lands them together. */
  stepIn?: number;
  /** The pill's fill. */
  fill?: string;
  /** Left inset of a row's contents. */
  pad?: number;
  dotSize?: number;
  dotGap?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();

  /** Continuous, so the pill's position and every row's ink are read off the
   *  same number and cannot disagree mid-move. */
  const pos = select.reduce((a, s, i) => (i === 0 ? a : a + progress(f, s, move)), 0);
  const pitch = h + gap;
  const step = lead ?? size * 1.3;
  const textX = pad + dotSize + dotGap;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the pill, drawn once, underneath every row */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + pos * pitch,
          width: w,
          height: h,
          borderRadius: radius ?? h / 2,
          background: fill ?? theme.color.indigoWashStrong,
          opacity: progress(f, at, move),
        }}
      />
      {rows.map((row, i) => {
        const near = Math.max(0, 1 - Math.abs(i - pos));
        const arrive = progress(f, at + i * stepIn, move);
        if (arrive <= 0.001) return null;
        /** The block of lines, centred in the row. */
        const top = (h - row.lines.length * step) / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + i * pitch,
              width: w,
              height: h,
              opacity: arrive * interpolate(near, [0, 1], [dim, 1]),
              transform: `translateX(${((1 - arrive) * -24).toFixed(1)}px)`,
            }}
          >
            {row.dot ? (
              /* ⚠ THE DOT SITS ON THE FIRST LINE, not in the middle of the row.
                 A two-line label has a heading and a qualifier; an icon parked
                 between them belongs to neither.

                 ⚠ AND IT KEEPS ITS COLOUR WHEN THE ROW IS NOT PICKED. The dot
                 is what tells one row from another at a glance; grey it out
                 with the words and it stops identifying anything. */
              <div
                style={{
                  position: "absolute",
                  left: pad,
                  top: top + step / 2 - dotSize / 2,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  background: row.dot,
                }}
              />
            ) : null}
            {row.lines.map((line, j) => {
              const ink = interpolateColors(
                near,
                [0, 1],
                [c.muted, line.color ?? theme.color.indigo],
              );
              /* ⚠ WEIGHT IS CROSS-FADED, NOT SWITCHED. 400 to 700 has nothing
                 in between, and a weight that snaps halfway through a move
                 everything else eases is the only thing anyone sees. Two
                 copies trading opacity — the same trick TabRow uses. */
              return [weightOff, weight].map((wt, q) => (
                <div
                  key={`${j}-${q}`}
                  style={{
                    position: "absolute",
                    left: textX,
                    top: top + j * step,
                    height: step,
                    lineHeight: `${step}px`,
                    whiteSpace: "nowrap",
                    fontFamily: theme.text.family,
                    fontSize: size,
                    fontWeight: wt,
                    color: ink,
                    opacity: q === 0 ? 1 - near : near,
                  }}
                >
                  {line.text}
                </div>
              ));
            })}
          </div>
        );
      })}
    </div>
  );
};
