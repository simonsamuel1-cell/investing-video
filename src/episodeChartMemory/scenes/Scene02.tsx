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
import { LineChart } from "../components/LineChart";
import { theme } from "../theme";
import { progress, progressInOut, fadeOut, textReveal, countTo, fmtRp, mulberry32 } from "../helpers";
import { chiliMonthly, CHILI_SPOKEN } from "../data/chili";
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
  pairA: 444, // "Chart saham sama saja" — the shape duplicates
  pairB: 490, // the denser stock line draws beside it
  crowd: 527, // "hanya lebih cepat dan melibatkan lebih banyak orang"
  pairOut: 578, // clear before the SC03 morph
};
// The three figures sit in one row, 10px apart. A uniform card width is what
// makes that gap exact — natural widths differ per figure, so the pitch is
// CARD_W + 10 and every card is centred inside its own box.
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
const CARD_START = [0, 1, 2].map((i) => ({ cx: theme.canvas.width / 2 + (i - 1) * (CARD_W + CARD_GAP), cy: CARD_CY }));
const SPOKEN = [
  { idx: CHILI_SPOKEN.high, start: T.c1, rise: false },
  { idx: CHILI_SPOKEN.low, start: T.c2, rise: false },
  { idx: CHILI_SPOKEN.back, start: T.c3, rise: true },
];
// side-by-side comparison cards
const PAIR = { y: 360, w: 640, h: 340, gap: 24 };
const PAIR_X = (i: number) => (theme.canvas.width - (PAIR.w * 2 + PAIR.gap)) / 2 + i * (PAIR.w + PAIR.gap);
const MINI = (i: number) => ({ x: PAIR_X(i) + 34, y: PAIR.y + 92, w: PAIR.w - 68, h: PAIR.h - 150 });
const PRICE_RANGE: [number, number] = [18000, 42000];
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
  const beat = f >= T.dots ? ((f - T.dots) % 36) / 36 : 0;
  const glow = f >= T.glow && f < T.glow + 30 ? Math.sin(((f - T.glow) / 30) * Math.PI) : 0;

  // opener line: centre stage, then simply clears
  /** ⚠ THE WORDS WAIT FOR THE FRAME. See DashedFrame: content that reflows
   *  while the box is still snapping open is what gives the trick away. */
  const op = textReveal(f, dashOpenAt(T.opener), 18);
  const openerOp = f >= T.openerOut ? fadeOut(f, T.openerOut, 18) : 1;

  const target = (idx: number) => ({
    cx: box.x + (box.w * idx) / (chiliMonthly.length - 1),
    cy: chiliScaleY(chiliMonthly[idx].price),
  });

  /** The three spoken points, and the length of the path through them — the
   *  trim needs a real length, not a guess. */
  const DOT_PTS = SPOKEN.map(({ idx }) => target(idx));
  const DOT_LEN = DOT_PTS.slice(1).reduce(
    (sum, q, i) => sum + Math.hypot(q.cx - DOT_PTS[i].cx, q.cy - DOT_PTS[i].cy),
    0,
  );

  // ── comparison pair ──
  const pairIn = f >= T.pairA ? progress(f, T.pairA, 34) : 0;
  const pairOut = f >= T.pairOut ? fadeOut(f, T.pairOut, 26) : 1;
  const pairOp = pairIn * pairOut;
  const yOf = (price: number, b: { y: number; h: number }) =>
    interpolate(price, PRICE_RANGE, [b.y + b.h, b.y], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // left card = the same chili shape, small; right card = a denser series
  const chiliMini = (() => {
    const b = MINI(0);
    return chiliMonthly.map((c, k) => ({ x: b.x + (b.w * k) / (chiliMonthly.length - 1), y: yOf(c.price, b) }));
  })();
  const denseMini = (() => {
    const b = MINI(1);
    const rnd = mulberry32(99213);
    const N = 150;
    return Array.from({ length: N }, (_, k) => {
      const t = k / (N - 1);
      const base = chiliMonthly[Math.min(chiliMonthly.length - 1, Math.round(t * (chiliMonthly.length - 1)))].price;
      return { x: b.x + b.w * t, y: yOf(base, b) + (rnd() - 0.5) * 46 };
    });
  })();
  const denseDraw = f >= T.pairB ? progress(f, T.pairB, 60) : 0;

  // participants streaming into the busier line
  const crowd = f >= T.crowd ? progress(f, T.crowd, 44) : 0;
  const crowdDots = (() => {
    if (crowd <= 0.001) return [];
    const rnd = mulberry32(4477);
    const b = MINI(1);
    return Array.from({ length: 14 }, (_, k) => {
      const q = Math.max(0, Math.min(1, crowd * 1.6 - k * 0.045));
      const tx = b.x + b.w * rnd();
      const ty = b.y + b.h * (0.2 + rnd() * 0.7);
      return { x: interpolate(q, [0, 1], [theme.canvas.width + 40, tx]), y: ty, o: q };
    });
  })();

  return (
    <>
      {/* one-cycle glow on the connected line */}
      {glow > 0.001 && <div style={{ position: "absolute", inset: 0, filter: `brightness(${1 + 0.25 * glow})`, pointerEvents: "none" }} />}

      {/* opening reframe — one centred line in the marquee box, then gone */}
      <DashedFrame {...OPENER_BOX} at={T.opener} opacity={openerOp}>
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
            opacity: op.opacity,
            transform: `translateY(${op.y}px)`,
          }}
        >
          Sebetulnya, kamu sudah membaca chart sepanjang hidupmu
        </div>
      </DashedFrame>

      {/* plain text, centred on the canvas */}
      <Chip label="Harga Cabai" x={theme.canvas.width / 2} y={224} variant="indigo" anchor="center" bare startFrame={T.header} opacity={1 - pairIn} />

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

      {/* the cards collapse into dots on the baseline, and the dots are joined */}
      {dots > 0.001 && pairIn < 0.5 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {/* ⚠ DRAWN FIRST, so the dots sit ON the line and not under it.
              40.000 → 20.000 → 35.000, in the order the voice says them, which
              is also left to right: SPOKEN is high, low, back. */}
          {link > 0.001 && (
            <polyline
              points={DOT_PTS.map((q) => `${q.cx},${q.cy}`).join(" ")}
              fill="none"
              stroke={pal.indigo}
              strokeWidth={theme.stroke.rule}
              strokeLinecap="round"
              strokeLinejoin="round"
              /* the trim: one dash as long as the whole path, walked into view */
              strokeDasharray={DOT_LEN}
              strokeDashoffset={DOT_LEN * (1 - link)}
              opacity={1 - pairIn}
            />
          )}
          {SPOKEN.map(({ idx }) => {
            const tgt = target(idx);
            const r = DOT_R * dots;
            return (
              <g key={idx} opacity={1 - pairIn}>
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
      )}

      <Chip
        label="Chart"
        x={target(CHILI_SPOKEN.back).cx}
        y={target(CHILI_SPOKEN.back).cy - 68}
        variant="indigo"
        anchor="center"
        startFrame={T.glow + 10}
        opacity={1 - pairIn}
      />

      {/* ── the same shape, beside a busier one ── */}
      {pairOp > 0.001 && (
        <div style={{ opacity: pairOp }}>
          {[0, 1].map((i) => (
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
              }}
            />
          ))}
          {["Cabai", "Saham"].map((lab, i) => (
            <div
              key={lab}
              style={{
                position: "absolute",
                left: PAIR_X(i),
                top: PAIR.y + 26,
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
          <LineChart points={chiliMini} progress={1} color={pal.indigo} />
          {denseDraw > 0.001 && <LineChart points={denseMini} progress={denseDraw} color={pal.cyan} width={theme.stroke.hair} />}
          {crowdDots.length > 0 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
              {crowdDots.map((d, k) => (
                <circle key={k} cx={d.x} cy={d.y} r={4} fill={pal.cyan} opacity={d.o * 0.9} />
              ))}
            </svg>
          )}
        </div>
      )}

      <Chip
        label="Lebih cepat, lebih ramai"
        x={PAIR_X(1) + PAIR.w / 2}
        y={PAIR.y + PAIR.h + 46}
        variant="cyan"
        anchor="center"
        startFrame={T.crowd}
        opacity={pairOut}
      />
    </>
  );
};
