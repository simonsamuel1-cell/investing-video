/**
 * SC07 — Noise vs Direction (from 3720, dur 752) — INDEPENDENT.
 * Two cards, same stock: 5-minute noise on the left, weekly direction on the
 * right. Slate pings tick real reversals; one indigo trim-path arrow traces the
 * broad trend on the right. Descriptive only — no entry/exit markers.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, type Box } from "../helpers";
import { bmri5m, bmriWeekly } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GAP = 24;
const CARD_W = (1728 - GAP) / 2;
const LEFT: Box = { x: 96, y: 250, w: CARD_W, h: 490 };
const RIGHT: Box = { x: 96 + CARD_W + GAP, y: 250, w: CARD_W, h: 490 };
// Header chips sit clear of the top-150px logo band (the right chip runs past
// x = 1368, so it must not be inside that band).
const HEADER_Y = 200;
const T = {
  p1: 105, // "setiap reaksi kecil"
  p2: 140, // "keraguan"
  p3: 173, // "sesaat, dan kepanikan pasar"
  rightIn: 241, // "Semakin panjang timeframe"
  arrow: 278, // "arah besarnya semakin jelas"
  capLeft: 354, // "kapan harus bertindak"
  capRight: 548, // "arah besar tempat keputusan itu diambil"
  pulse: 631, // "Keduanya berguna"
  rule: 667, // "tetapi menjawab"
  // "pertanyaan yang berbeda" — the two captions become the questions
  // themselves. Global 4418; this scene ends at 4471, so this is as late as the
  // swap can land and still be readable.
  questions: 698,
  swapDur: 8, // old label clears before the new one arrives — they never overlap
};
// ═══════════════════════════════════════════════════════════════════════════

// Right-hand inset leaves room for the price axis labels INSIDE the card, so the
// right card's labels never run up against the safe-right margin.
const inner = (c: Box): Box => ({ x: c.x + 44, y: c.y + 56, w: c.w - 170, h: c.h - 110 });

const W5 = [0, bmri5m.length - 1] as [number, number];
const WW = [bmriWeekly.length - 30, bmriWeekly.length - 1] as [number, number];

/** Sharp intraday reversals — real local extrema, not decoration. */
const reversals = () => {
  const out: number[] = [];
  for (let i = 4; i < bmri5m.length - 4; i++) {
    const d = bmri5m[i];
    const isLow = d.l < bmri5m[i - 3].l && d.l < bmri5m[i + 3].l;
    const isHigh = d.h > bmri5m[i - 3].h && d.h > bmri5m[i + 3].h;
    if (isLow || isHigh) out.push(i);
  }
  // spread them across the session so the three pings never cluster
  const picks = [out[Math.floor(out.length * 0.18)], out[Math.floor(out.length * 0.5)], out[Math.floor(out.length * 0.82)]];
  return picks.filter((v) => v !== undefined);
};
const REV = reversals();

export const Scene07 = () => {
  const f = useCurrentFrame();
  const li = inner(LEFT);
  const ri = inner(RIGHT);
  const gL = chartGeom(bmri5m, W5, li);
  const gR = chartGeom(bmriWeekly, WW, ri);

  const arrow = f >= T.arrow ? progress(f, T.arrow, 56) : 0;
  const rightIn = f >= T.rightIn ? progress(f, T.rightIn, 34) : 0;
  // the noisy side steps back while the trend side is introduced, then returns
  const leftDim = 1 - 0.35 * rightIn * (1 - (f >= T.capLeft ? progress(f, T.capLeft, 26) : 0));
  const ruleP = f >= T.rule ? progress(f, T.rule, 30) : 0;
  const swapOut = f >= T.questions ? fadeOut(f, T.questions, T.swapDur) : 1;
  const pulseL = f >= T.pulse && f < T.pulse + 26 ? Math.sin(((f - T.pulse) / 26) * Math.PI) : 0;
  const pulseR = pulseL;

  // broad trend on the weekly card: first swing low → last swing high
  const a = WW[0];
  const b = WW[1];
  let lo = a;
  let hi = b;
  for (let i = a; i <= a + 8; i++) if (bmriWeekly[i].l < bmriWeekly[lo].l) lo = i;
  for (let i = b - 8; i <= b; i++) if (bmriWeekly[i].h > bmriWeekly[hi].h) hi = i;
  const ax1 = gR.cx(lo);
  const ay1 = gR.scale(bmriWeekly[lo].l);
  const ax2 = gR.cx(hi);
  const ay2 = gR.scale(bmriWeekly[hi].h);
  const alen = Math.hypot(ax2 - ax1, ay2 - ay1);
  const ang = Math.atan2(ay2 - ay1, ax2 - ax1);
  const hx = ax1 + (ax2 - ax1) * arrow;
  const hy = ay1 + (ay2 - ay1) * arrow;

  return (
    <SafeArea>
      {/* the noisy side leads, then steps back while the trend side arrives */}
      <div style={{ opacity: leftDim }}>
        <div
          style={{
            position: "absolute",
            left: LEFT.x,
            top: LEFT.y,
            width: LEFT.w,
            height: LEFT.h,
            borderRadius: theme.radius.cardLg,
            background: theme.colors.cardBg,
            border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
          }}
        />
        <CandlestickChart data={bmri5m} window={W5} box={li} />
      </div>

      {rightIn > 0.001 && (
        <div style={{ opacity: rightIn, transform: `translateX(${(1 - rightIn) * 60}px)` }}>
          <div
            style={{
              position: "absolute",
              left: RIGHT.x,
              top: RIGHT.y,
              width: RIGHT.w,
              height: RIGHT.h,
              borderRadius: theme.radius.cardLg,
              background: theme.colors.cardBg,
              border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
            }}
          />
          <CandlestickChart data={bmriWeekly} window={WW} box={ri} />
        </div>
      )}

      {/* the 1px divider that sets the two questions apart */}
      {ruleP > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={LEFT.x + LEFT.w + GAP / 2}
            y1={LEFT.y}
            x2={LEFT.x + LEFT.w + GAP / 2}
            y2={LEFT.y + LEFT.h * ruleP}
            stroke={theme.colors.muted}
            strokeWidth={theme.stroke.hair}
          />
        </svg>
      )}

      {/* header chips — kept below the 150px logo band */}
      <div style={{ transform: `scale(${1 + 0.04 * pulseL})`, transformOrigin: `${LEFT.x + 20}px ${HEADER_Y}px` }}>
        <Chip label="5 Menit — Noise" x={LEFT.x + 20} y={HEADER_Y} variant="slate" anchor="left" startFrame={0} />
      </div>
      <div style={{ transform: `scale(${1 + 0.04 * pulseR})`, transformOrigin: `${RIGHT.x + 20}px ${HEADER_Y}px` }}>
        <Chip label="Mingguan — Arah Besar" x={RIGHT.x + 20} y={HEADER_Y} variant="indigo" anchor="left" startFrame={T.rightIn} />
      </div>
      {/* three real reversals on the noisy side */}
      {REV.map((idx, i) => (
        <Ping key={idx} x={gL.cx(idx)} y={gL.scale(bmri5m[idx].c)} startFrame={[T.p1, T.p2, T.p3][i]} variant="slate" />
      ))}

      {/* one trim-path arrow along the weekly trend */}
      {arrow > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={ax1}
            y1={ay1}
            x2={ax2}
            y2={ay2}
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.rule}
            strokeDasharray={alen}
            strokeDashoffset={alen * (1 - arrow)}
          />
          <polygon
            points={`${hx},${hy} ${hx - 16 * Math.cos(ang - 0.4)},${hy - 16 * Math.sin(ang - 0.4)} ${hx - 16 * Math.cos(ang + 0.4)},${hy - 16 * Math.sin(ang + 0.4)}`}
            fill={theme.colors.indigo}
            opacity={arrow}
          />
        </svg>
      )}

      {/* One caption per card. On the "pertanyaan yang berbeda" beat each one
          is replaced, in place, by the question it stands for. */}
      {f < T.questions + T.swapDur && (
        <>
          <Chip
            label="Kapan bertindak"
            x={LEFT.x + LEFT.w / 2}
            y={LEFT.y + LEFT.h + 52}
            variant="slate"
            anchor="center"
            startFrame={T.capLeft}
            opacity={swapOut}
          />
          <Chip
            label="Arah besar"
            x={RIGHT.x + RIGHT.w / 2}
            y={RIGHT.y + RIGHT.h + 52}
            variant="indigo"
            anchor="center"
            startFrame={T.capRight}
            opacity={swapOut}
          />
        </>
      )}
      <Chip label="Kapan?" x={LEFT.x + LEFT.w / 2} y={LEFT.y + LEFT.h + 52} variant="slate" anchor="center" startFrame={T.questions + T.swapDur} />
      <Chip
        label="Kemana?"
        x={RIGHT.x + RIGHT.w / 2}
        y={RIGHT.y + RIGHT.h + 52}
        variant="indigo"
        anchor="center"
        startFrame={T.questions + T.swapDur}
      />
    </SafeArea>
  );
};
