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

// (3) Study Case has no drawing: its box shows the BBRI scene's own frame
// (Composition: STUDY_CASE) — Simon: "Itu adalah visual langsung dari scene
// study case".
