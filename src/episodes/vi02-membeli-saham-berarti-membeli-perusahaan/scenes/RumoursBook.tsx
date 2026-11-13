/**
 * VI02 · SC05 — "Kalau Cuma Tahu Kodenya, Semua Rumor Terasa Penting" in VI01's look (Simon 13 Nov: "revamp visual untuk
 * scene 5-8"), from the ChatGPT storyboard docs/vi-style/storyboards/VI02-SC05-v3.png. The old scene is scenes/Rumours.tsx
 * (VI01_LOOK = false).
 *
 *  A  "Sekarang bayangkan kebalikannya. Seseorang…": the investor (black line art in VI01's style, ChatGPT 13 Nov,
 *     public/art/vi02/investor: tenang, senang, panik, lesu) with his phone; "Seseorang membeli saham": a card with nothing
 *     but ABCD, its candles drawn on "kode dan chart-nya". ABCD is not a real code (V01: "Contoh saham jangan gunakan ICBP") and its tape is a shape.
 *  B  the three weeks: each message comes in as a chat bubble under its week; his pose and the pill over him change on his
 *     reaction (Tambah posisi → Panik → Jual rugi), the candles climb, then fall.
 *  C  "Masalah utamanya bukan karena rumor selalu salah" (a cut): the three messages small in a row, Simon's line under them,
 *     and on "Rumor bisa benar, bisa juga salah" a tick, a cross and a question mark.
 *  D  "Masalahnya adalah" (a cut): an empty "Buku bisnis", its three rows coming in on their sentences, each a "?";
 *     Simon's line "Masalahnya: ngga punya standar penilaian".
 *  E  "Bandingkan dengan Ibu Sari" (a cut): VI01's frame, warung and Ibu Sari (as in SC03); the rumour comes in at the frame's
 *     edge, her supplier book opens, its rows are checked one by one, and she answers.
 *  F  "Semakin kita memahami bisnis" (a cut): messages flow into the "Buku bisnis", now filled, and come out sorted: a short
 *     lit stack "Penting" and a tall grey one "Cuma bikin bereaksi".
 */
import { interpolateColors, random, staticFile, useCurrentFrame } from "remotion";
import { Candles, SoftGround, SourceTag, Stage, gridOf, theme, typeStyle, useMotion, usePalette, useShadow, type Bar } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Figure, Glyph, GrowArrow, Line, Pic, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const R = theme.shape.cardRadius;

// A–B — the investor, his card, the messages
const POSES = {
  tenang: { src: "art/vi02/investor/tenang.png", w: 248, h: 835 },
  senang: { src: "art/vi02/investor/senang.png", w: 278, h: 840 },
  panik: { src: "art/vi02/investor/panik.png", w: 572, h: 1412 },
  lesu: { src: "art/vi02/investor/lesu.png", w: 273, h: 834 },
} as const;
type Pose = keyof typeof POSES;
const MAN = { cx: 330, floor: 880, h: 560 };
const PILL_Y = MAN.floor - MAN.h - 56;
/** The card: wide and centred until the first message, then it makes room at the right. */
const TAPE = { y: 250, h: 520, x0: 640, w0: 760, x1: 590, w1: 600, pad: 40, head: 130, code: 64, bars: 34, noise: 0.06 };
/** The tape's shape, week by week: quiet, up on the first message, down on the next two. */
const SHAPE = [0.46, 0.5, 0.45, 0.52, 0.48, 0.55, 0.5, 0.56, 0.72, 0.68, 0.84, 0.8, 0.9, 0.62, 0.66, 0.46, 0.5, 0.3, 0.36, 0.16, 0.2, 0.06];
const REACH = [8, 12, 17, 21];
const shapeAt = (t: number) => {
  const i = Math.min(Math.floor(t), SHAPE.length - 2);
  return SHAPE[i] + (SHAPE[i + 1] - SHAPE[i]) * (t - i);
};
const TAPE_BARS = Array.from({ length: TAPE.bars }).reduce<Bar[]>((bars, _, i) => {
  const o = bars.length ? bars[bars.length - 1].c : SHAPE[0];
  const c = shapeAt((i / (TAPE.bars - 1)) * (SHAPE.length - 1)) + (random(`abcd-close-${i}`) - 0.5) * TAPE.noise;
  return [...bars, { o, c, h: Math.max(o, c) + random(`abcd-high-${i}`) * TAPE.noise, l: Math.min(o, c) - random(`abcd-low-${i}`) * TAPE.noise }];
}, []);

const BUB = { x: 1250, w: 510, y: 360, h: 230, chipY: 312, size: 40 };
const WEEKS = [
  { week: "Minggu 1", said: "Katanya mau diakuisisi investor asing", then: "Tambah posisi", sign: "+", tone: theme.color.ok, pose: "senang", at: "Minggu pertama", saidAt: "Katanya perusahaan", thenAt: "Dia langsung menambah" },
  { week: "Minggu 2", said: "Pemegang saham besar mulai jual", then: "Panik", sign: "!", tone: theme.color.crossRed, pose: "panik", at: "Minggu berikutnya", saidAt: "Pemegang saham", thenAt: "Dia mulai panik" },
  { week: "Minggu 3", said: "Laporan keuangan bermasalah, bisa delisting", then: "Jual rugi", sign: "−", tone: theme.color.crossRed, pose: "lesu", at: "Lalu muncul", saidAt: "Laporan keuangannya", thenAt: "Dia langsung menjual" },
] as const;
const inRadius = `${R}px ${R}px ${R}px 6px`;

// C — the three again
const MINI = { w: 470, h: 210, gap: 50, y: 330, chipY: 284, size: 34, badge: 76, badgeY: 620, line: 790 };
const miniX = (i: number) => CX - (3 * MINI.w + 2 * MINI.gap) / 2 + i * (MINI.w + MINI.gap);

// D — the empty book
const BOOK = { w: 780, y: 190, head: 110, rowH: 116, gap: 22, pad: 40, line: 830 };
const BOOK_H = BOOK.head + 3 * BOOK.rowH + 2 * BOOK.gap + BOOK.pad;
const UNKNOWN = [
  { icon: "package", label: "Jual apa?", at: "perusahaan menjual" },
  { icon: "coins", label: "Income source?", at: "uangnya datang" },
  { icon: "chart-line-up", label: "Kesehatan bisnis?", at: "seberapa sehat" },
] as const;

// E — Ibu Sari's world, as in SC03
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 722;
const WARUNG = { h: 364, cx: 760 };
const IBU = { h: 336, cx: 440 };
const RUMOUR = { x: 1130, y: 236, w: 560, h: 104 };
const SUP = { x: 1170, y: 380, w: 520, rowH: 88, gap: 14, head: 96 };
const SUP_H = SUP.head + 3 * SUP.rowH + 2 * SUP.gap + 34;
const SUPPLIERS = ["UD Makmur", "CV Sinar Jaya", "Toko Abadi"];
const REPLY = { x: 300, y: 250, w: 470, h: 104 };

// F — sorted
const SORT = { book: { x: 760, y: 300, w: 400 }, lanes: [380, 500, 620], from: 170, out: 1330, outW: 380, keepY: 330, noiseY: 520 };

/** A chat bubble, its tail at the bottom-left corner. */
const Bubble = ({ x, y, w, h, text, size, tone }: { x: number; y: number; w: number; h: number; text: string; size: number; tone?: string }) => {
  const c = usePalette();
  return (
    <Card x={x} y={y} w={w} h={h} style={{ display: "flex", alignItems: "center", padding: "0 36px", borderRadius: inRadius, background: tone ?? c.cardBg }}>
      <div style={{ ...typeStyle("title"), fontSize: size, fontWeight: 500, lineHeight: 1.25, color: c.ink, textWrap: "balance" }}>{text}</div>
    </Card>
  );
};

/** A round badge: true, false, or nobody knows yet. */
const Verdict = ({ x, y, p, kind }: { x: number; y: number; p: number; kind: "true" | "false" | "unknown" }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - MINI.badge / 2, top: y - MINI.badge / 2, width: MINI.badge, height: MINI.badge, borderRadius: 999, background: kind === "true" ? theme.color.ok : kind === "false" ? theme.color.crossRed : c.indigo, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {kind === "unknown" ? (
        <div style={{ ...typeStyle("title"), fontSize: 42, color: c.cardBg }}>?</div>
      ) : (
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path d={kind === "true" ? "M 8 21 L 17 30 L 32 11" : "M 10 10 L 30 30 M 30 10 L 10 30"} fill="none" stroke={c.cardBg} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

/** A book row: its icon on a grey disc, its label, and at the right either a "?" or a filled line. */
const BookRow = ({ icon, label, p, open }: { icon: string; label?: string; p: number; open: boolean }) => {
  const c = usePalette();
  return (
    <div style={{ position: "relative", height: "100%", borderRadius: 20, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", opacity: p, transform: `translateY(${((1 - p) * 10).toFixed(1)}px)` }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Glyph icon={icon} size={40} tone={theme.color.neutralIcon} />
      </div>
      {label ? <div style={{ ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", flex: 1 }}>{label}</div> : <div style={{ flex: 1 }} />}
      {open ? (
        <div style={{ width: 84, height: 72, borderRadius: 16, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 44, color: c.indigo, flex: "none" }}>?</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "none" }}>
          <div style={{ width: 150, height: 12, borderRadius: 6, background: c.indigo }} />
          <div style={{ width: 100, height: 12, borderRadius: 6, background: theme.color.skeleton }} />
        </div>
      )}
    </div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const lineAt = W("Masalah utamanya");
  const noBasisAt = W("Masalahnya adalah");
  const sariAt = W("Bandingkan");
  const endAt = W("Semakin kita");

  // A–B
  const codeAt = W("kode dan");
  const room = ease(f, W("Minggu pertama") - m.sec(0.25), m.move);
  const tapeX = mix(TAPE.x0, TAPE.x1, room);
  const tapeW = mix(TAPE.w0, TAPE.w1, room);
  const saidAt = WEEKS.map((k) => W(k.saidAt));
  const thenAt = WEEKS.map((k) => W(k.thenAt));
  const reach = [codeAt, ...saidAt].reduce((n, at, i) => n + (REACH[i] - (REACH[i - 1] ?? 0)) * ease(f, at, m.sec(i ? 0.9 : 0.7)), 0);
  const tapeGrid = gridOf(TAPE_BARS.map((b) => b.c), [0, 1], { x: TAPE.pad, y: TAPE.head, w: tapeW - 2 * TAPE.pad, h: TAPE.h - TAPE.head - TAPE.pad }, 0);
  /** his pose: each one takes over on its reaction */
  const poseOf: { pose: Pose; at: number }[] = [{ pose: "tenang", at: -1e6 }, ...WEEKS.map((k, i) => ({ pose: k.pose as Pose, at: thenAt[i] }))];

  // C
  const verdicts = [W("bisa benar"), W("bisa juga"), W("juga salah")];

  // E
  const rumourAt = W("Supplier kamu");
  const supAt = W("buka catatannya");
  const checkAt = W("cek nama");
  const replyAt = W("Itu bukan");
  /** the check runs down her suppliers, one row after another, and stops past the last */
  const scan = (f - checkAt) / m.sec(0.35);

  // F
  const keepAt = W("benar-benar penting");
  const noiseAt = W("hanya membuat");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–B: the investor, his code, the messages */}
      <Shot from={-1} to={lineAt} block={BLOCK.SC05} cutIn={false}>
        {poseOf.map((k, i) => {
          const next = poseOf[i + 1]?.at ?? 1e6;
          const p = (i === 0 ? ease(f, -m.reveal, m.reveal) : ease(f, k.at, m.sec(0.15))) * (1 - ease(f, next, m.sec(0.15)));
          if (p <= 0.001) return null;
          const a = POSES[k.pose];
          const wd = (MAN.h * a.w) / a.h;
          return <Pic key={k.pose} src={staticFile(a.src)} style={{ position: "absolute", left: MAN.cx - wd / 2, top: MAN.floor - MAN.h, width: wd, height: MAN.h, opacity: p }} />;
        })}
        {WEEKS.map((k, i) => {
          const p = ease(f, thenAt[i], m.reveal) * (i < WEEKS.length - 1 ? 1 - ease(f, thenAt[i + 1], m.sec(0.15)) : 1);
          return p > 0.001 ? (
            <div key={k.then} style={{ position: "absolute", left: MAN.cx, top: PILL_Y + (1 - p) * 10, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 30px 10px 12px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, opacity: p, whiteSpace: "nowrap" }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: k.tone, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 34, lineHeight: 1, color: c.cardBg }}>{k.sign}</div>
              <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{k.then}</div>
            </div>
          ) : null;
        })}
        <Appear at={W("Seseorang")} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={tapeX} y={TAPE.y} w={tapeW} h={TAPE.h}>
            <div style={{ position: "absolute", left: TAPE.pad, top: 36, fontFamily: theme.text.family, fontSize: TAPE.code, fontWeight: 700, letterSpacing: 1, color: c.indigo }}>ABCD</div>
            <Candles bars={TAPE_BARS} grid={tapeGrid} shown={reach / (SHAPE.length - 1)} opacity={ease(f, codeAt, m.fade)} />
            <SourceTag kind="synthetic" />
          </Card>
        </Appear>
        {WEEKS.map((k, i) => {
          const out = i < WEEKS.length - 1 ? W(WEEKS[i + 1].at) - m.sec(0.15) : 1e6;
          return (
            <Appear key={k.week} at={W(k.at)} out={out} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
              <WordPill x={BUB.x + 90} y={BUB.chipY} text={k.week} size={28} />
              <div style={{ position: "absolute", inset: 0, opacity: ease(f, saidAt[i], m.reveal), transform: `translateX(${((1 - ease(f, saidAt[i], m.move)) * 40).toFixed(1)}px)` }}>
                <Bubble x={BUB.x} y={BUB.y} w={BUB.w} h={BUB.h} text={k.said} size={BUB.size} />
              </div>
            </Appear>
          );
        })}
      </Shot>

      {/* C: the three again — any of them may be true */}
      <Shot from={lineAt} to={noBasisAt} block={BLOCK.SC05}>
        {WEEKS.map((k, i) => (
          <Appear key={k.week} at={lineAt + i * m.sec(0.12)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <WordPill x={miniX(i) + 80} y={MINI.chipY} text={k.week} size={26} />
            <Bubble x={miniX(i)} y={MINI.y} w={MINI.w} h={MINI.h} text={k.said} size={MINI.size} />
          </Appear>
        ))}
        {(["true", "false", "unknown"] as const).map((kind, i) => (
          <Verdict key={kind} x={miniX(i) + MINI.w / 2} y={MINI.badgeY} p={ease(f, verdicts[i], m.reveal)} kind={kind} />
        ))}
        <Appear at={lineAt + m.sec(0.4)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={MINI.line} w={theme.canvas.width} align="center" size={52} weight={500} text="Masalahnya bukan rumornya." mark="bukan rumornya" />
        </Appear>
      </Shot>

      {/* D: what he can't check — an empty book */}
      <Shot from={noBasisAt} to={sariAt} block={BLOCK.SC05}>
        <Appear at={noBasisAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={CX - BOOK.w / 2} y={BOOK.y} w={BOOK.w} h={BOOK_H}>
            <div style={{ position: "absolute", left: BOOK.pad, top: 30, display: "flex", alignItems: "center", gap: 18 }}>
              <Glyph icon="book-open" size={56} tone={c.ink} />
              <div style={{ ...typeStyle("title"), fontSize: 46, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Buku bisnis</div>
            </div>
            {UNKNOWN.map((u, i) => (
              <div key={u.icon} style={{ position: "absolute", left: BOOK.pad, top: BOOK.head + i * (BOOK.rowH + BOOK.gap), width: BOOK.w - 2 * BOOK.pad, height: BOOK.rowH }}>
                <BookRow icon={u.icon} label={u.label} p={ease(f, W(u.at), m.reveal)} open />
              </div>
            ))}
          </Card>
        </Appear>
        <Appear at={W("nggak punya dasar")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={BOOK.line} w={theme.canvas.width} align="center" size={48} weight={500} text="Masalahnya: ngga punya standar penilaian" mark="standar penilaian" />
        </Appear>
      </Shot>

      {/* E: Ibu Sari can check */}
      <Shot from={sariAt} to={endAt} block={BLOCK.SC05}>
        <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, borderRadius: R, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}` }} />
        <Figure name="warung" cx={WARUNG.cx} floor={FLOOR} h={WARUNG.h} />
        <Figure name="ibu-sari" cx={IBU.cx} floor={FLOOR} h={IBU.h} />
        <Appear at={sariAt + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <WordPill x={IBU.cx} y={790} text="Ibu Sari" size={32} />
        </Appear>
        {/* the rumour, from someone at the frame's edge */}
        <Appear at={rumourAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${((1 - ease(f, rumourAt, m.move)) * 50).toFixed(1)}px)` }}>
            <Card x={RUMOUR.x} y={RUMOUR.y} w={RUMOUR.w} h={RUMOUR.h} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: `${R}px ${R}px 6px ${R}px`, background: theme.color.neutralDisc }}>
              <div style={{ ...typeStyle("title"), fontSize: 36, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Supplier kamu mau bangkrut.</div>
            </Card>
          </div>
        </Appear>
        {/* her book of suppliers, checked row by row */}
        <Appear at={supAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={SUP.x} y={SUP.y} w={SUP.w} h={SUP_H}>
            <div style={{ position: "absolute", left: 34, top: 26, display: "flex", alignItems: "center", gap: 16 }}>
              <Glyph icon="notebook" size={46} tone={c.ink} />
              <div style={{ ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.ink }}>Supplier</div>
            </div>
            {SUPPLIERS.map((name, i) => {
              const on = Math.max(0, 1 - Math.abs(scan - i - 0.5) * 1.6) * (f >= checkAt ? 1 : 0);
              const done = scan > i + 0.5 ? 1 : 0;
              return (
                <div key={name} style={{ position: "absolute", left: 34, top: SUP.head + i * (SUP.rowH + SUP.gap), width: SUP.w - 68, height: SUP.rowH, borderRadius: 18, background: on > 0.3 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: `inset 0 0 0 ${on > 0.3 ? 3 : 2}px ${on > 0.3 ? c.indigo : theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px" }}>
                  <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{name}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontWeight: 700, fontSize: 22, color: c.cardBg, opacity: done, transform: `scale(${(0.7 + 0.3 * done).toFixed(2)})` }}>✓</div>
                </div>
              );
            })}
          </Card>
        </Appear>
        {/* her answer */}
        <Appear at={replyAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={REPLY.x} y={REPLY.y} w={REPLY.w} h={REPLY.h} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: inRadius, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` }}>
            <div style={{ ...typeStyle("title"), fontSize: 36, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Itu bukan supplier saya.</div>
          </Card>
        </Appear>
      </Shot>

      {/* F: what understanding does — the messages come out sorted */}
      <Shot from={endAt} to={1e6} block={BLOCK.SC05} cutOut={false}>
        {Array.from({ length: 9 }, (_, i) => {
          const at = endAt + m.sec(0.3) + i * m.sec(0.42);
          const t = ease(f, at, m.sec(1));
          if (t <= 0.001 || t >= 0.999) return null;
          const y = SORT.lanes[i % 3];
          const x = mix(SORT.from, SORT.book.x - 40, t);
          return (
            <div key={i} style={{ position: "absolute", left: x - 70, top: y - 34, width: 140, height: 68, borderRadius: `${R}px ${R}px ${R}px 6px`, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: Math.min(1, t * 6, (1 - t) * 6) }}>
              {[0, 1, 2].map((d) => <div key={d} style={{ width: 12, height: 12, borderRadius: 999, background: theme.color.neutralIcon }} />)}
            </div>
          );
        })}
        <Appear at={endAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={SORT.book.x} y={SORT.book.y} w={SORT.book.w} h={BOOK.head + 3 * 96 + 2 * 16 + 30}>
            <div style={{ position: "absolute", left: 30, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
              <Glyph icon="book-open" size={46} tone={c.ink} />
              <div style={{ ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Buku bisnis</div>
            </div>
            {UNKNOWN.map((u, i) => (
              <div key={u.icon} style={{ position: "absolute", left: 30, top: BOOK.head - 10 + i * 112, width: SORT.book.w - 60, height: 96 }}>
                <BookRow icon={u.icon} p={1} open={false} />
              </div>
            ))}
          </Card>
        </Appear>
        <GrowArrow x0={SORT.book.x + SORT.book.w + 16} y0={SORT.keepY + 50} x1={SORT.out - 16} y1={SORT.keepY + 50} p={ease(f, keepAt - m.sec(0.25), m.sec(0.3))} />
        <Appear at={keepAt} style={{ left: 0, top: 0 }}>
          <Card x={SORT.out} y={SORT.keepY} w={SORT.outW} h={100} style={{ display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` }}>
            <div style={{ ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.indigo }}>Penting</div>
          </Card>
        </Appear>
        <GrowArrow x0={SORT.book.x + SORT.book.w + 16} y0={SORT.noiseY + 90} x1={SORT.out - 16} y1={SORT.noiseY + 90} p={ease(f, noiseAt - m.sec(0.25), m.sec(0.3))} />
        <Appear at={noiseAt} style={{ left: 0, top: 0 }}>
          {[2, 1, 0].map((k) => (
            <Card key={k} x={SORT.out + k * 12} y={SORT.noiseY + k * 14} w={SORT.outW} h={180} style={{ background: interpolateColors(k, [0, 2], [theme.color.neutralDisc, theme.color.skeleton]), boxShadow: shadow.soft }} />
          ))}
          <div style={{ position: "absolute", left: SORT.out, top: SORT.noiseY, width: SORT.outW, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...typeStyle("title"), fontSize: 38, fontWeight: 500, lineHeight: 1.2, color: theme.color.neutralIcon }}>Cuma bikin<br />bereaksi</div>
        </Appear>
      </Shot>
    </Stage>
  );
};
