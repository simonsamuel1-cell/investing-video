/**
 * SC08 · TWO WINDOWS, THE SAME CHART.  Simon: "buat 2 window kiri kanan, isi
 * chartnya sama".
 *
 * ⚠ ONE SERIES, DRAWN TWICE — not two series that match. `SS03` is read by both
 * windows, so "the same" is true by construction rather than by maintenance. If
 * the two are ever meant to diverge, that divergence has to be written down as
 * a difference; it can never happen by accident.
 *
 * ⚠ AND ONE GRID SHAPE, NOT ONE GRID. Each window solves its own grid inside
 * its own box — the boxes are the same size, so the two come out identical —
 * rather than sharing a single grid that would draw both tapes in the left-hand
 * window's pixels. Same reason the zoom at 2676 changes the grid instead of
 * transforming the picture: a chart's geometry belongs to the box it is in.
 *
 * ⚠ THE WINDOWS ARE `halves()`, the box SC09 already compares things in. A
 * second pair of side-by-side windows that were merely a similar size would be
 * two devices where the video has one.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles,
  Card,
  DashedBox,
  Layer,
  candleWidth,
  dashOpenAt,
  gridOf,
  progressInOut,
  ramp,
  theme,
  useMotion,
  usePalette,
} from "../../../core";
import { PROVE_BOX, halves } from "../data/layout";
import { PROVE, TWIN } from "../data/timing";
import { SS03 } from "../data/series";
import { Analysis, LEFT_ARROW, LEFT_LINES, RIGHT_LINES } from "./Analysis";
import { RIGHT_ARROW } from "./ArrowRight";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = TWIN;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ═══ THE TWO WINDOWS ═══
 *
 * ⚠ THE BOTTOM EDGE IS THE ANCHOR — Simon: "anchor bawah". Height is taken off
 * the TOP, so the pair keeps its footing on the frame while it shrinks and
 * nothing below it has to move. Written as a bottom and a height rather than a
 * top and a height, because the anchor is the thing that must not drift: a top
 * plus a height re-centres itself every time the height changes, which is the
 * one thing "anchor bawah" rules out.
 *
 * ⚠ THE BOTTOM IS WHERE THE FIRST SHRINK LEFT IT. Simon's earlier "diturunkan
 * 150 px" came off both ends, so the pair sat centred at 265..801; that 801 is
 * now the fixed edge, derived from the same 150 rather than typed, so the two
 * instructions cannot come apart.
 */
const DROP_H = 150;
const [L0, R0] = halves();
const BOTTOM = L0.y + L0.h - DROP_H / 2;
/** ⚠ THE WINDOW'S OWN HEIGHT IS THE ONE SIMON LOCKED, and it has not moved. It
 *  briefly did — I read "shrink heightnya" as the window and he corrected it:
 *  "maksudnya shrink chartnya saja, tidak termasuk background putih/windownya".
 *  The shrink lives in the plot below instead. */
const WIN_H = 536;
const shorter = (r: typeof L0) => ({ ...r, y: BOTTOM - WIN_H, h: WIN_H });
const LEFT = shorter(L0);
const RIGHT = shorter(R0);

/**
 * ⚠ FORTY-FIVE BARS ARE HIDDEN, NOT DELETED — Simon, and he said why: "nanti aku
 * butuh candlesticks yang di-hide ini sebagai acuan untuk membuat garis
 * resistance". So `SS03` stays whole in data/series.ts and this is only the
 * window onto it. A price taken off any of the thirty is still there to be
 * taken.
 *
 * ⚠ AND THEY ARE OUT OF THE GRID, WHICH IS THE POINT OF HIDING THEM. A bar
 * drawn at zero opacity still holds its slot: the visible bars would stay
 * exactly as thin as they are, and "agar setiap candle bisa terlihat" would be
 * impossible. The grid is solved over what is SHOWN, so dropping bars is what
 * widens the rest. A level read off a hidden bar needs its PRICE, not its slot,
 * so nothing is lost by them having no place on this axis.
 */
/** ⚠ RAISED THREE TIMES, FIFTEEN AT A TIME, EACH TIME TO THE SAME COMPLAINT:
 *  "masih terlalu cluttered". This is the only number that moves for it — the
 *  plot's width and height are both fixed, so hiding bars is what widens the
 *  ones that are left. */
const HIDDEN = 45;
/**
 * ⚠ THE LAST EIGHT COME OFF THE DRAWING, NOT OFF THE GRID — Simon: "Lock posisi
 * candle, lalu hapus 8 candlestick paling kanan". Those two halves of the
 * sentence pull opposite ways, and the grid is where they are reconciled: it
 * is still solved over all 66 bars, so every candle that stays is exactly where
 * it was, and only the drawing is cut short. Sliced out of the grid instead,
 * the remaining 58 would re-spread across the same width and every one of them
 * would move — which is the thing he locked.
 */
const TRIM_RIGHT = 8;
const SHOWN = SS03.slice(HIDDEN);
const DRAWN = SHOWN.slice(0, SHOWN.length - TRIM_RIGHT);

/**
 * ═══ WHERE THE CHART SITS INSIDE ITS WINDOW ═══
 *
 * ⚠ FLUSH LEFT, AND NARROWER THAN THE WINDOW — Simon: "geser chartnya mentok
 * kiri", with white space kept on the right. `gridOf` insets the first bar by
 * GRID_PAD_X on its own, so a plot that starts exactly on the window's left
 * edge still has air in front of the tape rather than a candle cut by the card.
 *
 * ⚠ FLUSH LEFT, AND STILL NARROWER THAN THE WINDOW. Simon wants the chart
 * stretched wide enough that every candle reads, and he wants white space at
 * the right; a grid spreads its bars across whatever width it is given, so
 * those two are traded against each other in this one number. At 0.84 the tape
 * is 702px of an 836px window, and what that slot is worth per bar depends on
 * how many are shown: 66 bars make it a 10.1px slot and a 6.9px body, against
 * the 4.4px it was when 96 were drawn — with ~148px still free at the right.
 *
 * ⚠ THE WIDTH HAS NOT MOVED SINCE, and should not have to. Clutter is now fixed
 * by hiding bars, which widens the rest without touching either edge of the
 * plot; widening the plot instead would eat the white space Simon asked for
 * first.
 *
 * ⚠ AND THE CHART SHRINKS INSIDE A WINDOW THAT DOES NOT — Simon's correction.
 * The plot is given an explicit height rather than an inset top and bottom, so
 * "shrink the chart" is one number and the white card it sits in is untouched
 * by it. What the shrink leaves behind is headroom at the top of the window.
 *
 * ⚠ AND THE BOTTOM INSET IS THE ANCHOR — "anchor bawah", now applied where he
 * meant it. The plot's foot is a fixed distance up from the window's floor and
 * the height is taken off the top; expressed as a top inset plus a height it
 * would re-centre itself every time either moved.
 */
const PLOT_W = 0.84;
const PAD_BOTTOM = 22;
const PLOT_H = 392;
const plotOf = (r: typeof LEFT) => ({
  x: r.x,
  y: r.y + r.h - PAD_BOTTOM - PLOT_H,
  w: r.w * PLOT_W,
  h: PLOT_H,
});

/**
 * ⚠ THE DOMAIN COVERS THE WICKS, NOT THE CLOSES. `gridOf` is handed the highs
 * and lows as well, because a domain solved from closes alone clips the two
 * extremes of a traced tape — and this tape's extremes are most of its shape.
 */
const DOMAIN: [number, number] = [
  Math.min(...SHOWN.map((b) => b.l)),
  Math.max(...SHOWN.map((b) => b.h)),
];
const gridFor = (r: typeof LEFT) =>
  gridOf(
    SHOWN.map((b) => b.c),
    DOMAIN,
    plotOf(r),
    0,
  );

const GRID_L = gridFor(LEFT);
const GRID_R = gridFor(RIGHT);

/**
 * ═══ WHAT SOMEBODY DREW ON THE CHART ═══  Simon: ss05 on the left, ss04 on the
 * right — "contoh gambar technical analysis by a human".
 *
 * ⚠ THE LINES THEMSELVES LIVE IN scenes/Analysis.tsx, by hand and on purpose:
 * Simon asked for one file he can move them around in. Nothing about their
 * position or direction is decided here.
 *
 * ⚠ A RULE EXTENSION, ON THE RECORD. A dashed arrow projecting price out of the
 * last bar is, on its own, indistinguishable from a signal. It is drawn here
 * because the scene shows TWO of them leaving the same bar in opposite
 * directions, which is an argument that neither is worth anything — a portrait
 * of the mistake, in the same class as the "Buy" badges at 4356 and the
 * position tool. The video never draws one of these alone, and Analysis.tsx
 * asserts that the two disagree.
 *
 * ⚠ THE ARROWS' LENGTHS ARE SIMON'S NOW. They used to be normalised to one
 * reach so neither could read as the more confident; he moved a tip to make one
 * longer, so `b` in each file is the tip and sets the length outright.
 */
/**
 * ═══ THE ZIGZAG BACK TO THE START OF THE ARROW ═══  Simon: "buat trend line
 * zigzag dari candlestick paling kiri, lalu nanti sambungkan ke titik start
 * garis putus putus tanda panah. Stylenya samakan dengan panah garis putus
 * putus."
 *
 * ⚠ IT IS DERIVED, NOT DRAWN BY HAND, and that is the difference between it and
 * everything in Analysis.tsx. The four trendlines are somebody's opinion, so
 * they are typed coordinates; a zigzag is just the swings the tape actually
 * made, so it is READ OFF THE CANDLES. Typing it would let it drift away from
 * the bars it claims to join.
 *
 * ⚠ A SWING IS A REVERSAL BIG ENOUGH TO COUNT. Walk the bars keeping the
 * running extreme; when price turns back from it by more than `SWING`, that
 * extreme was a pivot. Without a threshold every one-bar wiggle is a turn and
 * the line is a comb; with one, what comes out is the shape somebody would
 * actually draw.
 */
const SWING = 0.2;

const pivotsOf = (bars: typeof DRAWN) => {
  const piv: { i: number; v: number; high: boolean }[] = [];
  let up = bars[1].c >= bars[0].c;
  let ext = { i: 0, v: up ? bars[0].h : bars[0].l, high: up };
  for (let i = 1; i < bars.length; i++) {
    const b = bars[i];
    if (up) {
      if (b.h > ext.v) ext = { i, v: b.h, high: true };
      else if (ext.v - b.l >= SWING) {
        piv.push(ext);
        up = false;
        ext = { i, v: b.l, high: false };
      }
    } else {
      if (b.l < ext.v) ext = { i, v: b.l, high: false };
      else if (b.h - ext.v >= SWING) {
        piv.push(ext);
        up = true;
        ext = { i, v: b.h, high: true };
      }
    }
  }
  /** ⚠ THE RUNNING EXTREME CLOSES THE LINE. Dropped, the zigzag would stop at
   *  the last CONFIRMED turn and leave the newest swing — the one the arrow is
   *  about — off the drawing. */
  piv.push(ext);
  /**
   * ⚠ AND IT IS FORCED TO START ON THE LEFTMOST CANDLE — Simon: "dari
   * candlestick paling kiri". At this threshold the first real pivot is a few
   * bars in, because the bars before it did not turn hard enough to count. The
   * line still has to BEGIN at bar 0, so bar 0 is added on the side opposite
   * the pivot it runs up or down to: a first leg into a high starts from a low.
   */
  if (piv[0].i !== 0) {
    piv.unshift({
      i: 0,
      v: piv[0].high ? bars[0].l : bars[0].h,
      high: !piv[0].high,
    });
  }
  return piv;
};

/**
 * ⚠ IN WINDOW PIXELS, so it can be handed to Analysis beside the hand-typed
 * lines and end on the arrow's own start point. Both windows share one grid
 * shape, so this is computed once against the left and is true of either.
 */
const ZIG = pivotsOf(DRAWN).map(
  (p) => [GRID_L.x(p.i) - LEFT.x, GRID_L.y(p.v) - LEFT.y] as [number, number],
);

/**
 * ⚠ WINDOW 1 STARTS IN THE MIDDLE OF THE FRAME — Simon: "muncul dulu window 1
 * di tengah, align center horizontal dan vertikal" — and moves to its own half
 * at 6446 to make room for window 2. Written as an OFFSET from where it ends
 * up, not as two positions: everything inside it is measured from its own
 * top-left corner, so moving the whole thing by one transform keeps the chart,
 * the lines and the swing line in the places this file already locked them.
 */
const CENTRED = {
  x: (theme.canvas.width - LEFT.w) / 2,
  y: (theme.canvas.height - LEFT.h) / 2,
};

/**
 * ═══ THE NEON EDGE ═══  Simon: "berikan glow indigo. Lalu animasi seperti lampu
 * neon yang menjalar berulang di bordernya window 1."
 *
 * ⚠ TWO THINGS, NOT ONE. A steady glow says the window is lit; a short bright
 * arc running round the border says it is live. Together they read as neon;
 * either alone reads as a shadow or as a loading spinner.
 *
 * ⚠ THE TRAVEL IS A DASH OFFSET, NOT A MOVING SHAPE. One rounded rect is
 * stroked with a dash pattern of exactly two parts — a short lit arc and a gap
 * as long as everything else — and the offset is wound round the perimeter. So
 * the light follows the border's own corners for free, which a rectangle or a
 * gradient chasing it in pixels never quite does.
 *
 * ⚠ AND THE PERIMETER IS COMPUTED, NOT MEASURED. Four straight sides less the
 * eight radii they give up to the corners, plus the one circle those corners
 * add up to. Guessed even slightly wrong, the lit arc drifts a little further
 * off每 lap until the loop visibly stutters.
 */
const NEON = { beam: 0.14, glow: 44, halo: 130, width: 5 };

/** ⚠ WINDOW 2 IS DRAWN SMALLER SO THERE IS AIR BETWEEN THEM — Simon. At 0.9 the
 *  gap comes back to about the 56px the two windows were laid out with, which
 *  a 10% grow on window 1 had eaten down to 17. */
const SECOND = { scale: 0.9 };

/**
 * ═══ WHAT EACH READER SAYS ═══  Simon: "Pasti naik" in window 1, "Ga mungkin
 * terjadi" in window 2, both in quotation marks.
 *
 * ⚠ IN QUOTES BECAUSE THEY ARE QUOTES. These are not labels on the charts —
 * they are two people talking, and the marks are what keeps them from reading
 * as the video's own opinion about which chart is right. Curly, like every
 * other quoted line in this episode.
 *
 * ⚠ `at` IS WINDOW PIXELS, the same box everything in scenes/Analysis.tsx uses:
 * from the top-left corner of the window the text is in, y down. It lands in the
 * headroom Simon left above the chart when he shrank it, so it sits over paper
 * rather than over candles.
 */
const QUOTE = {
  at: [40, 58] as const,
  /**
   * ⚠ GREEN ON ONE, GREY ON THE OTHER — Simon, and the pair is the point. One
   * reader is sure and coloured like it; the other is dismissed and drawn like
   * an aside. See theme.color.ok: this is the first place in the library green
   * carries a word, and it carries it as SPEECH — somebody's confidence in
   * quotation marks, in a scene built to show that confidence was worth
   * nothing.
   */
  one: { text: "\u201CPasti naik\u201D", ink: theme.color.ok },
  /** ⚠ ITS INK IS THE PALETTE'S `muted`, read at render — a grey typed here
   *  would be a second grey one shade off the one the rest of the video uses. */
  two: { text: "\u201CGa mungkin terjadi\u201D" },
};

const NeonEdge = ({
  rect,
  lap,
  opacity,
}: {
  rect: { x: number; y: number; w: number; h: number };
  /** 0 to 1 and wrapping — one trip round the border. */
  lap: number;
  opacity: number;
}) => {
  const c = usePalette();
  const r = theme.shape.cardRadius;
  /**
   * ⚠ THE PERIMETER IS COMPUTED, NOT MEASURED. Four straight sides less the
   * eight radii they give up to the corners, plus the one circle those corners
   * add up to. Guessed even slightly wrong, the arc drifts a little further off
   * each lap until the loop visibly stutters.
   */
  const per = 2 * (rect.w + rect.h) - 8 * r + 2 * Math.PI * r;

  /**
   * ⚠ THE LIGHT IS A HEAD AND A LENGTH, NOT A FIXED BAR THAT SLIDES — Simon:
   * "start dari titik yang tidak ada, lalu dari titik jadi memanjang, hingga end
   * jadi titik yang tidak ada lagi".
   *
   * The HEAD is where the light has got to: `lap` of the way round. The LENGTH
   * swells from nothing to full and back on a half-sine, which is the only
   * curve that is zero at both ends and has no corner at the top. The tail is
   * then wherever it has to be — `offset` is solved from the two, because a
   * dash pattern is positioned by its START and what is being aimed is its end.
   *
   * ⚠ AND NOTHING IS DRAWN WHEN THE LENGTH IS NOTHING. A round cap on a
   * zero-length dash is not nothing — it is a dot the width of the stroke,
   * which would sit lit in the corner through the whole pause between laps.
   */
  const head = lap * per;
  const len = NEON.beam * per * Math.sin(Math.PI * lap);
  if (len < 0.5) return null;

  return (
    <Layer opacity={opacity}>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={r}
        fill="none"
        stroke={c.indigo}
        strokeWidth={NEON.width}
        strokeLinecap="round"
        strokeDasharray={`${len.toFixed(1)} ${(per - len).toFixed(1)}`}
        strokeDashoffset={(len - head).toFixed(1)}
        /** ⚠ TWO SHADOWS, A TIGHT ONE AND A WIDE ONE. One alone is either a
         *  hard edge or a haze; the pair is what a tube of light looks like. */
        style={{
          filter: `drop-shadow(0 0 5px ${c.indigo}) drop-shadow(0 0 14px ${c.indigo}) drop-shadow(0 0 34px ${theme.color.indigoGlow})`,
        }}
      />
    </Layer>
  );
};

/**
 * ═══ THE QUESTION UNDER THE WINDOWS ═══  Simon, 6594 and 6787.
 *
 * ⚠ TWO LINES, THE SECOND ADDED NOT SWAPPED. The box grows downward from a
 * fixed top so the first question stays exactly where it was — the same
 * correction Simon made to the revenge note at 5876, applied here before it
 * could be got wrong twice.
 *
 * ⚠ BOTH ARE WRITTEN, ON THEIR OWN CLOCKS AND THROUGH ONE FUNCTION, so they
 * cannot end up two different kinds of text.
 */
const Prove = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const B = PROVE_BOX;
  const g = f + V.at;
  const open = dashOpenAt(PROVE.box.at - V.at, m);
  const grown = progressInOut(g, PROVE.grow.at, PROVE.grow.over);
  const write = (text: string, at: number, perChar: number) =>
    text.slice(0, Math.floor(ramp(f, at, text.length * perChar) * text.length));

  const row = {
    height: B.line,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: theme.text.family,
    fontSize: theme.text.body.size,
    fontWeight: 800,
    lineHeight: 1.25,
    color: c.ink,
    /** ⚠ NEITHER QUESTION MAY WRAP. The box is sized to the longer of them; a
     *  wrap means that measurement is stale. */
    whiteSpace: "nowrap",
  } as const;

  return (
    <DashedBox
      x={B.x}
      y={B.y}
      w={B.w}
      h={B.one + (B.two - B.one) * grown}
      at={PROVE.box.at - V.at}
    >
      {/* ⚠ PINNED TO THE TOP, NOT CENTRED IN THE BOX. Centred, the first line
          would slide down as the box grew — which is exactly the thing "anchor
          atas" rules out. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 30,
          padding: "0 28px",
        }}
      >
        <div style={row}>{write(PROVE.lines[0], open, PROVE.box.perChar)}</div>
        <div style={row}>
          {write(PROVE.lines[1], PROVE.grow.at - V.at, PROVE.grow.perChar)}
        </div>
      </div>
    </DashedBox>
  );
};

export const TwinWindows = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const g = f + V.at;

  const slid = progressInOut(g, V.split.at, V.split.over);
  const off = {
    x: (CENTRED.x - LEFT.x) * (1 - slid),
    y: (CENTRED.y - LEFT.y) * (1 - slid),
  };

  const card = progressInOut(g, V.card.at, V.card.over);
  /** ⚠ WRAPPED, NOT CLAMPED. The light repeats, so its progress is the fraction
   *  of a lap elapsed and nothing else — `% 1` is the whole animation. */
  /**
   * ⚠ ONE PASS, THEN A PAUSE — Simon. The cycle is a lap plus a hold, and the
   * lap's own progress is EASED, so the light leaves the corner slowly, runs
   * fastest down the middle of its trip and settles back into the corner. Held
   * at 1 through the pause, it parks exactly where it started: a full lap and a
   * standing start are the same place on a closed path, so nothing has to be
   * reset between passes.
   */
  const cycle = V.neon.lap + V.neon.hold;
  const phase = (((g - V.neon.at) % cycle) + cycle) % cycle;
  const neon = progressInOut(phase, 0, V.neon.lap);
  /** ⚠ AND IT FADES UP RATHER THAN SNAPPING ON. The beam is already moving when
   *  it becomes visible, so the light arrives mid-travel — which is what a tube
   *  warming up looks like, and what switching a shape on does not. */
  const lit = progressInOut(g, V.neon.at, V.neon.over);
  /** ⚠ SCALED ABOUT ITS OWN CENTRE, so growing does not also move it. */
  const scale = 1 + (V.grow.by - 1) * progressInOut(g, V.grow.at, V.grow.over);
  /** ⚠ BOTH WINDOWS SHRINK AS ONE — Simon: "group kedua windows ini, lalu
   *  kecilkan ke tengah sebanyak 30%". About the frame's own centre, which is
   *  what "ke tengah" asks for: the pair ends up centred as well as smaller,
   *  and neither window has to be moved separately to get there. */
  const pack =
    1 -
    (1 - PROVE.shrink.by) *
      progressInOut(g, PROVE.shrink.at, PROVE.shrink.over);
  /**
   * ⚠ THE STAGGER COUNTS THE LINES THAT ARE DRAWN, not the entries in the
   * array. Two of the four are hidden; indexed by position, the first visible
   * line would wait two steps for its turn behind lines nobody can see.
   */
  const linesShow = (() => {
    const out = LEFT_LINES.map(() => 0);
    let k = 0;
    LEFT_LINES.forEach((l, i) => {
      if (l.hidden) return;
      out[i] = progressInOut(g, V.lines.at + k * V.lines.step, V.lines.over);
      k += 1;
    });
    return out;
  })();
  const one = {
    lines: linesShow,
    /** ⚠ ONE PROGRESS FOR THE SWING LINE AND ITS ARROW — see `stroke` in
     *  data/timing.ts. Two of them eased separately and the pen stopped at the
     *  join. */
    stroke: progressInOut(g, V.stroke.at, V.stroke.over),
  };

  /** ⚠ WINDOW 2 ARRIVES FINISHED. Simon has given the order for window 1 and
   *  not yet for this one; drawing it step by step would be inventing a beat he
   *  has not asked for. */
  const two = progressInOut(g, V.second.at, V.second.over);
  const whole = { lines: LEFT_LINES.map(() => 1), stroke: 1 };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${pack.toFixed(4)})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
        }}
      >
        {(
          [
            [LEFT, GRID_L, LEFT_LINES, LEFT_ARROW, card, one, off],
            [
              RIGHT,
              GRID_R,
              RIGHT_LINES,
              RIGHT_ARROW,
              two,
              whole,
              { x: 0, y: 0 },
            ],
          ] as const
        ).map(([rect, grid, lines, arrow, alpha, show, shift], i) =>
          alpha <= 0.001 ? null : (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                transform:
                  i === 0
                    ? `translate(${shift.x.toFixed(1)}px, ${shift.y.toFixed(1)}px) scale(${scale.toFixed(4)})`
                    : `scale(${SECOND.scale})`,
                transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px`,
                /**
                 * ⚠ WINDOW 2 IS DRAINED AND SET BACK — Simon: "monochrome terang
                 * dan transparansi 75% sejak awal". One filter over the whole
                 * group rather than a pale palette inside it: the candles keep
                 * their own reds and greens in the data and lose them on the way
                 * to the screen, so nothing about what is drawn has to know it is
                 * the window nobody is reading.
                 *
                 * ⚠ AND IT FADES HERE, AS ONE GROUP — Simon: "fade in aja langsung
                 * 1 group". It used to fade the card and its contents separately,
                 * and two translucent things stacked are not the same as one
                 * translucent picture: at half way you could see the ground
                 * THROUGH the card, behind its own candles. Composited first and
                 * faded after, the window arrives as an object.
                 */
                filter: i === 1 ? "grayscale(1) brightness(1.12)" : undefined,
                /**
                 * ⚠ BOTH WINDOWS FADE AS A GROUP. Window 2 was fixed first; window
                 * 1 has the same exposure now that its chart arrives WITH its
                 * card rather than after it — two translucent things stacked let
                 * the ground show through the card behind its own candles.
                 * Composited here and faded once, each window arrives as an
                 * object.
                 */
                opacity: i === 1 ? 0.75 * alpha : alpha,
              }}
            >
              {/* ⚠ THE GLOW SITS UNDER THE CARD, so the light spreads outward
                from behind it rather than washing over the chart. */}
              {i === 0 && lit > 0.001 ? (
                <div
                  style={{
                    position: "absolute",
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    borderRadius: theme.shape.cardRadius,
                    /** ⚠ TWO SHADOWS AGAIN, AND FOR THE SAME REASON AS THE
                     *  BEAM'S: a tight bright one for the edge and a wide faint
                     *  one for the room around it. A single shadow is either a
                     *  hard rim or a fog. */
                    boxShadow: `0 0 ${NEON.glow}px ${theme.color.indigoGlow}, 0 0 ${NEON.halo}px ${theme.color.indigoWashStrong}`,
                    opacity: lit,
                  }}
                />
              ) : null}
              <Card rect={rect} opacity={1}>
                {/* ⚠ THE QUOTE ARRIVES WITH THE CONCLUSION IT IS ABOUT — for
                  window 1 that is the arrow, which is the last thing drawn;
                  for window 2 it is the window itself, which arrives finished.
                  Simon gave no frame for either, and a quote that turns up
                  before the drawing it comments on would be a verdict with
                  nothing under it. */}
                <div
                  style={{
                    position: "absolute",
                    left: rect.x + QUOTE.at[0],
                    top: rect.y + QUOTE.at[1],
                    transform: "translateY(-50%)",
                    fontFamily: theme.text.family,
                    fontSize: theme.text.body.size,
                    fontWeight: 700,
                    color: i === 0 ? QUOTE.one.ink : c.muted,
                    whiteSpace: "nowrap",
                    opacity: i === 1 ? 1 : show.stroke,
                  }}
                >
                  {i === 0 ? QUOTE.one.text : QUOTE.two.text}
                </div>
                {/* ⚠ THE TAPE ARRIVES WITH THE CARD — Simon cancelled its sweep.
                  No `wipe` at all rather than a wipe held at 1: a reveal that
                  is always finished is a thing to explain later. */}
                <Candles bars={DRAWN} grid={grid} />
                {/* ⚠ CLIPPED TO THE WINDOW, not to the plot. Three of the four
                  lines start back in the hidden bars, so they have to be
                  allowed to run off the left edge and be cut by the card —
                  which is what a trendline drawn on a longer chart looks like
                  from here. */}
                <Analysis
                  rect={rect}
                  lines={lines}
                  arrow={arrow}
                  zig={ZIG}
                  show={show}
                  opacity={1}
                />
                {/* ⚠ LAST, so the light runs ON the card's edge rather than under
                  the chart drawn inside it. */}
                {i === 0 && lit > 0.001 ? (
                  <NeonEdge rect={rect} lap={neon} opacity={lit} />
                ) : null}
              </Card>
            </div>
          ),
        )}
      </div>
      <Prove />
    </div>
  );
};

/**
 * ═══ THE LOCK ═══  Simon: "Ok lock ya, aku mau ingat bentuk setiap window
 * beserta isinya."
 *
 * ⚠ EVERY NUMBER THAT MAKES THESE WINDOWS WHAT THEY ARE, written down once and
 * checked at build time. Not a comment — comments do not fail. Each of these
 * was arrived at over several rounds of his corrections, and any one of them
 * could be undone by an edit somewhere else in the file that looks harmless.
 *
 * To change something here on purpose, change the number in BOTH places: the
 * setting above and the lock below. That second edit is the point — it is what
 * stops a change happening by accident.
 */
const LOCK = {
  /** The white card. */
  window: { w: 836, h: 536, bottom: 801 },
  /** The chart inside it: flush left, 84% of the width, 392 tall, 22 up. */
  plot: { w: 702.24, h: 392, padBottom: 22 },
  /** The tape: 111 traced, 45 hidden at the left, 8 trimmed at the right. */
  bars: { traced: 111, hidden: 45, trimmed: 8, drawn: 58 },
  /** Four analysis lines, two of them hidden; one swing line of seven points. */
  drawing: { lines: 4, linesShown: 2, pivots: 7 },
};

{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/TwinWindows: the lock is broken — ${m}`);
  };
  const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
  const P = plotOf(LEFT);
  if (LEFT.w !== LOCK.window.w || LEFT.h !== LOCK.window.h) {
    fail(
      `the window is ${LEFT.w}x${LEFT.h}, locked at ${LOCK.window.w}x${LOCK.window.h}`,
    );
  }
  if (LEFT.y + LEFT.h !== LOCK.window.bottom) {
    fail(
      `the window's foot is at ${LEFT.y + LEFT.h}, locked at ${LOCK.window.bottom}`,
    );
  }
  if (!near(P.w, LOCK.plot.w) || P.h !== LOCK.plot.h) {
    fail(
      `the plot is ${P.w.toFixed(2)}x${P.h}, locked at ${LOCK.plot.w}x${LOCK.plot.h}`,
    );
  }
  if (P.x !== LEFT.x)
    fail("the plot is no longer flush with the window's left edge");
  if (LEFT.y + LEFT.h - (P.y + P.h) !== LOCK.plot.padBottom) {
    fail(
      `the chart's foot is not ${LOCK.plot.padBottom}px up from the window's floor`,
    );
  }
  if (SS03.length !== LOCK.bars.traced)
    fail(`${SS03.length} bars traced, locked at ${LOCK.bars.traced}`);
  if (HIDDEN !== LOCK.bars.hidden)
    fail(`${HIDDEN} bars hidden, locked at ${LOCK.bars.hidden}`);
  if (TRIM_RIGHT !== LOCK.bars.trimmed)
    fail(`${TRIM_RIGHT} bars trimmed, locked at ${LOCK.bars.trimmed}`);
  if (DRAWN.length !== LOCK.bars.drawn)
    fail(`${DRAWN.length} bars drawn, locked at ${LOCK.bars.drawn}`);
  if (LEFT_LINES.length !== LOCK.drawing.lines) {
    fail(
      `${LEFT_LINES.length} analysis lines, locked at ${LOCK.drawing.lines}`,
    );
  }
  const shown = LEFT_LINES.filter((l) => !l.hidden).length;
  if (shown !== LOCK.drawing.linesShown) {
    fail(`${shown} lines drawn, locked at ${LOCK.drawing.linesShown}`);
  }
  if (ZIG.length !== LOCK.drawing.pivots) {
    fail(
      `the swing line has ${ZIG.length} points, locked at ${LOCK.drawing.pivots}`,
    );
  }
  /** ⚠ AND WINDOW 1 REALLY IS CENTRED WHILE IT IS ALONE. Simon asked for it in
   *  both directions; a canvas that changed size would silently break only the
   *  centring and nothing else here would notice. */
  if (
    !near(CENTRED.x * 2 + LEFT.w, theme.canvas.width) ||
    !near(CENTRED.y * 2 + LEFT.h, theme.canvas.height)
  ) {
    fail("window 1's opening position is not the centre of the frame");
  }
}

/** Kept honest. */
{
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/TwinWindows: ${m}`);
  };
  /** The two windows have to be the same size, or "the same chart" is drawn at
   *  two different scales and the claim quietly stops being true. */
  if (LEFT.w !== RIGHT.w || LEFT.h !== RIGHT.h) {
    fail(`the windows are ${LEFT.w}x${LEFT.h} and ${RIGHT.w}x${RIGHT.h}`);
  }
  /** The tape has to stay inside them. */
  const top = GRID_L.y(DOMAIN[1]);
  const bot = GRID_L.y(DOMAIN[0]);
  if (top < LEFT.y || bot > LEFT.y + LEFT.h) {
    fail(
      `the tape runs ${top.toFixed(0)}..${bot.toFixed(0)}, outside a window at ${LEFT.y}..${LEFT.y + LEFT.h}`,
    );
  }
  /** ⚠ AND THE WHITE SPACE ON THE RIGHT HAS TO ACTUALLY BE THERE. It is the
   *  thing Simon asked for first, and it is the one part of this that a later
   *  change to PLOT_W could take away without anything looking broken. */
  const lastBar = GRID_L.x(DRAWN.length - 1) + candleWidth(GRID_L) / 2;
  const free = LEFT.x + LEFT.w - lastBar;
  /**
   * ⚠ THE FLOOR IS MINE, NOT SIMON'S, and it is a floor rather than a spec. He
   * asked for white space at the right and did not say how much; this exists so
   * that a later tweak to PLOT_W cannot take it away without the build noticing.
   * It started at a fifth and came down to a seventh when he asked for the
   * chart to be stretched wider — which is the trade, stated once here instead
   * of being argued each time the width moves.
   */
  if (free < LEFT.w * 0.15) {
    fail(
      `only ${free.toFixed(0)}px of the window is free to the right of the tape`,
    );
  }
  /** And nothing may reach the card's own right edge. */
  if (lastBar > LEFT.x + LEFT.w)
    fail("the tape runs past the window's right edge");
  /**
   * ⚠ THE HEIGHT IS LOCKED, SO IT IS WRITTEN DOWN — Simon: "lock size height
   * chart (2 2nya)". Both windows and both plots, stated as the numbers that
   * were on screen when he locked them. A lock nobody can read is a convention;
   * this one fails the build.
   */
  const LOCKED = { window: 536, plot: PLOT_H };
  if (LEFT.h !== LOCKED.window) {
    fail(
      `the window is ${LEFT.h}px tall, and its height is locked at ${LOCKED.window}`,
    );
  }
  if (plotOf(LEFT).h !== LOCKED.plot) {
    fail(
      `the plot is ${plotOf(LEFT).h}px tall, and its height is locked at ${LOCKED.plot}`,
    );
  }
  /** ⚠ AND THE FEET HAVE NOT MOVED — either of them. The window's bottom is
   *  where the first shrink left it, and the chart's bottom is a fixed inset up
   *  from that. A shrink that came off the wrong end would pass every other
   *  check in this file. */
  if (LEFT.y + LEFT.h !== BOTTOM) {
    fail(
      `the windows end at ${LEFT.y + LEFT.h}, not on the anchored bottom at ${BOTTOM}`,
    );
  }
  const foot = plotOf(LEFT).y + plotOf(LEFT).h;
  if (foot !== BOTTOM - PAD_BOTTOM) {
    fail(
      `the chart's foot is at ${foot}, not ${PAD_BOTTOM}px up from the window's floor`,
    );
  }
  /** ⚠ AND THE HIDDEN BARS ARE STILL REACHABLE. They are the reference for a
   *  resistance level Simon has not drawn yet; sliced out of the series rather
   *  than out of this window, they would be gone. */
  if (SS03.length !== SHOWN.length + HIDDEN) {
    fail(
      "the hidden bars have left the series, so nothing can be measured off them",
    );
  }
  /** ⚠ AND THE CANDLES THAT STAY HAVE NOT MOVED. The grid must still be solved
   *  over the full window, or trimming the right-hand bars re-spreads the rest
   *  — which is exactly what Simon locked against. */
  if (GRID_L.slot !== gridFor(LEFT).slot) {
    fail(
      "the grid no longer covers the untrimmed window, so the candles have shifted",
    );
  }
}
