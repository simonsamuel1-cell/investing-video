/**
 * SC09 — Probability, Not Prediction (from 5192, dur 754) — INDEPENDENT.
 * The chart drops to texture; the statement resolves in two lines, then the
 * three things a chart can actually show, then the honest limit.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart } from "../components/CandlestickChart";
import { StatementText } from "../components/StatementText";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, textReveal, type Box } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const CHART: Box = { x: 200, y: 240, w: 1520, h: 560 };
const T = {
  texture: 0, // "Jadi, anggap"
  prob: 36, // "alat membaca probabilitas" — the headline lands first
  notPred: 155, // "bukan alat meramal masa depan"
  future: 419, // "tidak menjamin apa yang terjadi berikutnya"
  dim: 503, // "tidak ada alat yang bisa"
  lift: 558, // "chart memberimu keunggulan"
  info: 623, // "keputusan dengan informasi"
  hope: 673, // "bukan sekadar harapan atau tebakan"
};
// One frame per phrase: "apa yang sudah terjadi" / "pola yang sering
// berulang" / "posisi pembeli serta penjual saat ini".
const CHIP_AT = [225, 286, 330];
const CHIPS = ["Yang Sudah Terjadi", "Pola Berulang", "Posisi Saat Ini"];
const CHIP_Y = 636;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene09 = () => {
  const f = useCurrentFrame();
  const texture = fadeIn(f, T.texture, 60) * 0.15;
  const dim = f >= T.dim ? progress(f, T.dim, 30) : 0;
  const rule = f >= T.dim ? progress(f, T.dim, 40) : 0;
  const future = f >= T.future ? progress(f, T.future, 34) : 0;
  const lift = f >= T.lift ? progress(f, T.lift, 26) : 0;
  const info = textReveal(f, T.info);
  const hope = textReveal(f, T.hope);
  // the chips are read off the chart, so it brightens a step behind them
  const texturePlus = texture * (1 + 0.9 * (f >= CHIP_AT[2] ? progress(f, CHIP_AT[2], 26) : 0));

  const chipXs = [560, 960, 1360];
  const ruleW = 900;

  return (
    <SafeArea>
      <CandlestickChart data={bmriDaily} window={WIN.sc01} box={CHART} showAxes={false} dimOpacity={texturePlus} />

      {/* what comes next is left blank — no projected path, ever */}
      {future > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: CHART.x + CHART.w * 0.82,
            top: CHART.y,
            width: CHART.w * 0.18 + 40,
            height: CHART.h,
            background: theme.colors.bg,
            opacity: 0.92 * future,
          }}
        />
      )}

      {/* the headline the VO leads with, then the correction above it */}
      <StatementText text="Bukan Prediksi." y={392} startFrame={T.notPred} size={72} weight={700} color={theme.colors.slate} />
      <StatementText text="Probabilitas." y={496} startFrame={T.prob} size={96} weight={800} color={theme.colors.indigo} />

      {CHIPS.map((c, i) => (
        <Chip key={c} label={c} x={chipXs[i]} y={CHIP_Y - 10 * lift} variant="indigo" anchor="center" startFrame={CHIP_AT[i]} opacity={1 - 0.45 * dim} />
      ))}

      {rule > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={960 - ruleW / 2}
            y1={CHIP_Y + 54}
            x2={960 - ruleW / 2 + ruleW * rule}
            y2={CHIP_Y + 54}
            stroke={lift > 0.5 ? theme.colors.indigo : theme.colors.slate}
            strokeWidth={theme.stroke.hair}
            opacity={0.6 + 0.4 * lift}
          />
        </svg>
      )}

      {/* what the chart actually buys you, set against what it replaces */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 772,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.indigo,
          opacity: info.opacity,
          transform: `translateY(${info.y}px)`,
        }}
      >
        Informasi
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 840,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.label.size,
          fontWeight: theme.type.label.weight,
          color: theme.colors.slate,
          opacity: hope.opacity * 0.75,
          transform: `translateY(${hope.y}px)`,
          textDecoration: "line-through",
          textDecorationThickness: `${theme.stroke.hair}px`,
        }}
      >
        Harapan · Tebakan
      </div>
    </SafeArea>
  );
};
