/**
 * SC02 — Chili Prices Become a Chart (ChartContinuity Phase A, local 0–608).
 * The opening line reframes the viewer, three price cards pop, shrink onto the
 * baseline and collapse into dots (the connecting line itself lives in
 * ChartContinuity), then the same shape is set beside a busier stock line.
 * The three figures are from the VO and are final.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { PriceCard } from "../components/PriceCard";
import { Chip } from "../components/Chip";
import { CandlestickChart } from "../components/CandlestickChart";
import { theme } from "../theme";
import { progress, progressInOut, fadeOut, textReveal, countTo, fmtRp } from "../helpers";
import { chiliMonthly, CHILI_SPOKEN } from "../data/chili";
import { SAHAM_CANDLES, SAHAM_CLOSE, FRAME_CLOSE, rangeOf, sahamScale } from "../data/sahamReference";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";
import { DashedFrame, dashOpenAt } from "../components/DashedFrame";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  opener: 0, // "Padahal, kamu sudah membaca chart"
  openerOut: 81, // global 872 — the line clears outright; it does NOT retreat to a header
  header: 90, // "Coba lihat harga cabai"
  c1: 141, // "40.000 per kilogram"
  c2: 196, // "turun ke 20.000"
  c3: 238, // "lalu naik lagi"
  settle: 273, // "Susun angka itu berdasarkan waktu"
  dots: 337, // "dan hubungkan titiknya"
  /**
   * ⚠ THE THREE SPOKEN FIGURES ARE JOINED, and the join is the line the voice
   * is describing. It lands on local 395 — global 1186, Simon's frame — which
   * is two frames before the "Chart" chip at T.glow + 10, so the label arrives
   * on a chart that already exists rather than on three loose points.
   */
  linkDur: 58,
  glow: 393, // "Jadilah sebuah chart"
  /**
   * ⚠ 405 IS GLOBAL 1196, and it now does two jobs at once: the preview folds
   * into the LEFT window and "Harga Cabai" leaves. It used to be 444 — the
   * windows simply faded up over a preview that faded down, with nothing
   * travelling between them.
   */
  pairA: 405, // global 1196 — "Chart saham sama saja"; the shape folds into the window
  /** ⚠ GLOBAL 1235 — Simon's frame for "Muncul chart di window kanan". */
  pairB: 444,
  crowd: 527, // "hanya lebih cepat dan melibatkan lebih banyak orang"
  /** ⚠ GLOBAL 1308 — the right window stops being a copy and becomes candles. */
  candles: 517,
  /**
   * ⚠ AND IT TAKES ITS TIME GETTING THERE. Simon: "Candlestick mulai muncul
   * satu satu di sini, take your time aja, ga usa animasi cepet." The reveal
   * used to ride the same 20-frame curve as the crossfade, which walked twenty
   * candles past the eye in two thirds of a second. 52 frames lands on 568 —
   * ten clear of pairOut — and the crossfade stays short, so no frame holds
   * neither picture.
   */
  candleDur: 22, // → global 1330, Simon's "1308-1330"
  pairOut: 578, // global 1369 — the left window fades; the right one grows (SahamChart)
};
// The three figures sit in one row, 10px apart. A uniform card width is what
// makes that gap exact — natural widths differ per figure, so the pitch is
// CARD_W + 10 and every card is centred inside its own box.
/** Frames "Harga Cabai" takes to fade as the chart folds away. */
const TITLE_OUT = 20;
const CARD_W = 450;
const CARD_GAP = 10;
const CARD_COUNT = 16; // frames the figure spends counting up to its price
const CARD_CY = 430;
/**
 * ⚠ THE DOT IS 26px ACROSS, NOT 16. Simon asked for ten more pixels of
 * diameter, which is five more of radius — at card size these are the whole
 * chart, and 8 read as specks.
 */
const DOT_R = 13;
/** The opening line's frame. Fixed, because a dash pattern that restarts
 *  whenever the text changes is a coincidence rather than a style. */
const OPENER_BOX = { x: 220, y: 520, w: 1480, h: 116 };
const OPENER_TEXT = "Sebetulnya, kamu sudah membaca chart sepanjang hidupmu";
/**
 * ⚠ IT FADES AND RISES; IT DOES NOT TYPE. Simon: "Textnya gajadi animasi
 * ketikan, jadi entrance fade in aja, geser masuk dari bawah." The typewriter
 * was reflowing the line inside a box that had only just snapped open, and two
 * mechanisms arriving on the same beat read as one of them stuttering.
 */
const OPENER_IN = 26;
const OPENER_RISE = 26;
const CARD_START = [0, 1, 2].map((i) => ({ cx: theme.canvas.width / 2 + (i - 1) * (CARD_W + CARD_GAP), cy: CARD_CY }));
const SPOKEN = [
  { idx: CHILI_SPOKEN.high, start: T.c1, rise: false },
  { idx: CHILI_SPOKEN.low, start: T.c2, rise: false },
  { idx: CHILI_SPOKEN.back, start: T.c3, rise: true },
];
/**
 * ⚠ THE TWO WINDOWS RUN THE FULL WIDTH OF THE SAFE AREA. Simon: "Ini terlalu
 * kecil, lebarin deh, mentokin aja ke batas margin kiri kanan. Jarak antar
 * kedua window juga tambah 50 px." 96 → 1824 is the margin, the gap goes
 * 24 → 74, and what is left splits in two: (1728 − 74) / 2 = 827.
 *
 * ⚠ AND THE HEIGHT FOLLOWS, or widening would have made the picture SMALLER.
 * The left window is filled by the chili chart folded into it, and that fold
 * takes whichever of the card's two sides runs out first. Against the 1728×730
 * paper, a 787-wide inner box needs 332 of height to stay the binding side —
 * PAIR.h = 332 + 96. Keep the two numbers in step or the fold silently caps on
 * height and the "wider" window just grows white margins.
 */
const PAIR = { y: 316, w: 827, h: 428, gap: 74 };
const PAIR_X = (i: number) => (theme.canvas.width - (PAIR.w * 2 + PAIR.gap)) / 2 + i * (PAIR.w + PAIR.gap);
/**
 * ⚠ WHERE THE BIG CHART LANDS — the card's whole inside, not its plot area.
 * Fitting the 1520x670 sheet into MINI's 572x190 gave a scale of 0.284 and a
 * chart you could not read; the card minus its label strip takes 0.382, which
 * is the difference between a thumbnail and a picture.
 */
export const PAIR_INNER = (i: number) => ({
  x: PAIR_X(i) + 20,
  y: PAIR.y + 74,
  w: PAIR.w - 40,
  h: PAIR.h - 96,
});
export const MINI = (i: number) => ({ x: PAIR_X(i) + 34, y: PAIR.y + 92, w: PAIR.w - 68, h: PAIR.h - 150 });
/**
 * ⚠ THE RIGHT WINDOW IS THE LEFT WINDOW, TO THE PIXEL. Simon: "1235 Muncul
 * chart di window kanan. Chartnya duplikat persis dari window kiri." The first
 * cut drew a SECOND chart there — the twelve-month chili curve in the right
 * card's own box — which shared the data but not the shape, the weight, the
 * dots or the month rail, so the two windows plainly showed two pictures on
 * the line "Chart saham sama saja".
 *
 * The two cards are identical and sit PAIR_DX apart, so the duplicate is the
 * fold's own transform plus one horizontal offset: whatever the left window
 * shows, the right window shows, because it is the same drawing.
 */
export const PAIR_DX = PAIR.w + PAIR.gap;
/** 0 → no twin, 1 → the full duplicate. Out again as the candles take over. */
export const twinOpacity = (f: number) =>
  (f >= T.pairB ? progress(f, T.pairB, 26) : 0) * (f >= T.candles ? 1 - progress(f, T.candles, 20) : 1);

/**
 * ⚠ THE RIGHT WINDOW'S CANDLES ARE SIMON'S REFERENCE, TRACED — see
 * data/sahamReference: the close-up window onto the saham series. Drawn at
 * the close-up screenshot's own height ("ukurannya dibuat sama tingginya
 * dengan screenshot ini", 257px) and framed the way that screenshot frames
 * them, centred in the window's plot area, stretched across its width.
 */
const CLOSE_H = 257;
export const SAHAM_BOX = (() => {
  const m = MINI(1);
  return { x: m.x, y: m.y + (m.h - CLOSE_H) / 2, w: m.w, h: CLOSE_H };
})();
const CLOSE_RANGE = rangeOf(SAHAM_CLOSE);
const sahamY = sahamScale(SAHAM_BOX, CLOSE_RANGE.hi, CLOSE_RANGE.lo, FRAME_CLOSE);
/** A comparison card's rectangle, and where its label sits inside it. */
export const PAIR_CARD = (i: number) => ({ x: PAIR_X(i), y: PAIR.y, w: PAIR.w, h: PAIR.h });
export const PAIR_LABEL_DY = 26;
/**
 * ⚠ THE FRAME THE RIGHT WINDOW STOPS BEING SCENE02'S. From here the saham
 * card, its label and its candles are drawn by continuity/SahamChart, which
 * starts from exactly this picture and grows it — Simon, at 1370: "Saat ini
 * window kiri yang membesar, ubah jadi window kanan yang membesar."
 */
export const SAHAM_TAKEOVER = 578;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene02 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const { box, chiliScaleY } = geom;

  const settle = f >= T.settle ? progress(f, T.settle, 46) : 0;
  const dots = f >= T.dots ? progress(f, T.dots, 20) : 0;
  /**
   * ⚠ EASE-IN-OUT FOR A TRIM PATH. The episode's default ease is nearly
   * finished in its first few frames, which draws a line as if it had been
   * snapped into place; symmetric, the eye can follow the tip along it.
   */
  const link = f >= T.dots ? progressInOut(f, T.dots, T.linkDur) : 0;
  /** One breath every 36 frames — the dot itself, and a ring leaving it. */
  const beat = f >= T.dots ? theme.motion.ease(((f - T.dots) % 36) / 36) : 0;
  const glow = f >= T.glow && f < T.glow + 30 ? Math.sin(((f - T.glow) / 30) * Math.PI) : 0;

  // opener line: centre stage, then simply clears
  /** ⚠ THE WORDS WAIT FOR THE FRAME — see DashedFrame — then slide up into it. */
  const opener = textReveal(f, dashOpenAt(T.opener), OPENER_IN, OPENER_RISE);
  const openerOp = f >= T.openerOut ? fadeOut(f, T.openerOut, 18) : 1;

  const target = (idx: number) => ({
    cx: box.x + (box.w * idx) / (chiliMonthly.length - 1),
    cy: chiliScaleY(chiliMonthly[idx].price),
  });

  /** The three spoken points, full size. Where they END UP is computed below,
   *  once the small chart they fold into exists. */
  const DOT_PTS = SPOKEN.map(({ idx }) => target(idx));

  // ── comparison pair ──
  const pairIn = f >= T.pairA ? progress(f, T.pairA, 34) : 0;
  const pairOut = f >= T.pairOut ? fadeOut(f, T.pairOut, 26) : 1;
  const pairOp = pairIn * pairOut;
  // left card = the same chili shape, small; right card = a denser series
  /**
   * ⚠ THE DOTS RIDE THE CHART'S OWN FOLD. `geom.foldStyle` is one transform,
   * computed once in ChartContinuity, worn by the paper, the month labels,
   * the line — and here by the three points. Interpolating the points
   * separately was the first attempt and it was wrong in a way that only
   * showed at the end: the dots arrived where the small chart wanted them
   * while the paper and the axis were still full size, because nothing was
   * carrying those.
   */
  const DOT_LEN = DOT_PTS.slice(1).reduce(
    (sum, q, i) => sum + Math.hypot(q.cx - DOT_PTS[i].cx, q.cy - DOT_PTS[i].cy),
    0,
  );
  /** Line out, candles in — one curve, so no frame holds neither. */
  const swap = f >= T.candles ? progress(f, T.candles, 20) : 0;
  /** ⚠ SEPARATE FROM THE CROSSFADE — see T.candleDur. */
  /**
   * ⚠ EASY EASE, like everything else now. It was linear because the old
   * ease-out had the 37 candles ~90% out eight frames into a 22-frame
   * window; the symmetric easy ease walks them in across the whole window.
   */
  const candleIn = f >= T.candles ? progress(f, T.candles, T.candleDur) : 0;

  /* ⚠ THE CYAN SPECKS ARE GONE. Fourteen dots flew in from off-screen right
     to stand for "lebih banyak orang" — Simon: "Hilangkan elemen titik titik
     cyan, gaada artinya." They landed at seeded random points inside the
     window, so they read as noise ON the chart rather than as participants
     arriving at it. */

  return (
    <>
      {/* one-cycle glow on the connected line */}
      {glow > 0.001 && <div style={{ position: "absolute", inset: 0, filter: `brightness(${1 + 0.25 * glow})`, pointerEvents: "none" }} />}

      {/* opening reframe — one centred line in the marquee box, then gone */}
      <DashedFrame {...OPENER_BOX} at={T.opener} opacity={openerOp}>
        {/* ⚠ CENTRED AGAIN. Flush left only ever existed to give the
            typewriter a fixed left edge to write from. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.type.family,
            fontSize: 48,
            fontWeight: 600,
            color: pal.ink,
            whiteSpace: "nowrap",
            opacity: opener.opacity,
            transform: `translateY(${opener.y}px)`,
          }}
        >
          {OPENER_TEXT}
        </div>
      </DashedFrame>

      {/* plain text, centred on the canvas */}
      {/* ⚠ "Harga Cabai" FADES; IT IS NOT COVERED. It sits on the paper, and
          the paper is lifted above everything the moment the fold starts —
          so on 1197 the title was simply painted over, a cut rather than an
          exit. Simon: "'Harga Cabai' ilangnya fade out aja." Raised above the
          paper, and faded over TITLE_OUT frames from the start of the fold. */}
      <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
        <Chip
          label="Harga Cabai"
          x={theme.canvas.width / 2}
          y={224}
          variant="indigo"
          anchor="center"
          bare
          startFrame={T.header}
          opacity={f >= T.pairA ? fadeOut(f, T.pairA, TITLE_OUT) : 1}
        />
      </div>

      {/* the three spoken figures */}
      {SPOKEN.map(({ idx, start, rise }, i) => {
        const tgt = target(idx);
        const cx = interpolate(settle, [0, 1], [CARD_START[i].cx, tgt.cx]);
        const cy = interpolate(settle, [0, 1], [CARD_START[i].cy, tgt.cy]);
        const scale = interpolate(settle, [0, 1], [1, 0.55]);
        return (
          <PriceCard
            key={idx}
            // the figure counts up to its price — here the number IS the subject
            value={`${fmtRp(countTo(f, start, CARD_COUNT, 0, chiliMonthly[idx].price))}/kg`}
            cx={cx}
            cy={cy}
            startFrame={start}
            width={CARD_W}
            scale={scale}
            opacity={1 - dots}
            rise={rise}
          />
        );
      })}

      {/* ⚠ THE CONNECTOR BETWEEN THE FIRST TWO FIGURES IS GONE. It was a
          hairline at y=486 from card one's centre to card two's, drawn from
          T.c2 — global 987 — and it read as a stray rule under Rp40.000/kg
          rather than as a link between two numbers, because it ran BELOW both
          cards instead of between them. Simon: "Remove itu, ga guna." */}

      {/* the cards collapse into dots on the baseline, and the dots are joined.
          ⚠ DRAWN ONCE PER WINDOW: the second copy is the same SVG wearing the
          twin transform, so the right card's points are the left card's. */}
      {dots > 0.001 &&
        ([
          { style: geom.foldStyle, op: geom.foldOp },
          { style: geom.twinStyle, op: geom.twinOp },
        ] as const).map(({ style, op }, copy) =>
          op <= 0.001 ? null : (
        <svg
          key={copy}
          /* ⚠ LIFTED WITH THE CHART IT BELONGS TO — see ChartContinuity's
             note: the cards below are opaque and drawn after this. */
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 3, opacity: op, ...style }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          {/* ⚠ DRAWN FIRST, so the dots sit ON the line and not under it.
              40.000 → 20.000 → 35.000, in the order the voice says them, which
              is also left to right: SPOKEN is high, low, back. */}
          {link > 0.001 && (
            <polyline
              points={DOT_PTS.map((q) => `${q.cx},${q.cy}`).join(" ")}
              fill="none"
              stroke={pal.indigo}
              /* ⚠ DIVIDED BY THE FOLD, so the rule stays two pixels on screen
                 however small the chart it belongs to gets. */
              strokeWidth={theme.stroke.rule / geom.foldScale}
              strokeLinecap="round"
              strokeLinejoin="round"
              /* the trim: one dash as long as the whole path, walked into view */
              strokeDasharray={DOT_LEN}
              strokeDashoffset={DOT_LEN * (1 - link)}
            />
          )}
          {SPOKEN.map(({ idx }, i) => {
            const tgt = DOT_PTS[i];
            const r = DOT_R * dots;
            return (
              <g key={idx} opacity={1}>
                {/* the pulse — a ring leaving the dot, fading as it goes */}
                <circle
                  cx={tgt.cx}
                  cy={tgt.cy}
                  r={r * (1 + 1.5 * beat)}
                  fill="none"
                  stroke={pal.indigo}
                  strokeWidth={theme.stroke.rule}
                  opacity={(1 - beat) * 0.45}
                />
                <circle
                  cx={tgt.cx}
                  cy={tgt.cy}
                  r={r * (1 + 0.08 * Math.sin(beat * Math.PI * 2))}
                  fill={pal.indigo}
                />
              </g>
            );
          })}
        </svg>
          ),
        )}

      {/* ⚠ NO "Chart" CHIP. Simon: "label 'Chart' langsung remove aja dari
          awal, ga usa muncul." It also vanished for a frame at 1197, the
          instant the folding paper was lifted over it. */}

      {/* ── the same shape, beside a busier one ── */}
      {pairOp > 0.001 && (
        <div style={{ opacity: pairIn }}>
          {/* ⚠ THE RIGHT CARD ENDS AT THE TAKEOVER, THE LEFT ONE FADES. The
              right card is not faded: on SAHAM_TAKEOVER SahamChart draws the
              identical card on top and grows it, so there is nothing to fade. */}
          {(f < SAHAM_TAKEOVER ? [0, 1] : [0]).map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PAIR_X(i),
                top: PAIR.y,
                width: PAIR.w,
                height: PAIR.h,
                borderRadius: theme.radius.card,
                background: pal.cardBg,
                border: `${theme.stroke.hair}px solid ${pal.border}`,
                opacity: i === 0 ? pairOut : 1,
              }}
            />
          ))}
          {(f < SAHAM_TAKEOVER ? ["Cabai", "Saham"] : ["Cabai"]).map((lab, i) => (
            <div
              key={lab}
              style={{
                position: "absolute",
                left: PAIR_X(i),
                top: PAIR.y + PAIR_LABEL_DY,
                opacity: i === 0 ? pairOut : 1,
                width: PAIR.w,
                textAlign: "center",
                fontFamily: theme.type.family,
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: pal.slate,
              }}
            >
              {lab}
            </div>
          ))}
          {/* ⚠ NEITHER CARD DRAWS A CHART OF ITS OWN. Simon: "Preview window
              kiri yang sekarang (1220) remove aja, ganti jadi chart yang baru,
              yaitu chart harga cabai." What fills the left card is the real
              chart, folded in — paper, months, line and points together — and
              what fills the right one is that same drawing offset by PAIR_DX.
              A mini copy underneath would be a second drawing of the same
              thing at almost but not quite the same size. */}
          {/* ⚠ THE SAME PATH, TOLD CANDLE BY CANDLE. No axes — the left window
              has none either, and this is a comparison of shapes. */}
          {swap > 0.001 && f < SAHAM_TAKEOVER && (
            <div style={{ opacity: swap }}>
              <CandlestickChart
                data={SAHAM_CANDLES}
                window={SAHAM_CLOSE}
                box={SAHAM_BOX}
                scaleOverride={sahamY}
                showAxes={false}
                revealProgress={candleIn}
              />
            </div>
          )}
        </div>
      )}

      {/* ⚠ NO "Lebih cepat, lebih ramai" CHIP under the right window — Simon:
          "Remove label 'Lebih cepat, lebih ramai'". The voice says it. */}
    </>
  );
};
