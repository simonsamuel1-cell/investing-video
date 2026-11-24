/**
 * VI03 · SC05 v2 — "BBCA: Rp11.000 vs di Bawah Rp5.000", told the way SC03 and SC04 were (Simon 17 Nov: "lanjut revisi scene 5"):
 * one white frame, a fact card that builds line by line and is carried on, a working chart, one indigo summary line per sentence,
 * a key-term cut — and nothing on screen for only a second or two. Storyboard: docs/vi-style/storyboards/VI03-SC05-v2.png.
 * The first build is BbcaTwoPrices.tsx (switch SC05_LOOK).
 *
 *  A  "Sekarang lihat kejadian nyata di 2026": "Kejadian nyata 2026" opens in the middle, then docks as the heading over the
 *     frame. "BBCA adalah": the frame and a company card, BBCA · Bank Central Asia, its rows on their words — Biaya dana
 *     Terendah, Margin bunga Tertinggi, Company Quality Best.
 *  B  "Pada 23 September 2024": the card goes; BBCA's real weekly closes draw in a wide chart card, to 23 Sep 2024 (10.950),
 *     down to 8 Jun 2026 (4.850); under it Tuntun's own BBCA card (VIDEO 09's Company Quality / Reference Fair Value /
 *     Bullish Signals screenshot); "Foreign outflow · Net sell ±Rp31 T" (Kontan) on its sentence.
 *  C  "Padahal": Company Quality, then Reference Fair Value, boxed in indigo on the screenshot.
 *  D  "Sampai 13 November 2026": the line runs on to 5.500; −44% at the high, +14% at the low (the VO's own figures, which
 *     include cash dividends; no note on screen).
 *  E  "Seberapa bagus pun perusahaannya" (a camera cut): "Cukup murah", very large; "Sebagus apa pun perusahaannya"; two cards,
 *     Ruang untuk return and Ruang kalau kita salah, on their words; "Terlalu suka, jadi bayar mahal".
 *
 * Simon 17 Nov: no white story frame here (the cards stand on the grid, as in IN07/TA09), prices without "Rp", no source
 * line over the chart, Tuntun's real BBCA screenshot instead of a drawn card, BBCA's own logo on its card.
 * Prices: data/bbca.ts (Yahoo Finance, BBCA.JK), credited by SourceTag. Net foreign sell: Kontan, Jan–Jun 2026, Rp31,34 T.
 * Results to 13 Nov 2026 with cash dividends: data/bbca.ts.
 */
import { CardE as Card, PicE as Pic } from "../../../editable";
import { staticFile, useCurrentFrame, Interactive } from "remotion";
import {
  HighlightBox,
  SoftGround,
  Stage,
  cutInStyle,
  cutOutStyle,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
  type Cut,
} from "../../../core";
import { BBCA_MARKS, BBCA_RESULT, BBCA_WEEKLY } from "../data/bbca";
import { BLOCK, CUT } from "../data/timing";
import { BoardGrid, Glyph, ease, useWords } from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
type Box = { x: number; y: number; w: number; h: number };
/** prices without "Rp" (Simon 17 Nov) */
const num = (v: number) => v.toLocaleString("id-ID");

// no white frame in this scene (Simon 17 Nov): the cards stand on the grid
const MID_X = theme.canvas.width / 2;
/** the heading: opens in the middle, docks over the frame (SC04's heading place and size) */
const HEAD = {
  text: "Kejadian nyata 2026",
  openCy: 520,
  openScale: 1.7,
  cy: 112,
  size: 64,
};
/** the closing line's size (E) */
const LINE = { size: 52 };

// A — the company card, BBCA's own logo on it; centred vertically on the screen now that no line sits under it (Simon 17 Nov)
const BIG: Box = { x: 560, y: 540 - 400 / 2, w: 800, h: 400 };
const LOGO = { src: "art/vi03/app/bbca-logo.png", d: 84 };
const ROWS = [
  {
    icon: "coins",
    label: "Biaya dana",
    value: "Terendah",
    at: "Biaya dananya",
  },
  {
    icon: "chart-bar",
    label: "Margin bunga",
    value: "Tertinggi",
    at: "margin bunganya",
  },
  {
    icon: "seal-check",
    label: "Company Quality",
    value: "Best",
    at: "Company",
  },
] as const;
const BIG_ROW = { x: 32, ys: [150, 230, 310], h: 64, disc: 44 };
/**
 * B–D: Tuntun's own BBCA card (VIDEO 09's screenshot, public/art/vi03/app/bbca-rfv.svg, 343 × 78), under the chart. C boxes
 * Company Quality on "kualitasnya" and Reference Fair Value on "Reference" (their columns, in the SVG's own units).
 */
/** 820 wide (was 900) so that, centred, it clears the news card on its left by 42 px */
const SHOT = {
  src: "art/vi03/app/bbca-rfv.svg",
  w0: 343,
  h0: 78,
  w: 820,
  y: 695,
  radius: 8,
};
const SHOT_K = SHOT.w / SHOT.w0;
/** centred under the chart (Simon 17 Nov: "align center horizontal aja pada chart di atas"): the chart's middle is x 960 */
const SHOT_X = 960 - SHOT.w / 2;
const SHOT_BOX = [
  { x1: 4, y1: 4, x2: 95, y2: 74, at: "kualitasnya" },
  { x1: 102, y1: 4, x2: 241, y2: 74, at: "Reference" },
] as const;

// B–D — BBCA's price, 2024–2026
/**
 * The chart in its own white card, wide and taller now that no summary line sits under it (Simon 17 Nov: "adjust ulang posisi
 * dan ukuran masing-masing kartu"). Chart 195–665, 30 px gap, then the news card and Tuntun's card side by side, the same
 * height (695–881): the block's middle is the screen's (538), 45 px under the heading.
 */
const CHART: Box = { x: 200, y: 195, w: 1520, h: 470 };
const PLOT = { x: 330, y: CHART.y + 35, w: 1340, h: 350 };
const Y = { lo: 4000, hi: 12000, ticks: [4000, 6000, 8000, 10000, 12000] };
const N = BBCA_WEEKLY.length;
const px = (i: number) => PLOT.x + (i / (N - 1)) * PLOT.w;
const py = (v: number) => PLOT.y + (1 - (v - Y.lo) / (Y.hi - Y.lo)) * PLOT.h;
const idx = (d: string) => BBCA_WEEKLY.findIndex(([day]) => day === d);
const I_HIGH = idx(BBCA_MARKS.high.date);
const I_LOW = idx(BBCA_MARKS.low.date);
const I_END = N - 1;
const YEARS = ["2024", "2025", "2026"].map((y) => ({
  y,
  i: BBCA_WEEKLY.findIndex(([d]) => d.startsWith(y)),
}));
/** the news card, in the plot's lower left, under 2024's high prices */
/** under the chart, left-aligned with it (Simon 17 Nov: "jangan di dalam chart, di bawah chart aja align-left") */
/** inner margins widened to 30 px all round (Simon 17 Nov: "margin dalam kartu terlalu sempit, luasin"); `rows` = each line's centre */
const NEWS = {
  x: 200,
  y: SHOT.y,
  w: 308,
  h: (SHOT.h0 * SHOT.w) / SHOT.w0,
  pad: 30,
  rows: [56, 98, 134],
};
/** 13 Nov 2026's label in the plot's top right, a dashed leader down to its day (no "termasuk dividen" note: Simon 17 Nov) */
const EVAL_LABEL = { y: PLOT.y + 18 };
/** "8 Jun 2026 (4.850)" at 26 px is 233 px wide (measured): "+14%" sits left of it on its row, clear of the year labels */
const LOW_LABEL_W = 233;

// E — the lesson, after the cut
/** Simon's words and case (17 Nov): "Beli Cukup Murah" in indigo, "sebagus apapun perusahaannya" in black under it */
const KEY = { text: "Beli Cukup Murah", cy: 300, size: 160 };
const SUB = { text: "sebagus apapun perusahaannya", cy: 440, size: 40 };
const ROOM = { w: 580, h: 170, gap: 50, y: 510, disc: 96, size: 36 };
const ROOMS = [
  { icon: "trend-up", text: "Ruang untuk return", at: "ruang untuk return" },
  { icon: "shield-check", text: "Ruang kalau kita salah", at: "ruang kalau" },
] as const;
/** no heart icon (Simon 17 Nov: "icon hati, buang") */
const LAST = { text: "Terlalu suka, jadi bayar mahal", cy: 790 };

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  // A
  const bankAt = W("BBCA adalah");
  const dock = ease(f, bankAt - m.sec(0.2), m.move);
  const cardIn = ease(f, bankAt + m.sec(0.4), m.reveal);
  const rowIn = ROWS.map((r) => ease(f, W(r.at), m.reveal));
  // B — the company card goes, the chart and Tuntun's card come
  const chartAt = W("Pada 23");
  const cardOut = ease(f, chartAt, m.fade);
  const chartIn = ease(f, chartAt + m.fade, m.reveal);
  const shotIn = ease(f, chartAt + m.fade + m.sec(0.3), m.reveal);
  const toHigh = ease(f, chartAt + m.sec(0.6), m.sec(1.4));
  const toLow = ease(f, W("Kemudian pada"), m.sec(2));
  const evalAt = W("Sampai 13");
  const toEnd = ease(f, evalAt, m.sec(1.2));
  const upto =
    toHigh * I_HIGH + toLow * (I_LOW - I_HIGH) + toEnd * (I_END - I_LOW);
  const n = Math.max(1, Math.floor(upto));
  const pts = BBCA_WEEKLY.slice(0, n + 1).map(
    ([, v], i) => [px(i), py(v)] as const,
  );
  const frac = upto - n;
  const tip =
    n < N - 1
      ? ([
          px(n + frac),
          py(
            BBCA_WEEKLY[n][1] +
              (BBCA_WEEKLY[n + 1][1] - BBCA_WEEKLY[n][1]) * frac,
          ),
        ] as const)
      : null;
  const path = [...pts, ...(tip ? [tip] : [])]
    .map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const newsIn = ease(f, W("Berita foreign"), m.reveal);
  // D
  const loss = ease(f, W("Investor di sekitar"), m.reveal);
  const gain = ease(f, W("Investor di bawah"), m.reveal);
  // E
  const cut: Cut = { at: W("Seberapa") - m.sec(0.1), axis: "x", ...CUT };
  const keyIn = ease(f, cut.at, m.reveal);
  const subIn = ease(f, cut.at + m.sec(0.3), m.reveal);
  const lastIn = ease(f, W("orang membeli terlalu"), m.reveal);

  /**
   * No summary line during "Kejadian nyata 2026" (Simon 17 Nov): on-screen text only for a real message / insight, usually at
   * the end of the scene, and none at all if there isn't one. The card, the chart labels and the results already say it here;
   * the scene's one insight is LAST ("Terlalu suka, jadi bayar mahal").
   */

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–D, cut away at "Seberapa" */}
      {f < cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f >= cut.at - cut.over / 2 ? cutOutStyle(f, cut) : {}),
          }}
        >
          {/* the heading */}
          <Interactive.Div
            name="Objek"
            style={{
              position: "absolute",
              left: MID_X,
              top: mix(HEAD.openCy, HEAD.cy, dock),
              transform: `translate(-50%, -50%) scale(${mix(HEAD.openScale, 1, dock).toFixed(4)})`,
              opacity: ease(f, -m.reveal, m.reveal),
              ...typeStyle("title"),
              fontSize: HEAD.size,
              fontWeight: 700,
              lineHeight: 1.1,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            {HEAD.text}
          </Interactive.Div>

          {/* A: the company card */}
          {cardIn > 0.001 && cardOut < 0.999 ? (
            <Card
              x={BIG.x}
              y={BIG.y + (1 - cardIn) * 16}
              w={BIG.w}
              h={BIG.h}
              style={{ opacity: cardIn * (1 - cardOut) }}
            >
              <Interactive.Div
                name="BBCA"
                style={{
                  position: "absolute",
                  left: 32,
                  top: 82,
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Pic
                  src={staticFile(LOGO.src)}
                  style={{ width: LOGO.d, height: LOGO.d, flex: "none" }}
                />
                <div
                  style={{
                    ...typeStyle("title"),
                    fontSize: 52,
                    fontWeight: 700,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  BBCA
                </div>
                <div
                  style={{
                    ...typeStyle("label"),
                    fontSize: 32,
                    fontWeight: 500,
                    color: c.slate,
                    whiteSpace: "nowrap",
                  }}
                >
                  Bank Central Asia
                </div>
              </Interactive.Div>
              {ROWS.map((r, i) => (
                <div
                  key={r.label}
                  style={{
                    position: "absolute",
                    left: BIG_ROW.x,
                    top: BIG_ROW.ys[i] + (1 - rowIn[i]) * 10,
                    width: BIG.w - 2 * BIG_ROW.x,
                    height: BIG_ROW.h,
                    opacity: rowIn[i],
                    borderRadius: 18,
                    boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0 24px 0 10px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: BIG_ROW.disc,
                      height: BIG_ROW.disc,
                      borderRadius: 999,
                      background: theme.color.neutralDisc,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <Glyph
                      icon={r.icon}
                      size={BIG_ROW.disc * 0.58}
                      tone={c.indigo}
                    />
                  </div>
                  <div
                    style={{
                      ...typeStyle("label"),
                      fontSize: 30,
                      fontWeight: 600,
                      color: c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      ...typeStyle("label"),
                      fontSize: 32,
                      fontWeight: 700,
                      color: i === 2 ? theme.color.ok : c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.value}
                  </div>
                </div>
              ))}
            </Card>
          ) : null}

          {/* B–D: the chart, in its own card */}
          {chartIn > 0.001 ? (
            <div style={{ position: "absolute", inset: 0, opacity: chartIn }}>
              <Card
                x={CHART.x}
                y={CHART.y + (1 - chartIn) * 16}
                w={CHART.w}
                h={CHART.h}
              />
              <svg
                width={theme.canvas.width}
                height={theme.canvas.height}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                {Y.ticks.map((t) => (
                  <g key={t}>
                    <line
                      x1={PLOT.x}
                      y1={py(t)}
                      x2={PLOT.x + PLOT.w}
                      y2={py(t)}
                      stroke={theme.color.skeleton}
                      strokeWidth={2}
                    />
                    <text
                      x={PLOT.x - 16}
                      y={py(t) + 8}
                      textAnchor="end"
                      fontFamily={theme.text.family}
                      fontSize={24}
                      fontWeight={500}
                      fill={c.slate}
                    >
                      {num(t)}
                    </text>
                  </g>
                ))}
                {YEARS.map((y) => (
                  <text
                    key={y.y}
                    x={px(y.i)}
                    y={PLOT.y + PLOT.h + 36}
                    textAnchor="start"
                    fontFamily={theme.text.family}
                    fontSize={24}
                    fontWeight={600}
                    fill={c.slate}
                  >
                    {y.y}
                  </text>
                ))}
                {upto > 0.01 ? (
                  <path
                    d={path}
                    fill="none"
                    stroke={c.indigo}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
                {[
                  { i: I_HIGH, at: chartAt + m.sec(1.8) },
                  { i: I_LOW, at: W("Kemudian pada") + m.sec(1.8) },
                  { i: I_END, at: evalAt + m.sec(1.1) },
                ].map((k) => {
                  const p = ease(f, k.at, m.pop);
                  return p > 0.001 ? (
                    <g key={k.i} opacity={p}>
                      <circle
                        cx={px(k.i)}
                        cy={py(BBCA_WEEKLY[k.i][1])}
                        r={14}
                        fill={c.cardBg}
                        stroke={c.indigo}
                        strokeWidth={4}
                      />
                      <circle
                        cx={px(k.i)}
                        cy={py(BBCA_WEEKLY[k.i][1])}
                        r={6}
                        fill={c.indigo}
                      />
                    </g>
                  ) : null;
                })}
              </svg>
              {/* the two days the VO names first, plain text */}
              {[
                {
                  i: I_HIGH,
                  date: "23 Sep 2024",
                  price: BBCA_MARKS.high.close,
                  at: chartAt + m.sec(1.8),
                  x: 0,
                  y: -36,
                  anchor: "center",
                },
                {
                  i: I_LOW,
                  date: "8 Jun 2026",
                  price: BBCA_MARKS.low.close,
                  at: W("Kemudian pada") + m.sec(1.8),
                  x: -24,
                  y: 0,
                  anchor: "right",
                },
              ].map((k) => {
                const p = ease(f, k.at, m.reveal);
                if (p <= 0.001) return null;
                return (
                  <div
                    key={k.i}
                    style={{
                      position: "absolute",
                      left: px(k.i) + k.x,
                      top: py(BBCA_WEEKLY[k.i][1]) + k.y,
                      transform: `translate(${k.anchor === "center" ? "-50%" : "-100%"}, -50%)`,
                      opacity: p,
                      ...typeStyle("label"),
                      fontSize: 26,
                      fontWeight: 600,
                      color: c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {/* "23 Sep 2024 (10.950)", the price in indigo (Simon 17 Nov) */}
                    {k.date} (
                    <span style={{ color: c.indigo }}>{num(k.price)}</span>)
                  </div>
                );
              })}
              {/* D: 13 Nov 2026 in the corner, a leader down to the day; the results and their note */}
              {(() => {
                const p = ease(f, evalAt + m.sec(1.1), m.reveal);
                if (p <= 0.001) return null;
                const x = px(I_END);
                return (
                  <div style={{ position: "absolute", inset: 0, opacity: p }}>
                    <svg
                      width={theme.canvas.width}
                      height={theme.canvas.height}
                      style={{ position: "absolute", left: 0, top: 0 }}
                    >
                      <line
                        x1={x}
                        y1={EVAL_LABEL.y + 22}
                        x2={x}
                        y2={py(BBCA_MARKS.eval.close) - 18}
                        stroke={c.indigo}
                        strokeWidth={2}
                        strokeDasharray="6 8"
                      />
                    </svg>
                    <Interactive.Div
                      name="13 Nov 2026 ("
                      style={{
                        position: "absolute",
                        left: x + 10,
                        top: EVAL_LABEL.y,
                        transform: "translate(-100%, -50%)",
                        ...typeStyle("label"),
                        fontSize: 26,
                        fontWeight: 600,
                        color: c.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      13 Nov 2026 (
                      <span style={{ color: c.indigo }}>
                        {num(BBCA_MARKS.eval.close)}
                      </span>
                      )
                    </Interactive.Div>
                  </div>
                );
              })()}
              {loss > 0.001 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: px(I_HIGH) + 150,
                    top: py(BBCA_MARKS.high.close) - 36,
                    transform: "translateY(-50%)",
                    opacity: loss,
                    ...typeStyle("title"),
                    fontSize: 44,
                    fontWeight: 700,
                    color: theme.color.crossRed,
                    whiteSpace: "nowrap",
                  }}
                >
                  −{Math.abs(BBCA_RESULT.high)}%
                </Interactive.Div>
              ) : null}
              {gain > 0.001 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: px(I_LOW) - 24 - LOW_LABEL_W - 18,
                    top: py(BBCA_MARKS.low.close),
                    transform: "translate(-100%, -50%)",
                    opacity: gain,
                    ...typeStyle("title"),
                    fontSize: 44,
                    fontWeight: 700,
                    color: theme.color.ok,
                    whiteSpace: "nowrap",
                  }}
                >
                  +{BBCA_RESULT.low}%
                </Interactive.Div>
              ) : null}
              {/* B: the news */}
              {newsIn > 0.001 ? (
                <Card
                  x={NEWS.x}
                  y={NEWS.y + (1 - newsIn) * 12}
                  w={NEWS.w}
                  h={NEWS.h}
                  style={{ opacity: newsIn }}
                >
                  <Interactive.Div
                    name="Foreign outflow"
                    style={{
                      position: "absolute",
                      left: NEWS.pad,
                      top: NEWS.rows[0],
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Glyph icon="newspaper" size={30} tone={c.indigo} />
                    <div
                      style={{
                        ...typeStyle("label"),
                        fontSize: 26,
                        fontWeight: 600,
                        color: c.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Foreign outflow
                    </div>
                  </Interactive.Div>
                  <Interactive.Div
                    name="Net sell ±Rp31 T"
                    style={{
                      position: "absolute",
                      left: NEWS.pad,
                      top: NEWS.rows[1],
                      transform: "translateY(-50%)",
                      ...typeStyle("title"),
                      fontSize: 34,
                      fontWeight: 700,
                      color: c.indigo,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Net sell ±Rp31 T
                  </Interactive.Div>
                  <Interactive.Div
                    name="Jan–Jun 2026"
                    style={{
                      position: "absolute",
                      left: NEWS.pad,
                      top: NEWS.rows[2],
                      transform: "translateY(-50%)",
                      ...typeStyle("label"),
                      fontSize: 20,
                      fontWeight: 500,
                      color: c.slate,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Jan–Jun 2026
                  </Interactive.Div>
                </Card>
              ) : null}
            </div>
          ) : null}

          {/* B–D: Tuntun's own BBCA card; C boxes Company Quality, then Reference Fair Value */}
          {shotIn > 0.001 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: shotIn,
                transform: `translateY(${((1 - shotIn) * 16).toFixed(1)}px)`,
              }}
            >
              <Interactive.Div
                name="Objek"
                style={{
                  position: "absolute",
                  left: SHOT_X,
                  top: SHOT.y,
                  width: SHOT.w,
                  height: SHOT.h0 * SHOT_K,
                  borderRadius: SHOT.radius * SHOT_K,
                  overflow: "hidden",
                  boxShadow: shadow.soft,
                }}
              >
                <Pic
                  src={staticFile(SHOT.src)}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: SHOT.w,
                    height: SHOT.h0 * SHOT_K,
                  }}
                />
              </Interactive.Div>
              <svg
                width={theme.canvas.width}
                height={theme.canvas.height}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                {SHOT_BOX.map((b) => {
                  const p = ease(f, W(b.at), m.reveal);
                  return (
                    <HighlightBox
                      key={b.at}
                      rect={{
                        x1: SHOT_X + b.x1 * SHOT_K,
                        y1: SHOT.y + b.y1 * SHOT_K,
                        x2: SHOT_X + b.x2 * SHOT_K,
                        y2: SHOT.y + b.y2 * SHOT_K,
                      }}
                      grow={p}
                      opacity={p}
                      fill="none"
                      width={4}
                      radius={16}
                    />
                  );
                })}
              </svg>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* E — the lesson */}
      {f >= cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {}),
          }}
        >
          <Interactive.Div
            name="Objek"
            style={{
              position: "absolute",
              left: MID_X,
              top: KEY.cy,
              transform: `translate(-50%, calc(-50% + ${((1 - keyIn) * 14).toFixed(1)}px))`,
              opacity: keyIn,
              ...typeStyle("title"),
              fontSize: KEY.size,
              fontWeight: 700,
              lineHeight: 1.1,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            {KEY.text}
          </Interactive.Div>
          <Interactive.Div
            name="Objek"
            style={{
              position: "absolute",
              left: MID_X,
              top: SUB.cy,
              transform: "translate(-50%, -50%)",
              opacity: subIn,
              ...typeStyle("title"),
              fontSize: SUB.size,
              fontWeight: 600,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            {SUB.text}
          </Interactive.Div>
          {ROOMS.map((r, i) => {
            const p = ease(f, W(r.at), m.reveal);
            if (p <= 0.001) return null;
            const x =
              MID_X - (2 * ROOM.w + ROOM.gap) / 2 + i * (ROOM.w + ROOM.gap);
            return (
              <Card
                key={r.text}
                x={x}
                y={ROOM.y + (1 - p) * 14}
                w={ROOM.w}
                h={ROOM.h}
                style={{ opacity: p }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 32,
                    top: (ROOM.h - ROOM.disc) / 2,
                    width: ROOM.disc,
                    height: ROOM.disc,
                    borderRadius: 999,
                    background: theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph
                    icon={r.icon}
                    size={ROOM.disc * 0.56}
                    tone={c.indigo}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 32 + ROOM.disc + 28,
                    top: ROOM.h / 2,
                    transform: "translateY(-50%)",
                    ...typeStyle("title"),
                    fontSize: ROOM.size,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.text}
                </div>
              </Card>
            );
          })}
          {lastIn > 0.001 ? (
            <Interactive.Div
              name="Objek"
              style={{
                position: "absolute",
                left: MID_X,
                top: LAST.cy,
                transform: `translate(-50%, calc(-50% + ${((1 - lastIn) * 12).toFixed(1)}px))`,
                opacity: lastIn,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: LINE.size,
                  fontWeight: 700,
                  color: c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                {LAST.text}
              </div>
            </Interactive.Div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
};
