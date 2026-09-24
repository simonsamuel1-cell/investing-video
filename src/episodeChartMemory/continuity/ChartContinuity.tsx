/**
 * ChartContinuity — the ONE spanning chart element for SC02 → SC05
 * (global frames 791–3612, continuity-local 0–2821). The chart NEVER remounts:
 * a single geometry + mode timeline drives it through four phases, and each
 * phase's overlays live in scenes/Scene02–Scene05 which receive that geometry.
 *
 *   Phase A (local 0–608)     SC02  price cards → chili line chart
 *   Phase B (local 608–1190)  SC03  chili line morphs into the BMRI closes line
 *   Phase C (local 1190–2299) SC04  line mask-wipes into candlesticks + anatomy
 *   Phase D (local 2299–2821) SC05  candles de-emphasize; axes + crosshair
 */
import { useCurrentFrame, interpolate, Sequence } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { SLIDES, slideOut, slideBlur } from "../transitions/SlideCut";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { LineChart } from "../components/LineChart";
import { theme } from "../theme";
import { progress, progressInOut, velocityBlur, fmtPrice, type Box } from "../helpers";
import type { OHLC } from "../data/bmri";
import { SAHAM_PRICED, FRAME_ALL } from "../data/sahamReference";
import { chiliMonthly } from "../data/chili";
import { Scene02, PAIR_INNER, PAIR_DX, twinOpacity } from "../scenes/Scene02";
import { Scene03 } from "../scenes/Scene03";
import { Scene04 } from "../scenes/Scene04";
import { Scene05 } from "../scenes/Scene05";
import { usePalette } from "../palette";
import { SahamChart, sahamGeomAt, type SahamGeom } from "./SahamChart";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * ⚠ PHASE D AND THE GROUP'S END MOVED +302 when the second passage was cut in
 * at global 2486 — exactly where D began. Phase C therefore holds for 302
 * frames while the new line is spoken, and the camera's pull-out (1957–1997)
 * finishes on the very frame of the cut rather than being caught mid-move.
 */
export const PHASE = { a: 0, b: 608, c: 1190, d: 2299, end: 2821 };
const BOX_FULL: Box = { x: 260, y: 250, w: 1400, h: 540 };
/**
 * ⚠ THE PAPER THE CHILI CHART SITS ON, and the rectangle the fold is measured
 * from. It has to clear the month labels at box.y + box.h + 18 or the fold
 * would carry the chart away and leave its own axis behind at full size.
 *
 * ⚠ IT HOLDS THE THREE PRICE CARDS TOO, which is what the first cut got wrong.
 * At settle the outer cards are centred on the first and last month — x 260
 * and x 1660 — and each is 450 × 0.55 = 248 wide, so they reach 136 and 1784.
 * A 200-wide margin cut both of them in half against the grey: Simon, at 1122,
 * "Sesuaikan ukuran background putihnya biar semuanya muat di dalam dong."
 * The paper now runs the full safe width, 96 → 1824, which leaves 40px of
 * white outside each card.
 *
 * ⚠ THEN 30 MORE EACH WAY — "Tambah lagi heightnya 30 px ke atas dan 30 px ke
 * bawah": 670 + 60 = 730, starting 30 higher at 170. Top clears the 150px
 * logo zone; the lowest edge is 900, clear of the 972 caption band.
 */
const PAPER = { x: 96, y: 170, w: 1728, h: 730 };
const BOX_NARROW_W = 900; // while the SC04 anatomy card occupies the right third
// Where the camera pushes in to, and how many sessions it lands on.
const BOX_DETAIL: Box = { x: 500, y: 330, w: 920, h: 400 };
const N_DETAIL = 12;
const CAMERA_BLUR = 7; // px at the camera's fastest frame
// Continuity-local frames, all VO-derived (see each scene's T block).
const K = {
  morph: 608, // chili → BMRI (SC03 phase start)
  morphDur: 90,
  /**
   * ⚠ SC04 IS PLAYED ON THE SAHAM CANDLES — Simon: "dari 1981 gunakan
   * candlesticks yang sama; lalu dari 2073, muncul line chart yang
   * menghubungkan candlesticks nya, sedangkan existing candlesticknya jadi
   * transparan 20% … 2224 candlesticknya jadi transparansi 0%. 2295
   * candlesticknya muncul satu per satu."
   */
  axesIn: 20, // the price and date rails fade up over the unchanged candles
  lineIn: 1282, // global 2073 — the line through the closes draws in…
  lineInDur: 40,
  candlesFade: 20, // …while the candles step down to CANDLES_DIM
  candlesOut: 1433, // global 2224 — and out altogether, leaving only the line
  narrow: 1530, // chart narrows for the anatomy card
  wipe: 1503, // "Candlestick memberi gambaran lebih lengkap"
  wipeDur: 60,
  widen: 1836, // global 2325 — the anatomy card has cleared; chart returns to the full width it had at global 1997
  widenDur: 30, // …and settles by global 2355, clear of the camera move below
  // ── CUT ON ACTION (global 2355 → 2415) ──────────────────────────────────
  // ONE ease-in-out camera move carries the chart from full frame into the
  // detail framing. Halfway through — at K.cut, the frame where the move is
  // FASTEST — the content swaps hard from 70 sessions to 12. The motion never
  // breaks across that frame, so the swap reads as continuous, not as a cut.
  push: 1866, // global 2355 — camera starts moving
  pushDur: 60, // global 2415 — camera rests
  cut: 1896, // global 2385 — exact midpoint = peak velocity
  pull: 1957, // global 2446 — camera backs out again…
  pullDur: 40, // …landing on full frame exactly at phase D
  dimCandles: 2299, // SC05 f0 — moved with PHASE.d
  axisDraw: 273, // "Susun angka itu berdasarkan waktu"
  // SC02 sets the chili shape beside a busier one; the full-size line and its
  // month axis step aside while those comparison cards hold the stage.
  /**
   * ⚠ 405 MATCHES Scene02's T.pairA — they are one beat seen from two files,
   * and they were 39 frames apart after the fold moved to Simon's 1196. The
   * cards are opaque, so the mismatch hid behind them instead of showing.
   */
  pairIn: 405,
  /** ⚠ GLOBAL 1065 — the paper the chili chart is drawn on fades up. */
  paper: 274,
  pairOut: 578,
  // The gridlines and baseline clear before global 3007 too, so the ONLY thing
  // left at the boundary is the dimmed candle series — the element SC06 picks
  // up and carries on with.
  exit: 2780, // was 2478; rides PHASE.end
  exitDur: 40,
};
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE CHART'S SERIES IS THE SAHAM TRACE, priced — see SAHAM_PRICED. It was
 * the BMRI placeholder, which meant a different chart appeared at 1981 the
 * moment SC03's saham chart handed over. Drawn in the same box with the same
 * framing (FRAME_ALL), the candles land on SahamChart's pixels exactly, so the
 * handover is invisible.
 */
const SERIES = SAHAM_PRICED;
const WINDOW: [number, number] = [0, SERIES.length - 1];
/** Opacity the candles step down to while the line is shown alone. */
const CANDLES_DIM = 0.2;
/** The last N_DETAIL sessions — what the camera lands on after the cut. */
const WINDOW_DETAIL: [number, number] = [WINDOW[1] - N_DETAIL + 1, WINDOW[1]];

export type ContGeom = {
  box: Box;
  win: [number, number];
  cx: (globalIdx: number) => number;
  scale: (price: number) => number;
  /** The series the chart is drawing — the scenes index into this. */
  series: OHLC[];
  xs: number[];
  bmriY: number[];
  chiliY: number[];
  chiliScaleY: (price: number) => number;
  /** 0 = wide view, 1 = pushed into the detail framing. */
  camera: number;
  /** ⚠ THE PHASE-A OVERLAY MUST WEAR THIS TOO. Scene02's dots belong to the
   *  chili chart, and a chart that folds while its own points stay put is two
   *  pictures, not one. */
  foldStyle: React.CSSProperties;
  /** ⚠ AND THE SCALE ITSELF, because a stroke does not want to be scaled.
   *  At 0.382 a 2px rule renders as three quarters of a pixel and the line
   *  joining the three points simply vanished inside the card. */
  foldScale: number;
  /** The fold again, offset into the RIGHT comparison card — see PAIR_DX. */
  twinStyle: React.CSSProperties;
  /** 0 while there is no twin; anything above 0 means draw the duplicate. */
  twinOp: number;
  /** Opacity of the folded chili chart — it fades out with its window. */
  foldOp: number;
  /** The saham chart SC03 is read off — see SahamChart. */
  saham: SahamGeom;
};

/** Chili price at normalized position t (0–1) across the monthly series. */
const chiliAt = (t: number) => {
  const x = t * (chiliMonthly.length - 1);
  const i = Math.min(chiliMonthly.length - 2, Math.floor(x));
  const q = x - i;
  return chiliMonthly[i].price + (chiliMonthly[i + 1].price - chiliMonthly[i].price) * q;
};

export const ChartContinuity = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  // ── the outgoing half of the SlideCut at 3612 ──
  // This group is mounted from global 791, so add that back to read the shared
  // curve. The pan starts at 3600 and the cut lands on this group's last frame
  // + 1, which is SC06's first.
  const gf = f + 791;
  const dx = slideOut(gf, SLIDES.toImages);
  const slideFx = slideBlur(gf, SLIDES.toImages);

  // ── geometry (recomputed each frame; the ELEMENT never remounts) ──
  const narrow = f >= K.narrow ? progress(f, K.narrow, 60) : 0;
  const widen = f >= K.widen ? progress(f, K.widen, K.widenDur) : 0;
  const boxW = interpolate(narrow - widen, [0, 1], [BOX_FULL.w, BOX_NARROW_W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const baseBox: Box = { ...BOX_FULL, w: boxW };

  // ── the camera: ONE eased move in, then back out ──
  const pushIn = f >= K.push ? progressInOut(f, K.push, K.pushDur) : 0;
  const pullOut = f >= K.pull ? progressInOut(f, K.pull, K.pullDur) : 0;
  const camera = Math.max(0, pushIn - pullOut);
  // Motion blur tied to the camera's own speed: nothing at rest, most at the
  // cut frame. Only this move and SC10's zoom-out get it, so it stays special.
  const cameraAt = (x: number) =>
    (x >= K.push ? progressInOut(x, K.push, K.pushDur) : 0) - (x >= K.pull ? progressInOut(x, K.pull, K.pullDur) : 0);
  const blurPx = velocityBlur(cameraAt, f, K.push, K.pull + K.pullDur - K.push, CAMERA_BLUR);
  const lerp = (from: number, to: number) => from + (to - from) * camera;
  const box: Box = {
    x: lerp(baseBox.x, BOX_DETAIL.x),
    y: lerp(baseBox.y, BOX_DETAIL.y),
    w: lerp(baseBox.w, BOX_DETAIL.w),
    h: lerp(baseBox.h, BOX_DETAIL.h),
  };

  // The CUT: one frame, 70 sessions → 12. No interpolation — that is the point.
  // On the way back out the window widens continuously (fractional bounds), so
  // the return is a move, not a second cut.
  const win: [number, number] =
    f < K.cut ? WINDOW : [interpolate(pullOut, [0, 1], [WINDOW_DETAIL[0], WINDOW[0]]), WINDOW[1]];

  const g = chartGeom(SERIES, win, box);
  /** Framed the way SahamChart frames the same candles — see FRAME_ALL. */
  const scale = (p: number) =>
    box.y + box.h * (FRAME_ALL.top + (1 - FRAME_ALL.top - FRAME_ALL.bottom) * ((g.max - p) / (g.max - g.min)));
  const [a, b] = WINDOW;
  const n = b - a + 1;

  const xs: number[] = [];
  const bmriY: number[] = [];
  for (let k = 0; k < n; k++) {
    xs.push(g.cx(a + k));
    bmriY.push(scale(SERIES[a + k].c));
  }
  // chili silhouette resampled onto the same x positions
  const chiliLo = Math.min(...chiliMonthly.map((c) => c.price));
  const chiliHi = Math.max(...chiliMonthly.map((c) => c.price));
  const chiliScaleY = (p: number) =>
    interpolate(p, [chiliLo - (chiliHi - chiliLo) * 0.12, chiliHi + (chiliHi - chiliLo) * 0.12], [box.y + box.h, box.y], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const chiliY: number[] = [];
  for (let k = 0; k < n; k++) chiliY.push(chiliScaleY(chiliAt(k / (n - 1))));

  /**
   * ⚠ THE CHILI CHART FOLDS INTO THE LEFT COMPARISON CARD; it does not fade
   * out behind it. Simon: "Yang mengecil semua chart termasuk background
   * putihnya ya." What used to be here was `pairMask`, an opacity that took
   * the line and the month axis away over 34 frames while two cards faded up
   * on top of them — so the comparison arrived as a new screen rather than as
   * the thing you were already looking at, made small.
   *
   * ⚠ IT UNFOLDS AGAIN AT pairOut, and it has to: SC03 morphs this same line
   * into the BMRI series at full size. The curve is the same shape pairMask
   * had — in, hold, out — read as a scale instead of an opacity.
   */
  /**
   * ⚠ IT NO LONGER UNFOLDS. Simon, at 1370: "Saat ini window kiri yang
   * membesar, ubah jadi window kanan yang membesar." The chili chart stays
   * folded in the left window and fades out with it (foldOp); the RIGHT
   * window grows instead — see SahamChart. The whole group then waits,
   * invisible, and comes back at full size on PHASE.c, where SC04 needs the
   * BMRI chart it carries. The snap from folded to full happens while the
   * group is at zero opacity, so nobody sees it.
   */
  const chiliFold =
    f >= PHASE.c
      ? 0
      : interpolate(f, [K.pairIn, K.pairIn + 34], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.motion.easeInOut,
        });
  const foldOp = f < K.pairOut || f >= PHASE.c ? 1 : 1 - progress(f, K.pairOut, 26);
  /**
   * ⚠ ONE UNIFORM SCALE, fitted to whichever of the card's sides runs out
   * first. A separate x and y factor would land the chart at the card's exact
   * proportions and squash the shape the whole scene is about.
   */
  const foldScale = (() => {
    const dst = PAIR_INNER(0);
    return 1 + (Math.min(dst.w / PAPER.w, dst.h / PAPER.h) - 1) * chiliFold;
  })();
  /**
   * ⚠ ONE TRANSFORM, TWO DESTINATIONS. `translate(T) scale(s)` about an origin
   * O maps p to O + T + s·(p − O), so adding PAIR_DX to T alone moves the whole
   * folded picture exactly PAIR_DX screen pixels right — the scale is untouched
   * and the twin cannot drift from the original by construction.
   */
  const [foldStyle, twinStyle] = (() => {
    const dst = PAIR_INNER(0);
    const cx = PAPER.x + PAPER.w / 2;
    const cy = PAPER.y + PAPER.h / 2;
    const tx = (dst.x + dst.w / 2 - cx) * chiliFold;
    const ty = (dst.y + dst.h / 2 - cy) * chiliFold;
    const at = (shift: number) => ({
      transform: `translate(${(tx + shift).toFixed(1)}px, ${ty.toFixed(1)}px) scale(${foldScale.toFixed(4)})`,
      transformOrigin: `${cx}px ${cy}px`,
    });
    return [at(0), at(PAIR_DX)];
  })();
  const twinOp = twinOpacity(f);
  /**
   * ⚠ LIFTED FOR THE WHOLE FOLD, FROM ITS FIRST FRAME. This used to key off
   * `chiliFold > 0.001`, and the fold's ease-in-out stays under that for the
   * first frame or two — while the comparison cards had already begun to fade
   * in. For those frames the cards' "Cabai" and "Saham" labels were painted
   * OVER the full-size paper and then vanished under it: Simon, at 1197, "Ada
   * 'cabai', 'saham', 'chart' yang munculnya cuma bentar." Keyed off the
   * frame, the paper covers them from the start and uncovers them as it goes.
   */
  const foldLift = f >= K.pairIn && f <= K.pairOut + 26;
  const saham = sahamGeomAt(f, PAPER, BOX_FULL, PHASE.c);
  const geom: ContGeom = {
    box,
    win,
    cx: g.cx,
    scale,
    series: SERIES,
    xs,
    bmriY,
    chiliY,
    chiliScaleY,
    camera,
    foldStyle,
    foldScale,
    twinStyle,
    twinOp,
    foldOp,
    saham,
  };

  // ── chart mode timeline ──
  const morphT = f >= K.morph ? progress(f, K.morph, K.morphDur) : 0;
  const lineDraw = f >= K.lineIn ? progressInOut(f, K.lineIn, K.lineInDur) : 0;
  /** The candles before the wipe: full, then 20% under the line, then gone. */
  const preWipeOp =
    f < K.lineIn
      ? 1
      : f < K.candlesOut
        ? 1 - (1 - CANDLES_DIM) * progress(f, K.lineIn, K.candlesFade)
        : CANDLES_DIM * (1 - progress(f, K.candlesOut, K.candlesFade));
  const wipe = f >= K.wipe ? progress(f, K.wipe, K.wipeDur) : 0;
  const candleDim = f >= K.dimCandles ? interpolate(progress(f, K.dimCandles, 45), [0, 1], [1, 0.3]) : 1;

  const linePts = xs.map((x, k) => ({ x, y: chiliY[k] + (bmriY[k] - chiliY[k]) * morphT }));
  /* ⚠ THE LINE NO LONGER DIMS AT 2219. It stepped down to 55% on "tetapi
     banyak cerita" when the line was drawn over nothing; now the candles
     leave at 2224 and the line is the whole chart, so it stays at full. */
  const lineDimRaw = 1;
  const paperOp = f >= K.paper ? progress(f, K.paper, 30) : 0;
  const lineDim = lineDimRaw;
  const wipeX = box.x + box.w * wipe;

  // ── axis furniture: months (chili) crossfading into dates + prices (BMRI) ──
  const axisDraw = f >= K.axisDraw ? progress(f, K.axisDraw, 50) : 0;
  const chiliAxisOp = f < K.morph ? 1 : 1 - progress(f, K.morph, 60);
  const bmriAxisOp = f >= K.morph ? progress(f, K.morph, 60) : 0;
  // SC05 re-populates both rails one tick at a time, so continuity's own tick
  // labels step aside at phase D to avoid a doubled axis.
  // The rails belong to the wide view — they clear out early in the move rather
  // than lingering at half opacity underneath the detail card.
  /**
   * ⚠ THE AXES ARRIVE AT THE HANDOVER, over candles that do not move. SC03's
   * saham chart carries no price or date labels (see SahamChart); from
   * PHASE.c this group draws the same candles with its axes, which fade up.
   */
  const handIn = f >= PHASE.c ? progress(f, PHASE.c, K.axesIn) : 1;
  const axisOp = handIn * Math.max(0, 1 - camera * 3) * (f >= K.exit ? 1 - progress(f, K.exit, K.exitDur) : 1);
  const tickLabelOp = bmriAxisOp * axisOp * (f >= PHASE.d ? 1 - progress(f, PHASE.d, 24) : 1);
  const tickPrices = Array.from({ length: 4 }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / 4);
  const dateIdx = [a, a + Math.floor(n * 0.33), a + Math.floor(n * 0.66), b];

  return (
    <SafeArea>
      <div style={{ transform: `translateX(${dx}px)`, filter: slideFx > 0.05 ? `blur(${slideFx}px)` : undefined }}>
      {/* ⚠ ABOVE THE COMPARISON CARDS WHILE IT FOLDS, and only while it
          folds. Scene02 draws those cards after this whole group, and they
          are opaque — the chart folded correctly into the left one and was
          then painted over by it, which looked exactly like the fold failing.
          Lifted only during the fold so nothing changes for SC03 and SC04. */}
      {/* ⚠ RENDERED ONCE PER COMPARISON WINDOW. The second copy is not a
          second chart: it is this same subtree wearing twinStyle, which is
          foldStyle plus one horizontal offset. "Duplikat persis" is then a
          property of the code rather than something to keep in sync by eye. */}
      {([
        { style: foldStyle, op: foldOp },
        { style: twinStyle, op: twinOp },
      ] as const).map(({ style, op }, copy) =>
        op <= 0.001 ? null : (
      <div
        key={copy}
        style={{
          position: "absolute",
          inset: 0,
          opacity: op,
          ...style,
          zIndex: foldLift ? 3 : undefined,
        }}
      >
      {/* ⚠ THE PAPER IS THE FIRST THING IN THE FOLD GROUP, so the month labels
          and the line are drawn ON it rather than beside it — and so all three
          are carried into the card by one transform. */}
      {paperOp > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: PAPER.x,
            top: PAPER.y,
            width: PAPER.w,
            height: PAPER.h,
            borderRadius: theme.radius.cardLg,
            background: pal.cardBg,
            border: `${theme.stroke.hair}px solid ${pal.border}`,
            opacity: paperOp,
          }}
        />
      )}
      {/* ── axis furniture ── */}
      {axisDraw > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={box.x}
            y1={box.y + box.h}
            x2={box.x + box.w * axisDraw}
            y2={box.y + box.h}
            stroke={pal.border}
            strokeWidth={theme.stroke.rule}
            opacity={axisOp}
          />
          {bmriAxisOp > 0.001 &&
            tickPrices.map((p) => (
              <g key={p} opacity={bmriAxisOp * axisOp}>
                <line x1={box.x} y1={scale(p)} x2={box.x + box.w} y2={scale(p)} stroke={pal.border} strokeWidth={theme.stroke.hair} />
                <text
                  x={box.x + box.w + 16}
                  y={scale(p) + 8}
                  fontFamily={theme.type.family}
                  fontSize={theme.type.axis.size}
                  fontWeight={theme.type.axis.weight}
                  fill={pal.slate}
                  opacity={tickLabelOp}
                >
                  {fmtPrice(p)}
                </text>
              </g>
            ))}
        </svg>
      )}
      {/* month ticks (chili) */}
      {chiliAxisOp > 0.001 &&
        chiliMonthly.map((c, i) => (
          <div
            key={c.month}
            style={{
              position: "absolute",
              left: box.x + (box.w * i) / (chiliMonthly.length - 1),
              top: box.y + box.h + 18,
              transform: "translateX(-50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: pal.slate,
              opacity: chiliAxisOp * axisDraw,
            }}
          >
            {c.month}
          </div>
        ))}
      {/* date ticks (BMRI) */}
      {bmriAxisOp > 0.001 &&
        dateIdx.map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.cx(i),
              top: box.y + box.h + 18,
              transform: "translateX(-50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: pal.slate,
              opacity: tickLabelOp,
              whiteSpace: "nowrap",
            }}
          >
            {SERIES[i].date.slice(5).replace("-", "/")}
          </div>
        ))}

      {/* The chart and its card share one blur, so they smear together. */}
      <div style={{ filter: blurPx > 0.05 ? `blur(${blurPx}px)` : undefined }}>
      {/* The detail card belongs to the AFTER side of the cut, so it appears on
          the cut frame — no fade. It rides the same moving box as the chart. */}
      {f >= K.cut && (
        <div
          style={{
            position: "absolute",
            left: box.x - 40,
            top: box.y - 56,
            width: box.w + 80,
            height: box.h + 112,
            borderRadius: theme.radius.cardLg,
            background: pal.cardBg,
            border: `${theme.stroke.hair}px solid ${pal.border}`,
            boxShadow: theme.shadow.lift,
            opacity: 1 - pullOut,
          }}
        />
      )}

      {/* ── THE chart element — one line/candle surface across all four phases ── */}
      {/* ⚠ THE LINE WAS NEVER ON SCREEN — its clip box was ZERO PIXELS TALL.
          `inset: 0` sizes a box from its containing block, and the nearest one
          here is the SlideCut wrapper: a transformed div whose children are
          all absolute, so it has no height. clip-path clips to the box it is
          given, so the whole line was clipped away and SC04's "Line chart
          menghubungkan harga penutupan" showed only a string of dots — Simon,
          at 2009: "langsung keluarin line chartnya". The clip box is now the
          canvas, stated outright.

          ⚠ AND IT IS SHOWN FROM SC04 ONLY. Before PHASE.c this element has
          only ever been invisible, and SC02/SC03 were approved that way — the
          chili line and the saham chart carry those scenes. */}
      {f >= PHASE.c && lineDraw > 0.001 && wipe < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            clipPath: `inset(0px 0px 0px ${Math.max(0, wipeX)}px)`,
          }}
        >
          <LineChart points={linePts} progress={lineDraw} color={pal.indigo} opacity={lineDim} />
        </div>
      )}
      {/* ⚠ THE CANDLES ARE ON SCREEN FROM 1981, not only from the wipe:
          full, then 20% while the line draws, then gone at 2224 — and back
          one by one on the wipe (2294), which is where they used to begin. */}
      {f >= PHASE.c && (f >= K.wipe ? wipe > 0.001 : preWipeOp > 0.001) && (
        <CandlestickChart
          data={SERIES}
          window={win}
          box={box}
          scaleOverride={scale}
          showAxes={false}
          revealProgress={f >= K.wipe ? wipe : 1}
          dimOpacity={f >= K.wipe ? candleDim : preWipeOp}
        />
      )}
      </div>
      </div>
        ),
      )}

      {/* ── the saham chart: the right window, grown (1369 → handover) ──
          Drawn after the continuity group so it covers it, and before the
          phase overlays so SC03's marks sit on top of it. */}
      <SahamChart paper={PAPER} full={BOX_FULL} handover={PHASE.c} />

      {/* ── per-phase overlays ──
          Each phase is wrapped in its own Sequence purely so its children read
          SCENE-LOCAL frames. The chart element above stays outside them, so it
          still never remounts across the four phases. */}
      <Sequence from={PHASE.a} durationInFrames={PHASE.b - PHASE.a} layout="none">
        <Scene02 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.b} durationInFrames={PHASE.c - PHASE.b} layout="none">
        <Scene03 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.c} durationInFrames={PHASE.d - PHASE.c} layout="none">
        <Scene04 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.d} durationInFrames={PHASE.end - PHASE.d} layout="none">
        <Scene05 geom={geom} />
      </Sequence>
      </div>
        </SafeArea>
  );
};
