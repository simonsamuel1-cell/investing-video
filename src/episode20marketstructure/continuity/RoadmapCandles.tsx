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
 * ⚠ ONE COMPOSITION FOR EVERY BOX — Simon: "tampilan komposisinya benerin deh,
 * naik turun gini kalo lagi scene transisi, ga fokus". Each drawing's ink is
 * centred on the frame and stands INK.h tall, the same as the first box
 * (SC02's opening zoom: 700px, 190 → 890), so the four sit level in the grid.
 *
 * ⚠ NO TEXT, NO NUMBERS. Not market data; nothing is labelled.
 */
import React from "react";
import { theme } from "../theme";

const W = theme.canvas.width;
const H = theme.canvas.height;
/** The film's wick-to-body ratio (components/CandleChart). */
const WICK = 0.14;
/** Every box's ink: this tall, centred on the frame. */
export const INK = { h: 700, top: (H - 700) / 2, bottom: (H + 700) / 2 };

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
 * [body top, body bottom, wick top, wick bottom] in reference pixels measured
 * UP from its dashed level. The first five are the reference's; the last
 * three climb further than it does, so the drawing reaches as far above the
 * level as below it — which puts the level ("di tengah secara horizontal")
 * and the drawing's own centre on the same line.
 */
const LEVEL_TRACE = [
  [-108, -154, -101, -162], // up
  [-30, -104, -25, -118], // up, to the level
  [-8, -49, -1, -59], // down
  [-34, -70, -23, -81], // down
  [-70, -90, -70, -109], // down
  [-19, -68, -9, -69], // up
  [70, -16, 84, -20], // up, through it
  [140, 66, 162, 56], // up
] as const;
const LEVEL_REACH = 162;
const LEVEL = {
  /** Reference px → canvas px: ±LEVEL_REACH fills INK.h. */
  scale: INK.h / (LEVEL_REACH * 2),
  /** Wider set than the portrait reference, so the card is not mostly empty. */
  slot: 100,
  body: 64,
  /** The resistance area, centred on the level, running past the candles. */
  band: { h: 56, overhang: 140, radius: 10 },
};
const levelY = (up: number) => H / 2 - up * LEVEL.scale;
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
const SIGN = { h: 130, gap: 36, stroke: 20, bar: 18 };
const STAR = {
  /** The sign and the pattern together fill INK; the pattern takes what the sign leaves. */
  top: INK.top + SIGN.h + SIGN.gap,
  bottom: INK.bottom,
  sign: SIGN,
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
