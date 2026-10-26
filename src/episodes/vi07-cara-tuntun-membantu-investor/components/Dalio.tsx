/**
 * Dalio.tsx — Benchmark v2 pieces (Simon, 26 Oct 2026, from Ray Dalio's "How The Economic Machine Works" and "Principles
 * for Dealing with the Changing World Order": "coba terapkan yang ga melanggar aturan … grafik data dan foto arsip, itu
 * bisa ditiru style nya"). Light ground kept (dark grounds and crowds of people were dropped as clashing with our rules).
 *
 *  · DataChart — a real series as an editorial chart: serif title, hairline grid, the value axis on the right, a thick
 *    line drawn on with a pen-tip dot leading it, one event marked, the source in small type. REAL DATA ONLY.
 *  · NewsClipping — an archival newspaper cutting, taped on: newsprint, a serif headline, columns, a halftone picture.
 *    Its words come from the script; it names no real paper.
 *  · Lens — a magnifier that dives into something to show what it is made of.
 */
import React from "react";
import { loadFont } from "@remotion/google-fonts/LibreBaskerville";
import { theme, typeStyle, usePalette, useShadow } from "../../../core";
import type { Close } from "../data/ihsg";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["400", "700"] });
export { SERIF };

/** 9134.7 → "9.135" (Indonesian thousands). */
const idn = (v: number) => Math.round(v).toLocaleString("id-ID");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/**
 * A real closing series as an editorial chart, `w`×`h` at (x, y). `draw` 0..1 draws the line on from the left, a dot at
 * its tip. `event` marks one date (a dashed rule + a label + an optional pause flag for a trading halt).
 */
export const DataChart = ({
  x, y, w, h, title, series, lo, hi, ticks, draw, event, halt = false, eventP = 1, source = "^JKSE · harian · Yahoo Finance", ink,
}: {
  x: number; y: number; w: number; h: number; title: string; series: Close[]; lo: number; hi: number; ticks: number[];
  draw: number; event?: { d: string; label: string }; halt?: boolean; eventP?: number; source?: string; ink?: string;
}) => {
  const c = usePalette();
  const shadow = useShadow();
  const pad = { l: 36, r: 96, t: 86, b: 64 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const px = (i: number) => pad.l + (i / (series.length - 1)) * pw;
  const py = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * ph;
  const n = Math.max(1, Math.round(draw * (series.length - 1)));
  const shown = series.slice(0, n + 1);
  const pts = shown.map((s, i) => `${px(i).toFixed(1)},${py(s.c).toFixed(1)}`).join(" ");
  const tipI = shown.length - 1;
  const ei = event ? series.findIndex((s) => s.d === event.d) : -1;
  const monthStarts = series.map((s, i) => ({ s, i })).filter(({ s, i }) => i === 0 || s.d.slice(5, 7) !== series[i - 1].d.slice(5, 7));
  const line = ink ?? theme.color.alarmRed;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft }}>
      <div style={{ position: "absolute", left: pad.l, top: 26, fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: c.ink, letterSpacing: -0.3 }}>{title}</div>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* the grid: one rule per tick, the axis on the right */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} y1={py(t)} x2={pad.l + pw} y2={py(t)} stroke={theme.color.connectorMuteSolid} strokeWidth={1.2} />
            <text x={pad.l + pw + 14} y={py(t) + 7} fontFamily={theme.text.family} fontSize={20} fill={c.slate}>{idn(t)}</text>
          </g>
        ))}
        {monthStarts.map(({ s, i }) => (
          <g key={s.d}>
            <line x1={px(i)} y1={pad.t + ph} x2={px(i)} y2={pad.t + ph + 8} stroke={theme.color.connectorMuteSolid} strokeWidth={1.2} />
            <text x={px(i) + 6} y={pad.t + ph + 30} fontFamily={theme.text.family} fontSize={20} fill={c.slate}>{MONTHS[Number(s.d.slice(5, 7)) - 1]}</text>
          </g>
        ))}
        {/* the event: a dashed rule, its label, the halt flag */}
        {ei >= 0 && eventP > 0.001 ? (
          <g opacity={eventP}>
            <line x1={px(ei)} y1={pad.t - 8} x2={px(ei)} y2={pad.t + ph} stroke={c.ink} strokeWidth={1.5} strokeDasharray="4 6" />
          </g>
        ) : null}
        {/* the line, drawn on, a pen-tip dot leading it */}
        <polyline points={pts} fill="none" stroke={line} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        {draw > 0.01 && draw < 0.999 ? <circle cx={px(tipI)} cy={py(shown[tipI].c)} r={8} fill={c.cardBg} stroke={line} strokeWidth={3.5} /> : null}
        {draw >= 0.999 && ei >= 0 ? <circle cx={px(ei)} cy={py(series[ei].c)} r={8} fill={line} opacity={eventP} /> : null}
      </svg>
      {ei >= 0 && eventP > 0.001 ? (
        /* the label sits right of its rule, or left of it once the rule is past the middle (clear of the axis) */
        <div style={{ position: "absolute", left: px(ei) + (ei / series.length > 0.55 ? -10 : 10), top: pad.t - 14, transform: ei / series.length > 0.55 ? "translateX(-100%)" : undefined, display: "flex", alignItems: "center", gap: 8, opacity: eventP, fontFamily: theme.text.family, fontSize: 22, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>
          {event?.label}
          {halt ? <span style={{ fontWeight: 500, color: line }}>· Trading halt</span> : null}
        </div>
      ) : null}
      {/* the source, small, on the title's line (the months take the bottom edge) */}
      <div style={{ position: "absolute", right: 24, top: 38, fontFamily: theme.text.family, fontSize: 18, color: c.slate, whiteSpace: "nowrap" }}>{source}</div>
    </div>
  );
};

/** Halftone dots for a clipping's picture (deterministic), `w`×`h`. */
const Halftone = ({ w, h }: { w: number; h: number }) => {
  const dots: React.ReactNode[] = [];
  for (let gy = 0; gy < h; gy += 9) {
    for (let gx = 0; gx < w; gx += 9) {
      // a soft diagonal shape: darker toward the lower left, like a newsprint photo's shadow side
      const t = 0.5 + 0.5 * Math.sin(gx / 37 + gy / 23) * Math.cos(gy / 41);
      const r = 0.6 + 3.4 * t * (1 - gx / (w * 1.4));
      dots.push(<circle key={`${gx}-${gy}`} cx={gx + 4.5} cy={gy + 4.5} r={Math.max(0.4, r).toFixed(2)} />);
    }
  }
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <g fill={theme.color.newsHalftoneSolid}>{dots}</g>
    </svg>
  );
};

/**
 * An archival newspaper clipping, taped on: a dateline, a serif headline (the script's words), skeleton columns, and a
 * halftone picture. `w`×`h` at (x, y); `p` 0..1 brings it in.
 */
export const NewsClipping = ({ x, y, w, h, dateline, headline, p }: { x: number; y: number; w: number; h: number; dateline: string; headline: string; p: number }) => {
  const shadow = useShadow();
  if (p <= 0.001) return null;
  const col = (cx: number, top: number, n: number) =>
    Array.from({ length: n }, (_, k) => <div key={k} style={{ position: "absolute", left: cx, top: top + k * 14, width: k % 4 === 3 ? 70 : 110, height: 5, borderRadius: 2, background: theme.color.newsHalftoneSolid }} />);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - p) * 20, width: w, height: h, opacity: p, background: theme.color.newsPaper, boxShadow: shadow.soft, borderRadius: 6 }}>
      {/* tape */}
      <div style={{ position: "absolute", left: w / 2 - 50, top: -16, width: 100, height: 32, borderRadius: 4, background: theme.color.newsTape }} />
      <div style={{ position: "absolute", left: 22, top: 20, fontFamily: SERIF, fontSize: 16, letterSpacing: 2, color: theme.color.newsInk, textTransform: "uppercase" }}>{dateline}</div>
      <div style={{ position: "absolute", left: 22, top: 32, width: w - 44, height: 2, background: theme.color.newsInk }} />
      <div style={{ position: "absolute", left: 22, top: 46, width: w - 44, fontFamily: SERIF, fontSize: 30, fontWeight: 700, lineHeight: 1.15, color: theme.color.newsInk }}>{headline}</div>
      <div style={{ position: "absolute", left: 22, top: h - 128, width: 160, height: 106, overflow: "hidden", borderRadius: 2 }}>
        <Halftone w={160} h={106} />
      </div>
      {col(200, h - 126, 8)}
      {col(320, h - 126, 8)}
    </div>
  );
};

/**
 * A magnifier at (cx, cy), radius `r`: an ink ring, a handle, and inside it whatever `children` draws in the lens's own
 * box (2r × 2r) — what the thing under it is made of.
 */
export const Lens = ({ cx, cy, r, p = 1, children }: { cx: number; cy: number; r: number; p?: number; children?: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, opacity: p, transform: `scale(${(0.85 + 0.15 * p).toFixed(3)})` }}>
      <svg width={3.2 * r} height={3.2 * r} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={r + r * 0.72} y1={r + r * 0.72} x2={r + r * 1.45} y2={r + r * 1.45} stroke={theme.color.sketchInk} strokeWidth={r * 0.2} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, overflow: "hidden", background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${(r * 0.08).toFixed(1)}px ${theme.color.sketchInk}` }}>{children}</div>
    </div>
  );
};

/** A small serif caption. */
export const SerifLabel = ({ x, y, w, text, color }: { x: number; y: number; w: number; text: string; color?: string }) => {
  const c = usePalette();
  return <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: "center", ...typeStyle("body"), fontFamily: SERIF, fontSize: 30, color: color ?? c.ink }}>{text}</div>;
};
