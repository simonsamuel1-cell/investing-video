/**
 * SC11 · THE FLAG, TWICE.  `from 9320 · to 10185`
 *
 * ⚠ THE BULLISH FLAG FROM SIMON'S REFERENCE SHEET — the Flag cell under
 * Bullish Patterns in chart pattern.webp. Sixteen bars traced off that drawing,
 * and the two converging lines that make it a flag rather than a run of
 * candles.
 *
 * ⚠ THE SCENE IS ONE PICTURE MADE, THEN MOVED ASIDE FOR A SECOND. The big
 * window builds the pattern in candles with the last three bars withheld, draws
 * the wedge, and only then lets those three back as empty outlines; it slides
 * left; a window half its size arrives on the right holding the same pattern
 * already finished — straightened to six points, drawn as a line, with nothing
 * withheld and nothing animated; and last, a second dashed fan opens under the
 * first, the same three bars going the other way.
 *
 * ⚠ TWO FUTURES, NOT ONE. A single dashed fan going up is a forecast, and this
 * video does not make them. Two of them, mirrored so they cannot differ in size
 * or in weight, is the scene saying it does not know — which is the thing the
 * narration is about.
 *
 * ⚠ THE DIFFERENCE BETWEEN THE TWO IS THE WHOLE REASON FOR BOTH. Same series,
 * same domain, same wedge. One of them is being made and one of them is done;
 * one had to wait for its last three bars and the other never did. On a scene
 * about hindsight that pair is the argument.
 *
 * ⚠ NO NAMES — Simon: "hapus semua kata Flag". Both captions are gone and both
 * drawings are now centred in their windows rather than riding above the band
 * one used to occupy. See plotOf in data/layout.ts: the boxes did not resize,
 * they moved.
 *
 * ⚠ THE WINDOW SLIDES AS GEOMETRY, NOT AS A TRANSFORM. Its card, its plot, the
 * grid solved from that plot, the candles on that grid and the wedge solved
 * from it are all recomputed at the shift's own progress — see `bigAt` in
 * data/layout.ts. A CSS transform over a finished picture would take the stroke
 * widths with it, which is the thing this project does not do.
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
  Candles, Card, DashedBox, Layer, Stage,
  candleWidth, dashOpenAt, domainOf, drawPath, fadeOut, gridOf, pathOf,
  progress, ramp, theme, useMotion, usePalette,
} from "../../../core";
import type { Grid } from "../../../core";
import { WINDOW11, local } from "../data/timing";
import { WIN11, bigAt, droppedBy, flagWedge } from "../data/layout";
import { FLAG, FLAG_BARS, FLAG_DOWN, FLAG_LINE } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = WINDOW11;
const W = WIN11;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ ONE DOMAIN FOR BOTH WINDOWS, AND IT COVERS ALL SIXTEEN BARS. In the big
 * window that is what makes the last three WITHHELD rather than removed — the
 * scale reserves their room from the first frame, so they arrive into the space
 * that was always theirs and nothing else moves. In the small one it is what
 * makes the two drawings the same drawing: a line normalised to its own range
 * would be a different shape from the candles beside it, and the comparison
 * would be rigged.
 */
const DOMAIN = domainOf(FLAG.closes, FLAG_BARS);
/** ⚠ SLICED, NOT RE-INDEXED. core/Candles maps index k of what it is given onto
 *  grid.x(k), so dropping bars off the END leaves every remaining one where it
 *  was. Dropping them off the front would not. */
const SOLID = FLAG_BARS.slice(0, FLAG_BARS.length - W.hidden);
const UP = FLAG_BARS.slice(FLAG_BARS.length - W.hidden);
/**
 * ⚠ THE FALLING FAN AS A FULL-LENGTH TAPE, so core/Candles can draw it.
 *
 * That component is the only place in this project allowed to use the candle
 * colours — scripts/audit.mjs enforces it by filename — and now that these
 * three are solid red rather than outlines, it is the component that has to
 * draw them. It maps index k of what it is given onto grid.x(k), so the three
 * are handed to it at the END of a sixteen-long array and read back with
 * `from`, which puts them in the same three columns as the rising three.
 */
const DOWN_TAPE = [...FLAG_BARS.slice(0, FLAG_BARS.length - W.hidden), ...FLAG_DOWN];
const DOWN_FROM = FLAG_BARS.length - W.hidden;

/** ⚠ THE SMALL WINDOW DOES NOT MOVE, so its grid is solved once. */
const SMALL_GRID = gridOf(FLAG.closes, DOMAIN, W.small.plot, W.plotPad);

/**
 * The three bars the big window withheld, as outlines.
 *
 * ⚠ DRAWN HERE RATHER THAN BY core/Candles, and it is not a near-miss of that
 * component. Candles fills a body in the direction the bar closed; these have
 * no fill and no direction, because the whole point of them is that they had
 * not happened yet. What they share with the real bars is their geometry, and
 * that comes from the same grid.
 */
const Ghosts = ({ g, bars }: { g: Grid; bars: typeof FLAG_BARS }) => {
  const c = usePalette();
  const w = candleWidth(g);
  return (
    <>
      {bars.map((b, k) => {
        /** ⚠ BOTH FANS SIT ON THE SAME THREE INDICES, which is what puts the
         *  falling three exactly under the rising three — Simon: "persis
         *  sejajar di bawah". */
        const i = FLAG_BARS.length - bars.length + k;
        const x = g.x(i);
        const top = Math.min(g.y(b.o), g.y(b.c));
        const h = Math.abs(g.y(b.c) - g.y(b.o));
        return (
          /* ⚠ NO WICK — Simon: "yang 3 candlestick hollow, hapus wicknya". A
             wick is a high and a low, and a bar that has not happened has
             neither; the dashed body is the whole of what this says. It is also
             what separates the two fans at a glance now: the solid red bars
             below keep their wicks because they are bars that did happen. */
          <g key={i} stroke={c.muted} strokeWidth={W.ghost.width} fill="none">
            <rect
              x={x - w / 2}
              y={top}
              width={w}
              height={h}
              rx={Math.min(w * 0.22, 5)}
              strokeDasharray={W.ghost.dash}
            />
          </g>
        );
      })}
    </>
  );
};

/**
 * The scene's closing line, typed into a dashed box.
 *
 * ⚠ THE TYPING WAITS FOR THE FRAME. `dashOpenAt` is the one answer to "when may
 * my content start" — text that begins while the box is still a sliver is text
 * hanging in the air. Same shape as SC10's note, which is the same instruction.
 *
 * ⚠ IT OPENS FROM ITS MIDDLE — Simon: "muncul kotaknya dari tengah dong, jadi
 * widthnya melebar ke kiri kanan". This box is pinned to two things at once,
 * the frame's centre-line and the window's floor, and a frame that grows off
 * its left edge reads as a box sliding into position rather than one arriving
 * where it belongs. `origin` is opt-in in core/DashedBox: eleven other scenes
 * mount that component and all of them were approved opening from the left.
 *
 * ⚠ CENTRED, NOW THAT IT IS ONE LINE. It was set left while it wrapped onto
 * two, because a centred line grows out of its own middle as it types and on
 * two lines the break point creeps as well. One line nearly filling its box has
 * neither problem, and left-aligning it would leave all the slack on one side.
 */
const Note = ({ g }: { g: number }) => {
  const m = useMotion();
  const c = usePalette();
  const N = W.note;
  const open = dashOpenAt(V.note.at, m);
  const shown = V.note.text.slice(
    0,
    Math.floor(ramp(g, open, V.note.text.length * V.note.perChar) * V.note.text.length),
  );
  return (
    <DashedBox
      x={N.x}
      y={N.y}
      w={N.w}
      h={N.h}
      block={N.block}
      origin="center"
      at={local(V.note.at, V.at)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: N.pad,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: theme.text.title.weight,
          lineHeight: 1.3,
          color: c.ink,
        }}
      >
        {shown}
      </div>
    </DashedBox>
  );
};

export const ChartWindow = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const open = progress(f, local(V.card, V.at), m.fade);
  const drawn = progress(f, local(V.lines, V.at), m.sec(0.5));
  const ghost = progress(f, local(V.ghost, V.at), m.reveal);
  /** ⚠ ONE PER BAR — Simon: "candlestick merah nya animasi muncul satu satu".
   *  core/Candles' `wipe` grows each bar out of the end it came from, which for
   *  a falling bar is its high; three of them 20 frames apart read as a
   *  cascade. */
  const red = (i: number) =>
    progress(f, local(V.down.at, V.at) + (i - DOWN_FROM) * V.down.step, m.reveal);
  const slide = progress(f, local(V.shift, V.at), m.move);
  const small = progress(f, local(V.small.at, V.at), m.fade);
  /** ⚠ ONE OPACITY FOR THE WHOLE SECOND WINDOW — Simon: "fade in aja semuanya
   *  langsung". Nothing in there draws on. */
  const fill = progress(f, local(V.small.fill, V.at), m.fade);
  const out = fadeOut(f, local(V.out, V.at), m.fade);

  /** ⚠ RESOLVED EVERY FRAME, AND CHEAPLY. The whole big window — card and plot
   *  — is a function of how far through the shift it is. */
  const big = bigAt(slide);
  const bigGrid = gridOf(FLAG.closes, DOMAIN, big.plot, W.plotPad);

  const wedge = (g: Grid, p: number, trim: boolean, key: string) => (
    <Layer key={key} opacity={trim ? 1 : p}>
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
          {...(trim ? drawPath(p, Math.hypot(e.x2 - e.x1, e.y2 - e.y1)) : null)}
        />
      ))}
    </Layer>
  );

  return (
    <Stage>
      <div style={{ opacity: out }}>
        {/* ═══ the big window — the pattern being made ═══════════════════ */}
        <Card rect={big.card} opacity={open} soft />
        {/* ⚠ core/Candles DIRECTLY, NOT core/Chart. Chart was here for its
            left-to-right build and everything else it draws was already turned
            off; its `shown` is a fraction of the whole series, and withholding
            the last three bars is exactly a thing that fraction cannot say. */}
        <Candles
          bars={SOLID}
          grid={bigGrid}
          shown={progress(f, local(V.candles, V.at), m.sec(0.83))}
        />
        {f >= local(V.lines, V.at) && wedge(bigGrid, drawn, true, "bigWedge")}
        {/* ⚠ AFTER THE WEDGE — Simon. An empty bar arriving before the boundary
            exists is a bar breaking nothing. */}
        {ghost > 0.001 && (
          <Layer opacity={ghost}>
            <Ghosts g={bigGrid} bars={UP} />
          </Layer>
        )}
        {/* ⚠ AND THEN THE OTHER ONE, SOLID AND 20px LOWER — Simon: "turunin
            posisinya 20 px … buat jadi berwarna merah (uda bukan hollow)". The
            rising three are what the pattern promised and these are what
            happened, so only one of the two is drawn as a possibility.
            ⚠ THE 20px IS A DRAWING OFFSET, NOT A PRICE. Both fans leave from
            the same close, so their first bars met there and read as one long
            candle; this separates them without making the falling move a
            different size from the rising one. See droppedBy.
            ⚠ AND THEY ARRIVE ONE AT A TIME. No opacity here: `wipe` returns 0
            for a bar whose frame has not come and core/Candles draws nothing
            for it, so the stagger is also the mount guard. */}
        <Candles
          bars={DOWN_TAPE}
          grid={droppedBy(bigGrid, W.downDrop)}
          from={DOWN_FROM}
          wipe={red}
        />

        {/* ═══ the small window — the pattern already finished ═══════════ */}
        <Card rect={W.small.card} opacity={small} soft />
        {/* ⚠ THE PRICE IS INK, NOT INDIGO, AND IT IS SIX POINTS RATHER THAN
            SIXTEEN — Simon: "lurusin aja, ga perlu sama persis". The six are the
            pattern's own turns, so the line touches the wedge exactly where the
            candles do; see FLAG_LINE. Ink rather than indigo because indigo is
            the wedge's, and three indigo lines crossing in a 418px box is one
            drawing nobody can read — the first render proved it.
            ⚠ AND IT FADES. No trim, no build: this window holds a finished
            thing. */}
        {fill > 0.001 && (
          <Layer opacity={fill}>
            <path
              d={pathOf(FLAG_LINE, SMALL_GRID)}
              fill="none"
              stroke={c.ink}
              strokeWidth={theme.shape.line}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Layer>
        )}
        {fill > 0.001 && wedge(SMALL_GRID, fill, false, "smallWedge")}

        {/* ═══ what the two of them add up to ═══════════════════════════ */}
        <Note g={f + V.at} />
      </div>
    </Stage>
  );
};
