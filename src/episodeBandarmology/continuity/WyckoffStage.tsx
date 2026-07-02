/**
 * WyckoffStage — Scenes 5→10 as ONE continuous candlestick chart (mounted once
 * at comp frame 1055, dur 1427; never remounts). Owns the OHLC series drawing
 * across Accumulation → Markup → Distribution → Markdown, the synced volume +
 * cyan broker-net-buy overlay, the four phase bands/chips, and the Scene-10
 * zones. Local frame = comp frame − 1055.
 *
 * Phase → local-frame map (§3.1): setup 0–223 · Accumulation 228–538 ·
 * Markup 550–689 · Distribution 704–905 · Markdown 914–1107 · Scene 10 1122–1427.
 * Candle bodies/wicks carry green/red; everything else brand/neutral. Volume
 * spikes on markdown down-candles are red (mirrors candle direction). No
 * buy/sell arrows (compliance).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip, CandlestickChart, Callout } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal, genCandles } from "../helpers";

const { colors, font, type, radius } = theme;

const CX = 150;
const CY = 312;
const CW = 1620;
const CH = 520;
const N = 64;

// price path (normalised close levels) across the four phases
const LEVELS = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  if (x < 0.3) {
    const dip = Math.sin((x / 0.3) * Math.PI) * 0.06; // shakeout dip
    return 0.32 - (x < 0.16 ? dip : dip * 0.2);
  }
  if (x < 0.55) {
    const t = (x - 0.3) / 0.25;
    return 0.3 + t * t * (3 - 2 * t) * (0.8 - 0.3);
  }
  if (x < 0.78) return 0.8;
  const t = (x - 0.78) / 0.22;
  return 0.8 - t * t * (3 - 2 * t) * (0.8 - 0.32);
});
const CANDLES = genCandles(LEVELS, 424242);

// synced volume + colors (markdown down-candles red, else neutral)
const VOLUME = CANDLES.map((cd, i) => {
  const x = i / (N - 1);
  if (x < 0.3) return 0.22 + (Math.abs(x - 0.12) < 0.03 ? 0.4 : 0);
  if (x < 0.55) return 0.5;
  if (x < 0.78) return 0.42;
  return 0.6 + (x - 0.78) * 1.4;
});
const VOL_COLORS = CANDLES.map((cd, i) => (i / (N - 1) >= 0.78 && cd.c < cd.o ? "red" : "slate")) as ("red" | "slate")[];

// cumulative broker net-buy, normalised to [0,1] for the sub-panel overlay
const NETBUY = (() => {
  let v = 0.5;
  return CANDLES.map((_, i) => {
    const x = i / (N - 1);
    if (x < 0.55) v += 0.012; // accumulation + markup: rising
    else v -= 0.014; // distribution + markdown: falling (flips negative)
    return Math.max(0.05, Math.min(0.95, v));
  });
})();

const PHASES = [
  { n: 1, label: "Accumulation", x0: 0, x1: 0.3, onAt: 228, offAt: 560 },
  { n: 2, label: "Markup", x0: 0.3, x1: 0.55, onAt: 550, offAt: 714 },
  { n: 3, label: "Distribution", x0: 0.55, x1: 0.78, onAt: 704, offAt: 924 },
  { n: 4, label: "Markdown", x0: 0.78, x1: 1, onAt: 914, offAt: 1122 },
];

const progressAt = (f: number) => {
  if (f < 228) return 0;
  if (f < 538) return ((f - 228) / 310) * 0.3;
  if (f < 550) return 0.3;
  if (f < 689) return 0.3 + ((f - 550) / 139) * 0.25;
  if (f < 704) return 0.55;
  if (f < 905) return 0.55 + ((f - 704) / 201) * 0.23;
  if (f < 914) return 0.78;
  if (f < 1107) return 0.78 + ((f - 914) / 193) * 0.22;
  return 1;
};

export const WyckoffStage = () => {
  const frame = useCurrentFrame();
  const progress = progressAt(frame);
  const shown = Math.ceil(progress * N);
  const baselineOp = fadeIn(frame, 10, 26);

  // net-buy overlay geometry (in the volume sub-panel)
  const priceH = CH * 0.72;
  const volTop = CH * 0.78;
  const volH = CH * 0.22;
  const nbPath = NETBUY.slice(0, shown)
    .map((v, i) => {
      const x = (i + 0.5) * (CW / N);
      const y = volTop + (1 - v) * volH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <SafeArea>
      {/* header */}
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, textAlign: "center", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(frame, 20, 18) }}>
        Wyckoff — Four Phases
      </div>

      {/* phase chips */}
      <div style={{ position: "absolute", left: CX, top: 230, width: CW, display: "flex", gap: 16 }}>
        {PHASES.map((p) => {
          const on = frame >= p.onAt && frame < p.offAt;
          return (
            <div key={p.n} style={{ flex: p.x1 - p.x0, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, height: 52, borderRadius: radius.pill, background: on ? colors.indigo : colors.cardWhite, border: `2px solid ${on ? colors.indigo : colors.divider}`, color: on ? colors.white : colors.slateMute, fontSize: type.chip, fontWeight: font.weights.bold, opacity: fadeIn(frame, 60, 20) }}>
              <span style={{ fontWeight: font.weights.extrabold }}>{p.n}</span>
              {p.label}
            </div>
          );
        })}
      </div>

      {/* chart container */}
      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH }}>
        {/* phase dividers */}
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: baselineOp }}>
          {[0.3, 0.55, 0.78].map((x) => (
            <line key={x} x1={x * CW} y1={0} x2={x * CW} y2={priceH} stroke={colors.divider} strokeWidth={2} strokeDasharray="6 8" />
          ))}
        </svg>

        <CandlestickChart
          width={CW}
          height={CH}
          candles={CANDLES}
          progress={progress}
          volume={VOLUME}
          volumeColors={VOL_COLORS}
          refLines={frame >= 550 ? [{ y: 0.3, label: "Avg Cost ≈ Rp 1,180" }] : []}
          bands={frame >= 1122 ? [{ x0: 0.24, x1: 0.34, label: "Late accumulation, as price begins to move" }, { x0: 0.68, x1: 0.78, label: "Before distribution turns to markdown" }] : []}
        />

        {/* cyan net-buy overlay in the volume sub-panel */}
        {shown > 1 && (
          <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={nbPath} fill="none" stroke={colors.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}

      </div>

      {/* segment labels (below the volume sub-panel) */}
      <div style={{ position: "absolute", left: CX, top: CY + CH + 16, width: CW, display: "flex", opacity: baselineOp }}>
        {PHASES.map((p) => (
          <div key={p.n} style={{ flex: p.x1 - p.x0, textAlign: "center", fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>
            {p.label}
          </div>
        ))}
      </div>

      {/* phase annotations */}
      {frame >= 300 && frame < 560 && <Chip label="Shakeout" variant="cyan" left={CX + 0.1 * CW} top={CY + 250} delay={300} />}
      {frame >= 600 && frame < 714 && (
        <Callout ax={CX + 0.46 * CW} ay={CY + 0.22 * priceH} dx={60} dy={-40} width={420} body="+24% above avg cost." op={fadeIn(frame, 600, 16)} variant="indigo" />
      )}
      {frame >= 740 && frame < 924 && <Chip label="Broker 01: Net −2.1 M lot" variant="outline" left={CX + 0.56 * CW} top={CY + 60} delay={740} />}
      {frame >= 950 && frame < 1122 && <Chip label="Sell Vol 8.4 M > Buy Vol 3.1 M" variant="cyan" left={CX + 0.78 * CW - 40} top={CY + 80} delay={950} />}
      {frame >= 1122 && <Chip label="A zone of interest, not a signal." variant="outline" left={CX} top={CY + CH + 70} delay={1122} />}
    </SafeArea>
  );
};
