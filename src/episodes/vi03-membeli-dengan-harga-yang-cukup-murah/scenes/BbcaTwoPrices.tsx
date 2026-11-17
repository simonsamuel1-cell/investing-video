/**
 * VI03 · SC05 — "BBCA: Rp11.000 vs di Bawah Rp5.000", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC05.png,
 * in VI02's look, on real data.
 *
 *  A  "Sekarang lihat kejadian nyata di 2026": "Kejadian nyata · 2026", BBCA / Bank Central Asia; "Biaya dana rendah",
 *     "Margin bunga tinggi" on their words.
 *  B  "Di Tuntun" (a cut): the mascot and Tuntun's Company Quality as the app shows it (Best, three full bars), "Tidak berubah".
 *  C  "Pada 23 September 2024" (a cut): BBCA's real weekly closes (data/bbca.ts, Yahoo Finance) drawn as the VO walks them:
 *     up to 23 Sep 2024 (Rp10.950, "Market optimistis"), on to 8 Jun 2026 (Rp4.850); "Net sell asing ±Rp31 T" and the
 *     panicking investor at the right.
 *  D  "Padahal" (same shot): the right column becomes three ticks — Perusahaan sama, Kualitas tetap, Reference Fair Value tetap.
 *  E  "Sampai 13 November 2026" (same shot): the line runs to 13 Nov 2026 (Rp5.500); the two buyers' results, dividends included.
 *  F  "Seberapa bagus pun perusahaannya" (a cut): Orang Tuntun, the lesson, the two kinds of room, and why people overpay.
 *
 * Net foreign sell: Kontan (Jun 2026), Rp31,34 T year to date. Results: data/bbca.ts.
 */
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BBCA_MARKS, BBCA_RESULT, BBCA_WEEKLY } from "../data/bbca";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Glyph, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, Pic, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the bank
const HEAD = { y: 250 };
const NAME = { y: 360, size: 150 };
const FACTS = { y: 620, w: 520, h: 120, gap: 60 };

// B — Tuntun's Company Quality, drawn as the app shows it
const CQ = { w: 760, h: 380, y: 260 };

// C–E — the chart
const CHART = { x: 140, y: 180, w: 1180, h: 680, padL: 150, padR: 50, padT: 90, padB: 90 };
const PLOT = { x: CHART.x + CHART.padL, y: CHART.y + CHART.padT, w: CHART.w - CHART.padL - CHART.padR, h: CHART.h - CHART.padT - CHART.padB };
const Y = { lo: 4000, hi: 13000, ticks: [4000, 6000, 8000, 10000, 12000] };
const N = BBCA_WEEKLY.length;
const px = (i: number) => PLOT.x + (i / (N - 1)) * PLOT.w;
const py = (v: number) => PLOT.y + (1 - (v - Y.lo) / (Y.hi - Y.lo)) * PLOT.h;
const idx = (d: string) => BBCA_WEEKLY.findIndex(([day]) => day === d);
const I_HIGH = idx(BBCA_MARKS.high.date);
const I_LOW = idx(BBCA_MARKS.low.date);
const I_END = N - 1;
const YEARS = ["2024", "2025", "2026"].map((y) => ({ y, i: BBCA_WEEKLY.findIndex(([d]) => d.startsWith(y)) }));
const COL = { x: 1360, w: 410 };
const PANIC = { src: "art/vi02/investor/panik.png", w0: 572, h0: 1412, h: 330 };
const rp = (v: number) => `Rp${v.toLocaleString("id-ID")}`;

// F — the lesson
const LESSON = { x: ORANG_TUNTUN_RIGHT + 70, w: 1760 - ORANG_TUNTUN_RIGHT - 70 };

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const tuntunAt = W("Di Tuntun");
  const chartAt = W("Pada 23");
  const lessonAt = W("Seberapa bagus");

  // C–E: how far the line is drawn
  const toHigh = ease(f, chartAt, m.sec(1.4));
  const toLow = ease(f, W("Kemudian pada"), m.sec(2));
  const toEnd = ease(f, W("Sampai 13"), m.sec(1.2));
  const upto = toHigh * I_HIGH + toLow * (I_LOW - I_HIGH) + toEnd * (I_END - I_LOW);
  const n = Math.max(1, Math.floor(upto));
  const pts = BBCA_WEEKLY.slice(0, n + 1).map(([, v], i) => [px(i), py(v)] as const);
  // the tip between two weeks, so the line grows smoothly
  const frac = upto - n;
  const tip = n < N - 1 ? [px(n + frac), py(BBCA_WEEKLY[n][1] + (BBCA_WEEKLY[n + 1][1] - BBCA_WEEKLY[n][1]) * frac)] as const : null;
  const path = [...pts, ...(tip ? [tip] : [])].map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

  const sameAt = W("Padahal");
  const evalAt = W("Sampai 13");
  const colC = 1 - ease(f, sameAt - m.sec(0.3), m.fade);
  const colD = ease(f, sameAt, m.reveal) * (1 - ease(f, evalAt - m.sec(0.3), m.fade));
  const res1 = ease(f, W("Investor di sekitar"), m.reveal);
  const res2 = ease(f, W("Investor di bawah"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — BBCA */}
      <Shot from={-1} to={tuntunAt} block={BLOCK.SC05} cutIn={false}>
        <Appear at={-m.reveal} style={{ left: 0, top: 0 }}>
          <WordPill x={CX} y={HEAD.y} text="Kejadian nyata · 2026" size={36} />
        </Appear>
        <Appear at={W("BBCA adalah")} style={{ left: 0, width: theme.canvas.width, top: NAME.y, textAlign: "center" }}>
          <div style={{ ...typeStyle("title"), fontSize: NAME.size, fontWeight: 700, lineHeight: 1, color: c.ink }}>BBCA</div>
          <div style={{ marginTop: 18, ...typeStyle("label"), fontSize: 40, fontWeight: 500, color: c.slate }}>Bank Central Asia</div>
        </Appear>
        {[
          { icon: "trend-down", text: "Biaya dana rendah", at: W("Biaya dananya") },
          { icon: "trend-up", text: "Margin bunga tinggi", at: W("margin bunganya") },
        ].map((k, i) => (
          <Appear key={k.text} at={k.at} style={{ left: CX - FACTS.w - FACTS.gap / 2 + i * (FACTS.w + FACTS.gap), top: FACTS.y, width: FACTS.w, height: FACTS.h }}>
            <Card x={0} y={0} w={FACTS.w} h={FACTS.h}>
              <div style={{ position: "absolute", left: 24, top: (FACTS.h - 76) / 2, width: 76, height: 76, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon={k.icon} size={42} tone={c.indigo} />
              </div>
              <div style={{ position: "absolute", left: 122, top: FACTS.h / 2, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
            </Card>
          </Appear>
        ))}
      </Shot>

      {/* B — Tuntun's Company Quality: Best, unchanged */}
      <Shot from={tuntunAt} to={chartAt} block={BLOCK.SC05}>
        <TuntunMark x={CX - CQ.w / 2 - 110} y={CQ.y + 70} height={130} />
        <Appear at={W("Company")} style={{ left: CX - CQ.w / 2, top: CQ.y, width: CQ.w, height: CQ.h }}>
          <Card x={0} y={0} w={CQ.w} h={CQ.h}>
            <div style={{ position: "absolute", left: 0, width: CQ.w, top: 40, textAlign: "center", ...typeStyle("label"), fontSize: 46, fontWeight: 500, color: c.slate }}>Company Quality</div>
            <div style={{ position: "absolute", left: 0, width: CQ.w, top: 104, textAlign: "center", ...typeStyle("title"), fontSize: 92, fontWeight: 700, color: theme.color.ok }}>Best</div>
            <div style={{ position: "absolute", left: 70, right: 70, top: 236, height: 24, display: "flex", gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flex: 1, borderRadius: 12, background: theme.color.ok }} />
              ))}
            </div>
            <div style={{ position: "absolute", left: 70, right: 70, top: 284, display: "flex", justifyContent: "space-between", ...typeStyle("label"), fontSize: 36, fontWeight: 500, color: c.slate }}>
              <span>Average</span>
              <span>Best</span>
            </div>
          </Card>
        </Appear>
        <Appear at={W("tidak berubah")} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: CX, top: CQ.y + CQ.h + 90, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 18, padding: "12px 34px 12px 14px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }}>
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <Mark kind="check" p={1} x={28} y={28} size={56} />
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 40, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Tidak berubah</div>
          </div>
        </Appear>
      </Shot>

      {/* C–E — BBCA's price, 2024–2026 */}
      <Shot from={chartAt} to={lessonAt} block={BLOCK.SC05}>
        <Card x={CHART.x} y={CHART.y} w={CHART.w} h={CHART.h}>
          <div style={{ position: "absolute", left: 40, top: 30, ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.ink }}>BBCA</div>
        </Card>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {Y.ticks.map((t) => (
            <g key={t}>
              <line x1={PLOT.x} y1={py(t)} x2={PLOT.x + PLOT.w} y2={py(t)} stroke={theme.color.skeleton} strokeWidth={2} />
              <text x={PLOT.x - 20} y={py(t) + 10} textAnchor="end" fontFamily={theme.text.family} fontSize={28} fontWeight={500} fill={c.slate}>
                {rp(t)}
              </text>
            </g>
          ))}
          {YEARS.map((y) => (
            <text key={y.y} x={px(y.i)} y={PLOT.y + PLOT.h + 50} textAnchor="start" fontFamily={theme.text.family} fontSize={28} fontWeight={600} fill={c.slate}>
              {y.y}
            </text>
          ))}
          <path d={path} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          {/* a leader from the 13 Nov label, high above the 2026 line, down to its day */}
          {(() => {
            const p = ease(f, evalAt + m.sec(1.1), m.reveal);
            const x = px(I_END);
            const y = py(BBCA_WEEKLY[I_END][1]);
            return p > 0.001 ? <line x1={x} y1={y - 220 + 26} x2={x} y2={y - 20} stroke={c.indigo} strokeWidth={2} strokeDasharray="6 8" opacity={p} /> : null;
          })()}
          {/* the three days the VO names */}
          {[
            { i: I_HIGH, at: chartAt + m.sec(1.2), lit: res1 },
            { i: I_LOW, at: W("Kemudian pada") + m.sec(1.8), lit: res2 },
            { i: I_END, at: evalAt + m.sec(1.1), lit: 0 },
          ].map((k) => {
            const p = ease(f, k.at, m.pop);
            const x = px(k.i);
            const y = py(BBCA_WEEKLY[k.i][1]);
            return p > 0.001 ? (
              <g key={k.i} opacity={p}>
                <circle cx={x} cy={y} r={16 + 6 * k.lit} fill={c.cardBg} stroke={c.indigo} strokeWidth={4} />
                <circle cx={x} cy={y} r={7} fill={c.indigo} />
              </g>
            ) : null;
          })}
        </svg>
        {/* the labels at the three days */}
        {[
          { i: I_HIGH, text: `23 Sep 2024 · ${rp(BBCA_MARKS.high.close)}`, at: chartAt + m.sec(1.2), dx: 0, dy: -56 },
          { i: I_LOW, text: `8 Jun 2026 · ${rp(BBCA_MARKS.low.close)}`, at: W("Kemudian pada") + m.sec(1.8), dx: -190, dy: 40 },
          { i: I_END, text: `13 Nov 2026 · ${rp(BBCA_MARKS.eval.close)}`, at: evalAt + m.sec(1.1), dx: 0, dy: -220 },
        ].map((k) => (
          <Appear key={k.i} at={k.at} style={{ left: 0, top: 0 }}>
            <WordPill x={Math.min(px(k.i) + k.dx, PLOT.x + PLOT.w - 150)} y={py(BBCA_WEEKLY[k.i][1]) + k.dy} text={k.text} size={28} />
          </Appear>
        ))}
        <Appear at={W("market sangat")} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: px(I_HIGH), top: py(BBCA_MARKS.high.close) - 116, transform: "translate(-50%, -50%)", padding: "8px 24px", borderRadius: 999, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 2px ${c.indigo}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Market optimistis</div>
        </Appear>

        {/* C — the right column: foreign selling, fear */}
        {colC > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: colC }}>
            <Appear at={W("Berita foreign")} style={{ left: COL.x, top: CHART.y, width: COL.w, height: 210 }}>
              <Card x={0} y={0} w={COL.w} h={210}>
                <div style={{ position: "absolute", left: 28, top: 28, width: 64, height: 64, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon="newspaper" size={36} tone={c.indigo} />
                </div>
                <div style={{ position: "absolute", left: 110, top: 30, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.ink, lineHeight: 1.2 }}>Foreign outflow</div>
                <div style={{ position: "absolute", left: 28, right: 20, top: 112, ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Net sell ±Rp31 T</div>
                <div style={{ position: "absolute", left: 28, top: 164, ...typeStyle("label"), fontSize: 24, fontWeight: 500, color: c.slate, whiteSpace: "nowrap" }}>Jan–Jun 2026</div>
              </Card>
            </Appear>
            <Appear at={W("Orang yang membeli")} style={{ left: COL.x + COL.w / 2 - (PANIC.h * PANIC.w0) / PANIC.h0 / 2, top: CHART.y + CHART.h - PANIC.h, width: (PANIC.h * PANIC.w0) / PANIC.h0, height: PANIC.h }}>
              <Pic src={staticFile(PANIC.src)} style={{ position: "absolute", inset: 0, width: (PANIC.h * PANIC.w0) / PANIC.h0, height: PANIC.h }} />
            </Appear>
          </div>
        ) : null}

        {/* D — the same company */}
        {colD > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: colD }}>
            {[
              { text: "Perusahaan sama", at: W("perusahaannya sama") },
              { text: "Kualitas tetap", at: W("kualitasnya tidak") },
              { text: "Reference Fair Value tetap", at: W("Reference Fair Value-nya") },
            ].map((k, i) => (
              <Appear key={k.text} at={k.at} style={{ left: COL.x, top: CHART.y + 60 + i * 150, width: COL.w, height: 116 }}>
                <Card x={0} y={0} w={COL.w} h={116}>
                  <div style={{ position: "absolute", left: 28, right: 90, top: 58, transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 32, fontWeight: 600, lineHeight: 1.15, color: c.ink }}>{k.text}</div>
                  <Mark kind="check" p={1} x={COL.w - 50} y={58} size={52} />
                </Card>
              </Appear>
            ))}
          </div>
        ) : null}

        {/* E — two buyers, the same company */}
        {[
          { p: res1, buy: "Beli ±Rp11.000", r: BBCA_RESULT.high, tone: theme.color.crossRed },
          { p: res2, buy: "Beli < Rp5.000", r: BBCA_RESULT.low, tone: theme.color.ok },
        ].map((k, i) =>
          k.p > 0.001 ? (
            <div key={k.buy} style={{ position: "absolute", left: COL.x, top: CHART.y + 40 + i * 250 + (1 - k.p) * 14, width: COL.w, height: 210, opacity: k.p }}>
              <Card x={0} y={0} w={COL.w} h={210}>
                <div style={{ position: "absolute", left: 30, top: 30, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.buy}</div>
                <div style={{ position: "absolute", left: 30, top: 80, ...typeStyle("title"), fontSize: 92, fontWeight: 700, lineHeight: 1, color: k.tone, fontVariantNumeric: "tabular-nums" }}>{k.r > 0 ? `+${k.r}%` : `−${-k.r}%`}</div>
              </Card>
            </div>
          ) : null,
        )}
        <Appear at={W("Investor di bawah") + m.sec(0.5)} style={{ left: COL.x, width: COL.w, top: CHART.y + 40 + 2 * 250 - 20, textAlign: "center" }}>
          <div style={{ ...typeStyle("label"), fontSize: 23, fontWeight: 500, color: c.slate, whiteSpace: "nowrap" }}>s.d. 13 Nov 2026 · termasuk dividen</div>
        </Appear>
      </Shot>

      {/* F — however good the company */}
      <Shot from={lessonAt} to={1e6} block={BLOCK.SC05} cutOut={false}>
        <OrangTuntun at={lessonAt} />
        <Appear at={lessonAt} style={{ left: LESSON.x, top: 220, width: LESSON.w, height: 170 }}>
          <Card x={0} y={0} w={LESSON.w} h={170} style={{ boxShadow: shadow.glow }}>
            <Ring p={1} tone={c.indigo} />
            <Line x={40} y={85} w={LESSON.w - 80} text="Perusahaan bagus tetap harus dibeli cukup murah." mark="cukup murah" size={44} weight={500} />
          </Card>
        </Appear>
        {[
          { icon: "trend-up", text: "Ruang untuk return", at: W("ruang untuk return") },
          { icon: "scales", text: "Ruang kalau salah", at: W("sekaligus memberi") },
        ].map((k, i) => (
          <Appear key={k.text} at={k.at} style={{ left: LESSON.x + i * ((LESSON.w + 30) / 2), top: 430, width: (LESSON.w - 30) / 2, height: 120 }}>
            <Card x={0} y={0} w={(LESSON.w - 30) / 2} h={120}>
              <div style={{ position: "absolute", left: 24, top: 22, width: 76, height: 76, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon={k.icon} size={42} tone={c.indigo} />
              </div>
              <div style={{ position: "absolute", left: 122, top: 60, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
            </Card>
          </Appear>
        ))}
        <Appear at={W("Dan sering")} style={{ left: LESSON.x, top: 600, width: LESSON.w, height: 150 }}>
          <Card x={0} y={0} w={LESSON.w} h={150}>
            <div style={{ position: "absolute", left: 30, top: 27, width: 96, height: 96, borderRadius: 999, background: interpolateColors(ease(f, W("terlalu menyukainya"), m.pop), [0, 1], [theme.color.neutralDisc, theme.color.indigoWashSolid]), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="heart" size={52} tone={c.indigo} />
            </div>
            <Line x={160} y={75} w={LESSON.w - 200} text="Terlalu mahal, karena terlalu menyukainya." mark="terlalu menyukainya" size={40} weight={500} />
          </Card>
        </Appear>
      </Shot>
    </Stage>
  );
};
