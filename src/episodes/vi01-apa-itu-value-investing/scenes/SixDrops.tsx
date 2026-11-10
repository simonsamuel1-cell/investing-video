/**
 * VI01 · SC07 — "Enam Penurunan Besar", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC07.png, on REAL data: IHSG closes 2006–2026 (data/ihsg-20y.ts, Yahoo Finance).
 *
 *  A  the line draws across twenty years. B  the six drops, each marked at its lowest close as the VO names its year.
 *  C  "market yang kemudian kembali": from each low, the climb back to where the drop began, in indigo (2026 has not come
 *     back, so it has no climb). D  "setiap kali ada investor yang menjual": a grey person at every low — no sell marker
 *     (the compliance line: no buy/sell markers anywhere). E  2026 close up: the trading halt on 28 Jan, and 8 Jun 2026's
 *     close of 5.342. F  Simon's closing line: Bear Market = Ujian + Kelas.
 */
import { useCurrentFrame } from "remotion";
import { SourceTag, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { IHSG } from "../data/ihsg-20y";
import { Card, Glyph, Line, OUTSIDE_RESERVES, ease, useWords } from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const CARD = { x: 140, y: 150, w: 1640, h: 660 };
const PLOT = { x: 110, y: 110, w: 1440, h: 470 };
const LO = 0;
const HI = 9500;
const T0 = Date.parse("2006-01-01");
const T1 = Date.parse("2026-11-30");
const px = (d: string) => PLOT.x + ((Date.parse(d) - T0) / (T1 - T0)) * PLOT.w;
const py = (v: number) => PLOT.y + (1 - (v - LO) / (HI - LO)) * PLOT.h;

/** The six drops the script names, each searched for its lowest close in its own window. */
const DROPS = [
  { label: "2008", from: "2008-06-01", to: "2009-03-31", at: "2008." },
  { label: "2013", from: "2013-05-01", to: "2013-12-31", at: "2013." },
  { label: "2015", from: "2015-04-01", to: "2015-12-31", at: "2015." },
  { label: "Maret 2020", from: "2020-03-01", to: "2020-03-31", at: "Maret 2020." },
  { label: "April 2025", from: "2025-04-01", to: "2025-04-30", at: "April 2025." },
  { label: "2026", from: "2026-01-01", to: "2026-11-30", at: "2026." },
];
const low = (from: string, to: string) => IHSG.reduce((best, p, i) => (p[0] >= from && p[0] <= to && (best < 0 || p[1] < IHSG[best][1]) ? i : best), -1);
const TROUGHS = DROPS.map((d) => {
  const i = low(d.from, d.to);
  // the level the drop started from: the highest close in the year before the low
  const yearBefore = new Date(Date.parse(IHSG[i][0]) - 365 * 864e5).toISOString().slice(0, 10);
  let top = i;
  for (let k = i; k >= 0 && IHSG[k][0] >= yearBefore; k--) if (IHSG[k][1] > IHSG[top][1]) top = k;
  let back = -1;
  for (let k = i; k < IHSG.length; k++)
    if (IHSG[k][1] >= IHSG[top][1]) {
      back = k;
      break;
    }
  return { ...d, i, back };
});
const HALT = IHSG.findIndex((p) => p[0] === "2026-01-28");
const JUNE = IHSG.findIndex((p) => p[0] === "2026-06-08");
const pathOf = (a: number, b: number) => IHSG.slice(a, b + 1).map((p, k) => `${k ? "L" : "M"} ${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join(" ");
const YEARS = [2006, 2010, 2014, 2018, 2022, 2026];
const fmt = (v: number) => Math.round(v).toLocaleString("id-ID");

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(7, BLOCK.SC07);

  const cardIn = ease(f, W("Sekarang"), m.reveal);
  const draw = ease(f, W("IHSG"), W("Ada enam") - W("IHSG"));
  const back = ease(f, W("Dalam master"), m.sec(1.4));
  const sellers = ease(f, W("dan setiap kali"), m.reveal);
  const zoom = ease(f, W("Pada 2026"), m.move) * (1 - ease(f, W("Kenapa pembelajaran"), m.move));
  const halt = ease(f, W("trading halt"), m.pop);
  const june = ease(f, W("dan pada Juni"), m.pop);
  const lineSix = ease(f, W("Ada enam"), m.reveal) * (1 - ease(f, W("dan setiap kali") - m.fade, m.fade));
  const lineSell = ease(f, W("dan setiap kali"), m.reveal) * (1 - ease(f, W("Pada 2026") - m.fade, m.fade));
  const toEnd = ease(f, W("Karena"), m.move);
  const closing = ease(f, W("bear market adalah"), m.reveal);

  const n = Math.max(1, Math.round(draw * (IHSG.length - 1)));
  // the push-in on 2026: scale about the 2026 stretch of the plot
  const focusX = CARD.x + CARD.w;
  const focusY = CARD.y + py(7000);
  const k = mix(1, 1.9, zoom);
  // the 2026 stretch is pushed into and brought to the middle of the frame
  // anchored on the card's right edge, so the card still fills the frame as it grows
  const tx = focusX - k * focusX;
  const ty = mix(focusY, 470, zoom) - k * focusY;

  return (
    <>
      {cardIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: cardIn * (1 - toEnd * 0.999), clipPath: OUTSIDE_RESERVES }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(4)})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h }}>
            <Card x={0} y={0} w={CARD.w} h={CARD.h}>
              <div style={{ position: "absolute", left: PLOT.x, top: 34, ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: c.ink, opacity: 1 - zoom }}>IHSG</div>
              <div style={{ opacity: 1 - zoom }}>
                <SourceTag kind="market" label="IHSG · 2006–2026 · Yahoo Finance" x={PLOT.x + PLOT.w} y={74} />
              </div>
              <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                {[2000, 4000, 6000, 8000].map((v) => (
                  <g key={v}>
                    <line x1={PLOT.x} y1={py(v)} x2={PLOT.x + PLOT.w} y2={py(v)} stroke={theme.color.skeleton} strokeWidth={1.5} />
                    <text x={PLOT.x - 14} y={py(v) + 8} textAnchor="end" fontFamily={theme.text.family} fontSize={22} fill={c.slate}>{fmt(v)}</text>
                  </g>
                ))}
                {YEARS.map((y) => (
                  <text key={y} x={px(`${y}-01-01`)} y={PLOT.y + PLOT.h + 40} textAnchor="middle" fontFamily={theme.text.family} fontSize={24} fill={c.slate}>{y}</text>
                ))}
                <path d={pathOf(0, n)} fill="none" stroke={c.ink} strokeWidth={3 / k} strokeLinejoin="round" strokeLinecap="round" />
                {back > 0.001
                  ? TROUGHS.filter((t) => t.back > 0).map((t) => {
                      const end = Math.round(mix(t.i, t.back, back));
                      return <path key={t.label} d={pathOf(t.i, end)} fill="none" stroke={c.indigo} strokeWidth={5 / k} strokeLinejoin="round" strokeLinecap="round" />;
                    })
                  : null}
                {TROUGHS.map((t) => {
                  const p = ease(f, W(t.at), m.pop);
                  if (p <= 0.001) return null;
                  const x = px(IHSG[t.i][0]);
                  const y = py(IHSG[t.i][1]);
                  return <circle key={t.label} cx={x} cy={y} r={(9 / k) * (0.6 + 0.4 * p)} fill={theme.color.crossRed} opacity={p} />;
                })}
                {halt > 0.001 ? <circle cx={px(IHSG[HALT][0])} cy={py(IHSG[HALT][1])} r={8 / k} fill={c.ink} opacity={halt} /> : null}
                {june > 0.001 ? <circle cx={px(IHSG[JUNE][0])} cy={py(IHSG[JUNE][1])} r={8 / k} fill={theme.color.crossRed} opacity={june} /> : null}
              </svg>
              {TROUGHS.map((t, i) => {
                const p = ease(f, W(t.at), m.pop) * (1 - zoom);
                if (p <= 0.001) return null;
                const x = px(IHSG[t.i][0]);
                const y = py(IHSG[t.i][1]);
                const up = i % 2 === 1 && i < 5;
                return (
                  <div key={t.label}>
                    <div style={{ position: "absolute", left: x, top: up ? y - 66 : y + 22, transform: "translateX(-50%)", opacity: p, padding: "6px 16px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.crossRed}`, ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: theme.color.crossRed, whiteSpace: "nowrap" }}>{t.label}</div>
                    {sellers > 0.001 ? (
                      <div style={{ position: "absolute", left: x + 26, top: y - 18, opacity: sellers * p }}>
                        <Glyph icon="user-circle" size={40} tone={theme.color.neutralIcon} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {halt > 0.001 ? (
                <div style={{ position: "absolute", left: px(IHSG[HALT][0]) - 10, top: py(IHSG[HALT][1]) - 10, transform: `translate(-100%, -100%) scale(${(1 / k).toFixed(4)})`, transformOrigin: "100% 100%", opacity: halt, padding: "10px 24px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Trading halt · 28 Jan</div>
              ) : null}
              {june > 0.001 ? (
                <div style={{ position: "absolute", left: px(IHSG[JUNE][0]) - 14, top: py(IHSG[JUNE][1]) + 6, transform: `translateX(-100%) scale(${(1 / k).toFixed(4)})`, transformOrigin: "100% 0", opacity: june, padding: "10px 24px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.crossRed}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: theme.color.crossRed, whiteSpace: "nowrap" }}>Juni · 5.342</div>
              ) : null}
            </Card>
          </div>
        </div>
        </div>
      ) : null}

      {lineSix > 0.001 ? <div style={{ opacity: lineSix }}><Line x={0} y={880} w={theme.canvas.width} text="Enam penurunan besar." size={48} align="center" weight={500} /></div> : null}
      {lineSell > 0.001 ? <div style={{ opacity: lineSell }}><Line x={0} y={880} w={theme.canvas.width} text="Setiap kali ada orang yang menjual di titik terendah." size={48} align="center" weight={500} /></div> : null}
      {closing > 0.001 ? <div style={{ opacity: closing, transform: `translateY(${((1 - closing) * 16).toFixed(1)}px)` }}><Line x={0} y={500} w={theme.canvas.width} text="Bear Market = Ujian + Kelas" size={88} align="center" weight={500} mark="Ujian + Kelas" /></div> : null}
    </>
  );
};
