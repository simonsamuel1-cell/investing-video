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
import { progress, fadeIn, fadeOut, textReveal, fmtRp, mulberry32 } from "../helpers";
import { chiliMonthly, CHILI_SPOKEN } from "../data/chili";
import type { ContGeom } from "../continuity/ChartContinuity";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  opener: 0, // "Padahal, kamu sudah membaca chart"
  openerOut: 59, // global 548 — the line clears outright; it does NOT retreat to a header
  header: 90, // "Coba lihat harga cabai"
  c1: 141, // "40.000 per kilogram"
  c2: 196, // "turun ke 20.000"
  c3: 238, // "lalu naik lagi"
  settle: 273, // "Susun angka itu berdasarkan waktu"
  dots: 337, // "dan hubungkan titiknya"
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
const CARD_CY = 430;
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
  const f = useCurrentFrame();
  const { box, chiliScaleY } = geom;

  const settle = f >= T.settle ? progress(f, T.settle, 46) : 0;
  const dots = f >= T.dots ? progress(f, T.dots, 20) : 0;
  const glow = f >= T.glow && f < T.glow + 30 ? Math.sin(((f - T.glow) / 30) * Math.PI) : 0;

  // opener line: centre stage, then simply clears
  const op = textReveal(f, T.opener, 20);
  const openerOp = op.opacity * (f >= T.openerOut ? fadeOut(f, T.openerOut, 18) : 1);

  const target = (idx: number) => ({
    cx: box.x + (box.w * idx) / (chiliMonthly.length - 1),
    cy: chiliScaleY(chiliMonthly[idx].price),
  });

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

      {/* opening reframe — one centred line, then gone */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 520,
          width: theme.canvas.width,
          textAlign: "center",
          boxSizing: "border-box",
          fontFamily: theme.type.family,
          fontSize: 48,
          fontWeight: 600,
          color: theme.colors.slate,
          opacity: openerOp,
          transform: `translateY(${op.y}px)`,
        }}
      >
        Kamu sudah membaca chart seumur hidup.
      </div>

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
            value={`${fmtRp(chiliMonthly[idx].price)}/kg`}
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

      {/* a thin connector from the first figure down to the second */}
      {f >= T.c2 && settle < 0.5 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={CARD_START[0].cx}
            y1={CARD_START[0].cy + 56}
            x2={CARD_START[1].cx}
            y2={CARD_START[1].cy + 56}
            stroke={theme.colors.muted}
            strokeWidth={theme.stroke.hair}
            opacity={fadeIn(f, T.c2, 14) * (1 - settle)}
          />
        </svg>
      )}

      {/* the cards collapse into dots on the baseline */}
      {dots > 0.001 && pairIn < 0.5 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {SPOKEN.map(({ idx }) => {
            const tgt = target(idx);
            return <circle key={idx} cx={tgt.cx} cy={tgt.cy} r={8 * dots} fill={theme.colors.indigo} opacity={1 - pairIn} />;
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
                background: theme.colors.cardBg,
                border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
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
                color: theme.colors.slate,
              }}
            >
              {lab}
            </div>
          ))}
          <LineChart points={chiliMini} progress={1} color={theme.colors.indigo} />
          {denseDraw > 0.001 && <LineChart points={denseMini} progress={denseDraw} color={theme.colors.cyan} width={theme.stroke.hair} />}
          {crowdDots.length > 0 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
              {crowdDots.map((d, k) => (
                <circle key={k} cx={d.x} cy={d.y} r={4} fill={theme.colors.cyan} opacity={d.o * 0.9} />
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
