/**
 * VI02 · SC05 — "Kalau Cuma Tahu Kodenya, Semua Rumor Terasa Penting", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC05.jpg (A–C rebuilt 5 Nov from VI02-SC05-v2.jpg). The stock is ABCD, a code that isn't one (Value Investing V01 too: "Contoh saham
 * jangan gunakan ICBP, karena ini hanya saham contoh"), and its chart is a shape with no figures: these are rumours.
 *
 *  A  "hanya kode dan chart-nya": one large card with nothing on it but the code and its candles.
 *  B  three weeks, one message at a time, each with its reaction; the card makes room and its candles climb, then fall.
 *  C  "Masalah utamanya bukan karena rumor selalu salah": the three messages small in a row, Simon's line under them, and on
 *     "Rumor bisa benar, bisa juga salah" a tick, a cross and a question mark.
 *  D  "Dia nggak tahu…": three things he can't check, each named as its sentence comes: "Masalahnya: ngga punya standar penilaian".
 *  E  "Bandingkan dengan Ibu Sari": her shop, the rumour, her supplier book, NOT OUR SUPPLIER, and she carries on.
 *  F  "Semakin kita memahami bisnis": Simon's closing line.
 */
import { random, useCurrentFrame } from "remotion";
import { Candles, SoftGround, SourceTag, Stage, gridOf, theme, typeStyle, useMotion, usePalette, useShadow, type Bar } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, GrowArrow, IconDisc, Line, WordPill, ease, useWords } from "../components/kit";
import { SHOP, ShopWindow } from "../components/Shop";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the card: the code and its line, and the room it makes for the messages
const TAPE = { y: 190, h: 620, w: 1180, narrow: 880, left: 120, pad: 60, top: 180, code: 72, bars: 34, noise: 0.06 };
/** The chart's shape, week by week: quiet, up on the first message, down on the next two. */
const SHAPE = [0.46, 0.5, 0.45, 0.52, 0.48, 0.55, 0.5, 0.56, 0.72, 0.68, 0.84, 0.8, 0.9, 0.62, 0.66, 0.46, 0.5, 0.3, 0.36, 0.16, 0.2, 0.06];
const REACH = [8, 12, 17, 21];
const shapeAt = (t: number) => {
  const i = Math.min(Math.floor(t), SHAPE.length - 2);
  return SHAPE[i] + (SHAPE[i + 1] - SHAPE[i]) * (t - i);
};
/** The shape as candles, seeded: each opens on the last one's close. */
const TAPE_BARS = Array.from({ length: TAPE.bars }).reduce<Bar[]>((bars, _, i) => {
  const o = bars.length ? bars[bars.length - 1].c : SHAPE[0];
  const c = shapeAt((i / (TAPE.bars - 1)) * (SHAPE.length - 1)) + (random(`abcd-close-${i}`) - 0.5) * TAPE.noise;
  return [...bars, { o, c, h: Math.max(o, c) + random(`abcd-high-${i}`) * TAPE.noise, l: Math.min(o, c) - random(`abcd-low-${i}`) * TAPE.noise }];
}, []);

// B — the weeks, one at a time
const SAID = { cx: 1412, w: 680, h: 190, week: 290, y: 340, chip: 670, chipH: 84 };
const WEEKS = [
  { week: "WEEK 1", said: "“Katanya mau diakuisisi!”", then: "BUY MORE", tone: theme.color.checkGreen, at: "Minggu pertama", saidAt: "Katanya perusahaan", thenAt: "Dia langsung menambah" },
  { week: "WEEK 2", said: "“Pemegang saham besar jual!”", then: "PANIC", tone: theme.color.calendarRed, at: "Minggu berikutnya", saidAt: "Pemegang saham", thenAt: "Dia mulai panik" },
  { week: "WEEK 3", said: "“Laporan keuangan bermasalah!”", then: "SELL", tone: theme.color.calendarRed, at: "Lalu muncul", saidAt: "Laporan keuangannya", thenAt: "Dia langsung menjual" },
];
const bubbleRadius = `${theme.shape.cardRadius}px ${theme.shape.cardRadius}px ${theme.shape.cardRadius}px 6px`;

// C — the three again, and what any of them may turn out to be
const MINI = { w: 500, h: 150, gap: 40, y: 340, size: 34, badge: 72, line: 640 };
const miniX = (i: number) => CX - (3 * MINI.w + 2 * MINI.gap) / 2 + i * (MINI.w + MINI.gap);

// D — what he can't check
const UNKNOWN = [
  { icon: "package", label: "Jual apa?", at: "perusahaan menjual" },
  { icon: "coins", label: "Income source?", at: "uangnya datang" },
  { icon: "chart-line-up", label: "Kesehatan bisnis?", at: "seberapa sehat" },
];
const Q = { y: 420, gap: 340, d: 190, line: 720, label: 28, labelSize: 34, drop: 14 };

// E — the book
const BOOK = { x: 1180, w: 644, y: 200, h: 680, rowY: 150, rowH: 96, rows: 5 };
const RUMOUR = { x: 500, y: 40, w: 500, h: 104 };
const CLOSE = { y: 340, h: 340 };

/** A round badge on a message's corner: true, false, or nobody knows yet. */
const Verdict = ({ x, y, p, kind }: { x: number; y: number; p: number; kind: "true" | "false" | "unknown" }) =>
  p <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x - MINI.badge / 2, top: y - MINI.badge / 2, width: MINI.badge, height: MINI.badge, borderRadius: 999, background: kind === "true" ? theme.color.checkGreen : kind === "false" ? theme.color.calendarRed : theme.color.connector, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {kind === "unknown" ? (
        <div style={{ ...typeStyle("title"), fontSize: 40, color: theme.color.worldWall }}>?</div>
      ) : (
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path d={kind === "true" ? "M 8 21 L 17 30 L 32 11" : "M 10 10 L 30 30 M 30 10 L 10 30"} fill="none" stroke={theme.color.worldWall} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const someoneAt = W("Seseorang");
  const room = ease(f, W("Minggu pertama") - m.sec(0.25), m.move);
  const tapeX = mix((theme.canvas.width - TAPE.w) / 2, TAPE.left, room);
  const tapeW = mix(TAPE.w, TAPE.narrow, room);
  const weeksAt = WEEKS.map((k) => W(k.saidAt));
  const reach = [W("kode dan"), ...weeksAt].reduce((n, at, i) => n + (REACH[i] - (REACH[i - 1] ?? 0)) * ease(f, at, m.sec(i ? 0.9 : 0.7)), 0);
  const chartW = tapeW - 2 * TAPE.pad;
  const chartH = TAPE.h - TAPE.top - TAPE.pad;
  const tapeGrid = gridOf(TAPE_BARS.map((b) => b.c), [0, 1], { x: TAPE.pad, y: TAPE.top, w: chartW, h: chartH }, 0);

  const lineAt = W("Masalah utamanya");
  const noBasisAt = W("Masalahnya adalah");
  const sariAt = W("Bandingkan");
  const rumourAt = W("Supplier kamu");
  const bookAt = W("buka catatannya");
  const stampAt = W("Itu bukan");
  const endAt = W("Semakin kita");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the other way round, then only the code */}
      <Appear at={-m.reveal} out={someoneAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={TAPE.y + TAPE.h / 2} w={theme.canvas.width} align="center" weight={500} text="Bayangkan kebalikannya." mark="kebalikannya" />
      </Appear>
      <Appear at={someoneAt} out={lineAt - m.sec(0.2)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={tapeX} y={TAPE.y} w={tapeW} h={TAPE.h}>
          <div style={{ position: "absolute", left: TAPE.pad, top: 48, fontFamily: theme.text.family, fontSize: TAPE.code, fontWeight: 700, letterSpacing: 1, color: c.indigo }}>ABCD</div>
          <Candles bars={TAPE_BARS} grid={tapeGrid} shown={reach / (SHAPE.length - 1)} opacity={ease(f, W("kode dan"), m.fade)} />
          <SourceTag kind="synthetic" />
        </Card>
      </Appear>

      {/* B — one message at a time */}
      {WEEKS.map((k, i) => {
        const nextAt = i < WEEKS.length - 1 ? W(WEEKS[i + 1].at) : lineAt;
        return (
          <Appear key={k.week} at={W(k.at)} out={nextAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <WordPill x={SAID.cx} y={SAID.week} text={k.week} />
            <div style={{ position: "absolute", inset: 0, opacity: ease(f, W(k.saidAt), m.reveal) }}>
              <Card x={SAID.cx - SAID.w / 2} y={SAID.y} w={SAID.w} h={SAID.h} style={{ display: "flex", alignItems: "center", padding: "0 44px", boxSizing: "border-box", borderRadius: bubbleRadius }}>
                <div style={{ ...typeStyle("title"), fontSize: 44, fontWeight: 500, color: c.ink, textWrap: "balance" }}>{k.said}</div>
              </Card>
            </div>
            <GrowArrow x0={SAID.cx} y0={SAID.y + SAID.h + 14} x1={SAID.cx} y1={SAID.chip - SAID.chipH / 2 - 12} p={ease(f, W(k.thenAt) - m.sec(0.2), m.sec(0.25))} />
            <div style={{ position: "absolute", left: SAID.cx, top: SAID.chip, transform: "translate(-50%, -50%)", height: SAID.chipH, padding: "0 40px", display: "flex", alignItems: "center", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${k.tone}`, ...typeStyle("title"), fontSize: 38, color: k.tone, whiteSpace: "nowrap", opacity: ease(f, W(k.thenAt), m.reveal) }}>{k.then}</div>
          </Appear>
        );
      })}

      {/* C — the three again */}
      <Appear at={lineAt} out={noBasisAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {WEEKS.map((k, i) => (
          <Appear key={k.week} at={lineAt + i * m.sec(0.15)} style={{ left: 0, top: 0 }}>
            <Card x={miniX(i)} y={MINI.y} w={MINI.w} h={MINI.h} style={{ display: "flex", alignItems: "center", padding: "0 36px", boxSizing: "border-box", borderRadius: bubbleRadius }}>
              <div style={{ ...typeStyle("title"), fontSize: MINI.size, fontWeight: 500, color: c.ink, textWrap: "balance" }}>{k.said}</div>
            </Card>
          </Appear>
        ))}
        <Verdict x={miniX(0) + MINI.w - 8} y={MINI.y + 8} p={ease(f, W("bisa benar"), m.reveal)} kind="true" />
        <Verdict x={miniX(1) + MINI.w - 8} y={MINI.y + 8} p={ease(f, W("bisa juga"), m.reveal)} kind="false" />
        <Verdict x={miniX(2) + MINI.w - 8} y={MINI.y + 8} p={ease(f, W("juga salah"), m.reveal)} kind="unknown" />
        <Appear at={lineAt + m.sec(0.4)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={MINI.line} w={theme.canvas.width} align="center" size={56} weight={500} text="Masalahnya bukan rumornya." mark="bukan rumornya" />
        </Appear>
      </Appear>

      {/* D — he can't check */}
      <Appear at={noBasisAt} out={sariAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {UNKNOWN.map((u, i) => {
          const p = ease(f, W(u.at), m.reveal);
          const x = CX + (i - 1) * Q.gap;
          return (
            <div key={u.icon} style={{ position: "absolute", inset: 0 }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.25 + 0.75 * p }}>
                <IconDisc x={x} y={Q.y} d={Q.d} icon={u.icon} />
                <div style={{ position: "absolute", left: x + Q.d / 2 - 38, top: Q.y - Q.d / 2 - 14, width: 64, height: 64, borderRadius: 999, background: theme.color.calendarRed, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 40, color: c.cardBg, opacity: p }}>?</div>
              </div>
              <div style={{ position: "absolute", left: x - Q.gap / 2, top: Q.y + Q.d / 2 + Q.label, width: Q.gap, textAlign: "center", ...typeStyle("label"), fontSize: Q.labelSize, fontWeight: 600, color: c.ink, opacity: p, transform: `translateY(${(-Q.drop * (1 - p)).toFixed(1)}px)` }}>{u.label}</div>
            </div>
          );
        })}
        <Appear at={W("nggak punya dasar")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={Q.line} w={theme.canvas.width} align="center" size={48} weight={500} text="Masalahnya: ngga punya standar penilaian" mark="standar penilaian" />
        </Appear>
      </Appear>

      {/* E — Ibu Sari can */}
      <Appear at={sariAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <ShopWindow x={SHOP.left} f={f} shadow={shadow.soft}>
          <Appear at={rumourAt} out={endAt} style={{ left: 0, top: 0 }}>
            <Card x={RUMOUR.x} y={RUMOUR.y} w={RUMOUR.w} h={RUMOUR.h} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: `${theme.shape.cardRadius}px ${theme.shape.cardRadius}px 6px ${theme.shape.cardRadius}px` }}>
              <div style={{ ...typeStyle("title"), fontSize: 30, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>“Supplier kamu mau bangkrut!”</div>
            </Card>
          </Appear>
        </ShopWindow>
        <Appear at={bookAt} out={endAt} style={{ left: 0, top: 0 }}>
          <Card x={BOOK.x} y={BOOK.y} w={BOOK.w} h={BOOK.h}>
            <div style={{ position: "absolute", left: 44, top: 46, ...typeStyle("title"), color: c.ink }}>Buku supplier</div>
            {Array.from({ length: BOOK.rows }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: 44, top: BOOK.rowY + i * BOOK.rowH, width: BOOK.w - 88, height: BOOK.rowH - 24, borderRadius: 14, background: c.bg, opacity: ease(f, W("cek nama") + m.sec(0.08) * i, m.reveal) }}>
                <div style={{ position: "absolute", left: 24, top: 26, width: 240 - (i % 3) * 40, height: 20, borderRadius: 10, background: theme.color.neutralDisc }} />
              </div>
            ))}
            <div style={{ position: "absolute", left: BOOK.w / 2, top: BOOK.h / 2 + 30, transform: `translate(-50%, -50%) rotate(-6deg) scale(${mix(1.2, 1, ease(f, stampAt, m.sec(0.25))).toFixed(3)})`, padding: "16px 34px", borderRadius: 16, background: c.cardBg, boxShadow: `inset 0 0 0 5px ${theme.color.calendarRed}`, ...typeStyle("title"), fontSize: 46, fontWeight: 700, color: theme.color.calendarRed, whiteSpace: "nowrap", opacity: ease(f, stampAt, m.sec(0.2)) }}>NOT OUR SUPPLIER</div>
          </Card>
        </Appear>
        {/* F — she goes on with her day; the question is yours */}
        <Appear at={endAt + m.sec(0.25)} style={{ left: 0, top: 0 }}>
          <Card x={BOOK.x} y={CLOSE.y} w={BOOK.w} h={CLOSE.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", gap: 16 }}>
            <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Masalahnya:</div>
            <div style={{ ...typeStyle("title"), fontWeight: 600, color: c.indigo }}>kamu tahu cara mengeceknya atau nggak?</div>
          </Card>
        </Appear>
      </Appear>
    </Stage>
  );
};
