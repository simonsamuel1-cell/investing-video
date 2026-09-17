/**
 * scenes/AdmrChart.tsx — Simon's `ADMR_03.png`, redrawn.
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
 * hairlines, the volume as one flat block, the histogram as blue dashes.
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
 * the JSON back at 2758×1458 and diffs it against the export: 0.214% of the
 * plot differs, and every one of those pixels is anti-aliasing along the three
 * plotted lines. Re-run both after any change.
 *
 * ⚠ RED AND GREEN OUTSIDE THE CANDLE BODIES, DELIBERATELY. The standing rule
 * is that only candle bodies carry them; this scene is a REPRODUCTION of a
 * third-party chart, the same exemption `core/TuntunMark` has for a supplied
 * logo, and every colour in it is sampled from the file rather than chosen.
 * That is also why they live in the JSON and not in a palette slot: they are
 * measurements, and a theme swap must not follow them.
 */
import { theme, usePalette } from "../../../core";
import { ADMR_SHOT } from "../data/layout";
import SHOT from "../data/admr-chart.json";

const F = SHOT.frame;
const P = SHOT.plot;
const C = SHOT.colors;
const PANES = SHOT.panes;
const PLOT_W = P.x1 - P.x0 + 1;
/** The four histogram tones, reached by the name the trace recorded. */
const TONE = C.hist as Record<string, string>;
const VOL = C.vol as { up: string; down: string; alpha: number };

/**
 * ═══ THE GROUND IS OURS, THE INK IS THE CHART'S ═══ (Simon, 2026-09-17:
 * "buat backgroundnya jadi putih, bukan hitam")
 *
 * ⚠ AND THE TRACE IS NOT TOUCHED TO DO IT. `SHOT.colors` still holds the dark
 * values sampled out of the export, because scripts/redraw-admr.mjs diffs the
 * JSON against that export and a recoloured JSON would fail its own proof. So
 * the window's GROUND — background, grid, rules, scale type — is read from the
 * episode palette instead, and everything that carries DATA keeps the colour it
 * has in the file. Flip the palette and the chart follows; re-run the trace and
 * the geometry still verifies. Neither can break the other.
 *
 * ⚠ THE VOLUME BARS AND THE HISTOGRAM TINTS ARE LEFT ALONE ON PURPOSE. The
 * volume is drawn at 50% and composites against whatever is behind it, so on
 * white it becomes the pale teal and pale pink a light-theme chart has, for
 * free. The two pale histogram tones stay the light tints they are — that is
 * what the falling bars look like in a light chart, and darkening them would
 * make "falling" louder than "growing", which is backwards.
 */
/**
 * ⚠ ONE INK STOPS WORKING WHEN THE GROUND FLIPS, AND IT IS A LEGIBILITY BUG,
 * NOT A STYLE CHOICE.
 *
 * The value tags borrow the colour of the thing they measure — so the MACD tag
 * is drawn in the CURRENT histogram tone, which right now is the pale pink of a
 * falling bar. Pale pink on black is a label; pale pink on white is nothing.
 * The same, less badly, for the teal volume tag and the orange signal tag.
 *
 * So anything set as TYPE or as a 2px OUTLINE is walked away from the ground
 * until it reaches a contrast ratio of 3 — WCAG's floor for large text, and the
 * least that survives a video being watched on a phone. FILLS are left alone:
 * a histogram bar is a shape, it is read by its size, and darkening the falling
 * bars would make them louder than the growing ones, which is backwards.
 *
 * ⚠ IT IS COMPUTED, NOT TYPED, so it survives a palette swap in either
 * direction — on a dark ground the same function walks the ink the other way.
 */
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (v: number[]) => "#" + v.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
const lum = (v: number[]) =>
  v
    .map((n) => n / 255)
    .map((u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4))
    .reduce((a, u, i) => a + u * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const READABLE = 3;
const legible = (ink: string, bg: string) => {
  const g = lum(rgb(bg));
  if (ratio(lum(rgb(ink)), g) >= READABLE) return ink;
  /** Away from the ground: toward black over a light one, toward white over a
   *  dark one. Binary search, because luminance is not linear in the channel. */
  const away = g > 0.4 ? [0, 0, 0] : [255, 255, 255];
  const from = rgb(ink);
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const t = (lo + hi) / 2;
    const mid = from.map((n, k) => n + (away[k] - n) * t);
    if (ratio(lum(mid), g) >= READABLE) hi = t;
    else lo = t;
  }
  return hex(from.map((n, k) => n + (away[k] - n) * hi));
};

const ground = (c: ReturnType<typeof usePalette>) => ({
  /** White, not the page — the chart is a window on the page, not the page. */
  bg: c.cardBg,
  grid: c.border,
  edge: c.border,
  sep: c.border,
  axis: c.slate,
});

/** ⚠ ONE `id` PER CLIP, SCOPED TO THIS SCENE. Two <clipPath id="plot"> in one
 *  document and the second one silently wins for both. */
const CLIP = { tape: "admr-tape", price: "admr-price-gutter" };

const AXIS = {
  fontFamily: theme.text.family,
  fontSize: SHOT.axis.size,
  fontWeight: 500,
} as const;

/**
 * ⚠ IT HAS NO ENTRANCE, AND THAT IS NOT AN OMISSION. This picture arrives on
 * SC11's camera cut at f10185, and a camera cut swaps content at the midpoint
 * of a move that never stops — the incoming half is ALREADY complete on the
 * frame it lands. Fading it up, or drawing the tape across, would mean the cut
 * handed over to an empty window. The arriving is `cutInStyle`'s job, and
 * AdmrGroup does it on the root. See core/CameraCut.ts.
 */
export const AdmrChart = () => {
  const g = ground(usePalette());
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
        {/* The "800" label is cut in half by the floor of the price pane in the
            export, because that is where the pane ends. */}
        <clipPath id={CLIP.price}>
          <rect x={F.x} y={PANES.price.y0} width={F.w} height={PANES.price.y1 - PANES.price.y0 + 1} />
        </clipPath>
      </defs>

      {/* ── the window ─────────────────────────────────────────────────── */}
      {/* ⚠ ONE RULE, NOT TWO. The export draws a #313131 ring with a #292929
          ring inside it — two steps of dark that exist to separate the chart
          from the app around it. On white there is nothing to separate it from
          but the page, so the two rings become the one border the page uses. */}
      <rect x={F.x} y={F.y} width={F.w} height={F.h} fill={g.edge} />
      <rect x={F.x + 2} y={F.y + 2} width={F.w - 4} height={F.h - 4} fill={g.bg} />

      {/* ── the grid, under everything the tape draws ──────────────────── */}
      {[...SHOT.grid.h, ...SHOT.grid.macdH].map((y) => (
        <rect key={`h${y}`} x={P.x0} y={y - 1} width={PLOT_W} height={SHOT.grid.weight} fill={g.grid} />
      ))}
      {/* ⚠ THE VERTICAL LINES STOP ABOVE THE DATE STRIP. Run the full height of
          the window they comb straight through the month names, which the
          export does not do: its MACD plot ends at y1331 and the time axis
          under it carries no grid at all. */}
      {SHOT.grid.v.map((x) => (
        <rect
          key={`v${x}`}
          x={x - 1}
          y={SHOT.grid.vSpan.y0}
          width={SHOT.grid.weight}
          height={SHOT.grid.vSpan.y1 - SHOT.grid.vSpan.y0 + 1}
          fill={g.grid}
        />
      ))}
      <rect
        x={F.x + 2}
        y={PANES.sep.y0}
        width={F.w - 4}
        height={PANES.sep.y1 - PANES.sep.y0 + 1}
        fill={g.sep}
      />

      <g clipPath={`url(#${CLIP.tape})`}>
        {/* ⚠ VOLUME IS HALF-TRANSPARENT AND THE GRIDLINES SHOW THROUGH IT.
            Measured, not styled: #22AB94 at 50% over the #141414 ground is
            exactly the (27,96,84) in the file, and over a #212121 gridline it
            is exactly the (33,102,90) two rows lower. */}
        {SHOT.vol.map((v) => (
          <rect
            key={`vol${v.i}`}
            x={v.l}
            y={v.t}
            width={v.w}
            height={v.b - v.t + 1}
            fill={v.up ? VOL.up : VOL.down}
            fillOpacity={VOL.alpha}
          />
        ))}

        {/* ⚠ THE MA100 GOES UNDER THE CANDLES, which is the order the export
            drew it in and the reason the trace had to interpolate the six
            stretches where a candle buries it. Against the volume it is
            unordered: checked pixel by pixel, the line does not pass through a
            single volume bar anywhere in this export. */}
        <polyline
          points={SHOT.ma.pts.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={C.ma}
          strokeWidth={SHOT.ma.width}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {SHOT.bars.map((b) => {
          const ink = b.up ? C.up : C.down;
          const cx = b.bl + b.bw / 2;
          return (
            <g key={`bar${b.i}`}>
              <rect x={cx - 1} y={b.wt} width={2} height={b.wb - b.wt + 1} fill={ink} />
              <rect x={b.bl} y={b.bt} width={b.bw} height={b.bb - b.bt + 1} fill={ink} />
            </g>
          );
        })}

        {/* Simon's own cursor left this on the export, at 1,525. */}
        {SHOT.crosshair && (
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

        {SHOT.hist.map((h) => (
          <rect
            key={`hist${h.i}`}
            x={h.l}
            y={h.t}
            width={h.w}
            height={h.b - h.t + 1}
            fill={TONE[h.tone as string]}
          />
        ))}
        <polyline
          points={SHOT.macdLine.pts.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={C.macd}
          strokeWidth={SHOT.macdLine.width}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={SHOT.signal.pts.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={C.signal}
          strokeWidth={SHOT.signal.width}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      {/* ── the scales ─────────────────────────────────────────────────── */}
      <g clipPath={`url(#${CLIP.price})`}>
        {SHOT.axis.price.map((l) => (
          <text key={l.text} x={l.x0} y={l.cy} fill={g.axis} dominantBaseline="central" {...AXIS}>
            {l.text}
          </text>
        ))}
      </g>
      {SHOT.axis.macd.map((l) => (
        <text key={l.text} x={l.x0} y={l.cy} fill={g.axis} dominantBaseline="central" {...AXIS}>
          {l.text}
        </text>
      ))}
      {SHOT.axis.dates.map((d) => (
        <text
          key={`${d.text}${d.cx}`}
          x={d.cx}
          y={d.cy}
          fill={g.axis}
          textAnchor="middle"
          dominantBaseline="central"
          {...AXIS}
          /* The year is the one label the export sets in the bold weight. */
          fontWeight={d.strong ? 700 : AXIS.fontWeight}
        >
          {d.text}
        </text>
      ))}

      {/* ── the value tags, last, because one of them covers a label ───── */}
      <g>
        {SHOT.tags.map((t) => (
          <g key={t.text}>
            <rect
              x={t.x + t.weight / 2}
              y={t.y + t.weight / 2}
              width={t.w - t.weight}
              height={t.h - t.weight}
              fill={t.fill ?? "none"}
              stroke={t.fill ? t.stroke : legible(t.stroke, g.bg)}
              strokeWidth={t.weight}
            />
            <text
              x={t.x + t.w / 2}
              y={t.cy}
              fill={legible(t.color, t.fill ?? g.bg)}
              textAnchor="middle"
              dominantBaseline="central"
              {...AXIS}
            >
              {t.text}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
