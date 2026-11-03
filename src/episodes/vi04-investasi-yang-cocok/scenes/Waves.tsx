/**
 * VI04 · SC04 — "Seberapa Besar Ombak yang Bisa Kamu Tahan?", rebuilt to Benchmark v1 + minimal (STYLE.md §0;
 * Simon, 22 Oct 2026) from the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC04-v2.jpg. The lines are grey;
 * the brand is only the hairlines that point at what the VO says — the shaded fall, the dashed levels, the dots.
 *
 *  A  "Pertanyaan pertama": ONE shot with SC03 — SC03's "Pertanyaan 1 · Ombak" card grows into the question card;
 *     it then stays as the heading.
 *  B  "“Ombak” adalah seberapa dalam investasi kita sempat turun": a line that rises, falls and recovers; its fall
 *     below the earlier high is shaded and measured — that depth is the wave.
 *  C/D "Kita lihat dua contoh nyata." (3 Nov 2026, Simon's new lines and VO): BBRI, its REAL daily closes from the end
 *     of 2019 to the end of March 2024 (data/sc04-prices.json, scripts/vi/sc04-prices.py): bought at 4.400, down to
 *     2.170 in the 2020 fall (Rp10 juta → Rp4,9 juta), 6.050 at the end of March 2024 (→ Rp13,75 juta, "belum
 *     termasuk dividen"). Only the figures the VO says are written on it.
 *  E  "Tapi saham lain bisa punya perjalanan yang berbeda.": the BBRI chart moves aside (its box shrinks — a new
 *     grid, not a scale) for UNVR, its real closes too: bought at 8.400, 2.700 at the end of March 2024 (Rp10 juta →
 *     Rp3,2 juta), still under the buy price. Each card keeps its outcome at its foot. "Dua-duanya adalah kejadian
 *     nyata."
 *  F  the question for YOU: a dashed amber box opening from its centre.
 *  G  "saat harga naik … berani" and "saat market benar-benar turun", linked; "Kalau penurunan sebesar itu membuat kita langsung panik," hangs off the
 *     second (3 Nov: the line and VO RevisiBaru_05).
 *  H  "nggak masalah": the three routes again, and the one with the smallest waves is picked.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, SourceTag, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import PRICES from "../data/sc04-prices.json";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, dockStyle, ease, IsoIcon, Line, QUESTION_CARD, ROUTE_CARD, ROUTE_CARDS, RouteCard, useWords } from "../components/kit";
import { ASK as SC03_ASK, AskCard, AskLead, AskMain, askX } from "./Routes";

const CX = theme.canvas.width / 2;
const LEFT = 140;

type Box = { x: number; y: number; w: number; h: number };
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });
/** Inside a chart box: room above for the labels, a little at the sides. */
type Pad = { l: number; r: number; t: number; b: number };
const PAD: Pad = { l: 40, r: 60, t: 100, b: 30 };
/** The two stocks sit in white cards (Simon, 22 Oct: "kasih pemisah … rectangle rounded corner putih"): room inside for the name, the figures above and the 21% under the low. */
const CARD_PAD: Pad = { l: 90, r: 80, t: 120, b: 110 };
const plot = (b: Box, pad: Pad = PAD) => ({ x: b.x + pad.l, y: b.y + pad.t, w: b.w - pad.l - pad.r, h: b.h - pad.t - pad.b });

/**
 * A price-like line through knots (t 0..1, value): each segment gets a few small zigzags in log space, kept inside
 * `clamp` so the shape never says more than the knots do.
 */
type Knot = [number, number];
const jag = (knots: Knot[], clamp: (t: number, v: number) => number, per = 4, amp = 0.022): Knot[] => {
  const out: Knot[] = [knots[0]];
  for (let s = 0; s < knots.length - 1; s++) {
    const [t0, v0] = knots[s];
    const [t1, v1] = knots[s + 1];
    for (let k = 1; k <= per; k++) {
      const u = k / (per + 1);
      const t = t0 + (t1 - t0) * u;
      const v = Math.exp(Math.log(v0) + (Math.log(v1) - Math.log(v0)) * u) * (1 + (k % 2 === 0 ? 1 : -1) * amp);
      out.push([t, clamp(t, v)]);
    }
    out.push(knots[s + 1]);
  }
  return out;
};

// A — the question card SC03's Ombak card grows into
const Q_CARD = QUESTION_CARD;
/** SC03's card text, measured from the type scale (label line + 4 px + title line), so the hand-over doesn't jump. */
const SC03_TEXT = { titleTop: theme.type.label.size * theme.type.label.leading + 4, h: theme.type.label.size * theme.type.label.leading + 4 + theme.type.title.size * theme.type.title.leading };

// B — what a wave is (a shape, no figures)
const DEF: Box = { x: 260, y: 300, w: 1400, h: 520 };
const DEF_KNOTS: Knot[] = [[0, 100], [0.14, 112], [0.3, 140], [0.42, 118], [0.55, 96], [0.66, 112], [0.8, 150], [1, 176]];
const DEF_PTS = jag(DEF_KNOTS, (_, v) => v, 3, 0.012);
const DEF_LO = 90;
const DEF_HI = 182;
const DEF_PEAK = 0.3;
const DEF_LOW = 0.55;
/** Where the line first gets back above the high it fell from. */
const DEF_BACK = 0.74;

// C–E — two real stocks, their daily closes (scripts/vi/sc04-prices.py); the figures on screen are the series' own,
// the very ones the VO says
type Series = { t: number[]; close: number[]; low: { t: number; close: number } };
const knots = (x: Series): Knot[] => x.t.map((t, i) => [t, x.close[i]]);
/** A chart's height on a log scale, from just under its lowest close to over its highest — room above it for the
 *  buy price's tag under the card's name. */
const logY = (x: Series) => {
  const lo = Math.log(Math.min(...x.close) * 0.92);
  const hi = Math.log(Math.max(...x.close) * 1.3);
  return (v: number) => (Math.log(v) - lo) / (hi - lo);
};
const STOCKS = {
  bbri: { s: PRICES.BBRI as Series, pts: knots(PRICES.BBRI), y: logY(PRICES.BBRI), buy: PRICES.BBRI.close[0], end: PRICES.BBRI.close[PRICES.BBRI.close.length - 1] },
  unvr: { s: PRICES.UNVR as Series, pts: knots(PRICES.UNVR), y: logY(PRICES.UNVR), buy: PRICES.UNVR.close[0], end: PRICES.UNVR.close[PRICES.UNVR.close.length - 1] },
};
/** The series' first and last day as "Des 2019" / "Mar 2024": the month in three letters, the year in four (Simon,
 *  3 Nov 2026: "Di bawah grafik, di atas angka, kasih angka bulan dan tahunnya. 3 huruf bulan, 4 angka tahun"). */
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const monthYear = (iso: string) => `${BULAN[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const SPAN = [monthYear(PRICES.from), monthYear(PRICES.to)] as const;
/** A price as Indonesians write it: 4.400. */
const idr = (v: number) => Math.round(v).toLocaleString("id-ID");
/** Rp10 juta through a stock, at a price: what it became — and how the VO says it (Rp4,9 / Rp13,75 / Rp3,2 juta). */
const STAKE = 10;
const worth = (buy: number, at: number) => (STAKE * at) / buy;
const juta = (v: number, places = 1) => `Rp${(Math.round(v * 10 ** places) / 10 ** places).toString().replace(".", ",")} juta`;
const BBRI_BAL = { low: worth(STOCKS.bbri.buy, STOCKS.bbri.s.low.close), end: worth(STOCKS.bbri.buy, STOCKS.bbri.end) };
const UNVR_BAL = { end: worth(STOCKS.unvr.buy, STOCKS.unvr.end) };

const BIG: Box = { x: LEFT, y: 270, w: 1080, h: 610 };
const HALF_L: Box = { x: LEFT, y: 270, w: 800, h: 560 };
const HALF_R: Box = { x: 980, y: 270, w: 800, h: 560 };
/**
 * BBRI's balance as three cards down the right of its chart (Simon, 3 Nov 2026: "dari Balance 10 juta, lalu muncul
 * tanda panah ke bawah muncul balance baru 4,9juta, lalu muncul lagi tanda panah ke bawah muncul balance baru
 * 13,75juta. Ukurannya dibuat biar fit ketiganya termasuk tanda panah"): the column spans the chart card's own height,
 * each card hugs its lines with the same padding, and the two arrows share what is left.
 */
const BAL = { x: 1280, w: 500, top: BIG.y, bottom: BIG.y + BIG.h, pad: 24, value: 52, note: 24, gap: 12 };
const BAL_LABEL_H = theme.type.label.size * theme.type.label.leading;
const BAL_VALUE_H = BAL.value * theme.type.statement.leading;
const BAL_NOTE_H = BAL.note * theme.type.label.leading;
const BAL_H = [0, 1, 2].map((i) => 2 * BAL.pad + BAL_LABEL_H + 4 + BAL_VALUE_H + (i === 2 ? 2 + BAL_NOTE_H : 0));
const BAL_ARROW = (BAL.bottom - BAL.top - BAL_H[0] - BAL_H[1] - BAL_H[2]) / 2;
const BAL_Y = [BAL.top, BAL.top + BAL_H[0] + BAL_ARROW, BAL.top + BAL_H[0] + BAL_H[1] + 2 * BAL_ARROW];

/** The balance as it counts: one decimal on the way, the VO's own figure once it lands (13,75 has two). */
const balanceText = (v: number, landed: number | null, places = 1) => (landed !== null && Math.abs(v - landed) < 1e-6 ? juta(landed, places) : Math.abs(v - STAKE) < 0.05 ? `Rp${STAKE} juta` : juta(v));
/** The outcome at a card's foot, once the card has gone half-width: one row, left to right (Simon, 3 Nov: "ganti aja
 *  layoutnya, jadi ke kanan. 10juta nya sama besar aja dengan 13.75juta"). `dy`: its top, up from the card's bottom. */
const FOOT = { dy: 62, gap: 16, arrow: 40 };
/** The dates under a chart's plot, over its foot: `dy` below the plot's floor. */
const DATES = { dy: 6, size: 20 };

// F — the question for you
const ASK = { w: 1300, h: 250, y: 400 };

// G — rising and falling
const UPDN = { w: 600, h: 300, y: 330, gap: 120 };
const updnX = (i: number) => CX + (i === 0 ? -UPDN.gap / 2 - UPDN.w : UPDN.gap / 2);

// H — the routes again
// the three cards scaled up to fill the room the closing line used to take (Simon, 22 Oct)
const PICK = { y: 395, gap: 56, k: 1.35 };
const pickX = (i: number) => CX + (i - 1) * (ROUTE_CARD.w * PICK.k + PICK.gap) - (ROUTE_CARD.w * PICK.k) / 2;
/** H's title: one line that rolls up into the next. */
const ROLL = { y: 290, h: 70 };

/**
 * A chart line: knots in a plot box, drawn up to x = `upTo` (px from the plot's left). `fill`: a soft brand wash under
 * the line, fading to nothing at the plot's floor, drawn along with it (Simon, 22 Oct: "kasih fill area di bawah garis").
 */
const ChartLine = ({ pts, yOf, area, upTo, id, fill = false }: { pts: Knot[]; yOf: (v: number) => number; area: Box; upTo: number; id: string; fill?: boolean }) => {
  if (upTo <= 0.5) return null;
  const xy = pts.map(([t, v]) => [area.x + t * area.w, area.y + (1 - yOf(v)) * area.h]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const floor = area.y + area.h;
  const under = `${d} L ${xy[xy.length - 1][0].toFixed(1)} ${floor} L ${xy[0][0].toFixed(1)} ${floor} Z`;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id={id}>
          <rect x={area.x - 20} y={area.y - 80} width={upTo + 20} height={area.h + 160} />
        </clipPath>
        <linearGradient id={`${id}-fill`} x1="0" y1={area.y} x2="0" y2={floor} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={theme.color.connector} stopOpacity={0.18} />
          <stop offset="1" stopColor={theme.color.connector} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill ? <path d={under} fill={`url(#${id}-fill)`} clipPath={`url(#${id})`} /> : null}
      <path d={d} fill="none" stroke={theme.color.neutralDotOn} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${id})`} />
    </svg>
  );
};

/** A point on a line: a white dot ringed with the brand hairline. */
const Dot = ({ x, y, p }: { x: number; y: number; p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return <div style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${theme.color.connector}`, opacity: p, transform: `scale(${(0.6 + 0.4 * p).toFixed(3)})` }} />;
};

/** A figure by a point: a small word over it, the number under. `anchor` says which side of (x, y) it sits on. */
const Tag = ({ x, y, lead, value, p, anchor = "above" }: { x: number; y: number; lead?: string; value: string; p: number; anchor?: "above" | "right" | "below" | "left" }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  const pos =
    anchor === "above" ? { left: x, top: y - 24, transform: "translate(-50%, -100%)", textAlign: "center" as const }
    : anchor === "below" ? { left: x, top: y + 22, transform: "translateX(-50%)", textAlign: "center" as const }
    : anchor === "left" ? { left: x - 26, top: y, transform: "translate(-100%, -50%)", textAlign: "right" as const }
    : { left: x + 26, top: y, transform: "translateY(-50%)", textAlign: "left" as const };
  return (
    <div style={{ position: "absolute", ...pos, opacity: p, whiteSpace: "nowrap" }}>
      {lead ? <div style={{ ...typeStyle("label"), fontSize: 24, color: c.slate }}>{lead}</div> : null}
      <div style={{ ...typeStyle("body"), fontWeight: 600, color: c.ink }}>{value}</div>
    </div>
  );
};

/** A dashed brand hairline. */
const Dash = ({ x1, y1, x2, y2, p = 1 }: { x1: number; y1: number; x2: number; y2: number; p?: number }) =>
  p <= 0.001 ? null : (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.color.connector} strokeWidth={2.5} strokeDasharray="2 9" strokeLinecap="round" />
    </svg>
  );

/** An arrow growing straight down from y0 to y1, its head riding the tip (SC03's arrow, turned). */
const DownArrow = ({ x, y0, y1, p }: { x: number; y0: number; y1: number; p: number }) => {
  if (p <= 0.001) return null;
  const y = y0 + (y1 - y0) * p;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={x} y1={y0} x2={x} y2={y} stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${x - 11} ${y - 13} L ${x} ${y} L ${x + 11} ${y - 13}`} fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** One of BBRI's balance cards: "Balance" and the figure; the last one also has room for "belum termasuk dividen"
 *  (`note`, its opacity). */
const BalanceCard = ({ i, value, color, note }: { i: number; value: string; color: string; note?: number }) => {
  const c = usePalette();
  return (
    <Card x={BAL.x} y={BAL_Y[i]} w={BAL.w} h={BAL_H[i]} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px" }}>
      <div style={{ ...typeStyle("label"), color: c.slate }}>Balance</div>
      <div style={{ marginTop: 4, ...typeStyle("statement"), fontSize: BAL.value, color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {note !== undefined ? <div style={{ marginTop: 2, ...typeStyle("label"), fontSize: BAL.note, color: c.slate, opacity: note }}>belum termasuk dividen</div> : null}
    </Card>
  );
};

/** The first and last month under a plot: one at its left edge, one at its right. */
const Dates = ({ area, opacity }: { area: Box; opacity: number }) => {
  const c = usePalette();
  if (opacity <= 0.001) return null;
  const st = { position: "absolute", top: area.y + area.h + DATES.dy, ...typeStyle("label"), fontSize: DATES.size, color: c.slate, whiteSpace: "nowrap", opacity } as const;
  return (
    <>
      <div style={{ ...st, left: area.x }}>{SPAN[0]}</div>
      <div style={{ ...st, left: area.x + area.w, transform: "translateX(-100%)" }}>{SPAN[1]}</div>
    </>
  );
};

/** "Rp10 juta → Rp…": the stake and what it became at the same size, an arrow between them (Simon, 3 Nov: "'Jadi'
 *  ganti jadi tanda panah aja") — the balance arrows' line and head, turned to the right. */
const Foot = ({ value, color }: { value: string; color: string }) => {
  const c = usePalette();
  const big = { ...typeStyle("body"), fontWeight: 600, fontVariantNumeric: "tabular-nums" } as const;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: FOOT.gap, whiteSpace: "nowrap" }}>
      <div style={{ ...big, color: c.ink }}>Rp{STAKE} juta</div>
      <svg width={FOOT.arrow} height={24} style={{ overflow: "visible", flex: "none" }}>
        <line x1={2} y1={12} x2={FOOT.arrow - 2} y2={12} stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${FOOT.arrow - 13} 3 L ${FOOT.arrow - 2} 12 L ${FOOT.arrow - 13} 21`} fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ ...big, color }}>{value}</div>
    </div>
  );
};

/** The depth of a fall: a bracket from the earlier level down to the low. */
const Depth = ({ x, y0, y1, p }: { x: number; y0: number; y1: number; p: number }) =>
  p <= 0.001 ? null : (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x} y1={y0 + 8} x2={x} y2={y0 + 8 + (y1 - y0 - 22) * p} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${x - 8} ${y0 + 8} L ${x + 8} ${y0 + 8}`} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
      {p > 0.95 ? <path d={`M ${x - 7} ${y1 - 22} L ${x} ${y1 - 14} L ${x + 7} ${y1 - 22}`} fill="none" stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const shadow = useShadow();
  const g = f + BLOCK.SC04;

  /** SC03's Ombak card growing into this scene's question card; SC03's other pieces letting go. */
  const morph = ease(f, 0, m.sec(0.8));
  const leave = ease(f, 0, m.fade);
  const dock = ease(f, W("“Ombak” adalah"), m.move);
  const lerp = (a: number, b: number) => a + (b - a) * morph;
  const defAt = W("“Ombak” adalah");
  const exAt = W("Kita lihat dua contoh");
  const otherAt = W("Tapi saham lain");
  const askAt = W("Jadi pertanyaannya");
  const upAt = W("Saat harga naik");
  const honestAt = W("Yang lebih jujur");
  const panicAt = W("Kalau penurunan sebesar");
  const okAt = W("Kalau belum kuat");

  // B
  const da = plot(DEF);
  const dx = (t: number) => da.x + t * da.w;
  const dy = (v: number) => da.y + (1 - (v - DEF_LO) / (DEF_HI - DEF_LO)) * da.h;
  const defLine = ease(f, defAt + m.sec(0.2), m.sec(1.4));
  const depth = ease(f, W("sempat turun"), m.reveal);
  const peakV = DEF_KNOTS[2][1];
  const lowV = DEF_KNOTS[4][1];
  const shade = DEF_PTS.filter(([t]) => t >= DEF_PEAK && t <= DEF_BACK);

  // C–E: BBRI, big, then moved aside for UNVR
  const aside = ease(f, otherAt, m.move);
  const bb = mixBox(BIG, HALF_L, aside);
  const ba = plot(bb, CARD_PAD);
  const B = STOCKS.bbri;
  const bx = (t: number) => ba.x + t * ba.w;
  const by = (v: number) => ba.y + (1 - B.y(v)) * ba.h;
  const buyB = ease(f, W("Rp4.400"), m.reveal);
  const leg1 = ease(f, W("saat market jatuh"), m.sec(1.6));
  const leg2 = ease(f, W("Tapi kalau tetap dipegang"), m.sec(2.0));
  const lowX = B.s.low.t * ba.w;
  const bUpTo = leg2 > 0 ? lowX + (ba.w - lowX) * leg2 : lowX * leg1;
  const lowB = ease(f, W("Rp2.170"), m.reveal);
  const endB = ease(f, W("Rp6.050"), m.reveal);
  /** Rp10 juta, then an arrow down to Rp4,9 juta (red), then another down to Rp13,75 juta (green): each arrow grows
   *  into place just before its figure is said, and the new card comes up on it. */
  const balAt = [W("investasi Rp10 juta"), W("Rp4,9"), W("Rp13,75")];
  const arrowFor = m.sec(0.6);
  const balArrow = [1, 2].map((i) => ease(f, balAt[i] - arrowFor, arrowFor));
  const U = STOCKS.unvr;
  const oa = plot(HALF_R, CARD_PAD);
  const ox = (t: number) => oa.x + t * oa.w;
  const oy = (v: number) => oa.y + (1 - U.y(v)) * oa.h;
  const buyU = ease(f, W("Rp8.400"), m.reveal);
  const oUpTo = oa.w * ease(f, W("pada akhir Maret"), m.sec(1.6));
  const endU = ease(f, W("Rp2.700"), m.reveal);
  const toLowU = ease(f, W("tinggal sekitar"), m.sec(1.0));
  const balanceU = STAKE + (UNVR_BAL.end - STAKE) * toLowU;
  const balColor = (v: number) => interpolateColors(v, [STAKE - 0.7, STAKE - 0.05, STAKE + 0.05, STAKE + 0.7], [theme.color.calendarRed, c.ink, c.ink, theme.color.checkGreen]);

  // F
  const open = ease(f, askAt + m.sec(0.1), m.sec(0.9));

  // G
  const honest = ease(f, honestAt, m.move);
  /** "Market turun" is the card that matters: it glows indigo once it is up (Simon, 22 Oct). */
  const downGlow = ease(f, honestAt + m.sec(0.3), m.reveal);

  // H
  const pick = ease(f, W("lebih kecil"), m.reveal);
  const roll = ease(f, W("Pilih jalur"), m.move);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — ONE shot with SC03 (no cut; Simon, 22 Oct): it opens on SC03's last picture; the lines and the Kemudi
          card let go, and the Ombak card itself grows into the question — "Pertanyaan 1 · Ombak" becoming
          "Pertanyaan pertama" and, on its words, the question. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
        <AskLead />
        <AskMain />
        <AskCard i={1} />
      </div>
      {/* on "“Ombak” adalah" the question card shrinks into the top left and stays there as the scene's heading
          (Simon, 22 Oct: instead of a separate heading line) */}
      <div style={dockStyle(dock)}>
        <Card x={lerp(askX(0), Q_CARD.x)} y={lerp(SC03_ASK.y, Q_CARD.y)} w={lerp(SC03_ASK.w, Q_CARD.w)} h={lerp(SC03_ASK.h, Q_CARD.h)} style={{ display: "flex", alignItems: "center", gap: lerp(30, 40), padding: `0 ${lerp(40, 56).toFixed(1)}px` }}>
          <IsoIcon name="waves" h={lerp(100, 120)} />
          <div style={{ position: "relative", flex: 1, height: lerp(SC03_TEXT.h, 150) }}>
            <div style={{ position: "absolute", left: 0, top: 0, ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap", opacity: 1 - morph }}>Pertanyaan 1</div>
            <div style={{ position: "absolute", left: 0, top: 0, ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap", opacity: morph }}>Pertanyaan pertama</div>
            <div style={{ position: "absolute", left: 0, top: SC03_TEXT.titleTop, ...typeStyle("title"), color: c.ink, whiteSpace: "nowrap", opacity: 1 - morph }}>Ombak</div>
            <div style={{ position: "absolute", left: 0, top: 46, width: Q_CARD.w - 112 - 120 - 40, ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, W("seberapa besar ombak"), m.reveal) }}>Seberapa besar ombak yang sanggup kamu hadapi?</div>
          </div>
        </Card>
      </div>

      {/* B — what a wave is */}
      <Appear at={defAt} out={exAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {depth > 0.001 ? (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: depth }}>
            <polygon points={[[DEF_PEAK, peakV] as Knot, ...shade, [DEF_BACK, peakV] as Knot].map(([t, v]) => `${dx(t).toFixed(1)},${dy(v).toFixed(1)}`).join(" ")} fill={theme.color.indigoWash} opacity={0.7} />
          </svg>
        ) : null}
        <ChartLine pts={DEF_PTS} yOf={(v) => (v - DEF_LO) / (DEF_HI - DEF_LO)} area={da} upTo={da.w * defLine} id="vi04-sc04-def" />
        <Dash x1={dx(DEF_PEAK)} y1={dy(peakV)} x2={dx(DEF_BACK) + 40} y2={dy(peakV)} p={depth} />
        <Depth x={dx(DEF_LOW)} y0={dy(peakV)} y1={dy(lowV)} p={depth} />
        <Dot x={dx(DEF_LOW)} y={dy(lowV)} p={depth} />
        <Appear at={W("sempat turun") + m.sec(0.2)} style={{ left: dx(DEF_LOW), top: dy(peakV) - 24, transform: "translate(-50%, -100%)", textAlign: "center" }}>
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>“Ombak”</div>
        </Appear>
      </Appear>

      {/* C–E — BBRI, then beside it UNVR: real closes, the VO's figures on them */}
      <Appear at={exAt} out={askAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={bb.x} y={bb.y} w={bb.w} h={bb.h} />
        <Appear at={W("BBRI")} style={{ left: bb.x + CARD_PAD.l, top: bb.y + 36 }}>
          <div style={{ ...typeStyle("label"), color: c.ink, whiteSpace: "nowrap" }}>BBRI</div>
        </Appear>
        <Appear at={W("BBRI")} rise={0} style={{ left: 0, top: 0 }}>
          <SourceTag kind="market" label="BBRI · 1D · IDX" x={bb.x + bb.w - 40} y={bb.y + 66} />
        </Appear>
        <Dash x1={bx(0)} y1={by(B.buy)} x2={bx(1)} y2={by(B.buy)} p={buyB} />
        <ChartLine pts={B.pts} yOf={B.y} area={ba} upTo={bUpTo} id="vi04-sc04-bbri" fill />
        <Depth x={bx(B.s.low.t)} y0={by(B.buy)} y1={by(B.s.low.close)} p={lowB * (1 - aside)} />
        <Dot x={bx(0)} y={by(B.buy)} p={buyB} />
        <Tag x={bx(0) + 10} y={by(B.buy)} lead="Beli" value={idr(B.buy)} p={buyB} />
        <Dot x={bx(B.s.low.t)} y={by(B.s.low.close)} p={lowB} />
        <Tag x={bx(B.s.low.t)} y={by(B.s.low.close)} value={idr(B.s.low.close)} p={lowB * (1 - Math.min(1, aside * 2))} anchor="below" />
        <Dot x={bx(1)} y={by(B.end)} p={endB} />
        <Tag x={bx(1) - 10} y={by(B.end)} value={idr(B.end)} p={endB} />
        <Dates area={ba} opacity={Math.max(0, aside * 2 - 1)} />
        {/* its outcome at its foot once it has moved aside — in the second half of the move, after the low's tag
            has gone from the same spot */}
        <div style={{ position: "absolute", left: bb.x + CARD_PAD.l, top: bb.y + bb.h - FOOT.dy, opacity: Math.max(0, aside * 2 - 1), whiteSpace: "nowrap" }}>
          <Foot value={juta(BBRI_BAL.end, 2)} color={theme.color.checkGreen} />
        </div>

        {/* red under the stake, green above it (Simon, 22 Oct) */}
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - ease(f, otherAt, m.fade) }}>
          <Appear at={balAt[0]} style={{ left: 0, top: 0 }}>
            <BalanceCard i={0} value={`Rp${STAKE} juta`} color={c.ink} />
          </Appear>
          {[0, 1].map((i) => (
            <DownArrow key={i} x={BAL.x + BAL.w / 2} y0={BAL_Y[i] + BAL_H[i] + BAL.gap} y1={BAL_Y[i + 1] - BAL.gap} p={balArrow[i]} />
          ))}
          <Appear at={balAt[1]} style={{ left: 0, top: 0 }}>
            <BalanceCard i={1} value={juta(BBRI_BAL.low)} color={theme.color.calendarRed} />
          </Appear>
          <Appear at={balAt[2]} style={{ left: 0, top: 0 }}>
            <BalanceCard i={2} value={juta(BBRI_BAL.end, 2)} color={theme.color.checkGreen} note={ease(f, W("belum termasuk"), m.reveal)} />
          </Appear>
        </div>

        {/* E — UNVR */}
        <Appear at={otherAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={HALF_R.x} y={HALF_R.y} w={HALF_R.w} h={HALF_R.h} />
          <Appear at={W("UNVR")} style={{ left: HALF_R.x + CARD_PAD.l, top: HALF_R.y + 36 }}>
            <div style={{ ...typeStyle("label"), color: c.ink, whiteSpace: "nowrap" }}>UNVR</div>
          </Appear>
          <Appear at={W("UNVR")} rise={0} style={{ left: 0, top: 0 }}>
            <SourceTag kind="market" label="UNVR · 1D · IDX" x={HALF_R.x + HALF_R.w - 40} y={HALF_R.y + 66} />
          </Appear>
          <Dash x1={ox(0)} y1={oy(U.buy)} x2={ox(1)} y2={oy(U.buy)} p={buyU} />
          <Appear at={W("harga beli")} style={{ left: ox(1), top: oy(U.buy) - 12, transform: "translate(-100%, -100%)" }}>
            <div style={{ ...typeStyle("label"), color: c.indigo, whiteSpace: "nowrap" }}>Harga beli</div>
          </Appear>
          <ChartLine pts={U.pts} yOf={U.y} area={oa} upTo={oUpTo} id="vi04-sc04-unvr" fill />
          <Dates area={oa} opacity={ease(f, W("UNVR"), m.reveal)} />
          <Dot x={ox(0)} y={oy(U.buy)} p={buyU} />
          <Tag x={ox(0) + 10} y={oy(U.buy)} lead="Beli" value={idr(U.buy)} p={buyU} />
          <Dot x={ox(1)} y={oy(U.end)} p={endU} />
          {/* left of its dot, under the line coming down into it (Simon, 3 Nov: "jangan bentrok, taro di sebelah kiri
              titiknya aja") */}
          <Tag x={ox(1)} y={oy(U.end)} value={idr(U.end)} p={endU} anchor="left" />
          <Appear at={W("investasi Rp10 juta", 1)} style={{ left: HALF_R.x + CARD_PAD.l, top: HALF_R.y + HALF_R.h - FOOT.dy }}>
            <Foot value={balanceText(balanceU, toLowU >= 1 ? UNVR_BAL.end : null)} color={balColor(balanceU)} />
          </Appear>
        </Appear>
        <Appear at={W("Dua-duanya")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={900} w={theme.canvas.width} align="center" size={48} weight={500} text="Dua-duanya adalah kejadian nyata." mark="kejadian nyata" />
        </Appear>
      </Appear>

      {/* F — the question for you: a dashed amber box opening from its centre */}
      <Appear at={askAt} out={upAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: CX - (ASK.w * open) / 2, top: ASK.y, width: ASK.w * open, height: ASK.h, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.selfAmber}`, background: c.cardBg, boxSizing: "border-box", opacity: Math.min(1, open * 3) }} />
        <div style={{ position: "absolute", left: CX - ASK.w / 2, top: ASK.y, width: ASK.w, height: ASK.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: ease(f, askAt + m.sec(0.5), m.reveal) }}>
          {/* Simon's two lines, as typed (22 Oct) — no "Jadi pertanyaannya" over them */}
          <div style={{ width: ASK.w - 160, textAlign: "center", ...typeStyle("title"), fontWeight: 500, lineHeight: 1.25, color: c.ink, opacity: ease(f, W("“Kalau ini"), m.reveal) }}>
            Kalau ini terjadi ke uangku,
            <br />
            masih sanggup lanjut ngga?
          </div>
        </div>
      </Appear>

      {/* G — when it rises, when it falls */}
      <Appear at={upAt} out={okAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {(
          [
            { at: upAt, lead: "Market naik", text: "Orang merasa berani", textAt: "semua orang", rise: true, strong: false },
            { at: honestAt, lead: "Market turun", text: "apa yang kita lakukan?", textAt: "apa yang kita", rise: false, strong: true },
          ] as const
        ).map((k, i) => (
          <Appear key={k.lead} at={k.at} style={{ left: 0, top: 0 }}>
            <Card x={updnX(i)} y={UPDN.y} w={UPDN.w} h={UPDN.h} style={i === 0 ? { opacity: 1 - 0.5 * honest } : { boxShadow: `${shadow.soft}, 0 0 ${(44 * downGlow).toFixed(1)}px ${(10 * downGlow).toFixed(1)}px ${theme.color.indigoGlow}` }}>
              <svg width={UPDN.w} height={120} style={{ position: "absolute", left: 0, top: 36 }}>
                <polyline points={(k.rise ? [[60, 96], [150, 70], [210, 84], [300, 46], [360, 58], [440, 18]] : [[60, 18], [150, 44], [210, 32], [300, 70], [360, 58], [440, 100]]).map((p) => p.join(",")).join(" ")} fill="none" stroke={theme.color.neutralDotOn} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={440} cy={k.rise ? 18 : 100} r={8} fill={c.cardBg} stroke={theme.color.connector} strokeWidth={3} />
              </svg>
              <div style={{ position: "absolute", left: 60, top: 170, width: UPDN.w - 120 }}>
                <div style={{ ...typeStyle("label"), color: c.slate }}>{k.lead}</div>
                <div style={{ marginTop: 6, ...typeStyle("body"), fontWeight: k.strong ? 700 : 500, color: k.strong ? c.indigo : c.ink, opacity: ease(f, W(k.textAt), m.reveal) }}>{k.text}</div>
              </div>
            </Card>
          </Appear>
        ))}
        <Connector a={{ x: updnX(0) + UPDN.w, y: UPDN.y + UPDN.h / 2 }} b={{ x: updnX(1), y: UPDN.y + UPDN.h / 2 }} p={ease(f, honestAt, m.sec(0.5))} shape="curve" />
        {/* from "Market turun" down into the middle, over the line it leads to (Simon, 22 Oct: "mengarah ke tengah … curve") */}
        <Connector a={{ x: updnX(1) + UPDN.w / 2, y: UPDN.y + UPDN.h }} b={{ x: CX, y: 772 }} p={ease(f, panicAt, m.sec(0.6))} shape="curve" axis="y" />
        <Appear at={panicAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          {/* Simon's two lines, as typed (22 Oct; the first his new line of 3 Nov); the second bold indigo */}
          <div style={{ position: "absolute", left: updnX(0), top: 785, width: updnX(1) + UPDN.w - updnX(0), textAlign: "center", fontFamily: theme.text.family, fontSize: 40, lineHeight: 1.25 }}>
            <div style={{ fontWeight: 500, color: c.ink }}>Kalau penurunan sebesar itu membuat kita langsung panik,</div>
            <div style={{ fontWeight: 700, color: c.indigo, opacity: ease(f, W("mungkin ombaknya"), m.reveal) }}>mungkin ombak terlalu besar buat kita</div>
          </div>
        </Appear>
      </Appear>

      {/* H — no problem: the smaller waves */}
      {/* "Kalau belum kuat, nggak masalah." rolls up and away; "Pilih jalur …" rolls up into its place */}
      <Appear at={okAt} style={{ left: 0, top: ROLL.y - ROLL.h / 2, width: theme.canvas.width, height: ROLL.h, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, textAlign: "center", lineHeight: `${ROLL.h}px`, fontFamily: theme.text.family, fontSize: 44, fontWeight: 500, color: c.ink, opacity: 1 - roll, transform: `translateY(${(-roll * ROLL.h).toFixed(2)}px)` }}>Kalau belum kuat, nggak masalah.</div>
        <div style={{ position: "absolute", inset: 0, textAlign: "center", lineHeight: `${ROLL.h}px`, fontFamily: theme.text.family, fontSize: 44, fontWeight: 500, color: c.ink, opacity: roll, transform: `translateY(${((1 - roll) * ROLL.h).toFixed(2)}px)` }}>
          Pilih jalur dengan <span style={{ color: c.indigo }}>ombak yang lebih kecil</span>.
        </div>
      </Appear>
      {ROUTE_CARDS.map((r, i) => (
        <Appear key={r.name} at={W("Pilih jalur") - m.sec(0.3) + m.sec(0.1) * i} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: pickX(i), top: PICK.y, transformOrigin: "0 0", transform: `scale(${PICK.k})`, opacity: i === 0 ? 1 : 1 - 0.55 * pick }}>
            <RouteCard i={i} x={0} y={0} draw={1} />
          </div>
        </Appear>
      ))}
    </Stage>
  );
};
