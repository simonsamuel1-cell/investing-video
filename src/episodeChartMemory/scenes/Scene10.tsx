/**
 * SC10 — Zoom Out: The Market's Memory (from 5946, dur 664) — INDEPENDENT.
 * Opens tight on ~20 candles with five emotion chips pinned to distinct
 * sessions, then pulls back continuously to the full series until the chart
 * reads as texture and the closing line resolves.
 * TODO [NEEDS DATA: longest available BMRI daily history for the wide end-frame]
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, priceScale, textReveal, type Box } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const CHART: Box = { x: 200, y: 230, w: 1520, h: 600 };
const T = {
  ticks: 74, // "mengambil keputusan nyata" — each candle ticks once
  fear: 142,
  conviction: 170,
  patience: 195,
  euphoria: 222,
  panic: 250,
  pulse: 278, // "semuanya terekam di sana"
  release: 328, // "Chart bukanlah saham itu sendiri"
  zoom: 408, // "Chart adalah ingatan pasar"
  caption: 548, // "Belajarlah membaca ingatan itu"
};
const ZOOM_DUR = 140; // 408 → 548, then the frame holds
const CHIP_MIN_Y = 180; // chip top stays clear of the 150px logo band
const CHIP_MAX_Y = 840; // chip bottom stays clear of the 108px subtitle band
// ═══════════════════════════════════════════════════════════════════════════

const TIGHT = WIN.sc10Tight;
const WIDE = WIN.sc10Wide;

/** Five distinct sessions in the tight window, spread so no two chips stack. */
const EMOTIONS = [
  { label: "Takut", at: T.fear, k: 2, above: false },
  { label: "Keyakinan", at: T.conviction, k: 6, above: true },
  { label: "Kesabaran", at: T.patience, k: 10, above: false },
  { label: "Euforia", at: T.euphoria, k: 14, above: true },
  { label: "Kepanikan", at: T.panic, k: 18, above: false },
];

export const Scene10 = () => {
  const f = useCurrentFrame();

  const zoom = f >= T.zoom ? progress(f, T.zoom, ZOOM_DUR) : 0;
  const win: [number, number] = [interpolate(zoom, [0, 1], [TIGHT[0], WIDE[0]]), TIGHT[1]];
  const g = chartGeom(bmriDaily, win, CHART);

  // Blend the price range toward the full-series range so the pull-back never
  // snaps when a new extreme enters the frame.
  const tightSlice = bmriDaily.slice(TIGHT[0], TIGHT[1] + 1);
  const wideSlice = bmriDaily.slice(WIDE[0], WIDE[1] + 1);
  const min = interpolate(zoom, [0, 1], [Math.min(...tightSlice.map((d) => d.l)), Math.min(...wideSlice.map((d) => d.l))]);
  const max = interpolate(zoom, [0, 1], [Math.max(...tightSlice.map((d) => d.h)), Math.max(...wideSlice.map((d) => d.h))]);
  const scale = priceScale(min, max, CHART.y, CHART.y + CHART.h, 0.08);

  const chipsOp = f >= T.release ? 1 - progress(f, T.release, 34) : 1;
  const drift = f >= T.release ? progress(f, T.release, 34) * 22 : 0;
  const chipPulse = f >= T.pulse && f < T.pulse + 30 ? Math.sin(((f - T.pulse) / 30) * Math.PI) : 0;
  const tickIn = f >= T.ticks ? progress(f, T.ticks, 60) : 0;
  const cap = textReveal(f, T.caption, 20);

  return (
    <SafeArea>
      <CandlestickChart
        data={bmriDaily}
        window={win}
        box={CHART}
        showAxes={zoom < 0.5}
        scaleOverride={scale}
        dimOpacity={interpolate(zoom, [0, 1], [1, 0.55])}
      />

      {/* each visible candle ticks once — one decision at a time */}
      {tickIn > 0.001 && chipsOp > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {Array.from({ length: TIGHT[1] - TIGHT[0] + 1 }, (_, k) => {
            const i = TIGHT[0] + k;
            const q = Math.max(0, Math.min(1, tickIn * (TIGHT[1] - TIGHT[0] + 1) - k));
            if (q <= 0) return null;
            return <circle key={i} cx={g.cx(i)} cy={scale(bmriDaily[i].c)} r={3.4} fill={theme.colors.indigo} opacity={0.5 * q * chipsOp} />;
          })}
        </svg>
      )}

      {chipsOp > 0.001 &&
        EMOTIONS.map((e) => {
          const idx = TIGHT[0] + e.k;
          const d = bmriDaily[idx];
          const anchorY = e.above ? scale(d.h) : scale(d.l);
          // Clamped so a chip on an extreme candle can never reach the top-150
          // logo band or the bottom-108 subtitle band.
          const chipY = e.above ? Math.max(CHIP_MIN_Y, anchorY - 72) : Math.min(CHIP_MAX_Y, anchorY + 72);
          return (
            <div
              key={e.label}
              style={{
                opacity: chipsOp,
                transform: `translateY(${e.above ? -drift : drift}px) scale(${1 + 0.05 * chipPulse})`,
                transformOrigin: `${g.cx(idx)}px ${chipY}px`,
              }}
            >
              <Chip
                label={e.label}
                x={g.cx(idx)}
                y={chipY}
                variant="slate"
                anchor="center"
                startFrame={e.at}
                connectorTo={{ x: g.cx(idx), y: anchorY + (e.above ? -10 : 10) }}
              />
            </div>
          );
        })}

      <div
        style={{
          position: "absolute",
          left: 0,
          // lifted to the top of the frame, just under the safe margin
          top: theme.layout.safeTop + 20,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.indigo,
          opacity: cap.opacity,
          transform: `translateY(${cap.y}px)`,
        }}
      >
        Ingatan pasar.
      </div>
    </SafeArea>
  );
};
