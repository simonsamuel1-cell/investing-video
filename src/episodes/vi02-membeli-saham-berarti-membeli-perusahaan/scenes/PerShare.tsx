/**
 * VI02 · SC04 — "Setiap Saham Punya Bagian dari Laba", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC04.jpg. The figures are ICBP's reported 2025 results: net sales Rp74,85 triliun, profit
 * attributable to owners Rp9,22 triliun, basic EPS Rp791 (checked against Kontan's report of the results, 4 Nov 2026).
 *
 *  A  "Misalnya ICBP": the chain down from the code: Revenue 2025, then Net Profit, in the middle.
 *  B  "dibagi berdasarkan seluruh saham": the chain makes room; the profit becomes a field of small squares, one of them
 *     leaving for the EPS card. SC02's square again: a share.
 *  C  "100 saham": a hundred squares of that same field light up → 100 Shares → 100 × EPS ("100 × Rp791") → Bagian
 *     ekonomis dari laba ("= Rp79.100").
 *  D  "bukan berarti seluruh Rp79.100 langsung masuk": the way straight to "Kamu" is crossed; the profit branches into
 *     DIVIDEND ("membagikan … Rp265") and RETAINED / REINVESTED ("sisa labanya").
 *  12 Nov 2026: C and D follow Simon's new VO (Scene 04_1/04_2) on their nearest words; the new figures (Rp79.100, Rp265,
 *  Rp26.500) and the closing "profit ≠ cash" line (Scene 04_3) have no picture of their own yet.
 *  E  "Jadi saat memiliki saham": the point in one line. "Kita juga perlu melihat": the row to follow, each lit on its word,
 *     and it is the "buku bisnis".
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, SourceTag, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, GrowArrow, IconDisc, KamuAvatar, Line, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// the chain
const CHAIN = { w: 500, h: 116, gap: 56, y0: 270, codeY: 196, left: 140 };
/** ICBP's own round logo, in place of the factory icon (Simon, 5 Nov). */
const ICBP_LOGO = "icons/vi02/ICBP.png";
/** "perusahaan nyata": the company's logo in the middle, its code under it; the code then docks at the head of the chain. */
const OPEN = { y: 380, d: 220, codeY: 590, bigSize: 84, dockSize: 30 };
const chainY = (i: number) => CHAIN.y0 + i * (CHAIN.h + CHAIN.gap);
const CARDS = [
  { label: "Revenue 2025", value: "≈ Rp74,85T" },
  { label: "Net Profit", value: "≈ Rp9,22T" },
  { label: "EPS", value: "≈ Rp791 / share" },
];

// the shares
const FIELD = { x: 760, y: 230, n: 24, cell: 17, gap: 3, own: 10, lift: { col: 3, row: 16 } };
const step = FIELD.cell + FIELD.gap;
const OWN = { cx: 1510, ys: [300, 470, 640], line: 830 };

// where the profit goes
const GO = { from: CHAIN.left + CHAIN.w, y: chainY(1) + CHAIN.h / 2, up: 330, down: 690, pillX: 1010, retainX: 1060, you: 1460, keep: 1600, d: 130, crossX: 1060 };

// the row to follow
const BOOK = { w: 1560, h: 420, y: 300, disc: 130, line: 500 };
const FOLLOW = [
  { icon: "coins", label: "Revenue", at: "pendapatannya" },
  { icon: "chart-line-up", label: "Profit", at: "labanya, laba" },
  { icon: "package", label: "EPS", at: "laba per sahamnya" },
  { icon: "arrows-clockwise", label: "Dividend / Reinvestment", at: "bagaimana laba" },
] as const;

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;

  const dock = ease(f, W("Pada 2025"), m.move);
  const splitAt = W("Kalau laba itu");
  const room = ease(f, splitAt - m.sec(0.25), m.move);
  const chainX = mix(CX - CHAIN.w / 2, CHAIN.left, room);
  const chainCX = chainX + CHAIN.w / 2;
  const cardAt = [W("menghasilkan pendapatan"), W("laba bersih"), W("hasilnya sekitar")];

  const ownAt = W("Kalau kamu punya");
  const tapiAt = W("Tapi bukan");
  const bookAt = W("Jadi saat");
  const rowAt = W("Kita juga perlu");
  const fieldP = ease(f, splitAt + m.sec(0.15), m.sec(0.9));
  const lift = ease(f, W("hasilnya sekitar"), m.sec(0.8));
  const own = ease(f, W("100 saham"), m.sec(0.9));
  const liftX = mix(FIELD.x + FIELD.lift.col * step + FIELD.cell / 2, chainX + CHAIN.w + 26, lift);
  const liftY = mix(FIELD.y + FIELD.lift.row * step + FIELD.cell / 2, chainY(2) + CHAIN.h / 2, lift);

  const paid = ease(f, W("Perusahaan membagikan"), m.move);
  const youX = GO.you;
  const youY = mix(GO.y, GO.up, paid);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — a real company, then down from its code */}
      <Appear at={-m.reveal} out={W("Pada 2025")} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <IconDisc x={CX} y={OPEN.y} d={OPEN.d} logo={ICBP_LOGO} />
      </Appear>
      <Appear at={W("Misalnya ICBP")} out={bookAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: chainCX, top: mix(OPEN.codeY, CHAIN.codeY, dock), transform: "translate(-50%, -50%)", padding: `${mix(0, 12, dock).toFixed(1)}px ${mix(0, 30, dock).toFixed(1)}px`, borderRadius: 999, background: dock > 0.01 ? c.cardBg : undefined, boxShadow: dock > 0.5 ? `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` : undefined, fontFamily: theme.text.family, fontSize: mix(OPEN.bigSize, OPEN.dockSize, dock), fontWeight: dock > 0.5 ? 600 : 700, letterSpacing: 1, color: c.indigo, whiteSpace: "nowrap" }}>ICBP</div>
        {CARDS.map((k, i) => {
          const p = ease(f, cardAt[i], m.reveal);
          return (
            <div key={k.label} style={{ position: "absolute", inset: 0, opacity: p }}>
              <Card x={chainX} y={chainY(i) + (1 - p) * 12} w={CHAIN.w} h={CHAIN.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 36px" }}>
                <div style={{ ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap" }}>{k.label}</div>
                <div style={{ ...typeStyle("title"), fontSize: 42, color: c.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
              </Card>
            </div>
          );
        })}
        {[0, 1, 2].map((i) => (
          <GrowArrow key={i} x0={chainCX} y0={i === 0 ? CHAIN.codeY + 34 : chainY(i - 1) + CHAIN.h + 8} x1={chainCX} y1={chainY(i) - 8} p={ease(f, cardAt[i] - m.sec(0.25), m.sec(0.3))} />
        ))}
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, cardAt[0], m.reveal) }}>
          <SourceTag kind="market" label="ICBP · Laporan keuangan 2025" x={chainX} y={chainY(2) + CHAIN.h + 58} anchor="left" />
        </div>
      </Appear>

      {/* B–C — the field of shares */}
      <Appear at={splitAt} out={tapiAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: FIELD.n * FIELD.n }, (_, i) => {
            const col = i % FIELD.n;
            const row = Math.floor(i / FIELD.n);
            const wave = (col + row) / (2 * FIELD.n);
            if (fieldP < wave) return null;
            const inOwn = col < FIELD.own && row < FIELD.own;
            const lit = inOwn ? Math.min(1, Math.max(0, own * 1.2 - (row * FIELD.own + col) / 120)) : 0;
            if (lift > 0 && col === FIELD.lift.col && row === FIELD.lift.row) return null;
            return <rect key={i} x={FIELD.x + col * step} y={FIELD.y + row * step} width={FIELD.cell} height={FIELD.cell} rx={4} fill={interpolateColors(lit, [0, 1], [theme.color.hairlineBrandSolid, theme.color.connector])} />;
          })}
        </svg>
        <div style={{ position: "absolute", left: liftX - 13, top: liftY - 13, width: 26, height: 26, borderRadius: 7, background: theme.color.worldLight, opacity: Math.min(1, lift * 4) }} />
        <Appear at={W("setiap lembar")} out={ownAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={OWN.line} w={theme.canvas.width} align="center" size={44} weight={500} text="Satu saham = bagian kecil dari bisnis yang nyata" mark="bagian kecil" />
        </Appear>
        <Appear at={W("100 saham")} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[0]} text="100 Shares" />
        </Appear>
        <GrowArrow x0={OWN.cx} y0={OWN.ys[0] + 42} x1={OWN.cx} y1={OWN.ys[1] - 42} p={ease(f, W("100", 1) - m.sec(0.25), m.sec(0.3))} />
        <Appear at={W("100", 1)} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[1]} text="100 × EPS" />
        </Appear>
        <GrowArrow x0={OWN.cx} y0={OWN.ys[1] + 42} x1={OWN.cx} y1={OWN.ys[2] - 42} p={ease(f, W("Rp79.100") - m.sec(0.25), m.sec(0.3))} />
        <Appear at={W("Rp79.100")} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[2]} text="Bagian ekonomis dari laba" />
        </Appear>
      </Appear>

      {/* D — where the profit goes */}
      <Appear at={tapiAt} out={bookAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - paid }}>
          <GrowArrow x0={GO.from + 50} y0={GO.y} x1={youX - GO.d / 2 - 14} y1={GO.y} p={ease(f, tapiAt + m.sec(0.1), m.sec(0.6))} />
          <svg width={64} height={64} style={{ position: "absolute", left: GO.crossX - 32, top: GO.y - 32, opacity: ease(f, W("rekeningmu"), m.reveal) }}>
            <g stroke={theme.color.calendarRed} strokeWidth={8} strokeLinecap="round">
              <line x1={14} y1={14} x2={50} y2={50} />
              <line x1={50} y1={14} x2={14} y2={50} />
            </g>
          </svg>
        </div>
        <KamuAvatar x={youX} y={youY} d={GO.d} />
        <Connector a={{ x: GO.from + 6, y: GO.y - 16 }} b={{ x: GO.pillX - 110, y: GO.up }} p={paid} shape="elbow" />
        <Appear at={W("dividen")} style={{ left: 0, top: 0 }}>
          <WordPill x={GO.pillX} y={GO.up} text="DIVIDEND" />
        </Appear>
        <GrowArrow x0={GO.pillX + 110} y0={GO.up} x1={youX - GO.d / 2 - 14} y1={GO.up} p={ease(f, W("dividen") + m.sec(0.2), m.sec(0.4))} />
        <Connector a={{ x: GO.from + 6, y: GO.y + 16 }} b={{ x: GO.retainX - 200, y: GO.down }} p={ease(f, W("Sementara sisa"), m.sec(0.6))} shape="elbow" />
        <Appear at={W("tetap berada")} style={{ left: 0, top: 0 }}>
          <WordPill x={GO.retainX} y={GO.down} text="RETAINED / REINVESTED" />
        </Appear>
        <GrowArrow x0={GO.retainX + 196} y0={GO.down} x1={GO.keep - GO.d / 2 - 14} y1={GO.down} p={ease(f, W("terus menjalankan") - m.sec(0.25), m.sec(0.3))} />
        <IconDisc x={GO.keep} y={GO.down} d={GO.d} logo={ICBP_LOGO} opacity={ease(f, W("terus menjalankan"), m.reveal)} />
      </Appear>

      {/* E — the point, then the row to follow */}
      <Appear at={bookAt} out={rowAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={BOOK.line} w={theme.canvas.width} align="center" weight={500} text="Bukan cuma harga yang perlu diikuti." mark="harga" />
      </Appear>
      <Appear at={rowAt} style={{ left: 0, top: 0 }}>
        <Card x={CX - BOOK.w / 2} y={BOOK.y} w={BOOK.w} h={BOOK.h}>
          <div style={{ position: "absolute", left: 0, top: 44, width: BOOK.w, textAlign: "center", ...typeStyle("title"), color: c.indigo, opacity: ease(f, W("Itulah"), m.reveal) }}>“Buku bisnis”</div>
          {FOLLOW.map((n, i) => {
            const x = BOOK.w / 2 + (i - 1.5) * 370;
            const p = ease(f, W(n.at), m.reveal);
            return (
              <div key={n.label}>
                <IconDisc x={x} y={210} d={BOOK.disc} icon={n.icon} label={n.label} labelSize={30} opacity={0.25 + 0.75 * p} ring={p > 0.5 ? theme.color.connector : undefined} />
              </div>
            );
          })}
        </Card>
        {[0, 1, 2].map((i) => (
          <GrowArrow key={i} x0={CX + (i - 1.5) * 370 + BOOK.disc / 2 + 14} y0={BOOK.y + 210} x1={CX + (i - 0.5) * 370 - BOOK.disc / 2 - 14} y1={BOOK.y + 210} p={ease(f, W(FOLLOW[i + 1].at) - m.sec(0.25), m.sec(0.3))} />
        ))}
      </Appear>
    </Stage>
  );
};
