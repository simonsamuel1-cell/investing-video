/**
 * scenes/AdmrChart.tsx — Simon's `ADMR_03.png`, redrawn, and staged.
 *
 * ═══ THE BRIEF ═══ (2026-09-17)
 *   "trace ulang ADMR_03.png dan hanya trace image itu … Duplikat aja semuanya,
 *    yang paling penting adalah ukuran candlesticks, chart, volume bar, dan
 *    macd bar nya … Yang penting gambarnya dulu."
 * and, excluded by name: the O/H/L/C legend, "Volume 11.39 M",
 * "MA (100, close, 0) 1,592", "MACD (12, 26, close, 9, EMA, EMA) −22 −12 9",
 * and the TradingView wordmark.
 *
 * ═══ WHY THERE IS NO CHART CODE IN HERE ═══
 * The version this replaces went through the house chart library: a domain, a
 * grid, `candleWidth`, three panes laid out as fractions of the card. Every one
 * of those is a decision, and six decisions between a photograph and a drawing
 * is how the drawing stops looking like the photograph — the bodies came out as
 * hairlines, the volume as one flat block, the MACD as blue dashes.
 *
 * So there is no grid here. `data/admr-chart.json` holds the export's own
 * 2720×1370 rectangle and every bar, line, label and tag inside it in the
 * export's own pixels; the <svg> below takes that rectangle as its viewBox and
 * ADMR_SHOT decides how big it is on the canvas. ONE uniform scale. The candle
 * bodies are 14px because they are 14px; the volume bars are 17px and the
 * histogram bars are 17px because that is what the screenshot measures.
 *
 * ⚠ DO NOT "TIDY" ANY NUMBER IN THE JSON. It is written by
 * scripts/trace-admr2.mjs and proved by scripts/redraw-admr.mjs, which paints
 * the JSON back at 2758×1458 and diffs it against the export: 0.211% of the
 * plot differs, and every one of those pixels is anti-aliasing along the three
 * plotted lines. Re-run both after any change.
 *
 * ⚠ RED AND GREEN OUTSIDE THE CANDLE BODIES, DELIBERATELY. The standing rule
 * is that only candle bodies carry them; this scene is a REPRODUCTION of a
 * third-party chart, the same exemption `core/TuntunMark` has for a supplied
 * logo, and every colour in it is sampled from the file rather than chosen.
 * That is also why they live in the JSON and not in a palette slot: they are
 * measurements, and a theme swap must not follow them.
 *
 * ═══ AND IT IS STAGED, NOT SWITCHED ON ═══ (2026-09-17, second pass)
 * The window arrives empty — frame, gridlines, price ladder, dates — and the
 * tape draws itself in from the left. This component owns NO CLOCK: AdmrGroup
 * reads `ADMR_TAPE` and hands down how far the tape has come, whether the rule
 * is up, how far the zoom has travelled and what the projection is doing.
 * Everything in here is geometry.
 *
 * ⚠ THE GRID IS GONE, AT SIMON'S DIRECTION. "Kurasa garis vertikal dan
 * horizontalnya remove aja, karna terlalu mengganggu." Both ladders are still
 * in the trace — they are what the price labels and the dates are positioned
 * against, and they are what the zoom's framing is solved from — they are
 * simply not drawn. The pane separator stays: it is structure, not grid, and
 * without it the MACD pane floats.
 *
 * ⚠ THE PREVIEW MOVES CLOSER, AND NOTHING IS RESHAPED. Simon's call, asked and
 * answered: "aku maunya ukurannya respectively masih sama, hanya saja previewnya
 * mendekat ke candle ke 123 tersebut." `VIEW` below is ONE factor on BOTH axes
 * about candle 123 — so every ratio in the picture is locked and not a single
 * width, height, gap or stroke in this file is a function of it.
 *
 * ⚠ AND YES, THAT IS A `scale()` ON A CHART. The house rule against it exists
 * because stretching a chart pulls type, hairlines and candle widths apart from
 * each other; the first attempt here obeyed the letter of that rule — a new
 * mapping on time alone — and produced exactly the distortion it forbids, every
 * candle 2.27× wider than it was tall. A camera moving toward a PHOTOGRAPH is
 * the one case where the uniform factor is the honest answer, and this window
 * is a photograph.
 *
 * ⚠ IT IS THE CONTENT THAT MOVES, NOT THE WINDOW. The frame, its border and its
 * rounded corners are the viewport and stay exactly where they are; everything
 * inside is magnified and cropped by them. At k=2 the volume band, the MACD pane
 * and the lower half of the price ladder are outside the frame — accepted, and
 * see the note on `zoom` in data/timing.ts.
 */
import { theme, usePalette } from "../../../core";
import { ADMR_INK, ADMR_SHOT } from "../data/layout";
import { ADMR_TAPE } from "../data/timing";
import SHOT from "../data/admr-chart.json";

const F = SHOT.frame;
const P = SHOT.plot;
const C = SHOT.colors;
const PANES = SHOT.panes;
const PLOT_W = P.x1 - P.x0 + 1;
/** The four histogram tones, reached by the name the trace recorded. */
const TONE = C.hist as Record<string, string>;
const VOL = C.vol as { up: string; down: string; alpha: number };
const BARS = SHOT.bars;

/**
 * ⚠ THE LATTICE, SOLVED OFF THE TWO END BARS — not a typed pitch. The traced
 * bars carry their own measured edges, but the PROJECTION has to be placed
 * beyond the last one and the zoom has to frame bars that are not in the file,
 * so both need the spacing as a number. 137 bars from x22 to x2603 is 18.9779.
 */
const PITCH = (BARS[BARS.length - 1].x - BARS[0].x) / (BARS.length - 1);
const centreAt = (i: number) => BARS[0].x + i * PITCH;
/** The tape's own last bar — candle 123. The projection hangs off it and the
 *  preview closes on it, and it is read from the tape rather than from any
 *  annotation that happens to point at it. */
const LAST = ADMR_TAPE.runs[1].bars - 1;

/**
 * The projection's body: the MEDIAN real body on this tape, times `ghost.tall`.
 * The median is what keeps it honest — the size is still measured off the tape
 * rather than typed — and the multiplier is the one thing anybody chooses about
 * it, which is how big the imagined rally is. "Buat lebih tinggi sangat tinggi."
 */
const BODY_STEP = (() => {
  const h = BARS.map((b) => b.bb - b.bt + 1).sort((a, b) => a - b);
  return h[(h.length / 2) | 0] * ADMR_TAPE.ghost.tall;
})();

/**
 * ⚠ THE THREE PLOTTED LINES DRAW THEMSELVES; THE WIPE DOES NOT CUT THEM.
 * Simon: "garis MA di chart candlestick dan 2 garis di macd munculnya boleh
 * langsung memanjang aja ga usa patah patah, animasi trim path, easy ease, tapi
 * ada checkpointnya juga ya, yaitu candle ke 56 dan 123." A clip uncovers a
 * steep segment all at once — that is the "patah patah". A trim walks along the
 * stroke instead.
 *
 * `trimOf` turns an x into the fraction of that path's own LENGTH reached
 * there, which is the unit stroke-dashoffset works in. The two checkpoints need
 * no arithmetic of their own: the lines and the tape are driven by the same
 * `shown`, so bar 56 and bar 123 are where they are because that is where the
 * tape is.
 *
 * ⚠ MEASURED ON THE UNZOOMED PATH, and that is not an approximation: the zoom
 * does not begin until f10950 and every line is finished at f10646.
 */
const trimOf = (pts: readonly (readonly number[])[]) => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  return (x: number) => {
    if (x <= pts[0][0]) return 0;
    if (x >= pts[pts.length - 1][0]) return 1;
    let i = 1;
    while (pts[i][0] < x) i++;
    const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
    return (cum[i - 1] + t * (cum[i] - cum[i - 1])) / total;
  };
};
const TRIM = {
  /** The red one — MA100, as Simon confirmed. */
  ma: trimOf(SHOT.ma.pts),
  macd: trimOf(SHOT.macdLine.pts),
  signal: trimOf(SHOT.signal.pts),
};

/**
 * ═══ THE TRIANGLE ═══
 * Two lines, from the tape's own wicks: the HIGH line joins the tops of bars 56
 * and 117 (candles 57 and 118) and is then carried on to bar 122; the LOW line
 * joins the bottoms of bars 65 and 122 (candles 66 and 123).
 *
 * ⚠ THE RUN-ON IS AN EXTENSION, NOT A SECOND SEGMENT — "dipanjangin (extend,
 * bukan dihubungkan lagi)". Its far end is where the FIRST TWO highs' slope
 * reaches bar 122, which is nowhere near that bar's own high (1,964 against
 * 1,830). Joining it to the high instead would turn a claim about two highs
 * into a line through three.
 */
const TRI = (() => {
  const T = ADMR_TAPE.tri;
  const hi = (i: number) => ({ x: centreAt(i), y: BARS[i].wt });
  const a = hi(T.high.from);
  const b = hi(T.high.to);
  const runX = centreAt(T.high.run.to);
  /** ⚠ THE LOW LINE IS FLAT AND ITS HEIGHT IS A WICK TOP. Both ends take the
   *  START bar's `wt` — see `tri.low` in data/timing.ts. */
  const level = BARS[T.low.from].wt;
  return {
    a,
    b,
    ext: { x: runX, y: a.y + ((b.y - a.y) * (runX - a.x)) / (b.x - a.x) },
    c: { x: centreAt(T.low.from), y: level },
    d: { x: centreAt(T.low.to), y: level },
  };
})();

/**
 * The point the preview closes on: candle 123, at its CLOSE — the bar the
 * sentence is about and the height the projection sets off from, so the move
 * ends with both of them in the middle of the window.
 */
const FOCUS = {
  x: centreAt(ADMR_TAPE.zoom.focus),
  y: (() => {
    const b = BARS[ADMR_TAPE.zoom.focus];
    return b.up ? b.bt : b.bb;
  })(),
};

/** ⚠ ONE `id` PER CLIP, SCOPED TO THIS SCENE. Two <clipPath id="plot"> in one
 *  document and the second one silently wins for both. */
const CLIP = {
  tape: "admr-tape",
  price: "admr-price-gutter",
  window: "admr-window",
  front: "admr-front",
  glow: "admr-glow",
};

/**
 * ⚠ THE CORNER IS IN CANVAS PIXELS, DIVIDED BACK OUT. Everything inside this
 * <svg> is in the export's own pixels and the whole thing is scaled by 0.5956
 * on the way to the canvas — so a radius of 24 typed here would land as 14 on
 * screen and the window would not match any other card in the episode. Dividing
 * by the scale makes it the theme's own 24 where the viewer sees it, and keeps
 * it correct if the window is ever resized.
 */
const R = theme.shape.cardRadius / ADMR_SHOT.scale;

const AXIS = {
  fontFamily: theme.text.family,
  fontSize: SHOT.axis.size,
  fontWeight: 500,
} as const;

export const AdmrChart = ({
  shown,
  tri,
  zoom,
  ghosts,
  ghostInk,
  ask,
  arc,
  glow,
  after,
}: {
  /**
   * How far the tape has been uncovered, in bars — FRACTIONAL, and that is the
   * whole of the wipe. "Semua candlestick, volume, dan macd muncul satu satunya
   * pake animasi wipe": every bar up to the front is drawn and the group is cut
   * at the front, so a bar is revealed across its own width rather than
   * switched on whole.
   */
  shown: number;
  /** The triangle: two lines drawn by trim path, and the high line's run-on. */
  tri: { high: number; run: number; low: number };
  /** 0 = the whole tape in frame, 1 = framed on `ADMR_TAPE.zoom`. */
  zoom: number;
  /** How many projected bars are drawn past the front. */
  ghosts: number;
  /** Their opacity — the blink, and then the fade out. */
  ghostInk: number;
  /** The question beside the tape. */
  ask: number;
  /** Simon's arrow. */
  arc: number;
  /** The highlight on candle 123: how bright its glow is, and how much bigger
   *  the bar itself has grown. */
  glow: { ink: number; scale: number };
  /** The bars placed after the break, each 0→1 as it wipes up from its low. */
  after: number[];
}) => {
  const c = usePalette();
  const ground = {
    /** White, not the page — the chart is a window on the page, not the page. */
    bg: c.cardBg,
    grid: c.border,
    edge: c.border,
    sep: c.border,
    axis: c.slate,
  };

  /**
   * One factor, both axes, about FOCUS. Written as a transform rather than
   * folded into the coordinates on purpose: there is then no place in this file
   * where a size COULD accidentally depend on it.
   */
  const k = 1 + (ADMR_TAPE.zoom.k - 1) * zoom;
  /** Where the focus itself ends up: where it already is at rest, `place` when
   *  the move is finished. Blended, so the transform is identity at zoom 0. */
  const land = {
    x: FOCUS.x + (F.x + F.w * ADMR_TAPE.zoom.place.x - FOCUS.x) * zoom,
    y: FOCUS.y + (F.y + F.h * ADMR_TAPE.zoom.place.y - FOCUS.y) * zoom,
  };
  const VIEW = `translate(${land.x - FOCUS.x * k} ${land.y - FOCUS.y * k}) scale(${k})`;
  /** The same affine, per axis, for the things that are NOT inside it. */
  const atX = (x: number) => land.x + (x - FOCUS.x) * k;
  const atY = (y: number) => land.y + (y - FOCUS.y) * k;

  /**
   * ⚠ THE FRONT IS A POSITION, NOT A COUNT. Flooring it drew whole bars one at
   * a time, which is a pop; the wipe needs the edge to land inside a bar, so
   * every bar the edge has reached is drawn and the whole group is cut there.
   */
  const bars = Math.max(0, Math.min(BARS.length, Math.ceil(shown)));
  /** The front edge, in the export's own pixels — the trims read it directly. */
  const tip = BARS[0].x - PITCH / 2 + Math.max(0, shown) * PITCH;
  /** The projection hangs off the LAST bar of the tape, not off the front. */
  const anchor = BARS[LAST];

  return (
    <svg
      viewBox={`${F.x} ${F.y} ${F.w} ${F.h}`}
      width={ADMR_SHOT.w}
      height={ADMR_SHOT.h}
      style={{ position: "absolute", left: ADMR_SHOT.x, top: ADMR_SHOT.y }}
    >
      <defs>
        {/* The tape stops at the plot's right edge: the first bar and the last
            one are both cut off there in the export, and they must be here. */}
        <clipPath id={CLIP.tape}>
          <rect x={P.x0} y={F.y} width={PLOT_W} height={F.h} />
        </clipPath>
        {/* The wipe. Everything the tape draws lives inside this, so the front
            edge cuts bars, bars, volume, histogram and lines all at once. */}
        <clipPath id={CLIP.front}>
          <rect
            x={P.x0}
            y={F.y}
            width={Math.max(0, Math.min(tip, P.x1 + 1) - P.x0)}
            height={F.h}
          />
        </clipPath>
        {/* The "800" label is cut in half by the floor of the price pane in the
            export, because that is where the pane ends. */}
        {/* ⚠ IT FOLLOWS THE MOVE even though the labels it cuts do not: the
            floor that cuts "800" in half is the price pane's, and the pane is
            inside the move. */}
        <clipPath id={CLIP.price}>
          <rect
            x={F.x}
            y={atY(PANES.price.y0)}
            width={F.w}
            height={(PANES.price.y1 - PANES.price.y0 + 1) * k}
          />
        </clipPath>
        {/* Insurance, not correction: nothing currently reaches a corner, but a
            gridline runs to the very top of the window and the date strip to
            the very bottom, so the day one of them moves it is already held. */}
        <clipPath id={CLIP.window}>
          <rect x={F.x + 2} y={F.y + 2} width={F.w - 4} height={F.h - 4} rx={R - 2} />
        </clipPath>
        {/* ⚠ THE GLOW IS A BLUR, NOT A SECOND SHAPE. A ring drawn round the bar
            would be one more line on a chart that has enough of them; a blurred
            copy of the bar itself reads as the bar lighting up. In the export's
            own pixels, so it survives the preview closing in. */}
        <filter id={CLIP.glow} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation={ADMR_INK.round.bar * 2.6} />
        </filter>
      </defs>

      {/* ── the window ─────────────────────────────────────────────────── */}
      {/* ⚠ ONE RULE, NOT TWO. The export draws a #313131 ring with a #292929
          ring inside it — two steps of dark that exist to separate the chart
          from the app around it. On white there is nothing to separate it from
          but the page, so the two rings become the one border the page uses. */}
      <rect x={F.x} y={F.y} width={F.w} height={F.h} rx={R} fill={ground.edge} />
      <rect x={F.x + 2} y={F.y + 2} width={F.w - 4} height={F.h - 4} rx={R - 2} fill={ground.bg} />

      <g clipPath={`url(#${CLIP.window})`}>
        <g transform={VIEW}>
        {/* ⚠ NO GRIDLINES. Removed on instruction — "terlalu mengganggu". The
            two ladders are still in the trace and are still what the labels and
            the zoom are solved against; they are simply not drawn. */}
        <rect
          x={F.x + 2}
          y={PANES.sep.y0}
          width={F.w - 4}
          height={PANES.sep.y1 - PANES.sep.y0 + 1}
          fill={ground.sep}
        />

        <g clipPath={`url(#${CLIP.tape})`}>
          {/* ⚠ VOLUME IS HALF-TRANSPARENT AND THE GRIDLINES SHOW THROUGH IT.
              Measured, not styled: #22AB94 at 50% over the #141414 ground is
              exactly the (27,96,84) in the file, and over a #212121 gridline it
              is exactly the (33,102,90) two rows lower. */}
          <g clipPath={`url(#${CLIP.front})`}>
          {SHOT.vol.slice(0, bars).map((v) => (
            <rect
              key={`vol${v.i}`}
              x={v.l}
              y={v.t}
              width={v.w}
              height={v.b - v.t + 1}
              rx={ADMR_INK.round.bar}
              fill={v.up ? VOL.up : VOL.down}
              fillOpacity={VOL.alpha}
            />
          ))}
          </g>

          {/* ⚠ THE MA100 GOES UNDER THE CANDLES, which is the order the export
              drew it in and the reason the trace had to interpolate the six
              stretches where a candle buries it. Against the volume it is
              unordered: checked pixel by pixel, the line does not pass through
              a single volume bar anywhere in this export. */}
          <polyline
            points={SHOT.ma.pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={C.ma}
            strokeWidth={SHOT.ma.width}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - TRIM.ma(tip)}
          />

          <g clipPath={`url(#${CLIP.front})`}>
          {BARS.slice(0, bars).map((b) => {
            const ink = b.up ? C.up : C.down;
            const cx = b.bl + b.bw / 2;
            return (
              <g key={`bar${b.i}`}>
                <rect
                  x={cx - 1}
                  y={b.wt}
                  width={2}
                  height={b.wb - b.wt + 1}
                  rx={ADMR_INK.round.wick}
                  fill={ink}
                />
                <rect
                  x={cx - b.bw / 2}
                  y={b.bt}
                  width={b.bw}
                  height={b.bb - b.bt + 1}
                  rx={ADMR_INK.round.bar}
                  fill={ink}
                />
              </g>
            );
          })}
          </g>

          {/* ⚠ HOLLOW AND WITHOUT A WICK — because they are not data and must
              not be readable as data. They were dashed as well until Simon
              asked what they looked like solid; what still separates them from
              the tape is that every real bar is FILLED and these are not, that
              they blink, and that they carry no number and name no level. They
              climb from the close of the newest real bar. See `ghost` in
              data/timing.ts and `ghost` in data/layout.ts. */}
          {anchor &&
            ghosts > 0 &&
            Array.from({ length: ghosts }, (_, i) => {
              const bottom =
                (anchor.up ? anchor.bt : anchor.bb) - i * BODY_STEP * ADMR_INK.ghost.rise;
              const bw = SHOT.counts.bodyW;
              return (
                <rect
                  key={`ghost${i}`}
                  x={centreAt(LAST + 1 + i) - bw / 2}
                  y={bottom - BODY_STEP}
                  width={bw}
                  height={BODY_STEP}
                  rx={ADMR_INK.round.bar}
                  fill="none"
                  stroke={C.up}
                  strokeWidth={ADMR_INK.ghost.width}
                  opacity={ghostInk}
                />
              );
            })}

          {/* ── the days after the break ───────────────────────────────
              Each one wipes up out of its own low — the one direction that does
              not read as the tape scrolling — and is drawn OUTSIDE the front,
              because the front is standing still on candle 123 until the
              closing wipe comes for the rest. */}
          {after.map((t, j) => {
            if (t <= 0) return null;
            const b = BARS[LAST + 1 + j];
            if (!b) return null;
            const ink = b.up ? C.up : C.down;
            const cx = b.bl + b.bw / 2;
            const h = b.wb - b.wt + 1;
            const id = `admr-after-${j}`;
            return (
              <g key={id}>
                <defs>
                  <clipPath id={id}>
                    <rect x={b.bl - b.bw} y={b.wb + 1 - h * t} width={b.bw * 3} height={h * t} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${id})`}>
                  <rect
                    x={cx - 1}
                    y={b.wt}
                    width={2}
                    height={h}
                    rx={ADMR_INK.round.wick}
                    fill={ink}
                  />
                  <rect
                    x={b.bl}
                    y={b.bt}
                    width={b.bw}
                    height={b.bb - b.bt + 1}
                    rx={ADMR_INK.round.bar}
                    fill={ink}
                  />
                </g>
              </g>
            );
          })}

          {/* ── the highlight on candle 123 ─────────────────────────────
              A glow behind the bar, blinking twice, and the bar itself swelling
              by a fifth and settling again. Both are finished on the frame the
              next bar arrives — see `glow` in data/timing.ts. */}
          {(glow.ink > 0 || glow.scale > 1) &&
            (() => {
              const b = BARS[LAST];
              const cx = b.bl + b.bw / 2;
              const cy = (b.wt + b.wb + 1) / 2;
              const ink = b.up ? C.up : C.down;
              const swell = `translate(${cx * (1 - glow.scale)} ${cy * (1 - glow.scale)}) scale(${glow.scale})`;
              return (
                <g transform={swell}>
                  <g opacity={glow.ink} filter={`url(#${CLIP.glow})`}>
                    <rect
                      x={b.bl}
                      y={b.wt}
                      width={b.bw}
                      height={b.wb - b.wt + 1}
                      rx={ADMR_INK.round.bar}
                      fill={c.indigo}
                    />
                  </g>
                  <rect
                    x={cx - 1}
                    y={b.wt}
                    width={2}
                    height={b.wb - b.wt + 1}
                    rx={ADMR_INK.round.wick}
                    fill={ink}
                  />
                  <rect
                    x={b.bl}
                    y={b.bt}
                    width={b.bw}
                    height={b.bb - b.bt + 1}
                    rx={ADMR_INK.round.bar}
                    fill={ink}
                  />
                </g>
              );
            })()}

          <g clipPath={`url(#${CLIP.front})`}>
          {/* Simon's own cursor left this on the export, at 1,525. */}
          {SHOT.crosshair && bars > 0 && (
            <line
              x1={P.x0}
              x2={P.x1 + 1}
              y1={(SHOT.crosshair.y0 + SHOT.crosshair.y1 + 1) / 2}
              y2={(SHOT.crosshair.y0 + SHOT.crosshair.y1 + 1) / 2}
              stroke={SHOT.crosshair.color}
              strokeWidth={SHOT.crosshair.y1 - SHOT.crosshair.y0 + 1}
              strokeDasharray={`${SHOT.crosshair.dash} ${SHOT.crosshair.gap}`}
              /* ⚠ THE COMB HAS A PHASE. Started at the plot's left edge instead,
                 every dash in the row is one pixel out. */
              strokeDashoffset={
                (((P.x0 - SHOT.crosshair.phase) % (SHOT.crosshair.dash + SHOT.crosshair.gap)) +
                  SHOT.crosshair.dash +
                  SHOT.crosshair.gap) %
                (SHOT.crosshair.dash + SHOT.crosshair.gap)
              }
            />
          )}

          {SHOT.hist.slice(0, bars).map((h) => (
            <rect
              key={`hist${h.i}`}
              x={h.l}
              y={h.t}
              width={h.w}
              height={h.b - h.t + 1}
              rx={ADMR_INK.round.bar}
              fill={TONE[h.tone as string]}
            />
          ))}
          </g>
          <polyline
            points={SHOT.macdLine.pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={C.macd}
            strokeWidth={SHOT.macdLine.width}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - TRIM.macd(tip)}
          />
          <polyline
            points={SHOT.signal.pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={C.signal}
            strokeWidth={SHOT.signal.width}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - TRIM.signal(tip)}
          />

          {/* ── the triangle, drawn on the tape it is read from ──────────
              Trim path, one line at a time, and the high line's run-on is its
              own stroke so it can carry the slope past the two highs that set
              it.

              ⚠ CYAN, NOT INDIGO. Simon, after seeing them: the rule that says
              "here is now" and the two lines that say "this is the shape" are
              different KINDS of claim, and at this point in the scene they are
              on screen together. Indigo for the one, cyan for the other — the
              palette's two anchors, which is what they are for. */}
          {tri.high > 0 && (
            <line
              x1={TRI.a.x}
              y1={TRI.a.y}
              x2={TRI.b.x}
              y2={TRI.b.y}
              stroke={c.cyan}
              strokeWidth={ADMR_INK.tri}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - tri.high}
            />
          )}
          {tri.run > 0 && (
            <line
              x1={TRI.b.x}
              y1={TRI.b.y}
              x2={TRI.ext.x}
              y2={TRI.ext.y}
              stroke={c.cyan}
              strokeWidth={ADMR_INK.tri}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - tri.run}
            />
          )}
          {tri.low > 0 && (
            <line
              x1={TRI.c.x}
              y1={TRI.c.y}
              x2={TRI.d.x}
              y2={TRI.d.y}
              stroke={c.cyan}
              strokeWidth={ADMR_INK.tri}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - tri.low}
            />
          )}
        </g>

        {/* ⚠ THERE IS NO VERTICAL RULE. It rode the front of the tape, then
            swept in at 10703 shortened and dashed, and then came off: "Garis
            putus putus vertikal indigonya remove aja deh, ternyata mengganggu."
            What is left saying where the tape ends is the tape ending. */}

        </g>

        {/* ── the question, in the room the preview opened ───────────────
            "berikan text 'Apa yang perlu diwaspadai?' di sebelah kanan
            candlestick chart di dalam window, align-center secara vertikal."

            ⚠ ITS X FOLLOWS THE TAPE AND ITS Y DOES NOT. The left edge of the
            room is the right edge of the last projected bar, which moves with
            the preview, so `atX` has it; the right edge is the price gutter,
            which does not move at all. Vertically it is centred on the WINDOW —
            that is what "align-center secara vertikal" asks for, and it is why
            the question does not drop when the tape does. */}
        {ask > 0 &&
          (() => {
            const left = atX(centreAt(LAST + ADMR_TAPE.ghost.count) + SHOT.counts.bodyW / 2) + ADMR_INK.ask.gap;
            const right = SHOT.axis.price[0].x0 - ADMR_INK.ask.gap;
            const mid = F.y + F.h / 2;
            const step = ADMR_INK.ask.size * ADMR_INK.ask.lead;
            const top = mid - (step * (ADMR_TAPE.ask.lines.length - 1)) / 2;
            return (
              <g opacity={ask}>
                {ADMR_TAPE.ask.lines.map((line, i) => (
                  <text
                    key={line}
                    x={(left + right) / 2}
                    y={top + i * step}
                    fill={c.ink}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={theme.text.family}
                    fontSize={ADMR_INK.ask.size}
                    fontWeight={theme.text.title.weight}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })()}

        {/* ── the arrow ──────────────────────────────────────────────────
            Simon's own drawing, turned a quarter to the right as he asked: it
            leaves to the RIGHT of candle 123, bends DOWN, and its head finishes
            pointing down-right.

            ⚠ HUNG OFF ITS START POINT, NOT OFF A BOX. "start pointnya 20 px di
            kanan candlestick ke-123" is a spec about one point, so the box is
            solved backwards from it and the 20 stays 20 however the arrow is
            sized.

            ⚠ AND IT IS DRAWN BY EYE. The reference was pasted into the chat
            rather than saved, so there was no file to trace — the one shape in
            this window that is not measured. See `arc` in data/timing.ts. */}
        {arc > 0 &&
          (() => {
            const bar = BARS[LAST];
            const sx = atX(centreAt(LAST) + bar.bw / 2) + ADMR_TAPE.arc.gap / ADMR_SHOT.scale;
            const sy = atY(bar.up ? bar.bt : bar.bb);
            const w = ADMR_TAPE.arc.w / ADMR_SHOT.scale;
            const h = ADMR_TAPE.arc.h / ADMR_SHOT.scale;
            /** The path in its own 0..1 box, read off the rotated reference. */
            const P = (u: number, v: number) => `${sx + (u - 0.1) * w},${sy + (v - 0.15) * h}`;
            const at01 = (u: number, v: number) => ({ x: sx + (u - 0.1) * w, y: sy + (v - 0.15) * h });
            const tip = at01(0.775, 0.92);
            const before = at01(0.7, 0.84);
            const a = Math.atan2(tip.y - before.y, tip.x - before.x);
            const hs = ADMR_INK.arc.head;
            const wing = (t: number) => `${tip.x - hs * Math.cos(a + t)},${tip.y - hs * Math.sin(a + t)}`;
            return (
              <g opacity={arc}>
                <path
                  d={`M ${P(0.1, 0.15)} C ${P(0.42, 0.13)} ${P(0.6, 0.24)} ${P(0.625, 0.52)} C ${P(0.645, 0.74)} ${P(0.7, 0.84)} ${P(0.775, 0.92)}`}
                  fill="none"
                  stroke={c.indigo}
                  strokeWidth={ADMR_INK.arc.width}
                  strokeDasharray={ADMR_INK.arc.dash}
                  strokeLinecap="round"
                />
                <polygon points={`${tip.x},${tip.y} ${wing(0.42)} ${wing(-0.42)}`} fill={c.indigo} />
              </g>
            );
          })()}

        {/* ── the scales ─────────────────────────────────────────────────

            ⚠ THEY ARE OUTSIDE THE MOVE, AND THAT IS THE POINT. Simon: "aku mau
            label x-axis dan y-axis nya bertambah jaraknya aja, jangan ikut
            nge-zoom ukurannya. Label ini memang seharusnya punya behaviour yang
            berbeda, ibarat seperti cara kerja tradingview yang sebenarnya."

            So a label takes ONE coordinate from the move and keeps the other,
            and keeps its type size whatever happens:
              · a PRICE stays pinned in the right-hand gutter and its y follows
                the move, so the ladder spreads apart as the preview closes in;
              · a DATE stays pinned on the bottom strip and its x follows,
                so the months spread apart the same way.
            That is exactly what a real chart does, and it is why they cannot
            live inside the transform: inside it, the type would double and the
            ladder would walk off the right-hand edge.

            ⚠ THE SIX VALUE TAGS ARE GONE, ON INSTRUCTION. "Ada 3 label harga yang
            bentuknya berbeda dari yang lain … Semua label dengan style itu,
            hapus." They were the boxed readouts the export puts against the
            right edge: 1,855 in the MA's red, 1,525 filled in teal, 1,400
            outlined in teal, and the same form again for 66.96 M, −18 and −106.
            All six carried that style, so all six go; what is left is one plain
            grey ladder per pane. They are still in the trace, which is a record
            of the export rather than of the scene.

            ⚠ AND TWO LABELS COME BACK BECAUSE OF IT. TradingView hides a scale
            label when a tag lands on it, so 1,400 and −100 are simply absent from
            the export, and the zero label is nudged 3px off its own gridline to
            clear the −18 tag. Drawn exactly as traced, both ladders would have a
            hole in the middle and read as a bug. data/admr-chart.json puts them
            back and marks them `restored` — their VALUES are arithmetic off the
            same ladder that names every other label on the scale, so nothing
            here is invented. */}
        <g clipPath={`url(#${CLIP.price})`}>
          {SHOT.axis.price.map((l) => (
            <text key={l.text} x={l.x0} y={atY(l.cy)} fill={ground.axis} dominantBaseline="central" {...AXIS}>
              {l.text}
            </text>
          ))}
        </g>
        {SHOT.axis.macd.map((l) => (
          <text key={l.text} x={l.x0} y={atY(l.cy)} fill={ground.axis} dominantBaseline="central" {...AXIS}>
            {l.text}
          </text>
        ))}
        {SHOT.axis.dates.map((d) => (
          <text
            key={`${d.text}${d.cx}`}
            x={atX(d.cx)}
            y={d.cy}
            fill={ground.axis}
            textAnchor="middle"
            dominantBaseline="central"
            {...AXIS}
            /* The year is the one label the export sets in the bold weight. */
            fontWeight={d.strong ? 700 : AXIS.fontWeight}
          >
            {d.text}
          </text>
        ))}
      </g>
    </svg>
  );
};
