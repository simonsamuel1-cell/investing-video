/**
 * RoadmapCards — the drawings in the roadmap's three chapter boxes.
 *
 * Simon: "Kotak transisinya 3 aja, (1) Cara baca candle, (2) Makna candle
 * dalam chart, (3) Study Case. visualnya:
 *   (1) seperti screenshot 1, tapi ambil yang hijau saja, warnanya ganti jadi
 *       indigo, include juga anatomy nya tapi tanpa text, jadi hanya garis
 *       menunjuknya aja
 *   (2) buat morning star pattern candlestick seperti screenshot 2, tapi tanpa
 *       text
 *   (3) buat seperti screenshot 3, tapi buat simple banget"
 *
 * ⚠ DRAWN AT FULL FRAME SIZE (1920×1080), NOT CARD SIZE. The roadmap scales a
 * box's content down into the card exactly as it scales a frozen scene, and a
 * push magnifies it back to 1:1 — so each drawing is composed as a frame of
 * its own: clear of the logo's top-right corner and the subtitle band, and
 * with strokes heavy enough to survive being shown at a quarter size.
 *
 * ⚠ NO TEXT, NO NUMBERS. None of these is market data; nothing is labelled.
 */
import React from "react";
import { theme } from "../theme";
import { mulberry32 } from "../helpers";

const W = theme.canvas.width;
const H = theme.canvas.height;
/** Candle corners, by the film's rule (theme.candle). */
const corner = (w: number, h: number) =>
  Math.min(w * theme.candle.round, h / 2, theme.candle.roundMax);

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    {children}
  </svg>
);

// ═══ (1) Cara baca candle — one bullish candle and its anatomy, in indigo ═══
/**
 * ⚠ SC02 PICKS THIS CANDLE UP. The push into this box lands on SC02, and in the
 * Indonesian cut SC02 draws THIS candle, here, then fades it to green — Simon:
 * "buat continuous deh dari scene transisi". So its geometry is exported, and
 * it sits high enough to leave SC02's "Conviction" chip room above the
 * subtitle band.
 */
export const ANATOMY = {
  cx: 960,
  body: { w: 230, top: 290, bottom: 740 },
  wick: { w: 34, top: 180, bottom: 840 },
};
const A = {
  ...ANATOMY,
  lines: { left: 520, right: 1400, gap: 22 },
  dash: "26 18",
  stroke: 6,
  arrow: { x: 690, top: 370, bottom: 710, shaft: 26, head: 104, headH: 92 },
};

/** The candle itself — wick and rounded body — in any colour. */
export const AnatomyCandleShape: React.FC<{ fill: string }> = ({ fill }) => {
  const bh = ANATOMY.body.bottom - ANATOMY.body.top;
  const r = corner(ANATOMY.body.w, bh);
  return (
    <>
      <rect
        x={ANATOMY.cx - ANATOMY.wick.w / 2}
        y={ANATOMY.wick.top}
        width={ANATOMY.wick.w}
        height={ANATOMY.wick.bottom - ANATOMY.wick.top}
        fill={fill}
      />
      <rect
        x={ANATOMY.cx - ANATOMY.body.w / 2}
        y={ANATOMY.body.top}
        width={ANATOMY.body.w}
        height={bh}
        rx={r}
        ry={r}
        fill={fill}
      />
    </>
  );
};

export const CandleAnatomy: React.FC = () => {
  const bx = A.cx - A.body.w / 2;
  const line = (x1: number, x2: number, y: number) => (
    <line
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      stroke={theme.colors.slate}
      strokeWidth={A.stroke}
      strokeDasharray={A.dash}
    />
  );
  const bodyMid = (A.body.top + A.body.bottom) / 2;
  const ar = A.arrow;
  return (
    <Frame>
      {/* the up arrow, pale, to the left — as in the reference */}
      <rect
        x={ar.x - ar.shaft / 2}
        y={ar.top + ar.headH - 4}
        width={ar.shaft}
        height={ar.bottom - ar.top - ar.headH + 4}
        fill={theme.colors.neutralLine}
      />
      <polygon
        points={`${ar.x},${ar.top} ${ar.x - ar.head / 2},${ar.top + ar.headH} ${ar.x + ar.head / 2},${ar.top + ar.headH}`}
        fill={theme.colors.neutralLine}
      />
      {/* High and Low run the whole width; Close and Open stop at the body;
          the Body pointer leaves from its right edge */}
      {line(A.lines.left, A.lines.right, A.wick.top)}
      {line(A.lines.left, bx - A.lines.gap, A.body.top)}
      {line(A.lines.left, bx - A.lines.gap, A.body.bottom)}
      {line(bx + A.body.w + A.lines.gap, A.lines.right, bodyMid)}
      {line(A.lines.left, A.lines.right, A.wick.bottom)}
      {/* the candle */}
      <AnatomyCandleShape fill={theme.colors.indigo} />
    </Frame>
  );
};

// ═══ (2) Makna candle dalam chart — a Morning Star ═══
/** Traced from the reference (1000px square), mapped onto the frame. */
const MS_Y = (y: number) => 150 + (y - 55) * 1.03;
const MORNING_STAR = [
  { cx: 730, up: false, body: [120, 569], wick: [55, 640] },
  { cx: 960, up: true, body: [649, 722], wick: [590, 783] },
  { cx: 1190, up: true, body: [356, 655], wick: [290, 723] },
];
const MS = { body: 150, wick: 12 };

export const MorningStar: React.FC = () => (
  <Frame>
    {MORNING_STAR.map((c) => {
      const ink = c.up ? theme.colors.candleGreen : theme.colors.candleRed;
      const top = MS_Y(c.body[0]);
      const h = MS_Y(c.body[1]) - top;
      const r = corner(MS.body, h);
      return (
        <g key={c.cx}>
          <rect
            x={c.cx - MS.wick / 2}
            y={MS_Y(c.wick[0])}
            width={MS.wick}
            height={MS_Y(c.wick[1]) - MS_Y(c.wick[0])}
            fill={ink}
          />
          <rect
            x={c.cx - MS.body / 2}
            y={top}
            width={MS.body}
            height={h}
            rx={r}
            ry={r}
            fill={ink}
          />
        </g>
      );
    })}
  </Frame>
);

// ═══ (3) Study Case — a price chart with its volume, very simple ═══
/**
 * The reference's SHAPE — a long climb, a top, a sharp fall and a partial
 * recovery, volume underneath — not its numbers. Seeded, so it never changes
 * between renders; unlabelled, so nothing is presented as real.
 */
const N = 34;
const SHAPE = (q: number) =>
  q < 0.7
    ? 0.08 + 0.87 * Math.pow(q / 0.7, 1.25)
    : q < 0.84
      ? 0.95 - ((q - 0.7) / 0.14) * 0.42
      : 0.53 + ((q - 0.84) / 0.16) * 0.2;
const SERIES = (() => {
  const rng = mulberry32(17);
  const out: { o: number; h: number; l: number; c: number; v: number }[] = [];
  let prev = SHAPE(0);
  for (let i = 0; i < N; i++) {
    const c = SHAPE(i / (N - 1)) + (rng() - 0.5) * 0.07;
    const o = prev + (rng() - 0.5) * 0.02;
    const h = Math.max(o, c) + rng() * 0.035;
    const l = Math.min(o, c) - rng() * 0.035;
    out.push({ o, h, l, c, v: 0.25 + rng() * 0.45 + Math.abs(c - o) * 3 });
    prev = c;
  }
  return out;
})();
const SC = {
  x0: 230,
  x1: 1690,
  top: 210,
  bottom: 700,
  volTop: 750,
  volBottom: 915,
};
const LO = Math.min(...SERIES.map((d) => d.l));
const HI = Math.max(...SERIES.map((d) => d.h));
const VMAX = Math.max(...SERIES.map((d) => d.v));

export const SimpleChart: React.FC = () => {
  const step = (SC.x1 - SC.x0) / N;
  const bw = step * 0.6;
  const y = (p: number) =>
    SC.bottom - ((p - LO) / (HI - LO)) * (SC.bottom - SC.top);
  return (
    <Frame>
      {SERIES.map((d, i) => {
        const x = SC.x0 + step * (i + 0.5);
        const up = d.c >= d.o;
        const ink = up ? theme.colors.candleGreen : theme.colors.candleRed;
        const top = y(Math.max(d.o, d.c));
        const h = Math.max(6, Math.abs(y(d.o) - y(d.c)));
        const r = corner(bw, h);
        const vh = (d.v / VMAX) * (SC.volBottom - SC.volTop);
        return (
          <g key={i}>
            {/* volume, in the candle's colour but pale — as in the reference */}
            <rect
              x={x - step * 0.42}
              y={SC.volBottom - vh}
              width={step * 0.84}
              height={vh}
              fill={ink}
              opacity={0.35}
            />
            <rect
              x={x - 4}
              y={y(d.h)}
              width={8}
              height={y(d.l) - y(d.h)}
              fill={ink}
            />
            <rect
              x={x - bw / 2}
              y={top}
              width={bw}
              height={h}
              rx={r}
              ry={r}
              fill={ink}
            />
          </g>
        );
      })}
    </Frame>
  );
};
