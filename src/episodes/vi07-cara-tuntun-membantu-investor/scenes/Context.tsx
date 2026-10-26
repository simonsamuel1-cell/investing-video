/**
 * VI07 · SC10 — "Harga Sama-Sama Turun, Konteksnya Bisa Berbeda". From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC10.jpg.
 *
 *  A  two real IHSG drops (data/ihsg.ts, Yahoo Finance closes) as editorial charts: 28 Januari 2026 and April 2025,
 *     the April news as an archival clipping (Benchmark v2, Simon 26 Oct: Dalio's chart and archive styles).
 *  B  April 2025's context: valuation at Murah, sentiment at Takut.
 *  C  the question changes — "Jual atau nggak?" ✕ → "Dampak nyata, atau reaksi berlebihan?" — read with three tools:
 *     Company Quality (unchanged ✓), Fair Value (price far below), Event Research.
 *  D  the reason still holds → no panic; long-term money may look, step by step — not emergency money, not money
 *     about to be spent, not automatic; then the two drops again and the one line.
 *
 * Only what the script says, or the data shows, is drawn as fact: the two charts are real closes; April 2025's low
 * valuation and fear are the script's words (drawn as positions, not numbers); 28 Januari's context is left blank on
 * purpose.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Ico, Line, Mark, SITUATION, Typed, ease, useWords } from "../components/kit";
import { DataChart, NewsClipping } from "../components/Dalio";
import { APR_2025, JAN_2026 } from "../data/ihsg";

const CX = theme.canvas.width / 2;

// A/B — the two drops
const DROP = { w: 640, h: 380, y: 200 };
const dropX = (i: number) => (i === 0 ? CX - 40 - DROP.w : CX + 40);
const MINI = { y: 610, h: 230 };
/** The two real series (data/ihsg.ts): their window, axis and the day each dropped. */
const CHARTS = [
  { title: "28 Januari 2026", series: JAN_2026, lo: 7500, hi: 9500, ticks: [8000, 9000], event: { d: "2026-01-28", label: "28 Jan" } },
  { title: "April 2025", series: APR_2025, lo: 5600, hi: 7400, ticks: [6000, 7000], event: { d: "2025-04-08", label: "8 Apr" } },
];

// C — the question and its three tools
const QUESTION = { w: 1160, h: 150, y: 220 };
const TOOL = { w: 460, h: 240, y: 500, gap: 50 };
const toolX = (i: number) => CX - (3 * TOOL.w + 2 * TOOL.gap) / 2 + i * (TOOL.w + TOOL.gap);
const TOOLS = [
  { text: "Company Quality", icon: "company", at: "kualitas perusahaan" },
  { text: "Fair Value", icon: "scale", at: "harganya sudah" },
  { text: "Event Research", icon: "event", at: "berita tersebut" },
] as const;

// D — long-term money, step by step; and what it is not
const NOT = [
  { text: "Dana darurat", icon: "emergency", at: "dana darurat" },
  { text: "Segera dipakai", icon: "spend", at: "segera dipakai" },
  { text: "Otomatis", icon: "auto", at: "keputusan otomatis" },
] as const;

/** A small chip: an icon and a word. */
const Chip = ({ icon, text, tone, p }: { icon: string; text: string; tone?: string; p: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (p <= 0.001) return null;
  return (
    <div style={{ height: 56, padding: "0 22px 0 10px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `translateY(${((1 - p) * 10).toFixed(2)}px)`, ...typeStyle("label"), fontSize: 28, color: c.ink, whiteSpace: "nowrap" }}>
      <Disc icon={icon} size={40} tone={tone ?? theme.color.neutralIcon} tint={theme.color.neutralDisc} />
      {text}
    </div>
  );
};

export const SC10 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(10, BLOCK.SC10);
  const g = f + BLOCK.SC10;

  // A/B
  const drawP = ease(f, W("semua penurunan"), m.sec(1));
  const aOut = ease(f, W("Jadi pertanyaannya"), m.fade);
  const marker = 0.5 - 0.38 * ease(f, W("relatif rendah"), m.move);
  const needle = 0.5 - 0.38 * ease(f, W("dipenuhi ketakutan"), m.move);
  const miniP = ease(f, W("Bedanya,") - m.sec(0.1), m.reveal);

  // C
  const oldAt = W("Harus jual");
  /** "Tapi:" before the new question ("Tapi nggak semua" is Tapi #0). */
  const crossAt = W("Tapi:", 1);
  const newAt = W("Apakah dampaknya");
  const toolsAt = W("dibaca bersama");
  const cOut = ease(f, W("Bahkan untuk"), m.fade);
  const holds = ease(f, W("masih berlaku"), m.pop);

  // D
  const bankAt = W("dana jangka");
  const stepAt = W("secara bertahap");
  const dOut = ease(f, W("Harga sama-sama"), m.fade);
  const endAt = W("Harga sama-sama");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A/B — the same drop, twice */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          {/* A — the same kind of drop, twice: real IHSG closes (data/ihsg.ts), drawn on like an editorial chart */}
          {[0, 1].map((i) => (
            <Appear key={i} at={i === 0 ? 0 : W("April 2025") - m.sec(0.1)} style={{ left: 0, top: 0 }}>
              {/* B steps back the January drop while April's context is read (the storyboard's B) */}
              <div style={{ filter: i === 0 && miniP > 0.001 ? `grayscale(${miniP.toFixed(3)})` : undefined }}>
                <DataChart
                  x={dropX(i)}
                  y={DROP.y}
                  w={DROP.w}
                  h={DROP.h}
                  title={CHARTS[i].title}
                  series={CHARTS[i].series}
                  lo={CHARTS[i].lo}
                  hi={CHARTS[i].hi}
                  ticks={CHARTS[i].ticks}
                  draw={i === 0 ? drawP : ease(f, W("April 2025"), m.sec(1.2))}
                  event={CHARTS[i].event}
                  eventP={i === 0 ? ease(f, W("semua penurunan") + m.sec(0.9), m.reveal) : ease(f, W("turun tajam"), m.reveal)}
                  halt={f >= W("dihentikan")}
                />
              </div>
            </Appear>
          ))}
          {/* the news, as an archival clipping (Benchmark v2) — the script's own words, no real paper named */}
          <NewsClipping x={dropX(1) + 120} y={MINI.y} w={440} h={250} dateline="April 2025" headline="Kenaikan tarif terhadap Indonesia" p={ease(f, W("kenaikan tarif"), m.reveal) * (1 - miniP)} />
          {/* B — April 2025's context, in its own words: valuation low, fear high */}
          {miniP > 0.001 ? (
            <Card x={dropX(1)} y={MINI.y + (1 - miniP) * 14} w={DROP.w} h={MINI.h} line={theme.color.hairlineBrandSolid} style={{ opacity: miniP }}>
              <div style={{ position: "absolute", left: 36, top: 30, ...typeStyle("label"), color: c.ink }}>Valuasi</div>
              <div style={{ position: "absolute", left: 36, top: 100, width: 280, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${theme.color.indigoWashSolid}, ${theme.color.indigoWashStrongSolid})` }} />
              <div style={{ position: "absolute", left: 36 + marker * 280 - 14, top: 93, width: 28, height: 28, borderRadius: 999, background: c.indigo }} />
              <div style={{ position: "absolute", left: 36, top: 132, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Murah</div>
              <div style={{ position: "absolute", left: 36 + 280 - 90, top: 132, width: 90, textAlign: "right", ...typeStyle("label"), fontSize: 24, color: c.slate }}>Mahal</div>
              <div style={{ position: "absolute", left: 400, top: 30, ...typeStyle("label"), color: c.ink }}>Sentimen</div>
              <svg width={DROP.w} height={MINI.h} style={{ position: "absolute", left: 0, top: 0 }}>
                {(() => {
                  const cx = 520;
                  const cy = 170;
                  const r = 90;
                  const a = Math.PI * (1 - needle);
                  return (
                    <>
                      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={theme.color.indigoWashStrongSolid} strokeWidth={14} strokeLinecap="round" />
                      <line x1={cx} y1={cy} x2={cx + (r - 18) * Math.cos(a)} y2={cy - (r - 18) * Math.sin(a)} stroke={c.ink} strokeWidth={5} strokeLinecap="round" />
                      <circle cx={cx} cy={cy} r={9} fill={c.ink} />
                    </>
                  );
                })()}
              </svg>
              <div style={{ position: "absolute", left: 400, top: 184, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Takut</div>
              <div style={{ position: "absolute", left: 560, top: 184, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Serakah</div>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* C — the question that changes, and the three tools it is read with */}
      {cOut < 0.999 && f >= oldAt - m.sec(0.2) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          {/* the old question, crossed out, giving way */}
          <Appear at={oldAt - m.sec(0.1)} out={newAt} style={{ left: CX - 260, top: QUESTION.y + 20 }}>
            <div style={{ width: 520, height: 110, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontWeight: 500, color: c.slate }}>Jual atau nggak?</div>
          </Appear>
          {f < newAt + m.fade ? <Mark kind="cross" p={ease(f, crossAt, m.pop) * (1 - ease(f, newAt, m.fade))} x={CX + 250} y={QUESTION.y + 30} /> : null}
          {/* the new one */}
          {f >= newAt - m.sec(0.1) ? (
            <Card x={CX - QUESTION.w / 2} y={QUESTION.y} w={QUESTION.w} h={QUESTION.h} line={theme.color.hairlineBrandSolid} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 48px", opacity: ease(f, newAt - m.sec(0.1), m.reveal), boxShadow: `${shadow.soft}, 0 0 40px 8px ${theme.color.indigoGlow}` }}>
              <Disc icon="question" size={88} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              <div style={{ fontFamily: theme.text.family, fontSize: 54, fontWeight: 500, letterSpacing: -0.5, color: c.ink }}>
                <Typed text="Dampak nyata, atau reaksi berlebihan?" at={newAt} cps={30} mark="Dampak nyata" />
              </div>
            </Card>
          ) : null}
          {TOOLS.map((t, i) => {
            const x = toolX(i);
            const p = ease(f, W(t.at) - m.sec(0.1), m.reveal);
            return (
              <div key={t.text}>
                <Connector a={{ x: CX, y: QUESTION.y + QUESTION.h }} b={{ x: x + TOOL.w / 2, y: TOOL.y }} p={ease(f, toolsAt + i * m.sec(0.1), m.sec(0.5))} shape="curve" axis="y" />
                {f >= toolsAt + i * m.sec(0.1) + m.sec(0.3) ? (
                  <div style={{ position: "absolute", left: x, top: TOOL.y, width: TOOL.w, height: TOOL.h, opacity: ease(f, toolsAt + i * m.sec(0.1) + m.sec(0.3), m.pop) }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - p }} />
                    <Card x={0} y={(1 - p) * 12} w={TOOL.w} h={TOOL.h} style={{ opacity: p }}>
                      <div style={{ position: "absolute", left: 30, top: 28, display: "flex", alignItems: "center", gap: 16 }}>
                        <Disc icon={t.icon} size={56} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                        <div style={{ ...typeStyle("body"), fontSize: 32, color: c.ink, whiteSpace: "nowrap" }}>{t.text}</div>
                      </div>
                      {i === 0 ? (
                        /* quality unchanged */
                        [0, 1].map((r) => (
                          <div key={r} style={{ position: "absolute", left: 40, top: 120 + r * 50, display: "flex", alignItems: "center", gap: 16 }}>
                            <Ico name="tick" size={26} tone={c.indigo} />
                            <div style={{ width: [240, 190][r], height: 14, borderRadius: 7, background: theme.color.skeleton }} />
                          </div>
                        ))
                      ) : i === 1 ? (
                        /* the price far below the fair value */
                        <>
                          <div style={{ position: "absolute", left: 40, top: 150, width: TOOL.w - 80, height: 10, borderRadius: 5, background: theme.color.neutralDot }} />
                          <div style={{ position: "absolute", left: 40 + 0.62 * (TOOL.w - 80) - 3, top: 120, width: 6, height: 70, borderRadius: 3, background: c.indigo }} />
                          <div style={{ position: "absolute", left: 40 + 0.62 * (TOOL.w - 80) - 80, top: 196, width: 160, textAlign: "center", ...typeStyle("label"), fontSize: 24, color: c.indigo }}>Fair value</div>
                          <div style={{ position: "absolute", left: 40 + (0.62 - 0.5 * ease(f, W(t.at) + m.sec(0.3), m.move)) * (TOOL.w - 80) - 14, top: 141, width: 28, height: 28, borderRadius: 999, background: c.ink }} />
                        </>
                      ) : (
                        /* the news, and whether it reaches the business */
                        <div style={{ position: "absolute", left: 0, top: 130, width: TOOL.w, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                          <Disc icon="news" size={60} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                          <div style={{ width: 90 * ease(f, W("berdampak pada"), m.sec(0.6)), height: 3, borderRadius: 2, background: c.indigo }} />
                          <Disc icon="company" size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                        </div>
                      )}
                    </Card>
                    <Mark kind="check" p={holds} x={TOOL.w - 30} y={30} />
                  </div>
                ) : null}
              </div>
            );
          })}
          {/* no reason to panic */}
          <Appear at={W("ikut panik") - m.sec(0.15)} style={{ left: CX - 130, top: TOOL.y + TOOL.h + 50 }}>
            <Chip icon={SITUATION[0].icon} text={SITUATION[0].label} tone={theme.color.alarmRed} p={1} />
          </Appear>
          <Mark kind="cross" p={ease(f, W("ikut panik"), m.pop)} x={CX + 20} y={TOOL.y + TOOL.h + 50} />
        </div>
      ) : null}

      {/* D — long-term money, step by step … and what it is not */}
      {dOut < 0.999 && f >= bankAt - m.sec(0.2) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - dOut }}>
          <Appear at={bankAt - m.sec(0.1)} style={{ left: 300, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <Disc icon="longterm" size={170} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Dana jangka panjang</div>
          </Appear>
          {/* the steps: a little at a time */}
          {[0, 1, 2].map((k) => {
            const p = ease(f, stepAt - m.sec(0.3) + k * m.sec(0.22), m.reveal);
            return (
              <div key={k} style={{ position: "absolute", left: 700 + k * 110, top: 560 - k * 70, width: 110, height: 70 + k * 70, borderRadius: "16px 16px 0 0", background: theme.color.indigoWashStrongSolid, opacity: p, transformOrigin: "bottom", transform: `scaleY(${p.toFixed(3)})` }}>
                <div style={{ position: "absolute", left: 32, top: -50, width: 46, height: 46, borderRadius: 999, background: c.indigo, opacity: ease(f, stepAt + k * m.sec(0.22), m.pop) }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 700, top: 630, width: 330, height: 2, background: c.border, opacity: ease(f, stepAt - m.sec(0.3), m.reveal) }} />
          {NOT.map((n, i) => {
            const at = W(n.at);
            return (
              <div key={n.text}>
                <div style={{ position: "absolute", left: 1220, top: 300 + i * 120 }}>
                  <Chip icon={n.icon} text={n.text} p={ease(f, at - m.sec(0.15), m.pop)} />
                </div>
                <Mark kind="cross" p={ease(f, at + m.sec(0.15), m.pop)} x={1220 + 10} y={300 + i * 120} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* the end: the same drop, twice, and the line */}
      {f >= endAt - m.sec(0.1) ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, endAt - m.sec(0.1), m.reveal) }}>
          {[0, 1].map((i) => (
            <DataChart key={i} x={i === 0 ? CX - 30 - 600 : CX + 30} y={200} w={600} h={360} title={CHARTS[i].title} series={CHARTS[i].series} lo={CHARTS[i].lo} hi={CHARTS[i].hi} ticks={CHARTS[i].ticks} draw={1} event={CHARTS[i].event} halt />
          ))}
          <Line x={0} y={680} w={theme.canvas.width} align="center" size={56} weight={500} text="Sama-sama turun, konteksnya berbeda." mark="konteksnya berbeda" />
        </div>
      ) : null}
    </Stage>
  );
};
