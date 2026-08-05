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
import { progress, textReveal, type Box } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const CHART: Box = { x: 200, y: 240, w: 1520, h: 560 };
// ── HANDOFF from SC08 ───────────────────────────────────────────────────────
// At global 5191 the only thing on screen is SC08's candle series: BMRI daily
// over WIN.sc08, in this box, at full opacity. This scene opens by drawing
// exactly that, then eases it into its own framing and down to texture. Match
// these to SC08's CHART and window or the seam will show.
const HANDOFF_BOX: Box = { x: 200, y: 230, w: 1500, h: 590 };
const HANDOFF_WIN = WIN.sc08;
const TEXTURE = 0.15;
// The statement lines and the three chips are one block, lifted to just under
// the safe-top margin and then dropped 30px. GROUP_TOP is that block's topmost
// pixel as laid out below: "Probabilitas." centre-y 392 minus half its 96px line.
const GROUP_TOP = 344;
const BLOCK_DROP = 30;
// "Informasi" / "Harapan · Tebakan" sit BELOW the chart, so they are not part
// of that block — chart bottom is CHART.y + CHART.h = 800.
const INFO_TOP = 826;
const HOPE_TOP = 890;
const T = {
  texture: 0, // "Jadi, anggap"
  carryDur: 50, // the carried series eases into this scene's framing
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
const CHIPS = ["yang sudah terjadi", "pola berulang", "posisi saat ini"];
const CHIP_Y = 636;
// The three labels are different lengths, so fixed centres give uneven gaps.
// These are their MEASURED rendered widths at 36px/600; the row is laid out
// from them so the gap between chips is exactly CHIP_GAP. Re-measure if a label
// or the chip type changes.
const CHIP_W = [358, 281, 270];
const CHIP_GAP = 20;
// ═══════════════════════════════════════════════════════════════════════════

/** Centre-x per chip, packed CHIP_GAP apart and centred on the canvas. */
const chipXs = (() => {
  const total = CHIP_W.reduce((a, b) => a + b, 0) + CHIP_GAP * (CHIP_W.length - 1);
  // rounded so every chip edge lands on a whole pixel — a fractional origin
  // makes the rendered gaps read 19/21 instead of 20/20
  let left = Math.round((theme.canvas.width - total) / 2);
  return CHIP_W.map((w) => {
    const cx = left + w / 2;
    left += w + CHIP_GAP;
    return cx;
  });
})();

const GROUP_DY = theme.layout.safeTop - GROUP_TOP + BLOCK_DROP;

export const Scene09 = () => {
  const f = useCurrentFrame();

  // the series carried over from SC08: eases into this scene's box and window
  // and settles down to texture
  const carry = progress(f, T.texture, T.carryDur);
  const lerp = (from: number, to: number) => from + (to - from) * carry;
  const box: Box = {
    x: lerp(HANDOFF_BOX.x, CHART.x),
    y: lerp(HANDOFF_BOX.y, CHART.y),
    w: lerp(HANDOFF_BOX.w, CHART.w),
    h: lerp(HANDOFF_BOX.h, CHART.h),
  };
  // both windows end on the same session, so only the left edge travels
  const win: [number, number] = [lerp(HANDOFF_WIN[0], WIN.sc01[0]), WIN.sc01[1]];
  const texture = lerp(1, TEXTURE);
  const dim = f >= T.dim ? progress(f, T.dim, 30) : 0;
  const rule = f >= T.dim ? progress(f, T.dim, 40) : 0;
  const future = f >= T.future ? progress(f, T.future, 34) : 0;
  const lift = f >= T.lift ? progress(f, T.lift, 26) : 0;
  const info = textReveal(f, T.info);
  const hope = textReveal(f, T.hope);
  // the chips are read off the chart, so it brightens a step behind them
  const texturePlus = texture * (1 + 0.9 * (f >= CHIP_AT[2] ? progress(f, CHIP_AT[2], 26) : 0));

  const ruleW = 900;

  return (
    <SafeArea>
      <CandlestickChart data={bmriDaily} window={win} box={box} showAxes={false} dimOpacity={texturePlus} />

      {/* what comes next is left blank — no projected path, ever */}
      {future > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: box.x + box.w * 0.82,
            top: box.y,
            width: box.w * 0.18 + 40,
            height: box.h,
            background: theme.colors.bg,
            opacity: 0.92 * future,
          }}
        />
      )}

      {/* The statement and the chips, as one block near the top.
          "Probabilitas." now leads and "Bukan Prediksi." sits under it. */}
      <div style={{ transform: `translateY(${GROUP_DY}px)` }}>
      <StatementText text="Probabilitas." y={392} startFrame={T.prob} size={96} weight={800} color={theme.colors.indigo} />
      <StatementText text="Bukan prediksi." y={496} startFrame={T.notPred} size={60} weight={700} color={theme.colors.slate} />

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
      </div>

      {/* what the chart actually buys you, set against what it replaces —
          below the chart, not part of the block above */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: INFO_TOP,
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
          top: HOPE_TOP,
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
