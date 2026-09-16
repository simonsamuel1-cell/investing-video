/**
 * SC11 · THE FLAG, TWICE.  `from 9320 · to 10185`
 *
 * ⚠ THE BULLISH FLAG FROM SIMON'S REFERENCE SHEET — the Flag cell under
 * Bullish Patterns in chart pattern.webp. Sixteen bars traced off that drawing,
 * and the two converging lines that make it a flag rather than a run of
 * candles.
 *
 * ⚠ THE SCENE IS ONE PICTURE MADE, THEN MOVED ASIDE FOR A SECOND — Simon:
 * "setelah animasinya selesai, windownya geser kiri, lalu muncul window baru di
 * sebelah kanan yang ukurannya 2x lipat lebih kecil." The big window builds the
 * pattern in candles with the last three bars hidden; it slides left; a window
 * half its size arrives on the right holding the SAME pattern, all sixteen bars
 * this time, drawn as a line.
 *
 * ⚠ THE DIFFERENCE BETWEEN THE TWO IS THE WHOLE REASON FOR BOTH. Same series,
 * same domain, same wedge — what differs is that one of them has the ending and
 * the other does not, and that one is candles and the other is a line. On a
 * scene about hindsight that pair is the argument.
 *
 * ⚠ THE WINDOW SLIDES AS GEOMETRY, NOT AS A TRANSFORM. Its card, its plot, the
 * grid solved from that plot, the candles on that grid and the wedge solved
 * from it are all recomputed at the shift's own progress — see `bigAt` in
 * data/layout.ts. A CSS transform over a finished picture would take the stroke
 * widths and the type with it, which is the thing this project does not do.
 *
 * ⚠ NO "Entry" AND NO ARROW. The reference labels an entry on the breakout and
 * draws an arrow to it. Both are directional markers, scripts/audit.mjs is
 * right to refuse them, and they are the one part of that cell that cannot come
 * across. The pattern is the drawing; the instruction is not.
 *
 * ⚠ NO PRICE SCALE, NO GRIDLINES, NO TIME AXIS, IN EITHER WINDOW. A pattern
 * diagram with a price scale is a chart OF something, and this is a chart of
 * nothing in particular: the numbers in FLAG_BARS are the reference's own
 * pixels upside down, and nothing reads them.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Layer, Line, Stage,
  domainOf, drawPath, fadeOut, gridOf, lengthOf, pathOf, progress, theme,
  useMotion, usePalette,
} from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11, bigAt, flagWedge } from "../data/layout";
import { FLAG, FLAG_BARS } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
// ═══════════════════════════════════════════════════════════════════════════

const NAME = "Flag";
/**
 * ⚠ ONE DOMAIN FOR BOTH WINDOWS, AND IT COVERS ALL SIXTEEN BARS. In the big
 * window that is what makes the last three HIDDEN rather than removed — the
 * scale still reserves their room, so the thirteen on screen sit where they sat
 * and nothing moves if they come back. In the small one it is what makes the
 * two drawings the same drawing: a line normalised to its own range would be a
 * different shape from the candles beside it, and the comparison would be rigged.
 */
const DOMAIN = domainOf(FLAG.closes, FLAG_BARS);
/** ⚠ SLICED, NOT RE-INDEXED. core/Candles maps index k of what it is given onto
 *  grid.x(k), so dropping bars off the END leaves every remaining one where it
 *  was. Dropping them off the front would not. */
const SHOWN = FLAG_BARS.slice(0, FLAG_BARS.length - W.hidden);

/** ⚠ THE SMALL WINDOW DOES NOT MOVE, so its grid is solved once. */
const SMALL_GRID = gridOf(FLAG.closes, DOMAIN, W.small.plot, W.plotPad);

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const open = progress(f, local(V.card, V.at), m.fade);
  const drawn = progress(f, local(V.lines, V.at), m.sec(0.5));
  const slide = progress(f, local(V.shift, V.at), m.move);
  const small = progress(f, local(V.small.at, V.at), m.fade);
  const smallWedge = progress(f, local(V.small.wedge, V.at), m.sec(0.5));
  const out = fadeOut(f, local(V.out, V.at), m.fade);

  /** ⚠ RESOLVED EVERY FRAME, AND CHEAPLY. The whole big window — card, plot,
   *  name — is a function of how far through the shift it is. */
  const big = bigAt(slide);
  const bigGrid = gridOf(FLAG.closes, DOMAIN, big.plot, W.plotPad);

  const wedge = (g: ReturnType<typeof gridOf>, p: number, key: string) => (
    <Layer key={key}>
      {flagWedge(g).map((e, k) => (
        <line
          key={k}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={c.indigo}
          strokeWidth={W.wedge.width}
          strokeLinecap="round"
          {...drawPath(p, Math.hypot(e.x2 - e.x1, e.y2 - e.y1))}
        />
      ))}
    </Layer>
  );

  return (
    <Stage>
      <div style={{ opacity: out }}>
        {/* ═══ the big window — candles, and no ending ═══════════════════ */}
        <Card rect={big.card} opacity={open} soft />
        {/* ⚠ core/Candles DIRECTLY, NOT core/Chart. Chart was here for its
            left-to-right build and everything else it draws was already turned
            off; its `shown` is a fraction of the whole series, and hiding the
            last three bars is exactly a thing that fraction cannot say. */}
        <Candles
          bars={SHOWN}
          grid={bigGrid}
          shown={progress(f, local(V.candles, V.at), m.sec(0.83))}
        />
        {f >= local(V.lines, V.at) && wedge(bigGrid, drawn, "bigWedge")}
        <Line
          text={NAME}
          x={big.name.x}
          y={big.name.y}
          at={local(V.name, V.at)}
          size={big.type}
          weight={theme.text.chip.weight}
          color={c.slate}
        />

        {/* ═══ the small window — a line, and the ending ═════════════════ */}
        <Card rect={W.small.card} opacity={small} soft />
        {/* ⚠ THE PRICE IS INK, NOT INDIGO, AND THAT IS WHY core/Chart's line
            mode is not used here. It draws its path in `indigo`, which is also
            the wedge's colour — and three indigo lines crossing in a 418px box
            is one drawing nobody can read. In the big window the price is in
            the candles' own colours and the reading is indigo; this keeps that
            split. core's own path helpers do the drawing either way. */}
        {f >= local(V.small.line, V.at) && (
          <Layer opacity={small}>
            <path
              d={pathOf(FLAG.closes, SMALL_GRID)}
              fill="none"
              stroke={c.ink}
              strokeWidth={theme.shape.line}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...drawPath(
                progress(f, local(V.small.line, V.at), m.sec(0.83)),
                lengthOf(FLAG.closes, SMALL_GRID),
              )}
            />
          </Layer>
        )}
        {f >= local(V.small.wedge, V.at) && wedge(SMALL_GRID, smallWedge, "smallWedge")}
        <Line
          text={NAME}
          x={W.small.name.x}
          y={W.small.name.y}
          at={local(V.small.name, V.at)}
          size={W.small.type}
          weight={theme.text.chip.weight}
          color={c.slate}
        />
      </div>
    </Stage>
  );
};
