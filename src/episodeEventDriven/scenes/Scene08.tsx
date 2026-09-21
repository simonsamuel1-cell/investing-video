/**
 * Scene 8 — Bridge (comp 1872–2063), INDEPENDENT scene (own SafeArea). Reuses
 * the candlestick price-move chart (same deterministic series as the Hook's
 * frame-410 chart) drawing in, then the line "Let me show you in 3 steps".
 * All visuals end at 2063. Frame = scene-local (0 at comp 1872).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { SafeArea, Illustration } from "../components";
import { fadeIn, fadeOut, clamp01, textReveal, mulberry32 } from "../helpers";

const c = theme.colors;
const w = theme.font.weights;
const F = theme.font.family;

// ── onsets (scene-local; comp = 1872 + local) ───────────────────────────────
const CHART_IN = 0; //   1872 — chart draws in
const CHART_DRAW = 44;
const TEXT_IN = 125; //  1997 — "Let me show you in 3 steps"
const END = 191; //      2063 — all visuals end

// candlestick series — identical to the Hook chart (same seed + shape)
const CHART = { x: 360, y: 176, w: 1200, h: 470 };
const MOVE_N = 54;
const level = (i: number) => {
  if (i < 18) return 101 + Math.sin(i * 0.7) * 2;
  if (i === 18) return 122;
  if (i < 25) return 122 + (i - 18) * 5.9;
  if (i < 31) return 158 + Math.sin(i) * 2;
  if (i < 47) return 158 - (i - 31) * 2.7;
  return 118 + Math.sin(i * 0.8) * 1.6;
};
const CANDLES = (() => {
  const rnd = mulberry32(20260707);
  const out: Array<{ o: number; h: number; l: number; c: number }> = [];
  let prev = 101;
  for (let i = 0; i < MOVE_N; i++) {
    const o = prev;
    const cl = level(i) + (rnd() - 0.5) * (i >= 18 && i < 25 ? 4 : 3);
    out.push({ o, h: Math.max(o, cl) + rnd() * 3 + 1, l: Math.min(o, cl) - rnd() * 3 - 1, c: cl });
    prev = cl;
  }
  return out;
})();
const REF_LEVEL = CANDLES.slice(47).reduce((s, d) => s + d.c, 0) / CANDLES.slice(47).length;

export const Scene08 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, END - 14, 14);

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
  const shown = clamp01((f - CHART_IN) / CHART_DRAW) * MOVE_N;

  const text = textReveal(f, TEXT_IN, 18);

  return (
    <SafeArea>
      <svg style={{ position: "absolute", left: CHART.x, top: CHART.y, opacity: out }} width={CHART.w} height={CHART.h} viewBox={`0 0 ${CHART.w} ${CHART.h}`}>
        {[0.2, 0.4, 0.6, 0.8].map((g) => (
          <line key={`h${g}`} x1={0} x2={CHART.w} y1={padY + plotH * g} y2={padY + plotH * g} stroke={c.hairline} strokeWidth={1} />
        ))}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={`v${g}`} x1={padL + plotW * g} x2={padL + plotW * g} y1={0} y2={CHART.h} stroke={c.hairline} strokeWidth={1} />
        ))}
        <line x1={padL} x2={CHART.w - padL} y1={py(REF_LEVEL)} y2={py(REF_LEVEL)} stroke={c.greyLight} strokeWidth={2} strokeDasharray="2 6" />
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

      <Illustration op={fadeIn(f, CHART_IN, 16) * out} />

      {f >= TEXT_IN && (
        <div style={{ position: "absolute", left: 96, top: 730, width: 1728, textAlign: "center", fontSize: 68, fontWeight: w.extrabold, color: c.text, fontFamily: F, opacity: Math.min(text.opacity, out), transform: text.transform }}>
          Let me show you in <span style={{ color: c.indigo }}>3 steps</span>
        </div>
      )}
    </SafeArea>
  );
};
