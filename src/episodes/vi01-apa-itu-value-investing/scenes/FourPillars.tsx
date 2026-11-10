/**
 * VI01 · SC02 — "Dari 1929 ke Empat Pilar", from Simon's VISUAL / TEKS LAYAR notes (data/visual-notes.md) and the ChatGPT
 * storyboard docs/vi-style/storyboards/VI01-SC02.png.
 *
 *  A  "Pendekatan ini bukan sesuatu yang baru." as text; then one card: "Pasar Saham Amerika 1929", the change counting down from
 *     +500% to −89%, and the Dow Jones of 1921–1932 as one smooth line with an x-axis and 1929 marked (Simon 10 Nov).
 *  B  "Benjamin Graham kehilangan…": a profile cover of him (camera cut in and out). C  "Setelah itu": his photo, and right of
 *     it the years 1929 → 1933 and 1934–1949 as a sliding strip of year columns, each in focus showing its picture.
 *  D  "Tiga gagasan": Graham goes up to a small tile top left; the pillars rise one per idea (indigo Doric silhouettes, Simon
 *     10 Nov), his words above each, no numbers.
 *  E  "Muridnya, Warren Buffett": Buffett beside Graham, an arrow between them; the fourth pillar on "hanya berinvestasi".
 *  F  "Empat prinsip inilah": the tiles make way for the heading "Value Investing" over the four (his reference's title).
 */
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { cutInStyle, cutOutStyle, theme, typeStyle, useMotion, usePalette, useShadow, type Cut } from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import { ART, Card, Column, PhotoTile, Pic, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — "bukan sesuatu yang baru", then 1929 and what it did (Simon 10 Nov)
const OPEN_LINE = { y: 520, size: 64 };
/**
 * One card (Simon 10 Nov): "Pasar Saham Amerika 1929" on top, under it the change counting down one by one from +500% to −89%, and
 * under that the chart — styled after his reference: a 2 px indigo line, an indigo fill fading to nothing, an x-axis, and
 * 1929 marked with a dashed line and a ringed point.
 */
const CARD_A = { w: 1100, h: 680, x: theme.canvas.width / 2 - 550, y: 190, title: 64, titleSize: 40, num: 150, numSize: 104 };
const CHART = { x: CARD_A.x + 90, y: CARD_A.y + 260, w: CARD_A.w - 180, h: 300, stroke: 2, dot: 9, label: 38 };
/**
 * The Dow Jones through the crash, on its own well-documented turning points (closes): 63,90 on 24 Aug 1921, the peak 381,17
 * on 3 Sep 1929 (+497%, said "+500%"), 198,69 on 13 Nov 1929, the rally to 294,07 on 17 Apr 1930, the bottom 41,22 on 8 Jul
 * 1932 (−89%). Drawn as one smooth curve through them (monotone, so it never overshoots a turning point); no axis, no labels.
 */
const DOW: [number, number][] = [
  [1921.65, 63.9],
  [1929.67, 381.17],
  [1929.87, 198.69],
  [1930.29, 294.07],
  [1932.52, 41.22],
];
const PEAK = 1;
/** Monotone cubic (Fritsch–Carlson) through `pts`, sampled `n` times. */
const smooth = (pts: [number, number][], n: number) => {
  const k = pts.length;
  const d = pts.slice(0, -1).map((p, i) => (pts[i + 1][1] - p[1]) / (pts[i + 1][0] - p[0]));
  const m = pts.map((_, i) => (i === 0 ? d[0] : i === k - 1 ? d[k - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  const out: [number, number][] = [];
  for (let j = 0; j < n; j++) {
    const x = pts[0][0] + ((pts[k - 1][0] - pts[0][0]) * j) / (n - 1);
    let i = 0;
    while (i < k - 2 && x > pts[i + 1][0]) i++;
    const h = pts[i + 1][0] - pts[i][0];
    const t = (x - pts[i][0]) / h;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
    out.push([x, h00 * pts[i][1] + h10 * h * m[i] + h01 * pts[i + 1][1] + h11 * h * m[i + 1]]);
  }
  return out;
};
const CURVE = smooth(DOW, 240);
const PEAK_AT = CURVE.findIndex(([x]) => x >= DOW[PEAK][0]);
const cx = (x: number) => CHART.x + ((x - DOW[0][0]) / (DOW[DOW.length - 1][0] - DOW[0][0])) * CHART.w;
const cy = (v: number) => CHART.y + CHART.h - (v / 400) * CHART.h;

// B — "Benjamin Graham kehilangan…": a profile cover (Simon 10 Nov, after an ETHOS designer profile): his name and what he
// is called in indigo upper left, a thin arrow curving from them down to him, his photo (Simon's, cleaned up in ChatGPT) in
// black and white lower right, in front of a solid indigo disc and three thin rings that run off the frame.
/** All of it inside one white card, 1600 × 700 in the middle of the frame (Simon 10 Nov: "cover pagenya dalam kartu"); the
 * disc, rings and arrow in cyan ("warna elemennya cyan aja"), the name in indigo. Positions are the card's own. */
const COVER = { card: { x: 160, y: 190, w: 1600, h: 700 }, nameX: 120, nameY: 150, nameSize: 92, titleSize: 46, personCx: 1150, personH: 650, discCx: 1170, discCy: 730, discR: 400, rings: [470, 560, 660] };
const TITLE = "Bapak Value Investing";
/** The photo's own size (public/art/vi01/graham-overcoat.png). */
const PHOTO = { w: 1165, h: 1350 };
/** The arrow: from beside him up to under his title, its head pointing at the words. */
const ARROW = { from: [600, 500], via: [210, 490], to: [210, 345] } as const;

// C — Graham, and right of his photo every year from 1929 to 1949 in order, none skipped (Simon 10 Nov), as a strip of
// year columns over a tick ruler (his "Development Path" reference): the year in focus dark, the rest pale; the strip slides
// right to left, slowly through 1929–1934 while the VO says "bertahun-tahun", then on to 1949 for The Intelligent Investor.
// Only years with a documented event carry a label.
const GRAHAM = { x: 240, y: 230, d: 400 };
/**
 * 1929 to 1933 a column each, then one column 1934–1949 for the two books (Simon 10 Nov: "hapus aja 1935-1949"). Under the
 * ruler, the year in focus shows its picture: the Dow Jones in 1929 (his chart, another company's logo painted out) and the
 * two books (his photo).
 */
const YEARS = [
  { year: "1929", label: "Crash", pic: { src: "art/vi01/sc02-dow-1929.png", w: 1215, h: 918 } },
  { year: "1930" },
  { year: "1931" },
  { year: "1932", label: "Pasar di titik terendah" },
  { year: "1933" },
  { year: "1934–1949", label: "Security Analysis & The Intelligent Investor", pic: { src: "art/vi01/sc02-buku-graham.jpg", w: 800, h: 648 } },
] as { year: string; label?: string; pic?: { src: string; w: number; h: number } }[];
const STRIP = { left: 700, right: theme.canvas.width - 96, focus: 760, col: 310, top: 250, year: 76, label: 26, ruleTop: 420, ruleH: 60, ticks: 9, picTop: 510, picW: 420 };

// D, E — the two of them small, top left
const TOP = { y: 100, d: 150, gap: 24, graham: 230, buffett: 860 };

// D–F — the pillars, after Simon's "Pillar Infographic" reference (10 Nov): each column `w` wide with his words above it (no
// numbers, bottom-aligned), the pillar `col` wide and `h` tall under them, all four the same height ("buat pillarnya sama
// tinggi"), going from cyan to indigo. 0.81 of the first build (two of his "kecilin 10%"), centred where he last put it.
const K = 0.81;
const PILLAR = { w: 340 * K, gap: 50 * K, col: 150, h: 340, text: 34 * K, label: 92 }; // col : h as slim as his reference (≈ 1 : 2.3)
const LABEL_Y = 423;
const PILLARS = [
  { text: "Beli saham =\nBeli perusahaan", at: "Pertama" },
  { text: "Beli murah", at: "Kedua" },
  { text: "Manfaatkan market", at: "Ketiga" },
  { text: "Investasi pada bisnis yang dipahami", at: "hanya berinvestasi" },
] as const;
const ROW = 4 * PILLAR.w + 3 * PILLAR.gap;
const pillarX = (i: number) => CX - ROW / 2 + i * (PILLAR.w + PILLAR.gap);
const BOTTOM = LABEL_Y + PILLAR.label + PILLAR.h;
/** F — the heading, where his reference has its title. */
const HEADING = { y: 250, size: 64 };

/** A portrait tile: the real photo, from the kit (Simon 10 Nov). */
const Portrait = ({ name, x, y, d, p = 1 }: { name: "graham" | "buffett"; x: number; y: number; d: number; p?: number }) =>
  p <= 0.001 ? null : <PhotoTile name={name} d={d} style={{ left: x, top: y, opacity: p }} />;

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);

  const openLine = ease(f, W("Pendekatan"), m.reveal) * (1 - ease(f, W("Pada") - m.fade, m.fade));
  const yearP = ease(f, W("Pada"), m.reveal);
  /** the rise is drawn up to the 1929 peak as +500% shows; from "mengalami (crash)" the number counts down to −89% while the fall is drawn */
  const rise = ease(f, W("1929") + m.sec(0.3), W("pasar") - W("1929"));
  const fall = ease(f, W("mengalami"), m.sec(1.4));
  const pct = Math.round(mix(500, -89, fall));
  const pctText = pct > 0 ? `+${pct}%` : pct < 0 ? `−${-pct}%` : "0%";
  const pctTone = pct > 0 ? theme.color.ok : pct < 0 ? theme.color.crossRed : c.ink;
  const mark = Math.min(1, Math.max(0, (rise * PEAK_AT - (PEAK_AT - 3)) / 3));
  // two cuts: the 1929 card → the cover on "Benjamin", the cover → the story on "Setelah itu"
  const toCover: Cut = { at: W("Benjamin"), axis: "x", ...CUT };
  const toStory: Cut = { at: W("Setelah"), axis: "x", ...CUT };
  const aOut = f >= toCover.at ? 1 : 0;
  const cover = f >= toCover.at && f < toStory.at;
  const coverIn = (d: number) => ease(f, toCover.at + d, m.reveal);

  const grahamIn = f >= toStory.at ? 1 : 0;
  const toTop = ease(f, W("Tiga gagasan"), m.move);
  const booksOut = ease(f, W("Tiga gagasan") - m.fade, m.fade);
  const buffettIn = ease(f, W("Muridnya"), m.reveal);
  const link = ease(f, W("Warren"), m.move);
  const topOut = ease(f, W("Empat prinsip") - m.fade, m.fade);
  const heading = ease(f, W("Empat prinsip"), m.reveal);

  const g = { x: mix(GRAHAM.x, TOP.graham, toTop), y: mix(GRAHAM.y, TOP.y, toTop), d: mix(GRAHAM.d, TOP.d, toTop) };
  /** the column in focus: 1929 (0) → 1934–1949 (5) across "bertahun-tahun … Security" */
  const focus = 5 * ease(f, W("bertahun-tahun"), W("Security") - W("bertahun-tahun"));

  // the curve drawn up to its peak with the rise, then on to the bottom with the fall
  const upto = Math.round(rise * PEAK_AT + fall * (CURVE.length - 1 - PEAK_AT));
  const line = CURVE.slice(0, Math.max(2, upto + 1)).map(([x, v], i) => `${i ? "L" : "M"} ${cx(x).toFixed(1)} ${cy(v).toFixed(1)}`).join(" ");
  const tip = CURVE[Math.max(1, upto)];
  const base = CHART.y + CHART.h;
  const area = `${line} L ${cx(tip[0]).toFixed(1)} ${base} L ${cx(CURVE[0][0]).toFixed(1)} ${base} Z`;

  return (
    <>
      {/* A — the opening line, then 1929 with its rise and fall */}
      {openLine > 0.001 ? (
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: OPEN_LINE.y, transform: `translateY(${((1 - openLine) * 16 - 50).toFixed(1)}%)`, textAlign: "center", opacity: openLine, ...typeStyle("title"), fontSize: OPEN_LINE.size, fontWeight: 500, color: c.ink }}>Pendekatan ini bukan sesuatu yang baru.</div>
      ) : null}
      {yearP > 0.001 && aOut < 0.999 ? (
        <div style={{ position: "absolute", left: CARD_A.x, top: CARD_A.y, width: CARD_A.w, height: CARD_A.h, opacity: yearP * (1 - aOut), ...(f >= toCover.at - toCover.over / 2 ? cutOutStyle(f, toCover) : {}), transform: `translateY(${((1 - yearP) * 18).toFixed(1)}px)` }}>
          <Card x={0} y={0} w={CARD_A.w} h={CARD_A.h}>
            <div style={{ position: "absolute", left: 0, right: 0, top: CARD_A.title, textAlign: "center", ...typeStyle("title"), fontSize: CARD_A.titleSize, fontWeight: 500, color: c.ink }}>Pasar Saham Amerika 1929</div>
            {/* the change, counting one by one: +500%, +499% … 0% … −89% */}
            <div style={{ position: "absolute", left: 0, right: 0, top: CARD_A.num, textAlign: "center", ...typeStyle("title"), fontSize: CARD_A.numSize, fontWeight: 600, letterSpacing: -2, lineHeight: 1, color: pctTone, fontVariantNumeric: "tabular-nums" }}>{pctText}</div>
          </Card>
          {rise > 0.001 ? (
            <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: -CARD_A.x, top: -CARD_A.y, overflow: "visible" }}>
              <defs>
                <linearGradient id="dow-fill" x1="0" y1={CHART.y} x2="0" y2={base} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={c.indigo} stopOpacity={0.32} />
                  <stop offset="1" stopColor={c.indigo} stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Simon asked for this fill to be transparent (an exception to the opaque-fills rule) */}
              <path d={area} fill="url(#dow-fill)" />
              <line x1={CHART.x} y1={base} x2={CHART.x + CHART.w} y2={base} stroke={theme.color.skeleton} strokeWidth={2} />
              {/* 1929: the peak, marked as in his reference */}
              {mark > 0.001 ? (
                <g opacity={mark}>
                  <line x1={cx(DOW[PEAK][0])} y1={cy(DOW[PEAK][1])} x2={cx(DOW[PEAK][0])} y2={base} stroke={c.indigo} strokeWidth={2} strokeDasharray="6 8" />
                  <circle cx={cx(DOW[PEAK][0])} cy={cy(DOW[PEAK][1])} r={CHART.dot * 1.7} fill={c.cardBg} stroke={c.indigo} strokeWidth={CHART.stroke} />
                  <circle cx={cx(DOW[PEAK][0])} cy={cy(DOW[PEAK][1])} r={CHART.dot * 0.9} fill={c.indigo} />
                  <text x={cx(DOW[PEAK][0])} y={base + CHART.label + 4} textAnchor="middle" fontFamily={theme.text.family} fontSize={CHART.label * 0.8} fontWeight={600} fill={c.ink}>1929</text>
                </g>
              ) : null}
              <path d={line} fill="none" stroke={c.indigo} strokeWidth={CHART.stroke} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={cx(tip[0])} cy={cy(tip[1])} r={CHART.dot * 0.7} fill={c.indigo} />
            </svg>
          ) : null}
        </div>
      ) : null}

      {/* B — the cover, in its card */}
      {cover ? (
        <div style={{ position: "absolute", inset: 0, ...(f < toCover.at + toCover.over / 2 ? cutInStyle(f, toCover) : f >= toStory.at - toStory.over / 2 ? cutOutStyle(f, toStory) : {}) }}>
          <div style={{ position: "absolute", left: COVER.card.x, top: COVER.card.y, width: COVER.card.w, height: COVER.card.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, overflow: "hidden" }}>
            <svg width={COVER.card.w} height={COVER.card.h} style={{ position: "absolute", left: 0, top: 0 }}>
              {COVER.rings.map((r, i) => (
                <circle key={r} cx={COVER.discCx} cy={COVER.discCy} r={r * mix(0.9, 1, coverIn(6 + i * 5))} fill="none" stroke={c.cyan} strokeWidth={2} opacity={coverIn(6 + i * 5)} />
              ))}
              <circle cx={COVER.discCx} cy={COVER.discCy} r={COVER.discR * mix(0.82, 1, coverIn(0))} fill={c.cyan} />
              {/* the arrow draws from him to his name */}
              {coverIn(24) > 0.001 ? (
                <g fill="none" stroke={c.cyan} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d={`M ${ARROW.from[0]} ${ARROW.from[1]} Q ${ARROW.via[0]} ${ARROW.via[1]} ${ARROW.to[0]} ${ARROW.to[1]}`} pathLength={1} strokeDasharray={`${coverIn(24).toFixed(3)} 1`} />
                  {coverIn(24) > 0.95 ? <path d={`M ${ARROW.to[0] - 12} ${ARROW.to[1] + 16} L ${ARROW.to[0]} ${ARROW.to[1]} L ${ARROW.to[0] + 12} ${ARROW.to[1] + 16}`} /> : null}
                </g>
              ) : null}
            </svg>
            <Pic src={staticFile("art/vi01/graham-overcoat.png")} style={{ position: "absolute", left: COVER.personCx - (COVER.personH * PHOTO.w) / PHOTO.h / 2, top: COVER.card.h - COVER.personH + (1 - coverIn(4)) * 30, width: (COVER.personH * PHOTO.w) / PHOTO.h, height: COVER.personH }} />
            <div style={{ position: "absolute", left: COVER.nameX + (1 - coverIn(10)) * -30, top: COVER.nameY, opacity: coverIn(10), ...typeStyle("title"), fontSize: COVER.nameSize, fontWeight: 700, letterSpacing: -1, lineHeight: 1, color: c.indigo, whiteSpace: "nowrap" }}>Benjamin Graham</div>
            <div style={{ position: "absolute", left: COVER.nameX + 6 + (1 - coverIn(16)) * -30, top: COVER.nameY + COVER.nameSize + 18, opacity: coverIn(16), ...typeStyle("label"), fontSize: COVER.titleSize, fontWeight: 500, color: c.indigo, whiteSpace: "nowrap" }}>{TITLE}</div>
          </div>
        </div>
      ) : null}

      {/* C–E: Graham, then small at the top with Buffett */}
      {grahamIn > 0.001 && topOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: grahamIn * (1 - topOut), ...(f < toStory.at + toStory.over / 2 ? cutInStyle(f, toStory) : {}) }}>
          <Portrait name="graham" x={g.x} y={g.y} d={g.d} />
          <div style={{ position: "absolute", left: mix(g.x + g.d / 2, g.x + g.d + TOP.gap, toTop), top: mix(g.y + (g.d * ART.graham.h) / ART.graham.w + 28, g.y + g.d / 2, toTop), transform: `translate(${(-50 * (1 - toTop)).toFixed(1)}%, ${(-50 * toTop).toFixed(1)}%)`, ...typeStyle("label"), fontSize: mix(40, 34, toTop), fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Benjamin Graham</div>
        </div>
      ) : null}
      {/* C: the years, sliding right to left */}
      {grahamIn > 0.001 && booksOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - booksOut, clipPath: `inset(0 ${theme.canvas.width - STRIP.right}px 0 ${STRIP.left}px)`, ...(f < toStory.at + toStory.over / 2 ? cutInStyle(f, toStory) : {}) }}>
          {YEARS.map((col, i) => {
            const x = STRIP.focus + (i - focus) * STRIP.col;
            if (x > STRIP.right + 20 || x + STRIP.col < STRIP.left - 20) return null;
            const on = Math.abs(i - focus) < 0.5;
            const near = Math.max(0, 1 - Math.abs(i - focus) * 2);
            const last = i === YEARS.length - 1;
            return (
              <div key={col.year}>
                <div style={{ position: "absolute", left: x, top: STRIP.top - 20, width: 2, height: STRIP.ruleTop + STRIP.ruleH - STRIP.top + 40, background: on ? c.ink : theme.color.neutralDot }} />
                <div style={{ position: "absolute", left: x + 28, top: STRIP.top, ...typeStyle("title"), fontSize: STRIP.year, fontWeight: 500, lineHeight: 1, color: on ? c.ink : theme.color.neutralDot, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{col.year}</div>
                {col.label ? <div style={{ position: "absolute", left: x + 30, top: STRIP.top + STRIP.year + 16, width: last ? 560 : STRIP.col - 50, ...typeStyle("label"), fontSize: STRIP.label, fontWeight: 500, lineHeight: 1.25, color: on ? c.ink : theme.color.neutralDot }}>{col.label}</div> : null}
                {Array.from({ length: last ? STRIP.ticks * 2 : STRIP.ticks }, (_, k) => (
                  <div key={k} style={{ position: "absolute", left: x + ((k + 1) * STRIP.col) / (STRIP.ticks + 1), top: STRIP.ruleTop, width: 2, height: STRIP.ruleH, borderRadius: 1, background: theme.color.skeleton }} />
                ))}
                {/* the picture of the year in focus, in the space under the ruler */}
                {col.pic && near > 0.001 ? (
                  <Pic src={staticFile(col.pic.src)} style={{ position: "absolute", left: x + 30, top: STRIP.picTop + (1 - near) * 16, width: STRIP.picW, height: (STRIP.picW * col.pic.h) / col.pic.w, borderRadius: 16, overflow: "hidden", boxShadow: shadow.soft, opacity: near }} />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {buffettIn > 0.001 && topOut < 0.999 ? (
        <div style={{ opacity: buffettIn * (1 - topOut) }}>
          <Portrait name="buffett" x={TOP.buffett} y={TOP.y} d={TOP.d} />
          <div style={{ position: "absolute", left: TOP.buffett + TOP.d + TOP.gap, top: TOP.y + TOP.d / 2, transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Warren Buffett</div>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {link > 0.001 ? (
              <g fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <line x1={TOP.graham + TOP.d + 330} y1={TOP.y + TOP.d / 2} x2={mix(TOP.graham + TOP.d + 330, TOP.buffett - 24, link)} y2={TOP.y + TOP.d / 2} />
                {link > 0.95 ? <path d={`M ${TOP.buffett - 40} ${TOP.y + TOP.d / 2 - 14} L ${TOP.buffett - 24} ${TOP.y + TOP.d / 2} L ${TOP.buffett - 40} ${TOP.y + TOP.d / 2 + 14}`} /> : null}
              </g>
            ) : null}
          </svg>
        </div>
      ) : null}

      {/* D–F: the pillars, and the heading */}
      {PILLARS.map((pl, i) => {
        const p = ease(f, W(pl.at), m.move);
        if (p <= 0.001) return null;
        const x = pillarX(i);
        const tone = interpolateColors(i / 3, [0, 1], [c.cyan, c.indigo]);
        const ink = interpolateColors(i / 3, [0, 1], [theme.color.cyanInk, c.indigo]);
        const h = PILLAR.h;
        return (
          <div key={pl.text}>
            <div style={{ position: "absolute", left: x + (PILLAR.w - PILLAR.col) / 2, top: BOTTOM - h, width: PILLAR.col, height: h, clipPath: `inset(${((1 - p) * 100).toFixed(2)}% -20px 0 -20px)` }}>
              <Column w={PILLAR.col} h={h} tone={tone} />
            </div>
            <div style={{ position: "absolute", left: x - PILLAR.gap / 2 + 5, width: PILLAR.w + PILLAR.gap - 10, top: LABEL_Y, height: PILLAR.label - 14, display: "flex", alignItems: "flex-end", justifyContent: "center", textAlign: "center", whiteSpace: "pre-line", ...typeStyle("label"), fontSize: PILLAR.text, fontWeight: 600, lineHeight: 1.25, color: ink, opacity: ease(f, W(pl.at) + m.move / 2, m.fade) }}>{pl.text}</div>
          </div>
        );
      })}
      {heading > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEADING.y + (1 - heading) * 20, textAlign: "center", ...typeStyle("title"), fontSize: HEADING.size, fontWeight: 700, color: c.ink, opacity: heading }}>Value Investing</div>
      ) : null}
    </>
  );
};
