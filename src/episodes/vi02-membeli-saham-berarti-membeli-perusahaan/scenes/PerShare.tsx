/**
 * VI02 · SC04 — "Setiap Saham Punya Bagian dari Laba", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC04.jpg. The figures are ICBP's reported 2025 results: net sales Rp74,85 triliun, profit
 * attributable to owners Rp9,22 triliun, basic EPS Rp791 (checked against Kontan's report of the results, 4 Nov 2026).
 *
 *  A  "Misalnya ICBP": ICBP's logo, its code docking as a title; then (Simon 13 Nov: "ganti visual dengan screenshot aplikasi")
 *     Simon's three Tuntun app screens, cropped to the part he boxed — Revenue, Net Income, EPS — side by side, each on its
 *     words with its name over it ("Pendapatan", "Laba bersih", "Laba per saham"), its 2025 column ringed on the spoken figure. At "Kalau kamu punya" they give way to the chain (the same three figures as cards) and the
 *     field, as before; the parts after that wait for his next direction.
 *  B  "dibagi berdasarkan seluruh saham": the chain makes room; the profit becomes a field of small squares, one of them
 *     leaving for the EPS card. SC02's square again: a share.
 *  C  "100 saham": a hundred squares of that same field light up → 100 Shares → 100 × Rp791 → = Rp79.100 (Simon 13 Nov:
 *     "kasih perhitungan angka real nya aja").
 *  D  "bukan berarti seluruh Rp79.100 langsung masuk": the way straight to "Kamu" is crossed; the profit branches into
 *     DIVIDEND ("membagikan … Rp265") and RETAINED / REINVESTED ("sisa labanya"). On "Perusahaan membagikan" ICBP's
 *     dividend screen takes the row's place at the left; on "Jadi untuk 100 saham" 100 × Rp265 = Rp26.500 under DIVIDEND.
 *  12 Nov 2026: C and D follow Simon's new VO (Scene 04_1/04_2) on their nearest words; the new figures (Rp79.100, Rp265,
 *  Rp26.500) and the closing "profit ≠ cash" line (Scene 04_3) have no picture of their own yet.
 *  E  "Jadi saat memiliki saham": the point in one line. "Kita juga perlu melihat": the row to follow, each lit on its word,
 *     and it is the "buku bisnis".
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, GrowArrow, IconDisc, KamuAvatar, Line, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// the chain
const CHAIN = { w: 500, h: 116, gap: 56, y0: 270, codeY: 270, left: 140 };
/** ICBP's own round logo, in place of the factory icon (Simon, 5 Nov). */
const ICBP_LOGO = "icons/vi02/ICBP.png";
/** "perusahaan nyata": the company's logo in the middle, its code under it; the code then docks at the head of the chain. */
const OPEN = { y: 380, d: 220, codeY: 590, bigSize: 84, dockSize: 30 };

// A — Simon's app screens (VI02 folder, drive-download-20261113…/Scene 04 - *.jpg), cropped to his boxes: 1038 × 964 each
// (Simon 13 Nov: a line of text over each, and the part he screenshotted — the 2025 column — highlighted, on its number)
const SHOTS = [
  { src: "art/vi02/app/sc04-revenue.jpg", at: "menghasilkan pendapatan", title: "Pendapatan", mark: "Rp74,85", label: "Revenue" },
  { src: "art/vi02/app/sc04-net-income.jpg", at: "laba bersih", title: "Laba bersih", mark: "Rp9,22", label: "Net Income" },
  { src: "art/vi02/app/sc04-eps.jpg", at: "hasilnya sekitar", title: "Laba per saham", mark: "Rp791", label: "EPS" },
] as const;
const SHOT = { w: 540, gap: 36, y: 330, codeY: 206, titleY: 290, sumY: 900 };
const SHOT_SRC = { w: 1038, h: 964 };
const SHOT_H = (SHOT.w * SHOT_SRC.h) / SHOT_SRC.w;
/** the 2025 column in the source screens (the same in all three): "Annual ▼", the bar, its label, its table column */
const COL_SRC = { x0: 828, x1: 1030, y0: 14, y1: 946 };
const k2 = SHOT.w / SHOT_SRC.w;
const COL = { x: COL_SRC.x0 * k2, y: COL_SRC.y0 * k2, w: (COL_SRC.x1 - COL_SRC.x0) * k2, h: (COL_SRC.y1 - COL_SRC.y0) * k2 };
/** the chain (Simon 13 Nov: "ganti … dengan gambar yang ku screenshot"): the lower part of that ringed column — "2025 Annual"
 *  and its three rows — cut from each screen at "Kalau kamu punya" and carried to the left, in a row left to right under
 *  ICBP, each named over it ("berurut dari kiri ke kanan aja, lalu kasih label revenue, net income, dan eps di atasnya") */
const CROP_SRC = { x0: COL_SRC.x0, x1: COL_SRC.x1, y0: 548, y1: COL_SRC.y1 };
const CROP = { h: 240, y: 380, gap: 64, labelY: 348 };
const cropK = CROP.h / (CROP_SRC.y1 - CROP_SRC.y0);
const CROP_W = (CROP_SRC.x1 - CROP_SRC.x0) * cropK;
const CHAIN_CX = CHAIN.left + CHAIN.w / 2;
const cropX = (i: number) => CHAIN_CX - (3 * CROP_W + 2 * CROP.gap) / 2 + i * (CROP_W + CROP.gap);
const shotX = (i: number) => CX - (3 * SHOT.w + 2 * SHOT.gap) / 2 + i * (SHOT.w + SHOT.gap);

// the shares
const FIELD = { x: 760, y: 230, n: 24, cell: 17, gap: 3, own: 10, lift: { col: 3, row: 16 } };
const step = FIELD.cell + FIELD.gap;
const OWN = { cx: 1510, ys: [300, 470, 640], line: 830 };

// where the profit goes
const GO = { from: cropX(2) + CROP_W, y: CROP.y + CROP.h / 2, calcY: 398, up: 330, down: 690, pillX: 1010, retainX: 1060, you: 1460, keep: 1600, d: 130, crossX: 1060 };

/** "Perusahaan membagikan sekitar Rp265 per saham sebagai dividen" (Simon 13 Nov): ICBP's dividend screen, cut to his box
 *  (VI02 folder, Scene 04 - Dividend.jpg, x 21–1059 · y 1056–1910), takes the row's place at the left; ICBP goes over it */
const DIV = { src: "art/vi02/app/sc04-dividend.jpg", w: 520, srcW: 1038, srcH: 854, pillGap: 46 };
const DIV_H = (DIV.w * DIV.srcH) / DIV.srcW;
const DIV_X = GO.from - DIV.w;
const DIV_Y = GO.y - DIV_H / 2;

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
  const ownAt = W("Kalau kamu punya");
  /** the screens are up from their words to "Kalau kamu punya"; then the chain, at the left, carries the same figures on */
  const shotAt = SHOTS.map((k) => W(k.at));
  const toChain = ease(f, ownAt, m.move);
  const cardAt = [ownAt, ownAt + m.sec(0.12), ownAt + m.sec(0.24)];
  const tapiAt = W("Tapi bukan");
  const bookAt = W("Jadi saat");
  const rowAt = W("Kita juga perlu");
  const fieldP = ease(f, ownAt + m.sec(0.15), m.sec(0.9));
  const own = ease(f, W("100 saham"), m.sec(0.9));

  const paidAt = W("Perusahaan membagikan");
  const paid = ease(f, paidAt, m.move);
  const toDiv = ease(f, paidAt, m.move);
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
        <div style={{ position: "absolute", left: mix(mix(CX, CHAIN_CX, toChain), DIV_X + DIV.w / 2, toDiv), top: mix(mix(mix(OPEN.codeY, SHOT.codeY, dock), CHAIN.codeY, toChain), DIV_Y - DIV.pillGap, toDiv), transform: "translate(-50%, -50%)", padding: `${mix(0, 12, dock).toFixed(1)}px ${mix(0, 30, dock).toFixed(1)}px`, borderRadius: 999, background: dock > 0.01 ? c.cardBg : undefined, boxShadow: dock > 0.5 ? `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` : undefined, fontFamily: theme.text.family, fontSize: mix(OPEN.bigSize, OPEN.dockSize, dock), fontWeight: dock > 0.5 ? 600 : 700, letterSpacing: 1, color: c.indigo, whiteSpace: "nowrap" }}>ICBP</div>
      </Appear>

      {/* A — Simon's app screens, side by side, each on its words, its name over it; the 2025 column ringed on its number */}
      {SHOTS.map((k, i) => {
        const p = ease(f, shotAt[i], m.reveal) * (1 - ease(f, ownAt - m.sec(0.2), m.fade));
        if (p <= 0.001) return null;
        const lit = ease(f, W(k.mark), m.pop);
        return (
          <div key={k.src} style={{ position: "absolute", left: shotX(i), top: SHOT.y + (1 - p) * 16, width: SHOT.w, height: SHOT_H, opacity: p }}>
            <div style={{ position: "absolute", left: 0, width: SHOT.w, top: SHOT.titleY - SHOT.y, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.title}</div>
            <Card x={0} y={0} w={SHOT.w} h={SHOT_H} style={{ overflow: "hidden" }}>
              <Img src={staticFile(k.src)} style={{ width: SHOT.w, height: SHOT_H, display: "block" }} />
            </Card>
            <div style={{ position: "absolute", left: COL.x, top: COL.y, width: COL.w, height: COL.h, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${c.indigo}`, opacity: lit, transform: `scale(${mix(1.06, 1, lit)})` }} />
          </div>
        );
      })}

      {/* B–C — the field of shares */}
      <Appear at={ownAt} out={tapiAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: FIELD.n * FIELD.n }, (_, i) => {
            const col = i % FIELD.n;
            const row = Math.floor(i / FIELD.n);
            const wave = (col + row) / (2 * FIELD.n);
            if (fieldP < wave) return null;
            const inOwn = col < FIELD.own && row < FIELD.own;
            const lit = inOwn ? Math.min(1, Math.max(0, own * 1.2 - (row * FIELD.own + col) / 120)) : 0;
            return <rect key={i} x={FIELD.x + col * step} y={FIELD.y + row * step} width={FIELD.cell} height={FIELD.cell} rx={4} fill={interpolateColors(lit, [0, 1], [theme.color.hairlineBrandSolid, theme.color.connector])} />;
          })}
        </svg>
        <Appear at={W("100 saham")} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[0]} text="100 Shares" />
        </Appear>
        <GrowArrow x0={OWN.cx} y0={OWN.ys[0] + 42} x1={OWN.cx} y1={OWN.ys[1] - 42} p={ease(f, W("100", 1) - m.sec(0.25), m.sec(0.3))} />
        <Appear at={W("100", 1)} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[1]} text="100 × Rp791" />
        </Appear>
        <GrowArrow x0={OWN.cx} y0={OWN.ys[1] + 42} x1={OWN.cx} y1={OWN.ys[2] - 42} p={ease(f, W("Rp79.100") - m.sec(0.25), m.sec(0.3))} />
        <Appear at={W("Rp79.100")} style={{ left: 0, top: 0 }}>
          <WordPill x={OWN.cx} y={OWN.ys[2]} text="= Rp79.100" />
        </Appear>
      </Appear>

      {/* "Artinya, secara sederhana…" — the point in one line under the screens (Simon 13 Nov: "text ringkasan") */}
      <Appear at={W("Artinya")} out={ownAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={SHOT.sumY} w={theme.canvas.width} align="center" weight={500} size={48} text="1 saham = sebagian kecil dari laba." mark="sebagian kecil" />
      </Appear>

      {/* A → B — the ringed columns leave their screens for the chain at the left, under ICBP */}
      <Appear at={ownAt - m.sec(0.2) - m.reveal} out={paidAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {SHOTS.map((k, i) => {
          const t = ease(f, cardAt[i], m.move);
          const s0 = k2 / cropK;
          const x = mix(shotX(i) + CROP_SRC.x0 * k2, cropX(i), t);
          const y = mix(SHOT.y + CROP_SRC.y0 * k2, CROP.y, t);
          const s1 = mix(s0, 1, t);
          return (
            <div key={k.src} style={{ position: "absolute", left: x, top: y, width: CROP_W, height: CROP.h, transformOrigin: "0 0", transform: `scale(${s1.toFixed(4)})`, borderRadius: 16, overflow: "hidden", background: c.cardBg }}>
              <Img src={staticFile(k.src)} style={{ position: "absolute", left: -CROP_SRC.x0 * cropK, top: -CROP_SRC.y0 * cropK, width: SHOT_SRC.w * cropK, height: SHOT_SRC.h * cropK, maxWidth: "none", maxHeight: "none", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 16, boxShadow: `inset 0 0 0 ${(3 / s1).toFixed(2)}px ${c.indigo}` }} />
            </div>
          );
        })}
        {SHOTS.map((k, i) => (
          <div key={k.label} style={{ position: "absolute", left: cropX(i) + CROP_W / 2 - 120, width: 240, top: CROP.labelY, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("label"), fontSize: 28, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", opacity: ease(f, cardAt[i] + m.move - m.sec(0.1), m.reveal) }}>{k.label}</div>
        ))}
        {[1, 2].map((i) => (
          <GrowArrow key={i} x0={cropX(i - 1) + CROP_W + 8} y0={CROP.y + CROP.h / 2} x1={cropX(i) - 8} y1={CROP.y + CROP.h / 2} p={ease(f, cardAt[i] + m.move - m.sec(0.15), m.sec(0.3))} />
        ))}
      </Appear>

      {/* D — the dividend screen in the row's place */}
      <Appear at={paidAt} out={bookAt} style={{ left: DIV_X, top: DIV_Y, width: DIV.w, height: DIV_H }}>
        <Card x={0} y={0} w={DIV.w} h={DIV_H} style={{ overflow: "hidden" }}>
          <Img src={staticFile(DIV.src)} style={{ width: DIV.w, height: DIV_H, maxWidth: "none", display: "block" }} />
        </Card>
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
        {/* "Jadi untuk 100 saham, cash dividend…" — the sum under DIVIDEND (Simon 13 Nov) */}
        <Appear at={W("Jadi untuk")} style={{ left: GO.pillX - 300, width: 600, top: GO.calcY, textAlign: "center" }}>
          <div style={{ transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>100 × Rp265 = Rp26.500</div>
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
