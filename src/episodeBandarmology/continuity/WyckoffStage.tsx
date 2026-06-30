/**
 * WyckoffStage — Scenes 5→10 rendered as ONE continuous element (mounted once at
 * comp frame 1055, dur 1427; never remounts). It owns the four-phase baseline,
 * the single continuous indigo price line that draws across
 * Accumulation → Markup → Distribution → Markdown, the phase chips, the
 * accumulation bars, the distribution token-transfer, and the Scene-10 highlight
 * bands. Local frame = comp frame − 1055.
 *
 * Phase → local-frame map (§3.1):
 *   Scene 5  header + baseline reveal  local   0–228
 *   Accumulation                       local 228–538   (x 0.00–0.30)
 *   Markup                             local 550–689   (x 0.30–0.55)
 *   Distribution                       local 704–905   (x 0.55–0.78)
 *   Markdown                           local 914–1107  (x 0.78–1.00)
 *   Scene 10 bands + chip              local 1122–1427
 *
 * No green/red, no buy/sell arrows, no "BUY HERE" label (compliance).
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea, Chip, SchematicChart } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal, mulberry32, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

// Chart placement (absolute px in the 1920×1080 frame).
const CX = 210;
const CY = 322;
const CW = 1500;
const CH = 452;

// Build the continuous four-phase price curve (normalised, deterministic noise).
const buildCurve = () => {
  const rng = mulberry32(20240601);
  const N = 140;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const noise = (rng() - 0.5) * 0.03;
    let y: number;
    if (x < 0.3) {
      // accumulation — low, a dip near x0.10 then flat
      const dip = Math.sin((x / 0.3) * Math.PI) * 0.04;
      y = 0.28 - dip * (x < 0.15 ? 1 : 0.2) + noise;
    } else if (x < 0.55) {
      // markup — rise
      const t = (x - 0.3) / 0.25;
      const e = t * t * (3 - 2 * t); // smoothstep
      y = 0.27 + e * (0.8 - 0.27) + noise * 0.6;
    } else if (x < 0.78) {
      // distribution — choppy plateau near the top
      y = 0.8 + noise * 1.2;
    } else {
      // markdown — roll over and decline (indigo/slate, NOT red)
      const t = (x - 0.78) / 0.22;
      const e = t * t * (3 - 2 * t);
      y = 0.8 - e * (0.8 - 0.3) + noise * 0.6;
    }
    pts.push({ x, y: Math.max(0.05, Math.min(0.95, y)) });
  }
  return pts;
};

const CURVE = buildCurve();

const PHASES = [
  { n: 1, label: "Accumulation", x0: 0.0, x1: 0.3, onAt: 228, offAt: 560 },
  { n: 2, label: "Markup", x0: 0.3, x1: 0.55, onAt: 550, offAt: 714 },
  { n: 3, label: "Distribution", x0: 0.55, x1: 0.78, onAt: 704, offAt: 924 },
  { n: 4, label: "Markdown", x0: 0.78, x1: 1.0, onAt: 914, offAt: 1122 },
] as const;

export const WyckoffStage = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Price-line draw-in progress mapped through the phase windows (cumulative x).
  const progress = (() => {
    const f = frame;
    if (f < 228) return 0;
    if (f < 538) return ((f - 228) / (538 - 228)) * 0.3;
    if (f < 550) return 0.3;
    if (f < 689) return 0.3 + ((f - 550) / (689 - 550)) * 0.25;
    if (f < 704) return 0.55;
    if (f < 905) return 0.55 + ((f - 704) / (905 - 704)) * 0.23;
    if (f < 914) return 0.78;
    if (f < 1107) return 0.78 + ((f - 914) / (1107 - 914)) * 0.22;
    return 1;
  })();

  const baselineOp = fadeIn(frame, 10, 26);
  const headerStyle = textReveal(frame, 20, 18);

  // accumulation bars reveal
  const accProg = tween(frame, [228, 538], [0, 1]);
  // markup dashed reference line
  const refOp = fadeIn(frame, 560, 16);
  // distribution token transfer
  const tokenProg = tween(frame, [704, 905], [0, 1]);
  // scene 10 bands + chip
  const bandsOp = fadeIn(frame, 1122, 24);

  const accY = (1 - 0.28) * CH; // accumulation reference y in px (top-origin)

  return (
    <SafeArea>
      {/* Header (kept within x ≤ 1368 to clear the logo zone) */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 96,
          width: 1272,
          textAlign: "center",
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          color: colors.text,
          ...headerStyle,
        }}
      >
        Wyckoff — Four Phases
      </div>

      {/* Phase chips row */}
      <div style={{ position: "absolute", left: CX, top: 232, width: CW, display: "flex", gap: 18 }}>
        {PHASES.map((p) => {
          const on = frame >= p.onAt && frame < p.offAt;
          return (
            <div
              key={p.n}
              style={{
                flex: p.x1 - p.x0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                height: 56,
                borderRadius: radius.pill,
                background: on ? colors.indigo : colors.white,
                border: `2px solid ${on ? colors.indigo : colors.divider}`,
                color: on ? colors.white : colors.slateMute,
                fontSize: type.chip,
                fontWeight: font.weights.bold,
                opacity: fadeIn(frame, 60, 20),
              }}
            >
              <span style={{ fontWeight: font.weights.extrabold }}>{p.n}</span>
              {p.label}
            </div>
          );
        })}
      </div>

      {/* Chart area */}
      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        {/* baseline axis + phase dividers */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, opacity: baselineOp, overflow: "visible" }}>
          <line x1={0} y1={CH} x2={CW} y2={CH} stroke={colors.slateFaint} strokeWidth={2} />
          {[0.3, 0.55, 0.78].map((x) => (
            <line key={x} x1={x * CW} y1={0} x2={x * CW} y2={CH} stroke={colors.divider} strokeWidth={2} strokeDasharray="6 8" />
          ))}
        </svg>

        {/* accumulation bars (indigo, stack below the line) */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const t = i / 11;
            const bx = t * 0.3 * CW;
            const reveal = Math.max(0, Math.min(1, accProg * 12 - i));
            const bh = (10 + (i % 4) * 8) * reveal;
            return <rect key={i} x={bx} y={accY - bh} width={18} height={bh} rx={2} fill={colors.indigo} opacity={0.55} />;
          })}
        </svg>

        {/* markup dashed reference line marking the accumulation zone */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, opacity: refOp, overflow: "visible" }}>
          <line x1={0} y1={accY} x2={0.55 * CW} y2={accY} stroke={colors.indigoDeep} strokeWidth={2} strokeDasharray="10 8" />
          <text x={8} y={accY - 12} fill={colors.indigoDeep} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>
            Accumulation Zone
          </text>
        </svg>

        {/* Scene-10 neutral highlight bands */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, opacity: bandsOp, overflow: "visible" }}>
          <rect x={0.25 * CW} y={0} width={0.1 * CW} height={CH} fill={colors.indigoTint} />
          <rect x={0.7 * CW} y={0} width={0.1 * CW} height={CH} fill={colors.indigoTint} />
          <text x={0.3 * CW} y={-14} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>
            End Of Accumulation / Start Of Markup
          </text>
          <text x={0.75 * CW} y={-14} textAnchor="middle" fill={colors.slate} fontSize={type.chip} fontWeight={font.weights.bold} fontFamily={font.family}>
            Before Markdown
          </text>
        </svg>

        {/* the continuous price line */}
        <SchematicChart width={CW} height={CH} points={CURVE} progress={progress} strokeWidth={3} />

        {/* distribution token transfer (big player → latecomers) */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const local = Math.max(0, Math.min(1, tokenProg * 5 - i));
            const pop = popIn(frame, fps, 704 + i * 30, true);
            const sx = 0.6 * CW;
            const ex = 0.74 * CW;
            const sy = (1 - 0.82) * CH;
            const ey = (1 - 0.74) * CH;
            const cx = sx + (ex - sx) * local;
            const cyy = sy + (ey - sy) * local;
            return <circle key={i} cx={cx} cy={cyy} r={9 * Math.min(1, pop)} fill={colors.cyan} opacity={local > 0 ? 0.9 : 0} />;
          })}
        </svg>
      </div>

      {/* segment labels under the axis */}
      <div style={{ position: "absolute", left: CX, top: CY + CH + 22, width: CW, display: "flex", opacity: baselineOp }}>
        {PHASES.map((p) => (
          <div
            key={p.n}
            style={{
              flex: p.x1 - p.x0,
              textAlign: "center",
              fontSize: type.descriptor,
              fontWeight: font.weights.bold,
              color: colors.slate,
            }}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* Scene-10 reminder chip */}
      {frame >= 1122 && (
        <Chip label="Clues, Not Promises" variant="outline" left={CX} top={CY + CH + 96} delay={1122} />
      )}
    </SafeArea>
  );
};
