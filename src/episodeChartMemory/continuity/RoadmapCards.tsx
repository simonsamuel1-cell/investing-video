/**
 * RoadmapCards — the drawings in the FIRST roadmap's boxes 2–4 (global 620–791).
 * Simon, at 708: "Ubah visual isi dari tiap kotak di Scene Transisi."
 *
 *   Alur Grafik      (top right)     a line chart after his reference 1 —
 *                                    no vertical rules, no years, indigo
 *   Perilaku Pasar   (bottom left)   a bullish rectangle after reference 2 —
 *                                    no text, indigo, stretched to the card
 *   Ilusi Kepastian  (bottom right)  13 candles, the last 3 hollow and rising,
 *                                    and those 3 mirrored DOWNWARD beneath them
 *
 * Stops 1 and 2 use these (Simon asked for stop 2 to match stop 1).
 *
 * Like HighLowBars, each is drawn at card size (CARD.w × CARD.h) on the card's
 * white, and carries no label, so no figure is presented as real. Only
 * SmoothLines uses `trim` — stop 2 pushes into its box; the other two are
 * only ever pushed off-screen.
 */
import React from "react";
import { usePalette } from "../palette";
import { CARD } from "./Roadmap";

/** Catmull–Rom through the points, as cubic Béziers — a smooth path, no overshoot tricks. */
const smoothPath = (pts: [number, number][]) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};

// ── Alur Grafik ─────────────────────────────────────────────────────────────
/**
 * ⚠ TRACED FROM SIMON'S REFERENCE, not drawn freehand: each line's centre was
 * read off the 1200×1200 image every 36px by hue (purple→blue, salmon→pink),
 * and the faded ends extended along the same slope. Coordinates are the
 * image's; they are fitted into the card below.
 */
const COOL: [number, number][] = [
  [60, 566], [114, 497], [150, 443], [186, 404], [222, 390], [258, 409], [294, 471], [330, 561], [366, 632],
  [402, 647], [438, 624], [474, 576], [510, 530], [546, 502], [582, 494], [618, 500], [654, 518], [690, 545],
  [726, 570], [762, 586], [798, 592], [834, 580], [870, 534], [906, 458], [942, 372], [978, 305], [1014, 286],
  [1050, 298], [1086, 328], [1140, 382],
];
const WARM: [number, number][] = [
  [60, 518], [120, 532], [156, 535], [192, 532], [228, 518], [264, 491], [300, 450], [336, 406], [372, 386],
  [408, 404], [444, 462], [480, 524], [522, 568], [558, 582], [594, 575], [630, 540], [666, 474], [712, 360],
  [762, 262], [798, 224], [834, 211], [870, 216], [906, 238], [942, 275], [984, 321], [1020, 351], [1056, 370],
  [1140, 388],
];
/** The pulsing point on the warm line, as in the reference. */
const HOT: [number, number] = [712, 360];
const REF = { x0: 60, x1: 1140, y0: 180, y1: 680 };

export const SmoothLines: React.FC<{ trim: number }> = ({ trim }) => {
  const pal = usePalette();
  const pad = { x: 34, y: 34 };
  const k = Math.min((CARD.w - 2 * pad.x) / (REF.x1 - REF.x0), (CARD.h - 2 * pad.y) / (REF.y1 - REF.y0));
  const ox = (CARD.w - (REF.x1 - REF.x0) * k) / 2;
  const oy = (CARD.h - (REF.y1 - REF.y0) * k) / 2;
  const fit = ([x, y]: [number, number]): [number, number] => [ox + (x - REF.x0) * k, oy + (y - REF.y0) * k];
  const x0 = fit([REF.x0, 0])[0];
  const x1 = fit([REF.x1, 0])[0];
  const hot = fit(HOT);
  /** Along x, faded at both ends — the reference's lines dissolve into the card. */
  const grad = (id: string, from: string, to: string) => (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x0} y1={0} x2={x1} y2={0}>
      <stop offset="0" stopColor={from} stopOpacity={0} />
      <stop offset="0.1" stopColor={from} stopOpacity={1} />
      <stop offset="0.9" stopColor={to} stopOpacity={1} />
      <stop offset="1" stopColor={to} stopOpacity={0} />
    </linearGradient>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: pal.cardBg }}>
      <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* ⚠ BOTH LINES INDIGO — Simon: "garisnya indigo aja". The faded ends
            stay: they are what makes the lines read as running on past the
            card, and they belong to the reference's look, not its palette. */}
        <defs>
          {grad("rm-cool", pal.indigo, pal.indigo)}
          {grad("rm-warm", pal.indigo, pal.indigo)}
        </defs>
        {/* ⚠ THE LINES TRIM OUT AS A PUSH LANDS ON THIS CARD (stop 2 pushes
            into it) — the same exit HighLowBars makes, so the next scene opens
            on a clean page rather than through a magnified drawing. pathLength
            1 lets the dash be written without measuring a Bézier. */}
        {[COOL, WARM].map((pts, i) => (
          <path
            key={i}
            d={smoothPath(pts.map(fit))}
            pathLength={1}
            fill="none"
            stroke={i === 0 ? "url(#rm-cool)" : "url(#rm-warm)"}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset={-trim}
          />
        ))}
        <g opacity={1 - trim}>
          <circle cx={hot[0]} cy={hot[1]} r={14} fill={pal.indigo} opacity={0.18} />
          <circle cx={hot[0]} cy={hot[1]} r={9} fill={pal.indigo} opacity={0.35} />
          <circle cx={hot[0]} cy={hot[1]} r={5} fill={pal.indigo} />
        </g>
      </svg>
    </div>
  );
};

// ── Perilaku Pasar ──────────────────────────────────────────────────────────
/**
 * ⚠ TRACED FROM REFERENCE 2 (131×148px), text removed. A steep pole, then
 * price swinging between a resistance and a support line, then three short
 * blue levels to the right and a dashed rise to the top one.
 *
 * ⚠ COMPLIANCE: in the reference those three blue levels are labelled target,
 * entry and stop. The labels are gone, but the levels are still the drawing.
 * Kept because Simon asked for the reference as it is; flagged for review.
 */
const RECT = {
  pole: [[9, 139], [22, 71]] as [number, number][],
  swing: [[22, 71], [30, 93], [37, 72], [45, 93], [51, 71], [60, 93], [66, 72]] as [number, number][],
  resistance: { y: 70, x0: 22, x1: 73 },
  support: { y: 94, x0: 22, x1: 72 },
  levels: [
    { y: 35.5, x0: 70, x1: 94 },
    { y: 65.5, x0: 64, x1: 89 },
    { y: 98, x0: 61, x1: 85 },
  ],
  rise: [[82, 38], [75.5, 64]] as [number, number][],
  bounds: { x0: 8, x1: 95, y0: 34, y1: 140 },
};

export const BullishRectangle: React.FC<{ trim: number }> = () => {
  const pal = usePalette();
  /**
   * ⚠ STRETCHED ACROSS THE CARD, not fitted to its height. Simon: "width
   * visualnya di stretch kiri kanan deh, biar ngisi white space di
   * sampingnya." The reference is taller than wide; at one uniform scale it
   * sat in a column with the card empty either side. x and y now take their
   * own factor, each filling its own side of the card.
   */
  const pad = { x: 56, y: 40 };
  const b = RECT.bounds;
  const kx = (CARD.w - 2 * pad.x) / (b.x1 - b.x0);
  const ky = (CARD.h - 2 * pad.y) / (b.y1 - b.y0);
  const X = (x: number) => pad.x + (x - b.x0) * kx;
  const Y = (y: number) => pad.y + (y - b.y0) * ky;
  const pts = (p: [number, number][]) => p.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ");
  const hLine = (l: { y: number; x0: number; x1: number }, color: string, w: number, key: string) => (
    <line key={key} x1={X(l.x0)} y1={Y(l.y)} x2={X(l.x1)} y2={Y(l.y)} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: pal.cardBg }}>
      <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {hLine(RECT.resistance, pal.candleRed, 3, "res")}
        {hLine(RECT.support, pal.candleRed, 3, "sup")}
        {RECT.levels.map((l, i) => hLine(l, pal.vizBlue, 3, `lv${i}`))}
        <polyline
          points={pts(RECT.rise)}
          fill="none"
          stroke={pal.vizBlue}
          strokeWidth={3}
          strokeDasharray="9 7"
          strokeLinecap="round"
        />
        <polyline
          points={pts([...RECT.pole, ...RECT.swing.slice(1)])}
          fill="none"
          /* indigo — Simon: "garis hitam, ganti jadi garis indigo" */
          stroke={pal.indigo}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// ── Ilusi Kepastian ─────────────────────────────────────────────────────────
type Bar = { o: number; c: number; h: number; l: number };
/** Ten ordinary sessions, drifting up with pullbacks. */
const SOLID: Bar[] = [
  { o: 40, c: 48, h: 52, l: 37 },
  { o: 48, c: 44, h: 51, l: 41 },
  { o: 44, c: 53, h: 56, l: 43 },
  { o: 53, c: 50, h: 57, l: 47 },
  { o: 50, c: 58, h: 61, l: 49 },
  { o: 58, c: 55, h: 60, l: 52 },
  { o: 55, c: 62, h: 65, l: 54 },
  { o: 62, c: 59, h: 64, l: 57 },
  { o: 59, c: 64, h: 67, l: 58 },
  { o: 64, c: 66, h: 69, l: 62 },
];
/** Then three hollow ones rising — "3 candlestick terakhir stylenya hollow
 *  dengan border hitam saja arahnya naik" — which makes thirteen… */
const HOLLOW: Bar[] = [
  { o: 66, c: 71, h: 73, l: 65 },
  { o: 71, c: 76, h: 78, l: 70 },
  { o: 76, c: 81, h: 83, l: 75 },
];
/**
 * …and those three again, MIRRORED DOWNWARD beneath them — Simon: "3
 * candlestick paling kanan harusnya letaknya ada di bawah" the hollow ones.
 * Reflected across the level the hollow run starts from (the last solid
 * close), so from one point the path forks: the same three sessions up, or
 * the same three down. That fork is the whole of "Ilusi Kepastian".
 */
const PIVOT = SOLID[SOLID.length - 1].c;
const MIRROR: Bar[] = HOLLOW.map((d) => ({ o: 2 * PIVOT - d.o, c: 2 * PIVOT - d.c, h: 2 * PIVOT - d.l, l: 2 * PIVOT - d.h }));

export const HollowProjection: React.FC<{ trim: number }> = () => {
  const pal = usePalette();
  /* thirteen columns; the mirrored three share the hollow three's columns */
  const bars = [...SOLID, ...HOLLOW, ...MIRROR];
  const column = (i: number) => (i < SOLID.length + HOLLOW.length ? i : i - HOLLOW.length);
  const cols = SOLID.length + HOLLOW.length;
  const pad = { x: 40, y: 34 };
  const lo = Math.min(...bars.map((d) => d.l));
  const hi = Math.max(...bars.map((d) => d.h));
  const slot = (CARD.w - 2 * pad.x) / cols;
  const bodyW = slot * 0.6;
  const Y = (v: number) => pad.y + ((hi - v) / (hi - lo)) * (CARD.h - 2 * pad.y);
  return (
    <div style={{ position: "absolute", inset: 0, background: pal.cardBg }}>
      <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {bars.map((d, i) => {
          const hollow = i >= SOLID.length;
          const x = pad.x + slot * (column(i) + 0.5);
          const top = Y(Math.max(d.o, d.c));
          const h = Math.max(2, Y(Math.min(d.o, d.c)) - top);
          const color = hollow ? pal.ink : d.c >= d.o ? pal.candleGreen : pal.candleRed;
          const r = Math.min(4, bodyW * 0.28, h / 2);
          return (
            <g key={i}>
              <line x1={x} y1={Y(d.h)} x2={x} y2={Y(d.l)} stroke={color} strokeWidth={2} strokeLinecap="round" />
              <rect
                x={x - bodyW / 2}
                y={top}
                width={bodyW}
                height={h}
                rx={r}
                ry={r}
                /* hollow: the card shows through, only the black edge is drawn */
                fill={hollow ? pal.cardBg : color}
                stroke={hollow ? pal.ink : "none"}
                strokeWidth={hollow ? 2 : 0}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
