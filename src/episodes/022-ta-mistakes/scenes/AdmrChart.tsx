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
 * ⚠ THE ZOOM IS A CHANGE OF MAPPING, NOT A CSS SCALE. `X()` below is one affine
 * map on TIME only, blended from identity to the framing `ADMR_TAPE.zoom` asks
 * for. Prices do not move, so the horizontal gridlines and the whole price
 * ladder stay exactly where — and exactly what — they were. Bars get wider,
 * because bars DO get wider when a chart is zoomed in. Gridline rules, type and
 * the marker keep the weight they had, because chrome does not.
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

/**
 * The step the projection climbs by: the MEDIAN real body on this tape. Picking
 * a number would be picking how big the imagined rebound is; the tape's own
 * typical day is the one step that is not a choice.
 */
const BODY_STEP = (() => {
  const h = BARS.map((b) => b.bb - b.bt + 1).sort((a, b) => a - b);
  return h[(h.length / 2) | 0];
})();

/** The framing the zoom travels to, in the export's own pixels. */
const Z = ADMR_TAPE.zoom;
const ZOOM_L = centreAt(Z.first) - PITCH / 2;
const ZOOM_K = PLOT_W / (centreAt(Z.last) + PITCH / 2 - ZOOM_L);

/** ⚠ ONE `id` PER CLIP, SCOPED TO THIS SCENE. Two <clipPath id="plot"> in one
 *  document and the second one silently wins for both. */
const CLIP = {
  tape: "admr-tape",
  price: "admr-price-gutter",
  window: "admr-window",
  front: "admr-front",
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
  mark,
  zoom,
  ghosts,
  ghostInk,
}: {
  /** How many bars of the tape are drawn, from the left. Fractional, because
   *  the runs are timed; the bars themselves arrive whole, one at a time. */
  shown: number;
  /** Whether the vertical rule that rides the front of the tape is up. */
  mark: boolean;
  /** 0 = the whole tape in frame, 1 = framed on `ADMR_TAPE.zoom`. */
  zoom: number;
  /** How many projected bars are drawn past the front. */
  ghosts: number;
  /** Their opacity — the blink. */
  ghostInk: number;
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

  /** Time, mapped. Identity at zoom 0; `ADMR_TAPE.zoom`'s framing at 1. */
  const X = (x: number) => (1 - zoom) * x + zoom * (P.x0 + (x - ZOOM_L) * ZOOM_K);
  /** What a WIDTH becomes under that map — its derivative, which is constant. */
  const K = 1 + (ZOOM_K - 1) * zoom;

  const n = Math.max(0, Math.min(BARS.length, Math.floor(shown)));
  /** The right edge of the newest bar: where the three lines are cut off. */
  const front = n > 0 ? X(centreAt(n - 1) + PITCH / 2) : P.x0;
  const anchor = n > 0 ? BARS[n - 1] : null;

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
        {/* The three plotted lines are continuous, so they cannot arrive bar by
            bar — they are cut at the front of the tape instead. */}
        <clipPath id={CLIP.front}>
          <rect
            x={P.x0}
            y={F.y}
            width={Math.max(0, Math.min(front, P.x1 + 1) - P.x0)}
            height={F.h}
          />
        </clipPath>
        {/* The "800" label is cut in half by the floor of the price pane in the
            export, because that is where the pane ends. */}
        <clipPath id={CLIP.price}>
          <rect x={F.x} y={PANES.price.y0} width={F.w} height={PANES.price.y1 - PANES.price.y0 + 1} />
        </clipPath>
        {/* Insurance, not correction: nothing currently reaches a corner, but a
            gridline runs to the very top of the window and the date strip to
            the very bottom, so the day one of them moves it is already held. */}
        <clipPath id={CLIP.window}>
          <rect x={F.x + 2} y={F.y + 2} width={F.w - 4} height={F.h - 4} rx={R - 2} />
        </clipPath>
      </defs>

      {/* ── the window ─────────────────────────────────────────────────── */}
      {/* ⚠ ONE RULE, NOT TWO. The export draws a #313131 ring with a #292929
          ring inside it — two steps of dark that exist to separate the chart
          from the app around it. On white there is nothing to separate it from
          but the page, so the two rings become the one border the page uses. */}
      <rect x={F.x} y={F.y} width={F.w} height={F.h} rx={R} fill={ground.edge} />
      <rect x={F.x + 2} y={F.y + 2} width={F.w - 4} height={F.h - 4} rx={R - 2} fill={ground.bg} />

      <g clipPath={`url(#${CLIP.window})`}>
        {/* ── the grid, which is on screen before anything is drawn on it ── */}
        {[...SHOT.grid.h, ...SHOT.grid.macdH].map((y) => (
          <rect key={`h${y}`} x={P.x0} y={y - 1} width={PLOT_W} height={SHOT.grid.weight} fill={ground.grid} />
        ))}
        {/* ⚠ THE VERTICAL LINES STOP ABOVE THE DATE STRIP. Run the full height
            of the window they comb straight through the month names, which the
            export does not do: its MACD plot ends at y1331 and the time axis
            under it carries no grid at all.

            ⚠ AND THEY TRAVEL WITH THE ZOOM, because each one IS a time — a
            month boundary. Their WEIGHT does not, because a rule is chrome. */}
        <g clipPath={`url(#${CLIP.tape})`}>
          {SHOT.grid.v.map((x) => (
            <rect
              key={`v${x}`}
              x={X(x) - SHOT.grid.weight / 2}
              y={SHOT.grid.vSpan.y0}
              width={SHOT.grid.weight}
              height={SHOT.grid.vSpan.y1 - SHOT.grid.vSpan.y0 + 1}
              fill={ground.grid}
            />
          ))}
        </g>
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
          {SHOT.vol.slice(0, n).map((v) => (
            <rect
              key={`vol${v.i}`}
              x={X(v.l)}
              y={v.t}
              width={v.w * K}
              height={v.b - v.t + 1}
              fill={v.up ? VOL.up : VOL.down}
              fillOpacity={VOL.alpha}
            />
          ))}

          {/* ⚠ THE MA100 GOES UNDER THE CANDLES, which is the order the export
              drew it in and the reason the trace had to interpolate the six
              stretches where a candle buries it. Against the volume it is
              unordered: checked pixel by pixel, the line does not pass through
              a single volume bar anywhere in this export. */}
          <g clipPath={`url(#${CLIP.front})`}>
            <polyline
              points={SHOT.ma.pts.map(([x, y]) => `${X(x)},${y}`).join(" ")}
              fill="none"
              stroke={C.ma}
              strokeWidth={SHOT.ma.width}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {BARS.slice(0, n).map((b) => {
            const ink = b.up ? C.up : C.down;
            const cx = X(b.bl + b.bw / 2);
            const bw = b.bw * K;
            return (
              <g key={`bar${b.i}`}>
                <rect x={cx - K} y={b.wt} width={2 * K} height={b.wb - b.wt + 1} fill={ink} />
                <rect x={cx - bw / 2} y={b.bt} width={bw} height={b.bb - b.bt + 1} fill={ink} />
              </g>
            );
          })}

          {/* ⚠ HOLLOW, DASHED AND WITHOUT A WICK — because they are not data and
              must not be readable as data. They climb from the close of the
              newest real bar, one median body per step, and they carry no
              number and name no level. See `ghost` in data/timing.ts. */}
          {anchor &&
            ghosts > 0 &&
            Array.from({ length: ghosts }, (_, i) => {
              const bottom =
                (anchor.up ? anchor.bt : anchor.bb) - i * BODY_STEP * ADMR_INK.ghost.rise;
              const bw = SHOT.counts.bodyW * K;
              return (
                <rect
                  key={`ghost${i}`}
                  x={X(centreAt(n + i)) - bw / 2}
                  y={bottom - BODY_STEP}
                  width={bw}
                  height={BODY_STEP}
                  fill="none"
                  stroke={C.up}
                  strokeWidth={ADMR_INK.ghost.width}
                  strokeDasharray={ADMR_INK.ghost.dash}
                  opacity={ghostInk}
                />
              );
            })}

          {/* Simon's own cursor left this on the export, at 1,525. */}
          {SHOT.crosshair && n > 0 && (
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

          {SHOT.hist.slice(0, n).map((h) => (
            <rect
              key={`hist${h.i}`}
              x={X(h.l)}
              y={h.t}
              width={h.w * K}
              height={h.b - h.t + 1}
              fill={TONE[h.tone as string]}
            />
          ))}
          <g clipPath={`url(#${CLIP.front})`}>
            <polyline
              points={SHOT.macdLine.pts.map(([x, y]) => `${X(x)},${y}`).join(" ")}
              fill="none"
              stroke={C.macd}
              strokeWidth={SHOT.macdLine.width}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polyline
              points={SHOT.signal.pts.map(([x, y]) => `${X(x)},${y}`).join(" ")}
              fill="none"
              stroke={C.signal}
              strokeWidth={SHOT.signal.width}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ── the rule that rides the front of the tape ──────────────────
            "garis ini muncul dari tepi kiri, hingga sejajar candle ke 123."
            It has no clock of its own: it stands wherever the newest bar is,
            which is the plot's left edge before there is one. Full window
            height, so it reads as "here is now" rather than as a chart line. */}
        {mark && (
          <rect
            x={(n > 0 ? X(centreAt(n - 1)) : P.x0) - ADMR_INK.mark / 2}
            y={F.y + 2}
            width={ADMR_INK.mark}
            height={F.h - 4}
            fill={c.indigo}
          />
        )}

        {/* ── the scales ─────────────────────────────────────────────────

            ⚠ THE SIX VALUE TAGS ARE GONE, ON INSTRUCTION. "Ada 3 label harga yang
            bentuknya berbeda dari yang lain … Semua label dengan style itu,
            hapus." — Simon, 2026-09-17. They were the boxed readouts the export
            puts against the right edge: 1,855 in the MA's red, 1,525 filled in
            teal, 1,400 outlined in teal, and the same form again for 66.96 M,
            −18 and −106. All six carried that style, so all six go; what is left
            is one plain grey ladder per pane. They are still in the trace, which
            is a record of the export rather than of the scene.

            ⚠ AND TWO LABELS COME BACK BECAUSE OF IT. TradingView hides a scale
            label when a tag lands on it, so 1,400 and −100 are simply absent from
            the export, and the zero label is nudged 3px off its own gridline to
            clear the −18 tag. Drawn exactly as traced, both ladders would have a
            hole in the middle and read as a bug. data/admr-chart.json puts them
            back and marks them `restored` — their VALUES are arithmetic off the
            same ladder that names every other label on the scale, so nothing
            here is invented.

            ⚠ THE PRICE LADDER DOES NOT MOVE WITH THE ZOOM. That zoom is on TIME
            only, so every one of these still names the gridline beside it. The
            dates DO move, because a date is a time. */}
        <g clipPath={`url(#${CLIP.price})`}>
          {SHOT.axis.price.map((l) => (
            <text key={l.text} x={l.x0} y={l.cy} fill={ground.axis} dominantBaseline="central" {...AXIS}>
              {l.text}
            </text>
          ))}
        </g>
        {SHOT.axis.macd.map((l) => (
          <text key={l.text} x={l.x0} y={l.cy} fill={ground.axis} dominantBaseline="central" {...AXIS}>
            {l.text}
          </text>
        ))}
        <g clipPath={`url(#${CLIP.tape})`}>
          {SHOT.axis.dates.map((d) => (
            <text
              key={`${d.text}${d.cx}`}
              x={X(d.cx)}
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
      </g>
    </svg>
  );
};
