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
const T = { texture: 0, line1: 36, line2: 155, rule: 419, caption: 558 };
// One frame per phrase: "apa yang sudah terjadi" / "pola yang sering
// berulang" / "posisi pembeli serta penjual saat ini".
const CHIP_AT = [225, 286, 330];
const CHIPS = ["Yang Sudah Terjadi", "Pola Berulang", "Posisi Saat Ini"];
const CHIP_Y = 636;
// ═══════════════════════════════════════════════════════════════════════════

export const Scene09 = () => {
  const f = useCurrentFrame();
  const texture = fadeIn(f, T.texture, 60) * 0.15;
  const dim = f >= T.rule ? progress(f, T.rule, 30) : 0;
  const rule = f >= T.rule ? progress(f, T.rule, 40) : 0;
  const cap = textReveal(f, T.caption);

  const chipXs = [560, 960, 1360];
  const ruleW = 900;

  return (
    <SafeArea>
      <CandlestickChart data={bmriDaily} window={WIN.sc01} box={CHART} showAxes={false} dimOpacity={texture} />

      <StatementText text="Bukan Prediksi." y={392} startFrame={T.line1} size={72} weight={700} color={theme.colors.slate} />
      <StatementText text="Probabilitas." y={496} startFrame={T.line2} size={96} weight={800} color={theme.colors.indigo} />

      {CHIPS.map((c, i) => (
        <Chip key={c} label={c} x={chipXs[i]} y={CHIP_Y} variant="indigo" anchor="center" startFrame={CHIP_AT[i]} opacity={1 - 0.45 * dim} />
      ))}

      {rule > 0.001 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          <line
            x1={960 - ruleW / 2}
            y1={CHIP_Y + 54}
            x2={960 - ruleW / 2 + ruleW * rule}
            y2={CHIP_Y + 54}
            stroke={theme.colors.slate}
            strokeWidth={theme.stroke.hair}
            opacity={0.6}
          />
        </svg>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 760,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.ink,
          opacity: cap.opacity,
          transform: `translateY(${cap.y}px)`,
        }}
      >
        Informasi &gt; Harapan
      </div>
    </SafeArea>
  );
};
