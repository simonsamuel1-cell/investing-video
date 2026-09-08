/**
 * ResistanceArea.tsx — the band on SC16's chart, in its own file so its
 * position is easy to move.
 *
 * ⚠ THE POSITION IS A PRICE, NOT A SCREEN OFFSET, AND THAT MATTERS HERE. The
 * chart widens at f14665 from 46 bars to 232, so one canvas pixel is a
 * different amount of price before and after. A band nudged by pixels would
 * drift against the candles all the way through that move. `DROP` below is
 * therefore measured ONCE, in the close-up's own grid, and converted into a
 * price — after which the band is a level, flat and fixed to the tape.
 */
import { theme, type Grid } from "../../../core";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * How far DOWN the band sits from the price it was derived at, in the CLOSE-UP
 * view's pixels. Bigger pushes it down, smaller lifts it, 0 puts it back on the
 * peak it came from. Simon's number is 100.
 */
export const DROP = 150;
/** The frame around it. `radius` is capped at half the band's height so a thin
 *  band becomes a capsule rather than drawing a broken corner. */
const EDGE = { width: theme.shape.rule, radius: 16 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The band's TOP EDGE in canvas pixels — the same number the component draws
 * itself against.
 *
 * ⚠ EXPORTED SO NOTHING ELSE RE-DERIVES IT. The caption above the band is
 * placed relative to this edge, and a second copy of `DROP` living in the scene
 * is a caption that stays behind the day the band is moved.
 */
export const resistanceTop = (
  grid: Grid,
  band: { hi: number; lo: number },
  closeUp: Grid,
) => grid.y(band.hi - ((closeUp.hi - closeUp.lo) / closeUp.box.h) * DROP);

export const ResistanceArea = ({
  grid,
  box,
  band,
  closeUp,
  label,
}: {
  /** The grid the chart is currently drawn on — the band follows it. */
  grid: Grid;
  /** The plot rect, which is how wide the band runs. */
  box: { x: number; y: number; w: number; h: number };
  /** The two prices the band spans, before the drop. */
  band: { hi: number; lo: number };
  /**
   * ⚠ THE CLOSE-UP'S GRID, NOT THE CURRENT ONE. `DROP` has to mean the same
   * price at every zoom level, so it is converted against the view the number
   * was chosen in — passing `grid` here would make the band move as the chart
   * opens out.
   */
  closeUp: Grid;
  label?: { text: string; size: number; gap: number };
}) => {
  const drop = ((closeUp.hi - closeUp.lo) / closeUp.box.h) * DROP;
  const top = resistanceTop(grid, band, closeUp);
  const bottom = grid.y(band.lo - drop);
  const h = bottom - top;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top,
          width: box.w,
          height: h,
          background: theme.color.zoneFill,
          /* ⚠ ALL FOUR SIDES — Simon's call. A band with only a top and a
             bottom is two rules that happen to be parallel; closing the ends
             makes it one shape, which is what an AREA is. */
          border: `${EDGE.width}px solid ${theme.color.indigo}`,
          borderRadius: Math.min(EDGE.radius, h / 2),
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: top - label.gap - label.size,
            fontFamily: theme.text.family,
            fontSize: label.size,
            fontWeight: 700,
            lineHeight: 1,
            color: theme.color.indigo,
            whiteSpace: "nowrap",
          }}
        >
          {label.text}
        </div>
      )}
    </>
  );
};
