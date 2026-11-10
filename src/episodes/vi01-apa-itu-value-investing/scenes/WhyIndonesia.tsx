/**
 * VI01 · SC04 — "Kenapa Relevan untuk Investor Indonesia?", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC04.png: a rail 1–2–3 on the left (the layout he kept in VI02 SC07), one large card whose
 * content changes with the reason.
 *
 *  1  "harga … bergerak lebih cepat": Investor ritel ≈52% and Investor asing ≈30% (the script's figures); then price
 *     swinging round a calm value line, the gap between them marked; Simon's line, opportunity in indigo.
 *  2  "bisnis yang bisa dipelajari": Bank · Consumer · Telco, then years of steady profit with a dividend each year — a
 *     shape, no figures; Simon's line.
 *  3  "nggak menuntut kita untuk terus menatap layar": Simon's line; the day (kerja) and the night (baca laporan); notes that
 *     stack up, one of them corrected.
 */
import { useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Card, Glyph, Line, ease, useWords } from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const TITLE = { x: 140, y: 160 };
const RAIL = { x: 140, y0: 380, gap: 170, d: 96 };
const CARD = { x: 340, y: 260, w: 1440, h: 640 };
const LINE_Y = 560;

const SHARES = [
  { label: "Investor ritel", v: 52, text: "≈52%", at: "Investor ritel" },
  { label: "Investor asing", v: 30, text: "≈30%", at: "Investor asing" },
] as const;
const SECTORS = [
  { icon: "bank", label: "Bank", at: "Bank." },
  { icon: "shopping-cart", label: "Consumer", at: "Consumer." },
  { icon: "cell-signal-full", label: "Telco", at: "Telekomunikasi." },
] as const;
/** Price round value: value climbs gently, price swings well above and below it. */
const N = 60;
const valueAt = (i: number) => 0.62 - (i / (N - 1)) * 0.22;
const priceAt = (i: number) => valueAt(i) + 0.2 * Math.sin(i * 0.33) + 0.09 * Math.sin(i * 0.91 + 1);
const WIDE = 38;
/** Twenty years of profit, a steady climb with two soft years — a shape, not a company. */
const PROFIT = [0.3, 0.34, 0.37, 0.36, 0.41, 0.45, 0.48, 0.47, 0.52, 0.56, 0.6, 0.58, 0.63, 0.67, 0.7, 0.66, 0.72, 0.77, 0.81, 0.86];

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);

  const titleP = ease(f, W("Lalu kenapa"), m.reveal);
  const railP = ease(f, W("Ada tiga"), m.reveal);
  const cardIn = ease(f, W("Pertama") - m.reveal / 2, m.reveal);
  const sec = [ease(f, W("Pertama"), m.fade), ease(f, W("Kedua"), m.fade), ease(f, W("Ketiga"), m.fade)];
  const show = [sec[0] * (1 - sec[1]), sec[1] * (1 - sec[2]), sec[2]];
  const active = f < W("Kedua") ? 0 : f < W("Ketiga") ? 1 : 2;

  // 1
  const toChart = ease(f, W("Saat sentimen") - m.fade, m.move);
  const chartDraw = ease(f, W("Saat sentimen"), m.sec(1.6));
  const gap = ease(f, W("jauh dari value"), m.pop);
  const line1 = ease(f, W("Bagi value"), m.reveal);
  // 2
  const toYears = ease(f, W("Ada perusahaan") - m.fade, m.move);
  const years = ease(f, W("Ada perusahaan"), m.sec(1.6));
  const divP = ease(f, W("dividen"), m.sec(1));
  const line2 = ease(f, W("Artinya"), m.reveal);
  // 3
  const line3 = ease(f, W("Ketiga"), m.reveal);
  const day = ease(f, W("Kita tetap"), m.reveal);
  const night = ease(f, W("Lalu malamnya"), m.reveal);
  const notes = ease(f, W("Pengetahuan"), m.move);
  const fix = ease(f, W("Dan kesalahan"), m.move);

  const inner = { x: 80, w: CARD.w - 160 };
  const chart = { x: 120, y: 90, w: CARD.w - 240, h: 380 };
  const pts = (fn: (i: number) => number, upto: number) =>
    Array.from({ length: Math.max(2, Math.round(upto * (N - 1)) + 1) }, (_, i) => `${i ? "L" : "M"} ${(chart.x + (i / (N - 1)) * chart.w).toFixed(1)} ${(chart.y + fn(i) * chart.h).toFixed(1)}`).join(" ");

  return (
    <>
      {titleP > 0.001 ? <div style={{ position: "absolute", left: TITLE.x, top: TITLE.y, transform: `translateY(calc(-50% + ${((1 - titleP) * 12).toFixed(1)}px))`, opacity: titleP, ...typeStyle("title"), fontSize: 56, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Kenapa relevan untuk investor Indonesia?</div> : null}

      {/* the rail */}
      {[0, 1, 2].map((i) => {
        const p = ease(f, W("Ada tiga") + i * 6, m.reveal) * railP;
        const on = i === active && cardIn > 0.5;
        return p > 0.001 ? (
          <div key={i} style={{ position: "absolute", left: RAIL.x, top: RAIL.y0 + i * RAIL.gap - RAIL.d / 2, width: RAIL.d, height: RAIL.d, borderRadius: 999, opacity: p, background: on ? c.indigo : c.cardBg, boxShadow: on ? shadow.glow : `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: on ? c.cardBg : c.slate }}>{i + 1}</div>
        ) : null;
      })}
      {railP > 0.001 ? <div style={{ position: "absolute", left: RAIL.x + RAIL.d / 2 - 1, top: RAIL.y0 + RAIL.d / 2 + 10, width: 2, height: 2 * RAIL.gap - RAIL.d - 20, background: theme.color.skeleton, opacity: railP, zIndex: -1 }} /> : null}

      {cardIn > 0.001 ? (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: cardIn, transform: `translateY(${((1 - cardIn) * 20).toFixed(1)}px)` }}>
          <Card x={0} y={0} w={CARD.w} h={CARD.h}>
            {/* 1 — shares, then price round value */}
            {show[0] > 0.001 ? (
              <div style={{ position: "absolute", inset: 0, opacity: show[0] }}>
                {SHARES.map((s, i) => {
                  const p = ease(f, W(s.at), m.reveal) * (1 - toChart);
                  const grow = ease(f, W(s.at) + m.sec(0.3), m.sec(1));
                  return p > 0.001 ? (
                    <div key={s.label} style={{ position: "absolute", left: inner.x, top: 150 + i * 170, width: inner.w, opacity: p, display: "flex", alignItems: "center", gap: 40 }}>
                      <div style={{ width: 330, ...typeStyle("label"), fontSize: 42, fontWeight: 600, color: c.ink }}>{s.label}</div>
                      <div style={{ position: "relative", flex: 1, height: 44, borderRadius: 22, background: theme.color.neutralDisc }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: 44, borderRadius: 22, width: `${(s.v * grow).toFixed(2)}%`, background: i === 0 ? c.indigo : theme.color.neutralDotOn }} />
                      </div>
                      <div style={{ width: 170, textAlign: "right", ...typeStyle("title"), fontSize: 56, fontWeight: 600, color: i === 0 ? c.indigo : c.ink, fontVariantNumeric: "tabular-nums" }}>{s.text}</div>
                    </div>
                  ) : null;
                })}
                {toChart > 0.001 ? (
                  <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0, opacity: toChart }}>
                    <path d={pts(valueAt, chartDraw)} fill="none" stroke={c.indigo} strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
                    <path d={pts(priceAt, chartDraw)} fill="none" stroke={c.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                    {gap > 0.001 ? (
                      <g opacity={gap} stroke={theme.color.crossRed} strokeWidth={4} strokeLinecap="round">
                        <line x1={chart.x + (WIDE / (N - 1)) * chart.w} y1={chart.y + valueAt(WIDE) * chart.h} x2={chart.x + (WIDE / (N - 1)) * chart.w} y2={chart.y + (valueAt(WIDE) + (priceAt(WIDE) - valueAt(WIDE)) * gap) * chart.h} />
                      </g>
                    ) : null}
                  </svg>
                ) : null}
                {toChart > 0.5 ? (
                  <>
                    <div style={{ position: "absolute", left: chart.x + chart.w + 10, top: chart.y + valueAt(N - 1) * chart.h, transform: "translate(-100%, -150%)", ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.indigo, opacity: chartDraw }}>Value</div>
                    <div style={{ position: "absolute", left: chart.x + 6, top: chart.y + priceAt(0) * chart.h - 60, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.ink, opacity: chartDraw }}>Harga</div>
                  </>
                ) : null}
                {line1 > 0.001 ? <div style={{ opacity: line1 }}><Line x={0} y={LINE_Y} w={CARD.w} text="Harga sering menjauh dari value = opportunity" size={46} align="center" weight={500} mark="opportunity" /></div> : null}
              </div>
            ) : null}

            {/* 2 — the businesses, then their years */}
            {show[1] > 0.001 ? (
              <div style={{ position: "absolute", inset: 0, opacity: show[1] }}>
                {SECTORS.map((s, i) => {
                  const p = ease(f, W(s.at), m.pop);
                  const x = mix(CARD.w / 2 - 480 + i * 360, 120 + i * 170, toYears);
                  const y = mix(170, 110, toYears);
                  const k = mix(1, 0.5, toYears);
                  return p > 0.001 ? (
                    <div key={s.label} style={{ position: "absolute", left: x, top: y, width: 240, opacity: p, transform: `scale(${(k * (0.9 + 0.1 * p)).toFixed(3)})`, transformOrigin: "0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                      <div style={{ width: 180, height: 180, borderRadius: 48, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Glyph icon={s.icon} size={96} tone={c.indigo} />
                      </div>
                      <div style={{ ...typeStyle("label"), fontSize: 40, fontWeight: 600, color: c.ink }}>{s.label}</div>
                    </div>
                  ) : null;
                })}
                {toYears > 0.001
                  ? PROFIT.map((v, i) => {
                      const bw = 40;
                      const x = 660 + i * 34;
                      const shown = ease(f, W("Ada perusahaan") + i * 4, m.reveal);
                      const h = 300 * v * shown;
                      const dot = ease(f, W("dividen") + i * 3, m.pop) * divP;
                      return (
                        <div key={i}>
                          <div style={{ position: "absolute", left: x - bw / 2 + 12, top: 470 - h, width: bw - 16, height: h, borderRadius: "8px 8px 0 0", background: c.indigo, opacity: toYears }} />
                          {dot > 0.001 ? <div style={{ position: "absolute", left: x + 4 - 8, top: 470 - h - 30, width: 16, height: 16, borderRadius: 999, background: theme.color.ok, opacity: dot }} /> : null}
                        </div>
                      );
                    })
                  : null}
                {toYears > 0.5 ? (
                  <>
                    <div style={{ position: "absolute", left: 640, top: 490, ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.slate, opacity: years }}>20 tahun →</div>
                    <div style={{ position: "absolute", left: 120, top: 300, display: "flex", flexDirection: "column", gap: 18, opacity: years }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.ink }}><div style={{ width: 26, height: 26, borderRadius: 6, background: c.indigo }} />Laba</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.ink, opacity: divP }}><div style={{ width: 22, height: 22, borderRadius: 999, background: theme.color.ok }} />Dividen</div>
                    </div>
                  </>
                ) : null}
                {line2 > 0.001 ? <div style={{ opacity: line2 }}><Line x={0} y={LINE_Y} w={CARD.w} text="Indonesia punya bisnis jangka panjang" size={46} align="center" weight={500} mark="jangka panjang" /></div> : null}
              </div>
            ) : null}

            {/* 3 — day and night, notes that keep */}
            {show[2] > 0.001 ? (
              <div style={{ position: "absolute", inset: 0, opacity: show[2] }}>
                {[{ p: day, icon: "sun", label: "Kerja", x: 0 }, { p: night, icon: "moon", label: "Baca laporan", x: 1 }].map((h) => {
                  const k = mix(1, 0.72, notes);
                  const x = mix(260 + h.x * 520, 90 + h.x * 300, notes);
                  return h.p > 0.001 ? (
                    <div key={h.label} style={{ position: "absolute", left: x, top: 90, width: 400, opacity: h.p, transform: `scale(${k.toFixed(3)})`, transformOrigin: "0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                      <div style={{ width: 210, height: 210, borderRadius: 999, background: h.x ? theme.color.neutralDotOn : theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Glyph icon={h.icon} size={110} tone={h.x ? c.cardBg : c.indigo} />
                      </div>
                      <div style={{ ...typeStyle("label"), fontSize: 42, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{h.label}</div>
                    </div>
                  ) : null;
                })}
                {[0, 1, 2].map((i) => {
                  const p = ease(f, W("Pengetahuan") + i * 14, m.reveal);
                  if (p <= 0.001) return null;
                  const wrong = i === 1;
                  return (
                    <div key={i} style={{ position: "absolute", left: 800, top: 90 + i * 112 + (1 - p) * 20, width: 520, height: 92, borderRadius: 22, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.skeleton}`, opacity: p, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
                      <Glyph icon="notebook" size={44} tone={theme.color.neutralIcon} />
                      <div style={{ position: "relative", flex: 1, height: 14, borderRadius: 7, background: theme.color.skeleton }}>
                        {wrong && fix > 0.001 ? <div style={{ position: "absolute", left: -8, right: 20, top: 5, height: 4, borderRadius: 2, background: theme.color.crossRed, transformOrigin: "0 50%", transform: `scaleX(${fix.toFixed(3)})` }} /> : null}
                      </div>
                      {wrong ? <div style={{ opacity: fix }}><Glyph icon="check-circle" size={44} tone={theme.color.ok} /></div> : <Glyph icon="check-circle" size={44} tone={c.indigo} />}
                    </div>
                  );
                })}
                {line3 > 0.001 ? <div style={{ opacity: line3 }}><Line x={0} y={LINE_Y} w={CARD.w} text="Nggak harus full-time dan nggak harus terus melihat layar" size={46} align="center" weight={500} /></div> : null}
              </div>
            ) : null}
          </Card>
        </div>
      ) : null}
    </>
  );
};
