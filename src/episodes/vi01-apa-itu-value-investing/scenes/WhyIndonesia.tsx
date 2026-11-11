/**
 * VI01 · SC04 — "Kenapa Relevan untuk Investor Indonesia?", rebuilt in IN07's look (Simon 11 Nov: "samain kayak IN07 …
 * Abaikan catatan dari scriptnya. Kalau mau nunjukkin chart, samain kayak di scene 2") from the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC04-v2.png: the grid paper, a numbered heading per reason, one big picture at a time,
 * a camera cut between pictures, charts as SC02's.
 *
 *  A   the question in the middle, three numbered rings under it.
 *  1   "Harga bergerak cepat" — three cards in one frame (Simon 11 Nov: "3 kartu ini bisa digabung aja deh dalam 1 frame"):
 *      the chart on the right, price swinging round a calm value line; on "Investor ritel" the bar of the IDX's daily
 *      trading value top left, Ritel 52% and Asing 30% (BEI, average daily value 2026 to 11 Feb — Jeffrey Hendrik, 12 Feb
 *      2026); on "Saat sentimen" IN07 SC07's gauge as Sentimen bottom left, the swings grown, the gap from value marked.
 *      Then Orang Tuntun and the insight line.
 *  2   "Bisnis jangka panjang" — C1 a field of companies, then Bank · Consumer · Telco; C2 profit rising for decades with a
 *      dividend each year (a shape, no figures), a magnifier on "bisa dipelajari".
 *  3   "Tidak harus menatap layar" — D1 a ticking screen, crossed out; D2 the day (Kerja) and the night (Baca laporan);
 *      D3 an analysis note filling up, one line struck through and rewritten.
 */
import { interpolateColors, random, staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { AreaLine, BoardGrid, Card, Gauge, Glyph, Heading, Line, NumRing, ORANG_TUNTUN_RIGHT, OrangTuntun, Pic, RingMark, Shot, ease, inBox, useWords, type Box } from "../components/kit";

const CX = theme.canvas.width / 2;
const CY = 590;

/** A chart card's plot (SC02's chart in a card). */
const plotIn = (ch: Box): Box => ({ x: ch.x + 90, y: ch.y + 80, w: ch.w - 280, h: ch.h - 200 });
/**
 * 1 — the three cards of one frame: the bar top left, the sentiment gauge under it — IN07 SC07's "Percaya diri" gauge, here
 * named Sentimen, its needle swinging between the red and the green end (Simon 11 Nov: "pas ngomong 'sentimen berubah...'
 * tambah kartu di sebelah kiri … parameter sentimen percaya diri dari IN07 scene 7") — and the chart right of them.
 */
const BARCARD: Box = { x: 140, y: 290, w: 560, h: 300 };
const SENT: Box = { x: 140, y: 620, w: 560, h: 330 };
const CH1: Box = { x: BARCARD.x + BARCARD.w + 40, y: 290, w: theme.canvas.width - 140 - (BARCARD.x + BARCARD.w + 40), h: 660 };
const SWING = { mid: 90, amp: 72, period: 1.8 };

// 1 — price round value: value climbs gently, price swings round it (`amp` grows when sentiment turns). Simon 11 Nov: "bisa
// buat lebih volatil ga grafiknya?" — wider swings and two faster ripples on top, so it moves like a price, not a wave.
const N = 320;
const valueAt = (t: number) => 0.4 + 0.12 * t;
const TAU = Math.PI * 2;
const priceAt = (t: number, amp: number) =>
  valueAt(t) + amp * (0.5 * Math.sin(t * TAU * 3.2 + 0.4) + 0.28 * Math.sin(t * TAU * 7.1 + 1.3) + 0.14 * Math.sin(t * TAU * 13.3 + 2.1) + 0.08 * Math.sin(t * TAU * 23.7 + 0.7));
const AMP = { calm: 0.22, wild: 0.36 };
/** "hanya ilustrasi" as SC01's (Simon 11 Nov: "kasih label hanya ilustrasi yang kayak scene 01"), inside the chart card at its bottom-left corner ("taro di dalam kartu kanan, taro di pojok kiri bawah"). */
const TAG = { dot: 14, gap: 12, size: 26, inset: 34 };
/** Where price stands furthest above value once the swings have grown — the gap B3 marks, inside the chart, not at its end. */
const GAP_T = (() => {
  let best = 0.3;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    if (t > 0.2 && t < 0.8 && priceAt(t, AMP.wild) - valueAt(t) > priceAt(best, AMP.wild) - valueAt(best)) best = t;
  }
  return best;
})();
/** The names at the lines' right ends never closer than this. */
const LABEL_GAP = 48;
const BAR = { x: BARCARD.x + 40, y: BARCARD.y + 100, w: BARCARD.w - 80, h: 96, r: 24, label: 24 };
/** The two left cards' titles: bold, 36 px (Simon 11 Nov: "buat jadi bold dan kecilin 4 px"); the gauge at 90 % ("perkecil 10%"). */
const SIDE_TITLE = { size: 36, weight: 700, top: 28 };
const GAUGE_K = 0.9;
/** Ritel green, Asing indigo, each named above its part of the bar (Simon 11 Nov). */
const SHARES = [
  { label: "Ritel", v: 52, text: "52%", at: "Investor ritel", tone: theme.color.gainGreen },
  { label: "Asing", v: 30, text: "30%", at: "Investor asing", tone: "indigo" },
] as const;

// 2 — one frame, two cards with real data (Simon 11 Nov: "Bagian 2 … visualnya polos2 … kayak gaada value nya … asal lewat
// doang"): how many companies there are, and one of each sector the VO names, on one year axis from its listing to now.
const COUNT = { n: 956, src: "Sumber: BEI, akhir 2025" };
const LEFT2: Box = { x: 140, y: 290, w: 480, h: 650 };
const RIGHT2: Box = { x: LEFT2.x + LEFT2.w + 40, y: 290, w: theme.canvas.width - 140 - (LEFT2.x + LEFT2.w + 40), h: 650 };
/** Listing dates: BBCA 31 May 2000 (IPO), UNVR 11 Jan 1982 (KSEI), TLKM 14 Nov 1995 (Telkom IR). Dividends for FY 2025: BBCA Rp41,3 T
 * (RUPST 12 Mar 2026), UNVR Rp7,63 T (RUPST 4 Jun 2026), TLKM Rp21,9 T (RUPST 8 Jun 2026). */
/** `more`: two more listed names of the sector beside the one charted, then a "+" (Simon 11 Nov: "tambahin label saham yang lain
 * sampe 3, lalu di kanan labelnya di kasih icon +"); EXCL kept its code after the XL–Smartfren merger (April 2025). */
const LISTED = [
  { icon: "bank", sector: "Bank", ticker: "BBCA", more: ["BBRI", "BMRI"], since: 2000, div: "Rp41,3 T", at: "Bank." },
  { icon: "shopping-cart", sector: "Consumer", ticker: "UNVR", more: ["ICBP", "INDF"], since: 1982, div: "Rp7,63 T", at: "Consumer." },
  { icon: "cell-signal-full", sector: "Telco", ticker: "TLKM", more: ["ISAT", "EXCL"], since: 1995, div: "Rp21,9 T", at: "Telekomunikasi." },
] as const;
const NOW = 2026;
/** The two cards at 84 %, and the conclusion line under them (Simon 11 Nov: "di bagian bawah mau ditambah suatu text kesimpulan … jadi perkecil keseluruhan kartu ini"). */
const GROUP2 = { k: 0.84, line: 902, text: "Ada bisnis nyata yang bisa dipelajari", mark: "bisa dipelajari" };
const AXIS2 = { x0: 430, x1: 850, y0: 1980, rowTop: 120, rowH: 150, bar: 26, divX: 890, divW: 190 };
const yearX = (y: number) => AXIS2.x0 + ((y - AXIS2.y0) / (NOW - AXIS2.y0)) * (AXIS2.x1 - AXIS2.x0);

// 3 — first, on "nggak menuntut kita untuk terus menatap layar", an orderbook and a tradebook whose numbers change every second
// (Simon 11 Nov) — the screen you don't have to watch; numbers made up, no ticker. Then a cut to one frame of three cards: the
// day as a schedule (Simon 11 Nov, his "Work Time" reference: days as pills, From/To over a range slider) — work by day, the
// reports at night; the four financial reports a year; a note that keeps its years and its corrections.
const SCHED: Box = { x: 140, y: 290, w: 820, h: 620 };
/** Right of the schedule: Orang Kerja (IN01's cut-out) by day, then Simon's OrangAnalisa.png at night with its two labels. */
const SIDE: Box = { x: SCHED.x + SCHED.w + 40, y: 290, w: theme.canvas.width - 140 - (SCHED.x + SCHED.w + 40), h: 650 };
const KERJA = { src: "art/in01/orang-kerja.png", w: 1448, h: 1086 };
const ANALISA = { src: "art/vi01/orang-analisa.png", w: 1254, h: 1254, d: 540 };
/** One schedule entry, its bar drawn from `from` to `to` like a trim path (Simon 11 Nov: "trim path dari jam 09.00 lalu terisi hingga
 * 18.00 … dari jam 20.00-23.00"); the day pills came out ("gambar 1 remove"). */
const SLOTS = [
  { name: "Kerja", from: 9, to: 18, at: "bekerja di", tone: "ink" },
  { name: "Baca laporan", from: 20, to: 23, at: "Lalu malamnya", tone: "indigo" },
] as const;
const ROW = { top: 120, h: 200, pad: 50, track: 18, knob: 30 };
/** "hh.mm", in whole minutes (so 8.999 h reads 09.00, never 08.60). */
const clock = (h: number) => {
  const min = Math.round(h * 60);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}.${String(min % 60).padStart(2, "0")}`;
};
const BOOK = { y: 290, h: 600, w: 780, gap: 40, rows: 10, rowH: 44, head: 110, mid: 4500, tick: 10, flash: 15 };
const bookX = (i: number) => theme.canvas.width / 2 - (2 * BOOK.w + BOOK.gap) / 2 + i * (BOOK.w + BOOK.gap);
const lot = (n: number) => Math.round(n).toLocaleString("id-ID");
/** A number that changes on some seconds only: its value at second `sec` is the draw of the last second it changed on. */
const sticky = (key: string, sec: number, odds: number, lo: number, hi: number) => {
  let t = sec;
  while (t > sec - 30 && random(`${key}-chg-${t}`) > odds) t--;
  return { v: lo + random(`${key}-v-${t}`) * (hi - lo), changedAt: t };
};

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;
  const B = BLOCK.SC04;
  /** A cut lands a little before its word, so the new picture is there as the word starts. */
  const cut = (phrase: string) => W(phrase) - m.sec(0.15);
  const END = BLOCK.SC05 - BLOCK.SC04;

  const A1 = cut("Pertama");
  const S = cut("Saat sentimen");
  const V = cut("Bagi value");
  const K2 = cut("Kedua");
  const K3 = cut("Ketiga");

  // 1 — the chart: drawn first, its swings grown when sentiment turns, the gap marked
  const valueDraw = ease(f, A1, m.sec(0.8));
  const priceDraw = ease(f, W("harga di"), m.sec(2.6));
  const amp = AMP.calm + (AMP.wild - AMP.calm) * ease(f, W("Saat sentimen") + m.sec(0.2), m.sec(1.2));
  const gapP = ease(f, W("jauh dari value"), m.reveal);
  const pricePts = Array.from({ length: N }, (_, i) => [i / (N - 1), priceAt(i / (N - 1), amp)] as [number, number]);
  const needle = SWING.mid + SWING.amp * ease(f, S, m.sec(0.8)) * Math.sin(((f - S) / m.sec(SWING.period)) * Math.PI * 2);
  const chart = () => {
    const CH = CH1;
    const PLOT = plotIn(CH);
    const valueEnd = inBox(PLOT, [1, valueAt(1)]);
    const priceEnd = inBox(PLOT, [1, priceAt(1, amp)]);
    const spread = Math.max(0, LABEL_GAP - (valueEnd[1] - priceEnd[1])) / 2;
    const gapTop = inBox(PLOT, [GAP_T, priceAt(GAP_T, amp)]);
    const gapBottom = inBox(PLOT, [GAP_T, valueAt(GAP_T)]);
    return (
    <Card x={CH.x} y={CH.y} w={CH.w} h={CH.h}>
      {/* its title, as the two left cards' (Simon 11 Nov: "Kartu kanan kasih judul, 'Harga vs Value'") */}
      <div style={{ position: "absolute", left: 0, right: 0, top: SIDE_TITLE.top, textAlign: "center", ...typeStyle("title"), fontSize: SIDE_TITLE.size, fontWeight: SIDE_TITLE.weight, color: c.ink }}>Harga vs Value</div>
      <div style={{ position: "absolute", left: TAG.inset, bottom: TAG.inset, display: "flex", alignItems: "center", gap: TAG.gap }}>
        <div style={{ width: TAG.dot, height: TAG.dot, borderRadius: 999, background: c.indigo, flex: "none" }} />
        <div style={{ ...typeStyle("label"), fontSize: TAG.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>hanya ilustrasi</div>
      </div>
      <svg width={CH.w} height={CH.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(${-CH.x} ${-CH.y})`}>
          <AreaLine box={PLOT} pts={pricePts} upto={priceDraw} id="sc04-price" />
          <line x1={PLOT.x} y1={inBox(PLOT, [0, valueAt(0)])[1]} x2={PLOT.x + PLOT.w * valueDraw} y2={inBox(PLOT, [valueDraw, valueAt(valueDraw)])[1]} stroke={theme.color.neutralDotOn} strokeWidth={3} strokeDasharray="10 10" strokeLinecap="round" />
          <RingMark x={gapTop[0]} y={gapTop[1]} y2={gapBottom[1]} p={gapP} />
        </g>
      </svg>
      {/* the two lines named at their right ends */}
      <div style={{ position: "absolute", left: PLOT.x - CH.x + PLOT.w + 22, top: priceEnd[1] - spread - CH.y, transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.indigo, opacity: ease(f, W("bergerak lebih"), m.reveal) }}>Harga</div>
      <div style={{ position: "absolute", left: PLOT.x - CH.x + PLOT.w + 22, top: valueEnd[1] + spread - CH.y, transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.slate, opacity: ease(f, W("daripada bisnisnya"), m.reveal) }}>Value</div>
    </Card>
    );
  };

  // 2
  const countP = ease(f, W("banyak bisnis"), m.sec(1.4));
  const rightP = ease(f, W("dalam jangka") - m.sec(0.1), m.reveal);
  const barsAt = W("Ada perusahaan");
  const divAt = W("membayar dividen");
  const sumP = ease(f, W("Artinya"), m.reveal);

  // 3
  const KT = cut("Kita tetap");
  /** The books tick once a second (global seconds, so the change never lands on the cut); a changed cell flashes. */
  const sec = Math.floor(g / 60);
  const flashOf = (changedAt: number) => (changedAt === sec ? 1 - Math.min(1, (g % 60) / BOOK.flash) : 0);
  const bestBid = BOOK.mid + Math.round((random(`ob-best-${sec}`) - 0.5) * 2.4) * BOOK.tick;
  const addAt = W("Lalu malamnya") - m.sec(0.5);
  const kerjaP = ease(f, W("Kita tetap"), m.reveal) * (1 - ease(f, W("Lalu malamnya") - m.fade, m.fade));
  const analisaP = ease(f, W("Lalu malamnya"), m.reveal);
  const rise = (p: number) => ({ opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(1)}px)` });
  const cardTitle = (text: string) => <div style={{ position: "absolute", left: 0, right: 0, top: SIDE_TITLE.top, textAlign: "center", ...typeStyle("title"), fontSize: SIDE_TITLE.size, fontWeight: SIDE_TITLE.weight, color: c.ink }}>{text}</div>;

  return (
    <>
      <BoardGrid g={g} on={1} />

      {/* A — the question, and three reasons */}
      <Shot from={0} to={A1} block={B} cutIn={false}>
        <Line x={0} y={CY - 70} w={theme.canvas.width} align="center" size={72} weight={500} text="Kenapa relevan untuk investor Indonesia?" />
        {[0, 1, 2].map((i) => {
          const p = ease(f, W("Ada tiga") + i * m.sec(0.12), m.pop);
          return p > 0.001 ? (
            <div key={i} style={{ position: "absolute", left: CX - 60 + (i - 1) * 150, top: CY + 50, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})` }}>
              <NumRing n={i + 1} size={120} />
            </div>
          ) : null;
        })}
      </Shot>

      {/* 1 — the heading stays through its pictures, and leaves for the insight line */}
      <Shot from={A1} to={V} block={B}>
        <Heading n={1} text="Harga bergerak cepat" />
      </Shot>
      <Shot from={A1} to={V} block={B}>
        {chart()}
        {/* on "Investor ritel": the bar */}
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, W("Investor ritel") - m.sec(0.1), m.reveal), transform: `translateY(${((1 - ease(f, W("Investor ritel") - m.sec(0.1), m.reveal)) * 18).toFixed(1)}px)` }}>
          <Card x={BARCARD.x} y={BARCARD.y} w={BARCARD.w} h={BARCARD.h}>
            <div style={{ position: "absolute", left: 0, right: 0, top: SIDE_TITLE.top, textAlign: "center", ...typeStyle("title"), fontSize: SIDE_TITLE.size, fontWeight: SIDE_TITLE.weight, color: c.ink }}>Transaksi harian BEI</div>
            <div style={{ position: "absolute", left: BAR.x - BARCARD.x, top: BAR.y - BARCARD.y, width: BAR.w, height: BAR.h, borderRadius: BAR.r, background: theme.color.neutralDisc, overflow: "hidden", display: "flex" }}>
              {SHARES.map((s) => {
                const grow = ease(f, W(s.at) + m.sec(0.2), m.sec(0.9));
                return (
                  <div key={s.label} style={{ width: `${(s.v * grow).toFixed(2)}%`, height: "100%", background: s.tone === "indigo" ? c.indigo : s.tone, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", whiteSpace: "nowrap" }}>
                    <div style={{ ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.cardBg, fontVariantNumeric: "tabular-nums", opacity: ease(f, W(s.at) + m.sec(0.8), m.reveal) }}>{s.text}</div>
                  </div>
                );
              })}
            </div>
            {/* the names under their parts: italic, small, black (Simon 11 Nov: indigo first, then "Ritel dan Asing jadi hitam coba") */}
            {SHARES.map((s, i) => {
              const from = i === 0 ? 0 : SHARES[0].v;
              return (
                <div key={s.label} style={{ position: "absolute", left: BAR.x - BARCARD.x + (BAR.w * (from + s.v / 2)) / 100 - 120, width: 240, top: BAR.y - BARCARD.y + BAR.h + BAR.label, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 500, fontStyle: "italic", color: c.ink, opacity: ease(f, W(s.at) + m.sec(0.5), m.reveal) }}>{s.label}</div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: BAR.y - BARCARD.y + BAR.h + 66, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate }}>Sumber: BEI, Februari 2026</div>
          </Card>
        </div>
        {/* on "Saat sentimen": the gauge */}
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, W("Saat sentimen") - m.sec(0.1), m.reveal), transform: `translateY(${((1 - ease(f, W("Saat sentimen") - m.sec(0.1), m.reveal)) * 18).toFixed(1)}px)` }}>
          <Card x={SENT.x} y={SENT.y} w={SENT.w} h={SENT.h}>
            <div style={{ position: "absolute", left: 0, right: 0, top: SIDE_TITLE.top, textAlign: "center", ...typeStyle("title"), fontSize: SIDE_TITLE.size, fontWeight: SIDE_TITLE.weight, color: c.ink }}>Sentimen</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", transform: `scale(${GAUGE_K})`, transformOrigin: "50% 0" }}>
              <Gauge angle={needle} />
            </div>
          </Card>
        </div>
      </Shot>
      <Shot from={V} to={K2} block={B}>
        <OrangTuntun at={V} />
        <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 500, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 90, transform: "translateY(-50%)", fontFamily: theme.text.family, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22 }}>
          <div style={{ fontSize: 48, color: c.ink, marginBottom: 18, opacity: ease(f, W("Bagi value") + m.sec(0.2), m.reveal) }}>Bagi value investor:</div>
          {/* "Bagi value investor" black, the rest indigo (Simon 11 Nov) */}
          <div style={{ fontSize: 72, color: c.indigo, opacity: ease(f, W("lebih banyak opportunity") - m.sec(0.1), m.reveal) }}>Lebih banyak opportunity,</div>
          <div style={{ fontSize: 72, color: c.indigo, opacity: ease(f, W("bukan lebih") - m.sec(0.1), m.reveal) }}>bukan lebih banyak risk</div>
        </div>
      </Shot>

      {/* 2 — how many, and three that have been there for decades */}
      <Shot from={K2} to={K3} block={B}>
        <Heading n={2} text="Bisnis jangka panjang" />
        {/* both cards a size smaller, to make room for the conclusion under them (Simon 11 Nov) */}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${GROUP2.k})`, transformOrigin: `${theme.canvas.width / 2}px ${LEFT2.y}px` }}>
        <div style={{ position: "absolute", inset: 0, ...rise(ease(f, K2, m.reveal)) }}>
          <Card x={LEFT2.x} y={LEFT2.y} w={LEFT2.w} h={LEFT2.h}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...typeStyle("title"), fontSize: 150, fontWeight: 600, lineHeight: 1, letterSpacing: -4, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{Math.round(COUNT.n * countP)}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 500, color: c.ink }}>perusahaan tercatat di BEI</div>
            {Array.from({ length: 48 }, (_, k) => {
              const p = ease(f, W("banyak bisnis") + k * 1.2, m.pop);
              return p > 0.001 ? <div key={k} style={{ position: "absolute", left: 40 + (k % 8) * 51, top: 320 + Math.floor(k / 8) * 41, width: 41, height: 31, borderRadius: 8, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, opacity: p }} /> : null;
            })}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate, opacity: countP }}>{COUNT.src}</div>
          </Card>
        </div>
        <div style={{ position: "absolute", inset: 0, ...rise(rightP) }}>
          <Card x={RIGHT2.x} y={RIGHT2.y} w={RIGHT2.w} h={RIGHT2.h}>
            {cardTitle("Di bursa sejak")}
            <div style={{ position: "absolute", left: AXIS2.divX, width: AXIS2.divW, top: AXIS2.rowTop - 44, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate, opacity: ease(f, divAt, m.reveal) }}>Dividen tahun buku 2025</div>
            {LISTED.map((r, i) => {
              const p = ease(f, W(r.at) - m.sec(0.1), m.reveal);
              if (p <= 0.001) return null;
              const y = AXIS2.rowTop + i * AXIS2.rowH;
              const grow = ease(f, barsAt + i * m.sec(0.25), m.sec(1));
              const x0 = yearX(r.since);
              const x1 = x0 + (yearX(NOW) - x0) * grow;
              const divP = ease(f, divAt + i * m.sec(0.15), m.pop);
              return (
                <div key={r.ticker} style={{ position: "absolute", left: 0, top: y, width: RIGHT2.w, height: AXIS2.rowH - 20, opacity: p }}>
                  <div style={{ position: "absolute", left: 40, top: 20, display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ width: 76, height: 76, borderRadius: 22, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <Glyph icon={r.icon} size={44} tone={c.indigo} />
                    </div>
                    <div>
                      <div style={{ ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.ink }}>{r.sector}</div>
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        {[r.ticker, ...r.more].map((t, k) => (
                          <div key={t} style={{ padding: "2px 10px", borderRadius: 999, background: k === 0 ? c.indigo : theme.color.indigoWashSolid, ...typeStyle("label"), fontSize: 20, fontWeight: 600, color: k === 0 ? c.cardBg : c.indigo, opacity: k === 0 ? 1 : ease(f, W(r.at) + m.sec(0.15) * k, m.reveal) }}>{t}</div>
                        ))}
                        {/* the "+", drawn — a typed one sits off its circle's centre (Simon 11 Nov: "icon nya ga center") */}
                        <svg width={26} height={26} viewBox="0 0 26 26" style={{ flex: "none", opacity: ease(f, W(r.at) + m.sec(0.45), m.reveal) }}>
                          <circle cx={13} cy={13} r={12} fill="none" stroke={theme.color.hairlineBrandSolid} strokeWidth={2} />
                          <path d="M 13 8 L 13 18 M 8 13 L 18 13" stroke={c.indigo} strokeWidth={2.4} strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* its years on the exchange: from listing to now */}
                  <div style={{ position: "absolute", left: AXIS2.x0, width: AXIS2.x1 - AXIS2.x0, top: 58 - AXIS2.bar / 2, height: AXIS2.bar, borderRadius: AXIS2.bar / 2, background: theme.color.neutralDisc }} />
                  {grow > 0.001 ? <div style={{ position: "absolute", left: x0, width: Math.max(AXIS2.bar, x1 - x0), top: 58 - AXIS2.bar / 2, height: AXIS2.bar, borderRadius: AXIS2.bar / 2, background: c.indigo }} /> : null}
                  <div style={{ position: "absolute", left: x0, top: 58 + AXIS2.bar / 2 + 8, ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate, opacity: grow }}>{r.since}</div>
                  <div style={{ position: "absolute", left: AXIS2.x1 - 140, width: 140, top: 58 + AXIS2.bar / 2 + 8, textAlign: "right", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.indigo, opacity: ease(f, barsAt + i * m.sec(0.25) + m.sec(0.8), m.reveal) }}>{NOW - r.since} tahun</div>
                  {divP > 0.001 ? (
                    <div style={{ position: "absolute", left: AXIS2.divX, width: AXIS2.divW, top: 58 - 32, height: 64, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.ink, opacity: divP, transform: `scale(${(0.85 + 0.15 * divP).toFixed(3)})` }}>{r.div}</div>
                  ) : null}
                </div>
              );
            })}
            {/* the year axis under the rows (the yearly-report marks came out, Simon 11 Nov: "ga menggambarkan apa2") */}
            <div style={{ position: "absolute", left: AXIS2.x0, width: AXIS2.x1 - AXIS2.x0, top: AXIS2.rowTop + 3 * AXIS2.rowH - 10, height: 2, background: theme.color.skeleton, opacity: rightP }} />
            {[1980, 1990, 2000, 2010, 2020].map((y) => (
              <div key={y} style={{ position: "absolute", left: yearX(y) - 40, width: 80, top: AXIS2.rowTop + 3 * AXIS2.rowH, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate, opacity: rightP }}>{y}</div>
            ))}
          </Card>
        </div>
        </div>
        {/* "Artinya, konsep 'memiliki sebuah bisnis' benar-benar punya objek yang bisa dipelajari." — its conclusion, one line */}
        <div style={{ ...rise(sumP), position: "absolute", inset: 0 }}>
          <Line x={0} y={GROUP2.line} w={theme.canvas.width} align="center" size={52} weight={500} text={GROUP2.text} mark={GROUP2.mark} />
        </div>
      </Shot>

      {/* 3 — the screen you don't have to watch; then one day, four reports a year, a note that keeps growing */}
      <Shot from={K3} to={END} block={B} cutOut={false}>
        <Heading n={3} text="Tidak harus menatap layar" />
      </Shot>
      <Shot from={K3} to={KT} block={B}>
        {[0, 1].map((side) => (
          <Card key={side} x={bookX(side)} y={BOOK.y} w={BOOK.w} h={BOOK.h} style={rise(ease(f, K3 + side * m.sec(0.15), m.reveal))}>
            {cardTitle(side === 0 ? "Orderbook" : "Tradebook")}
            {(side === 0 ? ["Lot", "Bid", "Offer", "Lot"] : ["Price", "Lot B", "Lot S", "Freq"]).map((h, k) => (
              <div key={h + k} style={{ position: "absolute", left: 40 + k * ((BOOK.w - 80) / 4), width: (BOOK.w - 80) / 4, top: BOOK.head - 34, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 600, color: c.slate }}>{h}</div>
            ))}
            <div style={{ position: "absolute", left: 40, right: 40, top: BOOK.head - 4, height: 2, background: theme.color.skeleton }} />
            {Array.from({ length: BOOK.rows }, (_, r) => {
              const colW = (BOOK.w - 80) / 4;
              const cells =
                side === 0
                  ? [
                      { ...sticky(`ob-bl-${r}`, sec, 0.45, 50, 9000), kind: "lot" },
                      { v: bestBid - r * BOOK.tick, changedAt: bestBid === BOOK.mid + Math.round((random(`ob-best-${sec - 1}`) - 0.5) * 2.4) * BOOK.tick ? -1 : sec, kind: "bid" },
                      { v: bestBid + BOOK.tick + r * BOOK.tick, changedAt: -1, kind: "offer" },
                      { ...sticky(`ob-ol-${r}`, sec, 0.45, 50, 9000), kind: "lot" },
                    ]
                  : [
                      { v: BOOK.mid + 50 - r * BOOK.tick, changedAt: -1, kind: "price" },
                      { ...sticky(`tb-b-${r}`, sec, 0.35, 2000, 60000), kind: "lot" },
                      { ...sticky(`tb-s-${r}`, sec, 0.35, 2000, 60000), kind: "lot" },
                      { ...sticky(`tb-f-${r}`, sec, 0.35, 40, 900), kind: "lot" },
                    ];
              return cells.map((cell, k) => {
                const fl = flashOf(cell.changedAt);
                const tone = cell.kind === "bid" ? theme.color.gainGreen : cell.kind === "offer" ? theme.color.crossRed : c.ink;
                return (
                  <div key={`${r}-${k}`} style={{ position: "absolute", left: 40 + k * colW + 8, width: colW - 16, top: BOOK.head + 8 + r * BOOK.rowH, height: BOOK.rowH - 6, borderRadius: 10, background: interpolateColors(fl, [0, 1], [c.cardBg, theme.color.hairlineBrandSolid]), display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 24, fontWeight: cell.kind === "lot" ? 500 : 600, color: tone, fontVariantNumeric: "tabular-nums" }}>{lot(cell.v)}</div>
                );
              });
            })}
          </Card>
        ))}
      </Shot>
      <Shot from={KT} to={END} block={B} cutOut={false}>
        <Card x={SCHED.x} y={SCHED.y} w={SCHED.w} h={SCHED.h} style={rise(ease(f, KT, m.reveal))}>
          <div style={{ position: "absolute", left: ROW.pad, top: SIDE_TITLE.top + 6, ...typeStyle("title"), fontSize: SIDE_TITLE.size, fontWeight: SIDE_TITLE.weight, color: c.ink }}>Jadwal</div>
          {SLOTS.map((slot, i) => {
            const p = i === 0 ? ease(f, KT, m.reveal) : ease(f, W(slot.at) - m.sec(0.1), m.reveal);
            if (p <= 0.001) return null;
            const grow = ease(f, W(slot.at), m.sec(1.4));
            const to = slot.from + (slot.to - slot.from) * grow;
            const top = ROW.top + i * ROW.h;
            const trackW = SCHED.w - 2 * ROW.pad;
            const x = (h: number) => ROW.pad + (h / 24) * trackW;
            const fill = slot.tone === "indigo" ? c.indigo : c.ink;
            return (
              <div key={slot.name} style={{ position: "absolute", left: 0, top, width: SCHED.w, height: ROW.h, ...rise(p) }}>
                <div style={{ position: "absolute", left: ROW.pad, top: 0, height: 56, padding: "0 26px", borderRadius: 999, boxShadow: `inset 0 0 0 2px ${fill}`, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: fill }}>{slot.name}</div>
                <div style={{ position: "absolute", left: ROW.pad, top: 80, ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate }}>
                  Dari <span style={{ marginLeft: 10, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{clock(slot.from)}</span>
                </div>
                <div style={{ position: "absolute", right: ROW.pad, top: 80, ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate }}>
                  Sampai <span style={{ marginLeft: 10, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{clock(to)}</span>
                </div>
                <div style={{ position: "absolute", left: ROW.pad, width: trackW, top: 140 - ROW.track / 2, height: ROW.track, borderRadius: ROW.track / 2, background: theme.color.neutralDisc }} />
                {/* the bar, drawn from its start like a trim path, the end knob riding its tip */}
                <div style={{ position: "absolute", left: x(slot.from), width: x(to) - x(slot.from), top: 140 - ROW.track / 2, height: ROW.track, background: fill }} />
                {[slot.from, to].map((h, k) => (
                  <div key={k} style={{ position: "absolute", left: x(h) - ROW.knob / 2, top: 140 - ROW.knob / 2, width: ROW.knob, height: ROW.knob, borderRadius: 999, background: fill, boxShadow: `0 0 0 3px ${c.cardBg}` }} />
                ))}
                {i === 0 ? <div style={{ position: "absolute", left: ROW.pad, right: ROW.pad, top: ROW.h - 16, height: 2, background: theme.color.skeleton }} /> : null}
              </div>
            );
          })}
          {/* "+ Tambah waktu": pressed for the evening entry */}
          <div style={{ position: "absolute", left: SCHED.w / 2 - 130, width: 260, top: SCHED.h - 92, height: 60, borderRadius: 999, boxShadow: `inset 0 0 0 2px ${c.ink}`, background: interpolateColors(Math.sin(Math.PI * ease(f, addAt, m.sec(0.4))), [0, 1], [c.cardBg, theme.color.neutralDisc]), display: "flex", alignItems: "center", justifyContent: "center", gap: 10, ...typeStyle("label"), fontSize: 24, fontWeight: 500, color: c.ink, transform: `scale(${(1 - 0.05 * Math.sin(Math.PI * ease(f, addAt, m.sec(0.4)))).toFixed(3)})` }}>+ Tambah waktu</div>
        </Card>
        {/* by day: at work (IN01's Orang Kerja, Simon 11 Nov) */}
        {kerjaP > 0.001 ? (
          <div style={{ position: "absolute", left: SIDE.x, top: SIDE.y + SIDE.h - (SIDE.w * KERJA.h) / KERJA.w, width: SIDE.w, height: (SIDE.w * KERJA.h) / KERJA.w, ...rise(kerjaP) }}>
            <Pic src={staticFile(KERJA.src)} style={{ position: "absolute", left: 0, top: 0, width: SIDE.w, height: (SIDE.w * KERJA.h) / KERJA.w }} />
          </div>
        ) : null}
        {/* at night: reading and analysing (Simon's OrangAnalisa.png), two labels above it on their words */}
        {analisaP > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, ...rise(analisaP) }}>
            <div style={{ position: "absolute", left: SIDE.x + (SIDE.w - ANALISA.d) / 2, top: SIDE.y + SIDE.h - ANALISA.d, width: ANALISA.d, height: ANALISA.d, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft }}>
              <Pic src={staticFile(ANALISA.src)} style={{ position: "absolute", left: 0, top: 0, width: ANALISA.d, height: ANALISA.d }} />
            </div>
            <div style={{ position: "absolute", left: SIDE.x, width: SIDE.w, top: SIDE.y + 6, display: "flex", justifyContent: "center", gap: 18 }}>
              {[
                { text: "Baca laporan", at: "membaca laporan" },
                { text: "Menganalisa", at: "memperbarui analisis" },
              ].map((l) => {
                const q = ease(f, W(l.at) - m.sec(0.1), m.pop);
                return (
                  <div key={l.text} style={{ height: 64, padding: "0 30px", borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.cardBg, opacity: q, transform: `scale(${(0.85 + 0.15 * q).toFixed(3)})` }}>{l.text}</div>
                );
              })}
            </div>
          </div>
        ) : null}
      </Shot>
    </>
  );
};

