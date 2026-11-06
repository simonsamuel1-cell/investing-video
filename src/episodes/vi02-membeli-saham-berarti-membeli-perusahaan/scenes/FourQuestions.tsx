/**
 * VI02 · SC07 — "Empat Pertanyaan sebelum Membeli", rebuilt on 5 Nov (Simon: "jelek banget") from the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC07-v2.jpg. The fan's shares and the bars' heights are examples, not ICBP's own.
 *
 *  A  "jangan mulai dari: “Target harganya berapa?”": a big price tag under the code, crossed.
 *  B  "empat pertanyaan sederhana": a rail of four numbers beside ONE large card; each question takes the card over, its own
 *     picture growing in it: a box truck on the road (shut, see-through to its goods from "Produk"), a half-ring fan, the
 *     profit flowing out in two, profit bars running on past today.
 *  C  "bisa dijawab": the four come together round the code, ticked, and the code turns over to BUSINESS.
 *  D  "harga saham mulai punya sesuatu": BUSINESS steps left, a price tag faces it.
 *  E  "Kalau belum": all of it goes, and a small grey code is left alone.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, roundedPath, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, GrowArrow, IconDisc, PriceTag, WordPill, ease, useWords } from "../components/kit";
import { DeliveryTruck, RoadScenery } from "../components/DeliveryTruck";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the question to skip
const CODE = { y: 200, size: 44, big: 72, midY: 500 };
const TAG = { w: 760, h: 300, y: 340, size: 72, hole: 34, nose: 110, badge: 92 };

// B — the rail and the one card
const RAIL = { x: 210, y0: 240, gap: 170, d: 96 };
const railY = (i: number) => RAIL.y0 + i * RAIL.gap;
const BIG = { x: 400, y: 170, w: 1424, h: 720, art: 320, ask: 56, label: 34 };
const QUESTIONS = [
  { icon: "package", ask: "Jual apa?", label: "Product / Service", at: "Pertama", askAt: "perusahaan ini menjual", labelAt: "Produk atau layanan" },
  { icon: "coins", ask: "Uang dari mana?", label: "Revenue Composition", at: "Kedua", askAt: "uangnya datang", labelAt: "Bisnis mana" },
  { icon: "arrows-clockwise", ask: "Labanya diapakan?", label: "Dividend / Reinvestment", at: "Ketiga", askAt: "laba yang dihasilkan", labelAt: "Dibagikan sebagai" },
  { icon: "chart-line-up", ask: "Ke depan bisa menghasilkan lebih banyak?", label: "Profit Trend / Growth / Research", at: "Dan yang paling", askAt: "apakah perusahaan", labelAt: "lebih banyak" },
];

const TRUCK = { w: 797 };
// the lines across the card, over and under its picture, for the questions that have them
const CARD_LINES = [
  [{ text: "perusahaan ini menjual apa?", y: 66, at: "perusahaan ini menjual" }, { text: "Produk atau layanan apa?", y: 660, at: "Produk atau layanan" }],
  [{ text: "Uang dari mana?", y: 66, at: "uangnya datang" }],
  [{ text: "Labanya diapakan?", y: 66, at: "laba yang dihasilkan" }],
  [{ text: "Ke depan bisa menghasilkan lebih banyak?", y: 66, at: "apakah perusahaan" }],
];
// poin 2: a half ring fanning out from the left, each part reaching as far as its share is big (Simon's reference, 6 Nov)
const FAN = { cx: 717, cy: 650, hole: 110, near: 240, far: 420, dot: 6, corner: 18, line: 2.5, number: 52, percent: 28, name: 28 };
const FAN_PARTS = [
  { name: "Bisnis 1", share: 38, rise: true, along: 0.8, lineY: 200, lineTo: -60 },
  { name: "Bisnis 2", share: 26, rise: true, along: 0.5, lineY: 200, lineTo: 190 },
  { name: "Bisnis 3", share: 18, rise: true, along: 0.5, lineY: 350, lineTo: 350 },
  { name: "Bisnis 4", share: 11, rise: false, along: 0, lineY: 525, lineTo: 410 },
  { name: "Bisnis 5", share: 7, rise: false, along: 0, lineY: 640, lineTo: 410 },
];
const FAN_SHARES = FAN_PARTS.map((part) => part.share);
/** How far round the half ring the first `k` parts go, 0 to 1. */
const fanTurn = (k: number) => FAN_SHARES.slice(0, k).reduce((a, b) => a + b, 0) / 100;
const fanReach = (k: number) => mix(FAN.near, FAN.far, (FAN_SHARES[k] - Math.min(...FAN_SHARES)) / (Math.max(...FAN_SHARES) - Math.min(...FAN_SHARES)));
const fanPoint = (r: number, turn: number) => ({ x: FAN.cx - r * Math.cos(Math.PI * turn), y: FAN.cy - r * Math.sin(Math.PI * turn) });
/** Part `k` of a ring `open` 0 to 1 of the way round. */
const fanSlice = (k: number, open: number) => {
  const [a, b] = [fanTurn(k) * open, fanTurn(k + 1) * open];
  const r = fanReach(k);
  const [outA, outB, inA, inB] = [fanPoint(r, a), fanPoint(r, b), fanPoint(FAN.hole, a), fanPoint(FAN.hole, b)];
  return `M ${inA.x} ${inA.y} L ${outA.x} ${outA.y} A ${r} ${r} 0 0 1 ${outB.x} ${outB.y} L ${inB.x} ${inB.y} A ${FAN.hole} ${FAN.hole} 0 0 0 ${inA.x} ${inA.y} Z`;
};
/** Part `k`'s pointer: up out of the part and along, or straight out of its edge. */
const fanPointer = (k: number) => {
  const part = FAN_PARTS[k];
  const end = { x: FAN.cx + part.lineTo, y: part.lineY };
  if (!part.rise) return [{ x: FAN.cx + Math.sqrt(fanReach(k) ** 2 - (FAN.cy - part.lineY) ** 2), y: part.lineY }, end];
  const dot = fanPoint(fanReach(k), mix(fanTurn(k), fanTurn(k + 1), part.along)); // on the rim: an indigo line would vanish on the indigo part
  return [dot, { x: dot.x, y: part.lineY }, end];
};
// poin 3: the profit, one band that splits in two
const FLOW = { y: 390, h: 150, share: 0.45, from: 270, split: 480, to: 975, up: 240, down: 540, pillFrom: 165, pillTo: [1118, 1166], pill: 40, soft: 12 };
const flowTop = FLOW.y - FLOW.h / 2;
const flowCut = flowTop + FLOW.h * FLOW.share;
/** A band from `top`..`low` at the split to `height` tall round `y` at the end. */
const ribbon = (top: number, low: number, y: number, height: number) => {
  const bend = (FLOW.to - FLOW.split) / 2;
  const [a, b] = [y - height / 2, y + height / 2];
  return `M ${FLOW.split} ${top} C ${FLOW.split + bend} ${top}, ${FLOW.to - bend} ${a}, ${FLOW.to} ${a} L ${FLOW.to} ${b} C ${FLOW.to - bend} ${b}, ${FLOW.split + bend} ${low}, ${FLOW.split} ${low} Z`;
};
const FLOW_BANDS = [
  { id: "flow-up", top: flowTop, low: flowCut, y: FLOW.up, height: FLOW.h * FLOW.share, tone: theme.color.selfAmber, at: "Dibagikan" },
  { id: "flow-down", top: flowCut, low: flowTop + FLOW.h, y: FLOW.down, height: FLOW.h * (1 - FLOW.share), tone: theme.color.liquidCyanInk, at: "ditanam kembali" },
];

// poin 4: profit year by year, then the years not here yet
const PROFIT = { base: 590, w: 84, gap: 44, past: [150, 190, 175, 230, 260], next: [300, 345, 395], r: 14, top: 150, dash: "10 10", line: 3, labelY: 640, label: 30 };
const PROFIT_BARS = [...PROFIT.past, ...PROFIT.next];
const profitX = (k: number) => (BIG.w - PROFIT_BARS.length * PROFIT.w - (PROFIT_BARS.length - 1) * PROFIT.gap) / 2 + k * (PROFIT.w + PROFIT.gap);
const profitToday = profitX(PROFIT.past.length) - PROFIT.gap / 2;

// C — round the code
const AROUND = { dx: 500, dy: 210, d: 150, y: 490 };
// D — what the price can now be held against
const FACE = { x: 520, tagX: 1400, y: 490 };


export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;

  const startAt = W("Mulai dari", 1); // the first is "jangan mulai dari"
  const answeredAt = W("Kalau empat");
  const faceAt = W("harga saham");
  const notYetAt = W("Kalau belum");
  const at = QUESTIONS.map((q) => W(q.at));
  const turnsTo = ease(f, W("bisa dijawab"), m.reveal);
  const gone = ease(f, notYetAt, m.reveal);
  const business = turnsTo * (1 - gone);
  const word = business > 0.5 ? "BUSINESS" : "ICBP";
  const turn = Math.abs(business - 0.5) * 2; // the code turns over: narrow to nothing at the swap, then open again
  const toCentre = ease(f, answeredAt - m.sec(0.3), m.move);
  const aside = ease(f, faceAt, m.move) * (1 - gone);
  const inRail = ease(f, startAt, m.move) * (1 - toCentre);
  const codeX = mix(mix(CX, FACE.x, aside), RAIL.x, inRail);
  const codeY = mix(mix(CODE.y, RAIL.y0 - 110, inRail), CODE.midY, toCentre);
  const size = mix(mix(CODE.big, CODE.size, inRail), CODE.big, toCentre) * (1 - 0.45 * gone);
  /** The question on the card: the one the VO is on. */
  const active = at.reduce((k, a, i) => (f >= a - m.sec(0.2) ? i : k), 0);
  const cardOut = answeredAt - m.sec(0.3);
  const drawAt = (i: number) => W(QUESTIONS[i].labelAt);
  const openAt = drawAt(0) + m.sec(0.25); // Simon's 19789
  const fanTones = [theme.color.liquidCyanInk, theme.color.selfAmberInk, theme.color.selfAmber, theme.color.cyanTintSolid, theme.color.cyanWashDeepSolid]; // one hue, darkest on the biggest

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — not this one */}
      <Appear at={W("jangan mulai")} out={startAt} style={{ left: 0, top: 0 }}>
        <PriceTag x={CX - TAG.w / 2} y={TAG.y} w={TAG.w} h={TAG.h} nose={TAG.nose} hole={TAG.hole}>
          <div style={{ ...typeStyle("title"), fontSize: TAG.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Target harga?</div>
        </PriceTag>
        <div style={{ position: "absolute", left: CX + TAG.w / 2 - TAG.badge / 2 - 6, top: TAG.y - TAG.badge / 3, width: TAG.badge, height: TAG.badge, borderRadius: 999, background: theme.color.calendarRed, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, W("Target harganya") + m.sec(0.5), m.reveal) }}>
          <svg width={48} height={48} viewBox="0 0 40 40">
            <path d="M 10 10 L 30 30 M 30 10 L 10 30" fill="none" stroke={theme.color.worldWall} strokeWidth={6} strokeLinecap="round" />
          </svg>
        </div>
      </Appear>

      {/* B — the rail */}
      <Appear at={startAt} out={cardOut} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={RAIL.x} y1={railY(0)} x2={RAIL.x} y2={railY(3)} stroke={theme.color.hairlineBrandSolid} strokeWidth={4} strokeLinecap="round" />
          <line x1={RAIL.x} y1={railY(0)} x2={RAIL.x} y2={mix(railY(0), railY(3), at.reduce((a, t, i) => (i ? a + ease(f, t, m.move) / 3 : a), 0))} stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" />
        </svg>
        {QUESTIONS.map((q, i) => {
          const on = ease(f, at[i], m.reveal);
          return (
            <div key={q.ask} style={{ position: "absolute", left: RAIL.x - RAIL.d / 2, top: railY(i) - RAIL.d / 2, width: RAIL.d, height: RAIL.d, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: interpolateColors(on, [0, 1], [c.cardBg, theme.color.connector]), boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("title"), fontSize: 40, color: interpolateColors(on, [0, 1], [c.slate, c.cardBg]) }}>{i + 1}</div>
          );
        })}
      </Appear>

      {/* B — the one card */}
      <Appear at={at[0] - m.sec(0.2)} out={cardOut} style={{ left: 0, top: 0 }}>
        <Card x={BIG.x} y={BIG.y} w={BIG.w} h={BIG.h}>
          {QUESTIONS.map((q, i) => {
            const shown = (i === active ? 1 : 0) * ease(f, at[i] - m.sec(0.2), m.reveal) * (i < 3 ? 1 - ease(f, at[i + 1] - m.sec(0.35), m.sec(0.15)) : 1);
            if (shown <= 0.001) return null;
            const draw = ease(f, drawAt(i), m.sec(0.9));
            return (
              <div key={q.ask} style={{ position: "absolute", inset: 0, opacity: shown }}>
                {/* its picture */}
                <svg width={BIG.w} height={BIG.h} style={{ position: "absolute", left: 0, top: 0 }}>
                  {i === 1 ? FAN_PARTS.map((part, k) => <path key={part.name} d={fanSlice(k, draw)} fill={fanTones[k]} />) : null}
                </svg>
                {i === 0 ? (
                  <>
                    <RoadScenery f={f} w={BIG.w} h={BIG.h} />
                    <DeliveryTruck cx={BIG.w / 2} cy={BIG.h / 2} w={TRUCK.w} f={f} solid={1 - ease(f, openAt, m.reveal)} />
                  </>
                ) : null}
                {(CARD_LINES[i] ?? []).map((l) => (
                  <div key={l.text} style={{ position: "absolute", left: 0, width: BIG.w, top: l.y, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("title"), fontSize: BIG.ask, fontWeight: 500, color: c.ink, opacity: ease(f, W(l.at), m.reveal) }}>{l.text}</div>
                ))}
                {i === 1
                  ? FAN_PARTS.map((part, k) => {
                      const pointer = fanPointer(k);
                      const end = pointer[pointer.length - 1];
                      const lineAt = drawAt(1) + m.sec(0.9 + 0.07 * k); // once the fan is fully open: a dot must not land before its part
                      const grown = ease(f, lineAt, m.reveal);
                      const labelIn = ease(f, lineAt + m.sec(0.2), m.reveal);
                      return (
                        <div key={part.name}>
                          {grown > 0 ? (
                            <svg width={BIG.w} height={BIG.h} style={{ position: "absolute", left: 0, top: 0 }}>
                              <path d={roundedPath(pointer, FAN.corner)} fill="none" stroke={c.indigo} strokeWidth={FAN.line} strokeLinecap="round" pathLength={1} strokeDasharray={`${grown.toFixed(4)} 1`} />
                              {part.rise ? <circle cx={pointer[0].x} cy={pointer[0].y} r={FAN.dot} fill={c.cardBg} stroke={c.indigo} strokeWidth={FAN.line} /> : null}
                            </svg>
                          ) : null}
                          <div style={{ position: "absolute", left: end.x, top: end.y + 10, transform: "translateX(-100%)", ...typeStyle("label"), fontSize: FAN.name, fontWeight: 500, color: c.indigo, whiteSpace: "nowrap", opacity: labelIn }}>
                            {part.name}
                            <div style={{ position: "absolute", left: 0, top: -18, transform: "translateY(-100%)", ...typeStyle("title"), fontSize: FAN.number, fontWeight: 500, lineHeight: 1, color: c.indigo }}>
                              {part.share}
                              <span style={{ fontSize: FAN.percent }}>%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
                {i === 2 ? (
                  <>
                    <svg width={BIG.w} height={BIG.h} style={{ position: "absolute", left: 0, top: 0 }}>
                      <defs>
                        {FLOW_BANDS.map((band) => (
                          <linearGradient key={band.id} id={band.id} gradientUnits="userSpaceOnUse" x1={FLOW.split} x2={FLOW.to} y1={0} y2={0}>
                            <stop offset={0} stopColor={theme.color.selfAmberInk} />
                            <stop offset={1} stopColor={band.tone} />
                          </linearGradient>
                        ))}
                        {FLOW_BANDS.map((band) => (
                          <clipPath key={band.id} id={`${band.id}-run`}>
                            <rect x={0} y={0} width={mix(FLOW.split, FLOW.to + FLOW.soft, ease(f, W(band.at), m.sec(0.9)))} height={BIG.h} />
                          </clipPath>
                        ))}
                      </defs>
                      {FLOW_BANDS.map((band) => (f > W(band.at) ? <path key={band.id} d={ribbon(band.top, band.low, band.y, band.height)} fill={`url(#${band.id})`} stroke={`url(#${band.id})`} strokeWidth={FLOW.soft} strokeLinejoin="round" clipPath={`url(#${band.id}-run)`} /> : null))}
                      <rect x={FLOW.from} y={flowTop - FLOW.soft / 2} width={(FLOW.split - FLOW.from + FLOW.soft) * ease(f, at[2], m.sec(0.6))} height={FLOW.h + FLOW.soft} rx={FLOW.soft} fill={theme.color.selfAmberInk} />
                    </svg>
                    <WordPill x={FLOW.pillFrom} y={FLOW.y} text="Laba" size={FLOW.pill} opacity={ease(f, at[2], m.reveal)} />
                    <WordPill x={FLOW.pillTo[0]} y={FLOW.up} text="Dividend" size={FLOW.pill} opacity={ease(f, W("dividen"), m.reveal)} />
                    <WordPill x={FLOW.pillTo[1]} y={FLOW.down} text="Reinvestment" size={FLOW.pill} opacity={ease(f, W("ditanam kembali") + m.sec(0.6), m.reveal)} />
                  </>
                ) : null}
                {i === 3 ? (
                  <>
                    <svg width={BIG.w} height={BIG.h} style={{ position: "absolute", left: 0, top: 0 }}>
                      <line x1={profitX(0)} x2={profitX(PROFIT_BARS.length - 1) + PROFIT.w} y1={PROFIT.base} y2={PROFIT.base} stroke={theme.color.connectorMuteSolid} strokeWidth={PROFIT.line} strokeLinecap="round" />
                      {PROFIT.past.map((h, k) => {
                        const grown = h * ease(f, W("apakah perusahaan") + m.sec(0.1 * k), m.reveal);
                        return <rect key={k} x={profitX(k)} y={PROFIT.base - grown} width={PROFIT.w} height={grown} rx={Math.min(PROFIT.r, grown / 2)} fill={theme.color.selfAmber} />;
                      })}
                      <line x1={profitToday} x2={profitToday} y1={PROFIT.base} y2={mix(PROFIT.base, PROFIT.top, ease(f, W("peluang"), m.reveal))} stroke={c.indigo} strokeWidth={PROFIT.line} strokeDasharray={PROFIT.dash} strokeLinecap="round" />
                      {PROFIT.next.map((h, k) => {
                        const grown = h * ease(f, W("menghasilkan lebih") + m.sec(0.14 * k), m.reveal);
                        return grown > 1 ? <rect key={k} x={profitX(PROFIT.past.length + k)} y={PROFIT.base - grown} width={PROFIT.w} height={grown} rx={Math.min(PROFIT.r, grown / 2)} fill={c.cardBg} stroke={theme.color.selfAmberInk} strokeWidth={PROFIT.line} strokeDasharray={PROFIT.dash} /> : null;
                      })}
                    </svg>
                    {[{ text: "Today", x: profitToday, at: W("peluang") }, { text: "Future", x: (profitX(PROFIT.past.length) + profitX(PROFIT_BARS.length - 1) + PROFIT.w) / 2, at: W("masa depan") }].map((l) => (
                      <div key={l.text} style={{ position: "absolute", left: l.x, top: PROFIT.labelY, transform: "translate(-50%, -50%)", ...typeStyle("label"), fontSize: PROFIT.label, fontWeight: 500, color: c.indigo, opacity: ease(f, l.at, m.reveal) }}>{l.text}</div>
                    ))}
                  </>
                ) : null}
              </div>
            );
          })}
        </Card>
      </Appear>

      {/* C — the four, answered, round the code */}
      <Appear at={answeredAt} out={faceAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {QUESTIONS.map((q, i) => {
          const side = i % 2 ? 1 : -1;
          const row = i < 2 ? -1 : 1;
          const p = ease(f, answeredAt + m.sec(0.14) * i, m.sec(0.4));
          const tick = ease(f, W("bisa dijawab") + m.sec(0.12) * i, m.reveal);
          const x = CX + side * AROUND.dx;
          const y = AROUND.y + row * AROUND.dy;
          return (
            <div key={q.ask}>
              <Connector a={{ x: CX + side * 190, y: AROUND.y + row * 16 }} b={{ x: x - side * (AROUND.d / 2 + 10), y }} p={p} shape="elbow" width={3} dot={false} />
              <IconDisc x={x} y={y} d={AROUND.d} icon={q.icon} opacity={p} />
              {tick > 0.001 ? (
                <div style={{ position: "absolute", left: x + AROUND.d / 2 - 40, top: y - AROUND.d / 2 - 12, width: 64, height: 64, borderRadius: 999, background: theme.color.checkGreen, display: "flex", alignItems: "center", justifyContent: "center", opacity: tick, transform: `scale(${(0.7 + 0.3 * tick).toFixed(3)})` }}>
                  <svg width={36} height={36} viewBox="0 0 40 40">
                    <path d="M 8 21 L 17 30 L 32 11" fill="none" stroke={theme.color.worldWall} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : null}
            </div>
          );
        })}
      </Appear>

      {/* D — something to hold the price against */}
      <Appear at={faceAt + m.sec(0.2)} out={notYetAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <PriceTag x={FACE.tagX - 240} y={FACE.y - 110} w={480} h={220} nose={84} hole={26}>
          <div style={{ ...typeStyle("title"), fontSize: 60, fontWeight: 500, color: c.ink }}>Harga</div>
        </PriceTag>
        <GrowArrow x0={FACE.x + 250} y0={FACE.y} x1={FACE.tagX - 260} y1={FACE.y} p={ease(f, W("punya sesuatu"), m.sec(0.5))} />
        <GrowArrow x0={FACE.tagX - 260} y0={FACE.y + 40} x1={FACE.x + 250} y1={FACE.y + 40} p={ease(f, W("untuk dibandingkan"), m.sec(0.5))} />
      </Appear>

      {/* the code */}
      <Appear at={-m.reveal} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: codeX, top: codeY, transform: `translate(-50%, -50%) scaleY(${Math.max(0.04, turn).toFixed(3)})`, padding: `${(size * 0.3).toFixed(1)}px ${(size * 0.8).toFixed(1)}px`, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, fontFamily: theme.text.family, fontSize: size, fontWeight: 700, letterSpacing: 1, color: interpolateColors(gone, [0, 1], [c.indigo, c.slate]), whiteSpace: "nowrap" }}>{word}</div>
      </Appear>
    </Stage>
  );
};
