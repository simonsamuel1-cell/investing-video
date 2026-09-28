/**
 * RoadmapCandles — the drawings in the roadmap's second and third boxes.
 *
 * (2) Struktur & Level Harga — Simon: "buat 8 candlesticks, 2 candlestick naik
 *     ke arah tengah kotak secara horizontal, lalu 3 candlestick selanjutnya
 *     turun sedikit, lalu 3 candlestick lainnya naik. Semua candlestick indigo.
 *     Di tengah secara horizontal, ada area cyan resistance, tapi jangan kasih
 *     text." Traced from his BOS reference (223×271).
 * (3) Tanda Perubahan Struktur — "gambarkan seperti pada screenshot 1, tapi
 *     tanpa text, kotaknya, dan 2 candlestick di kanan ... Lalu di atas pattern
 *     ini, berikan icon tanda seru hitam di dalam segitiga kuning." The
 *     shooting star, traced from his reference (1080 square), in the film's
 *     candle colours.
 *
 * ⚠ DRAWN AT FULL FRAME SIZE (1920×1080), NOT CARD SIZE. The roadmap scales a
 * box's content down into the card exactly as it scales a frozen scene, and a
 * push magnifies it back to 1:1 — so each drawing is composed as a frame of
 * its own, clear of the logo's top-right corner and the subtitle band.
 *
 * ⚠ NO TEXT, NO NUMBERS. Not market data; nothing is labelled.
 */
import React from "react";
import { theme } from "../theme";

const W = theme.canvas.width;
const H = theme.canvas.height;
/** The film's wick-to-body ratio (components/CandleChart). */
const WICK = 0.14;

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

/** One square-bodied candle, in canvas px. */
const Candle = ({
  cx,
  body,
  top,
  bottom,
  wickTop,
  wickBottom,
  ink,
}: {
  cx: number;
  body: number;
  top: number;
  bottom: number;
  wickTop: number;
  wickBottom: number;
  ink: string;
}) => (
  <>
    <rect
      x={cx - (body * WICK) / 2}
      y={wickTop}
      width={body * WICK}
      height={wickBottom - wickTop}
      fill={ink}
    />
    <rect x={cx - body / 2} y={top} width={body} height={bottom - top} fill={ink} />
  </>
);

// ═══ (2) Struktur & Level Harga — up to the level, a dip, and through it ═══
/**
 * Traced in reference pixels as [body top, body bottom, wick top, wick
 * bottom]; the reference's dashed level sits on its row 87, which lands on
 * the frame's middle — "di tengah secara horizontal".
 */
const LEVEL_TRACE = [
  [195, 241, 188, 249], // up
  [117, 191, 112, 205], // up, to the level
  [95, 136, 88, 146], // down
  [121, 157, 110, 168], // down
  [157, 177, 157, 196], // down
  [106, 155, 96, 156], // up
  [50, 103, 44, 105], // up, through it
  [19, 53, 14, 64], // up
] as const;
const LEVEL = {
  row: 87,
  /** Reference px → canvas px, vertically; the level at the frame's middle. */
  scale: 2.2,
  /** Wider set than the portrait reference, so the card is not mostly empty. */
  slot: 100,
  body: 64,
  /** The resistance area, centred on the level, running past the candles. */
  band: { h: 56, overhang: 140, radius: 10 },
};
const levelY = (y: number) => H / 2 + (y - LEVEL.row) * LEVEL.scale;
const levelX = (i: number) =>
  W / 2 + (i - (LEVEL_TRACE.length - 1) / 2) * LEVEL.slot;

export const StructureLevel: React.FC = () => {
  const x0 = levelX(0) - LEVEL.body / 2 - LEVEL.band.overhang;
  const x1 = levelX(LEVEL_TRACE.length - 1) + LEVEL.body / 2 + LEVEL.band.overhang;
  return (
    <Frame>
      <rect
        x={x0}
        y={H / 2 - LEVEL.band.h / 2}
        width={x1 - x0}
        height={LEVEL.band.h}
        rx={LEVEL.band.radius}
        fill={theme.roadmap.resistance}
      />
      {LEVEL_TRACE.map(([bt, bb, wt, wb], i) => (
        <Candle
          key={i}
          cx={levelX(i)}
          body={LEVEL.body}
          top={levelY(bt)}
          bottom={levelY(bb)}
          wickTop={levelY(wt)}
          wickBottom={levelY(wb)}
          ink={theme.color.indigo}
        />
      ))}
    </Frame>
  );
};

// ═══ (3) Tanda Perubahan Struktur — a shooting star, under a caution sign ═══
/** Reference px: [centre x, body top, body bottom, wick top, wick bottom, up]. */
const STAR_TRACE = [
  [227, 690, 855, 690, 855, true],
  [298.5, 523, 688, 523, 688, true],
  [370, 358, 523, 358, 523, true],
  [443, 358, 393, 192, 426, false], // the shooting star
  [514, 400, 486, 259, 486, false],
  [587, 491, 637, 444, 637, false],
  [658, 642, 854, 642, 854, false],
] as const;
const STAR_REF = { x0: 199, x1: 685, y0: 192, y1: 855, body: 55 };
const STAR = {
  /** The pattern's top and bottom on the canvas; the sign sits above it. */
  top: 318,
  bottom: 900,
  sign: { h: 150, gap: 44, stroke: 22, bar: 20 },
};
const S = (STAR.bottom - STAR.top) / (STAR_REF.y1 - STAR_REF.y0);
const starX = (x: number) => W / 2 + (x - (STAR_REF.x0 + STAR_REF.x1) / 2) * S;
const starY = (y: number) => STAR.top + (y - STAR_REF.y0) * S;

/** A yellow triangle with rounded corners and a black "!" — drawn, not a glyph. */
const CautionSign = ({ cx, bottom, h }: { cx: number; bottom: number; h: number }) => {
  const sg = STAR.sign;
  // the stroke rounds the corners and adds half its width all round
  const inner = h - sg.stroke;
  const half = inner / Math.sqrt(3);
  const top = bottom - sg.stroke / 2 - inner;
  const base = bottom - sg.stroke / 2;
  const points = `${cx},${top} ${cx + half},${base} ${cx - half},${base}`;
  const barTop = top + inner * 0.3;
  const barBottom = top + inner * 0.68;
  return (
    <>
      <polygon
        points={points}
        fill={theme.roadmap.caution}
        stroke={theme.roadmap.caution}
        strokeWidth={sg.stroke}
        strokeLinejoin="round"
      />
      <rect
        x={cx - sg.bar / 2}
        y={barTop}
        width={sg.bar}
        height={barBottom - barTop}
        rx={sg.bar / 2}
        fill={theme.color.ink}
      />
      <circle cx={cx} cy={top + inner * 0.82} r={sg.bar * 0.62} fill={theme.color.ink} />
    </>
  );
};

export const ShootingStar: React.FC = () => (
  <Frame>
    {STAR_TRACE.map(([cx, bt, bb, wt, wb, up]) => (
      <Candle
        key={cx}
        cx={starX(cx)}
        body={STAR_REF.body * S}
        top={starY(bt)}
        bottom={starY(bb)}
        wickTop={starY(wt)}
        wickBottom={starY(wb)}
        ink={up ? theme.color.candleGreen : theme.color.candleRed}
      />
    ))}
    {/* over the star itself, which is also the pattern's centre */}
    <CautionSign
      cx={starX(STAR_TRACE[3][0])}
      bottom={STAR.top - STAR.sign.gap}
      h={STAR.sign.h}
    />
  </Frame>
);
