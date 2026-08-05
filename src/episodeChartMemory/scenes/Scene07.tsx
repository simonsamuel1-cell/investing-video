/**
 * SC07 — Noise vs Direction (from 3150, dur 600) — INDEPENDENT.
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
import { progress, type Box } from "../helpers";
import { bmri5m, bmriWeekly } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GAP = 24;
const CARD_W = (1728 - GAP) / 2;
const LEFT: Box = { x: 96, y: 250, w: CARD_W, h: 490 };
const RIGHT: Box = { x: 96 + CARD_W + GAP, y: 250, w: CARD_W, h: 490 };
// Header chips sit clear of the top-150px logo band (the right chip runs past
// x = 1368, so it must not be inside that band).
const HEADER_Y = 200;
const T = { p1: 90, p2: 135, p3: 180, arrow: 240, captions: 360, pulse: 540 };
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
  const pulseL = f >= T.pulse && f < T.pulse + 26 ? Math.sin(((f - T.pulse) / 26) * Math.PI) : 0;
  const pulseR = f >= T.pulse + 12 && f < T.pulse + 38 ? Math.sin(((f - T.pulse - 12) / 26) * Math.PI) : 0;

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
      {[LEFT, RIGHT].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.w,
            height: c.h,
            borderRadius: theme.radius.cardLg,
            background: theme.colors.cardBg,
            border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
          }}
        />
      ))}

      <CandlestickChart data={bmri5m} window={W5} box={li} />
      <CandlestickChart data={bmriWeekly} window={WW} box={ri} />

      {/* header chips — kept below the 150px logo band */}
      <div style={{ transform: `scale(${1 + 0.04 * pulseL})`, transformOrigin: `${LEFT.x + 20}px ${HEADER_Y}px` }}>
        <Chip label="5 Menit — Noise" x={LEFT.x + 20} y={HEADER_Y} variant="slate" anchor="left" startFrame={0} />
      </div>
      <div style={{ transform: `scale(${1 + 0.04 * pulseR})`, transformOrigin: `${RIGHT.x + 20}px ${HEADER_Y}px` }}>
        <Chip label="Mingguan — Arah Besar" x={RIGHT.x + 20} y={HEADER_Y} variant="indigo" anchor="left" startFrame={0} />
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

      {/* the question each timeframe answers */}
      <Chip label="Kapan bertindak" x={LEFT.x + LEFT.w / 2} y={LEFT.y + LEFT.h + 52} variant="slate" anchor="center" startFrame={T.captions} />
      <Chip label="Arah besar" x={RIGHT.x + RIGHT.w / 2} y={RIGHT.y + RIGHT.h + 52} variant="indigo" anchor="center" startFrame={T.captions + 12} />
    </SafeArea>
  );
};
