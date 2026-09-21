/**
 * HookFrame — Hook group, Scenes 1–3 (comp 0–621), mounted once as one spanning
 * sequence. Kinetic typography carries the key phrases; quiet supporting motifs
 * fill the between-phrase gaps. Frame = comp frame (group starts at 0). All
 * onsets are named constants for easy nudging.
 *
 * Layers (back→front):
 *   • News grid — 6 real news-card captures (news-01..06.jpg) stagger in from 95
 *     (S1 "the headline / being first"), all fade out at 280.
 *   • MoveChart (S3 "a big price move") — candlestick breakout; the longest
 *     green bar (the breakout) is boxed. Candle bodies are the only red/green.
 *   • GapBand skeleton — the ↕ axis the opposition pair snaps onto.
 *   • Text beats 1–4 (on top).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import type { ReactNode, CSSProperties } from "react";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn, fadeOut, ease, clamp01, mulberry32, blinkTwice } from "../helpers";

const c = theme.colors;
const w = theme.font.weights;

// active content box (margins 96/54/96/108) — everything centres inside this
const ACTIVE = { left: 96, top: 54, width: 1728, height: 918 };
const MIDY = ACTIVE.top + ACTIVE.height / 2; // 513

// ── text onset constants (absolute comp frames) ─────────────────────────────
const B1_IN = 0; //  Beat 1 reveal
const B1_OUT = 70; //  Beat 1 fade
const B2_IN = 287; //  Beat 2 reveal
const B2_OUT = 323; //  Beat 2 fade
const B3_IN = 452; //  Beat 3 reveal
const B3_OUT = 505; //  Beat 3 fade
const B4_L_IN = 532; //  "Market expectation" (left)
const B4_R_IN = 586; //  "Actual outcome" (right)
const B4_CONN = 539; //  ⟷ connector draws (fast)
const B4_OUT = 628; //  whole Beat-4 scene fades out by here

// ── supporting-visual onsets ────────────────────────────────────────────────
const NEWS_IN = 95; //  first news card (S1 "see the headline first")
const NEWS_STAGGER = 12; //  per-card cascade
const NEWS_OUT = 280; //  all news cards fade
const MOVE_IN = 336; //  candlestick move chart draws (S3 "a big price move")
const MOVE_DRAW = 46; //  candles reveal L→R
const MOVE_HL = 398; //  highlight box on the longest green bar (the breakout)
const MOVE_OUT = 448; //  recedes as Beat 3 lands

// 6 real news cards (1080×502) laid out 3×2, centred in the active area
const NEWS_SRCS = ["news-01.jpg", "news-02.jpg", "news-03.jpg", "news-04.jpg", "news-05.jpg", "news-06.jpg"];
const NCW = 520;
const NCH = Math.round((NCW * 502) / 1080); // 242 — native aspect
const COL_X = [140, 700, 1260];
const ROW_Y = [251, 533];

const NewsGrid = ({ frame }: { frame: number }) => {
  const out = fadeOut(frame, NEWS_OUT, 14);
  if (frame < NEWS_IN || out <= 0) return null;
  return (
    <>
      {NEWS_SRCS.map((src, i) => {
        const onset = NEWS_IN + i * NEWS_STAGGER;
        const op = fadeIn(frame, onset, 16) * out;
        if (op <= 0) return null;
        const x = COL_X[i % 3];
        const y = ROW_Y[Math.floor(i / 3)];
        const ry = ease(frame, [onset, onset + 16], [16, 0]);
        return (
          <div key={src} style={{ position: "absolute", left: x, top: y, width: NCW, height: NCH, opacity: op, transform: `translateY(${ry}px)`, borderRadius: theme.radius.card, overflow: "hidden", background: c.white, border: `1px solid ${c.cardBorder}`, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <Img src={staticFile(`eventDriven/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
    </>
  );
};

// centred line block with textReveal-in + optional fade-out
const BigLine = ({ frame, inStart, outStart, children }: { frame: number; inStart: number; outStart?: number; children: ReactNode }) => {
  const rv = textReveal(frame, inStart, 18);
  const op = Math.min(rv.opacity, outStart != null ? fadeOut(frame, outStart, 14) : 1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: ACTIVE.left, top: ACTIVE.top, width: ACTIVE.width, height: ACTIVE.height, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: op, transform: rv.transform }}>
      <div style={{ maxWidth: ACTIVE.width - 48 }}>{children}</div>
    </div>
  );
};

// S3 motif — a candlestick move: flat consolidation → big green breakout → peak
// → red decline back to a dotted reference level. Candle bodies are the ONLY
// place green/red is used. The longest green bar (the breakout) gets a box.
const CHART = { x: 340, y: 250, w: 1240, h: 560 };
const MOVE_N = 54;

const level = (i: number) => {
  if (i < 18) return 101 + Math.sin(i * 0.7) * 2;
  if (i === 18) return 122; // breakout candle
  if (i < 25) return 122 + (i - 18) * 5.9; // surge → ~157
  if (i < 31) return 158 + Math.sin(i) * 2;
  if (i < 47) return 158 - (i - 31) * 2.7; // decline → ~115
  return 118 + Math.sin(i * 0.8) * 1.6; // settle
};

const CANDLES = (() => {
  const rnd = mulberry32(20260707);
  const out: Array<{ o: number; h: number; l: number; c: number }> = [];
  let prev = 101;
  for (let i = 0; i < MOVE_N; i++) {
    const o = prev;
    const cl = level(i) + (rnd() - 0.5) * (i >= 18 && i < 25 ? 4 : 3);
    const hi = Math.max(o, cl) + rnd() * 3 + 1;
    const lo = Math.min(o, cl) - rnd() * 3 - 1;
    out.push({ o, h: hi, l: lo, c: cl });
    prev = cl;
  }
  return out;
})();

const REF_LEVEL = (CANDLES.slice(47).reduce((s, d) => s + d.c, 0)) / CANDLES.slice(47).length;

// ── Highlight box over the breakout (the longest green bar) ──────────────────
// Fixed screen-space pixels (1920×1080). Just change these 4 numbers to move or
// resize the box. left/top = top-left corner; width/height = box size.
const HL_BOX = { left: 744, top: 280, width: 210, height: 520 };

const MoveChart = ({ frame }: { frame: number }) => {
  if (frame < MOVE_IN) return null;
  const op = fadeOut(frame, MOVE_OUT, 16);
  if (op <= 0) return null;

  const padL = 24;
  const padY = 14;
  const plotW = CHART.w - padL * 2;
  const plotH = CHART.h - padY * 2;
  let lo = Infinity;
  let hi = -Infinity;
  for (const d of CANDLES) {
    lo = Math.min(lo, d.l);
    hi = Math.max(hi, d.h);
  }
  const pad = (hi - lo) * 0.06;
  lo -= pad;
  hi += pad;
  const px = (i: number) => padL + (plotW * (i + 0.5)) / MOVE_N;
  const py = (v: number) => padY + plotH * (1 - (v - lo) / (hi - lo));
  const cw = (plotW / MOVE_N) * 0.62;

  const shown = clamp01((frame - MOVE_IN) / MOVE_DRAW) * MOVE_N;
  const hlOp = blinkTwice(frame, MOVE_HL, MOVE_OUT);

  return (
    <>
    <svg style={{ position: "absolute", left: CHART.x, top: CHART.y, opacity: op }} width={CHART.w} height={CHART.h} viewBox={`0 0 ${CHART.w} ${CHART.h}`}>
      {/* faint grid */}
      {[0.2, 0.4, 0.6, 0.8].map((g) => (
        <line key={`h${g}`} x1={0} x2={CHART.w} y1={padY + plotH * g} y2={padY + plotH * g} stroke={c.hairline} strokeWidth={1} />
      ))}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={`v${g}`} x1={padL + plotW * g} x2={padL + plotW * g} y1={0} y2={CHART.h} stroke={c.hairline} strokeWidth={1} />
      ))}

      {/* dotted reference level */}
      <line x1={padL} x2={CHART.w - padL} y1={py(REF_LEVEL)} y2={py(REF_LEVEL)} stroke={c.greyLight} strokeWidth={2} strokeDasharray="2 6" />

      {/* candles */}
      {CANDLES.map((d, i) => {
        if (i >= shown) return null;
        const up = d.c >= d.o;
        const fill = up ? c.candleGreen : c.candleRed;
        const top = py(Math.max(d.o, d.c));
        const bot = py(Math.min(d.o, d.c));
        return (
          <g key={i}>
            <line x1={px(i)} x2={px(i)} y1={py(d.h)} y2={py(d.l)} stroke={fill} strokeWidth={1.5} />
            <rect x={px(i) - cw / 2} y={top} width={cw} height={Math.max(2, bot - top)} fill={fill} />
          </g>
        );
      })}

    </svg>

    {/* highlight box on the longest green bar (the breakout) — fixed px, see HL_BOX */}
    {hlOp > 0 && (
      <div style={{ position: "absolute", left: HL_BOX.left, top: HL_BOX.top, width: HL_BOX.width, height: HL_BOX.height, border: `3px solid ${c.indigo}`, borderRadius: 8, background: c.indigoWash, boxSizing: "border-box", opacity: hlOp * op }} />
    )}
    </>
  );
};

const focal: CSSProperties = { fontWeight: w.extrabold, color: c.text, lineHeight: 1.02, letterSpacing: -1 };

export const HookFrame = () => {
  const f = useCurrentFrame();

  // ── Beat 4 opposition pair (side-by-side: expectation vs outcome) ──────────
  const b4Out = fadeOut(f, B4_OUT - 14, 14); // whole scene fades 614→628
  const leftOp = fadeIn(f, B4_L_IN, 16) * b4Out;
  const leftX = ease(f, [B4_L_IN, B4_L_IN + 16], [-44, 0]);
  const rightOp = fadeIn(f, B4_R_IN, 16) * b4Out;
  const rightX = ease(f, [B4_R_IN, B4_R_IN + 16], [44, 0]);
  const conn = clamp01((f - B4_CONN) / 8); // fast draw

  return (
    <SafeArea>
      {/* ── supporting visuals (behind text) ── */}
      <NewsGrid frame={f} />
      <MoveChart frame={f} />

      {/* ── BEAT 1 — 0–85 · two focal lines, centred vertically ── */}
      <BigLine frame={f} inStart={B1_IN} outStart={B1_OUT}>
        <div style={{ ...focal, fontSize: 100, lineHeight: 1.0 }}>most people get wrong</div>
        <div style={{ ...focal, fontSize: 100, lineHeight: 1.0, marginTop: 20 }}>
          about <span style={{ color: c.indigo }}>news</span> and <span style={{ color: c.indigo }}>markets</span>
        </div>
      </BigLine>

      {/* ── BEAT 2 — 287–323 · "Speed" (indigo), "isn't the edge" holds ── */}
      <BigLine frame={f} inStart={B2_IN} outStart={B2_OUT}>
        <div style={{ ...focal, fontSize: 100, color: c.indigo }}>Speed</div>
        <div style={{ ...focal, fontSize: 100 }}>isn&rsquo;t the edge</div>
      </BigLine>

      {/* ── BEAT 3 — 452–~510 · focal word "gap" (indigo, largest) ── */}
      <BigLine frame={f} inStart={B3_IN} outStart={B3_OUT}>
        <div style={{ fontWeight: w.semibold, color: c.text, fontSize: 76, lineHeight: 1.1 }}>They come from a</div>
        <div style={{ fontWeight: w.extrabold, color: c.indigo, fontSize: 210, lineHeight: 1.0, letterSpacing: -2 }}>gap</div>
      </BigLine>

      {/* ── BEAT 4 — opposition pair, side-by-side word-stacked, fades by 628 ── */}
      {f >= B4_L_IN && b4Out > 0 && (
        <>
          <div style={{ position: "absolute", left: 96, top: MIDY, width: 764, textAlign: "right", transform: `translate(${leftX}px, -50%)`, opacity: leftOp, fontSize: 84, fontWeight: w.bold, color: c.cyan, lineHeight: 1.02 }}>
            Market<br />expectation
          </div>
          <div style={{ position: "absolute", left: 1060, top: MIDY, width: 764, textAlign: "left", transform: `translate(${rightX}px, -50%)`, opacity: rightOp, fontSize: 84, fontWeight: w.bold, color: c.indigo, lineHeight: 1.02 }}>
            Actual<br />outcome
          </div>

          {f >= B4_CONN && (
            <svg width={180} height={50} style={{ position: "absolute", left: 870, top: MIDY - 25, opacity: b4Out }} viewBox="0 0 180 50">
              <line x1={16} y1={25} x2={164} y2={25} stroke={c.indigo} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - conn} strokeLinecap="round" />
              <g opacity={conn} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 25 L30 15 M16 25 L30 35" />
                <path d="M164 25 L150 15 M164 25 L150 35" />
              </g>
            </svg>
          )}
        </>
      )}
    </SafeArea>
  );
};
