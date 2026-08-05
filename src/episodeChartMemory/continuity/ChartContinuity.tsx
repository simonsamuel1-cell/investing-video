/**
 * ChartContinuity — the ONE spanning chart element for SC02 → SC05
 * (global frames 390–2490, continuity-local 0–2100). The chart NEVER remounts:
 * a single geometry + mode timeline drives it through four phases, and each
 * phase's overlays live in scenes/Scene02–Scene05 which receive that geometry.
 *
 *   Phase A (local 0–510)     SC02  price cards → chili line chart
 *   Phase B (local 510–1050)  SC03  chili line morphs into the BMRI closes line
 *   Phase C (local 1050–1710) SC04  line mask-wipes into candlesticks + anatomy
 *   Phase D (local 1710–2100) SC05  candles de-emphasize; axes + crosshair
 */
import { useCurrentFrame, interpolate, Sequence } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { LineChart } from "../components/LineChart";
import { theme } from "../theme";
import { progress, fmtPrice, type Box } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";
import { chiliMonthly } from "../data/chili";
import { Scene02 } from "../scenes/Scene02";
import { Scene03 } from "../scenes/Scene03";
import { Scene04 } from "../scenes/Scene04";
import { Scene05 } from "../scenes/Scene05";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const PHASE = { a: 0, b: 510, c: 1050, d: 1710, end: 2100 };
const BOX_FULL: Box = { x: 260, y: 250, w: 1400, h: 540 };
const BOX_NARROW_W = 900; // while the SC04 anatomy card occupies the right third
const K = {
  lineDraw: 300, // chili line trim-path (SC02 f300)
  morph: 510, // chili → BMRI (SC03 phase start)
  morphDur: 90,
  narrow: 1350, // chart narrows for the anatomy card
  wipe: 1305, // line → candles (SC04 f255)
  wipeDur: 60,
  widen: 1710, // anatomy card leaves; chart returns to full width
  dimCandles: 1710, // SC05 f0
};
// ═══════════════════════════════════════════════════════════════════════════

const WINDOW = WIN.sc03;

export type ContGeom = {
  box: Box;
  win: [number, number];
  cx: (globalIdx: number) => number;
  scale: (price: number) => number;
  xs: number[];
  bmriY: number[];
  chiliY: number[];
  chiliScaleY: (price: number) => number;
};

/** Chili price at normalized position t (0–1) across the monthly series. */
const chiliAt = (t: number) => {
  const x = t * (chiliMonthly.length - 1);
  const i = Math.min(chiliMonthly.length - 2, Math.floor(x));
  const q = x - i;
  return chiliMonthly[i].price + (chiliMonthly[i + 1].price - chiliMonthly[i].price) * q;
};

export const ChartContinuity = () => {
  const f = useCurrentFrame();

  // ── geometry (recomputed each frame; the ELEMENT never remounts) ──
  const narrow = f >= K.narrow ? progress(f, K.narrow, 60) : 0;
  const widen = f >= K.widen ? progress(f, K.widen, 60) : 0;
  const boxW = interpolate(narrow - widen, [0, 1], [BOX_FULL.w, BOX_NARROW_W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const box: Box = { ...BOX_FULL, w: boxW };

  const g = chartGeom(bmriDaily, WINDOW, box);
  const [a, b] = WINDOW;
  const n = b - a + 1;

  const xs: number[] = [];
  const bmriY: number[] = [];
  for (let k = 0; k < n; k++) {
    xs.push(g.cx(a + k));
    bmriY.push(g.scale(bmriDaily[a + k].c));
  }
  // chili silhouette resampled onto the same x positions
  const chiliLo = Math.min(...chiliMonthly.map((c) => c.price));
  const chiliHi = Math.max(...chiliMonthly.map((c) => c.price));
  const chiliScaleY = (p: number) =>
    interpolate(p, [chiliLo - (chiliHi - chiliLo) * 0.12, chiliHi + (chiliHi - chiliLo) * 0.12], [box.y + box.h, box.y], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const chiliY: number[] = [];
  for (let k = 0; k < n; k++) chiliY.push(chiliScaleY(chiliAt(k / (n - 1))));

  const geom: ContGeom = { box, win: WINDOW, cx: g.cx, scale: g.scale, xs, bmriY, chiliY, chiliScaleY };

  // ── chart mode timeline ──
  const morphT = f >= K.morph ? progress(f, K.morph, K.morphDur) : 0;
  const lineDraw = f >= K.lineDraw ? progress(f, K.lineDraw, 46) : 0;
  const wipe = f >= K.wipe ? progress(f, K.wipe, K.wipeDur) : 0;
  const candleDim = f >= K.dimCandles ? interpolate(progress(f, K.dimCandles, 45), [0, 1], [1, 0.3]) : 1;

  const linePts = xs.map((x, k) => ({ x, y: chiliY[k] + (bmriY[k] - chiliY[k]) * morphT }));
  // SC04 dims the line one step before the wipe begins
  const lineDim = f >= 1260 && f < K.wipe ? interpolate(progress(f, 1260, 20), [0, 1], [1, 0.55]) : f >= K.wipe ? 0.55 : 1;
  const wipeX = box.x + box.w * wipe;

  // ── axis furniture: months (chili) crossfading into dates + prices (BMRI) ──
  const axisDraw = f >= 240 ? progress(f, 240, 50) : 0;
  const chiliAxisOp = f < K.morph ? 1 : 1 - progress(f, K.morph, 60);
  const bmriAxisOp = f >= K.morph ? progress(f, K.morph, 60) : 0;
  const tickPrices = Array.from({ length: 4 }, (_, i) => g.min + ((g.max - g.min) * (i + 0.5)) / 4);
  const dateIdx = [a, a + Math.floor(n * 0.33), a + Math.floor(n * 0.66), b];

  return (
    <SafeArea>
      {/* ── axis furniture ── */}
      {axisDraw > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={box.x}
            y1={box.y + box.h}
            x2={box.x + box.w * axisDraw}
            y2={box.y + box.h}
            stroke={theme.colors.border}
            strokeWidth={theme.stroke.rule}
          />
          {bmriAxisOp > 0.001 &&
            tickPrices.map((p) => (
              <g key={p} opacity={bmriAxisOp}>
                <line x1={box.x} y1={g.scale(p)} x2={box.x + box.w} y2={g.scale(p)} stroke={theme.colors.border} strokeWidth={theme.stroke.hair} />
                <text
                  x={box.x + box.w + 16}
                  y={g.scale(p) + 8}
                  fontFamily={theme.type.family}
                  fontSize={theme.type.axis.size}
                  fontWeight={theme.type.axis.weight}
                  fill={theme.colors.slate}
                >
                  {fmtPrice(p)}
                </text>
              </g>
            ))}
        </svg>
      )}
      {/* month ticks (chili) */}
      {chiliAxisOp > 0.001 &&
        chiliMonthly.map((c, i) => (
          <div
            key={c.month}
            style={{
              position: "absolute",
              left: box.x + (box.w * i) / (chiliMonthly.length - 1),
              top: box.y + box.h + 18,
              transform: "translateX(-50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: theme.colors.slate,
              opacity: chiliAxisOp * axisDraw,
            }}
          >
            {c.month}
          </div>
        ))}
      {/* date ticks (BMRI) */}
      {bmriAxisOp > 0.001 &&
        dateIdx.map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.cx(i),
              top: box.y + box.h + 18,
              transform: "translateX(-50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              color: theme.colors.slate,
              opacity: bmriAxisOp,
              whiteSpace: "nowrap",
            }}
          >
            {bmriDaily[i].date.slice(5).replace("-", "/")}
          </div>
        ))}

      {/* ── THE chart element — one line/candle surface across all four phases ── */}
      {lineDraw > 0.001 && wipe < 1 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0px 0px 0px ${Math.max(0, wipeX)}px)` }}>
          <LineChart points={linePts} progress={lineDraw} color={theme.colors.indigo} opacity={lineDim} />
        </div>
      )}
      {wipe > 0.001 && (
        <CandlestickChart data={bmriDaily} window={WINDOW} box={box} showAxes={false} revealProgress={wipe} dimOpacity={candleDim} />
      )}

      {/* ── per-phase overlays ──
          Each phase is wrapped in its own Sequence purely so its children read
          SCENE-LOCAL frames. The chart element above stays outside them, so it
          still never remounts across the four phases. */}
      <Sequence from={PHASE.a} durationInFrames={PHASE.b - PHASE.a} layout="none">
        <Scene02 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.b} durationInFrames={PHASE.c - PHASE.b} layout="none">
        <Scene03 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.c} durationInFrames={PHASE.d - PHASE.c} layout="none">
        <Scene04 geom={geom} />
      </Sequence>
      <Sequence from={PHASE.d} durationInFrames={PHASE.end - PHASE.d} layout="none">
        <Scene05 geom={geom} />
      </Sequence>
    </SafeArea>
  );
};
