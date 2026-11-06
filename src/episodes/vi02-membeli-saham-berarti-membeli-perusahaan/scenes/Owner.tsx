/**
 * VI02 · SC02 — "Kamu Bukan Cuma Pemegang Saham, Kamu Pemilik Bisnis", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC02.jpg. "Kamu" is the self icon, not a person.
 *
 *  A  "membeli sebagian dari sebuah perusahaan": SC01's factory, cut into squares; one square, its piece of the picture, leaves
 *     its place empty and stops under "Kamu".
 *  B  "Kamu nggak harus…": three things you don't have to do, each crossed on its sentence.
 *  C  "Tapi bisnisnya tetap bekerja.": the factory running on its own while "Kamu" watches from the corner.
 *  D  "Saat perusahaan menjual…": Sales → Revenue → Profit, in the middle first.
 *  E  "Kalau sebagian laba dibagikan…": the flow makes room and Profit branches up: DIVIDEND, coins reaching SHAREHOLDER.
 *  F  "Kalau labanya nggak dibagikan…": it branches down: REINVESTMENT → Business Growth → Higher profit.
 *  G  the question to drop and the question to ask first.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, GrowArrow, IconDisc, Line, WordPill, ease, useWords } from "../components/kit";
import { CompanyArt, Conveyor, Factory, GROUND, GroundLine, RUNNING } from "../components/World";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the factory in its window, cut into squares
const COMPANY = { w: 760, h: 520, y: 230, cols: 8, rows: 6, s: 0.78 };
const COMPANY_X = { centre: CX - COMPANY.w / 2, aside: 250 };
const PIECE = { col: 5, row: 2 };
const YOU = { x: 1470, y: 400, d: 190, pieceGap: 24, pillGap: 50 };
const OWN_LINE = 840;

// B — what you don't have to do
// "Kamu" stands level with the middle row, so the middle line runs straight
const NOT = { x: 860, w: 720, h: 150, ys: [250, 430, 610], icon: 84, you: { x: 480, y: 505 } };
const NOTS = [
  { icon: "factory", text: "Datang ke pabrik", at: "Kamu nggak harus" },
  { icon: "shopping-bag", text: "Menjual produk", at: "Nggak harus ikut" },
  { icon: "briefcase", text: "Bekerja di sana", at: "Dan nggak harus" },
];

// C — it runs without you
const RUN = { x: theme.margin.left, y: theme.logoZone.height, w: theme.canvas.width - theme.margin.left - theme.margin.right, h: 640, s: 0.8, cx: 1320, you: 110 };
const RUN_LINE = 850;

// D–F — where the money goes
/** In the middle first; the row makes room for "Kamu" (`roomYou`), then for the branches (`roomBranch`). */
const FLOW = { y: 490, gap: 320, d: 170, roomYou: 150, roomBranch: 250, you: 310 };
const FLOW_NODES = [
  { icon: "shopping-cart", label: "Sales", at: "menjual lebih" },
  { icon: "coins", label: "Revenue", at: "menghasilkan laba" },
  { icon: "chart-line-up", label: "Profit", at: "laba lebih besar" },
];
const BRANCH = { pillX: 1130, up: 290, down: 710, d: 130, you: 1560, growth: 1440, future: 1690 };

// G — the two questions
const ASK = { w: 1300, h: 160, ys: [330, 530] };

const Cross = ({ x, y, p }: { x: number; y: number; p: number }) =>
  p <= 0.001 ? null : (
    <svg width={64} height={64} style={{ position: "absolute", left: x - 32, top: y - 32, opacity: p, transform: `scale(${(0.8 + 0.2 * p).toFixed(3)})` }}>
      <g stroke={theme.color.calendarRed} strokeWidth={8} strokeLinecap="round">
        <line x1={14} y1={14} x2={50} y2={50} />
        <line x1={50} y1={14} x2={14} y2={50} />
      </g>
    </svg>
  );

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  // A
  const cutAt = W("sebagian dari");
  const cut = ease(f, cutAt, m.sec(0.7));
  const aside = ease(f, W("dari sebuah") - m.sec(0.25), m.move);
  const fly = ease(f, W("sebuah perusahaan"), m.sec(0.9));
  const notAt = W("Kamu nggak harus");
  const leave = ease(f, notAt - m.sec(0.3), m.move);
  const boxX = mix(COMPANY_X.centre, COMPANY_X.aside, aside);
  const cell = { w: COMPANY.w / COMPANY.cols, h: COMPANY.h / COMPANY.rows };
  // B
  const runAt = W("Tapi bisnisnya");
  const youX = mix(YOU.x, NOT.you.x, leave);
  const youY = mix(YOU.y, NOT.you.y, leave);
  // the square stops under "Kamu", and goes where "Kamu" goes
  const underYou = YOU.d / 2 + YOU.pieceGap + cell.h / 2;
  const pieceX = mix(boxX + PIECE.col * cell.w + cell.w / 2, youX, fly);
  const pieceY = mix(COMPANY.y + PIECE.row * cell.h + cell.h / 2, youY + underYou, fly);
  const toRun = ease(f, runAt - m.sec(0.2), m.move);
  // C–D
  const flowAt = W("Saat perusahaan");
  const youAt = W("sebagai pemegang");
  const roomYou = ease(f, youAt - m.sec(0.25), m.move);
  const shift = ease(f, W("Kalau sebagian") - m.sec(0.25), m.move);
  const fx = (i: number) => CX + (i - 1) * FLOW.gap - FLOW.roomYou * roomYou - FLOW.roomBranch * shift;
  const ownerX = mix(fx(2) + FLOW.you, BRANCH.you, shift);
  const ownerY = mix(FLOW.y, BRANCH.up, shift);
  // E
  const divAt = W("dividen");
  const coinsAt = W("langsung ke");
  // F
  const reAt = W("Kalau labanya");
  // G
  const askAt = W("Harga sahamnya") - m.sec(0.15);
  const flowOn = 1 - ease(f, askAt - m.sec(0.15), m.fade);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — one company, many squares */}
      <Appear at={-m.reveal} out={notAt - m.sec(0.3)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: boxX, top: COMPANY.y, width: COMPANY.w, height: COMPANY.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft }}>
          <CompanyArt w={COMPANY.w} h={COMPANY.h} s={COMPANY.s} f={f} />
          <svg width={COMPANY.w} height={COMPANY.h} style={{ position: "absolute", left: 0, top: 0 }}>
            <g stroke={theme.color.worldWall} strokeWidth={3} strokeDasharray="10 8">
              {Array.from({ length: COMPANY.cols - 1 }, (_, i) => (
                <line key={`c${i}`} x1={(i + 1) * cell.w} y1={0} x2={(i + 1) * cell.w} y2={COMPANY.h * cut} />
              ))}
              {Array.from({ length: COMPANY.rows - 1 }, (_, i) => (
                <line key={`r${i}`} x1={0} y1={(i + 1) * cell.h} x2={COMPANY.w * cut} y2={(i + 1) * cell.h} />
              ))}
            </g>
            {fly > 0.001 ? <rect x={PIECE.col * cell.w} y={PIECE.row * cell.h} width={cell.w} height={cell.h} rx={12} fill={c.bg} /> : null}
          </svg>
        </div>
        <Appear at={W("Inilah")} style={{ left: 0, top: 0 }}>
          <WordPill x={CX} y={170} text="Pilar pertama" />
        </Appear>
        <Appear at={W("sebuah perusahaan") + m.sec(0.5)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={OWN_LINE} w={theme.canvas.width} align="center" size={48} weight={500} text="Saham = bagian kepemilikan perusahaan" mark="bagian kepemilikan" />
        </Appear>
      </Appear>

      {/* "Kamu", the square arriving, and SHAREHOLDER */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - toRun }}>
        <IconDisc x={youX} y={youY} d={YOU.d} icon="user" ring={theme.color.selfAmber} opacity={ease(f, W("dari sebuah"), m.reveal)} />
        <Appear at={W("Bayangkan")} style={{ left: 0, top: 0 }}>
          <WordPill x={youX} y={youY + underYou + cell.h / 2 + YOU.pillGap} text="SHAREHOLDER" />
        </Appear>
        {fly > 0.001 ? (
          <div style={{ position: "absolute", left: pieceX - cell.w / 2, top: pieceY - cell.h / 2, width: cell.w, height: cell.h, borderRadius: 12, overflow: "hidden", boxShadow: shadow.soft }}>
            <div style={{ position: "absolute", left: -PIECE.col * cell.w, top: -PIECE.row * cell.h, width: COMPANY.w, height: COMPANY.h }}>
              <CompanyArt w={COMPANY.w} h={COMPANY.h} s={COMPANY.s} f={f} />
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${theme.color.selfAmber}` }} />
          </div>
        ) : null}
      </div>

      {/* B — not yours to do */}
      <Appear at={notAt} out={runAt - m.sec(0.2)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {NOTS.map((n, i) => {
          const at = W(n.at);
          const p = ease(f, at, m.reveal);
          return (
            <div key={n.text} style={{ position: "absolute", inset: 0, opacity: p }}>
              <Connector a={{ x: NOT.you.x + YOU.d / 2 + 10, y: NOT.you.y }} b={{ x: NOT.x, y: NOT.ys[i] + NOT.h / 2 }} p={p} shape="elbow" dot={i === 0} />
              <Card x={NOT.x} y={NOT.ys[i]} w={NOT.w} h={NOT.h} style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 44px" }}>
                <IconDisc x={44 + NOT.icon / 2} y={NOT.h / 2} d={NOT.icon} icon={n.icon} />
                <div style={{ marginLeft: NOT.icon + 34, ...typeStyle("title"), fontSize: 40, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>{n.text}</div>
              </Card>
              <Cross x={NOT.x + NOT.w - 70} y={NOT.ys[i] + NOT.h / 2} p={ease(f, at + m.sec(0.6), m.reveal)} />
            </div>
          );
        })}
      </Appear>

      {/* C — it runs without you */}
      <Appear at={runAt - m.sec(0.2)} out={flowAt - m.sec(0.2)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: RUN.x, top: RUN.y, width: RUN.w, height: RUN.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, background: `linear-gradient(to bottom, ${theme.color.worldMorning}, ${theme.color.worldWall})` }}>
          <svg width={RUN.w} height={RUN.h} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform={`translate(${RUN.w / 2 - RUN.cx * RUN.s} ${RUN.h * 0.86 - GROUND * RUN.s}) scale(${RUN.s})`}>
              <GroundLine />
              <Factory lit={1} f={f + RUNNING} />
              <Conveyor f={f} open />
            </g>
          </svg>
          <IconDisc x={RUN.w - 100} y={100} d={RUN.you} icon="user" ring={theme.color.selfAmber} />
        </div>
        <Appear at={W("tetap bekerja")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={RUN_LINE} w={theme.canvas.width} align="center" size={44} weight={500} text="Bisnis tetap bekerja meskipun kamu nggak bekerja di dalamnya." mark="tetap bekerja" />
        </Appear>
      </Appear>

      {/* D–F — where the money goes */}
      <div style={{ position: "absolute", inset: 0, opacity: flowOn }}>
        {FLOW_NODES.map((n, i) => (
          <IconDisc key={n.label} x={fx(i)} y={FLOW.y} d={FLOW.d} icon={n.icon} label={n.label} opacity={ease(f, W(n.at), m.reveal)} />
        ))}
        {[0, 1].map((i) => (
          <GrowArrow key={i} x0={fx(i) + FLOW.d / 2 + 14} y0={FLOW.y} x1={fx(i + 1) - FLOW.d / 2 - 14} y1={FLOW.y} p={ease(f, W(FLOW_NODES[i + 1].at) - m.sec(0.25), m.sec(0.3))} />
        ))}
        {/* "sebagai pemegang saham kamu punya bagian dari hasil tersebut" */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - shift }}>
          <GrowArrow x0={fx(2) + FLOW.d / 2 + 14} y0={FLOW.y} x1={fx(2) + FLOW.you - BRANCH.d / 2 - 14} y1={FLOW.y} p={ease(f, youAt, m.sec(0.4))} />
        </div>
        {/* up: paid out */}
        <Connector a={{ x: fx(2) + FLOW.d / 2 + 6, y: FLOW.y - 20 }} b={{ x: BRANCH.pillX - 130, y: BRANCH.up }} p={ease(f, W("Kalau sebagian"), m.sec(0.6))} shape="elbow" />
        <Appear at={divAt} style={{ left: 0, top: 0 }}>
          <WordPill x={BRANCH.pillX} y={BRANCH.up} text="DIVIDEND" />
        </Appear>
        <GrowArrow x0={BRANCH.pillX + 110} y0={BRANCH.up} x1={BRANCH.you - BRANCH.d / 2 - 14} y1={BRANCH.up} p={ease(f, coinsAt - m.sec(0.4), m.sec(0.5))} />
        <IconDisc x={ownerX} y={ownerY} d={BRANCH.d} icon="user" ring={theme.color.selfAmber} label="Shareholder" opacity={ease(f, youAt + m.sec(0.2), m.reveal)} />
        {[0, 1, 2].map((i) => {
          const p = ease(f, coinsAt + m.sec(0.25) * i, m.sec(0.7));
          if (p <= 0.001 || p >= 0.999) return null;
          return <div key={i} style={{ position: "absolute", left: mix(BRANCH.pillX + 110, BRANCH.you - BRANCH.d / 2, p) - 15, top: BRANCH.up - 15, width: 30, height: 30, borderRadius: 999, background: theme.color.worldLight, boxShadow: `inset 0 0 0 3px ${theme.color.worldCartonDark}` }} />;
        })}
        {/* down: kept and put back to work */}
        <Connector a={{ x: fx(2) + FLOW.d / 2 + 6, y: FLOW.y + 20 }} b={{ x: BRANCH.pillX - 150, y: BRANCH.down }} p={ease(f, reAt, m.sec(0.6))} shape="elbow" />
        <Appear at={W("digunakan kembali")} style={{ left: 0, top: 0 }}>
          <WordPill x={BRANCH.pillX} y={BRANCH.down} text="REINVESTMENT" />
        </Appear>
        <GrowArrow x0={BRANCH.pillX + 140} y0={BRANCH.down} x1={BRANCH.growth - BRANCH.d / 2 - 12} y1={BRANCH.down} p={ease(f, W("mengembangkan bisnis") - m.sec(0.25), m.sec(0.3))} />
        <IconDisc x={BRANCH.growth} y={BRANCH.down} d={BRANCH.d} icon="factory" label="Business Growth" labelSize={26} opacity={ease(f, W("mengembangkan bisnis"), m.reveal)} />
        <GrowArrow x0={BRANCH.growth + BRANCH.d / 2 + 12} y0={BRANCH.down} x1={BRANCH.future - BRANCH.d / 2 - 12} y1={BRANCH.down} p={ease(f, W("laba yang lebih besar") - m.sec(0.25), m.sec(0.3))} />
        <IconDisc x={BRANCH.future} y={BRANCH.down} d={BRANCH.d} icon="chart-line-up" label="Higher profit" labelSize={26} opacity={ease(f, W("laba yang lebih besar"), m.reveal)} />
      </div>

      {/* G — the question to ask first */}
      <Appear at={W("Harga sahamnya")} rise={12} style={{ left: 0, top: 0 }}>
        <Card x={CX - ASK.w / 2} y={ASK.ys[0]} w={ASK.w} h={ASK.h} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: ease(f, W("biasakan"), m.reveal) > 0.5 ? c.slate : c.ink, whiteSpace: "nowrap" }}>“Harga sahamnya akan naik nggak?”</div>
        </Card>
        <Cross x={CX + ASK.w / 2 - 70} y={ASK.ys[0] + ASK.h / 2} p={ease(f, W("biasakan"), m.reveal)} />
      </Appear>
      <Appear at={W("Bisnis yang saya")} rise={12} style={{ left: 0, top: 0 }}>
        <Card x={CX - ASK.w / 2} y={ASK.ys[1]} w={ASK.w} h={ASK.h} line={theme.color.hairlineBrand} style={{ display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `${shadow.soft}, 0 0 36px 8px ${theme.color.indigoGlow}` }}>
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.indigo, whiteSpace: "nowrap", fontSize: 42 }}>“Bisnis yang saya miliki ini sebenarnya menghasilkan apa?”</div>
        </Card>
      </Appear>
    </Stage>
  );
};
