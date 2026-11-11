/**
 * VI01 · SC06 — "Bandingkan dengan Cara Lain", in IN07's look and rebuilt again for value (Simon 11 Nov: "scene 6 juga" — as
 * SC04/SC05/SC07: each approach's heading opens in the middle and docks top left, then one frame of cards with real data).
 *
 *  A   the question, and the four approaches as chips.
 *  1   "Day trading" opens with what it needs under it (kecepatan, disiplin, waktu melihat market), docks; one frame, two
 *      studies: Brasil — Chague, De-Losso & Giovannetti (2019), 1.551 day traders who kept at it more than 300 days: 97 %
 *      lost money, 1,1 % earned more than the minimum wage; Taiwan — Barber, Lee, Liu & Odean (2014), 1992–2006: less than
 *      1 % predictably profitable after fees.
 *  2   "Quant trading" opens with data · programming · kecepatan · modal, docks; you against the institutions' servers —
 *      a human reacts in about 0,2 s (visual reaction ≈ 190–250 ms), a co-located trading system in microseconds.
 *  3   "Berita & influencer" opens, docks; the news on a timeline, the price moving while it travels Sumber → Media → Grup
 *      → Influencer → Kamu, you last (a diagram — no stock, no figures).
 *  4   "Value investing" opens, docks; Graham's book since 1934 beside a table of what each way needs — speed, insider
 *      information, a day at the screen — and value investing needing none; then Buffett's line from his preface to The
 *      Intelligent Investor.
 *  E   Orang Tuntun: it can be learned; not full-time, not the fastest.
 *
 * Simon's note: never say technical analysis is "tidak valid" — nothing here does.
 */
import type React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { BoardGrid, Card, Glyph, ORANG_TUNTUN_RIGHT, OpeningHeading, OrangTuntun, PhotoTile, Pic, Shot, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const CY = 590;

const APPROACHES = ["Day trading", "Quant trading", "Berita & influencer", "Value investing"];

// 1
const NEEDS = [
  { icon: "lightning", label: "Kecepatan", at: "membutuhkan kecepatan" },
  { icon: "list-checks", label: "Disiplin", at: "disiplin" },
  { icon: "monitor", label: "Waktu melihat market", at: "waktu melihat" },
] as const;
const STUDY = { y: 290, h: 650, gap: 40 };
const BRASIL = { x: 140, w: 800 };
const TAIWAN = { x: BRASIL.x + BRASIL.w + STUDY.gap, w: theme.canvas.width - 140 - (BRASIL.x + BRASIL.w + STUDY.gap) };
const WAFFLE = { n: 10, d: 30, gap: 8, x: 70, y: 170 };
const DOTS = { n: 10, d: 26, gap: 12, x: 70, y: 176 };

// 2
const QUANT = [
  { label: "Data", at: "membutuhkan data" },
  { label: "Programming", at: "programming" },
  { label: "Kecepatan", at: "kecepatan,", nth: 1 },
  { label: "Modal", at: "dan modal" },
] as const;
const SPEED = { x: CX - 720, y: 300, w: 1440, h: 560, barX: 470, barW: 620 };

// 3
const FLOW = { x: 140, y: 290, w: 1640, h: 650 };
/** Its plot raised so the hands under it keep a margin above the card's bottom (Simon 11 Nov). */
const FLOW_PLOT = { x0: 120, x1: 1520, y0: 400, y1: 150 };
const CHAIN = [
  { icon: "lightbulb", label: "Sumber", t: 0.06 },
  { icon: "newspaper", label: "Media", t: 0.3 },
  { icon: "users-three", label: "Grup", t: 0.52 },
  { icon: "megaphone", label: "Influencer", t: 0.72 },
  { icon: "user-circle", label: "Kamu", t: 0.94, self: true },
] as const;
/** A price that moves on the news before most people hear it: flat, then up while the news travels (a shape). */
const priceAt = (t: number) => 0.18 + 0.7 / (1 + Math.exp(-(t - 0.32) * 12)) + 0.03 * Math.sin(t * 40);

// 4
const BOOK = { src: "art/vi01/sc02-buku-graham.jpg", w: 800, h: 648, x: 140, y: 300, dw: 560 };
const TABLE = { x: 760, y: 290, w: 1020, h: 650, col1: 300, col2: 380 };
const NEEDED_BY = [
  { need: "Kecepatan", who: ["Day trading", "Quant"], at: "Tidak bergantung pada kecepatan" },
  { need: "Insider information", who: ["Berita & influencer"], at: "Tidak bergantung pada insider" },
  { need: "Layar seharian", who: ["Day trading"], at: "depan layar" },
] as const;
const NOT_NEEDED = [
  { label: "IQ luar biasa", at: "IQ luar" },
  { label: "Insight tak biasa", at: "insight bisnis" },
  { label: "Info orang dalam", at: "informasi orang" },
] as const;
/** The Buffett group spans x 160 (his name) to ≈1330 (the widest chip, "Kerangka berpikir yang sehat"): shifted to centre it. */
const BUFFETT_SHIFT = theme.canvas.width / 2 - (160 + 1330) / 2;
const NEEDED = [
  { label: "Kerangka berpikir yang sehat", at: "kerangka berpikir" },
  { label: "Disiplin emosional", at: "disiplin emosional" },
] as const;

/** A white chip with a label; `off` crosses it out and greys it, `on` rings it in indigo with a check. */
const Chip = ({ x, y, label, p, off = 0, on = 0, size = 40 }: { x: number; y: number; label: string; p: number; off?: number; on?: number; size?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (p <= 0.001) return null;
  const grey = off > 0.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, height: size * 2.2, padding: `0 ${size * 0.9}px`, borderRadius: 999, background: c.cardBg, boxShadow: grey ? `inset 0 0 0 2px ${theme.color.skeleton}` : on > 0.5 ? `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` : shadow.soft, display: "flex", alignItems: "center", gap: size * 0.4, whiteSpace: "nowrap", ...typeStyle("title"), fontSize: size, fontWeight: 500, color: grey ? c.slate : on > 0.5 ? c.indigo : c.ink, opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(1)}px)` }}>
      {on > 0.001 ? <span style={{ fontWeight: 700, opacity: on }}>✓</span> : null}
      {off > 0.001 ? <span style={{ fontWeight: 700, color: theme.color.crossRed, opacity: off }}>✕</span> : null}
      <span style={{ position: "relative" }}>
        {label}
        {off > 0.001 ? <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 3, borderRadius: 2, background: c.slate, transformOrigin: "left center", transform: `scaleX(${off.toFixed(3)})` }} /> : null}
      </span>
    </div>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;
  const B = BLOCK.SC06;
  const cut = (phrase: string) => W(phrase) - m.sec(0.15);
  const END = BLOCK.SC07 - BLOCK.SC06;

  const D1 = cut("Day trading atau");
  const Q = cut("Quantitative trading");
  const BI = cut("Mengikuti berita");
  const VI = cut("Value investing bermain");
  const BF = cut("Buffett pernah");
  const KP = cut("Kalau kerangkanya");

  /** An approach's heading: opens in the middle with its row under it, docks top left on `dockAt`. */
  const head = (n: number, text: string, from: number, dockAt: number, sub: React.ReactNode, subAt: number) => (
    <OpeningHeading n={n} text={text} sub={sub} p={ease(f, from, m.reveal)} dock={ease(f, dockAt, m.move)} subP={ease(f, subAt, m.reveal)} />
  );
  const chipRow = (items: readonly { label: string; at: string; nth?: number }[]) => (
    <div style={{ display: "flex", gap: 22 }}>
      {items.map((it) => {
        const p = ease(f, W(it.at, it.nth ?? 0) - m.sec(0.1), m.pop);
        return (
          <div key={it.label} style={{ height: 76, padding: "0 30px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 500, color: c.ink, opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(1)}px)` }}>{it.label}</div>
        );
      })}
    </div>
  );
  const cardTitle = (text: string, top = 30) => <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", ...typeStyle("title"), fontSize: 36, fontWeight: 700, color: c.ink }}>{text}</div>;
  const source = (text: string) => <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate }}>{text}</div>;
  const rise = (p: number) => ({ opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(1)}px)` });

  // 1
  const dock1 = W("Sebuah studi") - m.sec(0.4);
  const brP = ease(f, W("Sebuah studi"), m.reveal);
  const lossAt = W("97% kehilangan");
  const wageP = ease(f, W("1,1%"), m.pop);
  const twP = ease(f, W("Penelitian di Taiwan"), m.reveal);
  const mostP = ease(f, W("mayoritas day"), m.reveal);
  const fewP = ease(f, W("sebagian sangat"), m.pop);

  // 2
  const dock2 = W("Dan lawanmu") - m.sec(0.4);
  const speedP = ease(f, W("Dan lawanmu"), m.reveal);
  const humanBar = ease(f, W("Dan lawanmu") + m.sec(0.2), m.sec(1.2));
  const serverP = ease(f, W("server institusi"), m.pop);

  // 3
  const dock3 = W("ketika informasi") - m.sec(0.4);
  const flowP = ease(f, W("ketika informasi"), m.reveal);
  const flowDraw = ease(f, W("ketika informasi"), W("orang terakhir") - W("ketika informasi"));
  const lastP = ease(f, W("orang terakhir"), m.pop);
  const fx = (t: number) => FLOW_PLOT.x0 + t * (FLOW_PLOT.x1 - FLOW_PLOT.x0);
  const fy = (t: number) => FLOW_PLOT.y0 + (FLOW_PLOT.y1 - FLOW_PLOT.y0) * priceAt(t);

  // 4
  const dock4 = W("Metodenya") - m.sec(0.4);
  const bookP = ease(f, W("Metodenya"), m.reveal);
  const tableP = ease(f, W("Metodenya") + m.sec(0.6), m.reveal);

  return (
    <>
      <BoardGrid g={g} on={1} />

      {/* A — the question, and four ways to compare */}
      <Shot from={0} to={D1} block={B} cutIn={false}>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: CY - 130, textAlign: "center", ...typeStyle("title"), fontSize: 72, fontWeight: 500, color: c.ink, opacity: ease(f, W("Kenapa value"), m.reveal) }}>Kenapa bisa dipelajari investor biasa?</div>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: CY + 10, display: "flex", justifyContent: "center", gap: 28 }}>
          {APPROACHES.map((a, i) => {
            const p = ease(f, W("Coba bandingkan") + i * m.sec(0.15), m.pop);
            return (
              <div key={a} style={{ height: 84, padding: "0 34px", borderRadius: 999, background: i === 3 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: i === 3 ? `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` : shadow.soft, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 36, fontWeight: 500, color: i === 3 ? c.indigo : c.ink, opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(1)}px)` }}>{a}</div>
            );
          })}
        </div>
      </Shot>

      {/* 1 — Day trading: what it needs, then two studies side by side */}
      <Shot from={D1} to={Q} block={B}>
        {head(1, "Day trading", D1, dock1, chipRow(NEEDS), W("membutuhkan kecepatan") - m.sec(0.1))}
        <Card x={BRASIL.x} y={STUDY.y} w={BRASIL.w} h={STUDY.h} style={rise(brP)}>
          {cardTitle("Studi Brasil")}
          <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 500, color: c.slate }}>1.551 day trader yang bertahan &gt; 300 hari</div>
          {Array.from({ length: WAFFLE.n * WAFFLE.n }, (_, k) => {
            const lost = k < 97 && f >= lossAt + k * 0.35;
            const won = k === 99 && wageP > 0.5;
            return <div key={k} style={{ position: "absolute", left: WAFFLE.x + (k % WAFFLE.n) * (WAFFLE.d + WAFFLE.gap), top: WAFFLE.y + Math.floor(k / WAFFLE.n) * (WAFFLE.d + WAFFLE.gap), width: WAFFLE.d, height: WAFFLE.d, borderRadius: 9, background: lost ? c.slate : won ? c.indigo : c.cardBg, boxShadow: lost ? "none" : `inset 0 0 0 2px ${won ? c.indigo : theme.color.skeleton}` }} />;
          })}
          <div style={{ position: "absolute", left: 500, top: 210 }}>
            <div style={{ ...typeStyle("title"), fontSize: 110, fontWeight: 600, lineHeight: 1, letterSpacing: -3, color: c.ink, opacity: ease(f, lossAt, m.reveal), fontVariantNumeric: "tabular-nums" }}>97%</div>
            <div style={{ ...typeStyle("title"), fontSize: 34, fontWeight: 500, color: c.slate, marginTop: 4, opacity: ease(f, lossAt + m.sec(0.3), m.reveal) }}>rugi</div>
            <div style={{ marginTop: 44, ...typeStyle("title"), fontSize: 72, fontWeight: 600, lineHeight: 1, color: c.indigo, opacity: wageP, fontVariantNumeric: "tabular-nums" }}>1,1%</div>
            <div style={{ ...typeStyle("title"), fontSize: 28, fontWeight: 500, color: c.ink, marginTop: 6, opacity: wageP, whiteSpace: "nowrap" }}>&gt; upah minimum</div>
          </div>
          {source("Chague, De-Losso & Giovannetti (2019)")}
        </Card>
        <Card x={TAIWAN.x} y={STUDY.y} w={TAIWAN.w} h={STUDY.h} style={rise(twP)}>
          {cardTitle("Studi Taiwan")}
          <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 500, color: c.slate }}>Semua day trader, 1992–2006</div>
          {Array.from({ length: DOTS.n * DOTS.n }, (_, k) => {
            const lit = k === 0 ? fewP : 0;
            return <div key={k} style={{ position: "absolute", left: DOTS.x + (k % DOTS.n) * (DOTS.d + DOTS.gap), top: DOTS.y + Math.floor(k / DOTS.n) * (DOTS.d + DOTS.gap), width: DOTS.d, height: DOTS.d, borderRadius: 999, background: lit > 0.5 ? c.indigo : mostP > 0.5 ? c.slate : theme.color.skeleton, boxShadow: lit > 0.5 ? `0 0 0 5px ${c.cardBg}, 0 0 0 8px ${c.indigo}` : "none", transform: lit > 0.5 ? "scale(0.5)" : undefined }} />;
          })}
          <div style={{ position: "absolute", left: 520, top: 230 }}>
            <div style={{ ...typeStyle("title"), fontSize: 34, fontWeight: 500, color: c.ink, opacity: mostP }}>Mayoritas rugi</div>
            <div style={{ marginTop: 50, ...typeStyle("title"), fontSize: 110, fontWeight: 600, lineHeight: 1, letterSpacing: -3, color: c.indigo, opacity: fewP }}>&lt;1%</div>
            <div style={{ ...typeStyle("title"), fontSize: 28, fontWeight: 500, color: c.ink, marginTop: 6, opacity: fewP, lineHeight: 1.25 }}>konsisten untung<br />setelah biaya</div>
          </div>
          {source("Barber, Lee, Liu & Odean (2014)")}
        </Card>
      </Shot>

      {/* 2 — Quant trading: what it needs, then you against the servers, in time */}
      <Shot from={Q} to={BI} block={B}>
        {head(2, "Quant trading", Q, dock2, chipRow(QUANT), W("membutuhkan data") - m.sec(0.1))}
        <Card x={SPEED.x} y={SPEED.y} w={SPEED.w} h={SPEED.h} style={rise(speedP)}>
          {cardTitle("Waktu bereaksi")}
          {[
            { icon: "laptop", label: "Kamu", tone: theme.color.selfAmber, ink: theme.color.selfAmberInk, w: humanBar, value: "±0,2 detik", p: speedP },
            { icon: "hard-drives", label: "Server institusi", tone: c.ink, ink: c.ink, w: 0.003 * serverP, value: "mikrodetik", p: serverP },
          ].map((r, i) => (
            <div key={r.label} style={{ position: "absolute", left: 70, right: 70, top: 150 + i * 170, height: 120, opacity: r.p }}>
              <div style={{ position: "absolute", left: 0, top: 22, display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={r.icon} size={46} tone={c.ink} />
                </div>
                <div style={{ ...typeStyle("title"), fontSize: 34, fontWeight: 600, color: r.ink }}>{r.label}</div>
              </div>
              <div style={{ position: "absolute", left: SPEED.barX - 70, width: SPEED.barW, top: 46, height: 28, borderRadius: 14, background: theme.color.neutralDisc }} />
              <div style={{ position: "absolute", left: SPEED.barX - 70, width: Math.max(10, SPEED.barW * r.w), top: 46, height: 28, borderRadius: 14, background: r.tone }} />
              <div style={{ position: "absolute", left: SPEED.barX - 70 + SPEED.barW + 30, top: 34, ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: r.ink, whiteSpace: "nowrap" }}>{r.value}</div>
            </div>
          ))}
          {source("1 mikrodetik = 0,000001 detik · reaksi visual manusia ±190–250 ms")}
        </Card>
      </Shot>

      {/* 3 — Berita & influencer: the price moves while the news travels; you hear it last */}
      <Shot from={BI} to={VI} block={B}>
        {head(3, "Berita & influencer", BI, dock3, null, BI)}
        <Card x={FLOW.x} y={FLOW.y} w={FLOW.w} h={FLOW.h} style={rise(flowP)}>
          {cardTitle("Informasi sampai ke kamu")}
          <svg width={FLOW.w} height={FLOW.h} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={FLOW_PLOT.x0} y1={FLOW_PLOT.y0 + 30} x2={FLOW_PLOT.x1} y2={FLOW_PLOT.y0 + 30} stroke={theme.color.skeleton} strokeWidth={2} />
            <path d={Array.from({ length: 121 }, (_, k) => k / 120).filter((t) => t <= Math.max(0.02, flowDraw)).map((t, k) => `${k ? "L" : "M"} ${fx(t).toFixed(1)} ${fy(t).toFixed(1)}`).join(" ")} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {CHAIN.map((n) => {
            const p = flowDraw >= n.t ? ease(f, W("ketika informasi") + n.t * (W("orang terakhir") - W("ketika informasi")), m.pop) : 0;
            if (p <= 0.001) return null;
            const self = "self" in n;
            return (
              <div key={n.label} style={{ position: "absolute", left: fx(n.t) - 55, top: FLOW_PLOT.y0 + 60, width: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: p, transform: `scale(${(0.8 + 0.2 * p).toFixed(3)})` }}>
                <div style={{ width: 84, height: 84, borderRadius: 999, background: self ? theme.color.selfAmber : c.cardBg, boxShadow: self ? "none" : `${shadow.soft}, inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={n.icon} size={46} tone={self ? c.cardBg : c.ink} />
                </div>
                <div style={{ ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: self ? theme.color.selfAmberInk : c.ink, whiteSpace: "nowrap" }}>{n.label}</div>
              </div>
            );
          })}
          {/* the dot on the price at each hand, and a note when it reaches you */}
          <svg width={FLOW.w} height={FLOW.h} style={{ position: "absolute", left: 0, top: 0 }}>
            {CHAIN.map((n) => (flowDraw >= n.t ? <circle key={n.label} cx={fx(n.t)} cy={fy(n.t)} r={9} fill={"self" in n ? theme.color.selfAmber : c.indigo} stroke={c.cardBg} strokeWidth={3} /> : null))}
          </svg>
          {lastP > 0.001 ? (
            <div style={{ position: "absolute", left: fx(CHAIN[4].t) - 330, top: fy(CHAIN[4].t) - 92, height: 60, padding: "0 24px", borderRadius: 999, background: theme.color.crossRed, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.cardBg, whiteSpace: "nowrap", opacity: lastP, transform: `scale(${(0.85 + 0.15 * lastP).toFixed(3)})`, transformOrigin: "right center" }}>Terakhir · harga sudah bergerak</div>
          ) : null}
        </Card>
      </Shot>

      {/* 4 — Value investing: since 1934, and what it doesn't need; then Buffett */}
      <Shot from={VI} to={KP} block={B}>
        {head(4, "Value investing", VI, dock4, "Bermain dengan cara berbeda", W("cara berbeda") - m.sec(0.1))}
      </Shot>
      <Shot from={VI} to={BF} block={B}>
        <div style={{ position: "absolute", left: BOOK.x, top: BOOK.y, width: BOOK.dw, height: (BOOK.dw * BOOK.h) / BOOK.w, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg, ...rise(bookP) }}>
          <Pic src={staticFile(BOOK.src)} style={{ position: "absolute", left: 0, top: 0, width: BOOK.dw, height: (BOOK.dw * BOOK.h) / BOOK.w }} />
        </div>
        <div style={{ position: "absolute", left: BOOK.x, width: BOOK.dw, top: BOOK.y + (BOOK.dw * BOOK.h) / BOOK.w + 26, textAlign: "center", ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: c.indigo, opacity: ease(f, W("sejak 1930-an"), m.reveal) }}>Sejak 1934</div>
        <Card x={TABLE.x} y={TABLE.y} w={TABLE.w} h={TABLE.h} style={rise(tableP)}>
          {cardTitle("Apa yang dibutuhkan?")}
          {["Butuh", "Siapa yang butuh", "Value investing"].map((h, k) => (
            <div key={h} style={{ position: "absolute", left: 40 + (k === 0 ? 0 : k === 1 ? TABLE.col1 : TABLE.col1 + TABLE.col2), top: 110, ...typeStyle("label"), fontSize: 22, fontWeight: 600, color: k === 2 ? c.indigo : c.slate }}>{h}</div>
          ))}
          <div style={{ position: "absolute", left: 40, right: 40, top: 150, height: 2, background: theme.color.skeleton }} />
          {NEEDED_BY.map((r, i) => {
            const p = ease(f, W(r.at) - m.sec(0.1), m.reveal);
            const no = ease(f, W(r.at) + m.sec(0.5), m.pop);
            if (p <= 0.001) return null;
            const y = 180 + i * 140;
            return (
              <div key={r.need} style={{ position: "absolute", left: 40, right: 40, top: y, height: 110, opacity: p }}>
                <div style={{ position: "absolute", left: 0, top: 30, ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.ink }}>{r.need}</div>
                <div style={{ position: "absolute", left: TABLE.col1, top: 22, display: "flex", gap: 10, flexWrap: "wrap", width: TABLE.col2 - 20 }}>
                  {r.who.map((w) => (
                    <div key={w} style={{ height: 50, padding: "0 18px", borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 22, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{w}</div>
                  ))}
                </div>
                <div style={{ position: "absolute", left: TABLE.col1 + TABLE.col2, top: 18, height: 60, padding: "0 22px", borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", gap: 10, ...typeStyle("title"), fontSize: 28, fontWeight: 600, color: c.indigo, opacity: no, transform: `scale(${(0.85 + 0.15 * no).toFixed(3)})`, transformOrigin: "left center" }}>
                  <span style={{ color: theme.color.crossRed }}>✕</span> Tidak perlu
                </div>
                {i < NEEDED_BY.length - 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: 124, height: 2, background: theme.color.skeleton }} /> : null}
              </div>
            );
          })}
        </Card>
      </Shot>
      <Shot from={BF} to={KP} block={B}>
        {/* the photo and the chips as one group, centred across the frame (Simon 11 Nov) */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${BUFFETT_SHIFT}px)` }}>
        <PhotoTile name="buffett" d={340} style={{ left: 220, top: 330, opacity: ease(f, W("Buffett pernah") - m.sec(0.1), m.reveal) }} />
        <div style={{ position: "absolute", left: 160, width: 460, top: 330 + (340 * 423) / 406 + 24, textAlign: "center", opacity: ease(f, W("Buffett pernah"), m.reveal) }}>
          <div style={{ ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink }}>Warren Buffett</div>
          <div style={{ marginTop: 8, ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate, lineHeight: 1.3 }}>Kata pengantar<br />The Intelligent Investor</div>
        </div>
        {NOT_NEEDED.map((x, i) => (
          <Chip key={x.label} x={700} y={300 + i * 120} label={x.label} p={ease(f, W(x.at) - m.sec(0.1), m.pop)} off={ease(f, W(x.at) + m.sec(0.35), m.sec(0.35))} size={38} />
        ))}
        <div style={{ position: "absolute", left: 700, top: 300 + 3 * 120 + 10, width: 900, height: 3, background: theme.color.skeleton, opacity: ease(f, W("Yang dibutuhkan"), m.reveal) }} />
        {NEEDED.map((x, i) => (
          <Chip key={x.label} x={700} y={300 + 3 * 120 + 50 + i * 120} label={x.label} p={ease(f, W(x.at) - m.sec(0.1), m.pop)} on={ease(f, W(x.at) + m.sec(0.2), m.pop)} size={38} />
        ))}
        </div>
      </Shot>

      {/* E — Orang Tuntun: most people can learn it */}
      <Shot from={KP} to={END} block={B} cutOut={false}>
        <OrangTuntun at={KP} />
        <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 500, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 90, transform: "translateY(-50%)", fontFamily: theme.text.family, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22 }}>
          <div style={{ fontSize: 84, color: c.indigo, opacity: ease(f, W("sebagian besar") - m.sec(0.1), m.reveal) }}>Bisa dipelajari</div>
          <div style={{ fontSize: 52, color: c.ink, marginTop: 30, opacity: ease(f, W("full-time") - m.sec(0.2), m.reveal) }}>Nggak harus full-time.</div>
          <div style={{ fontSize: 52, color: c.ink, marginTop: 10, opacity: ease(f, W("paling cepat") - m.sec(0.2), m.reveal) }}>Nggak harus paling cepat.</div>
        </div>
      </Shot>
    </>
  );
};
